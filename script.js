// ===== Static Facts Database =====
const facts = {
    science: [
        "Your brain has around 100 billion nerve cells.",
        "An adult human contains about 7 octillion atoms.",
        "Hot water can freeze faster than cold water under certain conditions (Mpemba effect).",
        "The world's oldest known animal was a 507-year-old mollusc, accidentally killed by scientists.",
        "The ratio of human cells to bacteria cells in your body is roughly 1:1.",
        "Mitochondria and chloroplasts were likely ancient bacteria that became part of eukaryotic cells.",
        "Glow sticks create light through chemiluminescence, without heat or electricity.",
        "Helium makes balloons float because it's lighter than air.",
        "Rockets escape Earth's gravity by achieving escape velocity of about 11.2 km/s.",
        "Your brain is more powerful and complex than any supercomputer."
    ],
    language: [
        "There are over 7,000 known languages in the world.",
        "There's a language spoken by only 3 people in the world.",
        "Over 300 languages are spoken in the United States.",
        "Basque is a 'mystery language' with no known relatives.",
        "The Rotokas language has only 12 letters in its alphabet.",
        "Cambodian (Khmer) has the longest alphabet with 74 characters.",
        "There's a language spoken by just 8 people.",
        "Chinese has around 50,000 different characters.",
        "Mandarin Chinese is considered the hardest language to learn for English speakers.",
        "English has the most words of any language, over 1 million."
    ],
    art: [
        "Painting the Mona Lisa's lips took Leonardo da Vinci 12 years.",
        "Pablo Picasso was an animal lover and owned a pet monkey named Monina.",
        "Artists like Leonardo da Vinci studied human anatomy centuries before modern science fully understood it.",
        "Willard Wigan creates the smallest artworks in the world, fitting inside the eye of a needle.",
        "The Last Supper by da Vinci depicts a famous biblical dinner scene.",
        "Arcimboldo painted portraits made entirely of fruits and vegetables.",
        "Michelangelo painted the Sistine Chapel ceiling lying on his back.",
        "Van Gogh painted over 2,000 artworks but sold only one in his lifetime.",
        "The Statue of Liberty was a gift from France to the United States.",
        "Ancient cave paintings date back over 40,000 years."
    ],
    space: [
        "One million Earths could fit inside the Sun.",
        "A day on Venus is longer than a year on Venus.",
        "Astronauts grow taller in space due to lack of gravity.",
        "The Moon is slowly moving away from Earth at about 3.8 cm per year.",
        "In the Hubble Ultra Deep Field, a tiny patch of sky holds about 10,000 galaxies.",
        "Ceres makes up about one-third of the mass of the asteroid belt.",
        "Giant storms on Neptune could swallow the entire Earth.",
        "The Sun is an average-sized star in our galaxy.",
        "There are more stars in the universe than grains of sand on all Earth's beaches.",
        "Black holes have gravity so strong that not even light can escape."
    ],
    history: [
        "Cleopatra lived closer in time to the Moon landing than to the construction of the Great Pyramid of Giza.",
        "The shortest war in history was between Britain and Zanzibar on August 27, 1896, lasting only 38 minutes.",
        "In ancient Rome, urine was used as a mouthwash because of its ammonia content.",
        "The first known computer programmer was Ada Lovelace in the 1840s.",
        "Albert Einstein's last words are unknown because the nurse at his bedside didn't speak German.",
        "The Great Wall of China is not visible from space with the naked eye, contrary to popular belief.",
        "The pyramids were built by paid laborers, not slaves, as evidenced by workers' tombs nearby.",
        "Oxford University is older than the Aztec Empire.",
        "The fax machine was invented before the telephone, in 1843.",
        "The last guillotine execution in France was in 1977."
    ]
};

