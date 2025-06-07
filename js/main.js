function getCurrentLanguage() {
    const urlParams = new URLSearchParams(window.location.search);
    const urlLang = urlParams.get('lang');

    if (urlLang && ['en', 'hr'].includes(urlLang)) {
        localStorage.setItem('selectedLanguage', urlLang);
        return urlLang;
    }

    const storedLang = localStorage.getItem('selectedLanguage');
    if (storedLang && ['en', 'hr'].includes(storedLang)) {
        return storedLang;
    }

    return 'en'; // fallback
}

function applyTranslations(lang) {
    if (typeof TRANSLATIONS === 'undefined') {
        console.error('TRANSLATIONS object not loaded!');
        return;
    }

    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.dataset.translate;
        if (TRANSLATIONS[lang]?.[key]) {
            element.textContent = TRANSLATIONS[lang][key];
        } else {
            console.warn(`Missing translation for key "${key}" in "${lang}"`);
        }
    });
}

function updateURLParam(lang) {
    const url = new URL(window.location);
    url.searchParams.set('lang', lang);
    window.history.replaceState(null, '', url);
}

function updateAllLinks() {
    const lang = localStorage.getItem('selectedLanguage') || 'en';
    document.querySelectorAll('a[href*="?lang="]').forEach(link => {
        const href = new URL(link.href);
        href.searchParams.set('lang', lang);
        link.href = href.toString();
    });
}

function setLanguage(lang, reload = false) {
    localStorage.setItem('selectedLanguage', lang);
    document.documentElement.lang = lang;
    updateURLParam(lang);
    applyTranslations(lang);
    updateAllLinks();

    if (reload) {
        window.location.reload();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const currentLang = getCurrentLanguage();

    // Init lang
    setLanguage(currentLang);

    // sinkronizira language select
    const languageSelector = document.getElementById('languageSelector');
    if (languageSelector) {
        languageSelector.value = currentLang;

        languageSelector.addEventListener('change', function() {
            const newLang = this.value;
            setLanguage(newLang, true); // hard refresh resets lan
        });
    }
});
