///<reference lib="es2015.symbol" />
///<reference lib="es2015.symbol.wellknown" />
///<reference lib="es2015.collection" />
///<reference lib="es2015.iterable" />
declare const console:any;
declare const setInterval:any;

import { getUserData } from "@decentraland/Identity";
import { getCurrentRealm } from "@decentraland/EnvironmentAPI";
import { getParcel } from '@decentraland/ParcelIdentity';
import {createVoxter} from './voxter/voxter';
import { decode } from "./lib/decoder";

import { Client } from "colyseus.js";

export const initializeVoxtersPet = async () => {
    const user =  await getUserData();    
    const realm = (await getCurrentRealm())?.displayName;
    const {cid, land} = await getParcel();
    const {sceneJsonData} = land;
    
    const PROD = true;//!~(realm||'').indexOf(`localhost`);
    const WS_HOST = PROD?`wss://mana-fever.com/voxters-pet/`:`ws://localhost:8090/voxters-pet`;

    const client = new Client(`${WS_HOST}`);
    const room:any = await client.joinOrCreate('voxters-lobby',{
        realm,
        user,
        land:sceneJsonData.scene.base
    });

    type VoxterRepresentation = {
        playerPosition:Vector3,
        voxter:any
    };
    const voxters:{[key:string]:VoxterRepresentation} = {};

    room.onMessage('hasVoxter', (tokenId:number) => {
        let lastPosition = {x:1,y:1,z:1};  
        setInterval(()=>{
            //TODO only if position has changed since last time
            if(!equalPositions(lastPosition, serializeAndFloorVector3(Camera.instance.position))){
                lastPosition = serializeAndFloorVector3(Camera.instance.position);
                room.send(1, lastPosition);
            }
            
        },1000);        
    });

    room.state.supporters.onAdd = (supporter:any, key:string) => {
        const {playerPosition, tokenId, name} = supporter.toJSON();
        
        const {x,y,z} = playerPosition;
        const properties:any[4] = decode(tokenId, [64,64,7,9]);
        
        voxters[key] = {
            playerPosition:new Vector3(x,y,z),
            // @ts-ignore
            voxter:createVoxter(name, x,y,z, ...properties)
        };
        supporter.playerPosition.onChange = (changes:any[]) => {
            const newPosition = changes.reduce((acc, current)=>{
                acc[current.field] = current.value;
                return acc;
            },{});
            (<any>Object).assign(voxters[key].playerPosition, newPosition);  
        }
    }

    room.state.supporters.onRemove = (supporter:any, key:string) => {
        voxters[key].voxter.dispose();
        delete voxters[key];
    }
    const minDistance = 1;
    let counter = 0;
    const update = (dt:any)=>{
        counter += dt;
        (<any>Object).values(voxters).forEach((voxter:VoxterRepresentation)=>{
            const {x,y,z} = voxter.playerPosition;
            const playerPosition = new Vector3(x,y+0.75,z);
            const voxterTransform = voxter.voxter.getEntity().getComponent(Transform);            
            const moveDirection = playerPosition.subtract(voxterTransform.position).normalize().multiplyByFloats(2*dt,2*dt,2*dt);            
            const yDisplacement = new Vector3(0,Math.cos(counter*3)*0.01,0);
            const nextPosition = voxterTransform.position.add(moveDirection).add(yDisplacement);

            if(distance(nextPosition, playerPosition) > minDistance){
                voxter.voxter.setPosition(nextPosition);
            }else{
                voxter.voxter.setPosition(voxterTransform.position.add(yDisplacement))
            }            

            voxterTransform.rotation = Quaternion.Slerp(
                voxterTransform.rotation,
                Quaternion.LookRotation(playerPosition.subtract(voxterTransform.position)),
                dt * 2
            );            
        });

        function distance(pos1:Vector3, pos2:Vector3){
            const a = pos1.x - pos2.x;
            const b = pos2.z - pos2.z;
            return a*a-b*b;
        }
    }
    engine.addSystem(new UpdateSystem(update));
}

class UpdateSystem implements ISystem {
    private callback;
    constructor(callback:any){
        this.callback = callback;
        engine.addSystem(this);
    }
    update(dt:number){
        this.callback(dt);
    }
    dispose(){
        this.callback = null;
        engine.removeSystem(this);
    }
}

function serializeAndFloorVector3(vector:Vector3){
   return {
        x:Math.floor(vector.x),
        y:Math.floor(vector.y),
        z:Math.floor(vector.z)
    };
}

function equalPositions(a:any, b:any){
    return a.x === b.x && a.z === b.z && a.y === b.y;
}
