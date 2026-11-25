/* Shared page behavior: sideways card rows with arrow buttons and arrow keys. */
{
  for (const car of document.querySelectorAll('[data-car]')) {
    const box = car.closest('section') || document;
    const step = d => { const c = car.firstElementChild; if (c) car.scrollBy({ left: d * (c.offsetWidth + 16), behavior: 'smooth' }); };
    box.querySelector('[data-prev]')?.addEventListener('click', () => step(-1));
    box.querySelector('[data-next]')?.addEventListener('click', () => step(1));
    car.addEventListener('keydown', e => { if (e.key === 'ArrowRight') step(1); if (e.key === 'ArrowLeft') step(-1); });
  }
}

/* Booking: Cal.com free, one "20-minute call" event.
   Paste the event link below (e.g. 'https://cal.com/your-name/20-minute-call').
   When set, every "Book a 20-minute call" button opens Cal.com and the /business form stays as a fallback.
   When empty, the buttons scroll to the /business form. */
{
  const BOOKING_URL = '';
  if (BOOKING_URL) {
    for (const a of document.querySelectorAll('a[data-book]')) { a.href = BOOKING_URL; a.target = '_blank'; a.rel = 'noopener'; }
    for (const el of document.querySelectorAll('[data-book-only]')) { el.hidden = false; const a = el.querySelector('a'); if (a) { a.href = BOOKING_URL; a.target = '_blank'; a.rel = 'noopener'; } }
  }
}
