var ball_timer = null;
var curTimer = null;
var rocketTimer = null;

/* This function runs once the page is loaded, but appMobi is not yet active */
var init = function(){

    if(ball_timer == null){
        ball_timer = window.setInterval('updateCanvas();', 30);
    }
   initGameArea();
};
var fini = function(){
  if(ball_timer){
    window.clearInterval(ball_timer);
    ball_timer = null;
  }
  if(curTimer){
     window.clearInterval(curTimer);
     curTimer = null;
  }
  if(rocketTimer){
     window.clearInterval(rocketTimer);
     rocketTimer = null;
  }
};
window.addEventListener("load",init,false);  
window.addEventListener("unload",fini,false);  

/* This code is used to run as soon as appMobi activates */
/*var onDeviceReady=function(){
    //Size the display to 768px by 1024px
    AppMobi.display.useViewport(768,1024);
	
	//hide splash screen
	AppMobi.device.hideSplashScreen();
     alert("onDeviceReady");	
};
*/
//document.addEventListener("appMobi.device.ready",onDeviceReady,false);    

/* START ACCELEROMETER SNIPPET   *****************************/
/*
var onDeviceReadyAccel=function(){
       
    //start watching the accelerometer
   accelldiv = document.createElement('div');
   accelldiv.id = "accelerometerReadings";
   document.body.appendChild(accelldiv);
    watchAccelerometer();
}
  
document.addEventListener("appMobi.device.ready",onDeviceReadyAccel,false);    
*/
/* Accelerometer Code */
var timer;

function successFunction(evt)
{
    //Readings are from -1 to 1 (with 0 being equilibrium in a plane). 
    //Assuning you hold the device in portrait mode with the  screen pointed straight at your chest.
    document.getElementById("accelerometerReadings").innerHTML = "X=" + evt.x + ", Y=" + evt.y + ", Z=" + evt.z;
    velocityX = evt.x; 
    velocityY = -evt.y; 

}

function watchAccelerometer()
{
    var options = {};
    options.frequency = 100; //check every 100 milliseconds
    timer = AppMobi.accelerometer.watchAcceleration(successFunction, options);
}

function clearAccelerometer()
{
    AppMobi.accelerometer.clearWatch(timer);
}

/* END ACCELEROMETER SNIPPET   *****************************/

var ballRadius = 30;
var ballPosX = 75;
var ballPosY = 75;
var velocityX = +2.5;
var velocityY = +2; 

function drawBall(ctx, x, y) {
    var grd = ctx.createRadialGradient(x, y, 1, x+5, y+5, ballRadius);
    grd.addColorStop(0, "#8ED6FF"); // light blue
    grd.addColorStop(1, "#004CB3"); // dark blue
    
    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2, true); 
    ctx.closePath();
    ctx.fill();
}

function updateCanvas() {
    var mainCanvas = document.getElementById('mainCanvas');  
    mainCanvas.width  = window.innerWidth;
    mainCanvas.height = window.innerHeight;
    var ctx = mainCanvas.getContext('2d');  
    ctx.clearRect(ballPosX-ballRadius, ballPosY- ballRadius, ballRadius*2, ballRadius*2);
    ballPosX += velocityX;
    ballPosY += velocityY;
	if ((ballPosX <= ballRadius) || (ballPosX >= mainCanvas.width-ballRadius)) 
		velocityX *= -1;
	if ((ballPosY <= ballRadius) || (ballPosY >= mainCanvas.height-ballRadius)) 
		velocityY *= -1;

    drawBall(ctx, ballPosX, ballPosY); 
}                                                  
var curPosX = 0;                                  
var curPosY = 0;                                 
var curSizeX = 4;                                        
var curSizeY = 4;                                        
var ctx = null;
var canvas = null;//document.getElementById('gameCanvas');
var curImage = null;
var curImageSizeX = 12;
var curImageSizeY = 12;
var savedArea = null;

var shapes = [];
var activePoints = [];

var curStartPoint = [0,0];

var rocketPos = [400, 300];
var rVX = +2;
var rVY = +2.5; 
var rocketRadius = 5;


var safeArea = true;

//Game state. 0 - initial value; 1 - game in progress; 2 - Victory; 3 - Loose the game
var gameActive = 0;

var deltaCur = 10;

var rocketSavedArea;
var winArea = 0;
var lifeCnt = 3;
var g_dragMode = false;

