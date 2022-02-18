// function interpolate(ray, expandedNoise){
//   let output = [];
//   let bite = Math.round((expandedNoise-ray.length)/(ray.length-1));
//   for(let i = 0; i < ray.length-1; i++){
//     for(let j = 0; j<bite; j++){
//       output.push(Math.round(ray[i]+((ray[i+1]-ray[i])/(bite)*j)));
//     }
//   }
//   output.push(ray[ray.length-1]);
//   return output;
// };

// console.log(interpolate([0,10,12,32,14,25,0],100));
// console.log(interpolate([0,10,12,32,14,25,0],100).length);

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

console.log(pieceWise([0,10,12,32,14,25],100));
console.log(pieceWise([0,10,12,32,14,25],3));
console.log(pieceWise([0,10,12,32,14,25],5));

// const makeSomeNoise = (randomArray) =>{
//   const arr = pieceWise(randomArray, randomArray.length*12);

// }

const makeSomeNoise = (randomArray) =>{
  const Phase1a = pieceWise(randomArray, 3);
  const Phase2a = pieceWise(randomArray, 4);
  const Phase1b = pieceWise(Phase1a, randomArray.length);
  const Phase2b = pieceWise(Phase2a, randomArray.length);
  return Phase1b.map((p1, index)=>{
    return parseFloat((p1+(Phase2b[index]*.5)+(randomArray[index]*.25)).toFixed(2));
  }); 
}
console.log(makeSomeNoise([0,5,9,4,7,6,3,5,8,9,1]));

const randArray = (length) => {
  let output = [];
  for(let i = 0;i<length;i++){
    output.push(Math.floor(Math.random()*100));
  }
  return output;
}

console.log(randArray(10));
console.log(makeSomeNoise(randArray(20)));
console.log(makeSomeNoise(randArray(20)).map((v)=>parseFloat((v/175).toFixed(2))));