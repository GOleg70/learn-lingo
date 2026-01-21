import { useState } from "react";
import type { Teacher } from "../../types/teacher";
import styles from "./TeacherCard.module.css";
import { useAuth } from "../../auth/useAuth";
import { BookTrialModal } from "../BookTrialModal/BookTrialModal";
import { useToast } from "../../ui/toast/useToast";
import { Icon } from "../Icon/Icon";

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
        <div className={styles.avatarWrap}>
          <img
            className={styles.avatar}
            src={avatar_url}
            alt={`${name} ${surname}`}
          />
          <span className={styles.onlineDot} aria-hidden="true" />
        </div>

        <div className={styles.content}>
          <div className={styles.header}>
            <div>
              <p className={styles.label}>Languages</p>
              <h3 className={styles.name}>
                {name} {surname}
              </h3>
            </div>

            <ul className={styles.stats} aria-label="Teacher stats">
              <li className={styles.statItem}>
                <Icon name="icon-book" className={styles.statIcon} size={16} />
                <span className={styles.statText}>Lessons online</span>
              </li>

              <li className={styles.statItem}>
                <span className={styles.statText}>Lessons done: </span>
                <span className={styles.statValue}>{lessons_done}</span>
              </li>

              <li className={styles.statItem}>
                <Icon
                  name="icon-star"
                  className={styles.statIconStar}
                  size={16}
                />
                <span className={styles.statText}>Rating: </span>
                <span className={styles.statValue}>{rating}</span>
              </li>

              <li className={styles.statItem}>
                <span className={styles.statText}>Price / 1 hour: </span>
                <span className={styles.price}>{price_per_hour}$</span>
              </li>
            </ul>
            <button
              type="button"
              className={`${styles.heart} ${
                favorite ? styles.heartActive : ""
              }`}
              onClick={async () => {
                if (!user) {
                  showToast(
                    "This feature is available only for authorized users."
                  );
                  return;
                }
                await toggleFavorite(teacher.id);
              }}
              aria-label={
                favorite ? "Remove from favorites" : "Add to favorites"
              }
            >
              <Icon
                name={favorite ? "icon-heart-filled" : "icon-heart"}
                className={styles.heartIcon}
                size={26}
              />
            </button>
          </div>

          <div className={styles.details}>
            <p className={styles.row}>
              <span className={styles.subLabel}>Speaks:</span>{" "}
              <span className={styles.bold}>{languages.join(", ")}</span>
            </p>

            <p className={styles.row}>
              <span className={styles.subLabel}>Lesson Info:</span>{" "}
              <span className={styles.bold}>{lesson_info}</span>
            </p>

            <p className={styles.row}>
              <span className={styles.subLabel}>Conditions:</span>{" "}
              <span className={styles.bold}>
                {Array.isArray(conditions) ? conditions.join(" ") : ""}
              </span>
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
                <p className={styles.experience}>{experience}</p>

                <div className={styles.reviews}>
                  <ul className={styles.reviewList}>
                    {Array.isArray(reviews) &&
                      reviews.map((r, idx) => (
                        <li key={idx} className={styles.reviewItem}>
                          <div className={styles.reviewHead}>
                            <div className={styles.reviewUser}>
                              <div
                                className={styles.reviewAvatar}
                                aria-hidden="true"
                              >
                                {r.reviewer_name?.slice(0, 1)}
                              </div>
                              <span className={styles.reviewer}>
                                {r.reviewer_name}
                              </span>
                            </div>

                            <span className={styles.reviewRating}>
                              <Icon
                                name="icon-star"
                                className={styles.reviewStar}
                                size={16}
                              />
                              <span>{r.reviewer_rating.toFixed(1)}</span>
                            </span>
                          </div>

                          <p className={styles.reviewComment}>{r.comment}</p>
                        </li>
                      ))}
                  </ul>
                </div>

                <button
                  type="button"
                  className={styles.readLess}
                  onClick={() => setIsExpanded(false)}
                >
                  Read less
                </button>
              </>
            )}

            <ul className={styles.levels}>
              {levels.map((lvl, idx) => (
                <li
                  key={lvl}
                  className={`${styles.levelChip} ${
                    idx === 0 ? styles.levelChipActive : ""
                  }`}
                >
                  #{lvl}
                </li>
              ))}
            </ul>

            {isExpanded && (
              <button
                type="button"
                className={styles.trialBtn}
                onClick={() => setIsBookOpen(true)}
              >
                Book trial lesson
              </button>
            )}
          </div>
        </div>

        {/* <button
          type="button"
          className={`${styles.heart} ${favorite ? styles.heartActive : ""}`}
          onClick={async () => {
            if (!user) {
              showToast("This feature is available only for authorized users.");
              return;
            }
            await toggleFavorite(teacher.id);
          }}
          aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Icon
            name={favorite ? "icon-heart-filled" : "icon-heart"}
            className={styles.heartIcon}
            size={26}
          />
        </button> */}
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
