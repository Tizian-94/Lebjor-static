const CURRENT_LANGUAGE = '{{ LANGUAGE_CODE|default:"en" }}';

function handleLanguageChange(lang) {
    // Update frontend translations
    applyTranslations(lang);
    
    // Update Django backend language
    document.getElementById('hiddenLanguage').value = lang;
    document.getElementById('languageForm').submit();
}

// Initialize translations
document.addEventListener('DOMContentLoaded', () => {
    // Set initial language
    document.getElementById('languageSelector').value = CURRENT_LANGUAGE;
    applyTranslations(CURRENT_LANGUAGE);
    
    // Set up language selector handler
    document.getElementById('languageSelector').addEventListener('change', function() {
        handleLanguageChange(this.value);
    });
});

// Translation function for static content
function applyTranslations(lang) {
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.dataset.translate;
        if (TRANSLATIONS[lang]?.[key]) {
            element.textContent = TRANSLATIONS[lang][key];
        }
    });
}

//carousel
// Update dynamic content when language changes
function updateDynamicContent(lang) {
    // Update carousel items
    document.querySelectorAll('[data-dynamic]').forEach(element => {
        const itemId = element.dataset.itemId;
        const field = element.dataset.dynamic;
        
        fetch(`/get-item/${itemId}/?lang=${lang}`)
            .then(response => response.json())
            .then(data => {
                element.textContent = data[field];
            });
    });
}

// Modify handleLanguageChange function
function handleLanguageChange(lang) {
    applyTranslations(lang);
    updateDynamicContent(lang);
    document.getElementById('hiddenLanguage').value = lang;
    document.getElementById('languageForm').submit();
}

document.addEventListener('DOMContentLoaded', () => {
  // --- your existing language‑init code here --
  // … applyTranslations, languageSelector, etc.

  // ==== NEW: View‑item modal logic ====
  document.querySelectorAll('.view-item-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.card');
      const imgSrc   = card.querySelector('img').src;
      const title    = card.querySelector('.card-title').textContent;
      const category = card.querySelector('.card-text span').textContent;
      const desc     = card.querySelectorAll('.card-text')[1].textContent;
      const price    = card.querySelector('.h5').textContent;

      const modalEl = document.getElementById('itemModal');
      modalEl.querySelector('#itemModalLabel').textContent   = title;
      modalEl.querySelector('.modal-img').src                = imgSrc;
      modalEl.querySelector('.modal-category').textContent   = category;
      modalEl.querySelector('.modal-desc').textContent       = desc;
      modalEl.querySelector('.modal-price').textContent      = price;

      // launch the modal
      new bootstrap.Modal(modalEl).show();
    });
  });
});

