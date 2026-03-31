"use client";

import { useEffect, useRef, useState, useCallback } from 'react';
import { ManimScene } from 'manim-web/react';
import { Scene, Axes, Dot, Line, Text, RED, GREEN, BLUE, WHITE, LEFT, RIGHT, UP, DOWN, Mobject } from 'manim-web';

export default function PerceptronInteractive() {
  const scenarios = [
    { label: "Rainy + Expensive", x1: 0, x2: 0, target: 0 },
    { label: "Rainy + Cheap", x1: 0, x2: 1, target: 0 },
    { label: "Sunny + Expensive", x1: 1, x2: 0, target: 0 },
    { label: "Sunny + Cheap", x1: 1, x2: 1, target: 1 },
  ];

  const [w1, setW1] = useState(1);
  const [w2, setW2] = useState(1);
  const [b, setB] = useState(-1.5);
  const [selectedScenario, setSelectedScenario] = useState(3);

  // Use a ref to pass the latest values to the Manim scene updater
  const paramsRef = useRef({ w1, w2, b, selectedScenario });
  useEffect(() => {
    paramsRef.current = { w1, w2, b, selectedScenario };
  }, [w1, w2, b, selectedScenario]);

  const construct = useCallback(async (scene: Scene) => {
    // 1. Create Axes
    const axes = new Axes({
      xRange: [-0.5, 1.5, 0.5],
      yRange: [-0.5, 1.5, 0.5],
      axisConfig: { color: BLUE },
      xLength: 6,
      yLength: 6,
    });

    // 2. Create Data Points (AND Gate)
    // (0,0) -> 0 (Red)
    const p00 = new Dot({ radius: 0.15, color: RED });
    const p00coords = axes.coordsToPoint(0, 0);
    p00.moveTo(p00coords);

    // (0,1) -> 0 (Red)
    const p01 = new Dot({ radius: 0.15, color: RED });
    const p01coords = axes.coordsToPoint(0, 1);
    p01.moveTo(p01coords);

    // (1,0) -> 0 (Red)
    const p10 = new Dot({ radius: 0.15, color: RED });
    const p10coords = axes.coordsToPoint(1, 0);
    p10.moveTo(p10coords);

    // (1,1) -> 1 (Green)
    const p11 = new Dot({ radius: 0.15, color: GREEN });
    const p11coords = axes.coordsToPoint(1, 1);
    p11.moveTo(p11coords);

    // Labels
    const label00 = new Text({ text: "(0,0)" }).scale(0.5).nextTo(p00, DOWN);
    const label01 = new Text({ text: "(0,1)" }).scale(0.5).nextTo(p01, LEFT);
    const label10 = new Text({ text: "(1,0)" }).scale(0.5).nextTo(p10, DOWN);
    const label11 = new Text({ text: "(1,1)" }).scale(0.5).nextTo(p11, UP);
    const xLabel = new Text({ text: "x1: Weather (0=Rainy, 1=Sunny)" }).scale(0.42).nextTo(axes, DOWN);
    const yLabel = new Text({ text: "x2: Ticket (0=Expensive, 1=Cheap)" }).scale(0.42).nextTo(axes, LEFT).rotate(Math.PI / 2);

    // Marker for currently selected lesson example
    const activeScenarioMarker = new Text({ text: "★", color: WHITE }).scale(0.7);
    activeScenarioMarker.addUpdater((mob: Mobject) => {
      const marker = mob as Text;
      const { selectedScenario } = paramsRef.current;
      const scenario = scenarios[selectedScenario];
      const markerPoint = axes.coordsToPoint(scenario.x1, scenario.x2);
      marker.moveTo(markerPoint);
    });

    // 3. Create Decision Boundary Line
    const line = new Line({ start: axes.coordsToPoint(-1, -1), end: axes.coordsToPoint(2, 2), color: WHITE, strokeWidth: 4 });

    // Updater function for the line
    line.addUpdater((mob: Mobject) => {
      const l = mob as Line;
      const { w1, w2, b } = paramsRef.current;
      
      // Equation: w1*x + w2*y + b = 0
      // y = (-w1*x - b) / w2
      
      let startPoint, endPoint;

      if (Math.abs(w2) < 0.01) {
        // Vertical line: x = -b / w1
        if (Math.abs(w1) < 0.01) {
            // Both zero, undefined line (or plane at infinity), just hide or default
            startPoint = axes.coordsToPoint(0, 0);
            endPoint = axes.coordsToPoint(0, 0);
        } else {
            const x = -b / w1;
            startPoint = axes.coordsToPoint(x, -10);
            endPoint = axes.coordsToPoint(x, 10);
        }
      } else {
        // Normal case
        // Calculate y for x = -2 and x = 2 (far enough to cover view)
        const x1 = -2;
        const y1 = (-w1 * x1 - b) / w2;
        const x2 = 2;
        const y2 = (-w1 * x2 - b) / w2;
        
        startPoint = axes.coordsToPoint(x1, y1);
        endPoint = axes.coordsToPoint(x2, y2);
      }

      // Try setPoints if putStartAndEndOn doesn't exist
      if ('putStartAndEndOn' in l) {
          (l as any).putStartAndEndOn(startPoint, endPoint);
      } else {
          // Fallback or try another method
          l.setPoints([startPoint, endPoint]);
      }
    });

    // Add everything to scene
    scene.add(axes);
    scene.add(p00, p01, p10, p11);
    scene.add(label00, label01, label10, label11);
    scene.add(xLabel, yLabel);
    scene.add(line);
    scene.add(activeScenarioMarker);
    
    // Keep the scene running to allow updates
    // In manim-web, scenes usually end when construct finishes unless we wait
    // But for interactive scenes, we want it to persist.
    // We can just await a long promise or rely on the runner not stopping immediately.
    // Actually, manim-web's React component keeps the scene alive if we don't finish?
    // Let's try just returning. The updater should run on each frame.
  }, []);

  const active = scenarios[selectedScenario];
  const z = w1 * active.x1 + w2 * active.x2 + b;
  const output = z > 0 ? 1 : 0;

  return (
    <div className="flex flex-col gap-6 p-6 border rounded-lg bg-slate-50 dark:bg-slate-900">
      <div className="h-[400px] w-full bg-black rounded-md overflow-hidden relative">
        <ManimScene 
          onSceneReady={construct}
          className="w-full h-full"
          width={800}
          height={500}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Control 
          label="Weight 1 (w₁)" 
          value={w1} 
          onChange={setW1} 
          min={-5} 
          max={5} 
          step={0.1} 
        />
        <Control 
          label="Weight 2 (w₂)" 
          value={w2} 
          onChange={setW2} 
          min={-5} 
          max={5} 
          step={0.1} 
        />
        <Control 
          label="Bias (b)" 
          value={b} 
          onChange={setB} 
          min={-5} 
          max={5} 
          step={0.1} 
        />
      </div>

      <div className="space-y-2">
        <div className="text-sm font-medium text-slate-700 dark:text-slate-300">
          Pick a lesson example (star marker on plot):
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {scenarios.map((scenario, idx) => (
            <button
              key={scenario.label}
              type="button"
              onClick={() => setSelectedScenario(idx)}
              className={`text-left px-3 py-2 rounded border text-sm transition ${
                selectedScenario === idx
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 hover:border-blue-500"
              }`}
            >
              {scenario.label} ({scenario.x1},{scenario.x2}) {"->"} {scenario.target}
            </button>
          ))}
        </div>
      </div>
      
      <div className="text-center font-mono text-sm bg-slate-200 dark:bg-slate-800 p-2 rounded">
        {w1.toFixed(1)}x₁ + {w2.toFixed(1)}x₂ + {b.toFixed(1)} = 0
      </div>
      <div className="text-center text-sm bg-slate-100 dark:bg-slate-800/70 p-3 rounded border border-slate-300 dark:border-slate-700">
        Active example: <span className="font-semibold">{active.label}</span> with $(x_1, x_2)=({active.x1},{active.x2})$.
        {" "}Score: <span className="font-mono">{z.toFixed(2)}</span>, perceptron output: <span className="font-mono">{output}</span>.
      </div>
    </div>
  );
}

function Control({ label, value, onChange, min, max, step }: { 
  label: string, 
  value: number, 
  onChange: (v: number) => void,
  min: number,
  max: number,
  step: number
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex justify-between">
        <span>{label}</span>
        <span className="font-mono">{value.toFixed(1)}</span>
      </label>
      <input 
        type="range" 
        min={min} 
        max={max} 
        step={step} 
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700 accent-blue-600"
      />
    </div>
  );
}
