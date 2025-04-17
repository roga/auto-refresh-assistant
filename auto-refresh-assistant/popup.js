let countdownInterval;

document.addEventListener("DOMContentLoaded", function () {
  const startBtn = document.getElementById("start");
  const stopBtn = document.getElementById("stop");
  const secondsInput = document.getElementById("seconds");
  const statusText = document.getElementById("status");

  startBtn.addEventListener("click", function () {
    const seconds = parseInt(secondsInput.value, 10);

    if (isNaN(seconds) || seconds < 1) {
      statusText.textContent = "Invalid Format.";
      return;
    }

    let remaining = seconds;
    statusText.textContent = `${remaining} secs remaining.`;

    clearInterval(countdownInterval);
    countdownInterval = setInterval(() => {
      remaining--;
      if (remaining > 0) {
        statusText.textContent = `${remaining} secs remaining.`;
      } else {
        clearInterval(countdownInterval);
        statusText.textContent = "Finish";
      }
    }, 1000);

    // 查詢目前分頁並傳送訊息給 background.js
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (tabs.length > 0) {
        chrome.runtime.sendMessage({
          action: "start",
          seconds: seconds,
          tabId: tabs[0].id
        });
      }
    });
  });

  stopBtn.addEventListener("click", function () {
    clearInterval(countdownInterval);
    statusText.textContent = "Stop";

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (tabs.length > 0) {
        chrome.runtime.sendMessage({
          action: "stop",
          tabId: tabs[0].id
        });
      }
    });
  });
});
