export default class MyStockerPlugin {
    constructor() {
        this.id = "my-portal-stocker";
        this.name = "Block Stocker";
    }

    init(helper) {
        this.helper = helper;

        // ワークスペース（背景）を右クリックした時
        this.helper.registerWorkspaceContextMenu((options) => {
            options.push({
                text: "ストッカー: 動作確認テスト",
                enabled: true,
                callback: () => {
                    alert("プラグインが正常に読み込まれました！");
                }
            });
        });

        // ブロックを右クリックした時
        this.helper.registerBlockContextMenu((options, block) => {
            options.push({
                text: "このブロックをJSONで出力(仮)",
                enabled: true,
                callback: () => {
                    console.log("選択されたブロック:", block);
                    alert("コンソールにブロック情報を出力しました。");
                }
            });
        });
    }
}
