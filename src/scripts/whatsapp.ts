/**
 * The « typing » bubble of the WhatsApp mock-ups (ui/WhatsApp.astro, `.wa-tape`): three dots at the
 * bottom of a thread while the contact writes, as the app shows them (César 17/11). Shared by the
 * Robin phone and the Robin situations.
 */
export function ecrire(fil: HTMLElement, oui: boolean) {
  const bulle = fil.querySelector(':scope > .wa-tape');
  if (!oui) {
    bulle?.remove();
    return;
  }
  if (bulle) return;
  const b = document.createElement('div');
  b.className = 'b in fin wa-tape';
  b.setAttribute('aria-hidden', 'true');
  b.append(...Array.from({ length: 3 }, () => document.createElement('span')));
  fil.append(b);
  fil.scrollTop = fil.scrollHeight;
}
