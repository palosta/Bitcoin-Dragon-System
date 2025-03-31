// ordinals-display.js
// Affichage des ordinals de l'utilisateur et informations associées

// Import du connecteur wallet
import walletConnector from './bitcoin-wallet-connection.js';

class OrdinalsDisplay {
  constructor() {
    this.ordinalsContainer = document.getElementById('ordinals-container');
    this.loadingIndicator = document.getElementById('ordinals-loading');
    this.emptyState = document.getElementById('no-ordinals');
    this.userOrdinals = [];
    this.setupEventListeners();
  }

  // Configuration des écouteurs d'événements
  setupEventListeners() {
    document.addEventListener('ordinalsLoading', () => {
      this.showLoading(true);
    });
    
    document.addEventListener('ordinalsLoaded', (event) => {
      this.userOrdinals = event.detail.ordinals;
      this.renderOrdinals();
      this.showLoading(false);
    });
    
    document.addEventListener('ordinalsError', () => {
      this.showLoading(false);
      this.showError();
    });
    
    document.addEventListener('walletDisconnected', () => {
      this.clearOrdinals();
    });
  }

  // Afficher/masquer l'indicateur de chargement
  showLoading(isLoading) {
    if (this.loadingIndicator) {
      this.loadingIndicator.style.display = isLoading ? 'block' : 'none';
    }
  }

  // Afficher un message d'erreur
  showError() {
    if (this.ordinalsContainer) {
      this.ordinalsContainer.innerHTML = `
        <div class="error-state">
          <h3>Erreur lors du chargement des ordinals</h3>
          <p>Nous n'avons pas pu charger vos ordinals. Veuillez réessayer.</p>
          <button id="retry-load-ordinals">Réessayer</button>
        </div>
      `;
      
      document.getElementById('retry-load-ordinals').addEventListener('click', () => {
        walletConnector.loadUserOrdinals();
      });
    }
  }

  // Effacer les ordinals affichés
  clearOrdinals() {
    this.userOrdinals = [];
    if (this.ordinalsContainer) {
      this.ordinalsContainer.innerHTML = '';
    }
    
    if (this.emptyState) {
      this.emptyState.style.display = 'none';
    }
  }

  // Rendre les ordinals dans le conteneur
  renderOrdinals() {
    if (!this.ordinalsContainer) return;
    
    if (this.userOrdinals.length === 0) {
      if (this.emptyState) {
        this.emptyState.style.display = 'block';
      } else {
        this.ordinalsContainer.innerHTML = `
          <div class="empty-state">
            <h3>Aucun ordinal Bitcoin Dragon trouvé</h3>
            <p>Vous ne possédez pas encore d'ordinals de notre collection.</p>
            <a href="https://market.bitcoin-dragon-system.com" class="market-link">
              Voir le marketplace
            </a>
          </div>
        `;
      }
      return;
    }
    
    // Masquer l'état vide si des ordinals sont disponibles
    if (this.emptyState) {
      this.emptyState.style.display = 'none';
    }
    
    // Mise à jour du conteneur
    this.ordinalsContainer.innerHTML = '';
    
    // Création des cartes d'ordinals
    this.userOrdinals.forEach(ordinal => {
      const card = this.createOrdinalCard(ordinal);
      this.ordinalsContainer.appendChild(card);
    });
    
    // Ajouter des événements pour les actions sur les ordinals
    this.setupOrdinalActions();
  }

  // Créer une carte d'affichage pour un ordinal
  createOrdinalCard(ordinal) {
    const card = document.createElement('div');
    card.className = 'ordinal-card';
    card.dataset.id = ordinal.id || ordinal.inscriptionId || '';
    
    // Déterminer le contenu à afficher
    let contentHtml = '';
    
    // Déterminer le type de contenu et l'afficher en conséquence
    if (ordinal.contentType?.includes('image')) {
      contentHtml = `<img src="${this.getOrdinalContentUrl(ordinal)}" alt="Bitcoin Dragon Ordinal" class="ordinal-image">`;
    } else if (ordinal.contentType?.includes('video')) {
      contentHtml = `
        <video controls class="ordinal-video">
          <source src="${this.getOrdinalContentUrl(ordinal)}" type="${ordinal.contentType}">
          Votre navigateur ne supporte pas la lecture de vidéo.
        </video>
      `;
    } else if (ordinal.contentType?.includes('audio')) {
      contentHtml = `
        <audio controls class="ordinal-audio">
          <source src="${this.getOrdinalContentUrl(ordinal)}" type="${ordinal.contentType}">
          Votre navigateur ne supporte pas la lecture audio.
        </audio>
      `;
    } else {
      // Fallback pour tout autre type de contenu
      contentHtml = `
        <div class="ordinal-text">
          <p>Contenu de type: ${ordinal.contentType || 'Inconnu'}</p>
          <a href="${this.getOrdinalContentUrl(ordinal)}" target="_blank" class="view-link">
            Voir le contenu
          </a>
        </div>
      `;
    }
    
    // Obtenir le nom formaté de l'ordinal
    const name = this.getOrdinalName(ordinal);
    
    // Construire la structure HTML complète de la carte
    card.innerHTML = `
      <div class="ordinal-content">
        ${contentHtml}
      </div>
      <div class="ordinal-info">
        <h3 class="ordinal-name">${name}</h3>
        <div class="ordinal-details">
          <span class="ordinal-number">#${ordinal.number || 'N/A'}</span>
          <span class="ordinal-sat">Sat: ${this.formatSatoshi(ordinal.sat)}</span>
        </div>
        <div class="ordinal-attributes">
          ${this.renderAttributes(ordinal.attributes || [])}
        </div>
        <div class="ordinal-actions">
          <button class="action-button view-details" data-id="${ordinal.id || ordinal.inscriptionId || ''}">
            Détails
          </button>
          <button class="action-button stake-ordinal" data-id="${ordinal.id || ordinal.inscriptionId || ''}">
            Staker
          </button>
        </div>
      </div>
    `;
    
    return card;
  }