// ===== Achievement Definitions =====
const achievements = [
    { id: 'first_fact', name: 'First Step', desc: 'Read your first fact', icon: '🎯', unlockAt: 1 },
    { id: 'week_streak', name: 'Week Warrior', desc: '7-day streak', icon: '🔥', unlockAt: 7 },
    { id: 'two_week', name: 'Fortnight Master', desc: '14-day streak', icon: '⚡', unlockAt: 14 },
    { id: 'month_streak', name: 'Monthly Legend', desc: '30-day streak', icon: '👑', unlockAt: 30 },
    { id: 'ten_facts', name: 'Knowledge Seeker', desc: 'Learn 10 facts', icon: '📚', unlockAt: 10 },
    { id: 'fifty_facts', name: 'Fact Expert', desc: 'Learn 50 facts', icon: '🎓', unlockAt: 50 },
    { id: 'hundred_facts', name: 'Century Club', desc: 'Learn 100 facts', icon: '💯', unlockAt: 100 },
    { id: 'first_favorite', name: 'Collector', desc: 'Save first favorite', icon: '❤️', unlockAt: 1, type: 'favorite' }
];

// ===== DOM Elements =====
let themeSelect, factTitle, factContent, factSource, loader;
let newFactBtn, shareBtn, readAloudBtn, favoriteBtn;
let streakCount, totalFactsEl, favoriteCountEl;
let factCard, body, confettiCanvas, ctx;
let profileIcon, dropdown, darkModeToggle, soundToggle;
let favoritesModal, favoritesList, viewFavoritesBtn;
let achievementsList, progressChart, toast;
let resetStatsBtn, difficultyBadge, streakProgressBar;

// ===== Configuration =====
const themeIcons = {
    science: 'fa-flask',
    language: 'fa-book',
    art: 'fa-palette',
    space: 'fa-rocket',
    history: 'fa-landmark'
};

const categoryMap = {
    science: 17,
    language: 10,
    art: 25,
    space: 17,
    history: 23
};

// ===== State Variables =====
let currentTheme = 'science';
let soundEnabled = true;
let currentFact = null;
let speechSynthesis = window.speechSynthesis;

// ===== Initialization =====
document.addEventListener('DOMContentLoaded', () => {
    initializeElements();
    loadSettings();
    setupEventListeners();
    updateFact(currentTheme);
    updateStreak();
    updateStats();
    renderAchievements();
    drawProgressChart();
});

// ===== Initialize DOM Elements =====
function initializeElements() {
    themeSelect = document.getElementById('theme-select');
    factTitle = document.getElementById('fact-title');
    factContent = document.getElementById('fact-content');
    factSource = document.getElementById('fact-source');
    loader = document.getElementById('loader');
    newFactBtn = document.getElementById('new-fact');
    shareBtn = document.getElementById('share-fact');
    readAloudBtn = document.getElementById('read-aloud');
    favoriteBtn = document.getElementById('favorite-btn');
    streakCount = document.getElementById('streak-count');
    totalFactsEl = document.getElementById('total-facts');
    favoriteCountEl = document.getElementById('favorite-count');
    factCard = document.getElementById('fact-card');
    body = document.body;
    confettiCanvas = document.getElementById('confetti-canvas');
    ctx = confettiCanvas.getContext('2d');
    profileIcon = document.getElementById('profile-icon');
    dropdown = document.getElementById('dropdown');
    darkModeToggle = document.getElementById('dark-mode-toggle');
    soundToggle = document.getElementById('sound-toggle');
    favoritesModal = document.getElementById('favorites-modal');
    favoritesList = document.getElementById('favorites-list');
    viewFavoritesBtn = document.getElementById('view-favorites');
    achievementsList = document.getElementById('achievements-list');
    progressChart = document.getElementById('progress-chart');
    toast = document.getElementById('toast');
    resetStatsBtn = document.getElementById('reset-stats');
    difficultyBadge = document.getElementById('difficulty-badge');
    streakProgressBar = document.getElementById('streak-progress-bar');
}

// ===== Load Settings =====
function loadSettings() {
    currentTheme = localStorage.getItem('theme') || 'science';
    themeSelect.value = currentTheme;
    updateThemeStyles(currentTheme);

    const darkMode = localStorage.getItem('darkMode') === 'enabled';
    if (darkMode) body.classList.add('dark');
    darkModeToggle.checked = darkMode;

    soundEnabled = localStorage.getItem('soundEnabled') !== 'disabled';
    soundToggle.checked = soundEnabled;
}

