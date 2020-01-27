// inner variables
var canvas, ctx;
var clockRadius = 250;
var clockImage;
var gameState=0;
var clockTimer=null;

var curHour = 0;
var curMin = 0;
var curSec = 0;

var areaWidth = 500;
var areaHeight = 500;
var areaHalfWidth = areaWidth/2;
var areaHalfHeight = areaHeight/2;

var numToStr = [["",""], ["One","one"], ["Two", "two"], ["Three", "three"], ["Four", "four"], ["Five", "five"], 
                   ["Six", "six"], ["Seven", "seven"], ["Eight", "eight"], ["Nine", "nine"], ["Ten", "ten"],
                   ["Eleven", "eleven"], ["Twelve", "twelve"]["Thirteen", "thirteen"], ["Fourteen", "fourteen"], ["Fifteen", "fifeen"], 
                   ["Sixteen", "sixteen"], ["Seventeen", "seventeen"], ["Eighteen", "eighteen"], ["Nineteen", "nineteen"], ["Twenty", "twenty"], 
                   ["Twenty one", "twenty one"], ["Twenty two", "twenty two"], ["Twenty three", "twenty three"], ["Twenty four", "twenty four"], ["Twenty five", "twenty five"], 
                   ["Twenty six", "twenty six"], ["Twenty seven", "twenty seven"], ["Twenty eight", "twenty eight"], ["Twenty nine", "twenty nine"], ["Thirty", "thirty"], 
                   ["Thirty one", "thirty one"], ["Thirty two", "thirty two"], ["Thirty three", "thirty three"], ["Thirty four", "thirty four"], ["Thirty five", "thirty five"], 
                   ["Thirty six", "thirty six"], ["Thirty seven", "thirty seven"], ["Thirty eight", "thirty eight"], ["Thirty nine", "thirty nine"], ["Fourty", "fourty"], 
                   ["Fourty one", "fourty one"], ["Fourty two", "fourty two"], ["Fourty three", "fourty three"], ["Fourty four", "fourty four"], ["Fourty five", "fourty five"], 
                   ["Fourty six", "fourty six"], ["Fourty seven", "fourty seven"], ["Fourty eight", "fourty eight"], ["Fourty nine", "fourty nine"], ["Fifty", "fifty"], 
                   ["Fifty one", "fifty one"], ["Fifty two", "fifty two"], ["Fifty three", "fifty three"], ["Fifty four", "fifty four"], ["Fifty five", "fifty five"], 
                   ["Fifty six", "fifty six"], ["Fifty seven", "fifty seven"], ["Fifty eight", "fifty eight"], ["Fifty nine", "fifty nine"]]; 

function initGlobalVars()
{
  gameState=0;
}
/* This function runs once the page is loaded, but appMobi is not yet active */
var init = function(){

    canvas = document.getElementById('clockCanvas');
    ctx = canvas.getContext('2d');

    canvas.width = areaWidth;
    canvas.height = areaHeight;
    // var width = canvas.width;
    // var height = canvas.height;

    clockImage = new Image();
    clockImage.src = 'images/cface.png';
    //initGlobalVars();
    if(clockTimer == null){
        clockTimer = window.setInterval(drawScene, 1000);
    }
};
var fini = function(){
  if(clockTimer){
    window.clearInterval(clockTimer);
    clockTimer = null;
  }
};
window.addEventListener("load",init,false);  
window.addEventListener("unload",fini,false);  

//calculations
function ringSum(val, step, minVal, maxVal)
{
  val=val+step;
  if (val < minVal) val = maxVal;
  else if (val > maxVal) val = minVal;
  return val;
}

