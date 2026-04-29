/**
 * Hatch animal mascots — 6 birds rendered as React components.
 *
 * Ported from the JSX renderers in `_reference/hatch_landing_page.html`
 * (lines ~2713-3030). Original implementation used React + ReactDOM + Babel
 * via CDN at runtime; here we leverage @astrojs/react so JSX is transpiled at
 * build time and the SVG is server-rendered into static HTML — no client-side
 * Babel, no React hydration cost (the birds are static; tab switching is
 * handled by a tiny inline script that toggles visibility).
 *
 * Keep these components pure SVG generators. Do not introduce state or
 * effects — they should be cheap to render and trivial to inline-print.
 */

import React from 'react';

type BirdProps = {
  size?: number;
  showLabel?: boolean;
  feet?: boolean;
};

type BirdInternalProps = BirdProps & {
  bodyTop: string;
  bodyMid: string;
  bodyBot: string;
  wing: string;
  wingShadow: string;
  haloColor: string;
  beakColor?: string;
  beakDark?: string;
  beakHighlight?: string;
  cheekColor?: string | null;
  feetColor?: string | null;
  headpiece?: React.ReactNode;
  eyeStyle?: 'default' | 'closed' | 'sparkle' | 'focused';
  eyeOffsetY?: number;
  bodyOverlay?: React.ReactNode;
  beakStyle?: 'curved' | 'small' | 'hooked';
  bellyColor?: string | null;
  showPlumage?: boolean;
  name: string;
  role: string;
  accent?: string;
};

const cx = 200,
  cy = 210;

