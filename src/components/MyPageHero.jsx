import { Link } from "react-router-dom";

export default function MyPageHero({ activeBoard }) {
  return (
    <section className="profileHero">
      <div className="profileIdentity">
        <div className="profileAvatar" aria-hidden="true" />

        <div className="profileCopy">
          <h1>홍지우</h1>
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

      <div className="boardSwitch">
        <Link
          to="/mypage"
          className={`boardSwitchBtn${activeBoard === "saved" ? " isActive" : ""}`}
        >
          <span className="boardSwitchTitle">저장 보드</span>
          <span className="boardSwitchCount">195</span>
        </Link>

        <Link
          to="/mypage?tab=upload"
          className={`boardSwitchBtn${activeBoard === "upload" ? " isActive" : ""}`}
        >
          <span className="boardSwitchTitle">업로드</span>
          <span className="boardSwitchCount">21</span>
        </Link>
      </div>
    </section>
  );
}
