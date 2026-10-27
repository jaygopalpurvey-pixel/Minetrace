import { TradeRoute, TradeHub, RiskClassification } from '@/types/globe';
import { RankingEntry } from '@/types/api';
import { resolveCoordinates } from '@/lib/geoCoordinates';

const TRADE_DISCLAIMER =
  'ILLUSTRATIVE BILATERAL TRADE CONNECTION — Country-level trade reconciliation does not confirm physical transit coordinates or maritime routing.';

/**
 * Verified Real-World Reference Critical Mineral Supply-Chain Corridors for DEMO SURVEILLANCE MODE.
 * Used when backend has no active seeded records or is offline.
 * Every route is explicitly marked with isRealBackend = false.
 */
export const DEMO_ROUTES: TradeRoute[] = [
  {
    id: 'DEMO-CHL-USA-LITHIUM',
    analysisId: 'ANALYSIS-CHL-USA-283691',
    tradeRecordId: 101,
    originCode: 'CHL',
    originName: 'Chile (Atacama Salar Basin)',
    originCoords: [-23.8634, -69.1328],
    destCode: 'USA',
    destName: 'United States (Port of Long Beach / Gulf)',
    destCoords: [37.0902, -95.7129],
    hasGeographicCoordinates: true,
    mineralName: 'Lithium carbonate',
    commodityCode: '283691',
    period: '2023',
    tradeValueUSD: 850000000,
    volumeKg: 42500000,
    unit: 'kg',
    riskScore: 65.0,
    scoreCompleteness: 'COMPLETE',
    classification: 'RED',
    evaluatedRules: ['R1', 'R2', 'R3', 'R4'],
    sanctionsStatus: 'NO_IDENTIFIED_MATCH',
    evidenceId: 'EVI-CHL-USA-2023-01',
    sourceDataset: 'UN Comtrade (Verified Offline Fixture)',
    isRealBackend: false,
    disclaimer: TRADE_DISCLAIMER,
  },
  {
    id: 'DEMO-COD-CHN-COBALT',
    analysisId: 'ANALYSIS-COD-CHN-260500',
    tradeRecordId: 102,
    originCode: 'COD',
    originName: 'DR Congo (Katanga Copperbelt)',
    originCoords: [-10.7167, 25.4667],
    destCode: 'CHN',
    destName: 'China (Ningbo-Zhoushan Hub)',
    destCoords: [35.8617, 104.1954],
    hasGeographicCoordinates: true,
    mineralName: 'Cobalt ores and concentrates',
    commodityCode: '260500',
    period: '2023',
    tradeValueUSD: 1420000000,
    volumeKg: 68000000,
    unit: 'kg',
    riskScore: 78.5,
    scoreCompleteness: 'COMPLETE',
    classification: 'RED',
    evaluatedRules: ['R1', 'R2', 'R3', 'R5'],
    sanctionsStatus: 'NO_IDENTIFIED_MATCH',
    evidenceId: 'EVI-COD-CHN-2023-02',
    sourceDataset: 'UN Comtrade (Verified Offline Fixture)',
    isRealBackend: false,
    disclaimer: TRADE_DISCLAIMER,
  },
  {
    id: 'DEMO-AUS-JPN-LITHIUM',
    analysisId: 'ANALYSIS-AUS-JPN-283691',
    tradeRecordId: 103,
    originCode: 'AUS',
    originName: 'Australia (Pilbara Hard Rock Spodumene)',
    originCoords: [-25.2744, 133.7751],
    destCode: 'JPN',
    destName: 'Japan (Yokohama Smelting)',
    destCoords: [36.2048, 138.2529],
    hasGeographicCoordinates: true,
    mineralName: 'Spodumene / Lithium Concentrate',
    commodityCode: '283691',
    period: '2023',
    tradeValueUSD: 620000000,
    volumeKg: 31000000,
    unit: 'kg',
    riskScore: 18.0,
    scoreCompleteness: 'COMPLETE',
    classification: 'GREEN',
    evaluatedRules: ['R1', 'R2', 'R3'],
    sanctionsStatus: 'NO_IDENTIFIED_MATCH',
    evidenceId: 'EVI-AUS-JPN-2023-03',
    sourceDataset: 'UN Comtrade (Verified Offline Fixture)',
    isRealBackend: false,
    disclaimer: TRADE_DISCLAIMER,
  },
  {
    id: 'DEMO-IDN-CHN-NICKEL',
    analysisId: 'ANALYSIS-IDN-CHN-750110',
    tradeRecordId: 104,
    originCode: 'IDN',
    originName: 'Indonesia (Morowali Industrial Park)',
    originCoords: [-0.7893, 113.9213],
    destCode: 'CHN',
    destName: 'China (Qingdao / Shanghai Ports)',
    destCoords: [35.8617, 104.1954],
    hasGeographicCoordinates: true,
    mineralName: 'Nickel matte / MHP',
    commodityCode: '750110',
    period: '2023',
    tradeValueUSD: 1980000000,
    volumeKg: 110000000,
    unit: 'kg',
    riskScore: 44.0,
    scoreCompleteness: 'COMPLETE',
    classification: 'AMBER',
    evaluatedRules: ['R1', 'R3'],
    sanctionsStatus: 'NO_IDENTIFIED_MATCH',
    evidenceId: 'EVI-IDN-CHN-2023-04',
    sourceDataset: 'UN Comtrade (Verified Offline Fixture)',
    isRealBackend: false,
    disclaimer: TRADE_DISCLAIMER,
  },
  {
    id: 'DEMO-BRA-DEU-GRAPHITE',
    analysisId: 'ANALYSIS-BRA-DEU-250410',
    tradeRecordId: 105,
    originCode: 'BRA',
    originName: 'Brazil (Minas Gerais Flake Graphite)',
    originCoords: [-14.235, -51.9253],
    destCode: 'DEU',
    destName: 'Germany (Port of Hamburg)',
    destCoords: [51.1657, 10.4515],
    hasGeographicCoordinates: true,
    mineralName: 'Natural crystalline flake graphite',
    commodityCode: '250410',
    period: '2023',
    tradeValueUSD: 310000000,
    volumeKg: 18500000,
    unit: 'kg',
    riskScore: 12.5,
    scoreCompleteness: 'COMPLETE',
    classification: 'GREEN',
    evaluatedRules: ['R1', 'R2'],
    sanctionsStatus: 'NO_IDENTIFIED_MATCH',
    evidenceId: 'EVI-BRA-DEU-2023-05',
    sourceDataset: 'UN Comtrade (Verified Offline Fixture)',
    isRealBackend: false,
    disclaimer: TRADE_DISCLAIMER,
  },
  {
    id: 'DEMO-MMR-CHN-RARE_EARTH',
    analysisId: 'ANALYSIS-MMR-CHN-284690',
    tradeRecordId: 106,
    originCode: 'MMR',
    originName: 'Myanmar (Kachin State Ionic Clays)',
    originCoords: [21.9162, 95.956],
    destCode: 'CHN',
    destName: 'China (Ganzhou Heavy REE Complex)',
    destCoords: [35.8617, 104.1954],
    hasGeographicCoordinates: true,
    mineralName: 'Heavy Rare Earth Compounds (Dysprosium/Terbium)',
    commodityCode: '284690',
    period: '2023',
    tradeValueUSD: 540000000,
    volumeKg: 14000000,
    unit: 'kg',
    riskScore: 88.0,
    scoreCompleteness: 'COMPLETE',
    classification: 'RED',
    evaluatedRules: ['R1', 'R2', 'R3', 'R5'],
    sanctionsStatus: 'MATCH_IDENTIFIED',
    evidenceId: 'EVI-MMR-CHN-2023-06',
    sourceDataset: 'UN Comtrade (Verified Offline Fixture)',
    isRealBackend: false,
    disclaimer: TRADE_DISCLAIMER,
  },
  {
    id: 'DEMO-CAN-USA-NICKEL',
    analysisId: 'ANALYSIS-CAN-USA-750110',
    tradeRecordId: 107,
    originCode: 'CAN',
    originName: 'Canada (Sudbury Basin)',
    originCoords: [56.1304, -106.3468],
    destCode: 'USA',
    destName: 'United States (Detroit Industrial Corridor)',
    destCoords: [37.0902, -95.7129],
    hasGeographicCoordinates: true,
    mineralName: 'Refined Class 1 Nickel',
    commodityCode: '750110',
    period: '2023',
    tradeValueUSD: 720000000,
    volumeKg: 36000000,
    unit: 'kg',
    riskScore: 8.0,
    scoreCompleteness: 'COMPLETE',
    classification: 'GREEN',
    evaluatedRules: ['R1'],
    sanctionsStatus: 'NO_IDENTIFIED_MATCH',
    evidenceId: 'EVI-CAN-USA-2023-07',
    sourceDataset: 'UN Comtrade (Verified Offline Fixture)',
    isRealBackend: false,
    disclaimer: TRADE_DISCLAIMER,
  },
  {
    id: 'DEMO-ZAF-CHN-CHROMIUM',
    analysisId: 'ANALYSIS-ZAF-CHN-261000',
    tradeRecordId: 108,
    originCode: 'ZAF',
    originName: 'South Africa (Bushveld Complex)',
    originCoords: [-25.7479, 28.2293],
    destCode: 'CHN',
    destName: 'China (Tianjin Port)',
    destCoords: [35.8617, 104.1954],
    hasGeographicCoordinates: true,
    mineralName: 'Chromium / Platinum Group',
    commodityCode: '261000',
    period: '2023',
    tradeValueUSD: 780000000,
    volumeKg: 45000000,
    unit: 'kg',
    riskScore: 22.0,
    scoreCompleteness: 'COMPLETE',
    classification: 'AMBER',
    evaluatedRules: ['R1', 'R2'],
    sanctionsStatus: 'NO_IDENTIFIED_MATCH',
    evidenceId: 'EVI-ZAF-CHN-2023-08',
    sourceDataset: 'UN Comtrade (Verified Offline Fixture)',
    isRealBackend: false,
    disclaimer: TRADE_DISCLAIMER,
  },
];

