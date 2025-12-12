// ==================== GSAP 플러그인 ====================
gsap.registerPlugin(ScrollTrigger);

// ==================== Lenis ====================
const lenis = new Lenis({
  duration: 0.8,
  easing: (t) => t, // 선형 (빠른 반응)
  smooth: true,
  smoothTouch: true, // 모바일 터치 스크롤 부드럽게
});

function raf(t) {
  lenis.raf(t);
  ScrollTrigger.update();
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// ==================== Header show/hide ====================
const site_header = document.getElementById("site_header");
let lastY = 0;
lenis.on("scroll", ({ scroll }) => {
  const y = scroll;
  if (y > lastY + 4 && y > 120)
    site_header.style.transform = "translateY(-100%)";
  else if (y < lastY - 4) site_header.style.transform = "translateY(0)";
  lastY = y;
});

// ==================== Horizontal gallery helper ====================
const total_width = () => {
  const wrap = document.querySelector(".horizontal_section");
  const track = document.querySelector(".track");
  return track.scrollWidth - wrap.clientWidth;
};

let resizeTotal = total_width();
document.addEventListener("load", () => {
  resizeTotal = total_width();
});

// ==================== Navigation Active ====================
const ham = document.querySelector(".menu_toggle");
const mpanel = document.querySelector(".mobile_panel");
ham.addEventListener("click", () => {
  document.querySelector(".mobile_panel").classList.toggle("block");
});

const navLinks = document.querySelectorAll(".primary_nav a, .mobile_menu a");

function set_active(link) {
  // 1️⃣ .primary_nav 내의 링크들만 초기화
  const primaryLinks = document.querySelectorAll(".primary_nav a");
  primaryLinks.forEach((a) => a.classList.remove("is_active"));

  // 2️⃣ 클릭된 링크와 동일한 href를 가진 .primary_nav 링크만 활성화
  const href = link.getAttribute("href");
  const match = document.querySelector(`.primary_nav a[href="${href}"]`);
  if (match) match.classList.add("is_active");
}

// 섹션 맵 정의
const sub_map = ["#hero", "#textArea", "#showcase", "#gallery", "#vid"];

sub_map.forEach((id) => {
  const section = document.querySelector(id);
  const linkEl = document.querySelectorAll(
    `.primary_nav a[href="${id}"], .mobile_menu a[href="${id}"]`
  );
  if (!section || !linkEl.length) return;

  if (id === "#showcase") {
    // Showcase → pin_scene ScrollTrigger와 동일
    ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "+=1800",
      onEnter: () => linkEl.forEach((a) => set_active(a)),
      onEnterBack: () => linkEl.forEach((a) => set_active(a)),
    });
  } else if (id === "#gallery") {
    // Gallery → horizontal_section ScrollTrigger와 동일
    ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: () => "+=" + (resizeTotal + window.innerWidth),
      onEnter: () => linkEl.forEach((a) => set_active(a)),
      onEnterBack: () => linkEl.forEach((a) => set_active(a)),
    });
  } else {
    // 일반 섹션
    ScrollTrigger.create({
      trigger: section,
      start: "top top+=100",
      end: "bottom top+=100",
      onEnter: () => linkEl.forEach((a) => set_active(a)),
      onEnterBack: () => linkEl.forEach((a) => set_active(a)),
    });
  }
});

// ==================== 네비 클릭 Lenis.scrollTo ====================
navLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const targetId = link.getAttribute("href");
    const targetEl = document.querySelector(targetId);
    mpanel.classList.remove("block");
    // 메뉴 닫히는 transition 끝난 후 스크롤 실행

    if (targetEl) {
      lenis.scrollTo(targetEl, { offset: -80 });
    }
    set_active(link);
  });
});

// ==================== Hero intro ====================
gsap
  .timeline({ defaults: { duration: 0.8, ease: "power2.out" } })
  .to(".hero_title", { y: 0, opacity: 1 })
  .to(".hero_sub", { y: 0, opacity: 1 }, "<0.12")
  .to(".hero_cta", { y: 0, opacity: 1 }, "<0.12");

let tl = gsap.timeline({
  scrollTrigger: {
    trigger: ".txt_area",
    start: "top 10%",
    end: "bottom bottom",
    scrub: true,
  },
});

tl.to(".txt_area strong.tit", {
  backgroundSize: "100%",
  duration: 1,
  ease: "none",
})
  .to(".txt_area", {
    backgroundSize: "100% 100%",
    opacity: 1,
    duration: 1,
    ease: "none",
  })
  .to(
    ".txt_area i.tit",
    { backgroundSize: "100%", duration: 1, ease: "none" },
    "+=0.6"
  )
  .to(
    ".txt_area b.tit",
    { backgroundSize: "100%", duration: 1, ease: "none" },
    "+=1.2"
  )
  .to(
    ".txt_area em.tit",
    { backgroundSize: "100%", duration: 1, ease: "none" },
    "+=1.8"
  );

