const WA_SVG = `<svg viewBox="0 0 24 24" style="width:15px;height:15px;fill:white;flex-shrink:0"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>`;

  document.querySelectorAll('.menu-panel[data-items]').forEach(panel => {
    const items = JSON.parse(panel.getAttribute('data-items'));
    panel.innerHTML = items.map(([name, price, waName, note]) => `
      <div class="menu-item">
        <div class="item-row">
          <div>
            <div class="item-name">${name}</div>
            ${note ? `<div class="item-note">${note}</div>` : ''}
          </div>
          <div class="item-price">${price}</div>
        </div>
        <a class="order-btn" href="https://wa.me/27837609289?text=Hi!%20I%27d%20like%20to%20order%3A%20${waName}%20please%20%F0%9F%8C%AE" target="_blank">
          ${WA_SVG} Order This on WhatsApp
        </a>
      </div>`).join('');
  });

  function showTab(id, btn) {
    document.querySelectorAll('.menu-panel').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('tab-' + id).classList.add('active');
    btn.classList.add('active');
  }

  function toggleMenu() {
    const h = document.getElementById('hbg');
    const d = document.getElementById('drawer');
    h.classList.toggle('open');
    d.classList.toggle('open');
    document.body.style.overflow = d.classList.contains('open') ? 'hidden' : '';
  }

  const waOrderForm = document.getElementById('waOrderForm');
  const orderTypeSelect = document.getElementById('orderType');
  const orderAddressWrap = document.getElementById('orderAddressWrap');
  const orderAddressInput = document.getElementById('orderAddress');

  const formatOrderItems = (rawItems) => {
    return rawItems
      .split('\n')
      .map(line => line.trim())
      .filter(Boolean)
      .map(line => `• ${line}`)
      .join('\n');
  };

  const toggleAddressField = () => {
    if (!orderTypeSelect || !orderAddressWrap || !orderAddressInput) return;
    const isDelivery = orderTypeSelect.value === 'Delivery';
    orderAddressWrap.hidden = !isDelivery;
    orderAddressInput.required = isDelivery;
    if (!isDelivery) orderAddressInput.value = '';
  };

  if (orderTypeSelect) {
    toggleAddressField();
    orderTypeSelect.addEventListener('change', toggleAddressField);
  }

  if (waOrderForm) {
    waOrderForm.addEventListener('submit', (event) => {
      event.preventDefault();

      const name = (document.getElementById('orderName')?.value || '').trim();
      const phone = (document.getElementById('orderPhone')?.value || '').trim();
      const orderType = (document.getElementById('orderType')?.value || 'Collection').trim();
      const orderWhen = (document.getElementById('orderWhen')?.value || 'ASAP').trim();
      const payment = (document.getElementById('orderPayment')?.value || 'Cash').trim();
      const address = (document.getElementById('orderAddress')?.value || '').trim();
      const orderItemsRaw = (document.getElementById('orderItems')?.value || '').trim();
      const notes = (document.getElementById('orderNotes')?.value || '').trim();

      if (!name || !phone || !orderItemsRaw) {
        waOrderForm.reportValidity();
        return;
      }

      const now = new Date();
      const orderRef = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}`;
      const itemsBlock = formatOrderItems(orderItemsRaw);

      const messageParts = [
        '🔥 *CARDY\'S TACOS ORDER* 🔥',
        '━━━━━━━━━━━━━━━━━━',
        `🧾 *Order Ref:* #${orderRef}`,
        `👤 *Name:* ${name}`,
        `📞 *Phone:* ${phone}`,
        `🛍️ *Type:* ${orderType}`,
        `⏰ *Needed:* ${orderWhen}`,
        `💳 *Payment:* ${payment}`,
      ];

      if (orderType === 'Delivery' && address) {
        messageParts.push(`📍 *Address:* ${address}`);
      }

      messageParts.push(
        '━━━━━━━━━━━━━━━━━━',
        '🍽️ *ORDER DETAILS*',
        itemsBlock
      );

      if (notes) {
        messageParts.push('━━━━━━━━━━━━━━━━━━', `📝 *Notes:* ${notes}`);
      }

      messageParts.push('━━━━━━━━━━━━━━━━━━', '🙏 Thanks Ricardo!');

      const message = messageParts.join('\n');
      const whatsappUrl = `https://wa.me/27837609289?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank', 'noopener');
    });
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.08 });
  document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

  const galleryCarousel = document.getElementById('galleryCarousel');
  const galleryTrack = document.getElementById('galleryTrack');
  const galleryDots = document.getElementById('galleryDots');
  const galleryPrev = document.getElementById('galleryPrev');
  const galleryNext = document.getElementById('galleryNext');
  const carouselItems = galleryTrack ? Array.from(galleryTrack.querySelectorAll('.g-item')) : [];
  let carouselIndex = 0;
  let autoplayTimer = null;
  let isCarouselSwipe = false;
  let carouselTouchStartX = 0;
  let dotButtons = [];

  const updateActiveDot = () => {
    if (!dotButtons.length) return;
    dotButtons.forEach((dot, index) => {
      dot.classList.toggle('active', index === carouselIndex);
      dot.setAttribute('aria-current', index === carouselIndex ? 'true' : 'false');
    });
  };

  const setCarouselIndex = (index) => {
    if (!galleryTrack || !carouselItems.length) return;
    const total = carouselItems.length;
    carouselIndex = (index + total) % total;
    galleryTrack.style.transform = `translateX(-${carouselIndex * 100}%)`;
    updateActiveDot();
  };

  const stopAutoplay = () => {
    if (autoplayTimer) {
      clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
  };

  const startAutoplay = () => {
    if (!galleryTrack || carouselItems.length < 2) return;
    stopAutoplay();
    autoplayTimer = setInterval(() => setCarouselIndex(carouselIndex + 1), 5000);
  };

  if (galleryCarousel && galleryTrack && carouselItems.length) {
    if (galleryDots && carouselItems.length > 1) {
      galleryDots.innerHTML = carouselItems
        .map((_, index) => `<button class="gc-dot${index === 0 ? ' active' : ''}" data-index="${index}" aria-label="Go to gallery image ${index + 1}"></button>`)
        .join('');
      dotButtons = Array.from(galleryDots.querySelectorAll('.gc-dot'));
      dotButtons.forEach((dot) => {
        dot.addEventListener('click', () => {
          const nextIndex = Number(dot.getAttribute('data-index'));
          if (Number.isNaN(nextIndex)) return;
          setCarouselIndex(nextIndex);
          startAutoplay();
        });
      });
    }

    setCarouselIndex(0);
    startAutoplay();

    if (galleryPrev) {
      galleryPrev.addEventListener('click', () => {
        setCarouselIndex(carouselIndex - 1);
        startAutoplay();
      });
    }

    if (galleryNext) {
      galleryNext.addEventListener('click', () => {
        setCarouselIndex(carouselIndex + 1);
        startAutoplay();
      });
    }

    galleryCarousel.addEventListener('mouseenter', stopAutoplay);
    galleryCarousel.addEventListener('mouseleave', startAutoplay);

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) stopAutoplay();
      else startAutoplay();
    });

    galleryCarousel.addEventListener('touchstart', (event) => {
      carouselTouchStartX = event.changedTouches[0].clientX;
      stopAutoplay();
    }, { passive: true });

    galleryCarousel.addEventListener('touchend', (event) => {
      const deltaX = event.changedTouches[0].clientX - carouselTouchStartX;
      if (Math.abs(deltaX) > 45) {
        isCarouselSwipe = true;
        if (deltaX < 0) setCarouselIndex(carouselIndex + 1);
        if (deltaX > 0) setCarouselIndex(carouselIndex - 1);
        setTimeout(() => { isCarouselSwipe = false; }, 180);
      }
      startAutoplay();
    }, { passive: true });
  }

  const galleryItems = Array.from(document.querySelectorAll('.gallery-grid .g-item'));
  const lightbox = document.getElementById('galleryLightbox');
  const lightboxStage = document.getElementById('galleryLightboxStage');
  const lightboxCount = document.getElementById('galleryLightboxCount');
  const lightboxPrev = document.getElementById('galleryLightboxPrev');
  const lightboxNext = document.getElementById('galleryLightboxNext');
  const lightboxClose = document.getElementById('galleryLightboxClose');

  if (galleryItems.length && lightbox && lightboxStage && lightboxCount && lightboxPrev && lightboxNext && lightboxClose) {
    let activeIndex = 0;
    let prevBodyOverflow = '';
    let touchStartX = 0;

    const renderLightboxItem = (index, direction = 'none') => {
      const total = galleryItems.length;
      activeIndex = (index + total) % total;
      const sourceInner = galleryItems[activeIndex].querySelector('.g-inner');
      if (!sourceInner) return;
      lightboxStage.innerHTML = '';
      const clone = sourceInner.cloneNode(true);
      clone.classList.add('g-lightbox-inner');
      if (direction === 'next') clone.classList.add('glb-enter-next');
      if (direction === 'prev') clone.classList.add('glb-enter-prev');
      lightboxStage.appendChild(clone);
      lightboxCount.textContent = `${activeIndex + 1} / ${total}`;
    };

    const openLightbox = (index) => {
      renderLightboxItem(index);
      lightbox.classList.add('open');
      lightbox.setAttribute('aria-hidden', 'false');
      prevBodyOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
      lightbox.classList.remove('open');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = prevBodyOverflow;
    };

    const showNext = () => renderLightboxItem(activeIndex + 1, 'next');
    const showPrev = () => renderLightboxItem(activeIndex - 1, 'prev');

    galleryItems.forEach((item, index) => {
      item.setAttribute('role', 'button');
      item.setAttribute('tabindex', '0');
      item.setAttribute('aria-label', 'Open gallery item');
      item.addEventListener('click', () => {
        if (isCarouselSwipe) return;
        openLightbox(index);
      });
      item.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          openLightbox(index);
        }
      });
    });

    lightboxNext.addEventListener('click', showNext);
    lightboxPrev.addEventListener('click', showPrev);
    lightboxClose.addEventListener('click', closeLightbox);

    lightbox.addEventListener('click', (event) => {
      if (event.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (event) => {
      if (!lightbox.classList.contains('open')) return;
      if (event.key === 'Escape') closeLightbox();
      if (event.key === 'ArrowRight') showNext();
      if (event.key === 'ArrowLeft') showPrev();
    });

    lightboxStage.addEventListener('touchstart', (event) => {
      touchStartX = event.changedTouches[0].clientX;
    }, { passive: true });

    lightboxStage.addEventListener('touchend', (event) => {
      const touchEndX = event.changedTouches[0].clientX;
      const deltaX = touchEndX - touchStartX;
      if (Math.abs(deltaX) < 45) return;
      if (deltaX < 0) showNext();
      if (deltaX > 0) showPrev();
    }, { passive: true });
  }
