import * as React from "react";

export function NoRecordFoundIllustration() {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 w-full bg-white">
      <div className="relative w-full max-w-[420px] h-[260px]">
        <svg viewBox="0 0 400 240" fill="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          {/* Background Browser Frame */}
          <rect x="130" y="30" width="130" height="90" rx="6" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1.5" />
          <line x1="130" y1="45" x2="260" y2="45" stroke="#e2e8f0" strokeWidth="1.5" />
          <circle cx="138" cy="38" r="2.5" fill="#cbd5e1" />
          <circle cx="145" cy="38" r="2.5" fill="#cbd5e1" />
          <circle cx="152" cy="38" r="2.5" fill="#cbd5e1" />

          {/* Prohibited Circle-Slash Symbol */}
          <circle cx="85" cy="90" r="10" stroke="#cbd5e1" strokeWidth="1.5" fill="none" />
          <line x1="78" y1="83" x2="92" y2="97" stroke="#cbd5e1" strokeWidth="1.5" />

          {/* Document icon on the left */}
          <rect x="65" y="130" width="18" height="24" rx="2" fill="none" stroke="#cbd5e1" strokeWidth="1.5" />
          <line x1="69" y1="136" x2="79" y2="136" stroke="#cbd5e1" strokeWidth="1.5" />
          <line x1="69" y1="141" x2="75" y2="141" stroke="#cbd5e1" strokeWidth="1.5" />
          <line x1="69" y1="146" x2="79" y2="146" stroke="#cbd5e1" strokeWidth="1.5" />

          {/* Warning sign (triangle) on the right */}
          <polygon points="340,110 352,130 328,130" fill="#fef3c7" stroke="#fbbf24" strokeWidth="1.5" strokeLinejoin="round" />
          <text x="340" y="127" fill="#d97706" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">!</text>

          {/* Hashtag symbol */}
          <text x="310" y="80" fill="#cbd5e1" fontSize="22" fontWeight="bold" fontFamily="sans-serif">#</text>

          {/* Sparkles / Plus signs */}
          <path d="M110,40 L110,46 M107,43 L113,43" stroke="#cbd5e1" strokeWidth="1" strokeLinecap="round" />
          <path d="M280,140 L280,146 M277,143 L283,143" stroke="#cbd5e1" strokeWidth="1" strokeLinecap="round" />
          <path d="M150,150 L150,154 M148,152 L152,152" stroke="#cbd5e1" strokeWidth="0.8" strokeLinecap="round" />

          {/* Plants */}
          {/* Left Plant */}
          <polygon points="35,215 45,215 48,190 32,190" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.2" />
          <path d="M40,190 C30,165 20,150 25,140 C32,152 38,168 40,190" fill="#a7f3d0" />
          <path d="M40,190 C40,160 45,145 42,135 C45,148 45,165 40,190" fill="#34d399" />
          <path d="M40,190 C50,170 58,160 62,150 C55,162 48,175 40,190" fill="#10b981" />
          
          {/* Right Plant */}
          <polygon points="345,215 355,215 358,190 342,190" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.2" />
          <path d="M350,190 C340,165 330,150 335,140 C342,152 348,168 350,190" fill="#a7f3d0" />
          <path d="M350,190 C350,160 355,145 352,135 C355,148 355,165 350,190" fill="#34d399" />
          <path d="M350,190 C360,170 368,160 372,150 C365,162 358,175 350,190" fill="#10b981" />

          {/* Table / Desk */}
          <rect x="90" y="170" width="220" height="6" rx="2" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
          <line x1="110" y1="176" x2="110" y2="230" stroke="#cbd5e1" strokeWidth="3" strokeLinecap="round" />
          <line x1="290" y1="176" x2="290" y2="230" stroke="#cbd5e1" strokeWidth="3" strokeLinecap="round" />

          {/* Chair Under Desk */}
          <path d="M140,125 C132,125 125,140 128,165 L148,165 C152,140 148,125 140,125 Z" fill="#1e40af" opacity="0.85" />
          <ellipse cx="152" cy="170" rx="22" ry="5" fill="#1e40af" />
          <line x1="152" y1="175" x2="152" y2="210" stroke="#cbd5e1" strokeWidth="4" />
          <path d="M152,210 L135,220 M152,210 L169,220 M152,210 L142,225 M152,210 L162,225" stroke="#cbd5e1" strokeWidth="3" strokeLinecap="round" />
          <circle cx="135" cy="220" r="3.5" fill="#1e293b" />
          <circle cx="169" cy="220" r="3.5" fill="#1e293b" />
          <circle cx="142" cy="225" r="3.5" fill="#1e293b" />
          <circle cx="162" cy="225" r="3.5" fill="#1e293b" />

          {/* Person Sitting & Shrugging */}
          {/* Pants */}
          <path d="M142,170 C142,160 160,160 170,170 L188,175 C195,178 195,185 185,185 L165,185 L145,185 Z" fill="#f97316" />
          <path d="M172,180 L172,218 L180,218" stroke="#f97316" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <path d="M185,180 L185,220 L195,220" stroke="#f97316" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <ellipse cx="180" cy="220" rx="6" ry="3.5" fill="#1e293b" />
          <ellipse cx="195" cy="222" rx="6" ry="3.5" fill="#1e293b" />
          
          {/* Torso / Grey Shirt */}
          <path d="M140,140 C140,130 156,130 162,140 L168,172 L138,172 Z" fill="#64748b" />
          
          {/* Head & Hair */}
          <circle cx="152" cy="122" r="8.5" fill="#fed7aa" />
          <path d="M144,118 C144,112 158,112 160,118 C162,120 160,124 156,124 C152,124 144,122 144,118" fill="#1e293b" />
          
          {/* Raised Arms */}
          <path d="M142,141 Q128,135 120,118" fill="none" stroke="#64748b" strokeWidth="5.5" strokeLinecap="round" />
          <circle cx="120" cy="116" r="3.5" fill="#fed7aa" />
          <path d="M158,141 Q172,135 180,118" fill="none" stroke="#64748b" strokeWidth="5.5" strokeLinecap="round" />
          <circle cx="180" cy="116" r="3.5" fill="#fed7aa" />

          {/* Coffee Mug */}
          <rect x="120" y="162" width="7" height="8" rx="1.5" fill="#cbd5e1" />
          <path d="M120,164 C118,164 118,168 120,168" stroke="#cbd5e1" strokeWidth="1" fill="none" />

          {/* Angled Computer Monitor */}
          <path d="M220,105 L265,105 L270,145 L215,145 Z" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1" />
          <line x1="230" y1="110" x2="230" y2="120" stroke="#cbd5e1" strokeWidth="1.5" />
          <line x1="235" y1="110" x2="235" y2="120" stroke="#cbd5e1" strokeWidth="1.5" />
          <line x1="240" y1="110" x2="240" y2="120" stroke="#cbd5e1" strokeWidth="1.5" />
          <line x1="245" y1="110" x2="245" y2="120" stroke="#cbd5e1" strokeWidth="1.5" />
          <line x1="250" y1="110" x2="250" y2="120" stroke="#cbd5e1" strokeWidth="1.5" />
          <line x1="255" y1="110" x2="255" y2="120" stroke="#cbd5e1" strokeWidth="1.5" />
          <path d="M240,145 L245,145 L248,170 L237,170 Z" fill="#cbd5e1" />

          {/* Speech Bubble */}
          <g transform="translate(220, 62)">
            <rect width="96" height="42" rx="8" fill="white" stroke="#cbd5e1" strokeWidth="1.5" />
            <path d="M15 42 L15 52 L25 42 Z" fill="white" stroke="#cbd5e1" strokeWidth="1.5" />
            <path d="M16 41.5 L24 41.5" stroke="white" strokeWidth="2" />
            <text x="48" y="18" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fontWeight="bold">
              <tspan fill="#1e293b">No Record</tspan>
              <tspan fill="#008272"> !</tspan>
            </text>
            <text x="48" y="33" fill="#008272" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fontWeight="bold">Found</text>
          </g>
        </svg>
      </div>
    </div>
  );
}
