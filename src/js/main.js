/**
 * Olofstorp Allservice - Main Application
 * Modern vanilla JavaScript implementation
 */

import '../css/loaders/loader-monochrome.css';
import '../css/plugins.css';
import '../css/main.css';
import '../css/map.css';

// Import gallery images to ensure they're bundled
import './gallery-images.js';

import { ready } from './utils/dom.js';
import loader from './modules/Loader.js';
import navigation from './modules/Navigation.js';
import templateEngine from './modules/TemplateEngine.js';
import FormHandler from './modules/FormHandler.js';
import Map from './modules/Map.js';

class App {
  constructor() {
    this.config = {
      googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyC4slvWy8btLEoMcdrtVw0T3ZPX47vunN4',
      formName: import.meta.env.VITE_FORM_NAME || 'site-contact-form',
      adminEmail: import.meta.env.VITE_ADMIN_EMAIL || 'info@olofstorps.se'
    };
    this.map = null;
  }
  
  async init() {
    console.log('🚀 Initializing Olofstorp Allservice...');
    
    // Load project templates
    await this.loadProjectTemplates();
    
    // Initialize navigation
    navigation.init();
    
    // Initialize forms
    this.initializeForms();
    
    // Initialize effects
    this.initializeEffects();
    
    // Initialize Leaflet map
    this.initializeMap();
    
    // Hide loader after initialization
    loader.hide();
    
    console.log('✅ Application initialized successfully!');
  }
  
  async loadProjectTemplates() {
    console.log('📄 Loading project templates...');
    
    const projects = [
      { name: 'project1', path: '/src/templates/project1.hbs', target: '#project1' },
      { name: 'project2', path: '/src/templates/project2.hbs', target: '#project2' },
      { name: 'project3', path: '/src/templates/project3.hbs', target: '#project3' },
      { name: 'project4', path: '/src/templates/project4.hbs', target: '#project4' },
      { name: 'project5', path: '/src/templates/project5.hbs', target: '#project5' }
    ];
    
    try {
      for (const project of projects) {
        console.log(`Loading ${project.name} from ${project.path}...`);
        await templateEngine.loadAndRender(
          project.name,
          project.path,
          {},
          project.target
        );
        const target = document.querySelector(project.target);
        console.log(`${project.name} rendered. Content length:`, target?.innerHTML?.length || 0);
      }
      console.log('✅ Templates loaded successfully');
      
      // Trigger event for any dependent code
      window.dispatchEvent(new CustomEvent('templatesLoaded'));
    } catch (error) {
      console.error('❌ Error loading templates:', error);
      console.error('Error details:', error.message, error.stack);
    }
  }
  
  initializeForms() {
    console.log('📝 Initializing forms...');
    
    // Initialize contact form
    const contactForm = document.querySelector('#contact-form');
    if (contactForm) {
      new FormHandler('#contact-form', {
        successMessage: 'Tack för ditt meddelande. Vi återkommer till dig snarast.',
        errorMessage: 'Ett fel uppstod. Vänligen försök igen.',
        successDelay: 5000
      });
      console.log('✅ Contact form initialized');
    }
    
    // Initialize notify form if exists
    const notifyForm = document.querySelector('.notify-form');
    if (notifyForm) {
      // Mailchimp integration would go here
      console.log('✅ Notify form found');
    }
  }
  
  initializeEffects() {
    console.log('✨ Initializing visual effects...');
    
    // Kenburns background effect
    this.initKenburns();
    
    // Gallery/PhotoSwipe
    this.initGallery();
    
    // Particles.js if element exists
    const particlesElement = document.querySelector('#particles-js');
    if (particlesElement) {
      this.initParticles();
    }
  }
  
  initGallery() {
    // Check if PhotoSwipe is loaded
    if (typeof PhotoSwipe === 'undefined' || typeof PhotoSwipeUI_Default === 'undefined') {
      console.log('⚠️ PhotoSwipe not loaded, skipping gallery initialization');
      return;
    }
    
    const galleryElements = document.querySelectorAll('.my-gallery');
    if (galleryElements.length === 0) return;
    
    console.log('🖼️ Initializing PhotoSwipe gallery');
    
    // Use the existing gallery-init.js function
    if (typeof initPhotoSwipeFromDOM !== 'undefined') {
      initPhotoSwipeFromDOM('.my-gallery');
    }
  }
  
  initKenburns() {
    const kenburnsElement = document.querySelector('#bgndKenburns');
    if (!kenburnsElement) return;
    
    // Using actual project images for the background slideshow
    const images = [
      '/img/olofstorps/exterior_house_1.jpg',
      '/img/olofstorps/exterior_house_2.jpg',
      '/img/olofstorps/fasad_2.jpg'
    ];
    
    // Create two layers
    const layer1 = document.createElement('div');
    const layer2 = document.createElement('div');
    layer1.className = 'kenburns-layer';
    layer2.className = 'kenburns-layer';
    layer2.style.opacity = '0';
    kenburnsElement.appendChild(layer1);
    kenburnsElement.appendChild(layer2);
    
    // Preload all images
    images.forEach(src => {
      const img = new Image();
      img.src = src;
    });
    
    // Set initial image
    layer1.style.backgroundImage = `url(${images[0]})`;
    
    let currentIndex = 0;
    let activeLayer = layer1;
    let inactiveLayer = layer2;
    let startTime = Date.now();
    const duration = 5000;
    const maxScale = 1.2;
    
    // Smooth continuous animation
    const animate = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = (elapsed % duration) / duration;
      
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const scale = 1 + (maxScale - 1) * eased;
      
      // Apply to active layer only
      activeLayer.style.transform = `scale(${scale})`;
      
      requestAnimationFrame(animate);
    };
    
    animate();
    
    // Change images
    setInterval(() => {
      currentIndex = (currentIndex + 1) % images.length;
      
      // Prepare inactive layer
      inactiveLayer.style.backgroundImage = `url(${images[currentIndex]})`;
      inactiveLayer.style.transform = 'scale(1)';
      
      // Crossfade
      inactiveLayer.style.opacity = '1';
      activeLayer.style.opacity = '0';
      
      // Swap layers
      [activeLayer, inactiveLayer] = [inactiveLayer, activeLayer];
      
      // Reset timer for new zoom
      startTime = Date.now();
    }, duration);
  }
  
  initParticles() {
    // Particles.js initialization would go here
    // For now, we'll skip this as it's a heavy library
    console.log('ℹ️  Particles.js initialization skipped');
  }
  
  initializeMap() {
    console.log('🗺️ Initializing Leaflet map...');
    this.map = new Map('google-container', {
      center: [57.7505, 12.2908], // Stora Älsjövägen 44, 424 70 Olofstorp
      zoom: 15
    });
    this.map.init();
  }
}

// Initialize app when DOM is ready
ready(() => {
  const app = new App();
  app.init();
});

// Export for potential external use
export default App;
