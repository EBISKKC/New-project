import Link from "next/link";

export default function NotFound() {
  return (
    <main>
      <header className="topbar">
        <span className="brand">
          <span className="brand-dot" />
          Moshimo / 404
        </span>
        <span className="meta">Not Found</span>
      </header>

      <section className="hero">
        <div className="fade-up fade-up-1">
          <h1 className="hero-title">
            この結果、<br />
            <em>どこにも</em>ない。
          </h1>
          <p className="hero-sub">
            URLが壊れているか、診断IDが読み取れませんでした。
            もう一度、最初から診断してみてください。
          </p>
          <Link href="/" className="btn btn-primary">
            トップに戻る <span className="btn-arrow">→</span>
          </Link>
        </div>

        <div className="hero-card fade-up fade-up-2">
          <div className="hero-card-row">
            <span>Status</span>
            <span>404</span>
          </div>
          <div className="hero-card-num">¯\_(ツ)_/¯</div>
          <div className="hero-card-foot">
            <span>Page lost in timeline</span>
            <span>Retry?</span>
          </div>
        </div>
      </section>
    </main>
  );
}
