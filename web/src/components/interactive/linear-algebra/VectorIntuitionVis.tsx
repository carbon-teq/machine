"use client";

import { Mafs, Coordinates, Vector, Text, useMovablePoint, Theme, Line } from "mafs";
import { vec } from "mafs";

export default function VectorIntuitionVis() {
  // Movable point for the vector tip
  const tip = useMovablePoint([3, 2], {
    constrain: (p) => {
      // Snap to nearest 0.5 grid
      return [Math.round(p[0] * 2) / 2, Math.round(p[1] * 2) / 2];
    },
  });

  const vector = tip.point;
  const x = vector[0];
  const y = vector[1];

  return (
    <div className="flex flex-col items-center gap-4 p-4 border rounded-lg bg-neutral-900 text-white my-8">
      <div className="w-full h-[400px]">
        <Mafs viewBox={{ x: [-1, 6], y: [-1, 5] }}>
          <Coordinates.Cartesian />
          
          {/* The Vector */}
          <Vector tip={vector} color={Theme.blue} weight={4} />
          
          {/* Component Lines (Dashed) */}
          <Line.Segment 
            point1={[x, 0]} 
            point2={[x, y]} 
            style="dashed" 
            color={Theme.red} 
            opacity={0.5} 
          />
          <Line.Segment 
            point1={[0, y]} 
            point2={[x, y]} 
            style="dashed" 
            color={Theme.green} 
            opacity={0.5} 
          />

          {/* Component Labels */}
          <Text x={x / 2} y={-0.3} color={Theme.green} size={20}>
            x = {x}
          </Text>
          <Text x={-0.5} y={y / 2} color={Theme.red} size={20}>
            y = {y}
          </Text>

          {/* Numeric Representation (Column Vector) */}
          <Text 
            x={x + 0.5} 
            y={y / 2} 
            color={Theme.foreground}
            size={20}
          >
            {`[${x}, ${y}]`}
          </Text>

          {/* Interactive Tip */}
          {tip.element}
        </Mafs>
      </div>

      <p className="text-sm italic text-neutral-400 text-center">
        Drag the point to see how geometric movement maps to numeric components.
      </p>
    </div>
  );
}
