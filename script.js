// Disable browser's automatic scroll restoration
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}

// Scroll to top on fresh page load
window.addEventListener('load', () => {
    // Only restore scroll position on reload, not on fresh navigation
    if (performance.navigation && performance.navigation.type === 1) {
        // Page was reloaded — restore position
        const scrollPos = sessionStorage.getItem('scrollPos');
        if (scrollPos) {
            window.scrollTo(0, parseInt(scrollPos));
            sessionStorage.removeItem('scrollPos');
        }
    } else {
        // Fresh load — always start at the top
        window.scrollTo(0, 0);
    }
});

window.addEventListener('beforeunload', () => {
    sessionStorage.setItem('scrollPos', window.scrollY);
});

// Initialize AOS after ensuring scroll position
AOS.init({
    duration: 700,
    easing: 'ease-out',
    once: true,
    offset: 80,
    startEvent: 'load'
});

// Navbar scroll effect
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile menu toggle
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
const navOverlay = document.getElementById('navOverlay');

function closeMobileMenu() {
    navToggle.classList.remove('active');
    navLinks.classList.remove('open');
    navOverlay.classList.remove('open');
    document.body.classList.remove('menu-open');
    document.body.style.overflow = '';
}

navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.classList.toggle('active');
    navOverlay.classList.toggle('open');
    document.body.classList.toggle('menu-open', isOpen);
    
    if (isOpen) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
});

// Close mobile menu when backdrop overlay is clicked
navOverlay.addEventListener('click', closeMobileMenu);

// Close mobile menu when a section anchor link is clicked
navLinks.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
});

// Active nav link highlighting on scroll
const sections = document.querySelectorAll('.section, .hero');
const navItems = navLinks.querySelectorAll('a[href^="#"]');

function setActiveLink() {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        if (window.scrollY >= sectionTop) {
            current = section.getAttribute('id');
        }
    });

    navItems.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', setActiveLink);
setActiveLink();
