export type QuestionId =
  | "energy"
  | "workstyle"
  | "social"
  | "fuel"
  | "vibe";

export type Question = {
  id: QuestionId;
  text: string;
  hint?: string;
  options: { value: string; label: string; emoji?: string }[];
};

export const QUESTIONS: Question[] = [
  {
    id: "energy",
    text: "集中力が最大化するのはいつ？",
    hint: "スイッチが入るタイミングを選んで",
    options: [
      { value: "night", label: "深夜に突然スイッチが入る", emoji: "🌙" },
      { value: "morning", label: "朝イチで全部片付けたい", emoji: "☀️" },
      { value: "deadline", label: "締切前の追い込みだけ覚醒", emoji: "⏰" }
    ]
  },
  {
    id: "workstyle",
    text: "作業スタイルはどれに近い？",
    hint: "普段のムーブを思い出して",
    options: [
      { value: "solo", label: "一人で黙々、爆速で進める", emoji: "🎧" },
      { value: "chaos", label: "散らかってから整えるカオス型", emoji: "🌪️" },
      { value: "ideas", label: "思いつきで着火して形にする", emoji: "💡" }
    ]
  },
  {
    id: "social",
    text: "SNSでつい出る一面は？",
    hint: "投稿でにじみ出るキャラ",
    options: [
      { value: "kind", label: "優しく背中を押す", emoji: "🫶" },
      { value: "sharp", label: "短文で鋭く刺す", emoji: "🗡️" },
      { value: "meme", label: "ミームで全部説明する", emoji: "🎭" }
    ]
  },
  {
    id: "fuel",
    text: "やる気の燃料源は？",
    hint: "これがないと始まらない",
    options: [
      { value: "caffeine", label: "カフェインと爆音BGM", emoji: "☕" },
      { value: "praise", label: "小さな褒め言葉", emoji: "✨" },
      { value: "panic", label: "健全なパニック", emoji: "🔥" }
    ]
  },
  {
    id: "vibe",
    text: "週末の理想はどれ？",
    hint: "回復モードの過ごし方",
    options: [
      { value: "cafe", label: "カフェでノートを広げる", emoji: "📓" },
      { value: "couch", label: "ソファで配信を延々と", emoji: "📺" },
      { value: "walk", label: "知らない街をひたすら歩く", emoji: "🚶" }
    ]
  }
];

export type Answers = Record<QuestionId, string>;

const PREFIX_MAP: Record<string, string> = {
  night: "深夜覚醒型",
  morning: "朝駆動型",
  deadline: "締切錬金"
};

const STYLE_MAP: Record<string, string> = {
  solo: "無音実行",
  chaos: "カオス再構築",
  ideas: "着火先行"
};

const SOCIAL_MAP: Record<string, string> = {
  kind: "サポーター",
  sharp: "戦略家",
  meme: "翻訳家"
};

const FUEL_MAP: Record<string, string> = {
  caffeine: "・高出力",
  praise: "・照れ屋",
  panic: "・火事場"
};

const VIBE_MAP: Record<string, string> = {
  cafe: "",
  couch: "／ソファ派",
  walk: "／徒歩民"
};

export function generateTitle(answers: Answers): string {
  const prefix = PREFIX_MAP[answers.energy] ?? "気分型";
  const style = STYLE_MAP[answers.workstyle] ?? "進行";
  const social = SOCIAL_MAP[answers.social] ?? "職人";
  const fuel = FUEL_MAP[answers.fuel] ?? "";
  const vibe = VIBE_MAP[answers.vibe] ?? "";

  return `${prefix}${style}${social}${fuel}${vibe}`;
}

const CATCHPHRASE_ENERGY: Record<string, string> = {
  night: "太陽が沈むと、あなたが昇る。",
  morning: "夜明け前から世界を動かす人。",
  deadline: "締切という名の神に愛された存在。"
};

const CATCHPHRASE_SOCIAL: Record<string, string> = {
  kind: "タイムラインの静かな光源。",
  sharp: "一行で空気を変えるタイプ。",
  meme: "ミームで真理を語る現代の詩人。"
};

export function generateCatchphrase(answers: Answers): string {
  const a = CATCHPHRASE_ENERGY[answers.energy] ?? "";
  const b = CATCHPHRASE_SOCIAL[answers.social] ?? "";
  return `${a} ${b}`.trim();
}

