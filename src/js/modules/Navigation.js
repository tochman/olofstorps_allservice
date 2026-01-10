/**
 * Navigation and Section Management
 */

import { $, $$, addClass, removeClass, on } from '../utils/dom.js';

export class Navigation {
  constructor() {
    // Wait for DOM to be ready
    this.sections = null;
    this.triggers = null;
    this.closeButtons = null;
  }
  
  init() {
    // Initialize selectors after DOM is ready
    this.sections = {
      about: document.querySelector('#about'),
      works: document.querySelector('#works'),
      contact: document.querySelector('#contact'),
      notify: document.querySelector('.notify'),
      writealine: document.querySelector('.writealine')
    };
    
    this.triggers = {
      about: document.querySelector('#about-trigger'),
      works: document.querySelector('#works-trigger'),
      contact: document.querySelector('#contact-trigger'),
      notify: document.querySelector('#notify-trigger'),
      contactform: document.querySelector('#contactform-trigger'),
      notifyMain: document.querySelector('#notify-trigger') // Main hero button
    };
    
    this.closeButtons = {
      about: document.querySelector('#about-close'),
      works: document.querySelector('#works-close'),
      contact: document.querySelector('#contact-close'),
      notify: document.querySelector('#notify-close'),
      writealine: document.querySelector('#writealine-close')
    };
    
    console.log('Navigation initialized with triggers:', this.triggers);
    
    this.setupTriggers();
    this.setupCloseButtons();
    this.setupMobileMenu();
    this.setupScrollHandling();
  }
  
  setupMobileMenu() {
    const menuToggle = document.querySelector('#mobile-menu-toggle');
    const menuClose = document.querySelector('#mobile-menu-close');
    const menu = document.querySelector('#intro-menu');
    
    if (menuToggle && menu) {
      menuToggle.addEventListener('click', () => {
        menu.classList.add('is-open');
        menuToggle.style.display = 'none';
      });
    }
    
    if (menuClose && menu) {
      menuClose.addEventListener('click', () => {
        menu.classList.remove('is-open');
        if (menuToggle) {
          menuToggle.style.display = 'flex';
        }
      });
    }
    
    // Close mobile menu when a nav link is clicked
    const navLinks = menu?.querySelectorAll('a');
    navLinks?.forEach(link => {
      link.addEventListener('click', () => {
        menu.classList.remove('is-open');
        if (menuToggle) {
          menuToggle.style.display = 'flex';
        }
      });
    });
  }
  
  setupTriggers() {
    Object.keys(this.triggers).forEach(key => {
      const trigger = this.triggers[key];
      
      if (trigger) {
        trigger.addEventListener('click', (e) => {
          e.preventDefault();
          console.log(`Trigger clicked: ${key}`);
          
          // Handle special cases - route to contact form popup
          if (key === 'contactform' || key === 'notifyMain' || key === 'notify') {
            this.openSection('writealine');
          } else {
            this.openSection(key);
          }
        });
      } else {
        console.warn(`Trigger not found: ${key}`);
      }
    });
  }
  
  setupCloseButtons() {
    Object.keys(this.closeButtons).forEach(key => {
      const closeBtn = this.closeButtons[key];
      
      if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
          e.preventDefault();
          console.log(`Close button clicked: ${key}`);
          this.closeSection(key);
        });
      }
    });
  }
  
  openSection(sectionKey) {
    const section = this.sections[sectionKey];
    console.log(`Opening section: ${sectionKey}`, section);
    console.log(`Section has is-visible: ${section?.classList.contains('is-visible')}`);
    
    if (section) {
      // Check if this section is already visible
      if (section.classList.contains('is-visible')) {
        console.log('Section already visible - forcing re-render');
        // Remove and re-add to force animation
        section.classList.remove('is-visible');
        setTimeout(() => {
          section.classList.add('is-visible');
        }, 50);
        return;
      }
      
      // Check if any section is currently visible
      const currentlyVisible = Object.keys(this.sections).find(key => 
        this.sections[key] && this.sections[key].classList.contains('is-visible')
      );
      
      if (currentlyVisible) {
        // A section is open, animate it out first then open the new one
        console.log(`Closing ${currentlyVisible} before opening ${sectionKey}`);
        this.closeSection(currentlyVisible);
        
        // Wait for close animation to complete (600ms as per CSS)
        setTimeout(() => {
          section.classList.add('is-visible');
          
          // Only lock body overflow for popups
          if (sectionKey === 'notify' || sectionKey === 'writealine') {
            document.body.style.overflow = 'hidden';
          }
        }, 650);
      } else {
        // No section open, just open the new one
        section.classList.add('is-visible');
        
        // Only lock body overflow for popups
        if (sectionKey === 'notify' || sectionKey === 'writealine') {
          document.body.style.overflow = 'hidden';
        }
      }
    } else {
      console.error(`Section not found: ${sectionKey}`);
    }
  }
  
  closeSection(sectionKey) {
    const section = this.sections[sectionKey];
    console.log(`Closing section: ${sectionKey}`, section);
    
    if (section) {
      // Add animating-out class to trigger out animation while keeping z-index high
      section.classList.add('is-animating-out');
      section.classList.remove('is-visible');
      document.body.style.overflow = '';
      
      // Remove animating-out class after animation completes
      setTimeout(() => {
        section.classList.remove('is-animating-out');
      }, 600);
    }
  }
  
  closeAllSections() {
    Object.keys(this.sections).forEach(key => {
      const section = this.sections[key];
      if (section) {
        section.classList.remove('is-visible');
      }
    });
    document.body.style.overflow = '';
  }
  
  setupScrollHandling() {
    const aboutInfo = document.querySelector('.about__info');
    const projectBg = document.querySelector('#project-bg');
    
    if (!aboutInfo || !projectBg) {
      console.log('Scroll handling elements not found');
      return;
    }
    
    const handleProjectScroll = () => {
      const projects = Array.from(document.querySelectorAll('#projects > div'));
      
      projects.forEach((project, index) => {
        const rect = project.getBoundingClientRect();
        const isInView = rect.top < window.innerHeight / 2 && rect.bottom > window.innerHeight / 2;
        
        if (isInView) {
          // Remove all project-bg classes
          projectBg.className = projectBg.className.replace(/project-bg-\d+/g, '');
          // Add current project class
          projectBg.classList.add(`project-bg-${index + 1}`);
        }
      });
    };
    
    // Setup scroll listener with custom scrollbar or native scroll
    if (aboutInfo.classList.contains('scroll')) {
      // If using custom scrollbar, listen to its scroll event
      aboutInfo.addEventListener('scroll', handleProjectScroll);
    }
    
    window.addEventListener('scroll', handleProjectScroll);
    window.addEventListener('resize', handleProjectScroll);
  }
}

const navigationInstance = new Navigation();
export default navigationInstance;
