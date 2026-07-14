 var typed = new Typed("#typed", {
        strings: ["Developer.", "Programmer.", "Dotnet Enthusiast."],
        typeSpeed: 60,
        backSpeed: 30,
        backDelay: 1200,
        loop: true,
      });

      // Footer year
      let date = new Date();
      let year = date.getFullYear();
      document.getElementById("year").textContent = year;

      // AOS init
      AOS.init({
        duration: 900,
        once: true,
      });

      // Smooth scroll for navbar
      var scroll = new SmoothScroll('a.nav-link[href*="#"]', {
        speed: 700,
        speedAsDuration: true,
      });

      // Animated counters for skills
      function animateCounter(el, to) {
        let start = 0;
        let duration = 700;
        let startTime = null;
        function animate(time) {
          if (!startTime) startTime = time;
          let progress = Math.min((time - startTime) / duration, 1);
          el.textContent = Math.floor(progress * (to - start) + start);
          if (progress < 1) {
            requestAnimationFrame(animate);
          } else {
            el.textContent = to;
          }
        }
        requestAnimationFrame(animate);
      }
      // Trigger counters when skills section is in view
      let skillSection = document.getElementById("skills");
      let countersStarted = false;
      function triggerCounters() {
        if (countersStarted) return;
        let rect = skillSection.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          document.querySelectorAll(".skill-counter").forEach(function (el) {
            animateCounter(el, parseInt(el.getAttribute("data-count")));
          });
          countersStarted = true;
        }
      }
      window.addEventListener("scroll", triggerCounters);
      window.addEventListener("DOMContentLoaded", triggerCounters);