  // Obtenir l'URL du contenu de l'ordinal
  getOrdinalContentUrl(ordinal) {
    // Si l'ordinal a une URL directe
    if (ordinal.contentUrl) {
      return ordinal.contentUrl;
    }
    
    // Fallback vers services d'inscription Ordinals
    const inscriptionId = ordinal.id || ordinal.inscriptionId;
    if (inscriptionId) {
      return `https://ordinals.com/content/${inscriptionId}`;
    }
    
    // Placeholder si pas d'URL disponible
    return 'assets/ordinal-placeholder.png';
  }

  // Obtenir le nom formaté de l'ordinal
  getOrdinalName(ordinal) {
    // Récupérer le nom depuis les métadonnées
    const name = ordinal.meta?.name || ordinal.name || 'Bitcoin Dragon';
    
    // Ajouter un numéro si disponible
    if (ordinal.number) {
      return `${name} #${ordinal.number}`;
    }
    
    return name;
  }

  // Formater un nombre de satoshi
  formatSatoshi(sat) {
    if (!sat) return 'N/A';
    
    const satNum = typeof sat === 'number' ? sat : parseInt(sat);
    
    // Formater avec séparateurs de milliers
    return satNum.toLocaleString();
  }

  // Rendre les attributs d'un ordinal
  renderAttributes(attributes) {
    if (!attributes || attributes.length === 0) {
      return '';
    }
    
    let attributesHtml = '<div class="attributes-list">';
    
    attributes.forEach(attr => {
      attributesHtml += `
        <div class="attribute">
          <span class="attribute-name">${attr.trait_type || attr.name}:</span>
          <span class="attribute-value">${attr.value}</span>
        </div>
      `;
    });
    
    attributesHtml += '</div>';
    return attributesHtml;
  }

  // Configurer les actions sur les ordinals (boutons)
  setupOrdinalActions() {
    // Boutons de détails
    const detailButtons = document.querySelectorAll('.view-details');
    detailButtons.forEach(button => {
      button.addEventListener('click', () => {
        const ordinalId = button.dataset.id;
        this.showOrdinalDetails(ordinalId);
      });
    });
    
    // Boutons de staking
    const stakeButtons = document.querySelectorAll('.stake-ordinal');
    stakeButtons.forEach(button => {
      button.addEventListener('click', () => {
        const ordinalId = button.dataset.id;
        // Déclencher le processus de staking (défini dans le module de staking)
        document.dispatchEvent(new CustomEvent('initiateStaking', {
          detail: { ordinalId }
        }));
      });
    });
  }