function updateStatusBar()
{
  $('#lifes').text("lifes: "+String(lifeCnt));
}
function drawRocket(ctx, x, y) {
    var grd = ctx.createRadialGradient(x, y, 1, x+2.5, y+2.5, rocketRadius);
    rocketSavedArea = ctx.getImageData(rocketPos[0] - rocketRadius, rocketPos[1] - rocketRadius, rocketRadius*2 + ctx.lineWidth, rocketRadius*2 + ctx.lineWidth);//
    grd.addColorStop(0, "#8ED6FF"); // light blue
    grd.addColorStop(1, "#004CB3"); // dark blue
    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.arc(x, y, rocketRadius, 0, Math.PI*2, true); 
    ctx.closePath();
    ctx.fill();
}
function updateGameCanvas() {
     if (gameActive != 1) return;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.lineCap="square"
    ctx.lineWidth= 0;
    ctx.clearRect(rocketPos[0]-rocketRadius, rocketPos[1]- rocketRadius, rocketRadius*2, rocketRadius*2);
    ctx.fillRect(rocketPos[0]-rocketRadius, rocketPos[1]- rocketRadius, rocketRadius*2, rocketRadius*2);
    ctx.putImageData(rocketSavedArea, rocketPos[0] - rocketRadius, rocketPos[1] - rocketRadius);    
    var posX1 = rocketPos[0];
    var posY1 = rocketPos[1];

/*    var changedX=false;
    var changedY=false;
    if (hitBoud(posX1, posY1, rocketRadius, rocketRadius) == 2) 
        changedX=true;
    if (hitBound(posX1, posY1, rocketRadius, rocketRadius) == 1) 
        changedY=true;
    */
    rocketPos[0] += rVX;
    rocketPos[1] += rVY;
    if (checkActiveCurveCross(posX1, posY1, rocketPos[0], rocketPos[1], rocketRadius))
    {
      lifeCnt--;
      g_dragMode = false;
      updateStatusBar();
      if (lifeCnt == 0)
      {
        lostGame();
        return;
      }
      curPosX=activePoints[0][0];
      curPosY=activePoints[0][1];
      safeArea = true;
      activePoints = [];
      curStartPoint = [curPosX,curPosY];
      drawGameCanvas();
    }
    var vx = rocketRadius;
    var vy = rocketRadius;
//    posX1 = rocketPos[0];
//    posY1 = rocketPos[1];
    if (hitBound(rocketPos[0], rocketPos[1], vx, vy) == 2)
    {
        if (hitBound(posX1, posY1, vx, vy) != 2)
//        if (findShape(rocketPos[0], rocketPos[1]) == findShape(rocketPos[0]+(rVX*(-1)), rocketPos[1]+(rVY*(-1))))
	  rVX *= -1;
/*        if (changedX)
            alert("changed velocity 2 times X");*/
//        if ()
    }
    if (hitBound(rocketPos[0], rocketPos[1], vx, vy) == 1) 
    {
        if (hitBound(posX1, posY1, vx, vy) != 1)
//        if (findShape(rocketPos[0], rocketPos[1]) == findShape(rocketPos[0]+(rVX*(-1)), rocketPos[1]+(rVY*(-1))))
            rVY *= -1;
/*        if (changedY)
             alert("changed velocity 2 times Y");*/
    }

    drawRocket(ctx, rocketPos[0], rocketPos[1]); 

}                                                  


function resetGlobalVars()
{
  //gameActive = 0;
  shapes = [];
  activePoints = [];
  curStartPoint = [0,0];
  safeArea = true;
  lifeCnt = 3;
  if (curImageSizeX % 2) curImageSizeX--;
  if (curImageSizeY % 2) curImageSizeY--;

  curSizeX = (curImageSizeX % 3) == 0 ? curImageSizeX/3 : curImageSizeX/2;
  curSizeY = (curImageSizeY % 3) == 0 ? curImageSizeY/3 : curImageSizeY/2;

  while ((canvas.width % curSizeX) && curSizeX > 4) curSizeX--;
  while ((canvas.height % curSizeY) && curSizeY > 4) curSizeY--;
  
  if (curImageSizeX % curSizeX) curImageSizeX = 3*curSizeX;
  if (curImageSizeY % curSizeY) curImageSizeY = 3*curSizeY;

  curPosX = curImageSizeX/2;
  curPosY = curImageSizeY/2;     
  //if (deltaCur)
  //curSizeX = curPosX;                                        
    //curSizeY = curPosY;                                        
    curStartPoint = [curPosX,curPosY];
    var rightTopPoint = [canvas.width-curPosX, curPosY];
    var rightBottomPoint = [canvas.width-curPosX, canvas.height - curPosY];
    var leftBottomPoint = [curPosX, canvas.height - curPosY];
    shapes[0] = [curStartPoint, rightTopPoint, rightBottomPoint, leftBottomPoint, curStartPoint];

  if(curTimer){
     window.clearInterval(curTimer);
     curTimer = null;
  }
  if(rocketTimer){
     window.clearInterval(rocketTimer);
     rocketTimer = null;
  }
  rocketPos = [0, 0];

}
function updateStatusLine()
{
//Game state. 0 - initial value; 1 - game in progress; 2 - Victory; 3 - Loose the game
  if (gameActive == 0)
  {
      $('#pressKey').removeClass('hidden');
      $('#pressKey').addClass('shown_inline');
      $('#lost').removeClass('shown_inline');
      $('#lost').addClass('hidden');
      $('#won').removeClass('shown_inline');
      $('#won').addClass('hidden');
      $('#statusPanel').removeClass('shown_inline');
      $('#statusPanel').addClass('hidden');
  }
  else if (gameActive == 1)
  {
      $('#pressKey').removeClass('shown_inline');
      $('#pressKey').addClass('hidden');
      $('#lost').removeClass('shown_inline');
      $('#lost').addClass('hidden');
      $('#won').removeClass('shown_inline');
      $('#won').addClass('hidden');
      $('#statusPanel').removeClass('hidden');
      $('#statusPanel').addClass('shown_inline');
  } else if (gameActive == 2)
  {
      $('#pressKey').removeClass('hidden');
      $('#pressKey').addClass('shown_inline');
      $('#won').removeClass('hidden');
      $('#won').addClass('shown_inline');
  } else if (gameActive == 3)
  {
      $('#pressKey').removeClass('hidden');
      $('#pressKey').addClass('shown_inline');
      $('#lost').removeClass('hidden');
      $('#lost').addClass('shown_inline');
  }

}
function startNewGame()
{
  resetGlobalVars();
  gameActive = 1;
  updateStatusLine();
  updateStatusBar();
  rocketPos = [canvas.width/2, canvas.height/2];
  drawGameCanvas();
  drawRocket(ctx, rocketPos[0], rocketPos[1]);
  if(rocketTimer == null){
      rocketTimer = window.setInterval('updateGameCanvas();', 10);
  }

}

