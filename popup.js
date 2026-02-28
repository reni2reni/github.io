const titleInput = document.getElementById('title-input');
const codeInput = document.getElementById('code-input');
const saveBtn = document.getElementById('save-btn');
const clearAllBtn = document.getElementById('clear-all');
const container = document.getElementById('list-container');

const loadList = () => {
  chrome.storage.local.get(['snippets'], (res) => {
    renderList(res.snippets || []);
  });
};

saveBtn.addEventListener('click', () => {
  const title = titleInput.value.trim() || 'Untitled';
  const code = codeInput.value.trim();
  if (!code) return;

  chrome.storage.local.get(['snippets'], (res) => {
    const snippets = res.snippets || [];
    // 日付を削除し、ID、タイトル、コードのみ保存
    const newItem = { id: Date.now(), title: title, code: code };
    const newList = [newItem, ...snippets];
    chrome.storage.local.set({ snippets: newList }, () => {
      titleInput.value = '';
      codeInput.value = '';
      renderList(newList);
    });
  });
});

clearAllBtn.addEventListener('click', () => {
  if (confirm('すべて削除しますか？')) {
    chrome.storage.local.set({ snippets: [] }, () => renderList([]));
  }
});

function renderList(list) {
  container.innerHTML = '';
  list.forEach((item) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <div class="card-title">${item.title}</div>
      <pre class="code-preview"><code>${item.code}</code></pre>
      <div class="actions">
        <button class="copy-btn" data-code="${encodeURIComponent(item.code)}">コピー</button>
        <button class="del-btn" data-id="${item.id}">削除</button>
      </div>
    `;

    card.querySelector('.copy-btn').onclick = (e) => {
      const code = decodeURIComponent(e.target.getAttribute('data-code'));
      navigator.clipboard.writeText(code);
      const originalText = e.target.textContent;
      e.target.textContent = 'OK!';
      setTimeout(() => e.target.textContent = originalText, 800);
    };

    card.querySelector('.del-btn').onclick = () => {
      const newList = list.filter(i => i.id !== item.id);
      chrome.storage.local.set({ snippets: newList }, () => renderList(newList));
    };

    container.appendChild(card);
  });
}

loadList();
