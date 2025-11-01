// Presentation State Management
const presentationState = {
  currentSlide: 1,
  totalSlides: 16
};

// DOM Elements
const slides = document.querySelectorAll('.slide');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const currentSlideSpan = document.getElementById('currentSlide');
const totalSlidesSpan = document.getElementById('totalSlides');
const helpBtn = document.getElementById('helpBtn');
const helpPanel = document.getElementById('helpPanel');
const closeHelpBtn = document.getElementById('closeHelp');

// Initialize
function init() {
  totalSlidesSpan.textContent = presentationState.totalSlides;
  showSlide(presentationState.currentSlide);
  initChart();
  addKeyboardNavigation();
}

// Show specific slide
function showSlide(slideNumber) {
  // Hide all slides
  slides.forEach(slide => slide.classList.remove('active'));
  
  // Show current slide
  const currentSlide = document.querySelector(`[data-slide="${slideNumber}"]`);
  if (currentSlide) {
    currentSlide.classList.add('active');
    currentSlideSpan.textContent = slideNumber;
    presentationState.currentSlide = slideNumber;
  }
  
  // Update button states
  prevBtn.disabled = slideNumber === 1;
  nextBtn.disabled = slideNumber === presentationState.totalSlides;
}

// Navigate to next slide
function nextSlide() {
  if (presentationState.currentSlide < presentationState.totalSlides) {
    showSlide(presentationState.currentSlide + 1);
  }
}

// Navigate to previous slide
function prevSlide() {
  if (presentationState.currentSlide > 1) {
    showSlide(presentationState.currentSlide - 1);
  }
}

// Keyboard navigation
function addKeyboardNavigation() {
  document.addEventListener('keydown', (e) => {
    switch(e.key) {
      case 'ArrowRight':
      case 'PageDown':
      case ' ':
        e.preventDefault();
        nextSlide();
        break;
      case 'ArrowLeft':
      case 'PageUp':
        e.preventDefault();
        prevSlide();
        break;
      case 'Home':
        e.preventDefault();
        showSlide(1);
        break;
      case 'End':
        e.preventDefault();
        showSlide(presentationState.totalSlides);
        break;
    }
  });
}

// Initialize Chart (Slide 14)
function initChart() {
  const ctx = document.getElementById('metricsChart');
  if (!ctx) return;
  
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Reach', 'Consultations', 'Brand Recall', 'Sales'],
      datasets: [{
        label: 'Growth Metrics',
        data: [100, 25, 8, 50],
        backgroundColor: [
          'rgba(31, 184, 205, 0.8)',
          'rgba(46, 204, 113, 0.8)',
          'rgba(52, 152, 219, 0.8)',
          'rgba(142, 68, 173, 0.8)'
        ],
        borderColor: [
          'rgba(31, 184, 205, 1)',
          'rgba(46, 204, 113, 1)',
          'rgba(52, 152, 219, 1)',
          'rgba(142, 68, 173, 1)'
        ],
        borderWidth: 2,
        borderRadius: 8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        title: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(255, 255, 255, 0.1)'
          },
          ticks: {
            color: '#ecf0f1',
            font: {
              size: 12
            }
          }
        },
        x: {
          grid: {
            display: false
          },
          ticks: {
            color: '#ecf0f1',
            font: {
              size: 12
            }
          }
        }
      }
    }
  });
}

// Help panel toggle
function toggleHelp() {
  helpPanel.classList.toggle('active');
}

// Event Listeners
prevBtn.addEventListener('click', prevSlide);
nextBtn.addEventListener('click', nextSlide);
helpBtn.addEventListener('click', toggleHelp);
closeHelpBtn.addEventListener('click', toggleHelp);

// Close help panel when clicking outside
document.addEventListener('click', (e) => {
  if (!helpPanel.contains(e.target) && e.target !== helpBtn) {
    helpPanel.classList.remove('active');
  }
});

// Prevent contenteditable from interfering with navigation
document.querySelectorAll('[contenteditable="true"]').forEach(element => {
  element.addEventListener('keydown', (e) => {
    // Stop propagation of arrow keys when editing
    if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
      e.stopPropagation();
    }
  });
});

// Touch swipe support for mobile
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', (e) => {
  touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', (e) => {
  touchEndX = e.changedTouches[0].screenX;
  handleSwipe();
});

function handleSwipe() {
  const swipeThreshold = 50;
  const diff = touchStartX - touchEndX;
  
  if (Math.abs(diff) > swipeThreshold) {
    if (diff > 0) {
      // Swipe left - next slide
      nextSlide();
    } else {
      // Swipe right - previous slide
      prevSlide();
    }
  }
}

// Auto-save edited content to memory (not localStorage)
const editableContent = {};

document.querySelectorAll('[contenteditable="true"]').forEach((element, index) => {
  const key = `editable_${index}`;
  element.addEventListener('blur', () => {
    editableContent[key] = element.innerHTML;
  });
  
  element.addEventListener('focus', () => {
    element.setAttribute('data-original', element.innerHTML);
  });
});

// Initialize presentation
init();

// Log initialization
console.log('✓ Cellopathy Presentation Loaded');
console.log('✓ Navigate with arrow keys or buttons');
console.log('✓ Click any text to edit');
console.log('✓ Total Slides:', presentationState.totalSlides);