function checkCrossLines(x11, y11, x12, y12, x21, y21, x22, y22, delta, checkMov)
{
    var min1, min2, max1, max2;
    if (x11 < x12) {min1 = x11; max1 = x12;}
    else {min1 = x12; max1 = x11;}
    if (x21 < x22) {min2 = x21; max2 = x22;}
    else {min2 = x22; max2 = x21;}
    if (max1+delta < min2 || max2+delta < min1) return false;
    if (checkMov && (max1 < min2 || max2 < min1))
    {
        if (min1 < min2 && x21==min2) return false;
        if (min1 > min2 && x21==max2) return false;
        //if (min1 == min2) return false;
        //check if you are going far or close.
    }
    if (y11 < y12) {min1 = y11; max1 = y12;}
    else {min1 = y12; max1 = y11;}
    if (y21 < y22) {min2 = y21; max2 = y22;}
    else {min2 = y22; max2 = y21;}
    if (max1+delta < min2 || max2+delta < min1) return false;
    if (checkMov && (max1 < min2 || max2 < min1))
    {
        if (min1 < min2 && y21==min2) return false;
        if (min1 > min2 && y21==max2) return false;
        //if (min1 == min2) return false;
        //check if you are going far or close.
    }
    return true;
/*  


      if(line1Y1 == line1Y2) 
      {
         // horizontal line
         if ((line1X1 <= line2X2+delta && line2X2-delta <= line1X2 || line1X2 <= line1X2+delta && line1X2-delta <= line1X1) &&
              (posY2 <= activePoints[i][1] && posY2+delta >= activePoints[i][1]))
                  return true;
        
      } else if(line1X1 == line1X2) 
      {
         // vertical line
         if ((activePoints[i-1][1] <= posY2+delta && posY2-delta <= activePoints[i][1] || activePoints[i][1] <= posY2+delta && posY2-delta <= activePoints[i-1][1]) &&
              (posX2 <= activePoints[i][0] && posX2+delta >= activePoints[i][0]))
                  return true;
      } else
      {
          alert("checkCrossLines: not supported");
     }*/
}

function checkActiveCurveCross(posX1, posY1, posX2, posY2, delta)
{
  var cnt = activePoints.length - 1;
  if (activePoints.length > 0)
  {
  if(posY1 == posY2)
  { 
         // horizontal line
         if (activePoints[activePoints.length-1][1] == posY1)
           if (activePoints[activePoints.length-1][0] < posX2 && posX2 < posX1 || posX1 < posX2 && posX2 < activePoints[activePoints.length-1][0])
                  return true;
//           else 
//               return false;
  }
  else if (posX1 == posX2)
  {
    //vertical line 
    if (activePoints[activePoints.length-1][0] == posX1)
       if (activePoints[activePoints.length-1][1] < posY2 && posY2 < posY1 || posY1 < posY2 && posY2 < activePoints[activePoints.length-1][1])
                  return true;
//       else
//          return false;
  }
  else
  {
     cnt =  activePoints.length;
  }

  }
  for(var i = 1; i < cnt; i++)
  {
     if (checkCrossLines(activePoints[i-1][0], activePoints[i-1][1], activePoints[i][0], activePoints[i][1], posX1, posY1, posX2, posY2, delta, true))
         return true;
  }
  // check current line
  if (cnt == activePoints.length)
      return checkCrossLines(activePoints[activePoints.length-1][0], activePoints[activePoints.length-1][1], curStartPoint[0], curStartPoint[1],
           posX1, posY1, posX2, posY2, delta, true)
  return false;
}

