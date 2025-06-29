import React, { useRef, useEffect, useState } from "react";
import { ForceGraph3D } from "react-force-graph";

export default function CameraAutoOrbit(props) {
  const graphRef = useRef(null);

  const distance = 300;

  useEffect(() => {
    // Set initial camera position
    graphRef.current?.cameraPosition({ z: distance });

    // Camera orbit effect
    let angle = 0;
    const interval = setInterval(() => {
      if (graphRef.current) {
        graphRef.current.cameraPosition({
          x: distance * Math.sin(angle),
          z: distance * Math.cos(angle),
        });
      }
      angle += Math.PI / 300;
    }, 10);

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <ForceGraph3D
        ref={graphRef}
        graphData={props.graphData}
        enableNodeDrag={false}
        enableNavigationControls={false}
        showNavInfo={false}
        linkColor={() => "#ffffff"}
        linkOpacity={0.2123}
        height={700}
        width={900}
      />
    </div>
  );
}
