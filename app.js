// This function handles the "Native" save
async function saveLogoNative() {
    // Replace this with the actual URL of the logo your app generates
    const imageUrl = 'your-logo-file.png'; 
    
    try {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const file = new File([blob], "my-logo.png", { type: 'image/png' });

        if (navigator.share && navigator.canShare({ files: [file] })) {
            await navigator.share({
                files: [file],
                title: 'Mint Logo Maker',
                text: 'Here is my new logo!',
            });
        } else {
            // Fallback for browsers that don't support sharing
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = "my-logo.png";
            link.click();
        }
    } catch (error) {
        console.error("Save failed:", error);
    }
}

