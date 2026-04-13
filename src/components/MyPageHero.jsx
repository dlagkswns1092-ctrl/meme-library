import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

export default function MyPageHero({ activeBoard }) {
  const { user } = useAuth0();
  const nickname = user?.email ? user.email.split("@")[0] : "";

  return (
      <section className="profileHero">
        <div className="profileIdentity">
          <div className="profileAvatar" aria-hidden="true" />
          <div className="profileCopy">
            <h1>{nickname}</h1>
            <p className="profileMeta">
              <span>팔로잉 47</span>
              <span className="profileDot" aria-hidden="true">•</span>
              <span>팔로워 2</span>
            </p>
            <button type="button" className="profileEditBtn">프로필 수정</button>
          </div>
        </div>

        <div className="boardSwitch">
          <Link to="/mypage" className={`boardSwitchBtn${activeBoard === "saved" ? " isActive" : ""}`}>
            <span className="boardSwitchTitle">저장 보드</span>
            <span className="boardSwitchCount">195</span>
          </Link>
          <Link to="/mypage?tab=upload" className={`boardSwitchBtn${activeBoard === "upload" ? " isActive" : ""}`}>
            <span className="boardSwitchTitle">업로드</span>
            <span className="boardSwitchCount">21</span>
          </Link>
        </div>
      </section>
  );
}