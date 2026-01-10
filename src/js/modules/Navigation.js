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
    this.setupScrollHandling();
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
    
    if (section) {
      section.classList.add('is-visible');
      document.body.style.overflow = 'hidden';
    } else {
      console.error(`Section not found: ${sectionKey}`);
    }
  }
  
  closeSection(sectionKey) {
    const section = this.sections[sectionKey];
    console.log(`Closing section: ${sectionKey}`, section);
    
    if (section) {
      section.classList.remove('is-visible');
      document.body.style.overflow = '';
    }
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