// ── Shared helpers ──────────────────────────────────────────────
const FeatherWing = ({
  x,
  y,
  rotate = 0,
  fill,
  shadow,
  flip = false,
}: {
  x: number;
  y: number;
  rotate?: number;
  fill: string;
  shadow: string;
  flip?: boolean;
}) => {
  const s = flip ? -1 : 1;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${s} 1)`}>
      <path
        d="M 0 0 C 4 -28, 30 -34, 48 -18 C 60 -6, 58 14, 40 26 C 24 36, 4 32, -6 18 C -12 8, -8 -4, 0 0 Z"
        fill={fill}
        stroke={shadow}
        strokeWidth="0.8"
      />
      <path
        d="M -2 4 Q 22 4 44 -10"
        stroke={shadow}
        strokeWidth="1.4"
        fill="none"
        opacity="0.55"
        strokeLinecap="round"
      />
      <g stroke={shadow} strokeWidth="0.8" fill="none" opacity="0.45" strokeLinecap="round">
        <path d="M 6 4 Q 10 -2 14 -8" />
        <path d="M 14 4 Q 18 -2 24 -10" />
        <path d="M 22 2 Q 26 -4 32 -12" />
        <path d="M 30 0 Q 34 -6 40 -14" />
        <path d="M 6 6 Q 10 14 12 22" />
        <path d="M 14 6 Q 18 14 22 22" />
        <path d="M 22 4 Q 26 12 30 20" />
      </g>
    </g>
  );
};

const Beak = ({
  cx: bx,
  cy: by,
  variant = 'curved',
  uid,
  dark,
}: {
  cx: number;
  cy: number;
  variant?: 'curved' | 'small' | 'hooked';
  uid: string;
  dark: string;
}) => {
  if (variant === 'small')
    return (
      <g>
        <path
          d={`M ${bx - 10} ${by + 1} Q ${bx - 8} ${by - 4} ${bx - 3} ${by - 5} L ${bx + 3} ${by - 5} Q ${bx + 8} ${by - 4} ${bx + 10} ${by + 1} Q ${bx + 8} ${by + 6} ${bx + 1} ${by + 9} Q ${bx - 1} ${by + 9} ${bx - 1} ${by + 7} Q ${bx - 8} ${by + 5} ${bx - 10} ${by + 1} Z`}
          fill={`url(#beak-${uid})`}
          stroke={dark}
          strokeWidth="1"
          strokeLinejoin="round"
        />
        <path
          d={`M ${bx} ${by - 4} L ${bx} ${by + 7}`}
          stroke={dark}
          strokeWidth="0.6"
          fill="none"
          opacity="0.4"
        />
        <ellipse cx={bx - 3.5} cy={by} rx="0.9" ry="0.6" fill={dark} opacity="0.7" />
        <path
          d={`M ${bx - 7} ${by + 5} Q ${bx} ${by + 11} ${bx + 7} ${by + 5} Q ${bx} ${by + 8} ${bx - 7} ${by + 5} Z`}
          fill={`url(#beakLow-${uid})`}
          stroke={dark}
          strokeWidth="0.7"
          strokeLinejoin="round"
        />
        <path
          d={`M ${bx - 9} ${by + 4} Q ${bx} ${by + 6} ${bx + 9} ${by + 4}`}
          stroke={dark}
          strokeWidth="0.8"
          fill="none"
          strokeLinecap="round"
        />
      </g>
    );
  if (variant === 'hooked')
    return (
      <g>
        <path
          d={`M ${bx - 15} ${by - 3} Q ${bx - 13} ${by - 11} ${bx - 4} ${by - 12} L ${bx + 4} ${by - 12} Q ${bx + 13} ${by - 11} ${bx + 15} ${by - 3} Q ${bx + 14} ${by + 6} ${bx + 9} ${by + 12} Q ${bx + 5} ${by + 19} ${bx + 1} ${by + 19} Q ${bx - 2} ${by + 18} ${bx - 2} ${by + 14} Q ${bx + 1} ${by + 12} ${bx + 2} ${by + 9} Q ${bx - 8} ${by + 6} ${bx - 13} ${by + 3} Q ${bx - 15} ${by} ${bx - 15} ${by - 3} Z`}
          fill={`url(#beak-${uid})`}
          stroke={dark}
          strokeWidth="1.1"
          strokeLinejoin="round"
        />
        <path
          d={`M ${bx} ${by - 11} Q ${bx + 1} ${by - 2} ${bx + 4} ${by + 7}`}
          stroke={dark}
          strokeWidth="0.7"
          fill="none"
          opacity="0.45"
        />
        <path
          d={`M ${bx - 13} ${by - 6} Q ${bx} ${by - 9} ${bx + 13} ${by - 6}`}
          stroke={dark}
          strokeWidth="0.6"
          fill="none"
          opacity="0.5"
        />
        <ellipse cx={bx - 7} cy={by - 3} rx="1.6" ry="1.1" fill={dark} opacity="0.75" />
        <path
          d={`M ${bx - 10} ${by + 6} Q ${bx - 6} ${by + 13} ${bx + 1} ${by + 13} Q ${bx + 6} ${by + 12} ${bx + 8} ${by + 9} Q ${bx} ${by + 10} ${bx - 10} ${by + 6} Z`}
          fill={`url(#beakLow-${uid})`}
          stroke={dark}
          strokeWidth="0.9"
          strokeLinejoin="round"
        />
        <path
          d={`M ${bx - 14} ${by + 4} Q ${bx} ${by + 7} ${bx + 11} ${by + 8}`}
          stroke={dark}
          strokeWidth="1"
          fill="none"
          opacity="0.85"
          strokeLinecap="round"
        />
      </g>
    );
  return (
    <g>
      <path
        d={`M ${bx - 14} ${by + 1} Q ${bx - 12} ${by - 7} ${bx - 4} ${by - 9} L ${bx + 4} ${by - 9} Q ${bx + 12} ${by - 7} ${bx + 14} ${by + 1} Q ${bx + 12} ${by + 9} ${bx + 5} ${by + 14} Q ${bx + 1} ${by + 17} ${bx} ${by + 18} Q ${bx - 1} ${by + 17} ${bx - 5} ${by + 14} Q ${bx - 12} ${by + 9} ${bx - 14} ${by + 1} Z`}
        fill={`url(#beak-${uid})`}
        stroke={dark}
        strokeWidth="1"
        strokeLinejoin="round"
      />
      <path
        d={`M ${bx} ${by - 8} L ${bx} ${by + 16}`}
        stroke={dark}
        strokeWidth="0.7"
        fill="none"
        opacity="0.35"
      />
      <ellipse cx={bx - 4} cy={by - 3} rx="1" ry="0.7" fill={dark} opacity="0.7" />
      <ellipse cx={bx + 4} cy={by - 3} rx="1" ry="0.7" fill={dark} opacity="0.7" />
      <path
        d={`M ${bx - 13} ${by + 3} Q ${bx} ${by + 6} ${bx + 13} ${by + 3}`}
        stroke={dark}
        strokeWidth="1"
        fill="none"
        opacity="0.9"
        strokeLinecap="round"
      />
      <path
        d={`M ${bx - 9} ${by + 5} Q ${bx - 5} ${by + 13} ${bx} ${by + 16} Q ${bx + 5} ${by + 13} ${bx + 9} ${by + 5} Q ${bx} ${by + 8} ${bx - 9} ${by + 5} Z`}
        fill={`url(#beakLow-${uid})`}
        stroke={dark}
        strokeWidth="0.85"
        strokeLinejoin="round"
        opacity="0.95"
      />
      <path
        d={`M ${bx - 9} ${by - 3} Q ${bx - 5} ${by - 6} ${bx - 2} ${by - 7}`}
        stroke="#fff"
        strokeWidth="1.1"
        fill="none"
        opacity="0.55"
        strokeLinecap="round"
      />
      <circle cx={bx} cy={by + 16} r="0.8" fill="#fff" opacity="0.4" />
    </g>
  );
};

