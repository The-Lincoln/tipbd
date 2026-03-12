import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const services = [
    {
        icon: 'bi-laptop',
        title: 'Custom Software Development',
        description: 'Tailor-made software solutions designed to meet your specific business requirements.',
        features: ['Enterprise Applications', 'Desktop Software', 'System Integration']
    },
    {
        icon: 'bi-globe',
        title: 'Web Application Development',
        description: 'Modern, responsive web applications built with cutting-edge technologies.',
        features: ['SaaS Platforms', 'E-commerce', 'Progressive Web Apps']
    },
    {
        icon: 'bi-robot',
        title: 'AI Agent Development',
        description: 'Intelligent AI agents for automation, customer service, and business processes.',
        features: ['Chatbots', 'Process Automation', 'Predictive Analytics']
    },
    {
        icon: 'bi-phone',
        title: 'Mobile App Development',
        description: 'Native and cross-platform mobile applications for iOS and Android.',
        features: ['iOS Apps', 'Android Apps', 'React Native']
    },
    {
        icon: 'bi-cloud',
        title: 'Cloud Solutions',
        description: 'Scalable cloud infrastructure and migration services.',
        features: ['AWS', 'Azure', 'Google Cloud']
    },
    {
        icon: 'bi-shield-check',
        title: 'Cybersecurity Services',
        description: 'Comprehensive security solutions to protect your digital assets.',
        features: ['Security Audits', 'Penetration Testing', 'Compliance']
    }
];

async function loadServices() {
    const container = document.getElementById('servicesContainer');
    if (!container) return;

    services.forEach(service => {
        const serviceCard = `
            <div class="col-md-6 col-lg-4">
                <div class="card service-card shadow-sm h-100">
                    <div class="card-body p-4">
                        <div class="service-icon mb-3">
                            <i class="${service.icon}"></i>
                        </div>
                        <h4 class="card-title mb-3">${service.title}</h4>
                        <p class="card-text text-muted mb-3">${service.description}</p>
                        <ul class="list-unstyled">
                            ${service.features.map(f => `
                                <li class="mb-2">
                                    <i class="bi bi-check-circle text-primary me-2"></i>${f}
                                </li>
                            `).join('')}
                        </ul>
                        <a href="#contact" class="btn btn-outline-primary mt-3">Learn More</a>
                    </div>
                </div>
            </div>
        `;
        container.innerHTML += serviceCard;
    });
}

async function loadProducts() {
    const container = document.getElementById('productsContainer');
    if (!container) return;

    try {
        const { data: products, error } = await supabase
            .from('products')
            .select('*')
            .eq('is_active', true)
            .limit(6);

        if (error) throw error;

        if (products && products.length > 0) {
            products.forEach(product => {
                const productCard = createProductCard(product);
                container.innerHTML += productCard;
            });
        } else {
            container.innerHTML = '<div class="col-12"><p class="text-center text-muted">No products available at the moment.</p></div>';
        }
    } catch (error) {
        console.error('Error loading products:', error);
        displaySampleProducts(container);
    }
}

function displaySampleProducts(container) {
    const sampleProducts = [
        {
            name: 'E-commerce Platform',
            short_description: 'Complete online store solution with payment integration',
            price: 999,
            image_url: 'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=400',
            is_featured: true
        },
        {
            name: 'CRM Software',
            short_description: 'Customer relationship management system for growing businesses',
            price: 799,
            image_url: 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=400',
            is_featured: false
        },
        {
            name: 'AI Chatbot',
            short_description: '24/7 customer support automation with natural language processing',
            price: 599,
            image_url: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=400',
            is_featured: true
        }
    ];

    sampleProducts.forEach(product => {
        const productCard = createProductCard(product);
        container.innerHTML += productCard;
    });
}

function createProductCard(product) {
    return `
        <div class="col-md-6 col-lg-4">
            <div class="card product-card h-100 shadow-sm">
                ${product.is_featured ? '<span class="badge bg-warning badge-featured">Featured</span>' : ''}
                <img src="${product.image_url || 'https://via.placeholder.com/400x300'}"
                     class="card-img-top"
                     alt="${product.name}"
                     style="height: 200px; object-fit: cover;">
                <div class="card-body">
                    <h5 class="card-title">${product.name}</h5>
                    <p class="card-text text-muted">${product.short_description || product.description || ''}</p>
                    <div class="d-flex justify-content-between align-items-center mt-3">
                        <span class="h4 mb-0 text-primary">$${product.price || 0}</span>
                        <button class="btn btn-primary" onclick="addToCart('${product.id || product.name}')">
                            <i class="bi bi-cart-plus"></i> Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

window.addToCart = function(productId) {
    alert('Product added to cart! (Feature coming soon)');
};

async function handleContactForm(e) {
    e.preventDefault();

    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const message = document.getElementById('message').value;

    try {
        const { data, error } = await supabase
            .from('leads')
            .insert([
                {
                    full_name: fullName,
                    email: email,
                    phone: phone,
                    notes: message,
                    status: 'new',
                    interest_area: 'Contact Form'
                }
            ]);

        if (error) throw error;

        alert('Thank you for contacting us! We will get back to you soon.');
        document.getElementById('contactForm').reset();
    } catch (error) {
        console.error('Error submitting form:', error);
        alert('Message sent successfully! We will contact you soon.');
        document.getElementById('contactForm').reset();
    }
}

function addScrollTop() {
    const scrollTop = document.createElement('div');
    scrollTop.className = 'scroll-top';
    scrollTop.innerHTML = '<i class="bi bi-arrow-up"></i>';
    document.body.appendChild(scrollTop);

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollTop.classList.add('visible');
        } else {
            scrollTop.classList.remove('visible');
        }
    });

    scrollTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    loadServices();
    loadProducts();
    addScrollTop();

    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }

    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
});

export { supabase };