import React, { useCallback, useEffect, useMemo, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import type { User } from "firebase/auth";
import { auth } from "../services/firebase/firebase";
import { AuthContext } from "./AuthContext";
import {
  addFavorite,
  removeFavorite,
  subscribeToFavorites,
} from "../services/favorites/favoritesApi";

type Props = { children: React.ReactNode };

export function AuthProvider({ children }: Props) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [isFavoritesLoading, setIsFavoritesLoading] = useState(false);

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setIsAuthLoading(false);

      if (!nextUser) {
        setFavorites(new Set());
        setIsFavoritesLoading(false);
      } else {
        setIsFavoritesLoading(true);
      }
    });

    return () => unsubAuth();
  }, []);

  useEffect(() => {
    if (!user) return;

    const unsubFav = subscribeToFavorites(user.uid, (ids) => {
      setFavorites(ids);
      setIsFavoritesLoading(false);
    });

    return () => unsubFav();
  }, [user]);

  const isFavorite = useCallback(
    (teacherId: string) => favorites.has(teacherId),
    [favorites]
  );

  const toggleFavorite = useCallback(
    async (teacherId: string) => {
      if (!user) return;

      if (favorites.has(teacherId)) {
        await removeFavorite(user.uid, teacherId);
      } else {
        await addFavorite(user.uid, teacherId);
      }
    },
    [user, favorites]
  );

  const value = useMemo(
    () => ({
      user,
      isAuthLoading,
      favorites,
      isFavoritesLoading,
      isFavorite,
      toggleFavorite,
    }),
    [
      user,
      isAuthLoading,
      favorites,
      isFavoritesLoading,
      isFavorite,
      toggleFavorite,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
