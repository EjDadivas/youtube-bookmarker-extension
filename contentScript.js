(() => {
    let youtubeLeftControls, youtubePlayer;
    // current video id
    let currentVideo = "";
    // store all video bookmarks to be saved in the storage
    let currentVideoBookmarks = [];

    // retrieves the bookmarks for the current video from the Chrome extension's sync storage and returns them as an array. If no bookmarks exist for the current video, an empty array is returned.
    const fetchBookmarks = () => {
        return new Promise((resolve) => {
            chrome.storage.sync.get([currentVideo], obj => { 
                resolve(obj[currentVideo] ? JSON.parse(obj[currentVideo]) : [])
            })  
        });
    }
    const addNewBookmarkEventHandler = async () => {
        console.log("addNewBookMark ()")
        // Figure out the timestamp of the video using the currentTime property
        const currentTime = youtubePlayer.currentTime;
        //Object that has the time and description of the book mark
        const newBookmark = {
            time: currentTime,
            desc: "Bookmark at " + getTime(currentTime),
        };
        console.log("newBookMark: ", newBookmark);
        
        // fetch the bookmarks for the current video
        currentVideoBookmarks = await fetchBookmarks();
        // sync it to chrome storage
        // each video has its own bookmarks and it will be mapped to the videoId
        chrome.storage.sync.set({
            //currentVideo is the key and the value is the array of bookmarks
            // we are sorting it by time
            [currentVideo]: JSON.stringify([...currentVideoBookmarks, newBookmark].sort((a, b) => a.time - b.time))
        });
    };

    // Adding book mark button in the left controls of a youtube video
    //We should see the youtube player button in the youtube video
    const newVideoLoaded = () => {
        console.log("newVideoLoaded ()")
        //this is an html collection, so we need to put index 0 to grab the first one
        const bookmarkBtnExists = document.getElementsByClassName("bookmark-btn")[0];
        console.log(bookmarkBtnExists);
        console.log("newVideoLoaded: ", currentVideo);
        //if the bookmark button does not exist, create it
        if (!bookmarkBtnExists) {
            const bookmarkBtn = document.createElement("img");
            
            //pull the image that we are using from assets folder
            bookmarkBtn.src = chrome.runtime.getURL("assets/bookmark.png");
            // add a class to the bookmark button (for styling)
            bookmarkBtn.className = "ytp-button " + "bookmark-btn";
            // we want on hover that the title will show up
            bookmarkBtn.title = "Click to bookmark current timestamp";
            
            //inspecting a youtube video and get their classNames
            //grab the left controls and the video stream
            youtubeLeftControls = document.getElementsByClassName("ytp-left-controls")[0];

            //Where the video is playing
            youtubePlayer = document.getElementsByClassName("video-stream")[0];
            
            // add the bookmark button to the left controls
            youtubeLeftControls.appendChild(bookmarkBtn);
            // Listen to any clicks on the icon then calls this function
            bookmarkBtn.addEventListener("click", addNewBookmarkEventHandler);
        }
    };


    


//Listener from background.js
//we can send a response back to background.js (where the message is coming from)
chrome.runtime.onMessage.addListener((obj, sender, response) => {
    //destructuring
    const { type, value, videoId } = obj;

    if (type === "NEW") { //if the event is new, set the currentvideo to the videoId
        currentVideo = videoId;
        newVideoLoaded(); //handle actions for new videos
    }
});
    //calls newVideoLoaded function anytime we hit that match pattern
newVideoLoaded();
})();
//helper function to get the time and format it
const getTime = t => {
    var date = new Date(0);
    date.setSeconds(1);

    return date.toISOString().substr(11, 0);
}