const Eye = ({
  cx: ex,
  cy: ey,
  uid,
  sparkle = false,
  small = false,
}: {
  cx: number;
  cy: number;
  uid: string;
  sparkle?: boolean;
  small?: boolean;
}) => {
  const r = small ? 10 : 14;
  return (
    <g>
      <path
        d={`M ${ex - r - 1} ${ey - r * 0.2} Q ${ex} ${ey - r - 3} ${ex + r + 1} ${ey - r * 0.2}`}
        stroke="#1a1a22"
        strokeWidth="1.6"
        fill="none"
        opacity="0.65"
        strokeLinecap="round"
      />
      <circle cx={ex} cy={ey} r={r} fill={`url(#eye-${uid})`} />
      <circle cx={ex} cy={ey} r={r * 0.62} fill="#1a1622" opacity="0.7" />
      <circle cx={ex + 3} cy={ey - 4} r={small ? 3 : 4.2} fill="#fff" />
      <circle cx={ex - 3.5} cy={ey + 4} r={small ? 1.6 : 2.2} fill="#cfd2da" opacity="0.85" />
      {sparkle && <circle cx={ex - 6} cy={ey - 6} r="1.2" fill="#fff" />}
    </g>
  );
};

const Crest = ({
  x,
  y,
  colors,
  count = 3,
  scale = 1,
  lean = 0,
}: {
  x: number;
  y: number;
  colors: string[];
  count?: number;
  scale?: number;
  lean?: number;
}) => (
  <g transform={`translate(${x} ${y})`}>
    {Array.from({ length: count }).map((_, i) => {
      const dx = (i - (count - 1) / 2) * 13 * scale;
      const lean_i = lean + (i - (count - 1) / 2) * 6;
      const fill = colors[i % colors.length];
      const dark = colors[colors.length - 1];
      return (
        <g key={i} transform={`translate(${dx} 0) rotate(${lean_i})`}>
          <path
            d="M 0 4 Q -4 -10 -1 -28 Q 0 -34 1 -28 Q 4 -10 0 4 Z"
            fill={fill}
            stroke={dark}
            strokeWidth="0.6"
            transform={`scale(${scale})`}
          />
          <path
            d="M 0 -4 Q -1 -14 0 -24"
            stroke={dark}
            strokeWidth="0.5"
            fill="none"
            opacity="0.6"
            transform={`scale(${scale})`}
          />
        </g>
      );
    })}
  </g>
);

