import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../auth/useAuth";
import { AuthModal } from "../components/AuthModal/AuthModal";
import { logout } from "../services/auth/authApi";
import { Toast } from "../components/Toast/Toast";
import { ToastContext } from "../ui/toast/ToastContext";
import styles from "./RootLayout.module.css";

export function RootLayout() {
  const [authMode, setAuthMode] = useState<"login" | "register" | null>(null);

  const { user, isAuthLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  function showToast(message: string) {
    setToastMessage(message);
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.logonav}>
            <div className={styles.logo}>
              <svg className={styles.iconUkr}>
                <use href="/icons/sprite.svg#ukr"></use>
              </svg>
              <span>Learn Lingo</span>
            </div>

            <nav className={styles.nav}>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `${styles.link} ${isActive ? styles.active : ""}`
                }
              >
                Home
              </NavLink>

              <NavLink
                to="/teachers"
                className={({ isActive }) =>
                  `${styles.link} ${isActive ? styles.active : ""}`
                }
              >
                Teachers
              </NavLink>
              <button
                type="button"
                className={`${styles.link} ${
                  location.pathname === "/favorites" ? styles.active : ""
                }`}
                onClick={() => {
                  if (!user) {
                    showToast(
                      "Favorites are available only for authorized users. Please log in."
                    );

                    return;
                  }

                  navigate("/favorites");
                }}
              >
                Favorites
              </button>
            </nav>
          </div>

          <div className={styles.actions}>
            {!isAuthLoading && !user && (
              <>
                <div className={styles.sectionbtnGhost}>
                  <svg className={styles.iconLogin}>
                    <use href="/icons/sprite.svg#icon-login"></use>
                  </svg>
                  <button
                    type="button"
                    className={styles.btnGhost}
                    onClick={() => setAuthMode("login")}
                  >
                    Log in
                  </button>
                </div>
                <button
                  type="button"
                  className={styles.btnPrimary}
                  onClick={() => setAuthMode("register")}
                >
                  Registration
                </button>
              </>
            )}

            {!isAuthLoading && user && (
              <>
                <span className={styles.email}>{user.email}</span>
                <button
                  type="button"
                  className={styles.btnGhost}
                  onClick={() => logout()}
                >
                  Log out
                </button>
              </>
            )}
          </div>
        </header>

        <main className={styles.main}>
          <Outlet />
        </main>

        <AuthModal
          isOpen={authMode !== null}
          mode={authMode ?? "login"}
          onClose={() => setAuthMode(null)}
          onModeChange={(m) => setAuthMode(m)}
        />

        <Toast
          isOpen={Boolean(toastMessage)}
          message={toastMessage ?? ""}
          onClose={() => setToastMessage(null)}
        />
      </div>
    </ToastContext.Provider>
  );
}
