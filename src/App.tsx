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
import AddBook from "./pages/AdminPages/AddBook";
import Error from "./pages/Error/Error";
import ManageBooks from "./pages/AdminPages/ManageBooks";
import ManageBookItem from "./pages/AdminPages/ManageBookEdit";
import AdminLogin from "./pages/AdminPages/AdminLogin";
import CheckAdmin from "./pages/AdminPages/CheckAdmin";

function buildPage(Page: ReactNode) {
  return <BuildPage>{Page}</BuildPage>;
}

function checkAdmin(page: ReactNode) {
  return <CheckAdmin>{page}</CheckAdmin>;
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
    path: "/control",
    element: buildPage(<AdminLogin />),
  },
  {
    path: "/control/add",
    element: checkAdmin(buildPage(<AddBook />)),
  },
  {
    path: "/control/manage",
    element: checkAdmin(buildPage(<ManageBooks />)),
  },
  {
    path: "/control/manage/:id",
    element: checkAdmin(buildPage(<ManageBookItem />)),
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
