// AvatarBirds.tsx — SVG bird avatars for Jay, Peep, Sparrow, Finch, Pecker.
// Ported from avatars.jsx (Hatch Vault). Transparent background by design.

import React from 'react';

const BC = { x: 200, y: 212, r: 150 };

const Eyes = ({ lx = 168, rx = 232, y = 214, rxEye = 11, ryEye = 17, ink = '#1b1b22' }) => (
  <g>
    {[lx, rx].map((ex, i) => (
      <g key={i}>
        <rect x={ex - rxEye} y={y - ryEye} width={rxEye * 2} height={ryEye * 2} rx={rxEye} fill={ink} />
        <circle cx={ex - rxEye * 0.35} cy={y - ryEye * 0.45} r={rxEye * 0.42} fill="#fff" />
        <circle cx={ex + rxEye * 0.2} cy={y + ryEye * 0.35} r={rxEye * 0.22} fill="#fff" fillOpacity="0.85" />
      </g>
    ))}
  </g>
);

const Beak = ({ x = 200, y = 248, w = 13, h = 11 }) => (
  <g>
    <path d={`M ${x} ${y - h} L ${x + w} ${y} L ${x} ${y + h} L ${x - w} ${y} Z`} fill="#f6951c" />
    <path d={`M ${x} ${y - h} L ${x + w} ${y} L ${x} ${y} L ${x - w} ${y} Z`} fill="#ffb44d" />
    <path d={`M ${x - w} ${y} L ${x + w} ${y}`} stroke="#d4760a" strokeWidth="1" />
  </g>
);

const Cheeks = ({ y = 244, color = '#f59aab' }) => (
  <g>
    <ellipse cx="146" cy={y} rx="17" ry="11" fill={color} fillOpacity="0.7" />
    <ellipse cx="254" cy={y} rx="17" ry="11" fill={color} fillOpacity="0.7" />
  </g>
);

const Crest = ({ color = '#ef4444', count = 3 }) => (
  <g stroke={color} strokeWidth="6" strokeLinecap="round" fill="none">
    {Array.from({ length: count }).map((_, i) => {
      const a = (i - (count - 1) / 2) * 14;
      const rad = (a * Math.PI) / 180;
      const baseX = 200 + (i - (count - 1) / 2) * 6;
      const tipX = baseX + Math.sin(rad) * 40;
      return <line key={i} x1={baseX} y1="78" x2={tipX} y2="40" />;
    })}
  </g>
);

const Foot = ({ x, y, color }: { x: number; y: number; color: string }) => (
  <g stroke={color} strokeWidth="4" strokeLinecap="round" fill="none">
    <line x1={x} y1={y - 12} x2={x} y2={y} />
    <line x1={x} y1={y} x2={x - 9} y2={y + 12} />
    <line x1={x} y1={y} x2={x} y2={y + 15} />
    <line x1={x} y1={y} x2={x + 9} y2={y + 12} />
  </g>
);

const Feet = ({ color = '#f0913a' }) => (
  <g>
    <Foot x={184} y={364} color={color} />
    <Foot x={216} y={364} color={color} />
  </g>
);

const RoundGlasses = ({ frame = '#4e3324' }) => (
  <g fill="none" stroke={frame} strokeWidth="5" strokeLinecap="round">
    <circle cx="168" cy="214" r="29" fill="#ffffff" fillOpacity="0.12" />
    <circle cx="232" cy="214" r="29" fill="#ffffff" fillOpacity="0.12" />
    <path d="M 195 206 Q 200 201 205 206" />
    <path d="M 139 207 Q 120 201 106 206" strokeWidth="4" />
    <path d="M 261 207 Q 280 201 294 206" strokeWidth="4" />
    <path d="M 152 200 Q 158 196 166 197" stroke="#ffffff" strokeOpacity="0.5" strokeWidth="3" />
  </g>
);

const Magnifier = ({ frame = '#3a3a72' }) => (
  <g>
    <circle cx="250" cy="212" r="31" fill="#cfd2f0" fillOpacity="0.35" stroke={frame} strokeWidth="7" />
    <path d="M 236 200 Q 244 194 254 196" stroke="#ffffff" strokeWidth="4" fill="none" strokeLinecap="round" strokeOpacity="0.85" />
    <path d="M 234 210 Q 238 207 242 208" stroke="#ffffff" strokeWidth="3" fill="none" strokeLinecap="round" strokeOpacity="0.6" />
    <rect x="270" y="232" width="11" height="34" rx="5" transform="rotate(-45 275 249)" fill={frame} />
  </g>
);

