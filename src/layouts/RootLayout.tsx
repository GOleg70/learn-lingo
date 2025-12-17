import { NavLink, Outlet } from "react-router-dom";

const linkStyle = ({ isActive }: { isActive: boolean }) => ({
  textDecoration: "none",
  fontWeight: isActive ? 700 : 400,
});

export function RootLayout() {
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
      </header>

      <main style={{ paddingTop: 24 }}>
        <Outlet />
      </main>
    </div>
  );
}