export type ScoreAxes = {
  focus: number;
  chaos: number;
  warmth: number;
  tempo: number;
};

export function generateScores(answers: Answers): ScoreAxes {
  let focus = 50;
  let chaos = 50;
  let warmth = 50;
  let tempo = 50;

  if (answers.energy === "night") {
    focus += 15;
    tempo += 10;
  }
  if (answers.energy === "morning") {
    focus += 25;
    warmth += 5;
  }
  if (answers.energy === "deadline") {
    chaos += 20;
    tempo += 20;
  }

  if (answers.workstyle === "solo") focus += 20;
  if (answers.workstyle === "chaos") chaos += 25;
  if (answers.workstyle === "ideas") {
    chaos += 10;
    tempo += 10;
  }

  if (answers.social === "kind") warmth += 30;
  if (answers.social === "sharp") {
    focus += 10;
    warmth -= 15;
  }
  if (answers.social === "meme") {
    chaos += 10;
    warmth += 10;
  }

  if (answers.fuel === "caffeine") tempo += 15;
  if (answers.fuel === "praise") warmth += 10;
  if (answers.fuel === "panic") {
    chaos += 15;
    tempo += 15;
  }

  if (answers.vibe === "cafe") focus += 10;
  if (answers.vibe === "couch") warmth += 5;
  if (answers.vibe === "walk") tempo += 5;

  const clamp = (n: number) => Math.max(5, Math.min(98, n));
  return {
    focus: clamp(focus),
    chaos: clamp(chaos),
    warmth: clamp(warmth),
    tempo: clamp(tempo)
  };
}

export const SCORE_LABELS: Record<keyof ScoreAxes, string> = {
  focus: "集中",
  chaos: "カオス",
  warmth: "あたたかみ",
  tempo: "テンポ"
};

export type Compat = { good: string; bad: string };

const COMPAT_MAP: Record<string, Compat> = {
  kind: { good: "戦略家", bad: "着火先行" },
  sharp: { good: "翻訳家", bad: "サポーター" },
  meme: { good: "サポーター", bad: "戦略家" }
};

export function generateCompat(answers: Answers): Compat {
  return (
    COMPAT_MAP[answers.social] ?? { good: "翻訳家", bad: "戦略家" }
  );
}

// レア度: 回答の組み合わせから擬似的な希少度を出す（0-100）
export function generateRarity(answers: Answers): number {
  const weights: Record<string, number> = {
    night: 8,
    morning: 4,
    deadline: 6,
    solo: 5,
    chaos: 9,
    ideas: 6,
    kind: 4,
    sharp: 7,
    meme: 8,
    caffeine: 5,
    praise: 4,
    panic: 9,
    cafe: 5,
    couch: 4,
    walk: 7
  };
  const sum =
    (weights[answers.energy] ?? 5) +
    (weights[answers.workstyle] ?? 5) +
    (weights[answers.social] ?? 5) +
    (weights[answers.fuel] ?? 5) +
    (weights[answers.vibe] ?? 5);
  // 25..45 → 20..96 にマップ
  const mapped = Math.round(((sum - 25) / 20) * 76 + 20);
  return Math.max(12, Math.min(97, mapped));
}

export function rarityLabel(rarity: number): string {
  if (rarity >= 85) return "SSR";
  if (rarity >= 70) return "SR";
  if (rarity >= 45) return "R";
  return "N";
}

export function encodeAnswers(answers: Answers): string {
  const payload = JSON.stringify(answers);
  return Buffer.from(payload, "utf8").toString("base64url");
}

export function decodeAnswers(id: string): Answers | null {
  try {
    const raw = Buffer.from(id, "base64url").toString("utf8");
    const parsed = JSON.parse(raw) as Partial<Answers>;
    if (
      !parsed.energy ||
      !parsed.workstyle ||
      !parsed.social ||
      !parsed.fuel ||
      !parsed.vibe
    ) {
      return null;
    }

    return {
      energy: parsed.energy,
      workstyle: parsed.workstyle,
      social: parsed.social,
      fuel: parsed.fuel,
      vibe: parsed.vibe
    };
  } catch {
    return null;
  }
}

export function buildTweetText(title: string, catchphrase: string): string {
  return `あなたのSNS肩書きは「${title}」\n${catchphrase}`;
}
