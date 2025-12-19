import styles from "./TeachersFilters.module.css";

type Props = {
  language: string;
  level: string;
  price: string;

  languages: string[];
  levels: string[];
  prices: string[];

  onChangeLanguage: (v: string) => void;
  onChangeLevel: (v: string) => void;
  onChangePrice: (v: string) => void;

  onReset: () => void;
  isResetDisabled: boolean;
};

export function TeachersFilters({
  language,
  level,
  price,
  languages,
  levels,
  prices,
  onChangeLanguage,
  onChangeLevel,
  onChangePrice,
  onReset,
  isResetDisabled,
}: Props) {
  return (
    <div className={styles.bar}>
      <label className={styles.field}>
        <span className={styles.label}>Language</span>
        <select
          className={styles.select}
          value={language}
          onChange={(e) => onChangeLanguage(e.target.value)}
        >
          <option value="All">All</option>
          {languages.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
      </label>

      <label className={styles.field}>
        <span className={styles.label}>Level</span>
        <select
          className={styles.select}
          value={level}
          onChange={(e) => onChangeLevel(e.target.value)}
        >
          <option value="All">All</option>
          {levels.map((lv) => (
            <option key={lv} value={lv}>
              {lv}
            </option>
          ))}
        </select>
      </label>

      <label className={styles.field}>
        <span className={styles.label}>Price</span>
        <select
          className={styles.select}
          value={price}
          onChange={(e) => onChangePrice(e.target.value)}
        >
          <option value="All">All</option>
          {prices.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </label>

      <button
        type="button"
        className={styles.reset}
        onClick={onReset}
        disabled={isResetDisabled}
      >
        Reset
      </button>
    </div>
  );
}
