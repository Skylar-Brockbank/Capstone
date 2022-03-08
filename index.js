const brushSelector = document.getElementById('brushColor');
const gridLines = document.getElementById("gridLines");


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



//==========================================================================================
//Assign wind direction returns 2d array of {elevation, windZone} objects
//==========================================================================================
const callTheWind = (inputArray) =>{
  const pat = [0,1,0];
  return inputArray.map((latitude, index)=>{
    const windZone = Math.floor(index/(inputArray.length/6));
    return latitude.map((cell)=>{
      return {elevation:cell, windZone:pat[windZone%3]};
    })
  })
}

//==========================================================================================
//Add precipitation
//==========================================================================================
const blessTheRains = (inputArray)=>{
  const mess = inputArray[0].map(x => (Math.random()*8)-4);
  const messNoise = makeSomeNoise(mess);
  const p = pieceWise([0,1,0,1,1,0,1],inputArray.length);
  return inputArray.map((lat,index)=>{
    // const precip = p[index+mess[index]];
    return lat.map((cell,cindex)=>{
      return {...cell, precipitation: p[parseInt(index+messNoise[cindex])]};
    });
  });
}

//==========================================================================================
//Add Temperature
//==========================================================================================
const bringTheHeat = (inputArray)=>{
  return inputArray.map((lat, index)=>{
    const tstep = 1/((inputArray.length/2));
    const temp = tstep*((inputArray.length/2)-Math.abs((inputArray.length/2)-index));
    return lat.map((cell)=>{
      return {...cell, temperature: temp+(Math.random()/50)};
    });
  });
}

//=========================================================================================
//These functions will read the map and tell you if you're in a rain shadow or not
//=========================================================================================
const trailOffConstant = 0.001;

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

const inShadow = (inputArray,elevation,decayDistance) => {
  const direction = inputArray[0].windZone;
  return inputArray.map((cell,index)=>{
    if(direction === 0){
      for(let i = 0; i<decayDistance;i++){
        if(inputArray.at(index-i).elevation >= elevation){
          return true;
        }
      }
      return false;
    }else{
        for(let i = 0; i<decayDistance;i++){
          if(inputArray[(index+i)%(inputArray.length-1)].elevation >=elevation){
              return true;
            }
        }
        return false;
    }
  });
}
const reverseShadow = (inputArray,elevation,decayDistance) => {
  const direction = inputArray[0].windZone;
  return inputArray.map((cell,index)=>{
    if(direction === 1){
      for(let i = 0; i<decayDistance;i++){
        if(inputArray.at(index-i).elevation >= elevation){
          return true;
        }
      }
      return false;
    }else{
        for(let i = 0; i<decayDistance;i++){
          if(inputArray[(index+i)%(inputArray.length-1)].elevation >=elevation){
              return true;
            }
        }
        return false;
    }
  });
}



//==========================================================================================
//Apply Rain Shadows
//==========================================================================================
const applyRainShadows = (inputArray, elevation) =>{
  const decayDistance = 4;
  const stage1 = inputArray.map((lat)=>{
    const shade = inShadow(lat,elevation,decayDistance);
    const reverseShade = reverseShadow(lat, elevation,decayDistance);
    // const shade = (lat[0].windZone == 0)? rainShadowsLeftToRight(lat):rainShadowsRightToLeft(lat);
    return lat.map((cell, index)=>{
      if(shade[index]){
        const average = cell.precipitation/1.5;
        return {...cell,precipitation:average};
      }else if(reverseShade[index]){
        const average = (cell.precipitation+2)/3;
        return {...cell,precipitation:average};
      }else{
        const average = (cell.precipitation);
        return {...cell,precipitation:average};
      }
    });
  });
  return stage1.map((lat)=>{
    const secondShade = inShadow(lat, 0.42,(decayDistance*3));
    return lat.map((cell, index)=>{
      if(secondShade[index]){
        const average = cell.precipitation/2;
        return {...cell,precipitation:average};
      }else{
        const average = (cell.precipitation);
        return {...cell,precipitation:average};
      }
    });
  });
}


//=========================================================================
//Download Canvas
//=========================================================================
const downloadCanvas = () => {
  const a = document.createElement("a");
  let screen = document.getElementById('screen');
  document.body.appendChild(a);
  a.href = screen.toDataURL();
  a.download = "YourMap.png";
  a.click();
  document.body.removeChild(a);
}

