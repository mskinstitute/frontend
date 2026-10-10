'use client';

import React from 'react';

export interface RacerVehicleProps {
  avatar?: string;
  color?: string;
  isNitro?: boolean;
  isLeader?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function RacerVehicle({
  avatar = '🏎️',
  color = '#ff6b00',
  isNitro = false,
  isLeader = false,
  size = 'md',
  className = '',
}: RacerVehicleProps) {
  // Dimension classes based on size prop
  const sizeClasses =
    size === 'sm'
      ? 'h-6 w-auto'
      : size === 'lg'
      ? 'h-10 sm:h-12 w-auto'
      : 'h-7 sm:h-8 w-auto';

  // Determine vehicle skin type from avatar string
  const vehicleType = React.useMemo(() => {
    if (avatar === '⚡' || avatar === 'lightning') return 'lightning';
    if (avatar === '🚀' || avatar === 'rocket') return 'rocket';
    if (avatar === '🏍️' || avatar === 'bike') return 'bike';
    if (avatar === '🛸' || avatar === 'ufo') return 'ufo';
    if (avatar === '🐲' || avatar === 'dragon') return 'dragon';
    return 'f1'; // default: Formula 1 Turbo
  }, [avatar]);

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none transition-transform ${
        isLeader ? 'scale-105' : ''
      } ${className}`}
    >
      {/* 1. Formula 1 Turbo Racer */}
      {vehicleType === 'f1' && (
        <svg
          viewBox="0 0 115 38"
          className={`${sizeClasses} overflow-visible filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Underglow glow effect */}
          <ellipse
            cx="58"
            cy="33"
            rx="45"
            ry="3.5"
            fill={color}
            opacity={isNitro ? '0.75' : '0.4'}
          />

          {/* Rear Wing Endplates & Aerodynamic Spoiler */}
          <path d="M 6 12 L 22 12 L 20 16 L 8 16 Z" fill={color} />
          <line x1="12" y1="16" x2="14" y2="27" stroke="#475569" strokeWidth="2.5" />
          <line x1="19" y1="16" x2="17" y2="27" stroke="#475569" strokeWidth="2.5" />
          <rect x="5" y="9" width="3.5" height="15" rx="1" fill="#334155" />
          <rect x="20" y="9" width="3.5" height="15" rx="1" fill="#334155" />

          {/* Engine Cover & Rear Cowling */}
          <path d="M 14 26 L 28 22 L 44 15 L 54 15 L 48 25 L 20 28 Z" fill="#0f172a" />
          <path d="M 28 22 L 42 17 L 50 17 L 46 24 Z" fill={color} />

          {/* Main Aerodynamic Monocoque Chassis */}
          <path
            d="M 20 28 L 46 25 L 72 23 L 92 25 L 106 28 L 108 31 L 22 31 Z"
            fill={color}
          />
          {/* Aerodynamic Highlight Glint */}
          <path
            d="M 36 24 L 70 22 L 90 24 L 102 27 L 68 24 Z"
            fill="#ffffff"
            opacity="0.35"
          />
          {/* Bottom Carbon Fibre Skirt */}
          <path d="M 24 30 L 104 30 L 98 32 L 24 32 Z" fill="#020617" opacity="0.8" />

          {/* Cockpit Opening */}
          <path d="M 50 18 L 65 18 L 69 23 L 48 23 Z" fill="#020617" />
          {/* Driver Racing Helmet */}
          <circle cx="58" cy="18" r="5" fill="#f8fafc" />
          <path d="M 57 17 Q 63 17 63 19 L 58 20 Z" fill="#0284c7" />
          {/* Halo Safety Arc */}
          <path
            d="M 52 17 L 66 17"
            stroke="#94a3b8"
            strokeWidth="1.5"
            strokeLinecap="round"
          />

          {/* Front Nose Cone & Splitter Wing */}
          <path d="M 88 25 L 108 28 L 110 31 L 88 30 Z" fill={color} />
          {/* Front Wing Assembly */}
          <path d="M 98 30 L 112 30 L 114 33 L 97 33 Z" fill="#1e293b" />
          <path d="M 108 28 L 114 28 L 114 34 L 108 34 Z" fill={color} />

          {/* Front Laser Headlight Glow */}
          <circle cx="111" cy="29" r="1.5" fill="#38bdf8" />
          <polygon
            points="112,28 122,25 122,33 112,30"
            fill="#38bdf8"
            opacity="0.4"
          />

          {/* Rear Racing Wheel (Left) */}
          <circle
            cx="25"
            cy="30"
            r="8"
            fill="#090d16"
            stroke="#1e293b"
            strokeWidth="1.5"
          />
          <circle cx="25" cy="30" r="4.8" fill="#334155" />
          <circle cx="25" cy="30" r="2.2" fill={color} />
          <line x1="25" y1="26" x2="25" y2="34" stroke="#94a3b8" strokeWidth="1.2" />
          <line x1="21" y1="30" x2="29" y2="30" stroke="#94a3b8" strokeWidth="1.2" />

