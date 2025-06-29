import React, { useRef, useEffect, useState } from "react";
import { ForceGraph3D } from "react-force-graph";
import axios from "axios";

const ClickToFocus = () => {
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const graphRef = useRef(null);

  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const fetchGraphData = async () => {
    try {
      const response = await axios.get(
        "https://raw.githubusercontent.com/vasturiano/3d-force-graph/master/example/datasets/miserables.json"
      );
      setGraphData(response.data);
      // console.log(response.data);
    } catch (error) {
      console.error("Error fetching dataset:", error);
    }
  };

  useEffect(() => {
    fetchGraphData();

    // Function to update dimensions
    const handleResize = () => {
      const width = window.innerWidth * 0.9; // 90% width of the window
      const height = window.innerHeight * 0.5; // Adjust the height as needed
      setDimensions({ width, height });
    };

    // Initial resize
    handleResize();

    // Add resize event listener
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleNodeClick = (node) => {
    const distance = 40;
    const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z);

    const newPos =
      node.x || node.y || node.z
        ? {
            x: node.x * distRatio,
            y: node.y * distRatio,
            z: node.z * distRatio,
          }
        : { x: 0, y: 0, z: distance };

    graphRef.current.cameraPosition(
      newPos, // new position
      node, // lookAt ({ x, y, z })
      3000 // ms transition duration
    );
  };

  return (
    <>
      {graphData && (
        <ForceGraph3D
          ref={graphRef}
          graphData={graphData}
          nodeLabel="id"
          nodeAutoColorBy="group"
          onNodeClick={handleNodeClick}
          backgroundColor="#1a1a1a"
          linkColor={() => "#ffffff"}
          linkOpacity={0.2123}
          width={dimensions.width}
          height={dimensions.height}
        />
      )}
    </>
  );
};

export default ClickToFocus;
