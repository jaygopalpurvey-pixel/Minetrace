import React, { useState, useMemo, useRef, useCallback } from 'react';
import {
  CONTINENTS,
  SOVEREIGN_JURISDICTIONS,
  CountryJurisdiction,
  projectLatLon,
  generateTradeArc,
} from './worldMapData';
import { TradeRoute } from '@/types/globe';
import { resolveCoordinates } from '@/lib/geoCoordinates';

export interface PoliticalWorldMapProps {
  routes: TradeRoute[];
  selectedRouteId?: string | null;
  onSelectRoute?: (route: TradeRoute | null) => void;
  onHoverRoute?: (route: TradeRoute | null, x: number, y: number) => void;
  highlightCountryCode?: string | null;
  className?: string;
}

export const PoliticalWorldMap: React.FC<PoliticalWorldMapProps> = ({
  routes = [],
  selectedRouteId,
  onSelectRoute,
  onHoverRoute,
  highlightCountryCode,
  className = '',
}) => {
  // 1. Pan and Zoom State
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Hovered Country State
  const [hoveredCountry, setHoveredCountry] = useState<CountryJurisdiction | null>(null);
  const [hoveredRouteLocal, setHoveredRouteLocal] = useState<TradeRoute | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const svgRef = useRef<SVGSVGElement | null>(null);

  // Zoom handlers
  const handleZoomIn = () => setZoom((z) => Math.min(3.5, Number((z + 0.35).toFixed(2))));
  const handleZoomOut = () => setZoom((z) => Math.max(1, Number((z - 0.35).toFixed(2))));
  const handleResetZoom = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Mouse pan handlers
  const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    if (e.button !== 0) return; // only left click
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (rect) {
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }

    if (isDragging) {
      const maxPanX = (zoom - 1) * 350;
      const maxPanY = (zoom - 1) * 180;
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;
      setPan({
        x: Math.max(-maxPanX, Math.min(maxPanX, newX)),
        y: Math.max(-maxPanY, Math.min(maxPanY, newY)),
      });
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  // Wheel zoom
  const handleWheel = (e: React.WheelEvent<SVGSVGElement>) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      setZoom((z) => Math.min(3.5, Number((z + 0.15).toFixed(2))));
    } else {
      setZoom((z) => {
        const next = Math.max(1, Number((z - 0.15).toFixed(2)));
        if (next === 1) setPan({ x: 0, y: 0 });
        return next;
      });
    }
  };

  // 2. Computed ViewBox with Pan/Zoom
  const viewBox = useMemo(() => {
    const baseW = 1000;
    const baseH = 500;
    const w = baseW / zoom;
    const h = baseH / zoom;
    // Map pan offset to viewBox coordinates
    const cx = 500 - pan.x / zoom;
    const cy = 250 - pan.y / zoom;
    const minX = Math.max(0, Math.min(1000 - w, cx - w / 2));
    const minY = Math.max(0, Math.min(500 - h, cy - h / 2));
    return `${minX.toFixed(1)} ${minY.toFixed(1)} ${w.toFixed(1)} ${h.toFixed(1)}`;
  }, [zoom, pan]);

  // 3. Processed Trade Corridor Arcs
  const projectedCorridors = useMemo(() => {
    return routes.map((route) => {
      // Resolve origin coordinates
      let originLat = route.originCoords ? route.originCoords[0] : 0;
      let originLon = route.originCoords ? route.originCoords[1] : 0;
      if (!route.originCoords || (originLat === 0 && originLon === 0)) {
        const c = resolveCoordinates(route.originCode, route.originName);
        if (c) {
          originLat = c.lat;
          originLon = c.lon;
        }
      }

      // Resolve destination coordinates
      let destLat = route.destCoords ? route.destCoords[0] : 0;
      let destLon = route.destCoords ? route.destCoords[1] : 0;
      if (!route.destCoords || (destLat === 0 && destLon === 0)) {
        const c = resolveCoordinates(route.destCode, route.destName);
        if (c) {
          destLat = c.lat;
          destLon = c.lon;
        }
      }

      const p1 = projectLatLon(originLat, originLon);
      const p2 = projectLatLon(destLat, destLon);
      const arc = generateTradeArc(p1.x, p1.y, p2.x, p2.y);

      // Color scheme based on classification
      let strokeColor = '#20E09E'; // GREEN
      let glowColor = 'rgba(32, 224, 158, 0.4)';
      if (route.classification === 'RED' || route.riskScore >= 50) {
        strokeColor = '#FF5B65';
        glowColor = 'rgba(255, 91, 101, 0.5)';
      } else if (route.classification === 'AMBER' || route.riskScore >= 20) {
        strokeColor = '#FFB547';
        glowColor = 'rgba(255, 181, 71, 0.45)';
      }

      const isSelected = selectedRouteId === route.id || selectedRouteId === route.analysisId;

      return {
        route,
        p1,
        p2,
        arc,
        strokeColor: isSelected ? '#43D9FF' : strokeColor,
        glowColor: isSelected ? 'rgba(67, 217, 255, 0.7)' : glowColor,
        isSelected,
      };
    });
  }, [routes, selectedRouteId]);

  // Handle route hover
  const handleRouteMouseEnter = useCallback(
    (route: TradeRoute, e: React.MouseEvent) => {
      setHoveredRouteLocal(route);
      const rect = svgRef.current?.getBoundingClientRect();
      const x = rect ? e.clientX - rect.left : e.clientX;
      const y = rect ? e.clientY - rect.top : e.clientY;
      if (onHoverRoute) {
        onHoverRoute(route, x, y);
      }
    },
    [onHoverRoute]
  );

  const handleRouteMouseLeave = useCallback(() => {
    setHoveredRouteLocal(null);
    if (onHoverRoute) {
      onHoverRoute(null, 0, 0);
    }
  }, [onHoverRoute]);

  return (
    <div className={`relative w-full h-full select-none bg-[#070A12] overflow-hidden ${className}`}>
      {/* 2D SVG Map Canvas */}
      <svg
        ref={svgRef}
        viewBox={viewBox}
        className={`w-full h-full transition-transform duration-75 ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
        preserveAspectRatio="xMidYMid slice"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      >
        <defs>
          {/* Subtle Radar Scanline Gradient */}
          <linearGradient id="oceanGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#050811" />
            <stop offset="50%" stopColor="#080D1A" />
            <stop offset="100%" stopColor="#060914" />
          </linearGradient>

          {/* Graticule / Grid Pattern */}
          <pattern id="tacticalGrid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="#43D9FF"
              strokeWidth="0.5"
              strokeOpacity="0.04"
            />
          </pattern>

          {/* Hub Glow Filter */}
          <filter id="hubGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Arc Glow Filter */}
          <filter id="arcGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="1.8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* 1. Deep Ocean Base */}
        <rect width="1000" height="500" fill="url(#oceanGradient)" />
        <rect width="1000" height="500" fill="url(#tacticalGrid)" />

        {/* 2. Geopolitical Graticules (Latitude & Longitude Lines) */}
        <g className="graticules pointer-events-none opacity-40">
          {/* Equator (0°) */}
          <line
            x1="0"
            y1="250"
            x2="1000"
            y2="250"
            stroke="#43D9FF"
            strokeWidth="0.8"
            strokeDasharray="4 4"
            strokeOpacity="0.35"
          />
          <text x="10" y="246" fill="#43D9FF" fontSize="7" fontFamily="monospace" opacity="0.6">
            EQUATOR 0°00&apos;
          </text>

          {/* Tropic of Cancer (23.5°N -> y = 184.7) */}
          <line
            x1="0"
            y1="185"
            x2="1000"
            y2="185"
            stroke="#8D9AB2"
            strokeWidth="0.4"
            strokeDasharray="2 4"
            strokeOpacity="0.25"
          />
          <text x="10" y="181" fill="#8D9AB2" fontSize="6" fontFamily="monospace" opacity="0.5">
            TROPIC OF CANCER 23.5°N
          </text>

          {/* Tropic of Capricorn (23.5°S -> y = 315.3) */}
          <line
            x1="0"
            y1="315"
            x2="1000"
            y2="315"
            stroke="#8D9AB2"
            strokeWidth="0.4"
            strokeDasharray="2 4"
            strokeOpacity="0.25"
          />
          <text x="10" y="311" fill="#8D9AB2" fontSize="6" fontFamily="monospace" opacity="0.5">
            TROPIC OF CAPRICORN 23.5°S
          </text>

          {/* Prime Meridian (0°) */}
          <line
            x1="500"
            y1="0"
            x2="500"
            y2="500"
            stroke="#43D9FF"
            strokeWidth="0.8"
            strokeDasharray="4 4"
            strokeOpacity="0.3"
          />
          <text x="504" y="15" fill="#43D9FF" fontSize="7" fontFamily="monospace" opacity="0.6">
            PRIME MERIDIAN 0°00&apos;
          </text>

          {/* Longitude meridians every 60° (x = 166.7, 333.3, 666.7, 833.3) */}
          <line x1="167" y1="0" x2="167" y2="500" stroke="#8D9AB2" strokeWidth="0.3" strokeDasharray="2 4" strokeOpacity="0.2" />
          <text x="170" y="15" fill="#8D9AB2" fontSize="6" fontFamily="monospace" opacity="0.4">120°W</text>
          <line x1="333" y1="0" x2="333" y2="500" stroke="#8D9AB2" strokeWidth="0.3" strokeDasharray="2 4" strokeOpacity="0.2" />
          <text x="336" y="15" fill="#8D9AB2" fontSize="6" fontFamily="monospace" opacity="0.4">60°W</text>
          <line x1="667" y1="0" x2="667" y2="500" stroke="#8D9AB2" strokeWidth="0.3" strokeDasharray="2 4" strokeOpacity="0.2" />
          <text x="670" y="15" fill="#8D9AB2" fontSize="6" fontFamily="monospace" opacity="0.4">60°E</text>
          <line x1="833" y1="0" x2="833" y2="500" stroke="#8D9AB2" strokeWidth="0.3" strokeDasharray="2 4" strokeOpacity="0.2" />
          <text x="836" y="15" fill="#8D9AB2" fontSize="6" fontFamily="monospace" opacity="0.4">120°E</text>
        </g>

        {/* 3. Base Continental Landmasses */}
        <g className="continents">
          {CONTINENTS.map((cont) => (
            <path
              key={cont.id}
              d={cont.path}
              fill="#0B1322"
              stroke="#18253D"
              strokeWidth="0.75"
              className="transition-colors duration-200"
            />
          ))}
        </g>

        {/* 4. Sovereign Critical Mineral Jurisdictions & Political Boundaries */}
        <g className="sovereign-jurisdictions">
          {SOVEREIGN_JURISDICTIONS.map((country) => {
            const isHovered = hoveredCountry?.code === country.code;
            const isHighlighted =
              highlightCountryCode?.toUpperCase() === country.code.toUpperCase();

            // Default dark metallic styling vs hovered/highlighted state
            let fill = '#111C2E';
            let stroke = '#243754';
            let strokeWidth = 0.9;

            if (isHighlighted) {
              fill = '#1B3152';
              stroke = '#43D9FF';
              strokeWidth = 1.8;
            } else if (isHovered) {
              fill = '#162843';
              stroke = '#7287FF';
              strokeWidth = 1.4;
            }

            return (
              <g key={country.code} className="cursor-pointer">
                <path
                  d={country.path}
                  fill={fill}
                  stroke={stroke}
                  strokeWidth={strokeWidth}
                  className="transition-all duration-200 hover:brightness-125"
                  onMouseEnter={() => setHoveredCountry(country)}
                  onMouseLeave={() => setHoveredCountry(null)}
                />

                {/* Country Code Label */}
                <text
                  x={country.labelX}
                  y={country.labelY}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill={isHovered || isHighlighted ? '#F5F7FF' : '#8D9AB2'}
                  fontSize={isHovered ? '9' : '7.5'}
                  fontFamily="monospace"
                  fontWeight={isHovered || isHighlighted ? 'bold' : 'normal'}
                  className="pointer-events-none select-none transition-all duration-150"
                  style={{
                    textShadow: '0 1px 3px rgba(0,0,0,0.9), 0 0 6px rgba(11,19,34,0.8)',
                  }}
                >
                  {country.code}
                </text>
              </g>
            );
          })}
        </g>

        {/* 5. Bilateral Trade Corridor Arcs */}
        <g className="trade-corridors">
          {projectedCorridors.map(
            ({ route, p1, p2, arc, strokeColor, glowColor, isSelected }) => {
              const isHovered = hoveredRouteLocal?.id === route.id;
              const arcWidth = isSelected ? 3.2 : isHovered ? 2.5 : 1.6;

              return (
                <g
                  key={route.id}
                  className="cursor-pointer group"
                  onClick={() => onSelectRoute && onSelectRoute(route)}
                  onMouseEnter={(e) => handleRouteMouseEnter(route, e)}
                  onMouseLeave={handleRouteMouseLeave}
                >
                  {/* Invisible broad hit-area for easy clicking/hovering */}
                  <path
                    d={arc.path}
                    fill="none"
                    stroke="transparent"
                    strokeWidth="14"
                    strokeLinecap="round"
                  />

                  {/* Ambient Glow Arc */}
                  <path
                    d={arc.path}
                    fill="none"
                    stroke={glowColor}
                    strokeWidth={arcWidth + 3.5}
                    strokeLinecap="round"
                    filter="url(#arcGlow)"
                    className="opacity-70 group-hover:opacity-100 transition-opacity"
                  />

                  {/* Crisp Foreground Arc */}
                  <path
                    d={arc.path}
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth={arcWidth}
                    strokeLinecap="round"
                    strokeDasharray={isSelected ? 'none' : '6 2'}
                    className="transition-all duration-200"
                  />

                  {/* Animated Cargo Pulse Traveling Along Arc */}
                  <circle r={isSelected ? 3.5 : 2.5} fill={strokeColor} filter="url(#hubGlow)">
                    <animateMotion
                      dur={isSelected ? '2.2s' : '3.6s'}
                      repeatCount="indefinite"
                      path={arc.path}
                    />
                  </circle>

                  {/* Origin Hub Marker */}
                  <g className="origin-hub">
                    <circle
                      cx={p1.x}
                      cy={p1.y}
                      r={isSelected ? 6 : 4}
                      fill={strokeColor}
                      filter="url(#hubGlow)"
                    />
                    <circle
                      cx={p1.x}
                      cy={p1.y}
                      r={isSelected ? 11 : 8}
                      fill="none"
                      stroke={strokeColor}
                      strokeWidth="1"
                      opacity="0.6"
                      className="animate-ping"
                      style={{ transformOrigin: `${p1.x}px ${p1.y}px`, animationDuration: '2.5s' }}
                    />
                  </g>

                  {/* Destination Hub Marker */}
                  <g className="dest-hub">
                    <circle
                      cx={p2.x}
                      cy={p2.y}
                      r={isSelected ? 5.5 : 3.8}
                      fill="#F5F7FF"
                      stroke={strokeColor}
                      strokeWidth="1.5"
                    />
                    <circle
                      cx={p2.x}
                      cy={p2.y}
                      r={isSelected ? 10 : 7}
                      fill="none"
                      stroke="#F5F7FF"
                      strokeWidth="0.75"
                      opacity="0.4"
                    />
                  </g>
                </g>
              );
            }
          )}
        </g>
      </svg>

      {/* Floating Tactical Country Tooltip */}
      {hoveredCountry && !hoveredRouteLocal && (
        <div
          className="pointer-events-none absolute z-30 transform -translate-x-1/2 -translate-y-full mb-3 px-3 py-2 rounded-xl bg-[#090D17]/95 border border-[#43D9FF]/40 shadow-2xl backdrop-blur-md text-xs font-mono text-[#F5F7FF] max-w-xs transition-opacity duration-150 animate-in fade-in-0"
          style={{
            left: `${mousePos.x}px`,
            top: `${mousePos.y - 12}px`,
          }}
        >
          <div className="flex items-center gap-2 pb-1 border-b border-[#8D9AB2]/20">
            <span className="text-base">{hoveredCountry.flag}</span>
            <div>
              <p className="font-bold text-[#F5F7FF] leading-tight">
                {hoveredCountry.name} ({hoveredCountry.code})
              </p>
              <p className="text-[10px] text-[#43D9FF] font-semibold">{hoveredCountry.role}</p>
            </div>
          </div>
          <p className="text-[11px] text-[#8D9AB2] mt-1.5 leading-relaxed">
            {hoveredCountry.specialty}
          </p>
        </div>
      )}

      {/* Floating Tactical Corridor Route Tooltip */}
      {hoveredRouteLocal && (
        <div
          className="pointer-events-none absolute z-30 transform -translate-x-1/2 -translate-y-full mb-3 p-3 rounded-xl bg-[#090D17]/95 border shadow-2xl backdrop-blur-md text-xs font-mono max-w-sm transition-opacity duration-150 animate-in fade-in-0"
          style={{
            left: `${mousePos.x}px`,
            top: `${mousePos.y - 14}px`,
            borderColor:
              hoveredRouteLocal.classification === 'RED'
                ? 'rgba(255, 91, 101, 0.5)'
                : hoveredRouteLocal.classification === 'AMBER'
                ? 'rgba(255, 181, 71, 0.5)'
                : 'rgba(32, 224, 158, 0.5)',
          }}
        >
          {/* Header with Risk Classification */}
          <div className="flex items-center justify-between gap-3 pb-1.5 border-b border-[#8D9AB2]/20">
            <span className="text-[10px] text-[#43D9FF] font-bold tracking-wider">
              {hoveredRouteLocal.mineralName}
            </span>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                hoveredRouteLocal.classification === 'RED'
                  ? 'bg-[#FF5B65]/20 text-[#FF5B65]'
                  : hoveredRouteLocal.classification === 'AMBER'
                  ? 'bg-[#FFB547]/20 text-[#FFB547]'
                  : 'bg-[#20E09E]/20 text-[#20E09E]'
              }`}
            >
              {hoveredRouteLocal.classification} ({hoveredRouteLocal.riskScore.toFixed(1)})
            </span>
          </div>

          {/* Corridor Trade Path */}
          <div className="mt-1.5 flex items-center gap-1.5 text-xs text-[#F5F7FF] font-semibold">
            <span className="text-[#F5F7FF]">{hoveredRouteLocal.originName}</span>
            <span className="text-[#43D9FF]">➔</span>
            <span className="text-[#F5F7FF]">{hoveredRouteLocal.destName}</span>
          </div>

          {/* Trade Metrics */}
          <div className="mt-2 grid grid-cols-2 gap-2 text-[10px] text-[#8D9AB2] pt-1.5 border-t border-[#8D9AB2]/15">
            <div>
              <span>VALUE (USD): </span>
              <strong className="text-[#F5F7FF]">
                {hoveredRouteLocal.tradeValueUSD
                  ? `$${(hoveredRouteLocal.tradeValueUSD / 1e6).toFixed(1)}M`
                  : 'N/A'}
              </strong>
            </div>
            <div>
              <span>VOLUME: </span>
              <strong className="text-[#F5F7FF]">
                {hoveredRouteLocal.volumeKg
                  ? `${(hoveredRouteLocal.volumeKg / 1e6).toFixed(1)}M ${hoveredRouteLocal.unit || 'kg'}`
                  : 'N/A'}
              </strong>
            </div>
          </div>

          <div className="mt-2 text-[9px] text-[#43D9FF]/80 flex items-center justify-between">
            <span>CLICK CORRIDOR TO INSPECT DOSSIER</span>
            <span>PERIOD: {hoveredRouteLocal.period}</span>
          </div>
        </div>
      )}

      {/* Embedded Map Control Buttons on Bottom Right */}
      <div className="absolute bottom-3 right-3 z-20 flex items-center gap-1.5 bg-[#090D17]/85 border border-[#8D9AB2]/25 p-1 rounded-xl backdrop-blur-md shadow-xl text-xs font-mono">
        <button
          onClick={handleZoomIn}
          title="Zoom In"
          aria-label="Zoom In"
          className="w-7 h-7 flex items-center justify-center rounded-lg bg-[#111A2B] text-[#8D9AB2] hover:text-[#43D9FF] hover:bg-[#162238] transition-all font-bold"
        >
          +
        </button>
        <span className="text-[10px] text-[#8D9AB2] px-1 font-mono tabular-nums">
          {Math.round(zoom * 100)}%
        </span>
        <button
          onClick={handleZoomOut}
          title="Zoom Out"
          aria-label="Zoom Out"
          className="w-7 h-7 flex items-center justify-center rounded-lg bg-[#111A2B] text-[#8D9AB2] hover:text-[#43D9FF] hover:bg-[#162238] transition-all font-bold"
        >
          -
        </button>
        <button
          onClick={handleResetZoom}
          title="Reset Global View"
          aria-label="Reset Global View"
          className="px-2 h-7 flex items-center justify-center rounded-lg bg-[#111A2B] text-[10px] text-[#8D9AB2] hover:text-[#43D9FF] hover:bg-[#162238] transition-all font-medium"
        >
          RESET
        </button>
      </div>
    </div>
  );
};
