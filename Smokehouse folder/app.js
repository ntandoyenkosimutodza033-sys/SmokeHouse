<script>
/* Icons + GSAP setup */
lucide.createIcons();
gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {

  /* ---------- Hero entrance animations ---------- */
  gsap.from(".hero-content > *", {
    y: 50,
    opacity: 0,
    duration: 1,
    stagger: 0.2,
    ease: "power3.out",
    delay: 0.5
  });

  const revealElements = document.querySelectorAll(".gs-reveal");
  revealElements.forEach((elem) => {
    gsap.fromTo(elem,
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: elem,
          start: "top 85%",
        }
      }
    );
  });

  /* ---------- Navbar scroll behavior ---------- */
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        navbar.classList.add('nav-scrolled');
        navbar.classList.remove('py-6');
      } else {
        navbar.classList.remove('nav-scrolled');
        navbar.classList.add('py-6');
      }
    });
  }

  /* ---------- Mobile menu toggle ---------- */
  const mobileBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-link');
  let isMenuOpen = false;

  function toggleMenu() {
    if (!mobileMenu) return;
    isMenuOpen = !isMenuOpen;
    if (isMenuOpen) {
      mobileMenu.classList.remove('opacity-0', 'pointer-events-none');
      mobileMenu.classList.add('opacity-100', 'pointer-events-auto');
      document.body.style.overflow = 'hidden';
    } else {
      mobileMenu.classList.add('opacity-0', 'pointer-events-none');
      mobileMenu.classList.remove('opacity-100', 'pointer-events-auto');
      document.body.style.overflow = 'auto';
    }
  }

  if (mobileBtn) mobileBtn.addEventListener('click', toggleMenu);
  mobileLinks.forEach(link => link.addEventListener('click', toggleMenu));

  /* ---------- Menu modal (View Menu) ---------- */
  const viewMenuBtn = document.getElementById('view-menu-btn');
  const menuModal = document.getElementById('menu-modal');
  const closeMenuBtn = document.getElementById('close-menu');
  const modalContent = document.getElementById('menu-modal-content');

  function openModal() {
    if (!menuModal || !modalContent) return;
    menuModal.classList.remove('opacity-0', 'pointer-events-none');
    modalContent.classList.remove('scale-95');
    modalContent.classList.add('scale-100');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    if (!menuModal || !modalContent) return;
    menuModal.classList.add('opacity-0', 'pointer-events-none');
    modalContent.classList.remove('scale-100');
    modalContent.classList.add('scale-95');
    document.body.style.overflow = 'auto';
  }

  if (viewMenuBtn) viewMenuBtn.addEventListener('click', openModal);
  if (closeMenuBtn) closeMenuBtn.addEventListener('click', closeModal);
  if (menuModal) {
    menuModal.addEventListener('click', (e) => {
      if (e.target === menuModal) closeModal();
    });
  }

  /* ---------- Reservation form handling ---------- */
  const form = document.getElementById('reservation-form');
  const successMsg = document.getElementById('form-success');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const btn = form.querySelector('button[type="submit"]');
      if (!btn) return;
      const originalText = btn.innerText;
      btn.innerText = 'Sending...';
      btn.disabled = true;

      setTimeout(() => {
        btn.innerText = originalText;
        btn.disabled = false;
        form.reset();
        if (successMsg) {
          successMsg.classList.remove('hidden');
          setTimeout(() => successMsg.classList.add('hidden'), 5000);
        }
      }, 1500);
    });
  }

  /* ---------- Sizzle sound + menu-item hover/tap ---------- */
  const sizzle = document.getElementById('sizzle-sound'); // <audio id="sizzle-sound" src="sizzle.mp3">
  const menuItems = document.querySelectorAll('.menu-item');

  function playSizzle() {
    if (!sizzle) return;
    try {
      sizzle.currentTime = 0;
      const playPromise = sizzle.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => { /* autoplay blocked; will play on user gesture */ });
      }
    } catch (err) {
      // ignore playback errors
    }
  }

  // Desktop: play on hover; Mobile: play on touchstart/tap
  menuItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
      // only trigger hover sound on non-touch devices
      if (!('ontouchstart' in window)) playSizzle();
    });
    item.addEventListener('touchstart', () => {
      playSizzle();
      // add tapped class for visual feedback
      item.classList.add('tapped');
      setTimeout(() => item.classList.remove('tapped'), 600);
    }, {passive: true});
  });

  /* ---------- Convert hover effects to tap-friendly on touch devices ---------- */
  function isTouchDevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }

  if (isTouchDevice()) {
    // ensure hover-only styles degrade gracefully; add click-to-toggle for menu items if desired
    menuItems.forEach(item => {
      item.addEventListener('click', () => {
        // small visual feedback already handled by tapped class on touchstart
      });
    });
  }

  /* ---------- Smooth scroll for View Menu button (fallback) ---------- */
  if (viewMenuBtn) {
    viewMenuBtn.addEventListener('click', function(e) {
      // If a #menu section exists, smooth scroll; otherwise open modal (handled above)
      const menuSection = document.querySelector('#menu');
      if (menuSection) {
        e.preventDefault();
        menuSection.scrollIntoView({behavior: 'smooth'});
      }
    });
  }

  /* ---------- Ensure header video plays on first user gesture if blocked ---------- */
  const headerVideo = document.querySelector('.header-video');
  function unlockMediaOnGesture() {
    if (!headerVideo) return;
    try {
      headerVideo.play().catch(()=>{ /* ignore */ });
    } catch (e) {}
    // remove the listener after first gesture
    window.removeEventListener('click', unlockMediaOnGesture);
    window.removeEventListener('touchstart', unlockMediaOnGesture);
  }
  window.addEventListener('click', unlockMediaOnGesture, {once: true});
  window.addEventListener('touchstart', unlockMediaOnGesture, {once: true});

});
</script>