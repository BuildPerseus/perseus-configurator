/* /build: a guided, one-question-per-screen configurator.
   Steps: 1 what it should do → 2 who it's for → 3 your build (reveal + customize) → 4 how to buy.
   Needs first: the answers pick the build. All prices come from assets/catalog.js. */
{
  const P = window.PERSEUS, m = P.money, parts = P.parts;
  const $ = id => document.getElementById(id);
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const svg = d => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;

  const I = {
    drop: '<path d="M12 3c3 4.5 6 7.6 6 11a6 6 0 0 1-12 0c0-3.4 3-6.5 6-11z"/>',
    photo: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 16 5-5 4 4 3-3 6 6"/>',
    layers: '<path d="M4 7h16v4H4zM4 13h16v4H4z"/><path d="M8 9h.01M8 15h.01"/>',
    chip: '<rect x="5" y="5" width="14" height="14" rx="3"/><path d="M9 9h6v6H9zM9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3"/>',
    play: '<rect x="2" y="5" width="20" height="13" rx="2"/><path d="m10 9 5 2.5-5 2.5z"/><path d="M8 21h8"/>',
    cam: '<path d="M3 8h4l2-3h6l2 3h4v11H3z"/><circle cx="12" cy="13" r="3.5"/>',
    wifi: '<path d="M2 9a15 15 0 0 1 20 0M5 12.5a10 10 0 0 1 14 0M8.5 16a5 5 0 0 1 7 0"/><circle cx="12" cy="19" r="1"/>',
    shield: '<path d="M12 3 4 6v6c0 4.5 3.4 8 8 9 4.6-1 8-4.5 8-9V6z"/><path d="m9 9 6 6M15 9l-6 6"/>',
    seed: '<path d="M12 21v-8"/><path d="M12 13c0-4 3-7 8-7 0 4-3 7-8 7zM12 15c0-3-2.5-5.5-7-5.5 0 3 2.5 5.5 7 5.5z"/>',
    users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.8-3.6 3.4-5.5 6.5-5.5s5.7 1.9 6.5 5.5"/><circle cx="17" cy="9" r="2.5"/><path d="M16.5 14.5c2.6.2 4.4 2 5 5"/>',
    case: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5h6v2M3 12h18"/>',
    lock: '<rect x="5" y="10" width="14" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
    house: '<path d="M3 11 12 4l9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-5h4v5"/>',
    hub: '<rect x="4" y="6" width="16" height="12" rx="3"/><circle cx="8.5" cy="12" r="1.2"/><path d="M12 12h5"/>',
    radio: '<path d="M12 12v9M8 21h8"/><path d="M8.5 8.5a5 5 0 0 1 7 0M6 6a8.5 8.5 0 0 1 12 0"/><circle cx="12" cy="11" r="1"/>',
    router: '<rect x="3" y="13" width="18" height="6" rx="2"/><path d="M7 16h.01M11 16h.01M8 13V9M16 13V9"/>',
    ports: '<rect x="3" y="7" width="18" height="10" rx="2"/><path d="M7 11h2v3H7zM11 11h2v3h-2zM15 11h2v3h-2z"/>',
    nas: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 7h8M8 11h8"/><circle cx="12" cy="16.5" r="1.2"/>',
    disk: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="2"/>',
    battery: '<rect x="3" y="7" width="16" height="10" rx="2"/><path d="M21 10v4M10 9l-2 3h4l-2 3"/>',
    tablet: '<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M11 18h2"/>',
    sensors: '<circle cx="7" cy="7" r="2.5"/><circle cx="17" cy="7" r="2.5"/><circle cx="7" cy="17" r="2.5"/><circle cx="17" cy="17" r="2.5"/>'
  };

  const NEEDS = [
    ['smart', 'Leak alerts and smart lights', 'Texts when water hits the floor. Lights that follow you.', 'drop'],
    ['photos', 'Photos and files at home', 'The family’s photos backed up from every phone.', 'photo'],
    ['backup', 'Backups that work', 'Three copies, one off site, tested with you.', 'layers'],
    ['ai', 'Private AI', 'A house assistant and local AI on your own box.', 'chip'],
    ['media', 'Movies and music', 'Your own library on every TV in the house.', 'play'],
    ['cameras', 'Cameras that stay home', 'Footage on your storage, not a company’s cloud.', 'cam'],
    ['network', 'Wi-Fi in every room', 'Strong signal from the garage to the patio.', 'wifi'],
    ['adblock', 'Fewer ads everywhere', 'Blocks most ads and trackers on every device.', 'shield']
  ];
  const SITS = [
    ['small', 'Just starting small', 'One or two things, done right.', 'seed'],
    ['family', 'My family', 'Cutting subscriptions, keeping photos safe.', 'users'],
    ['office', 'Home office or creator', 'Client files, footage, a solid network.', 'case'],
    ['privacy', 'Privacy first', 'Your data stays in your house.', 'lock'],
    ['large', 'A larger home', 'Whole-house coverage, quoted after a visit.', 'house']
  ];
  const MOD_ICON = { hub: 'hub', radio: 'radio', ai: 'chip', gateway: 'router', wifi: 'wifi', switch: 'ports', nas: 'nas', drive: 'disk', ups: 'battery', display: 'tablet', device: 'sensors' };
  const STEPS = ['What it does', 'Who it’s for', 'Your build', 'Get it'];
  const ZIGBEE = ['leak', 'bulb', 'motion', 'fp300', 'soil', 'valve'];
  const QTY_GROUPS = ['device', 'drive', 'wifi'];

  const state = { step: 0, needs: new Set(), sit: null, preset: 'cheapest', items: [], way: 'dfy', specs: false, applied: '', customOpen: false };
  const key = () => [...state.needs].sort().join(',') + '|' + state.sit;
  const items = () => state.items.map(i => [i.id, i.qty]);

  // ---------- logic ----------
  function recommend() {
    const n = state.needs, s = state.sit;
    if (n.has('ai')) return s === 'large' ? 'wholehome' : 'privateai';
    if (['photos', 'backup', 'media', 'cameras', 'network'].some(k => n.has(k))) return s === 'office' ? 'storage' : 'starter';
    if (n.has('smart') || n.has('adblock')) return 'cheapest';
    return { small: 'cheapest', family: 'starter', office: 'storage', privacy: 'privateai', large: 'wholehome' }[s] || 'cheapest';
  }
  function loadPreset(id) {
    state.preset = id;
    state.items = P.presets[id].items.map(([pid, qty]) => ({ id: pid, qty }));
    state.specs = !!P.presets[id].specsOpen;
  }
  function warnings() {
    const out = [], has = id => state.items.some(i => i.id === id && i.qty > 0);
    const inGroup = g => state.items.filter(i => parts[i.id].group === g && i.qty > 0);
    const asked = state.needs.size > 0, n = state.needs;
    const ai = inGroup('ai'), nas = inGroup('nas'), drives = inGroup('drive'), wifi = inGroup('wifi');
    if (!inGroup('hub').length) out.push(['bad', 'Every build needs a brain. Add a Home Assistant Green or the N150 mini PC.']);
    if (state.items.some(i => ZIGBEE.includes(i.id) && i.qty > 0) && !has('zbt2')) out.push(['warn', 'Your sensors and bulbs need the ZBT-2 radio to talk to the brain.']);
    if (nas.length && !drives.length) out.push(['bad', 'The storage box needs drives. Add a pair.']);
    if (drives.length && !nas.length) out.push(['bad', 'Drives need a storage box to go in. Add the UNAS 2 or DXP2800.']);
    if (drives.some(d => d.qty === 1)) out.push(['warn', 'One drive means no mirror copy. Use two so a dead drive doesn’t take your files with it.']);
    if (ai.length && asked && !n.has('ai')) {
      const cost = ai.reduce((a, i) => a + parts[i.id].low * i.qty, 0);
      out.push(['warn', `More than you need: you didn’t ask for private AI, and the AI box adds at least ${m(cost)}.`]);
    }
    if (nas.length && asked && !['photos', 'backup', 'media', 'cameras'].some(k => n.has(k)))
      out.push(['warn', 'More than you need: storage is for photos, files, backups or camera footage, and you didn’t pick those.']);
    if (drives.some(d => d.id !== 'hdd4') && asked && !['photos', 'media', 'cameras'].some(k => n.has(k)))
      out.push(['warn', 'More than you need: 4 TB drives hold most families’ photos and backups. Bigger drives are for video and footage.']);
    if ((ai.length || nas.length || has('n150')) && !inGroup('ups').length) out.push(['warn', 'Add a battery backup. Every server we install gets one so outages don’t corrupt data.']);
    if (wifi.length && !has('lite8poe')) out.push(['warn', 'The U7 access points are powered over the network cable. Add the Lite 8 PoE switch.']);
    if (has('ucg-ultra') && !wifi.length) out.push(['info', 'The Cloud Gateway Ultra has no Wi-Fi of its own. Add an access point, or keep your current Wi-Fi.']);
    if (ai.length) out.push(['info', 'Local AI models are useful for private tasks but don’t match Claude or ChatGPT. Big jobs can still go there when you choose.']);
    return out;
  }
  function listText() {
    const t = P.totals(items());
    const lines = state.items.map(i => {
      const p = parts[i.id], r = p.low === p.high ? m(p.low * i.qty) : `${m(p.low * i.qty)}–${m(p.high * i.qty)}`;
      return `${i.qty}× ${p.name} — ${r} — ${p.url}`;
    });
    return `Perseus Lab build: ${P.presets[state.preset].name}\n${lines.join('\n')}\nParts total: ${m(t.low)}–${m(t.high)} before tax and shipping (prices from ${P.rules.priceDate}).`;
  }
  window.PERSEUS_BUILD = () => listText() + `\nWants it to: ${[...state.needs].join(', ') || 'not picked'}\nFor: ${state.sit || 'not picked'}\nWay to buy: ${state.way}`;
  function save() {
    try { localStorage.setItem('perseus-build-v2', JSON.stringify({ needs: [...state.needs], sit: state.sit, preset: state.preset, items: state.items, way: state.way, applied: state.applied })); } catch (e) {}
  }

  // ---------- views ----------
  const pick = (k, title, line, icon, pressed, attr) =>
    `<button type="button" class="pk" ${attr}="${k}" aria-pressed="${pressed}">${svg(I[icon])}<b>${esc(title)}</b><span>${esc(line)}</span></button>`;

  function viewNeeds() {
    return `<div class="view"><h1>What do you want it to do?</h1><p class="lede">Pick as many as you like. You can change them later.</p>
      <div class="picks">${NEEDS.map(([k, t, l, i]) => pick(k, t, l, i, state.needs.has(k), 'data-need')).join('')}</div></div>`;
  }
  function viewWho() {
    return `<div class="view"><h1>Who is it for?</h1><p class="lede">This decides how big we go. Tap one.</p>
      <div class="picks five">${SITS.map(([k, t, l, i]) => pick(k, t, l, i, state.sit === k, 'data-sit')).join('')}</div></div>`;
  }
  function rigHTML(still) {
    const groups = Object.keys(P.groupNames), seen = {};
    for (const it of state.items) { const g = parts[it.id].group; (seen[g] = seen[g] || []).push(it); }
    const order = ['ai', 'hub', 'radio', 'gateway', 'wifi', 'switch', 'nas', 'drive', 'ups', 'display', 'device'].filter(g => seen[g]);
    return order.map((g, n) => {
      const list = seen[g], qty = list.reduce((a, i) => a + i.qty, 0);
      const sub = g === 'device' ? `${qty} sensors, lights and more` : (qty > 1 ? qty + ' × ' : '') + parts[list[0].id].name;
      return `<div class="mod" style="${still ? 'animation:none;opacity:1' : `animation-delay:${n * 90}ms`}">${svg(I[MOD_ICON[g]])}<b>${esc(P.groupNames[g])}</b><span>${esc(sub)}</span></div>`;
    }).join('') || '<p class="small">No parts yet.</p>';
  }
  function figsHTML() {
    const t = P.totals(items()), p = P.presets[state.preset];
    return `<div class="fig2"><span>Parts if you DIY</span><b>${m(t.low)}–${m(t.high)}</b></div>
      <div class="fig2"><span>You buy, we set it up</span><b>${m(P.rules.configureLow)}–${m(P.rules.configureHigh)} <small style="font-size:14px;color:var(--muted)">+ parts</small></b></div>
      <div class="fig2 hi"><span>${p.siteVisit ? 'Done for you, before whole-home work' : 'Done for you, 3 months of Care included'}</span><b>from ${m(t.dfy)}</b></div>`;
  }
  function customHTML() {
    const groups = Object.keys(P.groupNames);
    const sorted = state.items.slice().sort((a, b) => groups.indexOf(parts[a.id].group) - groups.indexOf(parts[b.id].group));
    const rows = sorted.map(it => {
      const p = parts[it.id], g = p.group;
      const alts = Object.entries(parts).filter(([, x]) => x.group === g && g !== 'device');
      const sel = alts.length > 1
        ? `<select data-swap="${it.id}" aria-label="Swap ${esc(P.groupNames[g])}">${alts.map(([id, x]) => `<option value="${id}"${id === it.id ? ' selected' : ''}>${esc(x.name)}</option>`).join('')}</select>`
        : `<span>${esc(p.name)}</span>`;
      const qty = QTY_GROUPS.includes(g) ? `<span class="qty"><button type="button" data-dec="${it.id}" aria-label="Fewer">−</button><span>${it.qty}</span><button type="button" data-inc="${it.id}" aria-label="More">+</button></span>` : '';
      const range = p.low === p.high ? m(p.low * it.qty) : `${m(p.low * it.qty)}–${m(p.high * it.qty)}`;
      return `<div class="row"><span class="grp">${esc(P.groupNames[g])}</span>${sel}
        <span class="right">${qty}<button type="button" class="x" data-del="${it.id}" aria-label="Remove ${esc(p.name)}">×</button></span>
        <span class="meta"><span class="num">${range}</span><a href="${esc(p.url)}" rel="noopener" target="_blank">Store link</a></span>
        ${state.specs ? `<span class="spec">${esc(p.spec)}</span>` : ''}</div>`;
    }).join('');
    const present = new Set(state.items.map(i => i.id));
    const add = '<option value="">Add a part…</option>' + groups.map(g => {
      const o = Object.entries(parts).filter(([id, x]) => x.group === g && !present.has(id));
      return o.length ? `<optgroup label="${esc(P.groupNames[g])}">${o.map(([id, x]) => `<option value="${id}">${esc(x.name)} (${m(x.low)})</option>`).join('')}</optgroup>` : '';
    }).join('');
    return `<label class="switch"><input type="checkbox" id="specs"${state.specs ? ' checked' : ''}> Show specs</label>
      ${warnings().map(([k, t]) => `<div class="warn ${k === 'warn' ? '' : k}">${esc(t)}</div>`).join('')}
      ${rows}
      <div class="add"><select id="addSel" aria-label="Add a part">${add}</select><button class="btn ghost" id="addBtn" type="button">Add</button></div>
      <p class="small">Prices from our ${esc(P.rules.priceDate)} price check, before tax and shipping. Ranges run from the best current listing to the typical price. We re-check every part within 7 days of a quote.</p>`;
  }
  function viewBuild() {
    const p = P.presets[state.preset], rec = recommend(), nw = warnings().filter(w => w[0] !== 'info').length;
    const does = NEEDS.filter(([k]) => state.needs.has(k)).map(([, t]) => `<span>✓ ${esc(t)}</span>`).join('');
    return `<div class="view">
      <p class="tag" style="margin-bottom:10px;display:inline-block">${rec === state.preset ? 'Recommended for you' : 'Your pick'}</p>
      <h1>${esc(p.name)}</h1><p class="lede" style="margin-bottom:6px">${esc(p.blurb)}</p>
      ${does ? `<div class="does">${does}</div>` : ''}
      <div class="reveal" style="margin-top:20px">
        <div class="rig" id="rig" aria-label="What’s in your build">${rigHTML(false)}</div>
        <div class="figs" id="figs">${figsHTML()}</div>
      </div>
      <div class="links" aria-label="Try another starting build">${Object.entries(P.presets).map(([k, x]) => `<button type="button" class="chip" data-preset="${k}" aria-pressed="${state.preset === k}">${esc(x.name)}</button>`).join('')}</div>
      <details class="custom" id="custom"${state.customOpen ? ' open' : ''}><summary>Customize parts${nw ? ` <span class="small">(${nw} note${nw > 1 ? 's' : ''})</span>` : ''}</summary><div class="body" id="customBody">${customHTML()}</div></details>
    </div>`;
  }
  function viewGet() {
    const t = P.totals(items());
    const ways = [
      ['diy', 'Do it yourself', 'Your parts list with store links. Buy it and set it up yourself.', 'Free'],
      ['configure', 'You buy, we set it up', 'You buy the parts. We configure it remotely or in one visit, plus 30 days of support.', `${m(P.rules.configureLow)}–${m(P.rules.configureHigh)} + parts`],
      ['dfy', 'Done for you', 'We source, install with a licensed partner and hand over a guide. 3 months of Care included.', 'from ' + m(t.dfy)]
    ];
    const cta = state.way === 'diy'
      ? `<div class="btns"><button type="button" class="btn primary" id="copyBtn">Copy my parts list</button></div>
         <p class="note" id="copyMsg" role="status" hidden style="margin-top:12px"></p><textarea class="copy" id="copyBox" aria-label="Parts list to copy" hidden readonly style="margin-top:12px"></textarea>`
      : `<h2 style="font-size:26px;margin-bottom:6px">Request a quote</h2>
         <p class="small" style="margin-bottom:16px">Your build comes with the request. We’ll set up a 20-minute call and send a firm quote. No travel fee across the Phoenix metro; elsewhere, travel is added to the quote.</p>
         <form class="form quote" novalidate>
           <label>Name<input name="name" autocomplete="name" required></label>
           <label>Email<input name="email" type="email" autocomplete="email" required></label>
           <label>Phone (optional)<input name="phone" type="tel" autocomplete="tel"></label>
           <label>City<input name="city" autocomplete="address-level2"></label>
           <label class="full">Anything else?<textarea name="notes"></textarea></label>
           <div class="full btns"><button class="btn primary" type="submit">Request my quote</button><button class="btn ghost" type="button" disabled title="Deposits open after your quote call">Pay deposit (opens soon)</button></div>
           <p class="note full" role="status" hidden></p>
         </form>`;
    return `<div class="view"><h1>How do you want to get it?</h1><p class="lede">Same parts either way. Pick how much of the work you want.</p>
      <div class="ways">${ways.map(([k, ti, l, pr]) => `<button type="button" class="pk" data-way="${k}" aria-pressed="${state.way === k}"><b>${esc(ti)}</b><span>${esc(l)}</span><em class="num">${esc(pr)}</em></button>`).join('')}</div>
      <div id="cta">${cta}</div></div>`;
  }

  function render(scroll, still) {
    $('prog').innerHTML = STEPS.map((s, i) => `<div class="${i <= state.step ? 'on' : ''}"><i></i><span>${esc(s)}</span></div>`).join('');
    $('view').innerHTML = [viewNeeds, viewWho, viewBuild, viewGet][state.step]();
    if (still) { const v = $('view').querySelector('.view'); if (v) v.style.animation = 'none'; }
    const form = document.querySelector('#view form.quote'); if (form && window.PERSEUS_bindQuote) window.PERSEUS_bindQuote(form);
    $('back').style.visibility = state.step ? 'visible' : 'hidden';
    const t = P.totals(items());
    const next = $('next');
    next.hidden = state.step === 3;
    next.textContent = ['Next', 'See my build', 'How to get it', ''][state.step];
    if (state.step === 0) next.textContent = state.needs.size ? 'Next' : 'Skip';
    $('barInfo').innerHTML = state.step === 0 ? `${state.needs.size} picked`
      : state.step === 2 ? `Done for you from <b>${m(t.dfy)}</b>`
      : state.step === 3 ? `${esc(P.presets[state.preset].name)} · parts ${m(t.low)}–${m(t.high)}` : '';
    if (scroll) window.scrollTo({ top: 0, behavior: 'smooth' });
    save();
  }
  function refreshBuild() { // update the build view without replaying the reveal
    $('rig').innerHTML = rigHTML(true);
    $('figs').innerHTML = figsHTML();
    $('customBody').innerHTML = customHTML();
    const nw = warnings().filter(w => w[0] !== 'info').length;
    $('custom').querySelector('summary').innerHTML = 'Customize parts' + (nw ? ` <span class="small">(${nw} note${nw > 1 ? 's' : ''})</span>` : '');
    $('barInfo').innerHTML = `Done for you from <b>${m(P.totals(items()).dfy)}</b>`;
    save();
  }
  function go(step) {
    if (step === 2 && state.applied !== key()) { loadPreset(recommend()); state.applied = key(); }
    state.step = Math.max(0, Math.min(3, step)); render(true);
  }

  // ---------- events ----------
  document.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    const d = b.dataset;
    if (b.id === 'next') go(state.step + 1);
    else if (b.id === 'back') go(state.step - 1);
    else if (d.need) { state.needs.has(d.need) ? state.needs.delete(d.need) : state.needs.add(d.need); render(false, true); }
    else if (d.sit) { state.sit = d.sit; render(false, true); setTimeout(() => go(2), 220); }
    else if (d.preset) { loadPreset(d.preset); state.customOpen = $('custom').open; render(false, true); }
    else if (d.way) { state.way = d.way; render(false, true); }
    else if (d.inc || d.dec) { const it = state.items.find(i => i.id === (d.inc || d.dec)); it.qty = Math.max(1, Math.min(40, it.qty + (d.inc ? 1 : -1))); refreshBuild(); }
    else if (d.del) { state.items = state.items.filter(i => i.id !== d.del); refreshBuild(); }
    else if (b.id === 'addBtn') { const id = $('addSel').value; if (!id) return; state.items.push({ id, qty: parts[id].group === 'drive' ? 2 : 1 }); refreshBuild(); }
    else if (b.id === 'copyBtn') {
      const text = listText(), box = $('copyBox'), msg = $('copyMsg');
      Promise.resolve().then(() => navigator.clipboard.writeText(text))
        .then(() => { msg.hidden = false; msg.className = 'note ok'; msg.textContent = 'Parts list copied.'; box.hidden = true; })
        .catch(() => { box.hidden = false; box.value = text; box.select(); msg.hidden = false; msg.className = 'note'; msg.textContent = 'Copy didn’t work here. Select the list below and copy it.'; });
    }
  });
  document.addEventListener('change', e => {
    const t = e.target;
    if (t.dataset.swap) {
      const it = state.items.find(i => i.id === t.dataset.swap), ex = state.items.find(i => i.id === t.value);
      if (ex && ex !== it) { ex.qty += it.qty; state.items = state.items.filter(i => i !== it); } else it.id = t.value;
      refreshBuild();
    } else if (t.id === 'specs') { state.specs = t.checked; $('customBody').innerHTML = customHTML(); }
  });
  document.addEventListener('toggle', e => { if (e.target.id === 'custom') state.customOpen = e.target.open; }, true);

  // ---------- start ----------
  function fromHash() {
    const h = location.hash.slice(1);
    if (h.startsWith('need-')) { state.needs = new Set([h.slice(5)]); state.step = 0; return true; }
    if (h.startsWith('preset-') && P.presets[h.slice(7)]) { loadPreset(h.slice(7)); state.applied = key(); state.step = 2; return true; }
    return false;
  }
  if (!fromHash()) {
    let s = null; try { s = JSON.parse(localStorage.getItem('perseus-build-v2')); } catch (e) {}
    if (s && P.presets[s.preset]) {
      state.needs = new Set(s.needs || []); state.sit = s.sit || null; state.way = s.way || 'dfy'; state.applied = s.applied || '';
      loadPreset(s.preset);
      if (Array.isArray(s.items)) state.items = s.items.filter(i => parts[i.id] && i.qty > 0);
    } else loadPreset('cheapest');
  }
  window.addEventListener('hashchange', () => { if (fromHash()) render(true); });
  render();
}
