chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({
        targetLanguage: 'en',
        isEnabled: false
    });
});

chrome.action.onClicked.addListener(tab => {
    if (!tab?.id) return;

    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['content.js']
    });
});