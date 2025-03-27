// Configuration des portefeuilles Bitcoin
const wallets = [
    { 
        name: 'Xverse', 
        id: 'xverse', 
        icon: 'xverse-icon.png',
        connect: async () => {
            try {
                // Logique de connexion pour Xverse
                const accounts = await window.XverseProvider.request({
                    method: 'getAccounts'
                });
                return accounts[0];
            } catch (error) {
                console.error('Xverse connection error:', error);
                return null;
            }
        }
    },
    { 
        name: 'Unisat', 
        id: 'unisat', 
        icon: 'unisat-icon.png',
        connect: async () => {
            try {
                // Logique de connexion pour Unisat
                const accounts = await window.unisat.requestAccounts();
                return accounts[0];
            } catch (error) {
                console.error('Unisat connection error:', error);
                return null;
            }
        }
    },
    { 
        name: 'MagicEden', 
        id: 'magiceden', 
        icon: 'magiceden-icon.png',
        connect: async () => {
            try {
                // Logique de connexion pour MagicEden
                const accounts = await window.magicEden.request({
                    method: 'getAccounts'
                });
                return accounts[0];
            } catch (error) {
                console.error('MagicEden connection error:', error);
                return null;
            }
        }
    },
    { 
        name: 'OKX', 
        id: 'okx', 
        icon: 'okx-icon.png',
        connect: async () => {
            try {
                // Logique de connexion pour OKX
                const accounts = await window.okxwallet.bitcoin.requestAccounts();
                return accounts[0];
            } catch (error) {
                console.error('OKX connection error:', error);
                return null;
            }
        }
    }
];

// Fonction pour créer le popup de connexion
function createWalletPopup() {
    // Créer l'élément du popup
    const popup = document.createElement('div');
    popup.id = 'wallet-connect-popup';
    popup.innerHTML = `
        <div class="wallet-popup-overlay">
            <div class="wallet-popup-content">
                <h2>Connectez votre portefeuille Bitcoin</h2>
                <div class="wallet-list">
                    ${wallets.map(wallet => `
                        <button 
                            class="wallet-option" 
                            data-wallet="${wallet.id}"
                            onclick="connectWallet('${wallet.id}')"
                        >
                            <img src="${wallet.icon}" alt="${wallet.name}">
                            <span>${wallet.name}</span>
                        </button>
                    `).join('')}
                </div>
                <button class="close-popup">Fermer</button>
            </div>
        </div>
    `;

    // Ajouter le popup au body
    document.body.appendChild(popup);

    // Gérer la fermeture du popup
    popup.querySelector('.close-popup').addEventListener('click', () => {
        document.body.removeChild(popup);
    });
}

// Fonction pour connecter un portefeuille
async function connectWallet(walletId) {
    const selectedWallet = wallets.find(w => w.id === walletId);
    
    if (selectedWallet) {
        try {
            const address = await selectedWallet.connect();
            
            if (address) {
                // Masquer le popup
                const popup = document.getElementById('wallet-connect-popup');
                if (popup) {
                    document.body.removeChild(popup);
                }
                
                // Afficher l'adresse en haut à droite
                displayConnectedAddress(address, selectedWallet.name);
            } else {
                alert('Échec de la connexion. Veuillez réessayer.');
            }
        } catch (error) {
            console.error('Wallet connection error:', error);
            alert('Une erreur est survenue lors de la connexion.');
        }
    }
}

// Fonction pour afficher l'adresse connectée
function displayConnectedAddress(address, walletName) {
    // Supprimer l'affichage précédent s'il existe
    const existingDisplay = document.getElementById('connected-wallet-display');
    if (existingDisplay) {
        existingDisplay.remove();
    }

    // Créer un nouvel élément pour afficher l'adresse
    const addressDisplay = document.createElement('div');
    addressDisplay.id = 'connected-wallet-display';
    addressDisplay.innerHTML = `
        <div class="wallet-address-container">
            <span class="wallet-name">${walletName}</span>
            <span class="wallet-address">${shortenAddress(address)}</span>
            <button class="disconnect-wallet">Déconnecter</button>
        </div>
    `;

    // Ajouter au corps du document
    document.body.appendChild(addressDisplay);

    // Ajouter un gestionnaire de déconnexion
    addressDisplay.querySelector('.disconnect-wallet').addEventListener('click', disconnectWallet);
}

// Fonction pour raccourcir l'adresse
function shortenAddress(address) {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
}

// Fonction de déconnexion
function disconnectWallet() {
    const addressDisplay = document.getElementById('connected-wallet-display');
    if (addressDisplay) {
        addressDisplay.remove();
    }
}

// Ajouter un écouteur d'événements au bouton de connexion
document.getElementById('connect-wallet-btn').addEventListener('click', createWalletPopup);

// Ajouter les styles au document
const styleElement = document.createElement('style');
styleElement.textContent = styles;
document.head.appendChild(styleElement);