//
function updateMessageLine()
{
//Game state. 0 - initial value; 1 - game in progress; 2 - Victory; 3 - Loose the game
  if (gameState == 0)
  {
      $('#pressKey').removeClass('hidden');
      $('#pressKey').addClass('shown_inline');
//      $('#lost').removeClass('shown');
//      $('#lost').addClass('hidden');
//      $('#won').removeClass('shown');
//      $('#won').addClass('hidden');
//      $('#statusPanel').removeClass('shown');
//      $('#statusPanel').addClass('hidden');
  }
  else if (gameState == 1)
  {
      $('#pressKey').removeClass('shown_inline');
      $('#pressKey').addClass('hidden');
//      $('#lost').removeClass('shown');
//      $('#lost').addClass('hidden');
//      $('#won').removeClass('shown');
//      $('#won').addClass('hidden');
      $('#statusPanel').removeClass('hidden');
      $('#statusPanel').addClass('shown');
  } /*else if (gameActive == 2)
  {
      $('#pressKey').removeClass('hidden');
      $('#pressKey').addClass('shown');
      $('#won').removeClass('hidden');
      $('#won').addClass('shown');
  } else if (gameActive == 3)
  {
      $('#pressKey').removeClass('hidden');
      $('#pressKey').addClass('shown');
      $('#lost').removeClass('hidden');
      $('#lost').addClass('shown');
  } */

}


