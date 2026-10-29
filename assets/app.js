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
  var KNOB = '<svg width="10" height="14" viewBox="0 0 10 14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 2L2 7l5 5"/></svg><svg width="10" height="14" viewBox="0 0 10 14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 2l5 5-5 5"/></svg>';

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
  function cover(p) { return 'img/' + p.slug + '/cover.jpg'; }
  function frame(p, f) { return 'img/' + p.slug + '/' + f; }

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
  function playerHTML(id, img, alt, vertical, tag) {
    return '<div class="player' + (vertical ? ' is-vertical' : '') + '" data-vimeo="' + esc(id) + '">' +
      (img ? '<img src="' + esc(img) + '" alt="' + esc(alt) + '">' : '<img alt="' + esc(alt) + '" data-vimeo-thumb="' + esc(id) + '">') +
      '<button type="button" class="play" aria-label="Play ' + esc(alt) + '"><span>' + PLAY + '</span></button>' +
      (tag ? '<div class="tag">' + tag + '</div>' : '') +
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
      });
    });
  }

  // Lightbox for vertical videos and versions
  var dlg;
  function openVideo(id, vertical, caption) {
    if (!dlg) {
      dlg = document.createElement('dialog');
      dlg.className = 'lightbox';
      dlg.setAttribute('aria-label', 'Video player');
      dlg.innerHTML = '<div class="inner"><button type="button" class="close" aria-label="Close video">' +
        '<svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg></button>' +
        '<div class="box"></div><div class="caption"></div></div>';
      document.body.appendChild(dlg);
      $('.close', dlg).addEventListener('click', function () { dlg.close(); });
      dlg.addEventListener('click', function (e) { if (e.target === dlg || e.target.classList.contains('inner')) dlg.close(); });
      dlg.addEventListener('close', function () { $('.box', dlg).innerHTML = ''; });
    }
    var box = $('.box', dlg);
    box.className = 'box ' + (vertical ? 'is-vertical' : 'is-wide');
    box.innerHTML = '<iframe src="' + esc(vimeoSrc(id)) + '" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen title="Video"></iframe>';
    $('.caption', dlg).innerHTML = caption || '';
    dlg.showModal();
  }

  // Before / after wipe
  function baHTML(pair, id) {
    return '<div class="ba" style="--pos:50%">' +
      '<img class="before" src="' + esc(pair.before) + '" alt="' + esc(pair.label) + ', original">' +
      '<img class="after" src="' + esc(pair.after) + '" alt="' + esc(pair.label) + ', graded">' +
      '<div class="line"></div><div class="knob" aria-hidden="true">' + KNOB + '</div>' +
      '<span class="label l">GRADED</span><span class="label r">ORIGINAL</span>' +
      '<label class="sr-only" for="' + id + '">Compare original and graded frame</label>' +
      '<input id="' + id + '" type="range" min="0" max="100" value="50">' +
      '</div>';
  }
  function wireBA(root) {
    var el = $('.ba', root);
    var input = $('input', el);
    input.addEventListener('input', function () { el.style.setProperty('--pos', input.value + '%'); });
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
    var list = [];
    S.projects.forEach(function (p) {
      if (p.vertical) list.push({ vimeo: p.vimeo, title: p.title, client: p.client, img: cover(p), project: p });
      (p.versions || []).forEach(function (v) {
        list.push({ vimeo: v.vimeo, title: v.title, client: p.title, img: v.cover, project: p });
      });
    });
    return list;
  }

  function projectCard(p) {
    var img = cover(p);
    return '<a class="card" href="project.html?p=' + encodeURIComponent(p.slug) + '">' +
      '<div class="thumb' + (p.vertical ? ' is-vertical' : '') + '">' +
      (p.vertical ? '<img class="blur" src="' + esc(img) + '" alt="" loading="lazy">' : '') +
      '<img class="main" src="' + esc(img) + '" alt="' + esc(p.title) + '" loading="lazy">' +
      '<span class="tag">' + esc(p.category.toUpperCase()) + '</span></div>' +
      '<div class="card-meta"><div><div class="card-title">' + esc(p.title) + '</div>' +
      '<div class="card-client">' + esc(p.client) + '</div></div>' +
      '<div class="card-role">' + esc(p.role) + '</div></div></a>';
  }

  /* ---------- Home ---------- */
  function home() {
    // Showreel
    $('#showreel').innerHTML = playerHTML(S.showreel.vimeo, S.showreel.cover, 'Showreel', false,
      '<span>SHOWREEL 2026</span><span>' + esc(S.showreel.length) + '</span>');

    // Work grid with filters
    var cat = 'All';
    var filters = $('#filters');
    var names = ['All'].concat(S.categories.filter(function (c) {
      return S.projects.some(function (p) { return !p.vertical && p.category === c; });
    }));
    filters.innerHTML = names.map(function (n) {
      return '<button type="button" aria-pressed="' + (n === cat) + '" data-cat="' + esc(n) + '">' + esc(n) + '</button>';
    }).join('');
    function renderGrid() {
      // Vertical projects (shorts/reels) live only in the Social carousel
      var items = S.projects.filter(function (p) { return !p.vertical && (cat === 'All' || p.category === cat); });
      $('#grid').innerHTML = items.map(projectCard).join('');
      var n = items.length;
      $('#count').textContent = (n < 10 ? '0' + n : n) + (n === 1 ? ' PROJECT' : ' PROJECTS');
    }
    filters.addEventListener('click', function (e) {
      var b = e.target.closest('button');
      if (!b) return;
      cat = b.getAttribute('data-cat');
      filters.querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-pressed', x === b); });
      renderGrid();
    });
    renderGrid();

    // Vertical carousel
    var vids = verticalVideos();
    var rail = $('#rail');
    rail.innerHTML = vids.map(function (v, i) {
      return '<button type="button" class="reel" role="listitem" data-i="' + i + '">' +
        '<div class="frame">' +
        (v.img ? '<img src="' + esc(v.img) + '" alt="' + esc(v.title) + '" loading="lazy">' : '<img src="' + esc(cover(v.project)) + '" alt="' + esc(v.title) + '" data-vimeo-thumb="' + esc(v.vimeo) + '">') +
        '<span class="mini-play">' + PLAY_SM + '</span></div>' +
        '<div class="reel-title">' + esc(v.title) + '</div><div class="reel-client">' + esc(v.client) + '</div></button>';
    }).join('');
    rail.addEventListener('click', function (e) {
      var b = e.target.closest('.reel');
      if (!b) return;
      var v = vids[+b.getAttribute('data-i')];
      openVideo(v.vimeo, true, esc(v.title) + ' · <a href="project.html?p=' + encodeURIComponent(v.project.slug) + '">Project details</a>');
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

    // Before / after with tabs
    var baWrap = $('#ba');
    var tabs = $('#ba-tabs');
    function showPair(i) {
      baWrap.innerHTML = baHTML(S.beforeAfter[i], 'ba-range');
      wireBA(baWrap);
      tabs.querySelectorAll('button').forEach(function (b, j) { b.setAttribute('aria-pressed', i === j); });
    }
    tabs.innerHTML = S.beforeAfter.map(function (p, i) {
      return '<button type="button" aria-pressed="false" data-i="' + i + '">' + esc(p.label) + '</button>';
    }).join('');
    tabs.addEventListener('click', function (e) {
      var b = e.target.closest('button');
      if (b) showPair(+b.getAttribute('data-i'));
    });
    showPair(0);

    // Clients
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
        (w.reels.length ? '<div class="brand-reels">' + w.reels.map(function (v, i) {
          return '<button type="button" class="reel" data-i="' + i + '"><div class="frame">' +
            (v.img ? '<img src="' + esc(v.img) + '" alt="' + esc(v.title) + '" loading="lazy">' : '<img src="' + esc(cover(v.project)) + '" alt="' + esc(v.title) + '" data-vimeo-thumb="' + esc(v.vimeo) + '">') +
            '<span class="mini-play">' + PLAY_SM + '</span></div>' +
            '<div class="reel-title">' + esc(v.title) + '</div></button>';
        }).join('') + '</div>' : '');
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
      var v = brandReels[+r.getAttribute('data-i')];
      openVideo(v.vimeo, true, esc(v.title) + ' · <a href="project.html?p=' + encodeURIComponent(v.project.slug) + '">Project details</a>');
    });

    // Reviews
    var big = S.reviews.filter(function (r) { return r.featured; })[0] || S.reviews[0];
    $('#review-big').innerHTML = '<blockquote>“' + esc(big.text) + '”</blockquote>' +
      '<figcaption>' + esc(big.job) + ' · 5.0 · ' + esc(big.year) + '</figcaption>';
    $('#reviews').innerHTML = S.reviews.filter(function (r) { return r !== big; }).map(function (r) {
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
    var nextP = S.projects[(idx + 1) % S.projects.length];
    document.title = p.title + ' — ' + S.name;

    var out = [];
    out.push('<section class="wrap p-head"><p class="eyebrow">' + esc(p.category.toUpperCase()) + '</p>' +
      '<h1>' + esc(p.title) + '</h1>' + (p.subtitle ? '<p class="sub">' + esc(p.subtitle) + '</p>' : '') + '</section>');

    out.push('<section class="wrap p-video' + (p.vertical ? ' is-vertical' : '') + '" aria-label="Video">' +
      playerHTML(p.vimeo, cover(p), p.title, p.vertical) + '</section>');

    var info = [['Client', p.client], ['Role', p.role], ['Format', p.format], ['Length', p.length]]
      .filter(function (r) { return r[1]; });
    out.push('<section class="wrap" style="padding-top:56px" aria-label="Project details"><dl class="info">' +
      info.map(function (r) { return '<div><dt>' + r[0] + '</dt><dd>' + esc(r[1]) + '</dd></div>'; }).join('') + '</dl></section>');

    if (p.brief || p.did) {
      out.push('<section class="wrap texts" style="padding-top:72px" aria-label="About the project">' +
        (p.brief ? '<div><h2>The brief</h2><p>' + esc(p.brief) + '</p></div>' : '') +
        (p.did ? '<div><h2>What I did</h2><p>' + esc(p.did) + '</p></div>' : '') + '</section>');
    }

    if (p.versions && p.versions.length) {
      out.push('<section class="wrap section" aria-labelledby="v-title"><p class="eyebrow">MORE VIDEOS</p>' +
        '<h2 id="v-title" class="h2" style="margin-bottom:28px">' + (p.versions.length > 1 ? 'More from this project' : 'Another version') + '</h2>' +
        '<div class="versions" role="list">' + p.versions.map(function (v, i) {
          return '<button type="button" class="reel" role="listitem" data-i="' + i + '" style="flex:none">' +
            '<div class="frame">' + (v.cover ? '<img src="' + esc(v.cover) + '" alt="' + esc(v.title) + '" loading="lazy">' : '<img src="' + esc(cover(p)) + '" alt="' + esc(v.title) + '" data-vimeo-thumb="' + esc(v.vimeo) + '">') +
            '<span class="mini-play">' + PLAY_SM + '</span></div><div class="reel-title">' + esc(v.title) + '</div></button>';
        }).join('') + '</div></section>');
    }

    if (p.frames && p.frames.length) {
      out.push('<section class="wrap section" aria-labelledby="f-title"><p class="eyebrow">STILLS</p>' +
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
      '<span><span class="eyebrow" style="display:block;margin:0">NEXT PROJECT</span><span class="big">' + esc(nextP.title) + '</span></span>' +
      '<svg aria-hidden="true" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a></section>');

    var main = $('#project');
    main.innerHTML = out.join('');
    main.querySelectorAll('.versions .reel').forEach(function (b) {
      b.addEventListener('click', function () {
        var v = p.versions[+b.getAttribute('data-i')];
        openVideo(v.vimeo, true, esc(v.title));
      });
    });
    wirePlayers(main);
    fillThumbs(main);
  }

  // Shared bits
  document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
  if (document.body.getAttribute('data-page') === 'project') project(); else home();
})();
