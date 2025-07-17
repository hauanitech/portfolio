let menuIcon = document.querySelector('#menu-icon');
let navbar = document.querySelector('.navbar');
let sections = document.querySelector('.section');
let navLinks = document.querySelector('header nav a');

window.onscroll = () => {
    sections.forEach(sec => {
        let top = window.scrollY;
        let offset = sec.offsetTop - 150;
        let height = sec.offsetHeight;
        let id = sec.getAttribute;

        if (top >= offset && top < offset + height) {
            navLinks.forEach(links => {
                links.classList.remove('active');
                document.querySelector('header nav a [href*=' + id + ']').classList.add('active')
            })
        }
    })
}


menuIcon.onclick = () => {
    menuIcon.classList.toggle('bx-x');
    navbar.classList.toggle('active');
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

// Empêcher l'utilisation de la fonction inspecter sur la page

document.addEventListener('contextmenu', event => event.preventDefault());
document.onkeydown = function (e) {
    if (e.key === "F12" || (e.ctrlKey && e.shiftKey && e.key === "I")) {
        return false;
    }
};

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