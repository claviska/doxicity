function toggleMenu() {
  const isMenuToggled = !document.documentElement.classList.contains('docs-menu-toggled');
  document.documentElement.classList.toggle('docs-menu-toggled', isMenuToggled);
  sessionStorage.setItem('docs-menu', isMenuToggled ? 'toggled' : '');
}

function toggleTheme() {
  const isDark = !document.documentElement.classList.contains('docs-theme-dark');
  document.documentElement.classList.toggle('docs-theme-dark', isDark);
  sessionStorage.setItem('docs-theme', isDark ? 'dark' : 'light');
}

const menuToggle = document.getElementById('docs-menu-toggle');
const themeToggle = document.getElementById('docs-theme-toggle');
const sidebar = document.getElementById('docs-sidebar');

// Toggle the menu
if (menuToggle) {
  menuToggle?.addEventListener('click', toggleMenu);
}

// If a sidebar link is clicked, close the menu if we're on mobile
sidebar.addEventListener('click', event => {
  const isMobile = document.body.clientWidth <= 600;
  const a = event.target.closest('a');

  if (a && isMobile) {
    toggleMenu();
  }
});

// Toggle the theme
if (themeToggle) {
  themeToggle.addEventListener('click', toggleTheme);
  document.addEventListener('keydown', event => {
    if (
      event.key === '\\' &&
      !event.composedPath().some(el => ['input', 'textarea'].includes(el?.tagName?.toLowerCase()))
    ) {
      event.preventDefault();
      toggleTheme();
    }
  });
}

// Open details on print
const detailsOpenOnPrint = new Set();

window.addEventListener('beforeprint', () => {
  detailsOpenOnPrint.clear();
  document.querySelectorAll('details').forEach(details => {
    if (details.open) {
      detailsOpenOnPrint.add(details);
    }
    details.open = true;
  });
});

window.addEventListener('afterprint', () => {
  document.querySelectorAll('details').forEach(details => {
    details.open = detailsOpenOnPrint.has(details);
  });
  detailsOpenOnPrint.clear();
});
