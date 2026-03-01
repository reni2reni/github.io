// --- CSSスタイルを注入 ---
const style = document.createElement('style');
style.textContent = `
  body { width: 280px; padding: 10px; font-family: sans-serif; }
  .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
  h3 { margin: 0; font-size: 13px; color: #666; }
  .input-area { display: flex; flex-direction: column; gap: 5px; margin-bottom: 10px; }
  input, textarea { padding: 6px; border: 1px solid #ddd; border-radius: 4px; font-size: 12px; outline: none; }
  textarea { height: 40px; font-family: monospace; }
  button { cursor: pointer; border: none; border-radius: 3px; font-size: 11px; }
  .primary-btn { background: #333; color: white; padding: 6px; font-weight: bold; }
  .danger-btn { background: none; color: #ccc; border: 1px solid #eee; padding: 2px 5px; }
  #list-container { max-height: 200px; overflow-y: auto; border-top: 1px solid #eee; }
  .compact-item { display: flex; justify-content: space-between; align-items: center; padding: 2px 0; border-bottom: 1px solid #f5f5f5; }
  .item-name { font-size: 12px; color: #333; flex: 1; padding: 4px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .item-name:hover { background: #f0f0f0; border-radius: 3px; }
  .edit-input { flex: 1; font-size: 12px; padding: 2px; border: 1px solid #007bff; }
  .actions { display: flex; gap: 4px; }
  .copy-btn { background: #28a745; color: white; padding: 2px 6px; min-width: 45px; }
  .copy-success { background: #007bff !important; }
  .del-btn { background: #f8f9fa; color: #ccc; border: 1px solid #eee; padding: 2px 6px; }
`;
document.head.appendChild(style);

// --- HTML構造を生成 ---
document.body.innerHTML = `
  <div class="header"><h3>Multi-Code Stocker</h3><button id="clear-all" class="danger-btn">全消去</button></div>
  <div class="input-area">
    <input type="text" id="title-in" placeholder="名前">
    <textarea id="code-in" placeholder="コードを貼付"></textarea>
    <button id="save-btn" class="primary-btn">ストック</button>
  </div>
  <div id="list-container"></div>
`;

const titleIn = document.getElementById('title-in');
const codeIn = document.getElementById('code-in');
const saveBtn = document.getElementById('save-btn');
const container = document.getElementById('list-container');

const render = (list) => {
  container.innerHTML = '';
  list.forEach((item, idx) => {
    const div = document.createElement('div');
    div.className = 'compact-item';
    div.innerHTML = `
      <span class="item-name" title="ダブルクリックで編集">${item.title}</span>
      <div class="actions">
        <button class="copy-btn">コピー</button>
        <button class="del-btn">×</button>
      </div>
    `;

    const nameSpan = div.querySelector('.item-name');
    nameSpan.ondblclick = () => {
      const edit = document.createElement('input');
      edit.className = 'edit-input';
      edit.value = item.title;
      nameSpan.replaceWith(edit);
      edit.focus();
      const saveEdit = () => {
        list[idx].title = edit.value.trim() || 'Untitled';
        chrome.storage.local.set({ snippets: list }, () => render(list));
      };
      edit.onblur = saveEdit;
      edit.onkeydown = (e) => { if(e.key==='Enter') saveEdit(); };
    };

    div.querySelector('.copy-btn').onclick = (e) => {
      navigator.clipboard.writeText(item.code);
      e.target.textContent = 'OK';
      e.target.classList.add('copy-success');
      setTimeout(() => { e.target.textContent = 'コピー'; e.target.classList.remove('copy-success'); }, 700);
    };

    div.querySelector('.del-btn').onclick = () => {
      const newList = list.filter((_, i) => i !== idx);
      chrome.storage.local.set({ snippets: newList }, () => render(newList));
    };
    container.appendChild(div);
  });
};

saveBtn.onclick = () => {
  const title = titleIn.value.trim() || 'Untitled';
  const code = codeIn.value.trim();
  if (!code) return;
  chrome.storage.local.get(['snippets'], (res) => {
    const newList = [...(res.snippets || []), { title, code }];
    chrome.storage.local.set({ snippets: newList }, () => {
      titleIn.value = ''; codeIn.value = ''; render(newList);
      container.scrollTop = container.scrollHeight;
    });
  });
};

document.getElementById('clear-all').onclick = () => {
  if(confirm('全消去？')) chrome.storage.local.set({ snippets: [] }, () => render([]));
};

chrome.storage.local.get(['snippets'], (res) => render(res.snippets || []));
