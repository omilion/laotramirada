import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Layout } from "./components/Layout";
import { ConferenceDetail } from "./pages/ConferenceDetail";
import { Conferences } from "./pages/Conferences";
import { Home } from "./pages/Home";
import { NewsDetail } from "./pages/NewsDetail";
import { Contact, Gallery, News, NuestraMirada, Streaming } from "./pages/StaticPages";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "conferencias", element: <Conferences /> },
      { path: "conferencias/:slug", element: <ConferenceDetail /> },
      { path: "nuestra-mirada", element: <NuestraMirada /> },
      { path: "galeria", element: <Gallery /> },
      { path: "noticias", element: <News /> },
      { path: "noticias/:slug", element: <NewsDetail /> },
      { path: "contacto", element: <Contact /> },
      { path: "streaming", element: <Streaming /> },
      { path: "*", element: <Home /> },
    ],
  },
]);

export function App() {
  return <RouterProvider router={router} />;
}
