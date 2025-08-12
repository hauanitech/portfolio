// Modern Mobile Menu Implementation
let mobileMenuToggle = document.querySelector('#mobile-menu-toggle');
let mobileMenuOverlay = document.querySelector('#mobile-menu-overlay');
let mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
let body = document.body;

// Toggle mobile menu
function toggleMobileMenu() {
    mobileMenuToggle.classList.toggle('active');
    mobileMenuOverlay.classList.toggle('active');
    body.classList.toggle('menu-open');
}

// Event listeners
if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', toggleMobileMenu);
}

// Close menu when clicking outside
mobileMenuOverlay.addEventListener('click', (e) => {
    if (e.target === mobileMenuOverlay) {
        toggleMobileMenu();
    }
});

// Close menu on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenuOverlay.classList.contains('active')) {
        toggleMobileMenu();
    }
});

// Add smooth transitions for better UX
function addBlurTransitions() {
    const style = document.createElement('style');
    style.textContent = `
        /* Smooth transitions only for content sections */
        section, main, footer {
            transition: filter 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        
        /* Force mobile menu elements to stay sharp */
        .mobile-menu-overlay,
        .mobile-menu-overlay *,
        .mobile-menu-toggle,
        .mobile-menu-toggle *,
        .mobile-navbar,
        .mobile-navbar *,
        .hamburger-line {
            filter: none !important;
            backdrop-filter: none !important;
            -webkit-backdrop-filter: none !important;
            -webkit-filter: none !important;
        }
        
        /* Reset filters when menu is closed */
        body:not(.menu-open) section,
        body:not(.menu-open) main,
        body:not(.menu-open) footer {
            filter: none;
        }
    `;
    document.head.appendChild(style);
}
addBlurTransitions();

// Update active states for mobile menu
function updateActiveMobileLink() {
    const currentHash = window.location.hash || '#';
    const currentPath = window.location.pathname;
    
    mobileNavLinks.forEach(link => {
        link.classList.remove('active');
        
        if (link.getAttribute('href') === currentHash || 
            (currentHash === '#' && link.getAttribute('href') === '#') ||
            (link.getAttribute('href').includes('index') && currentPath.includes(link.getAttribute('href')))) {
            link.classList.add('active');
        }
    });
}

// Enhanced mobile menu link handling
mobileNavLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        console.log('Clicked link with href:', href); // Debug
        
        // Handle internal links (sections)
        if (href.startsWith('#') && href !== '#') {
            e.preventDefault();
            
            // Close menu first
            toggleMobileMenu();
            
            // Wait for menu close animation, then scroll
            setTimeout(() => {
                const targetSection = document.querySelector(href);
                console.log('Target section found:', targetSection); // Debug
                
                if (targetSection) {
                    const headerHeight = 80; // Fixed height instead of calculated
                    const targetPosition = targetSection.offsetTop - headerHeight;
                    console.log('Scrolling to position:', targetPosition); // Debug
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Update URL
                    history.replaceState(null, null, href);
                    updateActiveMobileLink();
                }
            }, 500); // Increased delay
        }
        // Handle language switch and external links
        else if (link.classList.contains('language-switch') || href.includes('.html')) {
            toggleMobileMenu();
        }
        // Handle home link
        else if (href === '#') {
            e.preventDefault();
            toggleMobileMenu();
            setTimeout(() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                history.replaceState(null, null, '/');
                updateActiveMobileLink();
            }, 500);
        }
    });
});

// Update active states on scroll and hash change
window.addEventListener('hashchange', updateActiveMobileLink);
window.addEventListener('load', updateActiveMobileLink);
window.addEventListener('scroll', updateActiveMobileLink);

// Legacy support for existing menu (if any old elements exist)
let menuIcon = document.querySelector('#menu-icon');
let navbar = document.querySelector('.navbar');

if (menuIcon && navbar) {
    menuIcon.onclick = () => {
        menuIcon.classList.toggle('bx-x');
        navbar.classList.toggle('active');
    }
}

setInterval(function () {
    if (window.devtools && window.devtools.isOpen) {
        alert('Outils de développement détectés!');
    }
}, 1000);


document.querySelector('.btn').addEventListener('click', function () {
    var message = document.querySelector('.message');
    message.classList.add('visible');

    setTimeout(function () {
        message.classList.remove('visible');
    }, 5000);
});

// Formulaire 1 :

function envoyerFormulaire(event) {
    event.preventDefault();

    const formData = new FormData(event.target);

    fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(result => {
        console.log('Formulaire soumis avec succès:', result);
        window.location.href = "index.html";
    })
    .catch(error => {
        console.error('Erreur lors de la soumission du formulaire:', error);
    });
}


// Formulaire suite:

const phoneInput = document.getElementById('phone');
const phoneError = document.getElementById('phone-error');

phoneInput.addEventListener('input', function () {
    let value = phoneInput.value.replace(/\s+/g, '');
    if (value.length > 8) {
        value = value.slice(0, 8);
    }
    let formattedValue = '';
    for (let i = 0; i < value.length; i += 2) {
        if (i > 0) formattedValue += ' ';
        formattedValue += value.slice(i, i + 2);
    }
    phoneInput.value = formattedValue;

    if (value.length === 8 || value.length === 0) {
        phoneError.classList.remove('show');
    } else {
        phoneError.classList.add('show');
    }
});

document.querySelector('form').addEventListener('submit', function (e) {
    let value = phoneInput.value.replace(/\s+/g, '');
    if (value.length !== 8) {
        phoneError.classList.add('show');
        e.preventDefault();
    }
});

phoneInput.addEventListener('input', function (e) {
    phoneInput.value = phoneInput.value.replace(/[^0-9\s]/g, '');
})

// suite

function envoyerFormulaire(event) {
    event.preventDefault(); // Empêche le rechargement de la page

    const formData = new FormData(event.target); // Récupère les données du formulaire

    fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(result => {
            console.log('Formulaire soumis avec succès:', result);

            // Attendre 2 secondes avant de rediriger vers une autre page
            setTimeout(() => {
                window.location.href = "index.html"; // Remplace par l'URL de ta page
            }, 0);
        })
        .catch(error => {
            console.error('Erreur lors de la soumission du formulaire:', error);
        });
}