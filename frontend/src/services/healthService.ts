/**
 * Service to check MineTrace backend connectivity in a safe, non-blocking manner.
 */

import { getApiUrl } from './api';

export interface SystemHealth {
  connected: boolean;
  statusText: string;
  version?: string;
  checkedAt?: Date;
}

export async function checkBackendHealth(): Promise<SystemHealth> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    const response = await fetch(getApiUrl('/health'), {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      return {
        connected: true,
        statusText: data.status || 'ONLINE',
        version: data.version || '0.8.0',
        checkedAt: new Date(),
      };
    }

    return {
      connected: false,
      statusText: 'OFFLINE',
      checkedAt: new Date(),
    };
  } catch {
    return {
      connected: false,
      statusText: 'DISCONNECTED',
      checkedAt: new Date(),
    };
  }
}