const Bird = ({
  size = 280,
  bodyTop,
  bodyMid,
  bodyBot,
  wing,
  wingShadow,
  haloColor,
  beakColor = '#f0a04b',
  beakDark = '#a85d1a',
  beakHighlight = '#ffd9a8',
  cheekColor = null,
  feet = true,
  feetColor = null,
  headpiece = null,
  eyeStyle = 'default',
  eyeOffsetY = 0,
  bodyOverlay = null,
  beakStyle = 'curved',
  bellyColor = null,
  showPlumage = true,
  name,
  role,
  accent = '#111',
  showLabel = true,
}: BirdInternalProps) => {
  const r = 150;
  const uid = React.useId().replace(/[^a-zA-Z0-9]/g, '');
  return (
    <div
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 12,
      }}
    >
      <svg width={size} height={size} viewBox="0 0 400 400" style={{ overflow: 'visible' }}>
        <defs>
          <radialGradient id={`halo-${uid}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={haloColor} stopOpacity="0.55" />
            <stop offset="55%" stopColor={haloColor} stopOpacity="0.18" />
            <stop offset="100%" stopColor={haloColor} stopOpacity="0" />
          </radialGradient>
          <radialGradient id={`body-${uid}`} cx="38%" cy="30%" r="80%">
            <stop offset="0%" stopColor={bodyTop} />
            <stop offset="55%" stopColor={bodyMid} />
            <stop offset="100%" stopColor={bodyBot} />
          </radialGradient>
          <radialGradient id={`bodyShade-${uid}`} cx="50%" cy="100%" r="65%">
            <stop offset="0%" stopColor={bodyBot} stopOpacity="0.7" />
            <stop offset="55%" stopColor={bodyBot} stopOpacity="0.18" />
            <stop offset="100%" stopColor={bodyBot} stopOpacity="0" />
          </radialGradient>
          {bellyColor && (
            <radialGradient id={`belly-${uid}`} cx="50%" cy="78%" r="40%">
              <stop offset="0%" stopColor={bellyColor} stopOpacity="0.85" />
              <stop offset="80%" stopColor={bellyColor} stopOpacity="0" />
            </radialGradient>
          )}
          <linearGradient id={`wing-${uid}`} x1="20%" y1="0%" x2="80%" y2="100%">
            <stop offset="0%" stopColor={wing} />
            <stop offset="100%" stopColor={wingShadow} />
          </linearGradient>
          <radialGradient id={`shine-${uid}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" />
            <stop offset="60%" stopColor="#ffffff" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
          <radialGradient id={`shadow-${uid}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#000" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#000" stopOpacity="0" />
          </radialGradient>
          {cheekColor && (
            <radialGradient id={`cheek-${uid}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={cheekColor} stopOpacity="0.85" />
              <stop offset="100%" stopColor={cheekColor} stopOpacity="0" />
            </radialGradient>
          )}
          <radialGradient id={`eye-${uid}`} cx="35%" cy="35%" r="75%">
            <stop offset="0%" stopColor="#3a3a44" />
            <stop offset="100%" stopColor="#0a0a10" />
          </radialGradient>
          <linearGradient id={`beak-${uid}`} x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor={beakHighlight} />
            <stop offset="55%" stopColor={beakColor} />
            <stop offset="100%" stopColor={beakDark} />
          </linearGradient>
          <linearGradient id={`beakLow-${uid}`} x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor={beakColor} />
            <stop offset="100%" stopColor={beakDark} />
          </linearGradient>
        </defs>
        <circle cx={cx} cy={cy} r="200" fill={`url(#halo-${uid})`} />
        <ellipse cx={cy} cy={385} rx="120" ry="14" fill={`url(#shadow-${uid})`} />
        <FeatherWing
          x={cx - 138}
          y={cy + 30}
          rotate={-18}
          fill={`url(#wing-${uid})`}
          shadow={wingShadow}
          flip
        />
        <FeatherWing
          x={cx + 138}
          y={cy + 30}
          rotate={18}
          fill={`url(#wing-${uid})`}
          shadow={wingShadow}
        />
        {feet && (
          <g stroke={feetColor || bodyBot} strokeWidth="5" strokeLinecap="round" fill="none">
            <path d={`M ${cx - 26} ${cy + 132} L ${cx - 26} ${cy + 152}`} />
            <path
              d={`M ${cx - 36} ${cy + 154} L ${cx - 26} ${cy + 152} L ${cx - 16} ${cy + 154}`}
            />
            <path
              d={`M ${cx - 32} ${cy + 156} L ${cx - 26} ${cy + 152} L ${cx - 20} ${cy + 156}`}
              strokeWidth="3.5"
            />
            <path d={`M ${cx + 26} ${cy + 132} L ${cx + 26} ${cy + 152}`} />
            <path
              d={`M ${cx + 16} ${cy + 154} L ${cx + 26} ${cy + 152} L ${cx + 36} ${cy + 154}`}
            />
            <path
              d={`M ${cx + 20} ${cy + 156} L ${cx + 26} ${cy + 152} L ${cx + 32} ${cy + 156}`}
              strokeWidth="3.5"
            />
          </g>
        )}
        <circle cx={cx} cy={cy} r={r} fill={`url(#body-${uid})`} />
        {bellyColor && (
          <ellipse cx={cx} cy={cy + 50} rx="100" ry="80" fill={`url(#belly-${uid})`} />
        )}
        <circle cx={cx} cy={cy} r={r} fill={`url(#bodyShade-${uid})`} />
        {showPlumage && (
          <g opacity="0.18" stroke={bodyBot} strokeWidth="1.1" fill="none" strokeLinecap="round">
            <path d={`M ${cx - 60} ${cy + 70} Q ${cx - 50} ${cy + 78} ${cx - 40} ${cy + 70}`} />
            <path d={`M ${cx - 30} ${cy + 80} Q ${cx - 20} ${cy + 88} ${cx - 10} ${cy + 80}`} />
            <path d={`M ${cx} ${cy + 86} Q ${cx + 10} ${cy + 94} ${cx + 20} ${cy + 86}`} />
            <path d={`M ${cx + 30} ${cy + 80} Q ${cx + 40} ${cy + 88} ${cx + 50} ${cy + 80}`} />
            <path d={`M ${cx - 70} ${cy + 40} Q ${cx - 60} ${cy + 48} ${cx - 50} ${cy + 40}`} />
            <path d={`M ${cx + 50} ${cy + 40} Q ${cx + 60} ${cy + 48} ${cx + 70} ${cy + 40}`} />
            <path d={`M ${cx - 100} ${cy - 100} Q ${cx - 92} ${cy - 110} ${cx - 84} ${cy - 100}`} />
            <path d={`M ${cx + 84} ${cy - 100} Q ${cx + 92} ${cy - 110} ${cx + 100} ${cy - 100}`} />
          </g>
        )}
        <ellipse cx={cx - 50} cy={cy - 75} rx="55" ry="38" fill={`url(#shine-${uid})`} />
        {cheekColor && (
          <>
            <circle cx={cx - 58} cy={cy + 18} r="22" fill={`url(#cheek-${uid})`} />
            <circle cx={cx + 58} cy={cy + 18} r="22" fill={`url(#cheek-${uid})`} />
          </>
        )}
        {headpiece}
        {eyeStyle === 'default' && (
          <>
            <Eye cx={cx - 36} cy={cy - 8 + eyeOffsetY} uid={uid} />
            <Eye cx={cx + 36} cy={cy - 8 + eyeOffsetY} uid={uid} />
          </>
        )}
        {eyeStyle === 'closed' && (
          <g stroke="#1a1a22" strokeWidth="3.2" strokeLinecap="round" fill="none">
            <path d={`M ${cx - 50} ${cy - 8} Q ${cx - 36} ${cy - 18} ${cx - 22} ${cy - 8}`} />
            <path d={`M ${cx + 22} ${cy - 8} Q ${cx + 36} ${cy - 18} ${cx + 50} ${cy - 8}`} />
            <line x1={cx - 22} y1={cy - 8} x2={cx - 18} y2={cy - 4} />
            <line x1={cx + 22} y1={cy - 8} x2={cx + 18} y2={cy - 4} />
          </g>
        )}
        {eyeStyle === 'sparkle' && (
          <>
            <Eye cx={cx - 36} cy={cy - 8 + eyeOffsetY} uid={uid} sparkle />
            <Eye cx={cx + 36} cy={cy - 8 + eyeOffsetY} uid={uid} sparkle />
          </>
        )}
        {eyeStyle === 'focused' && (
          <>
            <Eye cx={cx - 36} cy={cy - 8 + eyeOffsetY} uid={uid} small />
            <Eye cx={cx + 36} cy={cy - 8 + eyeOffsetY} uid={uid} small />
          </>
        )}
        <Beak cx={cx} cy={cy + 28} variant={beakStyle} uid={uid} dark={beakDark} />
        {bodyOverlay}
      </svg>
      {showLabel && (
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              fontFamily: "'Space Grotesk','Inter',sans-serif",
              fontWeight: 700,
              fontSize: 18,
              color: '#0e1420',
              letterSpacing: '-0.01em',
            }}
          >
            {name}
          </div>
          <div
            style={{
              fontFamily: "'JetBrains Mono',monospace",
              fontSize: 10,
              color: accent,
              textTransform: 'uppercase',
              letterSpacing: '0.18em',
              marginTop: 4,
            }}
          >
            {role}
          </div>
        </div>
      )}
    </div>
  );
};

