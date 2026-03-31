"use client";

import { Mafs, Coordinates, Plot, Line, Theme, useMovablePoint, Point } from "mafs";
import { useState } from "react";

export default function HigherOrderDerivativesVis() {
  // Function: f(x) = 0.2x^3 - 2x
  // We use this because it fits nicely in the viewport and has distinct derivatives
  const f = (x: number) => 0.2 * Math.pow(x, 3) - 2 * x;
  const df = (x: number) => 0.6 * Math.pow(x, 2) - 2;      // First derivative (Parabola)
  const d2f = (x: number) => 1.2 * x;                      // Second derivative (Line)
  const d3f = (x: number) => 1.2;                          // Third derivative (Constant)

  const [showDf, setShowDf] = useState(true);
  const [showD2f, setShowD2f] = useState(false);
  const [showD3f, setShowD3f] = useState(false);

  // Initial point at x = 2
  const point = useMovablePoint([2, f(2)], {
    constrain: (p) => [p[0], f(p[0])],
    color: Theme.blue,
  });

  const x = point.point[0];
  const y = point.point[1];
  const y_prime = df(x);
  const y_double_prime = d2f(x);
  const y_triple_prime = d3f(x);

  return (
    <div className="flex flex-col items-center gap-6 p-6 border rounded-xl bg-gray-900 text-white shadow-2xl my-8">
      <div className="flex flex-wrap justify-center gap-4 mb-2">
        <label className="flex items-center gap-2 cursor-pointer bg-gray-800 px-3 py-1 rounded border border-gray-700 hover:bg-gray-700 transition">
          <input 
            type="checkbox" 
            checked={showDf} 
            onChange={(e) => setShowDf(e.target.checked)}
            className="accent-pink-500"
          />
          <span className="text-pink-400 font-bold">Show f'(x)</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer bg-gray-800 px-3 py-1 rounded border border-gray-700 hover:bg-gray-700 transition">
          <input 
            type="checkbox" 
            checked={showD2f} 
            onChange={(e) => setShowD2f(e.target.checked)}
            className="accent-green-500"
          />
          <span className="text-green-400 font-bold">Show f''(x)</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer bg-gray-800 px-3 py-1 rounded border border-gray-700 hover:bg-gray-700 transition">
          <input 
            type="checkbox" 
            checked={showD3f} 
            onChange={(e) => setShowD3f(e.target.checked)}
            className="accent-yellow-500"
          />
          <span className="text-yellow-400 font-bold">Show f'''(x)</span>
        </label>
      </div>

      <div className="w-full h-[400px] bg-gray-950 rounded-lg overflow-hidden border border-gray-800">
        <Mafs viewBox={{ x: [-4, 4], y: [-5, 5] }} pan={false}>
          <Coordinates.Cartesian 
            subdivisions={2}
          />
          
          {/* Main Function f(x) */}
          <Plot.OfX 
            y={f} 
            color={Theme.blue} 
            weight={4} 
            opacity={1}
          />

          {/* First Derivative f'(x) */}
          {showDf && (
            <Plot.OfX 
              y={df} 
              color={Theme.pink} 
              weight={2} 
              style="dashed"
              opacity={0.7}
            />
          )}

          {/* Second Derivative f''(x) */}
          {showD2f && (
            <Plot.OfX 
              y={d2f} 
              color={Theme.green} 
              weight={2} 
              style="dashed"
              opacity={0.7}
            />
          )}

          {/* Third Derivative f'''(x) */}
          {showD3f && (
            <Plot.OfX 
              y={d3f} 
              color={Theme.yellow} 
              weight={2} 
              style="dashed"
              opacity={0.7}
            />
          )}

          {/* Vertical Line to connect graphs */}
          <Line.Segment
            point1={[x, -10]}
            point2={[x, 10]}
            color={Theme.foreground}
            style="dashed"
            opacity={0.3}
          />

          {/* Points on each graph */}
          {/* Point on f(x) */}
          {point.element}
          
          {/* Point on f'(x) */}
          {showDf && (
            <Point x={x} y={y_prime} color={Theme.pink} />
          )}

          {/* Point on f''(x) */}
          {showD2f && (
            <Point x={x} y={y_double_prime} color={Theme.green} />
          )}

          {/* Point on f'''(x) */}
          {showD3f && (
            <Point x={x} y={y_triple_prime} color={Theme.yellow} />
          )}

        </Mafs>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full text-center font-mono text-sm">
        <div className="bg-gray-800 p-3 rounded-lg border border-blue-900/50">
          <div className="text-blue-400 font-bold mb-1">f(x)</div>
          <div className="text-xl">{y.toFixed(2)}</div>
        </div>
        
        <div className={`bg-gray-800 p-3 rounded-lg border ${showDf ? "border-pink-900/50" : "border-gray-700 opacity-50"}`}>
          <div className="text-pink-400 font-bold mb-1">f'(x)</div>
          <div className="text-xl">{y_prime.toFixed(2)}</div>
        </div>

        <div className={`bg-gray-800 p-3 rounded-lg border ${showD2f ? "border-green-900/50" : "border-gray-700 opacity-50"}`}>
          <div className="text-green-400 font-bold mb-1">f''(x)</div>
          <div className="text-xl">{y_double_prime.toFixed(2)}</div>
        </div>

        <div className={`bg-gray-800 p-3 rounded-lg border ${showD3f ? "border-yellow-900/50" : "border-gray-700 opacity-50"}`}>
          <div className="text-yellow-400 font-bold mb-1">f'''(x)</div>
          <div className="text-xl">{y_triple_prime.toFixed(2)}</div>
        </div>
      </div>

      <p className="text-sm text-gray-400 max-w-lg text-center">
        Notice relationships: 
        <br/>
        When <span className="text-blue-400 font-bold">f(x)</span> has a peak/valley, <span className="text-pink-400 font-bold">f'(x)</span> is zero.
        <br/>
        When <span className="text-pink-400 font-bold">f'(x)</span> is increasing, <span className="text-green-400 font-bold">f''(x)</span> is positive.
        <br/>
        <span className="text-yellow-400 font-bold">f'''(x)</span> is constant here because f(x) is cubic.
      </p>
    </div>
  );
}