document.getElementById('download').addEventListener("click",downloadCanvas);

const downloadMapAsFile = () =>{
  const blob = new Blob([JSON.stringify(gridPlus5)],{type:"octet-stream"});
  const a = document.createElement("a");
  document.body.appendChild(a);
  const href = URL.createObjectURL(blob);
  a.href = href;
  a.download = "map.brd";
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(href);
}
document.getElementById('downloadFile').addEventListener("click",downloadMapAsFile);

let fileIn = document.getElementById('upload');

fileIn.addEventListener('change',()=>{
  let fr = new FileReader();
  fr.readAsText(fileIn.files[0]);
  fr.onload = () =>{
    gridPlus5 = JSON.parse(fr.result);
    clearMap();
    drawMap();
  };
});
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
  const tempRanges = [0.3,0.6];
  const precipRanges = [0.3,0.57];
  var temp;
  var precip;

  const desert = 'bisque';
  const grassland = 'yellowgreen';
  const savanah = "#a6c466";
  // const savanah = "#ADFF2F";
  const forrest = 'green';
  const tundra = 'aliceblue';
  const jungle = '#40a829';
  const taiga = '#008080';
  const styleMatrix = [[
    //cold(dry,med,wet)
    [tundra,tundra,taiga],
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
    [desert,savanah,jungle]
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


//==========================================================================================
// Drawing things to the screen
//==========================================================================================
let screen = document.getElementById('screen');
let brush = screen.getContext("2d");
screen.style.boxSizing = 'border-box';

const x = 500;
const y= 250;
const noiseConstants = [80,65];

let q;
if(window.innerWidth > window.innerHeight){
  q = ((window.innerHeight-window.innerHeight%y)/y);
}else{
  q = ((window.innerWidth-window.innerWidth%x)/x);
}

screen.style.width = x*q+"";
screen.style.height = y*q+"";
screen.width = x*q;
screen.height = y*q;

const grid = enhance(noise2D(noiseConstants[0],noiseConstants[1]),x,y);
const gridPlus1 = callTheWind(swapXY(grid));
const gridPlus2 = blessTheRains(gridPlus1);
const gridPlus3 = bringTheHeat(gridPlus2);
const gridPlus4 = applyRainShadows(gridPlus3,0.4);

let gridPlus5=swapXY(gridPlus4);

let saveState = JSON.parse(JSON.stringify(gridPlus5));
console.log(saveState);


const drawMap = () =>{
  for(let j=0;j<y;j++){
    for(let k=0; k<x; k++){
      // const value = convertToRGB(grid[k][j]);
      const value = convertObjectToRGB(gridPlus5[k][j]);
      brush.beginPath();
      brush.fillStyle = value;
      brush.fillRect(k*q,j*q,1*q,1*q);
      brush.stroke();
    }
  }
  if(gridLines.checked){
    const color = "rgba(202, 202, 202, 0.526)";
    for(let i = 0; i<x; i+=5){
      brush.beginPath();
      brush.strokeStyle = color;
      if(i%30==0){
        brush.lineWidth = 1.5;
        brush.font = "10px Arial";
        brush.fillStyle = "white";
        brush.fillText((i/5)+"",i*q,3*q);
      }else{
        brush.lineWidth = 1;
      }
      brush.moveTo(i*q,0);
      brush.lineTo(i*q,screen.height);
      brush.stroke();
    }
    for(let e = 0; e<y; e+=5){
      brush.beginPath();
      brush.strokeStyle = color;
      if(e%30==0){
        brush.lineWidth = 1.5;
        brush.font = "10px Arial";
        brush.fillStyle = "white";
        brush.fillText((e/5)+"",0,e*q);
      }else{
        brush.lineWidth = 1;
      }
      brush.moveTo(0,e*q);
      
      brush.lineTo(screen.width,e*q);
      brush.stroke();
    }
  }
}
drawMap();
const clearMap = () =>{
  brush.clearRect(0, 0, screen.width, screen.height);
}
//==========================================================================
//Commit and Discard Changes
//==========================================================================
const commitButton = document.getElementById('commit');
const discardButton = document.getElementById('discard');
commitButton.addEventListener("click",e=>{
  e.preventDefault();
  commitChanges();
});
discardButton.addEventListener("click",e=>{
  e.preventDefault();
  discardChanges();
});


const commitChanges = () =>{
  console.log('save');
  saveState = JSON.parse(JSON.stringify(gridPlus5));
  clearMap();
  drawMap();
}
const discardChanges = () =>{
  console.log('discard');
  gridPlus5 = JSON.parse(JSON.stringify(saveState));
  clearMap();
  drawMap();
}

//===========================================================================
//map window mouse position to variable
//===========================================================================

document.addEventListener("mousemove", event =>{
  mousePos.x = event.x;
  mousePos.y = event.y;
})

const getCanvasPos = (mousePos) => {
  const screen = document.getElementById('screen');
  var rect = screen.getBoundingClientRect();
  let scaleX = screen.width/rect.width;
  let scaleY = screen.height/rect.height;
  return {x:(mousePos.x-rect.left)*scaleX, y:(mousePos.y-rect.top)*scaleY};
}


const zoomElement = document.querySelector("#screen");
const brushRadius = document.getElementById('brushSize');
let zoom = 1;
let mousePos = {x:0,y:0};
let cMousePos = {x:0,y:0};
let panning;
let currentColor = "red";
let drawing = false;
let road = 0;
let roadPoint = {};
let selectedArea =[];

  var pointX = 0,
      pointY = 0,
      start = {x:0,y:0};


//=========================================================================
//This function will take the mouse position and convert it from a
//continuous value to a discreet value
//=========================================================================
  const quantizeMouse = () =>{
    let t = getCanvasPos(mousePos);
    return {x:Math.floor(t.x/q)*q,y:Math.floor(t.y/q)*q};

  }

  //==================================================================================
  //This sets the css properties for the target object
  //==================================================================================
  const setTransform = (target) =>{
    target.style.transform = `translate(${pointX}px, ${pointY}px) scale(${zoom})`;
  }


  //==================================================================================
  //Set monitoring values
  //==================================================================================
  // const powerDisplay = document.getElementById("displayOfPower");
  // const minDisplay = document.getElementById("minDisplay");
  // const maxDisplay = document.getElementById("maxDisplay");
  
  // const brushPowerSlider = document.getElementById("brushPower");
  // const brushMinimum = document.getElementById('brushMinimum');
  // const brushMaximum = document.getElementById('brushMaximum');

  // brushPowerSlider.addEventListener("change", e=>{
  //   e.preventDefault();
  //   powerDisplay.textContent = brushPowerSlider.value;
  // });
  // brushMinimum.addEventListener("change", e=>{
  //   e.preventDefault();
  //   minDisplay.textContent=brushMinimum.value;
  //   minDisplay.style.backgroundColor = convertObjectToRGB({elevation:(brushMinimum.value/100)});
  // })
  // brushMaximum.addEventListener("change", e=>{
  //   e.preventDefault();
  //   maxDisplay.textContent=brushMaximum.value;
  //   maxDisplay.style.backgroundColor = convertObjectToRGB({elevation:(brushMaximum.value/100)});
  // })

  gridLines.addEventListener("change", e=>{
    e.preventDefault();
    console.log(gridLines.checked);
    clearMap();
    drawMap();
  })
  //==================================================================================
  //brushes
  //==================================================================================

  const pullBrush = (input) =>{
      const brushPower = document.getElementById('brushPower').value;
      input.map(c=>{ 
        if(gridPlus5[c.x/q][c.y/q].elevation+(0.001*brushPower) < brushMaximum.value/100){
          if(gridPlus5[c.x/q][c.y/q].elevation+0.001*brushPower>brushMinimum.value){
            gridPlus5[c.x/q][c.y/q].elevation+=0.001*brushPower;
          }else{
            gridPlus5[c.x/q][c.y/q].elevation = (brushMinimum.value/100);
          }
        }else{
          gridPlus5[c.x/q][c.y/q].elevation = (brushMaximum.value/100);
        }
      
      });
    clearMap();
    drawMap();
  }

  const elevationBrush = (input,maxX,maxY, elevation) =>{
    console.log(elevation);
    input.map(c=>{
      if(c.x/q>=0&&c.x/q<=maxX&&c.y/q>=0&&c.y/q<=maxY){
        console.log('running');
        gridPlus5[c.x/q][c.y/q].elevation = elevation;
      }
    })
    clearMap();
    drawMap();
  }

  const eleBrush = (input)=>{
    console.log(input);
    const bounds = [0.24,0.25,0.31,0.33,0.37,0.4,0.42,0.46];
    return elevationBrush(input, x,y,bounds[parseInt(brushSelector.value)-1]);
  }

  const selectZone = (input, func) =>{
    const test=[];
    input.forEach((x)=>{
      const targetString = JSON.stringify(x);
      if(!test.includes(targetString)){
        test.push(targetString);
      } 
    })
    const zone = test.map(g=>{
      return JSON.parse(g);
    })
    func(zone);
    selectedArea = [];
  }
  //==================================================================================
  //Handle Roads
  //==================================================================================
  const roadStartButton = document.getElementById('roadStartButton');
  roadStartButton.addEventListener("click", e =>{
    e.preventDefault();
    road = 1;
  })

  const twoPointRoad = () =>{
    
  }

  //==================================================================================
  //Handles clicks, if shift is down it's pan, if not it's draw
  //==================================================================================
  zoomElement.onmousedown = function (e) {
    e.preventDefault();
    if(e.shiftKey){
      start = { x: e.clientX - pointX, y: e.clientY - pointY };
      panning = true;

    }else if(road!=0){
      if(road ==2){
        //call the 2 point road method
        road = 0;
      }else if(road==1){
        const obj = quantizeMouse();
        drawSquare(obj,'purple');
        roadPoint = quantizeMouse();
        road += 1;
      }
    }else{
      drawing = true;
      const marker = quantizeMouse();
      const test = brushProfiles(marker.x,marker.y,parseInt(brushRadius.value));
      selectedArea.push(...test);
      test.map(c=>{
      const x = c.x;
      const y = c.y;
      const ob = {x:x,y:y};
      drawSquare(ob,currentColor);
    });    
    }
  }

  zoomElement.onmouseup = function (e) {
    
    panning = false;
    drawing = false;
    if(selectedArea.length>0){
      selectZone(selectedArea,eleBrush);
    }
  }
  const drawSquare = (marker, color) =>{
    brush.beginPath();
    brush.fillStyle = color;
    brush.fillRect(marker.x,marker.y,1*q,1*q);
    brush.stroke();
  }

  //==================================================================================
  //this section handles the actual panning logic
  //==================================================================================
  zoomElement.onmousemove = function (e) {
    e.preventDefault();
    cMousePos.x = e.clientX;
    cMousePos.y = e.clientY;
    if (!panning) {
      if(drawing){
        const marker = quantizeMouse();
        const test = brushProfiles(marker.x,marker.y,parseInt(brushRadius.value));
        selectedArea.push(...test);
        test.map(c=>{
          const x = c.x;
          const y = c.y;
          const ob = {x:x,y:y};
          drawSquare(ob,currentColor);
        }); 
      };
      return;
    }
    pointX = (e.clientX - start.x);
    pointY = (e.clientY - start.y);
    setTransform(zoomElement);
  }

  //==================================================================================
  // This section handles scrolling zoom
  //==================================================================================
  zoomElement.onwheel = (event)=>{
    event.preventDefault();
    let xs = (event.clientX - pointX)/zoom;
    let ys = (event.clientY - pointY)/zoom;
    (event.deltaY<0)? (zoom+=0.1):(zoom-=0.1);
    if(zoom < 1){
      zoom=1;
      pointX = 0;
      pointY = 0;
    }else{
      pointX = event.clientX - xs * zoom;
      pointY = event.clientY - ys * zoom;
    }
    setTransform(zoomElement);
  }

  const calculateDistance = (x1,y1,x2,y2) =>{
    const dX = x1-x2;
    const dY = y1-y2;
    return ((dX**2+dY**2)**.5);
  }

  const brushProfiles = (xInput,yInput,R) => {
    let output = [];
    for(let i = (yInput-R);i<=(yInput+R);i++){
      for(let j = (xInput-R);j<=(xInput+R);j++){
        if(calculateDistance(xInput,yInput,j,i)<=R){
          const target = {x:xInput+((xInput-j)*q),y:yInput+((yInput-i)*q)};
          output.push(target);
        }
      }
    }
    return output;
  }