const GradCap = ({ board = '#1b2236', tassel = '#f4c12e' }) => (
  <g>
    <path d="M 150 120 Q 200 104 250 120 L 244 138 Q 200 126 156 138 Z" fill={board} opacity="0.92" />
    <path d="M 200 80 L 292 116 L 200 150 L 108 116 Z" fill={board} />
    <path d="M 200 80 L 292 116 L 200 132 L 108 116 Z" fill="#2a3350" />
    <circle cx="200" cy="115" r="5" fill="#0e1320" />
    <path d="M 200 115 L 288 118" stroke={tassel} strokeWidth="2.5" fill="none" />
    <path d="M 288 118 L 296 158" stroke={tassel} strokeWidth="2.5" fill="none" strokeLinecap="round" />
    <circle cx="296" cy="163" r="6" fill={tassel} />
  </g>
);

const Headset = ({ band = '#27384a' }) => (
  <g>
    <path d="M 132 214 Q 200 116 268 214" fill="none" stroke={band} strokeWidth="10" strokeLinecap="round" />
    <path d="M 150 188 Q 200 140 236 168" fill="none" stroke="#ffffff" strokeOpacity="0.35" strokeWidth="3" strokeLinecap="round" />
    <ellipse cx="128" cy="236" rx="19" ry="29" fill={band} />
    <ellipse cx="128" cy="236" rx="11" ry="20" fill="#34506a" />
    <ellipse cx="272" cy="236" rx="19" ry="29" fill={band} />
    <ellipse cx="272" cy="236" rx="11" ry="20" fill="#34506a" />
    <path d="M 272 258 Q 250 286 220 278" fill="none" stroke={band} strokeWidth="5" strokeLinecap="round" />
    <circle cx="217" cy="277" r="6" fill="#f6951c" />
  </g>
);

const NoteCard = () => (
  <g transform="translate(298 332) rotate(-7)">
    <rect x="-32" y="-46" width="64" height="92" rx="9" fill="#fdfdf9" stroke="#dcd6c8" strokeWidth="1.5" />
    <path d="M -32 -37 Q -32 -46 -23 -46 L 23 -46 Q 32 -46 32 -37 L 32 -28 L -32 -28 Z" fill="#2f7d5b" />
    {[-14, -4, 6].map((yy, i) => (
      <line key={i} x1="-22" y1={yy} x2={i === 2 ? 6 : 18} y2={yy} stroke="#c9c3b4" strokeWidth="3" strokeLinecap="round" />
    ))}
    <circle cx="14" cy="30" r="9" fill="#f6951c" />
    <path d="M 9 30 L 13 34 L 19 26" stroke="#fff" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </g>
);

const OpenBook = () => (
  <g transform="translate(200 332)">
    <path d="M 0 -4 C -8 -20 -42 -22 -56 -12 L -56 20 C -42 10 -8 12 0 26 Z" fill="#fcfcf7" stroke="#d7d3c4" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M 0 -4 C 8 -20 42 -22 56 -12 L 56 20 C 42 10 8 12 0 26 Z" fill="#ffffff" stroke="#d7d3c4" strokeWidth="1.5" strokeLinejoin="round" />
    {[2, 10].map((yy, i) => (
      <g key={i}>
        <line x1="-46" y1={yy - 6} x2="-12" y2={yy - 2} stroke="#cfcabb" strokeWidth="2.4" strokeLinecap="round" />
        <line x1="12" y1={yy - 2} x2="46" y2={yy - 6} stroke="#cfcabb" strokeWidth="2.4" strokeLinecap="round" />
      </g>
    ))}
  </g>
);

const Clipboard = () => (
  <g transform="translate(110 340) rotate(7)">
    <rect x="-30" y="-44" width="60" height="88" rx="9" fill="#eef0f7" stroke="#c7ccde" strokeWidth="1.5" />
    <rect x="-12" y="-50" width="24" height="14" rx="4" fill="#b9c0d8" />
    <rect x="-7" y="-47" width="14" height="8" rx="2" fill="#8a93b4" />
    {[-22, -10, 2, 14].map((yy, i) => (
      <line key={i} x1="-20" y1={yy} x2={i % 2 ? 8 : 18} y2={yy} stroke="#c2c8dd" strokeWidth="3" strokeLinecap="round" />
    ))}
  </g>
);

interface BirdAvatarProps {
  name: string;
  size?: number;
  bodyLight: string;
  bodyMid: string;
  bodyDark: string;
  footColor?: string;
  glowColor?: string | null;
  headpiece?: React.ReactNode;
  accessory?: React.ReactNode;
  cheeks?: React.ReactNode;
  crest?: React.ReactNode;
  feathered?: boolean;
}

