document.addEventListener('DOMContentLoaded', () => {
    const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
    const qrCodeCanvas = document.getElementById('qrcode-canvas');
    const affiliateLinkDisplay = document.getElementById('affiliate-link-display');
    const copyLinkBtn = document.querySelector('.affiliate-link-wrapper .btn-primary'); // Tombol 'Copy Link'
    const downloadQrBtn = document.getElementById('download-qr-btn');

    // Update welcome message (optional, but good for consistency)
    const welcomeMessage = document.querySelector('.user-profile span');
    if (welcomeMessage) welcomeMessage.textContent = `Welcome, ${loggedInUser ? loggedInUser.name : 'Partner'}!`;

    if (loggedInUser && loggedInUser.role === 'partner') {
        // Buat link afiliasi unik berdasarkan nama partner
        // Contoh: https://omaku.com/ref/michaelchen (dikonversi ke lowercase tanpa spasi)
        const affiliateLink = `https://omaku.com/ref/${loggedInUser.name.replace(/\s+/g, '').toLowerCase()}`;
        
        // Tampilkan link di halaman
        affiliateLinkDisplay.textContent = affiliateLink;

        // Generate QR Code
        // Pastikan qrCodeCanvas ada sebelum mencoba membuat QR Code
        if (qrCodeCanvas) {
            new QRCode(qrCodeCanvas, {
                text: affiliateLink,
                width: 200,
                height: 200,
                colorDark: "#000000",
                colorLight: "#ffffff",
                correctLevel: QRCode.CorrectLevel.H
            });
        }

        // Fungsikan tombol Copy Link
        if (copyLinkBtn) {
            copyLinkBtn.addEventListener('click', () => {
                navigator.clipboard.writeText(affiliateLink).then(() => {
                    alert('Affiliate link copied to clipboard!');
                }).catch(err => {
                    console.error('Failed to copy link: ', err);
                });
            });
        }

        // Fungsikan tombol Download QR Code
        if (downloadQrBtn) {
            downloadQrBtn.addEventListener('click', () => {
                // Library qrcode.js menggambar di <canvas> atau <img>.
                // Kita perlu mencari elemen tersebut di dalam qrCodeCanvas.
                const qrImage = qrCodeCanvas.querySelector('img'); // qrcode.js biasanya pakai img
                if (!qrImage) {
                    // Fallback jika ternyata pakai canvas
                    const qrCanvas = qrCodeCanvas.querySelector('canvas');
                    if (qrCanvas) {
                        qrCanvas.toBlob(blob => {
                            const link = document.createElement('a');
                            link.href = URL.createObjectURL(blob);
                            link.download = `omaku-qr-code-${loggedInUser.name.replace(/\s+/g, '')}.png`;
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                        });
                    }
                } else {
                     // Jika sudah jadi img, langsung download
                    const link = document.createElement('a');
                    link.href = qrImage.src;
                    link.download = `omaku-qr-code-${loggedInUser.name.replace(/\s+/g, '')}.png`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }
            });
        }

    } else {
        if (affiliateLinkDisplay) affiliateLinkDisplay.textContent = 'Please log in as a partner to generate your link.';
        if (qrCodeCanvas) qrCodeCanvas.textContent = 'Please log in as a partner to generate your QR code.';
        if (downloadQrBtn) downloadQrBtn.style.display = 'none'; // Sembunyikan tombol download jika tidak login
        if (copyLinkBtn) copyLinkBtn.style.display = 'none'; // Sembunyikan tombol copy jika tidak login
    }
});