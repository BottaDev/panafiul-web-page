// Mobile menu toggle
function toggleMenu() {
    document.getElementById('menu').classList.toggle('active');
}

const PRODUCT_LABELS = {
    'mangueras-compuestas': 'Mangueras compuestas',
    'mangueras-industriales': 'Mangueras industriales',
    'mangueras-plasticas': 'Mangueras plásticas',
    'acoples-rapidos': 'Acoples rápidos a palanca',
    'acoples-neumaticos': 'Acoples rápidos neumáticos',
    'acoples-media-vuelta': 'Acoples media vuelta',
    'acoples-especiales-aluminio': 'Acoples especiales de aluminio',
    'empaquetaduras-industriales': 'Empaquetaduras industriales',
    'juntas-de-sellado': 'Materiales para juntas de sellado',
    'textiles-industriales': 'Textiles industriales',
    'valvulas-industriales': 'Válvulas industriales'
};

let emailJsReady = false;

function initEmailJS() {
    if (window.emailjs && !emailJsReady) {
        emailjs.init("2pX2mB5pONHffchwW");
        emailJsReady = true;
    }
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

document.addEventListener('DOMContentLoaded', function() {
    initEmailJS();

    const params = new URLSearchParams(window.location.search);
    const productValue = params.get('producto');
    const productLabel = PRODUCT_LABELS[productValue] || productValue;
    const productSelect = document.querySelector('[name="producto"]');
    const typeSelect = document.querySelector('[name="tipo_consulta"]');
    const messageField = document.querySelector('[name="mensaje"]');
    const originField = document.querySelector('[name="origen"]');
    const productOutput = document.querySelector('[data-product-name]');

    if (productSelect && productValue) {
        productSelect.value = productValue;
    }

    if (typeSelect && productValue) {
        typeSelect.value = 'Cotización';
    }

    if (messageField && productLabel) {
        messageField.placeholder = 'Necesito cotizar ' + productLabel + '. Fluido, presión, temperatura, diámetro y cantidad aproximada:';
    }

    if (originField) {
        originField.value = document.referrer || window.location.pathname;
    }

    if (productOutput && productLabel) {
        productOutput.textContent = ' sobre ' + productLabel;
    }
});

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
        producto: PRODUCT_LABELS[formData.get('producto')] || formData.get('producto') || 'No especificó',
        origen: formData.get('origen') || window.location.pathname,
        time: time
    };
    
    console.log('Enviando email con datos:', templateParams);

    initEmailJS();

    if (!window.emailjs) {
        const subject = encodeURIComponent(templateParams.title + ' - ' + templateParams.producto);
        const body = encodeURIComponent(
            'Nombre: ' + templateParams.name + '\n' +
            'Empresa: ' + templateParams.empresa + '\n' +
            'Email: ' + templateParams.email + '\n' +
            'Teléfono: ' + templateParams.telefono + '\n' +
            'Producto: ' + templateParams.producto + '\n\n' +
            templateParams.message
        );

        window.location.href = 'mailto:ventas@panafiul.com.ar?subject=' + subject + '&body=' + body;
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        return;
    }
    
    // Send email using EmailJS
    emailjs.send('service_gzjx69p', 'template_8cnrjxx', templateParams)
        .then(function(response) {
            console.log('Email enviado correctamente.', response.status, response.text);
            const productSlug = formData.get('producto') || '';
            const thanksUrl = productSlug ? 'gracias.html?producto=' + encodeURIComponent(productSlug) : 'gracias.html';
            form.reset();
            window.location.href = thanksUrl;
        })
        .catch(function(error) {
            console.error('Error al enviar:', error);
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
