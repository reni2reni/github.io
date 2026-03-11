(function () {
    const pluginId = "bf-portal-code-stocker";
    const plugin = BF2042Portal.Plugins.getPlugin(pluginId);

    const snippets = {}; // { name: JSON block }

    let container = null;
    let textarea = null;
    let nameInput = null;

    function createUI() {
        if (container) return;

        container = document.createElement("div");
        container.style.position = "absolute";
        container.style.top = "10px";
        container.style.right = "10px";
        container.style.width = "350px";
        container.style.background = "#222";
        container.style.color = "#fff";
        container.style.padding = "10px";
        container.style.zIndex = 9999;
        container.style.fontFamily = "monospace";
        container.style.border = "1px solid #555";
        container.style.borderRadius = "8px";

        // スニペット名入力
        const label = document.createElement("label");
        label.textContent = "Snippet name:";
        container.appendChild(label);

        nameInput = document.createElement("input");
        nameInput.type = "text";
        nameInput.style.width = "100%";
        container.appendChild(nameInput);

        // Captureボタン
        const captureBtn = document.createElement("button");
        captureBtn.textContent = "Capture Selected Block";
        captureBtn.style.width = "100%";
        captureBtn.onclick = captureSelectedBlock;
        container.appendChild(captureBtn);

        // Saveボタン
        const saveBtn = document.createElement("button");
        saveBtn.textContent = "Save Snippet";
        saveBtn.style.width = "100%";
        saveBtn.onclick = saveSnippet;
        container.appendChild(saveBtn);

        // JSON表示
        textarea = document.createElement("textarea");
        textarea.rows = 10;
        textarea.style.width = "100%";
        textarea.readOnly = true;
        container.appendChild(textarea);

        // 保存スニペットリスト
        const listDiv = document.createElement("div");
        listDiv.id = "snippetList";
        listDiv.style.marginTop = "10px";
        container.appendChild(listDiv);

        document.body.appendChild(container);
    }

    let lastCapturedBlock = null;

    function captureSelectedBlock() {
        try {
            const ws = _Blockly.getMainWorkspace();
            if (!ws) {
                textarea.value = "ERROR: Workspace not accessible";
                return;
            }

            const block = ws.getSelected();
            if (!block) {
                textarea.value = "ERROR: No block selected";
                return;
            }

            // 選択ブロック＋子ブロックをJSON化
            lastCapturedBlock = _Blockly.serialization.blocks.save(block);
            textarea.value = JSON.stringify(lastCapturedBlock, null, 2);
        } catch (err) {
            textarea.value = "ERROR: " + err.message;
            lastCapturedBlock = null;
        }
    }

    function saveSnippet() {
        if (!lastCapturedBlock) return alert("No block captured");
        const name = nameInput.value.trim();
        if (!name) return alert("Please enter snippet name");

        snippets[name] = JSON.parse(JSON.stringify(lastCapturedBlock)); // deep copy
        nameInput.value = "";
        updateSnippetList();
    }

    function updateSnippetList() {
        const listDiv = document.getElementById("snippetList");
        listDiv.innerHTML = "";

        for (const [name, json] of Object.entries(snippets)) {
            const div = document.createElement("div");
            div.style.display = "flex";
            div.style.justifyContent = "space-between";
            div.style.marginBottom = "4px";

            const span = document.createElement("span");
            span.textContent = name;
            div.appendChild(span);

            const pasteBtn = document.createElement("button");
            pasteBtn.textContent = "Paste";
            pasteBtn.onclick = () => pasteSnippet(json);
            div.appendChild(pasteBtn);

            const delBtn = document.createElement("button");
            delBtn.textContent = "Delete";
            delBtn.onclick = () => {
                delete snippets[name];
                updateSnippetList();
            };
            div.appendChild(delBtn);

            listDiv.appendChild(div);
        }
    }

    function pasteSnippet(json) {
        try {
            const ws = _Blockly.getMainWorkspace();
            if (!ws) return alert("Workspace not accessible");

            const metrics = ws.getMetrics();
            const centerX = (metrics.viewLeft || 0) + (metrics.viewWidth || 0) / 2;
            const centerY = (metrics.viewTop || 0) + (metrics.viewHeight || 0) / 2;

            function offsetBlocks(node, dx, dy) {
                if (!node) return;
                node.x = (node.x || 0) + dx;
                node.y = (node.y || 0) + dy;
                if (node.inputs) {
                    for (const input of Object.values(node.inputs)) {
                        if (input.block) offsetBlocks(input.block, dx, dy);
                        if (input.shadow) offsetBlocks(input.shadow, dx, dy);
                    }
                }
                if (node.next && node.next.block) offsetBlocks(node.next.block, dx, dy);
            }

            offsetBlocks(json, centerX, centerY);

            if (_Blockly?.serialization?.blocks?.append) {
                _Blockly.serialization.blocks.append(json, ws);
            } else if (json._legacyXml) {
                const dom = Blockly.Xml.textToDom(json._legacyXml);
                Blockly.Xml.domToWorkspace(dom, ws);
            } else {
                alert("Cannot append blocks on this build");
            }
        } catch (err) {
            console.error("Paste failed:", err);
        }
    }

    plugin.initializeWorkspace = function () {
        createUI();
        console.log("[Code Stocker] Plugin initialized");
    };

    plugin.dispose = function () {
        if (container) container.remove();
        console.log("[Code Stocker] Plugin disposed");
    };

})();