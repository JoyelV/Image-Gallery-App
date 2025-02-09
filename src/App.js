import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import ImageGallery from "./pages/Gallery";
import ForgotPassword from "./pages/ForgotPassword";

function App() {
  return (
    <Routes>
      <Route path="/" element={ <PublicRoute><Login /></PublicRoute>}/>
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>}/>
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/gallery" element={<ProtectedRoute><ImageGallery /></ProtectedRoute>}/></Routes>
  );
}

export default App;