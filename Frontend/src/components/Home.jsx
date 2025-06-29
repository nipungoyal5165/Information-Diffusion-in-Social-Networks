import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import Footer from "./Footer";
import Navbar from "./Navbar";
import ClickToFocus from "./react-graphs/ClickToFocus";

const HomePage = () => {
  const navigate = useNavigate();
  const handleCardSelect = (id) => {
    navigate(`/simulation/${id}`);
  };

  return (
    <div className="bg-gray-800">
      <Navbar />
      <div className="bg-gray-800 min-h-screen w-screen flex flex-col justify-between p-4">
        {/* Welcome Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl text-white font-bold mb-4">
            Welcome to the Simulation Hub
          </h1>
          <p className="text-lg text-gray-300">
            Uncover the Power of Influence: Visualize How Information Spreads
            Across Networks in Real-Time!
          </p>
          <div className="flex justify-center my-10 w-[90%] mx-[5%]">
            <ClickToFocus />
          </div>

          <p className="text-lg text-gray-300">
            Select a simulation below to get started!
          </p>
        </div>

        {/* Main content wrapper (Cards for simulation options) */}
        <div className="flex flex-wrap justify-center gap-8 mb-16">
          {/* Card 1 */}
          <div className="bg-gray-700 p-8 rounded-xl shadow-xl w-[80%] max-w-[500px] text-center transform transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-2xl">
            <h3 className="text-white text-2xl font-bold mb-4">
              InVS13 Simulation
            </h3>
            <p className="text-white mb-6">
              This dataset represents the social structure of a workplace
              environment, of year 2013
            </p>
            <p className="text-white mb-6">
              Nodes: 95, Edges: 394.2K, Clustering Coefficient: 2.00591,
              Triangles: 4.3B
            </p>
            <Button
              onClick={() => handleCardSelect(1)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg"
            >
              Start Simulation
            </Button>
          </div>

          {/* Card 2 */}
          <div className="bg-gray-700 p-8 rounded-xl shadow-xl w-[80%] max-w-[500px] text-center transform transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-2xl">
            <h3 className="text-white text-2xl font-bold mb-4">
              LyonSchool Simulation
            </h3>
            <p className="text-white mb-6">
              This dataset represents the social structure of LyonSchool,
              focusing on communities
            </p>
            <p className="text-white mb-6">
              Nodes: 71, Edges: 277.8K, Clustering Coefficient: 2.0490,
              Triangles: 4.3B
            </p>
            <Button
              onClick={() => handleCardSelect(3)}
              className="bg-green-600 text-white px-6 py-3 rounded-lg"
            >
              Start Simulation
            </Button>
          </div>

          {/* Card 3 */}
          <div className="bg-gray-700 p-8 rounded-xl shadow-xl w-[80%] max-w-[500px] text-center transform transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-2xl">
            <h3 className="text-white text-2xl font-bold mb-4">
              InVS15 Simulation
            </h3>
            <p className="text-white mb-6">
              This dataset represents the social structure of a workplace
              environment, of year 2015
            </p>
            <p className="text-white mb-6">
              Nodes: 219, Edges: 1.3M, Clustering Coefficient: 1.5979,
              Triangles: 18.3B
            </p>
            <Button
              onClick={() => handleCardSelect(2)}
              className="bg-red-600 text-white px-6 py-3 rounded-lg"
            >
              Start Simulation
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default HomePage;

{
  /* <div className="flex justify-center my-10 w-[90%] mx-[5%]">
        <CameraAutoOrbit graphData={graphData} />
      </div> */
}
