/*import "ball.js"*/
     
var currentBlog = "home.html"
function setCurrentGames()
{
    $('#home').removeClass('current');
    $('#spain').removeClass('current');
    $('#games').addClass('current'); 

    $('#lang_rus').addClass('hidden');
    $('#lang_en').addClass('hidden');
    $('#lang_en').removeClass('shown');
    $('#lang_rus').removeClass('shown');
    showContext("games.html");
}
function setCurrentHome(isEn, reload)
{
/*    $('#games').removeClass('current');
    $('#spain').removeClass('current');
    $('#home').addClass('current'); 

    $('#lang_rus').addClass('shown');
    $('#lang_en').addClass('hidden');
    $('#lang_en').removeClass('shown');
    $('#lang_rus').removeClass('hidden');
    showContext("home.html");
*/
    currentBlog = "home.html"
    setCurrentBlog(isEn, reload)

}

function setCurrentSpain(isEn, reload)
{
    currentBlog = "Spain_2012.htm"
    setCurrentBlog(isEn, reload)
}
function setCurrentEgypt(isEn, reload)
{
    currentBlog = "Egypt_2013.htm"
    setCurrentBlog(isEn, reload)
}
function setCurrentCalifornia(isEn, reload)
{
    currentBlog = "California_2013.htm"
    setCurrentBlog(isEn, reload)
}
function setCurrentHawaii(isEn, reload)
{
    currentBlog = "Hawaii_2014.htm"
    setCurrentBlog(isEn, reload)
}
function setCurrentCyprus(isEn, reload)
{
    currentBlog = "Cyprus_2014_2015.htm"
    setCurrentBlog(isEn, reload)
}
function setCurrentLoo(isEn, reload)
{
    currentBlog = "Loo_2015.htm"
    setCurrentBlog(isEn, reload)
}
function pressBarMenu(id, id2) {
   var n = document.getElementById(id);
   var n2 = document.getElementById(id2);
   n2.classList.toggle("pressed");
   if (n2.classList.contains("pressed"))
   {
      n.classList.add("mobileactive"); 
   }
   else
   {
      n.classList.remove("mobileactive"); 
   }
}
function collapseMenu(id, id2) {
   var n = document.getElementById(id);
   var n2 = document.getElementById(id2);
   //n2.classList.toggle("pressed");
   if (n2.classList.contains("pressed"))
   {
      n2.classList.toggle("pressed"); 
   }
   n.classList.remove("mobileactive"); 
}

function setCurrentBlog(isEn, reload)
{
    $('#games').removeClass('current');
    //$('#home').removeClass('current');
//    $('#spain').addClass('current'); 

    if (reload || !document.getElementById("blog_frame")){
        showContext(currentBlog);
        reload=true;
    }

    if (isEn == false)
    {
    	$('#lang_rus').removeClass('hidden');
	$('#lang_en').removeClass('shown');
	$('#lang_en').addClass('hidden');
    	$('#lang_rus').addClass('shown');
    }
    else
    {
    	$('#lang_en').removeClass('hidden');
	$('#lang_rus').removeClass('shown');
    	$('#lang_rus').addClass('hidden');
	$('#lang_en').addClass('shown');
    } 
//    alert( "before spain frame" ); 
    if (!reload)
    {
         setBlogFrame(isEn);
//    alert( "after spain frame" ); 
     //document.getElementById("menu-blog-items").style.display = 'none';
    }
    //collapseMenu("menu-blog-items", "menu-blog");
}
function setBlogFrame(isEn)
{
    var blogFrame = document.getElementById('blog_frame').contentWindow;                                                                                                     
    if (isEn == false)
    {
        var paragraphs = blogFrame.document.getElementsByName('english_text');
        for(var i=0; i<paragraphs.length; i++){
            var node = paragraphs[i];
            node.setAttribute('class', 'hidden');
        }
        paragraphs = blogFrame.document.getElementsByName('russian_text');
        for(var i=0; i<paragraphs.length; i++){
            var node = paragraphs[i];
            node.setAttribute('class', 'shown');
//            node.show();
        }
        if ( paragraphs.length==0 ){
	paragraphs = blogFrame.document.getElementsByTagName('DIV');
 	for(var i=0; i<paragraphs.length; i++){
            var node = paragraphs[i];
            if(node){
               if (node.name=="english_text"){
                   node.setAttribute('class', 'hidden');
               } else if (node.name=="russian_text"){
                   node.setAttribute('class', 'shown');
               }
           }
        }
        }
    }
    else
    {
        var paragraphs = blogFrame.document.getElementsByName('russian_text');
        for(var i=0; i<paragraphs.length; i++){
            var node = paragraphs[i];
            node.setAttribute('class', 'hidden');
        }
        paragraphs = blogFrame.document.getElementsByName('english_text');
        for(var i=0; i<paragraphs.length; i++){
            var node = paragraphs[i];
            node.setAttribute('class', 'shown');
//            node.show();
        }
        if ( paragraphs.length==0 ){
	paragraphs = blogFrame.document.getElementsByTagName('DIV');
 	for(var i=0; i<paragraphs.length; i++){
            var node = paragraphs[i];
            if(node){
               if (node.name=="english_text"){
                   node.setAttribute('class', 'shown');
               } else if (node.name=="russian_text"){
                     node.setAttribute('class', 'hidden');

               }
           }
        }
        }
    }
}

