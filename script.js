document.getElementById("connect-wallet").addEventListener("click", async () => {
    // Connect to Xverse wallet
    try {
        const wallet = await window.xverse.request({ method: 'getAccounts' });

        if (wallet && wallet.length > 0) {
            const address = wallet[0];  // First Xverse address
            document.getElementById("wallet-address").innerText = `Connected wallet: ${address}`;
            
            // Check for Ordinal ownership
            checkOrdinalOwnership(address);
        } else {
            alert("No wallet connected.");
        }
    } catch (error) {
        console.error("Error connecting to Xverse", error);
        alert("Error connecting to the wallet.");
    }
});

async function checkOrdinalOwnership(address) {
    const apiUrl = `https://api-mainnet.magiceden.dev/v2/wallets/${address}/ordinals`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (!data || data.length === 0) {
            document.getElementById("verification-result").innerText = "❌ No Ordinals found.";
            return;
        }

        // Replace "OG Eggs" with your actual collection ID
        const hasEgg = data.some(ordinal => ordinal.collection === "OG Eggs");

        document.getElementById("verification-result").innerText = hasEgg 
            ? "✅ You own an OG Egg!" 
            : "❌ You don't own an OG Egg.";
    } catch (error) {
        console.error("Magic Eden API error:", error);
        document.getElementById("verification-result").innerText = "⚠️ Verification error.";
    }
}
