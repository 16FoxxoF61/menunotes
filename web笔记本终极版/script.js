const emojis = ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳', '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣', '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠', '😡', '🤬', '🤯', '😳', '🥵', '🥶', '😱', '😨', '😰', '😥', '😓', '🤗', '🤔', '🤭', '🤫', '🤥', '😶', '😐', '😑', '😬', '🙄', '😯', '😦', '😧', '😮', '😲', '🥱', '😴', '🤤', '😪', '😵', '🤐', '🥴', '🤢', '🤮', '🤧', '😷', '🤒', '🤕', '🤑', '🤠', '😈', '👿', '👹', '👺', '🤡', '💩', '👻', '💀', '☠️', '👽', '👾', '🤖', '🎃', '😺', '😸', '😹', '😻', '😼', '😽', '🙀', '😿', '😾', '👋', '🤚', '🖐', '✋', '🖖', '👌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '👍', '👎', '✊', '👊', '🤛', '🤜', '👏', '🙌', '👐', '🤲', '🤝', '🙏', '✍️', '💅', '🤳', '💪', '🦾', '🦵', '🦿', '🦶', '👣', '👂', '🦻', '👃', '🧠', '🦷', '🦴', '👀', '👁', '👅', '👄', '💋', '🩸'];

function toggleForm() {
    const form = document.getElementById('menu-form');
    form.style.display = form.style.display === 'none' ? 'block' : 'none';
}

function addMenuItem() {
    const item = document.getElementById('menu-item').value;
    const description = document.getElementById('menu-description').value;
    const time = getCurrentTime();
    
    if (!item) return; // 如果标题为空，不添加

    createMenuItem(item, description, time);
    
    // 清空输入框并隐藏表单
    document.getElementById('menu-item').value = '';
    document.getElementById('menu-description').value = '';
    toggleForm();

    saveToLocalStorage();
}

function createMenuItem(item, description, time) {
    const menuItem = document.createElement('div');
    menuItem.className = 'menu-item';
    menuItem.innerHTML = `
        <h3>${item}</h3>
        <p>${description}</p>
        <small>${time}</small>
        <button class="delete-button" onclick="deleteMenuItem(this.parentNode)"><i class="fas fa-trash"></i></button>
    `;
    
    document.getElementById('menu-list').appendChild(menuItem);
}

function deleteMenuItem(item) {
    if (confirm('确定要删除这条记录吗？')) {
        item.remove();
        saveToLocalStorage();
    }
}

function saveToLocalStorage() {
    const menuList = document.getElementById('menu-list').innerHTML;
    localStorage.setItem('menuNotebook', menuList);
}

function getCurrentTime() {
    const now = new Date();
    return now.toLocaleString('zh-CN', { hour12: false });
}

function downloadAsImage() {
    html2canvas(document.getElementById('notebook')).then(function(canvas) {
        const link = document.createElement('a');
        link.download = '猩狒狐苏日记.png';
        link.href = canvas.toDataURL();
        link.click();
    });
}

// 加载保存的笔记
window.onload = function() {
    const savedMenu = localStorage.getItem('menuNotebook');
    if (savedMenu) {
        document.getElementById('menu-list').innerHTML = savedMenu;
    }
    changeGlobalBackgroundColor();
    changeGlobalFontColor();
    initializeEmojiList();
}

function initializeEmojiList() {
    const emojiList = document.getElementById('emojiList');
    emojiList.innerHTML = ''; // 清空现有内容
    emojis.forEach(emoji => {
        const button = document.createElement('button');
        button.innerHTML = emoji;
        button.onclick = function(e) { 
            e.preventDefault(); // 防止表单提交
            addEmoji(emoji);
            toggleEmojiList(); // 选择后关闭列表
        };
        emojiList.appendChild(button);
    });
}

