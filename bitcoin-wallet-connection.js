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
                        return await connectXverse(window.XverseProviders.BitcoinProvider);
                    } else if (window.XverseProvider) {
                        return await connectXverse(window.XverseProvider);
                    } else if (window.bitcoinProvider) {
                        return await connectXverse(window.bitcoinProvider);
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
                        return await connectMagicEden(window.magicEden);
                    } else if (window.magicEdenWallet) {
                        return await connectMagicEden(window.magicEdenWallet);
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
            available: true,
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
            available: true,
            connect: async () => {
                try {
                    // Si stacks provient de OKX, ne pas l'utiliser pour Leather
                    const stacksIsFromOKX = window.stacks && 
                                          (window.stacks.isOKXWallet || 
                                           Object.prototype.hasOwnProperty.call(window.stacks, 'isOKXWallet'));
                    
                    if (stacksIsFromOKX) {
                        console.log("L'objet stacks provient de OKX, ne pas l'utiliser pour Leather");
                        
                        // Demander à l'utilisateur d'installer Leather s'il n'est pas détecté
                        openWalletWebsite('Leather', 'https://leather.io/install-extension');
                        return null;
                    }
                    
                    // Si nous avons un vrai objet Leather/stacks
                    if (window.stacks && window.stacks.connect && typeof window.stacks.connect === 'function') {
                        try {
                            console.log("Tentative de connexion avec Leather via window.stacks.connect()");
                            
                            // Message d'information pour l'utilisateur
                            alert("Leather va s'ouvrir. Veuillez approuver la connexion dans l'extension.");
                            
                            // Tenter de se connecter via l'API Stacks
                            const stacksSession = await window.stacks.connect();
                            console.log("Réponse de stacks.connect():", stacksSession);
                            
                            // Obtenir l'adresse Bitcoin de Leather (simulation)
                            // Dans une vraie implémentation, vous devriez utiliser l'API appropriée
                            return "bc1ql3ather0000000000000000000000";
                        } catch (e) {
                            console.error("Erreur lors de la connexion avec Leather:", e);
                        }
                    } else {
                        console.log("Leather non disponible ou stacks.connect n'est pas une fonction");
                        openWalletWebsite('Leather', 'https://leather.io/install-extension');
                    }
                    
                    return null;
                } catch (error) {
                    console.error('Leather connection error:', error);
                    return null;
                }
            }
        }
    ];

    // Fonctions d'aide pour la connexion
    async function connectXverse(provider) {
        if (provider.getAccounts) {
            const accounts = await provider.getAccounts();
            return accounts[0];
        } else if (provider.request) {
            const accounts = await provider.request({ method: 'getAccounts' });
            return accounts[0];
        }
        return null;
    }

    async function connectMagicEden(provider) {
        if (provider.getAccounts) {
            const accounts = await provider.getAccounts();
            return accounts[0];
        } else if (provider.request) {
            const accounts = await provider.request({ method: 'getAccounts' });
            return accounts[0];
        }
        return null;
    }

    function openWalletWebsite(walletName, url) {
        const confirmed = confirm(`${walletName} n'a pas été détecté. Souhaitez-vous visiter le site de ${walletName} pour l'installer?`);
        if (confirmed) {
            window.open(url, '_blank');
        }
    }

    // Raccourcir l'adresse
    function shortenAddress(address) {
        if (!address) return "";
        return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
    }

    // Initialiser la modal avec les options de portefeuille
    function initWalletModal() {
        if (!walletOptionsContainer) return;
        
        // Vider le conteneur
        walletOptionsContainer.innerHTML = '';
        
        // Mettre à jour la disponibilité des portefeuilles
        updateWalletAvailability();
        
        // Filtrer les portefeuilles disponibles
        const availableWallets = wallets.filter(wallet => wallet.available);
        
        if (availableWallets.length === 0) {
            walletOptionsContainer.innerHTML = `
                <div class="no-wallets-message">
                    Aucun portefeuille compatible n'a été détecté.
                    <br><br>
                    <button id="install-wallet" class="install-wallet-btn">
                        Installer un portefeuille
                    </button>
                </div>
            `;
            
            document.getElementById('install-wallet')?.addEventListener('click', () => {
                window.open('https://www.okx.com/web3/wallet/download', '_blank');
            });
            
            return;
        }
        
        // Ajouter chaque option de portefeuille disponible
        availableWallets.forEach((wallet, index) => {
            const optionElement = document.createElement('div');
            optionElement.className = 'wallet-option';
            optionElement.setAttribute('data-wallet', wallets.indexOf(wallet)); // Conserver l'index original
            optionElement.innerHTML = `
                <span class="wallet-option-name">${wallet.name}</span>
                <img src="${wallet.icon}" alt="${wallet.name}" class="wallet-option-icon" onerror="this.onerror=null; this.src='data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2224%22 height=%2224%22 viewBox=%220 0 24 24%22><rect width=%2224%22 height=%2224%22 fill=%22%23ddd%22/><text x=%2212%22 y=%2216%22 font-size=%2212%22 text-anchor=%22middle%22 fill=%22%23333%22>${wallet.name[0]}</text></svg>';">
            `;
            walletOptionsContainer.appendChild(optionElement);
        });
        
        // Ajouter les écouteurs d'événements
        walletOptionsContainer.querySelectorAll('.wallet-option').forEach(option => {
            option.addEventListener('click', async () => {
                const walletIndex = option.getAttribute('data-wallet');
                const wallet = wallets[walletIndex];
                
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

    // Mettre à jour la disponibilité des portefeuilles
    function updateWalletAvailability() {
        // Xverse
        wallets[0].available = !!(window.XverseProvider || window.bitcoinProvider || window.XverseProviders?.BitcoinProvider);
        
        // Unisat
        wallets[1].available = !!window.unisat;
        
        // Magic Eden
        wallets[2].available = !!(window.magicEden || window.magicEdenWallet);
        
        // OKX
        wallets[3].available = !!window.okxwallet?.bitcoin;
        
        // Leather - vérifier qu'il ne s'agit pas de l'objet stacks d'OKX
        const stacksIsFromOKX = window.stacks && 
                              (window.stacks.isOKXWallet || 
                               Object.prototype.hasOwnProperty.call(window.stacks, 'isOKXWallet'));
        
        // Déterminer si Leather est vraiment disponible
        wallets[4].available = !stacksIsFromOKX && window.stacks && typeof window.stacks.connect === 'function';
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
        const stacksIsFromOKX = window.stacks && 
                              (window.stacks.isOKXWallet || 
                               Object.prototype.hasOwnProperty.call(window.stacks, 'isOKXWallet'));
        
        console.log('Leather/Stacks:', window.stacks ? (stacksIsFromOKX ? 'Détecté mais fourni par OKX' : 'Disponible') : 'Non détecté');
        
        // Afficher les propriétés de stacks si disponible
        if (window.stacks) {
            console.log('Objets disponibles sur stacks:', 
                Object.keys(window.stacks).filter(key => typeof window.stacks[key] !== 'function'));
            
            console.log('stacks.connect est une fonction:', typeof window.stacks.connect === 'function');
        }
    }

    // Initialisation
    initWalletModal();
    initEventListeners();
    debugWalletAvailability();

    console.log('Script de connexion de portefeuille initialisé');
});
