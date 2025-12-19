import { useState } from "react";
import type { Teacher } from "../../types/teacher";
import styles from "./TeacherCard.module.css";
import { useAuth } from "../../auth/useAuth";
import { BookTrialModal } from "../BookTrialModal/BookTrialModal";
import { useToast } from "../../ui/toast/useToast";

type Props = {
  teacher: Teacher;
};

export function TeacherCard({ teacher }: Props) {
  const { user, isFavorite, toggleFavorite } = useAuth();
  const favorite = isFavorite(teacher.id);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isBookOpen, setIsBookOpen] = useState(false);
  const { showToast } = useToast();

  const {
    name,
    surname,
    languages,
    levels,
    rating,
    reviews,
    price_per_hour,
    lessons_done,
    avatar_url,
    lesson_info,
    conditions,
    experience,
  } = teacher;

  return (
    <article className={styles.card}>
      <div className={styles.topRow}>
        <img
          className={styles.avatar}
          src={avatar_url}
          alt={`${name} ${surname}`}
        />

        <div className={styles.main}>
          <p className={styles.label}>Languages</p>
          <h3 className={styles.name}>
            {name} {surname}
          </h3>

          <ul className={styles.stats}>
            <li>Lessons done: {lessons_done}</li>
            <li>Rating: {rating}</li>
            <li>Price / 1 hour: {price_per_hour}$</li>
          </ul>

          <div className={styles.info}>
            <p>
              <span className={styles.subLabel}>Speaks:</span>{" "}
              {languages.join(", ")}
            </p>
            <p>
              <span className={styles.subLabel}>Lesson Info:</span>{" "}
              {lesson_info}
            </p>
            <p>
              <span className={styles.subLabel}>Conditions:</span>{" "}
              {Array.isArray(conditions) ? conditions.join(" ") : ""}
            </p>

            {!isExpanded ? (
              <button
                type="button"
                className={styles.readMore}
                onClick={() => setIsExpanded(true)}
              >
                Read more
              </button>
            ) : (
              <>
                <p>
                  <span className={styles.subLabel}>Experience:</span>{" "}
                  {experience}
                </p>

                <div className={styles.reviews}>
                  <p className={styles.subLabel}>Reviews:</p>
                  <ul className={styles.reviewList}>
                    {Array.isArray(reviews) &&
                      reviews.map((r, idx) => (
                        <li key={idx} className={styles.reviewItem}>
                          <strong>{r.reviewer_name}</strong> —{" "}
                          {r.reviewer_rating}
                          <div>{r.comment}</div>
                        </li>
                      ))}
                  </ul>
                </div>

                <button
                  type="button"
                  className={styles.trialBtn}
                  onClick={() => setIsBookOpen(true)}
                >
                  Book trial lesson
                </button>
              </>
            )}
          </div>

          <ul className={styles.levels}>
            {levels.map((lvl) => (
              <li key={lvl} className={styles.levelChip}>
                {lvl}
              </li>
            ))}
          </ul>
        </div>

        {/* Серце додамо наступним комітом (Favorites) */}
        <button
          type="button"
          className={styles.heart}
          onClick={async () => {
            if (!user) {
              showToast("This feature is available only for authorized users.");
              return;
            }
            await toggleFavorite(teacher.id);
          }}
        >
          {favorite ? "❤️" : "♡"}
        </button>
      </div>
      <BookTrialModal
        isOpen={isBookOpen}
        onClose={() => setIsBookOpen(false)}
        teacherName={`${name} ${surname}`}
        avatarUrl={avatar_url}
      />
    </article>
  );
}
