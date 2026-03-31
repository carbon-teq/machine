"use client";

import { Mafs, Vector, Text, Theme, Line, Point } from "mafs";
import { useState } from "react";

// Simple 3D Vector type
type Vector3 = [number, number, number];

export default function LinearTransformation3DVis() {
  // Rotation angles for the view (Camera)
  const [viewAngleX, setViewAngleX] = useState(0.5);
  const [viewAngleY, setViewAngleY] = useState(0.5);

  // Transformation Matrix State (3x3)
  // We'll just support rotation around Y for simplicity in the demo
  const [rotationY, setRotationY] = useState(0);

  // Basis Vectors
  const iHat: Vector3 = [1, 0, 0];
  const jHat: Vector3 = [0, 1, 0];
  const kHat: Vector3 = [0, 0, 1];

  // Cube vertices (centered at origin for simplicity, or 0 to 1)
  const cubeVertices: Vector3[] = [
    [0, 0, 0], [1, 0, 0], [1, 1, 0], [0, 1, 0],
    [0, 0, 1], [1, 0, 1], [1, 1, 1], [0, 1, 1]
  ];

  // Edges connecting vertices
  const cubeEdges = [
    [0, 1], [1, 2], [2, 3], [3, 0], // Front face
    [4, 5], [5, 6], [6, 7], [7, 4], // Back face
    [0, 4], [1, 5], [2, 6], [3, 7]  // Connecting edges
  ];

  // 1. Apply Transformation Matrix (Rotation around Y)
  const transform = (v: Vector3): Vector3 => {
    const cos = Math.cos(rotationY);
    const sin = Math.sin(rotationY);
    // Rotate around Y axis
    // [ cos  0  sin ] [x]
    // [  0   1   0  ] [y]
    // [-sin  0  cos ] [z]
    return [
      v[0] * cos + v[2] * sin,
      v[1],
      -v[0] * sin + v[2] * cos
    ];
  };

  // 2. Project 3D to 2D (View Transform)
  const project = (v: Vector3): [number, number] => {
    // Simple rotation for view
    // Rotate around Y then X
    const x = v[0];
    const y = v[1];
    const z = v[2];

    // Rotate Y (View Azimuth)
    // We rotate the world around Y to simulate camera moving around Y
    const cosY = Math.cos(viewAngleY);
    const sinY = Math.sin(viewAngleY);
    const x1 = x * cosY - z * sinY;
    const z1 = x * sinY + z * cosY;

    // Rotate X (View Elevation)
    const cosX = Math.cos(viewAngleX);
    const sinX = Math.sin(viewAngleX);
    const y2 = y * cosX - z1 * sinX;
    // const z2 = y * sinX + z1 * cosX; // Depth

    // Orthographic projection: just drop Z
    // Scale slightly to fit view
    return [x1, y2];
  };

  // Transformed Basis
  const tIHat = transform(iHat);
  const tJHat = transform(jHat);
  const tKHat = transform(kHat);

  // Projected Basis (Transformed)
  const pOrigin = project([0, 0, 0]);
  const pIHat = project(tIHat);
  const pJHat = project(tJHat);
  const pKHat = project(tKHat);

  // Transformed & Projected Cube
  const tCube = cubeVertices.map(transform);
  const pCube = tCube.map(project);

  // Static Axes (World Frame)
  const pXAxis = project([2, 0, 0]);
  const pYAxis = project([0, 2, 0]);
  const pZAxis = project([0, 0, 2]);

  return (
    <div className="flex flex-col items-center gap-4 p-4 border rounded-lg bg-neutral-900 text-white my-8">
      {/* Controls */}
      <div className="flex flex-col gap-4 w-full max-w-xs">
        <div>
            <label className="text-sm font-medium text-blue-400 block mb-1">
            Transformation (Rotate Y): {(rotationY * 180 / Math.PI).toFixed(0)}°
            </label>
            <input
            type="range"
            min="0"
            max={Math.PI * 2}
            step="0.1"
            value={rotationY}
            onChange={(e) => setRotationY(parseFloat(e.target.value))}
            className="w-full accent-blue-500"
            />
        </div>
        
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-neutral-800">
            <div>
                <label className="text-xs text-neutral-400 block mb-1">Camera Azimuth</label>
                <input
                type="range"
                min={-Math.PI}
                max={Math.PI}
                step="0.1"
                value={viewAngleY}
                onChange={(e) => setViewAngleY(parseFloat(e.target.value))}
                className="w-full accent-neutral-500"
                />
            </div>
            <div>
                <label className="text-xs text-neutral-400 block mb-1">Camera Elevation</label>
                <input
                type="range"
                min={-Math.PI / 2}
                max={Math.PI / 2}
                step="0.1"
                value={viewAngleX}
                onChange={(e) => setViewAngleX(parseFloat(e.target.value))}
                className="w-full accent-neutral-500"
                />
            </div>
        </div>
      </div>

      <div className="w-full h-[400px]">
        <Mafs viewBox={{ x: [-2, 2], y: [-2, 2] }} pan={false} zoom={false}>
          
          {/* Draw Static World Axes (Ghosted) */}
          <Line.Segment point1={pOrigin} point2={pXAxis} color={Theme.foreground} opacity={0.2} />
          <Text x={pXAxis[0]} y={pXAxis[1]} color={Theme.foreground} size={16}>x</Text>
          
          <Line.Segment point1={pOrigin} point2={pYAxis} color={Theme.foreground} opacity={0.2} />
          <Text x={pYAxis[0]} y={pYAxis[1]} color={Theme.foreground} size={16}>y</Text>
          
          <Line.Segment point1={pOrigin} point2={pZAxis} color={Theme.foreground} opacity={0.2} />
          <Text x={pZAxis[0]} y={pZAxis[1]} color={Theme.foreground} size={16}>z</Text>


          {/* Draw Transformed Basis Vectors */}
          <Vector tail={pOrigin} tip={pIHat} color={Theme.blue} weight={3} />
          <Vector tail={pOrigin} tip={pJHat} color={Theme.red} weight={3} />
          <Vector tail={pOrigin} tip={pKHat} color={Theme.green} weight={3} />
          
          <Text x={pIHat[0]} y={pIHat[1]} attach="nw" color={Theme.blue} size={20}>î'</Text>
          <Text x={pJHat[0]} y={pJHat[1]} attach="nw" color={Theme.red} size={20}>ĵ'</Text>
          <Text x={pKHat[0]} y={pKHat[1]} attach="nw" color={Theme.green} size={20}>k'</Text>

          {/* Draw Cube Edges */}
          {cubeEdges.map((edge, i) => (
            <Line.Segment
              key={i}
              point1={pCube[edge[0]]}
              point2={pCube[edge[1]]}
              color={Theme.yellow}
              opacity={0.8}
              weight={2}
            />
          ))}
          
          {/* Origin Dot */}
          <Point x={pOrigin[0]} y={pOrigin[1]} color={Theme.foreground} />

        </Mafs>
      </div>

      <p className="text-sm italic text-neutral-400 text-center">
        The cube rotates in 3D space. We project it onto your 2D screen.<br/>
        Blue (x), Red (y), Green (z) are the transformed basis vectors.
      </p>
    </div>
  );
}
