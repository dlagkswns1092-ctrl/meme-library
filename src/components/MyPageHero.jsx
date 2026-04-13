import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function MyPageHero({ activeBoard, savedCount = 0, uploadCount = 0 }) {
  const navigate = useNavigate();
  const { displayName, isProfilePrivate, logout, setProfilePrivacy } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <section className="profileHero">
      <div className="profileIdentity">
        <div className="profileAvatar" aria-hidden="true" />

        <div className="profileCopy">
          <div className="profileHeadingRow">
            <h1>{displayName}</h1>
            <button type="button" className="profileLogoutBtn" onClick={handleLogout}>
              로그아웃
            </button>
          </div>
          <p className="profileMeta">
            <span>팔로잉 47</span>
            <span className="profileDot" aria-hidden="true">
              •
            </span>
            <span>팔로워 2</span>
          </p>
          <button type="button" className="profileEditBtn">
            프로필 수정
          </button>
        </div>
      </div>

      <div className="profileBoardPanel">
        <div className="boardSwitch">
          <Link
            to="/mypage"
            className={`boardSwitchBtn${activeBoard === "saved" ? " isActive" : ""}`}
          >
            <span className="boardSwitchTitle">저장 보드</span>
            <span className="boardSwitchCount">{savedCount}</span>
          </Link>

          <Link
            to="/mypage?tab=upload"
            className={`boardSwitchBtn${activeBoard === "upload" ? " isActive" : ""}`}
          >
            <span className="boardSwitchTitle">업로드</span>
            <span className="boardSwitchCount">{uploadCount}</span>
          </Link>
        </div>

        {activeBoard === "saved" && (
          <div className="profileVisibilityRow" aria-label="저장 보드 공개 설정">
            <button
              type="button"
              className={`profileVisibilityBtn${!isProfilePrivate ? " isActive" : ""}`}
              onClick={() => setProfilePrivacy(false)}
              aria-pressed={!isProfilePrivate}
            >
              공개
            </button>
            <button
              type="button"
              className={`profileVisibilityBtn${isProfilePrivate ? " isActive" : ""}`}
              onClick={() => setProfilePrivacy(true)}
              aria-pressed={isProfilePrivate}
            >
              비공개
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
