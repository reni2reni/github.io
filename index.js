export default class MyStockerPlugin {
    constructor() {
        this.id = "my-portal-stocker";
        this.name = "Block Stocker";
    }

    // フレームワークから呼ばれる初期化メソッド
    init(helper) {
        this.helper = helper;
        console.log(`[${this.name}] プラグインを初期化中...`);

        // 重要: エディタ(Blockly)のロード完了を待つために少し遅延させる
        setTimeout(() => {
            this.setupMenus();
        }, 2000); 
    }

    setupMenus() {
        // ワークスペース（背景）の右クリックメニュー
        this.helper.registerWorkspaceContextMenu((options) => {
            options.push({
                text: "★ ストッカーを確認",
                enabled: true,
                callback: () => {
                    alert("ストッカープラグインは正常に動作しています！");
                }
            });
        });

        // ブロックの右クリックメニュー
        this.helper.registerBlockContextMenu((options, block) => {
            options.push({
                text: "★ このブロックをJSON保存",
                enabled: true,
                callback: () => {
                    try {
                        // Blocklyの標準メソッドでブロックをXML(JSONの元)に変換
                        const xml = Blockly.Xml.blockToDom(block);
                        const text = Blockly.Xml.domToPrettyText(xml);
                        console.log("Selected Block Data:", text);
                        alert("コンソールにブロックデータを出力しました。");
                    } catch (e) {
                        console.error("変換エラー:", e);
                        alert("エラー: ブロックデータの取得に失敗しました。");
                    }
                }
            });
        });

        console.log(`[${this.name}] メニューの登録が完了しました。`);
    }
}
