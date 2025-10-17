// Mobile menu toggle
function toggleMenu() {
    document.getElementById('menu').classList.toggle('active');
}

// Header scroll effect
window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    const currentScroll = window.scrollY;
    
    if (currentScroll > 50) {
        header.style.padding = '0.5rem 0';
        header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)';
    } else {
        header.style.padding = '1rem 0';
        header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
    }
});

// Form submission (solo para contacto.html)
function handleSubmit(event) {
    event.preventDefault();
    alert('¡Gracias por tu consulta! Te responderemos a la brevedad.\n\n(Este es un mensaje de demostración. En producción, aquí se enviaría el formulario al servidor)');
    event.target.reset();
}

// Close mobile menu when clicking outside
document.addEventListener('click', function(event) {
    const menu = document.getElementById('menu');
    const toggle = document.querySelector('.menu-toggle');
    
    if (menu && toggle) {
        if (!menu.contains(event.target) && !toggle.contains(event.target)) {
            menu.classList.remove('active');
        }
    }
});