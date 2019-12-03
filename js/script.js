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
        checkCollision(Math.trunc(arrayOfLinePoints[count]),Math.trunc(arrayOfLinePoints[count+1]));
        context.stroke();
        count+=2;
    }
}
function animateDrawCurve(){
	console.log(3);
    drawFromCount(5);
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
    }
}
function createCurveArray(arrControlPoints){
	console.log(1);
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
		if((y-collisionLines[i+1])*(collisionLines[i+2]-collisionLines[i])-(x-collisionLines[i])*(collisionLines[i+3]-collisionLines[i+1]) < 1000 && (y-collisionLines[i+1])*(collisionLines[i+2]-collisionLines[i])-(x-collisionLines[i])*(collisionLines[i+3]-collisionLines[i+1]) > -1000){
			animate = false;
		}
	}
    
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
        console.log(e.offsetX,e.offsetY);
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