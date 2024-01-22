chrome.tabs.onUpdated.addListener((tabId, tab) => {
  //checks if the URL is a youtube video
    if (tab.url && tab.url.includes("youtube.com/watch")) {
      //we will use the query parameters to get the video id
      const queryParameters = tab.url.split("?")[1];

      // youtube.com/watch?v=<videoId>
      // This is a searchparams
      const urlParameters = new URLSearchParams(queryParameters);
      
      console.log(urlParameters);
      // Send a message to the content script
      // a new video has been loaded
      chrome.tabs.sendMessage(tabId, {
        type: "NEW", //NEW video event
        videoId: urlParameters.get("v"),
      });
    }
  });
  