/**
 * Map Module using Leaflet
 */

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export class Map {
  constructor(containerId, options = {}) {
    this.containerId = containerId;
    this.options = {
      center: options.center || [57.7505, 12.2908], // Stora Älsjövägen 44, Olofstorp
      zoom: options.zoom || 15,
      ...options
    };
    this.map = null;
  }

  init() {
    const container = document.getElementById(this.containerId);
    if (!container) {
      console.warn(`Map container #${this.containerId} not found`);
      return;
    }

    // Show the map container
    const mapWrapper = container.closest('.map');
    if (mapWrapper) {
      mapWrapper.style.display = 'block';
    }

    // Initialize Leaflet map
    this.map = L.map(this.containerId).setView(this.options.center, this.options.zoom);

    // Add grayscale tile layer
    L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
      maxZoom: 20,
      className: 'map-grayscale'
    }).addTo(this.map);

    // Add marker for company location
    const marker = L.marker(this.options.center).addTo(this.map);
    marker.bindPopup('<b>Olofstorps Allservice</b><br>Stora Älsjövägen 44<br>424 70 Olofstorp');

    // Setup zoom controls
    this.setupZoomControls();

    console.log('✅ Leaflet map initialized');
  }

  setupZoomControls() {
    const zoomIn = document.getElementById('zoom-in');
    const zoomOut = document.getElementById('zoom-out');

    if (zoomIn) {
      zoomIn.style.display = 'flex';
      zoomIn.addEventListener('click', () => {
        this.map.zoomIn();
      });
    }

    if (zoomOut) {
      zoomOut.style.display = 'flex';
      zoomOut.addEventListener('click', () => {
        this.map.zoomOut();
      });
    }
  }

  destroy() {
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
  }
}

export default Map;
