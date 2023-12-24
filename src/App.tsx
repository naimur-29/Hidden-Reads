import { ReactNode } from "react";
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
import AddBook from "./components/AddBook";
import Error from "./pages/Error/Error";

function buildPage(Page: ReactNode) {
  return <BuildPage>{Page}</BuildPage>;
}

const router = createBrowserRouter([
  {
    path: "/",
    element: buildPage(<Home />),
  },
  {
    path: "/:query",
    element: buildPage(<Home hasQuery />),
  },
  {
    path: "/most-popular",
    element: buildPage(<MostPopular />),
  },
  {
    path: "/genres",
    element: buildPage(<Genres />),
  },
  {
    path: "/genres/:genre",
    element: buildPage(<FilteredBooks />),
  },
  {
    path: "/recently-added",
    element: buildPage(<RecentlyAdded />),
  },
  {
    path: "/request-books",
    element: buildPage(<RequestBooks />),
  },
  {
    path: "/overview/:info",
    element: buildPage(<BookOverview />),
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
    path: "/control/add-book",
    element: buildPage(<AddBook />),
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
