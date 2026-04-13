import { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Navbar from "../components/Navbar";

const API = "http://localhost:8080";

function HeartIcon() {
  return (
      <svg viewBox="0 0 24 24" className="heartIcon" aria-hidden="true" focusable="false">
        <path d="M12 21.35 10.55 20C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54Z" />
      </svg>
  );
}

function MemeCard({ meme, liked, onToggle }) {
  return (
      <article className="memeCard">
        <div className="thumbBox">
          <img
              src={`${API}/uploads/${meme.filePath}`}
              alt={meme.title}
              className="thumbImage"
              loading="lazy"
          />
          <button
              type="button"
              className={`heartBtn${liked ? " isLiked" : ""}`}
              onClick={() => onToggle(meme.id)}
              aria-label={liked ? "좋아요 취소" : "좋아요"}
              aria-pressed={liked}
          >
            <HeartIcon />
          </button>
        </div>
        {meme.title && <p className="memeTitle">{meme.title}</p>}
      </article>
  );
}

export default function Home() {
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [trendingMemes, setTrendingMemes] = useState([]);
  const [allMemes, setAllMemes] = useState([]);
  const [likedIds, setLikedIds] = useState([]);

  // 밈 불러오기
  useEffect(() => {
    // 인기순
    fetch(`${API}/api/memes/most-liked`)
        .then((res) => res.json())
        .then((data) => setTrendingMemes(data.slice(0, 4)))
        .catch(console.error);

    // 전체
    fetch(`${API}/api/memes`)
        .then((res) => res.json())
        .then((data) => setAllMemes(data))
        .catch(console.error);
  }, []);

  const toggleLike = async (memeId) => {
    if (!isAuthenticated) {
      alert("로그인 후 좋아요를 누를 수 있어요!");
      return;
    }

    try {
      const token = await getAccessTokenSilently();
      const res = await fetch(`${API}/api/likes/toggle?memeId=${memeId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      setLikedIds((prev) =>
          data.liked ? [...prev, memeId] : prev.filter((id) => id !== memeId)
      );
    } catch (error) {
      console.error("좋아요 실패:", error);
    }
  };

  return (
      <div className="page homePage">
        <Navbar />

        <section className="hero">
          <h1>밈 라이브러리</h1>
          <p>당신이 찾고 있는 모든 밈을 한눈에</p>
        </section>

        <section className="chipRowWrap">
          <div className="chipRow leftAligned">
            <button className="chip chipActive">이미지</button>
            <button className="chip">GIF</button>
            <button className="chip">나이</button>
            <button className="chip">성별</button>
          </div>
        </section>

        <main className="content homeContent">
          <section className="section">
            <h2>인기 급 상승</h2>
            <div className="cardGrid">
              {trendingMemes.length > 0 ? (
                  trendingMemes.map((meme) => (
                      <MemeCard
                          key={meme.id}
                          meme={meme}
                          liked={likedIds.includes(meme.id)}
                          onToggle={toggleLike}
                      />
                  ))
              ) : (
                  <p style={{ color: "#999" }}>아직 밈이 없어요. 업로드해보세요!</p>
              )}
            </div>
            <div className="moreWrap">
              <button className="moreBtn">더보기</button>
            </div>
          </section>

          <section className="section">
            <h2>최신 밈</h2>
            <div className="cardGrid">
              {allMemes.length > 0 ? (
                  allMemes.slice(0, 4).map((meme) => (
                      <MemeCard
                          key={meme.id}
                          meme={meme}
                          liked={likedIds.includes(meme.id)}
                          onToggle={toggleLike}
                      />
                  ))
              ) : (
                  <p style={{ color: "#999" }}>아직 밈이 없어요. 업로드해보세요!</p>
              )}
            </div>
          </section>
        </main>
      </div>
  );
}