document.getElementById("connect-wallet").addEventListener("click", async () => {
    console.log("Attempting to connect wallet..."); // Log de débogage

function initSatsConnect() {
    const connectButton = document.getElementById("connect-wallet");
    const walletAddressElement = document.getElementById("wallet-address");
    const verificationResultElement = document.getElementById("verification-result");

    connectButton.addEventListener("click", async () => {
        try {
            // Initialise la connexion avec Sats Connect
            const satsConnect = new SatsConnect();

            // Connexion au wallet
            const wallet = await satsConnect.connect();
            
            if (wallet) {
                // Affiche l'adresse du wallet
                walletAddressElement.textContent = `Wallet Address: ${wallet.address}`;
                
                // Vérifier l'ordinal ou effectuer d'autres actions ici
                verificationResultElement.textContent = "Wallet connected successfully!";
            } else {
                verificationResultElement.textContent = "No wallet connected.";
            }
        } catch (error) {
            console.error("Error connecting to wallet:", error);
            verificationResultElement.textContent = "Error connecting to the wallet.";
        }
    });
}

    
    // Connexion via Sats Connect (Xverse)
    try {
        const wallet = await SatsConnect.requestAccount();

        if (wallet) {
            const address = wallet.address;  // Récupère l'adresse Bitcoin
            console.log(`Connected wallet address: ${address}`); // Log de débogage
            document.getElementById("wallet-address").innerText = `Connected wallet: ${address}`;

            // Vérification de l'Ordinal
            checkOrdinalOwnership(address);
        } else {
            alert("No wallet connected.");
        }
    } catch (error) {
        console.error("Error connecting to wallet", error);
        alert("Error connecting to the wallet.");
    }
});

async function checkOrdinalOwnership(address) {
    console.log(`Checking Ordinal ownership for address: ${address}`); // Log de débogage
    const apiUrl = `https://api-mainnet.magiceden.dev/v2/wallets/${address}/ordinals`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (!data || data.length === 0) {
            console.log("No Ordinals found."); // Log de débogage
            document.getElementById("verification-result").innerText = "❌ No Ordinals found.";
            return;
        }

        // Remplace "OG Eggs" par l'ID réel de ta collection
        const hasEgg = data.some(ordinal => ordinal.collection === "OG Eggs");

        document.getElementById("verification-result").innerText = hasEgg 
            ? "✅ You own an OG Egg!" 
            : "❌ You don't own an OG Egg.";
    } catch (error) {
        console.error("Magic Eden API error:", error);
        document.getElementById("verification-result").innerText = "⚠️ Verification error.";
    }
}
