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
            connect: async () => {
                // Leather fonctionne comme une extension Stacks, pas Bitcoin directement
                try {
                    // Vérifier uniquement les objets spécifiques à Leather
                    // Ignorer stacks s'il est lié à OKX ou à un autre portefeuille
                    if (window.stacks && !window.StacksProvider && !window.okxwallet) {
                        console.log("Tentative de connexion Leather via Stacks API");
                        
                        try {
                            // IMPORTANT: Ouvrir l'extension Leather explicitement
                            const openLeather = confirm("Ouvrir Leather pour se connecter? (Cliquez sur Annuler si l'extension est déjà ouverte)");
                            if (openLeather) {
                                window.open("chrome-extension://ldinpeekobnhjjdofggfgjlcehhmanlj/index.html", "_blank");
                                // Attendre que l'utilisateur se connecte manuellement
                                alert("Veuillez vous connecter via l'extension Leather qui vient de s'ouvrir, puis revenez ici et cliquez sur OK.");
                            }
                            
                            // Utiliser une adresse de test pour Leather
                            // Dans une implémentation réelle, l'utilisateur fournirait manuellement son adresse
                            return "bc1qleather000000000000000000000000test";
                        } catch (e) {
                            console.error("Erreur lors de la connexion Stacks/Leather:", e);
                        }
                    }
                    
                    // Si aucune des méthodes ne fonctionne, proposer d'installer Leather
                    openWalletWebsite('Leather', 'https://leather.io/install-extension');
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
        
        // Ajouter chaque option de portefeuille
        wallets.forEach((wallet, index) => {
            const optionElement = document.createElement('div');
            optionElement.className = 'wallet-option';
            optionElement.setAttribute('data-wallet', index);
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
        
        // Liste de tous les objets window pouvant être des portefeuilles
        const walletObjects = {};
        
        // Xverse
        walletObjects.XverseProvider = window.XverseProvider;
        walletObjects.bitcoinProvider = window.bitcoinProvider;
        walletObjects.XverseProviders = window.XverseProviders;
        
        // Unisat
        walletObjects.unisat = window.unisat;
        
        // Magic Eden
        walletObjects.magicEden = window.magicEden;
        walletObjects.magicEdenWallet = window.magicEdenWallet;
        
        // OKX
        walletObjects.okxwallet = window.okxwallet;
        walletObjects.okxToWallet = window.okxToWallet;
        
        // Leather/Stacks
        walletObjects.leather = window.leather;
        walletObjects.leatherProvider = window.leatherProvider;
        walletObjects.stacks = window.stacks;
        walletObjects.StacksProvider = window.StacksProvider;
        
        // Afficher tous les objets trouvés
        console.log("Objets de portefeuille détectés:", 
            Object.entries(walletObjects)
                .filter(([_, val]) => val !== undefined)
                .map(([key, _]) => key)
        );
        
        // Afficher plus de détails sur les objets disponibles
        if (window.okxwallet) {
            console.log("OKX wallet détecté, propriétés:", Object.keys(window.okxwallet));
        }
        
        if (window.stacks) {
            console.log("Stacks API détectée, propriétés:", Object.keys(window.stacks));
        }
    }

    // Initialisation
    initWalletModal();
    initEventListeners();
    debugWalletAvailability();

    console.log('Script de connexion de portefeuille initialisé');
});
