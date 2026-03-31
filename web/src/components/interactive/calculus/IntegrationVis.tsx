'use client';

import { Mafs, Coordinates, Plot, Theme, Polygon, Text } from "mafs";
import { useState } from "react";

export default function IntegrationVis() {
  const [n, setN] = useState(4); // Number of rectangles
  
  // Function to integrate: f(x) = 0.1 * x^2 + 1
  const f = (x: number) => 0.1 * x * x + 1;
  const a = 0;
  const b = 6;
  
  const width = (b - a) / n;
  
  // Calculate area approximation
  let areaApprox = 0;
  const rectangles = [];
  
  for (let i = 0; i < n; i++) {
    const xLeft = a + i * width;
    const height = f(xLeft); // Left Riemann sum
    areaApprox += height * width;
    
    rectangles.push(
      <Polygon
        key={i}
        points={[
          [xLeft, 0],
          [xLeft + width, 0],
          [xLeft + width, height],
          [xLeft, height]
        ]}
        color={Theme.blue}
        fillOpacity={0.2}
        strokeOpacity={0.5}
      />
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 p-4 border rounded-lg bg-neutral-900 text-white my-8">
      <div className="w-full h-[400px]">
        <Mafs viewBox={{ x: [-1, 8], y: [-2, 6] }}>
          <Coordinates.Cartesian />
          <Plot.OfX y={f} color={Theme.red} weight={3} />
          {rectangles}
          <Text x={b/2} y={-1} attach="n" size={20}>
            Area ≈ {areaApprox.toFixed(2)}
          </Text>
        </Mafs>
      </div>
      
      <div className="flex flex-col gap-2 w-full max-w-xs">
        <label className="text-sm font-medium">
          Number of Rectangles (n): {n}
        </label>
        <input
          type="range"
          min="1"
          max="50"
          value={n}
          onChange={(e) => setN(parseInt(e.target.value))}
          className="w-full accent-blue-500"
        />
        <p className="text-xs text-neutral-400 text-center">
          More rectangles = Better approximation
        </p>
      </div>
    </div>
  );
}
