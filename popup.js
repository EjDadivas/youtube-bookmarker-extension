import { getActiveTabURL } from "./utils.js";

// adding a new bookmark row to the popup
const addNewBookmark = () => {
    // create 2 elements
    // 1. bookmark title
    // 2. bookmark controls( play and delete buttons)
    const bookmarkTitleElement = document.createElement("div");
    const controlsElement = document.createElement("div");
    const newBookmarkElement = document.createElement("div");
  
    bookmarkTitleElement.textContent = bookmark.desc;
    bookmarkTitleElement.className = "bookmark-title";
    controlsElement.className = "bookmark-controls";
  
    setBookmarkAttributes("play", onPlay, controlsElement);
    setBookmarkAttributes("delete", onDelete, controlsElement);
  
    newBookmarkElement.id = "bookmark-" + bookmark.time;
    newBookmarkElement.className = "bookmark";
    newBookmarkElement.setAttribute("timestamp", bookmark.time);
  
    newBookmarkElement.appendChild(bookmarkTitleElement);
    newBookmarkElement.appendChild(controlsElement);
    bookmarks.appendChild(newBookmarkElement);
};

const viewBookmarks = () => {

    const bookmarksElement = document.getElementById("bookmarks");
    bookmarksElement.innerHTML = "";
    
    //if there are current bookmarks
    if (currentBookmarks.length > 0) {
        // loop through the bookmarks and add them to the popup
      for (let i = 0; i < currentBookmarks.length; i++) {
        const bookmark = currentBookmarks[i];
        addNewBookmark(bookmarksElement, bookmark);
      }
    } else {
      bookmarksElement.innerHTML = '<i class="row">No bookmarks to show</i>';
    }
  
    return;
};

const onPlay = e => {};

const onDelete = e => {};

const setBookmarkAttributes =  () => {};

// Add an event listener for the "DOMContentLoaded" event to the document object.
// The "DOMContentLoaded" event is fired when the initial HTML document has been completely loaded and parsed.
// The function provided as the second argument will be executed when this event is fired.
document.addEventListener("DOMContentLoaded", async () => {
    const activeTab = await getActiveTabURL()
    const queryParameters = activeTab.url.split("?")[1];
    const urlParameters = new URLSearchParams(queryParameters);

    const currentVideo = urlParameters.get("v");

    // checking if we are watching a youtube video
    if(activeTab.url.includes("youtube.com/watch") && currentVideo) {
    //    Get any current vid bookmarks from chrome storage
    chrome.storage.sync.get([currentVideo], data => {
        // If there are any bookmarks, parse them and store them in the currentVideoBookmarks variable
        const currentVideoBookmarks = data[currentVideo] ? JSON.parse(data[currentVideo]) : [];

        // view any bookmarks in our extension
        viewBookmarks(currentVideoBookmarks);
    });
    // if we are not on a youtube video page
    } else {
        // Setting the innerHTML of the container div to a message to say that it is not a youtube video page
        const container = document.getElementsByClassName("container")[0];

        container.innerHTML = '<div class="title">This is not a youtube video page.</div>';
    }
});
