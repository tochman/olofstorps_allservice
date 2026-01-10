/**
 * Modern Template Engine using ES6 Template Literals
 */

export class TemplateEngine {
  constructor() {
    this.cache = new Map();
    this.templates = new Map();
  }
  
  /**
   * Register a template
   */
  register(name, templateString) {
    this.templates.set(name, templateString);
  }
  
  /**
   * Load template from file
   */
  async load(name, path) {
    if (this.cache.has(name)) {
      return this.cache.get(name);
    }
    
    try {
      const response = await fetch(path);
      if (!response.ok) {
        throw new Error(`Failed to load template: ${path}`);
      }
      
      const templateString = await response.text();
      this.register(name, templateString);
      this.cache.set(name, templateString);
      
      return templateString;
    } catch (error) {
      console.error(`Template loading error:`, error);
      throw error;
    }
  }
  
  /**
   * Render template with data
   */
  render(name, data = {}) {
    const template = this.templates.get(name);
    if (!template) {
      console.error(`Template not found: ${name}`);
      return '';
    }
    
    return this.interpolate(template, data);
  }
  
  /**
   * Simple template interpolation
   */
  interpolate(template, data) {
    return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return data[key] !== undefined ? data[key] : match;
    });
  }
  
  /**
   * Load and render template
   */
  async loadAndRender(name, path, data = {}, targetSelector = null) {
    await this.load(name, path);
    const html = this.render(name, data);
    
    if (targetSelector) {
      const target = document.querySelector(targetSelector);
      if (target) {
        target.innerHTML = html;
      }
    }
    
    return html;
  }
  
  /**
   * Load multiple templates in parallel
   */
  async loadBatch(templates) {
    const promises = templates.map(({ name, path }) => 
      this.load(name, path)
    );
    
    return Promise.all(promises);
  }
  
  /**
   * Clear cache
   */
  clearCache() {
    this.cache.clear();
  }
}

export default new TemplateEngine();
