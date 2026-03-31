"use client";

import { Mafs, Coordinates, Vector, Text, useMovablePoint, Theme, vec } from "mafs";

interface VectorVisProps {
  initialX?: number;
  initialY?: number;
}

export default function VectorVis({
  initialX = 3,
  initialY = 2,
}: VectorVisProps) {
  // Movable point for the vector tip
  const tip = useMovablePoint([initialX, initialY], {
    constrain: (p) => {
      // Snap to nearest 0.5 grid
      return [Math.round(p[0] * 2) / 2, Math.round(p[1] * 2) / 2];
    },
  });

  const vector = tip.point;
  const magnitude = vec.mag(vector).toFixed(2);
  const angle = (Math.atan2(vector[1], vector[0]) * (180 / Math.PI)).toFixed(1);

  return (
    <div className="flex flex-col items-center gap-4 p-4 border rounded-lg bg-neutral-900 text-white my-8">
      <div className="flex justify-between w-full max-w-[600px] px-4 font-mono text-sm">
        <div>
          Vector: <span className="font-bold text-blue-400">[{vector[0]}, {vector[1]}]</span>
        </div>
        <div>
          |v| = <span className="font-bold">{magnitude}</span>
        </div>
        <div>
          θ = <span className="font-bold">{angle}°</span>
        </div>
      </div>

      <div className="w-full h-[400px]">
        <Mafs viewBox={{ x: [-1, 6], y: [-1, 5] }}>
          <Coordinates.Cartesian />
          
          {/* The Vector */}
          <Vector tip={vector} color={Theme.blue} weight={4} />
          
          {/* Label attached to the vector */}
          <Text 
            x={vector[0] / 2} 
            y={vector[1] / 2} 
            attach="nw" 
            color={Theme.blue}
            size={20}
          >
            v
          </Text>

          {/* Interactive Tip */}
          {tip.element}
        </Mafs>
      </div>

      <p className="text-sm italic text-neutral-400">
        Drag the point to change the vector.
      </p>
    </div>
  );
}
