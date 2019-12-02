let mainCanvas;
let context;
let lineWidthInput = 1;
let arrayOfPoints = [];
function drawCurve(arrayToDraw){
    let parArray = [];
    arrayToDraw.forEach(element => {
        parArray.push(element);
    });
    let chngArray;
    context.beginPath();
    context.strokeStyle = "#1DB954";
    for(t=0;t<=1.0;t+=0.01){
        chngArray = reduceArray(parArray,t);
        context.lineTo(chngArray[0],chngArray[1]);
    }
    context.stroke();

}
function mouseDownFunction(e){
    arrayOfPoints.push(e.offsetX);
    arrayOfPoints.push(e.offsetY);
    context.beginPath();
    context.arc(e.offsetX, e.offsetY, 10, 0, 2 * Math.PI, false);
    context.fillStyle = "#1DB954";
    context.strokeStyle = "#1DB954";
    context.fill();
    context.stroke();
}
function reduceArray(array,t){
    let newArray = [];
    if(array.length<=2){
        return array;
    }
    for(i=0;i<array.length-2;i+=2){
        let pX = array[i] + t*(array[i+2]-array[i]);
        let pY = array[i+1] + t*(array[i+3]-array[i+1]);
        newArray.push(pX);
        newArray.push(pY);    
    }
    return reduceArray(newArray,t);
}
function initalizeCanvas(){
    mainCanvas = document.getElementById("drawCanvas");
    mainCanvas.width = mainCanvas.clientWidth;
    mainCanvas.height = mainCanvas.clientHeight;
    context = mainCanvas.getContext("2d"); 
    mainCanvas.addEventListener("mousedown",function(e){
        mouseDownFunction(e);
    });
    context.lineWidth = 1;
    
}
function onCanvasResize(){
    mainCanvas.width = mainCanvas.clientWidth;
    mainCanvas.height = mainCanvas.clientHeight;
}
window.onload = function(){
    this.initalizeCanvas();
}
window.onresize = function(){
    this.onCanvasResize();
}
/*function drawQuadBezier(cp1,cp2,cp3){
    context.moveTo(cp1.x,cp1.y);
    for(t=0;t<=1.0;t+=0.01){
        let lmd1X = cp1.x + t*(cp2.x-cp1.x);
        let lmd1Y = cp1.y + t*(cp2.y-cp1.y);
        let lmd2X = cp2.x + t*(cp3.x-cp2.x);
        let lmd2Y = cp2.y + t*(cp3.y-cp2.y);
        let lmd3X = lmd1X + t*(lmd2X-lmd1X);
        let lmd3Y = lmd1Y + t*(lmd2Y-lmd1Y);
        context.lineTo(lmd3X,lmd3Y);
    }
    context.stroke();
}*/