function addNote(e) {
    e.preventDefault();
    const title = document.getElementById('note-title').value.trim();
    const content = document.getElementById('note-content').value.trim();
    const mood = document.getElementById('note-mood').value.trim();
    const motto = document.getElementById('note-motto').value.trim();
    const noteList = document.getElementById('note-list');
    
    if (title && content && mood && motto) {
        const now = new Date();
        const timeString = now.toLocaleString('zh-CN', { 
            year: 'numeric', 
            month: '2-digit', 
            day: '2-digit', 
            hour: '2-digit', 
            minute: '2-digit',
            second: '2-digit',
            hour12: false 
        });
        
        const noteCard = document.createElement('div');
        noteCard.className = 'note-card';
        noteCard.style.backgroundColor = document.body.style.backgroundColor;
        noteCard.style.color = document.body.style.color;
        noteCard.innerHTML = `
            <div class="card-actions">
                <button onclick="deleteNote(this)"><i class="fas fa-trash"></i></button>
                <button onclick="downloadNoteImage(this)"><i class="fas fa-download"></i></button>
            </div>
            <div class="card-content">
                <div class="header">${title}</div>
                <div class="line"></div>
                <div class="content">${content.replace(/\n/g, '<br>')}</div>
                <div class="line"></div>
                <div class="content">Mood: ${mood}</div>
                <div class="motto">${motto}</div>
                <div class="card-footer">
                    ${timeString}<br>
                    ご来店ありがとうございました
                </div>
            </div>
        `;
        
        noteList.insertBefore(noteCard, noteList.firstChild);
        document.getElementById('note-form').reset();
    }
}

document.getElementById('note-form').addEventListener('submit', addNote);

function changeGlobalBackgroundColor() {
    const color = document.getElementById('global-background-color').value;
    document.body.style.backgroundColor = color;
    document.querySelectorAll('.note-card').forEach(card => {
        card.style.backgroundColor = color;
    });
}

function changeGlobalFontColor() {
    const color = document.getElementById('global-font-color').value;
    document.body.style.color = color;
    document.querySelectorAll('.note-card').forEach(card => {
        card.style.color = color;
    });
}

function toggleEmojiList() {
    const emojiList = document.getElementById("emojiList");
    if (emojiList.classList.contains("show")) {
        emojiList.classList.remove("show");
    } else {
        emojiList.classList.add("show");
        if (emojiList.children.length === 0) {
            initializeEmojiList();
        }
    }
}

function addEmoji(emoji) {
    const moodInput = document.getElementById('note-mood');
    moodInput.value += emoji;
}

function deleteNote(button) {
    if (confirm('确定要删除这条笔记吗？')) {
        button.closest('.note-card').remove();
    }
}

function downloadNoteImage(button) {
    const noteCard = button.closest('.note-card');
    const cardContent = noteCard.querySelector('.card-content');
    
    // 先获取实际内容的尺寸
    const contentWidth = cardContent.offsetWidth;
    const contentHeight = cardContent.offsetHeight;
    
    // 使用更高的缩放比例
    const scale = 4;
    
    html2canvas(cardContent, {
        scale: scale,
        width: contentWidth,
        height: contentHeight,
        backgroundColor: noteCard.style.backgroundColor || '#F8F1D0',
        logging: false,
        useCORS: true,
        allowTaint: true
    }).then(canvas => {
        // 创建一个新的canvas，用于居中内容
        const finalCanvas = document.createElement('canvas');
        const ctx = finalCanvas.getContext('2d');
        
        // 设置最终图片的尺寸，添加少量内边距
        finalCanvas.width = contentWidth * scale + 80;
        finalCanvas.height = contentHeight * scale + 80;
        
        // 填充背景色
        ctx.fillStyle = noteCard.style.backgroundColor || '#F8F1D0';
        ctx.fillRect(0, 0, finalCanvas.width, finalCanvas.height);
        
        // 在新canvas上居中绘制内容
        ctx.drawImage(canvas, 40, 40);
        
        const link = document.createElement('a');
        link.download = '笔记卡片_' + new Date().getTime() + '.png';
        // 使用最高质量的PNG格式
        link.href = finalCanvas.toDataURL('image/png', 1.0);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }).catch(error => {
        console.error('Error in html2canvas', error);
    });
}

// 确保在页面加载时初始化表情列表
window.addEventListener('load', function() {
    initializeEmojiList();
});