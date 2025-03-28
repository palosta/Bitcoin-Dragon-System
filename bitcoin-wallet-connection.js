document.addEventListener('DOMContentLoaded', () => {
    const connectButton = document.getElementById('connect-wallet-btn');
    const walletAddressDisplay = document.getElementById('wallet-address');
    const walletModal = document.getElementById('wallet-modal');
    const closeModalButton = document.querySelector('.close-modal');
    const walletOptionsContainer = document.querySelector('.wallet-options');

    if (!connectButton) {
        console.error('Bouton de connexion non trouvé');
        return;
    }

    // Configuration des portefeuilles avec leurs icônes
    const wallets = [
        { 
            name: 'Xverse',
            icon: "assets/xverse.png",
            iconType: "png",
            connect: async () => {
                try {
                    const provider = window.XverseProvider || window.bitcoinProvider;
                    if (!provider) {
                        console.log('Xverse wallet not detected');
                        return null;
                    }
                    const accounts = await provider.request({
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
            icon: "assets/unisat.png",
            iconType: "png",
            connect: async () => {
                try {
                    if (!window.unisat) {
                        console.log('Unisat wallet not detected');
                        return null;
                    }
                    const accounts = await window.unisat.requestAccounts();
                    return accounts[0];
                } catch (error) {
                    console.error('Unisat connection error:', error);
                    return null;
                }
            }
        },
        { 
            name: 'Magic Eden',
            icon: "assets/magic-eden.png",
            iconType: "png",
            connect: async () => {
                try {
                    const provider = window.magicEden || window.magicEdenWallet;
                    if (!provider) {
                        console.log('MagicEden wallet not detected');
                        return null;
                    }
                    const accounts = await provider.request({
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
            icon: "assets/okx.png",
            iconType: "png",
            connect: async () => {
                try {
                    const provider = window.okxwallet?.bitcoin || window.bitcoin?.okx;
                    if (!provider) {
                        console.log('OKX wallet not detected');
                        return null;
                    }
                    const accounts = await provider.requestAccounts();
                    return accounts[0];
                } catch (error) {
                    console.error('OKX connection error:', error);
                    return null;
                }
            }
        },
        { 
            name: 'Leather',
            icon: "assets/leather.png",
            iconType: "png",
            connect: async () => {
                try {
                    const provider = window.leather || window.leatherProvider;
                    if (!provider) {
                        console.log('Leather wallet not detected');
                        return null;
                    }
                    const accounts = await provider.request({
                        method: 'getAccounts'
                    });
                    return accounts[0];
                } catch (error) {
                    console.error('Leather connection error:', error);
                    return null;
                }
            }
        }
    ];

    // Fonction de débogage pour vérifier les objets globaux
    function debugWalletAvailability() {
        console.log('Débogage des portefeuilles Bitcoin :');
        console.log('Xverse:', window.XverseProvider || window.bitcoinProvider ? 'Disponible' : 'Non détecté');
        console.log('Unisat:', window.unisat ? 'Disponible' : 'Non détecté');
        console.log('MagicEden:', window.magicEden || window.magicEdenWallet ? 'Disponible' : 'Non détecté');
        console.log('OKX:', window.okxwallet?.bitcoin || window.bitcoin?.okx ? 'Disponible' : 'Non détecté');
        console.log('Leather:', window.leather || window.leatherProvider ? 'Disponible' : 'Non détecté');
    }

    // Raccourcir l'adresse
    function shortenAddress(address) {
        return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
    }

    // Initialiser la modal avec les options de portefeuille
    function initWalletModal() {
        if (!walletOptionsContainer) return;
        
        // Vider le conteneur
        walletOptionsContainer.innerHTML = '';
        
        // Ajouter chaque option de portefeuille
        wallets.forEach((wallet, index) => {
            const optionElement = document.createElement('div');
            optionElement.className = 'wallet-option';
            optionElement.setAttribute('data-wallet', index);
            optionElement.innerHTML = `
                <span class="wallet-option-name">${wallet.name}</span>
                <img src="${wallet.icon}" alt="${wallet.name}" class="wallet-option-icon">
            `;
            walletOptionsContainer.appendChild(optionElement);
        });
        
        // Ajouter les écouteurs d'événements
        walletOptionsContainer.querySelectorAll('.wallet-option').forEach(option => {
            option.addEventListener('click', async () => {
                const walletIndex = option.getAttribute('data-wallet');
                const wallet = wallets[walletIndex];
                
                try {
                    const address = await wallet.connect();
                    if (address) {
                        if (walletAddressDisplay) {
                            walletAddressDisplay.textContent = `Connecté avec ${wallet.name}: ${shortenAddress(address)}`;
                        }
                        // Changer l'apparence du bouton
                        connectButton.textContent = 'Connecté';
                        connectButton.classList.add('connected');
                        closeWalletModal();
                    } else {
                        alert('Échec de la connexion. Vérifiez que le portefeuille est installé.');
                    }
                } catch (error) {
                    console.error('Erreur de connexion:', error);
                    alert('Une erreur est survenue lors de la connexion.');
                }
            });
        });
    }

    // Ouvrir la modal de portefeuille
    function openWalletModal() {
        if (walletModal) {
            walletModal.style.display = 'flex';
        }
    }

    // Fermer la modal de portefeuille
    function closeWalletModal() {
        if (walletModal) {
            walletModal.style.display = 'none';
        }
    }

    // Initialisation des écouteurs d'événements
    function initEventListeners() {
        // Ouvrir la modal au clic sur le bouton de connexion
        connectButton.addEventListener('click', openWalletModal);
        
        // Fermer la modal au clic sur le bouton de fermeture
        if (closeModalButton) {
            closeModalButton.addEventListener('click', closeWalletModal);
        }
        
        // Fermer la modal au clic à l'extérieur
        if (walletModal) {
            walletModal.addEventListener('click', (event) => {
                if (event.target === walletModal) {
                    closeWalletModal();
                }
            });
        }
    }

    // Initialisation
    initWalletModal();
    initEventListeners();
    debugWalletAvailability();

    console.log('Script de connexion de portefeuille initialisé');
});
