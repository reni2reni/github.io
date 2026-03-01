(function() {
    class MyStockerPlugin {
        constructor() {
            this.id = "my-portal-stocker";
            this.name = "Block Stocker";
        }

        init(helper) {
            console.log("[Block Stocker] 初期化開始");
            this.helper = helper;

            // ワークスペース（背景）
            this.helper.registerWorkspaceContextMenu((options) => {
                options.push({
                    text: "★ ストッカー: テスト",
                    enabled: true,
                    callback: () => alert("Workspace OK!")
                });
            });

            // ブロック
            this.helper.registerBlockContextMenu((options, block) => {
                options.push({
                    text: "★ このブロックをJSON保存",
                    enabled: true,
                    callback: () => {
                        const xml = Blockly.Xml.blockToDom(block);
                        console.log("BLOCK DATA:", Blockly.Xml.domToPrettyText(xml));
                        alert("コンソールを確認してください");
                    }
                });
            });
        }
    }

    // Portal Extensions本体に直接登録を試みる
    const register = () => {
        if (window.portalExtensions && window.portalExtensions.registerPlugin) {
            window.portalExtensions.registerPlugin(new MyStockerPlugin());
            console.log("[Block Stocker] プラグインをシステムに強制登録しました");
        } else {
            setTimeout(register, 1000); // 見つかるまで1秒おきにリトライ
        }
    };
    register();
})();