// draw functions :
function clear() { // clear canvas function
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

function drawScene()
{ // main drawScene function
    var date = new Date();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();
    hours = hours > 12 ? hours - 12 : hours;
//    var hour = hours + minutes / 60;
//    var minute = minutes + seconds / 60;
    adjustSaveAndDrawClock(hours, minutes, seconds);
}
function randVal(first, last)
{
    return Math.floor(Math.random()*(last+1-first)+first);
}
function saveClock(hours, minutes, seconds)
{
    curHour = hours;
    curMin = minutes;
    curSec = seconds;

}
function adjustSaveAndDrawClock(hours, minutes, seconds)
{
    var hour = hours + minutes / 60;
    var minute = minutes;
    if (seconds != -1) minute += seconds / 60;

    saveClock(hours, minutes, seconds);
    drawClock(hour, minute, seconds)

}

function drawHour(theta)
{
    ctx.save();
    ctx.rotate(theta);
    ctx.beginPath();
    ctx.moveTo(-15, -5);
    ctx.lineTo(-15, 5);
    ctx.lineTo(clockRadius * 0.5, 1);
    ctx.lineTo(clockRadius * 0.5, -1);
    ctx.fillStyle = '#f00';
    ctx.fill();
    ctx.restore();
}
function drawMinute(theta)
{
    ctx.save();
    ctx.rotate(theta);
    ctx.beginPath();
    ctx.moveTo(-15, -4);
    ctx.lineTo(-15, 4);
    ctx.lineTo(clockRadius * 0.8, 1);
    ctx.lineTo(clockRadius * 0.8, -1);
    ctx.fillStyle = '#00f';
    ctx.fill();
    ctx.restore();
}

function drawSecod(theta)
{
    ctx.save();
    ctx.rotate(theta);
    ctx.beginPath();
    ctx.moveTo(-15, -3);
    ctx.lineTo(-15, 3);
    ctx.lineTo(clockRadius * 0.9, 1);
    ctx.lineTo(clockRadius * 0.9, -1);
    ctx.fillStyle = '#0f0';
    ctx.fill();
    ctx.restore();
}

function drawClock(hour, minute, seconds)
{ 

    // main drawScene function
    clear(); // clear canvas
    // save current context
    ctx.save();
    // draw clock image (as background)
    ctx.drawImage(clockImage, 0, 0, 500, 500);
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.beginPath();
    // draw numbers
    ctx.font = '36px Arial';
    ctx.fillStyle = '#000';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (var n = 1; n <= 12; n++) {
        var theta = (n - 3) * (Math.PI * 2) / 12;
        var x = clockRadius * 0.7 * Math.cos(theta);
        var y = clockRadius * 0.7 * Math.sin(theta);
        ctx.fillText(n, x, y);
    }
    // draw hour
    var theta = (hour - 3) * 2 * Math.PI / 12;
    drawHour(theta);

    // draw minute
    var theta = (minute - 15) * 2 * Math.PI / 60;
    drawMinute(theta);
    
    if (seconds != -1)
    {
        // draw second
        var theta = (seconds - 15) * 2 * Math.PI / 60;
        drawSecond(theta);

    }
}

function startNewGame()
{
    //moving arrows around
    gameState=1;
    updateMessageLine();
    
    if(clockTimer){
       window.clearInterval(clockTimer);
       clockTimer = null;
    }
    var endHour=randVal(0,59);
    var stepHour=randVal(0,1) ? 1 : -1;

    var endMin=randVal(0,59);
    var stepMin=randVal(0,1) ? 1 : -1;
    
    var endSec=randVal(0,59);
    var stepSec=randVal(0,1) ? 1 : -1;

    var hour = curHour;
    var minute = curMin;
    var second = curSec;

    hour = hour*5;
//    minute = minute + second / 60;

/*    curHour = Math.floor(endHour/5);
    curMin = endMin;
    curSec = endSec;
*/
//    endHour = endHour + endMin / 60;
//    endMin = endMin + endSec / 60;

    var hourCircleDone = false;    
    var minCircleDone = false;    
    var secCircleDone = false;
       
    var aim = 1;
    var interval = 50;
    while (!hourCircleDone || !minCircleDone || !secCircleDone || hour!=endHour || minute != endMin || second != endSec)
    {
        if ((!hourCircleDone || hour!=endHour) /*&& ((aim%3)==0)*/) {if (hour == endHour)hourCircleDone=true; hour=ringSum(hour,stepHour, 0 , 60-stepHour);}
        if ((!minCircleDone || minute!=endMin) /*&& ((aim%2)==0)*/) {if (minute == endMin)minCircleDone=true;minute=ringSum(minute,stepMin/2, 0 , 60-stepMin);}
        if (!secCircleDone || second!=endSec) {if (second == endSec)secCircleDone=true;second=ringSum(second,stepSec/4, 0 , 60-stepSec);}
        setTimeout(drawClock, interval, hour/5+hour/60, minute, second);
        interval += 5;
        //if (aim==0) break;
        aim=aim+1;
//        sleep(100);
    } 
    /*if(clockTimer){
       window.clearInterval(clockTimer);
       clockTimer = null;
    } */
    //sleep(1000);   
    setTimeout(adjustSaveAndDrawClock, interval, hour/5, minute, /*second*/-1);

    hour = randVal(0,11);
    minute = randVal(0,59);
    second = -1;
    
    var mode = 0;
    var wordMode = 0;
    if (minute > 0)
    {
      mode = randVal(0,1);
    }
    if (((mode ==0) && (minute == 15 || minute == 30 || minute == 45)) || ((mode == 0) && (minute == 15 || minute == 30))) wordMode = randVal(0, 5);
 
    var hourStr="";
    var direction = (mode == 0 || minute < 30) ? 0 : 1; // 0 - past, 1- to
    if (mode == 1 && minute == 30) direction = randVal(0, 1);
    hourStr = (ringSum(hour, direction, 0, 11) == 0) ? numToStr[12][mode] : numToStr[ringSum(hour, direction, 0, 11)][mode];
    var minStr = "";
    if (wordMode != 0)
    {
         minStr = (mode == 0) ?"a" :"A";
         minStr += (minute == 30) ? " half" : " quater"
    }
    else minStr = numToStr[(direction ? minute - 30 : minute)][(mode ? 0 : 1)];
    if (mode == 0)
    {   
        hourStr += (hour == 1) ? " hour" : " hours";
        if ( minute > 0)
        {
           //minStr += numToStr[minute][1];
           if (wordMode == 0) minStr += (minute == 1) ? " minute" : " minutes"
           $('#time').text("time: "+ hourStr+" and "+ minStr);
        }
    }
    else
    {
           $('#time').text("time: "+ minStr + ( direction ? " to " : " past ") + hourStr);
    }
//    saveClock(hour, minute, second);
//    adjustSaveAndDrawClock(hour/5, minute, second);
    
    //make the circle
}

function moveArrows()
{
  
}

$(document).keydown(function(e){
  if (gameState == 0){
     startNewGame();
  }
});

$(document).ready(function() {
    $("#clockPanel").mousedown(function(e){
    if (gameState==1){                                                                 
        gameState=2;
        alert("Angle = "+String(Math.atan((e.offsetX - areaHalfWidth)/(e.offsetY - areaHalfHeight))*180/Math.PI));
        /*alert("X="+String(e.screenX)+"; Y="+ String(e.screenY));
        alert("X="+String(e.pageX)+"; Y="+ String(e.pageY));
        alert("X="+String(e.offsetX)+"; Y="+ String(e.offsetY));
        alert("X="+String(e.layerX)+"; Y="+ String(e.layerY));
        */
    }  
});});

$(document).mousemove(function(e){
  if (gameState==2)     
    moveArrows();  
});
$(document).mouseup(function(e){
    if (gameState==2) gameState=1;  
});

