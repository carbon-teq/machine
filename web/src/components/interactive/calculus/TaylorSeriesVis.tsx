'use client';

import { Mafs, Coordinates, Plot, Theme, Point, Text } from "mafs";
import { useState } from "react";

// Factorial helper
const factorial = (n: number): number => {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
};

export default function TaylorSeriesVis() {
  const [degree, setDegree] = useState(1);
  
  // Target function: sin(x)
  const f = Math.sin;
  
  // Taylor series approximation for sin(x) at a=0 (Maclaurin series)
  const taylor = (x: number) => {
    let sum = 0;
    // Iterate through terms up to the current degree
    for (let n = 0; n <= degree; n++) {
      // Only odd terms for sin(x) are non-zero
      if (n % 2 !== 0) {
        // The term index in the series (0, 1, 2...) corresponds to powers (1, 3, 5...)
        // Sign alternates: +, -, +, -
        const termIndex = (n - 1) / 2;
        const sign = termIndex % 2 === 0 ? 1 : -1;
        sum += sign * (Math.pow(x, n) / factorial(n));
      }
    }
    return sum;
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4 border rounded-lg bg-neutral-900 text-white my-8">
      <div className="w-full h-[400px]">
        <Mafs viewBox={{ x: [-8, 8], y: [-3, 3] }}>
          <Coordinates.Cartesian />
          
          {/* True Function */}
          <Plot.OfX y={f} color={Theme.blue} opacity={0.5} weight={3} />
          <Text x={4} y={1.5} color={Theme.blue} size={20}>sin(x)</Text>
          
          {/* Approximation */}
          <Plot.OfX y={taylor} color={Theme.red} weight={2} />
          <Text x={4} y={-1.5} color={Theme.red} size={20}>Approximation</Text>
          
          {/* Center point */}
          <Point x={0} y={0} color={Theme.foreground} />
        </Mafs>
      </div>
      
      <div className="flex flex-col gap-2 w-full max-w-xs">
        <label className="text-sm font-medium">
          Polynomial Degree: {degree}
        </label>
        <input
          type="range"
          min="1"
          max="15"
          step="2" // Step by 2 because even terms are 0 for sin(x)
          value={degree}
          onChange={(e) => setDegree(parseInt(e.target.value))}
          className="w-full accent-red-500"
        />
        <p className="text-xs text-neutral-400 text-center">
          Higher degrees wrap around the function further from the center (x=0).
        </p>
      </div>
    </div>
  );
}
