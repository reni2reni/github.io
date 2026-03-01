export default class MyStockerPlugin {
    constructor() {
        this.id = "my-portal-stocker";
        this.name = "Block Stocker";
        this.storageKey = "bf_portal_block_stock";
    }

    init(helper) {
        this.helper = helper;
        console.log(`[${this.name}] Initializing Stocker...`);
        this.setupMenus();
    }

    // ローカルストレージからデータを取得
    getStocks() {
        const data = localStorage.getItem(this.storageKey);
        return data ? JSON.parse(data) : [];
    }

    // ストックに保存
    saveToStock(block) {
        const xml = Blockly.Xml.blockToDom(block);
        const xmlText = Blockly.Xml.domToText(xml);
        const name = prompt("ストック名を入力してください:", block.type);
        
        if (!name) return;

        const stocks = this.getStocks();
        stocks.push({ id: Date.now(), name, data: xmlText });
        localStorage.setItem(this.storageKey, JSON.stringify(stocks));
        alert(`「${name}」をストックしました！`);
    }

    // ストックから復元（簡易UI）
    showStockList() {
        const stocks = this.getStocks();
        if (stocks.length === 0) return alert("ストックが空です。");

        const listStr = stocks.map((s, i) => `${i}: ${s.name}`).join("\n");
        const index = prompt(`復元する番号を選択してください:\n${listStr}`);

        if (index !== null && stocks[index]) {
            const xmlText = stocks[index].data;
            const xml = Blockly.Xml.textToDom(xmlText);
            // ワークスペースの中央付近に配置
            Blockly.Xml.domToBlock(xml, Blockly.getMainWorkspace());
            alert("復元しました！");
        }
    }

    setupMenus() {
        // ワークスペース：ストック一覧を表示
        this.helper.registerWorkspaceContextMenu((options) => {
            options.push({
                text: "📦 ストック一覧を表示・復元",
                enabled: true,
                callback: () => this.showStockList()
            });
        });

        // ブロック：このブロックを保存
        this.helper.registerBlockContextMenu((options, block) => {
            options.push({
                text: "💾 このブロックをストックに追加",
                enabled: true,
                callback: () => this.saveToStock(block)
            });
        });
    }
}
