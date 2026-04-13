import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import Navbar from "../components/Navbar";
import MyPageHero from "../components/MyPageHero";

const API = "http://localhost:8080";

const defaultTags = ["학업", "웃긴", "귀여운"];

function UploadArrowIcon() {
  return (
      <svg viewBox="0 0 80 80" className="uploadDropIcon" aria-hidden="true" focusable="false">
        <path d="M40 50V19" />
        <path d="m27 32 13-13 13 13" />
        <path d="M24 46v12c0 3.3 2.7 6 6 6h20c3.3 0 6-2.7 6-6V46" />
      </svg>
  );
}

export default function UploadPage() {
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const { getAccessTokenSilently } = useAuth0();

  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [memeName, setMemeName] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = (selected) => {
    if (selected) {
      setFile(selected);
      setFileName(selected.name);
    }
  };

  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
        prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) { alert("파일을 선택해주세요!"); return; }
    if (!memeName.trim()) { alert("밈 이름을 입력해주세요!"); return; }

    setIsUploading(true);

    try {
      const token = await getAccessTokenSilently();

      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", memeName);
      selectedTags.forEach((tag) => formData.append("tags", tag));
      if (selectedTags.length === 0) formData.append("tags", "기타");

      const res = await fetch(`${API}/api/memes`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) throw new Error("업로드 실패");

      alert("업로드 완료!");
      navigate("/mypage?tab=upload");
    } catch (error) {
      console.error("업로드 에러:", error);
      alert("업로드 실패했어요. 다시 시도해주세요.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
      <div className="page myPage">
        <Navbar />
        <main className="myPageContent">
          <MyPageHero activeBoard="upload" />

          <section className="uploadEditorLayout">
            <div
                className={`uploadDropzone${isDragging ? " isDragging" : ""}`}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  handleFileSelect(e.dataTransfer.files?.[0]);
                }}
            >
              <input
                  ref={inputRef}
                  type="file"
                  className="srOnlyInput"
                  accept=".png,.jpg,.jpeg,.gif"
                  onChange={(e) => handleFileSelect(e.target.files?.[0])}
              />
              <UploadArrowIcon />
              <h2>Drop the meme</h2>
              <p>PNG, JPEG, or GIF up to 25MB</p>
              <button type="button" className="browseFilesBtn" onClick={() => inputRef.current?.click()}>
                Browse Files
              </button>
              {fileName && <span className="selectedFileName">{fileName}</span>}
            </div>

            <form className="uploadFormPanel" onSubmit={handleSubmit}>
              <label className="uploadFieldLabel" htmlFor="memeName">Meme Name</label>
              <input
                  id="memeName"
                  className="uploadTextInput"
                  value={memeName}
                  onChange={(e) => setMemeName(e.target.value)}
              />

              <div className="uploadFieldGroup">
                <span className="uploadFieldLabel">Tag</span>
                <div className="uploadTagRow">
                  {defaultTags.map((tag) => (
                      <button
                          key={tag}
                          type="button"
                          className={`uploadTagChip${selectedTags.includes(tag) ? " isActive" : ""}`}
                          onClick={() => toggleTag(tag)}
                      >
                        {tag}
                      </button>
                  ))}
                </div>
              </div>

              <button type="submit" className="uploadSubmitBtn" disabled={isUploading}>
                {isUploading ? "업로드 중..." : "업로드"}
              </button>
            </form>
          </section>
        </main>
      </div>
  );
}