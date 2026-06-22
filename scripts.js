// Performance optimization: Enable hardware acceleration for smooth animations
const style = document.createElement('style');
style.textContent = `
  .gallery-item, .gallery-media, .gallery-media img {
    transform: translate3d(0, 0, 0);
    backface-visibility: hidden;
    perspective: 1000px;
  }
  
  img[loading="lazy"] {
    background: linear-gradient(90deg, #f0e6d9, #ffffff, #f0e6d9);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
  }
  
  @keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
`;
document.head.appendChild(style);

// Optimize gallery images with priority hints
const galleryImages = document.querySelectorAll('.gallery-media img');
galleryImages.forEach((img, index) => {
  if (index < 8) {
    img.fetchPriority = 'high';
  }
});

const revealElements = document.querySelectorAll('[data-reveal]');
const heroStats = document.querySelectorAll('.stat-value');
const galleryButtons = document.querySelectorAll('.filter-button');
const galleryItems = document.querySelectorAll('.gallery-item');
const lightbox = document.querySelector('.lightbox');
const lightboxImage = document.querySelector('.lightbox-image');
const lightboxTitle = document.querySelector('.lightbox-title');
const lightboxClose = document.querySelector('.lightbox-close');
const testimonials = document.querySelectorAll('.testimonial-card');
const prevBtn = document.querySelector('.slider-control.prev');
const nextBtn = document.querySelector('.slider-control.next');
const navToggle = document.querySelector('.nav-toggle');
const siteHeader = document.querySelector('.site-header');
let currentTestimonial = 0;

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

revealElements.forEach((element) => revealObserver.observe(element));

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      heroStats.forEach((stat) => {
        const target = +stat.dataset.target;
        let current = 0;
        const step = Math.max(1, Math.floor(target / 60));
        const interval = setInterval(() => {
          current += step;
          stat.textContent = current > target ? target : current;
          if (current >= target) clearInterval(interval);
        }, 25);
      });
      statsObserver.disconnect();
    }
  });
}, { threshold: 0.3 });

if (heroStats.length) {
  statsObserver.observe(heroStats[0]);
}

galleryButtons.forEach((button) => {
  button.addEventListener('click', () => {
    galleryButtons.forEach((btn) => btn.classList.remove('active'));
    button.classList.add('active');
    const filter = button.dataset.filter;
    galleryItems.forEach((item) => {
      if (filter === 'all' || item.dataset.category === filter) {
        item.style.display = 'flex';
      } else {
        item.style.display = 'none';
      }
    });
  });
});

