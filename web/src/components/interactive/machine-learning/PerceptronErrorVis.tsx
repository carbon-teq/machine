"use client";

import { Mafs, Coordinates, Plot, Line, Theme, useMovablePoint, Point } from "mafs";
import { useState } from "react";

export default function PerceptronErrorVis() {
  // Error function: E(w) = (w - 1)^2
  // This comes from:
  // y = -1
  // x = -1
  // w2 = 1, b = 1
  // y_hat = w*(-1) + 1*(-1) + 1 = -w
  // Error = y - y_hat = -1 - (-w) = w - 1
  // Squared Error = (w - 1)^2
  
  const f = (w: number) => Math.pow(w - 1, 2);
  const df = (w: number) => 2 * (w - 1); // Derivative: 2(w-1)

  // Initial point at w = -1 (where Error = 4)
  const point = useMovablePoint([-1, f(-1)], {
    constrain: (p) => [p[0], f(p[0])],
    color: Theme.red,
  });

  const w = point.point[0];
  const error = point.point[1];
  const gradient = df(w);

  // Tangent line length for visualization
  const tangentLength = 1;
  // Normalize direction vector (1, gradient)
  const len = Math.sqrt(1 + gradient * gradient);
  const dx = (1 / len) * tangentLength;
  const dy = (gradient / len) * tangentLength;

  return (
    <div className="flex flex-col items-center gap-6 p-6 border rounded-xl bg-gray-900 text-white shadow-2xl my-8">
      <div className="w-full h-[400px] bg-gray-950 rounded-lg overflow-hidden border border-gray-800">
        <Mafs viewBox={{ x: [-2, 4], y: [-1, 5] }} pan={false}>
          <Coordinates.Cartesian 
            subdivisions={2}
            xAxis={{ labels: (n) => n.toFixed(1) }}
            yAxis={{ labels: (n) => n.toFixed(1) }}
          />
          
          {/* The Error Parabola */}
          <Plot.OfX 
            y={f} 
            color={Theme.blue} 
            weight={4} 
            opacity={0.8}
          />
          
          {/* Tangent Line (Gradient) */}
          <Line.Segment
            point1={[w - dx, error - dy]}
            point2={[w + dx, error + dy]}
            color={Theme.pink}
            weight={2}
            opacity={0.7}
          />

          {/* Gradient Vector (pointing downhill) */}
          {/* We want to show the direction of descent, which is -gradient */}
          {/* But visually, the tangent slope *is* the gradient. */}
          {/* Let's just show the point and the tangent line for now. */}

          {/* The Movable Weight Point */}
          {point.element}
          
          {/* Label for the point */}
          <Point x={w} y={error} color={Theme.red} opacity={0} />
        </Mafs>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-center font-mono">
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
          <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">Weight (w₁)</div>
          <div className="text-2xl font-bold text-blue-400">{w.toFixed(2)}</div>
        </div>
        
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
          <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">Squared Error</div>
          <div className="text-2xl font-bold text-red-400">{error.toFixed(2)}</div>
        </div>

        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
          <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">Gradient (Slope)</div>
          <div className="text-2xl font-bold text-pink-400">{gradient.toFixed(2)}</div>
          <div className="text-xs text-gray-500 mt-1">
            {gradient > 0 ? "Move Left ←" : gradient < 0 ? "Move Right →" : "Optimal!"}
          </div>
        </div>
      </div>

      <p className="text-sm text-gray-400 max-w-lg text-center">
        Drag the <span className="text-red-400 font-bold">red point</span> to change the weight $w_1$. 
        Notice how the error (blue curve) changes. The pink line shows the slope (gradient) at that point.
        To minimize error, we always want to move <strong>against</strong> the gradient.
      </p>
    </div>
  );
}
