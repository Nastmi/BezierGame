let mainCanvas;
let context;
let arrayOfControlPoints = [];
let arrayOfLinePoints = [];
let collisionLines = [];
let count=2;
let scaleX = 1;
let scaleY = 1;
let startPoint;
let endPoint;
let currentStage = 1;
function drawFromCount(linesToDraw){
    for(let i=0;i<linesToDraw;i++){
        context.beginPath();
        context.moveTo(arrayOfLinePoints[count-2],arrayOfLinePoints[count-1]);
        context.lineTo(arrayOfLinePoints[count],arrayOfLinePoints[count+1]);
        context.stroke();
        count+=2;
    }
}
function animateDrawCurve(){
    drawFromCount(50);
    if(count<arrayOfLinePoints.length){
        document.getElementById("drawButton").disabled = true;
        document.getElementById("drawButton").style.opacity = 0.5;
        requestAnimationFrame(animateDrawCurve);
    }
    else{
        arrayOfControlPoints = [];
        arrayOfLinePoints = [];
        document.getElementById("drawButton").disabled = false;
        document.getElementById("drawButton").style.opacity = 1;
        animate = true;
    }
}
function createCurveArray(arrControlPoints){
    let parArray = [];
    arrControlPoints.forEach(element => {
        parArray.push(element);
    });
    let chngArray;
    context.strokeStyle = "#1DB954";
    for(let t=0;t<=1.0;t+=0.0001){
        chngArray = reduceArray(parArray,t);
        arrayOfLinePoints.push(chngArray[0]);
        arrayOfLinePoints.push(chngArray[1]);
        if(checkCollision(chngArray[0],chngArray[1]))
            break;
    }
    count = 2;
    animateDrawCurve(arrayOfLinePoints);
}
function drawCurve(arrayToDraw){
    context.beginPath();
    for(let i=2;i<arrayToDraw.length;i+=2){
        context.moveTo(arrayToDraw[i-2],arrayToDraw[i-1]);
        context.lineTo(arrayToDraw[i],arrayToDraw[i+1]);
    }
    context.stroke();
}
function checkCollision(x,y){
	for(let i=0;i<collisionLines.length;i+=4){
		if(isBetween(collisionLines[i],collisionLines[i+1],collisionLines[i+2],collisionLines[i+3],x,y))
            return true;
    }
    return false;
}
function isBetween(x1,y1,x2,y2,x3,y3){
    let crossProduct = (y3-y1)*(x2-x1)-(x3-x1)*(y2-y1);
    let dotProduct = (x3-x1)*(x2-x1)+(y3-y1)*(y2-y1);
    let squaredLength = Math.pow((x2-x1),2)+Math.pow(y2-y1,2);
    //cross product is checked against a tolerance. If working with integers, it would simply need to be != 0, but that is too imprecise.
    
    if(Math.abs(crossProduct) > 1000)
        return false;
    if(dotProduct < 0)
        return false
    if(dotProduct > squaredLength)
        return false
    return true;

    /*for(let t=0;t<=1.0;t+=0.0001){
        let chngArray = reduceArray([x1,y1,x2,y2],t);
        if(Math.trunc(x3) == Math.trunc(chngArray[0]) && Math.trunc(y3) == Math.trunc(chngArray[1]))
            return true;
    }
    return false;*/

}
function createStage(){
    context.lineWidth = 6;
    collisionLines = returnStage(currentStage);
	context.strokeStyle = "#FFFFFF"
    for(let i=0;i<collisionLines.length;i+=4){
        drawCurve([collisionLines[i],collisionLines[i+1],collisionLines[i+2],collisionLines[i+3]]);
    }
    context.fillStyle = "#1DB954";
    context.strokeStyle = "#1DB954";
    context.beginPath();
    context.arc(startPoint.x, startPoint.y, 10, 0, 2 * Math.PI, false);
    context.fill();
    context.stroke();
    arrayOfControlPoints.push(startPoint.x, startPoint.y);
    context.beginPath();
    context.arc(endPoint.x, endPoint.y, 10, 0, 2 * Math.PI, false);
    context.fill();
    context.stroke();
    arrayOfControlPoints.push(endPoint.x, endPoint.y);
    context.lineWidth = 3;
}
function mouseDownFunction(e){
    if(e.button == 0){
        arrayOfControlPoints.splice(arrayOfControlPoints.length-2,0,e.offsetX);
        arrayOfControlPoints.splice(arrayOfControlPoints.length-2,0,e.offsetY);
        context.beginPath();
        context.arc(e.offsetX, e.offsetY, 10, 0, 2 * Math.PI, false);
        context.fillStyle = "#1DB954";
        context.strokeStyle = "#1DB954";
        context.fill();
        context.stroke();
    }
}
function reduceArray(array,t){
    let newArray = [];
    if(array.length<=2){
        return array;
    }
    for(let i=0;i<array.length-2;i+=2){
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
    scaleX = mainCanvas.clientWidth/1920;
    scaleY = mainCanvas.clientHeight/799;
    context = mainCanvas.getContext("2d"); 
    mainCanvas.addEventListener("mousedown",function(e){
        mouseDownFunction(e);
    });
    context.lineWidth = 3;
    
}
function onCanvasResize(){
    mainCanvas.width = mainCanvas.clientWidth;
    mainCanvas.height = mainCanvas.clientHeight;
    scaleX = mainCanvas.clientWidth/1920;
    scaleY = mainCanvas.clientHeight/799;
    reset();
}
window.onload = function(){
    this.initalizeCanvas();
    this.createStage();
}
window.onresize = function(){
    this.onCanvasResize();
}
function returnStage(stageNum){
    console.log(stageNum);
	if(stageNum == 1){
        startPoint = {x:250*scaleX,y:200*scaleY};
        endPoint = {x:1750*scaleX,y:200*scaleY};
        return [960*scaleX,894*scaleY,960*scaleX,400*scaleY];
    }
    else if(stageNum == 2){
        startPoint = {x:250*scaleX,y:200*scaleY};
        endPoint = {x:1750*scaleX,y:200*scaleY};
        return [480*scaleX,0*scaleY,480*scaleX,400*scaleY,960*scaleX,894*scaleY,960*scaleX,400*scaleY,1440*scaleX,0*scaleY,1440*scaleX,400*scaleY];
    }
    return null;

}
function reset(){
    context.clearRect(0,0,mainCanvas.clientWidth,mainCanvas.clientHeight);
    arrayOfControlPoints = [];
    arrayOfLinePoints = [];
    collisionLines = [];
    createStage();
}
function next(){
    currentStage+=1;
    reset();
}