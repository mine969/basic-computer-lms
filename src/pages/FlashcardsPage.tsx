import { useMemo, useState } from "react";
import type { useProgress } from "@/hooks/useProgress";
import type { Course } from "@/types";
import { findModule } from "@/utils/localizedCourse";
import { linkTo } from "@/utils/routes";

type ProgressApi = ReturnType<typeof useProgress>;

export function FlashcardsPage({
  course,
  moduleId,
  progressApi
}: {
  course: Course;
  moduleId?: string;
  progressApi: ProgressApi;
}) {
  const module = moduleId ? findModule(course, moduleId) : course.modules[0];
  const cards = useMemo(
    () =>
      module.lessons.flatMap((lesson) =>
        lesson.flashcards.map((card, index) => ({
          ...card,
          id: `${lesson.id}-card-${index + 1}`,
          lessonTitle: lesson.title
        }))
      ),
    [module]
  );
  const [index, setIndex] = useState(0);
  const [back, setBack] = useState(false);
  const card = cards[index];

  if (!card) {
    return (
      <div className="card">
        <h1 className="page-title">Flashcards</h1>
        <p className="page-lead">No flashcards were parsed for this module.</p>
      </div>
    );
  }

  return (
    <div className="space-y-7">
      <section className="space-y-3">
        <h1 className="page-title">Flashcards</h1>
        <p className="page-lead">
          {module.id} - {module.title}. Card {index + 1} of {cards.length}.
        </p>
      </section>
      <div className="flex flex-wrap gap-3">
        {course.modules.map((item) => (
          <a
            className={item.id === module.id ? "primary-button" : "secondary-button"}
            href={linkTo.flashcards(item.id)}
            key={item.id}
          >
            {item.id}
          </a>
        ))}
      </div>
      <button
        className="card block min-h-80 w-full text-left"
        onClick={() => setBack((value) => !value)}
      >
        <p className="text-xl font-black text-ocean dark:text-teal-200">
          {back ? "Back" : "Front"} - {card.lessonTitle}
        </p>
        <p className="mt-8 text-4xl font-black leading-tight">
          {back ? card.back : card.front}
        </p>
      </button>
      <div className="flex flex-wrap gap-3">
        <button
          className="secondary-button"
          disabled={index === 0}
          onClick={() => {
            setIndex(index - 1);
            setBack(false);
          }}
        >
          Previous
        </button>
        <button className="primary-button" onClick={() => setBack((value) => !value)}>
          Flip
        </button>
        <button
          className="secondary-button"
          onClick={() => progressApi.rememberFlashcard(card.id)}
        >
          Mark remembered
        </button>
        <button
          className="primary-button"
          disabled={index === cards.length - 1}
          onClick={() => {
            setIndex(index + 1);
            setBack(false);
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
}
