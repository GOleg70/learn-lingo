import { createContext } from "react";
import type { User } from "firebase/auth";

export type AuthContextValue = {
  user: User | null;
  isAuthLoading: boolean;

  favorites: Set<string>;
  isFavoritesLoading: boolean;

  isFavorite: (teacherId: string) => boolean;
  toggleFavorite: (teacherId: string) => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined
);
