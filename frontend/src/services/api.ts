/**
 * Centralized MineTrace API Client.
 * Connects directly to the FastAPI backend using proxy routes.
 */

import {
  SystemStatusResponse,
  ClassificationSummaryResponse,
  RankingResponse,
  RankingSummaryResponse,
  IncompleteRankingResponse,
  MineralSummary,
  AuditEventListResponse,
  TradeRecordListResponse,
  EvidenceSnapshotResponse,
  EvidenceValidationResponse,
  RiskAnalysisResponse,
  RiskAnalysisListResponse,
  PDFReportSummary,
  DashboardData,
  AIStatusResponse,
  ExplainRequest,
  ExplainResponse,
  GeneratePDFReportRequest,
  PDFReportListResponse,
  ReportMetadataResponse,
  ReadinessResponse,
} from '@/types/api';

const DEFAULT_TIMEOUT_MS = 4000;

async function fetchWithTimeout<T>(url: string, signal?: AbortSignal): Promise<T | null> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);

  // Link external signal if provided
  if (signal) {
    signal.addEventListener('abort', () => controller.abort());
  }

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }

    return (await res.json()) as T;
  } catch (err: unknown) {
    clearTimeout(timeoutId);
    if (err instanceof Error && err.name === 'AbortError') {
      // Aborted or timed out
      return null;
    }
    console.warn(`[MineTrace API] Request to ${url} failed:`, err);
    return null;
  }
}

export async function getSystemStatus(signal?: AbortSignal): Promise<SystemStatusResponse | null> {
  return fetchWithTimeout<SystemStatusResponse>('/api/v1/data/status', signal);
}

export async function getClassificationSummary(signal?: AbortSignal): Promise<ClassificationSummaryResponse | null> {
  return fetchWithTimeout<ClassificationSummaryResponse>('/api/v1/classification/summary', signal);
}

export interface RankingQueryParams {
  page?: number;
  pageSize?: number;
  period?: string;
  mineralType?: string;
  commodityCode?: string;
  reporterCountryCode?: string;
  partnerCountryCode?: string;
  classification?: string;
  minScore?: number;
  maxScore?: number;
}

export async function getRankings(
  paramsOrPage: number | RankingQueryParams = 1,
  pageSize = 20,
  period?: string,
  signal?: AbortSignal
): Promise<RankingResponse | null> {
  let query = new URLSearchParams();

  if (typeof paramsOrPage === 'number') {
    query.set('page', String(paramsOrPage));
    query.set('page_size', String(pageSize));
    if (period && period !== 'ALL') {
      query.set('period', period);
    }
  } else {
    const p = paramsOrPage;
    query.set('page', String(p.page || 1));
    query.set('page_size', String(p.pageSize || 20));
    if (p.period && p.period !== 'ALL') query.set('period', p.period);
    if (p.mineralType && p.mineralType !== 'ALL') query.set('mineral_type', p.mineralType);
    if (p.commodityCode) query.set('commodity_code', p.commodityCode);
    if (p.reporterCountryCode && p.reporterCountryCode !== 'ALL') query.set('reporter_country_code', p.reporterCountryCode);
    if (p.partnerCountryCode && p.partnerCountryCode !== 'ALL') query.set('partner_country_code', p.partnerCountryCode);
    if (p.classification && p.classification !== 'ALL') query.set('classification', p.classification);
    if (p.minScore !== undefined && p.minScore > 0) query.set('min_score', String(p.minScore));
    if (p.maxScore !== undefined && p.maxScore < 100) query.set('max_score', String(p.maxScore));
  }

  // Primary endpoint in backend is /api/v1/ranking
  const res = await fetchWithTimeout<RankingResponse>(`/api/v1/ranking?${query.toString()}`, signal);
  if (res) return res;

  // Fallback to /api/v1/rankings if primary alias is configured
  return fetchWithTimeout<RankingResponse>(`/api/v1/rankings?${query.toString()}`, signal);
}

export async function getRankingSummary(signal?: AbortSignal): Promise<RankingSummaryResponse | null> {
  return fetchWithTimeout<RankingSummaryResponse>('/api/v1/ranking/summary', signal);
}

export async function getIncompleteRankings(
  page = 1,
  pageSize = 20,
  signal?: AbortSignal
): Promise<IncompleteRankingResponse | null> {
  return fetchWithTimeout<IncompleteRankingResponse>(
    `/api/v1/ranking/incomplete?page=${page}&page_size=${pageSize}`,
    signal
  );
}

export async function validateEvidence(
  analysisId: string,
  signal?: AbortSignal
): Promise<EvidenceValidationResponse | null> {
  return fetchWithTimeout<EvidenceValidationResponse>(
    `/api/v1/evidence/${encodeURIComponent(analysisId)}/validate`,
    signal
  );
}

export async function getEvidenceSnapshot(
  analysisId: string,
  signal?: AbortSignal
): Promise<EvidenceSnapshotResponse | null> {
  return fetchWithTimeout<EvidenceSnapshotResponse>(`/api/v1/evidence/${encodeURIComponent(analysisId)}`, signal);
}

