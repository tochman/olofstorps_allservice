# Olofstorp Allservice - Modern Build

## 🎉 What's New

This project has been completely modernized with:

- ✅ **Vite** for blazing fast builds and dev server
- ✅ **Vanilla JavaScript** - no more jQuery dependency!
- ✅ **Modern ES6+ modules** with proper structure
- ✅ **Contact form reinstated** with full validation
- ✅ **Environment variables** for API keys
- ✅ **Template engine** without Handlebars overhead
- ✅ **Improved performance** with lazy loading and code splitting

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18.0.0
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
olofstorps/
├── src/
│   ├── js/
│   │   ├── modules/          # Feature modules
│   │   │   ├── FormHandler.js
│   │   │   ├── Loader.js
│   │   │   ├── Navigation.js
│   │   │   └── TemplateEngine.js
│   │   ├── utils/            # Utility functions
│   │   │   └── dom.js        # DOM helpers (jQuery replacement)
│   │   └── main.js           # App entry point
│   ├── css/                  # Stylesheets
│   └── templates/            # HTML templates
├── public/                   # Static assets
│   ├── img/
│   └── fonts/
├── index.html                # Main HTML file
├── vite.config.js            # Vite configuration
├── .env                      # Environment variables (DO NOT COMMIT)
└── package.json
```

## 🔧 Configuration

### Environment Variables

Copy `.env.example` to `.env` and update values:

```env
VITE_GOOGLE_MAPS_API_KEY=your_api_key_here
VITE_FORM_NAME=site-contact-form
VITE_ADMIN_EMAIL=info@olofstorps.se
```

### Netlify Forms

The contact form is configured for Netlify. Make sure your form has:
- `data-netlify="true"` attribute
- `name` attribute matching VITE_FORM_NAME
- Hidden `form-name` input field

## 🎯 Key Features

### Form Handler
Modern form with validation and Netlify integration:
```javascript
import FormHandler from './modules/FormHandler.js';

new FormHandler('#contact-form', {
  successMessage: 'Tack för ditt meddelande!',
  validateOnBlur: true
});
```

### Template Engine
Simple and fast template rendering:
```javascript
import templateEngine from './modules/TemplateEngine.js';

await templateEngine.loadAndRender('project1', '/src/templates/project1.hbs', {}, '#project1');
```

### DOM Utilities
jQuery-free DOM manipulation:
```javascript
import { $, $$, addClass, fadeIn } from './utils/dom.js';

const element = $('.my-class');
addClass(element, 'active');
await fadeIn(element);
```

## 📦 Build & Deploy

### Production Build
```bash
npm run build
```

Outputs optimized files to `dist/` directory.

### Netlify Deployment

1. Connect your Git repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables in Netlify dashboard

## 🔄 Migration from Old Version

The old jQuery-based code is preserved in:
- `index.html.backup` - Original HTML file
- `js/ramio-custom.js` - Original JavaScript
- `js/template-loader.js` - Old Handlebars loader

## 🐛 Known Issues

- Custom scrollbar plugin not yet migrated (native scroll used)
- Particles.js skipped (heavy dependency)
- Some animation effects simplified

## 📝 TODO

- [ ] Add ESLint and Prettier configs
- [ ] Implement proper error boundaries
- [ ] Add loading states for async operations
- [ ] Optimize images (WebP/AVIF)
- [ ] Add service worker for offline support
- [ ] Setup proper analytics
- [ ] Add automated testing

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Run `npm run lint` and `npm run format`
4. Submit a pull request

## 📄 License

Private - Olofstorp Allservice © 2026

## 🔗 Links

- Website: https://olofstorps.se
- Email: info@olofstorps.se
- Facebook: [Olofstorp Allservice](https://www.facebook.com/groups/659727488084128/)
