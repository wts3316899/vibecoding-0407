document.addEventListener('DOMContentLoaded', () => {
  const startBtn = document.getElementById('start-btn');
  const statusText = document.getElementById('status-text');
  const app = document.getElementById('app');
  const nearContainer = document.getElementById('near-target-container');
  const farContainer = document.getElementById('far-target-container');
  const nearTarget = document.getElementById('near-target');
  const soundToggle = document.getElementById('sound-toggle');
  const ambientSound = document.getElementById('ambient-sound');
  const switchSound = document.getElementById('switch-sound');
  const infoBtn = document.getElementById('info-btn');
  const infoModal = document.getElementById('info-modal');
  const closeModal = document.getElementById('close-modal');
  const bgNextBtn = document.getElementById('bg-next');
  const bgImg = document.getElementById('bg-img');

  let isExercising = false;
  let isNear = false;
  let intervalId = null;
  let isSoundMuted = true;
  let bgIndex = 0;

  const backgrounds = [
    'background.png',
    'bg1.jpg',
    'bg3.jpg',
    'bg5.jpg'
  ];

  // Preload backgrounds manually
  function preloadAllImages() {
    backgrounds.forEach(url => {
      const img = new Image();
      img.src = url;
    });
  }

  function changeBackground() {
    const nextIndex = (bgIndex + 1) % backgrounds.length;
    console.log(`Changing background to: ${backgrounds[nextIndex]}`);
    statusText.textContent = "正在載入新風景...";

    bgImg.style.opacity = '0.4';

    const tempImg = new Image();
    tempImg.src = backgrounds[nextIndex];

    tempImg.onload = () => {
      bgIndex = nextIndex;
      bgImg.src = backgrounds[bgIndex];
      bgImg.style.opacity = '1';
      updateStatus();
    };

    tempImg.onerror = () => {
      console.error(`Failed to load background: ${backgrounds[nextIndex]}`);
      statusText.textContent = "圖片載入失敗，嘗試下一張...";
      bgImg.style.opacity = '1';
      // Try skipping to the next one automatically after a brief delay
      setTimeout(changeBackground, 2000);
    };
  }

  function updateStatus() {
    if (isExercising) {
      statusText.textContent = isNear ? '專注於近景...' : '看向遠方...';
    } else {
      statusText.textContent = '風景已切換';
    }
  }

  // SVG Icons for Near Focus Target
  const nearTargets = [
    // Leaf
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2L10.5 5.5C8 9 5 12 5 15C5 18.87 8.13 22 12 22C15.87 22 19 18.87 19 15C19 12 16 9 13.5 5.5L12 2Z"></path><path d="M12 22V15"></path><path d="M12 15C14.5 17 16 18 17 19"></path><path d="M12 15C9.5 17 8 18 7 19"></path></svg>`,
    // Flower
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"></path><path d="M12 2v4"></path><path d="M12 18v4"></path><path d="M4.93 4.93l2.83 2.83"></path><path d="M16.24 16.24l2.83 2.83"></path><path d="M2 12h4"></path><path d="M18 12h4"></path><path d="M4.93 19.07l2.83 -2.83"></path><path d="M16.24 7.76l2.83 -2.83"></path></svg>`,
    // Lotus-style
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 22C12 22 19 18 19 12C19 6 12 2 12 2C12 2 5 6 5 12C5 18 12 22 12 22Z"></path><path d="M12 22C12 22 16 19 16 12C16 5 12 2 12 2C12 2 8 5 8 12C8 19 12 22 12 22Z"></path><path d="M12 22V2"></path></svg>`,
    // Small Stone/Cloud
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M17.5 19c.3 0 .5-.1.7-.3.2-.2.3-.5.3-.7 0-.3-.1-.5-.3-.7-.2-.2-.5-.3-.7-.3h-.5c-.2 0-.4-.1-.5-.3-.1-.2-.2-.4-.2-.6V16c0-.3-.1-.5-.3-.7-.2-.2-.5-.3-.7-.3h-1c-.3 0-.5-.1-.7-.3-.2-.2-.3-.5-.3-.7v-1c0-.3-.1-.5-.3-.7-.2-.2-.5-.3-.7-.3H10c-.3 0-.5.1-.7.3-.2.2-.3.5-.3.7v1c0 .3.1.5.3.7.2.2.5.3.7.3h1c.3 0 .5.1.7.3.2.2.3.5.3.7v1c0 .3.1.5.3.7.2.2.5.3.7.3h1v1c0 .6.4 1 1 1h2.5z"></path></svg>`
  ];

  function updateNearTarget() {
    const randomIndex = Math.floor(Math.random() * nearTargets.length);
    nearTarget.innerHTML = nearTargets[randomIndex];
  }

  function toggleFocus() {
    isNear = !isNear;

    if (isNear) {
      app.classList.add('is-near');
      nearContainer.classList.remove('hidden');
      nearContainer.classList.add('active');
      farContainer.classList.remove('active');
      statusText.textContent = '專注於近景...';
      updateNearTarget();
    } else {
      app.classList.remove('is-near');
      nearContainer.classList.remove('active');
      setTimeout(() => {
        if (!isNear) nearContainer.classList.add('hidden');
      }, 800);
      farContainer.classList.add('active');
      statusText.textContent = '看向遠方...';
    }

    // Play feedback sound
    if (!isSoundMuted && switchSound) {
      switchSound.currentTime = 0;
      switchSound.play().catch(e => console.log("Audio play blocked"));
    }
  }

  function startExercise() {
    if (isExercising) {
      // Stop
      clearInterval(intervalId);
      isExercising = false;
      startBtn.textContent = '開始練習';
      statusText.textContent = '已暫停';
      app.classList.remove('is-near');
      nearContainer.classList.remove('active');
      farContainer.classList.remove('active');
      return;
    }

    // Start
    isExercising = true;
    startBtn.textContent = '停止練習';
    statusText.textContent = '開始練習中...';

    // Initial state
    isNear = false;
    toggleFocus();

    intervalId = setInterval(() => {
      toggleFocus();
    }, 5000);
  }

  startBtn.addEventListener('click', startExercise);

  soundToggle.addEventListener('click', () => {
    isSoundMuted = !isSoundMuted;
    console.log("Sound Toggle Clicked. Muted:", isSoundMuted);

    if (isSoundMuted) {
      ambientSound.pause();
      updateSoundIcon(true);
    } else {
      // Check if audio has error
      if (ambientSound.error) {
        console.error("Audio Load Error:", ambientSound.error);
        statusText.textContent = "音效載入失敗，請檢查網路。";
        isSoundMuted = true;
        return;
      }

      ambientSound.play()
        .then(() => {
          console.log("音效播放成功");
          updateSoundIcon(false);
          statusText.textContent = isExercising ? (isNear ? '專注於近景...' : '看向遠方...') : '準備開始...';
        })
        .catch(e => {
          console.error("Playback failed:", e);
          // Standard browser blocking, silent retry or gentle state reset
          isSoundMuted = true;
          updateSoundIcon(true);

          // Don't alert on every single click, just log it.
          // Instead, show a subtle text hint.
          statusText.textContent = "請再點擊一次解鎖音訊";
          setTimeout(() => {
            if (isExercising) statusText.textContent = isNear ? '專注於近景...' : '看向遠方...';
            else statusText.textContent = '準備開始...';
          }, 2000);
        });
    }
  });

  function updateSoundIcon(muted) {
    if (muted) {
      soundToggle.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 5L6 9H2v6h4l5 4V5zM15.54 8.46a5 5 0 0 1 0 7.07"></path><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>`;
    } else {
      soundToggle.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 5L6 9H2v6h4l5 4V5zM19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>`;
    }
  }

  infoBtn.addEventListener('click', () => {
    infoModal.classList.remove('hidden');
  });

  closeModal.addEventListener('click', () => {
    infoModal.classList.add('hidden');
  });

  bgNextBtn.addEventListener('click', changeBackground);

  // Initialize UI
  updateNearTarget();
  updateSoundIcon(isSoundMuted);
  preloadAllImages();

  // "Pre-warm" audio on first interaction to avoid autoplay issues
  document.addEventListener('click', () => {
    if (ambientSound.paused && !isSoundMuted) {
      // Internal state might need a nudge
      console.log("觸發使用者互動以啟動音訊");
    }
  }, { once: true });
});
