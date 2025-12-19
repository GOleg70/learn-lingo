import {
  ref,
  get,
  child,
  query,
  orderByKey,
  limitToFirst,
  startAfter,
} from "firebase/database";

import { db } from "../firebase/firebase";
import type { Teacher } from "../../types/teacher";

export type TeachersPageResult = {
  items: Teacher[];
  nextCursor: string | null;
};

export async function fetchTeachersPage(
  pageSize: number,
  cursor: string | null
): Promise<TeachersPageResult> {
  const teachersRef = ref(db, "teachers");

  const q = cursor
    ? query(
        teachersRef,
        orderByKey(),
        startAfter(cursor),
        limitToFirst(pageSize)
      )
    : query(teachersRef, orderByKey(), limitToFirst(pageSize));

  const snap = await get(q);

  if (!snap.exists()) {
    return { items: [], nextCursor: null };
  }

  const raw = snap.val() as Record<string, Omit<Teacher, "id">>;
  const entries = Object.entries(raw);

  const items: Teacher[] = entries.map(([id, t]) => ({
    id,
    ...t,
  }));

  const nextCursor =
    entries.length === pageSize ? entries[entries.length - 1][0] : null;

  return { items, nextCursor };
}
export async function fetchTeachersByIds(ids: string[]): Promise<Teacher[]> {
  const rootRef = ref(db);

  const snaps = await Promise.all(
    ids.map((id) => get(child(rootRef, `teachers/${id}`)))
  );

  const teachers: Teacher[] = [];
  snaps.forEach((snap, idx) => {
    if (snap.exists()) {
      teachers.push({ id: ids[idx], ...(snap.val() as Omit<Teacher, "id">) });
    }
  });

  return teachers;
}
