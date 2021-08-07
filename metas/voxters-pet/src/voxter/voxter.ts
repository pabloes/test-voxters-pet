import {createEyes} from './eyes';
import { createMouth } from "./mouth";
import {createHead} from "./head";
import {propertySizes, decode, properties, getEncoder, encode, maximumNumber } from '../lib/decoder';

const colors = [
    `#ff0000`,
    `#ff00ff`, 
    `#ffff00`,
    `#ffffff`,
    `#00ff00`,
    `#00ffff`,
    `#0000ff`,  
  ];

const texture = new Texture(`metas/voxters-pet/images/sprites2048.png`, {samplingMode:1, hasAlpha:true});
const skin = new Material();

export const createVoxter = (name:string, x:number, y:number, z:number, eyeIndex:number, mouthIndex:number, eyeColorIndex:number, headIndex:number) => {
    const callbacks = {
      onClick:null
    };
    const voxter = new Entity();   
    skin.albedoColor = new Color3(0,0,0);
    const boxterShape = new BoxShape();
    boxterShape.withCollisions = false;
    const label = new Entity();
    const labelText = new TextShape();
    label.addComponent(labelText);
    labelText.value = name;
    labelText.fontSize = 2;
    labelText.outlineColor = Color3.Black();
    labelText.outlineWidth = 0.2;
    labelText.font = new Font(Fonts.SanFrancisco_Heavy);
    labelText.billboard = true;
  
    labelText.color = Color3.FromHexString(colors[eyeColorIndex]);    
    label.setParent(voxter);
    label.addComponent(new Transform({position:new Vector3(0,1,0)}))
    voxter.addComponent(boxterShape);
    voxter.addComponent(skin);  
    
    const boxterTransform = new Transform({
      position:new Vector3(x,y,z),
      scale:new Vector3(0.5,0.5,0.5)
    });
    voxter.addComponent(boxterTransform);
    
    const eyes = createEyes(voxter, eyeIndex, colors[eyeColorIndex], texture);
    const mouth = createMouth(voxter, mouthIndex, `#ff00ff`, texture);
    const head = createHead(voxter, headIndex);
    
  /*   const dna = encode(
      [64,64,7,8],
      [eyeIndex,mouthIndex,eyeColorIndex,headIndex]
    );   */
  
    /* voxter.addComponent(new OnPointerDown(()=>{
       callbacks.onClick && callbacks.onClick();
    }));  */
    engine.addEntity(voxter);
    
    return {
      onClick:(fn:any)=>{
        callbacks.onClick = fn;
      },
      applyDna:(dna:any)=>{
        const [eyeIndex, mouthIndex, colorIndex, headIndex] = decode(dna, propertySizes);        
        eyes.applyIndex(eyeIndex);
        eyes.applyColor(colors[colorIndex]);
        mouth.applyIndex(mouthIndex);             
        head.applyIndex(headIndex);
      },
      getEntity:()=>voxter,
      setPosition:(position:Vector3)=>{
        voxter.getComponent(Transform).position.copyFrom(position)
      },
      dispose:()=>{
        voxter.setParent(null);
        engine.removeEntity(voxter);

      },
      lookAt:(target:Vector3)=>{
        voxter.getComponent(Transform).lookAt(target);
      },
      update:(dt:number)=>{

      }
    };
  };
