"use client";

import { Application, extend } from "@pixi/react";
import { Container, Graphics, Rectangle, Text } from "pixi.js";
import { useState, useCallback } from "react";

// Register PIXI components
extend({ Container, Graphics, Text });

// Wrapper components
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

interface CircleAreaVisProps {
  width?: number;
  height?: number;
}

export default function CircleAreaVis({
  width = 700,
  height = 400,
}: CircleAreaVisProps) {
  const [numRings, setNumRings] = useState(8);
  const [hoveredRing, setHoveredRing] = useState<number | null>(null);
  
  const maxRadius = 80;
  const circleX = 120;
  const circleY = height / 2;
  const triangleX = 450;
  const triangleTopY = circleY - maxRadius;

  const drawScene = useCallback((g: Graphics) => {
    g.clear();
    
    // Background
    g.rect(0, 0, width, height);
    g.fill({ color: 0x000000, alpha: 1 });

    const thickness = maxRadius / numRings;

    for (let i = 0; i < numRings; i++) {
        // Calculate dimensions
        const outerR = maxRadius * ((i + 1) / numRings);
        const innerR = maxRadius * (i / numRings);
        const midR = (outerR + innerR) / 2;
        
        // Color gradient (Blue to Red)
        const t = i / Math.max(1, numRings - 1);
        const r = Math.floor(59 + t * (239 - 59)); // 3b -> ef
        const gr = Math.floor(130 + t * (68 - 130)); // 82 -> 44
        const b = Math.floor(246 + t * (68 - 246)); // f6 -> 44
        const color = (r << 16) + (gr << 8) + b;
        
        const isHovered = hoveredRing === i;
        const alpha = isHovered ? 1.0 : 0.8;
        const strokeColor = isHovered ? 0xffffff : color;
        const strokeWidth = isHovered ? 2 : 0;

        // --- Draw Circle Ring (Left) ---
        // We use stroke for the ring to make it an annulus
        // PixiJS stroke alignment is 0.5 (center) by default. 
        // We want the stroke to represent the thickness.
        // Radius should be the mid-point of the ring.
        g.circle(circleX, circleY, midR);
        g.stroke({ width: thickness - 0.5, color: color, alpha }); 
        
        if (isHovered) {
             g.stroke({ width: thickness, color: 0xffffff, alpha: 0.5 });
        }

        // --- Draw Unrolled Strip (Right) ---
        const stripWidth = 2 * Math.PI * midR;
        const stripY = triangleTopY + i * thickness;
        
        g.rect(triangleX - stripWidth / 2, stripY, stripWidth, thickness - 0.5);
        g.fill({ color, alpha });
        
        if (isHovered) {
            g.stroke({ width: 2, color: 0xffffff, alpha: 0.5 });
        }
    }

    // Draw Labels
    // Radius line on circle
    g.moveTo(circleX, circleY);
    g.lineTo(circleX + maxRadius + 10, circleY);
    g.stroke({ width: 2, color: 0x9ca3af, alpha: 1 });
    g.circle(circleX, circleY, 3); // Center dot
    g.fill({ color: 0x9ca3af });

    // Height line on triangle
    g.moveTo(triangleX + 10, triangleTopY);
    g.lineTo(triangleX + 10, triangleTopY + maxRadius);
    g.stroke({ width: 2, color: 0x9ca3af, alpha: 1 });

    // Base line on triangle
    const baseWidth = 2 * Math.PI * maxRadius;
    g.moveTo(triangleX - baseWidth/2, triangleTopY + maxRadius + 10);
    g.lineTo(triangleX + baseWidth/2, triangleTopY + maxRadius + 10);
    g.stroke({ width: 2, color: 0x9ca3af, alpha: 1 });

  }, [numRings, hoveredRing, width, height]);

  const onPointerMove = (event: any) => {
    const local = event.getLocalPosition?.(event.currentTarget);
    if (!local) return;

    const dx = local.x - circleX;
    const dy = local.y - circleY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    // Check circle hover
    if (dist <= maxRadius) {
        const ringIndex = Math.floor((dist / maxRadius) * numRings);
        setHoveredRing(Math.min(ringIndex, numRings - 1));
        return;
    }

    // Check triangle hover
    const thickness = maxRadius / numRings;
    if (local.x >= triangleX - maxRadius * Math.PI - 20 && // Approximate bounds
        local.x <= triangleX + maxRadius * Math.PI + 20 &&
        local.y >= triangleTopY && 
        local.y <= triangleTopY + maxRadius) {
            
        const ringIndex = Math.floor((local.y - triangleTopY) / thickness);
        if (ringIndex >= 0 && ringIndex < numRings) {
             // Precise width check for the specific ring
             const midR = maxRadius * ((ringIndex + 0.5) / numRings);
             const w = 2 * Math.PI * midR;
             if (Math.abs(local.x - triangleX) <= w / 2) {
                 setHoveredRing(ringIndex);
                 return;
             }
        }
    }

    setHoveredRing(null);
  };

  return (
    <div className="flex flex-col items-center gap-4 rounded-lg border bg-black p-4 shadow-sm">
      <div className="flex flex-col w-full max-w-[600px] px-4 gap-4">
        <div className="flex justify-between text-sm font-mono text-gray-300">
            <span>Circle Area = πR²</span>
            <span>Triangle Area = ½(2πR)(R) = πR²</span>
        </div>
        
        <div className="flex gap-4 items-center justify-center border-t border-gray-800 pt-4">
            <label className="text-xs text-blue-400 font-mono">Number of Rings: {numRings}</label>
            <input 
                type="range" 
                min="1" 
                max="50" 
                step="1" 
                value={numRings} 
                onChange={(e) => setNumRings(parseInt(e.target.value))}
                className="w-48 accent-blue-500"
            />
        </div>
      </div>
      
      <Application 
        width={width} 
        height={height} 
        antialias={true}
        className="rounded border border-gray-800"
      >
        <PixiContainer
          eventMode="static"
          onPointerMove={onPointerMove}
        >
           <PixiGraphics draw={drawScene} />
           
           {/* Labels */}
           <PixiText 
             text="R" 
             x={circleX + maxRadius/2} 
             y={circleY - 15} 
             anchor={0.5}
             style={{ fill: 0x9ca3af, fontSize: 20, stroke: 0x000000, strokeThickness: 3 }} 
           />
           <PixiText 
             text="R" 
             x={triangleX + 20} 
             y={triangleTopY + maxRadius/2} 
             anchor={0}
             style={{ fill: 0x9ca3af, fontSize: 20, stroke: 0x000000, strokeThickness: 3 }} 
           />
           <PixiText 
             text="2πR" 
             x={triangleX} 
             y={triangleTopY + maxRadius + 25} 
             anchor={0.5}
             style={{ fill: 0x9ca3af, fontSize: 20, stroke: 0x000000, strokeThickness: 3 }} 
           />
        </PixiContainer>
      </Application>
      
      <p className="text-sm italic text-gray-300">
        Increase the number of rings to see the approximation improve.
      </p>
    </div>
  );
}
