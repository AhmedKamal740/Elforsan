window.addEventListener("load", () => {
  document.body.style.visibility = "visible";
});
AOS.init({
  duration: 1200, // مدة الحركة
  once: true, // الحركة تظهر مرة واحدة فقط
});
// ***//
if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}
window.scrollTo(0, 0);
// يخلي الصفحة تبدأ من فوق بعد الريفريش// سلايدر الشهادات
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
