const pieceWise = (inputArray, newLength) => {
  const biteSize = (inputArray.length/newLength);
  let outputArray = [];
  for(let i = 0; i<newLength; i++){
    const x = i*biteSize;
    let coVal;
    if(Math.ceil(x)>=inputArray.length){
      coVal = 0;
    }else{
      coVal = Math.ceil(x);
    }
    const m = inputArray[coVal]-inputArray[Math.floor(x)];
    const b = inputArray[Math.floor(x)];
    outputArray.push(m*(x-Math.floor(x))+b);
  }
  return outputArray.map((x)=> parseFloat(x.toFixed(4)));
}

const makeSomeNoise = (randomArray) =>{
  const Phase1a = pieceWise(randomArray, randomArray.length/8);
  const Phase2a = pieceWise(randomArray, randomArray.length/4);
  const Phase3a = pieceWise(randomArray, randomArray.length/3);
  const Phase1b = pieceWise(Phase1a, randomArray.length);
  const Phase2b = pieceWise(Phase2a, randomArray.length);
  const Phase3b = pieceWise(Phase3a, randomArray.length);
  return Phase1b.map((p1, index)=>{
    return parseFloat((p1+(Phase2b[index]*.25)+(Phase3b[index]*.125)+(randomArray[index]*.05)).toFixed(4));
  }); 
}

const randArray = (length) => {
  let output = [0];
  for(let i = 0;i<length-2;i++){
    output.push(Math.floor(Math.random()*100));
  }
  output.push(0);
  return output;
}
const swapXY = (array) =>{
  let output = [];
  for(let i =0; i<array[0].length;i++){
    let segment=[];
    for(let j = 0; j<array.length; j++){
      segment.push(array[j][i])
    }
    output.push(segment);
  }
  return output;
}
//Original Base with not persistance horizonatally
// const noise2D = (x,y) =>{
//   let output=[];
//   for(let i = 0; i<x; i++){
//     output.push(makeSomeNoise(randArray(y)).map((v)=>parseFloat((v/175).toFixed(2))));
//   }
//   return output;
// }

// good persistance horizontally but poor range
// const noise2D = (x,y) =>{
//   let output=[];
//   for(let i = 0; i<x; i++){
//     output.push(makeSomeNoise(randArray(y)).map((v)=>parseFloat((v/175).toFixed(2))));
//   }
//   const squarePhase1 = swapXY(output);
//   const squarePhase2 = squarePhase1.map((subArray)=>makeSomeNoise(subArray));
//   const outputPlus = swapXY(squarePhase2);
//   return outputPlus;
// }


//poor range
const noise2D = (x,y) =>{
  let output=[];
  for(let i = 0; i<x; i++){
    output.push(makeSomeNoise(randArray(y)).map((v)=>parseFloat((v/175).toFixed(4))));
  }
  const squarePhase1 = swapXY(output);
  const squarePhase1Half = squarePhase1.map((subRay)=>{
    let output = [];
    for(let i =0; i<subRay.length;i++){
      output.push(subRay[i]/2);
    }
    return output;
  })
  const squarePhase2 = squarePhase1Half.map((subArray)=>makeSomeNoise(subArray));
  const outputPlus = swapXY(squarePhase2);
  return outputPlus;
}

// const noise2D = (x,y) =>{
//   let output=[];
//   for(let i = 0; i<x; i++){
//     output.push(makeSomeNoise(randArray(y)).map((v)=>parseFloat((v/175).toFixed(4))));
//   }
//   console.log(output);
//   const squarePhase1 = swapXY(output);
//   const squarePhase1Half = squarePhase1.map((subRay)=>{
//     let output = [];
//     for(let i =0; i<subRay.length;i++){
//       output.push(subRay[i]/2);
//     }
//     return output;
//   })
//   const squarePhase2 = squarePhase1Half.map((subArray)=>makeSomeNoise(subArray));
//   const outputPlus = swapXY(squarePhase2);
//   return outputPlus;
// }

//First Attempt, poort horizontal persistance
// const noise2D = (x,y) =>{
//   let output=[];
//   for(let i = 0; i<x; i++){
//     output.push(makeSomeNoise(randArray(y)).map((v)=>parseFloat((v/175).toFixed(2))));
//   }
//   const coNoise=(makeSomeNoise(randArray(x)).map((v)=>parseFloat((v/175).toFixed(2))));
//   const outputPlus = coNoise.map((cNoise,index)=>{
//     return output[index].map((noise)=>parseFloat(((2*noise)+(cNoise))/3)-.09)
//   });
//   return outputPlus;
// }


