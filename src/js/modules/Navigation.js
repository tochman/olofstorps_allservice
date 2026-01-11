/**
 * Navigation and Section Management
 * 
 * ===========================================
 * STRUCTURE:
 * ===========================================
 * - Main page: Always visible as base layer
 * - Sections (about, works, contact): Full-screen overlays
 * - Popup (writealine): 50% width on desktop (right side), full screen on mobile
 * 
 * ===========================================
 * USER JOURNEY - DESKTOP (≥1200px):
 * ===========================================
 * 1. Main page visible with horizontal menu
 * 2. Click menu item → Section slides in (panels animate from top/bottom)
 * 3. Click close → Section slides out
 * 4. From contact section, click "Kontakta oss":
 *    - Contact info panel slides UP and out
 *    - Writealine slides UP from bottom (50% width, right side)
 *    - Map stays visible on left
 *    - Only popup close button visible
 * 5. Close popup → Popup slides down, contact info slides back
 * 
 * ===========================================
 * USER JOURNEY - MOBILE (<1200px):
 * ===========================================
 * 1. Main page visible with hamburger menu
 * 2. Click hamburger → Full-screen menu appears
 * 3. Click menu item → Menu closes, section opens full screen
 * 4. Click "Kontakta oss" → Writealine opens full screen
 * 5. Click close → Returns to previous view
 * 
 * ===========================================
 * CSS CLASSES USED:
 * ===========================================
 * - .is-visible: Section/popup is open and visible
 * - .is-open: Mobile menu is open
 * - .popup-is-visible: Added to contact when popup opens (slides info panel out)
 */

export class Navigation {
  constructor() {
    this.sections = {};
    this.closeButtons = {};
    this.currentSection = null; // Track which section is currently open
  }
  
  init() {
    // Remove any legacy jQuery handlers first
    this.removeLegacyHandlers();
    
    // Cache DOM elements
    this.sections = {
      about: document.getElementById('about'),
      works: document.getElementById('works'),
      history: document.getElementById('history'),
      contact: document.getElementById('contact'),
      writealine: document.querySelector('.writealine'),
      notify: document.querySelector('.popup.notify') // Legacy notify popup - we need to keep it hidden
    };
    
    this.closeButtons = {
      about: document.getElementById('about-close'),
      works: document.getElementById('works-close'),
      history: document.getElementById('history-close'),
      contact: document.getElementById('contact-close'),
      writealine: document.getElementById('writealine-close')
    };
    
    // Mobile menu elements
    this.menuToggle = document.getElementById('mobile-menu-toggle');
    this.menuClose = document.getElementById('mobile-menu-close');
    this.menu = document.getElementById('intro-menu');
    
    // Mobile trigger buttons (inside mobile menu overlay)
    this.aboutTrigger = document.getElementById('about-trigger');
    this.worksTrigger = document.getElementById('works-trigger');
    this.historyTrigger = document.getElementById('history-trigger');
    this.contactTrigger = document.getElementById('contact-trigger');
    
    // Desktop trigger buttons (inside main intro section)
    this.aboutTriggerDesktop = document.querySelector('.about-trigger-desktop');
    this.worksTriggerDesktop = document.querySelector('.works-trigger-desktop');
    this.historyTriggerDesktop = document.querySelector('.history-trigger-desktop');
    this.contactTriggerDesktop = document.querySelector('.contact-trigger-desktop');
    
    // Popup triggers
    this.notifyTrigger = document.getElementById('notify-trigger'); // Main page "Kontakta oss"
    this.contactformTrigger = document.getElementById('contactform-trigger'); // Contact section "Kontakta oss"
    this.historyContactTrigger = document.getElementById('history-contact-trigger'); // History section "Kontakta oss"
    
    this.bindEvents();
    this.setupScrollHandling();
  }
  
