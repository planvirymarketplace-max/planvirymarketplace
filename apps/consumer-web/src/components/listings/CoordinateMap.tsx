'use client';

import React from 'react';
import { MapPin } from 'lucide-react';

interface CoordinateMapProps {
  vendor: {
    city?: string | null;
    state?: string | null;
    location?: string | null;
    [key: string]: unknown;
  };
  getCoordinates: (vendor: any) => { x: number; y: number; label: string };
}

export function CoordinateMap({ vendor, getCoordinates }: CoordinateMapProps) {
  const coords = getCoordinates(vendor);

  return (
    <div className="relative bg-slate-100 rounded-2xl border border-gray-200 overflow-hidden" style={{ height: '220px' }}>
      {/* Static Tennessee SVG map */}
      <svg viewBox="0 0 100 80" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
        {/* Tennessee outline approximation */}
        <path
          d="M5,25 L15,22 L30,20 L50,18 L70,17 L85,18 L95,22 L93,30 L90,40 L88,50 L85,58 L80,62 L75,65 L65,67 L55,68 L45,67 L35,64 L25,60 L18,55 L12,48 L8,40 L5,32 Z"
          fill="#e2e8f0"
          stroke="#94a3b8"
          strokeWidth="0.5"
        />
        {/* City reference dots */}
        <circle cx="48" cy="44" r="1.5" fill="#94a3b8" />
        <circle cx="16" cy="65" r="1" fill="#94a3b8" />
        <circle cx="78" cy="32" r="1" fill="#94a3b8" />
        <circle cx="64" cy="66" r="1" fill="#94a3b8" />
        
        {/* Vendor pin */}
        <g transform={`translate(${coords.x}, ${coords.y})`}>
          <circle r="3" fill="#14b8a6" opacity="0.2">
            <animate attributeName="r" from="3" to="6" dur="2s" repeatCount="indefinite" />
            <animate attributeName="opacity" from="0.3" to="0" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle r="2.5" fill="#14b8a6" stroke="white" strokeWidth="0.5" />
          <text y="-4" textAnchor="middle" fontSize="3" fill="#0f766e" fontWeight="bold" fontFamily="sans-serif">
            {coords.label}
          </text>
        </g>
      </svg>
      
      {/* Overlay label */}
      <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg px-3 py-1.5 flex items-center gap-1.5">
        <MapPin className="w-3 h-3 text-teal-600 shrink-0" />
        <span className="text-[10px] font-bold text-gray-700">
          {vendor.city || coords.label}{vendor.state ? `, ${vendor.state}` : ''}
        </span>
      </div>
    </div>
  );
}
