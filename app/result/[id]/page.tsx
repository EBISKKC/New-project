import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  buildTweetText,
  decodeAnswers,
  generateCatchphrase,
  generateCompat,
  generateRarity,
  generateScores,
  generateTitle,
  rarityLabel,
  SCORE_LABELS,
  type ScoreAxes
} from "@/lib/diagnosis";
import { getBaseUrl } from "@/lib/site";

type Props = {
  params: { id: string };
};

export function generateMetadata({ params }: Props): Metadata {
  const decoded = decodeAnswers(params.id);
  if (!decoded) return {};

  const title = generateTitle(decoded);
  const pageUrl = `${getBaseUrl()}/result/${params.id}`;
  const imageUrl = `${getBaseUrl()}/api/og/${params.id}`;

  return {
    title: `${title} | もしも肩書き診断`,
    description: `あなたのSNS肩書きは「${title}」でした。`,
    openGraph: {
      title: `あなたのSNS肩書きは「${title}」`,
      description: "5問で作るネタ診断 / スコア・相性・レア度つき",
      url: pageUrl,
      images: [{ url: imageUrl, width: 1200, height: 630 }]
    },
    twitter: {
      card: "summary_large_image",
      title: `あなたのSNS肩書きは「${title}」`,
      description: "5問で作るネタ診断",
      images: [imageUrl]
    }
  };
}

export default function ResultPage({ params }: Props) {
  const decoded = decodeAnswers(params.id);
  if (!decoded) {
    notFound();
  }

  const title = generateTitle(decoded);
  const catchphrase = generateCatchphrase(decoded);
  const scores = generateScores(decoded);
  const compat = generateCompat(decoded);
  const rarity = generateRarity(decoded);
  const rLabel = rarityLabel(rarity);
  const pageUrl = `${getBaseUrl()}/result/${params.id}`;
  const tweetText = buildTweetText(title, catchphrase);
  const xShareUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(pageUrl)}`;

  const axes = (Object.keys(scores) as (keyof ScoreAxes)[]).map((key) => ({
    key,
    label: SCORE_LABELS[key],
    value: scores[key]
  }));

  return (
    <main>
      <header className="topbar">
        <span className="brand">
          <span className="brand-dot" />
          Moshimo / Result
        </span>
        <span className="meta">#{params.id.slice(0, 8)}</span>
      </header>

      <section className="bento">
        <article className="cell cell-title fade-up fade-up-1">
          <span className="title-eyebrow">Your title</span>
          <h1 className="title-value">
            <em>「{title}」</em>
          </h1>
          <div className="cell-label">
            <span>Generated · {new Date().getFullYear()}</span>
            <span>Moshimo ⁂</span>
          </div>
        </article>

        <article className="cell cell-rarity fade-up fade-up-2">
          <div className="cell-label">
            <span>Rarity</span>
            <span>{rarity}%</span>
          </div>
          <div className="rarity-badge">{rLabel}</div>
          <div className="rarity-bar">
            <div className="rarity-fill" style={{ width: `${rarity}%` }} />
          </div>
        </article>

        <article className="cell cell-score fade-up fade-up-2">
          <div className="cell-label">
            <span>Trait scores</span>
            <span>4 axis</span>
          </div>
          <div className="score-list">
            {axes.map((a) => (
              <div key={a.key} className="score-row" data-axis={a.key}>
                <span>{a.label}</span>
                <div className="score-bar">
                  <div className="score-fill" style={{ width: `${a.value}%` }} />
                </div>
                <span className="score-val">{a.value}</span>
              </div>
            ))}
          </div>
        </article>

        <article className="cell cell-catch fade-up fade-up-3">
          <div className="cell-label">
            <span>Catchphrase</span>
            <span>⸺</span>
          </div>
          <p className="catch-text">{catchphrase}</p>
        </article>

        <article className="cell cell-compat fade-up fade-up-3">
          <div className="cell-label">
            <span>Compatibility</span>
            <span>±</span>
          </div>
          <div className="compat-row compat-good">
            <span className="compat-key">Good</span>
            <span className="compat-val">{compat.good}</span>
          </div>
          <div className="compat-row compat-bad">
            <span className="compat-key">Bad</span>
            <span className="compat-val">{compat.bad}</span>
          </div>
        </article>

        <article className="cell cell-share fade-up fade-up-4">
          <div className="share-url" title={pageUrl}>
            {pageUrl}
          </div>
          <a
            href={xShareUrl}
            className="btn btn-primary"
            target="_blank"
            rel="noreferrer"
          >
            Xでシェア <span className="btn-arrow">→</span>
          </a>
          <Link href="/" className="btn btn-ghost">
            もう一度診断
          </Link>
        </article>
      </section>

      <footer className="footer">
        <span>© Moshimo 2026</span>
        <span>Share your result</span>
      </footer>
    </main>
  );
}
