const scanBtn = document.getElementById("scanBtn");

scanBtn.addEventListener("click", async () => {
  try {
    scanBtn.disabled = true;
    scanBtn.textContent = "Scanning...";

    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    chrome.tabs.sendMessage(
      tab.id,
      {
        action: "SCAN_PAGE",
      },
      (response) => {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError.message);

          scanBtn.disabled = false;
          scanBtn.textContent = "Scan Current Page";
          return;
        }

        console.log(response);

        scanBtn.textContent = "Analysis Started";

        // Open dashboard
        chrome.tabs.create({
          url: "http://localhost:8080/user",
        });

        setTimeout(() => {
          scanBtn.disabled = false;
          scanBtn.textContent = "Scan Current Page";
        }, 2000);
      },
    );
  } catch (error) {
    console.error(error);

    scanBtn.disabled = false;
    scanBtn.textContent = "Try Again";
  }
});
