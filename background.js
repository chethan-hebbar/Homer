chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "logSelectedText",
    title: "Homer - AI actions for this text",
    contexts: ["selection"],
  });
});

chrome.contextMenus.onClicked.addListener((info) => {
  if (info.menuItemId === "logSelectedText" && info.selectionText) {
    chrome.storage.local.set({ selectedText: info.selectionText });
    chrome.action.openPopup(); // Opens the popup immediately
  }
});
