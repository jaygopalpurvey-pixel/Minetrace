import { LucideIcon } from 'lucide-react';

export interface NavItem {
  id: string;
  label: string;
  path: string;
  icon: LucideIcon;
  badge?: string;
  isPhase1Placeholder?: boolean;
}

export type ConnectionStatus = 'checking' | 'connected' | 'disconnected' | 'degraded';
