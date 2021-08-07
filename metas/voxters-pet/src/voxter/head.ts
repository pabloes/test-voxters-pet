
export const createHead = (boxter:any, index:number) => {
    const state = {
        index
    };
    const shape:any = index && new GLTFShape(`models/accesories/acc${index}.glb`);
    const head = new Entity();
    head.addComponent(new Transform({
        position:new Vector3(0,0,0),
        rotation:Quaternion.Euler(0,180,0)
    }))
    if(index) head.addComponent(shape);
    head.setParent(boxter);

    return {
        applyIndex:(index:number)=>{
            if(index !== state.index){
                const shape = new GLTFShape(`models/accesories/acc${index}.glb`);
                head.addComponentOrReplace(shape);
            }            
        },
        getIndex:()=>state.index
    }
}