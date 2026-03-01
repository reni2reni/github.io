/*
 * Multi-Code Stocker for BF2042 Portal Extensions
 */
(function() {
    const PLUGIN_ID = "multi-code-stocker";
    const colors = ["#3498db", "#e74c3c", "#2ecc71", "#f1c40f"];

    // Portalのエディタ上にUIを構築する（簡易サイドバーまたはメニュー）
    function initUI() {
        const container = document.createElement('div');
        container.id = "stocker-sidebar";
        container.style = "position:fixed; right:10px; top:60px; width:220px; background:#fff; border:1px solid #333; z-index:9999; padding:10px; font-family:sans-serif; font-size:12px; border-radius:4px; box-shadow: 0 4px 8px rgba(0,0,0,0.5); color:#000;";
        
        container.innerHTML = `
            <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
                <b style="font-size:11px;">Multi-Code Stocker</b>
                <span id="stocker-close" style="cursor:pointer; color:#999;">✕</span>
            </div>
            <input type="text" id="stk-title" placeholder="名前" style="width:90%; margin-bottom:4px; font-size:11px;">
            <textarea id="stk-code" placeholder="コード貼付" style="width:90%; height:40px; margin-bottom:4px; font-size:11px;"></textarea>
            <div id="stk-color-pick" style="display:flex; gap:5px; margin-bottom:8px;">
                ${colors.map(c => `<span class="stk-dot" data-color="${c}" style="width:12px;height:12px;background:${c};border-radius:50%;cursor:pointer;border:1px solid #ccc;"></span>`).join('')}
            </div>
            <button id="stk-save" style="width:100%; background:#333; color:#fff; border:none; padding:4px; cursor:pointer;">ストック</button>
            <hr style="margin:10px 0; border:0; border-top:1px solid #eee;">
            <div id="stk-list" style="max-height:200px; overflow-y:auto;"></div>
        `;

        document.body.appendChild(container);

        // イベント設定
        document.getElementById('stk-close').onclick = () => container.style.display = 'none';
        document.getElementById('stk-save').onclick = saveSnippet;
        
        let selectedColor = colors[0];
        container.querySelectorAll('.stk-dot').forEach(dot => {
            dot.onclick = (e) => {
                container.querySelectorAll('.stk-dot').forEach(d => d.style.borderColor = "#ccc");
                e.target.style.borderColor = "#000";
                selectedColor = e.target.dataset.color;
            };
        });

        renderList();
    }

    function saveSnippet() {
        const title = document.getElementById('stk-title').value || "Untitled";
        const code = document.getElementById('stk-code').value;
        const color = document.querySelector('.stk-dot[style*="border-color: rgb(0, 0, 0)"]')?.dataset.color || colors[0];
        
        if(!code) return;

        const data = JSON.parse(localStorage.getItem(PLUGIN_ID) || "[]");
        data.push({ title, code, color, id: Date.now() });
        localStorage.setItem(PLUGIN_ID, JSON.stringify(data));
        
        document.getElementById('stk-title').value = "";
        document.getElementById('stk-code').value = "";
        renderList();
    }

    function renderList() {
        const listDiv = document.getElementById('stk-list');
        const data = JSON.parse(localStorage.getItem(PLUGIN_ID) || "[]");
        listDiv.innerHTML = "";

        data.forEach((item, index) => {
            const row = document.createElement('div');
            row.style = "display:flex; align-items:center; margin-bottom:4px; padding:2px; border-bottom:1px solid #f5f5f5;";
            row.innerHTML = `
                <span style="width:8px; height:8px; background:${item.color}; border-radius:50%; margin-right:6px;"></span>
                <span style="flex:1; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; cursor:pointer;" title="${item.title}">${item.title}</span>
                <button class="stk-copy" style="font-size:9px; margin-right:4px;">Copy</button>
                <button class="stk-del" style="font-size:9px; color:red;">×</button>
            `;

            // コピーボタン（ Portal ExtensionsのPaste機能と連携させるなら clipboard に入れる）
            row.querySelector('.stk-copy').onclick = () => {
                navigator.clipboard.writeText(item.code);
                alert("Copied!");
            };

            row.querySelector('.stk-del').onclick = () => {
                data.splice(index, 1);
                localStorage.setItem(PLUGIN_ID, JSON.stringify(data));
                renderList();
            };

            listDiv.appendChild(row);
        });
    }

    // Portalの画面がロードされたらUIを表示
    if (document.readyState === 'complete') initUI();
    else window.addEventListener('load', initUI);
})();
