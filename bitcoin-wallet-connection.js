document.addEventListener('DOMContentLoaded', () => {
    // Charger la bibliothèque Sats Connect dynamiquement
    function loadSatsConnect() {
        return new Promise((resolve, reject) => {
            if (window.SatsConnect) {
                resolve(window.SatsConnect);
                return;
            }

            const script = document.createElement('script');
            script.src = 'https://unpkg.com/sats-connect@1.3.0/dist/lib.js';
            script.async = true;
            script.onload = () => {
                if (window.SatsConnect) {
                    resolve(window.SatsConnect);
                } else {
                    reject(new Error('Sats Connect not loaded correctly'));
                }
            };
            script.onerror = () => reject(new Error('Failed to load Sats Connect'));
            document.head.appendChild(script);
        });
    }

    const connectButton = document.getElementById('connect-wallet-btn');
    const walletAddressDisplay = document.getElementById('wallet-address');
    const walletModal = document.getElementById('wallet-modal');
    const closeModalButton = document.querySelector('.close-modal');
    const walletOptionsContainer = document.querySelector('.wallet-options');
    const verificationResult = document.getElementById('verification-result');

    if (!connectButton) {
        console.error('Bouton de connexion non trouvé');
        return;
    }

    // Configuration des portefeuilles avec leurs icônes
    const wallets = [
        { 
            name: 'Xverse',
            icon: "assets/xverse.svg",
            iconType: "svg",
            walletId: "xverse"
        },
        { 
            name: 'Unisat',
            icon: "assets/unisat.png",
            iconType: "png",
            walletId: "unisat"
        },
        { 
            name: 'Magic Eden',
            icon: "assets/magic-eden.png",
            iconType: "png",
            walletId: "magiceden"
        },
        { 
            name: 'OKX',
            icon: "assets/okx.png",
            iconType: "png",
            walletId: "okx"
        },
        { 
            name: 'Leather',
            icon: "assets/leather.png",
            iconType: "png",
            walletId: "leather"
        }
    ];

    // Raccourcir l'adresse
    function shortenAddress(address) {
        if (!address) return "";
        return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
    }

    // Connexion avec Sats Connect
    async function connectWithSatsConnect(wallet) {
        try {
            const SatsConnect = await loadSatsConnect();

            SatsConnect.getAddress({
                payload: {
                    purposes: ["ordinals", "payment"],
                    message: "Bitcoin Dragon System souhaite se connecter à votre portefeuille",
                    network: {
                        type: "Mainnet",
                    },
                    wallets: [wallet.walletId], // Spécifier le portefeuille à utiliser
                },
                onFinish: (response) => {
                    console.log("Connexion réussie:", response);
                    // Utiliser l'adresse ordinale ou de paiement
                    const address = response.addresses.ordinals || response.addresses.payment;
                    
                    if (walletAddressDisplay) {
                        walletAddressDisplay.textContent = `Connecté avec ${wallet.name}: ${shortenAddress(address)}`;
                    }
                    
                    connectButton.textContent = 'Connecté';
                    connectButton.classList.add('connected');
                    closeWalletModal();
                },
                onCancel: () => {
                    console.log("Connexion annulée");
                },
                onError: (error) => {
                    console.error("Erreur de connexion:", error);
                    alert(`Erreur lors de la connexion à ${wallet.name}. Assurez-vous que le portefeuille est installé et activé.`);
                }
            });
        } catch (error) {
            console.error("Erreur SatsConnect:", error);
            
            // Fallback vers l'ancienne méthode en cas d'échec
            connectWithFallback(wallet);
        }
    }

    // Méthode de connexion de secours (fallback)
    async function connectWithFallback(wallet) {
        try {
            let address = null;
            
            // OKX - fonctionne déjà selon vos logs
            if (wallet.name === 'OKX' && window.okxwallet?.bitcoin) {
                const accounts = await window.okxwallet.bitcoin.requestAccounts();
                address = accounts[0];
            }
            // Unisat
            else if (wallet.name === 'Unisat' && window.unisat) {
                const accounts = await window.unisat.requestAccounts();
                address = accounts[0];
            }
            // Pour les autres portefeuilles, proposer l'installation
            else {
                const walletUrls = {
                    'Xverse': 'https://www.xverse.app/download',
                    'Unisat': 'https://unisat.io/download',
                    'Magic Eden': 'https://wallet.magiceden.io/download',
                    'OKX': 'https://www.okx.com/web3/wallet/download',
                    'Leather': 'https://leather.io/install-extension'
                };
                
                const openWallet = confirm(`${wallet.name} n'a pas été détecté. Souhaitez-vous l'installer?`);
                if (openWallet && walletUrls[wallet.name]) {
                    window.open(walletUrls[wallet.name], '_blank');
                }
                return;
            }
            
            if (address) {
                if (walletAddressDisplay) {
                    walletAddressDisplay.textContent = `Connecté avec ${wallet.name}: ${shortenAddress(address)}`;
                }
                connectButton.textContent = 'Connecté';
                connectButton.classList.add('connected');
                closeWalletModal();
            } else {
                alert(`Échec de la connexion à ${wallet.name}. Vérifiez que le portefeuille est installé.`);
            }
        } catch (error) {
            console.error('Erreur de connexion (fallback):', error);
            alert(`Une erreur est survenue lors de la connexion à ${wallet.name}.`);
        }
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
                
                // Utiliser Sats Connect pour la connexion
                connectWithSatsConnect(wallet);
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
        console.log('Xverse présence:', window.XverseProvider ? 'XverseProvider trouvé' : 'XverseProvider non trouvé');
        console.log('Bitcoin provider:', window.bitcoinProvider ? 'bitcoinProvider trouvé' : 'bitcoinProvider non trouvé');
        
        // Unisat
        console.log('Unisat présence:', window.unisat ? 'Trouvé' : 'Non trouvé');
        
        // Magic Eden
        console.log('Magic Eden présence:', window.magicEden ? 'magicEden trouvé' : 'magicEden non trouvé');
        console.log('Magic Eden wallet:', window.magicEdenWallet ? 'magicEdenWallet trouvé' : 'magicEdenWallet non trouvé');
        
        // OKX
        console.log('OKX présence (bitcoin):', window.okxwallet?.bitcoin ? 'okxwallet.bitcoin trouvé' : 'okxwallet.bitcoin non trouvé');
        console.log('OKX présence (alt):', window.bitcoin?.okx ? 'bitcoin.okx trouvé' : 'bitcoin.okx non trouvé');
        
        // Leather
        console.log('Leather présence:', window.leather ? 'leather trouvé' : 'leather non trouvé');
        console.log('Leather provider:', window.leatherProvider ? 'leatherProvider trouvé' : 'leatherProvider non trouvé');
        
        // Sats Connect
        console.log('Sats Connect présence:', window.SatsConnect ? 'Trouvé' : 'Non trouvé');
        
        // Log tous les objets window qui contiennent "bitcoin"
        console.log('Tous les objets bitcoin possibles:');
        Object.keys(window).filter(key => 
            key.toLowerCase().includes('bitcoin') || 
            key.toLowerCase().includes('wallet') || 
            key.toLowerCase().includes('xverse') || 
            key.toLowerCase().includes('magic') ||
            key.toLowerCase().includes('leather') ||
            key.toLowerCase().includes('stacks')
        ).forEach(key => {
            console.log(`- ${key} trouvé`);
        });
    }

    // Initialisation
    initWalletModal();
    initEventListeners();
    debugWalletAvailability();
    
    // Précharger Sats Connect
    loadSatsConnect().then(() => {
        console.log('Sats Connect chargé avec succès');
    }).catch(error => {
        console.error('Erreur de chargement de Sats Connect:', error);
    });

    console.log('Script de connexion de portefeuille initialisé');
});
