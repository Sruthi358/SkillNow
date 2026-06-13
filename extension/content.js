// console.log("SkillNow content script loaded");

// chrome.runtime.onMessage.addListener((request) => {
//   if (request.action === "SCAN_PAGE") {
//     console.log("SCAN BUTTON CLICKED");

//     // const pageText = document.body.innerText;
//     const pageText = {
//       url: window.location.href,
//       title: document.title,
//       content: document.body.innerText,
//     };

//     // console.log(pageText);
//     fetch("http://127.0.0.1:8000/scan", {
//       method: "POST",

//       headers: {
//         "Content-Type": "application/json",
//       },

//       body: JSON.stringify({
//         content: pageText,
//       }),
//     })
//       .then((res) => res.json())
//       .then((data) => {
//         console.log("BACKEND RESPONSE");

//         console.log(data);
//       });
//   }
// });

console.log("====================================");
console.log("SKILLNOW CONTENT SCRIPT LOADED");
console.log("Current URL:", window.location.href);
console.log("====================================");

chrome.runtime.onMessage.addListener(async (request) => {
  console.log("MESSAGE RECEIVED");
  console.log(request);

  if (request.action === "SCAN_PAGE") {
    console.log("====================================");
    console.log("SCAN BUTTON CLICKED");
    console.log("====================================");

    const pageText =
      document.querySelector("main")?.innerText || document.body.innerText;

    console.log("PAGE TEXT EXTRACTED");
    console.log("Length:", pageText.length);

    console.log("FIRST 500 CHARS:");
    console.log(pageText.substring(0, 500));

    const payload = {
      url: window.location.href,
      title: document.title,
      content: pageText,
    };

    console.log("PAYLOAD TO BACKEND:");
    console.log(payload);

    try {
      console.log("CALLING BACKEND...");

      const response = await fetch("http://127.0.0.1:8000/scan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      console.log("FETCH COMPLETED");
      console.log("STATUS:", response.status);

      const data = await response.json();

      console.log("====================================");
      console.log("BACKEND RESPONSE");
      console.log("====================================");
      console.log(JSON.stringify(data, null, 2));

      // Store ticket in Chrome Storage
      chrome.storage.local.set(
        {
          skillnowTicket: data,
        },
        () => {
          console.log("TICKET STORED IN CHROME STORAGE");

          console.log("OPENING DASHBOARD...");

          window.open("http://localhost:8080/user", "_blank");
        },
      );
    } catch (err) {
      console.log("====================================");
      console.log("BACKEND ERROR");
      console.log("====================================");
      console.error(err);
    }
  }
});
