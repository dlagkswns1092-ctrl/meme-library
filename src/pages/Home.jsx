import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import MemeCard from "../components/MemeCard";
import { recommendedMemes, trendingMemes } from "../memeData";
import { FIXED_MEME_TAGS, sanitizeKoreanTagInput } from "../tagData";

const INITIAL_TRENDING_COUNT = 4;

function getNormalizedTagQuery(value) {
  return value.trim().toLowerCase();
}

export default function Home() {
  const [likedIds, setLikedIds] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [tagQuery, setTagQuery] = useState("");
  const [visibleTrendingCount, setVisibleTrendingCount] = useState(INITIAL_TRENDING_COUNT);
  const normalizedTagQuery = getNormalizedTagQuery(tagQuery);

  const matchesSelectedFilters = (meme) =>
    selectedFilters.length === 0 ||
    selectedFilters.some((tag) => meme.fixedTags?.includes(tag));

  const matchesTagQuery = (meme) => {
    if (!normalizedTagQuery) {
      return true;
    }

    const searchableTags = [...(meme.fixedTags ?? []), ...(meme.searchTags ?? [])];

    return searchableTags.some((tag) => tag.toLowerCase().includes(normalizedTagQuery));
  };

  const matchesAllFilters = (meme) => matchesSelectedFilters(meme) && matchesTagQuery(meme);

  const filteredTrendingMemes = trendingMemes.filter(matchesAllFilters);
  const filteredRecommendedMemes = recommendedMemes.filter(matchesAllFilters);
  const visibleTrendingMemes = filteredTrendingMemes.slice(0, visibleTrendingCount);
  const canLoadMoreTrending = visibleTrendingCount < filteredTrendingMemes.length;

  useEffect(() => {
    setVisibleTrendingCount(INITIAL_TRENDING_COUNT);
  }, [selectedFilters, normalizedTagQuery]);

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

  const handleTagQueryChange = (event) => {
    setTagQuery(sanitizeKoreanTagInput(event.target.value));
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
          <input
            type="text"
            className="homeTagSearchInput"
            placeholder="태그 직접입력"
            value={tagQuery}
            onChange={handleTagQueryChange}
            aria-label="태그 직접 입력 검색"
          />
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
            <p className="homeEmptyState">선택한 태그나 입력한 태그에 맞는 밈이 아직 없어요.</p>
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
            <p className="homeEmptyState">추천 밈도 선택한 태그나 입력한 태그 기준으로 비어 있어요.</p>
          )}
        </section>
      </main>
    </div>
  );
}
