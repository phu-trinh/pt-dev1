/**
 * LG Store Mapper
 * Using Leaflet.js for interactive mapping
 */

class LGStoreMapper {
    constructor() {
        this.container = document.querySelector('.storemapper-section');
        if (!this.container) return;

        this.sidebar = this.container.querySelector('.storemapper-sidebar');
        this.listContainer = this.container.querySelector('.storemapper-store-list');
        this.listItems = Array.from(this.container.querySelectorAll('.storemapper-store-item'));
        this.toggleBtn = this.container.querySelector('.storemapper-sidebar-toggle');
        this.resultsCountEl = this.container.querySelector('.storemapper-results-count-number');
        this.fullscreenBtn = this.container.querySelector('.map-fullscreen-btn');

        // Form controls
        this.businessUnitSelect = this.container.querySelector('#business-unit-select');
        this.countrySelect = this.container.querySelector('#country-select');
        this.searchInput = this.container.querySelector('#address-search-input');
        this.searchForm = this.container.querySelector('.storemapper-filter-form');
        this.suggestionsBox = this.container.querySelector('#address-suggestions-box');

        // Google Maps API Key
        this.googleApiKey = this.container.dataset.googleApiKey || '';
        this.googleAutocompleteService = null;

        this.map = null;
        this.markers = new Map(); // storeId -> L.Marker
        this.activeMarker = null;
        this.debounceTimeout = null;

        this.init();
    }

    init() {
        // Wait for Leaflet to be loaded
        if (typeof L === 'undefined') {
            // Wait and retry
            setTimeout(() => this.init(), 100);
            return;
        }

        this.initMap();
        this.initMarkers();
        this.bindEvents();

        // Establish default Business Unit ("Compressor & Motor")
        this.setDefaultSelections();
    }

