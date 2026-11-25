/* /build configurator. Needs first: what the client wants it to do picks the build.
   All prices come from assets/catalog.js. */
{
  const P = window.PERSEUS, m = P.money, parts = P.parts;
  const $ = id => document.getElementById(id);
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  const NEEDS = [
    ['smart', 'Smart home and leak alerts'], ['photos', 'Photos and files'], ['backup', 'Backups'],
    ['media', 'Movies and music'], ['cameras', 'Cameras'], ['network', 'Better Wi-Fi'], ['ai', 'Private AI']
  ];
  const SITS = [
    ['small', 'Just starting small'], ['family', 'Family cutting subscriptions'], ['office', 'Home office or creator'],
    ['privacy', 'Privacy-minded professional'], ['large', 'Larger home, whole-house']
  ];
  const ZIGBEE = ['leak', 'bulb', 'motion', 'fp300', 'soil', 'valve'];
  const QTY_GROUPS = ['device', 'drive', 'wifi'];

  const state = { needs: new Set(), sit: null, preset: 'cheapest', items: [], way: 'dfy', specs: false };

  // ---------- recommendation ----------
  function recommend() {
    const n = state.needs, s = state.sit;
    if (n.has('ai')) return s === 'large' ? 'wholehome' : 'privateai';
    if (['photos', 'backup', 'media', 'cameras', 'network'].some(k => n.has(k))) return s === 'office' ? 'storage' : 'starter';
    if (n.has('smart')) return 'cheapest';
    return { small: 'cheapest', family: 'starter', office: 'storage', privacy: 'privateai', large: 'wholehome' }[s] || 'cheapest';
  }

  function loadPreset(id) {
    state.preset = id;
    state.items = P.presets[id].items.map(([pid, qty]) => ({ id: pid, qty }));
    state.specs = !!P.presets[id].specsOpen;
    $('specs').checked = state.specs;
  }

  // ---------- warnings: flag anything more (or less) than they need ----------
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
      out.push(['warn', `More than you need: you didn’t ask for private AI, and the AI box adds at least ${m(cost)}. Remove it unless you want local AI.`]);
    }
    if (nas.length && asked && !['photos', 'backup', 'media', 'cameras'].some(k => n.has(k)))
      out.push(['warn', 'More than you need: storage is for photos, files, backups or camera footage. You didn’t pick any of those.']);
    if (drives.some(d => d.id !== 'hdd4') && asked && !['photos', 'media', 'cameras'].some(k => n.has(k)))
      out.push(['warn', 'More than you need: 4 TB drives hold most families’ photos and backups. Bigger drives make sense for video and footage.']);
    if ((ai.length || nas.length || has('n150')) && !inGroup('ups').length) out.push(['warn', 'Add a battery backup. Every server we install gets one so outages don’t corrupt data.']);
    if (wifi.length && !has('lite8poe')) out.push(['warn', 'The U7 access points are powered over the network cable. Add the Lite 8 PoE switch.']);
    if (has('ucg-ultra') && !wifi.length) out.push(['info', 'The Cloud Gateway Ultra has no Wi-Fi of its own. Add an access point, or keep your current Wi-Fi.']);
    if (ai.length) out.push(['info', 'Local AI models are useful for private tasks but don’t match Claude or ChatGPT. Big jobs can still go there when you choose.']);
    return out;
  }

  // ---------- render ----------
  function renderChips() {
    $('needs').innerHTML = NEEDS.map(([k, l]) => `<button type="button" class="chip" data-need="${k}" aria-pressed="${state.needs.has(k)}">${esc(l)}</button>`).join('');
    $('sits').innerHTML = SITS.map(([k, l]) => `<button type="button" class="chip" data-sit="${k}" aria-pressed="${state.sit === k}">${esc(l)}</button>`).join('');
    $('presetTabs').innerHTML = Object.entries(P.presets).map(([k, p]) => `<button type="button" class="chip" data-preset="${k}" aria-pressed="${state.preset === k}">${esc(p.name)}</button>`).join('');
    const p = P.presets[state.preset], rec = recommend();
    const label = rec === state.preset ? 'Recommended for you' : 'You picked';
    $('rec').innerHTML = `<span class="tag">${label}</span><strong>${esc(p.name)}</strong><p>${esc(p.blurb)}</p>`;
  }

  function renderList() {
    const groups = Object.keys(P.groupNames);
    const sorted = state.items.slice().sort((a, b) => groups.indexOf(parts[a.id].group) - groups.indexOf(parts[b.id].group));
    $('list').innerHTML = sorted.map(it => {
      const p = parts[it.id], g = p.group;
      const alts = Object.entries(parts).filter(([, x]) => x.group === g && g !== 'device');
      const pick = alts.length > 1
        ? `<select data-swap="${it.id}" aria-label="Swap ${esc(P.groupNames[g])}">${alts.map(([id, x]) => `<option value="${id}"${id === it.id ? ' selected' : ''}>${esc(x.name)}</option>`).join('')}</select>`
        : `<span class="pname">${esc(p.name)}</span>`;
      const qty = QTY_GROUPS.includes(g)
        ? `<span class="qty"><button type="button" data-dec="${it.id}" aria-label="Fewer">−</button><span>${it.qty}</span><button type="button" data-inc="${it.id}" aria-label="More">+</button></span>` : '';
      const range = p.low === p.high ? m(p.low * it.qty) : `${m(p.low * it.qty)}–${m(p.high * it.qty)}`;
      return `<div class="row">
        <span class="grp">${esc(P.groupNames[g])}</span>${pick}
        <span class="right">${qty}<button type="button" class="x" data-del="${it.id}" aria-label="Remove ${esc(p.name)}">×</button></span>
        <span class="meta"><span class="num">${range}</span><a href="${esc(p.url)}" rel="noopener" target="_blank">Store link</a></span>
        ${state.specs ? `<span class="spec">${esc(p.spec)}</span>` : ''}
      </div>`;
    }).join('') || '<p class="note">No parts yet. Pick what you want it to do above, or add a part below.</p>';

    $('warns').innerHTML = warnings().map(([k, t]) => `<div class="warn ${k === 'warn' ? '' : k}">${esc(t)}</div>`).join('');

    const present = new Set(state.items.map(i => i.id));
    $('addSel').innerHTML = '<option value="">Add a part…</option>' + groups.map(g => {
      const opts = Object.entries(parts).filter(([id, x]) => x.group === g && !present.has(id));
      return opts.length ? `<optgroup label="${esc(P.groupNames[g])}">${opts.map(([id, x]) => `<option value="${id}">${esc(x.name)} (${m(x.low)})</option>`).join('')}</optgroup>` : '';
    }).join('');
  }

  function renderSummary() {
    const t = P.totals(state.items.map(i => [i.id, i.qty]));
    const p = P.presets[state.preset];
    $('diyTotal').textContent = t.low === t.high ? m(t.low) : `${m(t.low)}–${m(t.high)}`;
    $('cfgP').textContent = `+ ${m(P.rules.configureLow)}–${m(P.rules.configureHigh)}`;
    $('dfyP').textContent = 'from ' + m(t.dfy);
    $('dfyNote').textContent = p.siteVisit
      ? 'Whole-home work is priced after a site visit'
      : `Parts + 15% sourcing + ${m(t.setup)} setup. 3 months of Care included`;
    for (const r of document.querySelectorAll('#way input')) r.checked = r.value === state.way;
    $('cta').innerHTML = state.way === 'diy'
      ? '<button type="button" class="btn primary" id="copyBtn">Copy my parts list</button>'
      : '<a class="btn primary" href="#quote">Request a quote</a>';
  }

  function listText() {
    const t = P.totals(state.items.map(i => [i.id, i.qty]));
    const lines = state.items.map(i => {
      const p = parts[i.id];
      const r = p.low === p.high ? m(p.low * i.qty) : `${m(p.low * i.qty)}–${m(p.high * i.qty)}`;
      return `${i.qty}× ${p.name} — ${r} — ${p.url}`;
    });
    return `Perseus Lab build: ${P.presets[state.preset].name}\n${lines.join('\n')}\nParts total: ${m(t.low)}–${m(t.high)} before tax and shipping (prices from ${P.rules.priceDate}).`;
  }
  window.PERSEUS_BUILD = () => listText() + `\nNeeds: ${[...state.needs].join(', ') || 'none picked'}\nWay to buy: ${state.way}`;

  function save() {
    try { localStorage.setItem('perseus-build', JSON.stringify({ needs: [...state.needs], sit: state.sit, preset: state.preset, items: state.items, way: state.way })); } catch (e) {}
  }
  function render() { renderChips(); renderList(); renderSummary(); save(); }

  // ---------- events ----------
  function applyRecommendation() { loadPreset(recommend()); render(); }

  document.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    const d = b.dataset;
    if (d.need) { state.needs.has(d.need) ? state.needs.delete(d.need) : state.needs.add(d.need); applyRecommendation(); }
    else if (d.sit) { state.sit = state.sit === d.sit ? null : d.sit; applyRecommendation(); }
    else if (d.preset) { loadPreset(d.preset); render(); }
    else if (d.inc || d.dec) {
      const it = state.items.find(i => i.id === (d.inc || d.dec));
      it.qty = Math.max(1, Math.min(40, it.qty + (d.inc ? 1 : -1))); render();
    }
    else if (d.del) { state.items = state.items.filter(i => i.id !== d.del); render(); }
    else if (b.id === 'addBtn') {
      const id = $('addSel').value; if (!id) return;
      state.items.push({ id, qty: parts[id].group === 'drive' ? 2 : 1 }); render();
    }
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
      const it = state.items.find(i => i.id === t.dataset.swap);
      const existing = state.items.find(i => i.id === t.value);
      if (existing && existing !== it) { existing.qty += it.qty; state.items = state.items.filter(i => i !== it); }
      else it.id = t.value;
      render();
    } else if (t.id === 'specs') { state.specs = t.checked; renderList(); }
    else if (t.name === 'way') { state.way = t.value; renderSummary(); save(); }
  });

  // ---------- start: hash from the home page, else last visit, else cheapest ----------
  function fromHash() {
    const h = location.hash.slice(1);
    if (h.startsWith('need-')) { state.needs = new Set([h.slice(5)]); loadPreset(recommend()); return true; }
    if (h.startsWith('preset-') && P.presets[h.slice(7)]) { loadPreset(h.slice(7)); return true; }
    return false;
  }
  if (!fromHash()) {
    let saved = null;
    try { saved = JSON.parse(localStorage.getItem('perseus-build')); } catch (e) {}
    if (saved && P.presets[saved.preset]) {
      state.needs = new Set(saved.needs || []); state.sit = saved.sit || null; state.way = saved.way || 'dfy';
      loadPreset(saved.preset);
      if (Array.isArray(saved.items)) state.items = saved.items.filter(i => parts[i.id] && i.qty > 0);
    } else loadPreset('cheapest');
  }
  window.addEventListener('hashchange', () => { if (fromHash()) render(); });
  $('priceNote').textContent = `Prices from our ${P.rules.priceDate} price check. Ranges run from the best current listing to the typical price. We re-check every part within 7 days of a quote.`;
  render();
}
