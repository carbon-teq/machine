"use client";

import { Mafs, Coordinates, Vector, Text, useMovablePoint, Theme, Line, vec } from "mafs";
import { useState } from "react";

interface LinearCombinationVisProps {
  initialVX?: number;
  initialVY?: number;
  initialWX?: number;
  initialWY?: number;
  weight?: number; // Add optional weight prop to fix type error, though not used
}

export default function LinearCombinationVis({
  initialVX = 1,
  initialVY = 1,
  initialWX = 2,
  initialWY = 0,
}: LinearCombinationVisProps) {
  // Basis vectors (movable)
  const vTip = useMovablePoint([initialVX, initialVY], {
    constrain: (p) => [Math.round(p[0] * 2) / 2, Math.round(p[1] * 2) / 2],
  });
  const wTip = useMovablePoint([initialWX, initialWY], {
    constrain: (p) => [Math.round(p[0] * 2) / 2, Math.round(p[1] * 2) / 2],
  });

  // Scalars (state)
  const [c1, setC1] = useState(1);
  const [c2, setC2] = useState(1);
  const [showSpan, setShowSpan] = useState(false);

  // Vectors
  const v = vTip.point;
  const w = wTip.point;
  
  // Scaled vectors
  const scaledV = vec.scale(v, c1);
  const scaledW = vec.scale(w, c2);
  
  // Resultant vector: c1*v + c2*w
  const result = vec.add(scaledV, scaledW);

  // Check collinearity for Span
  // Cross product in 2D: x1*y2 - x2*y1
  const crossProduct = v[0] * w[1] - v[1] * w[0];
  const isCollinear = Math.abs(crossProduct) < 0.1;

  const setCollinearPreset = () => {
    vTip.point = [1, 1];
    wTip.point = [2, 2];
    setC1(1);
    setC2(-0.5);
  };

  const setStandardPreset = () => {
    vTip.point = [1, 0];
    wTip.point = [0, 1];
    setC1(2);
    setC2(1);
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4 border rounded-lg bg-neutral-900 text-white my-8">
      <div className="flex flex-col w-full max-w-[600px] gap-4 font-mono text-sm">
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <button 
              onClick={setStandardPreset}
              className="px-2 py-1 text-xs bg-neutral-800 hover:bg-neutral-700 rounded"
            >
              Standard Basis
            </button>
            <button 
              onClick={setCollinearPreset}
              className="px-2 py-1 text-xs bg-neutral-800 hover:bg-neutral-700 rounded"
            >
              Broken Robot (Collinear)
            </button>
          </div>
          <div className="flex items-center gap-2">
            <input 
              type="checkbox" 
              id="showSpan" 
              checked={showSpan} 
              onChange={(e) => setShowSpan(e.target.checked)}
              className="accent-blue-500"
            />
            <label htmlFor="showSpan" className="cursor-pointer select-none text-neutral-300">
              Show Span
            </label>
          </div>
        </div>

        <div className="flex justify-between">
          <span className="text-blue-400">v: [{v[0]}, {v[1]}]</span>
          <span className="text-red-400">w: [{w[0]}, {w[1]}]</span>
          <span className="text-emerald-400 font-bold">
            Result: [{result[0].toFixed(1)}, {result[1].toFixed(1)}]
          </span>
        </div>
        
        <div className="flex gap-8 items-center justify-center border-t border-neutral-800 pt-4">
          <div className="flex flex-col gap-1 items-center w-1/2">
            <label className="text-xs text-blue-400 font-mono">
              c1 (Scale v): {c1.toFixed(1)}
            </label>
            <input 
              type="range" 
              min="-3" 
              max="3" 
              step="0.1" 
              value={c1} 
              onChange={(e) => setC1(parseFloat(e.target.value))}
              className="w-full accent-blue-500"
            />
          </div>
          <div className="flex flex-col gap-1 items-center w-1/2">
            <label className="text-xs text-red-400 font-mono">
              c2 (Scale w): {c2.toFixed(1)}
            </label>
            <input 
              type="range" 
              min="-3" 
              max="3" 
              step="0.1" 
              value={c2} 
              onChange={(e) => setC2(parseFloat(e.target.value))}
              className="w-full accent-red-500"
            />
          </div>
        </div>
      </div>

      <div className="w-full h-[400px]">
        <Mafs viewBox={{ x: [-5, 8], y: [-5, 8] }}>
          <Coordinates.Cartesian />
          
          {/* Span Visualization */}
          {showSpan && (
            isCollinear ? (
              <Line.ThroughPoints 
                point1={[0, 0]} 
                point2={v} 
                color={Theme.indigo} 
                opacity={0.3} 
                weight={10} 
              />
            ) : (
              // If not collinear, span is the whole plane. 
              // We can't draw the whole plane, but we can show a text or a large region.
              // Let's just show text for now, or maybe a large rectangle.
              <g>
                <Text x={0} y={6} color={Theme.indigo} size={24}>
                  Span: Entire 2D Plane
                </Text>
              </g>
            )
          )}

          {/* Basis Vectors (Ghosted) */}
          <Vector tip={v} color={Theme.blue} opacity={0.3} weight={2} />
          <Vector tip={w} color={Theme.red} opacity={0.3} weight={2} />

          {/* Scaled Component Vectors */}
          <Vector tip={scaledV} color={Theme.blue} weight={3} />
          {/* Draw scaled W starting from the tip of scaled V (Tip-to-Tail method) */}
          <Vector tail={scaledV} tip={result} color={Theme.red} weight={3} style="dashed" />
          
          {/* Resultant Vector */}
          <Vector tip={result} color={Theme.green} weight={4} />
          
          {/* Labels */}
          <Text x={scaledV[0] / 2} y={scaledV[1] / 2} color={Theme.blue} attach="nw" size={20}>
            {c1.toFixed(1)}v
          </Text>
          <Text 
            x={scaledV[0] + scaledW[0] / 2} 
            y={scaledV[1] + scaledW[1] / 2} 
            color={Theme.red} 
            attach="nw"
            size={20}
          >
            {c2.toFixed(1)}w
          </Text>
          <Text x={result[0]} y={result[1]} color={Theme.green} attach="sw" attachDistance={15} size={20}>
            Result
          </Text>

          {/* Interactive Tips for Basis Vectors */}
          {vTip.element}
          {wTip.element}
        </Mafs>
      </div>

      <div className="text-sm italic text-neutral-400 text-center">
        Drag points to change basis vectors. Use sliders to scale.<br/>
        Check "Show Span" to see reachable areas.
      </div>
    </div>
  );
}