const BirdAvatar = ({
  name, size = 260,
  bodyLight, bodyMid, bodyDark,
  footColor = '#6b4a2f',
  glowColor = null,
  headpiece = null,
  accessory = null,
  cheeks = null,
  crest = null,
  feathered = false,
}: BirdAvatarProps) => (
  <svg width={size} height={size} viewBox="0 0 400 400" style={{ overflow: 'visible', display: 'block' }}>
    <defs>
      <radialGradient id={`body-${name}`} cx="38%" cy="30%" r="78%">
        <stop offset="0%" stopColor={bodyLight} />
        <stop offset="48%" stopColor={bodyMid} />
        <stop offset="100%" stopColor={bodyDark} />
      </radialGradient>
      <radialGradient id={`bshade-${name}`} cx="50%" cy="100%" r="62%">
        <stop offset="0%" stopColor={bodyDark} stopOpacity="0.55" />
        <stop offset="60%" stopColor={bodyDark} stopOpacity="0.12" />
        <stop offset="100%" stopColor={bodyDark} stopOpacity="0" />
      </radialGradient>
      {glowColor && (
        <radialGradient id={`glow-${name}`} cx="50%" cy="46%" r="52%">
          <stop offset="0%" stopColor={glowColor} stopOpacity="0.55" />
          <stop offset="70%" stopColor={glowColor} stopOpacity="0.12" />
          <stop offset="100%" stopColor={glowColor} stopOpacity="0" />
        </radialGradient>
      )}
    </defs>

    {glowColor && <rect x="-20" y="-20" width="440" height="440" fill={`url(#glow-${name})`} />}

    <ellipse cx="200" cy="390" rx="74" ry="12" fill="#000" opacity="0.12" />
    <Feet color={footColor} />
    <ellipse cx="58" cy="252" rx="28" ry="46" fill={bodyDark} opacity="0.9" transform="rotate(-8 58 252)" />
    <ellipse cx="342" cy="252" rx="28" ry="46" fill={bodyDark} opacity="0.9" transform="rotate(8 342 252)" />
    <circle cx={BC.x} cy={BC.y} r={BC.r} fill={`url(#body-${name})`} />
    <ellipse cx="200" cy="300" rx="132" ry="92" fill={`url(#bshade-${name})`} />
    <ellipse cx="150" cy="150" rx="46" ry="34" fill="#ffffff" opacity="0.3" transform="rotate(-22 150 150)" />

    {feathered && (
      <g stroke={bodyDark} strokeWidth="2.5" strokeLinecap="round" opacity="0.4" fill="none">
        <path d="M 96 230 q 14 6 12 26" />
        <path d="M 104 256 q 14 6 12 24" />
        <path d="M 304 230 q -14 6 -12 26" />
        <path d="M 296 256 q -14 6 -12 24" />
      </g>
    )}

    {cheeks}
    <Eyes />
    <Beak />
    {crest}
    {headpiece}
    {accessory}
  </svg>
);

export const PeepAvatar = ({ size = 260 }: { size?: number }) => (
  <BirdAvatar
    name="Peep" size={size}
    bodyLight="#fff3bf" bodyMid="#ffd23e" bodyDark="#f0a32a"
    footColor="#f0913a"
    glowColor="#ffe9a8"
    crest={<Crest color="#ef4444" />}
    cheeks={<Cheeks color="#f59aab" />}
  />
);

export const JayAvatar = ({ size = 260 }: { size?: number }) => (
  <BirdAvatar
    name="Jay" size={size}
    bodyLight="#efdcc2" bodyMid="#cBa583" bodyDark="#8a6240"
    footColor="#6b4a2f"
    glowColor="#e9d8c2"
    feathered
    crest={<Crest color="#7a5436" />}
    headpiece={<RoundGlasses />}
    accessory={<NoteCard />}
  />
);

export const SparrowAvatar = ({ size = 260 }: { size?: number }) => (
  <BirdAvatar
    name="Sparrow" size={size}
    bodyLight="#bff0e0" bodyMid="#3fc9b0" bodyDark="#1f8f86"
    footColor="#1f6f68"
    glowColor="#bdf0e2"
    crest={<Crest color="#1f8f86" />}
    headpiece={<Headset />}
  />
);

export const FinchAvatar = ({ size = 260 }: { size?: number }) => (
  <BirdAvatar
    name="Finch" size={size}
    bodyLight="#cfd0f6" bodyMid="#7b76e0" bodyDark="#4a3fb0"
    footColor="#3a3375"
    glowColor="#d3d3f4"
    crest={<Crest color="#3a3375" />}
    headpiece={<Magnifier />}
    accessory={<Clipboard />}
  />
);

export const PeckerAvatar = ({ size = 260 }: { size?: number }) => (
  <BirdAvatar
    name="Pecker" size={size}
    bodyLight="#f6c79a" bodyMid="#e08a44" bodyDark="#b5611f"
    footColor="#7a4a22"
    glowColor="#f6d3ab"
    cheeks={<Cheeks color="#e98a7a" />}
    headpiece={<GradCap />}
    accessory={<OpenBook />}
  />
);
