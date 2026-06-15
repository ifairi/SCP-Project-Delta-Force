// ─── Mobile Menu ───
const hamburger = document.querySelector('.hamburger');
const navTabs = document.querySelector('.nav-tabs');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navTabs.classList.toggle('active');
});

// ─── SPA Navigation ───
const sections = document.querySelectorAll('section');
const navLinksAnchors = document.querySelectorAll('.nav-links a');
let currentSection = null;
let isTransitioning = false;

// ─── Glitch Text Decode — smoother 0.7s total ───
function applyGlitchEffect(section) {
    const chars = '!<>-_\\/[]{}—=+*^?#█▓▒░@&%$~01';

    function getTextNodes(node) {
        let textNodes = [];
        if (node.nodeType === 3) {
            if (node.nodeValue.trim() !== '') textNodes.push(node);
        } else {
            for (let child of node.childNodes) textNodes.push(...getTextNodes(child));
        }
        return textNodes;
    }

    const textNodes = getTextNodes(section);

    textNodes.forEach(node => {
        if (node.originalText === undefined) node.originalText = node.nodeValue;

        const originalText = node.originalText;
        const totalChars = originalText.replace(/\s/g, '').length;
        // Smoother: slower increment, longer interval
        const increment = Math.max(totalChars / 45, 1.5);
        let iteration = 0;

        if (node.glitchInterval) clearInterval(node.glitchInterval);

        node.glitchInterval = setInterval(() => {
            node.nodeValue = originalText
                .split('')
                .map((letter, index) => {
                    if (letter === ' ' || letter === '\n' || letter === '\t') return letter;
                    if (index < iteration) return originalText[index];
                    return chars[Math.floor(Math.random() * chars.length)];
                })
                .join('');

            if (iteration >= originalText.length) {
                clearInterval(node.glitchInterval);
                node.nodeValue = originalText;
            }

            iteration += increment;
        }, 20);
    });
}

// ─── Active nav link ───
function updateActiveLink(targetId) {
    navLinksAnchors.forEach(a => a.classList.remove('active-link'));
    const activeLink = document.querySelector(`.nav-links a[href="${targetId}"]`);
    if (activeLink) activeLink.classList.add('active-link');
}

// ─── Section Activation ───
function activateSection(targetId) {
    if (isTransitioning) return;

    const targetSection = document.querySelector(targetId);
    if (!targetSection || targetSection === currentSection) return;

    updateActiveLink(targetId);

    if (currentSection) {
        isTransitioning = true;
        currentSection.classList.add('glitch-out');
        currentSection.classList.remove('active-section');

        const oldSection = currentSection;

        setTimeout(() => {
            oldSection.classList.remove('glitch-out');
            oldSection.style.opacity = '0';
            oldSection.style.pointerEvents = 'none';

            targetSection.style.opacity = '';
            targetSection.style.pointerEvents = '';
            targetSection.classList.add('glitch-in');

            applyGlitchEffect(targetSection);

            if (targetId === '#founders' && !targetSection.classList.contains('counted')) {
                startCounters();
                targetSection.classList.add('counted');
            }

            setTimeout(() => {
                targetSection.classList.remove('glitch-in');
                targetSection.classList.add('active-section');
                currentSection = targetSection;
                isTransitioning = false;
            }, 350);

        }, 280);
    } else {
        targetSection.classList.add('active-section');
        currentSection = targetSection;
        applyGlitchEffect(targetSection);
    }
}

// ─── Event Listeners ───
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
        e.preventDefault();
        activateSection(anchor.getAttribute('href'));
        hamburger.classList.remove('active');
        navTabs.classList.remove('active');
    });
});

// ─── Initial Load ───
window.addEventListener('DOMContentLoaded', () => {
    // Selalu mulai di Beranda saat pertama kali dimuat
    window.history.replaceState(null, null, '#hero');
    activateSection('#hero');
});

