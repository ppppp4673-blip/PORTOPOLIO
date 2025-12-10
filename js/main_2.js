// GSAP에서 ScrollTrigger와 ScrollToPlugin을 사용하기 위해 등록
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

$(function () {
  //스크롤에 따라 경로 애니메이션 진행
  function calcDashOffset(scrollY, element, length) {
    const ratio = (scrollY - element.offsetTop) / element.offsetHeight; // 스크롤 위치와 요소 높이 비율 계산
    const value = length - length * ratio; // 대시 오프셋 값을 계산
    return Math.max(0, Math.min(value, length)); // 범위 내에서 반환
  }

  //스크롤 이벤트에 따른 경로 애니메이션 처리
  function scrollHandler(svgCon, path, pathLenght) {
    const scrollY = window.scrollY + window.innerHeight * 0.8;
    //화면 높이 고려한 스크롤 위치 계산
    path.style.strokeDashoffset = calcDashOffset(scrollY, svgCon, pathLenght);
  }

  window.addEventListener("scroll", () => {
    //svg 경로 애니메이션 설정

    const svgCon = document.querySelector("#con2");
    const path = document.querySelector(".path");
    const pathLenght = path.getTotalLength(); //경로의 총 길이 계산
    path.style.strokeDasharray = pathLenght; //경로를 점선처럼 보이게 설정
    path.style.strokeDashoffset = pathLenght; //경로를 숨기기 위해 대시 오프셋을 길이로 설정
    scrollHandler(svgCon, path, pathLenght);
    const svgCon2 = document.querySelector("#con6");
    const path2 = document.querySelector(".path2");
    const pathLenght2 = path2.getTotalLength(); //경로의 총 길이 계산
    path2.style.strokeDasharray = pathLenght2; //경로를 점선처럼 보이게 설정
    path2.style.strokeDashoffset = pathLenght2; //경로를 숨기기 위해 대시 오프셋을 길이로 설정
    scrollHandler(svgCon2, path2, pathLenght2);
  }); //스크롤 이벤트 리스너 추가

  //세로 스크롤에 따라 배경색과 글자색 clip-path 변화 애니메이션
  //gsap 타임라인을 만든다. 스크롤 애니메이션 순서표
  gsap
    .timeline({
      scrollTrigger: {
        //스크롤을 감지할 대상 :
        trigger: "#con3",
        start: "0% 80%", //#con3의 맨위(0%)가 화면의 80% 지점에 닿을때 애니시작
        end: "100% 100%", //#con3의 맨아래(100%)가 화면의 맨아래(100%)에 닿을 때 애니끝
        scrub: 1,
        //스크롤 움직임에 따라 애니메이션도 같이 움직이게 함
      },
    })
    .to(
      "#con3",
      {
        backgroundColor: "#fff",
        color: "#000",
        duration: 5,
        ease: "none", //애니메이션이 부드럽게 변하지 않고 스크롤에 딱맞게 움직이게 설정
      },
      0
    )
    .fromTo(
      "#con3 .videoWrap video",
      { "clip-path": "inset(60% 60% 60% 60% round 30%)" },
      {
        "clip-path": "inset(0% 0% 0% 0% round 0%)",
        duration: 5,
        ease: "none",
      },
      0
    );

  //가로 스크롤 섹션 애니메이션 설정
  const horizontal = document.querySelector(".horizontal");
  const sections = gsap.utils.toArray(".horizontal>section");
  let ani = [];
  const scrollTween = gsap.to(sections, {
    xPercent: -100 * (sections.length - 1), //전체 섹션 수만큼 왼쪽으로 밀기
    ease: "none", //부드럽게 넘기지 않고 스크롤에 따라 바로 반응
    scrollTrigger: {
      trigger: horizontal,
      start: "top top", //스크롤이 맨 위에 닿을때 시작
      end: () => "+=" + (horizontal.offsetWidth - innerWidth), //스크롤 끝나는 위치 계산
      pin: true, //해당 부분에서 화면을 고정해서 보여줌
      markers: true, //디버그용 마커 보여주기
      scrub: 1, //스크롤에 따라 실시간으로 움직임
      anticipatePin: 1, // 핀 고정 시 살짝 미리 준비해서 부드럽게
      invalidateOnRefresh: true, // 새로고침하면 위치 다시 계산해줌
    },
  });

  // 각 섹션에 애니메이션 적용
  const animations = [
    { target: ".iw1", properties: { y: -200 }, duration: 2, ease: "elastic" },
    {
      target: ".iw2",
      properties: { rotation: 720 },
      duration: 2,
      ease: "elastic",
    },
    {
      target: ".iw3",
      properties: { scale: 0.3 },
      duration: 2,
      ease: "elastic",
    },
    {
      target: ".iw4",
      properties: { x: -100, rotation: 50 },
      duration: 2.5,
      ease: "power1.inOut",
    },
    { target: ".iw5", properties: { scale: 2.3 }, duration: 1, ease: "none" },
  ];

  //애니메이션 설정
  animations.forEach((anim, index) => {
    ani[index] = gsap.to(anim.target, {
      ...anim.properties,
      duration: anim.duration,
      ease: anim.ease,
      scrollTrigger: {
        trigger: anim.target,
        containerAnimation: scrollTween, // 가로 스크롤 애니메이션과 동기화
        start: "left center",
        toggleActions: "play none reverse none", //한번 재생, 뒤로갈때만 역재생
        id: anim.target, //디버깅용 id
      },
    });
  });

  //각 애니메이션을 트리거하는 함수
  function triggerAnimation(index) {
    //ani[index]가 존재하는지 체크하고 애니메이션 실행
    if (ani[index]) {
      ani[index].restart(); //해당 섹션의 애니메이션 재시작
    }
  }

  //페이지네이션 버튼 클릭시 해당 섹션으로 이동하는 설정
  const pageButtons = document.querySelectorAll(".page-btn");

  //페이지네이션 버튼 활성화 상태를 업데이트하는 함수
  function updatePagination(activeIndex) {
    pageButtons.forEach((button, index) => {
      button.classList.toggle("active", index == activeIndex);
    });
  }

  pageButtons.forEach((button, index) => {
    button.addEventListener("click", () => {
      const targetPosition = -100 * index; //각 버튼에 해당하는 위치 계산

      //가로 스크롤 애니메이션을 직접 설정
      gsap.to(sections, {
        xPercent: targetPosition, //해당 섹션으로 이동
        duration: 1, //이동시간
        ease: "power2.inOut", // 부드러운 애니메이션
        onComplete: () => {
          triggerAnimation(index); //각 섹션에 대한 애니메이션 실행
          updatePagination(index); //각 섹션에대한 애니메이션 실행
        },
      });
    });
  });

  //각 섹션에 대한 스크롤 트리거 설정
  sections.forEach((section, index) => {
    ScrollTrigger.create({
      trigger: section,
      start: "left center",
      onEnter: () => {
        updatePagination(index);
        triggerAnimation(index);
      },
      onEnterBack: () => {
        updatePagination(index);
        triggerAnimation(index);
      },
      containerAnimation: scrollTween, // 가로 스크롤 애니메이션과 동기화
    });
  });

  //article 요소들에 부드럽게 나타나는 애니메이션 추가

  let con5Article = gsap.utils.toArray(".articles article");
  con5Article.forEach((el, i) => {
    gsap
      .timeline({
        scrollTrigger: {
          trigger: el,
          start: "top bottom", //화면 아래쪽에서 시작
          end: "top 20%", //화면 위쪽으로 거의다 올라왔을때 끝
          scrub: 0.5, //스크롤에 따라 부드럽게 반응
        },
      })
      .fromTo(
        el,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1 },
        0 //타임라인 시작 위치
      );
  });

  // 텍스트 애니메이션 박스 내 스크롤 설정 (simplyScroll)
  $(".txtAniBox .txtAni1").simplyScroll({
    speed: 4,
    pauseOnHover: true,
    pauseOnTouch: false,
    direction: "forwards",
  });
  $(".txtAniBox .txtAni2").simplyScroll({
    speed: 3,
    pauseOnHover: true,
    pauseOnTouch: false,
    direction: "backwards",
  });
  $(".txtAniBox .txtAni3").simplyScroll({
    speed: 4,
    pauseOnHover: true,
    pauseOnTouch: false,
    direction: "forwards",
  });

  // Intersection Observer for scroll animations
  const observerOptions = {
    threshold: 0.3,
    rootMargin: "0px 0px -100px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
      }
    });
  }, observerOptions);

  // Observe all content wrappers
  document.querySelectorAll(".content-wrapper").forEach((wrapper) => {
    observer.observe(wrapper);
  });

  // Smooth scroll behavior
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });

  // Parallax effect on scroll
  window.addEventListener("scroll", () => {
    const scrolled = window.pageYOffset;

    document.querySelectorAll(".feature-image img").forEach((img) => {
      const speed = 0.5;
      img.style.transform = `translateY(${scrolled * speed * 0.1}px)`;
    });
  });

  // Showcase → pin_scene ScrollTrigger와 동일
  ScrollTrigger.create({
    trigger: section,
    start: "top top",
    end: "+=1800",
    onEnter: () => linkEl.forEach((a) => set_active(a)),
    onEnterBack: () => linkEl.forEach((a) => set_active(a)),
  });
});
