import { Link } from "react-router-dom";

export default function Login() {
  const handleSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <div className="page loginBg">
      <main className="loginPageFigma">
        <div className="loginCanvas">
          <div className="loginDecor loginDecorTop" aria-hidden="true" />
          <div className="loginDecor loginDecorBottom" aria-hidden="true" />

          <section className="loginBox">
            <h1 className="loginMainTitle">밈 라이브러리</h1>
            <div className="loginSubBadge">당신이 찾고 있는 모든 밈을 한눈에</div>

            <form className="loginFormFigma" onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="아이디"
                className="loginInputFigma"
                autoComplete="username"
              />

              <input
                type="password"
                placeholder="비밀번호"
                className="loginInputFigma"
                autoComplete="current-password"
              />

              <div className="loginOptionsRow">
                <label className="rememberRow">
                  <input type="checkbox" />
                  <span>로그인 상태 유지</span>
                </label>

                <button type="button" className="forgotBtn">
                  비밀번호 찾기
                </button>
              </div>

              <button type="submit" className="loginSubmitBtn">
                로그인
              </button>
            </form>

            <p className="loginBottomText">
              Don&apos;t have an account? <Link to="/signup">Sign up now</Link>
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
