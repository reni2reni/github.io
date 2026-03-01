const titleInput = document.getElementById('title-input');
const codeInput = document.getElementById('code-input');
const saveBtn = document.getElementById('save-btn');
const clearAllBtn = document.getElementById('clear-all');
const exportBtn = document.getElementById('export-btn');
const importBtn = document.getElementById('import-btn');
const importFile = document.getElementById('import-file');
const container = document.getElementById('list-container');

const colors = ["#01963c", "#be9601", "#a02094", "#963201"];

const loadList = () => {
  chrome.storage.local.get(['snippets'], (res) => renderList(res.snippets || []));
};

// 新規保存
saveBtn.onclick = () => {
  const title = titleInput.value.trim() || 'Untitled';
  const code = codeInput.value.trim();
  const color = document.querySelector('input[name="color"]:checked').value;
  if (!code) return;

  chrome.storage.local.get(['snippets'], (res) => {
    const newList = [...(res.snippets || []), { id: Date.now(), title, code, color }];
    chrome.storage.local.set({ snippets: newList }, () => {
      titleInput.value = ''; codeInput.value = '';
      renderList(newList);
      container.scrollTop = container.scrollHeight;
    });
  });
};

// 書き出し
exportBtn.onclick = () => {
  chrome.storage.local.get(['snippets'], (res) => {
    const data = res.snippets || [];
    if (data.length === 0) return alert('空です');
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `stocker_backup_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  });
};

// 読み込み
importBtn.onclick = () => importFile.click();
importFile.onchange = (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => {
    try {
      const data = JSON.parse(ev.target.result);
      chrome.storage.local.get(['snippets'], (res) => {
        const newList = [...(res.snippets || []), ...data];
        chrome.storage.local.set({ snippets: newList }, () => {
          renderList(newList);
          alert('読み込み完了');
        });
      });
    } catch(err) { alert('失敗しました'); }
  };
  reader.readAsText(file);
};

function renderList(list) {
  container.innerHTML = '';
  list.forEach((item, index) => {
    const div = document.createElement('div');
    div.className = 'compact-item';
    div.innerHTML = `
      <div class="item-main">
        <span class="color-dot" style="background:${item.color}"></span>
        <span class="item-name">${item.title}</span>
      </div>
      <div class="actions">
        <button class="copy-btn">コピー</button>
        <button class="del-btn">×</button>
      </div>
    `;

    const mainArea = div.querySelector('.item-main');
    mainArea.ondblclick = () => {
      const editWrap = document.createElement('div');
      editWrap.className = 'edit-mode';
      const dots = colors.map(c => `<span class="edit-dot ${c===item.color?'active':''}" data-color="${c}" style="background:${c}"></span>`).join('');
      editWrap.innerHTML = `<div class="edit-color-selector">${dots}</div><input type="text" class="edit-title" value="${item.title}">`;
      
      mainArea.replaceWith(editWrap);
      const titleIn = editWrap.querySelector('.edit-title');
      titleIn.focus();

      editWrap.querySelectorAll('.edit-dot').forEach(dot => {
        dot.onmousedown = (e) => {
          e.preventDefault();
          list[index].color = e.target.dataset.color;
          chrome.storage.local.set({ snippets: list }, () => renderList(list));
        };
      });

      titleIn.onblur = () => {
        list[index].title = titleIn.value.trim() || 'Untitled';
        chrome.storage.local.set({ snippets: list }, () => renderList(list));
      };
      titleIn.onkeydown = (e) => { if(e.key==='Enter') titleIn.blur(); };
    };

    div.querySelector('.copy-btn').onclick = (e) => {
      navigator.clipboard.writeText(item.code);
      e.target.textContent = 'OK';
      setTimeout(() => { e.target.textContent = 'コピー'; }, 700);
    };

    div.querySelector('.del-btn').onclick = () => {
      const newList = list.filter((_, i) => i !== index);
      chrome.storage.local.set({ snippets: newList }, () => renderList(newList));
    };
    container.appendChild(div);
  });
}

clearAllBtn.onclick = () => { if(confirm('全消去？')) chrome.storage.local.set({ snippets: [] }, () => renderList([])); };
loadList();
