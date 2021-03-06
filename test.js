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
  const Phase1a = pieceWise(randomArray, 3);
  const Phase2a = pieceWise(randomArray, 4);
  const Phase1b = pieceWise(Phase1a, randomArray.length);
  const Phase2b = pieceWise(Phase2a, randomArray.length);
  return Phase1b.map((p1, index)=>{
    return parseFloat((p1+(Phase2b[index]*.5)+(randomArray[index]*.25)).toFixed(2));
  }); 
}

const randArray = (length) => {
  let output = [];
  for(let i = 0;i<length;i++){
    output.push(Math.floor(Math.random()*100));
  }
  return output;
}

const noise2D = (x,y) =>{
  let output=[];
  for(let i = 0; i<x; i++){
    output.push(makeSomeNoise(randArray(y)).map((v)=>parseFloat((v/175).toFixed(2))));
  }
  return output;
}
