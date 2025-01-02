interface TrendChartProps {
  data: Array<{
    date: string;
    score: number;
  }>;
}

export function TrendChart({ data }: TrendChartProps) {
  if (data.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        No score history available
      </div>
    );
  }

  const maxScore = 25;
  const height = 200;
  const width = '100%';
  const padding = 20;

  const points = data.map((point, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = ((maxScore - point.score) / maxScore) * height;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="relative h-full">
      <svg
        viewBox={`0 0 100 ${height + padding * 2}`}
        preserveAspectRatio="none"
        width={width}
        height="100%"
        className="overflow-visible"
      >
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgb(79, 70, 229, 0.2)" />
            <stop offset="100%" stopColor="rgb(79, 70, 229, 0)" />
          </linearGradient>
        </defs>
        
        {/* Y-axis grid lines */}
        {[0, 5, 10, 15, 20, 25].map((score) => {
          const y = ((maxScore - score) / maxScore) * height + padding;
          return (
            <g key={score}>
              <line
                x1="0"
                y1={y}
                x2="100"
                y2={y}
                stroke="#e5e7eb"
                strokeDasharray="2,2"
              />
              <text
                x="-5"
                y={y}
                textAnchor="end"
                alignmentBaseline="middle"
                className="text-xs fill-gray-500"
              >
                {score}
              </text>
            </g>
          );
        })}

        {/* Line chart */}
        <g transform={`translate(0,${padding})`}>
          <polyline
            points={points}
            fill="none"
            stroke="#4f46e5"
            strokeWidth="2"
          />
          
          {/* Area under the line */}
          <polygon
            points={`0,${height} ${points} 100,${height}`}
            fill="url(#gradient)"
          />
          
          {/* Data points */}
          {data.map((point, index) => {
            const x = (index / (data.length - 1)) * 100;
            const y = ((maxScore - point.score) / maxScore) * height;
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="2"
                fill="#4f46e5"
                className="hover:r-3 transition-all duration-200"
              />
            );
          })}
        </g>
      </svg>
    </div>
  );
}