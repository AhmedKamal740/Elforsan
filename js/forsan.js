// ainmation
AOS.init({
  duration: 1200, // مدة الحركة
  once: true, // الحركة تظهر مرة واحدة فقط
});
// main-slider
const bgLayers = document.querySelectorAll(".background-layer");
let currentBgSlide = 0;

function updateBgSlides() {
  bgLayers.forEach((layer) => layer.classList.remove("active"));
  bgLayers[currentBgSlide].classList.add("active");
}

// أول تحديث عند تحميل الصفحة
updateBgSlides();

// تغيير الخلفية كل 5 ثواني مثلاً
setInterval(() => {
  currentBgSlide = (currentBgSlide + 1) % bgLayers.length;
  updateBgSlides();
}, 5000);

document.addEventListener("DOMContentLoaded", function () {
  const swiper = new Swiper(".mySwiper", {
    effect: "coverflow",
    grabCursor: true,
    centeredSlides: false,
    slidesPerView: 1.5,
    spaceBetween: -50,
    speed: 900,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    coverflowEffect: {
      rotate: 0,
      stretch: -50,
      depth: 200,
      modifier: 1,
      slideShadows: false,
    },
  });

  const paginationDots = document.querySelectorAll(".pagination-dot");
  const mainSliderWrapper = document.getElementById("sliderWrapper");

  function updateMainPagination() {
    const activeIndex = swiper.realIndex % 3;
    paginationDots.forEach((dot, index) => {
      if (index === activeIndex) {
        dot.classList.add("active");
      } else {
        dot.classList.remove("active");
      }
    });
  }

  swiper.on("slideChange", updateMainPagination);

  paginationDots.forEach((dot) => {
    dot.addEventListener("click", (e) => {
      const index = parseInt(e.target.dataset.index);
      swiper.slideTo(index);
    });
  });

  mainSliderWrapper.addEventListener("mouseenter", () => {
    swiper.autoplay.stop();
  });

  mainSliderWrapper.addEventListener("mouseleave", () => {
    swiper.autoplay.start();
  });
});

//************************************************************** */
// Configuration
const GAP = 16;
let currentIndex = 0;
let cardsPerSlide = 3;
let TOTAL_CARDS = 0;
let totalPages = 1;
let isTransitioning = false;
let originalCards = [];

// Get elements
const sliderTrack = document.getElementById("sliderTrack");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const pagination = document.getElementById("pagination");

// Read original cards from HTML
function readOriginalCards() {
  const cards = Array.from(sliderTrack.querySelectorAll(".slide-card"));
  originalCards = cards.map((card) => card.cloneNode(true));
  TOTAL_CARDS = originalCards.length;
}

// Generate cards with clones for infinite loop
function generateCards() {
  sliderTrack.innerHTML = "";

  // Add clones at the start (last cardsPerSlide cards)
  for (
    let i = originalCards.length - cardsPerSlide;
    i < originalCards.length;
    i++
  ) {
    sliderTrack.appendChild(originalCards[i].cloneNode(true));
  }

  // Add original cards
  originalCards.forEach((card) => {
    sliderTrack.appendChild(card.cloneNode(true));
  });

  // Add clones at the end (first cardsPerSlide cards)
  for (let i = 0; i < cardsPerSlide; i++) {
    sliderTrack.appendChild(originalCards[i].cloneNode(true));
  }

  currentIndex = cardsPerSlide;
}

// Calculate cards per slide based on screen width
function calculateCardsPerSlide() {
  const width = window.innerWidth;
  if (width >= 992) {
    cardsPerSlide = 3;
  } else if (width >= 576) {
    cardsPerSlide = 2;
  } else {
    cardsPerSlide = 1;
  }
  totalPages = TOTAL_CARDS;
}

// Update card widths
function updateCardWidths() {
  const container = document.querySelector(".slider-container");
  const containerWidth = container.offsetWidth;
  const totalGaps = (cardsPerSlide - 1) * GAP;
  const cardWidth = (containerWidth - totalGaps) / cardsPerSlide;

  const cards = document.querySelectorAll(".slide-card");
  cards.forEach((card) => {
    card.style.width = `${cardWidth}px`;
  });
}

// Move slider
function moveSlider(withTransition = true) {
  const container = document.querySelector(".slider-container");
  const containerWidth = container.offsetWidth;
  const totalGaps = (cardsPerSlide - 1) * GAP;
  const cardWidth = (containerWidth - totalGaps) / cardsPerSlide;
  const offset = currentIndex * (cardWidth + GAP);

  if (!withTransition) {
    sliderTrack.classList.add("no-transition");
  } else {
    sliderTrack.classList.remove("no-transition");
  }

  sliderTrack.style.transform = `translateX(-${offset}px)`;

  updatePagination();
}

