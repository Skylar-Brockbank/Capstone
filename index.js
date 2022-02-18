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


const home = document.getElementById('container')
home.style.boxSizing= 'border-box';
const x = 50;
const y= 40;
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

const convertToRGB = (decimal) => Math.round(decimal*255);
// 0:0,1,2,3,4,5,6,7
// 1:8,9,10,11,12,13,14
for(let j=0;j<y;j++){
  for(let k=0; k<x; k++){
    const value = convertToRGB(grid[k][j]);
    let focus = document.getElementById(((j*(x))+k));
    focus.style.backgroundColor = 'rgb('+value+','+value+','+value+')';
  }
}