// ===== Setup Event Listeners =====
function setupEventListeners() {
    themeSelect.addEventListener('change', (e) => {
        currentTheme = e.target.value;
        localStorage.setItem('theme', currentTheme);
        updateThemeStyles(currentTheme);
        updateFact(currentTheme);
    });

    profileIcon.addEventListener('click', () => {
        dropdown.classList.toggle('show');
    });

    window.addEventListener('click', (e) => {
        if (!e.target.matches('#profile-icon') && !dropdown.contains(e.target)) {
            dropdown.classList.remove('show');
        }
    });

    darkModeToggle.addEventListener('change', () => {
        if (darkModeToggle.checked) {
            body.classList.add('dark');
            localStorage.setItem('darkMode', 'enabled');
        } else {
            body.classList.remove('dark');
            localStorage.setItem('darkMode', 'disabled');
        }
    });

    soundToggle.addEventListener('change', () => {
        soundEnabled = soundToggle.checked;
        localStorage.setItem('soundEnabled', soundEnabled ? 'enabled' : 'disabled');
    });

    newFactBtn.addEventListener('click', () => {
        const today = getTodayDate();
        const storageKey = `fact-${currentTheme}-${today}`;
        localStorage.removeItem(storageKey);
        updateFact(currentTheme);
        playSound('click');
    });

    shareBtn.addEventListener('click', () => {
        const fact = factContent.textContent;
        const shareText = `${fact}\n\nLearn One Fun Thing a Day! 🎯`;
        
        if (navigator.share) {
            navigator.share({
                title: 'Fun Fact',
                text: shareText
            }).catch(() => {});
        } else {
            navigator.clipboard.writeText(shareText).then(() => {
                showToast('Fact copied to clipboard!');
            });
        }
        playSound('success');
    });

    readAloudBtn.addEventListener('click', () => {
        readFactAloud();
        playSound('click');
    });

    favoriteBtn.addEventListener('click', () => {
        toggleFavorite();
    });

    viewFavoritesBtn.addEventListener('click', () => {
        showFavoritesModal();
    });

    const closeModal = favoritesModal.querySelector('.close');
    closeModal.addEventListener('click', () => {
        favoritesModal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === favoritesModal) {
            favoritesModal.style.display = 'none';
        }
    });

    resetStatsBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to reset all statistics? This cannot be undone.')) {
            resetAllStats();
        }
    });

    // Footer links
    document.getElementById('about-link').addEventListener('click', (e) => {
        e.preventDefault();
        showToast('Learn One Fun Thing a Day - Expand your knowledge daily!');
    });

    document.getElementById('privacy-link').addEventListener('click', (e) => {
        e.preventDefault();
        showToast('Your data is stored locally on your device only.');
    });

    document.getElementById('contact-link').addEventListener('click', (e) => {
        e.preventDefault();
        showToast('Contact: hello@learnfunfacts.com');
    });
}

// ===== Date Utilities =====
function getTodayDate() {
    return new Date().toDateString();
}

function getDayOfYear() {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now - start;
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
}

// ===== HTML Entity Decoder =====
function decodeHTMLEntities(text) {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = text;
    return textarea.value;
}

