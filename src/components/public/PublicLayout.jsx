import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import PublicNavbar from "./PublicNavbar";

export default function PublicLayout() {
  const { pathname } = useLocation();
  const isHome = pathname === "/";

  return (
    <div className={`public-shell ${isHome ? "public-shell--home" : ""}`}>
      <PublicNavbar />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
