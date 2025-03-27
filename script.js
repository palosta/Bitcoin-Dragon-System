// Fonction d'initialisation pour Sats Connect
function initSatsConnect() {
    const connectButton = document.getElementById("connect-wallet");
    const walletAddressElement = document.getElementById("wallet-address");
    const verificationResultElement = document.getElementById("verification-result");

    // Ajouter un écouteur d'événement au bouton pour se connecter au wallet
    connectButton.addEventListener("click", async () => {
        try {
            // Vérifie si l'objet SatsConnect est défini
            if (typeof SatsConnect !== "undefined") {
                // Initialisation de la connexion avec Sats Connect
                const satsConnect = new SatsConnect();

                // Connexion au wallet
                const wallet = await satsConnect.connect();
                
                if (wallet) {
                    // Affiche l'adresse du wallet dans l'élément correspondant
                    walletAddressElement.textContent = `Wallet Address: ${wallet.address}`;
                    
                    // Vérification de la possession d'un OG Egg
                    await verifyOGEgg(wallet.address, verificationResultElement);
                } else {
                    verificationResultElement.textContent = "No wallet connected.";
                }
            } else {
                verificationResultElement.textContent = "SatsConnect is not loaded correctly.";
            }
        } catch (error) {
            // En cas d'erreur, affiche un message d'erreur
            console.error("Error connecting to wallet:", error);
            verificationResultElement.textContent = "Error connecting to the wallet.";
        }
    });
}

// Fonction pour vérifier si l'adresse du wallet possède un OG Egg
async function verifyOGEgg(walletAddress, resultElement) {
    try {
        // Remplace cet URL par l'API appropriée de Magic Eden ou de ton API pour vérifier les ordinals de la collection OG Eggs
        const apiUrl = `https://api.magiceden.io/v2/wallets/${walletAddress}/tokens`; // Exemple d'endpoint API

        const response = await fetch(apiUrl);
        const data = await response.json();

        // Vérification si l'OG Egg est présent dans les tokens
        const ogEggFound = data.tokens.some(token => token.collection === "OG Eggs"); // Assure-toi que la collection est bien nommée "OG Eggs"

        if (ogEggFound) {
            resultElement.textContent = "You own an OG Egg!";
        } else {
            resultElement.textContent = "You don't own an OG Egg.";
        }
    } catch (error) {
        console.error("Error checking OG Egg:", error);
        resultElement.textContent = "Error verifying OG Egg.";
    }
}

// Attendre que le script Sats Connect soit chargé avant d'initialiser la connexion
window.onload = function() {
    if (typeof SatsConnect !== "undefined") {
        initSatsConnect();  // Appel de la fonction lorsque SatsConnect est disponible
    } else {
        console.log("SatsConnect is not loaded correctly.");
    }
};