// ===== Format Question as Fact =====
function formatAsFact(question, answer) {
    question = decodeHTMLEntities(question);
    answer = decodeHTMLEntities(answer);
    question = question.replace(/\?$/, '').trim();

    let match = question.match(/^(Who|What|Which|When|Where|How)\b\s*(is|are|was|were|has|have|had|does|do|did)\s*(.*)/i);
    if (match) {
        let wh = match[1];
        let aux = match[2];
        let rest = match[3].trim();
        let statement = '';
        if (rest) {
            statement = rest.charAt(0).toUpperCase() + rest.slice(1) + ' ' + aux + ' ' + answer + '.';
        } else {
            statement = wh.toLowerCase() + ' ' + aux + ' ' + answer + '.';
        }
        statement = statement.replace(/The the /i, 'The ');
        return statement;
    }

    match = question.match(/^Which\s+([\w]+)'s\s+(\w+)\s+(is|are|was|were|has|have|had)\s*(.*)/i);
    if (match) {
        let noun = match[1];
        let property = match[2];
        let aux = match[3];
        let rest = match[4].trim();
        return `${answer}'s ${property} ${aux} ${rest}.`;
    }

    match = question.match(/^(When|Where|How)\b\s*(was|were|is|are)\s*(.*)/i);
    if (match) {
        let wh = match[1];
        let aux = match[2];
        let subject = match[3].trim();
        return `${subject.charAt(0).toUpperCase() + subject.slice(1)} ${aux} ${wh.toLowerCase()} ${answer}.`;
    }

    return `${answer} is the answer to "${question}".`;
}

// ===== Update Fact =====
async function updateFact(theme) {
    const today = getTodayDate();
    const storageKey = `fact-${theme}-${today}`;
    let dailyFact = localStorage.getItem(storageKey);
    let source = 'API';
    let difficulty = null;

    loader.classList.remove('hidden');
    factContent.classList.add('hidden');
    factSource.classList.add('hidden');
    difficultyBadge.classList.add('hidden');

    if (!dailyFact) {
        let attempts = 3;
        while (attempts > 0) {
            try {
                const categoryId = categoryMap[theme];
                const response = await fetch(`https://opentdb.com/api.php?amount=1&category=${categoryId}`);
                const data = await response.json();
                if (data.response_code === 0 && data.results.length > 0) {
                    const result = data.results[0];
                    dailyFact = formatAsFact(result.question, result.correct_answer);
                    difficulty = result.difficulty;
                    localStorage.setItem(storageKey, dailyFact);
                    localStorage.setItem(`${storageKey}-difficulty`, difficulty);
                    break;
                } else {
                    throw new Error('API response error');
                }
            } catch (error) {
                console.error('Error fetching fact:', error);
                attempts--;
                if (attempts === 0) {
                    const day = getDayOfYear();
                    const factIndex = day % facts[theme].length;
                    dailyFact = facts[theme][factIndex];
                    source = 'Static';
                }
            }
        }
    } else {
        difficulty = localStorage.getItem(`${storageKey}-difficulty`);
    }

    currentFact = { content: dailyFact, theme, source, difficulty };

    const iconClass = themeIcons[theme];
    factTitle.innerHTML = `<i class="fas ${iconClass}"></i> Today's ${theme.charAt(0).toUpperCase() + theme.slice(1)} Fact`;
    factContent.textContent = dailyFact;
    factSource.textContent = `Source: ${source}`;
    factCard.setAttribute('data-theme', theme);

    if (difficulty) {
        difficultyBadge.textContent = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
        difficultyBadge.className = `difficulty-badge ${difficulty}`;
        difficultyBadge.classList.remove('hidden');
    }

    updateFavoriteButton();

    loader.classList.add('hidden');
    factContent.classList.remove('hidden');
    factSource.classList.remove('hidden');
    factSource.classList.add('visible');

    factCard.classList.remove('loaded');
    setTimeout(() => {
        factCard.classList.add('loaded');
    }, 100);

    incrementTotalFacts();
    checkAchievements();
}

// ===== Update Theme Styles =====
function updateThemeStyles(theme) {
    body.setAttribute('data-theme', theme);
}

// ===== Streak Management =====
function updateStreak() {
    const today = getTodayDate();
    let lastVisit = localStorage.getItem('lastVisit');
    let streak = parseInt(localStorage.getItem('streak')) || 0;
    let streakIncreased = false;

    if (lastVisit === today) {
        // Already visited today
    } else {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toDateString();

        if (lastVisit === yesterdayStr) {
            streak++;
            streakIncreased = true;
        } else if (lastVisit) {
            streak = 1;
        } else {
            streak = 1;
        }

        localStorage.setItem('lastVisit', today);
        localStorage.setItem('streak', streak);
    }

    streakCount.textContent = streak;
    
    const progressPercent = Math.min((streak % 30) / 30 * 100, 100);
    streakProgressBar.style.width = `${progressPercent}%`;

    if (streak >= 7) {
        streakCount.classList.add('hot');
    } else {
        streakCount.classList.remove('hot');
    }

    if (streakIncreased) {
        if (streak === 7 || streak === 14 || streak === 30 || streak % 50 === 0) {
            triggerConfetti();
            playSound('achievement');
            showToast(`🎉 Amazing! ${streak}-day streak!`);
        }
    }

    checkAchievements();
}

// ===== Stats Management =====
function updateStats() {
    const totalFacts = parseInt(localStorage.getItem('totalFacts')) || 0;
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    
    totalFactsEl.textContent = totalFacts;
    favoriteCountEl.textContent = favorites.length;
}

function incrementTotalFacts() {
    let totalFacts = parseInt(localStorage.getItem('totalFacts')) || 0;
    totalFacts++;
    localStorage.setItem('totalFacts', totalFacts);
    totalFactsEl.textContent = totalFacts;
    checkAchievements();
}

// ===== Favorites Management =====
function toggleFavorite() {
    if (!currentFact) return;

    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const factId = `${currentFact.theme}-${currentFact.content.substring(0, 50)}`;
    const existingIndex = favorites.findIndex(f => f.id === factId);

    if (existingIndex >= 0) {
        favorites.splice(existingIndex, 1);
        favoriteBtn.classList.remove('active');
        favoriteBtn.innerHTML = '<i class="far fa-heart"></i>';
        showToast('Removed from favorites');
        playSound('click');
    } else {
        favorites.push({
            id: factId,
            ...currentFact,
            date: new Date().toLocaleDateString()
        });
        favoriteBtn.classList.add('active');
        favoriteBtn.innerHTML = '<i class="fas fa-heart"></i>';
        showToast('Added to favorites!');
        playSound('success');
    }

    localStorage.setItem('favorites', JSON.stringify(favorites));
    updateStats();
    checkAchievements();
}

function updateFavoriteButton() {
    if (!currentFact) return;

    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const factId = `${currentFact.theme}-${currentFact.content.substring(0, 50)}`;
    const isFavorite = favorites.some(f => f.id === factId);

    if (isFavorite) {
        favoriteBtn.classList.add('active');
        favoriteBtn.innerHTML = '<i class="fas fa-heart"></i>';
    } else {
        favoriteBtn.classList.remove('active');
        favoriteBtn.innerHTML = '<i class="far fa-heart"></i>';
    }
}

function showFavoritesModal() {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favoritesList.innerHTML = '';

    if (favorites.length === 0) {
        favoritesList.innerHTML = '<p style="text-align: center; color: var(--subtitle-color);">No favorites yet. Start adding some!</p>';
    } else {
        favorites.reverse().forEach(fav => {
            const item = document.createElement('div');
            item.className = 'favorite-item';
            item.innerHTML = `
                <button class="remove-favorite" data-id="${fav.id}">
                    <i class="fas fa-times"></i>
                </button>
                <div class="favorite-item-title">${fav.theme.charAt(0).toUpperCase() + fav.theme.slice(1)} Fact</div>
                <div class="favorite-item-content">${fav.content}</div>
                <div class="favorite-item-meta">Saved on ${fav.date}</div>
            `;
            favoritesList.appendChild(item);
        });

        document.querySelectorAll('.remove-favorite').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.getAttribute('data-id');
                removeFavorite(id);
            });
        });
    }

    favoritesModal.style.display = 'block';
}

