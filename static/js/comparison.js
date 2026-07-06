// Interactive MIIW backbone comparison.
// Data (scenes) comes from comparison-data.js -> COMPARISON_SCENES.
(function () {
  const METHODS = [
    { key: 'ours',   label: 'Ours (RADIO)' },
    { key: 'rgbx',   label: 'RGBX' },
    { key: 'clip',   label: 'CLIP' },
    { key: 'dinov2', label: 'DINOv2' },
    { key: 'dinov3', label: 'DINOv3' },
    { key: 'mae',    label: 'MAE' },
  ];
  const BASE = './static/comparison/';
  const scenes = (typeof COMPARISON_SCENES !== 'undefined') ? COMPARISON_SCENES : [];

  let cur = 0, mode = 'grid', selA = 'ours', selB = 'rgbx';
  const $ = id => document.getElementById(id);
  const imgPath = (scene, key) => BASE + scene + '/' + key + '.jpg';
  const labelOf = k => (METHODS.find(m => m.key === k) || {}).label || k;

  function buildStrip() {
    const strip = $('cmp-scene-strip');
    strip.innerHTML = '';
    scenes.forEach((s, i) => {
      const b = document.createElement('button');
      b.className = 'cmp-thumb' + (i === cur ? ' is-active' : '');
      b.innerHTML = '<img src="' + imgPath(s.scene, 'ours') + '" alt="">' +
                    '<span>' + s.label + '</span>';
      b.addEventListener('click', () => { cur = i; render(); });
      strip.appendChild(b);
    });
  }

  function buildGrid() {
    const g = $('cmp-grid');
    g.innerHTML = '';
    const s = scenes[cur];
    METHODS.forEach(m => {
      const cell = document.createElement('div');
      cell.className = 'cmp-cell' + (m.key === 'ours' ? ' cmp-ours' : '') +
                       (m.key === 'gt' ? ' cmp-gt' : '');
      cell.innerHTML = '<img src="' + imgPath(s.scene, m.key) + '" alt="' + m.label + '">' +
                       '<div class="cmp-cell-label">' + m.label + '</div>';
      g.appendChild(cell);
    });
  }

  function buildSelectors() {
    ['cmp-sel-a', 'cmp-sel-b'].forEach(id => {
      const sel = $(id);
      sel.innerHTML = '';
      METHODS.forEach(m => {
        const o = document.createElement('option');
        o.value = m.key; o.textContent = m.label;
        sel.appendChild(o);
      });
    });
    $('cmp-sel-a').value = selA;
    $('cmp-sel-b').value = selB;
    $('cmp-sel-a').addEventListener('change', e => { selA = e.target.value; updateSlider(); });
    $('cmp-sel-b').addEventListener('change', e => { selB = e.target.value; updateSlider(); });
  }

  function updateSlider() {
    const s = scenes[cur];
    $('cmp-ba-a').src = imgPath(s.scene, selA);
    $('cmp-ba-b').src = imgPath(s.scene, selB);
    $('cmp-ba-label-a').textContent = labelOf(selA);
    $('cmp-ba-label-b').textContent = labelOf(selB);
  }

  function setDivider(pct) {
    pct = Math.max(0, Math.min(100, pct));
    $('cmp-ba-a').style.clipPath = 'inset(0 ' + (100 - pct) + '% 0 0)';
    $('cmp-ba-handle').style.left = pct + '%';
  }

  function initDrag() {
    const wrap = $('cmp-ba');
    let dragging = false;
    const moveTo = clientX => {
      const r = wrap.getBoundingClientRect();
      setDivider(((clientX - r.left) / r.width) * 100);
    };
    const getX = e => (e.touches && e.touches[0] ? e.touches[0].clientX : e.clientX);
    const down = e => { dragging = true; moveTo(getX(e)); e.preventDefault(); };
    const move = e => { if (dragging) { moveTo(getX(e)); } };
    const up = () => { dragging = false; };
    wrap.addEventListener('mousedown', down);
    wrap.addEventListener('touchstart', down, { passive: false });
    window.addEventListener('mousemove', move);
    window.addEventListener('touchmove', move, { passive: false });
    window.addEventListener('mouseup', up);
    window.addEventListener('touchend', up);
  }

  function initTabs() {
    document.querySelectorAll('.cmp-tabs li').forEach(li => {
      li.addEventListener('click', () => {
        document.querySelectorAll('.cmp-tabs li').forEach(x => x.classList.remove('is-active'));
        li.classList.add('is-active');
        mode = li.getAttribute('data-mode');
        render();
      });
    });
  }

  function render() {
    buildStrip();
    const s = scenes[cur];
    $('cmp-caption').innerHTML = '<b>' + s.label + '</b>';
    if (mode === 'grid') {
      $('cmp-grid').style.display = '';
      $('cmp-slider').style.display = 'none';
      buildGrid();
    } else {
      $('cmp-grid').style.display = 'none';
      $('cmp-slider').style.display = '';
      updateSlider();
      setDivider(50);
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    if (!scenes.length) return;
    buildSelectors();
    initTabs();
    initDrag();
    render();
  });
})();
