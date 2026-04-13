import { useRef, useState } from "react";
import Navbar from "../components/Navbar";
import MyPageHero from "../components/MyPageHero";
import { FIXED_MEME_TAGS, sanitizeKoreanTagInput } from "../tagData";

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

export default function UploadPage() {
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState("");
  const [memeName, setMemeName] = useState("");
  const [customTagInput, setCustomTagInput] = useState("");
  const [selectedFixedTags, setSelectedFixedTags] = useState([]);
  const [customTags, setCustomTags] = useState([]);
  const [tagFeedback, setTagFeedback] = useState("");

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

  const toggleFixedTag = (tag) => {
    setSelectedFixedTags((prev) =>
      prev.includes(tag) ? prev.filter((item) => item !== tag) : [...prev, tag]
    );
  };

  const handleCustomTagInputChange = (event) => {
    const nextValue = event.target.value;
    const sanitizedValue = sanitizeKoreanTagInput(nextValue);

    setCustomTagInput(sanitizedValue);
    setTagFeedback(
      nextValue === sanitizedValue ? "" : "직접입력 태그는 한글과 공백만 입력할 수 있어요."
    );
  };

  const addTag = () => {
    const nextTag = customTagInput.trim();

    if (!nextTag) {
      return;
    }

    const isDuplicate =
      customTags.includes(nextTag) ||
      selectedFixedTags.includes(nextTag) ||
      FIXED_MEME_TAGS.includes(nextTag);

    if (isDuplicate) {
      setTagFeedback("이미 선택했거나 추가한 태그예요.");
      setCustomTagInput("");
      return;
    }

    setCustomTags((prev) => [...prev, nextTag]);
    setCustomTagInput("");
    setTagFeedback("");
  };

  const handleTagKeyDown = (event) => {
    if (event.key !== "Enter") {
      return;
    }

    event.preventDefault();
    addTag();
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
              <span className="uploadFieldLabel">태그</span>

              <div className="uploadTagRow" aria-label="고정 태그 목록">
                {FIXED_MEME_TAGS.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    className={`uploadTagChip${selectedFixedTags.includes(tag) ? " isSelected" : ""}`}
                    onClick={() => toggleFixedTag(tag)}
                    aria-pressed={selectedFixedTags.includes(tag)}
                  >
                    {tag}
                  </button>
                ))}
              </div>

              <div className="uploadTagInputRow">
                <input
                  type="text"
                  className="uploadTagDirectInput"
                  placeholder="한글 태그를 직접 입력하세요"
                  value={customTagInput}
                  onChange={handleCustomTagInputChange}
                  onKeyDown={handleTagKeyDown}
                />
                <button type="button" className="uploadTagAddBtn" onClick={addTag}>
                  추가
                </button>
              </div>

              {customTags.length > 0 && (
                <div className="uploadTagRow uploadCustomTagRow" aria-label="직접 입력한 태그">
                  {customTags.map((tag) => (
                    <span key={tag} className="uploadTagChip isCustomTag">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <p className={`uploadTagHint${tagFeedback ? " isError" : ""}`}>
                {tagFeedback ||
                  "고정 태그는 홈 필터에 쓰고, 직접입력 태그는 검색으로 이어질 수 있게 준비했어요."}
              </p>
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
