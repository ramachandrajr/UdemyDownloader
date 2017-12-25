/**
 * @helper  UnicodeToAscii
 * Replace unicode character in the first regex selection with respective ASCII character
 * @param   match         Regex matched full string
 * @param   UnicodeData   First regex selection
 */
function ReplaceUnicode(match, UnicodeData) {
  return fromCharCode(UnicodeData);
}



/**
 * @helper  GetVideoUrls
 * Replace all unicode instances in given string with Ascii characters
 * @param   Data    Unicode data
 * @return          Full Ascii data
 */
function UnicodeToAscii(Data) {
  return Data.replace(/\\u(d+)/gi, ReplaceUnicode);
}



/**
 * Get Udemy Video Urls in current page.
 * @return          All udemy video urls in the page.
 */
function GetVideoUrls() {
  // get react player
  var videoPlayer = (document.getElementsByTagName("react-video-player"))[0]
  // get URL with jibberish from react player
  var MixedUrlAndConfigData = videoPlayer.getAttribute("videojs-setup-data");
  // convert string to object
  var MixedUrlAndConfigObject = JSON.parse(UnicodeToAscii(MixedUrlAndConfigData));
  // return sources array
  return MixedUrlAndConfigObject.sources;
}


/**
 * Check if the video player dom exists, if not check every 5seconds.
 * @return          All udemy video urls in the page.
 */
function CheckIfVideoPlayerExists()
{
  if ((document.getElementsByTagName("react-video-player"))[0]) { return GetVideoUrls(); }
  else { setTimeout(CheckIfVideoPlayerExists, 5000); }
}

/**
 * Converts spaces to underscore
 * @param   SpacedWord    Word containing spaces.
 * @return                All udemy video urls in the page.
 */
function SpaceToUnderscore(SpacedWord)
{
  var UnderscoredWord = SpacedWord.replace(" ", "_");
  return UnderscoredWord;
}



// ################# MAIN ####################
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    // if some one messages us for videos
    if (request.Intent && request.Intent === "GetVideos") {
      console.log("udemy_cs.js: Got message!");
      // get videos lecture urls in this page
      var Sources = CheckIfVideoPlayerExists();
      var LectureTitle = (document.getElementsByClassName("course-info__title"))[0].textContent;
      var SectionNumber = (document.getElementsByClassName("course-info__section"))[0].textContent.trim();



      // send video urls to asker :p
      chrome.runtime.sendMessage({ Intent: "SendVideos", Sources: Sources, Filename: SpaceToUnderscore(SectionNumber + "-" + LectureTitle) });
      console.log("udemy_cs.js: Sent response!");
    }
  });
