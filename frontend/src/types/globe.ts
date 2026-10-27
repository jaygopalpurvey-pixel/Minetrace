export type RiskClassification = 'GREEN' | 'AMBER' | 'RED' | 'INSUFFICIENT_DATA';

export interface TradeRoute {
  id: string;
  analysisId?: string;
  tradeRecordId?: number | null;
  originCode: string;
  originName: string;
  originCoords?: [number, number] | null; // [lat, lon]
  destCode: string;
  destName: string;
  destCoords?: [number, number] | null; // [lat, lon]
  hasGeographicCoordinates: boolean;
  missingInfoReason?: string;
  mineralName: string;
  commodityCode: string;
  period: string;
  tradeValueUSD: number;
  volumeKg?: number | null;
  unit?: string | null;
  riskScore: number;
  scoreCompleteness?: string;
  classification: RiskClassification;
  evaluatedRules: string[];
  sanctionsStatus: string;
  evidenceId?: string | null;
  sourceDataset?: string;
  isRealBackend: boolean;
  disclaimer: string;
}

export interface TradeHub {
  code: string;
  name: string;
  coords: [number, number]; // [lat, lon]
  outboundRoutes: TradeRoute[];
  inboundRoutes: TradeRoute[];
  maxRiskScore: number;
  dominantClassification: RiskClassification;
  totalTradeValueUSD: number;
}

export interface GlobeFilters {
  mineral: string; // 'ALL' or specific mineral
  classification: string; // 'ALL', 'RED', 'AMBER', 'GREEN', 'INSUFFICIENT_DATA'
  searchQuery: string;
  originCountry?: string; // 'ALL' or ISO-3
  destCountry?: string; // 'ALL' or ISO-3
  minScore?: number;
  maxScore?: number;
  period?: string; // 'ALL' or specific period
}
