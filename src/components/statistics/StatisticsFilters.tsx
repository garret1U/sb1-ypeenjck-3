import { useState } from 'react';
import { Filter } from 'lucide-react';
import type { GaugeType } from '../../types';

interface StatisticsFiltersProps {
  onPeriodChange: (period: string) => void;
  onGaugeChange: (gauge: GaugeType | 'all') => void;
  selectedPeriod: string;
  selectedGauge: GaugeType | 'all';
}

const TIME_PERIODS = [
  { id: '12m', label: 'Last 12 Months' },
  { id: 'ytd', label: 'Year to Date' },
  { id: '90d', label: 'Last 90 Days' },
  { id: 'all', label: 'All Time' }
] as const;

const GAUGE_OPTIONS: Array<GaugeType | 'all'> = ['all', '12', '20', '28', '.410'];

export function StatisticsFilters({
  onPeriodChange,
  onGaugeChange,
  selectedPeriod,
  selectedGauge
}: StatisticsFiltersProps) {
  return (
    <div className="flex flex-wrap gap-4 items-center mb-6">
      <div className="flex items-center">
        <Filter className="h-5 w-5 text-gray-400 mr-2" />
        <span className="text-sm font-medium text-gray-700">Filters:</span>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {TIME_PERIODS.map(period => (
          <button
            key={period.id}
            onClick={() => onPeriodChange(period.id)}
            className={`px-3 py-1.5 text-sm font-medium rounded-full transition-colors ${
              selectedPeriod === period.id
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {period.label}
          </button>
        ))}
      </div>

      <div className="h-6 w-px bg-gray-200" />

      <div className="flex flex-wrap gap-2">
        {GAUGE_OPTIONS.map(gauge => (
          <button
            key={gauge}
            onClick={() => onGaugeChange(gauge)}
            className={`px-3 py-1.5 text-sm font-medium rounded-full transition-colors ${
              selectedGauge === gauge
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {gauge === 'all' ? 'All Gauges' : `${gauge} Gauge`}
          </button>
        ))}
      </div>
    </div>
  );
}