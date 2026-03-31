"use client";

import { Mafs, Coordinates, Line, Theme, useMovablePoint, Circle } from "mafs";

export default function ImplicitDiffVis() {
  const radius = 3;
  
  // Point constrained to circle
  const point = useMovablePoint([2.12, 2.12], {
    constrain: (p) => {
      // Normalize to radius
      const len = Math.sqrt(p[0]**2 + p[1]**2);
      if (len === 0) return [radius, 0];
      return [(p[0] / len) * radius, (p[1] / len) * radius];
    },
    color: Theme.red,
  });

  const x = point?.point?.[0] ?? 2.12;
  const y = point?.point?.[1] ?? 2.12;
  
  const hasPoint = Array.isArray(point?.point) && point.point.length >= 2;
  // Implicit derivative: dy/dx = -x/y
  const slope = Math.abs(y) > 0.01 ? -x / y : undefined;

  return (
    <div className="flex flex-col items-center gap-4 p-4 border rounded-lg bg-black text-white">
      <div className="w-full h-[400px]">
        <Mafs viewBox={{ x: [-5, 5], y: [-5, 5] }}>
          <Coordinates.Cartesian />
          
          {/* The Implicit Curve (Circle) */}
          <Circle center={[0, 0]} radius={radius} color={Theme.blue} weight={3} />
          
          {/* Tangent Line */}
          {hasPoint && (
            <>
              {slope !== undefined ? (
                <Line.PointSlope point={[x, y]} slope={slope} color={Theme.pink} weight={2} />
              ) : (
                <Line.ThroughPoints point1={[x, -10]} point2={[x, 10]} color={Theme.pink} weight={2} />
              )}
              {point.element}
            </>
          )}
        </Mafs>
      </div>
      
      <div className="font-mono text-sm">
        <p>x = {x.toFixed(2)}, y = {y.toFixed(2)}</p>
        <p className="mt-2 text-pink-400 font-bold">
          Implicit Slope (-x/y) = {slope !== undefined ? slope.toFixed(3) : "Undefined"}
        </p>
      </div>
      <p className="text-xs text-gray-400">
        Drag the point. The slope is calculated purely from x and y, not by solving for y.
      </p>
    </div>
  );
}
