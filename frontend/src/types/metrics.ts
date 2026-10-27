export interface MetricCardData {
  id: string;
  title: string;
  value?: string | number | null;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  statusText?: string;
  subtitle?: string;
  category?: string;
  isLoading?: boolean;
}

export type RiskLevel = 'HIGH' | 'MEDIUM' | 'LOW' | 'INSUFFICIENT_DATA';

export interface ActivityItem {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  riskLevel?: RiskLevel;
  mineral?: string;
}
