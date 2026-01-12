import { Navigate, Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";
import Signin from "./pages/signin";
import Forgotpassword from "./pages/forgotpassword";
import Create from "./pages/create";
import Home from "./pages/home";
import Createeditshop from "./components/Createeditshop";
import Additem from "./components/Additem";
import Edititem from "./components/Edititem";
import Cartpage from "./pages/Cartpage";

import usegetcurrentuser from "./hooks/usegetcurrentuser";
import usegetcity from "./hooks/usegetcity";
import usegetmyshop from "./hooks/usegetmyshop";
import usegetshopbycity from "./hooks/Usegetshopbycity";
import usegetitembycity from "./hooks/usegetitembycity";
import Checkout from "./pages/Checkout";

export const serverurl = "http://localhost:5000";

function App() {
  const { userData } = useSelector((state) => state.user);

  usegetcurrentuser();
  usegetcity();
  usegetmyshop();
  usegetshopbycity();
  usegetitembycity();

  return (
    <Routes>
      <Route path="/signup" element={!userData ? <Create /> : <Navigate to="/" />} />
      <Route path="/signin" element={!userData ? <Signin /> : <Navigate to="/" />} />
      <Route path="/forgotpassword" element={!userData ? <Forgotpassword /> : <Navigate to="/" />} />
      <Route path="/" element={userData ? <Home /> : <Navigate to="/signin" />} />
      <Route path="/createeditshop" element={userData ? <Createeditshop /> : <Navigate to="/signin" />} />
      <Route path="/additem" element={userData ? <Additem /> : <Navigate to="/signin" />} />
      <Route path="/edititem/:itemId" element={userData ? <Edititem /> : <Navigate to="/signin" />} />
      <Route path="/getitem/:itemId" element={userData ? <Edititem /> : <Navigate to="/signin" />} />
      <Route path="/cart" element={userData ? <Cartpage /> : <Navigate to="/signin" />} />
      <Route path="/checkout" element={userData ? <Checkout /> : <Navigate to="/signin" />} />
    </Routes>
  );
}

export default App;
