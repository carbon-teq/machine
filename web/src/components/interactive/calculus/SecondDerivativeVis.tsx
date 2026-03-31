"use client";

import { Mafs, Coordinates, Plot, Line, Theme, useMovablePoint, Point } from "mafs";

export default function SecondDerivativeVis() {
  // Function: f(x) = x^3 - 3x
  // This gives us a nice curve with both concave up and concave down regions
  const f = (x: number) => Math.pow(x, 3) - 3 * x;
  const df = (x: number) => 3 * Math.pow(x, 2) - 3; // First derivative
  const d2f = (x: number) => 6 * x; // Second derivative

  // Initial point at x = 0.5
  const point = useMovablePoint([0.5, f(0.5)], {
    constrain: (p) => [p[0], f(p[0])],
    color: Theme.blue,
  });

  const x = point.point[0];
  const y = point.point[1];
  const slope = df(x);
  const concavity = d2f(x);

  // Tangent line visualization
  // Normalize direction vector (1, slope)
  const tangentLength = 1.5;
  const len = Math.sqrt(1 + slope * slope);
  const dx = (1 / len) * tangentLength;
  const dy = (slope / len) * tangentLength;

  // Determine color based on concavity
  // Positive (Smile) -> Green/Blue
  // Negative (Frown) -> Red/Orange
  const concavityColor = concavity > 0 ? Theme.green : Theme.red;
  const concavityText = concavity > 0 ? "Concave Up (Smile)" : "Concave Down (Frown)";

  return (
    <div className="flex flex-col items-center gap-6 p-6 border rounded-xl bg-gray-900 text-white shadow-2xl my-8">
      <div className="w-full h-[400px] bg-gray-950 rounded-lg overflow-hidden border border-gray-800">
        <Mafs viewBox={{ x: [-2.5, 2.5], y: [-3, 3] }} pan={false}>
          <Coordinates.Cartesian 
            subdivisions={2}
          />
          
          {/* The Function Curve */}
          <Plot.OfX 
            y={f} 
            color={Theme.blue} 
            weight={3} 
            opacity={0.8}
          />
          
          {/* Tangent Line */}
          <Line.Segment
            point1={[x - dx, y - dy]}
            point2={[x + dx, y + dy]}
            color={Theme.pink}
            weight={2}
            opacity={0.6}
          />

          {/* The Movable Point */}
          {point.element}
          
          {/* Visual Indicator of Concavity at the point */}
          <Point x={x} y={y} color={concavityColor} />
        </Mafs>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-center font-mono">
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
          <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">Position (x)</div>
          <div className="text-xl font-bold text-blue-400">{x.toFixed(2)}</div>
        </div>
        
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
          <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">First Derivative (Slope)</div>
          <div className="text-xl font-bold text-pink-400">{slope.toFixed(2)}</div>
          <div className="text-xs text-gray-500 mt-1">
            {Math.abs(slope) < 0.1 ? "Flat (Critical Point)" : slope > 0 ? "Increasing ↗" : "Decreasing ↘"}
          </div>
        </div>

        <div className={`bg-gray-800 p-4 rounded-lg border ${concavity > 0 ? "border-green-900" : "border-red-900"}`}>
          <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">Second Derivative</div>
          <div className={`text-xl font-bold ${concavity > 0 ? "text-green-400" : "text-red-400"}`}>
            {concavity.toFixed(2)}
          </div>
          <div className="text-xs text-gray-300 mt-1 font-bold">
            {concavityText}
          </div>
        </div>
      </div>

      <p className="text-sm text-gray-400 max-w-lg text-center">
        Drag the point along the curve. 
        <br/>
        Notice how the <strong>Second Derivative</strong> tells you if the curve is shaped like a <span className="text-green-400">smile</span> or a <span className="text-red-400">frown</span>.
        <br/>
        At critical points (Slope ≈ 0), check the Second Derivative to see if it's a Min or Max!
      </p>
    </div>
  );
}
