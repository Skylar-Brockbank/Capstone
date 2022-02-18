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