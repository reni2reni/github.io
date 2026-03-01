// background.js からの命令を受け取る
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "showAlert") {
    alert("BF6 Portal 支援プラグインが正常に動作しています！");
  }
});
