import { Link } from "react-router-dom";

export function HomePage() {
  return (
    <section>
      <h1>Home</h1>
      <p>Це заглушка. Тут буде перелік переваг компанії.</p>

      <Link to="/teachers">Start learning</Link>
    </section>
  );
}
