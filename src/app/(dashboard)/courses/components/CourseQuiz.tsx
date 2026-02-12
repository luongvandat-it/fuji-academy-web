"use client";

import { cn } from "@/lib";
import { useCallback, useMemo, useState } from "react";
import { getQuizById } from "../mockData";
import type { Lesson } from "../types";
import styles from "../courses.module.scss";

interface CourseQuizProps {
  lesson: Lesson;
}

export function CourseQuiz({ lesson }: CourseQuizProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const quiz = lesson.quizId ? getQuizById(lesson.quizId) : null;

  const handleSelect = useCallback((questionId: string, optionId: string) => {
    setAnswers((prev) => {
      if (prev[questionId] === optionId) return prev;
      return { ...prev, [questionId]: optionId };
    });
  }, []);

  const handleSubmit = useCallback(() => {
    setSubmitted(true);
  }, []);

  const score = useMemo(() => {
    if (!quiz) return { correct: 0, total: 0, percent: 0 };
    let correct = 0;
    for (const q of quiz.questions) {
      const selectedId = answers[q.id];
      const option = q.options.find((o) => o.id === selectedId);
      if (option?.isCorrect) correct++;
    }
    const total = quiz.questions.length;
    const percent = total > 0 ? Math.round((correct / total) * 100) : 0;
    return { correct, total, percent };
  }, [quiz, answers]);

  const { correct, total, percent } = score;

  return (
    <div className={styles.detailQuizPage}>
      <div className={styles.detailQuizCard}>
        <h3 className={styles.detailQuizTitle}>{quiz?.title ?? lesson.title}</h3>
        <p className={styles.detailQuizDesc}>
          {lesson.description || "Hoàn thành bài kiểm tra để nắm vững kiến thức."}
        </p>
      </div>

      {quiz && quiz.questions.length > 0 ? (
        <>
          <div className={styles.quizQuestionsWrap}>
            {quiz.questions.map((q) => {
              const correctOption = q.options.find((o) => o.isCorrect);
              const selectedId = answers[q.id];
              const selectedOption = q.options.find((o) => o.id === selectedId);
              const isCorrect = selectedOption?.isCorrect ?? false;

              return (
                <div key={q.id} className={styles.quizQuestion}>
                  <p className={styles.quizQuestionText}>{q.text}</p>
                  <div
                    className={cn(
                      styles.quizOptionList,
                      submitted && styles.quizOptionListSubmitted
                    )}
                  >
                    {q.options.map((opt) => {
                      const selected = answers[q.id] === opt.id;
                      const showCorrect = submitted && opt.isCorrect;
                      const showWrong = submitted && selected && !opt.isCorrect;

                      return (
                        <label
                          key={opt.id}
                          className={cn(
                            styles.quizOption,
                            !submitted && selected && styles.quizOptionSelected,
                            submitted && showCorrect && styles.quizOptionCorrect,
                            submitted && showWrong && styles.quizOptionWrong
                          )}
                        >
                          <input
                            type="radio"
                            name={q.id}
                            value={opt.id}
                            checked={selected}
                            onChange={() => handleSelect(q.id, opt.id)}
                            className={styles.quizOptionInput}
                            disabled={submitted}
                          />
                          <span className="flex-1">{opt.label}</span>
                          {submitted && opt.isCorrect && (
                            <span className={styles.quizOptionCorrectLabel}>
                              Đáp án đúng
                            </span>
                          )}
                          {submitted && selected && !opt.isCorrect && (
                            <span className={styles.quizOptionWrongLabel}>
                              Bạn chọn (sai)
                            </span>
                          )}
                        </label>
                      );
                    })}
                  </div>
                  {submitted && (
                    <p
                      className={`${styles.quizQuestionFeedback} ${isCorrect ? styles.quizQuestionFeedbackCorrect : styles.quizQuestionFeedbackWrong}`}
                    >
                      {isCorrect
                        ? "Bạn chọn đúng."
                        : `Bạn chọn sai. Đáp án đúng là: ${correctOption?.label ?? "—"}`}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
          {!submitted ? (
            <button
              type="button"
              onClick={handleSubmit}
              className={styles.quizSubmit}
            >
              Nộp bài
            </button>
          ) : (
            <div className={styles.quizResult}>
              Bạn đúng {correct}/{total} câu ({percent}%).
            </div>
          )}
        </>
      ) : (
        <p className={styles.detailQuizEmpty}>Chưa có câu hỏi cho bài kiểm tra này.</p>
      )}
    </div>
  );
}
