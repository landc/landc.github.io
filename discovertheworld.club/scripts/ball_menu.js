var ball_timer = null;
/* This function runs once the page is loaded, but appMobi is not yet active */
var init = function(){

/*    if(ball_timer == null){
        ball_timer = window.setInterval('updateCanvas();', 30);
    }*/
};
var fini = function(){
    if(ball_timer){
       window.clearInterval(ball_timer);
       ball_timer = null;
    }
};
window.addEventListener("load",init,false);  
window.addEventListener("unload",fini,false);  

/* This code prevents users from dragging the page */
var preventDefaultScroll = function(event) {
    event.preventDefault();
    window.scroll(0,0);
    return false;
};
document.addEventListener('touchmove', preventDefaultScroll, false);

/* This code is used to run as soon as appMobi activates */
var onDeviceReady=function(){
    //Size the display to 768px by 1024px
    AppMobi.display.useViewport(768,1024);
	
	//hide splash screen
	AppMobi.device.hideSplashScreen();	
};
document.addEventListener("appMobi.device.ready",onDeviceReady,false);    

/* START ACCELEROMETER SNIPPET   *****************************/

var onDeviceReadyAccel=function(){
       
    //start watching the accelerometer
   accelldiv = document.createElement('div');
   accelldiv.id = "accelerometerReadings";
   document.body.appendChild(accelldiv);
    watchAccelerometer();
}
  
document.addEventListener("appMobi.device.ready",onDeviceReadyAccel,false);    

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
    var canvas = document.getElementById('menuBallCanvas');  
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    var ctx = canvas.getContext('2d');  
    ballPosX += velocityX;
    ballPosY += velocityY;
	if ((ballPosX <= ballRadius) || (ballPosX >= canvas.width-ballRadius)) 
		velocityX *= -1;
	if ((ballPosY <= ballRadius) || (ballPosY >= canvas.height-ballRadius)) 
		velocityY *= -1;

	ctx.clearRect(0, 0, canvas.height, canvas.width);
    drawBall(ctx, ballPosX, ballPosY); 
}

$(document).ready(function(){
/*$('#startButton').click(function(){
    if(timer){
       window.clearInterval(timer);
       timer = null;
    }
    timer = window.setInterval('updateCanvas();', 25);
});
$('#stopButton').click(function(){
    if(timer){
       window.clearInterval(timer);
       timer = null;
    }
});*/
  if(ball_timer == null){
    ball_timer = window.setInterval('updateCanvas();', 30);
  }
});