    initMap() {
        const mapElement = this.container.querySelector('.storemapper-map');
        if (!mapElement) return;

        // Default coordinates: South Korea center if no items, else first item's coordinates
        let defaultCenter = [37.5665, 126.9780];
        if (this.listItems.length > 0) {
            const firstLat = parseFloat(this.listItems[0].dataset.lat);
            const firstLng = parseFloat(this.listItems[0].dataset.lng);
            if (!isNaN(firstLat) && !isNaN(firstLng)) {
                defaultCenter = [firstLat, firstLng];
            }
        }

        // Initialize Map
        this.map = L.map(mapElement, {
            center: defaultCenter,
            zoom: 11,
            zoomControl: false, // We'll add our custom zoom control placement
            attributionControl: true
        });

        // Add custom styled CartoDB Positron tile layer (premium tech feel)
        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            subdomains: 'abcd',
            maxZoom: 20
        }).addTo(this.map);

        // Add zoom control to bottom right
        L.control.zoom({
            position: 'bottomright'
        }).addTo(this.map);
    }

    createMarkerIcon(number, isActive = false) {
        const pinColor = isActive ? '#b80018' : '#e50020';
        
        // Teardrop Pin SVG
        const html = `
            <div class="store-marker-number-pin">
                <svg viewBox="0 0 24 30" width="24" height="30" style="filter: drop-shadow(0 2px 4px rgba(0,0,0,0.25));">
                    <path fill="${pinColor}" d="M12,0 C5.37,0 0,5.37 0,12 C0,21 12,30 12,30 C12,30 24,21 24,12 C24,5.37 18.63,0 12,0 Z" />
                    <circle fill="#ffffff" cx="12" cy="11" r="7" />
                    <text fill="${pinColor}" x="12" y="15" font-size="10" font-family="Arial, sans-serif" font-weight="bold" text-anchor="middle">${number}</text>
                </svg>
            </div>
        `;

        return L.divIcon({
            html: html,
            className: 'custom-leaflet-marker',
            iconSize: [24, 30],
            iconAnchor: [12, 30],
            popupAnchor: [0, -32]
        });
    }

    initMarkers() {
        if (!this.map) return;

        this.listItems.forEach((item, index) => {
            const id = item.dataset.id;
            const lat = parseFloat(item.dataset.lat);
            const lng = parseFloat(item.dataset.lng);
            const name = item.dataset.name;
            const address = item.dataset.address;
            const phone = item.dataset.phone;
            const email = item.dataset.email;

            if (isNaN(lat) || isNaN(lng)) return;

            // Marker Number (1-based index)
            const markerNum = index + 1;

            // Popup HTML Template
            const popupContent = `
                <div class="map-popup-card">
                    <div class="map-popup-header">
                        <svg class="store-type-icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                            <circle cx="12" cy="10" r="3"/>
                        </svg>
                        <h4 class="map-popup-title">${name}</h4>
                    </div>
                    <p class="map-popup-address">${address}</p>
                    ${phone ? `
                        <a href="tel:${phone}" class="store-contact-row">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                            </svg>
                            <span>${phone}</span>
                        </a>
                    ` : ''}
                    ${email ? `
                        <a href="mailto:${email}" class="store-contact-row">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect width="20" height="16" x="2" y="4" rx="2"/>
                                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                            </svg>
                            <span>${email}</span>
                        </a>
                    ` : ''}
                </div>
            `;

            // Create Marker
            const marker = L.marker([lat, lng], {
                icon: this.createMarkerIcon(markerNum, false)
            }).bindPopup(popupContent);

            // Store references
            this.markers.set(id, marker);

            // Marker click logic
            marker.on('click', () => {
                this.highlightStore(id, false);
            });

            // Popup close logic - reset active highlight
            marker.on('popupclose', () => {
                if (this.activeMarker === marker) {
                    this.resetActiveHighlight();
                }
            });
        });
    }

    bindEvents() {
        // Toggle Sidebar click
        if (this.toggleBtn && this.sidebar) {
            this.toggleBtn.addEventListener('click', () => {
                this.sidebar.classList.toggle('is-collapsed');
                // Leaflet needs map size recalculation after layout shift
                setTimeout(() => {
                    if (this.map) {
                        this.map.invalidateSize({ animate: true });
                    }
                }, 300);
            });
        }

        // Fullscreen Toggle click
        if (this.fullscreenBtn) {
            this.fullscreenBtn.addEventListener('click', () => {
                const mapContainer = this.container.querySelector('.storemapper-layout');
                if (!mapContainer) return;

                if (!document.fullscreenElement) {
                    mapContainer.requestFullscreen().catch((err) => {
                        console.error(`Error attempting to enable fullscreen: ${err.message}`);
                    });
                } else {
                    document.exitFullscreen();
                }
            });
        }

        // Sidebar list item click
        this.listItems.forEach(item => {
            item.addEventListener('click', () => {
                const id = item.dataset.id;
                this.highlightStore(id, true);
            });
        });

        // Filter Form submit (Search Button)
        if (this.searchForm) {
            this.searchForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.hideSuggestions();
                this.runFilter();
            });
        }

        // Auto filter on Business Unit select change (causes Country select re-population)
        if (this.businessUnitSelect) {
            this.businessUnitSelect.addEventListener('change', () => {
                this.updateCountryDropdown();
                this.runFilter();
            });
        }

        // Auto filter on Country select change
        if (this.countrySelect) {
            this.countrySelect.addEventListener('change', () => this.runFilter());
        }

        // Suggestion autocomplete input triggers
        if (this.searchInput) {
            this.searchInput.addEventListener('input', () => {
                clearTimeout(this.debounceTimeout);
                this.debounceTimeout = setTimeout(() => this.handleAutocompleteInput(), 300);
            });

            // Hide autocomplete list if clicked outside
            document.addEventListener('click', (e) => {
                if (this.suggestionsBox && !this.searchInput.contains(e.target) && !this.suggestionsBox.contains(e.target)) {
                    this.hideSuggestions();
                }
            });
        }
    }

    setDefaultSelections() {
        // Find "Compressor & Motor" in Business Unit selector
        if (this.businessUnitSelect) {
            let found = false;
            for (let i = 0; i < this.businessUnitSelect.options.length; i++) {
                if (this.businessUnitSelect.options[i].value.toLowerCase() === 'compressor & motor') {
                    this.businessUnitSelect.selectedIndex = i;
                    found = true;
                    break;
                }
            }
            // If not found, select first option after placeholder
            if (!found && this.businessUnitSelect.options.length > 1) {
                this.businessUnitSelect.selectedIndex = 1;
            }
        }

        // Update country select options based on default Business Unit
        this.updateCountryDropdown();

        // Select "South Korea" in country dropdown by default
        if (this.countrySelect) {
            let found = false;
            for (let i = 0; i < this.countrySelect.options.length; i++) {
                if (this.countrySelect.options[i].value.toLowerCase() === 'south korea') {
                    this.countrySelect.selectedIndex = i;
                    found = true;
                    break;
                }
            }
            // If not found, select first option after placeholder
            if (!found && this.countrySelect.options.length > 1) {
                this.countrySelect.selectedIndex = 1;
            }
        }

        // Run the filter to show matches
        this.runFilter();
    }

    updateCountryDropdown() {
        if (!this.businessUnitSelect || !this.countrySelect) return;

        const selectedBU = this.businessUnitSelect.value.trim().toLowerCase();
        
        // Find all unique countries associated with stores in the selected Business Unit
        const countries = new Set();
        this.listItems.forEach(item => {
            const itemBU = item.dataset.businessUnit.trim().toLowerCase();
            const itemCountry = item.dataset.country.trim();
            
            if (itemCountry && (!selectedBU || itemBU === selectedBU)) {
                countries.add(itemCountry);
            }
        });

        // Convert Set to sorted Array
        const sortedCountries = Array.from(countries).sort();

        // Remember the currently selected country
        const previousValue = this.countrySelect.value;

        // Clear existing options except the first one (placeholder)
        const placeholderOption = this.countrySelect.options[0];
        this.countrySelect.innerHTML = '';
        if (placeholderOption) {
            this.countrySelect.appendChild(placeholderOption);
        }

        // Add new options
        sortedCountries.forEach(country => {
            const option = document.createElement('option');
            option.value = country;
            option.textContent = country;
            this.countrySelect.appendChild(option);
        });

        // Restore previous value if it's still available in the new country list
        if (sortedCountries.includes(previousValue)) {
            this.countrySelect.value = previousValue;
        } else {
            this.countrySelect.value = '';
        }
    }

    /* Country ISO Code mapping for suggestions API filtering */
    getCountryCode(countryName) {
        if (!countryName) return '';
        const name = countryName.toLowerCase().trim();
        const mapping = {
            'south korea': 'kr',
            'china': 'cn',
            'india': 'in',
            'italy': 'it',
            'lebanon': 'lb',
            'thailand': 'th',
            'türkiye': 'tr',
            'turkey': 'tr',
            'united states': 'us',
            'usa': 'us',
            'vietnam': 'vn',
            'germany': 'de'
        };
        return mapping[name] || '';
    }

    handleAutocompleteInput() {
        const query = this.searchInput.value.trim();
        if (query.length < 1) {
            this.hideSuggestions();
            return;
        }

        const selectedCountry = this.countrySelect ? this.countrySelect.value.trim() : '';
        const countryCode = this.getCountryCode(selectedCountry);

        if (this.googleApiKey) {
            this.fetchGoogleSuggestions(query, countryCode);
        } else {
            this.fetchOSMSuggestions(query, countryCode);
        }
    }

    loadGoogleMapsAPI(callback) {
        if (window.google && window.google.maps && window.google.maps.places) {
            callback();
            return;
        }

        let script = document.querySelector('script[src*="maps.googleapis.com"]');
        if (!script) {
            script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=${this.googleApiKey}&libraries=places`;
            script.async = true;
            script.defer = true;
            document.head.appendChild(script);
        }

        const interval = setInterval(() => {
            if (window.google && window.google.maps && window.google.maps.places) {
                clearInterval(interval);
                callback();
            }
        }, 100);
    }

    fetchGoogleSuggestions(query, countryCode) {
        this.loadGoogleMapsAPI(() => {
            if (!this.googleAutocompleteService) {
                this.googleAutocompleteService = new google.maps.places.AutocompleteService();
            }

            const options = {
                input: query,
                types: ['geocode']
            };

            if (countryCode) {
                options.componentRestrictions = { country: countryCode };
            }

            this.googleAutocompleteService.getPlacePredictions(options, (predictions, status) => {
                if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
                    this.renderGoogleSuggestions(predictions);
                } else {
                    this.hideSuggestions();
                }
            });
        });
    }

    renderGoogleSuggestions(predictions) {
        if (!this.suggestionsBox) return;

        this.suggestionsBox.innerHTML = '';
        this.suggestionsBox.style.display = 'block';

        predictions.forEach(p => {
            const item = document.createElement('div');
            item.className = 'storemapper-suggestion-item';

            const mainText = p.structured_formatting.main_text;
            const secondaryText = p.structured_formatting.secondary_text || '';

            item.innerHTML = `
                <svg class="storemapper-suggestion-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                    <circle cx="12" cy="10" r="3"/>
                </svg>
                <div class="storemapper-suggestion-text">
                    <span class="storemapper-suggestion-main">${mainText}</span>
                    ${secondaryText ? `<span class="storemapper-suggestion-secondary">${secondaryText}</span>` : ''}
                </div>
            `;

            item.addEventListener('click', () => {
                this.searchInput.value = p.description;
                this.hideSuggestions();
                this.runFilter();
            });

            this.suggestionsBox.appendChild(item);
        });

        // Add Premium "powered by Google" attribution
        const footer = document.createElement('div');
        footer.className = 'storemapper-suggestions-footer';
        footer.innerHTML = `
            <span>powered by</span>
            <svg viewBox="0 0 74 24" fill="currentColor" style="height: 11px; margin-left: 3px; vertical-align: middle; opacity: 0.8;">
                <path d="M7.4 12.3c0-2.8 2.2-5 5-5 1.5 0 2.8.7 3.7 1.8l-1.9 1.4c-.5-.7-1.1-1.1-1.8-1.1-1.6 0-2.9 1.3-2.9 2.9s1.3 2.9 2.9 2.9c1 0 1.7-.5 2.1-1.2h-2.1v-2.1h4.1c.1.4.1.7.1 1.1 0 3-2.1 5.3-5.3 5.3-2.8 0-5-2.2-5-5.1zm12.3 2.5c0-1.7 1.3-2.9 3-2.9s3 1.3 3 2.9-1.3 2.9-3 2.9-3-1.3-3-2.9zm8.1 0c0-2.8-2.2-5-5-5s-5 2.2-5 5 2.2 5 5 5 5-2.2 5-5zm2.1 0c0-1.7 1.3-2.9 3-2.9s3 1.3 3 2.9-1.3 2.9-3 2.9-3-1.3-3-2.9zm8.1 0c0-2.8-2.2-5-5-5s-5 2.2-5 5 2.2 5 5 5 5-2.2 5-5zm7.3 1.8v3.1c0 2.2-1.3 3.6-3.3 3.6-1.9 0-3-.9-3.4-2.1l1.8-.7c.3.7.9 1.2 1.6 1.2.9 0 1.4-.6 1.4-1.6v-.8H43c-.4.6-1.1 1.1-2 1.1-1.9 0-3.4-1.5-3.4-3.4s1.5-3.4 3.4-3.4c.9 0 1.6.5 2 1.1h.1v-1H45.2zm-2.1-1.8c0-1.2-.9-2.1-2.1-2.1s-2.1.9-2.1 2.1.9 2.1 2.1 2.1 2.1-.9 2.1-2.1zm5.2-6.5h2v13.4h-2zm9.1 8.3l1.8 1.2c-.6.9-1.9 2.4-4.2 2.4-2.8 0-4.9-2.1-4.9-5s2.2-5 4.7-5c2.6 0 3.9 2.1 4.3 3.2l.2.6-6.6 2.7c.5 1 1.3 1.5 2.4 1.5s1.8-.5 2.3-1.6zm-5-1.9l4.5-1.9c-.2-.6-.9-1-1.7-1-.9 0-2 .8-2.8 2.9z" />
            </svg>
        `;
        this.suggestionsBox.appendChild(footer);
    }

    fetchOSMSuggestions(query, countryCode) {
        let url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1`;
        if (countryCode) {
            url += `&countrycodes=${countryCode}`;
        }

        fetch(url)
            .then(res => res.json())
            .then(data => {
                if (data && data.length > 0) {
                    this.renderOSMSuggestions(data);
                } else {
                    this.hideSuggestions();
                }
            })
            .catch(() => this.hideSuggestions());
    }

    renderOSMSuggestions(results) {
        if (!this.suggestionsBox) return;

        this.suggestionsBox.innerHTML = '';
        this.suggestionsBox.style.display = 'block';

        results.forEach(res => {
            const item = document.createElement('div');
            item.className = 'storemapper-suggestion-item';

            const displayName = res.display_name;
            const parts = displayName.split(',');
            const mainText = parts[0].trim();
            const secondaryText = parts.slice(1).join(',').trim();

            item.innerHTML = `
                <svg class="storemapper-suggestion-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                    <circle cx="12" cy="10" r="3"/>
                </svg>
                <div class="storemapper-suggestion-text">
                    <span class="storemapper-suggestion-main">${mainText}</span>
                    ${secondaryText ? `<span class="storemapper-suggestion-secondary">${secondaryText}</span>` : ''}
                </div>
            `;

            item.addEventListener('click', () => {
                this.searchInput.value = displayName;
                this.hideSuggestions();
                this.runFilter();
            });

            this.suggestionsBox.appendChild(item);
        });

        // Add OSM attribution footer
        const footer = document.createElement('div');
        footer.className = 'storemapper-suggestions-footer';
        footer.innerHTML = `<span>powered by OpenStreetMap</span>`;
        this.suggestionsBox.appendChild(footer);
    }

    hideSuggestions() {
        if (this.suggestionsBox) {
            this.suggestionsBox.style.display = 'none';
        }
    }

    highlightStore(id, panTo = true) {
        // Clear previous active states
        this.listItems.forEach(item => item.classList.remove('is-active'));
        this.markers.forEach((marker, markerId) => {
            const index = this.listItems.findIndex(item => item.dataset.id === markerId);
            marker.setIcon(this.createMarkerIcon(index + 1, false));
        });

        // Activate matching list item
        const activeItem = this.listItems.find(item => item.dataset.id === id);
        if (activeItem) {
            activeItem.classList.add('is-active');
            activeItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }

        // Activate marker
        const activeMarker = this.markers.get(id);
        if (activeMarker && this.map) {
            const index = this.listItems.findIndex(item => item.dataset.id === id);
            activeMarker.setIcon(this.createMarkerIcon(index + 1, true));
            this.activeMarker = activeMarker;

            if (panTo) {
                this.map.panTo(activeMarker.getLatLng(), { animate: true });
                activeMarker.openPopup();
            }
        }
    }

    resetActiveHighlight() {
        this.listItems.forEach(item => item.classList.remove('is-active'));
        this.markers.forEach((marker, markerId) => {
            const index = this.listItems.findIndex(item => item.dataset.id === markerId);
            marker.setIcon(this.createMarkerIcon(index + 1, false));
        });
        this.activeMarker = null;
    }

    fuzzyMatch(query, targetText) {
        const cleanString = (str, isQuery = false) => {
            const tokens = str
                .toLowerCase()
                .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, " ")
                .split(/\s+/)
                .filter(Boolean);

            if (isQuery) {
                // Ignore general country names and administrative terms in the search query tokens,
                // as country filtering is already fully guaranteed by the Country dropdown selection.
                const stopWords = new Set([
                    "south", "korea", "republic", "of", "china", "india", 
                    "italy", "lebanon", "thailand", "türkiye", "turkey", 
                    "united", "states", "usa", "vietnam", "germany",
                    "kr", "cn", "in", "it", "lb", "th", "tr", "us", "vn", "de"
                ]);
                const filtered = tokens.filter(t => !stopWords.has(t));
                if (filtered.length > 0) {
                    return filtered;
                }
            }
            return tokens;
        };

        const queryTokens = cleanString(query, true);
        const targetTokens = cleanString(targetText, false);

        if (queryTokens.length === 0) return true;

        // Helper to calculate Levenshtein distance
        const getLevenshteinDistance = (a, b) => {
            const tmp = [];
            let i, j;
            for (i = 0; i <= a.length; i++) {
                tmp[i] = [i];
            }
            for (j = 0; j <= b.length; j++) {
                tmp[0][j] = j;
            }
            for (i = 1; i <= a.length; i++) {
                for (j = 1; j <= b.length; j++) {
                    tmp[i][j] = a[i - 1] === b[j - 1] 
                        ? tmp[i - 1][j - 1] 
                        : Math.min(tmp[i - 1][j] + 1, tmp[i][j - 1] + 1, tmp[i - 1][j - 1] + 1);
                }
            }
            return tmp[a.length][b.length];
        };

        // Synonym mapping for common location/country variations
        const isSynonym = (q, t) => {
            const synonyms = [
                ["south", "republic"],
                ["usa", "united", "states", "america"],
                ["turkey", "türkiye"]
            ];
            return synonyms.some(group => group.includes(q) && group.includes(t));
        };

        return queryTokens.every(qToken => {
            return targetTokens.some(tToken => {
                // Direct match or synonym match
                if (tToken.includes(qToken) || qToken.includes(tToken) || isSynonym(qToken, tToken)) {
                    return true;
                }

                // Edit distance check (typo allowance)
                const distance = getLevenshteinDistance(qToken, tToken);
                const minLen = Math.min(qToken.length, tToken.length);

                if (minLen <= 3) {
                    return distance === 0;
                } else if (minLen <= 5) {
                    return distance <= 1;
                } else {
                    return distance <= 2;
                }
            });
        });
    }

    runFilter() {
        const selectedBU = this.businessUnitSelect ? this.businessUnitSelect.value.trim().toLowerCase() : '';
        const selectedCountry = this.countrySelect ? this.countrySelect.value.trim().toLowerCase() : '';
        const searchQuery = this.searchInput ? this.searchInput.value.trim().toLowerCase() : '';

        let visibleCount = 0;
        const visibleMarkers = [];

        this.listItems.forEach(item => {
            const bu = item.dataset.businessUnit.toLowerCase();
            const country = item.dataset.country.toLowerCase();
            const address = item.dataset.address.toLowerCase();
            const name = item.dataset.name.toLowerCase();
            const id = item.dataset.id;
            const marker = this.markers.get(id);

            const matchesBU = !selectedBU || bu === selectedBU;
            const matchesCountry = !selectedCountry || country === selectedCountry;
            
            // Apply typo-tolerant fuzzy matching on Address search input
            const matchesSearch = !searchQuery || this.fuzzyMatch(searchQuery, name + " " + address);

            if (matchesBU && matchesCountry && matchesSearch) {
                // Show item
                item.style.display = 'flex';
                visibleCount++;

                if (marker && this.map) {
                    if (!this.map.hasLayer(marker)) {
                        marker.addTo(this.map);
                    }
                    visibleMarkers.push(marker);
                }
            } else {
                // Hide item
                item.style.display = 'none';
                item.classList.remove('is-active');

                if (marker && this.map && this.map.hasLayer(marker)) {
                    this.map.removeLayer(marker);
                }
            }
        });

        // Update Results Count
        if (this.resultsCountEl) {
            this.resultsCountEl.textContent = visibleCount;
        }

        // Show/hide empty state
        const emptyState = this.container.querySelector('.storemapper-empty-state');
        if (visibleCount === 0) {
            if (emptyState) emptyState.style.display = 'flex';
        } else {
            if (emptyState) emptyState.style.display = 'none';
        }

        // Auto zoom and bounds adjustment
        if (this.map && visibleMarkers.length > 0) {
            const group = new L.featureGroup(visibleMarkers);
            // Pad the bounds slightly so markers aren't right on the edge of the viewport
            this.map.fitBounds(group.getBounds().pad(0.15));
        }
    }
}

// Instantiate on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new LGStoreMapper());
} else {
    new LGStoreMapper();
}
