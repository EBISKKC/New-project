"use client";

import { FormEvent, useMemo, useState } from "react";
import { AMINO_ACIDS, AMINO_SECTIONS, CODON_TABLE, CodonEntry } from "@/lib/biochem";

type LearnMode = "amino" | "codon";
type Phase = "learn" | "test";
type ResultState = "idle" | "correct" | "wrong";

type QuizQuestion = {
  id: string;
  prompt: string;
  acceptedAnswers: string[];
  answerText: string;
};

const normalize = (value: string) => value.trim().toLowerCase().replace(/[^a-z*]/g, "");

const pickRandomIndex = (length: number, previous: number) => {
  if (length <= 1) return 0;

  let next = Math.floor(Math.random() * length);
  while (next === previous) {
    next = Math.floor(Math.random() * length);
  }
  return next;
};

const shuffle = <T,>(items: T[]) => {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

const codonAnswers = (entry: CodonEntry) => {
  if (!entry.aminoAcid) {
    return ["*", "stop", "termination"];
  }

  return [
    normalize(entry.aminoAcid.name),
    normalize(entry.aminoAcid.oneLetter),
    normalize(entry.aminoAcid.threeLetter)
  ];
};

const toAminoQuestions = (letters: string[]): QuizQuestion[] =>
  AMINO_ACIDS.filter((item) => letters.includes(item.oneLetter)).map((item) => ({
    id: `aa-${item.oneLetter}`,
    prompt: item.oneLetter,
    acceptedAnswers: [normalize(item.name), normalize(item.threeLetter), normalize(item.oneLetter)],
    answerText: `${item.name} (${item.threeLetter}, ${item.oneLetter})`
  }));

const toCodonQuestions = (letters: string[]): QuizQuestion[] =>
  CODON_TABLE.filter((entry) => {
    if (!entry.aminoAcid) return false;
    return letters.includes(entry.aminoAcid.oneLetter);
  }).map((entry) => ({
    id: `codon-${entry.codon}`,
    prompt: entry.codon,
    acceptedAnswers: codonAnswers(entry),
    answerText: entry.aminoAcid
      ? `${entry.aminoAcid.name} (${entry.aminoAcid.threeLetter}, ${entry.aminoAcid.oneLetter})`
      : "Stop codon"
  }));

const allTestQuestions = (): QuizQuestion[] => {
  const aminoQuestions = toAminoQuestions(AMINO_ACIDS.map((item) => item.oneLetter));
  const codonQuestions = CODON_TABLE.map((entry) => ({
    id: `full-codon-${entry.codon}`,
    prompt: entry.codon,
    acceptedAnswers: codonAnswers(entry),
    answerText: entry.aminoAcid
      ? `${entry.aminoAcid.name} (${entry.aminoAcid.threeLetter}, ${entry.aminoAcid.oneLetter})`
      : "Stop codon"
  }));

  return [...aminoQuestions, ...codonQuestions];
};

const BASES = ["U", "C", "A", "G"] as const;

const codonMap = new Map(CODON_TABLE.map((entry) => [entry.codon, entry] as const));

const codonLabel = (entry: CodonEntry | undefined) => {
  if (!entry || !entry.aminoAcid) return "Stop (*)";
  return `${entry.aminoAcid.name} (${entry.aminoAcid.oneLetter})`;
};

export function BioStudyApp() {
  const [phase, setPhase] = useState<Phase>("learn");
  const [sectionIndex, setSectionIndex] = useState(0);
  const [learnMode, setLearnMode] = useState<LearnMode>("amino");

  const [learnQuestionIndex, setLearnQuestionIndex] = useState(0);
  const [learnInput, setLearnInput] = useState("");
  const [learnResult, setLearnResult] = useState<ResultState>("idle");
  const [learnScore, setLearnScore] = useState(0);
  const [learnAttempts, setLearnAttempts] = useState(0);

  const [testQuestions, setTestQuestions] = useState<QuizQuestion[]>([]);
  const [testQuestionIndex, setTestQuestionIndex] = useState(0);
  const [testInput, setTestInput] = useState("");
  const [testResult, setTestResult] = useState<ResultState>("idle");
  const [testScore, setTestScore] = useState(0);
  const [testAttempts, setTestAttempts] = useState(0);
  const [testFinished, setTestFinished] = useState(false);

  const activeSection = AMINO_SECTIONS[sectionIndex];

  const activeAminos = useMemo(
    () => AMINO_ACIDS.filter((item) => activeSection.letters.includes(item.oneLetter)),
    [activeSection.letters]
  );

  const activeCodons = useMemo(
    () =>
      CODON_TABLE.filter(
        (entry) => entry.aminoAcid && activeSection.letters.includes(entry.aminoAcid.oneLetter)
      ),
    [activeSection.letters]
  );

  const learnQuestions = useMemo(
    () =>
      learnMode === "amino" ? toAminoQuestions(activeSection.letters) : toCodonQuestions(activeSection.letters),
    [activeSection.letters, learnMode]
  );

  const learnQuestion = learnQuestions[learnQuestionIndex] ?? null;

  const learnAccuracy = useMemo(() => {
    if (learnAttempts === 0) return "0.0";
    return ((learnScore / learnAttempts) * 100).toFixed(1);
  }, [learnAttempts, learnScore]);

  const testAccuracy = useMemo(() => {
    if (testAttempts === 0) return "0.0";
    return ((testScore / testAttempts) * 100).toFixed(1);
  }, [testAttempts, testScore]);

  const resetLearning = (next: { section?: number; mode?: LearnMode }) => {
    if (typeof next.section === "number") {
      setSectionIndex(next.section);
    }
    if (next.mode) {
      setLearnMode(next.mode);
    }

    setLearnQuestionIndex(0);
    setLearnInput("");
    setLearnResult("idle");
    setLearnScore(0);
    setLearnAttempts(0);
  };

  const moveLearnNext = () => {
    setLearnQuestionIndex((prev) => pickRandomIndex(learnQuestions.length, prev));
  };

  const onLearningSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!learnQuestion) return;

    if (learnResult !== "idle") {
      setLearnInput("");
      setLearnResult("idle");
      moveLearnNext();
      return;
    }

    const answer = normalize(learnInput);
    if (!answer) return;

    const isCorrect = learnQuestion.acceptedAnswers.includes(answer);
    setLearnAttempts((prev) => prev + 1);

    if (isCorrect) {
      setLearnScore((prev) => prev + 1);
      setLearnResult("correct");
      return;
    }

    setLearnResult("wrong");
  };

  const startTest = () => {
    const randomized = shuffle(allTestQuestions());
    setPhase("test");
    setTestQuestions(randomized);
    setTestQuestionIndex(0);
    setTestInput("");
    setTestResult("idle");
    setTestScore(0);
    setTestAttempts(0);
    setTestFinished(false);
  };

  const returnToLearning = () => {
    setPhase("learn");
    setTestQuestions([]);
    setTestQuestionIndex(0);
    setTestInput("");
    setTestResult("idle");
    setTestFinished(false);
  };

  const currentTestQuestion = testQuestions[testQuestionIndex] ?? null;

  const onTestSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!currentTestQuestion || testFinished) return;

    if (testResult !== "idle") {
      if (testQuestionIndex + 1 >= testQuestions.length) {
        setTestFinished(true);
        setTestResult("idle");
        setTestInput("");
        return;
      }

      setTestQuestionIndex((prev) => prev + 1);
      setTestInput("");
      setTestResult("idle");
      return;
    }

    const answer = normalize(testInput);
    if (!answer) return;

    const isCorrect = currentTestQuestion.acceptedAnswers.includes(answer);
    setTestAttempts((prev) => prev + 1);

    if (isCorrect) {
      setTestScore((prev) => prev + 1);
      setTestResult("correct");
      return;
    }

    setTestResult("wrong");
  };

  return (
    <main className="bio-shell">
      <section className="bio-hero">
        <p className="bio-kicker">Biochemistry Flash Trainer</p>
        <h1>5セクション学習 → 総合テスト</h1>
        <p>
          まずはセクションごとに覚えて、最後に全範囲（20アミノ酸 + 64コドン）の一気テストを行います。
        </p>
      </section>

      <section className="bio-panel">
        <div className="bio-phase-switch">
          <button
            className={phase === "learn" ? "is-active" : ""}
            onClick={() => setPhase("learn")}
            type="button"
          >
            学習モード
          </button>
          <button className={phase === "test" ? "is-active" : ""} onClick={startTest} type="button">
            総合テスト開始
          </button>
        </div>

        {phase === "learn" && (
          <>
            <div className="bio-controls">
              {AMINO_SECTIONS.map((section, index) => (
                <button
                  className={sectionIndex === index ? "is-active" : ""}
                  key={section.id}
                  onClick={() => resetLearning({ section: index })}
                  type="button"
                >
                  {section.title}
                </button>
              ))}
            </div>

            <div className="bio-controls bio-controls-sub">
              <button
                className={learnMode === "amino" ? "is-active" : ""}
                onClick={() => resetLearning({ mode: "amino" })}
                type="button"
              >
                1-letter → 英語名
              </button>
              <button
                className={learnMode === "codon" ? "is-active" : ""}
                onClick={() => resetLearning({ mode: "codon" })}
                type="button"
              >
                コドン → アミノ酸
              </button>
            </div>

            <div className="bio-memory">
              <h2>{activeSection.title}: まず覚える</h2>
              <div className="bio-memory-grid">
                {activeAminos.map((amino) => {
                  const codons = activeCodons
                    .filter((entry) => entry.aminoAcid?.oneLetter === amino.oneLetter)
                    .map((entry) => entry.codon)
                    .join(", ");

                  return (
                    <article className="bio-memory-card" key={amino.oneLetter}>
                      <p className="bio-memory-main">
                        {amino.oneLetter} / {amino.threeLetter}
                      </p>
                      <p>{amino.name}</p>
                      <p className="bio-memory-ja">{amino.readingJa}</p>
                      <p className="bio-memory-sub">Codons: {codons}</p>
                    </article>
                  );
                })}
              </div>
            </div>

            {learnQuestion && (
              <>
                <div className="bio-stats">
                  <span>Score: {learnScore}</span>
                  <span>Attempts: {learnAttempts}</span>
                  <span>Accuracy: {learnAccuracy}%</span>
                </div>

                <form className="bio-quiz" onSubmit={onLearningSubmit}>
                  <p className="bio-label">
                    {learnMode === "amino" ? "Question (1-letter)" : "Question (RNA codon)"}
                  </p>
                  <div className="bio-question">{learnQuestion.prompt}</div>

                  <label className="bio-input-wrap">
                    <span>Answer</span>
                    <input
                      autoFocus
                      onChange={(event) => setLearnInput(event.target.value)}
                      placeholder={learnMode === "amino" ? "e.g. Lysine" : "e.g. Leucine / L / Leu"}
                      value={learnInput}
                    />
                  </label>

                  <button className="bio-submit" type="submit">
                    {learnResult === "idle" ? "Check" : "Next"}
                  </button>
                </form>

                {learnResult === "correct" && <p className="bio-feedback ok">Correct!</p>}
                {learnResult === "wrong" && (
                  <p className="bio-feedback ng">Not quite. Correct answer: {learnQuestion.answerText}</p>
                )}
              </>
            )}
          </>
        )}

        {phase === "test" && (
          <>
            {!testFinished && currentTestQuestion && (
              <>
                <div className="bio-stats">
                  <span>
                    Progress: {testQuestionIndex + 1} / {testQuestions.length}
                  </span>
                  <span>Score: {testScore}</span>
                  <span>Accuracy: {testAccuracy}%</span>
                </div>

                <form className="bio-quiz" onSubmit={onTestSubmit}>
                  <p className="bio-label">Question (1-letter or RNA codon)</p>
                  <div className="bio-question">{currentTestQuestion.prompt}</div>

                  <label className="bio-input-wrap">
                    <span>Answer</span>
                    <input
                      autoFocus
                      onChange={(event) => setTestInput(event.target.value)}
                      placeholder="e.g. Histidine / H / His / Stop"
                      value={testInput}
                    />
                  </label>

                  <button className="bio-submit" type="submit">
                    {testResult === "idle" ? "Check" : "Next"}
                  </button>
                </form>

                {testResult === "correct" && <p className="bio-feedback ok">Correct!</p>}
                {testResult === "wrong" && (
                  <p className="bio-feedback ng">
                    Not quite. Correct answer: {currentTestQuestion.answerText}
                  </p>
                )}
              </>
            )}

            {testFinished && (
              <div className="bio-test-finish">
                <h2>総合テスト完了</h2>
                <p>
                  Final score: {testScore} / {testQuestions.length} ({testAccuracy}%)
                </p>
                <div className="bio-controls">
                  <button className="is-active" onClick={startTest} type="button">
                    もう一度テスト
                  </button>
                  <button onClick={returnToLearning} type="button">
                    学習モードに戻る
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </section>

      <section className="bio-table-card">
        <h2>Reference: 4×4 Codon Grid (1st base × 2nd base)</h2>
        <div className="bio-codon-grid-wrap">
          <table className="bio-codon-grid">
            <thead>
              <tr>
                <th />
                {BASES.map((secondBase) => (
                  <th key={`col-${secondBase}`}>2nd: {secondBase}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {BASES.map((firstBase) => (
                <tr key={`row-${firstBase}`}>
                  <th>1st: {firstBase}</th>
                  {BASES.map((secondBase) => (
                    <td key={`${firstBase}${secondBase}`}>
                      <div className="bio-codon-cell">
                        {BASES.map((thirdBase) => {
                          const codon = `${firstBase}${secondBase}${thirdBase}`;
                          const entry = codonMap.get(codon);
                          return (
                            <p key={codon}>
                              <span>{codon}</span>
                              <span>{codonLabel(entry)}</span>
                            </p>
                          );
                        })}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
