import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import MyPage from "./pages/MyPage";
import Signup from "./pages/Signup";
import UploadPage from "./pages/UploadPage";
import "./App.css";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/mypage" element={<MyPage />} />
      <Route path="/mypage/upload" element={<UploadPage />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  );
}