          {/* Front Racing Wheel (Right) */}
          <circle
            cx="88"
            cy="30"
            r="7.5"
            fill="#090d16"
            stroke="#1e293b"
            strokeWidth="1.5"
          />
          <circle cx="88" cy="30" r="4.2" fill="#334155" />
          <circle cx="88" cy="30" r="2" fill={color} />
          <line x1="88" y1="26.5" x2="88" y2="33.5" stroke="#94a3b8" strokeWidth="1.2" />
          <line x1="84.5" y1="30" x2="91.5" y2="30" stroke="#94a3b8" strokeWidth="1.2" />
        </svg>
      )}

      {/* 2. Thunder Bolt / GT Hypercar */}
      {vehicleType === 'lightning' && (
        <svg
          viewBox="0 0 115 38"
          className={`${sizeClasses} overflow-visible filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Underglow */}
          <ellipse
            cx="58"
            cy="33"
            rx="45"
            ry="3.5"
            fill={color}
            opacity={isNitro ? '0.8' : '0.45'}
          />

          {/* Rear GT Wing */}
          <path d="M 8 13 L 24 13 L 22 16 L 10 16 Z" fill="#0f172a" />
          <line x1="15" y1="16" x2="15" y2="25" stroke="#475569" strokeWidth="2" />

          {/* Sculpted Aerodynamic Supercar Chassis */}
          <path
            d="M 12 25 Q 16 18 34 17 L 52 14 Q 70 13 84 19 L 102 24 Q 110 26 110 31 L 14 31 Z"
            fill={color}
          />
          {/* Tinted Curved Windshield & Roof */}
          <path
            d="M 38 17 L 52 14 Q 70 13 80 19 L 74 19 Q 62 16 46 17 Z"
            fill="#020617"
          />
          <path
            d="M 50 16 L 74 17 Q 78 19 80 20 L 48 20 Z"
            fill="#0f172a"
            opacity="0.8"
          />
          <path
            d="M 40 18 L 48 16 L 46 21 L 36 21 Z"
            fill="#38bdf8"
            opacity="0.5"
          />

          {/* Body Highlight Streak */}
          <path
            d="M 28 24 Q 55 19 88 23 L 104 27 L 30 26 Z"
            fill="#ffffff"
            opacity="0.3"
          />
          {/* Carbon Side Skirt */}
          <path d="M 16 30 L 106 30 L 102 32 L 16 32 Z" fill="#020617" opacity="0.8" />

          {/* Aggressive Front LED Headlights */}
          <polygon points="102,23 109,25 108,27 101,26" fill="#f8fafc" />
          <polygon
            points="109,24 122,23 122,28 108,27"
            fill="#38bdf8"
            opacity="0.45"
          />

          {/* Rear Wheel */}
          <circle
            cx="26"
            cy="30"
            r="8"
            fill="#090d16"
            stroke="#1e293b"
            strokeWidth="1.5"
          />
          <circle cx="26" cy="30" r="4.8" fill="#475569" />
          <circle cx="26" cy="30" r="2.2" fill={color} />
          {/* Front Wheel */}
          <circle
            cx="88"
            cy="30"
            r="8"
            fill="#090d16"
            stroke="#1e293b"
            strokeWidth="1.5"
          />
          <circle cx="88" cy="30" r="4.8" fill="#475569" />
          <circle cx="88" cy="30" r="2.2" fill={color} />
        </svg>
      )}

      {/* 3. Cosmic Rocket Ship */}
      {vehicleType === 'rocket' && (
        <svg
          viewBox="0 0 115 38"
          className={`${sizeClasses} overflow-visible filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Thruster Nozzle Glow */}
          <ellipse cx="14" cy="24" rx="4" ry="7" fill="#020617" stroke="#475569" strokeWidth="1.5" />
          <ellipse cx="58" cy="32" rx="42" ry="3" fill={color} opacity="0.4" />

          {/* Top & Bottom Delta Wings */}
          <polygon points="26,18 48,10 52,18" fill="#334155" />
          <polygon points="26,30 48,36 52,30" fill="#334155" />

          {/* Rocket Fuselage */}
          <path
            d="M 14 20 Q 50 16 95 21 L 112 24 L 95 27 Q 50 32 14 28 Z"
            fill={color}
          />
          {/* Metallic Highlight Streak */}
          <path
            d="M 22 22 Q 55 18 92 23 L 106 24 L 92 24 Q 55 20 22 22 Z"
            fill="#ffffff"
            opacity="0.45"
          />

          {/* Cockpit Observation Dome */}
          <ellipse cx="72" cy="24" rx="8" ry="4" fill="#0284c7" />
          <ellipse cx="73" cy="23" rx="5" ry="2" fill="#bae6fd" opacity="0.7" />

          {/* Sensor Needle Tip */}
          <line x1="112" y1="24" x2="120" y2="24" stroke="#e2e8f0" strokeWidth="2" strokeLinecap="round" />
        </svg>
      )}

      {/* 4. Hyper Superbike */}
      {vehicleType === 'bike' && (
        <svg
          viewBox="0 0 115 38"
          className={`${sizeClasses} overflow-visible filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <ellipse cx="58" cy="33" rx="42" ry="3.5" fill={color} opacity="0.4" />

          {/* Rear Swingarm & Exhaust */}
          <line x1="28" y1="28" x2="52" y2="26" stroke="#475569" strokeWidth="3" />
          <polygon points="18,24 38,22 36,25 18,27" fill="#64748b" />

          {/* Bike Fairing Body */}
          <path
            d="M 32 26 L 46 19 L 66 17 L 82 19 L 90 26 L 80 29 L 52 29 Z"
            fill={color}
          />
          {/* Windshield */}
          <path d="M 68 17 L 78 12 L 84 19 Z" fill="#0284c7" opacity="0.8" />

          {/* Rider in Full Tuck */}
          <circle cx="58" cy="14" r="5" fill="#f8fafc" />
          <path d="M 57 13 Q 63 13 63 15 L 58 16 Z" fill="#0284c7" />
          <path
            d="M 44 21 Q 50 16 56 16 L 68 20 L 52 24 Z"
            fill="#0f172a"
          />

          {/* Wheels */}
          <circle cx="28" cy="28" r="8" fill="#090d16" stroke="#1e293b" strokeWidth="1.5" />
          <circle cx="28" cy="28" r="4.5" fill="#334155" />
          <circle cx="28" cy="28" r="2" fill={color} />

          <circle cx="86" cy="28" r="8" fill="#090d16" stroke="#1e293b" strokeWidth="1.5" />
          <circle cx="86" cy="28" r="4.5" fill="#334155" />
          <circle cx="86" cy="28" r="2" fill={color} />
        </svg>
      )}

      {/* 5. Cyber UFO */}
      {vehicleType === 'ufo' && (
        <svg
          viewBox="0 0 115 38"
          className={`${sizeClasses} overflow-visible filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Anti-Gravity Beam Glow */}
          <ellipse cx="58" cy="33" rx="40" ry="3.5" fill={color} opacity="0.6" />
          <polygon points="35,28 80,28 92,34 24,34" fill={color} opacity="0.25" />

          {/* Observation Dome */}
          <path d="M 44 18 Q 58 8 72 18 Z" fill="#38bdf8" opacity="0.75" />
          <circle cx="58" cy="15" r="3" fill="#ffffff" opacity="0.8" />

          {/* Outer Saucer Disc */}
          <ellipse cx="58" cy="23" rx="44" ry="7" fill={color} />
          {/* Metallic Rim Ring */}
          <ellipse cx="58" cy="24" rx="44" ry="4" fill="#0f172a" opacity="0.6" />

          {/* Neon Perimeter Lights */}
          <circle cx="24" cy="24" r="1.8" fill="#f8fafc" />
          <circle cx="41" cy="25.5" r="1.8" fill="#f8fafc" />
          <circle cx="58" cy="26" r="2" fill="#38bdf8" />
          <circle cx="75" cy="25.5" r="1.8" fill="#f8fafc" />
          <circle cx="92" cy="24" r="1.8" fill="#f8fafc" />
        </svg>
      )}

      {/* 6. Apex Dragon */}
      {vehicleType === 'dragon' && (
        <svg
          viewBox="0 0 115 38"
          className={`${sizeClasses} overflow-visible filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <ellipse cx="58" cy="33" rx="44" ry="3.5" fill={color} opacity="0.45" />

          {/* Cyber Wing */}
          <polygon points="32,20 62,6 74,20" fill="#0f172a" />
          <polygon points="36,19 60,9 68,19" fill={color} opacity="0.8" />

          {/* Aerodynamic Dragon Body & Tail */}
          <path
            d="M 12 25 Q 35 24 55 22 Q 78 20 96 22 L 108 24 L 98 28 Q 75 28 55 28 Q 30 30 16 31 Z"
            fill={color}
          />
          {/* Spine Dorsal Plates */}
          <polygon points="40,21 44,17 48,21" fill="#f8fafc" opacity="0.6" />
          <polygon points="54,20 58,16 62,20" fill="#f8fafc" opacity="0.6" />
          <polygon points="68,20 72,16 76,20" fill="#f8fafc" opacity="0.6" />

          {/* Dragon Head & Horn */}
          <polygon points="96,22 108,18 104,22" fill="#334155" />
          {/* Glowing Cyber Eye */}
          <circle cx="98" cy="22" r="1.8" fill="#38bdf8" />
          {/* Nose Plasma Glow */}
          <polygon points="108,24 118,22 118,27 108,26" fill="#38bdf8" opacity="0.45" />
        </svg>
      )}
    </div>
  );
}
