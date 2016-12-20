/* ╔════════════════════════════════════════════════════════════════════╗
   ║ at_document_start                                                  ║
   ╟────────────────────────────────────────────────────────────────────╢
   ║ File's content is injected after any files from CSS,               ║
   ║ - but before any other DOM is constructed,                         ║
   ║ - or any other script is run.                                      ║
   ╚════════════════════════════════════════════════════════════════════╝
░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ */


NodeList.prototype.forEach  = Array.prototype.forEach;


query = 'a[href]:not([href=""]):not([href^="#"]):not([href*="javascript:"]):not([href*="text/"]):not([href*="void("]):not([done-realurl])';  
        /*
        'a[href*="/wp-"][href*="/download.php"][href*="id="]:not([data-work-realurl])'  //WordPress download-monitor only.
        */


function head(url, is_with_credentials, done_callback){
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function(){
    if(XMLHttpRequest.DONE !== xhr.readyState)                        return;
    if("string" !== typeof xhr.responseURL || "" === xhr.responseURL) return;
    done_callback(xhr);
  };
  xhr.withCredentials = is_with_credentials; /* safe. will be used for same hostname */
  xhr.open('HEAD', url, true);
  xhr.send();
}


function action(){ "use strict";
  var elements = document.querySelectorAll(query);
  if(null === elements || 0 === elements.length) return;
  try{chrome.runtime.sendMessage({badge_data: elements.length});}catch(err){} /* update extension's badge. */

  elements.forEach(function(element){
    element.setAttribute("done-realurl","");

    if("https:" === document.location.protocol && "https:" !== element.protocol) return;  /* play safe, don't access insecure-locations from secure location */

    head(element.href, (document.location.hostname === element.hostname) /*play safe only allow credentials for same domain*/, function(xhr){
      element.href = xhr.responseURL;
      element.setAttribute("done-realurl","success");
      
      /*safe and useful. TODO:future upgrades. */
      element.setAttribute("data-realurl-contentlength",  (xhr.getResponseHeader("Content-Length") || ""));
      element.setAttribute("data-realurl-lastmodified",   (xhr.getResponseHeader("Last-Modified")  || ""));
      element.setAttribute("data-realurl-contenttype",    (xhr.getResponseHeader("Content-Type")   || ""));
    });
  });
}


action();
setInterval(action, 500); /*only available in pages having JavaScript support*/
