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
  }
  
  async loadProjectTemplates() {
    const projects = [
      { name: 'project1', path: '/src/templates/project1.hbs', target: '#project1' },
      { name: 'project2', path: '/src/templates/project2.hbs', target: '#project2' },
      { name: 'project3', path: '/src/templates/project3.hbs', target: '#project3' },
      { name: 'project4', path: '/src/templates/project4.hbs', target: '#project4' },
      { name: 'project5', path: '/src/templates/project5.hbs', target: '#project5' }
    ];
    
    try {
      for (const project of projects) {
        await templateEngine.loadAndRender(
          project.name,
          project.path,
          {},
          project.target
        );
      }
      
      // Trigger event for any dependent code
      window.dispatchEvent(new CustomEvent('templatesLoaded'));
    } catch (error) {
      console.error('❌ Error loading templates:', error);
      console.error('Error details:', error.message, error.stack);
    }
  }
  
  initializeForms() {
    // Initialize contact form
    const contactForm = document.querySelector('#contact-form');
    if (contactForm) {
      new FormHandler('#contact-form', {
        successMessage: 'Tack för ditt meddelande. Vi återkommer till dig snarast.',
        errorMessage: 'Ett fel uppstod. Vänligen försök igen.',
        successDelay: 5000
      });
    }
    
    // Initialize notify form if exists
    const notifyForm = document.querySelector('.notify-form');
    if (notifyForm) {
      // Mailchimp integration would go here
    }
  }
  
  initializeEffects() {
    // Kenburns background effect
    this.initKenburns();
    
    // History section kenburns
    this.initHistoryKenburns();
    
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
      return;
    }
    
    const galleryElements = document.querySelectorAll('.my-gallery');
    if (galleryElements.length === 0) return;
    
    // Use the existing gallery-init.js function
    if (typeof initPhotoSwipeFromDOM !== 'undefined') {
      initPhotoSwipeFromDOM('.my-gallery');
    }
  }
  
  initKenburns() {
    const kenburnsElement = document.querySelector('#bgndKenburns');
    if (!kenburnsElement) return;
    
    // Fresh 2026 project images for the background slideshow
    const images = [
      '/img/2026/project_1.jpg',
      '/img/2026/project_2.jpg',
      '/img/2026/project_3.jpg',
      '/img/2026/project_4.jpg',
      '/img/2026/project_5.jpg',
      '/img/2026/project_6.jpg',
      '/img/2026/project_7.jpg',
      '/img/2026/project_8.jpg'
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
  
  initHistoryKenburns() {
    const kenburnsElement = document.querySelector('#historyKenburns');
    if (!kenburnsElement) return;
    
    // Fresh 2026 work images for history section
    const images = [
      '/img/2026/work_1.jpg',
      '/img/2026/work_2.jpg',
      '/img/2026/work_3.jpg',
      '/img/2026/work_4.jpg',
      '/img/2026/work_5.jpg'
    ];
    
    // Create two layers for crossfade
    const layer1 = document.createElement('div');
    const layer2 = document.createElement('div');
    
    const layerStyles = {
      position: 'absolute',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      transition: 'opacity 1s ease-in-out'
    };
    
    Object.assign(layer1.style, layerStyles);
    Object.assign(layer2.style, layerStyles);
    
    layer1.style.backgroundImage = `url(${images[0]})`;
    layer2.style.backgroundImage = `url(${images[1]})`;
    layer2.style.opacity = '0';
    
    kenburnsElement.appendChild(layer1);
    kenburnsElement.appendChild(layer2);
    
    // Ken Burns animation
    let currentIndex = 0;
    let activeLayer = layer1;
    let inactiveLayer = layer2;
    const duration = 5000;
    let startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const scale = 1 + (progress * 0.2);
      
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
  }
  
  initializeMap() {
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
