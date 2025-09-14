import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // change to "auto" if you want instant jump
    });
  }, [pathname]);

  return null; // This component renders nothing
}
