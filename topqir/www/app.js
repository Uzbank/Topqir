(function () {
  "use strict";

  /* ---------- storage ---------- */
  const store = {
    get(k, d) { try { const v = localStorage.getItem("topqir." + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem("topqir." + k, JSON.stringify(v)); } catch (e) {} }
  };

  /* ---------- Uzbek Cyrillic -> Latin ---------- */
  const MAP = { "а":"a","б":"b","в":"v","г":"g","д":"d","ё":"yo","ж":"j","з":"z","и":"i","й":"y","к":"k","л":"l","м":"m","н":"n","о":"o","п":"p","р":"r","с":"s","т":"t","у":"u","ф":"f","х":"x","ц":"ts","ч":"ch","ш":"sh","щ":"sh","ъ":"’","ы":"i","ь":"","э":"e","ю":"yu","я":"ya","ў":"o‘","қ":"q","ғ":"g‘","ҳ":"h" };
  const VOW = "аеёиоуэюяўыъь";
  function toLatin(s) {
    s = s.replace(/цц/g, "ц").replace(/ЦЦ/g, "Ц");
    let out = "";
    for (let i = 0; i < s.length; i++) {
      const ch = s[i], lo = ch.toLowerCase();
      let m;
      if (lo === "е") {
        const prev = i > 0 ? s[i - 1].toLowerCase() : "";
        m = (!prev || !/[а-яёўқғҳ]/.test(prev) || VOW.includes(prev)) ? "ye" : "e";
      } else m = MAP[lo];
      if (m === undefined) { out += ch; continue; }
      if (ch !== lo && m) {
        const next = s[i + 1];
        const nextUpper = next && next !== next.toLowerCase();
        m = nextUpper ? m.toUpperCase() : m[0].toUpperCase() + m.slice(1);
      }
      out += m;
    }
    return out;
  }

  /* ---------- strings ---------- */
  const T = {
    uz: {
      tagline: "Сўзни топ! Бутун оила учун ўйин",
      chooseDecks: "Тўпламни танланг",
      chooseDecksSub: "Бир нечтасини бирга танлаш мумкин",
      toSetup: n => n ? `Давом этиш · ${n} тўплам` : "Тўплам танланг",
      words: n => `${n} сўз`,
      myDeck: "Ўз тўпламимни яратиш",
      back: "Орқага",
      setupTitle: "Ўйин созламалари",
      time: "Раунд вақти",
      mode: "Усул",
      mExplain: "Тушунтириш", mShow: "Кўрсатиш", mMix: "Аралаш",
      noteExplain: "Сўзни бошқа сўзлар билан тушунтиринг. Ўша сўзнинг ўзини айтиш мумкин эмас.",
      noteShow: "Сўзсиз, фақат ишоралар ва ҳаракат билан кўрсатинг.",
      noteMix: "Ҳар сўзда вазифа ўзгаради: тушунтириш, кўрсатиш ёки ашула билан.",
      teams: "Жамоалар",
      addTeam: "Жамоа қўшиш",
      teamN: n => `${n}-жамоа`,
      rounds: "Ҳар жамоага раундлар сони",
      summary: (t, r, s) => `<b>${t}</b> жамоа, ҳар бири <b>${r}</b> марта ўйнайди. Бир раунд — <b>${s}</b> сония.`,
      startGame: "Ўйинни бошлаш",
      turnOf: "Навбат",
      roundOf: (a, b) => `${a}-раунд, жами ${b}`,
      how1: "Тахмин қилувчи телефонни пешонасига қўяди, экранга қарамайди",
      how2: "Тўғри топса — телефонни пастга эгади",
      how3: "Ўтказиб юбориш учун — тепага эгади",
      ready: "Тайёрмиз",
      endGame: "Ўйинни тугатиш",
      putOnForehead: "Телефонни пешонангизга қўйинг",
      tapSkip: "‹ Ўтказиш", tapOk: "Топдим ›",
      badgeExplain: "🗣 Тушунтиринг", badgeShow: "🤐 Сўзсиз кўрсатинг", badgeSing: "🎵 Ашула билан",
      flashOk: "Топдингиз!", flashSkip: "Ўтказилди", flashEnd: "Вақт тугади!",
      rotate: "Телефонни ёнбош буринг",
      rotateSkip: "Тугмалар билан ўйнаш",
      noSensor: "Эгиш датчиги топилмади — экранни босиб ўйнанг",
      resTxt: n => `та сўз топилди`,
      fixHint: "Хато белгиланган бўлса, сўзни босиб тузатинг",
      continue: "Давом этиш",
      score: "Ҳисоб",
      nextTurn: t => `Навбат: ${t}`,
      winner: t => `Ғолиб — ${t}!`,
      draw: "Дуранг!",
      total: "Сизнинг натижангиз",
      newGame: "Яна ўйнаш",
      home: "Бош саҳифа",
      afterRound: (a, b) => `${a}-раунд ${b} тадан ўтди`,
      final: "Ўйин тугади",
      newDeck: "Янги тўплам", editDeck: "Тўпламни таҳрирлаш",
      deckName: "Тўплам номи",
      deckIcon: "Белги",
      deckWords: "Сўзлар — ҳар қаторга биттадан",
      wordsPh: "Масалан:\nБувим\nДача\nЧорсу\nПалов",
      save: "Сақлаш", delete: "Ўчириш",
      errName: "Тўплам номини ёзинг",
      errWords: "Камида 5 та сўз киритинг",
      saved: "Тўплам сақланди", deleted: "Тўплам ўчирилди",
      confirmDelete: "Бу тўпламни ўчирасизми?",
      confirmQuit: "Раунддан чиқасизми? Бу раунд ҳисобланмайди.",
      confirmEnd: "Ўйинни тугатасизми?",
      rulesTitle: "Қандай ўйналади?",
      rules: `<p>Топқир — катта ва кичик бирга ўйнайдиган шарада ўйини. Битта телефон етарли.</p>
<ol><li>Бир ёки бир нечта тўплам танланг ва жамоаларни ёзинг.</li>
<li>Навбатдаги жамоадан бир киши телефонни экрани ташқарига қараган ҳолда пешонасига қўяди.</li>
<li>Жамоадошлари экрандаги сўзни тушунтиради, ҳаракат билан кўрсатади ёки ашула билан ишора қилади.</li>
<li>Тўғри топса — телефонни пастга эгади. Билмаса — тепага эгиб, кейинги сўзга ўтади.</li>
<li>Вақт тугагач, топилган сўзлар жамоага очко бўлиб қўшилади. Энг кўп очко йиққан жамоа ғолиб.</li></ol>
<p>Датчиги йўқ қурилмада экраннинг ўнг томонини босинг — топдим, чап томонини — ўтказиш.</p>
<p>«Ўз тўпламимни яратиш» орқали оила, синф ёки иш жойингизга хос сўзлар қўшинг.</p>`,
      yes: "Ҳа", no: "Йўқ",
      privacy: "Ўйин ҳеч қандай маълумот йиғмайди, ҳаммаси телефонингизда сақланади."
    },
    ru: {
      tagline: "Угадай слово! Игра для всей семьи",
      chooseDecks: "Выберите колоды",
      chooseDecksSub: "Можно выбрать несколько сразу",
      toSetup: n => n ? `Дальше · ${n} ${plural(n, ["колода", "колоды", "колод"])}` : "Выберите колоду",
      words: n => `${n} ${plural(n, ["слово", "слова", "слов"])}`,
      myDeck: "Создать свою колоду",
      back: "Назад",
      setupTitle: "Настройки игры",
      time: "Время раунда",
      mode: "Режим",
      mExplain: "Объяснять", mShow: "Показывать", mMix: "Смешанный",
      noteExplain: "Объясняйте слово другими словами. Однокоренные слова называть нельзя.",
      noteShow: "Без слов — только жесты и мимика, как в «Крокодиле».",
      noteMix: "Задание меняется с каждым словом: объяснить, показать или напеть.",
      teams: "Команды",
      addTeam: "Добавить команду",
      teamN: n => `Команда ${n}`,
      rounds: "Раундов на команду",
      summary: (t, r, s) => `<b>${t}</b> ${plural(t, ["команда", "команды", "команд"])}, каждая играет <b>${r}</b> ${plural(r, ["раз", "раза", "раз"])}. Раунд — <b>${s}</b> секунд.`,
      startGame: "Начать игру",
      turnOf: "Ход команды",
      roundOf: (a, b) => `Раунд ${a} из ${b}`,
      how1: "Угадывающий прикладывает телефон ко лбу и не смотрит на экран",
      how2: "Угадал — наклоните телефон вниз",
      how3: "Пропустить — наклоните вверх",
      ready: "Мы готовы",
      endGame: "Закончить игру",
      putOnForehead: "Приложите телефон ко лбу",
      tapSkip: "‹ Пропуск", tapOk: "Угадал ›",
      badgeExplain: "🗣 Объясните", badgeShow: "🤐 Покажите без слов", badgeSing: "🎵 Напойте",
      flashOk: "Угадано!", flashSkip: "Пропуск", flashEnd: "Время вышло!",
      rotate: "Поверните телефон горизонтально",
      rotateSkip: "Играть кнопками",
      noSensor: "Датчик наклона не найден — играйте нажатиями",
      resTxt: n => plural(n, ["слово угадано", "слова угадано", "слов угадано"]),
      fixHint: "Ошиблись? Нажмите на слово, чтобы исправить",
      continue: "Продолжить",
      score: "Счёт",
      nextTurn: t => `Ход: ${t}`,
      winner: t => `Победила ${t}!`,
      draw: "Ничья!",
      total: "Ваш результат",
      newGame: "Играть снова",
      home: "На главную",
      afterRound: (a, b) => `Сыграно раундов: ${a} из ${b}`,
      final: "Игра окончена",
      newDeck: "Новая колода", editDeck: "Редактировать колоду",
      deckName: "Название колоды",
      deckIcon: "Значок",
      deckWords: "Слова — по одному в строке",
      wordsPh: "Например:\nБабушка\nДача\nЧорсу\nПлов",
      save: "Сохранить", delete: "Удалить",
      errName: "Введите название колоды",
      errWords: "Введите минимум 5 слов",
      saved: "Колода сохранена", deleted: "Колода удалена",
      confirmDelete: "Удалить эту колоду?",
      confirmQuit: "Выйти из раунда? Он не будет засчитан.",
      confirmEnd: "Закончить игру?",
      rulesTitle: "Как играть?",
      rules: `<p>Топқир — игра в шарады для взрослых и детей. Нужен всего один телефон.</p>
<ol><li>Выберите одну или несколько колод и впишите команды.</li>
<li>Игрок команды, чей ход, прикладывает телефон ко лбу экраном наружу.</li>
<li>Товарищи по команде объясняют слово, показывают его жестами или напевают.</li>
<li>Угадал — наклоните телефон вниз. Не знает — наклоните вверх, чтобы пропустить.</li>
<li>Когда время выйдет, угаданные слова становятся очками команды. Побеждает команда с наибольшим счётом.</li></ol>
<p>Если в устройстве нет датчика, нажимайте на правую половину экрана — угадал, на левую — пропуск.</p>
<p>Через «Создать свою колоду» добавьте слова про вашу семью, класс или работу.</p>`,
      yes: "Да", no: "Нет",
      privacy: "Игра не собирает никаких данных — всё хранится на вашем телефоне."
    }
  };
  function plural(n, f) { const a = n % 10, b = n % 100; return a === 1 && b !== 11 ? f[0] : a >= 2 && a <= 4 && (b < 10 || b >= 20) ? f[1] : f[2]; }

  let S = store.get("settings", null) || {
    lang: (navigator.language || "").toLowerCase().startsWith("ru") ? "ru" : "uz",
    time: 60, mode: "explain", rounds: 3, sound: true, selected: ["animals", "food", "kids"], teams: null
  };
  let custom = store.get("custom", []);
  let used = store.get("used", {});
  const save = () => store.set("settings", S);

  const base = () => (S.lang === "ru" ? "ru" : "uz");
  const lat = () => S.lang === "uzl";
  function t(key, ...a) {
    let v = T[base()][key];
    if (typeof v === "function") v = v(...a);
    if (v == null) return key;
    return lat() ? latinHTML(v) : v;
  }
  function latinHTML(s) { return s.split(/(<[^>]+>)/).map(p => (p.startsWith("<") ? p : toLatin(p))).join(""); }
  const L = s => (lat() ? toLatin(s) : s);

  const $ = s => document.querySelector(s);
  const $$ = s => Array.from(document.querySelectorAll(s));
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  /* ---------- atlas (ikat) pattern ---------- */
  function ikat(bg, c1, c2, w, h) {
    w = w || 60; h = h || 90;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 60 90">` +
      `<defs><filter id="f" x="-10%" y="-10%" width="120%" height="120%"><feTurbulence type="fractalNoise" baseFrequency="0.015 0.55" numOctaves="2" seed="4"/>` +
      `<feDisplacementMap in="SourceGraphic" scale="10" xChannelSelector="R" yChannelSelector="B"/></filter></defs>` +
      `<rect width="60" height="90" fill="${bg}"/><g filter="url(#f)">` +
      `<path d="M30 2 L54 45 L30 88 L6 45Z" fill="${c1}"/><path d="M30 20 L44 45 L30 70 L16 45Z" fill="${bg}"/>` +
      `<path d="M30 33 L37 45 L30 57 L23 45Z" fill="${c2}"/><path d="M-2 0 L7 45 L-2 90Z M62 0 L53 45 L62 90Z" fill="${c2}"/>` +
      `<rect x="28" y="-4" width="4" height="10" fill="${c2}"/><rect x="28" y="84" width="4" height="10" fill="${c2}"/></g></svg>`;
    return `url('data:image/svg+xml;utf8,${encodeURIComponent(svg)}')`;
  }

  /* ---------- decks ---------- */
  const PALETTE = ["#E2266F", "#12A47A", "#2FB4E0", "#7B4DFF", "#F2552C", "#0E9AA7"];
  function allDecks() {
    const b = base();
    const builtin = window.TOPQIR_DECKS.map(d => ({ id: d.id, emoji: d.emoji, color: d.color, accent: d.accent, dark: !!d.dark, name: L(d.name[b]), words: d.words[b].map(L), custom: false }));
    const mine = custom.map((d, i) => ({ id: d.id, emoji: d.emoji, color: PALETTE[i % PALETTE.length], accent: "#FFB81C", dark: false, name: d.name, words: d.words, custom: true }));
    return builtin.concat(mine);
  }
  const deckById = id => allDecks().find(d => d.id === id);

  /* ---------- UI text ---------- */
  function applyText() {
    document.documentElement.lang = S.lang === "ru" ? "ru" : "uz";
    $$("[data-t]").forEach(el => { el.innerHTML = t(el.dataset.t); });
    $("#heroAtlas").style.backgroundImage = ikat("#1C1348", "#E2266F", "#FFB81C");
    $$("#langSeg button").forEach(b => b.setAttribute("aria-pressed", b.dataset.lang === S.lang));
    $("#soundBtn").textContent = S.sound ? "🔊" : "🔇";
    renderDecks();
  }

  function renderDecks() {
    const decks = allDecks();
    S.selected = S.selected.filter(id => decks.some(d => d.id === id));
    const g = $("#deckGrid");
    g.innerHTML = decks.map(d => `
      <button class="deck" data-id="${d.id}" aria-pressed="${S.selected.includes(d.id)}">
        <div class="strip" style="background-image:${ikat(d.color, d.accent, "#FBF8FF", 40, 60)}"></div>
        <div class="body"><div class="emo">${d.emoji}</div><div class="nm">${esc(d.name)}</div><div class="ct">${t("words", d.words.length)}</div></div>
        <span class="tick" aria-hidden="true">✓</span>
        ${d.custom ? `<span class="edit" data-edit="${d.id}" role="button" aria-label="edit">✎</span>` : ""}
      </button>`).join("") +
      `<button class="deck add" id="addDeck"><b>+</b>${t("myDeck")}</button>`;
    updateDock();
  }
  function updateDock() {
    const n = S.selected.length;
    const b = $("#toSetup");
    b.textContent = t("toSetup", n);
    b.disabled = !n;
  }

  /* ---------- navigation ---------- */
  let current = "home";
  function go(id) {
    $$(".screen").forEach(s => s.classList.toggle("on", s.id === id));
    current = id;
    $("#toast").classList.remove("on");
    window.scrollTo(0, 0);
  }

  /* ---------- setup ---------- */
  const TEAM_COLORS = ["#E2266F", "#FFB81C", "#2FB4E0", "#12A47A", "#7B4DFF", "#F2552C"];
  function ensureTeams() { if (!S.teams || !S.teams.length) S.teams = [t("teamN", 1), t("teamN", 2)]; }
  function renderSetup() {
    ensureTeams();
    $$("#timeSeg button").forEach(b => b.setAttribute("aria-pressed", +b.dataset.v === S.time));
    $$("#modeSeg button").forEach(b => b.setAttribute("aria-pressed", b.dataset.v === S.mode));
    $("#modeNote").textContent = t({ explain: "noteExplain", show: "noteShow", mix: "noteMix" }[S.mode]);
    $("#timeSeg button[data-v='30']").textContent = S.lang === "ru" ? "30 с" : "30 с";
    $("#timeSeg button[data-v='120']").textContent = S.lang === "ru" ? "2 мин" : lat() ? "2 daq" : "2 дақ";
    ["30", "60", "90"].forEach(v => { $(`#timeSeg button[data-v='${v}']`).textContent = v + (S.lang === "ru" ? " с" : lat() ? " s" : " с"); });
    $("#teamList").innerHTML = S.teams.map((n, i) => `
      <div class="team"><span class="dot" style="background:${TEAM_COLORS[i % 6]}"></span>
      <input value="${esc(n)}" data-i="${i}" maxlength="24" aria-label="${t("teams")} ${i + 1}">
      ${S.teams.length > 1 ? `<button data-rm="${i}" aria-label="remove">×</button>` : ""}</div>`).join("");
    $("#addTeam").style.display = S.teams.length >= 6 ? "none" : "";
    $("#rVal").textContent = S.rounds;
    $("#setupSummary").innerHTML = t("summary", S.teams.length, S.rounds, S.time);
  }

  /* ---------- game ---------- */
  let G = null;
  function newGame() {
    ensureTeams();
    S.teams = S.teams.map((n, i) => n.trim() || t("teamN", i + 1));
    save();
    G = { teams: S.teams.map(n => ({ name: n, score: 0 })), turn: 0, total: S.teams.length * S.rounds, queue: buildQueue() };
    showTurn();
  }
  function buildQueue() {
    const items = [];
    S.selected.forEach(id => {
      const d = deckById(id); if (!d) return;
      const key = id + ":" + base();
      let u = new Set(used[key] || []);
      let fresh = d.words.filter(w => !u.has(w));
      if (fresh.length < Math.min(12, d.words.length)) { used[key] = []; fresh = d.words.slice(); }
      fresh.forEach(w => items.push({ w, deck: d }));
    });
    for (let i = items.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [items[i], items[j]] = [items[j], items[i]]; }
    return items;
  }
  function takeWord() {
    if (!G.queue.length) G.queue = buildQueue();
    const it = G.queue.shift();
    const key = it.deck.id + ":" + base();
    (used[key] = used[key] || []).push(it.w);
    store.set("used", used);
    return it;
  }
  function showTurn() {
    const team = G.teams[G.turn % G.teams.length];
    const r = Math.floor(G.turn / G.teams.length) + 1;
    $("#turnKicker").textContent = t("turnOf");
    $("#turnTeam").textContent = team.name;
    $("#turnTeam").style.color = TEAM_COLORS[(G.turn % G.teams.length) % 6];
    $("#turnMeta").innerHTML = `<span class="chip">${t("roundOf", r, S.rounds)}</span><span class="chip">⏱ ${S.time}</span><span class="chip">${t({ explain: "mExplain", show: "mShow", mix: "mMix" }[S.mode])}</span>`;
    go("turn");
  }

  /* ---------- native / device helpers ---------- */
  const Cap = window.Capacitor;
  const isNative = !!(Cap && Cap.isNativePlatform && Cap.isNativePlatform());
  const plug = name => { try { return isNative && Cap.registerPlugin ? Cap.registerPlugin(name) : null; } catch (e) { return null; } };
  const Haptics = plug("Haptics"), Orient = plug("ScreenOrientation"), Awake = plug("KeepAwake"), AppP = plug("App");
  let wakeLock = null;
  async function enterPlayMode() {
    try { if (Orient) await Orient.lock({ orientation: "landscape" }); } catch (e) {}
    try { if (Awake) await Awake.keepAwake(); else if (navigator.wakeLock) wakeLock = await navigator.wakeLock.request("screen"); } catch (e) {}
    if (!isNative && matchMedia("(pointer:coarse)").matches) {
      try { await document.documentElement.requestFullscreen(); await screen.orientation.lock("landscape"); } catch (e) {}
    }
  }
  async function exitPlayMode() {
    try { if (Orient) await Orient.lock({ orientation: "portrait" }); } catch (e) {}
    try { if (Awake) await Awake.allowSleep(); if (wakeLock) { wakeLock.release(); wakeLock = null; } } catch (e) {}
    if (!isNative) { try { if (screen.orientation && screen.orientation.unlock) screen.orientation.unlock(); if (document.fullscreenElement) await document.exitFullscreen(); } catch (e) {} }
  }
  function buzz(kind) {
    try {
      if (Haptics) { kind === "ok" ? Haptics.notification({ type: "SUCCESS" }) : Haptics.impact({ style: kind === "end" ? "HEAVY" : "MEDIUM" }); }
      else if (navigator.vibrate) navigator.vibrate(kind === "ok" ? [40, 40, 40] : kind === "end" ? 400 : 90);
    } catch (e) {}
  }

  /* ---------- sound ---------- */
  let AC = null;
  function tone(seq) {
    if (!S.sound) return;
    try {
      AC = AC || new (window.AudioContext || window.webkitAudioContext)();
      if (AC.state === "suspended") AC.resume();
      let tt = AC.currentTime;
      seq.forEach(([f, d, type, vol]) => {
        const o = AC.createOscillator(), g = AC.createGain();
        o.type = type || "sine"; o.frequency.value = f;
        g.gain.setValueAtTime(0.0001, tt); g.gain.exponentialRampToValueAtTime(vol || 0.25, tt + 0.015); g.gain.exponentialRampToValueAtTime(0.0001, tt + d);
        o.connect(g).connect(AC.destination); o.start(tt); o.stop(tt + d + 0.02); tt += d * 0.85;
      });
    } catch (e) {}
  }
  const SND = {
    ok: () => tone([[660, .12, "triangle"], [990, .22, "triangle"]]),
    skip: () => tone([[240, .22, "sawtooth", .12]]),
    tick: () => tone([[1200, .06, "square", .06]]),
    go: () => tone([[523, .1], [784, .18]]),
    end: () => tone([[784, .18, "triangle"], [659, .18, "triangle"], [523, .4, "triangle"]])
  };

  /* ---------- tilt sensor ---------- */
  let sensorSeen = false, lastNz = 0;
  function onOrient(e) {
    if (e.beta == null || e.gamma == null) return;
    sensorSeen = true;
    const rad = Math.PI / 180;
    lastNz = Math.cos(e.beta * rad) * Math.cos(e.gamma * rad); // +1 экран тепага, −1 экран пастга
    if (P && P.live) tiltCheck();
  }
  window.addEventListener("deviceorientation", onOrient);
  async function askMotion() {
    try {
      if (typeof DeviceOrientationEvent !== "undefined" && typeof DeviceOrientationEvent.requestPermission === "function") {
        await DeviceOrientationEvent.requestPermission();
      }
    } catch (e) {}
  }

  /* ---------- round ---------- */
  let P = null;
  const MODES = { explain: ["badgeExplain"], show: ["badgeShow"], mix: ["badgeExplain", "badgeShow", "badgeSing"] };
  async function startRound() {
    await askMotion();
    tone([[1, .01, "sine", .0001]]);
    P = { live: false, armed: false, hist: [], cur: null, deadline: 0, raf: 0, lock: true, tapsOnly: false, lastTick: -1 };
    const team = G.teams[G.turn % G.teams.length];
    $("#scoreLive").textContent = "0";
    $("#scoreLive").title = team.name;
    $("#timer").textContent = S.time; $("#timer").classList.remove("low");
    $("#word").textContent = ""; $("#modeBadge").textContent = ""; $("#deckLbl").textContent = "";
    $("#flash").className = "";
    go("play");
    await enterPlayMode();
    checkRotate();
    if (!$("#rotate").classList.contains("on")) countdown();
  }
  function checkRotate() {
    const portrait = window.innerHeight > window.innerWidth;
    const touch = matchMedia("(pointer:coarse)").matches;
    const need = portrait && touch && !(P && P.tapsOnly) && !(P && P.live);
    $("#rotate").classList.toggle("on", need);
    return need;
  }
  window.addEventListener("resize", () => {
    if (current !== "play" || !P) return;
    const was = $("#rotate").classList.contains("on");
    const now = checkRotate();
    if (was && !now && !P.live && !P.counting) countdown();
    fitWord();
  });
  function countdown() {
    if (!P || P.counting) return;
    P.counting = true;
    const cd = $("#countdown"); cd.classList.add("on");
    let n = 3; cd.querySelector(".n").textContent = n; SND.tick();
    const iv = setInterval(() => {
      n--;
      if (n <= 0) { clearInterval(iv); cd.classList.remove("on"); P.counting = false; begin(); return; }
      cd.querySelector(".n").textContent = n; SND.tick();
    }, 1000);
    P.cdIv = iv;
  }
  function begin() {
    P.live = true;
    P.deadline = performance.now() + S.time * 1000;
    SND.go();
    setTimeout(() => {
      if (P && P.live && !sensorSeen && matchMedia("(pointer:coarse)").matches) toast(t("noSensor"));
    }, 1500);
    nextWord();
    loop();
  }
  function loop() {
    if (!P || !P.live) return;
    const left = Math.max(0, P.deadline - performance.now());
    const s = Math.ceil(left / 1000);
    $("#timer").textContent = s;
    $("#timer").classList.toggle("low", s <= 5);
    if (s <= 5 && s !== P.lastTick && s > 0) { P.lastTick = s; SND.tick(); }
    if (left <= 0) { endRound(); return; }
    P.raf = requestAnimationFrame(loop);
  }
  function nextWord() {
    const it = takeWord();
    P.cur = it;
    const m = MODES[S.mode];
    const badge = m[Math.floor(Math.random() * m.length)];
    const play = $("#play");
    play.style.setProperty("--deck", it.deck.color);
    play.classList.toggle("dark", !!it.deck.dark);
    const pat = ikat(it.deck.color, it.deck.accent, it.deck.dark ? "#1C1348" : "#FBF8FF", 40, 60);
    $("#edgeL").style.backgroundImage = pat; $("#edgeR").style.backgroundImage = pat;
    $("#modeBadge").textContent = t(badge);
    $("#word").textContent = it.w;
    $("#deckLbl").textContent = it.deck.emoji + " " + it.deck.name;
    fitWord();
    P.lock = false;
    P.armed = Math.abs(lastNz) < 0.45 || !sensorSeen;
  }
  function fitWord() {
    const w = $("#word"); if (!w.textContent) return;
    const box = $("#stage");
    const maxW = box.clientWidth - 150, maxH = box.clientHeight * 0.55;
    let size = Math.min(140, Math.max(36, window.innerHeight * 0.26));
    w.style.fontSize = size + "px";
    let guard = 40;
    while ((w.scrollWidth > maxW || w.offsetHeight > maxH) && size > 26 && guard--) { size *= 0.9; w.style.fontSize = size + "px"; }
  }
  function tiltCheck() {
    if (!P.live || P.lock) return;
    if (!P.armed) { if (Math.abs(lastNz) < 0.4) P.armed = true; return; }
    if (lastNz < -0.62) mark(true);
    else if (lastNz > 0.62) mark(false);
  }
  function mark(ok) {
    if (!P || !P.live || P.lock || !P.cur) return;
    P.lock = true;
    P.hist.push({ w: P.cur.w, ok });
    $("#scoreLive").textContent = P.hist.filter(h => h.ok).length;
    const f = $("#flash");
    f.className = "on " + (ok ? "ok" : "skip");
    f.querySelector(".big").textContent = t(ok ? "flashOk" : "flashSkip");
    f.querySelector(".small").textContent = P.cur.w;
    ok ? SND.ok() : SND.skip();
    buzz(ok ? "ok" : "skip");
    P.cur = null;
    setTimeout(() => {
      if (!P || !P.live) return;
      f.className = "";
      nextWord();
    }, 750);
  }
  function endRound() {
    P.live = false;
    cancelAnimationFrame(P.raf);
    const f = $("#flash");
    f.className = "on end";
    f.querySelector(".big").textContent = t("flashEnd");
    f.querySelector(".small").textContent = "";
    SND.end(); buzz("end");
    setTimeout(async () => { await exitPlayMode(); showResults(); }, 1600);
  }
  async function abortRound() {
    if (!P) return;
    P.live = false; cancelAnimationFrame(P.raf); clearInterval(P.cdIv);
    $("#countdown").classList.remove("on"); $("#flash").className = "";
    P = null;
    await exitPlayMode();
    showTurn();
  }

  /* ---------- results & score ---------- */
  function showResults() {
    renderResults();
    go("results");
  }
  function renderResults() {
    const n = P.hist.filter(h => h.ok).length;
    $("#resNum").textContent = n;
    $("#resTxt").textContent = t("resTxt", n);
    $("#resList").innerHTML = P.hist.length ? P.hist.map((h, i) => `
      <button class="res-item ${h.ok ? "ok" : "no"}" data-i="${i}"><span class="mk">${h.ok ? "✓" : "–"}</span><span>${esc(h.w)}</span></button>`).join("") : "";
    $(".hint").style.display = P.hist.length ? "" : "none";
  }
  function finishTurn() {
    const team = G.teams[G.turn % G.teams.length];
    team.score += P.hist.filter(h => h.ok).length;
    P = null;
    G.turn++;
    showScore();
  }
  function showScore() {
    const done = G.turn >= G.total;
    const sorted = G.teams.map((tm, i) => ({ ...tm, i })).sort((a, b) => b.score - a.score);
    const top = sorted[0].score;
    $("#scoreTitle").textContent = done ? t("final") : t("score");
    $("#scoreSub").textContent = done ? "" : t("roundOf", Math.ceil(G.turn / G.teams.length), S.rounds);
    let head = "";
    if (done) {
      if (G.teams.length === 1) head = `<p class="sub" style="text-align:center;margin:0">${t("total")}</p><div class="winner">${top}</div>`;
      else {
        const leaders = sorted.filter(x => x.score === top);
        head = `<div class="winner">${leaders.length > 1 ? t("draw") : esc(t("winner", leaders[0].name))}</div>`;
      }
    }
    $("#board").innerHTML = head + sorted.map((tm, k) => `
      <div class="row ${tm.score === top && top > 0 ? "lead" : ""}"><span class="pl">${k + 1}</span>
      <span class="tn"><span class="dot" style="width:12px;height:12px;border-radius:50%;flex:none;background:${TEAM_COLORS[tm.i % 6]}"></span><span>${esc(tm.name)}</span></span>
      <span class="pts">${tm.score}</span></div>`).join("");
    $("#scoreNext").textContent = done ? t("newGame") : t("nextTurn", G.teams[G.turn % G.teams.length].name);
    $("#scoreNext").dataset.done = done ? "1" : "";
    go("score");
  }

  /* ---------- editor ---------- */
  const EMOJIS = ["⭐", "🎯", "🎬", "🎵", "🧠", "🏫", "💼", "🎉", "🐾", "🍕", "👨‍👩‍👧‍👦", "🌍"];
  let editing = null, edEmoji = "⭐";
  function openEditor(id) {
    editing = id ? custom.find(d => d.id === id) : null;
    edEmoji = editing ? editing.emoji : "⭐";
    $("#edTitle").textContent = t(editing ? "editDeck" : "newDeck");
    $("#edName").value = editing ? editing.name : "";
    $("#edWords").value = editing ? editing.words.join("\n") : "";
    $("#edWords").placeholder = t("wordsPh").replace(/<br>/g, "\n");
    $("#edErr").textContent = "";
    $("#edDelete").style.display = editing ? "" : "none";
    renderEmojis();
    go("editor");
  }
  function renderEmojis() {
    $("#edEmojis").innerHTML = EMOJIS.map(e => `<button data-e="${e}" aria-pressed="${e === edEmoji}">${e}</button>`).join("");
  }
  function saveDeck() {
    const name = $("#edName").value.trim();
    const words = Array.from(new Set($("#edWords").value.split(/[\n,;]+/).map(s => s.trim()).filter(Boolean)));
    if (!name) { $("#edErr").textContent = t("errName"); return; }
    if (words.length < 5) { $("#edErr").textContent = t("errWords"); return; }
    if (editing) { Object.assign(editing, { name, words, emoji: edEmoji }); }
    else { const d = { id: "c" + Date.now().toString(36), name, words, emoji: edEmoji }; custom.push(d); S.selected.push(d.id); }
    store.set("custom", custom); save();
    renderDecks(); go("home"); toast(t("saved"));
  }
  async function deleteDeck() {
    if (!editing || !(await ask(t("confirmDelete"), t("delete")))) return;
    if (!editing) return;
    custom = custom.filter(d => d !== editing);
    store.set("custom", custom); save();
    renderDecks(); go("home"); toast(t("deleted"));
  }


  /* ---------- in-page confirm ---------- */
  function ask(msg, yesTxt) {
    return new Promise(res => {
      const m = $("#modal");
      m.querySelector("p").textContent = msg;
      m.querySelector("[data-yes]").textContent = yesTxt || t("yes");
      m.querySelector("[data-no]").textContent = t("no");
      m.classList.add("on");
      const done = v => { m.classList.remove("on"); m.onclick = null; res(v); };
      m.onclick = e => { if (e.target.dataset.yes != null) done(true); else if (e.target.dataset.no != null || e.target === m) done(false); };
    });
  }

  let toastT = 0;
  function toast(msg) {
    const el = $("#toast"); el.textContent = msg; el.classList.add("on");
    clearTimeout(toastT); toastT = setTimeout(() => el.classList.remove("on"), 2600);
  }

  /* ---------- events ---------- */
  document.addEventListener("click", e => {
    const el = e.target.closest("button,[data-edit]");
    if (!el) return;
    if (el.dataset.edit) { e.stopPropagation(); openEditor(el.dataset.edit); return; }
    if (el.dataset.go) { go(el.dataset.go); return; }
    if (el.dataset.lang) {
      const oldDefaults = S.teams && S.teams.every((n, i) => [T.uz.teamN(i + 1), toLatin(T.uz.teamN(i + 1)), T.ru.teamN(i + 1)].includes(n));
      S.lang = el.dataset.lang;
      if (oldDefaults) S.teams = S.teams.map((_, i) => t("teamN", i + 1));
      save(); applyText(); return;
    }
    if (el.classList.contains("deck") && el.dataset.id) {
      const id = el.dataset.id;
      S.selected = S.selected.includes(id) ? S.selected.filter(x => x !== id) : S.selected.concat(id);
      el.setAttribute("aria-pressed", S.selected.includes(id)); save(); updateDock(); return;
    }
    switch (el.id) {
      case "addDeck": openEditor(null); break;
      case "toSetup": renderSetup(); go("setup"); break;
      case "soundBtn": S.sound = !S.sound; save(); el.textContent = S.sound ? "🔊" : "🔇"; break;
      case "rulesBtn": $("#rulesBody").innerHTML = t("rules") + `<p style="color:var(--muted);font-size:14px">${t("privacy")}</p>`; go("rules"); break;
      case "addTeam": S.teams.push(t("teamN", S.teams.length + 1)); save(); renderSetup(); break;
      case "rMinus": S.rounds = Math.max(1, S.rounds - 1); save(); renderSetup(); break;
      case "rPlus": S.rounds = Math.min(10, S.rounds + 1); save(); renderSetup(); break;
      case "startGame": newGame(); break;
      case "ready": startRound(); break;
      case "turnHome": ask(t("confirmEnd")).then(y => { if (y) { G = null; go("home"); } }); break;
      case "quit": ask(t("confirmQuit")).then(y => { if (y) abortRound(); }); break;
      case "rotateSkip": P.tapsOnly = true; $("#rotate").classList.remove("on"); countdown(); break;
      case "resNext": finishTurn(); break;
      case "scoreHome": G = null; go("home"); break;
      case "scoreNext": if (el.dataset.done) newGame(); else showTurn(); break;
      case "edSave": saveDeck(); break;
      case "edDelete": deleteDeck(); break;
    }
    if (el.dataset.rm != null) { S.teams.splice(+el.dataset.rm, 1); save(); renderSetup(); }
    if (el.parentElement && el.parentElement.id === "timeSeg") { S.time = +el.dataset.v; save(); renderSetup(); }
    if (el.parentElement && el.parentElement.id === "modeSeg") { S.mode = el.dataset.v; save(); renderSetup(); }
    if (el.dataset.e) { edEmoji = el.dataset.e; renderEmojis(); }
    if (el.classList.contains("res-item")) { const h = P.hist[+el.dataset.i]; h.ok = !h.ok; renderResults(); }
  });
  document.addEventListener("input", e => {
    if (e.target.matches("#teamList input")) { S.teams[+e.target.dataset.i] = e.target.value; save(); $("#setupSummary").innerHTML = t("summary", S.teams.length, S.rounds, S.time); }
  });
  $("#stage").addEventListener("pointerdown", e => {
    if (!P || !P.live) return;
    mark(e.clientX > window.innerWidth / 2);
  });
  document.addEventListener("keydown", e => {
    if (current !== "play" || !P || !P.live) return;
    if (e.key === "ArrowRight" || e.key === " " || e.key === "ArrowDown") { e.preventDefault(); mark(true); }
    if (e.key === "ArrowLeft" || e.key === "ArrowUp") { e.preventDefault(); mark(false); }
  });
  document.addEventListener("visibilitychange", () => { if (document.hidden && P && P.live) { /* таймер давом этади */ } });
  if (AppP) {
    try {
      AppP.addListener("backButton", () => {
        if (current === "home") AppP.exitApp();
        else if (current === "play") { ask(t("confirmQuit")).then(y => { if (y) abortRound(); }); }
        else if (current === "turn" || current === "score" || current === "results") { /* ўйин ичида — ҳеч нарса */ }
        else go("home");
      });
    } catch (e) {}
  }

  window.__topqir = { toLatin };
  applyText();
})();
