import { Link, useParams, useSearchParams } from "react-router-dom";
import { useState } from "react";
import Navbar from "../components/Navbar";
import { getMemeById, userProfileMap } from "../memeData";

function HeartIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="heartIcon"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M12 21.35 10.55 20C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54Z" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg
      viewBox="0 0 120 120"
      className="otherProfileLockIcon"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="60" cy="60" r="48" />
      <path d="M45 54V42a15 15 0 1 1 30 0v12" />
      <rect x="39" y="54" width="42" height="34" rx="3" />
      <path d="M60 67v8" />
    </svg>
  );
}

function OtherProfileMemeCard({ meme, liked, onToggle }) {
  return (
    <article className="profileMemeCard">
      <div className="profileThumbBox">
        <Link
          to={`/meme/${meme.id}`}
          className="memeCardLink"
          aria-label={`${meme.title} 상세 보기`}
        >
          <img
            src={meme.image}
            alt={meme.alt}
            className="profileThumbImage"
            loading="lazy"
          />
        </Link>
        <button
          type="button"
          className={`profileHeartBtn${liked ? " isLiked" : ""}`}
          onClick={() => onToggle(meme.id)}
          aria-label={liked ? "좋아요 취소" : "좋아요"}
          aria-pressed={liked}
        >
          <HeartIcon />
        </button>
      </div>
    </article>
  );
}

export default function UserProfile() {
  const { userId } = useParams();
  const [searchParams] = useSearchParams();
  const [likedIds, setLikedIds] = useState([]);
  const profile = userProfileMap[userId] ?? userProfileMap["min-public"];
  const [isFollowing, setIsFollowing] = useState(profile.isFollowing);
  const activeBoard = searchParams.get("tab") === "upload" ? "upload" : "saved";

  const visibleMemes =
    activeBoard === "upload"
      ? profile.uploadedMemeIds.map(getMemeById).filter(Boolean)
      : profile.savedMemeIds.map(getMemeById).filter(Boolean);

  const toggleLike = (id) => {
    setLikedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleFollowToggle = () => {
    setIsFollowing((prev) => !prev);
  };

  return (
    <div className="page myPage">
      <Navbar />

      <main className="myPageContent">
        <section className="profileHero">
          <div className="profileIdentity">
            <div className="profileAvatar" aria-hidden="true" />

            <div className="profileCopy">
              <h1>{profile.name}</h1>
              <p className="profileMeta">
                <span>팔로잉 {profile.followingCount}</span>
                <span className="profileDot" aria-hidden="true">
                  •
                </span>
                <span>팔로워 {profile.followerCount}</span>
              </p>
              <button
                type="button"
                className={`otherProfileFollowBtn${isFollowing ? " isFollowing" : ""}`}
                onClick={handleFollowToggle}
                aria-pressed={isFollowing}
              >
                {isFollowing ? "팔로잉" : "팔로우"}
              </button>
            </div>
          </div>

          <div className="boardSwitch">
            <Link
              to={`/users/${profile.id}`}
              className={`boardSwitchBtn${activeBoard === "saved" ? " isActive" : ""}`}
            >
              <span className="boardSwitchTitle">저장 보드</span>
              <span className="boardSwitchCount">{profile.savedCount}</span>
            </Link>

            <Link
              to={`/users/${profile.id}?tab=upload`}
              className={`boardSwitchBtn${activeBoard === "upload" ? " isActive" : ""}`}
            >
              <span className="boardSwitchTitle">업로드</span>
              <span className="boardSwitchCount">{profile.uploadCount}</span>
            </Link>
          </div>
        </section>

        {profile.isPrivate ? (
          <section className="otherProfilePrivateState">
            <LockIcon />
            <h2>This account is private</h2>
            <p>Follow this profile to see their photos and videos</p>
          </section>
        ) : (
          <>
            <section className="otherProfileSectionTitle">
              <h2>{activeBoard === "upload" ? "업로드" : "저장 보드"}</h2>
            </section>

            <section className="myMemeGrid">
              {visibleMemes.map((meme) => (
                <OtherProfileMemeCard
                  key={meme.id}
                  meme={meme}
                  liked={likedIds.includes(meme.id)}
                  onToggle={toggleLike}
                />
              ))}
            </section>
          </>
        )}
      </main>
    </div>
  );
}
