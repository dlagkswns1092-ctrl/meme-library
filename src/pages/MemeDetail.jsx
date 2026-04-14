import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import Navbar from "../components/Navbar";

const API = "http://localhost:8080";

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
        <svg viewBox="0 0 24 24" className="memeDetailSendIcon" aria-hidden="true" focusable="false">
            <path d="M20 4 9 15" />
            <path d="m20 4-7 16-4-6-6-4Z" />
        </svg>
    );
}

export default function MemeDetail() {
    const { memeId } = useParams();
    const { isAuthenticated, getAccessTokenSilently } = useAuth0();
    const [meme, setMeme] = useState(null);
    const [liked, setLiked] = useState(false);
    const [comments, setComments] = useState([]);
    const [commentInput, setCommentInput] = useState("");
    const [relatedMemes, setRelatedMemes] = useState([]);

    useEffect(() => {
        fetch(`${API}/api/memes/${memeId}`)
            .then((res) => res.json())
            .then((data) => setMeme(data))
            .catch(console.error);

        fetch(`${API}/api/memes`)
            .then((res) => res.json())
            .then((data) => setRelatedMemes(data.filter((m) => String(m.id) !== String(memeId)).slice(0, 3)))
            .catch(console.error);
    }, [memeId]);

    const toggleLike = async () => {
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
            setLiked(data.liked);
        } catch (error) {
            console.error("좋아요 실패:", error);
        }
    };

    const handleCommentSubmit = (e) => {
        e.preventDefault();
        const next = commentInput.trim();
        if (!next) return;
        setComments((prev) => [...prev, { id: Date.now(), author: "나", text: next }]);
        setCommentInput("");
    };

    if (!meme) return <div>로딩 중...</div>;

    return (
        <div className="page homePage memeDetailPage">
            <Navbar />

            <main className="memeDetailLayout">
                <section className="memeDetailCard">
                    <div className="memeDetailTopRow">
                        <div className="memeDetailActionGroup">
                            <button
                                type="button"
                                className={`memeDetailIconBtn${liked ? " isLiked" : ""}`}
                                onClick={toggleLike}
                                aria-label={liked ? "좋아요 취소" : "좋아요"}
                                aria-pressed={liked}
                            >
                                <HeartIcon />
                                <span>{meme.likeCount?.toLocaleString()}</span>
                            </button>

                            <button type="button" className="memeDetailIconBtn" aria-label="댓글 보기">
                                <CommentIcon />
                            </button>

                            <button type="button" className="memeDetailIconBtn" aria-label="공유">
                                <ShareIcon />
                            </button>
                        </div>
                    </div>

                    <div className="memeDetailImageBox">
                        <img
                            src={`${API}/uploads/${meme.filePath}`}
                            alt={meme.title}
                            className="memeDetailImage"
                        />
                    </div>

                    <div className="memeDetailContent">
                        <h1 className="memeDetailTitle">{meme.title}</h1>
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

                        <form className="memeDetailCommentForm" onSubmit={handleCommentSubmit}>
                            <input
                                type="text"
                                placeholder="댓글 추가"
                                value={commentInput}
                                onChange={(e) => setCommentInput(e.target.value)}
                            />
                            <button type="submit" aria-label="댓글 전송">
                                <SendIcon />
                            </button>
                        </form>
                    </section>
                </section>

                <aside className="memeDetailSidebar" aria-label="관련 밈">
                    {relatedMemes.map((related) => (
                        <article key={related.id} className="memeDetailSideCard">
                            <Link
                                to={`/meme/${related.id}`}
                                className="memeDetailSideLink"
                                aria-label={`${related.title} 상세 보기`}
                            >
                                <img
                                    src={`${API}/uploads/${related.filePath}`}
                                    alt={related.title}
                                    className="memeDetailSideImage"
                                />
                            </Link>
                        </article>
                    ))}
                </aside>
            </main>
        </div>
    );
}