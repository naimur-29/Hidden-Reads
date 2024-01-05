import { ReactNode, useEffect, useRef } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// components:
import BuildPage from "./Layouts/BuildPage";
import FilteredBooks from "./components/FilteredBooks";
import BookOverview from "./components/BookOverview";
import CheckAdmin from "./pages/AdminPages/CheckAdmin";

// HOOKS:
import useGetDoc from "./hooks/useGetDoc";

// Pages:
import Home from "./pages/Home/Home";
import MostPopular from "./pages/MostPopular/MostPopular";
import Genres from "./pages/Genres/Genres";
import RecentlyAdded from "./pages/RecentlyAdded/RecentlyAdded";
import AddBook from "./pages/AdminPages/AddBook";
import Error from "./pages/Error/Error";
import ManageBooks from "./pages/AdminPages/ManageBooks";
import ManageBookItem from "./pages/AdminPages/ManageBookEdit";
import AdminLogin from "./pages/AdminPages/AdminLogin";

function buildPage(Page: ReactNode) {
  return <BuildPage>{Page}</BuildPage>;
}

function checkAdmin(page: ReactNode) {
  return <CheckAdmin>{page}</CheckAdmin>;
}

function App() {
  // HOOKS:
  const firstLoadRef = useRef(false);
  const [getBookGenres, bookGenres, isBookGenresLoading] = useGetDoc();

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
      element: buildPage(
        <Genres
          genres={bookGenres.genres}
          isBookGenresLoading={isBookGenresLoading}
        />
      ),
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
      path: "/overview/:info",
      element: buildPage(<BookOverview />),
    },
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

  useEffect(() => {
    if (firstLoadRef.current === false) {
      console.log("----GETTING BOOKS GENRES----");
      getBookGenres("stats", "genres");
      firstLoadRef.current = true;
      console.log("----GOT BOOKS GENRES----");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <RouterProvider router={router} />;
}

export default App;
