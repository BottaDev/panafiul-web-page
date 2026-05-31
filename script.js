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
    'textiles-industriales': 'Textiles industriales'
};

let emailJsReady = false;

function initEmailJS() {
    if (window.emailjs && !emailJsReady) {
        emailjs.init("2pX2mB5pONHffchwW");
        emailJsReady = true;
    }
}

// Header scroll effect — alterna clase .scrolled
window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    if (!header) return;
    header.classList.toggle('scrolled', window.scrollY > 24);
}, { passive: true });

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

/* ============================================================
   Sistema de íconos SVG (reemplaza emojis · iconografía profesional)
   Uso: <i data-ic="nombre"></i>  →  se inyecta el <svg>
   ============================================================ */
const PF_ICONS = {
  support: '<path d="M4 15v-3a8 8 0 0 1 16 0v3"/><rect x="2" y="14" width="4" height="6" rx="1.5"/><rect x="18" y="14" width="4" height="6" rx="1.5"/><path d="M20 18v1a3 3 0 0 1-3 3h-3"/>',
  layers: '<path d="M12 3 3 8l9 5 9-5-9-5Z"/><path d="m3 12 9 5 9-5"/><path d="m3 16 9 5 9-5"/>',
  bolt: '<path d="M13 3 5 13.5h6L10 21l8-10.5h-6L13 3Z"/>',
  sliders: '<path d="M4 8h9"/><path d="M17 8h3"/><circle cx="15" cy="8" r="2"/><path d="M4 16h3"/><path d="M11 16h9"/><circle cx="9" cy="16" r="2"/>',
  truck: '<path d="M2 6.5h11v9.5H2z"/><path d="M13 9.5h4l3 3v3.5h-7z"/><circle cx="6" cy="18" r="1.7"/><circle cx="17" cy="18" r="1.7"/>',
  droplet: '<path d="M12 3s6 6.4 6 10.5a6 6 0 0 1-12 0C6 9.4 12 3 12 3Z"/><path d="M9.5 14a2.5 2.5 0 0 0 2.5 2.5"/>',
  link: '<path d="M9 12h6"/><path d="M10.5 8H8a4 4 0 0 0 0 8h2.5"/><path d="M13.5 8H16a4 4 0 0 1 0 8h-2.5"/>',
  shield: '<path d="M12 3 5 6v5c0 4.5 3 7.6 7 9 4-1.4 7-4.5 7-9V6l-7-3Z"/><path d="m9 12 2 2 4-4"/>',
  weave: '<rect x="3" y="3" width="18" height="18" rx="1.5"/><path d="M3 9h18M3 15h18M9 3v18M15 3v18"/>',
  gauge: '<path d="M4 18a8 8 0 1 1 16 0"/><path d="M12 13.5 16 9"/><circle cx="12" cy="13.5" r="1.4"/>',
  phone: '<path d="M5 4h4l1.8 4.5-2.3 1.6a12 12 0 0 0 5.4 5.4l1.6-2.3L20 15v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7.5 9 6 9-6"/>',
  pin: '<path d="M12 21s7-6 7-11a7 7 0 0 0-14 0c0 5 7 11 7 11Z"/><circle cx="12" cy="10" r="2.5"/>',
  clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
  whatsapp: '<path d="M3.5 20.5 5 16.8A8 8 0 1 1 8.2 19L3.5 20.5Z"/><path d="M8.6 8.7c-.3 1 .3 2.4 1.4 3.5s2.6 1.8 3.6 1.4c.5-.2.9-.9.9-1.4l-1.7-1-.9.8c-.6-.3-1.2-.9-1.6-1.6l.8-.9-1-1.7c-.5 0-1.2.3-1.5.9Z"/>',
  arrow: '<path d="M5 12h14"/><path d="m13 6 6 6-6 6"/>',
  download: '<path d="M12 3v12"/><path d="m7.5 11 4.5 4.5L16.5 11"/><path d="M5 21h14"/>',
  check: '<path d="m5 12.5 4.5 4.5L19 6"/>',
  factory: '<path d="M3 21V10l5 3.2V10l5 3.2V7l5 3.2V21H3Z"/><path d="M7 21v-3.5M13 21v-3.5M17 21v-3.5"/>',
  flask: '<path d="M9 3h6"/><path d="M10 3v6.2l-4.6 7.8A2 2 0 0 0 7 20h10a2 2 0 0 0 1.7-3L14 9.2V3"/><path d="M7.5 15h9"/>',
  car: '<path d="M4 13l1.6-4.6A2 2 0 0 1 7.5 7h9a2 2 0 0 1 1.9 1.4L20 13v5h-3v-1.8H7V18H4v-5Z"/><path d="M4 13h16"/><circle cx="7.5" cy="15.5" r="1.1"/><circle cx="16.5" cy="15.5" r="1.1"/>',
  mountain: '<path d="m2 20 6.5-12 4 6.5 2.5-4L22 20H2Z"/>',
  wheat: '<path d="M12 21V8"/><path d="M12 8c0-2.2 1.6-3.8 3.8-3.8C15.8 6.4 14.2 8 12 8Z"/><path d="M12 8c0-2.2-1.6-3.8-3.8-3.8C8.2 6.4 9.8 8 12 8Z"/><path d="M12 14c0-2.2 1.6-3.8 3.8-3.8C15.8 12.4 14.2 14 12 14Z"/><path d="M12 14c0-2.2-1.6-3.8-3.8-3.8C8.2 12.4 9.8 14 12 14Z"/>',
  hardhat: '<path d="M3.5 17a8.5 8.5 0 0 1 17 0"/><path d="M9.5 8.5V6a2 2 0 0 1 4 0v2.5"/><path d="M2 17h20v2.5H2z"/>',
  pill: '<rect x="3.5" y="8.5" width="17" height="7" rx="3.5"/><path d="M12 8.5v7"/>',
  box: '<path d="M12 3 3 7.5V16l9 4.5 9-4.5V7.5L12 3Z"/><path d="m3 7.5 9 4.5 9-4.5"/><path d="M12 12v8.5"/>',
  seal: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="3.5"/>',
  building: '<path d="M4 21V5l8-2v18"/><path d="M12 21V9.5l8 2V21"/><path d="M7 8h2M7 12h2M7 16h2M16 13.5h1M16 17h1"/><path d="M3 21h18"/>',
  award: '<circle cx="12" cy="9" r="5"/><path d="m8.5 13-1 8 4.5-2.7L16.5 21l-1-8"/>',
  handshake: '<path d="m12 9-2-2-5 4 1.5 1.5"/><path d="m12 9 2-2 5 4-3.5 3.5L12 11l-2 2-2-2"/><path d="M5 11 3 13M21 13l-2-2"/>',
  bulb: '<path d="M9.5 18h5"/><path d="M10 21h4"/><path d="M12 3a6 6 0 0 0-3.8 10.6c.7.6 1.1 1.4 1.2 2.4h5.2c.1-1 .5-1.8 1.2-2.4A6 6 0 0 0 12 3Z"/>',
  target: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.2"/><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none"/>',
  grid: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
  search: '<circle cx="11" cy="11" r="6.5"/><path d="m20 20-3.5-3.5"/>',
  doc: '<path d="M7 3h7l4 4v14H7z"/><path d="M14 3v4h4"/><path d="M10 13h5M10 16.5h5"/>',
  cog: '<circle cx="12" cy="12" r="3.2"/><path d="M12 3v2.5M12 18.5V21M3 12h2.5M18.5 12H21M5.6 5.6l1.8 1.8M16.6 16.6l1.8 1.8M18.4 5.6l-1.8 1.8M7.4 16.6l-1.8 1.8"/>',
  thermometer: '<path d="M12 4a2 2 0 0 0-2 2v8.2a3.5 3.5 0 1 0 4 0V6a2 2 0 0 0-2-2Z"/><path d="M12 9v5"/>'
};

function pfInjectIcons(root) {
  (root || document).querySelectorAll('[data-ic]').forEach(function(el) {
    if (el.dataset.icDone) return;
    const name = el.getAttribute('data-ic');
    const path = PF_ICONS[name];
    if (!path) return;
    el.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + path + '</svg>';
    el.dataset.icDone = '1';
  });
}

document.addEventListener('DOMContentLoaded', function() {
  pfInjectIcons();

  // Reveal on scroll
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(function(entries) {
      entries.forEach(function(e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(function(el, i) {
      el.style.transitionDelay = Math.min(i % 4, 3) * 70 + 'ms';
      io.observe(el);
    });
  } else {
    reveals.forEach(function(el) { el.classList.add('in'); });
  }
});
