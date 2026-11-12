(function () {
  'use strict';
  var S = window.SITE;
  if (!S) return;

  // Apply the order from data/site.js; projects not listed keep their place after the listed ones
  if (S.order && S.order.length) {
    var rank = {};
    S.order.forEach(function (s, i) { rank[s] = i; });
    S.projects = S.projects
      .map(function (p, i) { return { p: p, k: rank[p.slug] != null ? rank[p.slug] : S.order.length + i }; })
      .sort(function (a, b) { return a.k - b.k; })
      .map(function (x) { return x.p; });
  }

  var PLAY = '<svg aria-hidden="true" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M8 5.5v13l10.5-6.5z"/></svg>';
  var PLAY_SM = '<svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13l10.5-6.5z"/></svg>';
  var ARROW_L = '<svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg>';
  var ARROW_R = '<svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5l7 7-7 7"/></svg>';

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function $(sel, root) { return (root || document).querySelector(sel); }
  function vimeoSrc(id) {
    return 'https://player.vimeo.com/video/' + encodeURIComponent(id) +
      '?autoplay=1&title=0&byline=0&portrait=0&dnt=1&color=e0b36a';
  }
  function cover(p) { return 'img/' + p.slug + '/' + (p.cover || 'cover.jpg'); }
  function frame(p, f) { return 'img/' + p.slug + '/' + f; }
  function bySlug(s) { return S.projects.filter(function (x) { return x.slug === s; })[0]; }
  function parentOf(p) { return p.parent ? bySlug(p.parent) : null; }
  // Small copy of the cover for cards; the full cover is used in players
  function thumb(p) { return p.thumb ? 'img/' + p.slug + '/' + p.thumb : cover(p); }
  function preview(p) { return p.preview ? 'img/' + p.slug + '/' + p.preview : ''; }
  var mq = function (q) { return window.matchMedia && window.matchMedia(q).matches; };
  var REDUCED = mq('(prefers-reduced-motion: reduce)');
  var CAN_HOVER = mq('(hover: hover)');
  var SAVE_DATA = !!(navigator.connection && navigator.connection.saveData);

  // Card image: small copy first; if it is missing, the full cover; if that is missing too, the Vimeo preview
  function coverImg(p, alt, lazy) {
    return '<img src="' + esc(thumb(p)) + '" alt="' + esc(alt == null ? p.title : alt) + '" data-full="' + esc(cover(p)) + '" data-fallback-vimeo="' + esc(p.vimeo) + '"' + (lazy ? ' loading="lazy"' : '') + '>';
  }
  document.addEventListener('error', function (e) {
    var img = e.target;
    if (!img || img.tagName !== 'IMG') return;
    var full = img.getAttribute('data-full');
    if (full && !img.getAttribute('data-ff') && img.getAttribute('src') !== full) { img.setAttribute('data-ff', '1'); img.src = full; return; }
    if (!img.getAttribute('data-fallback-vimeo') || img.getAttribute('data-fb')) return;
    img.setAttribute('data-fb', '1');
    vimeoThumb(img.getAttribute('data-fallback-vimeo')).then(function (u) { if (u) img.src = u; });
  }, true);

  // Visitor statistics (GoatCounter, no cookies). Set the code in the admin panel.
  var GC = S.analytics && S.analytics.goatcounter;
  if (GC && /^[a-z0-9-]+$/i.test(GC) && !/^(localhost|127\.)/.test(location.hostname)) {
    var gs = document.createElement('script');
    gs.async = true; gs.src = 'https://gc.zgo.at/count.js';
    gs.setAttribute('data-goatcounter', 'https://' + GC + '.goatcounter.com/count');
    document.head.appendChild(gs);
  }
  function track(name, title) {
    try { if (window.goatcounter && window.goatcounter.count) window.goatcounter.count({ path: name, title: title || name, event: true }); } catch (e) {}
  }

  /* ---------- Hover previews: a short silent clip plays over the cover ---------- */
  var pv = null, pvTimer = null, pvHost = null;
  function stopPreview() {
    clearTimeout(pvTimer); pvHost = null;
    if (!pv) return;
    var v = pv; pv = null;
    v.classList.remove('on');
    var holder = v.parentNode && v.parentNode.closest('.card, .reel');
    if (holder) holder.classList.remove('previewing');
    setTimeout(function () { try { v.pause(); v.removeAttribute('src'); v.load(); } catch (e) {} v.remove(); }, 260);
  }
  function startPreview(host) {
    if (pv && pv.parentNode === host) return;
    stopPreview();
    var src = host.getAttribute('data-preview');
    if (!src) return;
    var v = document.createElement('video');
    v.className = 'pv'; v.muted = true; v.loop = true; v.playsInline = true;
    v.setAttribute('muted', ''); v.setAttribute('playsinline', ''); v.setAttribute('aria-hidden', 'true');
    v.preload = 'auto'; v.src = src;
    v.addEventListener('playing', function () {
      if (pv !== v) return;
      v.classList.add('on');
      var holder = host.closest('.card, .reel'); if (holder) holder.classList.add('previewing');
    });
    v.addEventListener('error', function () { if (pv === v) stopPreview(); });
    host.appendChild(v); pv = v; pvHost = host;
    var pr = v.play(); if (pr && pr.catch) pr.catch(function () {});
  }
  if (CAN_HOVER) {
    document.addEventListener('mouseover', function (e) {
      var holder = e.target.closest && e.target.closest('.card, .reel');
      var host = holder && holder.querySelector('[data-preview]');
      if (!host || host === pvHost) return;
      clearTimeout(pvTimer); pvHost = host;
      pvTimer = setTimeout(function () { startPreview(host); }, 70);
    });
    document.addEventListener('mouseout', function (e) {
      var holder = e.target.closest && e.target.closest('.card, .reel');
      if (!holder || (e.relatedTarget && holder.contains(e.relatedTarget))) return;
      stopPreview();
    });
    document.addEventListener('focusin', function (e) {
      var holder = e.target.closest && e.target.closest('.card, .reel');
      var host = holder && holder.querySelector('[data-preview]');
      if (host && e.target.matches(':focus-visible')) startPreview(host);
    });
    document.addEventListener('focusout', function (e) { if (e.target.closest && e.target.closest('.card, .reel')) stopPreview(); });
  }
  // Phones have no hover: the card in the middle of the screen plays instead
  function autoPreview(items, margin) {
    if (CAN_HOVER || REDUCED || SAVE_DATA || !('IntersectionObserver' in window)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var host = en.target.querySelector('[data-preview]') || en.target;
        if (en.isIntersecting) startPreview(host);
        else if (pv && pv.parentNode === host) stopPreview();
      });
    }, { rootMargin: margin, threshold: 0 });
    items.forEach(function (el) { if (el.querySelector('[data-preview]')) io.observe(el); });
  }
  document.addEventListener('visibilitychange', function () { if (document.hidden) stopPreview(); });

  // Lists arrive once, when they first scroll into view
  function reveal(el) {
    if (!el || !('IntersectionObserver' in window)) return;
    el.classList.add('will-reveal');
    var io = new IntersectionObserver(function (entries) {
      if (!entries.some(function (en) { return en.isIntersecting; })) return;
      el.classList.add('in'); io.disconnect();
    }, { rootMargin: '0px 0px -12% 0px' });
    io.observe(el);
  }
  function transition(update) {
    if (!document.startViewTransition || REDUCED) { update(); return null; }
    try { return document.startViewTransition(update); } catch (e) { update(); return null; }
  }

  // Vimeo preview for videos without our own cover
  var thumbCache = {};
  function vimeoThumb(id) {
    if (!thumbCache[id]) {
      thumbCache[id] = fetch('https://vimeo.com/api/oembed.json?width=720&url=' + encodeURIComponent('https://vimeo.com/' + id))
        .then(function (r) { return r.ok ? r.json() : {}; })
        .then(function (j) { return j.thumbnail_url || ''; })
        .catch(function () { return ''; });
    }
    return thumbCache[id];
  }
  function fillThumbs(root) {
    (root || document).querySelectorAll('img[data-vimeo-thumb]').forEach(function (img) {
      vimeoThumb(img.getAttribute('data-vimeo-thumb')).then(function (u) { if (u) img.src = u; });
    });
  }

  // Inline player: cover + play button, replaced by the Vimeo iframe on click
  function playerHTML(id, img, alt, vertical, tag, loop) {
    return '<div class="player' + (vertical ? ' is-vertical' : '') + '" data-vimeo="' + esc(id) + '" data-name="' + esc(alt) + '">' +
      (img ? '<img src="' + esc(img) + '" alt="' + esc(alt) + '" data-fallback-vimeo="' + esc(id) + '">' : '<img alt="' + esc(alt) + '" data-vimeo-thumb="' + esc(id) + '">') +
      (loop ? '<video class="loop" muted loop playsinline preload="auto" aria-hidden="true" data-src="' + esc(loop) + '"></video>' : '') +
      (tag ? '<div class="tag">' + tag + '</div>' : '') +
      (loop ? '<span class="sound">' + PLAY_SM + 'Play with sound</span>' : '') +
      '<button type="button" class="play" aria-label="Play ' + esc(alt) + (loop ? ' with sound' : '') + '"><span>' + PLAY + '</span></button>' +
      '</div>';
  }
  function wirePlayers(root) {
    (root || document).querySelectorAll('.player[data-vimeo]').forEach(function (el) {
      var btn = $('.play', el);
      if (!btn) return;
      btn.addEventListener('click', function () {
        var f = document.createElement('iframe');
        f.src = vimeoSrc(el.getAttribute('data-vimeo'));
        f.allow = 'autoplay; fullscreen; picture-in-picture';
        f.allowFullscreen = true;
        f.title = btn.getAttribute('aria-label').replace(/^Play /, '');
        el.appendChild(f);
        el.classList.add('is-playing');
        var lv = $('.loop', el); if (lv) { lv.pause(); lv.removeAttribute('src'); lv.load(); }
        track('play/' + el.getAttribute('data-name'), 'Play: ' + el.getAttribute('data-name'));
      });
      // Silent loop: starts by itself, rests when it is off screen or the tab is hidden
      var loop = $('.loop', el);
      if (loop && !REDUCED && !SAVE_DATA) {
        loop.muted = true;
        loop.addEventListener('playing', function () { el.classList.add('has-loop'); });
        loop.addEventListener('error', function () { el.classList.remove('has-loop'); });
        loop.src = loop.getAttribute('data-src');
        var visible = true;
        var sync = function () {
          if (el.classList.contains('is-playing')) return;
          if (visible && !document.hidden) { var pr = loop.play(); if (pr && pr.catch) pr.catch(function () {}); } else loop.pause();
        };
        if ('IntersectionObserver' in window) new IntersectionObserver(function (en) { visible = en[0].isIntersecting; sync(); }, { threshold: 0.15 }).observe(el);
        document.addEventListener('visibilitychange', sync);
        sync();
      }
    });
  }

  // Viewer for vertical videos: player + project details on the side, arrows between videos
  var dlg, vList = [], vIndex = 0;
  var CHEV_L = '<svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg>';
  var CHEV_R = '<svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5l7 7-7 7"/></svg>';
  function infoHTML(v) {
    var p = v.project, rows = [['Client', p.client], ['Category', p.category], ['Role', p.role], ['Format', p.format], ['Length', p.length]]
      .filter(function (r) { return r[1]; });
    return '<h2 class="v-title">' + esc(v.title) + '</h2>' +
      (parentOf(p) ? '<p class="v-sub">From “' + esc(parentOf(p).title) + '”</p>' : (p.subtitle ? '<p class="v-sub">' + esc(p.subtitle) + '</p>' : '')) +
      (rows.length ? '<dl class="v-rows">' + rows.map(function (r) { return '<div><dt>' + r[0] + '</dt><dd>' + esc(r[1]) + '</dd></div>'; }).join('') + '</dl>' : '') +
      (p.brief ? '<h3>The brief</h3><p>' + esc(p.brief) + '</p>' : '') +
      (p.did ? '<h3>What I did</h3><p>' + esc(p.did) + '</p>' : '') +
      (p.quote ? '<blockquote>“' + esc(p.quote.text) + '”<cite>' + esc(p.quote.source) + '</cite></blockquote>' : '') +
      '<a class="v-link" href="project.html?p=' + encodeURIComponent(p.slug) + '">Open project page</a>';
  }
  function mountVideo() {
    var v = vList[vIndex], media = $('.v-media', dlg);
    if (!dlg.open || media.querySelector('iframe')) return;
    var f = document.createElement('iframe');
    f.src = vimeoSrc(v.vimeo); f.allow = 'autoplay; fullscreen; picture-in-picture'; f.allowFullscreen = true; f.title = v.title;
    media.appendChild(f);
    track('play/' + v.project.slug, 'Play: ' + v.title);
  }
  // dir: -1 / 1 when stepping between videos, 0 when the viewer opens
  function showItem(i, dir) {
    vIndex = (i + vList.length) % vList.length;
    var v = vList[vIndex], media = $('.v-media', dlg), info = $('.v-info', dlg);
    media.innerHTML = '<img class="poster" src="' + esc(cover(v.project)) + '" alt="" data-fallback-vimeo="' + esc(v.vimeo) + '">';
    info.innerHTML = infoHTML(v) + (vList.length > 1 ? '<p class="v-count">' + (vIndex + 1) + ' / ' + vList.length + '</p>' : '');
    info.scrollTop = 0;
    dlg.classList.toggle('single', vList.length < 2);
    if (dir) {
      mountVideo();
      if (!REDUCED && media.animate) {
        media.animate([{ opacity: 0.2, transform: 'translateX(' + dir * 28 + 'px)' }, { opacity: 1, transform: 'none' }], { duration: 320, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' });
        info.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 260, easing: 'ease-out' });
      }
    }
  }
  // The card the current video came from, if it is on screen: the viewer grows out of it and returns to it
  function originOf(v) {
    var els = document.querySelectorAll('.reel[data-slug="' + v.project.slug + '"] .frame');
    for (var k = 0; k < els.length; k++) {
      var r = els[k].getBoundingClientRect();
      if (r.width && r.bottom > 0 && r.top < innerHeight && r.right > 0 && r.left < innerWidth) return els[k];
    }
    return null;
  }
  function closeViewer() {
    if (!dlg || !dlg.open) return;
    var media = $('.v-media', dlg), from = originOf(vList[vIndex]);
    var ifr = media.querySelector('iframe'); if (ifr) ifr.remove();
    var end = function () { dlg.close(); };
    if (!from) { end(); return; }
    media.style.viewTransitionName = 'vt-media';
    var t = transition(function () { media.style.viewTransitionName = ''; end(); from.style.viewTransitionName = 'vt-media'; });
    var clear = function () { from.style.viewTransitionName = ''; };
    if (t && t.finished) t.finished.then(clear, clear); else clear();
  }
  function openViewer(list, i) {
    if (!dlg) {
      dlg = document.createElement('dialog');
      dlg.className = 'viewer';
      dlg.setAttribute('aria-label', 'Video player');
      dlg.innerHTML = '<button type="button" class="v-close" aria-label="Close video">' +
        '<svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg></button>' +
        '<div class="v-stage">' +
        '<button type="button" class="v-nav v-prev" aria-label="Previous video">' + CHEV_L + '</button>' +
        '<div class="v-card"><div class="v-media"></div><aside class="v-info"></aside></div>' +
        '<button type="button" class="v-nav v-next" aria-label="Next video">' + CHEV_R + '</button>' +
        '</div>';
      document.body.appendChild(dlg);
      $('.v-close', dlg).addEventListener('click', closeViewer);
      $('.v-prev', dlg).addEventListener('click', function () { showItem(vIndex - 1, -1); });
      $('.v-next', dlg).addEventListener('click', function () { showItem(vIndex + 1, 1); });
      dlg.addEventListener('click', function (e) { if (e.target === dlg || e.target.classList.contains('v-stage')) closeViewer(); });
      dlg.addEventListener('cancel', function (e) { e.preventDefault(); closeViewer(); });
      dlg.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowLeft') { e.preventDefault(); showItem(vIndex - 1, -1); }
        if (e.key === 'ArrowRight') { e.preventDefault(); showItem(vIndex + 1, 1); }
      });
      // Swipe on phones
      var x0 = null;
      dlg.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
      dlg.addEventListener('touchend', function (e) {
        if (x0 === null) return;
        var dx = e.changedTouches[0].clientX - x0; x0 = null;
        if (Math.abs(dx) > 60 && !e.target.closest('.v-info')) showItem(vIndex + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1);
      });
      dlg.addEventListener('close', function () { $('.v-media', dlg).innerHTML = ''; document.body.style.overflow = ''; });
    }
    stopPreview();
    vList = list; vIndex = i;
    var from = originOf(list[i]), media = $('.v-media', dlg);
    var open = function () {
      showItem(i, 0);
      document.body.style.overflow = 'hidden';
      dlg.showModal();
      $('.v-close', dlg).focus();
    };
    var canMorph = from && document.startViewTransition && !REDUCED;
    dlg.classList.toggle('fade', !canMorph);
    if (!canMorph) { open(); mountVideo(); return; }
    from.style.viewTransitionName = 'vt-media';
    var t = transition(function () { from.style.viewTransitionName = ''; open(); media.style.viewTransitionName = 'vt-media'; });
    var done = function () { media.style.viewTransitionName = ''; mountVideo(); };
    if (t && t.finished) t.finished.then(done, done); else done();
  }

  function contactsHTML() {
    var c = S.contacts;
    return '<a class="email" href="mailto:' + esc(c.email) + '">' + esc(c.email) + '</a>' +
      '<div class="pills">' +
      '<a href="' + esc(c.upwork) + '" target="_blank" rel="noopener">Hire on Upwork</a>' +
      '<a href="' + esc(c.linkedin) + '" target="_blank" rel="noopener">LinkedIn</a>' +
      '<a href="' + esc(c.instagram) + '" target="_blank" rel="noopener">Instagram</a>' +
      '</div>';
  }

  // All vertical videos for the carousel, built from the projects
  function verticalVideos() {
    return S.projects.filter(function (p) { return p.vertical; }).map(function (p) {
      var par = parentOf(p);
      return { vimeo: p.vimeo, title: p.title, client: par ? par.title : p.client, project: p };
    });
  }

  function pvAttr(p) { return preview(p) ? ' data-preview="' + esc(preview(p)) + '"' : ''; }
  function reelHTML(p, title, i, sub) {
    return '<button type="button" class="reel" role="listitem" data-i="' + i + '" data-slug="' + esc(p.slug) + '">' +
      '<div class="frame"' + pvAttr(p) + '>' + coverImg(p, title, true) +
      '<span class="mini-play">' + PLAY_SM + '</span></div>' +
      '<div class="reel-title">' + esc(title) + '</div>' + (sub ? '<div class="reel-client">' + esc(sub) + '</div>' : '') + '</button>';
  }
  function projectCard(p) {
    var img = thumb(p);
    return '<a class="card" data-slug="' + esc(p.slug) + '" href="project.html?p=' + encodeURIComponent(p.slug) + '">' +
      '<div class="thumb' + (p.vertical ? ' is-vertical' : '') + '"' + pvAttr(p) + '>' +
      (p.vertical ? '<img class="blur" src="' + esc(img) + '" alt="" loading="lazy">' : '') +
      '<img class="main" src="' + esc(img) + '" alt="' + esc(p.title) + '" loading="lazy" data-full="' + esc(cover(p)) + '" data-fallback-vimeo="' + esc(p.vimeo) + '">' +
      '<span class="tag">' + esc(p.category.toUpperCase()) + '</span></div>' +
      '<div class="card-meta"><div><div class="card-title">' + esc(p.title) + '</div>' +
      '<div class="card-client">' + esc(p.client) + '</div></div>' +
      '<div class="card-role">' + esc(p.role) + '</div></div></a>';
  }

  /* ---------- Home ---------- */
  function home() {
    // Showreel
    $('#showreel').innerHTML = playerHTML(S.showreel.vimeo, S.showreel.cover, 'Showreel', false,
      '<span>Showreel</span><span>' + esc(S.showreel.length) + '</span>', S.showreel.preview);

    // Work grid with filters
    var cat = 'All';
    var filters = $('#filters');
    var names = ['All'].concat(S.categories.filter(function (c) {
      return S.projects.some(function (p) { return !p.vertical && p.category === c; });
    }));
    filters.innerHTML = names.map(function (n) {
      return '<button type="button" aria-pressed="' + (n === cat) + '" data-cat="' + esc(n) + '">' + esc(n) + '</button>';
    }).join('');
    var grid = $('#grid');
    // During a filter change each card keeps its identity, so cards slide to their new places
    function nameCards(on) {
      grid.querySelectorAll('.card').forEach(function (c) { c.style.viewTransitionName = on ? 'card-' + c.getAttribute('data-slug') : ''; });
    }
    function renderGrid() {
      // Vertical projects (shorts/reels) live only in the Social carousel
      var items = S.projects.filter(function (p) { return !p.vertical && (cat === 'All' || p.category === cat); });
      grid.innerHTML = items.map(projectCard).join('');
      var n = items.length;
      $('#count').textContent = n + (n === 1 ? ' project' : ' projects');
    }
    filters.addEventListener('click', function (e) {
      var b = e.target.closest('button');
      if (!b) return;
      cat = b.getAttribute('data-cat');
      filters.querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-pressed', x === b); });
      stopPreview();
      nameCards(true);
      var t = transition(function () { renderGrid(); nameCards(true); });
      var clear = function () { nameCards(false); };
      if (t && t.finished) t.finished.then(clear, clear); else clear();
    });
    renderGrid();
    reveal(grid);
    autoPreview(grid.querySelectorAll('.card'), '-42% 0px -42% 0px');

    // Vertical carousel
    var vids = verticalVideos();
    var rail = $('#rail');
    rail.innerHTML = vids.map(function (v, i) { return reelHTML(v.project, v.title, i, v.client); }).join('');
    reveal(rail);
    autoPreview(rail.querySelectorAll('.reel'), '0px -38% 0px -38%');
    rail.addEventListener('click', function (e) {
      var b = e.target.closest('.reel');
      if (!b) return;
      openViewer(vids, +b.getAttribute('data-i'));
    });
    var prev = $('#prev'), next = $('#next');
    prev.innerHTML = ARROW_L; next.innerHTML = ARROW_R;
    function step() { return Math.max(232, Math.floor(rail.clientWidth / 232) * 232); }
    prev.addEventListener('click', function () { rail.scrollBy({ left: -step(), behavior: 'smooth' }); });
    next.addEventListener('click', function () { rail.scrollBy({ left: step(), behavior: 'smooth' }); });
    function arrows() {
      prev.disabled = rail.scrollLeft <= 4;
      next.disabled = rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 4;
    }
    rail.addEventListener('scroll', arrows, { passive: true });
    window.addEventListener('resize', arrows);
    arrows();

    // Clients: click a brand to see the videos made for it
    function brandWork(c) {
      var wide = S.projects.filter(function (p) { return p.client === c && !p.vertical; });
      var reels = verticalVideos().filter(function (v) { return v.project.client === c; });
      return { wide: wide, reels: reels, n: wide.length + reels.length };
    }
    var clientsEl = $('#clients'), brandEl = $('#brand-work');
    clientsEl.innerHTML = S.clients.map(function (c) {
      var n = brandWork(c).n;
      if (!n) return '<div class="client">' + esc(c) + '</div>';
      return '<button type="button" class="client" aria-expanded="false" aria-controls="brand-work" data-c="' + esc(c) + '">' +
        '<span>' + esc(c) + '</span><span class="client-n">' + n + (n === 1 ? ' VIDEO' : ' VIDEOS') + '</span></button>';
    }).join('');
    var brandReels = [];
    function showBrand(c) {
      clientsEl.querySelectorAll('button.client').forEach(function (b) { b.setAttribute('aria-expanded', b.getAttribute('data-c') === c); });
      if (!c) { brandEl.hidden = true; brandEl.innerHTML = ''; return; }
      var w = brandWork(c);
      brandReels = w.reels;
      brandEl.innerHTML = '<div class="brand-head"><h3>' + esc(c) + '</h3>' +
        '<button type="button" class="brand-close" aria-label="Close">×</button></div>' +
        (w.wide.length ? '<div class="grid brand-grid">' + w.wide.map(projectCard).join('') + '</div>' : '') +
        (w.reels.length ? '<div class="brand-reels">' + w.reels.map(function (v, i) { return reelHTML(v.project, v.title, i); }).join('') + '</div>' : '');
      brandEl.hidden = false;
      fillThumbs(brandEl);
      brandEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    clientsEl.addEventListener('click', function (e) {
      var b = e.target.closest('button.client'); if (!b) return;
      showBrand(b.getAttribute('aria-expanded') === 'true' ? null : b.getAttribute('data-c'));
    });
    brandEl.addEventListener('click', function (e) {
      if (e.target.closest('.brand-close')) { showBrand(null); return; }
      var r = e.target.closest('.reel'); if (!r) return;
      openViewer(brandReels, +r.getAttribute('data-i'));
    });

    // Reviews
    var big = S.reviews.filter(function (r) { return r.featured; })[0] || S.reviews[0];
    $('#review-big').innerHTML = '<blockquote>“' + esc(big.text) + '”</blockquote>' +
      '<figcaption>' + esc(big.job) + ' · 5.0 · ' + esc(big.year) + '</figcaption>';
    $('#reviews').innerHTML = S.reviews.filter(function (r) { return r !== big; }).slice(0, 2).map(function (r) {
      return '<figure><blockquote>“' + esc(r.text) + '”</blockquote><figcaption>' +
        esc(r.job) + ' · 5.0 · ' + esc(r.year) + '</figcaption></figure>';
    }).join('');
    $('#upwork-all').href = S.contacts.upwork;

    $('#contact-links').innerHTML = contactsHTML();
    wirePlayers();
    fillThumbs();
  }

  /* ---------- Project ---------- */
  function project() {
    var slug = new URLSearchParams(location.search).get('p');
    var idx = S.projects.findIndex(function (p) { return p.slug === slug; });
    if (idx < 0) idx = 0;
    var p = S.projects[idx];
    var tops = S.projects.filter(function (x) { return !x.parent; });
    var ti = tops.indexOf(parentOf(p) || p);
    var nextP = tops[(ti + 1) % tops.length];
    document.title = p.title + ' — ' + S.name;
    // Search engines and link previews
    var desc = (p.did || p.brief || (p.role + ' for ' + p.client)).replace(/\s+/g, ' ').slice(0, 155);
    var here = location.origin + location.pathname + '?p=' + encodeURIComponent(p.slug);
    var setMeta = function (sel, attr, val) { var el = document.head.querySelector(sel); if (el) el.setAttribute(attr, val); };
    setMeta('meta[name="description"]', 'content', desc);
    setMeta('link[rel="canonical"]', 'href', here);
    setMeta('meta[property="og:title"]', 'content', p.title + ' — ' + S.name);
    setMeta('meta[property="og:description"]', 'content', desc);
    setMeta('meta[property="og:image"]', 'content', new URL(cover(p), location.href).href);

    var out = [];
    out.push('<section class="wrap p-head">' +
      '<h1>' + esc(p.title) + '</h1>' + (p.subtitle ? '<p class="sub">' + esc(p.subtitle) + '</p>' : '') + '</section>');

    out.push('<section class="wrap p-video' + (p.vertical ? ' is-vertical' : '') + '" aria-label="Video">' +
      playerHTML(p.vimeo, cover(p), p.title, p.vertical) + '</section>');

    var info = [['Client', p.client], ['Category', p.category], ['Role', p.role], ['Format', p.format], ['Length', p.length]]
      .filter(function (r) { return r[1]; });
    out.push('<section class="wrap" style="padding-top:56px" aria-label="Project details"><dl class="info">' +
      info.map(function (r) { return '<div><dt>' + r[0] + '</dt><dd>' + esc(r[1]) + '</dd></div>'; }).join('') + '</dl></section>');

    if (p.brief || p.did) {
      out.push('<section class="wrap texts" style="padding-top:72px" aria-label="About the project">' +
        (p.brief ? '<div><h2>The brief</h2><p>' + esc(p.brief) + '</p></div>' : '') +
        (p.did ? '<div><h2>What I did</h2><p>' + esc(p.did) + '</p></div>' : '') + '</section>');
    }

    // Other videos from the same project (the main one and its parts)
    var root = p.parent || p.slug;
    var family = S.projects.filter(function (x) { return x !== p && (x.slug === root || x.parent === root); });
    var famReels = family.filter(function (x) { return x.vertical; });
    var famWide = family.filter(function (x) { return !x.vertical; });
    if (family.length) {
      out.push('<section class="wrap section" aria-labelledby="v-title">' +
        '<h2 id="v-title" class="h2" style="margin-bottom:28px">' + (family.length > 1 ? 'More from this project' : (p.parent ? 'From the same project' : 'Another version')) + '</h2>' +
        (famWide.length ? '<div class="grid" style="margin-bottom:32px">' + famWide.map(projectCard).join('') + '</div>' : '') +
        (famReels.length ? '<div class="versions" role="list">' + famReels.map(function (x, i) { return reelHTML(x, x.title, i); }).join('') + '</div>' : '') + '</section>');
    }

    if (p.frames && p.frames.length) {
      out.push('<section class="wrap section" aria-labelledby="f-title">' +
        '<h2 id="f-title" class="h2" style="margin-bottom:28px">Frames</h2>' +
        '<div class="frames' + (p.vertical ? ' is-vertical' : '') + '">' + p.frames.map(function (f, i) {
          return '<img src="' + esc(frame(p, f)) + '" alt="' + esc(p.title) + ', frame ' + (i + 1) + '" loading="lazy">';
        }).join('') + '</div></section>');
    }

    if (p.quote) {
      out.push('<section class="wrap section quote" aria-label="Client feedback"><figure style="margin:0;border-top:1px solid var(--line);padding-top:40px">' +
        '<blockquote>“' + esc(p.quote.text) + '”</blockquote><figcaption>' + esc(p.quote.source) + '</figcaption></figure></section>');
    }

    out.push('<section class="wrap" style="padding-top:120px;padding-bottom:64px"><a class="next" href="project.html?p=' + encodeURIComponent(nextP.slug) + '">' +
      '<span><span class="small" style="display:block">Next project</span><span class="big">' + esc(nextP.title) + '</span></span>' +
      '<svg aria-hidden="true" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a></section>');

    var main = $('#project');
    main.innerHTML = out.join('');
    main.querySelectorAll('.versions .reel').forEach(function (b) {
      b.addEventListener('click', function () {
        openViewer(famReels.map(function (x) { return { vimeo: x.vimeo, title: x.title, project: x }; }), +b.getAttribute('data-i'));
      });
    });
    wirePlayers(main);
    fillThumbs(main);
  }

  // Shared bits
  document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
  if (document.body.getAttribute('data-page') === 'project') project(); else home();
})();
