/* ============================================
   JÉGKÁSA - Ice Cream Website Scripts
   ============================================ */

// ---- Safe LocalStorage Wrapper (handles file:/// and restricted browser privacy settings) ----
const safeLocalStorage = {
    _backup: {},
    getItem(key) {
        try {
            return localStorage.getItem(key);
        } catch (e) {
            console.warn("localStorage.getItem failed, using fallback:", e);
            try {
                return sessionStorage.getItem(key);
            } catch (se) {
                return this._backup[key] || null;
            }
        }
    },
    setItem(key, value) {
        try {
            localStorage.setItem(key, value);
        } catch (e) {
            console.warn("localStorage.setItem failed, using fallback:", e);
            try {
                sessionStorage.setItem(key, value);
            } catch (se) {
                this._backup[key] = String(value);
            }
        }
    }
};

// ---- Navbar Scroll & Toggle ----
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
});

navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('open');
});

// Close mobile nav on link click
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navLinks.classList.remove('open');
    });
});

// ---- Scroll Reveal for Product Cards ----
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.classList.add('visible');
            }, index * 100);
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.product-card').forEach(card => {
    observer.observe(card);
});

// ---- Filter Products ----
const filterBtns = document.querySelectorAll('.filter-btn');
const productCards = document.querySelectorAll('.product-card');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;

        productCards.forEach(card => {
            const category = card.dataset.category;
            if (filter === 'all' || category === filter) {
                card.style.display = '';
                setTimeout(() => card.classList.add('visible'), 50);
            } else {
                card.style.display = 'none';
                card.classList.remove('visible');
            }
        });
    });
});

