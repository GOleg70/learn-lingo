import { Link } from "react-router-dom";
import styles from "./HomePage.module.css";

export function HomePage() {
  return (
    <section className={styles.page}>
      <div className={styles.heroGrid}>
        <div className={styles.heroCard}>
          <h1 className={styles.title}>
            Unlock your potential with the best{" "}
            <span className={styles.highlight}>language</span> tutors
          </h1>

          <p className={styles.subtitle}>
            Embark on an Exciting Language Journey with Expert Language Tutors.
            Elevate your language proficiency to new heights by connecting with
            highly qualified and experienced tutors.
          </p>

          <Link className={styles.cta} to="/teachers">
            Get started
          </Link>
        </div>

        <div className={styles.visual}>
          <img
            className={styles.visualImg}
            src="/img/block-min.jpg"
            alt="LearnLingo hero"
          />
        </div>
      </div>

      <div className={styles.stats}>
        <div className={styles.statsRow}>
          <div className={styles.stat}>
            <span className={styles.statNum}>32,000+</span>
            <span className={styles.statText}>Experienced tutors</span>
          </div>

          <div className={styles.stat}>
            <span className={styles.statNum}>300,000+</span>
            <span className={styles.statText}>5-star tutor reviews</span>
          </div>

          <div className={styles.stat}>
            <span className={styles.statNum}>120+</span>
            <span className={styles.statText}>Subjects taught</span>
          </div>

          <div className={styles.stat}>
            <span className={styles.statNum}>200+</span>
            <span className={styles.statText}>Tutor nationalities</span>
          </div>
        </div>
      </div>
    </section>
  );
}