// ── Agent definitions ────────────────────────────────────────────

export const Peep = ({ size = 280, showLabel = true, feet = true }: BirdProps) => (
  <Bird
    name="Peep"
    role="Opérationnel"
    accent="#b45309"
    size={size}
    showLabel={showLabel}
    feet={feet}
    bodyTop="#fff2c0"
    bodyMid="#fbbf24"
    bodyBot="#b45309"
    bellyColor="#fef3c7"
    wing="#fbbf24"
    wingShadow="#a85f10"
    haloColor="#fde68a"
    beakColor="#f59e0b"
    beakDark="#7c2d12"
    beakHighlight="#ffd9a8"
    cheekColor="#fb7185"
    eyeStyle="sparkle"
    beakStyle="curved"
    headpiece={
      <Crest x={cx} y={cy - 142} colors={['#ef4444', '#dc2626', '#991b1b']} count={3} scale={1.1} />
    }
  />
);

export const Jay = ({ size = 280, showLabel = true, feet = true }: BirdProps) => (
  <Bird
    name="Jay"
    role="Documentaire"
    accent="#5b21b6"
    size={size}
    showLabel={showLabel}
    feet={feet}
    bodyTop="#ffe7d4"
    bodyMid="#e8a37e"
    bodyBot="#8a4f30"
    bellyColor="#ffe1c8"
    wing="#d99474"
    wingShadow="#7a4225"
    haloColor="#c4b5fd"
    beakColor="#9ca3af"
    beakDark="#374151"
    beakHighlight="#e5e7eb"
    eyeStyle="default"
    beakStyle="curved"
    headpiece={
      <g>
        <Crest
          x={cx}
          y={cy - 142}
          colors={['#d99474', '#a86a48', '#7a4225']}
          count={3}
          scale={0.85}
        />
        <g>
          <rect
            x={cx - 64}
            y={cy - 26}
            width="50"
            height="38"
            rx="9"
            fill="#fff"
            fillOpacity="0.18"
            stroke="#1f2937"
            strokeWidth="2.6"
          />
          <rect
            x={cx + 14}
            y={cy - 26}
            width="50"
            height="38"
            rx="9"
            fill="#fff"
            fillOpacity="0.18"
            stroke="#1f2937"
            strokeWidth="2.6"
          />
          <path
            d={`M ${cx - 14} ${cy - 6} Q ${cx} ${cy - 11} ${cx + 14} ${cy - 6}`}
            stroke="#1f2937"
            strokeWidth="2.6"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d={`M ${cx - 64} ${cy - 14} Q ${cx - 90} ${cy - 18} ${cx - 110} ${cy - 4}`}
            stroke="#1f2937"
            strokeWidth="2.2"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d={`M ${cx + 64} ${cy - 14} Q ${cx + 90} ${cy - 18} ${cx + 110} ${cy - 4}`}
            stroke="#1f2937"
            strokeWidth="2.2"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d={`M ${cx - 56} ${cy - 18} L ${cx - 36} ${cy - 18} L ${cx - 50} ${cy + 4} L ${cx - 56} ${cy + 4} Z`}
            fill="#fff"
            opacity="0.4"
          />
          <path
            d={`M ${cx + 22} ${cy - 18} L ${cx + 42} ${cy - 18} L ${cx + 28} ${cy + 4} L ${cx + 22} ${cy + 4} Z`}
            fill="#fff"
            opacity="0.4"
          />
        </g>
      </g>
    }
    bodyOverlay={
      <g transform={`translate(${cx + 138} ${cy + 36}) rotate(-8)`}>
        <path
          d="M -28 -2 L 18 -2 L 22 4 L 22 30 L -28 30 Z"
          fill="#e6c177"
          stroke="#8a5a1c"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
        <line x1="-24" y1="6" x2="18" y2="6" stroke="#8a5a1c" strokeWidth="0.8" opacity="0.6" />
        <path
          d="M -32 -10 L 12 -10 L 16 -4 L 16 22 L -32 22 Z"
          fill="#fffdf8"
          stroke="#1f2937"
          strokeWidth="1.1"
          strokeLinejoin="round"
        />
        <line x1="-28" y1="-2" x2="8" y2="-2" stroke="#475569" strokeWidth="0.8" />
        <line x1="-28" y1="2" x2="6" y2="2" stroke="#94a3b8" strokeWidth="0.7" />
        <line x1="-28" y1="6" x2="10" y2="6" stroke="#94a3b8" strokeWidth="0.7" />
        <line x1="-28" y1="10" x2="4" y2="10" stroke="#94a3b8" strokeWidth="0.7" />
        <line x1="-28" y1="14" x2="8" y2="14" stroke="#94a3b8" strokeWidth="0.7" />
        <g transform="translate(8 16)">
          <circle r="5" fill="none" stroke="#b91c1c" strokeWidth="1.1" opacity="0.85" />
          <circle
            r="5"
            fill="none"
            stroke="#b91c1c"
            strokeWidth="0.5"
            opacity="0.5"
            transform="translate(0.5 -0.3)"
          />
        </g>
      </g>
    }
  />
);

