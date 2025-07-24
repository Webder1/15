function setupStarRating(starContainerId, hiddenInputId) {
  const container = document.getElementById(starContainerId);
  const stars = container.querySelectorAll('.star');
  const hiddenInput = document.getElementById(hiddenInputId);
  let selectedValue = 0;
  let touched = false;

  function setStars(rating) {
    stars.forEach(star => {
      const starVal = parseInt(star.dataset.value, 10);
      star.classList.toggle('selected', starVal <= rating);
      star.setAttribute('aria-checked', starVal === rating ? 'true' : 'false');
    });
    hiddenInput.value = rating;
  }

  function clearHover() {
    stars.forEach(s => s.classList.remove('hovered'));
  }

  stars.forEach(star => {
    const starValue = parseInt(star.dataset.value, 10);

    // Hover effect for mouse only
    star.addEventListener('mouseover', () => {
      if (touched) return; // Skip hover if using touch
      stars.forEach(s => {
        const val = parseInt(s.dataset.value, 10);
        s.classList.toggle('hovered', val <= starValue);
      });
    });

    star.addEventListener('mouseout', () => {
      if (!touched) clearHover();
    });

    // Main selection handler
    const handleSelect = () => {
      selectedValue = starValue;
      setStars(selectedValue);
      clearHover();
    };

    // Click for desktop
    star.addEventListener('click', e => {
      if (!touched) handleSelect();
    });

    // Touch for mobile
    star.addEventListener('touchstart', e => {
      touched = true;
      e.preventDefault(); // Avoid triggering click too
      handleSelect();
    }, { passive: false });

    // Keyboard support
    star.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        selectedValue = starValue;
        setStars(selectedValue);
      }
    });
  });

  setStars(0); // Start with no stars selected
}

document.addEventListener('DOMContentLoaded', () => {
  setupStarRating('dessert-stars', 'dessertRating');
  setupStarRating('server-stars', 'serverRating');
});
  // Modal elements
  const modal = document.getElementById('confirmationModal');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const feedbackForm = document.getElementById('feedbackForm');

  // Show modal function
  function showModal() {
    modal.classList.add('show');
    modal.setAttribute('aria-hidden', 'false');
    closeModalBtn.focus();
  }

  // Hide modal function
  function hideModal() {
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden', 'true');
    feedbackForm.querySelector('button[type="submit"]').focus();
  }

  // Close modal button event
  closeModalBtn.addEventListener('click', hideModal);

  // Close modal on outside click
  modal.addEventListener('click', e => {
    if (e.target === modal) hideModal();
  });

  // Handle form submission
  feedbackForm.addEventListener('submit', e => {
    e.preventDefault();

    // Check required star ratings
    if (!document.getElementById('dessertRating').value) {
      alert('Please rate the dessert.');
      return;
    }
    if (!document.getElementById('serverRating').value) {
      alert('Please rate the service.');
      return;
    }

    // Disable submit button to prevent multiple submits
    feedbackForm.querySelector('button[type="submit"]').disabled = true;

    const formData = new FormData(feedbackForm);

    fetch(feedbackForm.action, {
      method: 'POST',
      body: formData,
      headers: { 'Accept': 'application/json' }
    })
      .then(response => {
        if (response.ok) {
          feedbackForm.reset();
          showModal();
        } else {
          alert('Oops! There was a problem submitting your feedback. Please try again.');
        }
      })
      .catch(() => {
        alert('Oops! There was a problem submitting your feedback. Please try again.');
      })
      .finally(() => {
        feedbackForm.querySelector('button[type="submit"]').disabled = false;
      });
  });
});