function hitBound(posX, posY, gapX, gapY)
{
  for(var i = 0; i < shapes.length; i++)
  {
    if (shapes[i].length < 4)
    {
        alert ("Alghorithm error in hitBound !");
        return 0;                
    }                              
    for (var j = 1; j < shapes[i].length; j++)
    {
      if(shapes[i][j-1][1] == shapes[i][j][1]) 
      {
         // horizontal line
         if ((shapes[i][j-1][0] <= posX && posX <= shapes[i][j][0] || shapes[i][j][0] <= posX && posX <= shapes[i][j-1][0]) &&
              ((posY <= shapes[i][j][1]+gapY && posY >= shapes[i][j][1]-gapY)))
                  return 1;
        
      } else
      {
         // vertical line
         if ((shapes[i][j-1][1] <= posY && posY <= shapes[i][j][1] || shapes[i][j][1] <= posY && posY <= shapes[i][j-1][1]) &&
              ((posX <= shapes[i][j][0]+gapX && posX >= shapes[i][j][0]-gapX)))
                 return 2;
      }
    }
  }
  return 0;
}
function findShape(x, y)
{

  for (var i = 0; i < shapes.length; i++)
  {
    var rocketIn = [0/*top*/,0/*right*/,0/*bottom*/,0/*left*/];
    if (shapes[i].length < 4)
    {
        alert ("Alghorithm error in findShape !");
        return -1;
    }
    for (var j = 1; j < shapes[i].length; j++)
    {
      if (shapes[i][j-1][1] == shapes[i][j][1])
      {
             // horizontal line
          if(shapes[i][j-1][0] <= x && x < shapes[i][j][0] ||
            shapes[i][j][0] <= x && x < shapes[i][j-1][0])
          {     
             if (y < shapes[i][j][1]) rocketIn[2]++;
             else rocketIn[0]++;
           }
        
      } else if (shapes[i][j-1][0] == shapes[i][j][0])
      {
             // vertical line
         if (shapes[i][j-1][1] <= y && y < shapes[i][j][1] ||
          shapes[i][j][1] <= y && y < shapes[i][j-1][1])
          {
             if (x < shapes[i][j][0]) rocketIn[1]++;
             else rocketIn[3]++;
          }
      }
    }
    if (rocketIn[0]%2!=0 && rocketIn[1]%2!=0 && rocketIn[2]%2!=0 && rocketIn[3]%2!=0)
    {
      return i;
    }
  }
  return -1;
}
function lineVertical(point1, point2)
{                     
  if (point1[0]==point2[0])
  {       
     return true;
  }
  return false;
}
function lineHorizontal(point1, point2)
{                     
  if (point1[1]==point2[1])
  {       
     return true;
  }
  return false;
}

function divShape() 
{
  if (activePoints.length < 2) return;
  //find shape to divide
  var n = -1;
  var x =  activePoints[0][0];
  var y =  activePoints[0][1];
  if (activePoints[0][0] < activePoints[1][0])
  {
     x = x + 1;
  }
  if (activePoints[0][0] > activePoints[1][0])
  {
     x = x - 1;
  }
  if (activePoints[0][1] < activePoints[1][1])
  {
     y = y + 1;
  }
  if (activePoints[0][1] > activePoints[1][1])
  {
     y = y - 1;
  }
  n = findShape(x, y);
  
  if (n == -1)
  {
    alert ("Alghorithm error in divShape 1!");
    return;
  }
  //divide shape
  var first = activePoints[0];
  var last = activePoints[activePoints.length - 1];
  
  var firstDivLine = -1;
  var secondDivLine = -1;

  //find first line to divide
  for (var j = 1; j < shapes[n].length; j++)
  {
    if (shapes[n][j-1][1] == shapes[n][j][1])
    {
      // horizontal line
      if ( (shapes[n][j-1][1] == first[1] ) &&
          (shapes[n][j-1][0] < first[0] && first[0] < shapes[n][j][0] ||
          shapes[n][j][0] < first[0] && first[0] < shapes[n][j-1][0] ||
          ((shapes[n][j-1][0] == first[0]||shapes[n][j][0] == first[0]) && lineVertical(activePoints[0], activePoints[1])==true)))
      {
         firstDivLine = j-1;  
      }
                                                                                     
      if ((shapes[n][j-1][1] == last[1] ) &&                                          
          (shapes[n][j-1][0] < last[0] && last[0] < shapes[n][j][0] ||
          shapes[n][j][0] < last[0] && last[0] < shapes[n][j-1][0] ||
          ((shapes[n][j-1][0] == last[0]||shapes[n][j][0] == last[0]) && lineVertical(activePoints[activePoints.length - 2], activePoints[activePoints.length - 1])==true)))                   
      {
        secondDivLine = j-1;
      }
    }
    else
    {
         // vertical divide line
      if ( (shapes[n][j-1][0] == first[0] ) && 
          (shapes[n][j-1][1] < first[1] && first[1] < shapes[n][j][1] ||
          shapes[n][j][1] < first[1] && first[1] < shapes[n][j-1][1] ||
          ((shapes[n][j-1][1] == first[1]||shapes[n][j][1] == first[1]) && lineHorizontal(activePoints[0], activePoints[1])==true)))

      {
         firstDivLine = j-1;  
      }
      if ((shapes[n][j-1][0] == last[0] ) &&
          (shapes[n][j-1][1] < last[1] && last[1] < shapes[n][j][1] ||
          shapes[n][j][1] < last[1] && last[1] < shapes[n][j-1][1] ||
          ((shapes[n][j-1][1] == last[1]||shapes[n][j][1] == last[1]) && lineHorizontal(activePoints[activePoints.length - 2], activePoints[activePoints.length - 1])==true)))
      {
        secondDivLine = j-1;
      }
    }
  }

  if (firstDivLine==-1 || secondDivLine == -1)
  {
    alert ("Alghorithm error in divShape2!");
    return;
  }
  var minDiv = 0;
  var maxDiv = 0;
  
  tempCurve = [];
  var j = 0;
  if (firstDivLine <= secondDivLine)
  {
     minDiv = firstDivLine;
     maxDiv = secondDivLine;
     tempCurve[j] = first;
     j++;
  }
  else
  {
     maxDiv = firstDivLine;
     minDiv = secondDivLine;
     tempCurve[j] = last;
     j++;
  }
  
  for (var i = minDiv+1; i <=maxDiv; i++)
  {
     tempCurve[j] = shapes[n][i];
     j++;
  }  
  if (firstDivLine <= secondDivLine)
  {
     tempCurve[j] = last;
  }
  else
  {
     tempCurve[j] = first;
  }
  j = minDiv+1;
  
  if (firstDivLine < secondDivLine)
  {
    activePoints.reverse();
  }
  else if (firstDivLine == secondDivLine)
  {
      if (shapes[n][j-1][1] == shapes[n][j][1])
      {
         //horizontal line   
         if (Math.abs(first[0] - shapes[n][j-1][0]) < Math.abs(last[0] - shapes[n][j-1][0]))
         {
             activePoints.reverse();
         }
         else
         {
            tempCurve.reverse();
         }
         
      }
      else
      {
        //vertical line
         if (Math.abs(first[1] - shapes[n][j-1][1]) < Math.abs(last[1] - shapes[n][j-1][1]))
         {
             activePoints.reverse();
         }
         else
         {
            tempCurve.reverse();
         }
      }
  }
  
  if (firstDivLine == secondDivLine)
  {
    shapes[n].splice(j, 0, activePoints[activePoints.length-1])
  }
  else
  {
    shapes[n][j] = activePoints[activePoints.length-1];
  }
  j++;
  activePoints.splice(activePoints.length-1, 1)
  for (var i = activePoints.length-1; i >=0 ; i--)
  {
//    shapes[n][j] = activePoints[i];
    shapes[n].splice(j, 0, activePoints[i])
    j++;
  }
  if (tempCurve.length > 2)
  {
      shapes[n].splice(j, tempCurve.length - 2 - 1); //2 points instead present, one wa done above
  }
//  shapes[n][shapes[n].length-1] = activePoints[activePoints.length-1];

  //  forming the new shape 
  n = shapes.length;
//  if (firstDivLine <= secondDivLine)
  {
    shapes[n] = activePoints.concat(tempCurve);
  }
/*  else
  {
    //tempCurve+activePoints
    shapes[n].concat(tempCurve,activePoints);
  }
*/
}                                        
function hitClosedRegion(x,y)
{
    n = findShape(x, y);
    if (n == -1)
         //out of bound
         return false;
    openN = findShape(rocketPos[0],rocketPos[1]);
    if (openN == n)
        return true;
    return false;
}
function hitClosedRegionOrHitRegionLine(x,y)
{
   if (hitClosedRegion(x, y) == true) return true;
   //if (hitBound(x,y,curSizeX/2,curSizeY/2) != 0) return true;
   if (hitBound(x,y,0,0) != 0) return true;
   return false;
}
                
