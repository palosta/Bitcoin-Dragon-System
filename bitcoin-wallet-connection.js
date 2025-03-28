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

    // Configuration des portefeuilles
    const wallets = [
        { 
            name: 'Xverse',
            icon: "assets/xverse.png",
            available: false,
            connect: async () => {
                try {
                    if (window.XverseProviders?.BitcoinProvider) {
                        const accounts = await window.XverseProviders.BitcoinProvider.request({ method: 'getAccounts' });
                        return accounts[0];
                    } else if (window.XverseProvider) {
                        const accounts = await window.XverseProvider.request({ method: 'getAccounts' });
                        return accounts[0]; 
                    } else if (window.bitcoinProvider) {
                        const accounts = await window.bitcoinProvider.request({ method: 'getAccounts' });
                        return accounts[0];
                    } else {
                        openWalletWebsite('Xverse', 'https://www.xverse.app/download');
                        return null;
                    }
                } catch (error) {
                    console.error('Xverse connection error:', error);
                    return null;
                }
            }
        },
        { 
            name: 'Unisat',
            icon: "assets/unisat.png",
            available: false,
            connect: async () => {
                try {
                    if (!window.unisat) {
                        openWalletWebsite('Unisat', 'https://unisat.io/download');
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
            available: false,
            connect: async () => {
                try {
                    if (window.magicEden) {
                        const accounts = await window.magicEden.request({ method: 'getAccounts' });
                        return accounts[0];
                    } else if (window.magicEdenWallet) {
                        const accounts = await window.magicEdenWallet.request({ method: 'getAccounts' });
                        return accounts[0];
                    } else {
                        openWalletWebsite('Magic Eden', 'https://wallet.magiceden.io/download');
                        return null;
                    }
                } catch (error) {
                    console.error('Magic Eden connection error:', error);
                    return null;
                }
            }
        },
        { 
            name: 'OKX',
            icon: "assets/okx.png",
            available: false,
            connect: async () => {
                try {
                    if (window.okxwallet?.bitcoin) {
                        const accounts = await window.okxwallet.bitcoin.requestAccounts();
                        return accounts[0];
                    } else {
                        openWalletWebsite('OKX', 'https://www.okx.com/web3/wallet/download');
                        return null;
                    }
                } catch (error) {
                    console.error('OKX connection error:', error);
                    return null;
                }
            }
        },
        { 
            name: 'Leather',
            icon: "assets/leather.png",
            available: false,
            installOnly: true, // Toujours proposer uniquement l'installation
            connect: async () => {
                openWalletWebsite('Leather', 'https://leather.io/install-extension');
                return null;
            }
        }
    ];

    // Ouvrir le site web du portefeuille pour l'installation
    function openWalletWebsite(walletName, url) {
        const confirmed = confirm(`${walletName} n'est pas disponible ou nécessite une configuration. Souhaitez-vous visiter le site de ${walletName}?`);
        if (confirmed) {
            window.open(url, '_blank');
        }
    }

    // Raccourcir l'adresse
    function shortenAddress(address) {
        if (!address) return "";
        return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
    }

    // Mettre à jour la disponibilité des portefeuilles
    function updateWalletAvailability() {
        // Vérifier si Stacks est fourni par OKX (il y a une propriété isOKXWallet)
        const stacksIsFromOKX = window.stacks && (
            window.stacks.isOKXWallet === true || 
            Object.prototype.hasOwnProperty.call(window.stacks, 'isOKXWallet')
        );
        
        // Xverse
        wallets[0].available = !!(window.XverseProviders?.BitcoinProvider || window.XverseProvider || window.bitcoinProvider);
        
        // Unisat
        wallets[1].available = !!window.unisat;
        
        // Magic Eden
        wallets[2].available = !!(window.magicEden || window.magicEdenWallet);
        
        // OKX
        wallets[3].available = !!window.okxwallet?.bitcoin;
        
        // Leather - TOUJOURS le marquer comme non disponible pour installation seulement
        wallets[4].available = false; // Pour forcer l'installation au lieu de la connexion
        
        // Log des résultats de détection
        console.log("Portefeuilles détectés:");
        wallets.forEach(wallet => {
            console.log(`- ${wallet.name}: ${wallet.available ? 'Disponible' : 'Non disponible'}`);
        });
        console.log("L'objet stacks provient d'OKX:", stacksIsFromOKX);
    }

    // Initialiser la modal avec les options de portefeuille
    function initWalletModal() {
        if (!walletOptionsContainer) return;
        
        // Vider le conteneur
        walletOptionsContainer.innerHTML = '';
        
        // Mettre à jour la disponibilité des portefeuilles
        updateWalletAvailability();
        
        // Ajouter chaque option de portefeuille
        wallets.forEach((wallet, index) => {
            const optionElement = document.createElement('div');
            optionElement.className = wallet.available ? 'wallet-option' : 'wallet-option wallet-option-install';
            optionElement.setAttribute('data-wallet', index);
            optionElement.innerHTML = `
                <span class="wallet-option-name">${wallet.name} ${!wallet.available ? '(Installation)' : ''}</span>
                <img src="${wallet.icon}" alt="${wallet.name}" class="wallet-option-icon" onerror="this.onerror=null; this.src='data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2224%22 height=%2224%22 viewBox=%220 0 24 24%22><rect width=%2224%22 height=%2224%22 fill=%22%23ddd%22/><text x=%2212%22 y=%2216%22 font-size=%2212%22 text-anchor=%22middle%22 fill=%22%23333%22>${wallet.name[0]}</text></svg>';">
            `;
            walletOptionsContainer.appendChild(optionElement);
        });
        
        // Ajouter les écouteurs d'événements
        walletOptionsContainer.querySelectorAll('.wallet-option').forEach(option => {
            option.addEventListener('click', async () => {
                const walletIndex = option.getAttribute('data-wallet');
                const wallet = wallets[walletIndex];
                
                // Si le portefeuille n'est pas disponible ou est marqué pour installation seulement
                if (!wallet.available || wallet.installOnly) {
                    const walletUrls = {
                        'Xverse': 'https://www.xverse.app/download',
                        'Unisat': 'https://unisat.io/download',
                        'Magic Eden': 'https://wallet.magiceden.io/download',
                        'OKX': 'https://www.okx.com/web3/wallet/download',
                        'Leather': 'https://leather.io/install-extension'
                    };
                    
                    openWalletWebsite(wallet.name, walletUrls[wallet.name]);
                    return;
                }
                
                console.log(`Tentative de connexion à ${wallet.name}...`);
                
                try {
                    const address = await wallet.connect();
                    if (address) {
                        if (walletAddressDisplay) {
                            walletAddressDisplay.textContent = `Connecté avec ${wallet.name}: ${shortenAddress(address)}`;
                        }
                        connectButton.textContent = 'Connecté';
                        connectButton.classList.add('connected');
                        closeWalletModal();
                    }
                } catch (error) {
                    console.error(`Erreur de connexion à ${wallet.name}:`, error);
                    alert(`Une erreur est survenue lors de la connexion à ${wallet.name}.`);
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

    // Débogage des portefeuilles disponibles
    function debugWalletAvailability() {
        console.log('Débogage des portefeuilles Bitcoin :');
        
        // Xverse
        console.log('Xverse:', window.XverseProvider || window.bitcoinProvider ? 'Disponible' : 'Non détecté');
        
        // Unisat
        console.log('Unisat:', window.unisat ? 'Disponible' : 'Non détecté');
        
        // Magic Eden
        console.log('Magic Eden:', window.magicEden || window.magicEdenWallet ? 'Disponible' : 'Non détecté');
        
        // OKX
        console.log('OKX:', window.okxwallet?.bitcoin ? 'Disponible' : 'Non détecté');
        
        // Leather/Stacks
        console.log('Stacks API:', window.stacks ? 'Détecté' : 'Non détecté');
        if (window.stacks) {
            console.log('Propriétés de stacks:', Object.keys(window.stacks));
            console.log('stacks.isOKXWallet:', window.stacks.isOKXWallet);
        }
    }

    // Ajouter un style CSS pour les options d'installation
    const style = document.createElement('style');
    style.textContent = `
        .wallet-option-install {
            opacity: 0.7;
            background-color: #2a2a3a !important;
        }
        .wallet-option-install:hover {
            opacity: 1;
        }
    `;
    document.head.appendChild(style);

    // Initialisation
    initWalletModal();
    initEventListeners();
    debugWalletAvailability();

    console.log('Script de connexion de portefeuille initialisé');
});