  /**
   * Remove legacy jQuery event handlers that conflict with our vanilla JS
   * The libs.min.js file contains jQuery handlers for navigation that we need to disable
   */
  removeLegacyHandlers() {
    // If jQuery is loaded, unbind its handlers
    if (typeof window.jQuery !== 'undefined' || typeof window.$ !== 'undefined') {
      const $ = window.jQuery || window.$;
      
      // Unbind all jQuery click handlers from trigger elements
      $('#notify-trigger').off('click');
      $('#contactform-trigger').off('click');
      $('#about-trigger').off('click');
      $('#works-trigger').off('click');
      $('#contact-trigger').off('click');
      $('#about-close').off('click');
      $('#works-close').off('click');
      $('#contact-close').off('click');
      $('#notify-close').off('click');
      $('#writealine-close').off('click');
      $('#mobile-menu-toggle').off('click');
      $('#mobile-menu-close').off('click');
      
      // Clean up any classes the legacy code might have added
      $('.main').removeClass('notify-is-visible');
      $('.popup.notify').removeClass('is-visible');
    }
    
    // Also ensure the .notify popup (legacy newsletter) is always hidden
    const notifyPopup = document.querySelector('.popup.notify');
    if (notifyPopup) {
      notifyPopup.classList.remove('is-visible');
    }
  }
  
  bindEvents() {
    // Mobile menu
    this.menuToggle?.addEventListener('click', (e) => {
      e.preventDefault();
      this.openMobileMenu();
    });
    
    this.menuClose?.addEventListener('click', (e) => {
      e.preventDefault();
      this.closeMobileMenu();
    });
    
    // Section triggers
    this.aboutTrigger?.addEventListener('click', (e) => {
      e.preventDefault();
      this.closeMobileMenu();
      this.handleSectionNavigation('about');
    });
    
    this.worksTrigger?.addEventListener('click', (e) => {
      e.preventDefault();
      this.closeMobileMenu();
      this.handleSectionNavigation('works');
    });
    
    this.historyTrigger?.addEventListener('click', (e) => {
      e.preventDefault();
      this.closeMobileMenu();
      this.handleSectionNavigation('history');
    });
    
    this.contactTrigger?.addEventListener('click', (e) => {
      e.preventDefault();
      this.closeMobileMenu();
      this.handleSectionNavigation('contact');
    });
    
    // Desktop section triggers (always open as overlay on desktop)
    this.aboutTriggerDesktop?.addEventListener('click', (e) => {
      e.preventDefault();
      this.openSection('about');
    });
    
    this.worksTriggerDesktop?.addEventListener('click', (e) => {
      e.preventDefault();
      this.openSection('works');
    });
    
    this.historyTriggerDesktop?.addEventListener('click', (e) => {
      e.preventDefault();
      this.openSection('history');
    });
    
    this.contactTriggerDesktop?.addEventListener('click', (e) => {
      e.preventDefault();
      this.openSection('contact');
    });
    
    // Popup triggers - both open writealine
    this.notifyTrigger?.addEventListener('click', (e) => {
      e.preventDefault();
      this.openPopup();
    });
    
    this.contactformTrigger?.addEventListener('click', (e) => {
      e.preventDefault();
      this.openPopup();
    });
    
    this.historyContactTrigger?.addEventListener('click', (e) => {
      e.preventDefault();
      this.openPopup();
    });
    
    // Close buttons
    this.closeButtons.about?.addEventListener('click', (e) => {
      e.preventDefault();
      this.closeSection('about');
    });
    
    this.closeButtons.works?.addEventListener('click', (e) => {
      e.preventDefault();
      this.closeSection('works');
    });
    
    this.closeButtons.history?.addEventListener('click', (e) => {
      e.preventDefault();
      this.closeSection('history');
    });
    
    this.closeButtons.contact?.addEventListener('click', (e) => {
      e.preventDefault();
      this.closeSection('contact');
    });
    
    this.closeButtons.writealine?.addEventListener('click', (e) => {
      e.preventDefault();
      this.closePopup();
    });
  }
  
  // ==========================================
  // MOBILE MENU
  // ==========================================
  
  isMobile() {
    return window.innerWidth < 1400;
  }
  