// ==================== Showcase stack ====================
const pin_bg = document.getElementById("pin_bg");
const photos = gsap.utils.toArray(".photo");

const pinTl = gsap.timeline({
  scrollTrigger: {
    trigger: ".pin_scene",
    start: "top top",
    end: "+=1800",
    pin: true,
    scrub: true,
    anticipatePin: 1,
    toggleActions: "play none none reset",
  },
});

pinTl.to(
  pin_bg,
  { filter: "blur(12px)", scale: 1.06, duration: 1, ease: "none" },
  0
);
photos.forEach((el, i) => {
  pinTl.add(() => {
    el.style.zIndex = String(100 + i);
    el.classList.add("glitch");
    gsap.delayedCall(0.4, () => el.classList.remove("glitch"));
  }, i * 0.22);
  pinTl.fromTo(
    el,
    {
      opacity: 0,
      y: 1080,
      scale: 0.4,
      filter: "blur(6px)",
      rotate: i % 2 ? 4 : -4,
    },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      rotate: i % 2 ? 5 : -5,
      duration: 0.85,
      ease: "power3.out",
    },
    i * 0.22
  );
});
pinTl.to(".float_wrap", { yPercent: -6, duration: 0.8, ease: "none" }, ">0.1");

// ==================== Horizontal gallery ====================
gsap.to(".track", {
  x: () => -total_width(),
  ease: "none",
  scrollTrigger: {
    trigger: ".horizontal_section",
    start: "top top",
    end: () => "+=" + (total_width() + 500 + window.innerWidth),
    scrub: 1,
    pin: true,
    anticipatePin: 1,
    toggleActions: "play none none reset",
    onUpdate: () => updateCoverflow(),
  },
});

// ======================== Coverflow Effect ==========================
const cards = gsap.utils.toArray(".h_item");

function updateCoverflow() {
  const viewportCenter = window.innerWidth / 2;

  cards.forEach((card) => {
    const rect = card.getBoundingClientRect();
    const cardCenter = rect.left + rect.width / 2;

    // 중심에서 떨어진 거리 (-1 ~ 1)
    const dist = (cardCenter - viewportCenter) / viewportCenter;

    // Coverflow 효과 매핑
    const rotateY = dist * -35; // 좌우 회전
    const scale = 1 - Math.abs(dist) * 0.4; // 축소
    const opacity = 1 - Math.abs(dist) * 0.6;
    const z = -Math.abs(dist) * 280; // 깊이감

    gsap.set(card, {
      rotateY,
      scale,
      opacity,
      z,
      transformOrigin: "center",
    });
  });
}
gsap.timeline({
  scrollTrigger: {
    trigger: ".vid",
    start: "top 40%",
    end: "bottom center",
    scrub: true,
    // markers: true,
    toggleClass: { targets: ".vid", className: "on" },
  },
});

// 2. .vid_box 핀 처리 및 내부 video 스케일 애니메이션
gsap
  .timeline({
    scrollTrigger: {
      trigger: ".vid_box", // 부모 섹션을 트리거로 사용
      start: "top 10%",
      end: "top 10%+=2500", // 1500px 스크롤 동안 애니메이션 진행 (필요에 따라 조정)
      scrub: 1,
      pin: ".vid_box", // .vid_box를 핀 처리
      pinSpacing: true,
      pinReparent: true, // 부모 transform 문제 해결
      // markers: true,
    },
  })
  .fromTo(
    ".vid_box video",
    { scale: 0.45, opacity: 0.45, transformOrigin: "top center" },
    { scale: 1, opacity: 1, ease: "power2.out", duration: 2 }
  );
window.addEventListener("resize", () => ScrollTrigger.refresh());

// ==================== Refresh ====================
window.addEventListener("load", () => {
  ScrollTrigger.refresh();
  setTimeout(() => ScrollTrigger.refresh(), 500); // ✅ Lenis 초기화 후 0.5초 뒤 다시
});
const cursor = document.querySelector(".custom-cursor");

document.addEventListener("mousemove", (e) => {
  cursor.style.top = `${e.clientY}px`;
  cursor.style.left = `${e.clientX}px`;
});

document.addEventListener("mousedown", () => {
  cursor.classList.add("click");
});

document.addEventListener("mouseup", () => {
  cursor.classList.remove("click");
});