// Handle infinite loop logic
function handleInfiniteLoop() {
  const totalCards = sliderTrack.children.length;

  if (currentIndex >= totalCards - cardsPerSlide) {
    setTimeout(() => {
      currentIndex = cardsPerSlide;
      moveSlider(false);
    }, 500);
  }

  if (currentIndex < cardsPerSlide) {
    setTimeout(() => {
      currentIndex = totalCards - cardsPerSlide - cardsPerSlide;
      moveSlider(false);
    }, 500);
  }
}

// Get current page number (1-based, for display)
function getCurrentPage() {
  const actualIndex =
    (((currentIndex - cardsPerSlide) % TOTAL_CARDS) + TOTAL_CARDS) %
    TOTAL_CARDS;
  return actualIndex + 1;
}

// Generate pagination
function updatePagination() {
  pagination.innerHTML = "";
  const currentPage = getCurrentPage();

  function createPageItem(pageNum, isActive = false, isDots = false) {
    const item = document.createElement("div");
    item.className = `page-item ${isActive ? "active" : ""} ${
      isDots ? "dots" : ""
    }`;
    item.textContent = isDots ? "…" : pageNum;

    if (!isDots) {
      item.addEventListener("click", () => {
        goToPage(pageNum);
      });
    }

    pagination.appendChild(item);
  }

  if (TOTAL_CARDS <= 5) {
    for (let i = 1; i <= TOTAL_CARDS; i++) {
      createPageItem(i, i === currentPage);
    }
  } else {
    for (let i = 1; i <= 3; i++) {
      createPageItem(i, i === currentPage);
    }

    if (currentPage > 3 && currentPage < TOTAL_CARDS) {
      createPageItem(null, false, true);
      createPageItem(currentPage, true);
    }

    if (currentPage < TOTAL_CARDS - 1 || currentPage <= 3) {
      createPageItem(null, false, true);
    }

    createPageItem(TOTAL_CARDS, currentPage === TOTAL_CARDS);
  }
}

// Go to specific page
function goToPage(pageNum) {
  if (isTransitioning) return;

  const targetIndex = cardsPerSlide + (pageNum - 1);
  currentIndex = targetIndex;

  isTransitioning = true;
  moveSlider(true);

  setTimeout(() => {
    isTransitioning = false;
  }, 500);
}

// Navigation handlers
prevBtn.addEventListener("click", () => {
  if (isTransitioning) return;

  currentIndex++;
  isTransitioning = true;
  moveSlider(true);

  setTimeout(() => {
    handleInfiniteLoop();
    isTransitioning = false;
  }, 500);
});

nextBtn.addEventListener("click", () => {
  if (isTransitioning) return;

  currentIndex--;
  isTransitioning = true;
  moveSlider(true);

  setTimeout(() => {
    handleInfiniteLoop();
    isTransitioning = false;
  }, 500);
});

// Resize handler
let resizeTimeout;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    const oldCardsPerSlide = cardsPerSlide;
    calculateCardsPerSlide();

    if (oldCardsPerSlide !== cardsPerSlide) {
      const currentPage = getCurrentPage();
      generateCards();
      updateCardWidths();
      currentIndex = cardsPerSlide + (currentPage - 1);
      moveSlider(false);
    } else {
      updateCardWidths();
      moveSlider(false);
    }
  }, 250);
});

// Auto play settings
const AUTO_PLAY_INTERVAL = 3000;
let autoPlayTimer = null;

function startAutoPlay() {
  stopAutoPlay();
  autoPlayTimer = setInterval(() => {
    if (!isTransitioning) {
      currentIndex++;
      isTransitioning = true;
      moveSlider(true);
      setTimeout(() => {
        handleInfiniteLoop();
        isTransitioning = false;
      }, 500);
    }
  }, AUTO_PLAY_INTERVAL);
}

function stopAutoPlay() {
  if (autoPlayTimer) {
    clearInterval(autoPlayTimer);
    autoPlayTimer = null;
  }
}

const sliderWrapper = document.querySelector(".slider-wrapper");
sliderWrapper.addEventListener("mouseenter", stopAutoPlay);
sliderWrapper.addEventListener("mouseleave", startAutoPlay);

// Initialize
function init() {
  readOriginalCards();
  calculateCardsPerSlide();
  generateCards();
  updateCardWidths();
  moveSlider(false);
  startAutoPlay();
}

init();
