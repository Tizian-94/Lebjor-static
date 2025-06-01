// Unified language handling system
function getCurrentLanguage() {
    // Check URL parameter first
    const urlParams = new URLSearchParams(window.location.search);
    const urlLang = urlParams.get('lang');
    
    // Then check localStorage
    const storedLang = localStorage.getItem('selectedLanguage');
    
    // Finally check HTML attribute
    const htmlLang = document.documentElement.lang || 'en';
    
    return urlLang || storedLang || htmlLang;
}

function setLanguage(lang) {
    // Save to localStorage
    localStorage.setItem('selectedLanguage', lang);
    
    // Update HTML lang attribute
    document.documentElement.lang = lang;
    
    // Apply translations immediately
    applyTranslations(lang);
    
    // Update URL without reloading (if supported)
    if (window.history.replaceState) {
        const url = new URL(window.location);
        url.searchParams.set('lang', lang);
        window.history.replaceState(null, '', url);
    }
    
    // Update Django backend if elements exist
    if (document.getElementById('hiddenLanguage') && document.getElementById('languageForm')) {
        document.getElementById('hiddenLanguage').value = lang;
        document.getElementById('languageForm').submit();
    }
}

// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
    const currentLang = getCurrentLanguage();
    
    // Set language immediately
    setLanguage(currentLang);
    
    // Set up language selector
    const languageSelector = document.getElementById('languageSelector');
    if (languageSelector) {
        languageSelector.value = currentLang;
        languageSelector.addEventListener('change', function() {
            setLanguage(this.value);
        });
    }
    
    // Set up modal functionality
    document.querySelectorAll('.view-item-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const card = btn.closest('.card');
            const imgSrc = card.querySelector('img').src;
            const title = card.querySelector('.card-title').textContent;
            const category = card.querySelector('.card-text span').textContent;
            const desc = card.querySelectorAll('.card-text')[1].textContent;
            const price = card.querySelector('.h5').textContent;

            const modalEl = document.getElementById('itemModal');
            modalEl.querySelector('#itemModalLabel').textContent = title;
            modalEl.querySelector('.modal-img').src = imgSrc;
            modalEl.querySelector('.modal-category').textContent = category;
            modalEl.querySelector('.modal-desc').textContent = desc;
            modalEl.querySelector('.modal-price').textContent = price;

            new bootstrap.Modal(modalEl).show();
        });
    });
});

// Translation function
function applyTranslations(lang) {
    if (typeof TRANSLATIONS === 'undefined') {
        console.error('TRANSLATIONS object not loaded!');
        return;
    }
    
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.dataset.translate;
        if (TRANSLATIONS[lang]?.[key]) {
            element.textContent = TRANSLATIONS[lang][key];
        }
    });
}

// Update dynamic content
function updateDynamicContent(lang) {
    document.querySelectorAll('[data-dynamic]').forEach(element => {
        const itemId = element.dataset.itemId;
        const field = element.dataset.dynamic;
        
        fetch(`/get-item/${itemId}/?lang=${lang}`)
            .then(response => response.json())
            .then(data => {
                element.textContent = data[field];
            })
            .catch(error => console.error('Translation fetch error:', error));
    });
}

// Add this after your existing code in main.js
function updateAllLinks() {
    const lang = localStorage.getItem('selectedLanguage') || 'en';
    document.querySelectorAll('a[href*="?lang="]').forEach(link => {
        const href = link.getAttribute('href');
        if (href.includes('?lang=')) {
            link.href = href.replace('?lang=', `?lang=${lang}`);
        }
    });

    // Also update buttons with onclick navigation
    document.querySelectorAll('button[onclick*="location.href"]').forEach(button => {
        const onclick = button.getAttribute('onclick');
        if (onclick.includes('?')) {
            button.setAttribute('onclick', onclick.replace('?', `?lang=${lang}&`));
        } else {
            button.setAttribute('onclick', onclick.replace(');', `?lang=${lang}');`));
        }
    });
}

// Call this function during initialization
document.addEventListener('DOMContentLoaded', () => {
    // ... your existing initialization code ...
    
    // Add this at the end:
    updateAllLinks();
});

// Also call it when language changes
function handleLanguageChange(lang) {
    // ... your existing code ...
    updateAllLinks();
}