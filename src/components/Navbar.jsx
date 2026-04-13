import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" className="navIcon" aria-hidden="true" focusable="false">
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4 4" />
    </svg>
  );
}

export default function Navbar() {
  const location = useLocation();
  const { isLoggedIn, displayName } = useAuth();

  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/signup";

  return (
    <header className="topbar">
      <div className="topLeft">
        <NavLink to="/" className="logoMark" aria-label="홈으로 이동">
          <span></span>
          <span></span>
        </NavLink>

        <div className="searchPill">
          <span className="searchIcon">
            <SearchIcon />
          </span>
          <input placeholder="" aria-label="밈 검색" />
        </div>
      </div>

      {!isAuthPage && (
        <div className="topRight">
          <NavLink
            to={isLoggedIn ? "/mypage" : "/login"}
            className={({ isActive }) =>
              `profileLink${isActive ? " profileLinkActive" : ""}`
            }
          >
            {isLoggedIn ? `${displayName}님` : "로그인"}
          </NavLink>
        </div>
      )}
    </header>
  );
}