  // Afficher les détails complets d'un ordinal
  showOrdinalDetails(ordinalId) {
    const ordinal = this.userOrdinals.find(o => (o.id === ordinalId || o.inscriptionId === ordinalId));
    
    if (!ordinal) return;
    
    // Créer une modal pour afficher les détails
    const modal = document.createElement('div');
    modal.className = 'ordinal-modal';
    
    // Déterminer le contenu média à afficher
    let mediaContent = '';
    if (ordinal.contentType?.includes('image')) {
      mediaContent = `<img src="${this.getOrdinalContentUrl(ordinal)}" alt="Bitcoin Dragon Ordinal" class="modal-image">`;
    } else if (ordinal.contentType?.includes('video')) {
      mediaContent = `
        <video controls class="modal-video">
          <source src="${this.getOrdinalContentUrl(ordinal)}" type="${ordinal.contentType}">
          Votre navigateur ne supporte pas la lecture de vidéo.
        </video>
      `;
    } else {
      mediaContent = `
        <div class="modal-fallback">
          <p>Contenu de type: ${ordinal.contentType || 'Inconnu'}</p>
          <a href="${this.getOrdinalContentUrl(ordinal)}" target="_blank" class="view-link">
            Voir le contenu original
          </a>
        </div>
      `;
    }
    
    // Construire les informations détaillées
    const detailsContent = `
      <div class="modal-header">
        <h2>${this.getOrdinalName(ordinal)}</h2>
        <button class="close-modal">&times;</button>
      </div>
      <div class="modal-body">
        <div class="modal-content">
          ${mediaContent}
          <div class="ordinal-full-details">
            <div class="detail-section">
              <h3>Informations</h3>
              <ul class="details-list">
                <li><strong>ID d'inscription:</strong> ${ordinal.id || ordinal.inscriptionId || 'N/A'}</li>
                <li><strong>Numéro:</strong> ${ordinal.number || 'N/A'}</li>
                <li><strong>Satoshi:</strong> ${this.formatSatoshi(ordinal.sat)}</li>
                <li><strong>Date d'inscription:</strong> ${new Date(ordinal.timestamp || Date.now()).toLocaleDateString()}</li>
                <li><strong>Taille:</strong> ${ordinal.contentLength ? this.formatFileSize(ordinal.contentLength) : 'N/A'}</li>
                <li><strong>Type de contenu:</strong> ${ordinal.contentType || 'N/A'}</li>
              </ul>
            </div>
            
            <div class="detail-section">
              <h3>Attributs</h3>
              <div class="full-attributes">
                ${this.renderDetailedAttributes(ordinal.attributes || [])}
              </div>
            </div>
            
            <div class="detail-section">
              <h3>Actions</h3>
              <div class="modal-actions">
                <button class="modal-action-button stake-button" data-id="${ordinal.id || ordinal.inscriptionId}">
                  Staker cet Ordinal
                </button>
                <a href="https://ordinals.com/inscription/${ordinal.id || ordinal.inscriptionId}" target="_blank" class="modal-action-button view-explorer">
                  Voir sur l'explorateur
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    
    modal.innerHTML = detailsContent;
    
    // Ajouter la modal au body
    document.body.appendChild(modal);
    
    // Empêcher le défilement du body
    document.body.style.overflow = 'hidden';
    
    // Fermeture de la modal
    const closeButton = modal.querySelector('.close-modal');
    closeButton.addEventListener('click', () => {
      document.body.removeChild(modal);
      document.body.style.overflow = 'auto';
    });
    
    // Fermeture en cliquant en dehors
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        document.body.removeChild(modal);
        document.body.style.overflow = 'auto';
      }
    });
    
    // Bouton de staking dans la modal
    const stakeButton = modal.querySelector('.stake-button');
    stakeButton.addEventListener('click', () => {
      document.dispatchEvent(new CustomEvent('initiateStaking', {
        detail: { ordinalId: ordinal.id || ordinal.inscriptionId }
      }));
      
      // Fermer la modal après l'initiation du staking
      document.body.removeChild(modal);
      document.body.style.overflow = 'auto';
    });
  }

  // Rendre les attributs détaillés
  renderDetailedAttributes(attributes) {
    if (!attributes || attributes.length === 0) {
      return '<p>Aucun attribut disponible</p>';
    }
    
    let html = '<div class="attributes-grid">';
    
    attributes.forEach(attr => {
      const traitType = attr.trait_type || attr.name || 'Attribut';
      const value = attr.value;
      
      // Obtenir la rareté de l'attribut si disponible
      const rarity = attr.rarity || attr.rarity_percentage || null;
      let rarityHtml = '';
      
      if (rarity !== null) {
        let rarityClass = '';
        if (rarity < 1) rarityClass = 'legendary';
        else if (rarity < 5) rarityClass = 'epic';
        else if (rarity < 15) rarityClass = 'rare';
        else if (rarity < 35) rarityClass = 'uncommon';
        else rarityClass = 'common';
        
        rarityHtml = `<span class="rarity ${rarityClass}">${rarity}%</span>`;
      }
      
      html += `
        <div class="attribute-card">
          <div class="attribute-header">${traitType}</div>
          <div class="attribute-body">
            <span class="attribute-value">${value}</span>
            ${rarityHtml}
          </div>
        </div>
      `;
    });
    
    html += '</div>';
    return html;
  }

  // Formater la taille d'un fichier
  formatFileSize(bytes) {
    if (!bytes) return 'N/A';
    
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Byte';
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
  }

  // Charger manuellement les ordinals
  reloadOrdinals() {
    if (walletConnector.connected) {
      walletConnector.loadUserOrdinals();
    }
  }
}

// Initialiser l'affichage des ordinals au chargement du DOM
document.addEventListener('DOMContentLoaded', () => {
  window.ordinalsDisplay = new OrdinalsDisplay();
});

export default OrdinalsDisplay;