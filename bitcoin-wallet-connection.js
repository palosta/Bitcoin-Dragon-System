// bitcoin-wallet-connection.js
// Code pour la connexion au wallet Bitcoin via différentes méthodes

// Options de connexion disponibles
const walletOptions = {
  unisat: { name: 'Unisat', installed: false },
  xverse: { name: 'Xverse', installed: false },
  leather: { name: 'Leather', installed: false },
  magiceden: { name: 'Magic Eden', installed: false },
  okx: { name: 'OKX', installed: false }
};

// Classe principale de gestion du wallet
class BitcoinWalletConnector {
  constructor() {
    this.connected = false;
    this.walletAddress = null;
    this.walletProvider = null;
    this.checkWalletInstallations();
  }

  // Vérifier quels wallets sont installés
  checkWalletInstallations() {
    // Vérification Unisat
    if (typeof window.unisat !== 'undefined') {
      walletOptions.unisat.installed = true;
    }
    
    // Vérification Xverse
    if (typeof window.xverse !== 'undefined') {
      walletOptions.xverse.installed = true;
    }
    
    // Vérification Leather (anciennement Nami)
    if (typeof window.leather !== 'undefined') {
      walletOptions.leather.installed = true;
    }
    
    // Vérification Magic Eden
    if (typeof window.magicEden !== 'undefined') {
      walletOptions.magiceden.installed = true;
    }
    
    // Vérification OKX Wallet
    if (typeof window.okxwallet !== 'undefined') {
      walletOptions.okx.installed = true;
    }
    
    this.updateWalletUI();
  }

  // Mise à jour de l'interface utilisateur pour afficher les options de wallet
  updateWalletUI() {
    const walletContainer = document.getElementById('wallet-options');
    if (!walletContainer) return;
    
    walletContainer.innerHTML = '';
    
    Object.keys(walletOptions).forEach(key => {
      const wallet = walletOptions[key];
      if (wallet.installed) {
        const button = document.createElement('button');
        button.className = 'wallet-button';
        button.innerText = `Connecter ${wallet.name}`;
        button.onclick = () => this.connectWallet(key);
        walletContainer.appendChild(button);
      } else {
        const link = document.createElement('a');
        link.className = 'wallet-link';
        link.innerText = `Installer ${wallet.name}`;
        
        // Définir les URLs d'installation appropriées
        if (key === 'unisat') {
          link.href = 'https://unisat.io/download';
        } else if (key === 'xverse') {
          link.href = 'https://www.xverse.app/download';
        } else if (key === 'leather') {
          link.href = 'https://leather.io/download';
        } else if (key === 'magiceden') {
          link.href = 'https://wallet.magiceden.io/download';
        } else if (key === 'okx') {
          link.href = 'https://www.okx.com/web3/wallet/download';
        }
        
        link.target = '_blank';
        walletContainer.appendChild(link);
      }
    });
  }

  // Connexion au wallet sélectionné
  async connectWallet(walletType) {
    try {
      switch (walletType) {
        case 'unisat':
          await this.connectUnisat();
          break;
        case 'xverse':
          await this.connectXverse();
          break;
        case 'leather':
          await this.connectLeather();
          break;
        case 'magiceden':
          await this.connectMagicEden();
          break;
        case 'okx':
          await this.connectOKX();
          break;
        default:
          throw new Error('Type de wallet non supporté');
      }
      
      // Sauvegarder la préférence de wallet
      localStorage.setItem('preferredWallet', walletType);
      
      this.updateConnectedState();
    } catch (error) {
      console.error('Erreur de connexion:', error);
      this.showError(`Erreur de connexion: ${error.message}`);
    }
  }

  // Connexion spécifique à Unisat
  async connectUnisat() {
    if (!walletOptions.unisat.installed) {
      this.showError('Unisat wallet n\'est pas installé');
      return;
    }
    
    try {
      const accounts = await window.unisat.requestAccounts();
      this.walletAddress = accounts[0];
      this.walletProvider = 'unisat';
      this.connected = true;
    } catch (error) {
      throw new Error(`Unisat: ${error.message}`);
    }
  }

