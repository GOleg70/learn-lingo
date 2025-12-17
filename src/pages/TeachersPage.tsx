import { useEffect, useState } from "react";
import type { Teacher } from "../types/teacher";
import { fetchTeachersPage } from "../services/teachers/teachersApi";

export function TeachersPage() {
  const [items, setItems] = useState<Teacher[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadFirstPage() {
      setIsLoading(true);
      setError(null);

      try {
        const res = await fetchTeachersPage(4, null);
        if (isMounted) {
          setItems(res.items);
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

  return (
    <section>
      <h1>Teachers</h1>

      {isLoading && <p>Loading...</p>}
      {error && <p style={{ color: "crimson" }}>{error}</p>}

      <ul style={{ display: "grid", gap: 12, padding: 0, listStyle: "none" }}>
        {items.map((t) => (
          <li
            key={t.id}
            style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12 }}
          >
            <strong>
              {t.name} {t.surname}
            </strong>
            <div>Price: {t.price_per_hour} / hour</div>
            <div>Rating: {t.rating}</div>
            <div>
              Languages:{" "}
              {Array.isArray(t.languages) ? t.languages.join(", ") : ""}
            </div>
            <div>
              Levels: {Array.isArray(t.levels) ? t.levels.join(", ") : ""}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
