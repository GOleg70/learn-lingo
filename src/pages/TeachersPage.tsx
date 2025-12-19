import { useEffect, useMemo, useState } from "react";
import type { Teacher } from "../types/teacher";
import { fetchTeachersPage } from "../services/teachers/teachersApi";
import { TeacherCard } from "../components/TeacherCard/TeacherCard";
import { TeachersFilters } from "../components/TeachersFilters/TeachersFilters";

function uniqueSorted(values: string[]) {
  return Array.from(new Set(values)).sort((a, b) => a.localeCompare(b));
}

export function TeachersPage() {
  const [items, setItems] = useState<Teacher[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  // Filters
  const [language, setLanguage] = useState<string>("All");
  const [level, setLevel] = useState<string>("All");
  const [price, setPrice] = useState<string>("All");

  const isFilterActive =
    language !== "All" || level !== "All" || price !== "All";

  useEffect(() => {
    let isMounted = true;

    async function loadFirstPage() {
      setIsLoading(true);
      setError(null);

      try {
        const res = await fetchTeachersPage(4, null);
        if (isMounted) {
          setItems(res.items);
          setCursor(res.nextCursor);
          setHasMore(res.nextCursor !== null);
        }
      } catch (e) {
        if (isMounted) {
          setError(e instanceof Error ? e.message : "Failed to load teachers");
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadFirstPage();

    return () => {
      isMounted = false;
    };
  }, []);

  async function handleLoadMore() {
    if (!hasMore || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetchTeachersPage(4, cursor);
      setItems((prev) => [...prev, ...res.items]);
      setCursor(res.nextCursor);
      setHasMore(res.nextCursor !== null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load more teachers");
    } finally {
      setIsLoading(false);
    }
  }

  // Options for filters (build from loaded items)
  const languagesOptions = useMemo(() => {
    const all = items.flatMap((t) => t.languages);
    return uniqueSorted(all);
  }, [items]);

  const levelsOptions = useMemo(() => {
    const all = items.flatMap((t) => t.levels);
    return uniqueSorted(all);
  }, [items]);

  const pricesOptions = useMemo(() => {
    const all = items.map((t) => t.price_per_hour);
    const unique = Array.from(new Set(all)).sort((a, b) => a - b);
    return unique.map((n) => `${n}$`);
  }, [items]);

  const filteredItems = useMemo(() => {
    return items.filter((t) => {
      const okLanguage =
        language === "All" ? true : t.languages.includes(language);

      const okLevel = level === "All" ? true : t.levels.includes(level);

      const okPrice =
        price === "All"
          ? true
          : t.price_per_hour === Number(price.replace("$", ""));

      return okLanguage && okLevel && okPrice;
    });
  }, [items, language, level, price]);

  function resetFilters() {
    setLanguage("All");
    setLevel("All");
    setPrice("All");
  }

  // ✅ Коли показувати "Load more" при активних фільтрах:
  // - якщо ще є що завантажувати
  // - і (або немає фільтрів) або (фільтри є, але збігів поки мало/0)
  const shouldShowLoadMore = useMemo(() => {
    if (!hasMore) return false;
    if (!isFilterActive) return true;

    // якщо фільтри активні:
    // - немає збігів або збігів мало — є сенс довантажити
    return filteredItems.length < 4;
  }, [hasMore, isFilterActive, filteredItems.length]);

  return (
    <section>
      <h1>Teachers</h1>

      <TeachersFilters
        language={language}
        level={level}
        price={price}
        languages={languagesOptions}
        levels={levelsOptions}
        prices={pricesOptions}
        onChangeLanguage={setLanguage}
        onChangeLevel={setLevel}
        onChangePrice={setPrice}
        onReset={resetFilters}
        isResetDisabled={!isFilterActive}
      />

      {isLoading && items.length === 0 && <p>Loading...</p>}
      {error && <p style={{ color: "crimson" }}>{error}</p>}

      {!isLoading && !error && filteredItems.length === 0 && (
        <p>
          {isFilterActive
            ? "No teachers found yet. Try Load more."
            : "No teachers found."}
        </p>
      )}

      <ul style={{ display: "grid", gap: 12, padding: 0, listStyle: "none" }}>
        {filteredItems.map((t) => (
          <li key={t.id}>
            <TeacherCard teacher={t} />
          </li>
        ))}
      </ul>

      {shouldShowLoadMore && (
        <div style={{ marginTop: 16 }}>
          <button type="button" onClick={handleLoadMore} disabled={isLoading}>
            {isLoading ? "Loading..." : "Load more"}
          </button>
        </div>
      )}
    </section>
  );
}