  // Connexion spécifique à Xverse
  async connectXverse() {
    if (!walletOptions.xverse.installed) {
      this.showError('Xverse wallet n\'est pas installé');
      return;
    }
    
    try {
      const accounts = await window.xverse.bitcoin.connect();
      this.walletAddress = accounts.addresses[0].address;
      this.walletProvider = 'xverse';
      this.connected = true;
    } catch (error) {
      throw new Error(`Xverse: ${error.message}`);
    }
  }

  // Connexion spécifique à Leather
  async connectLeather() {
    if (!walletOptions.leather.installed) {
      this.showError('Leather wallet n\'est pas installé');
      return;
    }
    
    try {
      const accounts = await window.leather.enable();
      this.walletAddress = accounts[0];
      this.walletProvider = 'leather';
      this.connected = true;
    } catch (error) {
      throw new Error(`Leather: ${error.message}`);
    }
  }
  
  // Connexion spécifique à Magic Eden
  async connectMagicEden() {
    if (!walletOptions.magiceden.installed) {
      this.showError('Magic Eden wallet n\'est pas installé');
      return;
    }
    
    try {
      // Spécifique à l'API Magic Eden
      const accounts = await window.magicEden.bitcoin.connect();
      this.walletAddress = accounts.address || accounts[0];
      this.walletProvider = 'magiceden';
      this.connected = true;
    } catch (error) {
      throw new Error(`Magic Eden: ${error.message}`);
    }
  }
  
  // Connexion spécifique à OKX
  async connectOKX() {
    if (!walletOptions.okx.installed) {
      this.showError('OKX wallet n\'est pas installé');
      return;
    }
    
    try {
      // Spécifique à l'API OKX Wallet
      const accounts = await window.okxwallet.bitcoin.connect();
      this.walletAddress = accounts.address || accounts[0];
      this.walletProvider = 'okx';
      this.connected = true;
    } catch (error) {
      throw new Error(`OKX: ${error.message}`);
    }
  }

  // Déconnexion du wallet
  disconnectWallet() {
    this.connected = false;
    this.walletAddress = null;
    this.walletProvider = null;
    this.updateConnectedState();
    localStorage.removeItem('preferredWallet');
  }

  // Mettre à jour l'interface après connexion/déconnexion
  updateConnectedState() {
    const connectionStatus = document.getElementById('connection-status');
    const walletAddress = document.getElementById('wallet-address');
    const connectButton = document.getElementById('connect-button');
    const disconnectButton = document.getElementById('disconnect-button');
    const walletContainer = document.getElementById('wallet-options');
    
    if (this.connected) {
      if (connectionStatus) connectionStatus.innerHTML = `<span class="connected">Connecté via ${walletOptions[this.walletProvider].name}</span>`;
      if (walletAddress) walletAddress.textContent = this.formatAddress(this.walletAddress);
      if (connectButton) connectButton.style.display = 'none';
      if (disconnectButton) disconnectButton.style.display = 'block';
      if (walletContainer) walletContainer.style.display = 'none';
      
      // Déclencher l'événement de connexion
      document.dispatchEvent(new CustomEvent('walletConnected', {
        detail: {
          address: this.walletAddress,
          provider: this.walletProvider
        }
      }));
      
      // Charger les ordinals après connexion
      this.loadUserOrdinals();
    } else {
      if (connectionStatus) connectionStatus.innerHTML = '<span class="disconnected">Non connecté</span>';
      if (walletAddress) walletAddress.textContent = '';
      if (connectButton) connectButton.style.display = 'block';
      if (disconnectButton) disconnectButton.style.display = 'none';
      if (walletContainer) walletContainer.style.display = 'block';
      
      // Déclencher l'événement de déconnexion
      document.dispatchEvent(new CustomEvent('walletDisconnected'));
    }
  }

  // Formater l'adresse pour l'affichage (abréger le milieu)
  formatAddress(address) {
    if (!address) return '';
    return address.slice(0, 6) + '...' + address.slice(-6);
  }

