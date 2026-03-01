export default class MyStockerPlugin {
    constructor() {
        this.id = "my-portal-stocker";
        this.name = "Block Stocker";
    }

    init(helper) {
        this.helper = helper;
        console.log(`[${this.name}] Initializing with Direct Blockly API...`);

        // Blocklyがロードされるまで最大10秒待機
        const checkBlockly = setInterval(() => {
            if (typeof Blockly !== 'undefined' && Blockly.ContextMenuRegistry) {
                clearInterval(checkBlockly);
                this.registerDirectMenus();
            }
        }, 1000);
    }

    registerDirectMenus() {
        // 1. ワークスペース（背景）用メニュー項目の定義
        const stockerOption = {
            displayText: "★ ストッカー: JSON保存",
            preconditionFn: () => "enabled", // 常に有効
            callback: (scope) => {
                alert("ストッカー機能が呼び出されました");
            },
            scopeType: Blockly.ContextMenuRegistry.ScopeType.WORKSPACE,
            id: "my_stocker_workspace_item",
            weight: 100 // メニュー内での表示順位（大きいほど下）
        };

        // 2. ブロック用メニュー項目の定義
        const blockStockerOption = {
            displayText: "★ このブロックをJSON保存",
            preconditionFn: () => "enabled",
            callback: (scope) => {
                const block = scope.block;
                const xml = Blockly.Xml.blockToDom(block);
                console.log("Block JSON:", Blockly.Xml.domToPrettyText(xml));
                alert("コンソールにJSONを出力しました");
            },
            scopeType: Blockly.ContextMenuRegistry.ScopeType.BLOCK,
            id: "my_stocker_block_item",
            weight: 100
        };

        // Blockly本体に登録
        Blockly.ContextMenuRegistry.registry.register(stockerOption);
        Blockly.ContextMenuRegistry.registry.register(blockStockerOption);

        console.log(`[${this.name}] Direct Menus Registered!`);
    }
}
