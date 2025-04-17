let countdownInterval;
let countdownRemaining = 0;
let refreshIntervalSeconds = 0;

document.addEventListener("DOMContentLoaded", function () {
  const startBtn = document.getElementById("start");
  const stopBtn = document.getElementById("stop");
  const secondsInput = document.getElementById("seconds");
  const statusText = document.getElementById("status");

  function updateCountdownUI() {
    if (countdownRemaining > 0) {
      statusText.textContent = `Remaining: ${countdownRemaining} seconds`;
    } else {
      statusText.textContent = `Refreshing...`;
    }
  }

  function startCountdown(tabId) {
    clearInterval(countdownInterval);
    countdownRemaining = refreshIntervalSeconds;
    updateCountdownUI();

    countdownInterval = setInterval(() => {
      countdownRemaining--;
      if (countdownRemaining > 0) {
        updateCountdownUI();
      } else {
        statusText.textContent = `Refreshing...`;
        countdownRemaining = refreshIntervalSeconds;
        updateCountdownUI();
      }
    }, 1000);
  }

  startBtn.addEventListener("click", function () {
    const seconds = parseInt(secondsInput.value, 10);

    if (isNaN(seconds) || seconds < 1) {
      statusText.textContent = "Please enter a valid number of seconds.";
      return;
    }

    refreshIntervalSeconds = seconds;

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (tabs.length > 0) {
        const tabId = tabs[0].id;

        chrome.runtime.sendMessage({
          action: "start",
          seconds: seconds,
          tabId: tabId
        });

        startCountdown(tabId);
      }
    });
  });

  stopBtn.addEventListener("click", function () {
    clearInterval(countdownInterval);
    statusText.textContent = "Stopped.";

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
