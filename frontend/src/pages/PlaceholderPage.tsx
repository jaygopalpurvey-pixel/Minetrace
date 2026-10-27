import React from 'react';
import { LucideIcon, ArrowLeft, Compass } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { GlassCard } from '@/components/ui/GlassCard';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { SecondaryButton } from '@/components/ui/SecondaryButton';

export interface PlaceholderPageProps {
  title: string;
  subtitle: string;
  targetPhase: string;
  icon: LucideIcon;
  description: string;
  plannedFeatures: string[];
}

export const PlaceholderPage: React.FC<PlaceholderPageProps> = ({
  title,
  subtitle,
  targetPhase,
  icon: Icon,
  description,
  plannedFeatures,
}) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-6">
      <div className="flex items-center gap-2 mb-2">
        <SecondaryButton
          size="sm"
          variant="ghost"
          leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}
          onClick={() => navigate('/')}
          className="text-xs font-mono"
        >
          RETURN TO OVERVIEW
        </SecondaryButton>
      </div>

      <GlassCard className="p-8 sm:p-12 text-center relative overflow-hidden">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-tech-grid opacity-30 pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-[#111A2B] border border-[#43D9FF]/40 text-[#43D9FF] flex items-center justify-center shadow-glow-cyan mb-5">
            <Icon className="w-8 h-8 text-[#43D9FF]" />
          </div>

          <div className="flex items-center gap-2 mb-2">
            <StatusBadge status={`SCHEDULED FOR ${targetPhase.toUpperCase()}`} variant="cyan" size="sm" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-[#F5F7FF] mb-2">
            {title}
          </h2>
          <p className="text-xs sm:text-sm font-mono text-[#43D9FF] uppercase tracking-wider mb-4">
            {subtitle}
          </p>
          <p className="text-sm text-[#8D9AB2] max-w-lg mb-8 leading-relaxed">
            {description}
          </p>

          {/* Planned Features List */}
          <div className="w-full max-w-lg bg-[#070A12]/80 border border-[#8D9AB2]/20 rounded-xl p-5 mb-8 text-left">
            <div className="flex items-center gap-2 text-xs font-mono text-[#F5F7FF] font-semibold mb-3 border-b border-[#8D9AB2]/10 pb-2">
              <Compass className="w-4 h-4 text-[#7287FF]" />
              <span>PLANNED PHASE SPECIFICATIONS:</span>
            </div>
            <ul className="space-y-2 text-xs text-[#8D9AB2] font-mono">
              {plannedFeatures.map((feat, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#43D9FF]" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          <PrimaryButton onClick={() => navigate('/')}>
            Back to Intelligence Overview
          </PrimaryButton>
        </div>
      </GlassCard>
    </div>
  );
};
