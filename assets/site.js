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
