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
let currentStage = 0;
let win;
let pointsLeft = 0;
let score = 0;
let sequence = 0;
let color = "#1DB954";
console.log("did stuff");
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
        document.getElementById("resetButton").disabled = true;
        document.getElementById("resetButton").style.opacity = 0.5;
        requestAnimationFrame(animateDrawCurve);
    }
    else{
        if(win == true){
            document.getElementById("nextButton").style.opacity = 1;
            document.getElementById("nextButton").disabled = false;
            document.getElementById("info").style.color = "#1DB954";
            document.getElementById("info").innerHTML = "You won! Press next";
            document.getElementById("resetButton").disabled = false;
            document.getElementById("resetButton").style.opacity = 1;
        }
        if(win == false){
            document.getElementById("info").style.color = "#FF0000";
            document.getElementById("info").innerHTML = "You lost! Press reset";
            document.getElementById("resetButton").disabled = false;
            document.getElementById("resetButton").style.opacity = 1;
        }
    }
}
function createCurveArray(arrControlPoints){
    let parArray = [];
    arrControlPoints.forEach(element => {
        parArray.push(element);
    });
    let chngArray;
    context.strokeStyle = color;
    for(let t=0;t<=1.0;t+=0.0001){
        chngArray = reduceArray(parArray,t);
        arrayOfLinePoints.push(chngArray[0]);
        arrayOfLinePoints.push(chngArray[1]);
        if(checkCollision(chngArray[0],chngArray[1])){
            win = false;
            break;
        }
        win = true;
    }
    count = 2;
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
    if(Math.abs(crossProduct) > 1000)
        return false;
    if(dotProduct < 0)
        return false
    if(dotProduct > squaredLength)
        return false
    return true;

}
function createStage(){
    if(currentStage == 4){
        document.getElementById("drawButton").disabled = true;
        document.getElementById("drawButton").style.opacity = 0.5;
        document.getElementById("resetButton").disabled = true;
        document.getElementById("resetButton").style.opacity = 0.5;
        drawText(10000);
    }
    document.getElementById("drawButton").disabled = false;
    document.getElementById("drawButton").style.opacity = 1;
    document.getElementById("resetButton").disabled = false;
    document.getElementById("resetButton").style.opacity = 1;
    document.getElementById("stageNameDiv").innerHTML = "Stage "+(currentStage+1);
    document.getElementById("info").style.color = "#FFFFFF";
    document.getElementById("info").innerHTML = "Draw!";
    document.getElementById("nextButton").disabled = true;
    document.getElementById("nextButton").style.opacity = 0.5;
    context.lineWidth = 6;
    collisionLines = returnStage(currentStage);
	context.strokeStyle = "#FFFFFF"
    for(let i=0;i<collisionLines.length;i+=4){
        drawCurve([collisionLines[i],collisionLines[i+1],collisionLines[i+2],collisionLines[i+3]]);
    }
    context.fillStyle = color;
    context.strokeStyle = color;
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
    document.getElementById("numPoints").innerHTML = "Points left: "+pointsLeft;
}
function mouseDownFunction(e){
    if(e.button == 0){
        if(pointsLeft > 0 && sequence>7){
            arrayOfControlPoints.splice(arrayOfControlPoints.length-2,0,e.offsetX);
            arrayOfControlPoints.splice(arrayOfControlPoints.length-2,0,e.offsetY);
            context.beginPath();
            context.arc(e.offsetX, e.offsetY, 10, 0, 2 * Math.PI, false);
            context.fillStyle = color;
            context.strokeStyle = color;
			context.fill();
            context.stroke();
            pointsLeft--;
            document.getElementById("numPoints").innerHTML = "Points left: "+pointsLeft;
        }
        else if(sequence <=7){
            reset();
            sequence++;
            drawText(sequence);
        }
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
    scaleY = mainCanvas.clientHeight/749;
    context = mainCanvas.getContext("2d"); 
    mainCanvas.addEventListener("mousedown",function(e){
        mouseDownFunction(e);
    });
    context.lineWidth = 3;
    if(sequence == 0)
        drawText(sequence);
    
}
function onCanvasResize(){
    mainCanvas.width = mainCanvas.clientWidth;
    mainCanvas.height = mainCanvas.clientHeight;
    scaleX = mainCanvas.clientWidth/1920;
    scaleY = mainCanvas.clientHeight/749;
    reset();
    drawText(sequence);
}
function returnStage(stageNum){
    if(stageNum == 0){
        startPoint = {x:480*scaleX,y:375*scaleY}
        endPoint = {x:1440*scaleX,y:375*scaleY};
        pointsLeft = 1;
        return [960*scaleX,287*scaleY,960*scaleX,462*scaleY];
    }
	else if(stageNum == 1){
        startPoint = {x:250*scaleX,y:600*scaleY};
        endPoint = {x:1750*scaleX,y:600*scaleY};
        pointsLeft = 3;
        return [960*scaleX,894*scaleY,960*scaleX,350*scaleY];
    }
    else if(stageNum == 2){
        startPoint = {x:250*scaleX,y:200*scaleY};
        endPoint = {x:1750*scaleX,y:200*scaleY};
        pointsLeft = 5;
        return [480*scaleX,0*scaleY,480*scaleX,400*scaleY,960*scaleX,894*scaleY,960*scaleX,400*scaleY,1440*scaleX,0*scaleY,1440*scaleX,400*scaleY];
    }
    else if(stageNum == 3){
        startPoint = {x:960*scaleX,y:50*scaleY};
        endPoint = {x:960*scaleX,y:700*scaleY};
        pointsLeft = 10;
        return [0*scaleX,150*scaleY,300*scaleX,150*scaleY,500*scaleX,150*scaleY,1920*scaleX,150*scaleY,
            0*scaleX,300*scaleY,960*scaleX,300*scaleY,1160*scaleX,300*scaleY,1920*scaleX,300*scaleY,
            0*scaleX,500*scaleY,800*scaleX,500*scaleY,1000*scaleX,500*scaleY,1920*scaleX,500*scaleY];
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
    score+=(500-pointsLeft*50);
    localStorage.setItem("stage",currentStage);
    localStorage.setItem("score",score);
    document.getElementById("score").innerHTML = "Score: "+score;
    reset();
}
function drawText(curSeq){
    context.font = (30*scaleX)+"px Montserrat";
    context.fillStyle = "#FFFFFF";
    let textToDraw = returnText(curSeq);
    context.fillText(textToDraw.text,textToDraw.x,textToDraw.y);
}
function returnText(seq){
    if(seq == 0){
        return {
            text:"Welcome to the bezier game! Press anywhere to continue",
            x:530*scaleX,
            y:187*scaleY,
        }
    }
    else if(seq == 1){
        return {
            text:"This is the start point of the bezier curve...",
            x:230*scaleX,
            y:330*scaleY,
        }   
    }
    else if(seq == 2){
        return {
            text:"...and this is the end point",
            x:1230*scaleX,
            y:330*scaleY,
        }   
    }
    else if(seq == 3){
        return {
            text:"By pressing left click, you will be able to draw control points",
            x:530*scaleX,
            y:187*scaleY,
        }   
    }
    else if(seq == 4){
        return {
            text:"Press draw to draw the curve from your points...",
            x:630*scaleX,
            y:700*scaleY,
        }   
    }
    else if(seq == 5){
        return {
            text:"...and Reset to remove all drawn points",
            x:630*scaleX,
            y:700*scaleY,
        }   
    }
    else if(seq == 6){
        return {
            text:"Avoid the white lines, or you fail!",
            x:680*scaleX,
            y:187*scaleY,
        }   
    }
    else if(seq == 7){
        return {
            text:"You can only draw this amount of points. Good luck!",
            x:20*scaleX,
            y:730*scaleY,
        }   
    }
    else if(seq == 10000){
        return {
            text:"You win, your score was "+score,
            x:780*scaleX,
            y:375*scaleY,
        }   
    }
}
function changeSeq(seq){
    sequence = seq;
}