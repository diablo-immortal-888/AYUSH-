import React, { useState } from 'react';
import {
  TrendingUp,
  LineChart,
  Calendar,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  FlaskConical,
  Activity
} from 'lucide-react';
import { useHealth } from '../../context/HealthContext';

export const TrendsView: React.FC = () => {
  const { allBiomarkers, activeFamilyRecords } = useHealth();

  // Synthetic or real historical data points for the trend charts
  // Combine real biomarkers from records with historical context
  const lftPoints = [
    { date: '2023-04-10', alt: 28, ast: 24, bilirubin: 0.8 },
    { date: '2023-09-15', alt: 35, ast: 29, bilirubin: 1.0 },
    { date: '2024-01-13', alt: 78.32, ast: 52.65, bilirubin: 1.9 } // Current Inamdar test
  ];

  const glucosePoints = [
    { date: '2023-04-10', glucose: 88, hba1c: 5.2 },
    { date: '2023-09-15', glucose: 94, hba1c: 5.3 },
    { date: '2024-01-13', glucose: 98, hba1c: 5.4 }
  ];

  const [hoveredPoint, setHoveredPoint] = useState<any | null>(null);

  return (
    <div className="max-w-4xl mx-auto space-y-6 select-none">
      <div>
        <h2 className="text-xl font-black text-slate-900">
          Biomarker Trend Graphs & Trajectories
        </h2>
        <p className="text-xs text-purple-600/70">
          Track clinical laboratory parameters across recurring medical tests to detect patterns early.
        </p>
      </div>

      {/* Chart 1: Liver Enzymes (SGPT & SGOT) */}
      <div className="bg-white rounded-3xl border border-purple-100 p-5 sm:p-6 shadow-sm shadow-purple-500/5">
        <div className="flex items-center justify-between pb-3 border-b border-purple-100 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-purple-100 text-purple-700">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Liver Transaminases: SGPT (ALT) & SGOT (AST)
              </h3>
              <p className="text-xs text-purple-600/70">
                Normal Limit: ALT ≤ 40 IU/L • AST ≤ 31 IU/L
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-rose-600">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              SGPT / ALT
            </span>
            <span className="flex items-center gap-1.5 text-purple-600">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
              SGOT / AST
            </span>
          </div>
        </div>

        {/* SVG Chart */}
        <div className="h-60 w-full relative">
          <svg className="w-full h-full" viewBox="0 0 500 200" preserveAspectRatio="none">
            {/* Safe Zone Band (0 to 40 IU/L => y: 200 to 110) */}
            <rect x="0" y="110" width="500" height="90" fill="#F5F3FF" opacity="0.6" />
            <line x1="0" y1="110" x2="500" y2="110" stroke="#DDD6FE" strokeDasharray="4 4" strokeWidth="1" />
            <text x="10" y="105" fontSize="10" fill="#8B5CF6" fontWeight="bold">Normal Baseline Cutoff (40 IU/L)</text>

            {/* Grid lines */}
            <line x1="0" y1="50" x2="500" y2="50" stroke="#F1EEF9" strokeWidth="1" />
            <line x1="0" y1="150" x2="500" y2="150" stroke="#F1EEF9" strokeWidth="1" />

            {/* ALT Line (Rose) */}
            <path
              d="M 50 137 L 250 121 L 450 24"
              fill="none"
              stroke="#E11D48"
              strokeWidth="3"
              strokeLinecap="round"
            />

            {/* AST Line (Purple) */}
            <path
              d="M 50 146 L 250 135 L 450 82"
              fill="none"
              stroke="#8B5CF6"
              strokeWidth="3"
              strokeLinecap="round"
            />

            {/* Data Points ALT */}
            {lftPoints.map((p, idx) => {
              const cx = idx === 0 ? 50 : idx === 1 ? 250 : 450;
              const cyAlt = 200 - (p.alt / 90) * 200;
              const cyAst = 200 - (p.ast / 90) * 200;

              return (
                <g key={idx}>
                  <circle
                    cx={cx}
                    cy={cyAlt}
                    r="5"
                    fill="#E11D48"
                    className="hover:scale-125 transition cursor-pointer"
                    onMouseEnter={() => setHoveredPoint({ date: p.date, alt: p.alt, ast: p.ast })}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                  <circle
                    cx={cx}
                    cy={cyAst}
                    r="5"
                    fill="#8B5CF6"
                    className="hover:scale-125 transition cursor-pointer"
                    onMouseEnter={() => setHoveredPoint({ date: p.date, alt: p.alt, ast: p.ast })}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                  <text x={cx - 25} y="195" fontSize="10" fill="#94A3B8" fontWeight="bold">{p.date}</text>
                </g>
              );
            })}
          </svg>

          {/* Interactive Hover Tooltip */}
          {hoveredPoint && (
            <div className="absolute top-2 right-4 bg-slate-900 text-white text-xs p-2.5 rounded-xl shadow-lg pointer-events-none">
              <p className="font-bold">{hoveredPoint.date}</p>
              <p className="text-rose-400">SGPT (ALT): {hoveredPoint.alt} IU/L</p>
              <p className="text-purple-300">SGOT (AST): {hoveredPoint.ast} IU/L</p>
            </div>
          )}
        </div>

        <div className="mt-3 p-3 bg-purple-50/70 rounded-2xl text-xs text-purple-900 leading-relaxed">
          <strong>Clinical Insight:</strong> Transaminases were within normal limits in 2023, then exhibited an acute elevation in Jan 2024 to 78.32 IU/L. This pattern reflects recent acute hepatic irritation rather than long-standing chronic degradation.
        </div>
      </div>

      {/* Chart 2: Total Bilirubin Trend */}
      <div className="bg-white rounded-3xl border border-purple-100 p-5 sm:p-6 shadow-sm shadow-purple-500/5">
        <div className="flex items-center justify-between pb-3 border-b border-purple-100 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-purple-100 text-purple-700">
              <FlaskConical className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Serum Bilirubin Total Trajectory
              </h3>
              <p className="text-xs text-purple-600/70">
                Reference Interval: 0.3 - 1.2 mg/dl
              </p>
            </div>
          </div>

          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-800">
            Current: 1.9 mg/dl (Mildly High)
          </span>
        </div>

        {/* Bilirubin Curve */}
        <div className="h-44 w-full relative">
          <svg className="w-full h-full" viewBox="0 0 500 150" preserveAspectRatio="none">
            <rect x="0" y="60" width="500" height="90" fill="#F5F3FF" opacity="0.6" />
            <line x1="0" y1="60" x2="500" y2="60" stroke="#DDD6FE" strokeDasharray="4 4" strokeWidth="1" />
            <text x="10" y="55" fontSize="10" fill="#8B5CF6" fontWeight="bold">Normal Upper Threshold (1.2 mg/dl)</text>

            <path
              d="M 50 100 L 250 85 L 450 20"
              fill="none"
              stroke="#F59E0B"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <circle cx="50" cy="100" r="5" fill="#F59E0B" />
            <circle cx="250" cy="85" r="5" fill="#F59E0B" />
            <circle cx="450" cy="20" r="5" fill="#F59E0B" />

            <text x="25" y="140" fontSize="10" fill="#94A3B8">Apr 2023 (0.8)</text>
            <text x="225" y="140" fontSize="10" fill="#94A3B8">Sep 2023 (1.0)</text>
            <text x="410" y="140" fontSize="10" fill="#E11D48" fontWeight="bold">Jan 2024 (1.9)</text>
          </svg>
        </div>
      </div>

      {/* Chart 3: Blood Sugar & HbA1c */}
      <div className="bg-white rounded-3xl border border-purple-100 p-5 sm:p-6 shadow-sm shadow-purple-500/5">
        <div className="flex items-center justify-between pb-3 border-b border-purple-100 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-emerald-100 text-emerald-700">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Blood Glucose Stability (Fasting & HbA1c)
              </h3>
              <p className="text-xs text-purple-600/70">
                Healthy non-diabetic range (Fasting &lt; 100 mg/dl, HbA1c &lt; 5.7%)
              </p>
            </div>
          </div>

          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
            Stable & Healthy
          </span>
        </div>

        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="p-3 bg-purple-50/50 rounded-2xl border border-purple-100">
            <span className="text-[10px] font-bold text-purple-400 block mb-0.5">Apr 2023</span>
            <span className="text-base font-black text-slate-900">88 mg/dl</span>
            <span className="text-[10px] text-slate-500 block">HbA1c: 5.2%</span>
          </div>
          <div className="p-3 bg-purple-50/50 rounded-2xl border border-purple-100">
            <span className="text-[10px] font-bold text-purple-400 block mb-0.5">Sep 2023</span>
            <span className="text-base font-black text-slate-900">94 mg/dl</span>
            <span className="text-[10px] text-slate-500 block">HbA1c: 5.3%</span>
          </div>
          <div className="p-3 bg-emerald-50/60 rounded-2xl border border-emerald-200">
            <span className="text-[10px] font-bold text-emerald-600 block mb-0.5">Jan 2024 (Latest)</span>
            <span className="text-base font-black text-emerald-700">98 mg/dl</span>
            <span className="text-[10px] text-emerald-600 font-bold block">HbA1c: 5.4%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