export const Sparrow = ({ size = 280, showLabel = true, feet = true }: BirdProps) => (
  <Bird
    name="Sparrow"
    role="Développement"
    accent="#0d9488"
    size={size}
    showLabel={showLabel}
    feet={feet}
    bodyTop="#d1fae5"
    bodyMid="#5eead4"
    bodyBot="#0d6b62"
    bellyColor="#ccfbf1"
    wing="#2dd4bf"
    wingShadow="#0d6b62"
    haloColor="#5eead4"
    beakColor="#fb923c"
    beakDark="#7c2d12"
    beakHighlight="#fed7aa"
    cheekColor="#14b8a6"
    eyeStyle="sparkle"
    beakStyle="curved"
    headpiece={
      <g>
        <Crest
          x={cx + 6}
          y={cy - 142}
          colors={['#0d9488', '#0f766e', '#134e4a']}
          count={3}
          scale={1.05}
          lean={14}
        />
        <g>
          <path
            d={`M ${cx - 70} ${cy - 110} Q ${cx + 30} ${cy - 145} ${cx + 130} ${cy - 50}`}
            stroke="#0f172a"
            strokeWidth="4.5"
            fill="none"
            strokeLinecap="round"
          />
          <ellipse cx={cx + 132} cy={cy - 32} rx="18" ry="22" fill="#0f172a" />
          <ellipse cx={cx + 132} cy={cy - 32} rx="13" ry="17" fill="#1e293b" />
          <ellipse cx={cx + 128} cy={cy - 38} rx="3" ry="5" fill="#475569" opacity="0.6" />
          <circle cx={cx + 144} cy={cy - 44} r="2" fill="#34d399" />
          <path
            d={`M ${cx + 120} ${cy - 14} Q ${cx + 96} ${cy + 8} ${cx + 60} ${cy + 22}`}
            stroke="#0f172a"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
          <ellipse cx={cx + 60} cy={cy + 22} rx="4" ry="3" fill="#0f172a" />
          <circle cx={cx + 60} cy={cy + 22} r="1.2" fill="#ef4444" />
        </g>
      </g>
    }
  />
);

export const Rook = ({ size = 280, showLabel = true, feet = true }: BirdProps) => (
  <Bird
    name="Rook"
    role="Legal"
    accent="#1e293b"
    size={size}
    showLabel={showLabel}
    feet={feet}
    bodyTop="#f1f5f9"
    bodyMid="#94a3b8"
    bodyBot="#334155"
    bellyColor="#e2e8f0"
    wing="#64748b"
    wingShadow="#1e293b"
    haloColor="#cbd5e1"
    beakColor="#f59e0b"
    beakDark="#7c2d12"
    beakHighlight="#fcd34d"
    eyeStyle="focused"
    eyeOffsetY={-2}
    beakStyle="curved"
    headpiece={
      <g>
        <ellipse cx={cx} cy={cy - 128} rx="76" ry="13" fill="#0b1220" />
        <path
          d={`M ${cx - 116} ${cy - 142} L ${cx + 116} ${cy - 142} L ${cx + 92} ${cy - 124} L ${cx - 92} ${cy - 124} Z`}
          fill="#0f172a"
          stroke="#1e293b"
          strokeWidth="0.8"
          strokeLinejoin="round"
        />
        <path
          d={`M ${cx - 102} ${cy - 138} L ${cx - 30} ${cy - 138} L ${cx - 44} ${cy - 130} L ${cx - 106} ${cy - 130} Z`}
          fill="#fff"
          opacity="0.12"
        />
        <circle cx={cx} cy={cy - 140} r="3" fill="#fcd34d" stroke="#92400e" strokeWidth="0.8" />
        <path
          d={`M ${cx + 60} ${cy - 140} Q ${cx + 78} ${cy - 130} ${cx + 92} ${cy - 110}`}
          stroke="#fcd34d"
          strokeWidth="1.4"
          fill="none"
          strokeLinecap="round"
        />
        <g transform={`translate(${cx + 92} ${cy - 110})`}>
          <circle r="3.5" fill="#f59e0b" stroke="#b45309" strokeWidth="0.6" />
          <path
            d="M -2.5 2 L -3 11 M -1 2 L -1 12 M 0.5 2 L 0.5 12 M 2 2 L 2.5 11"
            stroke="#b45309"
            strokeWidth="0.7"
            strokeLinecap="round"
          />
        </g>
        <path
          d={`M ${cx - 54} ${cy - 30} Q ${cx - 38} ${cy - 26} ${cx - 22} ${cy - 28}`}
          stroke="#0f172a"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d={`M ${cx + 22} ${cy - 28} Q ${cx + 38} ${cy - 26} ${cx + 54} ${cy - 30}`}
          stroke="#0f172a"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
      </g>
    }
  />
);

