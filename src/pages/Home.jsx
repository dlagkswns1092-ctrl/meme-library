import { useState } from "react";
import Navbar from "../components/Navbar";
import photo1 from "../../photo/images.jpg";
import photo2 from "../../photo/images-1.jpg";
import photo3 from "../../photo/images-2.jpg";
import photo4 from "../../photo/images-3.jpg";
import photo5 from "../../photo/download-2.jpg";
import photo6 from "../../photo/download-3.jpg";
import photo7 from "../../photo/download-4.jpg";
import photo8 from "../../photo/download-5.jpg";

const trendingMemes = [
  {
    id: "trend-1",
    image: photo1,
    alt: "인기 밈 이미지 1",
  },
  {
    id: "trend-2",
    image: photo2,
    alt: "인기 밈 이미지 2",
  },
  {
    id: "trend-3",
    image: photo3,
    alt: "인기 밈 이미지 3",
  },
  {
    id: "trend-4",
    image: photo4,
    alt: "인기 밈 이미지 4",
  },
];

const recommendedMemes = [
  {
    id: "rec-1",
    image: photo5,
    alt: "추천 밈 이미지 1",
  },
  {
    id: "rec-2",
    image: photo6,
    alt: "추천 밈 이미지 2",
  },
  {
    id: "rec-3",
    image: photo7,
    alt: "추천 밈 이미지 3",
  },
  {
    id: "rec-4",
    image: photo8,
    alt: "추천 밈 이미지 4",
  },
];

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

function MemeCard({ meme, liked, onToggle }) {
  return (
    <article className="memeCard">
      <div className="thumbBox">
        <img src={meme.image} alt={meme.alt} className="thumbImage" loading="lazy" />
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
    </article>
  );
}

export default function Home() {
  const [likedIds, setLikedIds] = useState([]);

  const toggleLike = (id) => {
    setLikedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
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
            {trendingMemes.map((meme) => (
              <MemeCard
                key={meme.id}
                meme={meme}
                liked={likedIds.includes(meme.id)}
                onToggle={toggleLike}
              />
            ))}
          </div>

          <div className="moreWrap">
            <button className="moreBtn">더보기</button>
          </div>
        </section>

        <section className="section">
          <h2>회원님이 좋아할만한 밈 / 20대 유행중인 밈</h2>

          <div className="cardGrid">
            {recommendedMemes.map((meme) => (
              <MemeCard
                key={meme.id}
                meme={meme}
                liked={likedIds.includes(meme.id)}
                onToggle={toggleLike}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