//=========================================================================================
//This function increases the resolution of a map (kinda like the zoom and enhance crap they pull on law enforcement proceedurals)
//=========================================================================================
const enhance = (mapIn,x,y) =>{
  const phase1 = mapIn.map((line)=> pieceWise(line,y));
  const phase2 = swapXY(phase1);
  const phase3 = phase2.map((liney)=> pieceWise(liney,x));
  const output = swapXY(phase3);
  return output;
}


//=========================================================================================
//These functions will read the map and tell you if you're in a rain shadow or not
//=========================================================================================
const trailOffConstant = 0.0004;

const rainShadowsLeftToRight = (inputArray) =>{
  return inputArray.map((cell, index) => {
    if(index == 0){
      if(inputArray[inputArray.length-1].elevation>=cell.elevation+trailOffConstant){
        return true;
      }else{
        return false;
      }
    }else{
      if(inputArray[index-1].elevation>=cell.elevation+trailOffConstant){
        return true;
      }else{
        return false;
      }
    }
  });
}
const rainShadowsRightToLeft = (inputArray) =>{
  return inputArray.map((cell, index) => {
    if(index == inputArray.length-1){
      if(inputArray[0].elevation>=cell.elevation+trailOffConstant){
        return true;
      }else{
        return false;
      }
    }else{
      if(inputArray[index+1].elevation>=cell.elevation+trailOffConstant){
        return true;
      }else{
        return false;
      }
    }
  });
}

//==========================================================================================
//Assign wind direction returns 2d array of {elevation, windZone} objects
//==========================================================================================
const callTheWind = (inputArray) =>{
  return inputArray.map((latitude, index)=>{
    const windZone = Math.floor(index/(inputArray.length/6));
    return latitude.map((cell)=>{
      return {elevation:cell, windZone:windZone};
    })
  })
}

//==========================================================================================
//Add precipitation
//==========================================================================================
const blessTheRains = (inputArray)=>{
  console.log(inputArray);
  const p = pieceWise([0,1,0,1,0,1,0],inputArray.length);
  return inputArray.map((lat,index)=>{
    const precip = p[index];
    return lat.map((cell)=>{
      return {...cell, precipitation: precip};
    });
  });
}

//==========================================================================================
//Add Temperature
//==========================================================================================
const bringTheHeat = (inputArray)=>{
  const tstep = 1/(inputArray.length/2);
  return inputArray.map((lat, index)=>{
    const temp = tstep*(inputArray.length-Math.abs((inputArray.length/2)-index));
    return lat.map((cell)=>{
      return {...cell, temperature: temp};
    });
  });
}

//==========================================================================================
//Apply Rain Shadows
//==========================================================================================
const applyRainShadows = (inputArray) =>{
  console.log(inputArray);
  return inputArray.map((lat)=>{
    const shade = (lat[0].windZone == 0)? rainShadowsLeftToRight(lat):rainShadowsRightToLeft(lat);
    console.log(lat);
    console.log(shade);
    return lat.map((cell, index)=>{
      if(shade[index]){
        const average = cell.precipitation/3;
        return {...cell,precipitation:average};
      }else{
        const average = (cell.precipitation+2)/3;
        return {...cell};
      }
    });
  });
}

//==========================================================================================
// Drawing things to the screen
//==========================================================================================
const home = document.getElementById('container')
home.style.boxSizing= 'border-box';
const x = 500;
const y= 250;
const noiseConstants = [80,60];
home.style.height = 'fit-content';
let q;
if(window.innerWidth > window.innerHeight){
  q = (window.innerHeight*.8)/y;
}else{
  q = (window.innerWidth*0.7)/x;
}
document.querySelector('body').style.margin = '0';
home.style.border = 'solid black 2px';
home.style.width= 'fit-content';
home.style.padding= '0';
home.style.gridGap= '0';
const grid = enhance(noise2D(noiseConstants[0],noiseConstants[1]),x,y);
//testing factor adding functions
const gridPlus1 = callTheWind(swapXY(grid));
const gridPlus2 = blessTheRains(gridPlus1);
const gridPlus3 = bringTheHeat(gridPlus2);
const gridPlus4 = applyRainShadows(gridPlus3);
// console.log(gridPlus1);
// console.log(gridPlus2);
const gridPlus5=swapXY(gridPlus4);
console.log(gridPlus5);

// console.log(home);

home.style.display = 'grid';
home.style.gridTemplateColumns = 'repeat('+ x +', 1fr)';

for(let i =0; i<(x*y);i++){
  let formation = document.createElement('div');
  formation.id = i;
  formation.style.width = ''+q+'px';
  formation.style.height = ''+q+'px';
  //formation.style.border = 'solid black 1px';
  formation.style.border = 'none';
  home.style.margin= '0';
  home.append(formation);
}

