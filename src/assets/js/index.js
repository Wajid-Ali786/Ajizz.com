document.addEventListener("DOMContentLoaded", function () {
    // Subscription Form Validation
    const subscribeForm = document.querySelector("#subscribe form");
    const subscribeInput = subscribeForm.querySelector("input[type='email']");
  
    subscribeForm.addEventListener("submit", function (event) {
      event.preventDefault(); // Prevent form submission
      if (!validateEmail(subscribeInput.value)) {
        alert("Please enter a valid email address.");
        subscribeInput.focus();
        return;
      }
      alert("Subscribed successfully!");
      subscribeInput.value = ""; // Clear the input
    });
  
    // Contact Form Validation
    const contactForm = document.querySelector(".footer-contact-form form");
    const contactEmail = contactForm.querySelector("input[type='email']");
    const contactName = contactForm.querySelector("input[type='text']");
    const contactMessage = contactForm.querySelector("textarea");
  
    contactForm.addEventListener("submit", function (event) {
      event.preventDefault();
      if (contactName.value.trim() === "") {
        alert("Please enter your name.");
        contactName.focus();
        return;
      }
      if (!validateEmail(contactEmail.value)) {
        alert("Please enter a valid email address.");
        contactEmail.focus();
        return;
      }
      if (contactMessage.value.trim() === "") {
        alert("Please enter your message.");
        contactMessage.focus();
        return;
      }
      alert("Message sent successfully!");
      contactForm.reset(); // Clear the form
    });
  
    // Email Validation Function
    function validateEmail(email) {
      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return emailPattern.test(email);
    }
  });

  
// //   <!-- JavaScript to Clone Items for Multi-Item Carousel -->
// //  <!-- jQuery -->
// <!-- Slick Carousel JS -->
  $(document).ready(function(){
    $('.slider').slick({
      slidesToShow: 3,          
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 0,         // No delay between slides
      speed: 5000,              // Duration of the transition (ms)
      cssEase: 'linear',        // Ensures smooth, constant motion
      infinite: true,
      arrows: true,
      responsive: [
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 1   // 1 image on mobile devices
          }
        }
      ]
    });

    // Immediately stop on hover
    $('.slider').on('mouseenter', function() {
      $(this).slick('slickPause');  // Pause Slick autoplay
      $(this).find('.slick-track').css({
        'transition': 'none', // Instantly stop movement
        'animation-play-state': 'paused'
      });
    });

    // Immediately resume on mouse leave
    $('.slider').on('mouseleave', function() {
      $(this).find('.slick-track').css({
        'transition': 'transform 0s linear', // Instantly start movement
        'animation-play-state': 'running'
      });
      $(this).slick('slickPlay');  // Resume Slick autoplay
    });
  });


/* back 
      to 
          top */
  

  // Get the button
  const backToTopButton = document.getElementById('backToTop');

  // Show the button when scrolling down
  window.onscroll = function () {
    if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
      backToTopButton.style.display = "block"; // Show button
    } else {
      backToTopButton.style.display = "none"; // Hide button
    }
  };

  // Scroll to top when clicked
  backToTopButton.addEventListener('click', function () {
    window.scrollTo({
      top: 0,
      behavior: 'smooth' // Smooth scroll effect
    });
  });

