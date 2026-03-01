export default class MyStockerPlugin {
    constructor() {
        this.id = "my-portal-stocker";
        this.name = "Block Stocker";
    }

    init(helper) {
        this.helper = helper;
        console.log(`${this.name} initialized.`);

        // ワークスペース（背景）用
        this.helper.registerWorkspaceContextMenu((options) => {
            console.log("Workspace context menu opened."); // デバッグ用
            options.push({
                text: "★ ストッカー: テスト",
                enabled: true,
                callback: () => alert("動作OK!")
            });
        });

        // ブロック用
        this.helper.registerBlockContextMenu((options, block) => {
            options.push({
                text: "★ このブロックをJSONで出力",
                enabled: true,
                callback: () => {
                    // ここでJSON変換のテスト
                    const xml = Blockly.Xml.blockToDom(block);
                    const xmlText = Blockly.Xml.domToPrettyText(xml);
                    console.log("Block XML:", xmlText);
                    alert("コンソールにXML(JSONの元)を出力しました");
                }
            });
        });
    }
}
