import { useRef, useState } from "react";
import Navbar from "../components/Navbar";
import MyPageHero from "../components/MyPageHero";

function UploadArrowIcon() {
  return (
    <svg
      viewBox="0 0 80 80"
      className="uploadDropIcon"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M40 50V19" />
      <path d="m27 32 13-13 13 13" />
      <path d="M24 46v12c0 3.3 2.7 6 6 6h20c3.3 0 6-2.7 6-6V46" />
    </svg>
  );
}

const defaultTags = ["학업", "웃긴", "귀여운"];

export default function UploadPage() {
  const inputRef = useRef(null);
  const tagInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState("");
  const [memeName, setMemeName] = useState("");
  const [customTagInput, setCustomTagInput] = useState("");
  const [isCustomTagInputOpen, setIsCustomTagInputOpen] = useState(false);
  const [tags, setTags] = useState(defaultTags);

  const handleBrowse = () => {
    inputRef.current?.click();
  };

  const handleFileSelect = (event) => {
    const file = event.target.files?.[0];

    if (file) {
      setFileName(file.name);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);

    const file = event.dataTransfer.files?.[0];

    if (file) {
      setFileName(file.name);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  const addTag = () => {
    const nextTag = customTagInput.trim();

    if (!nextTag) {
      return;
    }

    const isDuplicate = tags.some(
      (tag) => tag.toLocaleLowerCase() === nextTag.toLocaleLowerCase()
    );

    if (isDuplicate) {
      setCustomTagInput("");
      return;
    }

    setTags((prev) => [...prev, nextTag]);
    setCustomTagInput("");
  };

  const handleTagKeyDown = (event) => {
    if (event.key !== "Enter") {
      return;
    }

    event.preventDefault();
    addTag();
  };

  const handleOpenCustomTagInput = () => {
    setIsCustomTagInputOpen(true);

    window.requestAnimationFrame(() => {
      tagInputRef.current?.focus();
    });
  };

  return (
    <div className="page myPage">
      <Navbar />

      <main className="myPageContent">
        <MyPageHero activeBoard="upload" />

        <section className="uploadEditorLayout">
          <div
            className={`uploadDropzone${isDragging ? " isDragging" : ""}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              ref={inputRef}
              type="file"
              className="srOnlyInput"
              accept=".png,.jpg,.jpeg,.gif"
              onChange={handleFileSelect}
            />

            <UploadArrowIcon />
            <h2>Drop the meme</h2>
            <p>PNG, JPEG, or GIF up to 25MB</p>
            <button type="button" className="browseFilesBtn" onClick={handleBrowse}>
              Browse Files
            </button>

            {fileName && <span className="selectedFileName">{fileName}</span>}
          </div>

          <form className="uploadFormPanel" onSubmit={handleSubmit}>
            <label className="uploadFieldLabel" htmlFor="memeName">
              Meme Name
            </label>
            <input
              id="memeName"
              className="uploadTextInput"
              value={memeName}
              onChange={(event) => setMemeName(event.target.value)}
            />

            <div className="uploadFieldGroup">
              <span className="uploadFieldLabel">Tag</span>
              <div className="uploadTagRow" aria-label="태그 목록">
                {tags.map((tag) => (
                  <span key={tag} className="uploadTagChip">
                    {tag}
                  </span>
                ))}

                <button
                  type="button"
                  className="uploadTagDirectBtn"
                  onClick={handleOpenCustomTagInput}
                >
                  직접입력
                </button>
              </div>

              {isCustomTagInputOpen && (
                <div className="uploadTagInputRow">
                  <input
                    ref={tagInputRef}
                    type="text"
                    className="uploadTagDirectInput"
                    placeholder="추가할 태그를 입력하세요"
                    value={customTagInput}
                    onChange={(event) => setCustomTagInput(event.target.value)}
                    onKeyDown={handleTagKeyDown}
                  />
                  <button type="button" className="uploadTagAddBtn" onClick={addTag}>
                    추가
                  </button>
                </div>
              )}

              <p className="uploadTagHint">원하는 태그를 직접 입력해서 추가할 수 있습니다.</p>
            </div>

            <button type="submit" className="uploadSubmitBtn">
              업로드
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}
