"use client";

import { Mafs, Coordinates, Vector, Text, useMovablePoint, Theme, Line } from "mafs";
import { useState } from "react";
import { vec } from "mafs";

export default function InverseMatrixVis() {
  // Matrix A columns (basis vectors)
  const pointI = useMovablePoint([2, 0], {
    color: Theme.blue,
    constrain: (p) => [Math.round(p[0] * 2) / 2, Math.round(p[1] * 2) / 2],
  });
  const pointJ = useMovablePoint([0, 1], {
    color: Theme.red,
    constrain: (p) => [Math.round(p[0] * 2) / 2, Math.round(p[1] * 2) / 2],
  });

  // Input vector x
  const pointX = useMovablePoint([1, 1], {
    color: Theme.yellow,
    constrain: (p) => [Math.round(p[0] * 2) / 2, Math.round(p[1] * 2) / 2],
  });

  const iHat = pointI.point;
  const jHat = pointJ.point;
  const x = pointX.point;

  // Matrix A components
  const a = iHat[0];
  const c = iHat[1];
  const b = jHat[0];
  const d = jHat[1];

  // Determinant
  const det = a * d - b * c;
  const isSingular = Math.abs(det) < 0.01;

  // Calculate Ax = b
  const bx = a * x[0] + b * x[1];
  const by = c * x[0] + d * x[1];
  const vectorB: [number, number] = [bx, by];

  // Calculate Inverse Matrix A^-1
  // [d  -b] / det
  // [-c  a] / det
  let invA = null;
  let vectorRestored: [number, number] | null = null;

  if (!isSingular) {
    invA = {
      a: d / det,
      b: -b / det,
      c: -c / det,
      d: a / det,
    };
    
    // Calculate A^-1 * b (should be x)
    const rx = invA.a * bx + invA.b * by;
    const ry = invA.c * bx + invA.d * by;
    vectorRestored = [rx, ry];
  }

  return (
    <div className="flex flex-col items-center gap-4 p-4 border rounded-lg bg-neutral-900 text-white my-8">
      <div className="flex justify-between w-full max-w-[600px] px-4 font-mono text-sm">
        <div className="flex flex-col gap-1">
          <span className="text-neutral-400">Matrix A:</span>
          <span className="text-blue-400">i_hat = [{a}, {c}]</span>
          <span className="text-red-400">j_hat = [{b}, {d}]</span>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="text-neutral-400">Determinant:</span>
          <span className={`font-bold ${isSingular ? "text-red-500 animate-pulse" : "text-green-400"}`}>
            {det.toFixed(2)}
          </span>
          {isSingular && <span className="text-xs text-red-400">SINGULAR (No Inverse)</span>}
        </div>
      </div>

      <div className="w-full h-[400px]">
        <Mafs viewBox={{ x: [-4, 4], y: [-4, 4] }}>
          <Coordinates.Cartesian />

          {/* Basis Vectors of A */}
          <Vector tip={iHat} color={Theme.blue} weight={3} opacity={0.5} />
          <Vector tip={jHat} color={Theme.red} weight={3} opacity={0.5} />

          {/* Input Vector x */}
          <Vector tip={x} color={Theme.yellow} weight={4} />
          <Text x={x[0]} y={x[1]} attach="nw" color={Theme.yellow} size={20}>x</Text>

          {/* Output Vector b = Ax */}
          <Vector tip={vectorB} color={Theme.green} weight={4} />
          <Text x={vectorB[0]} y={vectorB[1]} attach="se" color={Theme.green} size={20}>b = Ax</Text>

          {/* Inverse Visualization */}
          {/* We show a dashed line from b back to x to represent A^-1 action */}
          {!isSingular && vectorRestored && (
             <Vector 
               tail={vectorB} 
               tip={vectorRestored} 
               color={Theme.indigo} 
               weight={2} 
               style="dashed" 
               opacity={0.6}
             />
          )}

          {/* Interaction Points */}
          {pointI.element}
          {pointJ.element}
          {pointX.element}

        </Mafs>
      </div>

      <div className="text-sm text-neutral-400 text-center max-w-md">
        <p>
          <span className="text-yellow-400">Yellow (x)</span> is transformed by A to <span className="text-green-400">Green (b)</span>.<br/>
          The <span className="text-indigo-400">Indigo dashed line</span> shows the Inverse <span className="font-mono">A⁻¹</span> taking it back home.<br/>
          Try making the determinant 0 (align Red and Blue)!
        </p>
      </div>
    </div>
  );
}
