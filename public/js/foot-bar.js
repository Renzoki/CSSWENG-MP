document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.getElementById('footer-contact-form');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const phone = document.getElementById('phone').value.trim();
      const inquiry = document.getElementById('inquiry').value.trim();

      if (!name || !email ||!phone || !inquiry) {
        showAlert("Please fill in all required fields.", "warning");
        return;
      }
      try {
        const res = await fetch('/web/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, phone, inquiry })
        });

        const data = await res.json();

        if (data.success) {
          showAlert(data.message, 'success');
          contactForm.reset();
        } else {
          showAlert(data.message || 'Failed to send message.', 'danger');
        }
      } catch (err) {
        console.error(err);
        showAlert('Something went wrong. Please try again later.', 'danger');
      }
    });
  }

  function showAlert(message, type = 'success') {
  const alert = document.createElement('div');

  alert.className = `alert alert-dismissible custom-alert fade show`; 
  alert.role = 'alert';


  alert.innerHTML = `
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  `;

  document.body.appendChild(alert);

  setTimeout(() => {
    alert.classList.remove('show'); // fades out
    setTimeout(() => alert.remove(), 300); 
  }, 1500);
}


});
