import { useMemo, useState } from "react";
import "./App.css";
import "./index.css";

const CATEGORIES = [
  "전체",
  "Text",
  "GIF",
  "Video",
];

const trendingMock = Array.from({ length: 4 }).map((_, i) => ({
  id: `t${i + 1}`,
  title: `Trending ${i + 1}`,
}));
const recommendedMock = Array.from({ length: 4 }).map((_, i) => ({
  id: `r${i + 1}`,
  title: `Recommended ${i + 1}`,
}));

export default function App() {
  const [query, setQuery] = useState("");
  const [selectedCats, setSelectedCats] = useState(["전체"]);
  const [liked, setLiked] = useState(() => new Set());

  const chips = useMemo(() => CATEGORIES.slice(0, 7), []);

  function toggleLike(id) {
    setLiked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleCat(cat) {
    setSelectedCats((prev) => {
      if (cat === "전체") return ["전체"];
      const set = new Set(prev);
      set.delete("전체");
      if (set.has(cat)) set.delete(cat);
      else set.add(cat);
      const arr = Array.from(set);
      return arr.length ? arr : ["전체"];
    });
  }

  return (
    <div className="page">
      <header className="topbar">
        <div className="topLeft">
          <div className="avatar" aria-label="profile" />
          <div className="searchPill">
            <span className="searchIcon">⌕</span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search memes…"
            />
          </div>
        </div>

        <div className="topRight">
          <button className="pillBtn">Upload</button>
          <button className="pillBtn">My</button>
        </div>
      </header>

      <section className="hero">
        <h1>Meme Library</h1>
        <p>We can find what you are looking for.</p>
      </section>

      <section className="chipRowWrap">
        <div className="chipRow">
          <button className="chipDropdown" title="More filters">
            ▾
          </button>

          {chips.map((c) => (
            <button
              key={c}
              className={`chip ${selectedCats.includes(c) ? "chipActive" : ""}`}
              onClick={() => toggleCat(c)}
            >
              {c}
            </button>
          ))}

          <button className="chip ghost" aria-hidden="true" />
          <button className="chip ghost" aria-hidden="true" />
        </div>
      </section>

      <main className="content">
        <Section title="인기 급 상승" items={trendingMock} liked={liked} onLike={toggleLike} />
        <Section
          title="회원님이 좋아할만한 밈/ 20대 유행중인 밈"
          items={recommendedMock}
          liked={liked}
          onLike={toggleLike}
        />
      </main>
    </div>
  );
}

function Section({ title, items, liked, onLike }) {
  return (
    <section className="section">
      <h2>{title}</h2>
      <div className="cardGrid">
        {items.map((it) => (
          <article key={it.id} className="memeCard">
            <button
              className={`heartBtn ${liked.has(it.id) ? "heartOn" : ""}`}
              onClick={() => onLike(it.id)}
              aria-label="like"
              title="Like"
            >
              ♡
            </button>
            <div className="thumb" />
            <div className="cardMeta">{it.title}</div>
          </article>
        ))}
      </div>
    </section>
  );
}