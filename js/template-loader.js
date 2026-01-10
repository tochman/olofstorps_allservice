// ------------------------------------------------
// Template Loader Module
// ------------------------------------------------
// Optimized Handlebars template loader with:
// - Parallel loading using Promise.all
// - Error handling and retry logic
// - Template caching
// - Loading progress tracking
// ------------------------------------------------

const TemplateLoader = (function() {
  'use strict';

  // Configuration
  const config = {
    templatePath: 'templates/',
    maxRetries: 3,
    retryDelay: 1000,
    timeout: 5000
  };

  // Cache for compiled templates
  const templateCache = new Map();

  /**
   * Fetch a template file with timeout and retry logic
   */
  function fetchTemplate(templateName, retryCount = 0) {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error(`Template ${templateName} timed out`));
      }, config.timeout);

      fetch(`${config.templatePath}${templateName}.hbs`)
        .then(response => {
          clearTimeout(timeout);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.text();
        })
        .then(data => resolve(data))
        .catch(error => {
          clearTimeout(timeout);
          if (retryCount < config.maxRetries) {
            console.warn(`Retrying ${templateName} (${retryCount + 1}/${config.maxRetries})...`);
            setTimeout(() => {
              fetchTemplate(templateName, retryCount + 1)
                .then(resolve)
                .catch(reject);
            }, config.retryDelay);
          } else {
            reject(new Error(`Failed to load ${templateName}: ${error.message}`));
          }
        });
    });
  }

  /**
   * Load and compile a single template
   */
  function loadTemplate(templateName, targetElement) {
    // Check cache first
    if (templateCache.has(templateName)) {
      const template = templateCache.get(templateName);
      $(targetElement).html(template());
      return Promise.resolve(templateName);
    }

    return fetchTemplate(templateName)
      .then(data => {
        const compiledTemplate = Handlebars.compile(data);
        templateCache.set(templateName, compiledTemplate);
        $(targetElement).html(compiledTemplate());
        return templateName;
      })
      .catch(error => {
        console.error(`Error loading template ${templateName}:`, error);
        $(targetElement).html(`
          <div class="blocks__single section-title">
            <p style="color: #ff6b6b;">Error loading content. Please refresh the page.</p>
          </div>
        `);
        throw error;
      });
  }

  /**
   * Load multiple templates in parallel
   */
  function loadTemplates(templates) {
    const promises = templates.map(({ name, target }) => 
      loadTemplate(name, target)
    );

    return Promise.all(promises)
      .then(loadedTemplates => {
        console.log(`Successfully loaded ${loadedTemplates.length} templates:`, loadedTemplates);
        return loadedTemplates;
      })
      .catch(error => {
        console.error('Template loading failed:', error);
        // Don't throw - some templates may have loaded successfully
        return Promise.resolve([]);
      });
  }

  /**
   * Initialize all project templates
   */
  function initializeProjectTemplates() {
    const projectTemplates = [
      { name: 'project1', target: '#project1' },
      { name: 'project2', target: '#project2' },
      { name: 'project3', target: '#project3' },
      { name: 'project4', target: '#project4' },
      { name: 'project5', target: '#project5' }
    ];

    return loadTemplates(projectTemplates);
  }

  /**
   * Preload templates without rendering (for performance)
   */
  function preloadTemplates(templateNames) {
    const promises = templateNames.map(name => 
      fetchTemplate(name)
        .then(data => {
          const compiledTemplate = Handlebars.compile(data);
          templateCache.set(name, compiledTemplate);
          return name;
        })
        .catch(error => {
          console.warn(`Failed to preload ${name}:`, error);
          return null;
        })
    );

    return Promise.all(promises);
  }

  /**
   * Clear template cache (useful for development)
   */
  function clearCache() {
    templateCache.clear();
    console.log('Template cache cleared');
  }

  /**
   * Get cache statistics
   */
  function getCacheStats() {
    return {
      size: templateCache.size,
      templates: Array.from(templateCache.keys())
    };
  }

  // Public API
  return {
    loadTemplate,
    loadTemplates,
    initializeProjectTemplates,
    preloadTemplates,
    clearCache,
    getCacheStats,
    config
  };
})();

// Auto-initialize when DOM is ready (optional)
// Uncomment if you want automatic initialization
// $(function() {
//   TemplateLoader.initializeProjectTemplates();
// });