//In this area you'll need to add an onclick property(all lowercase for onclick to the formation object that referres to a form that contains controlls for the style)
//On the form you will want to include
//  -color
//  -resource data
//  -encounter data

// const convertToRGB = (decimal) => Math.round(decimal*255);


//=========================================================================
//This code is here to apply colors to heights
//=========================================================================
const convertToRGB = (decimal) => {
  const bounds = [0.25,0.31,0.33,0.37,0.4,0.42,0.46];
  let output;
  if(decimal<bounds[0]){
    output = 'darkBlue'
  }else if(decimal>=bounds[0]&&decimal<bounds[1]){
    output = 'royalblue';
  }else if(decimal>=bounds[1]&&decimal<bounds[2]){
    output = 'bisque';
  }else if(decimal>=bounds[2]&&decimal<bounds[3]){
    output = 'yellowgreen';
  }else if(decimal>=bounds[3]&&decimal<bounds[4]){
    output = 'green';
  }else if(decimal>=bounds[4]&&decimal<bounds[5]){
    output = 'gray';
  }else if(decimal>=bounds[5]&&decimal<bounds[6]){
    output = 'darkgray';
  }else {
    output = 'mintcream';
  }
  return output;
};
//============================================================
//Updated for use with biome props
//============================================================
const convertObjectToRGB = (cell) => {
  const bounds = [0.25,0.31,0.33,0.37,0.4,0.42,0.46];
  const decimal =cell.elevation;
  let output;
  if(decimal<bounds[0]){
    output = 'darkBlue'
  }else if(decimal>=bounds[0]&&decimal<bounds[1]){
    output = 'royalblue';
  }else if(decimal>=bounds[1]&&decimal<bounds[2]){
    output = 'bisque';
  }else if(decimal>=bounds[2]&&decimal<bounds[3]){
    output = convertToBiome(cell,1);
  }else if(decimal>=bounds[3]&&decimal<bounds[4]){
    output = convertToBiome(cell,0);
  }else if(decimal>=bounds[4]&&decimal<bounds[5]){
    output = 'gray';
  }else if(decimal>=bounds[5]&&decimal<bounds[6]){
    output = 'darkgray';
  }else {
    output = 'mintcream';
  }
  return output;
};

//==========================================================================================
//Return a style object for a given cell
//==========================================================================================
const convertToBiome = (target,set)=>{
  const tempRanges = [0.4,0.5];
  const precipRanges = [0,0.4];
  var temp;
  var precip;

  const desert = 'bisque';
  const grassland = 'yellowgreen';
  const savanah = "#ADFF2F";
  const forrest = 'green';
  const tundra = 'aliceblue';
  const styleMatrix = [[
    //cold(dry,med,wet)
    [tundra,tundra,tundra],
    //ttemparate(dry,med,wet)
    [desert,grassland,forrest],
    //hot(dry,med,wet)
    [desert,savanah,forrest]
  ],
  [
    //cold(dry,med,wet)
    [tundra,tundra,tundra],
    //ttemparate(dry,med,wet)
    [desert,grassland,grassland],
    //hot(dry,med,wet)
    [desert,savanah,savanah]
  ]];

  if(target.temperature<=tempRanges[0]){
    temp=0;
  }else if(target.temperature>tempRanges[0]&&target.temperature<tempRanges[1]){
    temp=1;
  }else{
    temp=2;
  }

  if(target.precipitation <= precipRanges[0]){
    precip=0;
  }else if(target.precipitation>precipRanges[0]&&target.precipitation<precipRanges[1]){
    precip=1;
  }else{
    precip=2;
  }
  return styleMatrix[set][temp][precip];
}


//Original code for monochrome

// console.log(grid);
// // 0:0,1,2,3,4,5,6,7
// // 1:8,9,10,11,12,13,14
// for(let j=0;j<y;j++){
//   for(let k=0; k<x; k++){
//     const value = convertToRGB(grid[k][j]);
//     let focus = document.getElementById(((j*(x))+k));
//     focus.style.backgroundColor = 'rgb('+value+','+value+','+value+')';
//   }
// }
// 0:0,1,2,3,4,5,6,7
// 1:8,9,10,11,12,13,14

//======================================================================
//This stuff applies all the styles
//======================================================================
for(let j=0;j<y;j++){
  for(let k=0; k<x; k++){
    // const value = convertToRGB(grid[k][j]);
    const value = convertObjectToRGB(gridPlus5[k][j]);
    let focus = document.getElementById(((j*(x))+k));
    focus.style.backgroundColor = value+'';
  }
}
