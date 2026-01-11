/**
 * Map Module using Leaflet
 */

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix Leaflet's default icon paths
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

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
    this.map = L.map(this.containerId, {
      center: this.options.center,
      zoom: this.options.zoom,
      zoomControl: false // We'll use custom controls
    });

    // Add grayscale tile layer - using free OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
      className: 'map-tiles'
    }).addTo(this.map);

    // Add marker for company location
    const marker = L.marker(this.options.center).addTo(this.map);
    marker.bindPopup('<b>Olofstorps Allservice</b><br>Stora Älsjövägen 44<br>424 70 Olofstorp');

    // Setup zoom controls
    this.setupZoomControls();

    // Force map to resize after a short delay to ensure container is visible
    setTimeout(() => {
      if (this.map) {
        this.map.invalidateSize();
      }
    }, 100);
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
