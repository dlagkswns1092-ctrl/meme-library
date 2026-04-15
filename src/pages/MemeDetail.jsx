import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../auth/AuthContext";
import { memeCatalog, userProfileMap } from "../memeData";

function HeartIcon({ className = "memeDetailIcon" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" focusable="false">
      <path d="M12 21.35 10.55 20C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54Z" />
    </svg>
  );
}

function CommentIcon() {
  return (
    <svg viewBox="0 0 24 24" className="memeDetailIcon" aria-hidden="true" focusable="false">
      <path d="M20 11.5c0 4.14-3.58 7.5-8 7.5-.82 0-1.61-.11-2.35-.31L4 20l1.54-4.62A6.97 6.97 0 0 1 4 11.5C4 7.36 7.58 4 12 4s8 3.36 8 7.5Z" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg viewBox="0 0 24 24" className="memeDetailIcon" aria-hidden="true" focusable="false">
      <path d="M14 5h5v5" />
      <path d="m10 14 9-9" />
      <path d="M19 13v4a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h4" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="memeDetailSendIcon"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M20 4 9 15" />
      <path d="m20 4-7 16-4-6-6-4Z" />
    </svg>
  );
}

async function copyTextToClipboard(text) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "absolute";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
}

function MemeDetailContent({ currentMeme }) {
  const [likedIds, setLikedIds] = useState([]);
  const [comments, setComments] = useState(currentMeme.comments);
  const [commentInput, setCommentInput] = useState("");
  const [isShareMenuOpen, setIsShareMenuOpen] = useState(false);
  const [shareFeedback, setShareFeedback] = useState("");
  const { savedMemeIds, toggleSavedMeme } = useAuth();
  const commentFormRef = useRef(null);
  const commentInputRef = useRef(null);
  const shareMenuRef = useRef(null);
  const currentAuthor = userProfileMap[currentMeme.authorId];

  const relatedMemes = memeCatalog.filter((item) => item.id !== currentMeme.id).slice(0, 3);
  const isLiked = likedIds.includes(currentMeme.id);
  const isSaved = savedMemeIds.includes(currentMeme.id);

  useEffect(() => {
    if (!isShareMenuOpen) {
      return undefined;
    }

    const handlePointerDown = (event) => {
      if (!shareMenuRef.current?.contains(event.target)) {
        setIsShareMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
    };
  }, [isShareMenuOpen]);

  useEffect(() => {
    if (!shareFeedback) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setShareFeedback("");
    }, 2200);

    return () => window.clearTimeout(timeoutId);
  }, [shareFeedback]);

  const toggleLike = (id) => {
    setLikedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleCommentSubmit = (event) => {
    event.preventDefault();

    const nextComment = commentInput.trim();

    if (!nextComment) {
      return;
    }

    setComments((prev) => [
      ...prev,
      {
        id: `${currentMeme.id}-comment-${prev.length + 1}`,
        author: "이름",
        text: nextComment,
      },
    ]);
    setCommentInput("");
  };

  const handleCommentButtonClick = () => {
    commentFormRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    window.setTimeout(() => {
      commentInputRef.current?.focus();
    }, 220);
  };

  const handleCopyLink = async () => {
    try {
      await copyTextToClipboard(window.location.href);
      setShareFeedback("링크가 복사됐어요.");
      setIsShareMenuOpen(false);
    } catch {
      setShareFeedback("링크 복사에 실패했어요.");
    }
  };

  return (
    <div className="page homePage memeDetailPage">
      <Navbar />

      <main className="memeDetailLayout">
        <section className="memeDetailCard">
          <div className="memeDetailTopRow">
            <div className="memeDetailActionGroup">
              <button
                type="button"
                className={`memeDetailIconBtn${isLiked ? " isLiked" : ""}`}
                onClick={() => toggleLike(currentMeme.id)}
                aria-label={isLiked ? "좋아요 취소" : "좋아요"}
                aria-pressed={isLiked}
              >
                <HeartIcon />
                <span>{currentMeme.likes.toLocaleString()}</span>
              </button>

              <button
                type="button"
                className="memeDetailIconBtn"
                onClick={handleCommentButtonClick}
                aria-label="댓글 입력으로 이동"
              >
                <CommentIcon />
              </button>

              <div className="memeDetailShareWrap" ref={shareMenuRef}>
                <button
                  type="button"
                  className="memeDetailIconBtn"
                  onClick={() => setIsShareMenuOpen((prev) => !prev)}
                  aria-label="공유"
                  aria-expanded={isShareMenuOpen}
                  aria-haspopup="menu"
                >
                  <ShareIcon />
                </button>

                {isShareMenuOpen && (
                  <div className="memeDetailShareMenu" role="menu" aria-label="공유 메뉴">
                    <button
                      type="button"
                      className="memeDetailShareMenuBtn"
                      onClick={handleCopyLink}
                    >
                      링크 복사
                    </button>
                  </div>
                )}
              </div>

              {shareFeedback && <p className="memeDetailShareFeedback">{shareFeedback}</p>}
            </div>

            <div className="memeDetailMetaGroup">
              <button
                type="button"
                className={`memeDetailSaveBtn${isSaved ? " isSaved" : ""}`}
                onClick={() => toggleSavedMeme(currentMeme.id)}
              >
                {isSaved ? "저장됨" : "저장"}
              </button>
            </div>
          </div>

          <div className="memeDetailImageBox">
            <img
              src={currentMeme.image}
              alt={currentMeme.alt}
              className="memeDetailImage"
            />
            <span className="memeDetailBadge">{currentMeme.badge}</span>
          </div>

          <div className="memeDetailContent">
            <h1 className="memeDetailTitle">{currentMeme.title}</h1>

            <div className="memeDetailAuthorRow">
              <span className="memeDetailAvatar" aria-hidden="true" />
              <Link
                to={`/users/${currentAuthor?.id ?? "min-public"}`}
                className="memeDetailAuthorLink"
              >
                <span className="memeDetailAuthor">
                  {currentAuthor?.name ?? currentMeme.author}
                </span>
              </Link>
              <span className="memeDetailAuthorDot" aria-hidden="true">
                •
              </span>
              <span className="memeDetailDate">{currentMeme.date}</span>
            </div>
          </div>

          <section className="memeDetailComments">
            <h2>댓글 {comments.length}개</h2>

            <div className="memeDetailCommentList">
              {comments.map((comment) => (
                <article key={comment.id} className="memeDetailCommentItem">
                  <span className="memeDetailAvatar" aria-hidden="true" />
                  <div className="memeDetailCommentCopy">
                    <span className="memeDetailCommentAuthor">{comment.author}</span>
                    <p>{comment.text}</p>
                  </div>
                </article>
              ))}
            </div>

            <form
              ref={commentFormRef}
              className="memeDetailCommentForm"
              onSubmit={handleCommentSubmit}
            >
              <input
                ref={commentInputRef}
                type="text"
                placeholder="댓글 추가"
                value={commentInput}
                onChange={(event) => setCommentInput(event.target.value)}
              />
              <button type="submit" aria-label="댓글 전송">
                <SendIcon />
              </button>
            </form>
          </section>
        </section>

        <aside className="memeDetailSidebar" aria-label="관련 밈">
          {relatedMemes.map((meme) => {
            const relatedLiked = likedIds.includes(meme.id);

            return (
              <article key={meme.id} className="memeDetailSideCard">
                <Link
                  to={`/meme/${meme.id}`}
                  className="memeDetailSideLink"
                  aria-label={`${meme.title} 상세 보기`}
                >
                  <img src={meme.image} alt={meme.alt} className="memeDetailSideImage" />
                </Link>

                <button
                  type="button"
                  className={`memeDetailSideHeart${relatedLiked ? " isLiked" : ""}`}
                  onClick={() => toggleLike(meme.id)}
                  aria-label={relatedLiked ? "좋아요 취소" : "좋아요"}
                  aria-pressed={relatedLiked}
                >
                  <HeartIcon className="memeDetailSideHeartIcon" />
                </button>
              </article>
            );
          })}
        </aside>
      </main>
    </div>
  );
}

export default function MemeDetail() {
  const { memeId } = useParams();
  const currentMeme = memeCatalog.find((item) => item.id === memeId) ?? memeCatalog[0];

  return <MemeDetailContent key={currentMeme.id} currentMeme={currentMeme} />;
}
