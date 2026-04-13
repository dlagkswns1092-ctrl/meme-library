import { Link, useSearchParams } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import Navbar from "../components/Navbar";
import MyPageHero from "../components/MyPageHero";
import { getMemeById } from "../memeData";
import photo1 from "../../photo/images.jpg";

const boardFilters = ["모든 밈", "귀여운 밈", "욕", "학교", "연애"];

const uploadedMemes = Array.from({ length: 12 }, (_, index) => ({
  id: `upload-${index + 1}`,
  image: photo1,
  alt: `업로드한 밈 ${index + 1}`,
}));

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

function PlusIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="uploadActionIcon"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 8v8" />
      <path d="M8 12h8" />
    </svg>
  );
}

function ProfileMemeCard({ meme, liked, onToggle, selected }) {
  return (
    <article className={`profileMemeCard${selected ? " isSelected" : ""}`}>
      <div className="profileThumbBox">
        <img
          src={meme.image}
          alt={meme.alt}
          className="profileThumbImage"
          loading="lazy"
        />
        <button
          type="button"
          className={`profileHeartBtn${liked ? " isLiked" : ""}${selected ? " isSelected" : ""}`}
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

export default function MyPage() {
  const [searchParams] = useSearchParams();
  const [activeFilter, setActiveFilter] = useState(boardFilters[0]);
  const [likedIds, setLikedIds] = useState([]);
  const { savedMemeIds, savedMemeCount } = useAuth();
  const activeBoard = searchParams.get("tab") === "upload" ? "upload" : "saved";
  const savedMemes = savedMemeIds.map(getMemeById).filter(Boolean);

  const toggleLike = (id) => {
    setLikedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="page myPage">
      <Navbar />

      <main className="myPageContent">
        <MyPageHero
          activeBoard={activeBoard}
          savedCount={savedMemeCount}
          uploadCount={uploadedMemes.length}
        />

        {activeBoard === "saved" ? (
          <>
            <section className="myFilterRow" aria-label="밈 필터">
              {boardFilters.map((filter) => (
                <button
                  key={filter}
                  type="button"
                  className={`myFilterChip${activeFilter === filter ? " isActive" : ""}`}
                  onClick={() => setActiveFilter(filter)}
                >
                  {filter}
                </button>
              ))}
            </section>

            <section className="myMemeGrid">
              {savedMemes.map((meme) => (
                <ProfileMemeCard
                  key={meme.id}
                  meme={meme}
                  liked={likedIds.includes(meme.id)}
                  onToggle={toggleLike}
                  selected={false}
                />
              ))}
            </section>

            {savedMemes.length === 0 && (
              <p className="myBoardEmptyState">저장한 밈이 아직 없어요. 상세 페이지에서 저장해보세요.</p>
            )}
          </>
        ) : (
          <>
            <section className="uploadHeaderRow">
              <h2>업로드 된 밈</h2>

              <Link to="/mypage/upload" className="uploadActionBtn">
                <PlusIcon />
                업로드
              </Link>
            </section>

            <section className="myMemeGrid">
              {uploadedMemes.map((meme) => (
                <ProfileMemeCard
                  key={meme.id}
                  meme={meme}
                  liked={likedIds.includes(meme.id)}
                  onToggle={toggleLike}
                  selected={false}
                />
              ))}
            </section>
          </>
        )}
      </main>
    </div>
  );
}
