"use client";
export function useSmoothScroll() {
  function scrollTo(targetId: string, offset = 80) {
    const el = document.getElementById(targetId);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: "smooth" });
  }

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return { scrollTo, scrollToTop };
}
