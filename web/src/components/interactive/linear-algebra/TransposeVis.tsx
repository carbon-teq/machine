"use client";

import { Mafs, Coordinates, Vector, Text, useMovablePoint, Theme, Line } from "mafs";
import { useState } from "react";

export default function TransposeVis() {
  // Matrix A columns (basis vectors)
  // iHat = [a, c]^T
  // jHat = [b, d]^T
  // Matrix A = [[a, b], [c, d]]
  
  const pointI = useMovablePoint([2, 1], {
    color: Theme.blue,
    constrain: (p) => [Math.round(p[0] * 2) / 2, Math.round(p[1] * 2) / 2],
  });
  const pointJ = useMovablePoint([1, 2], {
    color: Theme.red,
    constrain: (p) => [Math.round(p[0] * 2) / 2, Math.round(p[1] * 2) / 2],
  });

  const iHat = pointI.point;
  const jHat = pointJ.point;

  // A = [ iHat  jHat ]
  // A = [[ix, jx], [iy, jy]]
  const a = iHat[0];
  const c = iHat[1];
  const b = jHat[0];
  const d = jHat[1];

  // Transpose A^T
  // Swap rows and columns.
  // A^T = [[a, c], [b, d]]
  // New iHat_T = [a, b]^T
  // New jHat_T = [c, d]^T
  
  const iHatT: [number, number] = [a, b];
  const jHatT: [number, number] = [c, d];

  return (
    <div className="flex flex-col items-center gap-8 p-4 border rounded-lg bg-neutral-900 text-white my-8">
      
      {/* Matrix Display */}
      <div className="flex gap-12 font-mono text-lg">
        <div className="flex flex-col items-center gap-2">
          <span className="text-neutral-400">Matrix A</span>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 px-3 py-2 border-l-2 border-r-2 border-neutral-500 rounded-sm">
            <div className="text-center w-12 text-blue-400">{a}</div>
            <div className="text-center w-12 text-red-400">{b}</div>
            <div className="text-center w-12 text-blue-400">{c}</div>
            <div className="text-center w-12 text-red-400">{d}</div>
          </div>
        </div>

        <div className="flex flex-col justify-center text-neutral-500">
          ➔ Transpose ➔
        </div>

        <div className="flex flex-col items-center gap-2">
          <span className="text-neutral-400">Matrix Aᵀ</span>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 px-3 py-2 border-l-2 border-r-2 border-neutral-500 rounded-sm">
            <div className="text-center w-12 text-blue-400">{a}</div>
            <div className="text-center w-12 text-blue-400">{c}</div>
            <div className="text-center w-12 text-red-400">{b}</div>
            <div className="text-center w-12 text-red-400">{d}</div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-8 w-full">
        {/* Plot A */}
        <div className="w-[350px] h-[350px] flex flex-col items-center gap-2">
          <span className="text-sm text-neutral-400">Transformation A</span>
          <Mafs viewBox={{ x: [-4, 4], y: [-4, 4] }}>
            <Coordinates.Cartesian />
            <Vector tip={iHat} color={Theme.blue} weight={4} />
            <Vector tip={jHat} color={Theme.red} weight={4} />
            <Text x={iHat[0]} y={iHat[1]} attach="nw" color={Theme.blue} size={20}>î</Text>
            <Text x={jHat[0]} y={jHat[1]} attach="se" color={Theme.red} size={20}>ĵ</Text>
            {pointI.element}
            {pointJ.element}
          </Mafs>
        </div>

        {/* Plot A^T */}
        <div className="w-[350px] h-[350px] flex flex-col items-center gap-2">
          <span className="text-sm text-neutral-400">Transformation Aᵀ</span>
          <Mafs viewBox={{ x: [-4, 4], y: [-4, 4] }}>
            <Coordinates.Cartesian />
            <Vector tip={iHatT} color={Theme.blue} weight={4} style="dashed" />
            <Vector tip={jHatT} color={Theme.red} weight={4} style="dashed" />
            <Text x={iHatT[0]} y={iHatT[1]} attach="nw" color={Theme.blue} size={20}>îᵀ</Text>
            <Text x={jHatT[0]} y={jHatT[1]} attach="se" color={Theme.red} size={20}>ĵᵀ</Text>
          </Mafs>
        </div>
      </div>

      <p className="text-sm italic text-neutral-400 text-center max-w-lg">
        Notice how the <span className="text-blue-400">Blue Column</span> of A becomes the <span className="text-blue-400">Blue Row</span> of Aᵀ.<br/>
        Geometrically, the vectors are swapping roles.
      </p>
    </div>
  );
}
