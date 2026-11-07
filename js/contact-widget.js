(function () {
  'use strict';

  var WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';
  var WEB3FORMS_ACCESS_KEY = '63eadaa8-61ea-4411-b5ce-94e202a3726e';

  if (document.getElementById('exatipContactWidget')) {
    return;
  }

  var widget = document.createElement('div');
  widget.id = 'exatipContactWidget';
  widget.className = 'exatip-contact-widget';
  widget.setAttribute('aria-live', 'polite');
  widget.innerHTML = [
    '<button type="button" class="exatip-contact-toggle" aria-expanded="false" aria-controls="exatipContactPanel" title="Contact Us">',
    '  <span class="cw-icon" aria-hidden="true">✉</span>',
    '  <span class="cw-label">Contact Us</span>',
    '</button>',
    '<div class="exatip-contact-panel" id="exatipContactPanel" role="dialog" aria-modal="false" aria-labelledby="exatipContactTitle" hidden>',
    '  <div class="exatip-contact-panel__head">',
    '    <div>',
    '      <h2 id="exatipContactTitle">Contact Us</h2>',
    '      <p>We usually reply within one business day.</p>',
    '    </div>',
    '    <button type="button" class="exatip-contact-close" aria-label="Close contact form">&times;</button>',
    '  </div>',
    '  <div class="exatip-contact-panel__body">',
    '    <form id="exatipTopContactForm" action="https://api.web3forms.com/submit" method="POST" novalidate>',
    '      <input type="hidden" name="access_key" value="' + WEB3FORMS_ACCESS_KEY + '">',
    '      <input type="hidden" name="subject" value="New Contact Us enquiry - Exatip Website">',
    '      <input type="hidden" name="from_name" value="Exatip Website Contact Widget">',
    '      <input type="checkbox" name="botcheck" class="cw-botcheck" tabindex="-1" autocomplete="off">',
    '      <div class="cw-field">',
    '        <label for="cw_name">Full Name</label>',
    '        <input id="cw_name" name="name" type="text" autocomplete="name" required placeholder="Your name">',
    '      </div>',
    '      <div class="cw-field">',
    '        <label for="cw_email">Email</label>',
    '        <input id="cw_email" name="email" type="email" autocomplete="email" required placeholder="you@company.com">',
    '      </div>',
    '      <div class="cw-field">',
    '        <label for="cw_phone">Phone</label>',
    '        <input id="cw_phone" name="phone" type="tel" autocomplete="tel" placeholder="+91 ...">',
    '      </div>',
    '      <div class="cw-field">',
    '        <label for="cw_company">Company</label>',
    '        <input id="cw_company" name="company" type="text" autocomplete="organization" placeholder="Company name">',
    '      </div>',
    '      <div class="cw-field">',
    '        <label for="cw_message">Message</label>',
    '        <textarea id="cw_message" name="message" required placeholder="How can we help?"></textarea>',
    '      </div>',
    '      <div class="exatip-contact-panel__actions">',
    '        <button type="submit" class="exatip-contact-submit">Send Message</button>',
    '        <button type="reset" class="exatip-contact-reset">Reset</button>',
    '      </div>',
    '      <div class="exatip-contact-status" id="exatipContactStatus" role="status"></div>',
    '    </form>',
    '  </div>',
    '</div>'
  ].join('');

  document.body.appendChild(widget);

  var style = document.createElement('style');
  style.textContent = '.exatip-contact-panel .cw-botcheck{position:absolute;left:-9999px;opacity:0;height:0;width:0;pointer-events:none;}';
  document.head.appendChild(style);

  var toggle = widget.querySelector('.exatip-contact-toggle');
  var panel = widget.querySelector('.exatip-contact-panel');
  var closeBtn = widget.querySelector('.exatip-contact-close');
  var form = widget.querySelector('#exatipTopContactForm');
  var statusEl = widget.querySelector('#exatipContactStatus');
  var submitBtn = form.querySelector('.exatip-contact-submit');

  function openPanel() {
    widget.classList.add('is-open');
    panel.hidden = false;
    toggle.setAttribute('aria-expanded', 'true');
    var first = form.querySelector('input:not([type=hidden]):not([type=checkbox]), textarea');
    if (first) {
      setTimeout(function () { first.focus(); }, 220);
    }
  }

  function closePanel() {
    widget.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    setTimeout(function () {
      if (!widget.classList.contains('is-open')) {
        panel.hidden = true;
      }
    }, 280);
    toggle.focus();
  }

  function setStatus(message, type) {
    statusEl.textContent = message;
    statusEl.className = 'exatip-contact-status' + (type ? ' is-' + type : '');
  }

  toggle.addEventListener('click', function () {
    if (widget.classList.contains('is-open')) {
      closePanel();
    } else {
      openPanel();
    }
  });

  closeBtn.addEventListener('click', closePanel);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && widget.classList.contains('is-open')) {
      closePanel();
    }
  });

  document.addEventListener('click', function (e) {
    if (!widget.classList.contains('is-open')) {
      return;
    }
    if (!widget.contains(e.target)) {
      closePanel();
    }
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      setStatus('Please fill in the required fields.', 'error');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';
    setStatus('');

    var formData = new FormData(form);

    fetch(WEB3FORMS_ENDPOINT, {
      method: 'POST',
      body: formData
    })
      .then(function (res) { return res.json(); })
      .then(function (data) {
        if (data && data.success) {
          setStatus('Message sent successfully. Thank you!', 'success');
          form.reset();
        } else {
          setStatus((data && data.message) || 'Something went wrong. Please try again.', 'error');
        }
      })
      .catch(function () {
        setStatus('Unable to send right now. Please email info@exatip.com.', 'error');
      })
      .finally(function () {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message';
      });
  });
})();
