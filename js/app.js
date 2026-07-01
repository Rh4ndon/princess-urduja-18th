(function () {
  const form = document.getElementById('rsvp-form');
  const formSection = document.getElementById('rsvp-form-section');
  const successEl = document.getElementById('success-message');
  const errorEl = document.getElementById('error-message');
  const errorText = document.getElementById('error-text');
  const submitBtn = document.getElementById('submit-btn');
  const guestsField = document.getElementById('guests-field');
  const attendingInputs = form.querySelectorAll('input[name="attending"]');

  if (!CONFIG.SCRIPT_URL || CONFIG.SCRIPT_URL.includes('YOUR_GOOGLE')) {
    showError('Please set your Google Apps Script URL in js/config.js');
    submitBtn.disabled = true;
  }

  attendingInputs.forEach((input) => {
    input.addEventListener('change', () => {
      const attending = form.querySelector('input[name="attending"]:checked');
      guestsField.hidden = attending?.value === 'no';
    });
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideMessages();
    setLoading(true);

    const formData = new FormData(form);
    const attending = formData.get('attending');
    const payload = {
      action: 'submit',
      name: formData.get('name')?.trim(),
      email: formData.get('email')?.trim(),
      attending,
      guests: attending === 'yes' ? formData.get('guests') : '0',
      message: formData.get('message')?.trim() || '',
    };

    try {
      const response = await fetch(CONFIG.SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify(payload),
      });

      // no-cors returns opaque response; assume success if no network error
      form.hidden = true;
      successEl.hidden = false;
    } catch (err) {
      showError('Could not reach the server. Check your internet and SCRIPT_URL in config.js.');
    } finally {
      setLoading(false);
    }
  });

  function setLoading(loading) {
    submitBtn.disabled = loading;
    submitBtn.querySelector('.btn-text').hidden = loading;
    submitBtn.querySelector('.btn-loading').hidden = !loading;
  }

  function hideMessages() {
    successEl.hidden = true;
    errorEl.hidden = true;
  }

  function showError(msg) {
    errorText.textContent = msg;
    errorEl.hidden = false;
  }
})();
