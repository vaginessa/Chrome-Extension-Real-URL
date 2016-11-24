/* ╔════════════════════════════════════════════════════════════════════╗
   ║ at_document_start                                                  ║
   ╟────────────────────────────────────────────────────────────────────╢
   ║ File's content is injected after any files from CSS,               ║
   ║ - but before any other DOM is constructed,                         ║
   ║ - or any other script is run.                                      ║
   ╚════════════════════════════════════════════════════════════════════╝
░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ */

(function(window, document, query, elements){
  "use strict";

  window.NodeList.prototype.filter  = window.Array.prototype.filter;
  window.NodeList.prototype.forEach = window.Array.prototype.forEach;

  function action(){
    elements = document.querySelectorAll(query);
    if(null === elements || 0 === elements.length) return;

    try{chrome.runtime.sendMessage({badge_data: elements.length});}catch(err){} /* update extension's badge. */

    elements.forEach(function(element){
      element.setAttribute("data-work-realurl","");

      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function(){
                                 if(XMLHttpRequest.DONE !== xhr.readyState)  return;
                                 if(0 === xhr.responseURL.length)            return;
                                 element.href = xhr.responseURL;
                                 element.removeAttribute("data-work-realurl");

                                 /*bonus data*/
                                 if(string === typeof xhr.getResponseHeader("Content-Length")) element.setAttribute("data-header-contentlength", xhr.getResponseHeader("Content-Length") );
                                 if(string === typeof xhr.getResponseHeader("Last-Modified"))  element.setAttribute("data-header-lastmodified",  xhr.getResponseHeader("Last-Modified")  );
                                 if(string === typeof xhr.getResponseHeader("Content-Type"))   element.setAttribute("data-header-contenttype",   xhr.getResponseHeader("Content-Type")   );
                               };
      xhr.withCredentials = true;
      xhr.open('HEAD', element.href, true);
      xhr.send();
    }
  }

  /* MAIN */
  window.setTimeout( action,  80);    /* run ASAP      */
  window.setInterval(action, 800);    /* run on repeat */
}(
  self
, self.document
,
  ''
  + 'a[href*="/wp-"][href*="/download.php"][href*="id="]:not([data-work-realurl])' /*WordPress download-monitor*/
  + ''
, null
));
