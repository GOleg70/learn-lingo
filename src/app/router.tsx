import { createBrowserRouter } from "react-router-dom";
import { RootLayout } from "../layouts/RootLayout";
import { HomePage } from "../pages/HomePage";
import { TeachersPage } from "../pages/TeachersPage";
import { FavoritesPage } from "../pages/FavoritesPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "teachers", element: <TeachersPage /> },
      { path: "favorites", element: <FavoritesPage /> },
    ],
  },
]);
