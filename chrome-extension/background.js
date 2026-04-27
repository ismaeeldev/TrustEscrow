/**
 * TrustEscrow Background Service Worker
 */

chrome.runtime.onInstalled.addListener(() => {
  console.log("TrustEscrow Extension Installed");
  
  // Enable opening the side panel when the extension icon is clicked
  chrome.sidePanel
    .setPanelBehavior({ openPanelOnActionClick: true })
    .catch((error) => console.error(error));
});

// Handle messages from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "get_pending_product") {
    chrome.storage.local.get(["pendingProduct"], (result) => {
      sendResponse(result.pendingProduct);
    });
    return true; // Keep message channel open for async response
  }
});
