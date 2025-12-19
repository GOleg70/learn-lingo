import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../auth/useAuth";
import { AuthModal } from "../components/AuthModal/AuthModal";
import { logout } from "../services/auth/authApi";
import { Toast } from "../components/Toast/Toast";
import { ToastContext } from "../ui/toast/ToastContext";

const linkStyle = ({ isActive }: { isActive: boolean }) => ({
  textDecoration: "none",
  fontWeight: isActive ? 700 : 400,
});

export function RootLayout() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const { user, isAuthLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  function showToast(message: string) {
    setToastMessage(message);
  }

  useEffect(() => {
    const from = (location.state as { from?: string } | null)?.from;

    if (from === "/favorites" && !user && !toastMessage) {
      setTimeout(() => {
        showToast(
          "Favorites are available only for authorized users. Please log in."
        );
      }, 0);

      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location.state, location.pathname, navigate, user, toastMessage]);

  return (
    <ToastContext.Provider value={{ showToast }}>
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
                <span style={{ fontSize: 12, opacity: 0.75 }}>
                  {user.email}
                </span>
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
        <Toast
          isOpen={Boolean(toastMessage)}
          message={toastMessage ?? ""}
          onClose={() => setToastMessage(null)}
        />
      </div>
    </ToastContext.Provider>
  );
}
