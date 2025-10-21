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

// Initialize EmailJS
(function() {
    emailjs.init("2pX2mB5pONHffchwW");
})();

function handleSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando...';
    
    const formData = new FormData(form);
    
    // Get current time in HH:MM format
    const now = new Date();
    const time = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
    
    const templateParams = {
        name: formData.get('nombre') || '',
        email: formData.get('email') || '',
        telefono: formData.get('telefono') || '',
        empresa: formData.get('empresa') || 'No especificó',
        message: formData.get('mensaje') || '',
        title: formData.get('tipo_consulta') || 'Consulta general',
        time: time
    };
    
    console.log('📧 Enviando email con datos:', templateParams);
    
    // Send email using EmailJS
    emailjs.send('service_gzjx69p', 'template_8cnrjxx', templateParams)
        .then(function(response) {
            console.log('✅ Email enviado correctamente!', response.status, response.text);
            alert('¡Gracias por tu consulta! Te responderemos a la brevedad.');
            form.reset();
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        })
        .catch(function(error) {
            console.error('❌ Error al enviar:', error);
            alert('Hubo un error al enviar tu consulta. Por favor, intenta nuevamente o contáctanos directamente por WhatsApp al +54 9 11 4157-6110');
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        });
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