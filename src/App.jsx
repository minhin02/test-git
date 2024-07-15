import Category from "./component/category";
import Dashboard from "./component/dashboard";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <div>Hello world!</div>,
    },
    {
      path: "/dashboard",
      element: <Dashboard />,
      children: [
        {
          path: "/dashboard/category",
          element: <Category />,
        },
        {
          path: "/dashboard/product",
          element: <Category />,
        },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