function putAscending(val, arr)
{
  for (var i = 0; i <arr.length; i++)
  {
    if (arr[i] > val)
    {
      for(var j = arr.length-1; j >= i; j--)
        arr[j+1]=arr[j];
      arr[i]=val;
      return;
    }
    else if (arr[i]==val) return; // we will do nothing
  }
  arr[arr.length]=val;
}

function area(n)
{
    var sumA = 0;
    var arrX=[];
    var arrY=[];
    var i, j;
    if (shapes[n].length < 5){
        alert ("shape calc error: shapes[n] length < 5");
        return canvas.width*canvas.height;
    }                                            
    if (shapes[n][0]!=shapes[n][shapes[n].length-1]){
        alert ("shape calc error: shape start and shape end is not equal");
        return canvas.width*canvas.height;                                            
    }
    for (j = 0; j < shapes[n].length; j++)
    {
        putAscending(shapes[n][j][0], arrX);
        putAscending(shapes[n][j][1], arrY);
    }    
    
    for (j = 0 ; j < arrY.length-1; j++)
        for (i = 0; i < arrX.length-1; i++)
            if (findShape((arrX[i+1]+arrX[i])/2,(arrY[j+1]+arrY[j])/2)==n)
                sumA += (arrX[i+1]-arrX[i])*(arrY[j+1]-arrY[j]);
    return sumA;
}

function keyUp(/*key*/) {
//37 - left
//38 - up                                
//39 - right
//40 - down
  if (safeArea==false && (curPosX!=curStartPoint[0] || curPosY!=curStartPoint[1])) {
      activePoints[activePoints.length] = curStartPoint;
      curStartPoint = [curPosX,curPosY];
  }
/*  if (key==37)
  {
  } else if (key==38)
  {
  } else if (key==39)
  {
  } else if (key==40)
  {
  }*/
//  drawGameCanvas();
  //curStartPoint = [curPosX,curPosY];
}

