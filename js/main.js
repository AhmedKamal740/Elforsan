window.addEventListener("load", () => {
  document.body.style.visibility = "visible";
});
/**************  marquee **************/
const container = document.getElementById("tickerContainer");
const track = document.getElementById("tickerTrack");
// نكرر المحتوى مرتين علشان الحركة تبقى سلسة بلا فراغات
track.innerHTML += track.innerHTML;
let position = 0;
let baseSpeed = 0.5; // السرعة الأساسية
let currentSpeed = baseSpeed;
let targetSpeed = baseSpeed;
const smoothing = 0.02; // كل ما قل الرقم، التباطؤ أهدى
function animate() {
  position += currentSpeed;
  if (position >= track.scrollWidth / 2) {
    position = 0;
  }
  track.style.transform = `translateX(${position}px)`;
  currentSpeed += (targetSpeed - currentSpeed) * smoothing;
  requestAnimationFrame(animate);
}
animate();
container.addEventListener("mouseenter", () => {
  targetSpeed = 0;
});

container.addEventListener("mouseleave", () => {
  targetSpeed = baseSpeed;
});
// Marquee الثانية
const tickerContainer2 = document.getElementById("tickerContainer2");
const tickerTrack2 = document.getElementById("tickerTrack2");

if (tickerTrack2) {
  const clone2 = tickerTrack2.innerHTML;
  tickerTrack2.innerHTML += clone2;

  let scrollPosition2 = 0;
  let baseSpeed2 = 0.5;
  let currentSpeed2 = baseSpeed2;
  let targetSpeed2 = baseSpeed2;
  const smoothing2 = 0.02;

  function animateMarquee2() {
    scrollPosition2 += currentSpeed2;
    const trackWidth2 = tickerTrack2.scrollWidth / 2;

    if (scrollPosition2 >= trackWidth2) {
      scrollPosition2 = 0;
    }

    tickerTrack2.style.transform = `translateX(${scrollPosition2}px)`;
    currentSpeed2 += (targetSpeed2 - currentSpeed2) * smoothing2;
    requestAnimationFrame(animateMarquee2);
  }

  animateMarquee2();

  tickerContainer2.addEventListener("mouseenter", () => {
    targetSpeed2 = 0;
  });

  tickerContainer2.addEventListener("mouseleave", () => {
    targetSpeed2 = baseSpeed2;
  });
}
/************** سلايدر الشهادات **************/
const carousel = document.getElementById("carouselExampleIndicators");
const buttons = document.querySelectorAll(".carousel-numbers .btn");

// أول مرة نخلي الرقم الأول نشط
buttons[0].classList.add("active");

carousel.addEventListener("slide.bs.carousel", (e) => {
  const index = e.to;
  buttons.forEach((btn, i) => {
    btn.classList.toggle("active", i === index);
  });
});
/************** Counter **************/
document.addEventListener("DOMContentLoaded", () => {
  const counters = document.querySelectorAll(".num");
  const section = document.querySelector(".count-section");
  let started = false;

  if (!section || counters.length === 0) return; // حماية

  function startCounting() {
    counters.forEach((counter) => {
      const target = +counter.getAttribute("data-target");
      const increment = target / 300;
      let count = 0;
      const suffix = counter.textContent.trim().replace(/[0-9.,]/g, "");

      const updateCount = () => {
        count += increment;
        if (count < target) {
          counter.textContent = Math.floor(count).toLocaleString() + suffix;
          requestAnimationFrame(updateCount);
        } else {
          counter.textContent = target.toLocaleString() + suffix;
        }
      };
      updateCount();
    });
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !started) {
          setTimeout(() => {
            startCounting();
            started = true;
          }, 200); // ⏱ تأخير بسيط بعد حركة AOS
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  observer.observe(section);
});
// ******************************//
/**************  Smooth Scroll - بين الصفحات **************/
(function () {
  // دالة الـ smooth scroll
  function smoothScroll(target, duration) {
    const start = window.pageYOffset;
    const end = target.getBoundingClientRect().top + start - 140;
    const distance = end - start;
    let startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const ease = progress * (2 - progress);
      window.scrollTo(0, start + distance * ease);
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  // 1. معالجة الروابط في نفس الصفحة
  document.addEventListener("click", function (e) {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;

    const href = link.getAttribute("href");
    if (href === "#") return;

    const target = document.querySelector(href);
    if (!target) return;

    e.preventDefault();
    smoothScroll(target, 800);
    history.pushState(null, null, href);
  });

  // 2. معالجة الـ hash عند تحميل صفحة جديدة
  window.addEventListener("load", function () {
    // لو الرابط فيه # (مثلاً: services.html#techniques)
    if (window.location.hash) {
      const target = document.querySelector(window.location.hash);

      if (target) {
        // استنى شوية لحد ما الصفحة تحمل
        setTimeout(function () {
          // امسح الـ scroll الافتراضي
          window.scrollTo(0, 0);
          // بعدين اعمل smooth scroll
          setTimeout(function () {
            smoothScroll(target, 800);
          }, 100);
        }, 50);
      }
    }
  });
})();
