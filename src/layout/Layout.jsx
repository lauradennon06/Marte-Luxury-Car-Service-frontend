import { Outlet, useLocation } from "react-router";
import Footer from "./Footer";
import TopNav from "./TopNav";

export default function Layout() {
  const { pathname } = useLocation();
  return (
    <>
      {pathname === "/" && <TopNav />}
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
