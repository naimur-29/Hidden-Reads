import { createBrowserRouter, RouterProvider } from "react-router-dom";

// components:
import BuildPage from "./Layouts/BuildPage";
import FilteredBooks from "./components/FilteredBooks";
import BookOverview from "./components/BookOverview";
// import AuthorOverview from "./components/AuthorOverview";

// Pages:
import Home from "./pages/Home/Home";
import MostPopular from "./pages/MostPopular/MostPopular";
import Genres from "./pages/Genres/Genres";
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
    path: "/:query",
    element: (
      <BuildPage>
        <Home hasQuery={true} />
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
    path: "/genres",
    element: (
      <BuildPage>
        <Genres />
      </BuildPage>
    ),
  },
  {
    path: "/genres/:genre",
    element: (
      <BuildPage>
        <FilteredBooks />
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
    path: "/overview/:info",
    element: (
      <BuildPage>
        <BookOverview />
      </BuildPage>
    ),
  },
  // {
  //   path: "/authors/:info",
  //   element: (
  //     <BuildPage>
  //       <AuthorOverview />
  //     </BuildPage>
  //   ),
  // },
  {
    path: "*",
    element: <Error />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
