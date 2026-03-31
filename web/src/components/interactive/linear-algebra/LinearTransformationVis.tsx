"use client";

import { Mafs, Coordinates, Vector, Text, useMovablePoint, Theme, Line, Point } from "mafs";
import { vec } from "mafs";
import { useState } from "react";

export default function LinearTransformationVis() {
  // Transformation Matrix State
  // Default to Identity
  const [matrix, setMatrix] = useState({ a: 1, b: 0, c: 0, d: 1 });
  const [preset, setPreset] = useState("Identity");

  // Movable point for input vector
  const inputPoint = useMovablePoint([1, 1], {
    constrain: (p) => [Math.round(p[0] * 2) / 2, Math.round(p[1] * 2) / 2],
    color: Theme.blue,
  });

  const inputVector = inputPoint.point;

  // Apply transformation: A * v
  // [a c] [x] = [ax + cy]
  // [b d] [y]   [bx + dy]
  const transform = (v: [number, number]): [number, number] => {
    return [
      matrix.a * v[0] + matrix.c * v[1],
      matrix.b * v[0] + matrix.d * v[1],
    ];
  };

  const outputVector = transform(inputVector);

  // Transformed Basis Vectors
  const iHat: [number, number] = [1, 0];
  const jHat: [number, number] = [0, 1];
  const transformedIHat = transform(iHat);
  const transformedJHat = transform(jHat);

  // Presets
  const applyPreset = (type: string) => {
    setPreset(type);
    switch (type) {
      case "Identity":
        setMatrix({ a: 1, b: 0, c: 0, d: 1 });
        break;
      case "Shear":
        setMatrix({ a: 1, b: 0, c: 1, d: 1 }); // Shear X
        break;
      case "Scale":
        setMatrix({ a: 2, b: 0, c: 0, d: 0.5 });
        break;
      case "Rotate":
        const angle = Math.PI / 4; // 45 degrees
        setMatrix({
          a: Math.cos(angle),
          b: Math.sin(angle),
          c: -Math.sin(angle),
          d: Math.cos(angle),
        });
        break;
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4 border rounded-lg bg-neutral-900 text-white my-8">
      {/* Controls */}
      <div className="flex flex-wrap gap-2 justify-center">
        {["Identity", "Shear", "Scale", "Rotate"].map((p) => (
          <button
            key={p}
            onClick={() => applyPreset(p)}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              preset === p
                ? "bg-blue-600 text-white"
                : "bg-neutral-800 text-neutral-400 hover:bg-neutral-700"
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Matrix Display */}
      <div className="font-mono text-lg flex items-center gap-2">
        <span className="text-neutral-400">A =</span>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 px-3 py-2 border-l-2 border-r-2 border-neutral-500 rounded-sm">
          <div className="text-center w-12">{matrix.a.toFixed(2)}</div>
          <div className="text-center w-12">{matrix.c.toFixed(2)}</div>
          <div className="text-center w-12">{matrix.b.toFixed(2)}</div>
          <div className="text-center w-12">{matrix.d.toFixed(2)}</div>
        </div>
      </div>

      <div className="w-full h-[400px]">
        <Mafs viewBox={{ x: [-4, 4], y: [-4, 4] }}>
          <Coordinates.Cartesian />

          {/* Transformed Grid (Simplified) */}
          {/* We draw a few lines to show the warp */}
          {[-4, -3, -2, -1, 0, 1, 2, 3, 4].map((i) => (
            <g key={`grid-${i}`}>
              {/* Vertical lines transformed */}
              <Line.Segment
                point1={transform([i, -10])}
                point2={transform([i, 10])}
                color={Theme.foreground}
                opacity={0.1}
              />
              {/* Horizontal lines transformed */}
              <Line.Segment
                point1={transform([-10, i])}
                point2={transform([10, i])}
                color={Theme.foreground}
                opacity={0.1}
              />
            </g>
          ))}

          {/* Basis Vectors (Original - Ghosted) */}
          <Vector tip={iHat} color={Theme.blue} opacity={0.2} weight={2} />
          <Vector tip={jHat} color={Theme.red} opacity={0.2} weight={2} />

          {/* Transformed Basis Vectors */}
          <Vector tip={transformedIHat} color={Theme.blue} weight={3} />
          <Vector tip={transformedJHat} color={Theme.red} weight={3} />
          
          <Text x={transformedIHat[0]} y={transformedIHat[1]} attach="nw" color={Theme.blue} size={20}>
            î'
          </Text>
          <Text x={transformedJHat[0]} y={transformedJHat[1]} attach="nw" color={Theme.red} size={20}>
            ĵ'
          </Text>

          {/* Input Vector */}
          <Vector tip={inputVector} color={Theme.yellow} opacity={0.5} style="dashed" />
          <Text x={inputVector[0]} y={inputVector[1]} attach="se" color={Theme.yellow} size={20}>
            v
          </Text>
          {inputPoint.element}

          {/* Output Vector */}
          <Vector tip={outputVector} color={Theme.green} weight={4} />
          <Text x={outputVector[0]} y={outputVector[1]} attach="sw" color={Theme.green} size={20}>
            Av
          </Text>

        </Mafs>
      </div>

      <p className="text-sm italic text-neutral-400 text-center">
        Blue/Red arrows are the transformed basis vectors.<br/>
        Yellow is your input vector (drag it). Green is the result.
      </p>
    </div>
  );
}
