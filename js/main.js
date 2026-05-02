    document.addEventListener('DOMContentLoaded', () => {
        const modal = document.getElementById('welcome-modal');
        const content = document.getElementById('welcome-content');
        
        modal.classList.remove('pointer-events-none');
        requestAnimationFrame(() => {
          modal.classList.remove('opacity-0');
          content.classList.add('animate-fade-in-up');
        });
    });
  
    function closeWelcomeModal() {
      const modal = document.getElementById('welcome-modal');
      const content = document.getElementById('welcome-content');
      
      content.classList.remove('animate-fade-in-up');
      modal.classList.add('opacity-0');
      
      setTimeout(() => {
        modal.classList.add('pointer-events-none');
      }, 500);
    }
    // Đảm bảo biến delegates luôn được định nghĩa
    if (typeof delegates === 'undefined') {
      window.delegates = [];
      console.warn('Delegates data not loaded. Using empty array.');
    }
    // ==================== AI BUBBLE ANIMATION ====================
    document.addEventListener('DOMContentLoaded', () => {
      // Show the bubble after 2 seconds
      setTimeout(() => {
        const bubble = document.getElementById('ai-bubble');
        if(bubble) {
          bubble.classList.remove('translate-y-4', 'opacity-0');
        }
      }, 2000);

      // Hide bubble after 10 seconds (to not annoy)
      setTimeout(() => {
        const bubble = document.getElementById('ai-bubble');
        if(bubble) {
          bubble.classList.add('opacity-0');
        }
      }, 10000);
    });

    // ==================== SCROLL FADE ANIMATION ====================
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, observerOptions);

    document.querySelectorAll('.scroll-fade').forEach(el => observer.observe(el));

    // ==================== TOGGLE VĂN KIỆN ====================
    function toggleVanKien() {
      const grid = document.getElementById('van-kien-grid');
      const icon = document.getElementById('toggle-van-kien-icon');
      const text = document.getElementById('toggle-van-kien-text');
      
      if (!grid) return;
      
      const isExpanded = grid.classList.contains('expanded');
      
      if (isExpanded) {
        // Thu gọn
        grid.classList.remove('expanded');
        icon.classList.remove('fa-chevron-up');
        icon.classList.add('fa-chevron-down');
        text.textContent = 'Xem tất cả';
      } else {
        // Mở rộng
        grid.classList.add('expanded');
        icon.classList.remove('fa-chevron-down');
        icon.classList.add('fa-chevron-up');
        text.textContent = 'Thu gọn';
      }
    }

    // ==================== AUTO-SCROLL DASHBOARD ====================
    const autoScrollStates = new Map();

    function clearAutoScrollState(id, container) {
      const state = autoScrollStates.get(id);
      if (!state) return;
      if (state.interval) clearInterval(state.interval);
      if (state.userInteractionTimer) clearTimeout(state.userInteractionTimer);
      if (state.handlers && container) {
        state.handlers.forEach(({ event, handler }) => {
          container.removeEventListener(event, handler);
        });
      }
      autoScrollStates.delete(id);
    }

    function setupAutoScrollFor(container) {
      if (!container) return;
      const id = container.dataset.autoScrollId || container.id || `auto-scroll-${Date.now()}`;
      container.dataset.autoScrollId = id;

      clearAutoScrollState(id, container);

      if (window.innerWidth >= 768) {
        container.scrollTo({ left: 0, behavior: 'auto' });
        return;
      }

      const cards = container.querySelectorAll('.dashboard-card-item');
      if (!cards.length) return;

      const state = {
        interval: null,
        userInteractionTimer: null,
        isUserInteracting: false,
        handlers: []
      };
      autoScrollStates.set(id, state);

      const firstCard = cards[0];
      const cardWidth = firstCard?.offsetWidth || 0;
      const computedStyle = window.getComputedStyle(container);
      const gap =
        parseInt(computedStyle.columnGap || computedStyle.gap || '16', 10) || 16;
      const cardWidthWithGap = cardWidth + gap;
      let currentIndex = 0;

      const scrollToCard = (index) => {
        if (index >= cards.length) {
          currentIndex = 0;
          container.scrollTo({ left: 0, behavior: 'smooth' });
          return;
        }

        const card = cards[index];
        if (!card) return;

        card.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center'
        });
      };

      const autoAdvance = () => {
        if (state.isUserInteracting) return;
        scrollToCard(currentIndex);
        currentIndex = (currentIndex + 1) % cards.length;
      };

      state.interval = setInterval(autoAdvance, 1000);
      setTimeout(autoAdvance, 2000);

      const pauseOnInteraction = () => {
        state.isUserInteracting = true;
        if (state.userInteractionTimer) clearTimeout(state.userInteractionTimer);

        state.userInteractionTimer = setTimeout(() => {
          state.isUserInteracting = false;
          const width = cardWidthWithGap || (cards[0]?.offsetWidth || 0) + gap;
          if (width > 0) {
            currentIndex = Math.round(container.scrollLeft / width);
            currentIndex = Math.min(Math.max(currentIndex, 0), cards.length - 1);
          }
        }, 5000);
      };

      ['touchstart', 'mousedown', 'wheel', 'scroll'].forEach(eventName => {
        container.addEventListener(eventName, pauseOnInteraction, { passive: true });
        state.handlers.push({ event: eventName, handler: pauseOnInteraction });
      });
    }

    function initDashboardAutoScroll() {
      document
        .querySelectorAll('.dashboard-scroll[data-auto-scroll="true"]')
        .forEach(setupAutoScrollFor);
    }

    // Initialize auto-scroll when dashboard is visible
    const dashboardObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            initDashboardAutoScroll();
          }, 1000);
          dashboardObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    const dashboardSection = document.getElementById('dashboard');
    if (dashboardSection) {
      dashboardObserver.observe(dashboardSection);
    }

    // Also try to initialize directly after DOM is ready
    const triggerAutoScrollInit = () => setTimeout(initDashboardAutoScroll, 2000);
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', triggerAutoScrollInit);
    } else {
      triggerAutoScrollInit();
    }

    // Re-initialize on window resize
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        initDashboardAutoScroll();
      }, 300);
    });

    // ==================== NORMALIZE TEXT (Dùng cho Check-in) ====================
    // Hàm normalizeText được dùng cho phần Check-in Đại biểu
    const normalizeText = (str) =>
      (str || '')
        .toString()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim();

    // ==================== COUNTDOWN ====================
    const countdownTarget = new Date('2025-12-22T07:00:00');
    const countdownContainer = document.getElementById('countdown-container');
    const countdownEls = {
      days: document.getElementById('countdown-days'),
      hours: document.getElementById('countdown-hours'),
      minutes: document.getElementById('countdown-minutes'),
      seconds: document.getElementById('countdown-seconds'),
      message: document.getElementById('countdown-message')
    };

    const padZero = (value) => value.toString().padStart(2, '0');

    const updateCountdown = () => {
      // Kiểm tra xem các element có tồn tại không
      if (!countdownEls.days || !countdownEls.hours || !countdownEls.minutes || !countdownEls.seconds) {
        return; // Nếu thiếu element, không làm gì cả
      }

      const now = new Date().getTime();
      const diff = countdownTarget.getTime() - now;

      if (diff <= 0) {
        // Ẩn phần đếm ngược khi đếm ngược kết thúc
        if (countdownContainer) {
          countdownContainer.style.display = 'none';
        }
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      if (countdownEls.days) countdownEls.days.textContent = padZero(days);
      if (countdownEls.hours) countdownEls.hours.textContent = padZero(hours);
      if (countdownEls.minutes) countdownEls.minutes.textContent = padZero(minutes);
      if (countdownEls.seconds) countdownEls.seconds.textContent = padZero(seconds);
    };

    // Chỉ gọi updateCountdown nếu các element tồn tại
    if (countdownEls.days && countdownEls.hours && countdownEls.minutes && countdownEls.seconds) {
      updateCountdown();
      setInterval(updateCountdown, 1000);
    }

    // ==================== DOCUMENT PREVIEW MODAL ====================
    const modal = document.getElementById('vk-modal');
    const iframeEl = document.getElementById('vk-iframe');
    const titleEl = document.getElementById('vk-title');
    const metaEl = document.getElementById('vk-meta');
    const openBtn = document.getElementById('vk-open');
    let __vk_prevFocus = null;

    const toEmbedURL = (url) => {
      try {
        const u = new URL(url, location.href);
        if (u.hostname.includes('docs.google.com')) {
          return u.href.replace(/\/edit(\?.*)?$/i, '/preview');
        }
        if (u.hostname.includes('drive.google.com')) {
          if (u.pathname.includes('/file/d/') && u.pathname.includes('/view')) {
            return u.href.replace(/\/view(\?.*)?$/i, '/preview');
          }
          if (u.pathname.includes('/preview')) {
            return u.href;
          }
        }
        return u.href;
      } catch (error) {
        return url;
      }
    };

    const openPreview = (doc) => {
      if (!modal) return;
      titleEl.textContent = doc.title;
      metaEl.textContent = doc.tag;
      iframeEl.src = doc.embed;
      if (openBtn) openBtn.href = doc.href;
      modal.classList.add('open');
      modal.classList.remove('hidden');
      modal.setAttribute('aria-hidden', 'false');
      __vk_prevFocus = document.activeElement;
      document.body.style.overflow = 'hidden';
      modal.querySelector('[data-close]')?.focus();
    };

    window.openVKPreviewFromSibling = function (btn, title) {
      const wrapper = btn.parentElement;
      const fullLink = wrapper?.querySelector('a[href]');
      if (!fullLink) { return; }
      const url = fullLink.href;
      const embed = toEmbedURL(url);
      const tag = title.toLowerCase().includes('báo cáo') ? 'Báo cáo' : 'Văn kiện';
      openPreview({ title, tag, href: url, embed });
    };

    window.openVKPreview = function (url, title = 'Văn kiện') {
      const embed = toEmbedURL(url);
      openPreview({ title, tag: 'Văn kiện', href: url, embed });
    };

    const closePreview = () => {
      if (!modal) return;
      iframeEl.src = '';
      modal.classList.remove('open');
      modal.classList.add('hidden');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      if (__vk_prevFocus) {
        __vk_prevFocus.focus();
        __vk_prevFocus = null;
      }
    };

    modal?.addEventListener('click', (event) => {
      if (event.target === modal || event.target.getAttribute('data-close') !== null) {
        closePreview();
      }
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && modal?.classList.contains('open')) {
        closePreview();
      }
    });

    // ==================== REACTIONS ====================
    document.querySelectorAll('.reaction-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const countEl = btn.querySelector('.reaction-count');
        const current = Number(countEl.textContent) || 0;
        countEl.textContent = current + 1;
        btn.classList.add('active');
      });
    });

    // ==================== ACCORDION TOGGLE ====================
    function toggleAccordion(index) {
      const content = document.getElementById(`accordion-${index}`);
      if (!content) return;
      const header = content.previousElementSibling;
      // Tìm icon bằng class accordion-icon trong header
      const icon = header ? header.querySelector('.accordion-icon') : null;
      
      content.classList.toggle('active');
      if (header) header.classList.toggle('active');
      
      // Rotate icon
      if (icon) {
        if (content.classList.contains('active')) {
          icon.style.transform = 'rotate(180deg)';
        } else {
          icon.style.transform = 'rotate(0deg)';
        }
      }
    }

    // ==================== BOTTOM NAVIGATION ACTIVE STATE ====================
    document.addEventListener('DOMContentLoaded', () => {
      const sections = document.querySelectorAll('section[id]');
      const navItems = document.querySelectorAll('.bottom-nav-item[data-section]');

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const currentId = entry.target.getAttribute('id');
            navItems.forEach(item => {
              if (item.getAttribute('data-section') === currentId) {
                item.classList.add('active');
                // Highlight color styling is handled by CSS group-[.active]
              } else {
                item.classList.remove('active');
              }
            });
          }
        });
      }, { threshold: 0.3, rootMargin: "-10% 0px -10% 0px" });

      sections.forEach(section => observer.observe(section));

      // Click handler for manual navigation
      document.querySelectorAll('.bottom-nav-item[data-section]').forEach(item => {
        item.addEventListener('click', function () {
          document.querySelectorAll('.bottom-nav-item').forEach(nav => nav.classList.remove('active'));
          this.classList.add('active');
        });
      });
    });

    // ==================== FEEDBACK FUNCTION ====================
    function openFeedback() {
      const feedback = prompt('📝 Góp ý của bạn về Đại hội:\n\n(Ý kiến của bạn rất quan trọng để chúng tôi cải thiện)');
      if (feedback && feedback.trim() !== '') {
        alert('✅ Cảm ơn bạn đã đóng góp ý kiến!\n\nChúng tôi sẽ ghi nhận và cải thiện trong thời gian tới.');
        console.log('Feedback:', feedback);
      }
    }

    // ==================== PODCAST PLAYER ====================
    const podcastPlayer = {
      audio: document.getElementById('podcast-audio'),
      stickyPlayer: document.getElementById('sticky-player'),
      playerToggle: document.getElementById('player-toggle'),
      playerIcon: document.getElementById('player-icon'),
      playerTitle: document.getElementById('player-title'),
      playerProgress: document.getElementById('player-progress'),
      playerProgressContainer: document.getElementById('player-progress-container'),
      playerCurrentTime: document.getElementById('player-current-time'),
      playerDuration: document.getElementById('player-duration'),
      playerClose: document.getElementById('player-close'),
      playerWave: document.getElementById('player-wave'),
      currentPodcastIndex: -1,
      isPlaying: false,
      autoHideTimer: null,

      init() {
        // Play buttons on cards
        document.querySelectorAll('.podcast-play-btn').forEach(btn => {
          btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const src = btn.dataset.src;
            const title = btn.dataset.title;
            const card = btn.closest('.podcast-card');
            const index = parseInt(card.dataset.podcastIndex);
            this.loadAndPlay(src, title, index);
          });
        });

        // Toggle play/pause
        this.playerToggle?.addEventListener('click', () => this.togglePlay());

        // Close player
        this.playerClose?.addEventListener('click', () => this.closePlayer());

        // Progress bar click
        this.playerProgressContainer?.addEventListener('click', (e) => {
          const rect = this.playerProgressContainer.getBoundingClientRect();
          const percent = (e.clientX - rect.left) / rect.width;
          if (this.audio.duration) {
            this.audio.currentTime = percent * this.audio.duration;
          }
        });

        // Audio events
        this.audio?.addEventListener('timeupdate', () => this.updateProgress());
        this.audio?.addEventListener('loadedmetadata', () => this.updateDuration());
        this.audio?.addEventListener('ended', () => this.onEnded());
        this.audio?.addEventListener('play', () => this.onPlay());
        this.audio?.addEventListener('pause', () => this.onPause());
      },

      clearAutoHide() {
        if (this.autoHideTimer) {
          clearTimeout(this.autoHideTimer);
          this.autoHideTimer = null;
        }
      },

      formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
      },

      loadAndPlay(src, title, index) {
        this.clearAutoHide();

        // Remove playing state from all cards
        document.querySelectorAll('.podcast-card').forEach(card => {
          card.classList.remove('playing');
        });

        // If clicking same podcast, toggle play/pause
        if (this.currentPodcastIndex === index && this.audio.src.includes(src)) {
          this.togglePlay();
          return;
        }

        // Load new audio
        this.audio.src = src;
        this.playerTitle.textContent = title;
        this.currentPodcastIndex = index;

        // Show sticky player
        this.stickyPlayer.classList.remove('translate-y-full');

        // Play
        this.audio.play().catch(err => console.log('Autoplay blocked:', err));

        // Add playing state to current card
        const currentCard = document.querySelector(`.podcast-card[data-podcast-index="${index}"]`);
        currentCard?.classList.add('playing');
      },

      togglePlay() {
        if (this.audio.paused) {
          this.audio.play();
        } else {
          this.audio.pause();
        }
      },

      onPlay() {
        this.clearAutoHide();
        this.isPlaying = true;
        this.playerIcon.classList.remove('fa-play');
        this.playerIcon.classList.add('fa-pause');
        this.playerWave?.classList.remove('hidden');
        
        // Update card state
        const currentCard = document.querySelector(`.podcast-card[data-podcast-index="${this.currentPodcastIndex}"]`);
        currentCard?.classList.add('playing');
      },

      onPause() {
        this.isPlaying = false;
        this.playerIcon.classList.remove('fa-pause');
        this.playerIcon.classList.add('fa-play');
        this.playerWave?.classList.add('hidden');
        
        // Update card state
        const currentCard = document.querySelector(`.podcast-card[data-podcast-index="${this.currentPodcastIndex}"]`);
        currentCard?.classList.remove('playing');
      },

      onEnded() {
        this.onPause();
        this.playerProgress.style.width = '0%';
        this.playerCurrentTime.textContent = '0:00';
        this.autoHideTimer = setTimeout(() => this.closePlayer(), 1500);
      },

      updateProgress() {
        if (this.audio.duration) {
          const percent = (this.audio.currentTime / this.audio.duration) * 100;
          this.playerProgress.style.width = `${percent}%`;
          this.playerCurrentTime.textContent = this.formatTime(this.audio.currentTime);
        }
      },

      updateDuration() {
        this.playerDuration.textContent = this.formatTime(this.audio.duration);
      },

      closePlayer() {
        this.clearAutoHide();
        this.audio.pause();
        this.audio.currentTime = 0;
        this.stickyPlayer.classList.add('translate-y-full');
        this.currentPodcastIndex = -1;
        
        // Remove playing state from all cards
        document.querySelectorAll('.podcast-card').forEach(card => {
          card.classList.remove('playing');
        });
      }
    };

    // Initialize podcast player
    podcastPlayer.init();

    // ==================== SMOOTH SCROLL BEHAVIOR ====================
    document.querySelectorAll('a[href^="#"]:not([download]):not([data-no-smooth-scroll]):not(#download-link)').forEach(anchor => {
      anchor.addEventListener('click', function (event) {
        const href = this.getAttribute('href');
        // Bỏ qua nếu không phải anchor link hợp lệ
        if (!href || !href.startsWith('#') || href === '#' || 
            href.startsWith('data:')) {
          return;
        }
        event.preventDefault();
        const target = document.querySelector(href);
        if (!target) return;
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      });
    });

    const authorBtn = document.getElementById('authorBtn');
    const authorModal = document.getElementById('authorModal');
    const authorClose = document.getElementById('authorClose');

    const toggleAuthorModal = (show) => {
      if (!authorModal) return;
      authorModal.classList.toggle('active', show);
      authorModal.setAttribute('aria-hidden', show ? 'false' : 'true');
      document.body.style.overflow = show ? 'hidden' : '';
    };

    authorBtn?.addEventListener('click', () => toggleAuthorModal(true));
    authorClose?.addEventListener('click', () => toggleAuthorModal(false));
    authorModal?.addEventListener('click', (event) => {
      if (event.target === authorModal) toggleAuthorModal(false);
    });

    // ==================== MINIGAME LOGIC ====================
    // 1. Ngân hàng 15 câu hỏi (Dữ liệu chuẩn từ Văn kiện)
    const fullQuizData = [
      { q: "Khẩu hiệu hành động của Đại hội Đại biểu Đoàn TNCS Hồ Chí Minh tỉnh Phú Thọ lần thứ I, nhiệm kỳ 2025 – 2030 là gì?", a: ["Tiên Phong - Sáng tạo - Đoàn kết - Phát triển", "Tiên Phong - Đoàn kết - Bản lĩnh - Đột phá - Phát triển", "Xung kích - Tình nguyện - Sáng tạo - Phát triển", "Xây dựng quê hương Phú Thọ giàu đẹp, văn minh và hiện đại"], correct: 1 },
      { q: "Tiêu đề của Báo cáo Chính trị trình tại Đại hội là gì?", a: ["Tuổi trẻ Đất Tổ xung kích, sáng tạo...", "Tuổi trẻ Đất Tổ tự hào, vững tin theo Đảng, phát huy tinh thần đoàn kết, khát vọng, xung kích, sáng tạo, xây dựng tỉnh Phú Thọ văn minh, hiện đại, vươn mình mạnh mẽ trong kỷ nguyên mới.", "Tuổi trẻ Đất Tổ bản lĩnh, sáng tạo, hội nhập, phát triển", "Xung kích, tình nguyện vì cộng đồng và bảo vệ Tổ quốc"], correct: 1 },
      { q: "Trong giai đoạn 2022 – 2025, Đoàn TNCS Hồ Chí Minh tỉnh Phú Thọ đã vận động được bao nhiêu Đoàn viên thanh niên lên đường nhập ngũ?", a: ["16.155 Đoàn viên thanh niên", "17.679 Đoàn viên thanh niên", "19.800 Đoàn viên thanh niên", "21.650 Đoàn viên thanh niên"], correct: 1 },
      { q: "Tính đến hết ngày 31/10/2025, tổng nguồn vốn dư nợ do tổ chức Đoàn quản lý ủy thác qua NHCSXH là bao nhiêu?", a: ["2.657 tỷ đồng", "3.635.029,81 triệu đồng", "978 tỷ đồng", "660 tỷ đồng"], correct: 1 },
      { q: "Giai đoạn 2022 – 2025, Đoàn các cấp đã thi công hoàn thành tổng cộng bao nhiêu công trình thanh niên các cấp (tỉnh, huyện, cơ sở)?", a: ["5.645 công trình", "6.364 công trình", "7.140 công trình", "885 công trình"], correct: 1 },
      { q: "Chỉ tiêu về số lượng đoàn viên ưu tú được giới thiệu cho Đảng xem xét, kết nạp trong nhiệm kỳ 2025 – 2030 là bao nhiêu?", a: ["16.800 đoàn viên ưu tú", "21.650 đoàn viên ưu tú", "25.000 đoàn viên ưu tú", "30.000 đoàn viên ưu tú"], correct: 2 },
      { q: "Trong giai đoạn 2022 – 2025, tổng số đoàn viên mới được kết nạp là bao nhiêu?", a: ["60.000 đoàn viên", "80.000 đoàn viên", "85.500 đoàn viên", "95.000 đoàn viên"], correct: 2 },
      { q: "Theo Dự thảo Báo cáo Chính trị, tỷ lệ đoàn kết tập hợp thanh niên toàn tỉnh đạt được trong giai đoạn 2022 – 2025 là bao nhiêu?", a: ["65%", "70%", "72%", "80%"], correct: 2 },
      { q: "Chỉ tiêu về tỷ lệ đoàn kết tập hợp thanh niên cần đạt được vào cuối nhiệm kỳ 2025 – 2030 là bao nhiêu?", a: ["Đạt ít nhất 70%", "Đạt ít nhất 72%", "Đạt ít nhất 80%", "Đạt ít nhất 85%"], correct: 2 },
      { q: "Trong giai đoạn 2022 – 2025, Đoàn các cấp đã hỗ trợ xây dựng/sửa chữa bao nhiêu nhà nhân ái, nhà tình nghĩa, nhà khăn quàng đỏ với tổng trị giá trên 8 tỷ đồng?", a: ["74 nhà", "82 nhà", "119 nhà", "125 nhà"], correct: 1 },
      { q: "Trong nhiệm kỳ 2025 – 2030, Đoàn tỉnh Phú Thọ đề ra bao nhiêu nhóm chỉ tiêu trọng tâm với tổng số chỉ tiêu cụ thể?", a: ["3 nhóm chỉ tiêu, 12 chỉ tiêu cụ thể", "4 nhóm chỉ tiêu, 15 chỉ tiêu cụ thể", "5 nhóm chỉ tiêu, 18 chỉ tiêu cụ thể", "6 nhóm chỉ tiêu, 20 chỉ tiêu cụ thể"], correct: 1 },
      { q: "Trong giai đoạn 2022 – 2025, Đoàn đã hỗ trợ hiện thực hóa bao nhiêu ý tưởng, sáng kiến của đoàn viên, thanh niên so với chỉ tiêu đề ra (5.850 ý tưởng)?", a: ["5.850 ý tưởng", "6.250 ý tưởng", "Trên 45.000 ý tưởng", "119 ý tưởng"], correct: 1 },
      { q: "Nhiệm kỳ 2025 – 2030 đặt ra chỉ tiêu về Phong trào Thanh niên tình nguyện là bao nhiêu lượt đoàn viên, thanh niên tham gia hoạt động tình nguyện do Đoàn, Hội tổ chức?", a: ["560.000 lượt", "1,5 triệu lượt", "2,5 triệu lượt", "300 công trình"], correct: 2 },
      { q: "Trong nhiệm kỳ 2025 – 2030, Đoàn tỉnh Phú Thọ đặt ra bao nhiêu nhiệm vụ đột phá?", a: ["2 nhiệm vụ đột phá", "3 nhiệm vụ đột phá", "4 nhiệm vụ đột phá", "5 nhiệm vụ đột phá"], correct: 1 },
      { q: "Một trong những kết quả vượt chỉ tiêu của Đoàn trong giai đoạn 2022 – 2025 là trồng mới được bao nhiêu cây xanh?", a: ["1.950.000 cây xanh", "2.329.500 cây xanh", "5.645 cây xanh", "Trên 500 nghìn cây xanh"], correct: 1 }
    ];

    // 2. Biến khởi tạo
    let quizData = []; 
    let currentQ = 0;
    let score = 0;
    let answered = false;

    // 3. Các element giao diện
    const screens = {
      start: document.getElementById('quiz-start'),
      question: document.getElementById('quiz-question'),
      result: document.getElementById('quiz-result')
    };
    const els = {
      text: document.getElementById('q-text'),
      options: document.getElementById('q-options'),
      current: document.getElementById('q-current'),
      score: document.getElementById('q-score'),
      feedback: document.getElementById('q-feedback'),
      nextBtn: document.getElementById('next-btn')
    };

    // 4. Hàm xáo trộn mảng (Fisher-Yates Shuffle)
    function shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    }

    // 5. Bắt đầu Game
    function startQuiz() {
      // Lấy ngẫu nhiên 5 câu từ kho 15 câu
      quizData = shuffleArray([...fullQuizData]).slice(0, 5);
      
      currentQ = 0;
      score = 0;
      screens.start.classList.add('hidden');
      screens.result.classList.add('hidden');
      screens.question.classList.remove('hidden');
      loadQuestion();
    }

    // 6. Tải câu hỏi
    function loadQuestion() {
      answered = false;
      const data = quizData[currentQ];
      
      els.text.textContent = data.q;
      els.current.textContent = (currentQ + 1).toString().padStart(2, '0');
      els.score.textContent = score.toString().padStart(3, '0');
      els.feedback.classList.add('hidden');
      els.nextBtn.classList.add('hidden');
      
      // Tạo nút chọn đáp án
      els.options.innerHTML = '';
      data.a.forEach((opt, index) => {
        const btn = document.createElement('div');
        btn.className = 'cyber-option p-4 rounded-lg text-left font-semibold cursor-pointer select-none';
        btn.textContent = opt;
        btn.onclick = () => checkAnswer(index, btn);
        els.options.appendChild(btn);
      });
    }

    // 7. Kiểm tra đáp án
    function checkAnswer(selectedIndex, btn) {
      if (answered) return;
      answered = true;
      
      const data = quizData[currentQ];
      const isCorrect = selectedIndex === data.correct;
      const options = els.options.children;

      // Hiển thị kết quả trên các nút (dùng class cyber-option)
      options[data.correct].classList.add('correct');
      if (!isCorrect) {
        btn.classList.add('wrong');
        // Khi trả lời sai, hiển thị nút "THỬ LẠI" ngay lập tức
        els.feedback.textContent = "✗ SAI! Đáp án đúng: " + data.a[data.correct];
        els.feedback.className = `mt-6 p-4 border border-l-4 rounded bg-black/40 text-sm font-mono tracking-wide border-red-500 text-red-300`;
        els.feedback.classList.remove('hidden');
        
        // Thay nút Next bằng nút THỬ LẠI
        els.nextBtn.textContent = "THỬ LẠI";
        els.nextBtn.className = "mt-6 w-full py-3 bg-red-600 hover:bg-red-500 text-white border border-red-400 font-bold uppercase tracking-widest transition-all cursor-pointer font-game";
        els.nextBtn.onclick = resetQuiz;
        els.nextBtn.classList.remove('hidden');
        return; // Dừng lại, không tiếp tục
      } else {
        score += 10;
        // Hiệu ứng pháo giấy nhỏ khi đúng
        if (typeof confetti === 'function') {
          confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
        }
      }

      els.score.textContent = score.toString().padStart(3, '0');

      // Hiển thị lời giải thích
      els.feedback.textContent = "✓ CHÍNH XÁC!";
      els.feedback.className = `mt-6 p-4 border border-l-4 rounded bg-black/40 text-sm font-mono tracking-wide border-green-500 text-green-300`;
      els.feedback.classList.remove('hidden');
      
      // Đổi nút Next (chỉ khi trả lời đúng)
      els.nextBtn.textContent = (currentQ < quizData.length - 1) ? "TIẾP TỤC >>" : "XEM KẾT QUẢ";
      els.nextBtn.className = "mt-6 w-full py-3 bg-white/10 hover:bg-gold hover:text-deep-blue text-white border border-white/20 font-bold uppercase tracking-widest transition-all cursor-pointer";
      els.nextBtn.onclick = nextQuestion;
      els.nextBtn.classList.remove('hidden');
    }

    // 8. Chuyển câu
    function nextQuestion() {
      if (currentQ < quizData.length - 1) {
        currentQ++;
        loadQuestion();
      } else {
        showResult();
      }
    }

    // 9. Hiển thị màn kết quả
    function showResult() {
      screens.question.classList.add('hidden');
      screens.result.classList.remove('hidden');
      
      const title = document.getElementById('result-title');
      const msg = document.getElementById('result-msg');
      const icon = document.getElementById('result-icon');
      const inputForm = document.getElementById('input-form');
      const retryContainer = document.getElementById('retry-container');

      if (score === 50) { // 5/5 câu đúng - Hiển thị form tạo Huy hiệu
        // Reset badge selection khi hiển thị form mới
        selectedDelegateBadge = null;
        const badgeSearchSection = document.getElementById('badge-search-section');
        const badgeSelectedInfo = document.getElementById('badge-selected-info');
        const badgeSearchInput = document.getElementById('badge-search-input');
        const badgeSuggestionBox = document.getElementById('badge-suggestion-box');
        
        if (badgeSearchSection) badgeSearchSection.classList.remove('hidden');
        if (badgeSelectedInfo) badgeSelectedInfo.classList.add('hidden');
        if (badgeSearchInput) badgeSearchInput.value = '';
        if (badgeSuggestionBox) badgeSuggestionBox.classList.add('hidden');
        
        icon.innerHTML = "🏆";
        title.textContent = "XUẤT SẮC!";
        title.className = "text-2xl font-black uppercase mb-2 text-[#d4af37] font-game text-shadow-strong";
        msg.textContent = "Đồng chí đã trả lời đúng 5/5 câu hỏi. Hãy tạo Huy hiệu Chứng nhận!";
        inputForm.classList.remove('hidden');
        retryContainer.classList.add('hidden');
        
        // Hiệu ứng pháo giấy lớn
        if (typeof confetti === 'function') {
          var duration = 3 * 1000;
          var end = Date.now() + duration;
          (function frame() {
            confetti({ particleCount: 3, angle: 60, spread: 55, origin: { x: 0 } });
            confetti({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1 } });
            if (Date.now() < end) requestAnimationFrame(frame);
          }());
        }
      } else {
        icon.innerHTML = "📊";
        title.textContent = "CHƯA ĐẠT!";
        title.className = "text-2xl font-black uppercase mb-2 text-white font-game";
        msg.textContent = `Kết quả: ${score/10}/5 câu đúng. Cần trả lời đúng 5/5 câu hỏi để nhận Huy hiệu. Hãy thử lại!`;
        inputForm.classList.add('hidden');
        retryContainer.classList.remove('hidden');
      }
    }

    // 10. Chơi lại
    function resetQuiz() {
      screens.result.classList.add('hidden');
      screens.start.classList.remove('hidden');
      // Reset badge form khi chơi lại
      resetBadgeForm();
    }

    // ==================== TẠO HUY HIỆU CHỨNG NHẬN ====================
    // =========================================================================
    // KHU VỰC DÁN MÃ BASE64 - DÁN VÀO GIỮA 2 DẤU NGOẶC KÉP
    // =========================================================================
    const RAW_HUYHIEU = ""; // Dán mã base64 của assets/images/huyhieu.png vào đây nếu cần
    const RAW_LOGO = "";    // Dán mã base64 của assets/images/logo.png vào đây nếu cần
    // =========================================================================

    function smartFixBase64(inputStr) {
      if (!inputStr || inputStr.includes("DÁN_MÃ") || inputStr === "") return null;
      let cleanStr = inputStr.trim();
      if (cleanStr.startsWith('url(')) cleanStr = cleanStr.replace(/^url\(['"]?/, '').replace(/['"]?\)$/, '');
      if (cleanStr.startsWith('data:image')) return cleanStr;
      if (cleanStr.startsWith('iVBOR')) return "data:image/png;base64," + cleanStr;
      if (cleanStr.startsWith('/9j/')) return "data:image/jpeg;base64," + cleanStr;
      return "data:image/png;base64," + cleanStr;
    }

    async function generateBadge() {
      // Sử dụng selectedDelegateBadge nếu có, nếu không thì lấy từ input (fallback)
      let userName, userUnit;
      
      if (selectedDelegateBadge) {
        userName = selectedDelegateBadge.name;
        userUnit = selectedDelegateBadge.unit;
      } else {
        // Fallback cho trường hợp nhập thủ công (nếu còn input cũ)
        const nameInput = document.getElementById('user-name');
        const unitInput = document.getElementById('user-unit');
        if (nameInput && unitInput) {
          userName = nameInput.value.trim();
          userUnit = unitInput.value.trim();
        }
      }
      
      if (!userName) {
        alert('Vui lòng chọn hoặc nhập họ và tên!');
        return;
      }
      if (!userUnit) {
        alert('Vui lòng chọn hoặc nhập đơn vị!');
        return;
      }

      const finalHuyHieu = smartFixBase64(RAW_HUYHIEU);
      const finalLogo = smartFixBase64(RAW_LOGO);

      await document.fonts.ready;

      const canvas = document.getElementById('badgeCanvas');
      const ctx = canvas.getContext('2d');
      const width = 1200;
      const height = 1800;

      const btn = document.querySelector('button[onclick="generateBadge()"]');
      const originalText = btn.innerHTML;
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang xử lý...';
      
      try {
        const badgeIcon = await loadImageAsync(finalHuyHieu || 'assets/images/huyhieu.png');
        const logoImg = await loadImageAsync(finalLogo || 'assets/images/logo.png');
        drawBadge(ctx, width, height, logoImg, badgeIcon, userName, userUnit);
      } catch (error) {
        console.error(error);
        alert("Lỗi: " + error.message);
      } finally {
        btn.innerHTML = originalText;
      }
    }

    function downloadBadge() {
      const canvas = document.getElementById('badgeCanvas');
      if (canvas.width === 0) return;
      const dataURL = canvas.toDataURL('image/png');
      
      // Lấy tên từ selectedDelegateBadge hoặc input
      let userName;
      if (selectedDelegateBadge) {
        userName = selectedDelegateBadge.name;
      } else {
        const nameInput = document.getElementById('user-name');
        if (nameInput) {
          userName = nameInput.value.trim();
        }
      }
      const safeName = userName ? userName.replace(/\s+/g, '_') : 'ChungNhan';
      const link = document.createElement('a');
      link.href = dataURL;
      link.download = `HuyHieu_${safeName}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    function loadImageAsync(src) {
      return new Promise((resolve) => {
        if (!src) { resolve(null); return; }
        const img = new Image();
        if (src.startsWith('http')) img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.onerror = () => { console.warn("Lỗi tải ảnh: " + src); resolve(null); };
        img.src = src;
      });
    }

    function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
      const words = text.split(' ');
      let line = '';
      let currentY = y;
      for(let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && n > 0) {
          ctx.fillText(line, x, currentY);
          line = words[n] + ' ';
          currentY += lineHeight;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, x, currentY);
      return currentY;
    }

    function drawBadge(ctx, width, height, logo, huyhieu, userName, userUnit) {
      // 1. NỀN & KHUNG
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, '#001f3f');
      gradient.addColorStop(0.5, '#002855');
      gradient.addColorStop(1, '#005b7f');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      ctx.strokeStyle = '#d4af37';
      ctx.lineWidth = 14;
      ctx.strokeRect(40, 40, width - 80, height - 80);
      
      ctx.strokeStyle = 'rgba(212, 175, 55, 0.4)';
      ctx.lineWidth = 3;
      ctx.strokeRect(70, 70, width - 140, height - 140);

      const cornerSize = 90;
      ctx.fillStyle = '#d4af37';
      [[40,40], [width-40,40], [40,height-40], [width-40,height-40]].forEach(([cx, cy]) => {
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + (cx < width/2 ? cornerSize : -cornerSize), cy);
        ctx.lineTo(cx, cy + (cy < height/2 ? cornerSize : -cornerSize));
        ctx.fill();
      });

      ctx.textAlign = 'center';

      // 2. HEADER
      ctx.fillStyle = '#d4af37';
      ctx.font = 'bold 32px "Be Vietnam Pro", Arial';
      ctx.fillText('ĐẠI HỘI ĐẠI BIỂU ĐOÀN TNCS HỒ CHÍ MINH TỈNH PHÚ THỌ', width / 2, 130);
      ctx.font = 'bold 28px "Be Vietnam Pro", Arial';
      ctx.fillText('LẦN THỨ NHẤT, NHIỆM KỲ 2025 - 2030', width / 2, 175);

      // 3. LOGO & DANH HIỆU
      let currentY = 220; 

      if (logo) {
        const hhSize = 190;
        const hhX = (width - hhSize) / 2;
        ctx.beginPath();
        ctx.arc(width / 2, currentY + hhSize / 2, hhSize / 2 + 30, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 168, 198, 0.15)';
        ctx.fill();
        ctx.drawImage(logo, hhX, currentY, hhSize, hhSize);
        currentY += hhSize + 50; 
      } else {
        currentY += 100;
      }

      // CHỨNG NHẬN
      ctx.fillStyle = '#00a8c6';
      ctx.font = 'bold 36px "Be Vietnam Pro", Arial';
      ctx.fillText('✦ CHỨNG NHẬN ✦', width / 2, currentY);
      currentY += 90;

      // SỨ GIẢ NGHỊ QUYẾT
      ctx.fillStyle = '#fce9b1';
      ctx.shadowColor = 'rgba(0,0,0,0.8)';
      ctx.shadowBlur = 25;
      ctx.font = 'bold 72px "Be Vietnam Pro", Arial';
      ctx.fillText('SỨ GIẢ NGHỊ QUYẾT', width / 2, currentY);
      ctx.shadowBlur = 0;
      currentY += 30;

      // Đường kẻ
      ctx.strokeStyle = '#d4af37';
      ctx.lineWidth = 4;
      ctx.beginPath(); ctx.moveTo(150, currentY); ctx.lineTo(width - 150, currentY); ctx.stroke();
      currentY += 80;

      // 4. THÔNG TIN CÁ NHÂN
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 56px "Be Vietnam Pro", Arial';
      ctx.fillText(userName.toUpperCase(), width / 2, currentY);
      currentY += 60;

      ctx.fillStyle = '#00a8c6';
      ctx.font = 'italic 34px "Be Vietnam Pro", Arial';
      currentY = wrapText(ctx, userUnit, width / 2, currentY, width - 250, 50);
      // Safety check: ensure currentY is finite after wrapText
      if (!Number.isFinite(currentY)) {
        currentY = 800; // Default fallback value
      }
      currentY += 30;

      ctx.strokeStyle = '#d4af37';
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(250, currentY); ctx.lineTo(width - 250, currentY); ctx.stroke();
      currentY += 70;

      // 5. THÀNH TÍCH
      ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
      ctx.font = '32px "Be Vietnam Pro", Arial';
      ctx.fillText('Đã hoàn thành xuất sắc thử thách', width / 2, currentY);
      currentY += 50;

      ctx.fillStyle = '#d4af37';
      ctx.font = 'bold 38px "Be Vietnam Pro", Arial';
      ctx.fillText('"CHINH PHỤC NGHỊ QUYẾT"', width / 2, currentY);
      
      // HUY HIỆU NỔI BẬT Ở THÂN
      if (huyhieu) {
        const wmSize = 630;
        let wmY = currentY + 40;
        let wmX = (width - wmSize) / 2;
        // Safety check: ensure wmY and wmX are finite
        if (!Number.isFinite(wmY)) {
          wmY = height / 2 - wmSize / 2; // Center vertically
        }
        if (!Number.isFinite(wmX)) {
          wmX = (width - wmSize) / 2; // Center horizontally
        }

        ctx.save();

        // Vòng sáng làm nổi bật huy hiệu - tăng cường
        const glowRadius = wmSize * 0.75;
        const glowX = width / 2;
        let glowY = wmY + wmSize / 2;
        // Safety check: ensure glowY is finite before creating radial gradient
        if (!Number.isFinite(glowY)) {
          glowY = height / 2; // Fallback to center of canvas
        }
        // Ensure wmY is also finite for image drawing
        if (!Number.isFinite(wmY)) {
          wmY = height / 2 - wmSize / 2;
        }
        // Additional safety checks for glowX and glowRadius
        const safeGlowX = Number.isFinite(glowX) ? glowX : width / 2;
        const safeGlowRadius = Number.isFinite(glowRadius) ? glowRadius : 200;
        const glowGradient = ctx.createRadialGradient(
          safeGlowX, glowY, safeGlowRadius * 0.1,
          safeGlowX, glowY, safeGlowRadius
        );
        glowGradient.addColorStop(0, 'rgba(0, 168, 198, 0.6)');
        glowGradient.addColorStop(0.5, 'rgba(0, 168, 198, 0.3)');
        glowGradient.addColorStop(1, 'rgba(0, 168, 198, 0)');
        ctx.fillStyle = glowGradient;
        ctx.beginPath();
        ctx.arc(safeGlowX, glowY, safeGlowRadius, 0, Math.PI * 2);
        ctx.fill();

        // Vòng sáng vàng bên ngoài
        const goldGlowGradient = ctx.createRadialGradient(
          safeGlowX, glowY, wmSize * 0.4,
          safeGlowX, glowY, wmSize * 0.7
        );
        goldGlowGradient.addColorStop(0, 'rgba(212, 175, 55, 0.4)');
        goldGlowGradient.addColorStop(1, 'rgba(212, 175, 55, 0)');
        ctx.fillStyle = goldGlowGradient;
        ctx.beginPath();
        ctx.arc(safeGlowX, glowY, wmSize * 0.7, 0, Math.PI * 2);
        ctx.fill();

        // Vẽ huy hiệu nổi bật - độ đậm cao
        ctx.globalAlpha = 0.85;
        ctx.shadowColor = 'rgba(0, 168, 198, 0.8)';
        ctx.shadowBlur = 30;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.drawImage(huyhieu, wmX, wmY, wmSize, wmSize);
        ctx.shadowBlur = 0;

        ctx.restore();
      }

      // 6. CHÂN TRANG
      let bottomY = height - 250; 
      
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.font = 'italic 30px "Be Vietnam Pro", Arial';
      
      // Câu Slogan dài (tự động xuống dòng)
      const sloganFull = '"Tuổi trẻ Đất Tổ tự hào, vững tin theo Đảng, phát huy tinh thần đoàn kết, khát vọng, xung kích, sáng tạo, xây dựng tỉnh Phú Thọ văn minh, hiện đại, vươn mình mạnh mẽ trong kỷ nguyên mới"';
      wrapText(ctx, sloganFull, width / 2, bottomY, width - 250, 40);

      // Ngày tháng
      ctx.fillStyle = '#00a8c6';
      ctx.font = 'italic 28px "Be Vietnam Pro", Arial';
      const today = new Date();
      const dateStr = `Phú Thọ, ngày ${today.getDate()} tháng ${today.getMonth() + 1} năm ${today.getFullYear()}`;
      ctx.fillText(dateStr, width / 2, height - 70);

      // XUẤT ẢNH
      const canvasEl = document.getElementById('badgeCanvas');
      const dataURL = canvasEl.toDataURL('image/png');
      document.getElementById('badge-result-img').src = dataURL;
      
      // Ẩn form, hiện preview
      document.getElementById('input-form').classList.add('hidden');
      document.getElementById('badge-preview-container').classList.remove('hidden');
      document.getElementById('badge-preview-container').classList.add('flex');
    }

    function resetBadgeForm() {
      // Reset selected delegate
      selectedDelegateBadge = null;
      
      // Reset search UI
      const badgeSearchSection = document.getElementById('badge-search-section');
      const badgeSelectedInfo = document.getElementById('badge-selected-info');
      const badgeSearchInput = document.getElementById('badge-search-input');
      const badgeSuggestionBox = document.getElementById('badge-suggestion-box');
      
      if (badgeSearchSection) badgeSearchSection.classList.remove('hidden');
      if (badgeSelectedInfo) badgeSelectedInfo.classList.add('hidden');
      if (badgeSearchInput) badgeSearchInput.value = '';
      if (badgeSuggestionBox) badgeSuggestionBox.classList.add('hidden');
      
      // Fallback: Reset form inputs nếu còn tồn tại
      const nameInput = document.getElementById('user-name');
      const unitInput = document.getElementById('user-unit');
      if (nameInput) nameInput.value = '';
      if (unitInput) unitInput.value = '';
      
      // Hiện form, ẩn preview
      document.getElementById('input-form').classList.remove('hidden');
      document.getElementById('badge-preview-container').classList.add('hidden');
      document.getElementById('badge-preview-container').classList.remove('flex');
    }
    
    // ==================== BADGE SEARCH FUNCTIONS ====================
    function setupBadgeSearch() {
      try {
        const searchInput = document.getElementById('badge-search-input');
        const suggestionsEl = document.getElementById('badge-suggestion-box');
        const selectedCard = document.getElementById('badge-selected-info');
        const searchSection = document.getElementById('badge-search-section');

        if (!searchInput || !suggestionsEl || !selectedCard) {
          // Không có phần badge search, bỏ qua
          return;
        }

        // Kiểm tra delegates đã load chưa - retry tối đa 5 lần
        let retryCount = 0;
        const maxRetries = 5;
        
        const checkDelegates = () => {
          if (typeof delegates !== 'undefined' && delegates && delegates.length > 0) {
            initSearch();
          } else if (retryCount < maxRetries) {
            retryCount++;
            setTimeout(checkDelegates, 500);
          } else {
            console.warn('Delegates data could not be loaded. Badge search will be disabled.');
          }
        };

        const initSearch = () => {
          let searchTimeout = null;

          searchInput.addEventListener('input', (e) => {
            const query = e.target.value.trim();
            
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
              if (query.length < 2) {
                suggestionsEl.classList.add('hidden');
                return;
              }

              try {
                const normalizedQuery = normalizeText(query);
                const results = delegates.filter(d => {
                  const nameMatch = normalizeText(d.name).includes(normalizedQuery);
                  const unitMatch = normalizeText(d.unit).includes(normalizedQuery);
                  const positionMatch = normalizeText(d.position || '').includes(normalizedQuery);
                  return nameMatch || unitMatch || positionMatch;
                }).slice(0, 10);

                if (results.length === 0) {
                  suggestionsEl.innerHTML = `
                    <div class="p-4 text-center text-gray-300 text-sm">
                      <i class="fas fa-search text-gray-400 mb-2"></i>
                      <p>Không tìm thấy Đại biểu phù hợp</p>
                    </div>
                  `;
                  suggestionsEl.classList.remove('hidden');
                  return;
                }

                suggestionsEl.innerHTML = results.map((d, idx) => {
                  const originalIndex = delegates.findIndex(delegate => 
                    delegate.name === d.name && delegate.unit === d.unit
                  );
                  if (originalIndex === -1) return '';
                  return `
                  <div 
                    class="p-3 hover:bg-cyan-500/20 cursor-pointer transition-all border-b border-white/5 last:border-0"
                    onclick="selectDelegateBadge(${originalIndex})"
                  >
                    <div class="font-bold text-white text-sm mb-1">${d.name}</div>
                    <div class="text-xs text-cyan-200/70">${d.unit}</div>
                  </div>
                `;
                }).filter(Boolean).join('');
                suggestionsEl.classList.remove('hidden');
              } catch (err) {
                console.error('Error filtering delegates for badge:', err);
              }
            }, 200);
          });

          // Ẩn dropdown khi click ra ngoài
          document.addEventListener('click', (e) => {
            if (!searchInput.contains(e.target) && !suggestionsEl.contains(e.target)) {
              suggestionsEl.classList.add('hidden');
            }
          });
        };

        checkDelegates();
      } catch (err) {
        console.error('Error setting up badge search:', err);
      }
    }

    function selectDelegateBadge(index) {
      try {
        if (typeof delegates === 'undefined' || !delegates || index < 0 || index >= delegates.length) {
          alert('Dữ liệu Đại biểu chưa sẵn sàng. Vui lòng thử lại sau.');
          return;
        }
        
        selectedDelegateBadge = delegates[index];
        
        // Cập nhật UI
        const nameEl = document.getElementById('badge-selected-name');
        const positionEl = document.getElementById('badge-selected-position');
        const unitEl = document.getElementById('badge-selected-unit');
        
        if (nameEl) nameEl.textContent = selectedDelegateBadge.name;
        if (positionEl) positionEl.textContent = selectedDelegateBadge.position || '';
        if (unitEl) unitEl.textContent = selectedDelegateBadge.unit;
        
        // Ẩn search, hiện selected card
        const searchSection = document.getElementById('badge-search-section');
        const suggestionBox = document.getElementById('badge-suggestion-box');
        const selectedInfo = document.getElementById('badge-selected-info');
        const searchInput = document.getElementById('badge-search-input');
        
        if (searchSection) searchSection.classList.add('hidden');
        if (suggestionBox) suggestionBox.classList.add('hidden');
        if (selectedInfo) selectedInfo.classList.remove('hidden');
        if (searchInput) searchInput.value = '';
      } catch (err) {
        console.error('Error selecting delegate for badge:', err);
        alert('Có lỗi xảy ra khi chọn Đại biểu. Vui lòng thử lại.');
      }
    }

    function resetDelegateBadgeSelection() {
      try {
        selectedDelegateBadge = null;
        const searchSection = document.getElementById('badge-search-section');
        const selectedInfo = document.getElementById('badge-selected-info');
        const searchInput = document.getElementById('badge-search-input');
        const suggestionBox = document.getElementById('badge-suggestion-box');
        
        if (searchSection) searchSection.classList.remove('hidden');
        if (selectedInfo) selectedInfo.classList.add('hidden');
        if (searchInput) {
          searchInput.value = '';
          setTimeout(() => searchInput.focus(), 100);
        }
        if (suggestionBox) suggestionBox.classList.add('hidden');
      } catch (err) {
        console.error('Error resetting badge delegate selection:', err);
      }
    }

    // ==================== CONSOLE MESSAGE ====================
    console.log('%c🎉 Chào mừng đến với Đại hội Đoàn TNCS HCM tỉnh Phú Thọ!', 'color: #d4af37; font-size: 20px; font-weight: bold;');
    console.log('%c✨ Khát vọng đất tổ - Vươn mình trong kỷ nguyên số', 'color: #00a8c6; font-size: 16px;');
    console.log('%c💪 Tiên phong - Đoàn kết - Bản lĩnh - Đột phá - Phát triển', 'color: #ffffff; font-size: 14px;');

    // ==================== CHECK-IN CARD LOGIC ====================
    let userUploadedImage = null;
    const defaultLogo = 'assets/images/logo.png'; // Đường dẫn logo mặc định

    // Xử lý sự kiện Upload ảnh
    document.getElementById('user-photo').addEventListener('change', function(e) {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
          const img = new Image();
          img.onload = function() {
            userUploadedImage = img;
            document.getElementById('preview-img').src = event.target.result;
            document.getElementById('upload-placeholder').classList.add('hidden');
            document.getElementById('upload-preview').classList.remove('hidden');
          }
          img.src = event.target.result;
        }
        reader.readAsDataURL(file);
      }
    });

    // Helper: Wrap text (Xuống dòng tự động)
    function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
      const words = text.split(' ');
      let line = '';
      let currentY = y;

      for(let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        const testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
          ctx.fillText(line, x, currentY);
          line = words[n] + ' ';
          currentY += lineHeight;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, x, currentY);
    }

    // Helper: Load ảnh async
    function loadImage(src) {
      return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.onerror = () => resolve(null);
        img.src = src;
      });
    }

    // Hàm tạo thẻ (Core Logic)
    // ==================== CHECK-IN: TÌM KIẾM ĐẠI BIỂU ====================
    let selectedDelegate = null;
    
    // ==================== BADGE: TÌM KIẾM ĐẠI BIỂU ====================
    let selectedDelegateBadge = null;

    function setupCheckinSearch() {
      try {
        const searchInput = document.getElementById('search-input');
        const suggestionsEl = document.getElementById('suggestion-box');
        const selectedCard = document.getElementById('selected-info');
        const searchSection = document.getElementById('search-section');

        if (!searchInput || !suggestionsEl || !selectedCard) {
          // Không có phần check-in, bỏ qua
          return;
        }

        // Kiểm tra delegates đã load chưa - retry tối đa 5 lần
        let retryCount = 0;
        const maxRetries = 5;
        
        const checkDelegates = () => {
          if (typeof delegates !== 'undefined' && delegates && delegates.length > 0) {
            initSearch();
          } else if (retryCount < maxRetries) {
            retryCount++;
            setTimeout(checkDelegates, 500);
          } else {
            console.warn('Delegates data could not be loaded. Check-in search will be disabled.');
          }
        };

        const initSearch = () => {
          let searchTimeout = null;

          searchInput.addEventListener('input', (e) => {
            const query = e.target.value.trim();
            
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
              if (query.length < 2) {
                suggestionsEl.classList.add('hidden');
                return;
              }

              try {
                const normalizedQuery = normalizeText(query);
                const results = delegates.filter(d => {
                  const nameMatch = normalizeText(d.name).includes(normalizedQuery);
                  const unitMatch = normalizeText(d.unit).includes(normalizedQuery);
                  const positionMatch = normalizeText(d.position || '').includes(normalizedQuery);
                  return nameMatch || unitMatch || positionMatch;
                }).slice(0, 10);

                if (results.length === 0) {
                  suggestionsEl.innerHTML = `
                    <div class="p-4 text-center text-gray-300 text-sm">
                      <i class="fas fa-search text-gray-400 mb-2"></i>
                      <p>Không tìm thấy Đại biểu phù hợp</p>
                    </div>
                  `;
                  suggestionsEl.classList.remove('hidden');
                  return;
                }

                suggestionsEl.innerHTML = results.map((d, idx) => {
                  const originalIndex = delegates.findIndex(delegate => 
                    delegate.name === d.name && delegate.unit === d.unit
                  );
                  if (originalIndex === -1) return '';
                  return `
                  <div 
                    class="p-3 hover:bg-cyan-500/20 cursor-pointer transition-all border-b border-white/5 last:border-0"
                    onclick="selectDelegate(${originalIndex})"
                  >
                    <div class="font-bold text-white text-sm mb-1">${d.name}</div>
                    <div class="text-xs text-cyan-200/70">${d.unit}</div>
                  </div>
                `;
                }).filter(Boolean).join('');
                suggestionsEl.classList.remove('hidden');
              } catch (err) {
                console.error('Error filtering delegates:', err);
              }
            }, 200);
          });

          // Ẩn dropdown khi click ra ngoài
          document.addEventListener('click', (e) => {
            if (!searchInput.contains(e.target) && !suggestionsEl.contains(e.target)) {
              suggestionsEl.classList.add('hidden');
            }
          });
        };

        checkDelegates();
      } catch (err) {
        console.error('Error setting up check-in search:', err);
      }
    }

    function selectDelegate(index) {
      try {
        if (typeof delegates === 'undefined' || !delegates || index < 0 || index >= delegates.length) {
          alert('Dữ liệu Đại biểu chưa sẵn sàng. Vui lòng thử lại sau.');
          return;
        }
        
        selectedDelegate = delegates[index];
        
        // Cập nhật UI
        const nameEl = document.getElementById('selected-name');
        const positionEl = document.getElementById('selected-position');
        const unitEl = document.getElementById('selected-unit');
        
        if (nameEl) nameEl.textContent = selectedDelegate.name;
        if (positionEl) positionEl.textContent = selectedDelegate.position || '';
        if (unitEl) unitEl.textContent = selectedDelegate.unit;
        
        // Ẩn search, hiện selected card
        const searchSection = document.getElementById('search-section');
        const suggestionBox = document.getElementById('suggestion-box');
        const selectedInfo = document.getElementById('selected-info');
        const searchInput = document.getElementById('search-input');
        
        if (searchSection) searchSection.classList.add('hidden');
        if (suggestionBox) suggestionBox.classList.add('hidden');
        if (selectedInfo) selectedInfo.classList.remove('hidden');
        if (searchInput) searchInput.value = '';
      } catch (err) {
        console.error('Error selecting delegate:', err);
        alert('Có lỗi xảy ra khi chọn Đại biểu. Vui lòng thử lại.');
      }
    }

    function resetDelegateSelection() {
      try {
        selectedDelegate = null;
        const searchSection = document.getElementById('search-section');
        const selectedInfo = document.getElementById('selected-info');
        const searchInput = document.getElementById('search-input');
        const suggestionBox = document.getElementById('suggestion-box');
        
        if (searchSection) searchSection.classList.remove('hidden');
        if (selectedInfo) selectedInfo.classList.add('hidden');
        if (searchInput) {
          searchInput.value = '';
          setTimeout(() => searchInput.focus(), 100);
        }
        if (suggestionBox) suggestionBox.classList.add('hidden');
      } catch (err) {
        console.error('Error resetting delegate selection:', err);
      }
    }

    // Khởi tạo khi DOM ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        setTimeout(setupCheckinSearch, 100);
        setTimeout(setupBadgeSearch, 100);
      });
    } else {
      setTimeout(setupCheckinSearch, 100);
      setTimeout(setupBadgeSearch, 100);
    }

    async function generateCheckInCard() {
      if (!selectedDelegate) {
        alert('Vui lòng tìm và chọn tên Đại biểu trước!');
        return;
      }

      const nameInput = selectedDelegate.name.toUpperCase();
      const unitInput = selectedDelegate.unit.toUpperCase();

      const loader = document.getElementById('generating-loader');
      loader.classList.remove('hidden');
      await new Promise(r => setTimeout(r, 800));

      const canvas = document.getElementById('checkinCanvas');
      const ctx = canvas.getContext('2d');
      const width = 1200;
      const height = 1800;
      canvas.width = width;
      canvas.height = height;

      // 1. VẼ NỀN (Background) - Ảnh assets/images/hero1.jpg + overlay xanh đậm
      const bgImage = await loadImage('assets/images/hero1.jpg');
      if (bgImage) {
        const imgRatio = bgImage.width / bgImage.height;
        const cardRatio = width / height;
        let drawW, drawH;
        if (imgRatio > cardRatio) {
          // Ảnh rộng hơn: fit theo chiều cao
          drawH = height;
          drawW = height * imgRatio;
        } else {
          // Ảnh cao hơn: fit theo chiều rộng
          drawW = width;
          drawH = width / imgRatio;
        }
        const dx = (width - drawW) / 2;
        const dy = (height - drawH) / 2;
        ctx.drawImage(bgImage, dx, dy, drawW, drawH);
      } else {
        // Fallback gradient Deep Blue nếu không tải được ảnh
        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, '#001f3f');
        gradient.addColorStop(0.5, '#002855');
        gradient.addColorStop(1, '#005b7f');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
      }

      // Lớp phủ tối nhẹ để chữ dễ đọc
      const overlay = ctx.createLinearGradient(0, 0, 0, height);
      overlay.addColorStop(0, 'rgba(0, 15, 40, 0.92)');
      overlay.addColorStop(0.4, 'rgba(0, 30, 70, 0.80)');
      overlay.addColorStop(1, 'rgba(0, 40, 90, 0.90)');
      ctx.fillStyle = overlay;
      ctx.fillRect(0, 0, width, height);

      // 2. VẼ KHUNG VIỀN VÀNG (Gold Border) – sát hẳn viền
      const borderPadding = 0;
      ctx.strokeStyle = '#d4af37';
      ctx.lineWidth = 15;
      ctx.strokeRect(borderPadding, borderPadding, width - borderPadding*2, height - borderPadding*2);

      // Vẽ góc trang trí
      const cornerSize = 80;
      ctx.fillStyle = '#d4af37';
      // Góc trên trái
      ctx.beginPath(); ctx.moveTo(borderPadding, borderPadding);
      ctx.lineTo(borderPadding + cornerSize, borderPadding); ctx.lineTo(borderPadding, borderPadding + cornerSize); ctx.fill();
      // Góc trên phải
      ctx.beginPath(); ctx.moveTo(width - borderPadding, borderPadding);
      ctx.lineTo(width - borderPadding - cornerSize, borderPadding); ctx.lineTo(width - borderPadding, borderPadding + cornerSize); ctx.fill();
      // Góc dưới trái
      ctx.beginPath(); ctx.moveTo(borderPadding, height - borderPadding);
      ctx.lineTo(borderPadding + cornerSize, height - borderPadding); ctx.lineTo(borderPadding, height - borderPadding - cornerSize); ctx.fill();
      // Góc dưới phải
      ctx.beginPath(); ctx.moveTo(width - borderPadding, height - borderPadding);
      ctx.lineTo(width - borderPadding - cornerSize, height - borderPadding); ctx.lineTo(width - borderPadding, height - borderPadding - cornerSize); ctx.fill();

      // 3. LOGO (đặt trên cùng, ngay dưới khung vàng)
      const logoImg = await loadImage(defaultLogo);
      const titleY = 520;
      if (logoImg) {
        const logoSize = 150;
        const logoX = (width - logoSize) / 2;
        // canh logo sát viền trên nhưng không bị cắt
        const logoY = 40;
        ctx.shadowColor = 'rgba(0, 168, 198, 0.5)';
        ctx.shadowBlur = 20;
        ctx.drawImage(logoImg, logoX, logoY, logoSize, logoSize);
        ctx.shadowBlur = 0;
      }

      // 4. TEXT HEADER (Tiêu đề Đại hội – nằm dưới logo)
      ctx.textAlign = 'center';
      ctx.fillStyle = '#d4af37'; // Màu vàng
      ctx.font = 'bold 36px "Be Vietnam Pro", sans-serif';
      ctx.fillText('ĐẠI HỘI ĐẠI BIỂU ĐOÀN TNCS HỒ CHÍ MINH TỈNH PHÚ THỌ', width / 2, 230);

      ctx.fillStyle = '#d4af37'; // Màu vàng giống dòng trên
      ctx.font = 'bold 32px "Be Vietnam Pro", sans-serif';
      ctx.fillText('LẦN THỨ NHẤT, NHIỆM KỲ 2025 - 2030', width / 2, 280);

      // 5. TIÊU ĐỀ "THẺ ĐẠI BIỂU" – đẩy cao hơn và dùng font ấn tượng hơn
      const titleGradient = ctx.createLinearGradient(0, 0, 0, 200);
      titleGradient.addColorStop(0, '#ffffff');
      titleGradient.addColorStop(1, '#c4f1ff');
      ctx.fillStyle = titleGradient;
      ctx.font = '900 86px "Be Vietnam Pro", sans-serif';
      ctx.shadowColor = 'rgba(0,0,0,0.6)';
      ctx.shadowBlur = 14;
      // Đẩy chữ lên cao hơn để tạo khoảng thở cho phần tên
      ctx.fillText('THẺ ĐẠI BIỂU', width / 2, titleY -20);
      ctx.shadowBlur = 0;

      // 6. THÔNG TIN NGƯỜI DÙNG (Tên & Đơn vị)
      const infoY = titleY + 150;

      // Tên – gradient xanh và thêm viền sáng cho nổi bật
      const nameGradient = ctx.createLinearGradient(0, infoY - 40, 0, infoY + 40);
      nameGradient.addColorStop(0, '#5ee7ff');
      nameGradient.addColorStop(1, '#00a8c6');
      ctx.fillStyle = nameGradient;
      ctx.font = '900 74px "Be Vietnam Pro", sans-serif';
      ctx.shadowColor = 'rgba(15, 23, 42, 0.9)';
      ctx.shadowBlur = 18;
      ctx.fillText(nameInput, width / 2, infoY);
      ctx.shadowBlur = 0;

      // Đơn vị – cyan nhạt hơn + viền sáng nhẹ, cách Tên 50px
      let unitY;
      if (unitInput) {
        unitY = infoY + 50;
        const unitGradient = ctx.createLinearGradient(0, unitY - 20, 0, unitY + 40);
        unitGradient.addColorStop(0, '#e0faff');
        unitGradient.addColorStop(1, '#38bdf8');
        ctx.fillStyle = unitGradient;
        ctx.font = '700 42px "Be Vietnam Pro", sans-serif'; // VIẾT HOA, ĐẬM
        ctx.shadowColor = 'rgba(15, 23, 42, 0.8)';
        ctx.shadowBlur = 12;
        ctx.fillText(unitInput, width / 2, unitY);
        ctx.shadowBlur = 0;
      }

      // Dòng chữ xác nhận - Khẩu hiệu (đẩy xuống tương ứng với bố cục mới)
      const lastElementY = unitInput ? unitY : infoY;
      const sloganY = lastElementY + 70;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'; // Màu trắng đục
      ctx.font = '30px "Be Vietnam Pro", sans-serif'; // Font thường
      ctx.fillText('Tiên phong - Đoàn kết - Bản lĩnh - Đột phá - Phát triển', width / 2, sloganY);

      // 7. ẢNH ĐẠI DIỆN VỚI HIỆU ỨNG GLOW BLUE (Trọng tâm)
      const photoCenterY = 1150;
      const photoRadius = 220;

      // HIỆU ỨNG HÀO QUANG XANH (Blue Gradient Glow)
      const glowRadius = 450;
      const glow = ctx.createRadialGradient(width/2, photoCenterY, 100, width/2, photoCenterY, glowRadius);
      glow.addColorStop(0, 'rgba(0, 168, 198, 0.8)');
      glow.addColorStop(0.4, 'rgba(0, 168, 198, 0.4)');
      glow.addColorStop(1, 'rgba(0, 168, 198, 0)');

      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(width/2, photoCenterY, glowRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Vẽ các vòng tròn trang trí Tech
      ctx.strokeStyle = 'rgba(0, 168, 198, 0.6)';
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(width/2, photoCenterY, photoRadius + 20, 0, Math.PI*2); ctx.stroke();

      ctx.strokeStyle = 'rgba(0, 168, 198, 0.3)';
      ctx.lineWidth = 10;
      ctx.setLineDash([20, 15]);
      ctx.beginPath(); ctx.arc(width/2, photoCenterY, photoRadius + 40, 0, Math.PI*2); ctx.stroke();
      ctx.setLineDash([]);

      // Vẽ Ảnh đại diện tròn
      ctx.save();
      ctx.beginPath();
      ctx.arc(width/2, photoCenterY, photoRadius, 0, Math.PI * 2);
      ctx.clip();

      if (userUploadedImage) {
        const imgAspect = userUploadedImage.width / userUploadedImage.height;
        const drawH = photoRadius * 2;
        const drawW = drawH * imgAspect;
        let sx = 0, sy = 0, sw = userUploadedImage.width, sh = userUploadedImage.height;
        if (imgAspect > 1) {
          sx = (userUploadedImage.width - userUploadedImage.height) / 2;
          sw = userUploadedImage.height;
        } else {
          sy = (userUploadedImage.height - userUploadedImage.width) / 2;
          sh = userUploadedImage.width;
        }
        ctx.drawImage(userUploadedImage, sx, sy, sw, sh, width/2 - photoRadius, photoCenterY - photoRadius, photoRadius*2, photoRadius*2);
      } else {
        ctx.fillStyle = '#003366';
        ctx.fillRect(width/2 - photoRadius, photoCenterY - photoRadius, photoRadius*2, photoRadius*2);
        ctx.fillStyle = 'rgba(255,255,255,0.2)';
        ctx.font = '100px sans-serif';
        ctx.fillText('?', width/2, photoCenterY + 30);
      }
      ctx.restore();

      // Viền kim loại cho ảnh
      ctx.strokeStyle = '#d4af37';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.arc(width/2, photoCenterY, photoRadius, 0, Math.PI * 2);
      ctx.stroke();

      // 8. DẤU TÍCH XANH XÁC THỰC (VERIFIED BADGE)
      const badgeRadius = 40;
      const badgeX = width/2 + photoRadius * 0.7;
      const badgeY = photoCenterY + photoRadius * 0.7;

      // Vẽ hình tròn nền xanh
      ctx.beginPath();
      ctx.arc(badgeX, badgeY, badgeRadius, 0, Math.PI * 2);
      ctx.fillStyle = '#00a8c6';
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 4;
      ctx.stroke();

      // Vẽ dấu tích V
      ctx.beginPath();
      ctx.moveTo(badgeX - 15, badgeY);
      ctx.lineTo(badgeX - 5, badgeY + 15);
      ctx.lineTo(badgeX + 20, badgeY - 15);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 8;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();

      // 9. SLOGAN CUỐI CÙNG (Footer Quote)
      const footerY = 1550;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.font = 'italic 30px "Be Vietnam Pro", sans-serif';
      const slogan = '"Tuổi trẻ Đất Tổ tự hào, vững tin theo Đảng, phát huy tinh thần đoàn kết, khát vọng, xung kích, sáng tạo, xây dựng tỉnh Phú Thọ văn minh, hiện đại, vươn mình mạnh mẽ trong kỷ nguyên mới"';
      wrapText(ctx, slogan, width/2, footerY, width - 200, 45);

      // Ngày tháng
      ctx.fillStyle = '#00a8c6';
      ctx.font = '24px "Be Vietnam Pro", sans-serif';
      const today = new Date();
      ctx.fillText(`Phú Thọ, ngày ${today.getDate()} tháng ${today.getMonth() + 1} năm ${today.getFullYear()}`, width/2, height - 60);

      // 10. XUẤT ẢNH
      const dataURL = canvas.toDataURL('image/png');
      const finalImg = document.getElementById('final-card-image');
      finalImg.src = dataURL;
      finalImg.classList.remove('hidden');
      document.getElementById('card-placeholder').classList.add('hidden');
      document.getElementById('download-actions').classList.remove('hidden');
      loader.classList.add('hidden');
    }

    // Hàm tải ảnh về
    function downloadCard() {
      const link = document.createElement('a');
      link.download = 'Checkin_DaiHoi_PhuTho.png';
      link.href = document.getElementById('final-card-image').src;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    // ==================== PRELOADER ====================
    // Đảm bảo preloader luôn ẩn đi, ngay cả khi có lỗi JavaScript
    const hidePreloader = () => {
      try {
        const preloader = document.getElementById('preloader');
        if (preloader) {
          preloader.style.opacity = '0';
          setTimeout(() => {
            preloader.style.display = 'none';
          }, 1000);
        }
      } catch (error) {
        console.error('Error hiding preloader:', error);
        // Force hide nếu có lỗi
        const preloader = document.getElementById('preloader');
        if (preloader) {
          preloader.style.display = 'none';
        }
      }
    };

    // Ẩn preloader khi DOM ready hoặc khi window load
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        setTimeout(hidePreloader, 1000);
      });
    } else {
      setTimeout(hidePreloader, 1000);
    }

    window.addEventListener('load', () => {
      setTimeout(hidePreloader, 1000);
    });

    // ==================== FAB ROBOT & AI BUBBLE ====================
    const fabRobot = document.getElementById('fabRobot');
    const aiBubble = document.getElementById('ai-bubble');
    const fabWrapper = fabRobot ? fabRobot.closest('.fixed.bottom-40') : null;
    
    let lastScrollY = window.scrollY;
    let scrollTimeout;
    let bubbleShown = false;
    let bubbleShownOnce = false; // Đánh dấu đã hiện lần đầu
    
    // Hàm hiển thị bubble khi iconAI xuất hiện (chỉ lần đầu tiên)
    function showBubble() {
      if (aiBubble && !bubbleShownOnce) {
        aiBubble.classList.remove('hide-on-scroll');
        aiBubble.classList.add('show-bubble');
        bubbleShown = true;
        bubbleShownOnce = true; // Đánh dấu đã hiện lần đầu, không hiện nữa
        
        // Tự động ẩn sau 5 giây
        setTimeout(() => {
          if (aiBubble) {
            aiBubble.classList.remove('show-bubble');
            aiBubble.classList.add('hide-on-scroll');
            bubbleShown = false;
          }
        }, 5000);
      }
    }
    
    // Hiển thị bubble khi trang load
    if (aiBubble) {
      setTimeout(() => {
        showBubble();
      }, 1500);
    }
    
    if (fabWrapper) {
      // Hiện/ẩn Robot và AI Bubble khi scroll
      window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        const scrollDirection = currentScrollY > lastScrollY ? 'down' : 'up';
        
        // Xử lý Robot và AI Bubble - chỉ ẩn khi scroll down, hiện khi scroll up
        if (currentScrollY > 200) {
          if (scrollDirection === 'down') {
            fabWrapper.classList.add('hide-on-scroll');
            if (aiBubble) {
              aiBubble.classList.add('hide-on-scroll');
              aiBubble.classList.remove('show-bubble');
              bubbleShown = false;
            }
          } else {
            // Khi scroll up, hiện Robot và hiển thị bubble
            fabWrapper.classList.remove('hide-on-scroll');
            if (aiBubble) {
              aiBubble.classList.remove('hide-on-scroll');
              showBubble();
            }
          }
        } else {
          // Ở đầu trang, luôn hiển thị
          if (fabWrapper) fabWrapper.classList.remove('hide-on-scroll');
          if (aiBubble) {
            aiBubble.classList.remove('hide-on-scroll');
            showBubble();
          }
        }
        
        lastScrollY = currentScrollY;
        
        // Clear timeout và reset sau khi ngừng scroll
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          // Sau 1 giây không scroll, hiện lại Robot và bubble
          if (fabWrapper) fabWrapper.classList.remove('hide-on-scroll');
          if (aiBubble) {
            aiBubble.classList.remove('hide-on-scroll');
            showBubble();
          }
        }, 1000);
      });
    }