function removeFavorite(id) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favorites = favorites.filter(f => f.id !== id);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    updateStats();
    showFavoritesModal();
    showToast('Favorite removed');
}

// ===== Achievements System =====
function renderAchievements() {
    achievementsList.innerHTML = '';
    const unlockedAchievements = JSON.parse(localStorage.getItem('unlockedAchievements')) || [];

    achievements.forEach(ach => {
        const isUnlocked = unlockedAchievements.includes(ach.id);
        const achEl = document.createElement('div');
        achEl.className = `achievement ${isUnlocked ? 'unlocked' : 'locked'}`;
        achEl.innerHTML = `
            <div class="achievement-icon">${ach.icon}</div>
            <div class="achievement-name">${ach.name}</div>
            <div class="achievement-desc">${ach.desc}</div>
        `;
        achievementsList.appendChild(achEl);
    });
}

function checkAchievements() {
    const streak = parseInt(localStorage.getItem('streak')) || 0;
    const totalFacts = parseInt(localStorage.getItem('totalFacts')) || 0;
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    let unlockedAchievements = JSON.parse(localStorage.getItem('unlockedAchievements')) || [];

    achievements.forEach(ach => {
        if (unlockedAchievements.includes(ach.id)) return;

        let shouldUnlock = false;

        if (ach.type === 'favorite') {
            shouldUnlock = favorites.length >= ach.unlockAt;
        } else if (ach.id.includes('streak')) {
            shouldUnlock = streak >= ach.unlockAt;
        } else {
            shouldUnlock = totalFacts >= ach.unlockAt;
        }

        if (shouldUnlock) {
            unlockedAchievements.push(ach.id);
            showToast(`🏆 Achievement Unlocked: ${ach.name}!`);
            playSound('achievement');
            triggerConfetti();
        }
    });

    localStorage.setItem('unlockedAchievements', JSON.stringify(unlockedAchievements));
    renderAchievements();
}

