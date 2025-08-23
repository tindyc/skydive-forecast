// src/components/ScrollToTop.tsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    console.log("🔄 ScrollToTop triggered for:", pathname);

    // Try window first
    window.scrollTo({ top: 0, behavior: "auto" });

    // Try body
    document.body.scrollTop = 0; 
    document.documentElement.scrollTop = 0;

    // Try app wrapper
    const app = document.querySelector(".app") as HTMLElement;
    if (app) app.scrollTop = 0;

    // Try forecast wrapper
    const fw = document.querySelector(".forecast-wrapper") as HTMLElement;
    if (fw) fw.scrollTop = 0;

  }, [pathname]);

  return null;
}
