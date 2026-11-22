document.addEventListener('DOMContentLoaded', () => {
    const modeToggle = document.getElementById('light-toggle');
    if (!modeToggle) return;

    function updatePressed() {
        modeToggle.setAttribute('aria-pressed', document.documentElement.dataset.theme === 'dark');
    }

    updatePressed();
    modeToggle.addEventListener('click', () => {
        toggleTheme(document.documentElement.dataset.theme);
        updatePressed();
    });
});
