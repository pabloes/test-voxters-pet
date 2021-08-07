export const propertySizes = [64, 64, 7, 9];
//export const propertySizes = [8, 8, 7, 3];
export const properties  = [
    "eye", "mouth", "eye_color", "head", 
  /*   "neck", "ears", "nose", "eyebrowns", "tattoo",
    "arms", "legs" */
];

export const authors = [
    "mana-fever.com",
    "dapp-craft.com"
];

export enum COLOR {
    RED,    
    PINK,
    YELLOW,
    WHITE,
    GREEN,
    TURQUOISE,
    BLUE
};

export function decode(dna:number, propertySizes:number[]){
    const results = [];
    
    let i = 0;
    let factor = 1;
    while(i < propertySizes.length){
        results.push( Math.floor(dna/factor)%propertySizes[i] );
        factor = factor * propertySizes[i];

        i++;
    }

    return results;
}

export function maximumNumber(propertySizes:number[]){
    let i = 0;
    let factor = 1;
    while(i < propertySizes.length){        
        factor *= propertySizes[i];
        i++
    }
    return factor-1;
}

export function getDna({eyeIndex, mouthIndex, eyeColorIndex, headIndex}:any){
    return encode(propertySizes, [eyeIndex, mouthIndex, eyeColorIndex, headIndex])
}

export function encode(propertySizes:number[], propertyValues:number[]){
    let i = 0;
    let dna = 0;
    let factor = 1;
    while(i < propertySizes.length){        
        dna = dna + ( propertyValues[i] * factor );
        factor *= propertySizes[i];

        i++;
    }
    return dna;
}

export function getEncoder(properties:any, propertySizes:number[]){
    return function(dna:number){
        const decoded = decode(dna, propertySizes);
        return properties.reduce((acc:any, current:any, index:number)=>{
            acc[current] = decoded[index];
            return acc;
        },{});
    }
}

export function getMetadataFromDna(dna:number){
    const [eyeIndex, mouthIndex, eyeColorIndex, headIndex] = decode(dna, propertySizes);
    return getMetadataFromIndexes({eyeIndex, mouthIndex, eyeColorIndex, headIndex});
}

export function getMetadataFromIndexes({eyeIndex, mouthIndex, eyeColorIndex, headIndex}:any){
    const dna = getDna({eyeIndex, mouthIndex, eyeColorIndex, headIndex});
    const colorNames = [
        "Red", "Pink", "Yellow", "White", "Green", "Turquoise", "Blue"
    ];
    const data = {
        "name":`Voxter ${dna}`,
        "description":"Voxter creature of the metaverse",    
        "image":`https://mana-fever.com/voxters/v1/image/${dna}_350.png`,
        "attributes":[
            {
                "trait_type":"Eyes",
                "display_type":"number",
                "value":eyeIndex
            },
            {
                "trait_type":"Eyes author",
                "value":getAuthor(eyeIndex)
            },
            {
                "trait_type":"Eyes color",
                "value":colorNames[eyeColorIndex]
            },
            {
                "trait_type":"Mouth",
                "value":mouthIndex
            },
            {
                "trait_type":"Mouth author",
                "value":getAuthor(mouthIndex)
            },
           
        ]
    };

    if(headIndex){
        data.attributes = data.attributes.concat([
            {
                "trait_type":"Head accessory",
                "value":headIndex
            },
            {
                "trait_type":"Head accessory author",
                "value":authors[headIndex]
            }
        ])
    }

    return data;

    function getAuthor(propertyIndex:number){
        return authors[Math.floor(propertyIndex/8)]
    }
}