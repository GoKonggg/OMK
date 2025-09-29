document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');

    if (loginForm) {
        loginForm.addEventListener('submit', (event) => {
            // Prevent the form from actually submitting
            event.preventDefault();

            // Get references to the input fields and error message element
            const emailInput = document.getElementById('email');
            const passwordInput = document.getElementById('password');
            const errorMessage = document.getElementById('error-message');

            // Get the values and trim whitespace
            const email = emailInput.value.trim();
            const password = passwordInput.value.trim();

            // --- Hardcoded Credentials for Simulation ---
            const partnerEmail = 'partner@omaku.com';
            const partnerPass = 'password123';
            const adminEmail = 'admin@omaku.com';
            const adminPass = 'adminpass';
            // -----------------------------------------

            // Basic validation
            if (email === '' || password === '') {
                errorMessage.textContent = 'Please enter both email and password.';
                errorMessage.style.display = 'block';
                return;
            }

            // Check credentials
            if (email === partnerEmail && password === partnerPass) {
                // Successful partner login
                errorMessage.style.display = 'none';
                alert('Partner login successful! Redirecting...');
                window.location.href = 'partner-dashboard.html';
            } else if (email === adminEmail && password === adminPass) {
                // Successful admin login
                errorMessage.style.display = 'none';
                alert('Admin login successful! Redirecting...');
                window.location.href = 'owner-dashboard.html';
            } else {
                // Failed login
                errorMessage.textContent = 'Invalid email or password. Please try again.';
                errorMessage.style.display = 'block';
            }
        });
    }
});