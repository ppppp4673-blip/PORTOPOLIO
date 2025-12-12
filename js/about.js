// js/about.js
document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".popup-card");
  const videos = document.querySelectorAll(".popup-media video");

  // 1) 스크롤 시 카드 페이드인 애니메이션
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target); // 한 번만 애니메이션
        }
      });
    },
    {
      threshold: 0.2,
    }
  );

  cards.forEach((card) => observer.observe(card));

  // 2) 일부 브라우저에서 자동재생 보조
  videos.forEach((video) => {
    // autoplay 속성 있어도 막히는 경우 보조용
    const tryPlay = () => {
      video.play().catch(() => {
        // 실패해도 에러는 무시 (모바일 정책 등)
      });
    };

    // 로드 후 한번 시도
    if (video.readyState >= 2) {
      tryPlay();
    } else {
      video.addEventListener("canplay", tryPlay, { once: true });
    }
  });
});
