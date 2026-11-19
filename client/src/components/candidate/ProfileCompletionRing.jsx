import React from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export const ProfileCompletionRing = ({ score = 0, size = 100, strokeWidth = 8 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const isComplete = score >= 70;

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="w-full h-full transform -rotate-90">
          {/* Background Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#E9E6DF"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress Ring in Muted Gold */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#C6A15B"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-700 ease-out"
          />
        </svg>

        {/* Center Percentage Display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-lg font-bold text-[#202124]">{score}%</span>
          <span className="text-[9px] text-[#666666] uppercase tracking-wider font-bold">
            {isComplete ? 'Ready' : 'Draft'}
          </span>
        </div>
      </div>

      <div className="mt-2.5 flex items-center gap-1.5 text-xs text-[#666666]">
        {isComplete ? (
          <span className="flex items-center gap-1 text-[#C6A15B] font-bold">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#C6A15B]" />
            Application Ready
          </span>
        ) : (
          <span className="flex items-center gap-1 text-[#666666] font-medium">
            <AlertCircle className="w-3.5 h-3.5 text-[#C6A15B]" />
            Complete profile to unlock direct hiring
          </span>
        )}
      </div>
    </div>
  );
};
