/**
 * Modern Form Handler with Validation
 */

import { $, addClass, removeClass, fadeIn, fadeOut } from '../utils/dom.js';

export class FormHandler {
  constructor(formSelector, options = {}) {
    this.form = $(formSelector);
    if (!this.form) {
      console.error(`Form not found: ${formSelector}`);
      return;
    }
    
    this.options = {
      successMessage: 'Tack för ditt meddelande. Vi återkommer till dig snarast.',
      errorMessage: 'Ett fel uppstod. Vänligen försök igen.',
      successClass: 'is-visible',
      hiddenClass: 'is-hidden',
      successDelay: 5000,
      validateOnBlur: true,
      ...options
    };
    
    this.init();
  }
  
  init() {
    this.setupValidation();
    this.setupSubmit();
  }
  
  setupValidation() {
    if (!this.options.validateOnBlur) return;
    
    const inputs = this.form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
      input.addEventListener('blur', () => this.validateField(input));
      input.addEventListener('input', () => this.clearFieldError(input));
    });
  }
  
  validateField(field) {
    const value = field.value.trim();
    const type = field.type;
    const required = field.required;
    
    // Clear previous errors
    this.clearFieldError(field);
    
    if (required && !value) {
      this.showFieldError(field, 'Detta fält är obligatoriskt');
      return false;
    }
    
    if (type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        this.showFieldError(field, 'Ange en giltig e-postadress');
        return false;
      }
    }
    
    if (type === 'tel' && value) {
      const phoneRegex = /^[\d\s\-\+\(\)]+$/;
      if (!phoneRegex.test(value)) {
        this.showFieldError(field, 'Ange ett giltigt telefonnummer');
        return false;
      }
    }
    
    return true;
  }
  
  showFieldError(field, message) {
    let errorElement = field.parentElement.querySelector('.field-error');
    if (!errorElement) {
      errorElement = document.createElement('span');
      errorElement.className = 'field-error';
      field.parentElement.appendChild(errorElement);
    }
    errorElement.textContent = message;
    addClass(field, 'has-error');
  }
  
  clearFieldError(field) {
    const errorElement = field.parentElement.querySelector('.field-error');
    if (errorElement) {
      errorElement.remove();
    }
    removeClass(field, 'has-error');
  }
  
  validateForm() {
    const inputs = this.form.querySelectorAll('input, textarea, select');
    let isValid = true;
    
    inputs.forEach(input => {
      if (!this.validateField(input)) {
        isValid = false;
      }
    });
    
    return isValid;
  }
  
  setupSubmit() {
    this.form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      if (!this.validateForm()) {
        return;
      }
      
      await this.submitForm();
    });
  }
  
  async submitForm() {
    const formData = new FormData(this.form);
    const submitButton = this.form.querySelector('button[type="submit"]');
    
    // Disable submit button
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.dataset.originalText = submitButton.textContent;
      submitButton.textContent = 'Skickar...';
    }
    
    try {
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData).toString()
      });
      
      if (response.ok) {
        this.showSuccess();
      } else {
        throw new Error('Form submission failed');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      this.showError();
    } finally {
      // Re-enable submit button
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = submitButton.dataset.originalText;
      }
    }
  }
  
  showSuccess() {
    const formContainer = this.form.closest('.form-container') || this.form.parentElement;
    const replyGroup = formContainer.querySelector('.reply-group');
    
    if (replyGroup) {
      addClass(this.form, this.options.hiddenClass);
      addClass(replyGroup, this.options.successClass);
      
      setTimeout(() => {
        removeClass(replyGroup, this.options.successClass);
        removeClass(this.form, this.options.hiddenClass);
        this.form.reset();
      }, this.options.successDelay);
    } else {
      alert(this.options.successMessage);
      this.form.reset();
    }
  }
  
  showError() {
    const formContainer = this.form.closest('.form-container') || this.form.parentElement;
    const errorGroup = formContainer.querySelector('.error-group');
    
    if (errorGroup) {
      addClass(this.form, this.options.hiddenClass);
      addClass(errorGroup, this.options.successClass);
      
      setTimeout(() => {
        removeClass(errorGroup, this.options.successClass);
        removeClass(this.form, this.options.hiddenClass);
      }, this.options.successDelay);
    } else {
      alert(this.options.errorMessage);
    }
  }
}

export default FormHandler;
