// content.js

const initPlugin = () => {
    // Portal Extensionsの本体がロードされるまで少し待機する
    const checkInterval = setInterval(() => {
        if (window.portalExtensions) {
            clearInterval(checkInterval);
            try {
                registerMyPlugin();
            } catch (e) {
                console.error("プラグイン登録中にエラーが発生:", e);
            }
        }
    }, 1000); // 1秒おきにチェック
};

function registerMyPlugin() {
    class HelloWorldPlugin {
        id = "hello-world-alert-plugin";
        name = "Hello World Plugin";

        init(helper) {
            this.helper = helper;
            this.helper.registerWorkspaceContextMenu((options) => {
                options.push({
                    text: "テストアラートを表示",
                    enabled: true,
                    callback: () => alert("動作確認OK!")
                });
            });
        }
    }

    window.portalExtensions.registerPlugin(new HelloWorldPlugin());
    console.log("Portal Extension プラグインが正常に登録されました。");
}

// 実行
initPlugin();
