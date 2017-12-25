/**
 * Add URL sources as download links to the popup page
 * @param   Sources   URL sources from udemy page
 */
function AddSourcesToWebpage(Sources, Filename) {
  // iterate on each source and create download link
  Sources.forEach(function (SourceObject) {
    var LinksDiv = document.getElementById("links");

    var DownloadLink = document.createElement("a");
    DownloadLink.innerHTML = SourceObject.label;
    DownloadLink.href = SourceObject.src;
    DownloadLink.setAttribute("download", Filename); // TODO checkout how to make this work

    LinksDiv.appendChild(DownloadLink);
    LinksDiv.innerHTML += "&nbsp;";
  }); // end of Sources.forEach()
}



/**
 * Send message to content script asking for videos.
 */
function IntentGetVideos() {
   chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
     var activeTab = tabs[0];

     // send message asking for videos
     chrome.tabs.sendMessage(activeTab.id, { Intent: "GetVideos"});
  });
}


// ################# MAIN ####################
/**
 * Trigger message sending
 */
document.addEventListener("DOMContentLoaded", function() {
 // ask content page for videos
 IntentGetVideos();

 // if it sends video links
 chrome.runtime.onMessage.addListener(
   function(request, sender, sendResponse) {
       // if recieved videos from content script
       if (
         request.Sources && request.Intent &&
         request.Intent === "SendVideos"
       ) {
         // hide loading icon
         document.getElementById("loading-icon").style.display = "none";
         // add url sources to webpage.
         AddSourcesToWebpage(request.Sources, request.Filename);
       }
       else {
         console.error("fails at popup.js recieve!");
       }
 }); // onMessage listener
}); //  DOMContentLoaded listener
