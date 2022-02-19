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
  return outputArray.map((x)=> parseFloat(x.toFixed(2)));
}

const makeSomeNoise = (randomArray) =>{
  const Phase1a = pieceWise(randomArray, randomArray.length/8);
  const Phase2a = pieceWise(randomArray, randomArray.length/5);
  const Phase3a = pieceWise(randomArray, randomArray.length/3);
  const Phase1b = pieceWise(Phase1a, randomArray.length);
  const Phase2b = pieceWise(Phase2a, randomArray.length);
  const Phase3b = pieceWise(Phase3a, randomArray.length);
  return Phase1b.map((p1, index)=>{
    return parseFloat((p1+(Phase2b[index]*.4)+(Phase3b[index]*.2)+(randomArray[index]*.05)).toFixed(4));
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
const noise2D = (x,y) =>{
  let output=[];
  for(let i = 0; i<x; i++){
    output.push(makeSomeNoise(randArray(y)).map((v)=>parseFloat((v/175).toFixed(2))));
  }
  const squarePhase1 = swapXY(output);
  const squarePhase2 = squarePhase1.map((subArray)=>makeSomeNoise(subArray));
  const outputPlus = swapXY(squarePhase2);
  return outputPlus;
}


//poor range
// const noise2D = (x,y) =>{
//   let output=[];
//   for(let i = 0; i<x; i++){
//     output.push(makeSomeNoise(randArray(y)).map((v)=>parseFloat((v/175).toFixed(4))));
//   }
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


const home = document.getElementById('container')
home.style.boxSizing= 'border-box';
const x = 160;
const y= 80;
home.style.height = 'fit-content';
const q = (window.innerHeight*.8)/y;
home.style.border = 'solid black 1em';
home.style.width= 'fit-content';
home.style.padding= '0';
home.style.gridGap= '0';
const grid = noise2D(x,y);

console.log(home);

home.style.display = 'grid';
home.style.gridTemplateColumns = 'repeat('+ x +', 1fr)';

for(let i =0; i<(x*y);i++){
  let formation = document.createElement('div');
  formation.id = i;
  formation.style.width = ''+q+'px';
  formation.style.height = ''+q+'px';
  formation.style.border = 'solid black 1px';
  home.style.margin= '0';
  home.append(formation);
}

// const convertToRGB = (decimal) => Math.round(decimal*255);

const convertToRGB = (decimal) => {
  const bounds = [0.5,0.65,0.7,0.9,0.95];
  let output;
  if(decimal<bounds[0]){
    output = 'darkBlue'
  }else if(decimal>=bounds[0]&&decimal<bounds[1]){
    output = 'royalblue';
  }else if(decimal>=bounds[1]&&decimal<bounds[2]){
    output = 'bisque';
  }else if(decimal>=bounds[2]&&decimal<bounds[3]){
    output = 'forestgreen';
  }else if(decimal>=bounds[3]&&decimal<bounds[4]){
    output = 'gray';
  }else {
    output = 'mintcream';
  }
  return output;
};

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
console.log(grid);
// 0:0,1,2,3,4,5,6,7
// 1:8,9,10,11,12,13,14
for(let j=0;j<y;j++){
  for(let k=0; k<x; k++){
    const value = convertToRGB(grid[k][j]);
    let focus = document.getElementById(((j*(x))+k));
    focus.style.backgroundColor = value+'';
  }
}