// ===== Text-to-Speech =====
function readFactAloud() {
    if (!currentFact) return;

    if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
        readAloudBtn.innerHTML = '<i class="fas fa-volume-up"></i> Read Aloud';
        return;
    }

    const utterance = new SpeechSynthesisUtterance(currentFact.content);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onstart = () => {
        readAloudBtn.innerHTML = '<i class="fas fa-stop"></i> Stop';
    };

    utterance.onend = () => {
        readAloudBtn.innerHTML = '<i class="fas fa-volume-up"></i> Read Aloud';
    };

    speechSynthesis.speak(utterance);
}

// ===== Progress Chart =====
function drawProgressChart() {
    const canvas = progressChart;
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = 250;

    const weeklyData = getWeeklyProgress();
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Calculate dimensions
    const padding = 40;
    const chartWidth = canvas.width - (padding * 2);
    const chartHeight = canvas.height - (padding * 2);
    const barWidth = chartWidth / 7 - 10;
    const maxValue = Math.max(...weeklyData, 1);

    // Get CSS variables for colors
    const computedStyle = getComputedStyle(document.body);
    const textColor = computedStyle.getPropertyValue('--text').trim();
    const focusColor = computedStyle.getPropertyValue('--focus-border').trim();
    const subtitleColor = computedStyle.getPropertyValue('--subtitle-color').trim();

    // Draw bars
    weeklyData.forEach((value, index) => {
        const barHeight = (value / maxValue) * chartHeight;
        const x = padding + (index * (barWidth + 10));
        const y = canvas.height - padding - barHeight;

        // Draw bar
        const gradient = ctx.createLinearGradient(x, y, x, canvas.height - padding);
        gradient.addColorStop(0, focusColor);
        gradient.addColorStop(1, focusColor + '80');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, barWidth, barHeight);

        // Draw value on top of bar
        ctx.fillStyle = textColor;
        ctx.font = 'bold 14px Poppins';
        ctx.textAlign = 'center';
        if (value > 0) {
            ctx.fillText(value, x + barWidth / 2, y - 5);
        }

        // Draw day label
        ctx.fillStyle = subtitleColor;
        ctx.font = '12px Poppins';
        ctx.fillText(days[index], x + barWidth / 2, canvas.height - padding + 20);
    });

    // Draw axes
    ctx.strokeStyle = subtitleColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, canvas.height - padding);
    ctx.lineTo(canvas.width - padding, canvas.height - padding);
    ctx.stroke();
}

function getWeeklyProgress() {
    const progress = new Array(7).fill(0);
    const today = new Date();
    const dayOfWeek = today.getDay();

    for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - (dayOfWeek - i));
        const dateStr = date.toDateString();
        
        // Check if user visited on this day
        const visited = localStorage.getItem(`visited-${dateStr}`);
        if (visited) {
            progress[i] = parseInt(visited);
        }
    }

    // Mark today's visit
    const todayStr = today.toDateString();
    let todayCount = parseInt(localStorage.getItem(`visited-${todayStr}`)) || 0;
    todayCount++;
    localStorage.setItem(`visited-${todayStr}`, todayCount);
    progress[dayOfWeek] = todayCount;

    return progress;
}

