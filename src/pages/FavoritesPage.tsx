import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../auth/useAuth";
import { TeacherCard } from "../components/TeacherCard/TeacherCard";
import { fetchTeachersByIds } from "../services/teachers/teachersApi";
import type { Teacher } from "../types/teacher";

export default function FavoritesPage() {
  const { user, favorites, isFavoritesLoading } = useAuth();
  const [items, setItems] = useState<Teacher[]>([]);

  const favoriteIds = useMemo(() => Array.from(favorites), [favorites]);

  useEffect(() => {
    if (!user || favoriteIds.length === 0) return;

    fetchTeachersByIds(favoriteIds).then(setItems);
  }, [user, favoriteIds]);

  if (isFavoritesLoading) {
    return <div>Loading...</div>;
  }

  if (favoriteIds.length === 0) {
    return <h2>No favorite teachers yet</h2>;
  }

  if (items.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Favorites</h1>

      <ul style={{ display: "grid", gap: 12, padding: 0, listStyle: "none" }}>
        {items.map((t) => (
          <li key={t.id}>
            <TeacherCard teacher={t} />
          </li>
        ))}
      </ul>
    </div>
  );
}
