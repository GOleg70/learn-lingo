import { useEffect, useState } from "react";
import type { Teacher } from "../types/teacher";
import { fetchTeachersPage } from "../services/teachers/teachersApi";
import { TeacherCard } from "../components/TeacherCard/TeacherCard";

export function TeachersPage() {
  const [items, setItems] = useState<Teacher[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

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
        if (isMounted) {
          setIsLoading(false);
        }
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

  return (
    <section>
      <h1>Teachers</h1>

      {isLoading && items.length === 0 && <p>Loading...</p>}
      {error && <p style={{ color: "crimson" }}>{error}</p>}

      {!isLoading && !error && items.length === 0 && <p>No teachers found.</p>}

      <ul style={{ display: "grid", gap: 12, padding: 0, listStyle: "none" }}>
        {items.map((t) => (
          <li key={t.id}>
            <TeacherCard teacher={t} />
          </li>
        ))}
      </ul>

      {hasMore && (
        <div style={{ marginTop: 16 }}>
          <button type="button" onClick={handleLoadMore} disabled={isLoading}>
            {isLoading ? "Loading..." : "Load more"}
          </button>
        </div>
      )}
    </section>
  );
}
