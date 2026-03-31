"use client";

import { Mafs, Coordinates, Vector, Text, useMovablePoint, Theme, Polygon, Line } from "mafs";
import { useState } from "react";

export default function DeterminantVis() {
  // We define the matrix by defining where i-hat and j-hat land.
  // This is more intuitive for "area" than typing numbers.
  
  // Transformed i-hat (starts at 1, 0)
  const pointI = useMovablePoint([2, 0], {
    color: Theme.blue,
    constrain: (p) => [Math.round(p[0] * 2) / 2, Math.round(p[1] * 2) / 2],
  });

  // Transformed j-hat (starts at 0, 1)
  const pointJ = useMovablePoint([0, 1], {
    color: Theme.red,
    constrain: (p) => [Math.round(p[0] * 2) / 2, Math.round(p[1] * 2) / 2],
  });

  const iHat = pointI.point;
  const jHat = pointJ.point;

  // Matrix components
  const a = iHat[0];
  const c = iHat[1]; // Note: usually [a c; b d] but here vector is column. 
                     // iHat = [a, b]^T, jHat = [c, d]^T in standard notation [col1 col2]
                     // Let's stick to standard: Matrix A = [iHat  jHat]
                     // A = [[ix, jx], [iy, jy]]
  
  const ix = iHat[0];
  const iy = iHat[1];
  const jx = jHat[0];
  const jy = jHat[1];

  // Determinant = ad - bc = (ix * jy) - (jx * iy)
  const det = (ix * jy) - (jx * iy);

  // The unit square vertices: (0,0), (1,0), (1,1), (0,1)
  // Transformed vertices:
  // (0,0) -> (0,0)
  // (1,0) -> iHat
  // (0,1) -> jHat
  // (1,1) -> iHat + jHat

  const p0: [number, number] = [0, 0];
  const p1 = iHat;
  const p2: [number, number] = [ix + jx, iy + jy];
  const p3 = jHat;

  return (
    <div className="flex flex-col items-center gap-4 p-4 border rounded-lg bg-neutral-900 text-white my-8">
      <div className="flex justify-between w-full max-w-[600px] px-4 font-mono text-sm">
        <div className="flex flex-col gap-1">
          <span className="text-neutral-400">Matrix Columns:</span>
          <span className="text-blue-400">i_hat = [{ix}, {iy}]</span>
          <span className="text-red-400">j_hat = [{jx}, {jy}]</span>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="text-neutral-400">Determinant (Area):</span>
          <span className={`text-xl font-bold ${det < 0 ? "text-indigo-400" : "text-green-400"}`}>
            {det.toFixed(2)}
          </span>
          {det < 0 && <span className="text-xs text-indigo-300">(Orientation Flipped)</span>}
        </div>
      </div>

      <div className="w-full h-[400px]">
        <Mafs viewBox={{ x: [-1, 5], y: [-2, 4] }}>
          <Coordinates.Cartesian />

          {/* Original Unit Square (Ghost) */}
          <Polygon 
            points={[[0,0], [1,0], [1,1], [0,1]]} 
            color={Theme.foreground} 
            weight={1} 
            fillOpacity={0.1} 
            strokeOpacity={0.3}
            strokeStyle="dashed"
          />

          {/* Transformed Parallelogram */}
          <Polygon 
            points={[p0, p1, p2, p3]} 
            color={det < 0 ? Theme.indigo : Theme.green} 
            weight={2} 
            fillOpacity={0.4} 
          />

          {/* Basis Vectors */}
          <Vector tip={iHat} color={Theme.blue} weight={4} />
          <Vector tip={jHat} color={Theme.red} weight={4} />

          {/* Labels */}
          <Text x={iHat[0]} y={iHat[1]} attach="nw" color={Theme.blue} size={20}>î'</Text>
          <Text x={jHat[0]} y={jHat[1]} attach="se" color={Theme.red} size={20}>ĵ'</Text>

          {/* Interaction Points */}
          {pointI.element}
          {pointJ.element}

        </Mafs>
      </div>

      <p className="text-sm italic text-neutral-400 text-center">
        Drag the <span className="text-blue-400">Blue</span> and <span className="text-red-400">Red</span> vector tips.<br/>
        See how the area (Determinant) changes.
      </p>
    </div>
  );
}
