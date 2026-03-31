"use client";

import { Application, extend } from "@pixi/react";
import { Container, Graphics, Rectangle, Text } from "pixi.js";
import { useState, useCallback } from "react";

// Register PIXI components
extend({ Container, Graphics, Text });

// Wrapper components to bypass TypeScript intrinsic element checks
const PixiContainer = (props: any) => {
  const C = 'container' as any;
  return <C {...props} />;
};

const PixiGraphics = (props: any) => {
  const G = "graphics" as any;
  return <G {...props} />;
};

const PixiText = (props: any) => {
  const T = "text" as any;
  return <T {...props} />;
};

const GRID_SIZE = 40;
const AXIS_COLOR = 0x9ca3af;
const GRID_COLOR = 0x1f2937;
const VECTOR_A_COLOR = 0x3b82f6; // blue-500
const VECTOR_B_COLOR = 0xef4444; // red-500
const PROJECTION_COLOR = 0x10b981; // emerald-500
const VECTOR_HEAD_RADIUS = 8;

interface DotProductVisProps {
  initialAX?: number;
  initialAY?: number;
  initialBX?: number;
  initialBY?: number;
  width?: number;
  height?: number;
}

export default function DotProductVis({
  initialAX = 3,
  initialAY = 2,
  initialBX = 4,
  initialBY = 0,
  width = 600,
  height = 400,
}: DotProductVisProps) {
  const [vectorA, setVectorA] = useState({ x: initialAX, y: initialAY });
  const [vectorB, setVectorB] = useState({ x: initialBX, y: initialBY });
  
  const [draggingA, setDraggingA] = useState(false);
  const [draggingB, setDraggingB] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  
  // Center of the canvas
  const centerX = width / 2;
  const centerY = height / 2;

  // Convert grid units to pixel coordinates
  const toPixels = (x: number, y: number) => ({
    x: centerX + x * GRID_SIZE,
    y: centerY - y * GRID_SIZE, // Flip Y axis for standard Cartesian coordinates
  });

  // Convert pixel coordinates to grid units
  const toGrid = (x: number, y: number) => ({
    x: (x - centerX) / GRID_SIZE,
    y: -(y - centerY) / GRID_SIZE,
  });

  const drawGrid = useCallback((g: Graphics) => {
    g.clear();

    // Force a dark backdrop regardless of renderer background behavior.
    g.rect(0, 0, width, height);
    g.fill({ color: 0x000000, alpha: 1 });
    
    // Vertical lines
    for (let x = 0; x <= width; x += GRID_SIZE) {
      g.moveTo(x, 0);
      g.lineTo(x, height);
      g.stroke({ width: 1, color: GRID_COLOR, alpha: 0.9 });
    }
    
    // Horizontal lines
    for (let y = 0; y <= height; y += GRID_SIZE) {
      g.moveTo(0, y);
      g.lineTo(width, y);
      g.stroke({ width: 1, color: GRID_COLOR, alpha: 0.9 });
    }

    // Draw axes
    g.moveTo(centerX, 0);
    g.lineTo(centerX, height);
    g.stroke({ width: 2, color: AXIS_COLOR, alpha: 1 });
    g.moveTo(0, centerY);
    g.lineTo(width, centerY);
    g.stroke({ width: 2, color: AXIS_COLOR, alpha: 1 });
  }, [width, height, centerX, centerY]);

  const drawVectors = useCallback((g: Graphics) => {
    g.clear();
    
    const start = toPixels(0, 0);
    const endA = toPixels(vectorA.x, vectorA.y);
    const endB = toPixels(vectorB.x, vectorB.y);

    // Helper to draw arrow
    const drawArrow = (from: {x: number, y: number}, to: {x: number, y: number}, color: number) => {
        g.moveTo(from.x, from.y);
        g.lineTo(to.x, to.y);
        g.stroke({ width: 3, color: color, alpha: 1 });

        const angle = Math.atan2(to.y - from.y, to.x - from.x);
        const headLength = 15;
        const headAngle = Math.PI / 6;

        g.moveTo(to.x, to.y);
        g.lineTo(
          to.x - headLength * Math.cos(angle - headAngle),
          to.y - headLength * Math.sin(angle - headAngle)
        );
        g.stroke({ width: 3, color: color, alpha: 1 });
        g.moveTo(to.x, to.y);
        g.lineTo(
          to.x - headLength * Math.cos(angle + headAngle),
          to.y - headLength * Math.sin(angle + headAngle)
        );
        g.stroke({ width: 3, color: color, alpha: 1 });
    };

    // Draw Vector B (Target)
    drawArrow(start, endB, VECTOR_B_COLOR);
    
    // Draw Vector A (Source)
    drawArrow(start, endA, VECTOR_A_COLOR);

    // Draw Projection of A onto B
    // Formula: proj_b a = (a . b / |b|^2) * b
    const dotProduct = vectorA.x * vectorB.x + vectorA.y * vectorB.y;
    const magBSq = vectorB.x ** 2 + vectorB.y ** 2;
    
    if (magBSq > 0.001) {
        const scalar = dotProduct / magBSq;
        const projX = scalar * vectorB.x;
        const projY = scalar * vectorB.y;
        const endProj = toPixels(projX, projY);

        // Draw projection line (dashed-ish effect manually or just lighter color)
        g.moveTo(start.x, start.y);
        g.lineTo(endProj.x, endProj.y);
        g.stroke({ width: 4, color: PROJECTION_COLOR, alpha: 0.8 });

        // Draw dotted line from A tip to Projection tip
        g.moveTo(endA.x, endA.y);
        g.lineTo(endProj.x, endProj.y);
        g.stroke({ width: 1, color: 0xffffff, alpha: 0.5 }); // Dashed line connecting tips
    }

    // Draw interactive handles
    g.circle(endA.x, endA.y, VECTOR_HEAD_RADIUS);
    g.fill({ color: VECTOR_A_COLOR, alpha: 0.5 });

    g.circle(endB.x, endB.y, VECTOR_HEAD_RADIUS);
    g.fill({ color: VECTOR_B_COLOR, alpha: 0.5 });

  }, [vectorA, vectorB, centerX, centerY]);

  const onDragStart = (event: any) => {
    const local = event.getLocalPosition?.(event.currentTarget);
    if (!local) return;
    
    const tipA = toPixels(vectorA.x, vectorA.y);
    const tipB = toPixels(vectorB.x, vectorB.y);
    
    const distA = (local.x - tipA.x) ** 2 + (local.y - tipA.y) ** 2;
    const distB = (local.x - tipB.x) ** 2 + (local.y - tipB.y) ** 2;
    const threshold = (VECTOR_HEAD_RADIUS + 8) ** 2;

    if (distA <= threshold) {
        setDraggingA(true);
        setDragOffset({ x: local.x - tipA.x, y: local.y - tipA.y });
    } else if (distB <= threshold) {
        setDraggingB(true);
        setDragOffset({ x: local.x - tipB.x, y: local.y - tipB.y });
    }
  };

  const onDragEnd = () => {
    setDraggingA(false);
    setDraggingB(false);
    setDragOffset({ x: 0, y: 0 });
  };
  
  const onDragMove = (event: any) => {
    if (draggingA || draggingB) {
      const local = event.getLocalPosition?.(event.currentTarget);
      if (!local) return;
      
      const adjustedX = local.x - dragOffset.x;
      const adjustedY = local.y - dragOffset.y;
      const gridPos = toGrid(adjustedX, adjustedY);
      
      // Snap to nearest 0.5
      const snappedX = Math.round(gridPos.x * 2) / 2;
      const snappedY = Math.round(gridPos.y * 2) / 2;
      
      if (draggingA) {
          setVectorA({ x: snappedX, y: snappedY });
      } else {
          setVectorB({ x: snappedX, y: snappedY });
      }
    }
  };

  // Calculations
  const dotProduct = (vectorA.x * vectorB.x + vectorA.y * vectorB.y).toFixed(2);
  const magA = Math.sqrt(vectorA.x ** 2 + vectorA.y ** 2);
  const magB = Math.sqrt(vectorB.x ** 2 + vectorB.y ** 2);
  const cosTheta = magA * magB > 0 ? ((vectorA.x * vectorB.x + vectorA.y * vectorB.y) / (magA * magB)) : 0;
  const angleRad = Math.acos(Math.min(Math.max(cosTheta, -1), 1));
  const angleDeg = (angleRad * 180 / Math.PI).toFixed(1);

  return (
    <div className="flex flex-col items-center gap-4 rounded-lg border bg-black p-4 shadow-sm">
      <div className="flex flex-col w-full max-w-[600px] px-4 gap-2">
        <div className="flex justify-between text-sm font-mono">
            <span style={{color: '#3b82f6'}}>Vector A: [{vectorA.x}, {vectorA.y}]</span>
            <span style={{color: '#ef4444'}}>Vector B: [{vectorB.x}, {vectorB.y}]</span>
        </div>
        <div className="flex justify-between text-sm font-mono border-t border-gray-800 pt-2">
             <span>Dot Product: <span className="font-bold text-emerald-400">{dotProduct}</span></span>
             <span>Angle: <span className="font-bold text-gray-200">{angleDeg}°</span></span>
        </div>
      </div>
      
      <Application 
        width={width} 
        height={height} 
        antialias={true}
        className="rounded border border-gray-800"
      >
        <PixiGraphics draw={drawGrid} />
        <PixiContainer
          eventMode="static"
          cursor="pointer"
          hitArea={new Rectangle(0, 0, width, height)}
          onPointerDown={onDragStart}
          onPointerUp={onDragEnd}
          onPointerUpOutside={onDragEnd}
          onPointerMove={onDragMove}
        >
           <PixiGraphics draw={drawVectors} />
        </PixiContainer>
      </Application>
      
      <p className="text-sm italic text-gray-300">
        Drag the vector heads. Green line is the projection of Blue onto Red.
      </p>
    </div>
  );
}
