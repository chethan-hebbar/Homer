chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "logSelectedText",
    title: "Show Selected Text in Popup",
    contexts: ["selection"],
  });
});

chrome.contextMenus.onClicked.addListener((info) => {
  if (info.menuItemId === "logSelectedText" && info.selectionText) {
    chrome.storage.local.set({ selectedText: info.selectionText });
    chrome.action.openPopup(); // Opens the popup immediately
  }
});