export const Piper = ({ size = 280, showLabel = true, feet = true }: BirdProps) => (
  <Bird
    name="Piper"
    role="Marketing"
    accent="#be185d"
    size={size}
    showLabel={showLabel}
    feet={feet}
    bodyTop="#ffe4ec"
    bodyMid="#f9a8c4"
    bodyBot="#a52d63"
    bellyColor="#fce7f0"
    wing="#ec96b8"
    wingShadow="#a52d63"
    haloColor="#fbcfe8"
    beakColor="#f59e0b"
    beakDark="#7c2d12"
    beakHighlight="#fcd34d"
    cheekColor="#f43f5e"
    eyeStyle="sparkle"
    beakStyle="curved"
    headpiece={
      <g>
        <Crest
          x={cx + 10}
          y={cy - 142}
          colors={['#f9a8c4', '#be3878', '#7e1d4a']}
          count={3}
          scale={1}
          lean={-8}
        />
        <g transform={`translate(${cx - 100} ${cy - 110})`}>
          <path
            d="M 0 12 Q 4 24 14 34"
            stroke="#15803d"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M 6 22 Q 14 18 16 26 Q 10 28 6 22 Z"
            fill="#22c55e"
            stroke="#15803d"
            strokeWidth="0.6"
          />
          <g>
            {[0, 72, 144, 216, 288].map((a) => (
              <path
                key={a}
                d="M 0 0 Q -5 -6 -3 -14 Q 0 -18 3 -14 Q 5 -6 0 0 Z"
                fill="#fb7185"
                stroke="#be185d"
                strokeWidth="0.5"
                transform={`rotate(${a})`}
              />
            ))}
          </g>
          <g opacity="0.85">
            {[36, 108, 180, 252, 324].map((a) => (
              <path
                key={a}
                d="M 0 0 Q -3 -4 -2 -10 Q 0 -13 2 -10 Q 3 -4 0 0 Z"
                fill="#fda4b6"
                transform={`rotate(${a})`}
              />
            ))}
          </g>
          <circle r="4" fill="#fcd34d" stroke="#b45309" strokeWidth="0.7" />
          <circle cx="-1" cy="-1" r="1.2" fill="#fffbeb" opacity="0.85" />
        </g>
        <g transform={`translate(${cx + 138} ${cy + 24}) rotate(-12)`}>
          <path
            d="M 0 0 L 32 -16 L 32 16 Z"
            fill="#dc2626"
            stroke="#7f1d1d"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
          <path d="M 4 -2 L 28 -12 L 28 -2 L 4 4 Z" fill="#fecaca" opacity="0.45" />
          <ellipse cx="32" cy="0" rx="2.5" ry="16" fill="#7f1d1d" />
          <rect x="-12" y="-5" width="14" height="10" rx="2" fill="#1f2937" />
          <line x1="-7" y1="5" x2="-7" y2="14" stroke="#1f2937" strokeWidth="2" />
          <rect x="-12" y="14" width="10" height="3" rx="1" fill="#1f2937" />
          <path
            d="M -2 -2 Q 2 -3 4 -1"
            stroke="#475569"
            strokeWidth="1"
            fill="none"
            strokeLinecap="round"
          />
        </g>
        <g fill="#be185d" opacity="0.85">
          <text
            x={cx + 178}
            y={cy - 18}
            fontFamily="'JetBrains Mono', monospace"
            fontSize="14"
            fontWeight="700"
          >
            !
          </text>
          <circle cx={cx + 192} cy={cy + 4} r="3" />
          <circle cx={cx + 184} cy={cy + 24} r="2" opacity="0.7" />
          <circle cx={cx + 168} cy={cy + 38} r="1.6" opacity="0.6" />
        </g>
      </g>
    }
  />
);