  openMobileMenu() {
    this.menu?.classList.add('is-open');
    if (this.menuToggle) {
      this.menuToggle.style.display = 'none';
    }
  }
  
  closeMobileMenu() {
    this.menu?.classList.remove('is-open');
    if (this.menuToggle) {
      this.menuToggle.style.display = '';
    }
  }
  
  handleSectionNavigation(sectionKey) {
    if (this.isMobile()) {
      // On mobile, scroll to the section
      this.scrollToSection(sectionKey);
    } else {
      // On desktop, open as overlay
      this.openSection(sectionKey);
    }
  }
  
  scrollToSection(sectionKey) {
    const section = this.sections[sectionKey];
    if (!section) return;
    
    // Small delay to let mobile menu close animation complete
    setTimeout(() => {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }
  
  // ==========================================
  // SECTIONS (about, works, contact)
  // ==========================================
  
  openSection(sectionKey) {
    const section = this.sections[sectionKey];
    if (!section) return;
    
    // Close popup if open
    this.closePopup();
    
    // Close any other open section first
    if (this.currentSection && this.currentSection !== sectionKey) {
      const oldSection = this.sections[this.currentSection];
      if (oldSection) {
        oldSection.classList.remove('is-visible');
      }
    }
    
    // Open the new section
    section.classList.add('is-visible');
    this.currentSection = sectionKey;
  }
  
  closeSection(sectionKey) {
    const section = this.sections[sectionKey];
    if (!section) return;
    
    section.classList.remove('is-visible');
    
    if (this.currentSection === sectionKey) {
      this.currentSection = null;
    }
  }
  
  // ==========================================
  // POPUP (writealine contact form)
  // ==========================================
  
  openPopup() {
    const popup = this.sections.writealine;
    if (!popup) return;
    
    // If contact section is open, add popup-is-visible class to slide info panel out
    if (this.sections.contact?.classList.contains('is-visible')) {
      this.sections.contact.classList.add('popup-is-visible');
    }
    
    // Hide all section close buttons while popup is open
    Object.keys(this.closeButtons).forEach(key => {
      if (key !== 'writealine' && this.closeButtons[key]) {
        this.closeButtons[key].style.display = 'none';
      }
    });
    
    // Open popup
    popup.classList.add('is-visible');
    document.body.style.overflow = 'hidden';
  }
  
  closePopup() {
    const popup = this.sections.writealine;
    if (!popup || !popup.classList.contains('is-visible')) return;
    
    // Remove popup-is-visible from contact to slide info panel back
    this.sections.contact?.classList.remove('popup-is-visible');
    
    // Restore section close buttons
    Object.keys(this.closeButtons).forEach(key => {
      if (key !== 'writealine' && this.closeButtons[key]) {
        this.closeButtons[key].style.display = '';
      }
    });
    
    // Close popup
    popup.classList.remove('is-visible');
    document.body.style.overflow = '';
  }
  
  // ==========================================
  // SCROLL HANDLING (for project backgrounds)
  // ==========================================
  
  setupScrollHandling() {
    const aboutInfo = document.querySelector('.about__info');
    const projectBg = document.getElementById('project-bg');
    
    if (!aboutInfo || !projectBg) return;
    
    projectBg.classList.add('project-bg-1');
    
    const handleProjectScroll = () => {
      const projects = Array.from(document.querySelectorAll('#projects > div'));
      
      projects.forEach((project, index) => {
        const rect = project.getBoundingClientRect();
        const isInView = rect.top < window.innerHeight / 2 && rect.bottom > window.innerHeight / 2;
        
        if (isInView) {
          projectBg.className = projectBg.className.replace(/project-bg-\d+/g, '');
          projectBg.classList.add(`project-bg-${index + 1}`);
        }
      });
    };
    
    aboutInfo.addEventListener('scroll', handleProjectScroll);
    window.addEventListener('scroll', handleProjectScroll);
    window.addEventListener('resize', handleProjectScroll);
  }
}

const navigationInstance = new Navigation();
export default navigationInstance;
