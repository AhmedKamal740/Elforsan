window.addEventListener("load", () => {
  document.body.style.visibility = "visible";
});
AOS.init({
  duration: 1200, // مدة الحركة
  once: true, // الحركة تظهر مرة واحدة فقط
});
// ******** services
const services = document.querySelectorAll(".service");
services[0].classList.add("active");
services.forEach((service) => {
  service.addEventListener("click", () => {
    // تشيل الكلاس من الكل
    services.forEach((s) => s.classList.remove("active"));

    // تضيف الكلاس للي اتضغط عليه
    service.classList.add("active");
  });
});

// إعداد المتغيرات
const carousel = document.getElementById("imageCarousel");
const bsCarousel = new bootstrap.Carousel(carousel, {
  interval: false, // التشغيل التلقائي كل 3 ثواني
  ride: false,
});
const totalSlides = document.querySelectorAll(".carousel-one").length;
let currentSlide = 0;

// دالة لتوليد أرقام الصفحات بشكل ذكي
function generatePagination(current, total) {
  const pages = [];
  const delta = 1; // عدد الأرقام على الجانبين

  // دائمًا نضيف الرقم الأخير
  pages.push(total);

  // حساب النطاق المرئي
  let rangeStart = Math.max(2, current - delta);
  let rangeEnd = Math.min(total - 1, current + delta);

  // إضافة نقاط النهاية إذا لزم الأمر
  if (rangeEnd < total - 1) {
    pages.push("...");
  }

  // إضافة الأرقام في النطاق (بالعكس)
  for (let i = rangeEnd; i >= rangeStart; i--) {
    pages.push(i);
  }

  // إضافة نقاط البداية إذا لزم الأمر
  if (rangeStart > 2) {
    pages.push("...");
  }

  // دائمًا نضيف الرقم الأول
  pages.push(1);

  return pages;
}

// دالة لتحديث شريط الـ pagination
function updatePagination() {
  const paginationContainer = document.getElementById("customPagination");
  paginationContainer.innerHTML = "";

  // زر التالي (على اليمين في RTL)
  const nextBtn = document.createElement("button");
  nextBtn.className = "pagination-btn";
  nextBtn.innerHTML = `<img src="Images/icons/right.svg" alt="Next" />`; // سهم لليسار ←
  nextBtn.disabled = currentSlide === totalSlides - 1;
  nextBtn.onclick = () => {
    bsCarousel.next();
  };
  paginationContainer.appendChild(nextBtn);

  // الأرقام
  const pages = generatePagination(currentSlide + 1, totalSlides);
  pages.forEach((page) => {
    if (page === "...") {
      const ellipsis = document.createElement("span");
      ellipsis.className = "page-ellipsis";
      ellipsis.textContent = "....";
      paginationContainer.appendChild(ellipsis);
    } else {
      const pageBtn = document.createElement("span");
      pageBtn.className = "page-number";
      if (page === currentSlide + 1) {
        pageBtn.classList.add("active");
      }
      pageBtn.textContent = page;
      pageBtn.onclick = () => {
        bsCarousel.to(page - 1);
      };
      paginationContainer.appendChild(pageBtn);
    }
  });

  // زر السابق (على اليسار في RTL)
  const prevBtn = document.createElement("button");
  prevBtn.className = "pagination-btn";
  prevBtn.innerHTML = `<img src="Images/icons/left.svg" alt="Prev" />`; // سهم لليمين →
  prevBtn.disabled = currentSlide === 0;
  prevBtn.onclick = () => {
    bsCarousel.prev();
  };
  paginationContainer.appendChild(prevBtn);
}

// الاستماع لتغيير السلايد
carousel.addEventListener("slid.bs.carousel", (event) => {
  currentSlide = event.to;
  updatePagination();
});

// التحديث الأولي
updatePagination();

// سلايدر الشهادات
const carouselTwo = document.getElementById("carouselExampleIndicators");
const buttons = document.querySelectorAll(".carousel-numbers .btn");

// أول مرة نخلي الرقم الأول نشط
buttons[0].classList.add("active");

carouselTwo.addEventListener("slide.bs.carousel", (e) => {
  const index = e.to;
  buttons.forEach((btn, i) => {
    btn.classList.toggle("active", i === index);
  });
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
