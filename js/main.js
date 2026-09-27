/**
 * SANSKARI DETECTIVE AGENCY
 * High-Performance Vanilla JS Controller
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileDrawer();
  initServiceTabs();
  initFaqAccordion();
  initStatsCounter();
  initScrollAnimations();
  initConsultationModal();
  initFormHandlers();
});

/* -------------------------------------------------------------
 * 1. Mobile Drawer Navigation
 * ------------------------------------------------------------- */
function initMobileDrawer() {
  const toggleBtn = document.getElementById('menuToggleBtn');
  const closeBtn = document.getElementById('drawerCloseBtn');
  const drawer = document.getElementById('mobileDrawer');
  const overlay = document.getElementById('drawerOverlay');
  const navLinks = document.querySelectorAll('.drawer-links a');

  function openDrawer() {
    drawer.classList.add('open');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    drawer.classList.remove('open');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (toggleBtn) toggleBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (overlay) overlay.addEventListener('click', closeDrawer);

  navLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });
}

/* -------------------------------------------------------------
 * 2. Service Tabs (Individual vs Corporate)
 * ------------------------------------------------------------- */
function initServiceTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanes = document.querySelectorAll('.services-tab-pane');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-tab');

      tabBtns.forEach(b => b.classList.remove('active'));
      tabPanes.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetPane = document.getElementById(target);
      if (targetPane) {
        targetPane.classList.add('active');
      }
    });
  });
}

/* -------------------------------------------------------------
 * 3. FAQ Accordion
 * ------------------------------------------------------------- */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const header = item.querySelector('.faq-header');
    const body = item.querySelector('.faq-body');

    header.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');

      // Close all other open items
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          const otherBody = otherItem.querySelector('.faq-body');
          if (otherBody) otherBody.style.maxHeight = null;
        }
      });

      // Toggle current
      if (isOpen) {
        item.classList.remove('active');
        body.style.maxHeight = null;
      } else {
        item.classList.add('active');
        body.style.maxHeight = body.scrollHeight + 'px';
      }
    });
  });

  // Open first FAQ by default
  if (faqItems.length > 0) {
    const firstItem = faqItems[0];
    const firstBody = firstItem.querySelector('.faq-body');
    firstItem.classList.add('active');
    if (firstBody) firstBody.style.maxHeight = firstBody.scrollHeight + 'px';
  }
}

/* -------------------------------------------------------------
 * 4. Animated Stats Counter (Odometer style)
 * ------------------------------------------------------------- */
function initStatsCounter() {
  const counters = document.querySelectorAll('.stat-number');
  let started = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !started) {
        started = true;
        counters.forEach(counter => {
          const target = +counter.getAttribute('data-target');
          const suffix = counter.getAttribute('data-suffix') || '';
          let count = 0;
          const speed = 40; // lower is faster
          const increment = Math.max(1, Math.ceil(target / speed));

          const updateCount = () => {
            count += increment;
            if (count < target) {
              counter.innerText = count + suffix;
              setTimeout(updateCount, 30);
            } else {
              counter.innerText = target + suffix;
            }
          };
          updateCount();
        });
      }
    });
  }, { threshold: 0.3 });

  const statsSection = document.querySelector('.stats-section');
  if (statsSection) {
    observer.observe(statsSection);
  }
}

/* -------------------------------------------------------------
 * 5. Smooth Scroll & Fade-up Animations
 * ------------------------------------------------------------- */
function initScrollAnimations() {
  const fadeEls = document.querySelectorAll('.fade-up');

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  fadeEls.forEach(el => observer.observe(el));
}

/* -------------------------------------------------------------
 * 6. Consultation Modal
 * ------------------------------------------------------------- */
function initConsultationModal() {
  const modal = document.getElementById('consultationModal');
  const modalClose = document.getElementById('modalCloseBtn');
  const triggerBtns = document.querySelectorAll('.open-consultation-modal');

  if (!modal) return;

  function openModal(serviceName = '') {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    const serviceSelect = document.getElementById('modalServiceSelect');
    if (serviceSelect && serviceName) {
      serviceSelect.value = serviceName;
    }
  }

  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  triggerBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const service = btn.getAttribute('data-service') || '';
      openModal(service);
    });
  });

  if (modalClose) modalClose.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });
}

/* -------------------------------------------------------------
 * 7. Consultation & Contact Form Handlers
 * ------------------------------------------------------------- */
function initFormHandlers() {
  // Main Consultation Form on page
  const pageForm = document.getElementById('mainInquiryForm');
  if (pageForm) {
    pageForm.addEventListener('submit', (e) => {
      e.preventDefault();
      handleFormSubmit(pageForm, 'page');
    });
  }

  // Modal Form
  const modalForm = document.getElementById('modalInquiryForm');
  if (modalForm) {
    modalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      handleFormSubmit(modalForm, 'modal');
    });
  }
}

function handleFormSubmit(form, type) {
  const nameInput = form.querySelector('[name="name"]');
  const phoneInput = form.querySelector('[name="phone"]');
  const serviceInput = form.querySelector('[name="service"]');
  const messageInput = form.querySelector('[name="message"]');
  const statusMsg = form.querySelector('.form-status-msg');

  const name = nameInput ? nameInput.value.trim() : 'Anonymous';
  const phone = phoneInput ? phoneInput.value.trim() : '';
  const service = serviceInput ? serviceInput.value : 'General Inquiry';
  const message = messageInput ? messageInput.value.trim() : '';

  if (!phone) {
    alert('Please enter your phone number so our senior investigator can contact you discreetly.');
    return;
  }

  // Construct WhatsApp direct message
  const textMessage = `*Sanskari Detective Agency - Confidential Inquiry*%0A%0A*Name:* ${encodeURIComponent(name)}%0A*Phone:* ${encodeURIComponent(phone)}%0A*Service:* ${encodeURIComponent(service)}%0A*Case Details:* ${encodeURIComponent(message || 'Requesting private consultation.')}`;
  
  if (statusMsg) {
    statusMsg.innerHTML = `<strong>Your inquiry has been received.</strong> Our senior investigation officer will reach out to you with utmost discretion shortly.`;
    statusMsg.className = 'form-status-msg success';
  }

  // Redirect to WhatsApp for immediate encrypted connection
  setTimeout(() => {
    window.open(`https://wa.me/916299579120?text=${textMessage}`, '_blank');
    form.reset();
  }, 1000);
}