  // Charger les ordinals de l'utilisateur connecté
  async loadUserOrdinals() {
    if (!this.connected || !this.walletAddress) return;
    
    // Déclencher un événement pour notifier que le chargement des ordinals a commencé
    document.dispatchEvent(new CustomEvent('ordinalsLoading'));
    
    try {
      let ordinals = [];
      
      // Logique dépendante du provider
      switch (this.walletProvider) {
        case 'unisat':
          const unisatOrdinals = await window.unisat.getOrdinals();
          ordinals = unisatOrdinals;
          break;
          
        case 'xverse':
          // Implémentation spécifique à Xverse
          // Remarque: Adapter selon l'API Xverse actuelle
          break;
          
        case 'leather':
          // Implémentation spécifique à Leather
          // Remarque: Adapter selon l'API Leather actuelle
          break;
          
        case 'magiceden':
          // Implémentation spécifique à Magic Eden
          try {
            const magicEdenOrdinals = await window.magicEden.bitcoin.getOrdinals();
            ordinals = magicEdenOrdinals;
          } catch (error) {
            console.error('Erreur lors du chargement des ordinals Magic Eden:', error);
          }
          break;
          
        case 'okx':
          // Implémentation spécifique à OKX
          try {
            const okxOrdinals = await window.okxwallet.bitcoin.getInscriptions();
            ordinals = okxOrdinals;
          } catch (error) {
            console.error('Erreur lors du chargement des ordinals OKX:', error);
          }
          break;
      }
      
      // Filtrer pour ne garder que les ordinals de la collection Bitcoin Dragon System
      // Note: Ceci est un exemple. Vous devrez adapter en fonction de vos identifiants de collection.
      const bitcoinDragonOrdinals = ordinals.filter(ordinal => 
        ordinal.content?.includes('Bitcoin Dragon System') || 
        ordinal.meta?.name?.includes('Bitcoin Dragon')
      );
      
      // Déclencher un événement avec les ordinals chargés
      document.dispatchEvent(new CustomEvent('ordinalsLoaded', {
        detail: {
          ordinals: bitcoinDragonOrdinals
        }
      }));
    } catch (error) {
      console.error('Erreur lors du chargement des ordinals:', error);
      this.showError(`Erreur lors du chargement des ordinals: ${error.message}`);
      
      // Déclencher un événement d'erreur
      document.dispatchEvent(new CustomEvent('ordinalsError', {
        detail: {
          error: error.message
        }
      }));
    }
  }

  // Afficher une erreur à l'utilisateur
  showError(message) {
    const errorContainer = document.getElementById('error-message');
    if (errorContainer) {
      errorContainer.textContent = message;
      errorContainer.style.display = 'block';
      
      // Cacher le message d'erreur après 5 secondes
      setTimeout(() => {
        errorContainer.style.display = 'none';
      }, 5000);
    } else {
      // Fallback si le conteneur d'erreur n'existe pas
      alert(message);
    }
  }

  // Essayer de se reconnecter avec le wallet précédemment utilisé
  async tryReconnect() {
    const preferredWallet = localStorage.getItem('preferredWallet');
    if (preferredWallet) {
      try {
        await this.connectWallet(preferredWallet);
      } catch (error) {
        console.error('Reconnexion automatique échouée:', error);
        // Ne pas afficher d'erreur pour ne pas perturber l'utilisateur
      }
    }
  }
}

// Initialiser la connexion wallet
const walletConnector = new BitcoinWalletConnector();

// Essayer de se reconnecter au démarrage
document.addEventListener('DOMContentLoaded', () => {
  walletConnector.tryReconnect();
  
  // Attacher les événements aux boutons existants
  const connectButton = document.getElementById('connect-button');
  if (connectButton) {
    connectButton.addEventListener('click', () => {
      const walletOptions = document.getElementById('wallet-options');
      if (walletOptions) {
        walletOptions.style.display = walletOptions.style.display === 'none' ? 'block' : 'none';
      }
    });
  }
  
  const disconnectButton = document.getElementById('disconnect-button');
  if (disconnectButton) {
    disconnectButton.addEventListener('click', () => {
      walletConnector.disconnectWallet();
    });
  }
});

// Exporter la classe pour l'utiliser dans d'autres modules
export default walletConnector;