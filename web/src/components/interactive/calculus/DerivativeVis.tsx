"use client";

import { Mafs, Coordinates, Plot, Line, Theme, useMovablePoint } from "mafs";

export default function DerivativeVis() {
  // Function: f(x) = 0.5 * (x-1)^2 + 1
  const f = (x: number) => 0.5 * Math.pow(x - 1, 2) + 1;

  // Initial points
  const point1 = useMovablePoint([0, f(0)], {
    constrain: (p) => [p[0], f(p[0])],
    color: Theme.blue,
  });
  
  const point2 = useMovablePoint([2, f(2)], {
    constrain: (p) => [p[0], f(p[0])],
    color: Theme.blue,
  });

  // Calculate slope
  const x1 = point1?.point?.[0] ?? 0;
  const y1 = point1?.point?.[1] ?? f(0);
  const x2 = point2?.point?.[0] ?? 2;
  const y2 = point2?.point?.[1] ?? f(2);

  const hasPoint1 = Array.isArray(point1?.point) && point1.point.length >= 2;
  const hasPoint2 = Array.isArray(point2?.point) && point2.point.length >= 2;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const slope = Math.abs(dx) > 0.001 ? dy / dx : 2 * 0.5 * (x1 - 1); // Exact derivative at limit

  return (
    <div className="flex flex-col items-center gap-4 p-4 border rounded-lg bg-black text-white">
      <div className="w-full h-[400px]">
        <Mafs viewBox={{ x: [-1, 4], y: [-1, 6] }}>
          <Coordinates.Cartesian />
          <Plot.OfX y={f} color={Theme.blue} weight={3} />
          
          {/* Secant / Tangent Line */}
          {hasPoint1 && hasPoint2 && (
            <>
              <Line.ThroughPoints
                point1={[x1, y1]}
                point2={[x2, y2]}
                color={Theme.pink}
                weight={2}
              />
              {point1.element}
              {point2.element}
            </>
          )}
        </Mafs>
      </div>
      
      <div className="font-mono text-sm">
        <p>x₁ = {x1.toFixed(2)}, y₁ = {y1.toFixed(2)}</p>
        <p>x₂ = {x2.toFixed(2)}, y₂ = {y2.toFixed(2)}</p>
        <p className="mt-2 text-pink-400 font-bold">
          Slope (Δy/Δx) = {slope.toFixed(3)}
        </p>
      </div>
      <p className="text-xs text-gray-400">
        Drag the points together to see the Secant Line become the Tangent Line.
      </p>
    </div>
  );
}
