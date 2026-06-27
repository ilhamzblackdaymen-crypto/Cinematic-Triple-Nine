/* ===================================================================
   TRIPLENINE CINEMATIC — script.js
   Handles slide-style page switching between Page 1 and Page 2,
   with smooth directional transitions and no page reload.
   =================================================================== */

(function () {
  "use strict";

  // ---------- Element refs ----------
  const page1 = document.getElementById("page1");
  const page2 = document.getElementById("page2");
  const goToResultsBtn = document.getElementById("goToResults");
  const backToHomeBtn = document.getElementById("backToHome");

  const TRANSITION_MS = 550; // keep in sync with --t-slide in style.css

  let isTransitioning = false;

  /**
   * Switches the visible "slide" from one section to another,
   * applying a directional exit class to the outgoing slide so it
   * animates off-screen while the incoming slide animates in.
   *
   * @param {HTMLElement} fromSlide - currently active slide
   * @param {HTMLElement} toSlide   - slide to activate
   * @param {"left"|"right"} direction - direction the outgoing slide exits
   */
  function switchSlide(fromSlide, toSlide, direction) {
    if (isTransitioning || fromSlide === toSlide) return;
    isTransitioning = true;

    const exitClass = direction === "left" ? "slide--exit-left" : "slide--exit-right";

    // Animate the outgoing slide out.
    fromSlide.classList.remove("slide--active");
    fromSlide.classList.add(exitClass);

    // Activate the incoming slide (it starts from translateX via CSS default,
    // then transitions to translateX(0) because of .slide--active).
    toSlide.classList.add("slide--active");

    // Reset scroll position of the incoming slide to the top.
    toSlide.scrollTop = 0;

    // After the transition finishes, clean up the exit class so the
    // slide is ready to animate correctly next time it's shown.
    window.setTimeout(() => {
      fromSlide.classList.remove(exitClass);
      isTransitioning = false;
    }, TRANSITION_MS);
  }

  // ---------- Page 1 -> Page 2 ----------
  if (goToResultsBtn && page1 && page2) {
    goToResultsBtn.addEventListener("click", () => {
      switchSlide(page1, page2, "left");
    });
  }

  // ---------- Page 2 -> Page 1 ----------
  if (backToHomeBtn && page1 && page2) {
    backToHomeBtn.addEventListener("click", () => {
      switchSlide(page2, page1, "right");
    });
  }

  // ---------- Keyboard support: Escape returns to Page 1 from Page 2 ----------
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && page2.classList.contains("slide--active")) {
      switchSlide(page2, page1, "right");
    }
  });

  // ---------- Pause any playing videos when leaving Page 2 ----------
  // Prevents audio/video from continuing to play in the background
  // once the user navigates back to Page 1.
  function pauseAllVideos() {
    const videos = page2.querySelectorAll("video");
    videos.forEach((video) => {
      if (!video.paused) video.pause();
    });
  }
  if (backToHomeBtn) {
    backToHomeBtn.addEventListener("click", pauseAllVideos);
  }

})();
