/**
 * ============================================================================
 * KISANSEVA PORTAL - APPLICATION LOGIC (ES6+)
 * Agricultural Digital Support for Farmers
 * Single-Page, Offline-First, Zero External Dependencies
 * 
 * Academic Project Context:
 * - Faculty Mentor: Dr. K. Dinesh
 * - Team Lead: G. Hari Charan (2500040163)
 * - Team Member: H. Venu Gopal Krishna (2500040237)
 * ============================================================================
 */

(function () {
  'use strict';

  // --------------------------------------------------------------------------
  // 1. Constants & Pre-populated Agricultural Catalog Data
  // --------------------------------------------------------------------------
  const STORAGE_KEYS = {
    PROFILE: 'agri_profile',
    FARM: 'agri_farm',
    ACTIVITIES: 'agri_activities'
  };

  /**
   * Pre-populated staple crop catalog for Indian agronomic conditions
   */
  const CROP_CATALOG = [
    {
      id: 'paddy',
      name: 'Paddy (Rice)',
      scientificName: 'Oryza sativa',
      emoji: '🌾',
      season: 'Kharif',
      duration: '115 - 135 Days',
      soilTypes: ['Alluvial Soil', 'Clay Loam', 'Black Cotton Soil'],
      waterNeeds: 'High (1100 - 1300 mm, Standing water)',
      npkRatio: '120 : 60 : 40 kg/ha',
      tips: 'Maintain 2-3 cm standing water during tillering. Monitor for stem borer and blast disease; install light traps to suppress moths.'
    },
    {
      id: 'cotton',
      name: 'Cotton',
      scientificName: 'Gossypium hirsutum',
      emoji: '☁️',
      season: 'Kharif',
      duration: '150 - 180 Days',
      soilTypes: ['Black Cotton Soil', 'Deep Vertisols', 'Clay Loam'],
      waterNeeds: 'Moderate (650 - 800 mm, Sensitive to waterlogging)',
      npkRatio: '150 : 60 : 60 kg/ha',
      tips: 'Deep black soil provides ideal water retention. Erect 5 pheromone traps/acre for pink bollworm and spray 5% neem seed kernel extract (NSKE).'
    },
    {
      id: 'groundnut',
      name: 'Groundnut (Peanut)',
      scientificName: 'Arachis hypogaea',
      emoji: '🥜',
      season: 'Kharif / Rabi',
      duration: '105 - 120 Days',
      soilTypes: ['Red Loam Soil', 'Sandy Loam', 'Alluvial Soil'],
      waterNeeds: 'Moderate (450 - 550 mm, Critical at pegging stage)',
      npkRatio: '25 : 50 : 50 kg/ha + Gypsum @ 400 kg/ha',
      tips: 'Apply Gypsum during 40-45 DAS (flowering/pegging) to ensure proper pod filling and strong shell calcification.'
    },
    {
      id: 'maize',
      name: 'Maize (Corn)',
      scientificName: 'Zea mays',
      emoji: '🌽',
      season: 'Kharif / Rabi',
      duration: '90 - 110 Days',
      soilTypes: ['Red Loam Soil', 'Alluvial Soil', 'Black Cotton Soil'],
      waterNeeds: 'Moderate (500 - 650 mm, Sensitive to drought at silking)',
      npkRatio: '120 : 60 : 40 kg/ha',
      tips: 'Scout regularly for Fall Armyworm (FAW). Intercrop with cowpea or apply bio-agent Bacillus thuringiensis (Bt) at early whorl stage.'
    },
    {
      id: 'chilli',
      name: 'Chilli (Hot Pepper)',
      scientificName: 'Capsicum annuum',
      emoji: '🌶️',
      season: 'Kharif / Annual',
      duration: '140 - 160 Days',
      soilTypes: ['Black Cotton Soil', 'Red Loam Soil', 'Sandy Loam'],
      waterNeeds: 'Moderate (600 - 750 mm, Drip recommended)',
      npkRatio: '150 : 75 : 75 kg/ha',
      tips: 'Deploy blue sticky cards for thrips and yellow cards for whiteflies. Avoid excessive nitrogen which attracts leaf-curl virus vectors.'
    },
    {
      id: 'bengal_gram',
      name: 'Bengal Gram (Chickpea)',
      scientificName: 'Cicer arietinum',
      emoji: '🥣',
      season: 'Rabi',
      duration: '95 - 110 Days',
      soilTypes: ['Black Cotton Soil', 'Red Loam Soil', 'Clay Loam'],
      waterNeeds: 'Low (250 - 350 mm, Highly drought resistant)',
      npkRatio: '20 : 40 : 20 kg/ha (Rhizobium inoculated)',
      tips: 'Conserves soil nitrogen through root nodulation. Critical irrigation at branching and pod development. Nip tops at 35 DAS to stimulate branching.'
    },
    {
      id: 'sugarcane',
      name: 'Sugarcane',
      scientificName: 'Saccharum officinarum',
      emoji: '🎍',
      season: 'Annual',
      duration: '330 - 365 Days',
      soilTypes: ['Alluvial Soil', 'Black Cotton Soil', 'Clay Loam'],
      waterNeeds: 'Very High (1500 - 2500 mm)',
      npkRatio: '250 : 100 : 120 kg/ha',
      tips: 'Trash mulching conserves up to 30% moisture and suppresses weeds. Practice drip fertigation for maximum sucrose accumulation.'
    },
    {
      id: 'tomato',
      name: 'Tomato',
      scientificName: 'Solanum lycopersicum',
      emoji: '🍅',
      season: 'Rabi / Zaid',
      duration: '110 - 130 Days',
      soilTypes: ['Red Loam Soil', 'Alluvial Soil', 'Sandy Loam'],
      waterNeeds: 'Moderate (500 - 600 mm, Constant moisture)',
      npkRatio: '150 : 100 : 100 kg/ha',
      tips: 'Staking plants prevents soil-borne fungal blight. Mulch with silver-black polyethylene film to deter thrips and aphid infestation.'
    }
  ];

  /**
   * Agronomic guidelines mapped by soil classification
   */
  const SOIL_ADVISORY = {
    'Black Cotton Soil': {
      crops: 'Cotton, Chilli, Bengal Gram, Sugarcane, Soybean',
      waterStrategy: 'High moisture retention vertisols. Prone to waterlogging; adopt ridge & furrow method. Avoid excessive winter irrigation.',
      fertilizerStrategy: 'Rich in Iron, Calcium & Magnesium; deficient in Nitrogen & Phosphorus. Apply targeted phosphatic fertilizers with deep placement.'
    },
    'Red Loam Soil': {
      crops: 'Groundnut, Maize, Millets, Pulses, Castor',
      waterStrategy: 'Porous and moderately well-drained. Requires frequent, split irrigations; ideal for micro-drip and sprinkler installations.',
      fertilizerStrategy: 'Deficient in Nitrogen, Phosphorus, Humus, and Lime. Fortify with organic Farm Yard Manure (FYM) and bio-fertilizers.'
    },
    'Alluvial Soil': {
      crops: 'Paddy, Wheat, Sugarcane, Maize, Vegetables',
      waterStrategy: 'Excellent water retention and capillary permeability. Highly responsive to canal irrigation and tube-well systems.',
      fertilizerStrategy: 'Potash-rich but needs balanced Nitrogen (split doses) and Zinc fortification for maximum cereal productivity.'
    },
    'Laterite Soil': {
      crops: 'Cashew, Coconut, Arecanut, Tea, Rubber, Coffee',
      waterStrategy: 'Rapid infiltration and heavy leaching during monsoons. Maintain organic mulching to prevent topsoil erosion.',
      fertilizerStrategy: 'Acidic pH. Apply agricultural lime (calcium carbonate) or dolomite to normalize soil reaction and boost phosphorus availability.'
    },
    'Sandy Loam': {
      crops: 'Groundnut, Watermelon, Pulses, Potato, Vegetables',
      waterStrategy: 'Low moisture-holding capacity. Adopt drip irrigation at daily micro-intervals to prevent drought shock.',
      fertilizerStrategy: 'High leaching risk. Apply nitrogenous fertilizers in multiple small split doses rather than basal broadcast.'
    },
    'Clay Loam': {
      crops: 'Paddy, Wheat, Cotton, Sugarcane',
      waterStrategy: 'Heavy texture; ensure field drainage ditches to prevent root rot during heavy downpours.',
      fertilizerStrategy: 'High cation exchange capacity. Good response to green manuring (Sunhemp / Dhaincha).'
    }
  };

  // --------------------------------------------------------------------------
  // 2. Data State Helpers & Safe Storage Management
  // --------------------------------------------------------------------------
  const State = {
    getProfile() {
      try {
        const raw = localStorage.getItem(STORAGE_KEYS.PROFILE);
        return raw ? JSON.parse(raw) : null;
      } catch (e) {
        console.error('Error parsing profile from localStorage:', e);
        return null;
      }
    },
    saveProfile(data) {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(data));
    },

    getFarm() {
      try {
        const raw = localStorage.getItem(STORAGE_KEYS.FARM);
        return raw ? JSON.parse(raw) : null;
      } catch (e) {
        console.error('Error parsing farm details from localStorage:', e);
        return null;
      }
    },
    saveFarm(data) {
      localStorage.setItem(STORAGE_KEYS.FARM, JSON.stringify(data));
    },

    getActivities() {
      try {
        const raw = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
        return raw ? JSON.parse(raw) : [];
      } catch (e) {
        console.error('Error parsing activities from localStorage:', e);
        return [];
      }
    },
    saveActivities(arr) {
      localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(arr));
    }
  };

  /**
   * Currency formatter in Indian Rupees (₹ en-IN)
   */
  const inrFormatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2
  });

  /**
   * Sanitize text strings to prevent HTML injection in dynamic templates
   */
  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /**
   * Display accessible toast message
   */
  function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type === 'error' ? 'toast-error' : type === 'info' ? 'toast-info' : ''}`;
    
    const icon = type === 'error' ? '⚠️' : type === 'info' ? 'ℹ️' : '✅';
    toast.innerHTML = `<span>${icon}</span> <span>${escapeHtml(message)}</span>`;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  // --------------------------------------------------------------------------
  // 3. Navigation & Tab Switching
  // --------------------------------------------------------------------------
  function initNavigation() {
    const tabs = document.querySelectorAll('.nav-tab');
    const views = document.querySelectorAll('.app-view');

    function switchTab(targetId) {
      // Deactivate all
      tabs.forEach(tab => {
        tab.classList.remove('active');
        tab.setAttribute('aria-selected', 'false');
      });
      views.forEach(view => view.classList.remove('active'));

      // Activate selected
      const activeTab = document.querySelector(`.nav-tab[data-target="${targetId}"]`);
      const activeView = document.getElementById(targetId);

      if (activeTab && activeView) {
        activeTab.classList.add('active');
        activeTab.setAttribute('aria-selected', 'true');
        activeView.classList.add('active');

        // Scroll tab into view if overflowing on mobile
        activeTab.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });

        // Trigger view-specific re-renders
        if (targetId === 'view-dashboard') renderDashboard();
        if (targetId === 'view-ledger') renderLedger();
        if (targetId === 'view-crops') filterCrops();
      }
    }

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const targetId = tab.getAttribute('data-target');
        switchTab(targetId);
      });
    });

    // Quick shortcuts across views
    const quickProfileBtn = document.getElementById('btn-quick-profile');
    if (quickProfileBtn) {
      quickProfileBtn.addEventListener('click', () => switchTab('view-profile'));
    }

    const dashActionBtn = document.getElementById('btn-dash-action');
    if (dashActionBtn) {
      dashActionBtn.addEventListener('click', () => {
        const profile = State.getProfile();
        if (!profile) switchTab('view-profile');
        else switchTab('view-ledger');
      });
    }

    const editFarmShortcut = document.getElementById('btn-edit-farm-shortcut');
    if (editFarmShortcut) {
      editFarmShortcut.addEventListener('click', () => switchTab('view-farm'));
    }

    const viewAllLedger = document.getElementById('btn-view-all-ledger');
    if (viewAllLedger) {
      viewAllLedger.addEventListener('click', () => switchTab('view-ledger'));
    }

    const viewAllDiagramsBtn = document.getElementById('btn-view-all-diagrams');
    if (viewAllDiagramsBtn) {
      viewAllDiagramsBtn.addEventListener('click', () => switchTab('view-diagrams'));
    }

    // Expose programmatic switcher for crop cards & navigation
    window.kisanSwitchTab = switchTab;
  }

  // --------------------------------------------------------------------------
  // 4. Farmer Registration & Profile Module
  // --------------------------------------------------------------------------
  function initProfileModule() {
    const form = document.getElementById('form-profile');
    const inputName = document.getElementById('prof-name');
    const inputPhone = document.getElementById('prof-phone');
    const selectLang = document.getElementById('prof-lang');
    const inputDistrict = document.getElementById('prof-district');
    const inputVillage = document.getElementById('prof-village');
    const selectMethod = document.getElementById('prof-methodology');
    const resetBtn = document.getElementById('btn-reset-profile');

    // Phone validation regex: 10 digits starting with 6, 7, 8, or 9
    const phoneRegex = /^[6-9]\d{9}$/;

    // Populate form from state
    function loadProfileForm() {
      const data = State.getProfile();
      if (data) {
        inputName.value = data.name || '';
        inputPhone.value = data.phone || '';
        selectLang.value = data.language || 'English';
        inputDistrict.value = data.district || '';
        inputVillage.value = data.village || '';
        selectMethod.value = data.methodology || 'Conventional Farming';
      }
      updateProfileUI(data);
    }

    // Validate inputs
    function validateProfileForm() {
      let isValid = true;

      // Name validation
      if (!inputName.value.trim() || inputName.value.trim().length < 2) {
        inputName.classList.add('is-invalid');
        isValid = false;
      } else {
        inputName.classList.remove('is-invalid');
      }

      // Phone validation
      if (!phoneRegex.test(inputPhone.value.trim())) {
        inputPhone.classList.add('is-invalid');
        isValid = false;
      } else {
        inputPhone.classList.remove('is-invalid');
      }

      // District validation
      if (!inputDistrict.value.trim()) {
        inputDistrict.classList.add('is-invalid');
        isValid = false;
      } else {
        inputDistrict.classList.remove('is-invalid');
      }

      // Village validation
      if (!inputVillage.value.trim()) {
        inputVillage.classList.add('is-invalid');
        isValid = false;
      } else {
        inputVillage.classList.remove('is-invalid');
      }

      return isValid;
    }

    // Input listeners to clear errors on user typing
    [inputName, inputPhone, inputDistrict, inputVillage].forEach(input => {
      input.addEventListener('input', () => {
        if (input.classList.contains('is-invalid')) {
          if (input === inputPhone) {
            if (phoneRegex.test(input.value.trim())) input.classList.remove('is-invalid');
          } else if (input.value.trim().length >= 2) {
            input.classList.remove('is-invalid');
          }
        }
      });
    });

    // Form submit
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!validateProfileForm()) {
        showToast('Please correct marked profile fields before saving.', 'error');
        return;
      }

      const profileData = {
        name: inputName.value.trim(),
        phone: inputPhone.value.trim(),
        language: selectLang.value,
        district: inputDistrict.value.trim(),
        village: inputVillage.value.trim(),
        methodology: selectMethod.value,
        updatedAt: new Date().toISOString()
      };

      State.saveProfile(profileData);
      updateProfileUI(profileData);
      renderDashboard();
      showToast('Farmer profile saved successfully to offline storage!');
    });

    // Reset button
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (confirm('Clear form fields? Stored data will not be removed until you save.')) {
          form.reset();
          [inputName, inputPhone, inputDistrict, inputVillage].forEach(i => i.classList.remove('is-invalid'));
        }
      });
    }

    loadProfileForm();
  }

  function updateProfileUI(profile) {
    const badgeName = document.getElementById('badge-name');
    const badgeLocation = document.getElementById('badge-location');
    const idName = document.getElementById('id-card-name');
    const idPhone = document.getElementById('id-card-phone');
    const idVillage = document.getElementById('id-card-village');
    const idDistrict = document.getElementById('id-card-district');
    const idLang = document.getElementById('id-card-lang');
    const idMethod = document.getElementById('id-card-method');

    if (profile && profile.name) {
      badgeName.textContent = profile.name;
      badgeLocation.textContent = `${profile.village || 'Village'}, ${profile.district || 'District'}`;

      if (idName) idName.textContent = profile.name;
      if (idPhone) idPhone.textContent = `+91 ${profile.phone}`;
      if (idVillage) idVillage.textContent = profile.village;
      if (idDistrict) idDistrict.textContent = profile.district;
      if (idLang) idLang.textContent = profile.language;
      if (idMethod) idMethod.textContent = profile.methodology;
    } else {
      badgeName.textContent = 'Guest Farmer';
      badgeLocation.textContent = 'Profile Not Configured';

      if (idName) idName.textContent = 'Guest Farmer';
      if (idPhone) idPhone.textContent = '--';
      if (idVillage) idVillage.textContent = '--';
      if (idDistrict) idDistrict.textContent = '--';
      if (idLang) idLang.textContent = 'English';
      if (idMethod) idMethod.textContent = 'Conventional';
    }
  }

  // --------------------------------------------------------------------------
  // 5. Farm Details & Soil/Water Resources Module
  // --------------------------------------------------------------------------
  function initFarmModule() {
    const form = document.getElementById('form-farm');
    const inputAcres = document.getElementById('farm-acres');
    const inputSurvey = document.getElementById('farm-survey');
    const selectSoil = document.getElementById('farm-soil');
    const selectWater = document.getElementById('farm-water');
    const inputCrops = document.getElementById('farm-crops');
    const resetBtn = document.getElementById('btn-reset-farm');
    const quickTags = document.querySelectorAll('#crop-quick-tags .tag-chip');

    // Populate from storage
    function loadFarmForm() {
      const data = State.getFarm();
      if (data) {
        inputAcres.value = data.acres !== undefined ? data.acres : '';
        inputSurvey.value = data.survey || '';
        selectSoil.value = data.soil || '';
        selectWater.value = data.water || '';
        inputCrops.value = data.crops || '';
      }
      renderFarmAdvisory(selectSoil.value);
    }

    // Quick tag selector for standing crops
    quickTags.forEach(chip => {
      chip.addEventListener('click', () => {
        const cropName = chip.getAttribute('data-crop');
        const current = inputCrops.value.trim();
        if (!current) {
          inputCrops.value = cropName;
        } else {
          const list = current.split(',').map(s => s.trim().toLowerCase());
          if (!list.includes(cropName.toLowerCase())) {
            inputCrops.value = `${current}, ${cropName}`;
          }
        }
        inputCrops.classList.remove('is-invalid');
      });
    });

    // Update agronomic advice on soil selection change
    selectSoil.addEventListener('change', () => {
      renderFarmAdvisory(selectSoil.value);
    });

    function validateFarmForm() {
      let isValid = true;

      const acresVal = parseFloat(inputAcres.value);
      if (isNaN(acresVal) || acresVal <= 0) {
        inputAcres.classList.add('is-invalid');
        isValid = false;
      } else {
        inputAcres.classList.remove('is-invalid');
      }

      if (!inputSurvey.value.trim()) {
        inputSurvey.classList.add('is-invalid');
        isValid = false;
      } else {
        inputSurvey.classList.remove('is-invalid');
      }

      if (!selectSoil.value) {
        selectSoil.classList.add('is-invalid');
        isValid = false;
      } else {
        selectSoil.classList.remove('is-invalid');
      }

      if (!selectWater.value) {
        selectWater.classList.add('is-invalid');
        isValid = false;
      } else {
        selectWater.classList.remove('is-invalid');
      }

      if (!inputCrops.value.trim()) {
        inputCrops.classList.add('is-invalid');
        isValid = false;
      } else {
        inputCrops.classList.remove('is-invalid');
      }

      return isValid;
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!validateFarmForm()) {
        showToast('Please complete all required farm details.', 'error');
        return;
      }

      const farmData = {
        acres: parseFloat(inputAcres.value),
        survey: inputSurvey.value.trim(),
        soil: selectSoil.value,
        water: selectWater.value,
        crops: inputCrops.value.trim(),
        updatedAt: new Date().toISOString()
      };

      State.saveFarm(farmData);
      renderDashboard();
      updateCropDatalist();
      showToast('Agricultural land & crop details saved successfully!');
    });

    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (confirm('Reset farm details form? Stored data will remain until saved.')) {
          form.reset();
          [inputAcres, inputSurvey, selectSoil, selectWater, inputCrops].forEach(el => el.classList.remove('is-invalid'));
          renderFarmAdvisory('');
        }
      });
    }

    loadFarmForm();
  }

  function renderFarmAdvisory(soilType) {
    const advisoryContainer = document.getElementById('farm-advisory-box');
    if (!advisoryContainer) return;

    if (!soilType || !SOIL_ADVISORY[soilType]) {
      advisoryContainer.innerHTML = `
        <div class="empty-state-mini">
          <span class="empty-icon">🌱</span>
          <p>Select your soil classification to see scientific water management and nutrient guidelines.</p>
        </div>
      `;
      return;
    }

    const info = SOIL_ADVISORY[soilType];
    advisoryContainer.innerHTML = `
      <div class="detail-list">
        <li>
          <span class="detail-label">🌍 Identified Soil:</span>
          <span class="detail-value font-bold">${escapeHtml(soilType)}</span>
        </li>
        <li>
          <span class="detail-label">🌾 Best Suited Crops:</span>
          <span class="detail-value">${escapeHtml(info.crops)}</span>
        </li>
      </div>
      <div class="crop-tip-box" style="margin-top: 14px;">
        <strong>💧 Irrigation &amp; Drainage Strategy:</strong>
        ${escapeHtml(info.waterStrategy)}
      </div>
      <div class="crop-tip-box" style="margin-top: 10px; border-left-color: #10b981; background-color: #f0fdf4; color: #064e3b;">
        <strong style="color: #047857;">🧪 Nutrient &amp; Manure Optimization:</strong>
        ${escapeHtml(info.fertilizerStrategy)}
      </div>
    `;
  }

  /**
   * Sync active crops to Field Ledger datalist for autocomplete
   */
  function updateCropDatalist() {
    const datalist = document.getElementById('crop-datalist');
    if (!datalist) return;

    const farm = State.getFarm();
    const uniqueCrops = new Set(['Paddy', 'Cotton', 'Groundnut', 'Maize', 'Chilli', 'Bengal Gram']);

    if (farm && farm.crops) {
      farm.crops.split(',').forEach(c => {
        const trimmed = c.trim();
        if (trimmed) uniqueCrops.add(trimmed);
      });
    }

    datalist.innerHTML = Array.from(uniqueCrops)
      .map(c => `<option value="${escapeHtml(c)}">`)
      .join('');
  }

  // --------------------------------------------------------------------------
  // 6. Crop Information Catalog & Live Client-Side Filtering
  // --------------------------------------------------------------------------
  function initCropCatalog() {
    const searchInput = document.getElementById('crop-search-input');
    const clearSearchBtn = document.getElementById('btn-clear-crop-search');
    const soilFilter = document.getElementById('crop-soil-filter');
    const seasonFilter = document.getElementById('crop-season-filter');

    searchInput.addEventListener('input', filterCrops);
    soilFilter.addEventListener('change', filterCrops);
    seasonFilter.addEventListener('change', filterCrops);

    clearSearchBtn.addEventListener('click', () => {
      searchInput.value = '';
      filterCrops();
      searchInput.focus();
    });

    filterCrops();
  }

  function filterCrops() {
    const container = document.getElementById('crop-grid-container');
    const searchInput = document.getElementById('crop-search-input');
    const soilFilter = document.getElementById('crop-soil-filter');
    const seasonFilter = document.getElementById('crop-season-filter');
    const countBadge = document.getElementById('crop-count-badge');

    if (!container) return;

    const query = (searchInput.value || '').trim().toLowerCase();
    const selectedSoil = soilFilter.value;
    const selectedSeason = seasonFilter.value;

    const matchedCrops = CROP_CATALOG.filter(crop => {
      // Name & text search match
      const textMatch = !query || 
        crop.name.toLowerCase().includes(query) ||
        crop.scientificName.toLowerCase().includes(query) ||
        crop.tips.toLowerCase().includes(query);

      // Soil match
      const soilMatch = selectedSoil === 'ALL' || 
        crop.soilTypes.some(s => s.toLowerCase().includes(selectedSoil.toLowerCase()));

      // Season match
      const seasonMatch = selectedSeason === 'ALL' || 
        crop.season.toLowerCase().includes(selectedSeason.toLowerCase());

      return textMatch && soilMatch && seasonMatch;
    });

    // Update status badge
    countBadge.textContent = `Showing ${matchedCrops.length} of ${CROP_CATALOG.length} crops`;

    if (matchedCrops.length === 0) {
      container.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <span class="empty-icon">🔍</span>
          <h4>No Matching Crops Found</h4>
          <p>No agricultural entries match your search criteria. Try clearing the soil/season filter or typing a broader crop name.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = matchedCrops.map(crop => `
      <div class="crop-card">
        <div class="crop-card-top">
          <div class="crop-card-title-group">
            <span class="crop-card-emoji">${crop.emoji}</span>
            <div>
              <h3 class="crop-card-name">${escapeHtml(crop.name)}</h3>
              <span class="crop-card-scientific">${escapeHtml(crop.scientificName)}</span>
            </div>
          </div>
          <span class="crop-season-tag">${escapeHtml(crop.season)}</span>
        </div>

        <div class="crop-card-body">
          <div class="crop-meta-grid">
            <div class="crop-meta-item">
              <strong>⏱️ Growth Duration</strong>
              <span>${escapeHtml(crop.duration)}</span>
            </div>
            <div class="crop-meta-item">
              <strong>💧 Water Requirement</strong>
              <span>${escapeHtml(crop.waterNeeds)}</span>
            </div>
            <div class="crop-meta-item">
              <strong>🌍 Ideal Soil Types</strong>
              <span>${crop.soilTypes.map(s => escapeHtml(s)).join(', ')}</span>
            </div>
            <div class="crop-meta-item">
              <strong>🧪 Recommended N:P:K</strong>
              <span>${escapeHtml(crop.npkRatio)}</span>
            </div>
          </div>

          <div class="crop-tip-box">
            <strong>🌱 Cultivation &amp; IPM Advisory:</strong>
            ${escapeHtml(crop.tips)}
          </div>
        </div>

        <div class="crop-card-footer">
          <button type="button" class="btn btn-outline btn-block btn-sm" onclick="kisanLogCropActivity('${crop.name}')">
            ➕ Log Activity for ${escapeHtml(crop.name)}
          </button>
        </div>
      </div>
    `).join('');
  }

  // Quick action from Crop Catalog to Field Ledger
  window.kisanLogCropActivity = function (cropName) {
    if (window.kisanSwitchTab) {
      window.kisanSwitchTab('view-ledger');
      const cropInput = document.getElementById('act-crop');
      if (cropInput) {
        cropInput.value = cropName;
        cropInput.focus();
      }
    }
  };

  // --------------------------------------------------------------------------
  // 7. Farm Activity Management (Field Ledger) Module
  // --------------------------------------------------------------------------
  function initLedgerModule() {
    const form = document.getElementById('form-activity');
    const inputDate = document.getElementById('act-date');
    const selectCat = document.getElementById('act-category');
    const inputCrop = document.getElementById('act-crop');
    const inputCost = document.getElementById('act-cost');
    const inputNotes = document.getElementById('act-notes');
    const filterCat = document.getElementById('ledger-filter-category');
    const exportCsvBtn = document.getElementById('btn-export-ledger-csv');

    // Default date to today's local date YYYY-MM-DD
    const today = new Date().toISOString().split('T')[0];
    if (inputDate) inputDate.value = today;

    // Filter change
    if (filterCat) {
      filterCat.addEventListener('change', renderLedger);
    }

    // CSV Exporter
    if (exportCsvBtn) {
      exportCsvBtn.addEventListener('click', exportLedgerCSV);
    }

    function validateActivityForm() {
      let isValid = true;

      if (!inputDate.value) {
        inputDate.classList.add('is-invalid');
        isValid = false;
      } else {
        inputDate.classList.remove('is-invalid');
      }

      if (!selectCat.value) {
        selectCat.classList.add('is-invalid');
        isValid = false;
      } else {
        selectCat.classList.remove('is-invalid');
      }

      if (!inputCrop.value.trim()) {
        inputCrop.classList.add('is-invalid');
        isValid = false;
      } else {
        inputCrop.classList.remove('is-invalid');
      }

      const costVal = parseFloat(inputCost.value);
      if (isNaN(costVal) || costVal < 0) {
        inputCost.classList.add('is-invalid');
        isValid = false;
      } else {
        inputCost.classList.remove('is-invalid');
      }

      return isValid;
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!validateActivityForm()) {
        showToast('Please correct the highlighted activity fields.', 'error');
        return;
      }

      const newRecord = {
        id: Date.now(), // Unique epoch timestamp
        date: inputDate.value,
        category: selectCat.value,
        crop: inputCrop.value.trim(),
        cost: parseFloat(inputCost.value) || 0,
        notes: inputNotes.value.trim()
      };

      const activities = State.getActivities();
      activities.unshift(newRecord); // Add newest first
      State.saveActivities(activities);

      // Reset form fields except date
      selectCat.value = '';
      inputCost.value = '';
      inputNotes.value = '';

      renderLedger();
      renderDashboard();
      showToast('Field operation recorded successfully in ledger!');
    });

    renderLedger();
  }

  function getCategoryCssClass(cat) {
    if (!cat) return 'cat-default';
    const c = cat.toLowerCase();
    if (c.includes('sowing')) return 'cat-sowing';
    if (c.includes('irrigation')) return 'cat-irrigation';
    if (c.includes('fertilizer')) return 'cat-fertilizer';
    if (c.includes('pesticide')) return 'cat-pesticide';
    if (c.includes('weeding')) return 'cat-weeding';
    if (c.includes('harvesting')) return 'cat-harvesting';
    return 'cat-default';
  }

  function renderLedger() {
    const tableBody = document.getElementById('ledger-table-body');
    const emptyState = document.getElementById('ledger-empty-state');
    const totalExpenseEl = document.getElementById('ledger-total-expense');
    const totalCountEl = document.getElementById('ledger-total-count');
    const categoryChips = document.getElementById('ledger-category-chips');
    const filterCat = document.getElementById('ledger-filter-category');

    if (!tableBody) return;

    const allActivities = State.getActivities();
    const filterVal = filterCat ? filterCat.value : 'ALL';

    // Filter activities
    const displayActivities = filterVal === 'ALL'
      ? allActivities
      : allActivities.filter(a => a.category === filterVal);

    // Calculate total cost using Array.prototype.reduce()
    const totalCost = allActivities.reduce((acc, curr) => acc + (Number(curr.cost) || 0), 0);
    totalExpenseEl.textContent = inrFormatter.format(totalCost);
    totalCountEl.textContent = `${allActivities.length} Records`;

    // Category breakdown summary chips using reduce()
    const categoryBreakdown = allActivities.reduce((acc, curr) => {
      const cat = curr.category || 'General';
      acc[cat] = (acc[cat] || 0) + (Number(curr.cost) || 0);
      return acc;
    }, {});

    categoryChips.innerHTML = Object.entries(categoryBreakdown).map(([cat, sum]) => `
      <span class="cat-pill">
        ${escapeHtml(cat)}: <strong>${inrFormatter.format(sum)}</strong>
      </span>
    `).join('');

    if (displayActivities.length === 0) {
      tableBody.innerHTML = '';
      emptyState.style.display = 'block';
      return;
    }

    emptyState.style.display = 'none';

    tableBody.innerHTML = displayActivities.map(act => `
      <tr>
        <td><strong>${escapeHtml(act.date)}</strong></td>
        <td>
          <span class="category-tag ${getCategoryCssClass(act.category)}">
            ${escapeHtml(act.category)}
          </span>
        </td>
        <td><strong>${escapeHtml(act.crop)}</strong></td>
        <td><small>${escapeHtml(act.notes || '--')}</small></td>
        <td class="text-right cost-cell">${inrFormatter.format(act.cost || 0)}</td>
        <td class="text-center">
          <button type="button" class="btn-icon-del" onclick="kisanDeleteActivity(${act.id})" title="Delete entry" aria-label="Delete activity on ${escapeHtml(act.date)}">
            🗑️
          </button>
        </td>
      </tr>
    `).join('');
  }

  // Activity deletion handler
  window.kisanDeleteActivity = function (id) {
    if (confirm('Are you sure you want to delete this field record? This cannot be undone.')) {
      const activities = State.getActivities();
      const filtered = activities.filter(a => a.id !== id);
      State.saveActivities(filtered);
      renderLedger();
      renderDashboard();
      showToast('Activity record deleted.', 'info');
    }
  };

  /**
   * Export Ledger as CSV file
   */
  function exportLedgerCSV() {
    const activities = State.getActivities();
    if (activities.length === 0) {
      showToast('No ledger records available to export.', 'error');
      return;
    }

    const headers = ['Record_ID', 'Date', 'Category', 'Crop', 'Cost_INR', 'Field_Notes'];
    const rows = activities.map(a => [
      a.id,
      `"${a.date}"`,
      `"${a.category}"`,
      `"${a.crop}"`,
      a.cost,
      `"${(a.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + 
      [headers.join(','), ...rows.map(e => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `KisanSeva_Ledger_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Ledger exported as CSV!');
  }

  // --------------------------------------------------------------------------
  // 8. Central Farmer Dashboard Synchronizer
  // --------------------------------------------------------------------------
  function renderDashboard() {
    const profile = State.getProfile();
    const farm = State.getFarm();
    const activities = State.getActivities();

    // Welcome banner customization
    const greetingTitle = document.getElementById('dash-greeting-title');
    const greetingText = document.getElementById('dash-greeting-text');
    const dashActionBtn = document.getElementById('btn-dash-action');

    if (profile && profile.name) {
      greetingTitle.textContent = `Namaste, ${profile.name}! 🌾`;
      greetingText.textContent = `Active in ${profile.village || 'Village'}, ${profile.district || 'District'}. All farm records and ledger accounts are synced offline.`;
      if (dashActionBtn) dashActionBtn.textContent = 'Record Activity';
    } else {
      greetingTitle.textContent = 'Welcome to KisanSeva!';
      greetingText.textContent = 'Your local digital assistant for precision record-keeping and crop advisory. Configure your profile to get started.';
      if (dashActionBtn) dashActionBtn.textContent = 'Update Profile';
    }

    // KPI 1: Land Area
    const kpiAcres = document.getElementById('kpi-acres');
    const kpiSurvey = document.getElementById('kpi-survey');
    if (farm && farm.acres) {
      kpiAcres.innerHTML = `${farm.acres} <small>Acres</small>`;
      kpiSurvey.textContent = `Passbook: ${farm.survey || 'N/A'}`;
    } else {
      kpiAcres.innerHTML = `0.0 <small>Acres</small>`;
      kpiSurvey.textContent = 'Passbook: Not Set';
    }

    // KPI 2: Primary Standing Crop
    const kpiCrop = document.getElementById('kpi-crop');
    const kpiMethod = document.getElementById('kpi-method');
    if (farm && farm.crops) {
      const primary = farm.crops.split(',')[0].trim();
      kpiCrop.textContent = primary || 'None';
    } else {
      kpiCrop.textContent = 'None';
    }
    if (profile && profile.methodology) {
      kpiMethod.textContent = `Method: ${profile.methodology}`;
    } else {
      kpiMethod.textContent = 'Method: Not Set';
    }

    // KPI 3: Operations Logged
    const kpiActCount = document.getElementById('kpi-activity-count');
    const kpiActSub = document.getElementById('kpi-activity-sub');
    kpiActCount.textContent = activities.length;
    kpiActSub.textContent = activities.length === 1 ? '1 field operation' : `${activities.length} field operations`;

    // KPI 4: Total Expense using reduce()
    const kpiTotalExp = document.getElementById('kpi-total-expense');
    const totalCost = activities.reduce((acc, curr) => acc + (Number(curr.cost) || 0), 0);
    kpiTotalExp.textContent = inrFormatter.format(totalCost);

    // Farm Natural Resources Overview Card
    const dashSoil = document.getElementById('dash-soil-type');
    const dashWater = document.getElementById('dash-water-source');
    const dashCrops = document.getElementById('dash-active-crops');
    const dashLocation = document.getElementById('dash-location-text');
    const dashMethodology = document.getElementById('dash-methodology-text');
    const dashSoilAdvice = document.getElementById('dash-soil-advice');

    if (farm) {
      dashSoil.textContent = farm.soil || 'Not Configured';
      dashWater.textContent = farm.water || 'Not Configured';
      dashCrops.textContent = farm.crops || 'None recorded';

      if (farm.soil && SOIL_ADVISORY[farm.soil]) {
        dashSoilAdvice.innerHTML = `
          <span class="pill-icon">💡</span>
          <p class="pill-text"><strong>${escapeHtml(farm.soil)}:</strong> ${escapeHtml(SOIL_ADVISORY[farm.soil].waterStrategy)}</p>
        `;
      }
    } else {
      dashSoil.textContent = 'Not Configured';
      dashWater.textContent = 'Not Configured';
      dashCrops.textContent = 'None recorded';
    }

    if (profile) {
      dashLocation.textContent = `${profile.village || '--'}, ${profile.district || '--'}`;
      dashMethodology.textContent = profile.methodology || 'Conventional';
    } else {
      dashLocation.textContent = 'Not Set';
      dashMethodology.textContent = 'Not Set';
    }

    // Recent 3 Field Operations
    const recentList = document.getElementById('dash-recent-activities-list');
    if (recentList) {
      const top3 = activities.slice(0, 3);
      if (top3.length === 0) {
        recentList.innerHTML = `
          <div class="empty-state-mini">
            <span class="empty-icon">📝</span>
            <p>No field activities logged yet. Track your sowing, fertilizer, or harvest expenses in the Field Ledger.</p>
          </div>
        `;
      } else {
        recentList.innerHTML = top3.map(act => `
          <div class="recent-act-item">
            <div class="recent-act-left">
              <span class="category-tag ${getCategoryCssClass(act.category)}">${escapeHtml(act.category)}</span>
              <div>
                <div class="recent-act-cat">${escapeHtml(act.crop)}</div>
                <div class="recent-act-crop">${escapeHtml(act.notes || act.category)}</div>
              </div>
            </div>
            <div class="recent-act-right">
              <div class="recent-act-cost">${inrFormatter.format(act.cost || 0)}</div>
              <div class="recent-act-date">${escapeHtml(act.date)}</div>
            </div>
          </div>
        `).join('');
      }
    }
  }

  // --------------------------------------------------------------------------
  // 9. Data Backup, Restore & Sample Demo Population
  // --------------------------------------------------------------------------
  function initDataManagement() {
    const exportBtn = document.getElementById('btn-export-json');
    const importInput = document.getElementById('input-import-json');
    const loadDemoBtn = document.getElementById('btn-load-demo-data');

    // Export all data to JSON
    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        const fullBackup = {
          metadata: {
            portal: 'KisanSeva Portal',
            version: '1.0.0',
            exportedAt: new Date().toISOString(),
            mentor: 'Dr. K. Dinesh',
            team: ['G. Hari Charan (2500040163)', 'H. Venu Gopal Krishna (2500040237)']
          },
          profile: State.getProfile(),
          farm: State.getFarm(),
          activities: State.getActivities()
        };

        const jsonStr = JSON.stringify(fullBackup, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `KisanSeva_Backup_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        showToast('All farm records downloaded as JSON backup!');
      });
    }

    // Import from JSON
    if (importInput) {
      importInput.addEventListener('change', (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const data = JSON.parse(event.target.result);
            if (data.profile !== undefined) State.saveProfile(data.profile);
            if (data.farm !== undefined) State.saveFarm(data.farm);
            if (data.activities !== undefined) State.saveActivities(data.activities);

            // Re-render UI
            updateProfileUI(State.getProfile());
            renderDashboard();
            renderLedger();
            updateCropDatalist();

            showToast('Backup restored successfully from JSON file!');
          } catch (err) {
            console.error(err);
            showToast('Invalid backup file format. Please check the JSON file.', 'error');
          }
        };
        reader.readAsText(file);
        // Reset file input
        importInput.value = '';
      });
    }

    // Load rich sample data for viva / evaluation
    if (loadDemoBtn) {
      loadDemoBtn.addEventListener('click', () => {
        if (confirm('Load realistic sample farmer data for viva evaluation? (This will populate profile, farm, and ledger activities)')) {
          loadRealisticSampleData();
        }
      });
    }
  }

  function loadRealisticSampleData() {
    const demoProfile = {
      name: 'Ramesh Patel',
      phone: '9848022338',
      language: 'Telugu',
      district: 'Anantapur',
      village: 'Dharmavaram',
      methodology: 'Certified Organic',
      updatedAt: new Date().toISOString()
    };

    const demoFarm = {
      acres: 5.5,
      survey: 'SY-104/2B',
      soil: 'Black Cotton Soil',
      water: 'Borewell / Tube Well',
      crops: 'Groundnut, Cotton, Chilli',
      updatedAt: new Date().toISOString()
    };

    const todayDate = new Date();
    const getDateOffset = (daysAgo) => {
      const d = new Date(todayDate);
      d.setDate(d.getDate() - daysAgo);
      return d.toISOString().split('T')[0];
    };

    const demoActivities = [
      {
        id: Date.now() - 5000,
        date: getDateOffset(2),
        category: 'Pesticide Spray',
        crop: 'Cotton',
        cost: 1450,
        notes: 'Applied 5% Neem Seed Kernel Extract (NSKE) against whitefly'
      },
      {
        id: Date.now() - 10000,
        date: getDateOffset(8),
        category: 'Fertilizer Application',
        crop: 'Groundnut',
        cost: 3200,
        notes: 'Applied 200kg Gypsum for pegging and calcium fortification'
      },
      {
        id: Date.now() - 15000,
        date: getDateOffset(15),
        category: 'Weeding & Tillage',
        crop: 'Chilli',
        cost: 2400,
        notes: 'Engaged 6 farm laborers for manual weeding and ridging'
      },
      {
        id: Date.now() - 20000,
        date: getDateOffset(25),
        category: 'Irrigation',
        crop: 'Cotton',
        cost: 650,
        notes: 'Borewell pumping & drip line filtration maintenance'
      },
      {
        id: Date.now() - 25000,
        date: getDateOffset(35),
        category: 'Sowing / Planting',
        crop: 'Groundnut',
        cost: 8500,
        notes: 'Procured 120kg certified K6 groundnut seed with Trichoderma treatment'
      }
    ];

    State.saveProfile(demoProfile);
    State.saveFarm(demoFarm);
    State.saveActivities(demoActivities);

    // Sync views
    updateProfileUI(demoProfile);
    renderDashboard();
    renderLedger();
    updateCropDatalist();

    // Re-fill form inputs if user opens tabs
    const profName = document.getElementById('prof-name');
    if (profName) profName.value = demoProfile.name;
    const profPhone = document.getElementById('prof-phone');
    if (profPhone) profPhone.value = demoProfile.phone;
    const profDist = document.getElementById('prof-district');
    if (profDist) profDist.value = demoProfile.district;
    const profVill = document.getElementById('prof-village');
    if (profVill) profVill.value = demoProfile.village;

    const farmAcres = document.getElementById('farm-acres');
    if (farmAcres) farmAcres.value = demoFarm.acres;
    const farmSurvey = document.getElementById('farm-survey');
    if (farmSurvey) farmSurvey.value = demoFarm.survey;
    const farmSoil = document.getElementById('farm-soil');
    if (farmSoil) farmSoil.value = demoFarm.soil;
    const farmWater = document.getElementById('farm-water');
    if (farmWater) farmWater.value = demoFarm.water;
    const farmCrops = document.getElementById('farm-crops');
    if (farmCrops) farmCrops.value = demoFarm.crops;

    renderFarmAdvisory(demoFarm.soil);
    showToast('Loaded demo farmer data for Ramesh Patel (Anantapur)!');
  }

  // --------------------------------------------------------------------------
  // 10. Academic Modal Attribution
  // --------------------------------------------------------------------------
  function initAcademicModal() {
    const modal = document.getElementById('academic-modal');
    const openBtn = document.getElementById('btn-show-credits');
    const closeBtn = document.getElementById('btn-close-modal');
    const okBtn = document.getElementById('btn-modal-ok');

    if (!modal) return;

    function openModal() {
      modal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    }

    function closeModal() {
      modal.style.display = 'none';
      document.body.style.overflow = '';
    }

    if (openBtn) openBtn.addEventListener('click', openModal);
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (okBtn) okBtn.addEventListener('click', closeModal);

    // Close on outer click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.style.display === 'flex') {
        closeModal();
      }
    });
  }

  // --------------------------------------------------------------------------
  // 10.5. Diagram Lightbox Viewer
  // --------------------------------------------------------------------------
  function initDiagramLightbox() {
    const lightbox = document.getElementById('lightbox-modal');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxDownload = document.getElementById('lightbox-download-link');
    const closeBtn = document.getElementById('btn-close-lightbox');

    if (!lightbox) return;

    function openLightbox(src, caption) {
      lightboxImg.src = src;
      lightboxCaption.textContent = caption || 'Expanded Diagram';
      if (lightboxDownload) {
        lightboxDownload.href = src;
        const filename = src.split('/').pop() || 'diagram.jpg';
        lightboxDownload.setAttribute('download', filename);
      }
      lightbox.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      lightbox.style.display = 'none';
      lightboxImg.src = '';
      document.body.style.overflow = '';
    }

    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox || e.target.id === 'lightbox-img-wrapper') {
        closeLightbox();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.style.display === 'flex') {
        closeLightbox();
      }
    });

    // Expose globally for inline onclick handlers
    window.kisanOpenDiagram = openLightbox;
  }

  // --------------------------------------------------------------------------
  // 11. Application Bootstrap
  // --------------------------------------------------------------------------
  document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initProfileModule();
    initFarmModule();
    initCropCatalog();
    initLedgerModule();
    initDataManagement();
    initAcademicModal();
    initDiagramLightbox();

    // Initial render
    renderDashboard();
    updateCropDatalist();

    console.info('KisanSeva Portal loaded successfully. Offline state active.');
  });

})();
