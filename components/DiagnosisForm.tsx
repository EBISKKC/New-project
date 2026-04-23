"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { QUESTIONS, type QuestionId } from "@/lib/diagnosis";

export function DiagnosisForm() {
  const router = useRouter();
  const [answers, setAnswers] = useState<Partial<Record<QuestionId, string>>>({});
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const total = QUESTIONS.length;
  const current = QUESTIONS[step];
  const selected = answers[current.id];
  const isLast = step === total - 1;
  const allAnswered = useMemo(
    () => QUESTIONS.every((q) => answers[q.id]),
    [answers]
  );

  const progress = ((step + (selected ? 1 : 0)) / total) * 100;

  const select = (value: string) => {
    setAnswers((prev) => ({ ...prev, [current.id]: value }));
  };

  const next = () => {
    if (!selected) return;
    if (step < total - 1) setStep(step + 1);
  };

  const back = () => {
    if (step > 0) setStep(step - 1);
  };

  const submit = async () => {
    if (!allAnswered) return;
    setSubmitting(true);
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(answers)
    });

    if (!response.ok) {
      setSubmitting(false);
      return;
    }

    const data = (await response.json()) as { id: string };
    router.push(`/result/${data.id}`);
  };

  return (
    <div>
      <div className="stepper" aria-hidden>
        <span>
          {String(step + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>
        <div className="stepper-track">
          <div className="stepper-fill" style={{ width: `${progress}%` }} />
        </div>
        <span>{Math.round(progress)}%</span>
      </div>

      <section className="panel" key={current.id}>
        <div className="fade-up">
          <div className="q-head">
            <span>Question {step + 1}</span>
            <span>{current.id.toUpperCase()}</span>
          </div>
          <h2 className="q-title">{current.text}</h2>
          {current.hint ? <p className="q-hint">{current.hint}</p> : null}

          <div className="option-grid">
            {current.options.map((option) => (
              <label key={option.value} className="option">
                <input
                  type="radio"
                  name={current.id}
                  value={option.value}
                  checked={selected === option.value}
                  onChange={() => select(option.value)}
                />
                {option.emoji ? (
                  <span className="option-emoji" aria-hidden>
                    {option.emoji}
                  </span>
                ) : null}
                <span className="option-label">{option.label}</span>
                <span className="option-tick" aria-hidden />
              </label>
            ))}
          </div>

          <div className="nav">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={back}
              disabled={step === 0}
            >
              ← 戻る
            </button>
            <span className="counter">
              {isLast ? "ラストクエスチョン" : `${total - step - 1}問のこり`}
            </span>
            {isLast ? (
              <button
                type="button"
                className="btn btn-primary"
                onClick={submit}
                disabled={!allAnswered || submitting}
              >
                {submitting ? "生成中…" : "肩書きを生成"}
                <span className="btn-arrow">→</span>
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-primary"
                onClick={next}
                disabled={!selected}
              >
                次へ
                <span className="btn-arrow">→</span>
              </button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
