    /* ═══════════════════════════════════════════════
       THEME ENGINE — presets, accent, avatar, font,
       brutalism mode, grid. Saved in localStorage.
    ═══════════════════════════════════════════════ */
    (function () {
      var THEME_KEY = 'crii_theme';

      // Presets: accent color + matching avatar image.
      // The brownish theme uses pfp2.jpe (accent #232d24 is auto-derived).
      var THEMES = [
        { id: 'brutal', name: 'BRUTAL', accent: '#FF6B00', avatar: 'assets/pfp.png' },
        { id: 'ember', name: 'EMBERTONE', accent: '#8B5A2B', avatar: 'assets/pfp2.jpe' },
        { id: 'forest', name: 'FOREST', accent: '#232d24', avatar: 'assets/pfp2.jpe' },
        { id: 'ocean', name: 'OCEAN', accent: '#0E639C', avatar: 'assets/pfp.png' },
        { id: 'violet', name: 'VIOLET', accent: '#7C3AED', avatar: 'assets/pfp.png' },
        { id: 'rose', name: 'ROSE', accent: '#E11D48', avatar: 'assets/pfp.png' },
        { id: 'lime', name: 'LIME', accent: '#84CC16', avatar: 'assets/pfp.png' },
        { id: 'midnight', name: 'MIDNIGHT', accent: '#1E293B', avatar: 'assets/pfp.png' }
      ];

      var AVATARS = ['assets/pfp.png', 'assets/pfp2.jpe'];

      var FONTS = [
        { id: '', name: 'GROTESK' },
        { id: 'mono', name: 'MONO' },
        { id: 'serif', name: 'SERIF' },
        { id: 'round', name: 'ROUND' }
      ];

      var MODES = [
        { id: '', name: 'SHARP' },
        { id: 'soft', name: 'SOFT' },
        { id: 'rounded', name: 'ROUNDED' },
        { id: 'shadow', name: 'SHADOW' },
        { id: 'glow', name: 'GLOW' },
        { id: 'neon', name: 'NEON' }
      ];

      var GRIDS = [
        { id: '', name: 'NONE' },
        { id: 'subtle', name: 'SUBTLE' },
        { id: 'strong', name: 'STRONG' },
        { id: 'dotted', name: 'DOTTED' },
        { id: 'lines', name: 'LINES' }
      ];

      var ACCENTS = ['#FF6B00', '#8B5A2B', '#232d24', '#0E639C', '#7C3AED', '#E11D48', '#84CC16', '#F59E0B', '#0EA5E9', '#14B8A6', '#1E293B', '#FF2D55'];

      var state = { accent: '#FF6B00', avatar: 'assets/pfp.png', font: '', mode: '', grid: '' };
      var built = false;

      function load() {
        try {
          var raw = localStorage.getItem(THEME_KEY);
          if (raw) {
            var saved = JSON.parse(raw);
            Object.keys(state).forEach(function (k) {
              if (typeof saved[k] === 'string') state[k] = saved[k];
            });
          }
        } catch (e) { /* corrupted state — fall back to defaults */ }
        // Guard: preset accent must use its paired avatar
        for (var i = 0; i < THEMES.length; i++) {
          if (THEMES[i].accent.toLowerCase() === state.accent.toLowerCase() && THEMES[i].avatar) {
            if (!localStorage.getItem(THEME_KEY + '_avatar_override')) state.avatar = THEMES[i].avatar;
            break;
          }
        }
      }

      function save() {
        try { localStorage.setItem(THEME_KEY, JSON.stringify(state)); } catch (e) { }
      }

      function hexToRgb(hex) {
        var h = hex.replace('#', '');
        if (h.length === 3) h = h.split('').map(function (c) { return c + c; }).join('');
        var n = parseInt(h, 16);
        return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
      }

      function mix(hex, target, amount) {
        var c = hexToRgb(hex);
        var t = hexToRgb(target);
        var r = Math.round(c.r + (t.r - c.r) * amount);
        var g = Math.round(c.g + (t.g - c.g) * amount);
        var b = Math.round(c.b + (t.b - c.b) * amount);
        return '#' + [r, g, b].map(function (v) {
          return v.toString(16).padStart(2, '0');
        }).join('');
      }

      function apply() {
        var root = document.documentElement;
        root.setAttribute('data-theme-accent', 'true');
        root.style.setProperty('--theme-accent', state.accent);
        root.style.setProperty('--theme-accent-d', mix(state.accent, '#000000', 0.28));
        root.style.setProperty('--theme-accent-l', mix(state.accent, '#FFFFFF', 0.32));
        root.setAttribute('data-theme-font', state.font || '');
        root.setAttribute('data-theme-mode', state.mode || '');
        root.setAttribute('data-theme-grid', state.grid || '');
        document.querySelectorAll('[data-theme-avatar]').forEach(function (img) {
          img.src = state.avatar;
        });
        syncUI();
      }

      function set(patch) {
        var k;
        for (k in patch) if (patch.hasOwnProperty(k)) state[k] = patch[k];
        save();
        apply();
      }

      function chip(label, id, active, groupName) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'theme-chip' + (active ? ' active' : '');
        b.textContent = label;
        b.dataset.val = id;
        b.dataset.group = groupName;
        return b;
      }

      function group(parent, label, items, getActive, onChange) {
        var g = document.createElement('div');
        g.className = 'theme-group';
        var l = document.createElement('div');
        l.className = 'theme-group-label';
        l.textContent = label;
        g.appendChild(l);
        var wrap = document.createElement('div');
        wrap.className = 'theme-chips';
        items.forEach(function (it) {
          var c = chip(it.name, it.id, getActive() === it.id, label);
          c.onclick = function () { onChange(it.id); };
          wrap.appendChild(c);
        });
        g.appendChild(wrap);
        parent.appendChild(g);
      }

      function build() {
        if (built) return;
        built = true;

        var overlay = document.createElement('div');
        overlay.className = 'theme-overlay';
        overlay.id = 'theme-overlay';
        overlay.onclick = toggle;
        document.body.appendChild(overlay);

        var fab = document.createElement('button');
        fab.type = 'button';
        fab.className = 'theme-fab';
        fab.id = 'theme-fab';
        fab.setAttribute('aria-label', 'Customize style');
        fab.title = 'Customize style';
        fab.innerHTML = '<i class="fa-solid fa-palette"></i>';
        fab.onclick = toggle;
        document.body.appendChild(fab);

        var panel = document.createElement('aside');
        panel.className = 'theme-panel';
        panel.id = 'theme-panel';
        panel.setAttribute('aria-label', 'Style panel');

        var header = document.createElement('div');
        header.className = 'theme-panel-header';
        var title = document.createElement('div');
        title.className = 'theme-panel-title';
        title.innerHTML = '<span>//</span> STYLE ENGINE';
        var close = document.createElement('button');
        close.type = 'button';
        close.className = 'theme-close';
        close.setAttribute('aria-label', 'Close style panel');
        close.innerHTML = '<i class="fa-solid fa-xmark"></i>';
        close.onclick = toggle;
        header.appendChild(title);
        header.appendChild(close);
        panel.appendChild(header);

        // Presets
        var pg = document.createElement('div');
        pg.className = 'theme-group';
        var pl = document.createElement('div');
        pl.className = 'theme-group-label';
        pl.textContent = 'PRESETS';
        pg.appendChild(pl);
        var pw = document.createElement('div');
        pw.className = 'theme-chips';
        THEMES.forEach(function (t) {
          var c = chip(t.name, t.id, state.accent.toLowerCase() === t.accent.toLowerCase(), 'PRESETS');
          c.onclick = function () {
            set({ accent: t.accent, avatar: t.avatar });
            localStorage.removeItem(THEME_KEY + '_avatar_override');
          };
          pw.appendChild(c);
        });
        pg.appendChild(pw);
        panel.appendChild(pg);

        // Avatar
        var ag = document.createElement('div');
        ag.className = 'theme-group';
        var al = document.createElement('div');
        al.className = 'theme-group-label';
        al.textContent = 'PROFILE PICTURE';
        ag.appendChild(al);
        var preview = document.createElement('div');
        preview.className = 'theme-avatar-preview';
        var pimg = document.createElement('img');
        pimg.src = state.avatar;
        pimg.alt = 'Profile picture preview';
        var pname = document.createElement('span');
        pname.id = 'theme-avatar-name';
        pname.textContent = state.avatar.replace('assets/', '');
        preview.appendChild(pimg);
        preview.appendChild(pname);
        ag.appendChild(preview);
        var aw = document.createElement('div');
        aw.className = 'theme-chips';
        AVATARS.forEach(function (a) {
          var c = chip(a.replace('assets/', '').toUpperCase(), a, state.avatar === a, 'AVATAR');
          c.onclick = function () {
            set({ avatar: a });
            localStorage.setItem(THEME_KEY + '_avatar_override', '1');
          };
          aw.appendChild(c);
        });
        ag.appendChild(aw);
        panel.appendChild(ag);

        // Accent color
        var cg = document.createElement('div');
        cg.className = 'theme-group';
        var cl = document.createElement('div');
        cl.className = 'theme-group-label';
        cl.textContent = 'ACCENT COLOR';
        cg.appendChild(cl);
        var sw = document.createElement('div');
        sw.className = 'theme-swatches';
        ACCENTS.forEach(function (hex) {
          var s = document.createElement('button');
          s.type = 'button';
          s.className = 'theme-swatch' + (state.accent.toLowerCase() === hex.toLowerCase() ? ' active' : '');
          s.style.background = hex;
          s.dataset.val = hex;
          s.setAttribute('aria-label', 'Accent ' + hex);
          s.innerHTML = '<span class="swatch-check"><i class="fa-solid fa-check"></i></span>';
          s.onclick = function () { set({ accent: hex }); };
          sw.appendChild(s);
        });
        cg.appendChild(sw);
        panel.appendChild(cg);

        // Font, mode, grid
        group(panel, 'FONT', FONTS, function () { return state.font; }, function (id) { set({ font: id }); });
        group(panel, 'BRUTALISM', MODES, function () { return state.mode; }, function (id) { set({ mode: id }); });
        group(panel, 'GRID', GRIDS, function () { return state.grid; }, function (id) { set({ grid: id }); });

        // Reset
        var reset = document.createElement('button');
        reset.type = 'button';
        reset.className = 'theme-reset';
        reset.textContent = '↺ RESET TO DEFAULT';
        reset.onclick = function () {
          localStorage.removeItem(THEME_KEY);
          localStorage.removeItem(THEME_KEY + '_avatar_override');
          state = { accent: '#FF6B00', avatar: 'assets/pfp.png', font: '', mode: '', grid: '' };
          apply();
        };
        panel.appendChild(reset);

        document.body.appendChild(panel);
      }

      function syncUI() {
        if (!built) return;
        var panel = document.getElementById('theme-panel');
        if (!panel) return;

        // Preset chips: active when accent matches
        panel.querySelectorAll('.theme-chip[data-group="PRESETS"]').forEach(function (c) {
          var match = false;
          for (var i = 0; i < THEMES.length; i++) {
            if (THEMES[i].name === c.textContent && THEMES[i].accent.toLowerCase() === state.accent.toLowerCase()) {
              match = true;
              break;
            }
          }
          c.classList.toggle('active', match);
        });

        // Font / mode / grid chips
        panel.querySelectorAll('.theme-chip[data-group="FONT"]').forEach(function (c) {
          c.classList.toggle('active', c.dataset.val === state.font);
        });
        panel.querySelectorAll('.theme-chip[data-group="BRUTALISM"]').forEach(function (c) {
          c.classList.toggle('active', c.dataset.val === state.mode);
        });
        panel.querySelectorAll('.theme-chip[data-group="GRID"]').forEach(function (c) {
          c.classList.toggle('active', c.dataset.val === state.grid);
        });

        // Avatar chips
        panel.querySelectorAll('.theme-chip[data-group="AVATAR"]').forEach(function (c) {
          c.classList.toggle('active', c.dataset.val === state.avatar);
        });

        // Accent swatches
        panel.querySelectorAll('.theme-swatch').forEach(function (s) {
          s.classList.toggle('active', s.dataset.val.toLowerCase() === state.accent.toLowerCase());
        });

        // Avatar preview
        var pimg = panel.querySelector('.theme-avatar-preview img');
        if (pimg) pimg.src = state.avatar;
        var pname = document.getElementById('theme-avatar-name');
        if (pname) pname.textContent = state.avatar.replace('assets/', '');
      }

      function toggle() {
        var panel = document.getElementById('theme-panel');
        var overlay = document.getElementById('theme-overlay');
        if (!panel) return;
        var open = panel.classList.toggle('open');
        if (overlay) overlay.classList.toggle('open', open);
      }

      function init() {
        load();
        build();
        apply();
      }

      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
      } else {
        init();
      }
    })();
