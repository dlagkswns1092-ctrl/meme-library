import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import MemeCard from "../components/MemeCard";
import { memeCatalog } from "../memeData";
import { FIXED_MEME_TAGS, sanitizeKoreanTagInput } from "../tagData";

function getNormalizedTitleQuery(value) {
  return value.trim().toLowerCase();
}

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const [likedIds, setLikedIds] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [tagQuery, setTagQuery] = useState("");
  const titleQuery = searchParams.get("q") ?? "";
  const normalizedTitleQuery = getNormalizedTitleQuery(titleQuery);
  const normalizedTagQuery = getNormalizedTitleQuery(tagQuery);

  const searchedMemes = useMemo(() => {
    if (!normalizedTitleQuery) {
      return [];
    }

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

    return memeCatalog.filter(
      (meme) =>
        meme.title.toLowerCase().includes(normalizedTitleQuery) &&
        matchesSelectedFilters(meme) &&
        matchesTagQuery(meme)
    );
  }, [normalizedTitleQuery, normalizedTagQuery, selectedFilters]);

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

  return (
    <div className="page homePage">
      <Navbar />

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

      <main className="homeContent searchResultsContent">
        <section className="section searchResultsSection">
          {searchedMemes.length > 0 ? (
            <div className="cardGrid">
              {searchedMemes.map((meme) => (
                <MemeCard
                  key={meme.id}
                  meme={meme}
                  liked={likedIds.includes(meme.id)}
                  onToggle={toggleLike}
                />
              ))}
            </div>
          ) : (
            (
              <p className="homeEmptyState">
                {titleQuery
                  ? "검색한 제목과 선택한 태그에 맞는 밈이 없어요."
                  : "제목을 입력해 밈을 검색해보세요."}
              </p>
            )
          )}
        </section>
      </main>
    </div>
  );
}
