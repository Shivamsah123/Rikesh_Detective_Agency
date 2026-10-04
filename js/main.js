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
  initFeedbackSystem();
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

/* -------------------------------------------------------------
 * 8. Feedback & Reviews Controller (Interactive + LocalStorage)
 * ------------------------------------------------------------- */
function initFeedbackSystem() {
  const modal = document.getElementById('feedbackModal');
  const closeBtn = document.getElementById('feedbackModalCloseBtn');
  const openBtns = document.querySelectorAll('.open-feedback-modal');
  const form = document.getElementById('feedbackForm');
  const filterBtns = document.querySelectorAll('.feedback-filter-btn');
  const feedbackGrid = document.getElementById('feedbackGrid');
  const starPicker = document.getElementById('starRatingPicker');
  const starIcons = starPicker ? starPicker.querySelectorAll('.star-pick') : [];
  const ratingInput = document.getElementById('feedbackRatingInput');
  const ratingLabel = document.getElementById('ratingFeedbackLabel');
  const statusMsg = document.getElementById('feedbackStatusMsg');
  const countAllSpan = document.getElementById('countAllReviews');

  const ratingTexts = {
    1: '1 Star — Needs Improvement',
    2: '2 Stars — Fair Service',
    3: '3 Stars — Average Investigation',
    4: '4 Stars — Very Good & Discreet',
    5: '5 Stars — Exceptional & Complete Discretion'
  };

  // Modal open/close
  function openFeedbackModal() {
    if (!modal) return;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeFeedbackModal() {
    if (!modal) return;
    modal.classList.remove('open');
    document.body.style.overflow = '';
    if (statusMsg) {
      statusMsg.innerHTML = '';
      statusMsg.className = 'form-status-msg';
    }
  }

  openBtns.forEach(btn => btn.addEventListener('click', (e) => {
    e.preventDefault();
    openFeedbackModal();
  }));

  if (closeBtn) closeBtn.addEventListener('click', closeFeedbackModal);

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeFeedbackModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('open')) {
      closeFeedbackModal();
    }
  });

  // Star Picker hover & click
  let currentRating = 5;
  function updateStars(val) {
    starIcons.forEach(icon => {
      const starVal = +icon.getAttribute('data-val');
      if (starVal <= val) {
        icon.classList.add('active');
      } else {
        icon.classList.remove('active');
      }
    });
    if (ratingLabel) {
      ratingLabel.textContent = ratingTexts[val] || `${val} Stars`;
    }
    if (ratingInput) {
      ratingInput.value = val;
    }
  }

  starIcons.forEach(icon => {
    icon.addEventListener('mouseenter', () => {
      const hoverVal = +icon.getAttribute('data-val');
      starIcons.forEach(s => {
        const sVal = +s.getAttribute('data-val');
        if (sVal <= hoverVal) {
          s.classList.add('hover');
        } else {
          s.classList.remove('hover');
        }
      });
      if (ratingLabel) ratingLabel.textContent = ratingTexts[hoverVal] || `${hoverVal} Stars`;
    });

    icon.addEventListener('mouseleave', () => {
      starIcons.forEach(s => s.classList.remove('hover'));
      updateStars(currentRating);
    });

    icon.addEventListener('click', () => {
      currentRating = +icon.getAttribute('data-val');
      updateStars(currentRating);
    });
  });

  // Filter Tabs
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const cards = feedbackGrid ? feedbackGrid.querySelectorAll('.feedback-card') : [];
      cards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Helper escape
  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>"']/g, function(m) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m];
    });
  }

  // Render a review card dynamically
  function createReviewCard(review, isPrepend = false) {
    if (!feedbackGrid) return;
    const card = document.createElement('div');
    card.className = 'feedback-card user-submitted visible';
    card.setAttribute('data-category', review.category);

    const starsHtml = Array.from({ length: 5 }, (_, i) => 
      `<i class="fas fa-star ${i < review.rating ? 'star-amber' : ''}" style="${i >= review.rating ? 'color:#cbd5e1;' : ''}"></i>`
    ).join('');

    card.innerHTML = `
      <div class="feedback-card-header">
        <div class="feedback-avatar avatar-teal">${escapeHtml(review.avatarInitials)}</div>
        <div class="feedback-user-info">
          <h4>${escapeHtml(review.displayName)}</h4>
          <div class="feedback-meta">
            <span class="user-location"><i class="fas fa-map-marker-alt"></i> ${escapeHtml(review.location)}</span>
            <span class="case-date">• ${escapeHtml(review.date || 'Recent')}</span>
          </div>
        </div>
        <div class="verified-case-pill recent-badge-pill">
          <i class="fas fa-certificate"></i> Verified Client
        </div>
      </div>
      <div class="feedback-rating-strip">
        <div class="stars-mini">${starsHtml}</div>
        <span class="service-pill-tag">${escapeHtml(review.service)}</span>
      </div>
      <p class="feedback-text">"${escapeHtml(review.text)}"</p>
      <div class="feedback-outcome">
        <i class="fas fa-shield-alt text-teal"></i>
        <span><strong>Verified Case:</strong> Client review recorded under strict discretion.</span>
      </div>
    `;

    if (isPrepend) {
      feedbackGrid.insertBefore(card, feedbackGrid.firstChild);
    } else {
      feedbackGrid.appendChild(card);
    }
  }

  // Load reviews from localStorage
  try {
    const savedReviews = JSON.parse(localStorage.getItem('sanskari_client_feedback') || '[]');
    if (savedReviews.length > 0) {
      savedReviews.forEach(r => createReviewCard(r, true));
      if (countAllSpan) {
        countAllSpan.textContent = 6 + savedReviews.length;
      }
    }
  } catch (err) {
    console.warn('LocalStorage not available:', err);
  }

  // Form submit handler
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const rawName = document.getElementById('fbClientName').value.trim();
      const isAnon = document.getElementById('fbAnonymousCheck').checked;
      const location = document.getElementById('fbLocation').value;
      const service = document.getElementById('fbService').value;
      const text = document.getElementById('fbReviewText').value.trim();
      const rating = currentRating;

      if (!text) {
        alert('Please share your review or case feedback.');
        return;
      }

      let displayName = isAnon ? 'Verified Confidential Client' : rawName;
      let initials = 'CL';
      if (!isAnon && rawName) {
        const parts = rawName.split(' ');
        initials = parts.map(p => p[0]).join('').substring(0, 2).toUpperCase();
      } else {
        initials = 'CC';
      }

      // Map category
      let category = 'matrimonial';
      if (service.includes('Corporate') || service.includes('Inventory') || service.includes('Undercover')) {
        category = 'corporate';
      } else if (service.includes('Missing') || service.includes('Surveillance')) {
        category = 'missing';
      }

      const reviewObj = {
        displayName,
        avatarInitials: initials,
        location,
        service,
        text,
        rating,
        category,
        date: 'Just Now'
      };

      // Save to localStorage
      try {
        const existing = JSON.parse(localStorage.getItem('sanskari_client_feedback') || '[]');
        existing.unshift(reviewObj);
        localStorage.setItem('sanskari_client_feedback', JSON.stringify(existing));
        if (countAllSpan) {
          countAllSpan.textContent = 6 + existing.length;
        }
      } catch (err) {
        console.warn('LocalStorage save error:', err);
      }

      // Append live into DOM
      createReviewCard(reviewObj, true);

      if (statusMsg) {
        statusMsg.className = 'form-status-msg success';
        statusMsg.innerHTML = `
          <strong>Feedback Published!</strong> Thank you for your confidential review.
          <div style="margin-top: 8px;">
            <a href="https://wa.me/916299579120?text=${encodeURIComponent(`*Client Feedback Submission*\n*Rating:* ${rating}/5\n*Client:* ${displayName}\n*Service:* ${service}\n*Feedback:* ${text}`)}" target="_blank" class="btn-secondary-whatsapp" style="display:inline-flex; font-size:0.8rem; padding: 6px 12px; margin-top: 6px;">
              <i class="fab fa-whatsapp"></i> Also Share to Founder on WhatsApp
            </a>
          </div>
        `;
      }

      // Reset form fields
      form.reset();
      currentRating = 5;
      updateStars(5);

      setTimeout(() => {
        closeFeedbackModal();
      }, 4000);
    });
  }
}
