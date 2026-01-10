/**
 * DOM Utilities - Modern vanilla JS replacements for jQuery
 */

export const $ = (selector, context = document) => {
  if (selector instanceof Element) return selector;
  return context.querySelector(selector);
};

export const $$ = (selector, context = document) => {
  return Array.from(context.querySelectorAll(selector));
};

export const ready = (fn) => {
  if (document.readyState !== 'loading') {
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
};

export const on = (element, event, selector, handler) => {
  if (typeof selector === 'function') {
    handler = selector;
    element.addEventListener(event, handler);
  } else {
    element.addEventListener(event, (e) => {
      if (e.target.matches(selector)) {
        handler.call(e.target, e);
      }
    });
  }
};

export const addClass = (element, className) => {
  element.classList.add(className);
};

export const removeClass = (element, className) => {
  element.classList.remove(className);
};

export const toggleClass = (element, className) => {
  element.classList.toggle(className);
};

export const hasClass = (element, className) => {
  return element.classList.contains(className);
};

export const setHTML = (element, html) => {
  element.innerHTML = html;
};

export const getHTML = (element) => {
  return element.innerHTML;
};

export const show = (element) => {
  element.style.display = '';
};

export const hide = (element) => {
  element.style.display = 'none';
};

export const fadeIn = (element, duration = 400) => {
  element.style.opacity = '0';
  element.style.display = '';
  element.style.transition = `opacity ${duration}ms`;
  
  requestAnimationFrame(() => {
    element.style.opacity = '1';
  });
  
  return new Promise(resolve => setTimeout(resolve, duration));
};

export const fadeOut = (element, duration = 400) => {
  element.style.transition = `opacity ${duration}ms`;
  element.style.opacity = '0';
  
  return new Promise(resolve => {
    setTimeout(() => {
      element.style.display = 'none';
      resolve();
    }, duration);
  });
};

export const slideDown = (element, duration = 400) => {
  element.style.overflow = 'hidden';
  element.style.height = '0';
  element.style.display = '';
  const height = element.scrollHeight;
  element.style.transition = `height ${duration}ms ease`;
  
  requestAnimationFrame(() => {
    element.style.height = height + 'px';
  });
  
  return new Promise(resolve => {
    setTimeout(() => {
      element.style.height = '';
      element.style.overflow = '';
      resolve();
    }, duration);
  });
};

export const slideUp = (element, duration = 400) => {
  element.style.overflow = 'hidden';
  element.style.height = element.scrollHeight + 'px';
  element.style.transition = `height ${duration}ms ease`;
  
  requestAnimationFrame(() => {
    element.style.height = '0';
  });
  
  return new Promise(resolve => {
    setTimeout(() => {
      element.style.display = 'none';
      element.style.overflow = '';
      resolve();
    }, duration);
  });
};

export const offset = (element) => {
  const rect = element.getBoundingClientRect();
  return {
    top: rect.top + window.pageYOffset,
    left: rect.left + window.pageXOffset,
    width: rect.width,
    height: rect.height
  };
};

export const isInViewport = (element) => {
  const rect = element.getBoundingClientRect();
  return (
    rect.bottom > 0 &&
    rect.right > 0 &&
    rect.left < window.innerWidth &&
    rect.top < window.innerHeight
  );
};

export const ajax = async (url, options = {}) => {
  const defaultOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  };
  
  const response = await fetch(url, { ...defaultOptions, ...options });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return await response.json();
};

export const trigger = (element, eventName, data = {}) => {
  const event = new CustomEvent(eventName, { detail: data, bubbles: true });
  element.dispatchEvent(event);
};