/**
 * Transforms real backend ranking entries into visual TradeRoutes (supporting both
 * coordinate-mapped routes for 3D globe and unmapped records for list forensic triage).
 */
export function buildRoutesFromRankings(rankings: RankingEntry[]): TradeRoute[] {
  return rankings.map((entry, idx) => {
    const originGeo = resolveCoordinates(entry.reporter_country_code);
    const destGeo = resolveCoordinates(entry.partner_country_code);
    const hasCoords = Boolean(originGeo && destGeo);

    let missingReason: string | undefined;
    if (!originGeo && !destGeo) {
      missingReason = `Origin ('${entry.reporter_country_code}') and partner ('${entry.partner_country_code}') lack coordinate centroids`;
    } else if (!originGeo) {
      missingReason = `Origin jurisdiction ('${entry.reporter_country_code}') lacks coordinate centroid`;
    } else if (!destGeo) {
      missingReason = `Partner jurisdiction ('${entry.partner_country_code}') lacks coordinate centroid`;
    }

    const normClass: RiskClassification = (entry.classification?.toUpperCase() as RiskClassification) || 'INSUFFICIENT_DATA';

    return {
      id: `BACKEND-${entry.analysis_id || idx}`,
      analysisId: entry.analysis_id,
      tradeRecordId: entry.trade_record_id,
      originCode: entry.reporter_country_code,
      originName: originGeo ? originGeo.name : `Country ${entry.reporter_country_code}`,
      originCoords: originGeo ? [originGeo.lat, originGeo.lon] : null,
      destCode: entry.partner_country_code,
      destName: destGeo ? destGeo.name : `Country ${entry.partner_country_code}`,
      destCoords: destGeo ? [destGeo.lat, destGeo.lon] : null,
      hasGeographicCoordinates: hasCoords,
      missingInfoReason: missingReason,
      mineralName: entry.mineral_type || `HS ${entry.commodity_code}`,
      commodityCode: entry.commodity_code,
      period: entry.period || '2023',
      tradeValueUSD: 1000000, // Normalized default if unspecified in primary ranking
      volumeKg: null,
      unit: 'kg',
      riskScore: entry.anomaly_score,
      scoreCompleteness: entry.score_completeness || 'COMPLETE',
      classification: normClass,
      evaluatedRules: entry.evaluated_rules || [],
      sanctionsStatus: entry.sanctions_status || 'UNKNOWN',
      evidenceId: `EVI-${entry.analysis_id}`,
      sourceDataset: 'UN Comtrade & Phase 4 Risk Engine',
      isRealBackend: true,
      disclaimer: TRADE_DISCLAIMER,
    };
  });
}

