function initSatsConnect() {
    const connectButton = document.getElementById("connect-wallet");
    const walletAddressElement = document.getElementById("wallet-address");
    const verificationResultElement = document.getElementById("verification-result");

    // Ajoute un écouteur d'événement au bouton pour connecter le wallet
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
