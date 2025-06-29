import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ForceGraph3D } from "react-force-graph";
import axios from "axios";

import { Button } from "./ui/button";
import Slider from "./ui/slider";

import Navbar from "./Navbar";
import Footer from "./Footer";
import CameraAutoOrbit from "./react-graphs/CameraAutoOrbit";

const Section = () => {
  const params = useParams();
  const id = params.id; //the simulaiton to be performed Initially (The card that user selected)

  const graphRef = useRef();
  const animationRef = useRef(null);
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [isRunning, setIsRunning] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [totalSteps, setTotalSteps] = useState(0);
  const [simulationId, setSimulationId] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(500);
  const [informedPercentage, setInformedPercentage] = useState(0);
  const [uninformedPercentage, setUninformedPercentage] = useState(0);
  const [responseCentrality, setResponseCentrality] = useState(null);
  const [selectedCentrality, setSelectedCentrality] = useState("");

  ///////////////////////////////////////////////////
  // Utility Functions / Components
  ///////////////////////////////////////////////////

  // Centrality table (top 15)
  const CentralityTable = ({ data }) => {
    return (
      <div className="p-4">
        <h2 className="text-2xl font-semibold mb-6 text-white text-center">
          Node Centrality Table
        </h2>
        <div className="overflow-x-auto">
          <div className="max-h-[300px] overflow-y-auto border-2 border-white">
            <table className="w-full table-auto border border-gray-300 rounded-lg shadow-md">
              <thead className="bg-gray-200 sticky top-0 z-10">
                <tr>
                  <th className="border-b text-left px-6 py-3 text-sm font-medium text-gray-800">
                    Node ID
                  </th>
                  <th className="border-b text-left px-6 py-3 text-sm font-medium text-gray-800">
                    Centrality Value
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.data.map((item, index) => (
                  <tr
                    key={item.node_id}
                    className="hover:bg-slate-700 transition-colors"
                  >
                    <td
                      className={`border-b px-6 py-4 text-sm text-white ${
                        index === data.data.length - 1 ? "border-b-2" : ""
                      }`}
                    >
                      {item.node_id}
                    </td>
                    <td
                      className={`border-b px-6 py-4 text-sm text-white ${
                        index === data.data.length - 1 ? "border-b-2" : ""
                      }`}
                    >
                      {item.centrality_value.toFixed(8)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // Node click
  const handleNodeClick = (node) => {
    setSelectedNode(node);
  };

  ///////////////////////////////////////////////////
  // Api Calls
  ///////////////////////////////////////////////////
  const fetchDataset = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:5000/get_dataset/${id}`
      );
      const updatedData = {
        nodes: response.data.nodes.map((node) => ({
          ...node,
          color: node.color || "blue",
        })),
        links: response.data.links,
      };
      setGraphData(updatedData);
      calculateStatistics(updatedData.nodes);
    } catch (error) {
      console.error("Error fetching dataset:", error);
    }
  };
  // Calculate Informed/Uninformed Percentages
  const calculateStatistics = (nodes) => {
    const informedNodes = nodes.filter((node) => node.color === "red").length;
    const totalNodes = nodes.length;
    const informedPercentage = (informedNodes / totalNodes) * 100;
    const uninformedPercentage = 100 - informedPercentage;

    setInformedPercentage(informedPercentage);
    setUninformedPercentage(uninformedPercentage);
  };

  useEffect(() => {
    fetchDataset();
  }, []);

  // Start simulation
  const startSimulation = async () => {
    try {
      setIsRunning(true);
      const params = {
        population: 50,
        information_spread_chance: 0.3,
        recovery_chance: 0.0,
        initial_information_spread_share: 0.1,
      };
      const response = await axios.post(`http://127.0.0.1:5000/${id}`, params);
      if (response.data.error) {
        throw new Error(response.data.error);
      }

      const { simulation_id, total_steps } = response.data;
      setSimulationId(simulation_id);
      setTotalSteps(total_steps);
      setCurrentStep(0);
      setIsPlaying(false);

      await updateGraphAtStep(0);
    } catch (error) {
      console.error("Error starting the simulation:", error);
      setIsRunning(false);
    }
  };

  // Stop simulation
  const stopSimulation = async () => {
    setIsPlaying(false);
    if (animationRef.current) {
      clearInterval(animationRef.current);
    }
    if (simulationId) {
      await axios.delete(`http://127.0.0.1:5000/simulation/${simulationId}`);
      setSimulationId(null);
      setCurrentStep(0);
      setTotalSteps(0);
      fetchDataset();
    }
    setIsRunning(false);
  };

  // Update graph at each simulation step
  const updateGraphAtStep = async (step) => {
    try {
      if (step === 0) return;
      const response = await axios.get(
        `http://127.0.0.1:5000/simulation/${simulationId}/step/${step}`
      );
      const stepData = response.data;

      setGraphData((prev) => {
        const updatedNodes = prev.nodes.map((node) => {
          const updatedNode = stepData.nodes.find((n) => n.id === node.id);
          return {
            ...node,
            color: updatedNode ? updatedNode.color : node.color,
          };
        });
        calculateStatistics(updatedNodes);
        return { ...prev, nodes: updatedNodes };
      });
    } catch (error) {
      console.error("Error fetching step data:", error);
    }
  };

  // Play simulation
  const playSimulation = () => {
    const animate = () => {
      setCurrentStep((prev) => {
        const nextStep = prev >= totalSteps - 1 ? 0 : prev + 1;
        updateGraphAtStep(nextStep);
        return nextStep;
      });
    };

    setIsPlaying(true);
    const intervalId = setInterval(animate, animationSpeed);
    animationRef.current = intervalId;
  };

  // Pause simulation
  const pauseSimulation = () => {
    setIsPlaying(false);
    if (animationRef.current) {
      clearInterval(animationRef.current);
      animationRef.current = null;
    }
  };

  ///////////////////////////////////////////////////
  // Centrality Functions - Most Influential
  ///////////////////////////////////////////////////

  const findCentrality = async (centralityType) => {
    try {
      pauseSimulation();
      const response = await axios.get(
        `http://127.0.0.1:5000/${centralityType}`
      );
      setResponseCentrality(response);

      // Sort the nodes based on centrality value in descending order
      const sortedNodes = response.data.sort(
        (a, b) => b.centrality_value - a.centrality_value
      );

      // Calculate the threshold for the top 15% (round to the nearest integer)
      const top15Count = Math.floor(sortedNodes.length * 0.15);

      // Create a set of top 15% node IDs
      const top15Nodes = new Set(
        sortedNodes.slice(0, top15Count).map((node) => node.node_id)
      );

      const updatedNodes = graphData.nodes.map((node) => {
        if (top15Nodes.has(Number(node.id))) {
          return { ...node, color: "cyan" }; // Set color to yellow for nodes in top15Nodes
        } else {
          return { ...node, color: "blue" }; // Set color to blue for other nodes
        }
      });

      // Set the updated graph data with the updated nodes
      setGraphData((prev) => ({
        ...prev, // Preserve previous links and any other state
        nodes: updatedNodes, // Update only the nodes with the new color
      }));
    } catch (error) {
      console.error("Error fetching centrality data:", error);
    }
  };

  const handleCentralityChange = (event) => {
    const selectedCentrality = event.target.value;
    setSelectedCentrality(selectedCentrality);
    if (selectedCentrality) {
      findCentrality(selectedCentrality);
    }
  };

  return (
    <div className="bg-gray-800 h-screen">
      <Navbar />

      <div className="bg-gray-800  w-screen flex flex-col justify-between">
        {/* Button's div */}
        <div className="flex gap-4 ml-4 mr-4 mt-4 mb-4 items-center justify-center">
          <Button
            onClick={startSimulation}
            disabled={isRunning}
            className={`${
              isRunning
                ? "bg-blue-600 text-white cursor-not-allowed opacity-60"
                : "bg-green-600 text-white hover:bg-green-700"
            } px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50`}
          >
            {isRunning ? "Simulation Running..." : "Start Simulation"}
          </Button>

          <Button
            onClick={stopSimulation}
            disabled={!isRunning}
            className={`${
              !isRunning
                ? "bg-gray-400 text-white cursor-not-allowed opacity-60"
                : "bg-red-600 text-white hover:bg-red-700"
            } px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50`}
          >
            Stop Simulation
          </Button>

          {/* Centrality Dropdown */}
          <div className="flex gap-4 ml-4 mr-4 mt-4 mb-4 items-center justify-center">
            <select
              onChange={handleCentralityChange}
              value={selectedCentrality}
              disabled={!isRunning}
              className={`${
                !isRunning
                  ? "bg-gray-400 text-white cursor-not-allowed opacity-60"
                  : "px-8 py-3 rounded-lg font-semibold text-lg text-white bg-gradient-to-r from-indigo-500 via-indigo-500 to-blue-500 hover:from-pink-600 hover:via-indigo-600 hover:to-blue-600"
              } px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50`}
            >
              <option value="null">Select Centrality</option>
              <option value="degree_centrality">Degree Centrality</option>
              <option value="eigenvector_centrality">
                Eigenvector Centrality
              </option>
              <option value="closeness_centrality">Closeness Centrality</option>
              <option value="betweenness_centrality">
                Betweenness Centrality
              </option>
              <option value="harmonic_centrality">Harmonic Centrality</option>
              <option value="load_centrality">Load Centrality</option>
              <option value="percolation_centrality">
                Percolation Centrality
              </option>
            </select>
          </div>
        </div>

        {/* Slider */}
        {simulationId && (
          <div className="flex flex-col gap-4 p-4 bg-gray-700 rounded-lg mx-auto w-2/3">
            <div className="flex items-center gap-4">
              <Button
                onClick={isPlaying ? pauseSimulation : playSimulation}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isPlaying ? "Pause" : "Play"}
              </Button>
              <Slider
                value={[currentStep]}
                max={totalSteps - 1}
                step={1}
                onValueChange={([value]) => {
                  setCurrentStep(value);
                  updateGraphAtStep(value);
                }}
                className="flex-1"
              />
              <span className="text-white">
                Step: {currentStep} / {totalSteps - 1}
              </span>
            </div>
          </div>
        )}

        {/* Display Graph and Node Details */}
        <div className="flex flex-row justify-center items-start mt-10 space-x-5">
          {graphData && graphData.nodes ? (
            <ForceGraph3D
              ref={graphRef}
              graphData={graphData}
              nodeId="id"
              linkSource="source"
              linkTarget="target"
              nodeColor={(node) => node.color || "blue"}
              cooldownTicks={0}
              enableNodeDrag={false}
              enableZoomPanInteraction={true}
              onNodeClick={handleNodeClick}
              linkDistance={100}
              d3Force={(d3Force) => {
                d3Force.force("charge").strength(-100);
                d3Force.force("link").distance(250);
              }}
              nodeRelSize={3}
              linkWidth={0.3}
              backgroundColor="#1a1a1a"
              linkColor={() => "#ffffff"}
              // linkColor={() => "#808080"}
              linkOpacity={0.2123}
              height={400}
              width={600}
            />
          ) : (
            <div style={{ color: "white" }}>
              Loading or invalid graph data...
            </div>
          )}

          <div className="w-1/4">
            {/* Informed vs Uninformed Stats */}
            <div className=" bg-white p-6 rounded-lg shadow-md">
              <h3 className="font-semibold text-xl text-gray-800 text-center">
                Informed vs Uninformed Percentage
              </h3>

              <div className="mt-4 space-y-2">
                <p className="text-sm text-gray-900">
                  <strong className="font-medium">Informed:</strong>{" "}
                  {informedPercentage.toFixed(2)}%
                </p>
                <p className="text-sm text-gray-900">
                  <strong className="font-medium">Uninformed:</strong>{" "}
                  {uninformedPercentage.toFixed(2)}%
                </p>
              </div>

              <div className="mt-4 space-y-1">
                <div className="text-xs text-gray-600">Informed</div>
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: `${informedPercentage}%` }}
                ></div>

                <div className="text-xs text-gray-600">Uninformed</div>
                <div
                  className="bg-gray-400 h-2 rounded-full"
                  style={{ width: `${uninformedPercentage}%` }}
                ></div>
              </div>
            </div>

            {/* Node Details */}
            {selectedNode && (
              <div className="bg-white text-black p-4 rounded-lg mt-11">
                <h3 className="font-bold text-lg text-center">Node Details</h3>
                <p>
                  <strong>ID:</strong> {selectedNode.id}
                </p>
                <p>
                  <strong>State:</strong>{" "}
                  {selectedNode.color === "red" ? "Informed" : "Uninformed"}
                </p>
              </div>
            )}
          </div>

          <div className="w-1/4">
            {simulationId && responseCentrality != null && (
              <CentralityTable data={responseCentrality} />
            )}
          </div>
        </div>
      </div>

      {/* <div className="flex justify-center my-10 w-[90%] mx-[5%]">
        <CameraAutoOrbit graphData={graphData} />
      </div> */}

      <Footer />
    </div>
  );
};

export default Section;
