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

// Theme toggle. The inline script in <head> already set data-theme before
// first paint; this keeps the button, the browser chrome colour and the
// stored choice in step with it.
const root = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
const themeColor = document.querySelector('meta[name="theme-color"]');
const THEME_COLORS = { light: '#f3f6fa', dark: '#0a0a0f' };

function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    themeToggle.setAttribute('aria-pressed', String(theme === 'dark'));
    themeColor.setAttribute('content', THEME_COLORS[theme]);
}

function storedTheme() {
    try {
        return localStorage.getItem('theme');
    } catch (e) {
        return null;
    }
}

applyTheme(root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light');

themeToggle.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    try {
        localStorage.setItem('theme', next);
    } catch (e) {
        // private mode: the choice lasts for this page only
    }
});

// Follow the system setting until the visitor picks a theme themselves
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!storedTheme()) applyTheme(e.matches ? 'dark' : 'light');
});

// Tab counts follow the markup, so adding a card updates them
document.querySelectorAll('[data-count]').forEach((el) => {
    el.textContent = document.querySelectorAll(el.dataset.count).length;
});

// Tabs (Certifications: Professional / Courses). Click or arrow keys switch;
// only the selected tab is in the Tab order, as in the ARIA tabs pattern.
document.querySelectorAll('[role="tablist"]').forEach((tablist) => {
    const tabs = [...tablist.querySelectorAll('[role="tab"]')];

    function select(tab) {
        tabs.forEach((t) => {
            const on = t === tab;
            t.setAttribute('aria-selected', String(on));
            t.tabIndex = on ? 0 : -1;
            document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
        });
    }

    tabs.forEach((tab) => tab.addEventListener('click', () => select(tab)));

    tablist.addEventListener('keydown', (e) => {
        const i = tabs.indexOf(document.activeElement);
        if (i < 0) return;
        // arrows follow the reading direction
        const forward = getComputedStyle(tablist).direction === 'rtl' ? 'ArrowLeft' : 'ArrowRight';
        const back = forward === 'ArrowRight' ? 'ArrowLeft' : 'ArrowRight';
        let next;
        if (e.key === forward) next = tabs[(i + 1) % tabs.length];
        else if (e.key === back) next = tabs[(i - 1 + tabs.length) % tabs.length];
        else if (e.key === 'Home') next = tabs[0];
        else if (e.key === 'End') next = tabs[tabs.length - 1];
        else return;
        e.preventDefault();
        select(next);
        next.focus();
    });
});

// Active nav link highlighting on scroll. Panels that share a row (Education
// and Experience on wide screens) light up together.
const siteNav = document.getElementById('siteNav');
const navItems = [...siteNav.querySelectorAll('a[href^="#"]')];
const navTargets = navItems.map((link) => document.querySelector(link.getAttribute('href')));
const header = document.querySelector('.site-header');
let activeLink = null;

function setActiveLink() {
    const line = window.scrollY + header.offsetHeight + 24;
    const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
    const tops = navTargets.map((el) => el.getBoundingClientRect().top + window.scrollY);

    let current = atBottom ? Math.max(...tops) : -Infinity;
    if (!atBottom) {
        tops.forEach((top) => {
            if (top <= line && top > current) current = top;
        });
    }

    let first = null;
    navItems.forEach((link, i) => {
        const on = Math.abs(tops[i] - current) < 2;
        link.classList.toggle('is-active', on);
        if (on) {
            link.setAttribute('aria-current', 'true');
            first = first || link;
        } else {
            link.removeAttribute('aria-current');
        }
    });

    // On phones the nav is a scrolling strip: keep the current section in view
    if (first && first !== activeLink && siteNav.scrollWidth > siteNav.clientWidth) {
        const navBox = siteNav.getBoundingClientRect();
        const linkBox = first.getBoundingClientRect();
        const delta = (linkBox.left + linkBox.width / 2) - (navBox.left + navBox.width / 2);
        siteNav.scrollBy({ left: delta, behavior: 'smooth' });
    }
    activeLink = first;
}

let ticking = false;
function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
        setActiveLink();
        ticking = false;
    });
}

window.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('resize', onScroll);
setActiveLink();
