import { ImageResponse } from "next/og";
import {
  decodeAnswers,
  generateCatchphrase,
  generateRarity,
  generateTitle,
  rarityLabel
} from "@/lib/diagnosis";

export const runtime = "edge";

const size = {
  width: 1200,
  height: 630
};

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const decoded = decodeAnswers(params.id);
  const title = decoded ? generateTitle(decoded) : "診断結果を生成できませんでした";
  const catchphrase = decoded ? generateCatchphrase(decoded) : "";
  const rarity = decoded ? generateRarity(decoded) : 0;
  const rLabel = decoded ? rarityLabel(rarity) : "--";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          padding: 56,
          color: "#f4f2ee",
          background:
            "radial-gradient(circle at 12% 18%, rgba(122,168,255,0.55) 0, transparent 42%), radial-gradient(circle at 88% 12%, rgba(180,139,255,0.55) 0, transparent 40%), radial-gradient(circle at 82% 88%, rgba(255,106,61,0.55) 0, transparent 44%), radial-gradient(circle at 10% 90%, rgba(214,255,91,0.35) 0, transparent 40%), linear-gradient(160deg, #07070a, #0b0b12)",
          fontFamily: "sans-serif"
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 22,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: "rgba(244,242,238,0.7)"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: 999,
                background: "#d6ff5b",
                boxShadow: "0 0 20px rgba(214,255,91,0.8)"
              }}
            />
            <span>Moshimo / 肩書き診断</span>
          </div>
          <span>Result</span>
        </div>

        <div
          style={{
            marginTop: 40,
            fontSize: 24,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: "rgba(244,242,238,0.55)"
          }}
        >
          Your title
        </div>

        <div
          style={{
            marginTop: 14,
            fontSize: 112,
            fontWeight: 500,
            lineHeight: 1.02,
            letterSpacing: -3,
            color: "#f4f2ee",
            display: "flex",
            flexWrap: "wrap"
          }}
        >
          「{title}」
        </div>

        {catchphrase ? (
          <div
            style={{
              marginTop: 24,
              fontSize: 30,
              fontStyle: "italic",
              color: "rgba(244,242,238,0.85)",
              maxWidth: 980
            }}
          >
            {catchphrase}
          </div>
        ) : null}

        <div
          style={{
            marginTop: "auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end"
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 6
            }}
          >
            <span
              style={{
                fontSize: 20,
                letterSpacing: 4,
                color: "rgba(244,242,238,0.5)",
                textTransform: "uppercase"
              }}
            >
              Rarity
            </span>
            <div style={{ display: "flex", alignItems: "baseline", gap: 16 }}>
              <span
                style={{
                  fontSize: 80,
                  color: "#d6ff5b",
                  letterSpacing: -2,
                  lineHeight: 1
                }}
              >
                {rLabel}
              </span>
              <span
                style={{
                  fontSize: 28,
                  color: "rgba(244,242,238,0.7)"
                }}
              >
                {rarity}%
              </span>
            </div>
          </div>

          <div
            style={{
              fontSize: 22,
              letterSpacing: 4,
              color: "rgba(244,242,238,0.6)",
              textTransform: "uppercase",
              textAlign: "right"
            }}
          >
            5 Questions · Share your title
          </div>
        </div>
      </div>
    ),
    size
  );
}