const imageMap = {
  'wall-art-1': { src: 'images/white_gold_geode_canvas.webp', alt: 'Resin wall art' },
  'table-1': { src: 'images/river_live_edge_coffee_table.jpg', alt: 'Statement table' },
  'custom-1': { src: 'images/clear_flower_handbag.jpg', alt: 'Custom order' },
  'wall-art-2': { src: 'images/blue_marble_wall_mural.jpg', alt: 'Marble wall art' },
  'wall-art-3': { src: 'images/emerald_pebble_sink.jpg', alt: 'Emerald resin panel' },
  'coaster-2': { src: 'images/green_wood_resin_sink.jpg', alt: 'Sapphire coasters' },
  'tray-2': { src: 'images/pink_geode_clutch.jpg', alt: 'Rose gold tray' },
  'table-2': { src: 'images/red_gold_resin_tray.jpg', alt: 'Luxury dining table' },
  'custom-2': { src: 'images/red_gold_serving_tray.jpg', alt: 'Personalized resin box' },
  'wall-art-4': { src: 'images/wood_resin_trays_set.jpg', alt: 'Gold leaf wall piece' },
  'coaster-3': { src: 'images/geode_key_hook_board.jpg', alt: 'Onyx coaster collection' },
  'tray-3': { src: 'images/crystal_3_tier_stand.jpg', alt: 'Aquamarine serving tray' },
  'custom-3': { src: 'images/blue_gold_round_clock.jpg', alt: 'Wedding favour set' },
  'wall-art-5': { src: 'images/floral_shells_resin_basins.jpg', alt: 'Ocean wave resin art' },
  'table-3': { src: 'images/pink_black_3tier_stands.jpg', alt: 'Glass top resin table' },
  'wall-art-6': { src: 'images/teal_starry_tray.jpg', alt: 'Sunset gradient panel' },
  'coaster-4': { src: 'images/live_edge_resin_side_tables.jpg', alt: 'Crystal coaster set' },
  'tray-4': { src: 'images/black_gold_resin_side_tables.jpg', alt: 'Translucent serving tray' },
  'wall-art-7': { src: 'images/blue_gold_makeup_holder.jpg', alt: 'Celestial resin art' },
  'coaster-5': { src: 'images/dining_table_epoxy_river.jpg', alt: 'Minimalist coaster pair' },
  'tray-5': { src: 'images/round_wood_resin_trays.jpg', alt: 'Luxury accent tray' },
  'wall-art-8': { src: 'images/pink_marble_resin_tray.jpg', alt: 'Modern abstract resin' },
  'coaster-6': { src: 'images/black_gold_serve_set.jpg', alt: 'Metallic coaster collection' },
  'tray-6': { src: 'images/green_marble_clutch.jpg', alt: 'Premium display tray' },
  'wall-art-9': { src: 'images/teardrop_red_earrings.jpg', alt: 'Iridescent wall panel' },
  'coaster-7': { src: 'images/seaside_chess_board.jpg', alt: 'Botanical coasters' },
  'tray-7': { src: 'images/black_gold_ashtrays_set.jpg', alt: 'Artisan resin tray' },
  'wall-art-10': { src: 'images/amethyst_clock_pink.jpg', alt: 'Geometric resin art' },
  'coaster-8': { src: 'images/ocean_wave_side_table.jpg', alt: 'Premium coaster ensemble' },
  'tray-8': { src: 'images/blue_jewel_tray_set.jpg', alt: 'Exquisite serving tray' },
  'coaster-bonus-1': { src: 'images/blue_gold_geode_clock.jpg', alt: 'Blue geode clock' },
  'wall-bonus-1': { src: 'images/ocean_resin_coasters.webp', alt: 'Ocean resin coasters' }
};

const lightboxImageImg = lightboxImage.querySelector('img');

function openLightbox(imageKey, title) {
  const imageData = imageMap[imageKey] || { src: 'images/image1.webp', alt: 'Resin art' };
  lightboxImageImg.src = imageData.src;
  lightboxImageImg.alt = imageData.alt;
  lightboxTitle.textContent = title;
  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden', 'false');
}

function closeLightbox() {
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
}

galleryItems.forEach((item) => {
  item.addEventListener('click', () => {
    openLightbox(item.dataset.image, item.dataset.title);
  });
  item.addEventListener('keypress', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openLightbox(item.dataset.image, item.dataset.title);
    }
  });
});

lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (event) => {
  if (event.target === lightbox) closeLightbox();
});

// Close lightbox on Escape key
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && lightbox.classList.contains('open')) {
    closeLightbox();
  }
});

function showTestimonial(index) {
  testimonials.forEach((card, idx) => {
    card.classList.toggle('active', idx === index);
  });
}

function nextTestimonial() {
  currentTestimonial = (currentTestimonial + 1) % testimonials.length;
  showTestimonial(currentTestimonial);
}

function prevTestimonial() {
  currentTestimonial = (currentTestimonial - 1 + testimonials.length) % testimonials.length;
  showTestimonial(currentTestimonial);
}

nextBtn?.addEventListener('click', nextTestimonial);
prevBtn?.addEventListener('click', prevTestimonial);
setInterval(nextTestimonial, 7000);

navToggle.addEventListener('click', () => {
  siteHeader.classList.toggle('open');
});

window.addEventListener('scroll', () => {
  document.documentElement.style.setProperty('--scroll-y', `${window.scrollY}px`);
});

const hero = document.querySelector('.hero-section');
window.addEventListener('mousemove', (event) => {
  const x = (event.clientX / window.innerWidth - 0.5) * 12;
  const y = (event.clientY / window.innerHeight - 0.5) * 12;
  hero.style.transform = `translate3d(${x}px, ${y}px, 0)`;
});

const contactForm = document.querySelector('.contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    alert('Thank you! Your inquiry was sent. We will contact you shortly.');
    contactForm.reset();
  });
}
