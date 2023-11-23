import { createBrowserRouter, RouterProvider } from "react-router-dom";

// components:
import BuildPage from "./Layouts/BuildPage";

// Pages:
import Home from "./pages/Home/Home";
import MostPopular from "./pages/MostPopular/MostPopular";
import Categories from "./pages/Categories/Categories";
import RecentlyAdded from "./pages/RecentlyAdded/RecentlyAdded";
import RequestBooks from "./pages/RequestBooks/RequestBooks";
import Error from "./pages/Error/Error";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <BuildPage>
        <Home />
      </BuildPage>
    ),
  },
  {
    path: "/most-popular",
    element: (
      <BuildPage>
        <MostPopular />
      </BuildPage>
    ),
  },
  {
    path: "/categories",
    element: (
      <BuildPage>
        <Categories />
      </BuildPage>
    ),
  },
  {
    path: "/recently-added",
    element: (
      <BuildPage>
        <RecentlyAdded />
      </BuildPage>
    ),
  },
  {
    path: "/request-books",
    element: (
      <BuildPage>
        <RequestBooks />
      </BuildPage>
    ),
  },
  {
    path: "*",
    element: <Error />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
