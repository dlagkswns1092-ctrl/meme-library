import { Routes, Route, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Home from "./pages/Home";
import MemeDetail from "./pages/MemeDetail";
import MyPage from "./pages/MyPage";
import ProfileEditPage from "./pages/ProfileEditPage";
import SearchResults from "./pages/SearchResults";
import UploadPage from "./pages/UploadPage";
import UserProfile from "./pages/UserProfile";
import ProtectedRoute from "./components/ProtectedRoute";
import "./App.css";

const API = import.meta.env.VITE_API_BASE_URL;

export default function App() {
    const { isAuthenticated, user, getAccessTokenSilently } = useAuth0();

    useEffect(() => {
        if (!isAuthenticated || !user) return;

        const syncUser = async () => {
            try {
                const token = await getAccessTokenSilently();
                const nickname = user.email ? user.email.split("@")[0] : "user";
                await fetch(`${API}/api/users/sync`, {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email: user.email, nickname }),
                });
            } catch (error) {
                console.error("유저 sync 실패:", error);
            }
        };

        syncUser();
    }, [isAuthenticated, user, getAccessTokenSilently]);
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/meme/:memeId" element={<MemeDetail />} />
            <Route
                path="/mypage"
                element={
                    <ProtectedRoute>
                        <MyPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/mypage/edit"
                element={
                    <ProtectedRoute>
                        <ProfileEditPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/mypage/upload"
                element={
                    <ProtectedRoute>
                        <UploadPage />
                    </ProtectedRoute>
                }
            />
            <Route path="/users/:userId" element={<UserProfile />} />
        </Routes>
    );
}