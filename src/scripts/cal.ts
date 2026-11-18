/**
 * The Cal.com booking, shared by /demo and the last step of the pricing form: Cal's own embed
 * loader (embed.js, queued until it arrives), themed on the DS tokens. One inline agenda per page.
 * `CAL_LINK` is also read at build time: nothing here touches `window` until `preparerCal` runs.
 */

/** Patrick's demo event. */
export const CAL_LINK = 'patrick-rakotondrajao-bjremk/presentation-hatch';

type CalApi = ((...args: unknown[]) => void) & {
  loaded?: boolean;
  ns?: Record<string, unknown>;
  q?: unknown[][];
};

/** Cal.com's loader snippet, typed: queues every call until embed.js has loaded. */
function charger(src: string) {
  const w = window as unknown as { Cal?: CalApi };
  const push = (api: CalApi, args: unknown[]) => api.q!.push(args);
  w.Cal =
    w.Cal ??
    (function (this: unknown, ...args: unknown[]) {
      const cal = w.Cal!;
      if (!cal.loaded) {
        cal.ns = {};
        cal.q = cal.q ?? [];
        const s = document.createElement('script');
        s.src = src;
        document.head.appendChild(s);
        cal.loaded = true;
      }
      if (args[0] === 'init') {
        const api: CalApi = (...a: unknown[]) => push(api, a);
        api.q = [];
        const namespace = args[1];
        if (typeof namespace === 'string') {
          cal.ns![namespace] = api;
          push(api, args);
        } else push(cal, args);
        return;
      }
      push(cal, args);
    } as CalApi);
  return w.Cal;
}

interface Options {
  /** Called once the agenda is ready to use. */
  pret?: () => void;
  /** Called when Cal.com confirms a booking. */
  reserve?: () => void;
}

/**
 * Starts the embed (loads embed.js, themes it) and returns `monter`, which (re)draws the inline
 * agenda in `selecteur` with a booking config (name, email, notes… prefill the booking form).
 */
export function preparerCal({ pret, reserve }: Options = {}) {
  const Cal = charger('https://app.cal.com/embed/embed.js');
  const token = (name: string) =>
    getComputedStyle(document.documentElement).getPropertyValue(`--color-${name}`).trim();
  Cal('init', { origin: 'https://cal.com' });
  Cal('ui', {
    theme: 'light',
    hideEventTypeDetails: false,
    layout: 'month_view',
    cssVarsPerTheme: {
      light: {
        'cal-brand': token('orange'),
        'cal-brand-emphasis': token('orange-hover'),
        'cal-brand-text': token('white'),
        'cal-text-emphasis': token('ink'),
        'cal-text': token('soft'),
        'cal-text-subtle': token('muted'),
        'cal-bg': token('surface'),
        'cal-bg-subtle': token('surface-2'),
        'cal-bg-emphasis': token('orange-tint'),
        'cal-bg-muted': token('cream'),
        'cal-border': token('line'),
        'cal-border-subtle': token('line'),
        'cal-border-booker': token('line'),
      },
    },
  });
  if (pret) Cal('on', { action: 'linkReady', callback: pret });
  if (reserve) Cal('on', { action: 'bookingSuccessfulV2', callback: reserve });

  return (selecteur: string, config: Record<string, string>) => {
    document.querySelector(selecteur)!.replaceChildren();
    Cal('inline', {
      elementOrSelector: selecteur,
      calLink: CAL_LINK,
      config: { layout: 'month_view', theme: 'light', ...config },
    });
  };
}
