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
            detection: {
                // Différentes façons de détecter Xverse
                checks: [
                    { path: 'window.XverseProviders?.BitcoinProvider', found: false },
                    { path: 'window.XverseProvider', found: false },
                    { path: 'window.bitcoinProvider', found: false },
                    { path: 'window.bitcoin?.xverse', found: false }
                ],
                // Ces variables seront vérifiées lorsque l'utilisateur clique sur l'option
                dynamic: [
                    'window.__XVERSE__',
                    'window.XverseProviders',
                    'window.XverseProvider',
                    'window.bitcoinProvider'
                ]
            },
            connect: async () => {
                try {
                    // Vérifier dynamiquement si Xverse est détecté maintenant
                    const dynamicDetection = runDynamicDetection(wallets[0].detection.dynamic);
                    
                    // Si détecté dynamiquement, essayer de se connecter
                    if (dynamicDetection) {
                        console.log("Xverse détecté dynamiquement:", dynamicDetection);
                        
                        // Essayer plusieurs méthodes de connexion
                        if (window.XverseProviders?.BitcoinProvider) {
                            const accounts = await window.XverseProviders.BitcoinProvider.request({ method: 'getAccounts' });
                            return accounts[0];
                        } else if (window.XverseProvider) {
                            const accounts = await window.XverseProvider.request({ method: 'getAccounts' });
                            return accounts[0];
                        } else if (window.bitcoinProvider) {
                            const accounts = await window.bitcoinProvider.request({ method: 'getAccounts' });
                            return accounts[0];
                        } else if (window.bitcoin?.xverse) {
                            const accounts = await window.bitcoin.xverse.request({ method: 'getAccounts' });
                            return accounts[0];
                        }
                    }
                    
                    // Si non détecté, proposer d'ouvrir l'extension manuellement
                    const shouldOpen = confirm(`Xverse n'a pas été détecté automatiquement. Si vous l'avez déjà installé, veuillez l'ouvrir manuellement dans votre barre d'extensions, puis réessayez. Sinon, souhaitez-vous visiter le site d'installation?`);
                    
                    if (shouldOpen) {
                        window.open('https://www.xverse.app/download', '_blank');
                    }
                    
                    return null;
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
            detection: {
                checks: [
                    { path: 'window.unisat', found: false },
                    { path: 'window.bitcoin?.unisat', found: false }
                ],
                dynamic: [
                    'window.unisat',
                    'window.bitcoin?.unisat'
                ]
            },
            connect: async () => {
                try {
                    // Vérifier dynamiquement si Unisat est détecté maintenant
                    const dynamicDetection = runDynamicDetection(wallets[1].detection.dynamic);
                    
                    if (dynamicDetection) {
                        console.log("Unisat détecté dynamiquement:", dynamicDetection);
                        
                        if (window.unisat) {
                            const accounts = await window.unisat.requestAccounts();
                            return accounts[0];
                        } else if (window.bitcoin?.unisat) {
                            const accounts = await window.bitcoin.unisat.requestAccounts();
                            return accounts[0];
                        }
                    }
                    
                    // Si non détecté, proposer d'ouvrir l'extension manuellement
                    const shouldOpen = confirm(`Unisat n'a pas été détecté automatiquement. Si vous l'avez déjà installé, veuillez l'ouvrir manuellement dans votre barre d'extensions, puis réessayez. Sinon, souhaitez-vous visiter le site d'installation?`);
                    
                    if (shouldOpen) {
                        window.open('https://unisat.io/download', '_blank');
                    }
                    
                    return null;
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
            detection: {
                checks: [
                    { path: 'window.magicEden', found: false },
                    { path: 'window.magicEdenWallet', found: false },
                    { path: 'window.bitcoin?.magicEden', found: false }
                ],
                dynamic: [
                    'window.magicEden',
                    'window.magicEdenWallet',
                    'window.bitcoin?.magicEden'
                ]
            },
            connect: async () => {
                try {
                    // Vérifier dynamiquement si Magic Eden est détecté maintenant
                    const dynamicDetection = runDynamicDetection(wallets[2].detection.dynamic);
                    
                    if (dynamicDetection) {
                        console.log("Magic Eden détecté dynamiquement:", dynamicDetection);
                        
                        if (window.magicEden) {
                            const accounts = await window.magicEden.request({ method: 'getAccounts' });
                            return accounts[0];
                        } else if (window.magicEdenWallet) {
                            const accounts = await window.magicEdenWallet.request({ method: 'getAccounts' });
                            return accounts[0];
                        } else if (window.bitcoin?.magicEden) {
                            const accounts = await window.bitcoin.magicEden.request({ method: 'getAccounts' });
                            return accounts[0];
                        }
                    }
                    
                    // Si non détecté, proposer d'ouvrir l'extension manuellement
                    const shouldOpen = confirm(`Magic Eden n'a pas été détecté automatiquement. Si vous l'avez déjà installé, veuillez l'ouvrir manuellement dans votre barre d'extensions, puis réessayez. Sinon, souhaitez-vous visiter le site d'installation?`);
                    
                    if (shouldOpen) {
                        window.open('https://wallet.magiceden.io/download', '_blank');
                    }
                    
                    return null;
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
            detection: {
                checks: [
                    { path: 'window.okxwallet?.bitcoin', found: false },
                    { path: 'window.bitcoin?.okx', found: false }
                ],
                dynamic: [
                    'window.okxwallet?.bitcoin',
                    'window.bitcoin?.okx'
                ]
            },
            connect: async () => {
                try {
                    // OKX est déjà détecté correctement, procéder à la connexion
                    if (window.okxwallet?.bitcoin) {
                        const accounts = await window.okxwallet.bitcoin.requestAccounts();
                        return accounts[0];
                    } else if (window.bitcoin?.okx) {
                        const accounts = await window.bitcoin.okx.requestAccounts();
                        return accounts[0];
                    }
                    
                    // Si non détecté, proposer l'installation
                    const shouldOpen = confirm(`OKX n'a pas été détecté automatiquement. Si vous l'avez déjà installé, veuillez l'ouvrir manuellement dans votre barre d'extensions, puis réessayez. Sinon, souhaitez-vous visiter le site d'installation?`);
                    
                    if (shouldOpen) {
                        window.open('https://www.okx.com/web3/wallet/download', '_blank');
                    }
                    
                    return null;
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
            detection: {
                checks: [
                    { path: 'window.leather', found: false },
                    { path: 'window.leatherProvider', found: false },
                    // Exclure window.stacks si isOKXWallet est true
                    { path: 'window.stacks && !window.stacks.isOKXWallet', found: false }
                ],
                dynamic: [
                    'window.leather',
                    'window.leatherProvider',
                    'window.StacksProvider'
                ]
            },
            connect: async () => {
                try {
                    // Vérifier dynamiquement si Leather est détecté maintenant
                    const dynamicDetection = runDynamicDetection(wallets[4].detection.dynamic);
                    
                    if (dynamicDetection) {
                        console.log("Leather détecté dynamiquement:", dynamicDetection);
                        
                        if (window.leather) {
                            if (window.leather.request) {
                                const accounts = await window.leather.request({ method: 'getAccounts' });
                                return accounts[0];
                            }
                        }
                        
                        if (window.leatherProvider) {
                            if (window.leatherProvider.request) {
                                const accounts = await window.leatherProvider.request({ method: 'getAccounts' });
                                return accounts[0];
                            }
                        }
                    }
                    
                    // Si stacks est disponible mais n'est pas OKX, essayer de l'utiliser
                    if (window.stacks && !window.stacks.isOKXWallet) {
                        try {
                            if (typeof window.stacks.connect === 'function') {
                                await window.stacks.connect();
                                
                                // Récupérer l'adresse si possible
                                if (window.stacks.address) {
                                    return window.stacks.address;
                                }
                            }
                        } catch (e) {
                            console.error("Erreur lors de la connexion via stacks:", e);
                        }
                    }
                    
                    // Si non détecté, proposer d'ouvrir l'extension manuellement
                    const shouldOpen = confirm(`Leather n'a pas été détecté automatiquement. Si vous l'avez déjà installé, veuillez l'ouvrir manuellement dans votre barre d'extensions, puis réessayez. Sinon, souhaitez-vous visiter le site d'installation?`);
                    
                    if (shouldOpen) {
                        window.open('https://leather.io/install-extension', '_blank');
                    }
                    
                    return null;
                } catch (error) {
                    console.error('Leather connection error:', error);
                    return null;
                }
            }
        }
    ];

    // Fonction pour évaluer en toute sécurité les chemins d'accès aux objets
    function safeEval(path) {
        try {
            // Parcourir le chemin en séparant par les points
            const parts = path.split('.');
            let current = window;
            
            for (const part of parts) {
                // Gestion des expressions avec ?. pour la vérification optionnelle
                if (part.includes('?')) {
                    const actualPart = part.replace('?', '');
                    if (current === undefined || current === null) {
                        return undefined;
                    }
                    current = current[actualPart];
                } else {
                    if (current === undefined || current === null) {
                        return undefined;
                    }
                    current = current[part];
                }
            }
            
            return current;
        } catch (e) {
            return undefined;
        }
    }
    
    // Vérifier dynamiquement la disponibilité d'un portefeuille
    function runDynamicDetection(paths) {
        for (const path of paths) {
            const result = safeEval(path);
            if (result) {
                return path;
            }
        }
        return null;
    }

    // Raccourcir l'adresse
    function shortenAddress(address) {
        if (!address) return "";
        return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
    }

    // Fonction pour ouvrir le site web du portefeuille
    function openWalletWebsite(walletName, url) {
        const confirmed = confirm(`${walletName} n'est pas disponible ou nécessite une configuration. Souhaitez-vous visiter le site de ${walletName}?`);
        if (confirmed) {
            window.open(url, '_blank');
        }
    }

    // Mettre à jour la disponibilité des portefeuilles
    function updateWalletAvailability() {
        // Vérifier chaque portefeuille
        wallets.forEach(wallet => {
            wallet.available = false;
            
            // Parcourir tous les chemins de détection
            wallet.detection.checks.forEach(check => {
                check.found = !!safeEval(check.path);
                if (check.found) {
                    wallet.available = true;
                }
            });
            
            // Log pour le débogage
            console.log(`Vérification de ${wallet.name}:`, 
                wallet.detection.checks.map(c => `${c.path}: ${c.found}`).join(', '),
                `Disponible: ${wallet.available}`
            );
        });
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
            
            // Mettre à jour la disponibilité à chaque ouverture
            // afin de détecter les extensions activées entre-temps
            initWalletModal();
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

    // Débogage complet des objets de l'extension
    function debugExtensionObjects() {
        // Vérification des objets globaux qui pourraient être fournis par les extensions
        const globalObjects = [
            'window.XverseProviders',
            'window.XverseProvider',
            'window.bitcoinProvider',
            'window.unisat',
            'window.magicEden',
            'window.magicEdenWallet',
            'window.okxwallet',
            'window.bitcoin',
            'window.stacks',
            'window.leather',
            'window.leatherProvider'
        ];
        
        console.log("Débogage des objets d'extension:");
        globalObjects.forEach(path => {
            const exists = !!safeEval(path);
            console.log(`- ${path}: ${exists ? 'Trouvé' : 'Non trouvé'}`);
            
            if (exists) {
                const obj = safeEval(path);
                if (obj && typeof obj === 'object') {
                    // Afficher les propriétés non-fonction de l'objet
                    const props = Object.keys(obj).filter(k => typeof obj[k] !== 'function');
                    console.log(`  Propriétés: ${props.join(', ')}`);
                    
                    // Afficher les méthodes disponibles
                    const methods = Object.keys(obj).filter(k => typeof obj[k] === 'function');
                    console.log(`  Méthodes: ${methods.join(', ')}`);
                }
            }
        });
        
        // Vérification spéciale pour window.bitcoin
        if (window.bitcoin) {
            console.log("Propriétés de window.bitcoin:", Object.keys(window.bitcoin));
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
    debugExtensionObjects();

    console.log('Script de connexion de portefeuille initialisé');
});
