/* ==================================================
   RΛD Portfolio - Version 5.0
================================================== */

"use strict";

document.documentElement.classList.add("js-enabled");

document.addEventListener("DOMContentLoaded", () => {
    const typingElement = document.getElementById("typing");
    const languageButton = document.getElementById("langToggle");
    const menuButton = document.getElementById("menuToggle");
    const navigation = document.getElementById("navLinks");
    const header = document.getElementById("siteHeader");
    const backToTopButton = document.getElementById("backToTop");
    const dashboardCard = document.getElementById("dashboardCard");
    const dashboardImage = document.getElementById("dashboardImage");
    const imageModal = document.getElementById("imageModal");
    const modalImage = document.getElementById("modalImage");
    const modalCloseButton = document.getElementById("modalClose");

    const typingWords = {
        en: [
            "Data Engineer",
            "Data Governance Professional",
            "AI & Machine Learning Enthusiast",
            "Software Developer"
        ],
        ar: [
            "مهندسة بيانات",
            "متخصصة في حوكمة البيانات",
            "مهتمة بالذكاء الاصطناعي وتعلم الآلة",
            "مطورة برمجيات"
        ]
    };

    let currentLanguage = getSavedLanguage();
    let typingTimeout = null;
    let wordIndex = 0;
    let characterIndex = 0;
    let deleting = false;

    function getSavedLanguage() {
        try {
            const saved = localStorage.getItem("portfolioLanguage");

            return saved === "ar" || saved === "en"
                ? saved
                : "en";
        } catch (error) {
            return "en";
        }
    }

    function saveLanguage(language) {
        try {
            localStorage.setItem(
                "portfolioLanguage",
                language
            );
        } catch (error) {
            // الموقع سيستمر بالعمل حتى لو كان localStorage غير متاح.
        }
    }

    function applyLanguage(language) {
        currentLanguage = language;
        saveLanguage(language);

        document.documentElement.lang = language;

        document.documentElement.dir =
            language === "ar"
                ? "rtl"
                : "ltr";

        document
            .querySelectorAll("[data-en][data-ar]")
            .forEach((element) => {
                const translatedText =
                    element.dataset[language];

                if (
                    typeof translatedText === "string"
                ) {
                    element.textContent =
                        translatedText;
                }
            });

        if (languageButton) {
            languageButton.textContent =
                language === "en"
                    ? "AR"
                    : "EN";

            languageButton.setAttribute(
                "aria-label",
                language === "en"
                    ? "Switch to Arabic"
                    : "التبديل إلى الإنجليزية"
            );
        }

        resetTypingEffect();
    }

    function resetTypingEffect() {
        if (typingTimeout) {
            clearTimeout(typingTimeout);
        }

        wordIndex = 0;
        characterIndex = 0;
        deleting = false;

        if (typingElement) {
            typingElement.textContent = "";
            runTypingEffect();
        }
    }

    function runTypingEffect() {
        if (!typingElement) {
            return;
        }

        const words =
            typingWords[currentLanguage] ||
            typingWords.en;

        const currentWord =
            words[wordIndex];

        if (!deleting) {
            characterIndex += 1;

            typingElement.textContent =
                currentWord.slice(
                    0,
                    characterIndex
                );

            if (
                characterIndex >=
                currentWord.length
            ) {
                deleting = true;

                typingTimeout = setTimeout(
                    runTypingEffect,
                    1250
                );

                return;
            }
        } else {
            characterIndex -= 1;

            typingElement.textContent =
                currentWord.slice(
                    0,
                    Math.max(
                        0,
                        characterIndex
                    )
                );

            if (characterIndex <= 0) {
                deleting = false;

                wordIndex =
                    (wordIndex + 1) %
                    words.length;
            }
        }

        typingTimeout = setTimeout(
            runTypingEffect,
            deleting ? 38 : 76
        );
    }

    if (languageButton) {
        languageButton.addEventListener(
            "click",
            () => {
                applyLanguage(
                    currentLanguage === "en"
                        ? "ar"
                        : "en"
                );
            }
        );
    }

    function setMenuState(isOpen) {
        if (!menuButton || !navigation) {
            return;
        }

        menuButton.classList.toggle(
            "open",
            isOpen
        );

        navigation.classList.toggle(
            "open",
            isOpen
        );

        menuButton.setAttribute(
            "aria-expanded",
            String(isOpen)
        );
    }

    if (menuButton && navigation) {
        menuButton.addEventListener(
            "click",
            () => {
                setMenuState(
                    !navigation.classList.contains(
                        "open"
                    )
                );
            }
        );

        navigation
            .querySelectorAll("a")
            .forEach((link) => {
                link.addEventListener(
                    "click",
                    () => {
                        setMenuState(false);
                    }
                );
            });

        document.addEventListener(
            "click",
            (event) => {
                if (
                    !navigation.classList.contains(
                        "open"
                    )
                ) {
                    return;
                }

                if (
                    !event.target.closest(
                        ".navbar"
                    )
                ) {
                    setMenuState(false);
                }
            }
        );
    }

    const navigationLinks =
        document.querySelectorAll(
            '.nav-links a[href^="#"]'
        );

    const sections =
        document.querySelectorAll(
            "main section[id]"
        );

    navigationLinks.forEach((link) => {
        link.addEventListener(
            "click",
            (event) => {
                const targetSelector =
                    link.getAttribute("href");

                const target =
                    targetSelector
                        ? document.querySelector(
                            targetSelector
                        )
                        : null;

                if (!target) {
                    return;
                }

                event.preventDefault();

                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }
        );
    });

    function updatePageOnScroll() {
        const scrollPosition =
            window.scrollY;

        let activeSection = "home";

        sections.forEach((section) => {
            if (
                scrollPosition >=
                section.offsetTop - 180
            ) {
                activeSection =
                    section.id;
            }
        });

        navigationLinks.forEach((link) => {
            link.classList.toggle(
                "active",
                link.getAttribute("href") ===
                    `#${activeSection}`
            );
        });

        if (header) {
            header.classList.toggle(
                "scrolled",
                scrollPosition > 20
            );
        }

        if (backToTopButton) {
            backToTopButton.classList.toggle(
                "visible",
                scrollPosition > 600
            );
        }
    }

    window.addEventListener(
        "scroll",
        updatePageOnScroll,
        {
            passive: true
        }
    );

    updatePageOnScroll();

    if (backToTopButton) {
        backToTopButton.addEventListener(
            "click",
            () => {
                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });
            }
        );
    }

    function initializeRevealAnimation() {
        const revealElements =
            document.querySelectorAll(
                ".reveal"
            );

        if (
            !(
                "IntersectionObserver" in
                window
            )
        ) {
            revealElements.forEach(
                (element) => {
                    element.classList.add(
                        "show"
                    );
                }
            );

            return;
        }

        const observer =
            new IntersectionObserver(
                (
                    entries,
                    revealObserver
                ) => {
                    entries.forEach(
                        (entry) => {
                            if (
                                entry.isIntersecting
                            ) {
                                entry.target.classList.add(
                                    "show"
                                );

                                revealObserver.unobserve(
                                    entry.target
                                );
                            }
                        }
                    );
                },
                {
                    threshold: 0.06,
                    rootMargin:
                        "0px 0px -28px 0px"
                }
            );

        revealElements.forEach(
            (element) => {
                observer.observe(element);
            }
        );

        document
            .querySelectorAll(
                "#home .reveal"
            )
            .forEach((element) => {
                element.classList.add(
                    "show"
                );
            });
    }

    initializeRevealAnimation();

    const filterButtons =
        document.querySelectorAll(
            ".filter-button"
        );

    const projectCards =
        document.querySelectorAll(
            ".project-card[data-category]"
        );

    filterButtons.forEach((button) => {
        button.addEventListener(
            "click",
            () => {
                const selectedFilter =
                    button.dataset.filter ||
                    "all";

                filterButtons.forEach(
                    (item) => {
                        item.classList.remove(
                            "active"
                        );
                    }
                );

                button.classList.add(
                    "active"
                );

                projectCards.forEach(
                    (card) => {
                        const categories =
                            (
                                card.dataset
                                    .category ||
                                ""
                            ).split(" ");

                        const shouldShow =
                            selectedFilter ===
                                "all" ||
                            categories.includes(
                                selectedFilter
                            );

                        card.classList.toggle(
                            "is-hidden",
                            !shouldShow
                        );
                    }
                );
            }
        );
    });

    function dashboardAvailable() {
        return Boolean(
            dashboardImage &&
                dashboardImage.dataset
                    .failed !== "true" &&
                dashboardImage.naturalWidth >
                    0
        );
    }

    function openImageModal() {
        if (
            !imageModal ||
            !dashboardAvailable()
        ) {
            return;
        }

        imageModal.classList.add("open");

        imageModal.setAttribute(
            "aria-hidden",
            "false"
        );

        document.body.classList.add(
            "modal-open"
        );

        modalCloseButton?.focus();
    }

    function closeImageModal() {
        if (!imageModal) {
            return;
        }

        imageModal.classList.remove(
            "open"
        );

        imageModal.setAttribute(
            "aria-hidden",
            "true"
        );

        document.body.classList.remove(
            "modal-open"
        );

        dashboardCard?.focus();
    }

    if (dashboardCard) {
        dashboardCard.addEventListener(
            "click",
            openImageModal
        );

        dashboardCard.addEventListener(
            "keydown",
            (event) => {
                if (
                    event.key === "Enter" ||
                    event.key === " "
                ) {
                    event.preventDefault();
                    openImageModal();
                }
            }
        );
    }

    modalCloseButton?.addEventListener(
        "click",
        closeImageModal
    );

    imageModal?.addEventListener(
        "click",
        (event) => {
            if (
                event.target === imageModal
            ) {
                closeImageModal();
            }
        }
    );

    document.addEventListener(
        "keydown",
        (event) => {
            if (
                event.key === "Escape" &&
                imageModal?.classList.contains(
                    "open"
                )
            ) {
                closeImageModal();
            }
        }
    );

    function hideMissingDashboard() {
        if (dashboardImage) {
            dashboardImage.dataset.failed =
                "true";
        }

        dashboardCard?.remove();
        imageModal?.remove();
    }

    if (dashboardImage) {
        dashboardImage.addEventListener(
            "error",
            hideMissingDashboard,
            {
                once: true
            }
        );

        dashboardImage.addEventListener(
            "load",
            () => {
                if (modalImage) {
                    modalImage.src =
                        dashboardImage.currentSrc ||
                        dashboardImage.src;
                }
            },
            {
                once: true
            }
        );

        if (
            dashboardImage.complete &&
            dashboardImage.naturalWidth ===
                0
        ) {
            hideMissingDashboard();
        }
    }

    window.addEventListener(
        "resize",
        () => {
            if (window.innerWidth > 860) {
                setMenuState(false);
            }
        }
    );

    applyLanguage(currentLanguage);
});