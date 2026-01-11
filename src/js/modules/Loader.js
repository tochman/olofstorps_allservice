/**
 * Loader Animation Module
 */

import { $, addClass, removeClass } from '../utils/dom.js';

export class Loader {
  constructor() {
    this.loader = $('.loader');
    this.logo = $('.loader-logo');
    this.caption = $('.loader-caption');
    this.main = $('#main');
    // Add loading class to body initially
    document.body.classList.add('loading');
  }
  
  hide() {
    // Animate logo and caption out
    setTimeout(() => {
      if (this.logo) {
        removeClass(this.logo, 'slideInDown');
        addClass(this.logo, 'fadeOutUp');
      }
      if (this.caption) {
        removeClass(this.caption, 'slideInUp');
        addClass(this.caption, 'fadeOutDown');
      }
    }, 600);
    
    // Hide loader and show main content
    setTimeout(() => {
      if (this.loader) {
        addClass(this.loader, 'loaded');
      }
      if (this.main) {
        addClass(this.main, 'loaded');
      }
      // Remove loading class from body
      document.body.classList.remove('loading');
    }, 1200);
  }
  
  show() {
    if (this.loader) {
      removeClass(this.loader, 'loaded');
    }
    if (this.main) {
      removeClass(this.main, 'loaded');
    }
  }
}

export default new Loader();