export const Kite = ({ size = 280, showLabel = true, feet = true }: BirdProps) => (
  <Bird
    name="Kite"
    role="Innovation"
    accent="#7c3aed"
    size={size}
    showLabel={showLabel}
    feet={feet}
    bodyTop="#ede9fe"
    bodyMid="#a78bfa"
    bodyBot="#4c1d95"
    bellyColor="#ddd6fe"
    wing="#8b5cf6"
    wingShadow="#4c1d95"
    haloColor="#c4b5fd"
    beakColor="#fbbf24"
    beakDark="#7c2d12"
    beakHighlight="#fde68a"
    eyeStyle="sparkle"
    beakStyle="curved"
    headpiece={
      <g>
        <g transform={`translate(${cx} ${cy - 168})`}>
          <circle r="26" fill="#fde047" opacity="0.45" />
          <circle r="14" fill="#fef3c7" opacity="0.6" />
          <path
            d="M -16 8 C -22 -2, -22 -14, -10 -22 C -2 -27, 2 -27, 10 -22 C 22 -14, 22 -2, 16 8 Z"
            fill="#fef9c3"
            stroke="#b45309"
            strokeWidth="1.2"
            strokeLinejoin="round"
            opacity="0.9"
          />
          <path
            d="M -10 -16 Q -8 -22 -2 -22"
            stroke="#fff"
            strokeWidth="1.6"
            fill="none"
            opacity="0.85"
            strokeLinecap="round"
          />
          <path
            d="M -8 -2 Q -4 -10 0 -6 Q 4 -10 8 -2 Q 4 -8 0 -2 Q -4 -8 -8 -2 Z"
            stroke="#f59e0b"
            strokeWidth="1.4"
            fill="none"
            strokeLinejoin="round"
          />
          <line x1="-6" y1="-2" x2="-7" y2="2" stroke="#92400e" strokeWidth="0.9" />
          <line x1="6" y1="-2" x2="7" y2="2" stroke="#92400e" strokeWidth="0.9" />
          <rect
            x="-9"
            y="8"
            width="18"
            height="6"
            fill="#9ca3af"
            stroke="#475569"
            strokeWidth="0.6"
          />
          <line x1="-9" y1="11" x2="9" y2="11" stroke="#475569" strokeWidth="0.5" />
          <line x1="-9" y1="13" x2="9" y2="13" stroke="#475569" strokeWidth="0.5" />
          <rect x="-7" y="14" width="14" height="3" fill="#64748b" />
          <rect x="-4" y="17" width="8" height="2" fill="#475569" />
          <g stroke="#fde047" strokeWidth="2" strokeLinecap="round" opacity="0.85">
            <line x1="-26" y1="-10" x2="-34" y2="-14" />
            <line x1="26" y1="-10" x2="34" y2="-14" />
            <line x1="0" y1="-32" x2="0" y2="-42" />
            <line x1="-18" y1="-26" x2="-24" y2="-34" />
            <line x1="18" y1="-26" x2="24" y2="-34" />
          </g>
        </g>
      </g>
    }
    bodyOverlay={
      <g transform={`translate(${cx} ${cy + 90}) rotate(-4)`}>
        <rect
          x="-32"
          y="-14"
          width="64"
          height="26"
          rx="4"
          fill="#0b1020"
          stroke="#22d3ee"
          strokeWidth="1.2"
        />
        <g stroke="#22d3ee" strokeWidth="0.9" fill="none" strokeLinecap="round">
          <path d="M -26 -8 L -14 -8 L -14 4 L 0 4" />
          <path d="M -26 6 L -18 6 L -18 -2 L -8 -2" />
        </g>
        <g stroke="#a78bfa" strokeWidth="0.9" fill="none" strokeLinecap="round">
          <path d="M 0 -10 L 10 -10 L 10 4" />
          <path d="M 18 -8 L 26 -8 L 26 6" />
        </g>
        {[
          [-14, -8],
          [-14, 4],
          [0, 4],
          [-18, 6],
          [-18, -2],
          [-8, -2],
          [10, -10],
          [10, 4],
          [26, -8],
          [26, 6],
        ].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="1" fill="#22d3ee" />
        ))}
        <rect
          x="2"
          y="-6"
          width="14"
          height="14"
          rx="1.2"
          fill="#1e1b4b"
          stroke="#22d3ee"
          strokeWidth="0.8"
        />
        <text
          x="9"
          y="3"
          textAnchor="middle"
          fontFamily="'JetBrains Mono',monospace"
          fontSize="6"
          fill="#22d3ee"
          fontWeight="700"
        >
          AI
        </text>
        <g stroke="#22d3ee" strokeWidth="0.5">
          <line x1="2" y1="-3" x2="-1" y2="-3" />
          <line x1="2" y1="0" x2="-1" y2="0" />
          <line x1="2" y1="3" x2="-1" y2="3" />
          <line x1="16" y1="-3" x2="19" y2="-3" />
          <line x1="16" y1="0" x2="19" y2="0" />
          <line x1="16" y1="3" x2="19" y2="3" />
        </g>
      </g>
    }
  />
);

/** Lookup table used by `Agents.astro` to render the right bird per agent key. */
export const birdByKey = {
  peep: Peep,
  jay: Jay,
  sparrow: Sparrow,
  legal: Rook,
  marketing: Piper,
  innovation: Kite,
} as const;

export type AgentKey = keyof typeof birdByKey;
