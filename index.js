export default class MyStockerPlugin {
    constructor() {
        this.id = "my-portal-stocker";
        this.name = "Block Stocker";
    }

    init(helper) {
        this.helper = helper;
        console.log(`${this.name} initialized.`);

        // 1秒待ってからメニューを登録（エディタの準備待ち）
        setTimeout(() => {
            // ワークスペース右クリック
            this.helper.registerWorkspaceContextMenu((options) => {
                console.log("Adding workspace menu item...");
                options.push({
                    text: "★ ストッカーを開く",
                    enabled: true,
                    callback: () => alert("プラグイン動作中")
                });
            });

            // ブロック右クリック
            this.helper.registerBlockContextMenu((options, block) => {
                options.push({
                    text: "★ このブロックを保存",
                    enabled: true,
                    callback: () => console.log("Selected block:", block)
                });
            });
            console.log(`${this.name} context menus registered.`);
        }, 1000);
    }
}
