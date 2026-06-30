'use client'

import React, { useEffect, useRef, useState } from 'react'
import maplibregl from 'maplibre-gl'
import { MapPin, Navigation } from 'lucide-react'

interface GeoapifyMapInnerProps {
  lat: number
  lng: number
  label: string
  radiusMiles?: number
  className?: string
  style?: React.CSSProperties
  apiKey?: string
}

export default function GeoapifyMapInner({
  lat,
  lng,
  label,
  radiusMiles = 25,
  className = '',
  style,
  apiKey,
}: GeoapifyMapInnerProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const mapRef = useRef<maplibregl.Map | null>(null)
  const [mapReady, setMapReady] = useState(false)
  const [mapError, setMapError] = useState<string | null>(null)

  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return

    if (!apiKey) {
      setMapError('Map API key not configured')
      return
    }

    let destroyed = false

    try {
      const map = new maplibregl.Map({
        container: mapContainer.current,
        style: {
          version: 8,
          sources: {
            'geoapify-tiles': {
              type: 'raster',
              tiles: [
                `https://maps.geoapify.com/v1/tile/osm-bright-smooth/{z}/{x}/{y}.png?apiKey=${apiKey}`,
              ],
              tileSize: 256,
              maxzoom: 19,
              attribution: '&copy; <a href="https://www.geoapify.com/">Geoapify</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            },
          },
          layers: [
            {
              id: 'geoapify-tiles-layer',
              type: 'raster',
              source: 'geoapify-tiles',
              minzoom: 0,
              maxzoom: 19,
            },
          ],
        },
        center: [lng, lat],
        zoom: 10,
        scrollZoom: true,
        dragRotate: false,
        pitch: 0,
        bearing: 0,
        preserveDrawingBuffer: true,
      })

      // Handle tile load errors
      map.on('error', () => {
        if (!destroyed) setMapError('Map tiles failed to load')
      })

      map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'bottom-right')

      // Add vendor marker
      const markerEl = document.createElement('div')
      markerEl.className = 'geoapify-vendor-marker'
      markerEl.innerHTML = `
        <div style="
          width: 32px; height: 32px; border-radius: 50%;
          background: #14b8a6; border: 3px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          display: flex; align-items: center; justify-content: center;
          color: white; font-weight: 800; font-size: 12px;
          font-family: Inter, system-ui, sans-serif;
        ">P</div>
      `

      new maplibregl.Marker({ element: markerEl })
        .setLngLat([lng, lat])
        .setPopup(
          new maplibregl.Popup({ offset: 25, closeButton: false }).setText(label),
        )
        .addTo(map)

      // Add service radius circle on load
      map.on('load', () => {
        if (!map || destroyed) return

        const radiusMeters = radiusMiles * 1609.34

        map.addSource('service-radius', {
          type: 'geojson',
          data: createCircleGeoJSON([lng, lat], radiusMeters, 64),
        })

        map.addLayer({
          id: 'service-radius-fill',
          type: 'fill',
          source: 'service-radius',
          paint: {
            'fill-color': '#14b8a6',
            'fill-opacity': 0.08,
          },
        })

        map.addLayer({
          id: 'service-radius-stroke',
          type: 'line',
          source: 'service-radius',
          paint: {
            'line-color': '#14b8a6',
            'line-width': 2,
            'line-opacity': 0.5,
            'line-dasharray': [4, 4],
          },
        })

        if (!destroyed) setMapReady(true)
      })

      mapRef.current = map
    } catch (err) {
      console.error('[GeoapifyMap] Init error:', err)
      if (!destroyed) setMapError('Failed to initialize map')
    }

    return () => {
      destroyed = true
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lat, lng, apiKey, radiusMiles])

  return (
    <div className={`relative rounded-2xl border border-gray-200 overflow-hidden bg-slate-100 ${className}`} style={style ?? { height: '280px' }}>
      <div ref={mapContainer} style={{ position: 'absolute', top: 0, bottom: 0, width: '100%' }} />

      {/* Loading overlay */}
      {!mapReady && !mapError && (
        <div className="absolute inset-0 bg-slate-100 flex items-center justify-center z-10">
          <div className="flex flex-col items-center gap-2">
            <div className="w-6 h-6 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Loading Map</span>
          </div>
        </div>
      )}

      {/* Error fallback */}
      {mapError && (
        <div className="absolute inset-0 bg-slate-100 flex items-center justify-center">
          <div className="flex flex-col items-center gap-2 text-gray-400">
            <MapPin className="w-8 h-8" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Map unavailable</span>
            <span className="text-[9px] text-gray-300">{mapError}</span>
          </div>
        </div>
      )}

      {/* Location badge */}
      {mapReady && (
        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg px-3 py-1.5 flex items-center gap-1.5 z-20 shadow-sm">
          <Navigation className="w-3 h-3 text-teal-600 shrink-0" />
          <span className="text-[10px] font-bold text-gray-700">{label}</span>
          <span className="text-[10px] text-teal-600 font-bold ml-1">{radiusMiles} mi radius</span>
        </div>
      )}
    </div>
  )
}

/**
 * Create a GeoJSON circle polygon from a center point and radius in meters.
 */
function createCircleGeoJSON(
  center: [number, number],
  radiusMeters: number,
  points: number = 64,
) {
  const coords: number[][] = []
  const distanceX = radiusMeters / (111320 * Math.cos((center[1] * Math.PI) / 180))
  const distanceY = radiusMeters / 110574

  for (let i = 0; i <= points; i++) {
    const angle = (i / points) * 2 * Math.PI
    const x = center[0] + distanceX * Math.cos(angle)
    const y = center[1] + distanceY * Math.sin(angle)
    coords.push([x, y])
  }

  return {
    type: 'Feature' as const,
    properties: {},
    geometry: {
      type: 'Polygon' as const,
      coordinates: [coords],
    },
  }
}