// ===== Confetti Animation =====
function triggerConfetti() {
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
    const colors = ['#ff0a54', '#ffbe0b', '#8338ec', '#3a86ff', '#06d6a0', '#f72585'];
    const particles = [];

    for (let i = 0; i < 150; i++) {
        particles.push({
            x: Math.random() * confettiCanvas.width,
            y: Math.random() * confettiCanvas.height - confettiCanvas.height,
            size: Math.random() * 5 + 3,
            speedX: Math.random() * 6 - 3,
            speedY: Math.random() * 3 + 2,
            color: colors[Math.floor(Math.random() * colors.length)],
            rotation: Math.random() * 360,
            rotationSpeed: Math.random() * 10 - 5
        });
    }

    function animate() {
        ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
        
        particles.forEach((p, index) => {
            p.x += p.speedX;
            p.y += p.speedY;
            p.rotation += p.rotationSpeed;
            p.speedY += 0.1; // Gravity
            p.size *= 0.99;

            if (p.size > 0.5 && p.y < confettiCanvas.height) {
                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate(p.rotation * Math.PI / 180);
                ctx.fillStyle = p.color;
                ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
                ctx.restore();
            } else {
                particles.splice(index, 1);
            }
        });

        if (particles.length > 0) {
            requestAnimationFrame(animate);
        }
    }

    animate();
}

// ===== Toast Notifications =====
function showToast(message) {
    toast.textContent = message;
    toast.className = 'toast show';
    
    setTimeout(() => {
        toast.className = 'toast';
    }, 3000);
}

// ===== Sound Effects =====
function playSound(type) {
    if (!soundEnabled) return;

    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    switch(type) {
        case 'click':
            oscillator.frequency.value = 800;
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.1);
            break;
        case 'success':
            oscillator.frequency.value = 600;
            gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
            oscillator.start(audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(800, audioContext.currentTime + 0.2);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
            oscillator.stop(audioContext.currentTime + 0.2);
            break;
        case 'achievement':
            oscillator.frequency.value = 523.25; // C5
            gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
            oscillator.start(audioContext.currentTime);
            
            setTimeout(() => {
                oscillator.frequency.value = 659.25; // E5
            }, 100);
            
            setTimeout(() => {
                oscillator.frequency.value = 783.99; // G5
            }, 200);
            
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
            oscillator.stop(audioContext.currentTime + 0.4);
            break;
    }
}

// ===== Reset Statistics =====
function resetAllStats() {
    const keysToKeep = ['theme', 'darkMode', 'soundEnabled'];
    const allKeys = Object.keys(localStorage);
    
    allKeys.forEach(key => {
        if (!keysToKeep.includes(key)) {
            localStorage.removeItem(key);
        }
    });

    location.reload();
}

// ===== Responsive Chart Redraw =====
window.addEventListener('resize', () => {
    drawProgressChart();
});

// ===== Service Worker for PWA (Optional) =====
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch(() => {
            // Service worker registration failed, continue without it
        });
    });
}

// ===== Keyboard Shortcuts =====
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + N: New Fact
    if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        newFactBtn.click();
    }
    
    // Ctrl/Cmd + S: Share
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        shareBtn.click();
    }
    
    // Ctrl/Cmd + R: Read Aloud
    if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
        e.preventDefault();
        readAloudBtn.click();
    }
    
    // Ctrl/Cmd + F: Favorite
    if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        favoriteBtn.click();
    }
});

// ===== Initialize on Load =====
console.log('Learn One Fun Thing a Day - Initialized! 🎯');
console.log('Keyboard shortcuts:');
console.log('  Ctrl/Cmd + N: New Fact');
console.log('  Ctrl/Cmd + S: Share');
console.log('  Ctrl/Cmd + R: Read Aloud');
console.log('  Ctrl/Cmd + F: Toggle Favorite');

// ===== Supabase Configuration =====
const SUPABASE_URL = 'https://yplmeudthlmwokqgevym.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlwbG1ldWR0aGxtd29rcWdldnltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzOTU5NDYsImV4cCI6MjA3NDk3MTk0Nn0.vl91ElVo5vtpkoO4uFpRLHCXG8HXCw-xGQEE3egwX14';

const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)