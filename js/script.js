let mainCanvas;
let context;
let arrayOfControlPoints = [];
let arrayOfLinePoints = [];
let count=2;
let animate = true;
let collisionLines = [];
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
    drawFromCount(15);
    if(count<arrayOfLinePoints.length && animate){
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
    for(let t=0;t<=1.0;t+=0.001){
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
    for(let i=2;i<arrayToDraw.length;i+=2){
        context.beginPath();
        context.moveTo(arrayToDraw[i-2],arrayToDraw[i-1]);
        context.lineTo(arrayToDraw[i],arrayToDraw[i+1]);
        context.stroke();
    }
}
function checkCollision(x,y){
	for(let i=0;i<collisionLines.length;i+=4){
		if(isBetween(Math.trunc(collisionLines[i]),Math.trunc(collisionLines[i+1]),Math.trunc(collisionLines[i+2]),Math.trunc(collisionLines[i+3]),Math.trunc(x),Math.trunc(y)))
            return true;
    }
    return false;
}
function isBetween(x1,y1,x2,y2,x3,y3){
    /*let crossProduct = (y3-y1)*(x2-x1)-(x3-x1)*(y2-y1);
    let dotProduct = (x3-x1)*(x2-x1)+(y3-y1)*(y2-y1);
    let squaredLength = Math.pow((x2-x1),2)+Math.pow(y2-y1,2);
    if(Math.abs(crossProduct) != 0)
        return false;
    if(dotProduct < 0)
        return false
    if(dotProduct > squaredLength)
        return false
    return true;*/
    for(let t=0;t<=1.0;t+=0.001){
        let chngArray = reduceArray([x1,y1,x2,y2],t);
        if(Math.trunc(x3) == Math.trunc(chngArray[0]) && Math.trunc(y3) == Math.trunc(chngArray[1]))
            return true;
    }
    return false;

}
function createCollisions(){
    collisionLines = returnStage(1);
	context.strokeStyle = "#FFFFFF"
    for(let i=0;i<collisionLines.length;i+=4){
        drawCurve([collisionLines[i],collisionLines[i+1],collisionLines[i+2],collisionLines[i+3]]);
    }
}
function mouseDownFunction(e){
    if(e.button == 0){
        arrayOfControlPoints.push(e.offsetX);
        arrayOfControlPoints.push(e.offsetY);
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
    context = mainCanvas.getContext("2d"); 
    mainCanvas.addEventListener("mousedown",function(e){
        mouseDownFunction(e);
    });
    context.lineWidth = 3;
    
}
function onCanvasResize(){
    mainCanvas.width = mainCanvas.clientWidth;
    mainCanvas.height = mainCanvas.clientHeight;
}
window.onload = function(){
    this.initalizeCanvas();
    this.createCollisions();
}
window.onresize = function(){
    this.onCanvasResize();
}
function returnStage(stageNum){
	if(stageNum == 1)
		return [200,0,200,400,200,400,900,400,900,400,900,0];
}