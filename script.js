// DOM Elements
const header = document.getElementById('header');
const mobileMenuButton = document.querySelector('.mobile-menu-button');
const mobileNav = document.querySelector('.mobile-nav');
const navLinks = document.querySelectorAll('a[href^="#"]');
const chevronDown = document.querySelector('.chevron-down');
const voiceButton = document.getElementById('voiceButton');
const voiceButtonMobile = document.getElementById('voiceButtonMobile'); // For mobile, if added

// Mobile Menu Toggle
if (mobileMenuButton && mobileNav) {
  mobileMenuButton.addEventListener('click', () => {
    mobileNav.classList.toggle('active'); // Toggle the active class

    // Toggle hamburger animation
    const bars = mobileMenuButton.querySelectorAll('div');
    if (bars.length >= 3) {
      bars[0].classList.toggle('transform');
      bars[0].classList.toggle('rotate-45');
      bars[0].classList.toggle('translate-y-2');

      bars[1].classList.toggle('opacity-0');

      bars[2].classList.toggle('transform');
      bars[2].classList.toggle('-rotate-45');
      bars[2].classList.toggle('-translate-y-2');
    }
  });
}

// Smooth Scrolling for Navigation Links
navLinks.forEach(link => {
  link.addEventListener('click', function (e) {
    e.preventDefault();

    const targetId = this.getAttribute('href');
    const targetElement = document.querySelector(targetId);

    if (targetElement) {
      const navHeight = header ? header.offsetHeight : 0;
      window.scrollTo({
        top: targetElement.offsetTop - navHeight,
        behavior: 'smooth',
      });
    }

    // Close mobile menu and reset hamburger animation
    if (mobileNav && mobileNav.classList.contains('active')) {
      mobileNav.classList.remove('active');
      mobileMenuButton.querySelectorAll('div').forEach(bar => {
        bar.classList.remove('transform', 'rotate-45', 'translate-y-2', 'opacity-0', '-rotate-45', '-translate-y-2');
      });
    }
  });
});

// Chevron Down Click
if (chevronDown) {
  chevronDown.addEventListener('click', () => {
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      const navHeight = header ? header.offsetHeight : 0;
      window.scrollTo({
        top: aboutSection.offsetTop - navHeight,
        behavior: 'smooth',
      });
    }
  });
}

// Scroll Event for Header Style Change and Active Link
window.addEventListener('scroll', () => {
  // Header background change on scroll
  if (header) {
    if (window.scrollY > 10) {
      header.classList.remove('py-4');
      header.classList.add('py-2');
    } else {
      header.classList.remove('py-2');
      header.classList.add('py-4');
    }
  }

  // Check which section is in view
  const scrollPosition = window.scrollY + 100;
  const sections = ['home', 'about', 'magazine', 'faculty', 'footer'];

  const currentSection = sections.find(section => {
    const element = document.getElementById(section);
    if (!element) return false;

    const top = element.offsetTop;
    const height = element.clientHeight;

    return scrollPosition >= top && scrollPosition < top + height;
  });

  // Update active link
  if (currentSection) {
    navLinks.forEach(link => {
      link.classList.remove('text-glow-pink'); // Remove active class
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('text-glow-pink'); // Add active class
      }
    });
  }
});

// Scroll Reveal Animations
document.addEventListener('DOMContentLoaded', () => {
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-show');
        }
      });
    }, { threshold: 0.1 });

    const hiddenElements = document.querySelectorAll('.fade-hidden');
    hiddenElements.forEach(el => observer.observe(el));
  } else {
    const hiddenElements = document.querySelectorAll('.fade-hidden');
    hiddenElements.forEach(el => el.classList.add('fade-show'));
  }
});

// Voice Command Functionality
document.addEventListener('DOMContentLoaded', () => {
  const voiceButton = document.getElementById('voiceButton');
  const voiceButtonMobile = document.getElementById('voiceButtonMobile'); // For mobile
  const beepSound = new Audio('Beep.mp3'); // Ensure the path to beep.mp3 is correct

  // Check if Speech Recognition is supported
  if (window.SpeechRecognition || window.webkitSpeechRecognition) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    const activateVoiceCommand = () => {
      // Play beep sound
      beepSound.play();

      // Start speech recognition after the beep
      setTimeout(() => {
        recognition.start();
        alert('Listening for voice commands...');
      }, 500); // Delay to allow the beep sound to play
    };

    recognition.onresult = (event) => {
      const command = event.results[0][0].transcript.toLowerCase();
      console.log('User said:', command);

      // Handle voice commands
      if (command.includes('go to home')) {
        window.location.href = '#home';
      } else if (command.includes('open feedback')) {
        window.location.href = 'https://forms.gle/7MYLV3Z9vhr9tfCu5';
      } else if (command.includes('open code playground')) {
        window.location.href = 'playground.html';
      } else if (command.includes('open study materials')) {
        window.location.href = 'study materials.html';
      } else if (command.includes('scroll down')) {
        window.scrollBy(0, window.innerHeight);
      } else if (command.includes('scroll up')) {
        window.scrollBy(0, -window.innerHeight);
      } else {
        alert("Sorry, I didn't understand that command.");
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      alert('An error occurred with speech recognition. Please try again.');
    };

    // Attach event listeners to the voice command buttons
    if (voiceButton) {
      voiceButton.addEventListener('click', activateVoiceCommand);
    }
    if (voiceButtonMobile) {
      voiceButtonMobile.addEventListener('click', activateVoiceCommand);
    }
  } else {
    console.warn('Speech recognition is not supported in this browser.');
    if (voiceButton) {
      voiceButton.disabled = true;
      voiceButton.textContent = 'Voice Command Unavailable';
    }
    if (voiceButtonMobile) {
      voiceButtonMobile.disabled = true;
      voiceButtonMobile.textContent = 'Voice Command Unavailable';
    }
  }
});