function winGame()
{
  resetGlobalVars();
  gameActive = 2;
  updateStatusLine();
//  $("#won").setAttribute('class', 'shown');
  ctx.clearRect(0,0,canvas.width, canvas.height);
//  alert("You won!!!");
//  setTimeout(3000);
}
function lostGame()
{
  var gameStateReset = curTimer?false:true
  resetGlobalVars();
  gameActive = 3;
  updateStatusLine();
//  updateStatusBar();
  //  $("#won").setAttribute('class', 'shown');
  ctx.clearRect(0,0,canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
//    ctx.shadowOffsetX=0;
//    ctx.shadowOffsetY=0;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
//  alert("You won!!!");
//  setTimeout(3000);
  if (gameStateReset)gameActive = 0;
}

function drawCursor(x,y)
{
  if (safeArea == true)
  {
    if (hitBound(curPosX, curPosY,0,0) == 0)
    {
      safeArea = false;
      curStartPoint = [x,y];
    }
    savedArea = ctx.getImageData(curPosX - curImageSizeX/2, curPosY - curImageSizeY/2, curImageSizeX, curImageSizeY);
    ctx.drawImage(curImage, 0,0, curImage.width, curImage.height, curPosX - curImageSizeX/2, curPosY - curImageSizeY/2, curImageSizeX, curImageSizeY);
  }
  else
  {
    if (hitBound(curPosX, curPosY,0,0) != 0)
    {
      keyUp(/*key*/);
      activePoints[activePoints.length] = curStartPoint; //add the last point to divide the shape
      safeArea = true;
      divShape();
      activePoints = [];
      var fillN = drawGameCanvas();
      if (area(fillN)<winArea)
      {
         g_dragMode = false;
         winGame();
      }
    }
    else if (checkCrossLines(rocketPos[0], rocketPos[1], rocketPos[0], rocketPos[1], curStartPoint[0], curStartPoint[1], curPosX, curPosY, rocketRadius, false))
    {
      lifeCnt--;
      g_dragMode = false;
      updateStatusBar();
      if (lifeCnt == 0)
      {
          lostGame();
          return;
      }
      if (activePoints.length >0){
          curPosX=activePoints[0][0];
          curPosY=activePoints[0][1];
      } else {
          curPosX=curStartPoint[0];
          curPosY=curStartPoint[1];
      }
      safeArea = true;                                                        
      activePoints = [];
      curStartPoint = [curPosX,curPosY];
      drawGameCanvas();
    }
    else
    {
      savedArea = ctx.getImageData(curPosX - curImageSizeX/2, curPosY - curImageSizeY/2, curImageSizeX, curImageSizeY);
      ctx.drawImage(curImage, 0,0, curImage.width, curImage.height, curPosX - curImageSizeX/2, curPosY - curImageSizeY/2, curImageSizeX, curImageSizeY);
    }
  }
}

var prevKey = 0;
function movCursor(key) {
//37 - left
//38 - up                                
//39 - right
//40 - down
  if (safeArea==true)ctx.clearRect(curPosX-curSizeX/2, curPosY-curSizeY/2, curSizeX, curSizeY); //todo: remove this workaround! how to flash what we have done?
  ctx.putImageData(savedArea, curPosX - curImageSizeX/2, curPosY - curImageSizeY/2);
// ctx.clearRect(curPosX-clearDelta, curPosY-clearDelta, curSizeX+clearDelta*2, curSizeY+clearDelta*2);
  if (safeArea==false)ctx.clearRect(curPosX-curSizeX/2, curPosY-curSizeY/2, curSizeX, curSizeY);
  var x = curPosX;         
  var y = curPosY;        
  if (key==37)           
  {
    var newPosX =  curPosX-curSizeX;
    if (newPosX < curImageSizeX/2) newPosX = curImageSizeX/2 ;
    if (hitClosedRegionOrHitRegionLine(newPosX, curPosY) == true && checkActiveCurveCross(curPosX, curPosY, newPosX, curPosY, deltaCur)==false) curPosX = newPosX;
  } else if (key==38)
  {
    var newPosY = curPosY-curSizeY;
    if (newPosY < curImageSizeY/2) newPosY = curImageSizeY/2;
    if (hitClosedRegionOrHitRegionLine(curPosX, newPosY)==true && checkActiveCurveCross(curPosX, curPosY, curPosX, newPosY, deltaCur)==false)curPosY = newPosY;
  } else if (key==39)
  {
    var newPosX =  curPosX+curSizeX;
    if (newPosX > canvas.width - curImageSizeX/2) newPosX = canvas.width - curImageSizeX/2 ;
    if (hitClosedRegionOrHitRegionLine(newPosX, curPosY) == true && checkActiveCurveCross(curPosX, curPosY, newPosX, curPosY, deltaCur)==false) curPosX = newPosX;
  } else if (key==40)
  {
    var newPosY =  curPosY+curSizeY;
    if (newPosY > canvas.height - curImageSizeY/2) newPosY = canvas.height - curImageSizeY/2;
    if (hitClosedRegionOrHitRegionLine(curPosX, newPosY) == true && checkActiveCurveCross(curPosX, curPosY, curPosX, newPosY, deltaCur)==false) curPosY = newPosY;
  }
  drawCursor(x,y);
//  ctx.drawImage(curImage, 0,0, curImage.width, curImage.height, curPosX, curPosY, curImageSizeX, curImageSizeY);
}      
 
function drawGameCanvas() {
  ctx.clearRect(0,0,canvas.width, canvas.height);
  if (gameActive != 1) return;
  ctx.strokeStyle = 'rgba(255, 255, 0, 1)';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.lineCap="square"
  ctx.lineWidth=curSizeX; //todo: change lineWidth to curSizeY for horizontal lines. currently curSizeX==curSizeY
  var n = -1;
  for(var i = 0; i < shapes.length; i++)
  {
    ctx.beginPath();
    var rocketIn = [0/*top*/,0/*right*/,0/*bottom*/,0/*left*/];
    if (shapes[i].length < 4)
    {
        alert ("Alghorithm error in drawCanvas!");
        return n;
    }
    ctx.lineTo(shapes[i][0][0], shapes[i][0][1]);
    for (var j = 1; j < shapes[i].length; j++)
    {
      ctx.lineTo(shapes[i][j][0], shapes[i][j][1]);
      if (shapes[i][j-1][0] <= rocketPos[0] && rocketPos[0] < shapes[i][j][0] ||
          shapes[i][j][0] <= rocketPos[0] && rocketPos[0] < shapes[i][j-1][0])
      {
         // horizontal line
         if (rocketPos[1] < shapes[i][j][1]) rocketIn[2]++;
         else rocketIn[0]++;
        
      } else if (shapes[i][j-1][1] <= rocketPos[1] && rocketPos[1] < shapes[i][j][1] ||
          shapes[i][j][1] <= rocketPos[1] && rocketPos[1] < shapes[i][j-1][1])
      {
         // vertical line
         if (rocketPos[0] < shapes[i][j][0]) rocketIn[1]++;
         else rocketIn[3]++;
      }
    }
    ctx.stroke();
    if (rocketIn[0]%2!=0 && rocketIn[1]%2!=0 && rocketIn[2]%2!=0 && rocketIn[3]%2!=0)
    {
        ctx.fill();
        n = i;
	//fill area
//        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    ctx.closePath();
  }
  savedArea = ctx.getImageData(curPosX - curImageSizeX/2, curPosY - curImageSizeY/2, curImageSizeX, curImageSizeY);
  ctx.drawImage(curImage, 0,0, curImage.width, curImage.height, curPosX - curImageSizeX/2, curPosY - curImageSizeY/2, curImageSizeX, curImageSizeY);
  return n;
}
////////////////////////////////// Dragging cursor ///////////////////////////////////////////////////

class Dot {
  constructor(x=0,y=0,r=0) {
    this.x = x;
    this.y = y;
    this.r = r;
  }
  intersect(dot)
  {
       //TODO
       if (this.x - this.r > dot.x + dot.r || this.x + this.r < dot.x - dot.r ||  this.y - this.r > dot.y + dot.r || this.y + this.r < dot.y - dot.r)
           return false;
       return true;
  }
}
class MouseDot  extends Dot{
  constructor(x=0,y=0) {
    super(x,y,0)
  }
  assign(e){
        if (!e)
            var e = event;

        if (e.offsetX) {
            this.x = e.offsetX;
            this.y = e.offsetY;
        } else {
            //alert ("Error: no property offsetX!");
        }
        if (this.x < 0 ) this.x = 0;
        if (this.y < 0) this.y = 0;
  }
}
class TouchDot  extends Dot{
  assign(e){
        if (!e)
            var e = event;

        if (e.touches) {
            if (e.touches.length == 1) { // Only deal with one finger
                var touch = e.touches[0]; // Get the information for finger #1
                this.x=touch.clientX - canvas.getBoundingClientRect().left;
                this.y=touch.clientY - canvas.getBoundingClientRect().top;
                this.r=Math.min(touch.radiusX, touch.radiusY);
            } else {
                ;//alert ("Error: more than one touches not supported!");
            }
        } else {
            alert ("Error: not supported event!");
        }
        if (this.x < 0 ) this.x = 0;
        if (this.y < 0) this.y = 0;
  }
}


function startDraw(dot)
{
    var curDot = new Dot(curPosX, curPosY, curImageSizeX/2);
    if (curDot.intersect(dot)){
        g_dragMode = true;
        drag(dot);
    }
}
function drag(dot)
{
//37 - left
//38 - up                                
//39 - right
//40 - down




  //do
  //{
    //var curDot = new Dot(curPosX, curPosY, curImageSizeX/2);
    var x = curPosX;
    var y = curPosY;
    
// ctx.clearRect(curPosX-clearDelta, curPosY-clearDelta, curSizeX+clearDelta*2, curSizeY+clearDelta*2);
/*  if (safeArea==true)ctx.clearRect(curPosX-curSizeX/2, curPosY-curSizeY/2, curSizeX, curSizeY); //todo: remove this workaround! how to flash what we have done?
  ctx.putImageData(savedArea, curPosX - curImageSizeX/2, curPosY - curImageSizeY/2);
  if (safeArea==false)ctx.clearRect(curPosX-curSizeX/2, curPosY-curSizeY/2, curSizeX, curSizeY);
*/
  var xDist = Math.abs(curPosX - dot.x);
  var yDist= Math.abs(curPosY - dot.y);
  key = 0;
  if (yDist > xDist){
        key = (curPosY >  dot.y) ? 38 : 40;
  }
  else if (yDist < xDist){
        key = (curPosX >  dot.x) ? 37 : 39;
  }
  if (prevKey!=key){
    keyUp();
    prevKey = key;
  } 
  if (key==37 || key==39)           
  {
    while(Math.abs(curPosX-dot.x) >= curSizeX){
       movCursor(key);
       if (x == curPosX || gameActive != 1 || g_dragMode == false) break;
       x = curPosX;
    }
  } else if (key==38 || key==40)
  {
     while(Math.abs(curPosY-dot.y) >= curSizeY){
       movCursor(key);
       if (y == curPosY || gameActive != 1 || g_dragMode == false) break;
       y = curPosY;
    }
  }
  //} while(Math.abs(curPosY-dot.y) >= curSizeY || Math.abs(curPosX-dot.x) >= curSizeX)
  return false;

/*  if (key == 37 || key == 39)           
  {
    if (hitClosedRegionOrHitRegionLine(dot.x, curPosY)==true && checkActiveCurveCross(curPosX, curPosY, dot.x, curPosY, deltaCur)==false) curPosX = dot.x;
  } else if (key == 38 || key == 40)
  {
    if (hitClosedRegionOrHitRegionLine(curPosX, dot.y)==true && checkActiveCurveCross(curPosX, curPosY, curPosX, dot.y, deltaCur)==false)curPosY = dot.y;
  } else {
      return false;
  }

  drawCursor(x,y);
*/
}

var touchEnd = function(e) {
  g_dragMode = false;
  if (gameActive >= 2) gameActive = 0;
  else keyUp(/*e.keyCode*/);
  return false;
};

/* This code prevents users from dragging the page */

function initGameArea()
{                               
    var panel = document.getElementById('gamePanel');  
    var fieldPanel = document.getElementById('gameFieldPanel'); 
    canvas = document.getElementById('gameCanvas');  

    canvas.width = fieldPanel.offsetWidth;
    canvas.height = fieldPanel.offsetHeight - 20;

    winArea = canvas.width*canvas.height/10;
    curImage = new Image();
    curImage.src = 'images/games/ball/smile.png';  
    ctx = canvas.getContext('2d');  
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.shadowOffsetX=0;
    ctx.shadowOffsetY=0;
    ctx.fillRect(0, 0, canvas.width, canvas.height);



canvas.addEventListener('touchstart', function(e){
    if (gameActive == 0){
       //alert("keyDown bebore start game!"); 
       curImageSizeX = 20;
       curImageSizeY = 20;
       startNewGame();
    } else if (gameActive == 1){
        var dot = new TouchDot;
        dot.assign(e);
        startDraw(dot);
    }
    e.preventDefault();

}, { passive:false });
canvas.addEventListener('mousedown', function(e){
    if (gameActive == 0){
       //alert("keyDown bebore start game!"); 
       startNewGame();
    }
/*    var dot = new MouseDot;
    dot.assign(e);
    startDraw(dot);*/
}, { passive:false });
canvas.addEventListener('touchmove', function(e){
   if (!g_dragMode) return false;
   var dot = new TouchDot;
   dot.assign(e);
   drag(dot);
   //draw
   e.preventDefault();
   return false;

}, { passive:false });
/*canvas.addEventListener('mousemove', function(e){
   if (!g_dragMode) return false;
   var dot = new MouseDot;
   dot.assign(e);
   drag(dot);
   //draw
   e.preventDefault();
   return false;
}, { passive:false });
*/
    $('#gamePanel').show();
 
  document.addEventListener('touchend', touchEnd, { passive:false });
  document.addEventListener('touchmove', function(e){

  //e.preventDefault();
  return false;
  },{ passive:false }); 
//  document.addEventListener('mouseup', touchEnd, { passive:false });
}
/*function drawGameCursor() {
      context.beginPath();
      context.moveTo(100, 150);
      context.lineTo(450, 50);
      context.stroke();
}
*/
$(document).ready(function(){
$('#start').click(function(){
   startNewGame();
});
/*  if(ball_timer == null){
    ball_timer = window.setInterval('updateCanvas();', 30);
  }
*/
});

$(document).keydown(function(e){
  if (gameActive == 0){
     //alert("keyDown bebore start game!"); 
     startNewGame();
  } else if (gameActive == 1)
  {
      if (e.keyCode >= 37 && e.keyCode <= 40) { 
        if(curTimer == null){
          curTimer = window.setInterval(function() { movCursor(e.keyCode); }, 0.5);
        }
      }
  }
});
$(document).keyup(function(e){
  if ((gameActive >= 2) && (curTimer==null)) gameActive = 0;
  if (e.keyCode >= 37 && e.keyCode <= 40) { 
    if(curTimer){
       window.clearInterval(curTimer);
       curTimer = null;
    }
    keyUp(/*e.keyCode*/);
  }
});

/*$(document).addEventListener('touchstart', function(e){
    if (gameActive == 0){
       //alert("keyDown bebore start game!"); 
       startNewGame();
    }
}, { passive:false });
$(document).addEventListener('mousedown', function(e){
    if (gameActive == 0){
       //alert("keyDown bebore start game!"); 
       startNewGame();
    }
    var dot = new MouseDot;
    dot.assign(e);
    startDraw(dot);
}, { passive:false });
*/

