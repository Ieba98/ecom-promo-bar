(function () {
  if (typeof document === 'undefined') return;

  var STAR_PATH = 'M12 .587l3.668 7.431 8.2 1.192-5.934 5.786 1.401 8.164L12 18.896l-7.335 3.864 1.401-8.164L.132 9.21l8.2-1.192L12 .587z';

  function createStar(isFilled) {
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('aria-hidden', 'true');
    var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', STAR_PATH);
    path.setAttribute('fill', isFilled ? 'currentColor' : 'none');
    path.setAttribute('stroke', 'currentColor');
    path.setAttribute('stroke-width', '1');
    svg.appendChild(path);
    var wrapper = document.createElement('span');
    wrapper.className = 'fr-star';
    wrapper.appendChild(svg);
    return wrapper;
  }

  function enhanceRatings(root) {
    var containers = root.querySelectorAll('.fr-rating[data-rating]');
    containers.forEach(function (container) {
      // Avoid double-enhancement
      if (container._frEnhanced) return;
      container._frEnhanced = true;

      var rating = parseFloat(container.getAttribute('data-rating')) || 0;
      if (rating < 0) rating = 0; if (rating > 5) rating = 5;

      // Build stars fragment
      var frag = document.createDocumentFragment();
      var starsWrap = document.createElement('span');
      starsWrap.className = 'fr-stars';
      for (var i = 1; i <= 5; i++) {
        starsWrap.appendChild(createStar(i <= Math.round(rating)));
      }

      // Replace textual rating only visually, keep for noscript
      container.innerHTML = '';
      container.appendChild(starsWrap);
    });
  }

  function init() {
    var sections = document.querySelectorAll('.fr-section');
    sections.forEach(function (section) { enhanceRatings(section); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})(); 