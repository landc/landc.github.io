// add event handler realization 
var addEvent = (function () {
  if (document.addEventListener) {
    return function (el, type, fn) {
      if (el && el.nodeName || el === window) {
        el.addEventListener(type, fn, false);
      } else if (el && el.length) {
        for (var i = 0; i < el.length; i++) {
          addEvent(el[i], type, fn);
        }
      }
    };
  } else {
    return function (el, type, fn) {
      if (el && el.nodeName || el === window) {
        el.attachEvent('on' + type, function () { return fn.call(el, window.event); });
      } else if (el && el.length) {
        for (var i = 0; i < el.length; i++) {
          addEvent(el[i], type, fn);
        }
      }
    };
  }
})();

// variables
var aLoops = []; // sound loops

// initialization
addEvent(window, 'load', function (event) {

    // load music files
    //aLoops[0] = new Audio('sound/background.ogg');
    //aLoops[0].volume = 0.3;
    aLoops[1] = new Audio('sound/button.ogg');
    aLoops[1].volume = 1.0;
    aLoops[2] = new Audio('sound/button_click.ogg');
    aLoops[2].volume = 1.0;

   // aLoops[0].addEventListener('ended', function() { 
   // loop background sound
   //     this.currentTime = 0;
   //     this.play();
   // }, false);
   // aLoops[0].play();
});

var isTouch = "ontouchstart" in document.documentElement;
/*var isTouch = true;
window.addEventListener('mousemove', function mouseMoveDetector() {
    isTouch = false;
    window.removeEventListener('mousemove', mouseMoveDetector);
});
*/
// all the buttons
var aBtns = document.querySelectorAll('#nav li');
//var aSubMenuDivs = document.querySelectorAll('#nav li .subs');

function findSubMenuParent(childNode, depth)
{
    node = null;
    for (i = 0; i <= depth; i++)
    {
        node = childNode.parentNode;
        if (node == null || node.classList.contains('subs'))
            break;
        childNode = node;
    }
    return node;
}
function isHidden(el) {
    var style = window.getComputedStyle(el);
    return (style.display === 'none');
}

// onmouseover event handler
addEvent(aBtns, 'mouseover', function (event) {
    if ( document.readyState !== 'complete' ) return;
    if (aLoops.length > 1)
    {
        aLoops[1].currentTime = 0;
        aLoops[1].play(); // play click sound
    }
    if (isTouch == false && isHidden(document.getElementById("menu-icon")) && this!=null && this.childElementCount == 2)
    {
        node = this.children[1];
        if (node.classList.contains('subs') && !node.classList.contains('open'))
            node.classList.add("open");
    }	
});

// onmouseout event handler
addEvent(aBtns, 'mouseout', function (event) {
    if (aLoops.length > 1)
    {
        aLoops[1].currentTime = 0;
        aLoops[1].pause(); // play click sound
    }
    if (isTouch == false && isHidden(document.getElementById("menu-icon")) && this!=null && this.childElementCount == 2)
    {
        node = this.children[1];
        if (node.classList.contains('subs') && node.classList.contains('open'))
            node.classList.remove("open");	
    }
});
lastClickNodeId = "";
// onclick event handler
addEvent(aBtns, 'click', function (event) {
    if (aLoops.length > 2)
    {
    aLoops[2].currentTime = 0;
    aLoops[2].play(); // play click sound
    }
    if (isHidden(document.getElementById("menu-icon")) && isTouch == false && this!=null && this.classList.contains('leaf'))
    {
        node = findSubMenuParent(this, 3);
        if (node != null)
            if (node.classList.contains('open'))
                 node.classList.remove("open");
           if (false) event.preventDefault();
        return;
    }
    //toogle = document.getElementById("menu-icon").style.display = 'none'
    if ((isTouch || !isHidden(document.getElementById("menu-icon"))) && this != null && this.childElementCount == 2)
    {
        node = this.children[1];
        if (node.classList.contains('subs')){
            if (isHidden(document.getElementById("menu-icon")) &&  lastClickNodeId != node.id){
                prevNode = document.getElementById(lastClickNodeId);
                if (prevNode && prevNode.classList.contains('open')) prevNode.classList.remove('open');
                if(!node.classList.contains('open')) node.classList.add("open");
            }
            else node.classList.toggle("open");
            lastClickNodeId = node.id;
        }
    }
});
// onmouseup event handler
/*
addEvent(aSubMenuDivs, 'mouseover', function (event) {
    if ($(this)!=null && $(this).classList.contains('subs') && !$(this).classList.contains('mobileactive'))
        $(this).classList.add("mobileactive");	
});
addEvent(aSubMenuDivs, 'mouseout', function (event) {
    if ($(this)!=null && $(this).classList.contains('subs') && $(this).classList.contains('mobileactive'))
        $(this).classList.remove("mobileactive");	
});
*/
/*
// onmouseup event handler
addEvent(aSubMenuDivs, 'mousedown', function (event) {
    $(this).classList.add("pressed");	
});
*/



