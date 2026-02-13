/**
 * Mint Logo Maker - Master App Script
 * Handles: Icons, Custom UI Injection, and Native Sharing
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. INJECT CUSTOM PROGRESS UI
    // This adds the "Polishing your logo" popup to your app automatically
    const progressHTML = `
        <div id="download-progress" class="hidden fixed inset-0 bg-black/60 flex items-center justify-center z-[9999] backdrop-blur-sm">
            <div class="bg-white p-8 rounded-2xl shadow-2xl flex flex-col items-center gap-4 border border-gray-100">
                <div class="animate-spin rounded-full h-12 w-12 border-4 border-indigo-100 border-t-indigo-600"></div>
                <div class="text-center">
                    <p class="text-base font-bold text-gray-800">Polishing your logo...</p>
                    <p class="text-xs text-gray-500">Preparing high-quality files</p>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', progressHTML);

    // 2. INITIALIZE ICONS
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // 3. ATTACH SAVE LOGIC TO BUTTON
    const exportBtn = document.getElementById('btn-export');
    if (exportBtn) {
        exportBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            await saveLogoNative();
        });
    }
});

/**
 * The "No-Chrome" Save Engine
 */
async function saveLogoNative() {
    const progressUI = document.getElementById('download-progress');
    
    try {
        // Show our custom progress bar
        if (progressUI) progressUI.classList.remove('hidden');

        // --- IMAGE GRABBING LOGIC ---
        // Adjust 'logo-canvas' to match the ID of your actual canvas/image
        const canvas = document.getElementById('logo-canvas'); 
        let blob;

        if (canvas) {
            blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png', 1.0));
        } else {
            // If no canvas is found, we try to fetch the preview image
            const previewImg = document.querySelector('#logo-preview img');
            const response = await fetch(previewImg ? previewImg.src : 'logo.png');
            blob = await response.blob();
        }

        const file = new File([blob], "mint-logo.png", { type: 'image/png' });

        // Hide our progress bar right before the native menu pops up
        if (progressUI) progressUI.classList.add('hidden');

        // --- TRIGGER NATIVE SHARE ---
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
            await navigator.share({
                files: [file],
                title: 'My Mint Logo',
                text: 'Created with Mint Logo Maker',
            });
        } else {
            // Final fallback for older browsers
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = "mint-logo.png";
            link.click();
        }

    } catch (error) {
        console.error("Save interrupted:", error);
        if (progressUI) progressUI.classList.add('hidden');
    }
}
