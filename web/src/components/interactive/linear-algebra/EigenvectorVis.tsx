"use client";

import { Mafs, Coordinates, Vector, Text, useMovablePoint, Theme, Line } from "mafs";
import { useState, useEffect } from "react";
import { vec } from "mafs";

export default function EigenvectorVis() {
  // Matrix A = [[3, 1], [0, 2]]
  // Eigenvalues: 3, 2
  // Eigenvectors: [1, 0] (x-axis), [1, -1] (diagonal)
  
  const [matrix, setMatrix] = useState({ a: 3, b: 0, c: 1, d: 2 });
  
  // Movable input vector v
  const point = useMovablePoint([1, 1], {
    color: Theme.yellow,
    constrain: (p) => {
      // Limit range to avoid flying off screen
      const max = 4;
      const x = Math.max(-max, Math.min(max, p[0]));
      const y = Math.max(-max, Math.min(max, p[1]));
      return [x, y];
    },
  });

  const v = point.point;

  // Calculate Av
  const Av: [number, number] = [
    matrix.a * v[0] + matrix.c * v[1],
    matrix.b * v[0] + matrix.d * v[1],
  ];

  // Check alignment
  // Cross product in 2D is v1*w2 - v2*w1. If 0, they are parallel.
  const crossProduct = v[0] * Av[1] - v[1] * Av[0];
  const dotProduct = v[0] * Av[0] + v[1] * Av[1];
  
  // Normalize for scale-independent check
  const magV = Math.sqrt(v[0]*v[0] + v[1]*v[1]);
  const magAv = Math.sqrt(Av[0]*Av[0] + Av[1]*Av[1]);
  
  const isParallel = Math.abs(crossProduct) < 0.1 * magV * magAv; // Tolerance
  const isEigenvector = isParallel && magV > 0.1;

  // Calculate Eigenvalue if parallel
  // Av = lambda * v => lambda = |Av| / |v| (with sign check)
  // Sign check: dot product > 0 means same direction (+), < 0 means opposite (-)
  const lambda = isEigenvector ? (dotProduct > 0 ? magAv / magV : -magAv / magV) : null;

  return (
    <div className="flex flex-col items-center gap-4 p-4 border rounded-lg bg-neutral-900 text-white my-8">
      <div className="flex flex-col items-center gap-2">
        <div className="font-mono text-lg">
          Matrix A = [[3, 1], [0, 2]]
        </div>
        <div className="h-8">
          {isEigenvector ? (
            <span className="text-green-400 font-bold animate-pulse">
              Eigenvector Found! λ ≈ {lambda?.toFixed(2)}
            </span>
          ) : (
            <span className="text-neutral-500">
              Drag yellow vector to find invariant directions...
            </span>
          )}
        </div>
      </div>

      <div className="w-full h-[400px]">
        <Mafs viewBox={{ x: [-4, 4], y: [-4, 4] }}>
          <Coordinates.Cartesian />

          {/* Eigenvector Lines (Hints - usually hidden but let's show them faintly) */}
          {/* Line 1: y = 0 (x-axis) */}
          <Line.ThroughPoints point1={[0, 0]} point2={[1, 0]} color={Theme.green} opacity={0.2} style="dashed" />
          {/* Line 2: y = -x (for vector [1, -1]) */}
          <Line.ThroughPoints point1={[0, 0]} point2={[1, -1]} color={Theme.green} opacity={0.2} style="dashed" />

          {/* Input Vector v */}
          <Vector tip={v} color={Theme.yellow} weight={4} />
          <Text x={v[0]} y={v[1]} attach="nw" color={Theme.yellow} size={20}>v</Text>
          
          {/* Output Vector Av */}
          <Vector tip={Av} color={Theme.blue} weight={4} opacity={0.8} />
          <Text x={Av[0]} y={Av[1]} attach="se" color={Theme.blue} size={20}>Av</Text>

          {/* Interaction Point */}
          {point.element}

        </Mafs>
      </div>

      <div className="text-sm text-neutral-400 text-center max-w-md">
        <p>
          <span className="text-yellow-400">Yellow (v)</span> is your input.<br/>
          <span className="text-blue-400">Blue (Av)</span> is the result of the transformation.<br/>
          Find where they line up!
        </p>
      </div>
    </div>
  );
}
