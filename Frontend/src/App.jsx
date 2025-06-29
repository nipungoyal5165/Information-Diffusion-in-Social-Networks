import { createBrowserRouter, RouterProvider } from "react-router-dom";

//Components import
import HomePage from "./components/Home";
import Section from "./components/Section";
import CameraAutoOrbit from "./components/react-graphs/CameraAutoOrbit";

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/simulation/:id",
    element: <Section />,
  },
  // {
  //   path: "/animation",
  //   element: <CameraAutoOrbit graphData={graphData} />,
  // },
]);

function App() {
  return (
    <div>
      <RouterProvider router={appRouter} />
    </div>
  );
}

export default App;
