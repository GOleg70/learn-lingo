import { ref, set, remove, onValue, type Unsubscribe } from "firebase/database";
import { db } from "../firebase/firebase";

export function subscribeToFavorites(
  uid: string,
  onChange: (ids: Set<string>) => void
): Unsubscribe {
  const favoritesRef = ref(db, `users/${uid}/favorites`);

  return onValue(favoritesRef, (snap) => {
    const val = snap.val() as Record<string, true> | null;

    const ids = new Set<string>();
    if (val) {
      Object.keys(val).forEach((id) => ids.add(id));
    }

    onChange(ids);
  });
}

export async function addFavorite(uid: string, teacherId: string) {
  await set(ref(db, `users/${uid}/favorites/${teacherId}`), true);
}

export async function removeFavorite(uid: string, teacherId: string) {
  await remove(ref(db, `users/${uid}/favorites/${teacherId}`));
}
