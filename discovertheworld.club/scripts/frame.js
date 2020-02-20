function setFrame(isEn)
{
    if (isEn == false)
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
        }
        if ( paragraphs.length==0 ){
	//IE8 case
        paragraphs = document.getElementsByTagName('DIV');
//        paragraphs = document.getElementsByTagName('P');
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
        }
        if ( paragraphs.length==0 ){
	//IE8 case
        paragraphs = document.getElementsByTagName('DIV');
//        paragraphs = document.getElementsByTagName('P');
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
$(document).ready(function() {
  if(window.parent.location.hash == '#home') { 
       setFrame(true);
  }
  else if(window.parent.location.hash == '#home_ru') { 
       setFrame(false);
  }
  else if(window.parent.location.hash == '#spain') { 
       setFrame(false);
  }
  else if(window.parent.location.hash == '#spain_en') { 
       setFrame(true);
  }
  else if(window.parent.location.hash == '#egypt') { 
       setFrame(false);
  }
  else if(window.parent.location.hash == '#egypt_en') { 
       setFrame(true);
  }
  else if(window.parent.location.hash == '#california') { 
       setFrame(false);
  }
  else if(window.parent.location.hash == '#california_en') { 
       setFrame(true);
  }
  else if(window.parent.location.hash == '#hawaii') { 
       setFrame(false);
  }
  else if(window.parent.location.hash == '#hawaii_en') { 
       setFrame(true);
  }
  else if(window.parent.location.hash == '#cyprus') { 
       setFrame(false);
  }
  else if(window.parent.location.hash == '#cyprus_en') { 
       setFrame(true);
  }
  else if(window.parent.location.hash == '#loo') { 
       setFrame(false);
  }
  else if(window.parent.location.hash == '#loo_en') { 
       setFrame(true);
  }
  else
  {
    var url = window.location.href;
    if(url.substr(url.length - 3) == 'htm') {
       if (url.substr(url.length - 14) == 'Spain_2012.htm'){
         location.replace("https://discovertheworld.club/#spain_en");  
       } else if (url.substr(url.length - 14) == 'Egypt_2013.htm'){
         location.replace("https://discovertheworld.club/#egypt_en");  
       } else if (url.substr(url.length - 19) == 'California_2013.htm'){
         location.replace("https://discovertheworld.club/#california_en");  
       } else if (url.substr(url.length - 15) == 'Hawaii_2014.htm'){
         location.replace("https://discovertheworld.club/#hawaii_en");
       } else if (url.substr(url.length - 20) == 'Cyprus_2014_2015.htm'){
         location.replace("https://discovertheworld.club/#cyprus_en");
       } else if (url.substr(url.length - 12) == 'Loo_2015.htm'){
         location.replace("https://discovertheworld.club/#loo_en");
       }
    }  
  }
});
