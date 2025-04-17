const tabTimers = {};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const { action, seconds, tabId } = message;

  if (!tabId) return;

  if (action === "start") {
    if (tabTimers[tabId]) {
      clearInterval(tabTimers[tabId]);
    }
    tabTimers[tabId] = setInterval(() => {
      chrome.tabs.reload(tabId);
    }, seconds * 1000);
  }

  if (action === "stop") {
    if (tabTimers[tabId]) {
      clearInterval(tabTimers[tabId]);
      delete tabTimers[tabId];
    }
  }
});