/*function isHidden(el) {
    var style = window.getComputedStyle(el);
    return (style.display === 'none');
}
*/
function showContext(context)
{
     jQuery.support.cors = true;

     $.ajax({
	url:context,
	type: "GET",
        cache:false,
        dataType : "html",
        success:function(html){

//            alert( html ); // shows whole dom

//            alert( $(html).find('#wrapper').html() ); // returns null

            $("#dvbodycontainer").html(html);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert(errorThrown);
          }
    }).responseText;
    
    //remove all menu dropdown if pressed
    //document.getElementById("menu-icon").classList.remove("pressed");
    if (!isHidden(document.getElementById("menu-icon"))) collapseMenu("nav", "menu-icon");
    
}

$(document).ready(function(){
  
  /*if (document.getElementById("menu-icon").style.display == 'none')
  {
      document.getElementById("nav").classList.add("mobileactive");
  }*/
  if(location.hash == '#games') {
     setCurrentGames();  
  }
  else if(location.hash == '#home') { 
    //    setCurrentHome();
       lang_rus.children[0].href = '#home';
       lang_en.children[0].href = '#home_ru';
       setCurrentHome(true, true);
  //      setCurrentHome();
  }
  else if(location.hash == '#home_ru') { 
//        setCurrentHome();
       lang_rus.children[0].href = '#home';
       lang_en.children[0].href = '#home_ru';
       setCurrentHome(false, true);
//       spain_frame.print();
  }
  else if(location.hash == '#spain') { 
    //    setCurrentHome();
       lang_rus.children[0].href = '#spain_en';
       lang_en.children[0].href = '#spain';
       setCurrentSpain(false, true);
  //      setCurrentHome();
  }
  else if(location.hash == '#spain_en') { 
//        setCurrentHome();
       lang_rus.children[0].href = '#spain_en';
       lang_en.children[0].href = '#spain';
       setCurrentSpain(true, true);
//       spain_frame.print();
  }
  else if(location.hash == '#egypt') { 
       lang_rus.children[0].href = '#egypt_en';
       lang_en.children[0].href = '#egypt';
       setCurrentEgypt(false, true);
  }
  else if(location.hash == '#egypt_en') { 
       lang_rus.children[0].href = '#egypt_en';
       lang_en.children[0].href = '#egypt';
       setCurrentEgypt(true, true);
  }
  else if(location.hash == '#california') { 
       lang_rus.children[0].href = '#california_en';
       lang_en.children[0].href = '#california';
       setCurrentCalifornia(false, true);
  }
  else if(location.hash == '#california_en') { 
       lang_rus.children[0].href = '#california_en';
       lang_en.children[0].href = '#california';
       setCurrentCalifornia(true, true);
  }
  else if(location.hash == '#hawaii') { 
       lang_rus.children[0].href = '#hawaii_en';
       lang_en.children[0].href = '#hawaii';
       setCurrentHawaii(false, true);
  }
  else if(location.hash == '#hawaii_en') { 
       lang_rus.children[0].href = '#hawaii_en';
       lang_en.children[0].href = '#hawaii';
       setCurrentHawaii(true, true);
  }
  else if(location.hash == '#cyprus') { 
       lang_rus.children[0].href = '#cyprus_en';
       lang_en.children[0].href = '#cyprus';
       setCurrentCyprus(false, true);
  }
  else if(location.hash == '#cyprus_en') { 
       lang_rus.children[0].href = '#cyprus_en';
       lang_en.children[0].href = '#cyprus';
       setCurrentCyprus(true, true);
  }
  else if(location.hash == '#loo') { 
       lang_rus.children[0].href = '#loo_en';
       lang_en.children[0].href = '#loo';
       setCurrentLoo(false, true);
  }
  else if(location.hash == '#loo_en') { 
       lang_rus.children[0].href = '#loo_en';
       lang_en.children[0].href = '#loo';
       setCurrentLoo(true, true);
  }
  else {
        window.location.hash='#home';
        setCurrentHome(true, true);
  }
  $('#games').click(function(){
        setCurrentGames();
  });
  $("#home").click(function(){
        lang_rus.children[0].href = '#home';
        lang_en.children[0].href = '#home_ru';
        setCurrentHome(true, true);
  });
  $("#spain").click(function(){
       lang_rus.children[0].href = '#spain_en';
       lang_en.children[0].href = '#spain';
       setCurrentSpain(true, true);
       //$(this).off('hover');
       //$(this).unbind();
       //$(this).parent().slideUp("fast");
       //$(this).parent().slideDown("fast");
       //$(this).style.display='';
  });
  $("#egypt").click(function(){
       lang_rus.children[0].href = '#egypt_en';
       lang_en.children[0].href = '#egypt';
       setCurrentEgypt(true, true);
  });
  $("#california").click(function(){
       lang_rus.children[0].href = '#california_en';
       lang_en.children[0].href = '#california';
       setCurrentCalifornia(true, true);
  });
  $("#hawaii").click(function(){
       lang_rus.children[0].href = '#hawaii_en';
       lang_en.children[0].href = '#hawaii';
       setCurrentHawaii(true, true);
  });
  $("#cyprus").click(function(){
       lang_rus.children[0].href = '#cyprus_en';
       lang_en.children[0].href = '#cyprus';
       setCurrentCyprus(true, true);
  });
  $("#loo").click(function(){
       lang_rus.children[0].href = '#loo_en';
       lang_en.children[0].href = '#loo';
       setCurrentLoo(true, true);
  });
  $("#lang_rus").click(function(){
    setCurrentBlog(true, false);
  });
  $("#lang_en").click(function(){
      setCurrentBlog(false, false);
  });
});