// ─── Pagination Navigation ───
// Urutan baru: Beranda, Tim, Tujuan, Jadwal Scrim, Tentang
const sectionIds = ['#hero', '#founders', '#objectives', '#scrim', '#about'];
const btnPrev = document.getElementById('btn-prev');
const btnNext = document.getElementById('btn-next');

function navigateSection(direction) {
    if (!currentSection || isTransitioning) return;
    const currentId = '#' + currentSection.id;
    let currentIndex = sectionIds.indexOf(currentId);
    
    if (currentIndex !== -1) {
        let newIndex = currentIndex + direction;
        if (newIndex < 0) newIndex = sectionIds.length - 1;
        if (newIndex >= sectionIds.length) newIndex = 0;
        
        // Update URL hash for consistency
        window.history.pushState(null, null, sectionIds[newIndex]);
        activateSection(sectionIds[newIndex]);
    }
}

if (btnPrev && btnNext) {
    btnPrev.addEventListener('click', () => navigateSection(-1));
    btnNext.addEventListener('click', () => navigateSection(1));
}

// ─── Counter Animation ───
function startCounters() {
    document.querySelectorAll('.stat-number').forEach(counter => {
        const target = +counter.getAttribute('data-target');
        const speed = 200;
        const updateCount = () => {
            const count = +counter.innerText;
            const inc = target / speed;
            if (count < target) {
                counter.innerText = Math.ceil(count + inc);
                setTimeout(updateCount, 15);
            } else {
                counter.innerText = target + (target === 50 ? '+' : '');
            }
        };
        updateCount();
    });
}

// ─── Binary Rain VHS Hologram ───
function initBinaryRain(containerId = 'binaryRain', cols = 18) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Clear existing columns to prevent duplicates
    container.innerHTML = '';

    for (let i = 0; i < cols; i++) {
        const col = document.createElement('div');
        col.className = 'binary-col';
        col.style.left = (Math.random() * 100) + '%';
        col.style.animationDuration = (8 + Math.random() * 15) + 's';
        col.style.animationDelay = (Math.random() * 10) + 's';
        col.style.opacity = (0.15 + Math.random() * 0.35).toString();
        col.style.fontSize = (8 + Math.random() * 4) + 'px';

        // Generate binary/hex string
        let txt = '';
        const len = 40 + Math.floor(Math.random() * 60);
        for (let j = 0; j < len; j++) {
            const r = Math.random();
            if (r < 0.5) txt += Math.random() > 0.5 ? '1' : '0';
            else if (r < 0.7) txt += String.fromCharCode(0x30A0 + Math.random() * 96); // katakana
            else txt += '0123456789ABCDEF'[Math.floor(Math.random() * 16)];
        }
        col.textContent = txt;
        container.appendChild(col);
    }
}

// ─── Particles.js ───
document.addEventListener('DOMContentLoaded', function () {
    // Global binary rain — behind header glass
    initBinaryRain('binaryRain', 18);
    // Local binary rain — inside Tim section, behind member cards
    initBinaryRain('binaryRainInner', 25);

    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            "particles": {
                "number": { "value": 30, "density": { "enable": true, "value_area": 1200 } },
                "color": { "value": ["#e01530", "#ffffff", "#333333"] },
                "shape": { "type": "circle", "stroke": { "width": 0, "color": "#000000" } },
                "opacity": { "value": 0.3, "random": true, "anim": { "enable": true, "speed": 0.4, "opacity_min": 0.05, "sync": false } },
                "size": { "value": 1.5, "random": true, "anim": { "enable": false } },
                "line_linked": { "enable": true, "distance": 200, "color": "#e01530", "opacity": 0.03, "width": 1 },
                "move": { "enable": true, "speed": 0.5, "direction": "none", "random": true, "straight": false, "out_mode": "out", "bounce": false }
            },
            "interactivity": {
                "detect_on": "canvas",
                "events": { "onhover": { "enable": true, "mode": "grab" }, "onclick": { "enable": false }, "resize": true },
                "modes": { "grab": { "distance": 100, "line_linked": { "opacity": 0.12 } } }
            },
            "retina_detect": true
        });
    }
});
