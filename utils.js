// This is a utility function that gets the URL of the currently active tab in the current window.
export async function getActiveTabURL() {
    // The chrome.tabs.query method is used to retrieve the active tab in the current window.
    // This method is asynchronous, so we use the await keyword to pause the execution of the function until the Promise is resolved.
    const tabs = await chrome.tabs.query({
        currentWindow: true, // Only consider tabs in the current window.
        active: true // Only consider active tabs.
    });
  
    // Return the first (and only) tab in the tabs array.
    // This tab object contains information about the tab, including its URL.
    return tabs[0];
}