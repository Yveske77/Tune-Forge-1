
function clamp(x, a, b) { return Math.max(a, Math.min(b, x)); }

function getVal(source, ctx) {
  if (!source) return null;
  if (typeof source === 'number') return source;
  if (typeof source === 'string') {
    const parts = source.split('.');
    const root = parts[0];

    // prev.energy
    if (root === 'prev') return ctx.prev?.[parts[1]];
    // next.energy
    if (root === 'next') return ctx.next?.[parts[1]];

    // mem.Chorus1.energy
    if (root === 'mem' && parts.length === 3) {
        // parts[1] is like "Chorus1"
        // parts[2] is "energy"
        return ctx.memory?.[parts[1]]?.[parts[2]];
    }
  }
  return null;
}

export function applyRule(rule, ctx, fallback) {
  if (!rule) return fallback;
  const cap = rule.cap || [0, 100];
  const lo = cap[0] ?? 0;
  const hi = cap[1] ?? 100;

  const fromVal = rule.from ? getVal(rule.from, ctx) : null;
  const base = fromVal === null || fromVal === undefined ? fallback : fromVal;

  const op = rule.op || 'set';
  const v = rule.value;

  let out = fallback;

  switch (op) {
    case 'set':
      out = (typeof v === 'number') ? v : base;
      break;
    case 'copy':
      out = base;
      break;
    case 'add':
      out = (base ?? 0) + (v ?? 0);
      break;
    case 'sub':
      out = (base ?? 0) - (v ?? 0);
      break;
    case 'mul':
      out = (base ?? 0) * (v ?? 1);
      break;
    case 'max':
      out = Math.max((base ?? 0), (v ?? 0));
      break;
    case 'min':
      out = Math.min((base ?? 0), (v ?? 0));
      break;
    case 'context_add': {
      const prevType = (ctx.prevType || '');
      const add = (prevType === (rule.ifPrevType || '') ? (rule.value ?? 0) : (rule.else ?? 0));
      out = (base ?? 0) + add;
      break;
    }
    case 'context_set': {
       const cmp = (getVal(rule.from, ctx) ?? base ?? 0);
       const ifGte = rule.ifGte ?? 0;
       out = (cmp >= ifGte) ? (rule.then ?? fallback) : (rule.else ?? fallback);
       break;
    }
    case 'phase_add': {
        // rule.phase can be "early" | "mid" | "final"
        // ctx.phase should be one of those
        if (ctx.phase === rule.phase) {
            out = (base ?? 0) + (v ?? 0);
        } else {
            out = base ?? 0;
        }
        break;
    }
    default:
      out = base;
  }

  if (!Number.isFinite(out)) out = fallback;
  out = Math.max(lo, Math.min(hi, out));
  return out;
}

export function buildMemory(sections, currentIndex) {
    // Scan sections before currentIndex to build memory map
    // e.g. { Chorus1: { energy: 80... }, Chorus2: ... }
    const memory = {};
    const counts = {};

    for (let i = 0; i < currentIndex; i++) {
        const sec = sections[i];
        const type = sec.type || 'Section'; // e.g. "Chorus"

        if (!counts[type]) counts[type] = 0;
        counts[type]++;

        const key = `${type}${counts[type]}`; // Chorus1, Verse1...
        memory[key] = { ...sec.lanes };
    }
    return memory;
}

export function computePhase(index, total) {
    if (!total || total < 3) return 'early';
    const t = index / total;
    if (t < 0.33) return 'early';
    if (t > 0.66) return 'final';
    return 'mid';
}

export function computeAdaptiveLanes(block, ctx) {
    // ctx needs: prev (lanes), next (lanes), prevType, phase, memory
    const rules = block.adaptiveRules || null;
    if (!rules) return { ...(block.lanes || {}) };

    const baseLanes = block.lanes || {};

    // Helper to get fallback for a specific lane
    const getFallback = (key) => {
        return baseLanes[key] ?? (ctx.prev?.[key] ?? 50);
    };

    const energy = applyRule(rules.energy, ctx, getFallback('energy'));
    const density = applyRule(rules.density, ctx, getFallback('density'));
    const brightness = applyRule(rules.brightness, ctx, getFallback('brightness'));
    const vocalPresence = applyRule(rules.vocalPresence, ctx, getFallback('vocalPresence'));

    return { energy, density, brightness, vocalPresence };
}
