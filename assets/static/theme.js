(function() {
  const getPreferredTheme = () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme;
    }
    // White in day (6 AM to 6 PM), Dark at night
    const hour = new Date().getHours();
    const isDayTime = hour >= 6 && hour < 18;
    return isDayTime ? 'light' : 'dark';
  };

  const setTheme = (theme) => {
    if (theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    localStorage.setItem('theme', theme);
    
    // Update toggle icons if they are loaded
    document.querySelectorAll('.theme-toggle i').forEach(icon => {
      if (theme === 'light') {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
      } else {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
      }
    });
  };

  // Set initial theme immediately to prevent FOUC
  setTheme(getPreferredTheme());

  // Wait for DOM to load to attach event listeners
  window.addEventListener('DOMContentLoaded', () => {
    // Re-apply to make sure icons are updated once DOM is ready
    setTheme(getPreferredTheme());

    document.querySelectorAll('.theme-toggle').forEach(btn => {
      btn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
        setTheme(currentTheme === 'light' ? 'dark' : 'light');
      });
    });
  });
})();
