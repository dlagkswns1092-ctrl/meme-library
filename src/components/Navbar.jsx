import { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  const { isLoggedIn, displayName } = useAuth();
  const [titleQuery, setTitleQuery] = useState("");

  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/signup";

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);

    if (location.pathname === "/search") {
      setTitleQuery(searchParams.get("q") ?? "");
      return;
    }

    setTitleQuery("");
  }, [location.pathname, location.search]);

  const handleSearchSubmit = (event) => {
    event.preventDefault();

    const nextQuery = titleQuery.trim();

    if (!nextQuery) {
      navigate("/search");
      return;
    }

    navigate(`/search?q=${encodeURIComponent(nextQuery)}`);
  };

  return (
    <header className="topbar">
      <div className="topLeft">
        <NavLink to="/" className="logoMark" aria-label="홈으로 이동">
          <span></span>
          <span></span>
        </NavLink>

        <form className="searchPill" onSubmit={handleSearchSubmit}>
          <button type="submit" className="searchIcon searchSubmitBtn" aria-label="제목 검색">
            <SearchIcon />
          </button>
          <input
            placeholder="제목 검색"
            aria-label="밈 제목 검색"
            value={titleQuery}
            onChange={(event) => setTitleQuery(event.target.value)}
          />
        </form>
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