export async function getTradeRecords(
  skip = 0,
  limit = 50,
  signal?: AbortSignal
): Promise<TradeRecordListResponse | null> {
  return fetchWithTimeout<TradeRecordListResponse>(`/api/v1/trade-records?skip=${skip}&limit=${limit}`, signal);
}

export async function getRiskAnalysisList(
  skip = 0,
  limit = 50,
  signal?: AbortSignal
): Promise<RiskAnalysisListResponse | null> {
  return fetchWithTimeout<RiskAnalysisListResponse>(`/api/v1/risk/results?skip=${skip}&limit=${limit}`, signal);
}

export async function getRiskAnalysisDetail(
  analysisId: string,
  signal?: AbortSignal
): Promise<RiskAnalysisResponse | null> {
  return fetchWithTimeout<RiskAnalysisResponse>(`/api/v1/risk/results/${encodeURIComponent(analysisId)}`, signal);
}

export async function getRankingSnapshots(
  signal?: AbortSignal
): Promise<{ snapshots: Array<{ snapshot_id: string; created_at: string; total_eligible: number }> } | null> {
  return fetchWithTimeout<{ snapshots: Array<{ snapshot_id: string; created_at: string; total_eligible: number }> }>(
    '/api/v1/ranking/snapshots',
    signal
  );
}

export async function getAIStatus(signal?: AbortSignal): Promise<AIStatusResponse | null> {
  return fetchWithTimeout<AIStatusResponse>('/api/v1/ai/status', signal);
}

export async function explainRiskQuery(
  payload: ExplainRequest,
  signal?: AbortSignal
): Promise<ExplainResponse | null> {
  try {
    const res = await fetch('/api/v1/ai/explain', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
      signal,
    });
    if (!res.ok) {
      const errBody = await res.json().catch(() => null);
      throw new Error(errBody?.detail || `HTTP ${res.status}: ${res.statusText}`);
    }
    return (await res.json()) as ExplainResponse;
  } catch (err: unknown) {
    if (err instanceof Error && err.name === 'AbortError') return null;
    console.warn('[MineTrace API] AI explain request failed:', err);
    throw err;
  }
}

export async function generatePdfReport(
  params: string | GeneratePDFReportRequest
): Promise<PDFReportSummary | null> {
  const payload: GeneratePDFReportRequest =
    typeof params === 'string'
      ? { analysis_id: params, include_ai_explanation: true }
      : params;

  try {
    const res = await fetch('/api/v1/reports/pdf', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const errBody = await res.json().catch(() => null);
      throw new Error(errBody?.detail || `HTTP ${res.status}: ${res.statusText}`);
    }
    return (await res.json()) as PDFReportSummary;
  } catch (err) {
    console.warn('[MineTrace API] Report generation failed:', err);
    throw err;
  }
}

export async function getReportsList(
  analysisId?: string,
  page = 1,
  pageSize = 20,
  signal?: AbortSignal
): Promise<PDFReportListResponse | null> {
  const query = new URLSearchParams();
  query.set('page', String(page));
  query.set('page_size', String(pageSize));
  if (analysisId) query.set('analysis_id', analysisId);

  return fetchWithTimeout<PDFReportListResponse>(`/api/v1/reports?${query.toString()}`, signal);
}

export async function getReportMetadata(
  reportId: string,
  signal?: AbortSignal
): Promise<ReportMetadataResponse | null> {
  return fetchWithTimeout<ReportMetadataResponse>(
    `/api/v1/reports/${encodeURIComponent(reportId)}`,
    signal
  );
}

export function getReportDownloadUrl(reportId: string): string {
  return `/api/v1/reports/${encodeURIComponent(reportId)}/download`;
}

export async function getMinerals(signal?: AbortSignal): Promise<MineralSummary[]> {
  const data = await fetchWithTimeout<MineralSummary[]>('/api/v1/minerals', signal);
  return data || [];
}

export async function getRecentAuditEvents(
  pageSize = 6,
  signal?: AbortSignal
): Promise<AuditEventListResponse | null> {
  return fetchWithTimeout<AuditEventListResponse>(`/api/v1/audit/events?page=1&page_size=${pageSize}`, signal);
}

/**
 * Loads aggregated dashboard data across all key analytical endpoints concurrently.
 */
export async function loadDashboardOverview(
  period?: string,
  signal?: AbortSignal
): Promise<DashboardData> {
  try {
    const [status, classificationSummary, rankings, minerals, auditRes] = await Promise.all([
      getSystemStatus(signal),
      getClassificationSummary(signal),
      getRankings(1, 10, period, signal),
      getMinerals(signal),
      getRecentAuditEvents(6, signal),
    ]);

    const isLive = Boolean(status || classificationSummary || rankings);

    return {
      status,
      classificationSummary,
      rankings,
      minerals,
      auditEvents: auditRes?.events || [],
      lastUpdated: new Date(),
      isLive,
      loading: false,
      error: null,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to connect to backend engine.';
    return {
      status: null,
      classificationSummary: null,
      rankings: null,
      minerals: [],
      auditEvents: [],
      lastUpdated: null,
      isLive: false,
      loading: false,
      error: message,
    };
  }
}

export async function getSystemReadiness(signal?: AbortSignal): Promise<ReadinessResponse | null> {
  return fetchWithTimeout<ReadinessResponse>('/api/v1/health/readiness', signal);
}
