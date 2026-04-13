import { NavLink, useLocation } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

function SearchIcon() {
    return (
        <svg viewBox="0 0 24 24" className="navIcon" aria-hidden="true" focusable="false">
            <circle cx="11" cy="11" r="6.5" />
            <path d="m16 16 4 4" />
        </svg>
    );
}

function BellIcon() {
    return (
        <svg viewBox="0 0 24 24" className="navIcon bellIcon" aria-hidden="true" focusable="false">
            <path d="M8 17.5h8" />
            <path d="M9 18a3 3 0 0 0 6 0" />
            <path d="M18 16V11a6 6 0 1 0-12 0v5l-1.2 1.6h14.4Z" />
        </svg>
    );
}

export default function Navbar() {
    const location = useLocation();
    const { isAuthenticated, user, logout } = useAuth0();

    const isAuthPage = location.pathname === "/login" || location.pathname === "/signup";
    const nickname = user?.email ? user.email.split("@")[0] : "";

    return (
        <header className="topbar">
            <div className="topLeft">
                <NavLink to="/" className="logoMark" aria-label="홈으로 이동">
                    <span></span>
                    <span></span>
                </NavLink>
                <div className="searchPill">
                    <span className="searchIcon"><SearchIcon /></span>
                    <input placeholder="" aria-label="밈 검색" />
                </div>
            </div>

            {!isAuthPage && (
                <div className="topRight">
                    <button type="button" className="notificationBtn" aria-label="알림">
                        <BellIcon />
                    </button>
                    {isAuthenticated ? (
                        <>
                            <NavLink
                                to="/mypage"
                                className={({ isActive }) => `profileLink${isActive ? " profileLinkActive" : ""}`}
                            >
                                {nickname}님
                            </NavLink>
                            <button
                                type="button"
                                className="forgotBtn"
                                onClick={() => logout({ logoutParams: { returnTo: `${window.location.origin}/login` } })}
                                style={{ marginLeft: "8px" }}
                            >
                                로그아웃
                            </button>
                        </>
                    ) : (
                        <NavLink to="/login" className="profileLink">로그인</NavLink>
                    )}
                </div>
            )}
        </header>
    );
}