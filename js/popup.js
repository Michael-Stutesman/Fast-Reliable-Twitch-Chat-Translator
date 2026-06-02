document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.getElementById('toggle');
    const saveBtn   = document.getElementById('save');
    const langSel   = document.getElementById('language');

    // 🌍 Main Twitch languages
    const LANGUAGES = [
        ["auto", "Auto Detect"],
        ["en", "English"],
        ["es", "Spanish"],
        ["pt", "Portuguese"],
        ["pt-BR", "Portuguese (Brazil)"],
        ["fr", "French"],
        ["de", "German"],
        ["it", "Italian"],
        ["nl", "Dutch"],
        ["ru", "Russian"],
        ["pl", "Polish"],
        ["tr", "Turkish"],
        ["ar", "Arabic"],
        ["hi", "Hindi"],
        ["ur", "Urdu"],
        ["id", "Indonesian"],
        ["vi", "Vietnamese"],
        ["th", "Thai"],
        ["ko", "Korean"],
        ["ja", "Japanese"],
        ["zh-CN", "Chinese (Simplified)"],
        ["zh-TW", "Chinese (Traditional)"]
    ];

    // build dropdown
    LANGUAGES.forEach(([code, name]) => {
        const opt = document.createElement("option");
        opt.value = code;
        opt.textContent = name;
        langSel.appendChild(opt);
    });

    // restore saved language
    chrome.storage.local.get('targetLanguage', ({ targetLanguage }) => {
        if (targetLanguage) {
            langSel.value = targetLanguage;
        }
    });

    // ⚡ HOT FIX: instant language switch (content script aware)
    langSel.addEventListener('change', () => {
        const newLang = langSel.value;

        chrome.storage.local.set({
            targetLanguage: newLang
        });

        chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
            if (!tab?.id) return;

            chrome.tabs.sendMessage(tab.id, {
                action: "updateLanguage",
                language: newLang
            });
        });

        console.log("Language instantly switched:", newLang);
    });

    // toggle setup
    toggleBtn.disabled = false;
    toggleBtn.style.backgroundColor = '#007bff';

    chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
        if (!tab?.url?.includes('twitch.tv')) {
            toggleBtn.disabled = true;
            toggleBtn.style.backgroundColor = '#6c757d';
            console.log('This extension only works on twitch.tv.');
            return;
        }

        const tabId = tab.id;
        let isEnabledCached = false;

        chrome.storage.local.get('isEnabled', ({ isEnabled }) => {
            isEnabledCached = !!isEnabled;
            toggleBtn.textContent = isEnabledCached
                ? 'Disable Translation'
                : 'Enable Translation';
        });

        toggleBtn.addEventListener('click', () => {
            isEnabledCached = !isEnabledCached;

            chrome.storage.local.set({ isEnabled: isEnabledCached }, () => {
                toggleBtn.textContent = isEnabledCached
                    ? 'Disable Translation'
                    : 'Enable Translation';

                chrome.tabs.sendMessage(tabId, {
                    action: 'updateState',
                    isEnabled: isEnabledCached
                });
            });
        });
    });

    // remove save button (no longer needed)
    saveBtn?.remove();
});
