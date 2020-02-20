/*import "ball.js"*/
     
var currentBlog = ""
var currentLang = 1; //0- UNDEF; 1-EN;2-RU
function setCurrentGames()
{
    /*$('#home').removeClass('current');
    $('#spain').removeClass('current');
    $('#games').addClass('current'); 
      */
    $('#lang_rus').addClass('hidden');
    $('#lang_en').addClass('hidden');
    $('#lang_en').removeClass('shown');
    $('#lang_rus').removeClass('shown');
    showContext("games.html");
}
function setCurrentHome(lang, reload)
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
    setCurrentBlog(lang, reload)

}

function setCurrentSpain(lang, reload)
{
    currentBlog = "Spain_2012.htm"
    setCurrentBlog(lang, reload)
}
function setCurrentEgypt(lang, reload)
{
    currentBlog = "Egypt_2013.htm"
    setCurrentBlog(lang, reload)
}
function setCurrentCalifornia(lang, reload)
{
    currentBlog = "California_2013.htm"
    setCurrentBlog(lang, reload)
}
function setCurrentHawaii(lang, reload)
{
    currentBlog = "Hawaii_2014.htm"
    setCurrentBlog(lang, reload)
}
function setCurrentCyprus(lang, reload)
{
    currentBlog = "Cyprus_2014_2015.htm"
    setCurrentBlog(lang, reload)
}
function setCurrentLoo(lang, reload)
{                         
    currentBlog = "Loo_2015.htm"
    setCurrentBlog(lang, reload)
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

function setCurrentBlog(lang, reload)
{
    //$('#games').removeClass('current');
    //$('#home').removeClass('current');
//    $('#spain').addClass('current'); 
    if (lang != 0)  currentLang = lang;

    if (reload /*|| !document.getElementById("blog_frame")*/){
        showContext(currentBlog);
        reload=true;
    }
    if (currentLang == 2)
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
         setBlogFrame(currentLang);
//    alert( "after spain frame" ); 
     //document.getElementById("menu-blog-items").style.display = 'none';
    }
    //collapseMenu("menu-blog-items", "menu-blog");
}
function setBlogFrame(lang)
{
    //var blogFrame = document.getElementById('content').contentWindow;                                                                                                     
    if (lang == 2)
    {
        var paragraphs = document.getElementsByName('english_text');
        for(var i=0; i<paragraphs.length; i++){
            var node = paragraphs[i];
            node.setAttribute('class', 'hidden');
        }
        paragraphs = document.getElementsByName('russian_text');
        for(var i=0; i<paragraphs.length; i++){
            var node = paragraphs[i];
            node.setAttribute('class', 'shown');
//            node.show();
        }
        if ( paragraphs.length==0 ){
	paragraphs = document.getElementsByTagName('DIV');
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
        var paragraphs = document.getElementsByName('russian_text');
        for(var i=0; i<paragraphs.length; i++){
            var node = paragraphs[i];
            node.setAttribute('class', 'hidden');
        }
        paragraphs = document.getElementsByName('english_text');
        for(var i=0; i<paragraphs.length; i++){
            var node = paragraphs[i];
            node.setAttribute('class', 'shown');
//            node.show();
        }
        if ( paragraphs.length==0 ){
	paragraphs = document.getElementsByTagName('DIV');
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
            if ($(html).title) document.title = $(html).title.text;
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
  /*else if(location.hash == '#home') { 
    //    setCurrentHome();
       lang_rus.children[0].href = '#';
       lang_en.children[0].href = '#home_ru';
       setCurrentHome(1, true);
  //      setCurrentHome();
  }*/
  else if(location.hash == '#home_ru') { 
//        setCurrentHome();
       lang_rus.children[0].href = '#home';
       lang_en.children[0].href = '#home_ru';
       setCurrentHome(2, true);
//       spain_frame.print();
  }
  else if(location.hash == '#spain') { 
    //    setCurrentHome();
       lang_rus.children[0].href = '#spain_en';
       lang_en.children[0].href = '#spain';
       setCurrentSpain(2, true);
  //      setCurrentHome();
  }
  else if(location.hash == '#spain_en') { 
//        setCurrentHome();
       lang_rus.children[0].href = '#spain_en';
       lang_en.children[0].href = '#spain';
       setCurrentSpain(1, true);
//       spain_frame.print();
  }
  else if(location.hash == '#egypt') { 
       lang_rus.children[0].href = '#egypt_en';
       lang_en.children[0].href = '#egypt';
       setCurrentEgypt(2, true);
  }
  else if(location.hash == '#egypt_en') { 
       lang_rus.children[0].href = '#egypt_en';
       lang_en.children[0].href = '#egypt';
       setCurrentEgypt(1, true);
  }
  else if(location.hash == '#california') { 
       lang_rus.children[0].href = '#california_en';
       lang_en.children[0].href = '#california';
       setCurrentCalifornia(2, true);
  }
  else if(location.hash == '#california_en') { 
       lang_rus.children[0].href = '#california_en';
       lang_en.children[0].href = '#california';
       setCurrentCalifornia(1, true);
  }
  else if(location.hash == '#hawaii') { 
       lang_rus.children[0].href = '#hawaii_en';
       lang_en.children[0].href = '#hawaii';
       setCurrentHawaii(2, true);
  }
  else if(location.hash == '#hawaii_en') { 
       lang_rus.children[0].href = '#hawaii_en';
       lang_en.children[0].href = '#hawaii';
       setCurrentHawaii(1, true);
  }
  else if(location.hash == '#cyprus') { 
       lang_rus.children[0].href = '#cyprus_en';
       lang_en.children[0].href = '#cyprus';
       setCurrentCyprus(2, true);
  }
  else if(location.hash == '#cyprus_en') { 
       lang_rus.children[0].href = '#cyprus_en';
       lang_en.children[0].href = '#cyprus';
       setCurrentCyprus(1, true);
  }
  else if(location.hash == '#loo') { 
       lang_rus.children[0].href = '#loo_en';
       lang_en.children[0].href = '#loo';
       setCurrentLoo(2, true);
  }
  else if(location.hash == '#loo_en') { 
       lang_rus.children[0].href = '#loo_en';
       lang_en.children[0].href = '#loo';
       setCurrentLoo(1, true);
  }
  else {
        window.location.hash=(currentLang == 1)?'#home':'#home_ru';
        lang_rus.children[0].href = '#home';
        lang_en.children[0].href = '#home_ru';
        setCurrentHome(currentLang, true);
  }
  $('#games').click(function(){
        setCurrentGames();
  });
  $("#home").click(function(){
    if(history.pushState) {
        history.pushState(null, null, (currentLang == 1)?'#home':'#home_ru');
    }
    else {
        location.hash = (currentLang == 1)?'#home':'#home_ru';
    } 
    //window.location.hash=(currentLang == 1)?'#home':'#home_ru';
        lang_rus.children[0].href = '#home';
    lang_en.children[0].href = '#home_ru';
    setCurrentHome(currentLang, true);
  });
  $("#spain").click(function(){
       window.location.hash=(currentLang == 1)?'#spain_en':'#spain';
       lang_rus.children[0].href = '#spain_en';
       lang_en.children[0].href = '#spain';
       setCurrentSpain(currentLang, true);
       //$(this).off('hover');
       //$(this).unbind();
       //$(this).parent().slideUp("fast");
       //$(this).parent().slideDown("fast");
       //$(this).style.display='';
  });
  $("#egypt").click(function(){
       window.location.hash=(currentLang == 1)?'#egypt_en':'#egypt';
       lang_rus.children[0].href = '#egypt_en';
       lang_en.children[0].href = '#egypt';
       setCurrentEgypt(currentLang, true);
  });
  $("#california").click(function(){
       window.location.hash=(currentLang == 1)?'#california_en':'#california';
       lang_rus.children[0].href = '#california_en';
       lang_en.children[0].href = '#california';
       setCurrentCalifornia(currentLang, true);
  });
  $("#hawaii").click(function(){
       window.location.hash=(currentLang == 1)?'#hawaii_en':'#hawaii';
       lang_rus.children[0].href = '#hawaii_en';
       lang_en.children[0].href = '#hawaii';
       setCurrentHawaii(currentLang, true);
  });
  $("#cyprus").click(function(){
       window.location.hash=(currentLang == 1)?'#cyprus_en':'#cyprus';
       lang_rus.children[0].href = '#cyprus_en';
       lang_en.children[0].href = '#cyprus';
       setCurrentCyprus(currentLang, true);
  });
  $("#loo").click(function(){
       window.location.hash=(currentLang == 1)?'#loo_en':'#loo';
       lang_rus.children[0].href = '#loo_en';
       lang_en.children[0].href = '#loo';
       setCurrentLoo(currentLang, true);
  });
  $("#lang_rus").click(function(){
    event.preventDefault();
    /*if (currentBlog=="home.html"){
        if(history.pushState) {
            history.pushState(null, null, '#home');
        }
        else {
            location.hash = '#home';
        }
    }*/ 
    setCurrentBlog(1, false);
  });
  $("#lang_en").click(function(){
    setCurrentBlog(2, false);
  });
});
