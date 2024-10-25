// Функція для завантаження постів з JSON-файлу
async function loadPosts() {
    try {
        const response = await fetch('posts.json');
        if (!response.ok) throw new Error('Network response was not ok');
        const posts = await response.json();
        displayPosts(posts);
    } catch (error) {
        console.error('Fetch error:', error);
    }
}

// Функція для відображення постів
function displayPosts(posts) {
    const postsContainer = document.getElementById('posts-container');
    postsContainer.innerHTML = ''; // Очищаємо контейнер перед новим завантаженням

    posts.forEach(post => {
        const postElement = createPostElement(post);
        postsContainer.appendChild(postElement);
    });

    // Відновлюємо статус лайків з localStorage
    restoreLikes();
}

// Створення елемента поста
function createPostElement(post) {
    const postElement = document.createElement('div');
    postElement.classList.add('post');
    postElement.innerHTML = `
        <h3>${post.title}</h3>
        <img src="${post.image}" alt="${post.title}" class="post-image">
        <p>${post.content}</p>
        <div class="post-actions">
            <button id="like-button-${post.id}" class="like-button" onclick="toggleLike(${post.id})">
                <i class="fas fa-heart"></i> 
            </button>
            <span id="like-count-${post.id}" class="like-count">${post.likes || 0}</span>
            <button class="comment-button">
                <i class="fas fa-comment"></i> 
            </button>
            <button class="share-button">
                <i class="fas fa-share"></i> 
            </button>
        </div>
    `;
    return postElement;
}

// Функція для перемикання лайків
function toggleLike(postId) {
    const likes = JSON.parse(localStorage.getItem('likes')) || {};
    likes[postId] = !likes[postId];
    localStorage.setItem('likes', JSON.stringify(likes));
    updateLikeButton(postId, likes[postId]);
    updateLikeCount(postId, likes[postId]);
}

// Оновлення статусу кнопки лайка
function updateLikeButton(postId, isLiked) {
    const likeButton = document.getElementById(`like-button-${postId}`);
    likeButton.classList.toggle('liked', isLiked);
}

// Оновлення лічильника лайків
function updateLikeCount(postId, isLiked) {
    const likeCountSpan = document.getElementById(`like-count-${postId}`);
    let currentCount = parseInt(likeCountSpan.textContent);
    likeCountSpan.textContent = isLiked ? currentCount + 1 : currentCount - 1;
}

// Відновлення статусу лайків з localStorage
function restoreLikes() {
    const likes = JSON.parse(localStorage.getItem('likes')) || {};
    for (const postId in likes) {
        if (likes[postId]) {
            updateLikeButton(parseInt(postId), true);
        }
    }
}

// Перемикач теми
document.getElementById('theme-toggle').addEventListener('click', toggleTheme);

// Функція для перемикання теми
function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    document.getElementById('theme-toggle').textContent = document.body.classList.contains('dark-theme') ? '💡' : '💡';
}

// Завантажуємо пости при завантаженні сторінки
document.addEventListener('DOMContentLoaded', loadPosts);
