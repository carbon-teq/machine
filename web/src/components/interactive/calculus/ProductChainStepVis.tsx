"use client";

import { Line, Mafs, Polygon, Text, Theme } from "mafs";

export default function ProductChainStepVis() {
  return (
    <div className="rounded-lg border bg-black p-4 text-white">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-md border border-gray-800 p-3">
          <p className="mb-3 font-mono text-sm text-blue-300">Product Rule: area growth pieces</p>
          <div className="h-[280px] w-full overflow-hidden rounded border border-gray-900">
            <Mafs viewBox={{ x: [0, 12], y: [-1, 9] }} pan={false} zoom={false}>

              <Polygon
                points={[
                  [1, 1],
                  [8, 1],
                  [8, 6],
                  [1, 6],
                ]}
                color={Theme.blue}
                fillOpacity={0.35}
                strokeOpacity={0.35}
              />
              <Text x={3.8} y={3.6} color={Theme.blue} size={20}>
                x·y
              </Text>

              <Polygon
                points={[
                  [8, 1],
                  [9.5, 1],
                  [9.5, 6],
                  [8, 6],
                ]}
                color={Theme.red}
                fillOpacity={0.45}
                strokeOpacity={0.45}
              />
              <Text x={8.75} y={3.6} color={Theme.red} size={20}>
                y·dx
              </Text>

              <Polygon
                points={[
                  [1, 6],
                  [8, 6],
                  [8, 7.3],
                  [1, 7.3],
                ]}
                color={Theme.green}
                fillOpacity={0.45}
                strokeOpacity={0.45}
              />
              <Text x={4.5} y={6.65} color={Theme.green} size={20}>
                x·dy
              </Text>

              <Polygon
                points={[
                  [8, 6],
                  [9.5, 6],
                  [9.5, 7.3],
                  [8, 7.3],
                ]}
                color={Theme.yellow}
                fillOpacity={0.55}
                strokeOpacity={0.55}
              />
              <Text x={8.75} y={6.65} color={Theme.yellow} size={20}>
                dx·dy
              </Text>

              <Line.Segment point1={[1, 0.6]} point2={[9.5, 0.6]} color={Theme.foreground} />
              <Line.Segment point1={[10.1, 1]} point2={[10.1, 7.3]} color={Theme.foreground} />
              <Text x={5.25} y={0.2} color={Theme.foreground} size={20}>
                x + dx
              </Text>
              <Text x={10.5} y={4.15} color={Theme.foreground} size={20}>
                y + dy
              </Text>
            </Mafs>
          </div>
          <p className="mt-2 text-xs text-gray-300">
            Step view: original area + right strip + top strip + tiny corner.
          </p>
        </div>

        <div className="rounded-md border border-gray-800 p-3">
          <p className="mb-3 font-mono text-sm text-purple-300">Chain Rule: sensitivity pipeline</p>
          <div className="space-y-3 text-sm">
            <div className="rounded border border-gray-700 p-3">
              <p className="font-mono text-gray-200">Step 1: x nudges h</p>
              <p className="text-gray-300">If Δx = 1, then Δh = (dh/dx) · 1</p>
            </div>
            <div className="rounded border border-gray-700 p-3">
              <p className="font-mono text-gray-200">Step 2: h nudges g</p>
              <p className="text-gray-300">If Δh = 2, then Δg = (dg/dh) · 2</p>
            </div>
            <div className="rounded border border-gray-700 p-3">
              <p className="font-mono text-gray-200">Step 3: multiply effects</p>
              <p className="text-gray-300">df/dx = (dg/dh) · (dh/dx)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
