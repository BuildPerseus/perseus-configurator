/* Shared form handler for /quote, /build and the two /business forms.
   Every form posts to the same QUOTE_ENDPOINT. Business forms carry a hidden field
   `type` ("quick-start" or "business-waitlist"); a submission with no `type` is a home quote.
   Not connected yet. When the site is live on Cloudflare Pages, set QUOTE_ENDPOINT to a
   Pages Function (for example /api/quote) that emails Logan. Keep any keys in Cloudflare
   environment variables, never in this public repo.
   LEGAL_PAGES_APPROVED stays false until Logan has reviewed and approved /privacy and /terms.
   While it is false, no form sends anything, even if QUOTE_ENDPOINT is set. */
{
  const QUOTE_ENDPOINT = ''; // e.g. '/api/quote' once the function exists
  const LEGAL_PAGES_APPROVED = false;

  function bindQuote(form) {
    if (form.dataset.bound) return;
    form.dataset.bound = '1';
    const status = form.querySelector('[role=status]');
    const say = (msg, ok) => { status.hidden = false; status.textContent = msg; status.classList.toggle('ok', !!ok); };
    const pendingMsg = form.dataset.pending || 'Thanks! Quote requests open very soon. This form isn’t connected yet, so nothing was sent.';
    const okMsg = form.dataset.ok || 'Got it. We’ll reach out within two days to set up your call.';

    form.addEventListener('submit', async e => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(form));
      const missing = [...form.querySelectorAll('[required]')].some(f => !String(f.value).trim());
      if (missing || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(data.email || '')) {
        say(form.querySelector('[name=business][required]') ? 'Please add your name, business name and a valid email.' : 'Please add your name and a valid email.');
        return;
      }
      if (window.PERSEUS_BUILD && !data.type) data.build = window.PERSEUS_BUILD();
      if (!QUOTE_ENDPOINT || !LEGAL_PAGES_APPROVED) {
        say(pendingMsg);
        return;
      }
      try {
        const r = await fetch(QUOTE_ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
        if (!r.ok) throw new Error(r.status);
        form.reset();
        say(okMsg, true);
      } catch (err) {
        say('Something went wrong sending that. Please try again in a minute.');
      }
    });
  }

  window.PERSEUS_bindQuote = bindQuote;
  document.querySelectorAll('form.quote').forEach(bindQuote);
}
