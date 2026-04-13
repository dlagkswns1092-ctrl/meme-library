import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { recommendedMemes, trendingMemes } from "../memeData";
import { FIXED_MEME_TAGS } from "../tagData";

const INITIAL_TRENDING_COUNT = 4;

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

function AdjustIcon() {
  return (
    <svg viewBox="0 0 24 24" className="homeFilterIcon" aria-hidden="true" focusable="false">
      <path d="M4 7h10" />
      <path d="M18 7h2" />
      <path d="M14 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
      <path d="M4 17h2" />
      <path d="M10 17h10" />
      <path d="M8 17a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
    </svg>
  );
}

function MemeCard({ meme, liked, onToggle }) {
  return (
    <article className="memeCard">
      <div className="thumbBox">
        <Link
          to={`/meme/${meme.id}`}
          className="memeCardLink"
          aria-label={`${meme.title} 상세 보기`}
        >
          <img src={meme.image} alt={meme.alt} className="thumbImage" loading="lazy" />
        </Link>
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
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [visibleTrendingCount, setVisibleTrendingCount] = useState(INITIAL_TRENDING_COUNT);

  const matchesSelectedFilters = (meme) =>
    selectedFilters.length === 0 ||
    selectedFilters.some((tag) => meme.fixedTags?.includes(tag));

  const filteredTrendingMemes = trendingMemes.filter(matchesSelectedFilters);
  const filteredRecommendedMemes = recommendedMemes.filter(matchesSelectedFilters);
  const visibleTrendingMemes = filteredTrendingMemes.slice(0, visibleTrendingCount);
  const canLoadMoreTrending = visibleTrendingCount < filteredTrendingMemes.length;

  useEffect(() => {
    setVisibleTrendingCount(INITIAL_TRENDING_COUNT);
  }, [selectedFilters]);

  const toggleLike = (id) => {
    setLikedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleFilter = (tag) => {
    setSelectedFilters((prev) =>
      prev.includes(tag) ? prev.filter((item) => item !== tag) : [...prev, tag]
    );
  };

  const handleLoadMoreTrending = () => {
    setVisibleTrendingCount((prev) =>
      Math.min(prev + INITIAL_TRENDING_COUNT, filteredTrendingMemes.length)
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
        <div className="chipRow homeFilterRow">
          {FIXED_MEME_TAGS.map((filter) => (
            <button
              key={filter}
              type="button"
              className={`chip${selectedFilters.includes(filter) ? " chipActive" : ""}`}
              onClick={() => toggleFilter(filter)}
              aria-pressed={selectedFilters.includes(filter)}
            >
              {filter}
            </button>
          ))}
          <button type="button" className="homeFilterAdjustBtn" aria-label="필터 설정">
            <AdjustIcon />
          </button>
        </div>
      </section>

      <main className="homeContent">
        <section className="section homeSection">
          <h2>인기 급 상승</h2>

          <div className="cardGrid">
            {visibleTrendingMemes.map((meme) => (
              <MemeCard
                key={meme.id}
                meme={meme}
                liked={likedIds.includes(meme.id)}
                onToggle={toggleLike}
              />
            ))}
          </div>

          {visibleTrendingMemes.length === 0 && (
            <p className="homeEmptyState">선택한 태그에 맞는 밈이 아직 없어요.</p>
          )}

          {canLoadMoreTrending && visibleTrendingMemes.length > 0 && (
            <div className="moreWrap">
              <button type="button" className="moreBtn" onClick={handleLoadMoreTrending}>
                더보기
              </button>
            </div>
          )}
        </section>

        <section className="section homeSection homeSectionWithDivider">
          <h2>회원님이 좋아할만한 밈</h2>

          <div className="cardGrid">
            {filteredRecommendedMemes.map((meme) => (
              <MemeCard
                key={meme.id}
                meme={meme}
                liked={likedIds.includes(meme.id)}
                onToggle={toggleLike}
              />
            ))}
          </div>

          {filteredRecommendedMemes.length === 0 && (
            <p className="homeEmptyState">추천 밈도 선택한 태그 기준으로 비어 있어요.</p>
          )}
        </section>
      </main>
    </div>
  );
}
