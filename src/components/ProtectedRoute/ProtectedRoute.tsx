import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../auth/useAuth";

type Props = {
  children: React.ReactNode;
};

export function ProtectedRoute({ children }: Props) {
  const { user, isAuthLoading } = useAuth();
  const location = useLocation();

  if (isAuthLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    const state = location.state as { from?: string } | null;
    const backTo = state?.from ?? "/";

    return (
      <Navigate
        to={backTo}
        replace
        state={{
          toast:
            "Favorites are available only for authorized users. Please log in.",
        }}
      />
    );
  }

  return <>{children}</>;
}
