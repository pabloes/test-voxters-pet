const mat = new Material();
// mat.albedoColor = Color3.Yellow();
mat.specularIntensity = 0;
mat.roughness = 1;

mat.emissiveIntensity = 1.2;
mat.emissiveColor = new Color3(1,1,1); 

export const createMouth = (boxter:any, variationIndex:number, color:any, texture:any) => {
    if(!mat.albedoTexture){
      mat.albedoTexture = texture;
      mat.alphaTexture = texture;
      mat.emissiveTexture = texture;
    }

    const mouthShape = new PlaneShape();
    const mouth = new Entity();
    mouth.setParent(boxter);   
    mouthShape.withCollisions = false;

    mouthShape.uvs = getUvs(variationIndex+1);
   
    mouth.addComponent(mouthShape);
    mouth.addComponent(new Transform({
      position:new Vector3(0,-((1/3)/2), 0.5002), 
      scale:new Vector3(-1*(1-0.05),1*(2/3-0.05), -1)
    }));
   

    mouth.addComponent(mat);
    return {
      applyIndex:(variationIndex:number)=>{
        mouthShape.uvs = getUvs(variationIndex+1)
      }
    }
    function getUvs(variationIndex:number){
      let spriteCols = 8   // number of columns
      let spriteRows = 8   // number of rows
      let currentSpriteCell = variationIndex;   // starting position
  
      // Calculated variables
      let h2Fac = 63/128;
      let h1Fac = 55/128;
      let spriteCels = spriteCols * spriteRows;
      let colFactor = 1/spriteCols;
      let rowFactor = 1/spriteRows;
      let currRowStart = spriteRows - Math.floor((currentSpriteCell-1)/spriteCols) - h1Fac;
      let currColStart = ((currentSpriteCell-1) % spriteCols);
  
      const A = (currColStart) * (colFactor);
      const B = (currColStart+1) * (colFactor);
      const C = (currRowStart-1) * (rowFactor) + h2Fac*rowFactor;
      const D = (currRowStart) * (rowFactor) ;
  
      return [
        0,0,0,0,0,0,0,0,
  
        B, //b
        C, //c
        A, //a
        C, //c
  
        A, //a
        D, //d
        B, //b 
        D, //d
      ];
    }
}