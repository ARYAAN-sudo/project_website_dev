// Language switching functionality
let currentLanguage = 'mr'; // Default to Marathi

const langToggle = document.getElementById('langToggle');
const currentLangBtn = document.getElementById('currentLang');

// Initialize language on page load
document.addEventListener('DOMContentLoaded', () => {
    updateLanguage();
});

// Language toggle button
langToggle.addEventListener('click', () => {
    currentLanguage = currentLanguage === 'mr' ? 'en' : 'mr';
    updateLanguage();
});

// Update all text based on selected language
function updateLanguage() {
    const elements = document.querySelectorAll('[data-mr][data-en]');
    
    elements.forEach(element => {
        if (currentLanguage === 'mr') {
            element.textContent = element.getAttribute('data-mr');
        } else {
            element.textContent = element.getAttribute('data-en');
        }
    });
    
    // Update language toggle button text
    currentLangBtn.textContent = currentLanguage === 'mr' ? 'English' : 'मराठी';
    
    // Update HTML lang attribute
    document.documentElement.lang = currentLanguage;
}

// Mobile menu toggle
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');

mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
});

// Close mobile menu when clicking a link
const mobileMenuLinks = mobileMenu.querySelectorAll('a');
mobileMenuLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
        mobileMenu.classList.remove('active');
    }
});

// Voice support functionality
const voiceBtn = document.getElementById('voiceBtn');
let isSpeaking = false;
let speechSynthesis = window.speechSynthesis;

voiceBtn.addEventListener('click', () => {
    if (isSpeaking) {
        speechSynthesis.cancel();
        isSpeaking = false;
        voiceBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
        return;
    }
    
    // Get the section currently in view
    const sections = document.querySelectorAll('.section');
    let currentSection = null;
    
    sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top >= 0 && rect.top <= window.innerHeight / 2) {
            currentSection = section;
        }
    });
    
    if (currentSection) {
        const heading = currentSection.querySelector('h2, h3');
        const text = heading ? heading.textContent : 'मीठ पान व्यवसाय';
        speakText(text);
    } else {
        const welcomeText = currentLanguage === 'mr' 
            ? 'मीठ पान व्यवसाय मार्गदर्शक. ग्रामीण उद्योजकांसाठी संपूर्ण माहिती.'
            : 'Salt Pan Business Guide. Complete information for rural entrepreneurs.';
        speakText(welcomeText);
    }
});

function speakText(text) {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = currentLanguage === 'mr' ? 'mr-IN' : 'en-US';
        utterance.rate = 0.9;
        utterance.pitch = 1;
        
        utterance.onstart = () => {
            isSpeaking = true;
            voiceBtn.innerHTML = '<i class="fas fa-stop"></i>';
        };
        
        utterance.onend = () => {
            isSpeaking = false;
            voiceBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
        };
        
        utterance.onerror = () => {
            isSpeaking = false;
            voiceBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
            console.log('Voice support not available');
        };
        
        speechSynthesis.speak(utterance);
    } else {
        alert(currentLanguage === 'mr' 
            ? 'आवाज समर्थन उपलब्ध नाही' 
            : 'Voice support not available');
    }
}

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all step elements and cards
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.step, .nav-card, .region-card, .scheme-card');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(el);
    });
});

// FAQ click-to-read functionality
document.querySelectorAll('.faq details').forEach(detail => {
    detail.addEventListener('toggle', function() {
        if (this.open) {
            const text = this.querySelector('p').textContent;
            if (isSpeaking) {
                speechSynthesis.cancel();
            }
            // Optionally speak the answer when opened
            // speakText(text);
        }
    });
});

// Add touch-friendly tap functionality for mobile
if ('ontouchstart' in window) {
    document.querySelectorAll('.nav-card, .region-card, .scheme-card').forEach(card => {
        card.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.98)';
        });
        
        card.addEventListener('touchend', function() {
            this.style.transform = 'scale(1)';
        });
    });
}

// Local storage for language preference
function saveLanguagePreference(lang) {
    try {
        localStorage.setItem('preferredLanguage', lang);
    } catch (e) {
        console.log('LocalStorage not available');
    }
}

function loadLanguagePreference() {
    try {
        const saved = localStorage.getItem('preferredLanguage');
        if (saved) {
            currentLanguage = saved;
            updateLanguage();
        }
    } catch (e) {
        console.log('LocalStorage not available');
    }
}

// Update language toggle to save preference
const originalToggle = langToggle.onclick;
langToggle.addEventListener('click', () => {
    saveLanguagePreference(currentLanguage);
});

// Load saved language preference on page load
window.addEventListener('load', () => {
    loadLanguagePreference();
});

// Print functionality
function printPage() {
    window.print();
}

// Share functionality (if Web Share API is available)
function shareContent() {
    const shareData = {
        title: currentLanguage === 'mr' 
            ? 'मीठ पान व्यवसाय मार्गदर्शक' 
            : 'Salt Pan Business Guide',
        text: currentLanguage === 'mr'
            ? 'महाराष्ट्रातील मीठ पान व्यवसायाची संपूर्ण माहिती'
            : 'Complete guide to salt pan business in Maharashtra',
        url: window.location.href
    };
    
    if (navigator.share) {
        navigator.share(shareData)
            .then(() => console.log('Shared successfully'))
            .catch((err) => console.log('Error sharing:', err));
    } else {
        // Fallback: copy URL to clipboard
        navigator.clipboard.writeText(window.location.href)
            .then(() => {
                alert(currentLanguage === 'mr' 
                    ? 'लिंक कॉपी झाली' 
                    : 'Link copied to clipboard');
            });
    }
}

// Add keyboard navigation support
document.addEventListener('keydown', (e) => {
    // Alt + L for language toggle
    if (e.altKey && e.key === 'l') {
        langToggle.click();
    }
    
    // Alt + V for voice toggle
    if (e.altKey && e.key === 'v') {
        voiceBtn.click();
    }
});

// Highlight active section in navigation
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('.section');
    const scrollPosition = window.scrollY + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            // Remove active class from all nav links
            document.querySelectorAll('.mobile-menu a').forEach(link => {
                link.style.background = '';
            });
            
            // Add active class to current section link
            const activeLink = document.querySelector(`.mobile-menu a[href="#${sectionId}"]`);
            if (activeLink) {
                activeLink.style.background = 'var(--bg-light)';
            }
        }
    });
});

// Add installation prompt for PWA (if configured)
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    
    // Show install button or prompt
    console.log('App can be installed');
});

// Offline detection
window.addEventListener('online', () => {
    console.log('Online');
    // Update UI to show online status
});

window.addEventListener('offline', () => {
    console.log('Offline');
    // Update UI to show offline status
    // Show cached content message
});

// Simple analytics (page view tracking)
function trackPageView() {
    console.log('Page viewed:', window.location.pathname);
    // Add your analytics code here
}

trackPageView();

// Track link clicks
document.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        console.log('Link clicked:', link.href);
        // Add your analytics code here
    });
});
