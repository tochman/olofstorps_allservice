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
