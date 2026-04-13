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
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState("");
  const [memeName, setMemeName] = useState("");

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

          <form className="uploadFormPanel">
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
              <div className="uploadTagRow">
                {defaultTags.map((tag) => (
                  <button key={tag} type="button" className="uploadTagChip">
                    {tag}
                  </button>
                ))}
                <button type="button" className="uploadTagAddBtn" aria-label="태그 추가">
                  +
                </button>
              </div>
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