// ---- Particles Background ----
function createParticles() {
    const container = document.getElementById('particles');
    if (!container) return;

    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 4 + 1}px;
            height: ${Math.random() * 4 + 1}px;
            background: rgba(108, 92, 231, ${Math.random() * 0.3 + 0.1});
            border-radius: 50%;
            top: ${Math.random() * 100}%;
            left: ${Math.random() * 100}%;
            animation: floatParticle ${Math.random() * 10 + 10}s linear infinite;
            animation-delay: ${Math.random() * -10}s;
        `;
        container.appendChild(particle);
    }

    // Add the particle animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes floatParticle {
            0% { transform: translateY(0) translateX(0); opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { transform: translateY(-100vh) translateX(${Math.random() * 100 - 50}px); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
}
createParticles();

// ---- Fortune Wheel ----
const prizes = [
    { text: '-10%', color: '#6c5ce7', emoji: '🏷️', description: '10% kedvezmény a következő vásárlásodból!' },
    { text: '-20%', color: '#e17055', emoji: '🔥', description: '20% kedvezmény a következő vásárlásodból!' },
    { text: 'Ingyen!', color: '#00b894', emoji: '🎉', description: 'Egy ingyen jégkása vár rád!' },
    { text: '-5%', color: '#fdcb6e', emoji: '⭐', description: '5% kedvezmény a következő vásárlásodból!' },
    { text: '1+1', color: '#e84393', emoji: '🤝', description: 'Egyet veszel, kettőt kapsz!' },
    { text: '-15%', color: '#0984e3', emoji: '💎', description: '15% kedvezmény a következő vásárlásodból!' },
    { text: '-50%', color: '#d63031', emoji: '🤯', description: '50% kedvezmény! Szuper szerencse!' },
    { text: 'Próbálkozz\nholnap!', color: '#636e72', emoji: '😅', description: 'Ma nem nyertél, de holnap újra próbálkozhatsz!' },
];

const canvas = document.getElementById('wheelCanvas');
const ctx = canvas.getContext('2d');
const spinBtn = document.getElementById('spinBtn');
const spinInfo = document.getElementById('spinInfo');
const prizeModal = document.getElementById('prizeModal');
const prizeEmoji = document.getElementById('prizeEmoji');
const prizeTitle = document.getElementById('prizeTitle');
const prizeText = document.getElementById('prizeText');
const prizeCode = document.getElementById('prizeCode');
const closeModalBtn = document.getElementById('closeModal');

let currentAngle = 0;
let isSpinning = false;

function getCanvasSize() {
    return canvas.width;
}

function drawWheel() {
    const size = getCanvasSize();
    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size / 2 - 8;
    const segmentAngle = (2 * Math.PI) / prizes.length;

    ctx.clearRect(0, 0, size, size);

    prizes.forEach((prize, i) => {
        const startAngle = currentAngle + i * segmentAngle;
        const endAngle = startAngle + segmentAngle;

        // Draw segment
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.closePath();

        // Gradient fill
        const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
        gradient.addColorStop(0, lightenColor(prize.color, 30));
        gradient.addColorStop(1, prize.color);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Segment border
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Text
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(startAngle + segmentAngle / 2);
        ctx.textAlign = 'center';
        ctx.fillStyle = '#fff';
        ctx.font = `bold ${size / 25}px Outfit`;
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = 4;

        const lines = prize.text.split('\n');
        const lineHeight = size / 22;
        const textX = radius * 0.62;
        const startY = -(lines.length - 1) * lineHeight / 2;

        lines.forEach((line, lineIndex) => {
            ctx.fillText(line, textX, startY + lineIndex * lineHeight + 4);
        });

        ctx.restore();
    });

    // Center circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.15, 0, 2 * Math.PI);
    const centerGrad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius * 0.15);
    centerGrad.addColorStop(0, '#2d2d3f');
    centerGrad.addColorStop(1, '#15151f');
    ctx.fillStyle = centerGrad;
    ctx.fill();
    ctx.strokeStyle = 'rgba(108, 92, 231, 0.6)';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Center dot
    ctx.beginPath();
    ctx.arc(centerX, centerY, 4, 0, 2 * Math.PI);
    ctx.fillStyle = '#6c5ce7';
    ctx.fill();
}

function lightenColor(hex, percent) {
    const num = parseInt(hex.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = Math.min(255, (num >> 16) + amt);
    const G = Math.min(255, ((num >> 8) & 0x00FF) + amt);
    const B = Math.min(255, (num & 0x0000FF) + amt);
    return `rgb(${R}, ${G}, ${B})`;
}

// Check daily spin
function canSpinToday() {
    const lastSpin = safeLocalStorage.getItem('jegkasa_lastSpin');
    if (!lastSpin) return true;
    const last = new Date(lastSpin);
    const now = new Date();
    return last.toDateString() !== now.toDateString();
}

function markSpinUsed() {
    safeLocalStorage.setItem('jegkasa_lastSpin', new Date().toISOString());
}

function generateCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = 'JK-';
    for (let i = 0; i < 6; i++) {
        code += chars[Math.floor(Math.random() * chars.length)];
    }
    return code;
}

function updateSpinButton() {
    if (!canSpinToday()) {
        spinBtn.disabled = true;
        spinBtn.innerHTML = '🔒 Ma már pörgettél';
        spinInfo.textContent = 'Gyere vissza holnap egy újabb pörgetésért!';
    } else {
        spinBtn.disabled = false;
        spinBtn.innerHTML = '<span class="spin-icon">🎰</span> Pörgetés!';
        spinInfo.textContent = 'Naponta 1 pörgetés lehetséges';
    }
}

function createConfetti() {
    const confettiContainer = document.getElementById('confetti');
    confettiContainer.innerHTML = '';
    const colors = ['#6c5ce7', '#fd79a8', '#fdcb6e', '#00b894', '#e17055', '#0984e3'];

    for (let i = 0; i < 50; i++) {
        const piece = document.createElement('div');
        piece.className = 'confetti-piece';
        piece.style.cssText = `
            left: ${Math.random() * 100}%;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            animation-delay: ${Math.random() * 0.5}s;
            animation-duration: ${Math.random() * 2 + 2}s;
            width: ${Math.random() * 8 + 4}px;
            height: ${Math.random() * 8 + 4}px;
            border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
        `;
        confettiContainer.appendChild(piece);
    }
}

function showPrize(prize) {
    prizeEmoji.textContent = prize.emoji;
    prizeTitle.textContent = prize.text.replace('\n', ' ');
    prizeText.textContent = prize.description;

    if (prize.text !== 'Próbálkozz\nholnap!') {
        const code = generateCode();
        prizeCode.textContent = code;
        prizeCode.style.display = 'inline-block';

        // Save to localStorage spins list
        const spins = JSON.parse(safeLocalStorage.getItem('jegkasa_spins') || '[]');
        const newSpin = {
            code: code,
            prize: prize.text.replace('\n', ' '),
            description: prize.description,
            emoji: prize.emoji,
            timestamp: new Date().toISOString(),
            redeemed: false
        };
        spins.unshift(newSpin);
        safeLocalStorage.setItem('jegkasa_spins', JSON.stringify(spins));
    } else {
        prizeCode.style.display = 'none';
    }

    prizeModal.classList.add('active');
    createConfetti();
}

function spinWheel() {
    if (isSpinning || !canSpinToday()) return;

    isSpinning = true;
    spinBtn.disabled = true;

    // Pick random prize
    const prizeIndex = Math.floor(Math.random() * prizes.length);
    const segmentAngle = (2 * Math.PI) / prizes.length;

    // Calculate target angle: spin multiple times + land on prize
    // The pointer is at the top (negative Y direction = -PI/2 = 270 degrees)
    const targetSegmentCenter = prizeIndex * segmentAngle + segmentAngle / 2;
    // We want this segment to be at the top (at angle -PI/2 from start)
    // Since canvas 0 angle is at 3 o'clock, top is at -PI/2
    const targetAngle = -targetSegmentCenter - Math.PI / 2;
    const fullSpins = (Math.floor(Math.random() * 3) + 5) * 2 * Math.PI;
    const totalRotation = fullSpins + targetAngle - currentAngle;

    const startAngle = currentAngle;
    const startTime = performance.now();
    const duration = 5000;

    function easeOut(t) {
        return 1 - Math.pow(1 - t, 4);
    }

    function animate(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeOut(progress);

        currentAngle = startAngle + totalRotation * easedProgress;
        drawWheel();

        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            // Normalize angle
            currentAngle = currentAngle % (2 * Math.PI);
            isSpinning = false;
            markSpinUsed();
            updateSpinButton();
            showPrize(prizes[prizeIndex]);
        }
    }

    requestAnimationFrame(animate);
}

spinBtn.addEventListener('click', spinWheel);

closeModalBtn.addEventListener('click', () => {
    prizeModal.classList.remove('active');
});

prizeModal.addEventListener('click', (e) => {
    if (e.target === prizeModal) {
        prizeModal.classList.remove('active');
    }
});

// Initialize
drawWheel();
updateSpinButton();

// ---- Secret Cup click ----
const secretCup = document.getElementById('secretCup');
if (secretCup) {
    secretCup.addEventListener('click', () => {
        document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
    });
}

// ---- Handle canvas resize for mobile ----
function resizeCanvas() {
    const container = canvas.parentElement;
    const width = Math.min(400, window.innerWidth - 80);
    canvas.width = width;
    canvas.height = width;
    canvas.style.width = width + 'px';
    canvas.style.height = width + 'px';
    drawWheel();
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// ---- Daily Deal System ----
const allSlushies = [
    { id: 'secret', name: 'Secret Ice Cream', price: 600, desc: 'A titokzatos jégkásánk naponta változó ízekben!', image: 'secret' },
    { id: 'cherry', name: 'Xixo Cherry', price: 350, desc: 'Cseresznye ízű Xixo jégkása, édes és frissítő.', image: 'képek/images (2).jpg' },
    { id: 'watermelon', name: 'Xixo Watermelon', price: 350, desc: 'Görögdinnye ízű Xixo jégkása, a nyár íze!', image: 'képek/xixo-watermelon104246--full.png' },
    { id: 'tutti', name: 'Xixo Tutti Frutti', price: 350, desc: 'Tutti Frutti ízű Xixo jégkása, színes és gyümölcsös!', image: 'képek/xixo-tutti-fruity-min-1.png' },
    { id: 'tea', name: 'Tea Jégkása', price: 350, desc: 'Klasszikus fekete tea alapú jégkása, egy csipet citrommal.', image: 'képek/tea.jpg' },
    { id: 'mango', name: 'Mangó Jégkása', price: 350, desc: 'Trópusi mangó jégkása, egzotikus és hűsítő.', image: 'képek/mangós.webp' },
    { id: 'eper', name: 'Eper Jégkása', price: 350, desc: 'Friss eper ízű jégkása, természetes gyümölcssel.', image: 'képek/epres.webp' },
    { id: 'citrom', name: 'Citrom Jégkása', price: 350, desc: 'Savanykás citromos jégkása, igazi felfrissülés.', image: 'képek/citromos..jpg' },
    { id: 'afonya', name: 'Áfonya Jégkása', price: 350, desc: 'Kékáfonya ízű jégkása, intenzív és édes.', image: 'képek/áfonyás (1).jpg' },
    { id: 'kave', name: 'Kávés Jégkása', price: 350, desc: 'Erős kávé ízű jégkása, koffeinnel feltöltve. Reggeli energia!', image: 'képek/kávés.jpg' },
    { id: 'hell', name: 'Hell Jégkása', price: 350, desc: 'Hell energiaital ízű jégkása. Erős, frissítő, és energikus!', image: 'képek/áfonyás (1).png' },
    { id: 'eperita', name: 'Eperita Jégkása', price: 350, desc: 'Prémium eper koktél ihlette jégkása. Friss és édes eperíz.', image: 'képek/eperita.jpeg' },
    { id: 'sixseven', name: 'Six Seven Jégkása', price: 350, desc: 'Titokzatos Six Seven ízvilágú jégkása, jéghideg felfrissülés.', image: 'képek/six seven.png' }
];

function getDailyDeal() {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth(); // June is 5
    const date = today.getDate();

    // June 15 or earlier in 2026: Eperita Jégkása
    if (year === 2026 && month === 5 && date <= 15) {
        return { name: 'Eperita Jégkása', desc: 'Különleges eper koktél ihlette jégkásánk ma extra akciós áron!', emoji: '🍹', discount: 30, price: 350, image: 'képek/eperita.jpeg' };
    }
    // June 16 to June 20 in 2026: Six Seven Jégkása
    if (year === 2026 && month === 5 && date >= 16 && date <= 20) {
        return { name: 'Six Seven Jégkása', desc: 'A rejtélyes Six Seven jégkása most szuper áron érhető el!', emoji: '✨', discount: 35, price: 350, image: 'képek/six seven.png' };
    }

    // Fallback rotation (excluding the date-locked ones or using a selection of deals)
    const dailyDeals = [
        { name: 'Mangó Jégkása', desc: 'Ma a trópusi mangó jégkásánk akcióban! Ne hagyd ki ezt a lehetőséget!', emoji: '🥭', discount: 30, price: 350, image: 'képek/mangós.webp' },
        { name: 'Xixo Cherry', desc: 'Cseresznye ízű Xixo jégkása kedvezményes áron! Csak ma!', emoji: '🍒', discount: 25, price: 350, image: 'képek/images (2).jpg' },
        { name: 'Eper Jégkása', desc: 'Friss eper ízű jégkásánk most akciós! Édes és frissítő!', emoji: '🍓', discount: 20, price: 350, image: 'képek/epres.webp' },
        { name: 'Xixo Watermelon', desc: 'Görögdinnye ízű Xixo jégkása szuper áron! A nyár íze!', emoji: '🍉', discount: 35, price: 350, image: 'képek/xixo-watermelon104246--full.png' },
        { name: 'Citrom Jégkása', desc: 'Savanykás citromos jégkása akcióban! Igazi felfrissülés!', emoji: '🍋', discount: 30, price: 350, image: 'képek/citromos..jpg' },
        { name: 'Áfonya Jégkása', desc: 'Kékáfonya ízű jégkásánk most olcsóbb! Intenzív és édes!', emoji: '🫐', discount: 25, price: 350, image: 'képek/áfonyás (1).jpg' },
        { name: 'Xixo Tutti Frutti', desc: 'Tutti Frutti ízű Xixo jégkása szuper áron! Különleges élmény!', emoji: '🍇', discount: 20, price: 350, image: 'képek/xixo-tutti-fruity-min-1.png' },
        { name: 'Tea Jégkása', desc: 'Klasszikus fekete tea alapú jégkásánk ma kedvezményesen kapható!', emoji: '🍵', discount: 15, price: 350, image: 'képek/tea.jpg' },
        { name: 'Kávés Jégkása', desc: 'Erős kávés jégkásánk ma akciós áron pörget fel a napodra!', emoji: '☕', discount: 20, price: 350, image: 'képek/kávés.jpg' },
        { name: 'Hell Jégkása', desc: 'Frissítő Hell energiaitalos jégkása ma akciós áron!', emoji: '⚡', discount: 25, price: 350, image: 'képek/áfonyás (1).png' }
    ];
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
    const dealIndex = dayOfYear % dailyDeals.length;
    return dailyDeals[dealIndex];
}

let currentDealSlide = 0;
let dealSlideInterval;

function initDailyDealSlider() {
    const dealSlider = document.getElementById('dealSlider');
    if (!dealSlider) return;

    dealSlider.innerHTML = '';
    allSlushies.forEach(slushie => {
        const slide = document.createElement('div');
        slide.className = 'deal-slide';
        if (slushie.image === 'secret') {
            slide.innerHTML = `
                <div class="secret-cup-mini" style="transform: scale(1.1); margin: 0 auto;">
                    <div class="cup-straw-mini"></div>
                    <div class="cup-lid-mini"></div>
                    <div class="cup-glass-mini">
                        <div class="cup-liquid-mini">
                            <span class="question-mark-mini">?</span>
                        </div>
                    </div>
                </div>
            `;
        } else {
            slide.innerHTML = `<img src="${slushie.image}" alt="${slushie.name}" class="deal-slide-image">`;
        }
        dealSlider.appendChild(slide);
    });
}

function updateDealSlideDisplay() {
    const dealSlider = document.getElementById('dealSlider');
    if (!dealSlider) return;

    // Shift slider
    dealSlider.style.transform = `translateX(-${currentDealSlide * 100}%)`;

    const currentSlushie = allSlushies[currentDealSlide];
    const todayDeal = getDailyDeal();

    const isTodayDeal = (currentSlushie.name.toLowerCase() === todayDeal.name.toLowerCase());
    
    const dealCard = document.getElementById('dealCard');
    const dealBadge = document.getElementById('dealBadge');
    const dealTitle = document.getElementById('dealTitle');
    const dealDesc = document.getElementById('dealDesc');
    const dealOldPrice = document.getElementById('dealOldPrice');
    const dealNewPrice = document.getElementById('dealNewPrice');
    const dealDiscount = document.getElementById('dealDiscount');
    const dealTimer = document.getElementById('dealTimer');

    if (isTodayDeal) {
        if (dealCard) dealCard.classList.add('active-deal');
        if (dealBadge) {
            dealBadge.textContent = '🔥 Napi Ajánlat!';
            dealBadge.style.background = 'rgba(255, 107, 107, 0.15)';
            dealBadge.style.color = '#ff6b6b';
            dealBadge.style.borderColor = 'rgba(255, 107, 107, 0.3)';
        }
        if (dealTitle) dealTitle.textContent = todayDeal.name;
        if (dealDesc) dealDesc.textContent = todayDeal.desc;
        
        const newPrice = Math.round(todayDeal.price * (1 - todayDeal.discount / 100));
        if (dealOldPrice) {
            dealOldPrice.style.display = 'inline';
            dealOldPrice.textContent = todayDeal.price + ' Ft';
        }
        if (dealNewPrice) {
            dealNewPrice.textContent = newPrice + ' Ft';
            dealNewPrice.style.background = 'var(--gradient-warm)';
            dealNewPrice.style.webkitBackgroundClip = 'text';
            dealNewPrice.style.webkitTextFillColor = 'transparent';
        }
        if (dealDiscount) {
            dealDiscount.style.display = 'inline-block';
            dealDiscount.textContent = '-' + todayDeal.discount + '%';
        }
        if (dealTimer) {
            dealTimer.style.display = 'block';
        }
    } else {
        if (dealCard) dealCard.classList.remove('active-deal');
        if (dealBadge) {
            dealBadge.textContent = '🧊 Kínálatunkból';
            dealBadge.style.background = 'rgba(108, 92, 231, 0.15)';
            dealBadge.style.color = 'var(--accent-2)';
            dealBadge.style.borderColor = 'rgba(108, 92, 231, 0.3)';
        }
        if (dealTitle) dealTitle.textContent = currentSlushie.name;
        if (dealDesc) dealDesc.textContent = currentSlushie.desc;
        
        if (dealOldPrice) {
            dealOldPrice.style.display = 'none';
        }
        if (dealNewPrice) {
            dealNewPrice.textContent = currentSlushie.price + ' Ft';
            dealNewPrice.style.background = 'none';
            dealNewPrice.style.webkitTextFillColor = 'var(--text-primary)';
            dealNewPrice.style.color = 'var(--text-primary)';
        }
        if (dealDiscount) {
            dealDiscount.style.display = 'none';
        }
        if (dealTimer) {
            dealTimer.style.display = 'none';
        }
    }
}

function updateCountdown() {
    const now = new Date();
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);
    const diff = endOfDay - now;

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    const hEl = document.getElementById('timerHours');
    const mEl = document.getElementById('timerMinutes');
    const sEl = document.getElementById('timerSeconds');

    if (hEl) hEl.textContent = String(hours).padStart(2, '0');
    if (mEl) mEl.textContent = String(minutes).padStart(2, '0');
    if (sEl) sEl.textContent = String(seconds).padStart(2, '0');
}

// Initialize daily deal slideshow
initDailyDealSlider();
updateDealSlideDisplay();
dealSlideInterval = setInterval(() => {
    currentDealSlide = (currentDealSlide + 1) % allSlushies.length;
    updateDealSlideDisplay();
}, 5000);

updateCountdown();
setInterval(updateCountdown, 1000);

// ---- History Verification System ----
function renderHistory() {
    const listContainer = document.getElementById('historyList');
    if (!listContainer) return;

    const spins = JSON.parse(safeLocalStorage.getItem('jegkasa_spins') || '[]');
    if (spins.length === 0) {
        listContainer.innerHTML = '<p class="no-prizes">Még nincsenek nyereményeid. Pörgesd meg a kereket!</p>';
        return;
    }

    listContainer.innerHTML = '';
    spins.forEach((spin, index) => {
        const date = new Date(spin.timestamp);
        const formattedDate = date.toLocaleDateString('hu-HU') + ' ' + date.toLocaleTimeString('hu-HU', { hour: '2-digit', minute: '2-digit' });

        const item = document.createElement('div');
        item.className = `history-item ${spin.redeemed ? 'redeemed' : ''}`;
        item.innerHTML = `
            <div class="history-item-left">
                <span class="history-item-emoji">${spin.emoji}</span>
                <div class="history-item-info">
                    <h4>${spin.prize}</h4>
                    <span class="coupon-code-text">${spin.code}</span>
                    <p>${formattedDate}</p>
                </div>
            </div>
            <div class="history-item-right">
                ${spin.redeemed 
                    ? '<span class="status-badge status-redeemed">Beváltva</span>' 
                    : `
                        <span class="status-badge status-active">Aktív</span>
                        <button class="btn btn-redeem" data-index="${index}">Beváltás</button>
                      `
                }
            </div>
        `;
        listContainer.appendChild(item);
    });

    // Add event listeners for redeem buttons
    listContainer.querySelectorAll('.btn-redeem').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const idx = parseInt(e.target.dataset.index);
            redeemPrize(idx);
        });
    });
}

function redeemPrize(index) {
    const spins = JSON.parse(safeLocalStorage.getItem('jegkasa_spins') || '[]');
    if (spins[index]) {
        spins[index].redeemed = true;
        safeLocalStorage.setItem('jegkasa_spins', JSON.stringify(spins));
        renderHistory();
    }
}

// Modal handling
const historyModal = document.getElementById('historyModal');
const navHistoryBtn = document.getElementById('navHistoryBtn');
const wheelHistoryBtn = document.getElementById('wheelHistoryBtn');
const closeHistoryModal = document.getElementById('closeHistoryModal');

function openHistory() {
    renderHistory();
    historyModal.classList.add('active');
}

if (navHistoryBtn) {
    navHistoryBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openHistory();
    });
}

if (wheelHistoryBtn) {
    wheelHistoryBtn.addEventListener('click', openHistory);
}

if (closeHistoryModal) {
    closeHistoryModal.addEventListener('click', () => {
        historyModal.classList.remove('active');
    });
}

if (historyModal) {
    historyModal.addEventListener('click', (e) => {
        if (e.target === historyModal) {
            historyModal.classList.remove('active');
        }
    });
}

// ---- JÉGKÁSA MIXER SYSTEM ----
const flavorColors = {
    none: 'transparent',
    cherry: '#DC143C',
    watermelon: '#FF6B6B',
    tutti: '#6c3fc7',
    tea: '#8B4513',
    mango: '#FFB347',
    eper: '#FF4757',
    citrom: '#FFF44F',
    afonya: '#4834D4',
    kave: '#3e2723',
    hell: '#1a1a1a'
};

const flavorNames = {
    none: '-- Üres --',
    cherry: "Xixo Cherry",
    watermelon: "Xixo Watermelon",
    tutti: "Xixo Tutti Frutti",
    tea: "Tea Jégkása",
    mango: "Mangó Jégkása",
    eper: "Eper Jégkása",
    citrom: "Citrom Jégkása",
    afonya: "Áfonya Jégkása",
    kave: "Kávés Jégkása",
    hell: "Hell Jégkása"
};

const flavorCodes = {
    cherry: 'CHER',
    watermelon: 'WAT',
    tutti: 'TUTI',
    tea: 'TEA',
    mango: 'MANG',
    eper: 'EPER',
    citrom: 'CITR',
    afonya: 'AFON',
    kave: 'KAVE',
    hell: 'HELL'
};

const select1 = document.getElementById('laySelect1');
const select2 = document.getElementById('laySelect2');
const select3 = document.getElementById('laySelect3');
const sizeRadios = document.getElementsByName('mixerSize');
const topWhip = document.getElementById('topWhip');
const topGummy = document.getElementById('topGummy');
const topCherry = document.getElementById('topCherry');
const topSprinkles = document.getElementById('topSprinkles');
const mixerTotal = document.getElementById('mixerTotal');

const mLay1 = document.getElementById('mLay1');
const mLay2 = document.getElementById('mLay2');
const mLay3 = document.getElementById('mLay3');

const whipVisual = document.querySelector('.m-top-whip');
const gummyVisual = document.querySelector('.m-top-gummy');
const cherryVisual = document.querySelector('.m-top-cherry');
const sprinklesVisual = document.querySelector('.m-top-sprinkles');

const saveMixBtn = document.getElementById('saveMixBtn');
const recipeModal = document.getElementById('recipeModal');
const recipeCode = document.getElementById('recipeCode');
const recipeDetails = document.getElementById('recipeDetails');
const closeRecipeModal = document.getElementById('closeRecipeModal');

function updateMixer() {
    if (!select1 || !select2 || !select3) return;

    const val1 = select1.value;
    const val2 = select2.value;
    const val3 = select3.value;

    // Determine colors
    const color1 = select1.options[select1.selectedIndex].dataset.color || 'transparent';
    const color2 = select2.options[select2.selectedIndex].dataset.color || 'transparent';
    const color3 = select3.options[select3.selectedIndex].dataset.color || 'transparent';

    if (mLay1) mLay1.style.backgroundColor = color1;
    if (mLay2) mLay2.style.backgroundColor = color2;
    if (mLay3) mLay3.style.backgroundColor = color3;

    // Calculate heights
    const activeLayers = [val1, val2, val3].filter(val => val !== 'none');
    const numActive = activeLayers.length;

    if (numActive === 3) {
        if (mLay1) mLay1.style.height = '30%';
        if (mLay2) mLay2.style.height = '30%';
        if (mLay3) mLay3.style.height = '30%';
    } else if (numActive === 2) {
        if (mLay1) mLay1.style.height = val1 !== 'none' ? '45%' : '0%';
        if (mLay2) mLay2.style.height = val2 !== 'none' ? '45%' : '0%';
        if (mLay3) mLay3.style.height = val3 !== 'none' ? '45%' : '0%';
    } else if (numActive === 1) {
        if (mLay1) mLay1.style.height = val1 !== 'none' ? '90%' : '0%';
        if (mLay2) mLay2.style.height = val2 !== 'none' ? '90%' : '0%';
        if (mLay3) mLay3.style.height = val3 !== 'none' ? '90%' : '0%';
    } else {
        if (mLay1) mLay1.style.height = '0%';
        if (mLay2) mLay2.style.height = '0%';
        if (mLay3) mLay3.style.height = '0%';
    }

    // Toggle toppings visual representation
    if (whipVisual && topWhip) whipVisual.classList.toggle('show', topWhip.checked);
    if (gummyVisual && topGummy) gummyVisual.classList.toggle('show', topGummy.checked);
    if (cherryVisual && topCherry) cherryVisual.classList.toggle('show', topCherry.checked);
    if (sprinklesVisual && topSprinkles) sprinklesVisual.classList.toggle('show', topSprinkles.checked);

    // Calculate total price
    let sizePrice = 350;
    const checkedSize = document.querySelector('input[name="mixerSize"]:checked');
    if (checkedSize) {
        const sizeVal = checkedSize.value;
        if (sizeVal === '200') sizePrice = 700;
        else if (sizeVal === '300') sizePrice = 1000;
    }

    let toppingsPrice = 0;
    if (topWhip && topWhip.checked) toppingsPrice += parseInt(topWhip.value || 200);
    if (topGummy && topGummy.checked) toppingsPrice += parseInt(topGummy.value || 180);
    if (topCherry && topCherry.checked) toppingsPrice += parseInt(topCherry.value || 50);
    if (topSprinkles && topSprinkles.checked) toppingsPrice += parseInt(topSprinkles.value || 50);

    const total = sizePrice + toppingsPrice;
    if (mixerTotal) {
        mixerTotal.textContent = total + ' Ft';
    }
}

// Add event listeners to mixer selectors
if (select1) select1.addEventListener('change', updateMixer);
if (select2) select2.addEventListener('change', updateMixer);
if (select3) select3.addEventListener('change', updateMixer);
if (sizeRadios) {
    sizeRadios.forEach(radio => radio.addEventListener('change', updateMixer));
}
if (topWhip) topWhip.addEventListener('change', updateMixer);
if (topGummy) topGummy.addEventListener('change', updateMixer);
if (topCherry) topCherry.addEventListener('change', updateMixer);
if (topSprinkles) topSprinkles.addEventListener('change', updateMixer);

// Save recipe event
if (saveMixBtn) {
    saveMixBtn.addEventListener('click', () => {
        const val1 = select1 ? select1.value : 'none';
        const val2 = select2 ? select2.value : 'none';
        const val3 = select3 ? select3.value : 'none';

        if (val1 === 'none' && val2 === 'none' && val3 === 'none') {
            alert('Kérjük, válassz legalább egy jégkása réteget!');
            return;
        }

        // Generate Recipe Code
        const activeFlavors = [val1, val2, val3].filter(v => v !== 'none');
        const layersCode = activeFlavors.map(v => flavorCodes[v]).join('-');
        
        const checkedSize = document.querySelector('input[name="mixerSize"]:checked');
        const sizeCode = checkedSize ? (checkedSize.value === '100' ? '1DL' : (checkedSize.value === '200' ? '2DL' : '3DL')) : '1DL';

        const activeTops = [];
        if (topWhip && topWhip.checked) activeTops.push('WHIP');
        if (topGummy && topGummy.checked) activeTops.push('GUM');
        if (topCherry && topCherry.checked) activeTops.push('CHRY');
        if (topSprinkles && topSprinkles.checked) activeTops.push('SPRK');

        const topsCode = activeTops.length > 0 ? '-' + activeTops.join('-') : '';
        const finalCode = `MIX-${layersCode}-${sizeCode}${topsCode}`.toUpperCase();

        // Details breakdown text
        const sizeName = checkedSize ? (checkedSize.value === '100' ? 'Kicsi (1 dl)' : (checkedSize.value === '200' ? 'Közepes (2 dl)' : 'Nagy (3 dl)')) : 'Kicsi (1 dl)';
        const layersList = [val1, val2, val3].filter(v => v !== 'none').map(v => flavorNames[v]).join(', ');
        const toppingsList = activeTops.length > 0 ? activeTops.map(t => {
            if (t === 'WHIP') return 'Tejszínhab';
            if (t === 'GUM') return 'Gumicukor';
            if (t === 'CHRY') return 'Koktélcseresznye';
            if (t === 'SPRK') return 'Színes cukorka';
        }).join(', ') : 'Nincs';

        if (recipeCode) recipeCode.textContent = finalCode;
        if (recipeDetails) {
            recipeDetails.innerHTML = `
                <p><strong>Méret:</strong> ${sizeName}</p>
                <p><strong>Rétegek:</strong> ${layersList}</p>
                <p><strong>Feltétek:</strong> ${toppingsList}</p>
                <p><strong>Ár:</strong> ${mixerTotal ? mixerTotal.textContent : '350 Ft'}</p>
            `;
        }

        if (recipeModal) recipeModal.classList.add('active');
    });
}

if (closeRecipeModal) {
    closeRecipeModal.addEventListener('click', () => {
        if (recipeModal) recipeModal.classList.remove('active');
    });
}

if (recipeModal) {
    recipeModal.addEventListener('click', (e) => {
        if (e.target === recipeModal) {
            recipeModal.classList.remove('active');
        }
    });
}

// Initialise mixer visual state
updateMixer();


// ---- VÉLEMÉNYEK & VENDÉGKÖNYV SYSTEM ----
const defaultReviews = [
    {
        name: "Nagy Anna",
        rating: 5,
        text: "A görögdinnyés Xixo jégkása egyszerűen verhetetlen! Minden nap idejárok.",
        date: "2026.06.10."
    },
    {
        name: "Kovács Bence",
        rating: 5,
        text: "Kipróbáltam a Secret Ice Cream-et és valami hihetetlen mangós-áfonyás csoda volt! Imádom!",
        date: "2026.06.11."
    },
    {
        name: "Szabó Dóra",
        rating: 4,
        text: "Nagyon finomak a jégkásák, és a szerencsekerékkel nyertem egy 20%-os kupont! Köszi!",
        date: "2026.06.12."
    }
];

let currentReviewIndex = 0;
let reviewInterval;

function renderReviewsList() {
    const reviewsSlider = document.getElementById('reviewsSlider');
    if (!reviewsSlider) return;

    let reviews = safeLocalStorage.getItem('jegkasa_reviews');
    if (!reviews) {
        reviews = defaultReviews;
        safeLocalStorage.setItem('jegkasa_reviews', JSON.stringify(reviews));
    } else {
        reviews = JSON.parse(reviews);
    }

    reviewsSlider.innerHTML = '';
    reviews.forEach((rev) => {
        const slide = document.createElement('div');
        slide.className = 'review-slide';
        
        const starsStr = '★'.repeat(rev.rating) + '☆'.repeat(5 - rev.rating);
        
        slide.innerHTML = `
            <div class="review-card">
                <div class="review-stars">${starsStr}</div>
                <p class="review-text">${escapeHtml(rev.text)}</p>
                <h4 class="review-author">${escapeHtml(rev.name)}</h4>
                <div class="review-date">${rev.date}</div>
            </div>
        `;
        reviewsSlider.appendChild(slide);
    });

    showSlide(currentReviewIndex);
}

function showSlide(index) {
    const slides = document.querySelectorAll('.review-slide');
    if (slides.length === 0) return;

    if (index >= slides.length) {
        currentReviewIndex = 0;
    } else if (index < 0) {
        currentReviewIndex = slides.length - 1;
    } else {
        currentReviewIndex = index;
    }

    slides.forEach((slide, i) => {
        slide.classList.remove('active', 'prev');
        if (i === currentReviewIndex) {
            slide.classList.add('active');
        } else if (i === (currentReviewIndex - 1 + slides.length) % slides.length) {
            slide.classList.add('prev');
        }
    });
}

function nextSlide() {
    currentReviewIndex++;
    showSlide(currentReviewIndex);
}

function resetReviewInterval() {
    clearInterval(reviewInterval);
    reviewInterval = setInterval(nextSlide, 5000);
}

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}

// Slider arrows
const prevReviewBtn = document.getElementById('prevReview');
const nextReviewBtn = document.getElementById('nextReview');

if (prevReviewBtn) {
    prevReviewBtn.addEventListener('click', () => {
        currentReviewIndex--;
        showSlide(currentReviewIndex);
        resetReviewInterval();
    });
}

if (nextReviewBtn) {
    nextReviewBtn.addEventListener('click', () => {
        currentReviewIndex++;
        showSlide(currentReviewIndex);
        resetReviewInterval();
    });
}

// Interactive Star Input
const starInputs = document.querySelectorAll('.star-input');
let selectedRating = 5;

function highlightStars(rating, type = 'active') {
    if (!starInputs) return;
    starInputs.forEach(s => {
        const r = parseInt(s.dataset.rating);
        if (type === 'hover') {
            s.classList.toggle('hover', r <= rating);
        } else {
            s.classList.remove('hover');
            s.classList.toggle('active', r <= rating);
        }
    });
}

if (starInputs) {
    starInputs.forEach(star => {
        star.addEventListener('click', () => {
            selectedRating = parseInt(star.dataset.rating);
            highlightStars(selectedRating);
        });

        star.addEventListener('mouseenter', () => {
            const hoverRating = parseInt(star.dataset.rating);
            highlightStars(hoverRating, 'hover');
        });

        star.addEventListener('mouseleave', () => {
            highlightStars(selectedRating);
        });
    });
}

// Review form submission
const reviewForm = document.getElementById('reviewForm');
if (reviewForm) {
    reviewForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const nameVal = document.getElementById('reviewName').value.trim();
        const textVal = document.getElementById('reviewText').value.trim();
        if (!nameVal || !textVal) return;

        const date = new Date();
        const formattedDate = date.toLocaleDateString('hu-HU') + '.';

        const newReview = {
            name: nameVal,
            rating: selectedRating,
            text: textVal,
            date: formattedDate
        };

        const reviews = JSON.parse(safeLocalStorage.getItem('jegkasa_reviews') || JSON.stringify(defaultReviews));
        reviews.unshift(newReview);
        safeLocalStorage.setItem('jegkasa_reviews', JSON.stringify(reviews));

        // Reset form state
        reviewForm.reset();
        selectedRating = 5;
        highlightStars(selectedRating);

        // Re-render reviews
        renderReviewsList();

        // Switch to the first slide (which is the new review)
        currentReviewIndex = 0;
        showSlide(0);
        resetReviewInterval();
    });
}

// Initialise reviews list & auto-scroll
renderReviewsList();
highlightStars(selectedRating);
resetReviewInterval();

// ---- Image Lightbox Modal ----
const lightboxModal = document.getElementById('lightboxModal');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxTitle = document.getElementById('lightboxTitle');
const closeLightbox = document.getElementById('closeLightbox');

function openLightbox(src, title) {
    if (!lightboxModal || !lightboxImg || !lightboxTitle) return;
    lightboxImg.src = src;
    lightboxImg.alt = title;
    lightboxTitle.textContent = title;
    lightboxModal.classList.add('active');
}

if (closeLightbox) {
    closeLightbox.addEventListener('click', () => {
        lightboxModal.classList.remove('active');
    });
}

if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
        if (e.target === lightboxModal) {
            lightboxModal.classList.remove('active');
        }
    });
}

// Global click event to catch clicks on product card images, titles, and daily deal image
document.addEventListener('click', (e) => {
    // Check if clicked inside a product-card (except the secret card)
    const productCard = e.target.closest('.product-card:not(.secret-card)');
    if (productCard) {
        // If clicked on size select dropdown, do nothing (do not open lightbox)
        if (e.target.closest('.product-size-select')) {
            return;
        }

        const isImg = e.target.classList.contains('card-photo') || e.target.closest('.card-image-photo');
        const isTitle = e.target.tagName === 'H3' && e.target.closest('.card-content');

        if (isImg || isTitle) {
            const imgEl = productCard.querySelector('.card-photo');
            const titleEl = productCard.querySelector('h3');
            if (imgEl && titleEl) {
                openLightbox(imgEl.src, titleEl.textContent);
            }
        }
    }

    // Check if clicked on deal slider image
    if (e.target.classList.contains('deal-slide-image')) {
        const title = e.target.alt;
        const src = e.target.src;
        openLightbox(src, title);
    }
});

// ---- Product Card Size Select Dropdown ----
const productSizeSelects = document.querySelectorAll('.product-size-select');

if (productSizeSelects) {
    productSizeSelects.forEach(select => {
        select.addEventListener('change', (e) => {
            const card = e.target.closest('.product-card');
            if (!card) return;

            const priceEl = card.querySelector('.card-price');
            if (!priceEl) return;

            const isSecret = e.target.dataset.isSecret === 'true';
            const value = e.target.value;

            let price = 350;
            if (isSecret) {
                if (value === '1') price = 600;
                else if (value === '2') price = 1200;
                else if (value === '3') price = 1700;
            } else {
                if (value === '1') price = 350;
                else if (value === '2') price = 700;
                else if (value === '3') price = 1000;
            }

            priceEl.textContent = price + ' Ft';
        });
    });
}
