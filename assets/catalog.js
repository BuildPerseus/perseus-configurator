/* Perseus Lab parts catalog.
   Source: HQ hardware price check, Nov 18, 2026 (US street prices, before tax and shipping).
   low = best current listing, high = list or typical listing. Re-quote within 7 days of any client quote.
   This is the ONE place prices live. The home page and /build both read from it.
   Store links are plain links today (not affiliate). When an affiliate program approves us,
   add the disclosure next to the link before swapping the URL. */
window.PERSEUS = (function () {
  const amz = q => 'https://www.amazon.com/s?k=' + encodeURIComponent(q);

  const parts = {
    // Brain: runs Home Assistant and the automations
    'ha-green':   { group: 'hub', name: 'Home Assistant Green', low: 139, high: 199, spec: 'Quad-core ARM, 4 GB RAM, 32 GB storage. Runs Home Assistant out of the box.', url: 'https://www.home-assistant.io/green/' },
    'n150':       { group: 'hub', name: 'Beelink EQ14 (Intel N150) 16 GB / 500 GB', low: 199, high: 349, spec: 'Intel N150, 16 GB RAM, 500 GB SSD. Room for Home Assistant plus photo and backup apps.', url: amz('Beelink EQ14 N150 16GB 500GB') },
    // Radio for Zigbee/Thread devices
    'zbt2':       { group: 'radio', name: 'Home Assistant Connect ZBT-2', low: 49, high: 49, spec: 'USB radio for Zigbee or Thread sensors and bulbs.', url: amz('Home Assistant Connect ZBT-2') },
    // Private AI box
    'mac-m6':     { group: 'ai', name: 'Mac mini M6 16 GB / 256 GB', low: 899, high: 899, spec: '16 GB unified memory, 256 GB SSD. Small local models only.', url: 'https://www.apple.com/mac-mini/' },
    'r8845':      { group: 'ai', name: 'Ryzen 7 8845HS mini PC 32 GB / 1 TB', low: 829, high: 939, spec: '32 GB RAM, 1 TB SSD. Small to mid local models.', url: amz('Ryzen 7 8845HS mini PC 32GB 1TB') },
    'mac-m5pro':  { group: 'ai', name: 'Mac mini M5 Pro 24 GB / 512 GB', low: 1699, high: 1699, spec: '24 GB unified memory, 512 GB SSD. Mid-size local models.', url: 'https://www.apple.com/mac-mini/' },
    'r395':       { group: 'ai', name: 'GMKtec EVO-X2 (Ryzen AI Max+ 395) 128 GB', low: 3500, high: 3800, big: true, spec: '128 GB unified memory. Larger local models and several at once.', url: amz('GMKtec EVO-X2 Ryzen AI Max+ 395 128GB') },
    'dgx64':      { group: 'ai', name: 'NVIDIA DGX Spark 64 GB', low: 4999, high: 4999, big: true, spec: '64 GB unified memory, NVIDIA software stack. Sold through partners.', url: amz('NVIDIA DGX Spark') },
    // Network
    'ucg-ultra':  { group: 'gateway', name: 'UniFi Cloud Gateway Ultra', low: 129, high: 136, spec: 'Router and firewall. Needs a separate Wi-Fi access point.', url: amz('UniFi Cloud Gateway Ultra') },
    'express7':   { group: 'gateway', name: 'UniFi Express 7', low: 199, high: 220, spec: 'Router plus Wi-Fi 7 in one box. Good for smaller homes.', url: amz('UniFi Express 7') },
    'u7lite':     { group: 'wifi', name: 'UniFi U7 Lite access point', low: 99, high: 99, spec: 'Wi-Fi 7, ceiling mount, powered by the PoE switch.', url: amz('UniFi U7 Lite') },
    'u7pro':      { group: 'wifi', name: 'UniFi U7 Pro access point', low: 189, high: 189, spec: 'Wi-Fi 7 with 6 GHz, ceiling mount, powered by the PoE switch.', url: amz('UniFi U7 Pro') },
    'flexmini':   { group: 'switch', name: 'UniFi Flex Mini 2.5G switch', low: 49, high: 65, spec: '5 ports, no PoE.', url: amz('UniFi Flex Mini 2.5G') },
    'lite8poe':   { group: 'switch', name: 'UniFi Switch Lite 8 PoE', low: 109, high: 109, spec: '8 ports, powers access points and cameras over the cable.', url: amz('UniFi Switch Lite 8 PoE') },
    // Storage
    'unas2':      { group: 'nas', name: 'UniFi UNAS 2', low: 199, high: 219, spec: '2 drive bays. Photos, files and backups for the house.', url: amz('UniFi UNAS 2') },
    'dxp2800':    { group: 'nas', name: 'UGREEN NASync DXP2800', low: 297, high: 350, spec: '2 drive bays, Intel N100, runs extra apps.', url: amz('UGREEN DXP2800') },
    'hdd4':       { group: 'drive', name: '4 TB NAS hard drive (CMR)', low: 190, high: 210, spec: 'CMR NAS drive. Bought in pairs so one mirrors the other.', url: amz('4TB NAS hard drive CMR') },
    'hdd8':       { group: 'drive', name: '8 TB NAS hard drive (CMR)', low: 345, high: 365, spec: 'CMR NAS drive. Bought in pairs so one mirrors the other.', url: amz('8TB NAS hard drive CMR') },
    'hdd12':      { group: 'drive', name: '12 TB NAS hard drive (CMR)', low: 460, high: 535, spec: 'CMR NAS drive. Bought in pairs so one mirrors the other.', url: amz('12TB NAS hard drive CMR') },
    // Power
    'apc600':     { group: 'ups', name: 'APC BE600M1 battery backup', low: 84, high: 100, spec: '600 VA. Keeps a small server up through blips and shuts it down safely.', url: amz('APC BE600M1') },
    'cp1500':     { group: 'ups', name: 'CyberPower CP1500PFCLCD battery backup', low: 190, high: 275, spec: '1500 VA. Sized for an AI box plus network gear.', url: amz('CyberPower CP1500PFCLCD') },
    // Wall display
    'firehd10':   { group: 'display', name: 'Fire HD 10 wall dashboard', low: 73, high: 155, spec: 'Tablet on the wall showing the home dashboard.', url: amz('Fire HD 10 tablet') },
    // Devices
    'leak':       { group: 'device', name: 'Zigbee water leak sensor', low: 15, high: 21, spec: 'Under sinks, water heater, washer. Alerts your phone.', url: amz('Zigbee water leak sensor') },
    'bulb':       { group: 'device', name: 'IKEA KAJPLATS smart bulb (Thread)', low: 8, high: 13, spec: 'Lights that follow schedules and motion.', url: amz('IKEA KAJPLATS bulb') },
    'motion':     { group: 'device', name: 'SONOFF motion sensor', low: 15, high: 15, spec: 'Turns lights on and off as you move through rooms.', url: amz('SONOFF Zigbee motion sensor') },
    'fp300':      { group: 'device', name: 'Aqara FP300 presence sensor', low: 50, high: 50, spec: 'Knows someone is still in the room, even sitting still.', url: amz('Aqara FP300 presence sensor') },
    'ecobee':     { group: 'device', name: 'ecobee Essential thermostat', low: 110, high: 140, spec: 'Thermostat that runs on your schedule.', url: amz('ecobee Essential thermostat') },
    'reolink':    { group: 'device', name: 'Reolink E1 Pro camera', low: 55, high: 70, spec: 'Indoor camera. Footage stays on your own storage.', url: amz('Reolink E1 Pro') },
    'havoice':    { group: 'device', name: 'Home Assistant Voice Preview Edition', low: 59, high: 59, spec: 'Voice control for the house, run by your own server.', url: amz('Home Assistant Voice Preview Edition') },
    'roborock':   { group: 'device', name: 'Roborock Q5 robot vacuum', low: 180, high: 279, spec: 'Runs on a schedule or when everyone leaves.', url: amz('Roborock Q5') },
    'soil':       { group: 'device', name: 'THIRDREALITY soil moisture sensor', low: 20, high: 20, spec: 'Tells you when plants or beds are dry.', url: amz('THIRDREALITY soil moisture sensor') },
    'valve':      { group: 'device', name: 'SONOFF garden water valve', low: 30, high: 36, spec: 'Waters on a schedule, skips when the soil is wet.', url: amz('SONOFF Zigbee water valve') }
  };

  const groupNames = {
    hub: 'Brain', radio: 'Radio', ai: 'Private AI box', gateway: 'Router', wifi: 'Wi-Fi', switch: 'Switch',
    nas: 'Storage box', drive: 'Drives', ups: 'Battery backup', display: 'Wall dashboard', device: 'Devices'
  };

  const starterDevices = [['leak', 4], ['bulb', 8], ['motion', 3], ['ecobee', 1], ['reolink', 1], ['havoice', 1]];
  const starterCore = [['n150', 1], ['zbt2', 1], ['ucg-ultra', 1], ['u7pro', 1], ['lite8poe', 1], ['unas2', 1], ['hdd4', 2], ['apc600', 1], ['firehd10', 1]];

  const presets = {
    cheapest: {
      name: 'Cheapest that works', who: 'Starting small or smart home only',
      blurb: 'A hub, a radio, leak alerts and smart lights. No storage, no AI, nothing you won’t use.',
      items: [['ha-green', 1], ['zbt2', 1], ['leak', 3], ['bulb', 4], ['motion', 1]]
    },
    starter: {
      name: 'Starter lab', who: 'Families cutting subscriptions',
      blurb: 'Smart home, a proper network, and mirrored storage for the family’s photos and files.',
      items: starterCore.concat(starterDevices)
    },
    storage: {
      name: 'Starter lab + storage', who: 'Home offices and creators',
      blurb: 'The Starter lab with bigger drives for client files, footage and backups.',
      items: starterCore.map(([id, q]) => id === 'hdd4' ? ['hdd8', q] : [id, q]).concat(starterDevices)
    },
    privateai: {
      name: 'Private AI', who: 'Privacy-minded professionals',
      blurb: 'Everything in the Starter lab plus a 128 GB AI box, more storage and a bigger battery backup.',
      specsOpen: true,
      items: [['n150', 1], ['zbt2', 1], ['r395', 1], ['ucg-ultra', 1], ['u7pro', 2], ['lite8poe', 1], ['dxp2800', 1], ['hdd8', 4], ['cp1500', 1], ['firehd10', 1]].concat(starterDevices)
    },
    wholehome: {
      name: 'Private AI + whole home', who: 'Larger homes',
      blurb: 'Starts from the Private AI build. Wiring, extra rooms and outdoor areas are quoted after a site visit.',
      specsOpen: true, siteVisit: true,
      items: [['n150', 1], ['zbt2', 1], ['r395', 1], ['ucg-ultra', 1], ['u7pro', 2], ['lite8poe', 1], ['dxp2800', 1], ['hdd8', 4], ['cp1500', 1], ['firehd10', 1]].concat(starterDevices)
    }
  };

  // Business rules from the HQ brief (Nov 24, 2026)
  const rules = {
    sourcing: 0.15,          // done for you: hardware + 15% sourcing
    setupMin: 1500,          // setup minimum
    setupBigAI: 3500,        // setup minimum with a large AI box
    configureLow: 500, configureHigh: 750, // you buy, we configure
    careLow: 150, careHigh: 250,           // Care plan per month after the 3 included months
    priceDate: 'Nov 18, 2026'
  };

  function totals(items) {
    let low = 0, high = 0, big = false;
    for (const [id, q] of items) {
      const p = parts[id]; if (!p || q < 1) continue;
      low += p.low * q; high += p.high * q; if (p.big) big = true;
    }
    const setup = big ? rules.setupBigAI : rules.setupMin;
    const dfy = Math.round(low * (1 + rules.sourcing) + setup);
    return { low, high, big, setup, dfy };
  }

  const money = n => '$' + Math.round(n).toLocaleString('en-US');

  // Plain-English summary of a build, for preset cards and the builder reveal
  const deviceWords = { leak: 'leak sensors', bulb: 'smart bulbs', motion: 'motion sensors', fp300: 'presence sensor', ecobee: 'thermostat',
    reolink: 'camera', havoice: 'voice assistant', roborock: 'robot vacuum', soil: 'soil sensor', valve: 'garden valve' };
  function highlights(items) {
    const has = g => items.filter(([id, q]) => parts[id] && parts[id].group === g && q > 0);
    const out = [];
    const ai = has('ai'); if (ai.length) out.push('Private AI box: ' + parts[ai[0][0]].name);
    const hub = has('hub'); if (hub.length) out.push('Brain: ' + parts[hub[0][0]].name);
    if (has('gateway').length) out.push('Whole-home router' + (has('wifi').length ? ' and Wi-Fi 7' : ''));
    const dr = has('drive');
    if (has('nas').length && dr.length) { const n = dr.reduce((a, [, q]) => a + q, 0), tb = parts[dr[0][0]].name.match(/\d+/)[0]; out.push(`${n} × ${tb} TB drives, mirrored`); }
    if (has('ups').length) out.push('Battery backup');
    const dev = has('device');
    if (dev.length) {
      const n = dev.reduce((a, [, q]) => a + q, 0);
      out.push(`${n} devices: ` + dev.slice(0, 4).map(([id]) => deviceWords[id] || parts[id].name).join(', ') + (dev.length > 4 ? ' and more' : ''));
    }
    return out;
  }

  return { parts, groupNames, presets, rules, totals, money, highlights };
})();
