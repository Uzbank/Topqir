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
  function plural(n, f) { const a = n % 10, b = n % 100; return a === 1 && b !== 11 ? f[0] : a >= 2 && a <= 4 && (b < 10 || b >= 20) ? f[1] : f[2]; }
  const T = {
    uz: {
      short: "Ўз",
      quickTitle: "Тез ўйин", quickSub: "Барча тўпламлардан аралаш сўзлар. Бир босишда бошланг!", quickBtn: "Бошлаш",
      statDecks: n => `<b>${n}</b> тўплам`, statWords: n => `<b>${n}+</b> сўз`, statLangs: "<b>3</b> тил",
      g_modern: "Замонавий", g_people: "Машҳурлар ва тарих", g_fun: "Иборалар ва ақл", g_classic: "Классик", g_ours: "Бизнинг юрт", g_family: "Болалар ва оила", g_mine: "Менинг тўпламларим",
      selectAll: "Ҳаммаси", clearAll: "Бекор қилиш", newBadge: "Янги",
      toSetup: n => n ? `Давом этиш · ${n} тўплам` : "Тўплам танланг",
      words: n => `${n} сўз`,
      myDeck: "Ўз тўпламимни яратиш",
      back: "Орқага", setupTitle: "Ўйин созламалари",
      time: "Раунд вақти", sec: "с", min2: "2 дақ",
      mode: "Усул", mExplain: "Тушунтириш", mShow: "Кўрсатиш", mMix: "Аралаш",
      noteExplain: "Сўзни бошқа сўзлар билан тушунтиринг. Ўша сўзнинг ўзини айтиш мумкин эмас.",
      noteShow: "Сўзсиз, фақат ишоралар ва ҳаракат билан кўрсатинг.",
      noteMix: "Ҳар сўзда вазифа ўзгаради: тушунтириш, кўрсатиш ёки ашула билан.",
      teams: "Жамоалар", addTeam: "Жамоа қўшиш", teamN: n => `${n}-жамоа`,
      rounds: "Ҳар жамоага раундлар сони",
      summary: (t, r, s) => `<b>${t}</b> жамоа, ҳар бири <b>${r}</b> марта ўйнайди. Бир раунд — <b>${s}</b> сония.`,
      startGame: "Ўйинни бошлаш",
      turnOf: "Навбат", roundOf: (a, b) => `${a}-раунд, жами ${b}`,
      how1: "Тахмин қилувчи телефонни пешонасига қўяди, экранга қарамайди",
      how2: "Тўғри топса — телефонни пастга эгади",
      how3: "Ўтказиб юбориш учун — тепага эгади",
      ready: "Тайёрмиз!", endGame: "Ўйинни тугатиш",
      putOnForehead: "Телефонни пешонангизга қўйинг",
      tapSkip: "‹ Ўтказиш", tapOk: "Топдим ›",
      badgeExplain: "🗣 Тушунтиринг", badgeShow: "🤐 Сўзсиз кўрсатинг", badgeSing: "🎵 Ашула билан", badgeProverb: "📜 Бошланишини ўқинг",
      ansPrefix: "Давоми:",
      flashOk: "Топдингиз!", flashSkip: "Ўтказилди", flashEnd: "Вақт тугади!",
      rotate: "Телефонни ёнбош буринг", rotateSkip: "Тугмалар билан ўйнаш",
      noSensor: "Эгиш датчиги топилмади — экранни босиб ўйнанг",
      resTxt: () => "та сўз топилди",
      fixHint: "Хато белгиланган бўлса, сўзни босиб тузатинг",
      continue: "Давом этиш", score: "Ҳисоб",
      nextTurn: t => `Навбат: ${t}`, winner: t => `Ғолиб — ${t}!`, draw: "Дуранг!", total: "Сизнинг натижангиз",
      newGame: "Яна ўйнаш", home: "Бош саҳифа", final: "Ўйин тугади",
      newDeck: "Янги тўплам", editDeck: "Тўпламни таҳрирлаш",
      deckName: "Тўплам номи", deckIcon: "Белги", deckWords: "Сўзлар — ҳар қаторга биттадан",
      wordsPh: "Масалан:\nБувим\nДача\nЧорсу\nПалов",
      save: "Сақлаш", delete: "Ўчириш",
      errName: "Тўплам номини ёзинг", errWords: "Камида 5 та сўз киритинг",
      saved: "Тўплам сақланди", deleted: "Тўплам ўчирилди",
      confirmDelete: "Бу тўпламни ўчирасизми?", confirmQuit: "Раунддан чиқасизми? Бу раунд ҳисобланмайди.", confirmEnd: "Ўйинни тугатасизми?",
      yes: "Ҳа", no: "Йўқ", langTitle: "Тилни танланг",
      rulesTitle: "Қандай ўйналади?",
      rules: `<p>Топқир — катта ва кичик бирга ўйнайдиган шарада ўйини. Битта телефон етарли.</p>
<ol><li>Бир ёки бир нечта тўплам танланг ёки «Тез ўйин»ни босинг.</li>
<li>Навбатдаги жамоадан бир киши телефонни экрани ташқарига қараган ҳолда пешонасига қўяди.</li>
<li>Жамоадошлари экрандаги сўзни тушунтиради, ҳаракат билан кўрсатади ёки ашула билан ишора қилади.</li>
<li>Тўғри топса — телефонни пастга эгади. Билмаса — тепага эгиб, кейинги сўзга ўтади.</li>
<li>Вақт тугагач, топилган сўзлар жамоага очко бўлиб қўшилади. Энг кўп очко йиққан жамоа ғолиб.</li></ol>
<p><b>Мақолни давом эттир:</b> жамоа экрандаги мақолнинг бошланишини овоз чиқариб ўқийди, пешонасида телефон турган ўйинчи давомини айтади.</p>
<p>Датчиги йўқ қурилмада экраннинг ўнг томонини босинг — топдим, чап томонини — ўтказиш.</p>`,
      privacy: "Ўйин ҳеч қандай маълумот йиғмайди, ҳаммаси телефонингизда сақланади."
    },
    ru: {
      short: "Ру",
      quickTitle: "Быстрая игра", quickSub: "Слова из всех колод вперемешку. Начните в одно касание!", quickBtn: "Играть",
      statDecks: n => `<b>${n}</b> ${plural(n, ["колода", "колоды", "колод"])}`, statWords: n => `<b>${n}+</b> слов`, statLangs: "<b>3</b> языка",
      g_modern: "Современные", g_people: "Знаменитости и история", g_fun: "Фразы и смекалка", g_classic: "Классика", g_ours: "Наше родное", g_family: "Дети и семья", g_mine: "Мои колоды",
      selectAll: "Все", clearAll: "Снять", newBadge: "Новое",
      toSetup: n => n ? `Дальше · ${n} ${plural(n, ["колода", "колоды", "колод"])}` : "Выберите колоду",
      words: n => `${n} ${plural(n, ["слово", "слова", "слов"])}`,
      myDeck: "Создать свою колоду",
      back: "Назад", setupTitle: "Настройки игры",
      time: "Время раунда", sec: "с", min2: "2 мин",
      mode: "Режим", mExplain: "Объяснять", mShow: "Показывать", mMix: "Микс",
      noteExplain: "Объясняйте слово другими словами. Однокоренные слова называть нельзя.",
      noteShow: "Без слов — только жесты и мимика, как в «Крокодиле».",
      noteMix: "Задание меняется с каждым словом: объяснить, показать или напеть.",
      teams: "Команды", addTeam: "Добавить команду", teamN: n => `Команда ${n}`,
      rounds: "Раундов на команду",
      summary: (t, r, s) => `<b>${t}</b> ${plural(t, ["команда", "команды", "команд"])}, каждая играет <b>${r}</b> ${plural(r, ["раз", "раза", "раз"])}. Раунд — <b>${s}</b> секунд.`,
      startGame: "Начать игру",
      turnOf: "Ход команды", roundOf: (a, b) => `Раунд ${a} из ${b}`,
      how1: "Угадывающий прикладывает телефон ко лбу и не смотрит на экран",
      how2: "Угадал — наклоните телефон вниз",
      how3: "Пропустить — наклоните вверх",
      ready: "Мы готовы!", endGame: "Закончить игру",
      putOnForehead: "Приложите телефон ко лбу",
      tapSkip: "‹ Пропуск", tapOk: "Угадал ›",
      badgeExplain: "🗣 Объясните", badgeShow: "🤐 Покажите без слов", badgeSing: "🎵 Напойте", badgeProverb: "📜 Прочитайте начало",
      ansPrefix: "Продолжение:",
      flashOk: "Угадано!", flashSkip: "Пропуск", flashEnd: "Время вышло!",
      rotate: "Поверните телефон горизонтально", rotateSkip: "Играть кнопками",
      noSensor: "Датчик наклона не найден — играйте нажатиями",
      resTxt: n => plural(n, ["слово угадано", "слова угадано", "слов угадано"]),
      fixHint: "Ошиблись? Нажмите на слово, чтобы исправить",
      continue: "Продолжить", score: "Счёт",
      nextTurn: t => `Ход: ${t}`, winner: t => `Победила ${t}!`, draw: "Ничья!", total: "Ваш результат",
      newGame: "Играть снова", home: "На главную", final: "Игра окончена",
      newDeck: "Новая колода", editDeck: "Редактировать колоду",
      deckName: "Название колоды", deckIcon: "Значок", deckWords: "Слова — по одному в строке",
      wordsPh: "Например:\nБабушка\nДача\nЧорсу\nПлов",
      save: "Сохранить", delete: "Удалить",
      errName: "Введите название колоды", errWords: "Введите минимум 5 слов",
      saved: "Колода сохранена", deleted: "Колода удалена",
      confirmDelete: "Удалить эту колоду?", confirmQuit: "Выйти из раунда? Он не будет засчитан.", confirmEnd: "Закончить игру?",
      yes: "Да", no: "Нет", langTitle: "Выберите язык",
      rulesTitle: "Как играть?",
      rules: `<p>Топқир — игра в шарады для взрослых и детей. Нужен всего один телефон.</p>
<ol><li>Выберите одну или несколько колод или нажмите «Быстрая игра».</li>
<li>Игрок команды, чей ход, прикладывает телефон ко лбу экраном наружу.</li>
<li>Товарищи по команде объясняют слово, показывают его жестами или напевают.</li>
<li>Угадал — наклоните телефон вниз. Не знает — наклоните вверх, чтобы пропустить.</li>
<li>Когда время выйдет, угаданные слова становятся очками команды. Побеждает команда с наибольшим счётом.</li></ol>
<p><b>Продолжи пословицу:</b> команда вслух читает начало пословицы, а игрок с телефоном на лбу называет продолжение.</p>
<p>Если в устройстве нет датчика, нажимайте на правую половину экрана — угадал, на левую — пропуск.</p>`,
      privacy: "Игра не собирает никаких данных — всё хранится на вашем телефоне."
    },
    en: {
      short: "En",
      quickTitle: "Quick play", quickSub: "Words from every deck, all mixed up. One tap to start!", quickBtn: "Play now",
      statDecks: n => `<b>${n}</b> decks`, statWords: n => `<b>${n}+</b> words`, statLangs: "<b>3</b> languages",
      g_modern: "Trending", g_people: "Celebrities & history", g_fun: "Phrases & brain teasers", g_classic: "Classics", g_ours: "Uzbek vibes", g_family: "Kids & family", g_mine: "My decks",
      selectAll: "All", clearAll: "Clear", newBadge: "New",
      toSetup: n => n ? `Continue · ${n} ${n === 1 ? "deck" : "decks"}` : "Pick a deck",
      words: n => `${n} ${n === 1 ? "word" : "words"}`,
      myDeck: "Create my own deck",
      back: "Back", setupTitle: "Game settings",
      time: "Round time", sec: "s", min2: "2 min",
      mode: "Mode", mExplain: "Explain", mShow: "Act out", mMix: "Mix",
      noteExplain: "Describe the word using other words. You can't say the word itself.",
      noteShow: "No talking — only gestures and acting, like classic charades.",
      noteMix: "The task changes with every word: explain, act out, or hum it.",
      teams: "Teams", addTeam: "Add team", teamN: n => `Team ${n}`,
      rounds: "Rounds per team",
      summary: (t, r, s) => `<b>${t}</b> ${t === 1 ? "team" : "teams"}, each plays <b>${r}</b> ${r === 1 ? "time" : "times"}. One round is <b>${s}</b> seconds.`,
      startGame: "Start game",
      turnOf: "Up next", roundOf: (a, b) => `Round ${a} of ${b}`,
      how1: "The guesser holds the phone to their forehead without looking",
      how2: "Got it right — tilt the phone down",
      how3: "To pass — tilt it up",
      ready: "We're ready!", endGame: "End game",
      putOnForehead: "Hold the phone to your forehead",
      tapSkip: "‹ Pass", tapOk: "Got it ›",
      badgeExplain: "🗣 Explain it", badgeShow: "🤐 Act it out", badgeSing: "🎵 Hum it", badgeProverb: "📜 Read the beginning",
      ansPrefix: "Ending:",
      flashOk: "Correct!", flashSkip: "Passed", flashEnd: "Time's up!",
      rotate: "Turn your phone sideways", rotateSkip: "Play with taps",
      noSensor: "No tilt sensor found — tap the screen to play",
      resTxt: n => n === 1 ? "word guessed" : "words guessed",
      fixHint: "Marked one wrong? Tap a word to fix it",
      continue: "Continue", score: "Score",
      nextTurn: t => `Next: ${t}`, winner: t => `${t} wins!`, draw: "It's a tie!", total: "Your score",
      newGame: "Play again", home: "Home", final: "Game over",
      newDeck: "New deck", editDeck: "Edit deck",
      deckName: "Deck name", deckIcon: "Icon", deckWords: "Words — one per line",
      wordsPh: "For example:\nGrandma\nSummer house\nChorsu\nPlov",
      save: "Save", delete: "Delete",
      errName: "Enter a deck name", errWords: "Enter at least 5 words",
      saved: "Deck saved", deleted: "Deck deleted",
      confirmDelete: "Delete this deck?", confirmQuit: "Leave this round? It won't count.", confirmEnd: "End the game?",
      yes: "Yes", no: "No", langTitle: "Choose language",
      rulesTitle: "How to play",
      rules: `<p>Topqir is a charades game for grown-ups and kids. One phone is all you need.</p>
<ol><li>Pick one or more decks, or tap “Quick play”.</li>
<li>One player from the team holds the phone to their forehead, screen facing out.</li>
<li>Teammates explain the word, act it out, or hum it.</li>
<li>Guessed it — tilt the phone down. Stuck — tilt it up to pass.</li>
<li>When time runs out, guessed words become points. The team with the most points wins.</li></ol>
<p><b>Finish the proverb:</b> the team reads the beginning out loud, and the player with the phone says the ending.</p>
<p>No tilt sensor? Tap the right half of the screen for correct, the left half to pass.</p>`,
      privacy: "The game collects no data. Everything stays on your phone."
    }
  };

  let S = store.get("settings", null) || {};
  S = Object.assign({
    lang: (() => { const l = (navigator.language || "").toLowerCase(); return l.startsWith("ru") ? "ru" : l.startsWith("en") ? "en" : "uz"; })(),
    time: 60, mode: "explain", rounds: 3, sound: true, selected: ["internet", "stars", "phrases"], teams: null
  }, S);
  let custom = store.get("custom", []);
  let used = store.get("used", {});
  const save = () => store.set("settings", S);

  const base = () => (S.lang === "ru" ? "ru" : S.lang === "en" ? "en" : "uz");
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
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- atlas (ikat) pattern ---------- */
  const ikatCache = {};
  function ikat(bg, c1, c2) {
    const k = bg + c1 + c2; if (ikatCache[k]) return ikatCache[k];
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="60" height="90" viewBox="0 0 60 90">` +
      `<defs><filter id="f" x="-10%" y="-10%" width="120%" height="120%"><feTurbulence type="fractalNoise" baseFrequency="0.015 0.55" numOctaves="2" seed="4"/>` +
      `<feDisplacementMap in="SourceGraphic" scale="10" xChannelSelector="R" yChannelSelector="B"/></filter></defs>` +
      (bg ? `<rect width="60" height="90" fill="${bg}"/>` : "") + `<g filter="url(#f)">` +
      `<path d="M30 2 L54 45 L30 88 L6 45Z" fill="${c1}"/><path d="M30 20 L44 45 L30 70 L16 45Z" fill="${bg || "#000"}" ${bg ? "" : "fill-opacity='0'"}/>` +
      `<path d="M30 33 L37 45 L30 57 L23 45Z" fill="${c2}"/><path d="M-2 0 L7 45 L-2 90Z M62 0 L53 45 L62 90Z" fill="${c2}"/></g></svg>`;
    return (ikatCache[k] = `url('data:image/svg+xml;utf8,${encodeURIComponent(svg)}')`);
  }
  const WHITE_PAT = ikat("", "#FFFFFF", "#FFFFFF");

  /* ---------- decks ---------- */
  const PALETTE = [["#FF3D7F", "#7C3AED"], ["#10B981", "#0EA5E9"], ["#F59E0B", "#EF4444"], ["#6366F1", "#EC4899"]];
  function allDecks() {
    const b = base();
    const builtin = window.TOPQIR_DECKS.map(d => ({
      id: d.id, group: d.group, emoji: d.emoji, c1: d.c1, c2: d.c2, dark: !!d.dark, p: !!d.p,
      name: L(d.name[b]), words: d.w[b].split("|").map(w => (b === "uz" ? L(w) : w)), custom: false
    }));
    const mine = custom.map((d, i) => ({ id: d.id, group: "mine", emoji: d.emoji, c1: PALETTE[i % 4][0], c2: PALETTE[i % 4][1], dark: false, p: false, name: d.name, words: d.words, custom: true }));
    return builtin.concat(mine);
  }
  const deckById = id => allDecks().find(d => d.id === id);

  /* ---------- UI text ---------- */
  function applyText() {
    document.documentElement.lang = base();
    $$("[data-t]").forEach(el => { el.innerHTML = t(el.dataset.t); });
    $("#brandName").textContent = S.lang === "uz" || S.lang === "ru" ? "Топқир" : "Topqir";
    $("#mark").style.backgroundImage = ikat("#FF3D7F", "#FFC83D", "#FFFFFF");
    $("#hero").style.setProperty("--ikat", WHITE_PAT);
    $("#langShort").textContent = S.lang === "uzl" ? "Uz" : t("short");
    $$("#langSheet .opt").forEach(b => b.setAttribute("aria-pressed", b.dataset.lang === S.lang));
    $("#soundBtn").textContent = S.sound ? "🔊" : "🔇";
    renderHome();
  }

  function renderHome() {
    const decks = allDecks();
    S.selected = S.selected.filter(id => decks.some(d => d.id === id));
    const totalWords = decks.filter(d => !d.custom).reduce((a, d) => a + d.words.length, 0);
    $("#stats").innerHTML = `<span>${t("statDecks", decks.filter(d => !d.custom).length)}</span><span>${t("statWords", Math.floor(totalWords / 100) * 100)}</span><span>${t("statLangs")}</span>`;
    const sample = shuffle(decks.filter(d => !d.custom && !d.p).flatMap(d => d.words.slice(0, 8))).slice(0, 3);
    $$("#fan span").forEach((s, i) => (s.textContent = sample[i] || ""));
    const groups = window.TOPQIR_GROUPS.concat("mine");
    $("#sections").innerHTML = groups.map(g => {
      const list = decks.filter(d => d.group === g);
      if (!list.length && g !== "mine") return "";
      const allOn = list.length && list.every(d => S.selected.includes(d.id));
      return `<section class="sec"><div class="sec-h"><h2>${t("g_" + g)}</h2>${list.length ? `<button data-grp="${g}">${allOn ? t("clearAll") : t("selectAll")}</button>` : ""}</div>
        <div class="grid">${list.map(deckTile).join("")}${g === "mine" ? `<button class="deck add" id="addDeck"><b>+</b>${t("myDeck")}</button>` : ""}</div></section>`;
    }).join("");
    updateDock();
  }
  function deckTile(d) {
    return `<button class="deck ${d.dark ? "dark" : ""}" data-id="${d.id}" aria-pressed="${S.selected.includes(d.id)}" style="--c1:${d.c1};--c2:${d.c2};--pat:${WHITE_PAT}">
      <span class="emo">${d.emoji}</span>
      <span><span class="nm">${esc(d.name)}</span><span class="ct" style="display:block">${t("words", d.words.length)}</span></span>
      ${d.group === "modern" || d.group === "people" || d.group === "fun" ? `<span class="new">${t("newBadge")}</span>` : ""}
      <span class="chk" aria-hidden="true">✓</span>
      ${d.custom ? `<span class="edit" data-edit="${d.id}" role="button" aria-label="edit">✎</span>` : ""}
    </button>`;
  }
  function updateDock() {
    const n = S.selected.length, b = $("#toSetup");
    b.textContent = t("toSetup", n); b.disabled = !n;
  }
  function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }

  /* ---------- navigation ---------- */
  let current = "home";
  function go(id) {
    $$(".screen").forEach(s => s.classList.toggle("on", s.id === id));
    current = id;
    $("#toast").classList.remove("on");
    window.scrollTo(0, 0);
    if (id === "home" && !reduced) { const h = $("#hero"); h.classList.remove("anim"); void h.offsetWidth; h.classList.add("anim"); }
  }

  /* ---------- setup ---------- */
  const TEAM_COLORS = ["#FF3D7F", "#FFC83D", "#22D3EE", "#2EE6A6", "#A855F7", "#FF8A3D"];
  function defaultTeamName(i) { return [T.uz.teamN(i + 1), toLatin(T.uz.teamN(i + 1)), T.ru.teamN(i + 1), T.en.teamN(i + 1)]; }
  function ensureTeams() { if (!S.teams || !S.teams.length) S.teams = [t("teamN", 1), t("teamN", 2)]; }
  function renderSetup() {
    ensureTeams();
    $$("#timeSeg button").forEach(b => { b.setAttribute("aria-pressed", +b.dataset.v === S.time); b.textContent = +b.dataset.v === 120 ? t("min2") : b.dataset.v + " " + t("sec"); });
    $$("#modeSeg button").forEach(b => b.setAttribute("aria-pressed", b.dataset.v === S.mode));
    $("#modeNote").textContent = t({ explain: "noteExplain", show: "noteShow", mix: "noteMix" }[S.mode]);
    $("#teamList").innerHTML = S.teams.map((n, i) => `
      <div class="team"><span class="dot" style="background:${TEAM_COLORS[i % 6]}"></span>
      <input id="team${i}" value="${esc(n)}" data-i="${i}" maxlength="24" aria-label="${t("teams")} ${i + 1}">
      ${S.teams.length > 1 ? `<button data-rm="${i}" aria-label="remove">×</button>` : ""}</div>`).join("");
    $("#addTeam").style.display = S.teams.length >= 6 ? "none" : "";
    $("#rVal").textContent = S.rounds;
    $("#setupSummary").innerHTML = t("summary", S.teams.length, S.rounds, S.time);
  }

  /* ---------- game ---------- */
  let G = null;
  function newGame(deckIds) {
    ensureTeams();
    S.teams = S.teams.map((n, i) => n.trim() || t("teamN", i + 1));
    save();
    const ids = deckIds || S.selected.slice();
    G = { ids, teams: S.teams.map(n => ({ name: n, score: 0 })), turn: 0, total: S.teams.length * S.rounds, queue: [] };
    G.queue = buildQueue();
    showTurn();
  }
  function quickGame() {
    const ids = allDecks().filter(d => !d.custom && d.id !== "hard" && d.id !== "proverbs").map(d => d.id);
    newGame(ids);
  }
  function buildQueue() {
    const items = [];
    G.ids.forEach(id => {
      const d = deckById(id); if (!d) return;
      const key = id + ":" + base();
      const u = new Set(used[key] || []);
      let fresh = d.words.filter(w => !u.has(w));
      if (fresh.length < Math.min(12, d.words.length)) { used[key] = []; fresh = d.words.slice(); }
      fresh.forEach(w => items.push({ w, deck: d }));
    });
    return shuffle(items);
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
    const i = G.turn % G.teams.length, team = G.teams[i];
    const r = Math.floor(G.turn / G.teams.length) + 1;
    $("#turnKicker").textContent = t("turnOf");
    $("#turnTeam").textContent = team.name;
    $("#turnBlob").style.background = TEAM_COLORS[i % 6];
    $("#turnMeta").innerHTML = `<span class="chip">${t("roundOf", r, S.rounds)}</span><span class="chip">⏱ ${S.time} ${t("sec")}</span><span class="chip">${t({ explain: "mExplain", show: "mShow", mix: "mMix" }[S.mode])}</span>`;
    go("turn");
  }

  /* ---------- native / device helpers ---------- */
  const Cap = window.Capacitor;
  const isNative = !!(Cap && Cap.isNativePlatform && Cap.isNativePlatform());
  const plug = name => { try { return isNative && Cap.registerPlugin ? Cap.registerPlugin(name) : null; } catch (e) { return null; } };
  const Haptics = plug("Haptics"), Orient = plug("ScreenOrientation"), AppP = plug("App");
  let wakeLock = null;
  async function enterPlayMode() {
    try { if (Orient) await Orient.lock({ orientation: "landscape" }); } catch (e) {}
    try { if (!isNative && navigator.wakeLock) wakeLock = await navigator.wakeLock.request("screen"); } catch (e) {}
    if (!isNative && matchMedia("(pointer:coarse)").matches) {
      try { await document.documentElement.requestFullscreen(); await screen.orientation.lock("landscape"); } catch (e) {}
    }
  }
  async function exitPlayMode() {
    try { if (Orient) await Orient.lock({ orientation: "portrait" }); } catch (e) {}
    try { if (wakeLock) { wakeLock.release(); wakeLock = null; } } catch (e) {}
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
    end: () => tone([[784, .18, "triangle"], [659, .18, "triangle"], [523, .4, "triangle"]]),
    win: () => tone([[523, .14, "triangle"], [659, .14, "triangle"], [784, .14, "triangle"], [1047, .45, "triangle"]])
  };

  /* ---------- tilt sensor ---------- */
  let sensorSeen = false, lastNz = 0;
  window.addEventListener("deviceorientation", e => {
    if (e.beta == null || e.gamma == null) return;
    sensorSeen = true;
    const rad = Math.PI / 180;
    lastNz = Math.cos(e.beta * rad) * Math.cos(e.gamma * rad); // +1 экран тепага, −1 экран пастга
    if (P && P.live) tiltCheck();
  });
  async function askMotion() {
    try {
      if (typeof DeviceOrientationEvent !== "undefined" && typeof DeviceOrientationEvent.requestPermission === "function") await DeviceOrientationEvent.requestPermission();
    } catch (e) {}
  }

  /* ---------- round ---------- */
  let P = null;
  const RING_LEN = 2 * Math.PI * 28;
  const MODES = { explain: ["badgeExplain"], show: ["badgeShow"], mix: ["badgeExplain", "badgeShow", "badgeSing"] };
  async function startRound() {
    await askMotion();
    tone([[1, .01, "sine", .0001]]);
    P = { live: false, hist: [], cur: null, deadline: 0, raf: 0, lock: true, tapsOnly: false, lastTick: -1 };
    $("#scoreLive").textContent = "0";
    $("#timer").textContent = S.time;
    $("#ring").classList.remove("low");
    const fg = $("#ringFg"); fg.style.strokeDasharray = RING_LEN; fg.style.strokeDashoffset = 0;
    $("#word").textContent = ""; $("#badge").textContent = ""; $("#deckLbl").textContent = ""; $("#ans").classList.remove("on");
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
    const cd = $("#countdown"), n = cd.querySelector(".n"); cd.classList.add("on");
    let k = 3; const show = () => { n.textContent = k; n.classList.remove("tick"); void n.offsetWidth; n.classList.add("tick"); SND.tick(); };
    show();
    P.cdIv = setInterval(() => {
      k--;
      if (k <= 0) { clearInterval(P.cdIv); cd.classList.remove("on"); P.counting = false; begin(); return; }
      show();
    }, 1000);
  }
  function begin() {
    P.live = true;
    P.deadline = performance.now() + S.time * 1000;
    SND.go();
    setTimeout(() => { if (P && P.live && !sensorSeen && matchMedia("(pointer:coarse)").matches) toast(t("noSensor")); }, 1500);
    nextWord();
    loop();
  }
  function loop() {
    if (!P || !P.live) return;
    const left = Math.max(0, P.deadline - performance.now());
    const s = Math.ceil(left / 1000);
    $("#timer").textContent = s;
    $("#ringFg").style.strokeDashoffset = RING_LEN * (1 - left / (S.time * 1000));
    $("#ring").classList.toggle("low", s <= 5);
    if (s <= 5 && s !== P.lastTick && s > 0) { P.lastTick = s; SND.tick(); }
    if (left <= 0) { endRound(); return; }
    P.raf = requestAnimationFrame(loop);
  }
  function nextWord() {
    const it = takeWord();
    P.cur = it;
    const play = $("#play");
    play.style.setProperty("--c1", it.deck.c1); play.style.setProperty("--c2", it.deck.c2); play.style.setProperty("--pat", WHITE_PAT);
    play.classList.toggle("dark", !!it.deck.dark);
    const w = $("#word"), ans = $("#ans");
    if (it.deck.p && it.w.includes(" — ")) {
      const [a, b] = it.w.split(" — ");
      w.textContent = a + "…";
      ans.innerHTML = `${esc(t("ansPrefix"))} ${esc(b)}`; ans.classList.add("on");
      $("#badge").textContent = t("badgeProverb");
    } else {
      w.textContent = it.w; ans.classList.remove("on");
      const m = MODES[S.mode];
      $("#badge").textContent = t(m[Math.floor(Math.random() * m.length)]);
    }
    $("#deckLbl").textContent = it.deck.emoji + " " + it.deck.name;
    w.classList.remove("in"); void w.offsetWidth; w.classList.add("in");
    fitWord();
    P.lock = false;
    P.armed = Math.abs(lastNz) < 0.45 || !sensorSeen;
  }
  function fitWord() {
    const w = $("#word"); if (!w.textContent) return;
    const box = $("#stage");
    const proverb = $("#ans").classList.contains("on");
    const maxW = box.clientWidth - 110, maxH = box.clientHeight * (proverb ? 0.42 : 0.55);
    let size = Math.min(proverb ? 76 : 140, Math.max(34, window.innerHeight * (proverb ? 0.16 : 0.26)));
    w.style.fontSize = size + "px";
    let guard = 40;
    while ((w.scrollWidth > maxW || w.offsetHeight > maxH) && size > 22 && guard--) { size *= 0.9; w.style.fontSize = size + "px"; }
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
    const full = P.cur.w.replace(" — ", " ");
    P.hist.push({ w: full, ok });
    $("#scoreLive").textContent = P.hist.filter(h => h.ok).length;
    const f = $("#flash");
    f.className = "on " + (ok ? "ok" : "skip");
    f.querySelector(".ic").textContent = ok ? "✓" : "↷";
    f.querySelector(".big").textContent = t(ok ? "flashOk" : "flashSkip");
    f.querySelector(".small").textContent = full;
    ok ? SND.ok() : SND.skip();
    buzz(ok ? "ok" : "skip");
    P.cur = null;
    setTimeout(() => { if (!P || !P.live) return; f.className = ""; nextWord(); }, 750);
  }
  function endRound() {
    P.live = false;
    cancelAnimationFrame(P.raf);
    const f = $("#flash");
    f.className = "on end";
    f.querySelector(".ic").textContent = "⏰";
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
  function showResults() { renderResults(); go("results"); }
  function renderResults() {
    const n = P.hist.filter(h => h.ok).length;
    $("#resNum").textContent = n;
    $("#resRing").style.setProperty("--p", (P.hist.length ? Math.round(100 * n / P.hist.length) : 0) + "%");
    $("#resTxt").textContent = t("resTxt", n);
    $("#resList").innerHTML = P.hist.map((h, i) => `<button class="res-item ${h.ok ? "ok" : "no"}" data-i="${i}"><span class="mk">${h.ok ? "✓" : "–"}</span><span>${esc(h.w)}</span></button>`).join("");
    $(".hint").style.display = P.hist.length ? "" : "none";
  }
  function finishTurn() {
    G.teams[G.turn % G.teams.length].score += P.hist.filter(h => h.ok).length;
    P = null; G.turn++;
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
      if (G.teams.length === 1) head = `<div class="winner"><div class="cup">🏆</div><h3>${t("total")}: ${top}</h3></div>`;
      else {
        const leaders = sorted.filter(x => x.score === top);
        head = `<div class="winner"><div class="cup">${leaders.length > 1 ? "🤝" : "🏆"}</div><h3>${leaders.length > 1 ? t("draw") : esc(t("winner", leaders[0].name))}</h3></div>`;
      }
    }
    $("#board").innerHTML = head + sorted.map((tm, k) => `
      <div class="row ${tm.score === top && top > 0 ? "lead" : ""}"><span class="pl">${k + 1}</span>
      <span class="tn"><i style="background:${TEAM_COLORS[tm.i % 6]}"></i><span>${esc(tm.name)}</span></span>
      <span class="pts">${tm.score}</span></div>`).join("");
    $("#scoreNext").textContent = done ? t("newGame") : t("nextTurn", G.teams[G.turn % G.teams.length].name);
    $("#scoreNext").dataset.done = done ? "1" : "";
    go("score");
    if (done) { SND.win(); confetti(); }
  }

  /* ---------- confetti ---------- */
  function confetti() {
    if (reduced) return;
    const c = $("#confetti"), ctx = c.getContext("2d"); c.hidden = false;
    const dpr = window.devicePixelRatio || 1; c.width = innerWidth * dpr; c.height = innerHeight * dpr; ctx.scale(dpr, dpr);
    const cols = ["#FF3D7F", "#FFC83D", "#22D3EE", "#2EE6A6", "#A855F7", "#FF8A3D", "#FFFFFF"];
    const ps = Array.from({ length: 140 }, () => ({ x: Math.random() * innerWidth, y: -20 - Math.random() * innerHeight * 0.5, vx: (Math.random() - .5) * 3, vy: 2 + Math.random() * 3, r: Math.random() * 6.28, vr: (Math.random() - .5) * .3, w: 6 + Math.random() * 6, h: 10 + Math.random() * 8, c: cols[Math.floor(Math.random() * cols.length)] }));
    const t0 = performance.now();
    (function frame(now) {
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      ps.forEach(p => { p.x += p.vx; p.y += p.vy; p.vy += 0.04; p.r += p.vr; ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r); ctx.fillStyle = p.c; ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h); ctx.restore(); });
      if (now - t0 < 4000) requestAnimationFrame(frame); else { ctx.clearRect(0, 0, innerWidth, innerHeight); c.hidden = true; }
    })(t0);
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
    $("#edWords").placeholder = t("wordsPh");
    $("#edErr").textContent = "";
    $("#edDelete").style.display = editing ? "" : "none";
    renderEmojis();
    go("editor");
  }
  function renderEmojis() { $("#edEmojis").innerHTML = EMOJIS.map(e => `<button data-e="${e}" aria-pressed="${e === edEmoji}">${e}</button>`).join(""); }
  function saveDeck() {
    const name = $("#edName").value.trim();
    const words = Array.from(new Set($("#edWords").value.split(/[\n,;]+/).map(s => s.trim()).filter(Boolean)));
    if (!name) { $("#edErr").textContent = t("errName"); return; }
    if (words.length < 5) { $("#edErr").textContent = t("errWords"); return; }
    if (editing) Object.assign(editing, { name, words, emoji: edEmoji });
    else { const d = { id: "c" + Date.now().toString(36), name, words, emoji: edEmoji }; custom.push(d); S.selected.push(d.id); }
    store.set("custom", custom); save();
    renderHome(); go("home"); toast(t("saved"));
  }
  async function deleteDeck() {
    if (!editing || !(await ask(t("confirmDelete"), t("delete")))) return;
    custom = custom.filter(d => d !== editing);
    store.set("custom", custom); save();
    renderHome(); go("home"); toast(t("deleted"));
  }

  /* ---------- dialogs ---------- */
  function ask(msg, yesTxt) {
    return new Promise(res => {
      const m = $("#modal");
      m.querySelector("p").textContent = msg;
      m.querySelector("[data-yes]").textContent = yesTxt || t("yes");
      m.querySelector("[data-no]").textContent = t("no");
      m.classList.add("on");
      const done = v => { m.classList.remove("on"); m.onclick = null; res(v); };
      m.onclick = e => { const b = e.target.closest("button"); if (b && b.hasAttribute("data-yes")) done(true); else if ((b && b.hasAttribute("data-no")) || e.target === m) done(false); };
    });
  }
  let toastT = 0;
  function toast(msg) {
    const el = $("#toast"); el.textContent = msg; el.classList.add("on");
    clearTimeout(toastT); toastT = setTimeout(() => el.classList.remove("on"), 2600);
  }

  /* ---------- events ---------- */
  document.addEventListener("click", e => {
    if (e.target.closest("#modal")) return;
    const sheet = $("#langSheet");
    if (e.target === sheet) { sheet.classList.remove("on"); return; }
    const el = e.target.closest("button,[data-edit]");
    if (!el) return;
    if (el.dataset.edit) { e.stopPropagation(); openEditor(el.dataset.edit); return; }
    if (el.dataset.go) { go(el.dataset.go); return; }
    if (el.dataset.lang) {
      const defaults = S.teams && S.teams.every((n, i) => defaultTeamName(i).includes(n));
      S.lang = el.dataset.lang;
      if (defaults) S.teams = S.teams.map((_, i) => t("teamN", i + 1));
      save(); applyText(); sheet.classList.remove("on"); return;
    }
    if (el.dataset.grp) {
      const ids = allDecks().filter(d => d.group === el.dataset.grp).map(d => d.id);
      const allOn = ids.every(id => S.selected.includes(id));
      S.selected = allOn ? S.selected.filter(id => !ids.includes(id)) : Array.from(new Set(S.selected.concat(ids)));
      save(); renderHome(); return;
    }
    if (el.classList.contains("deck") && el.dataset.id) {
      const id = el.dataset.id;
      S.selected = S.selected.includes(id) ? S.selected.filter(x => x !== id) : S.selected.concat(id);
      el.setAttribute("aria-pressed", S.selected.includes(id)); save(); updateDock();
      const sec = el.closest(".sec"), gb = sec && sec.querySelector("[data-grp]");
      if (gb) { const ids = allDecks().filter(d => d.group === gb.dataset.grp).map(d => d.id); gb.textContent = ids.every(i => S.selected.includes(i)) ? t("clearAll") : t("selectAll"); }
      return;
    }
    switch (el.id) {
      case "langBtn": sheet.classList.add("on"); break;
      case "addDeck": openEditor(null); break;
      case "quickPlay": quickGame(); break;
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
      case "scoreNext": if (el.dataset.done) newGame(G.ids); else showTurn(); break;
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
  $("#stage").addEventListener("pointerdown", e => { if (P && P.live) mark(e.clientX > window.innerWidth / 2); });
  document.addEventListener("keydown", e => {
    if (current !== "play" || !P || !P.live) return;
    if (e.key === "ArrowRight" || e.key === " " || e.key === "ArrowDown") { e.preventDefault(); mark(true); }
    if (e.key === "ArrowLeft" || e.key === "ArrowUp") { e.preventDefault(); mark(false); }
  });
  if (AppP) {
    try {
      AppP.addListener("backButton", () => {
        if ($("#langSheet").classList.contains("on")) $("#langSheet").classList.remove("on");
        else if (current === "home") AppP.exitApp();
        else if (current === "play") ask(t("confirmQuit")).then(y => { if (y) abortRound(); });
        else if (current === "turn" || current === "score" || current === "results") { /* ўйин ичида */ }
        else go("home");
      });
    } catch (e) {}
  }

  window.__topqir = { toLatin };
  applyText();
  go("home");
})();
