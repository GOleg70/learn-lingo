import { NavLink, Outlet } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../auth/useAuth";
import { AuthModal } from "../components/AuthModal/AuthModal";
import { logout } from "../services/auth/authApi";

const linkStyle = ({ isActive }: { isActive: boolean }) => ({
  textDecoration: "none",
  fontWeight: isActive ? 700 : 400,
});

export function RootLayout() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const { user, isAuthLoading } = useAuth();

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: 24 }}>
      <header style={{ display: "flex", gap: 16, alignItems: "center" }}>
        <strong>Learn Lingo</strong>

        <nav style={{ display: "flex", gap: 12 }}>
          <NavLink to="/" style={linkStyle}>
            Home
          </NavLink>
          <NavLink to="/teachers" style={linkStyle}>
            Teachers
          </NavLink>
          <NavLink to="/favorites" style={linkStyle}>
            Favorites
          </NavLink>
        </nav>

        <div
          style={{
            marginLeft: "auto",
            display: "flex",
            gap: 10,
            alignItems: "center",
          }}
        >
          {!isAuthLoading && !user && (
            <button type="button" onClick={() => setIsAuthOpen(true)}>
              Log in
            </button>
          )}

          {!isAuthLoading && user && (
            <>
              <span style={{ fontSize: 12, opacity: 0.75 }}>{user.email}</span>
              <button type="button" onClick={() => logout()}>
                Log out
              </button>
            </>
          )}
        </div>
      </header>

      <main style={{ paddingTop: 24 }}>
        <Outlet />
      </main>

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </div>
  );
}
