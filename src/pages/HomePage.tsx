import { Link } from "react-router-dom";
// import { useEffect, useMemo } from "react";
// import { useAuth } from "../auth/useAuth";

export function HomePage() {
  // const location = useLocation();
  // const navigate = useNavigate();
  // const { user } = useAuth();

  // const from = (location.state as { from?: string } | null)?.from;

  // const shouldShowAuthNotice = useMemo(() => {
  //   return from === "/favorites" && !user;
  // }, [from, user]);

  // useEffect(() => {
  //   if (shouldShowAuthNotice) {
  //     // очищаємо state, щоб повідомлення не “залипало”
  //     navigate(location.pathname, { replace: true, state: null });
  //   }
  // }, [shouldShowAuthNotice, navigate, location.pathname]);

  return (
    <section>
      <h1>Home</h1>
      <p>Це заглушка. Тут буде перелік переваг компанії.</p>

      {/* {shouldShowAuthNotice && (
        <p
          style={{ padding: 12, border: "1px solid #e5e7eb", borderRadius: 12 }}
        >
          Favorites are available only for authorized users. Please log in.
        </p>
      )} */}

      <Link to="/teachers">Start learning</Link>
    </section>
  );
}
