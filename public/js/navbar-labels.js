document.addEventListener('DOMContentLoaded', function () {
  const nav = document.getElementById('nav');
  if (!nav) return;

  const navLabels = {
    nav_home: 'Home',
    nav_games: 'Games',
    nav_guess: 'Guess',
    nav_compare: 'Compare',
    nav_collections: 'Profile',
  };

  Object.keys(navLabels).forEach((id) => {
    const link = document.getElementById(id);
    if (!link) return;

    const label = document.createElement('span');
    label.className = 'nav-label';
    label.textContent = navLabels[id];
    label.style.display = 'none';
    label.style.position = 'absolute';
    label.style.left = '50%';
    label.style.transform = 'translateX(-50%)';
    label.style.fontSize = '0.9rem';
    label.style.marginTop = '0.25rem';
    label.style.whiteSpace = 'nowrap';
    label.style.pointerEvents = 'none';
    label.style.transition = 'opacity 0.2s';
    label.style.opacity = '0';
    link.style.position = 'relative';
    link.appendChild(label);

    link.addEventListener('mouseenter', () => {
      label.style.display = 'block';
      setTimeout(() => { label.style.opacity = '1'; }, 10);
    });
    link.addEventListener('mouseleave', () => {
      label.style.opacity = '0';
      setTimeout(() => { label.style.display = 'none'; }, 200);
    });
  });
});
