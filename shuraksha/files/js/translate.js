document.addEventListener("DOMContentLoaded", function() {
  // Inject Google Translate script
  const gtScript = document.createElement('script');
  gtScript.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
  document.body.appendChild(gtScript);

  // Inject placeholder
  const gtDiv = document.createElement('div');
  gtDiv.id = 'google_translate_element';
  gtDiv.style.display = 'none';
  document.body.appendChild(gtDiv);

  // Hide Google Translate UI elements
  const style = document.createElement('style');
  style.innerHTML = `
    body { top: 0 !important; }
    .skiptranslate { display: none !important; }
    #goog-gt-tt { display: none !important; }
  `;
  document.head.appendChild(style);

  window.googleTranslateElementInit = function() {
    new google.translate.TranslateElement({
      pageLanguage: 'en',
      includedLanguages: 'en,hi,mr',
      autoDisplay: false
    }, 'google_translate_element');
  };

  // Find language links
  const links = document.querySelectorAll('.footer-links-group a');
  links.forEach(link => {
    if (link.textContent.includes('मराठी')) {
      link.addEventListener('click', (e) => { e.preventDefault(); changeLang('mr'); });
    } else if (link.textContent.includes('हिंदी')) {
      link.addEventListener('click', (e) => { e.preventDefault(); changeLang('hi'); });
    } else if (link.textContent.includes('English')) {
      link.addEventListener('click', (e) => { e.preventDefault(); changeLang('en'); });
    }
  });

  function changeLang(lang) {
    const select = document.querySelector('.goog-te-combo');
    if (select) {
      select.value = lang;
      select.dispatchEvent(new Event('change'));
    }
  }
});
