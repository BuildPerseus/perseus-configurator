/* Quote form handler, shared by the home page and /build.
   Not connected yet. When the site is live on Cloudflare Pages, set QUOTE_ENDPOINT to a
   Pages Function (for example /api/quote) that emails Logan. Keep any keys in Cloudflare
   environment variables, never in this public repo. */
{
  const QUOTE_ENDPOINT = ''; // e.g. '/api/quote' once the function exists

  function bindQuote(form) {
    if (form.dataset.bound) return;
    form.dataset.bound = '1';
    const status = form.querySelector('[role=status]');
    const say = (msg, ok) => { status.hidden = false; status.textContent = msg; status.classList.toggle('ok', !!ok); };

    form.addEventListener('submit', async e => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(form));
      if (!data.name || !data.email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(data.email)) {
        say('Please add your name and a valid email.');
        return;
      }
      if (window.PERSEUS_BUILD) data.build = window.PERSEUS_BUILD();
      if (!QUOTE_ENDPOINT) {
        say('Thanks! Quote requests open very soon. This form isn’t connected yet, so nothing was sent.');
        return;
      }
      try {
        const r = await fetch(QUOTE_ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
        if (!r.ok) throw new Error(r.status);
        form.reset();
        say('Got it. We’ll reach out within two days to set up your call.', true);
      } catch (err) {
        say('Something went wrong sending that. Please try again in a minute.');
      }
    });
  }

  window.PERSEUS_bindQuote = bindQuote;
  document.querySelectorAll('form.quote').forEach(bindQuote);
}
