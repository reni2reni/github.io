// インストール時に右クリックメニューを作成
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "portal-alert-test",
    title: "ポータル支援：テスト実行",
    contexts: ["all"],
    documentUrlPatterns: ["https://portal.battlefield.com*"]
  });
});

// メニューがクリックされた時の処理
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "portal-alert-test") {
    // ページ（content.js）側にメッセージを送る
    chrome.tabs.sendMessage(tab.id, { action: "showAlert" });
  }
});