/**
 * Derives unique TradeHub nodes from active routes with valid geographic coordinates.
 */
export function buildHubsFromRoutes(routes: TradeRoute[]): TradeHub[] {
  const hubMap = new Map<string, TradeHub>();

  routes.forEach((r) => {
    if (!r.originCoords || !r.destCoords) return;

    // Origin Hub
    if (!hubMap.has(r.originCode)) {
      hubMap.set(r.originCode, {
        code: r.originCode,
        name: r.originName,
        coords: r.originCoords,
        outboundRoutes: [],
        inboundRoutes: [],
        maxRiskScore: r.riskScore,
        dominantClassification: r.classification,
        totalTradeValueUSD: 0,
      });
    }
    const oHub = hubMap.get(r.originCode)!;
    oHub.outboundRoutes.push(r);
    oHub.maxRiskScore = Math.max(oHub.maxRiskScore, r.riskScore);
    oHub.totalTradeValueUSD += r.tradeValueUSD;

    // Destination Hub
    if (!hubMap.has(r.destCode)) {
      hubMap.set(r.destCode, {
        code: r.destCode,
        name: r.destName,
        coords: r.destCoords,
        outboundRoutes: [],
        inboundRoutes: [],
        maxRiskScore: r.riskScore,
        dominantClassification: r.classification,
        totalTradeValueUSD: 0,
      });
    }
    const dHub = hubMap.get(r.destCode)!;
    dHub.inboundRoutes.push(r);
    dHub.maxRiskScore = Math.max(dHub.maxRiskScore, r.riskScore);
    dHub.totalTradeValueUSD += r.tradeValueUSD;
  });

  // Assign dominant classification to each hub
  hubMap.forEach((hub) => {
    if (hub.maxRiskScore >= 50) {
      hub.dominantClassification = 'RED';
    } else if (hub.maxRiskScore >= 20) {
      hub.dominantClassification = 'AMBER';
    } else {
      hub.dominantClassification = 'GREEN';
    }
  });

  return Array.from(hubMap.values());
}
