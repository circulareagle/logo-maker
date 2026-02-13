/**
 * Mint Logo Maker - Master App Script
 * Logic: Custom Progress UI + Native Share Integration
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Inject Custom UI (Hidden by default)
    const progressHTML = `
        <div id="download-progress" class="hidden fixed inset-0 bg-black/70 flex items-center justify-center z-[9999] backdrop-blur-md">
            <div class="bg-zinc-900 p-8 rounded-2xl shadow-2xl flex flex-col items-center gap-4 border border-zinc-800">
                <div class="animate-spin rounded-full h-12 w-12 border-4 border-indigo-900 border-t-indigo-500"></div>
                <div class="text-center">
                    <p class="text-base font-bold text-white">Polishing your logo...</p>
                    <p class="text-xs text-zinc-500">Optimizing for high resolution</p>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', progressHTML);

    // 2. Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // 3. Connect to the Export Button
    // We use a clean event listener to avoid conflict with index.html
    const exportBtn = document.getElementById('btn-export');
    if (exportBtn) {
        exportBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            await startNativeExport();
        });
    }
});

/**
 * Grabs the Fabric.js canvas content and triggers Android Native Share
 */
async function startNativeExport() {
    const progressUI = document.getElementById('download-progress');
    
    // Safety check: Is the Fabric canvas globally available?
    // In your index.html, 'canvas' is the Fabric instance.
    if (typeof canvas === 'undefined') {
        console.error("Canvas engine not found");
        return;
    }

    try {
        // Show our custom loading UI
        if (progressUI) progressUI.classList.remove('hidden');

        // 1. Prepare the Canvas (Deselect objects so handles don't show in save)
        canvas.discardActiveObject();
        canvas.renderAll();

        // 2. Convert Canvas to High-Res Blob
        // multiplier: 3 makes it high quality for printing
        const dataURL = canvas.toDataURL({
            format: 'png',
            multiplier: 3
        });

        const response = await fetch(dataURL);
        const blob = await response.blob();
        const file = new File([blob], "mint-logo.png", { type: 'image/png' });

        // Hide our UI before the system menu appears
        if (progressUI) progressUI.classList.add('hidden');

        // 3. Trigger Native Android Share Menu (Bypasses Chrome Bar)
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
            await navigator.share({
                files: [file],
                title: 'My Logo Design',
                text: 'Designed with Pro Logo Studio',
            });
        } else {
            // Standard fallback if Sharing is disabled
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = "mint-logo.png";
            link.click();
        }

    } catch (error) {
        console.error("Export failed:", error);
        if (progressUI) progressUI.classList.add('hidden');
    }
}

