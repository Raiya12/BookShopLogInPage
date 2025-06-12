// This file contains the JavaScript logic for handling user authentication.

document.addEventListener('DOMContentLoaded', function() {
    // Get all forms and sections
    const loginSection = document.getElementById('login-section');
    const signupSection = document.getElementById('signup-section');
    const resetSection = document.getElementById('reset-section');
    
    // Get all forms
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const resetPasswordForm = document.getElementById('reset-password-form');

    // Show error function
    function showError(input, message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        input.parentNode.appendChild(errorDiv);
        input.classList.add('invalid-input');

        setTimeout(() => {
            errorDiv.remove();
            input.classList.remove('invalid-input');
        }, 3000);
    }

    // Show section function
    function showSection(sectionId) {
        document.querySelectorAll('.auth-section').forEach(section => {
            section.classList.remove('active');
            section.classList.add('hidden');
        });
        const section = document.getElementById(sectionId);
        section.classList.remove('hidden');
        section.classList.add('active');
    }

    // Navigation event listeners
    document.getElementById('show-signup').addEventListener('click', (e) => {
        e.preventDefault();
        showSection('signup-section');
    });

    document.getElementById('show-login').addEventListener('click', (e) => {
        e.preventDefault();
        showSection('login-section');
    });

    // Login form handler
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = this.username.value;
        const password = this.password.value;

        // Get users from localStorage
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            const token = generateToken(user);
            localStorage.setItem('authToken', token);
            localStorage.setItem('currentUser', JSON.stringify(user));
            showSuccess('Login successful!');
            console.log('Logged in successfully!');
        } else {
            showError(this.username, 'Invalid email or password');
        }
    });

    // Signup form handler
    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const name = this.name.value;
        const email = this.email.value;
        const password = this.password.value;

        // Get existing users
        const users = JSON.parse(localStorage.getItem('users') || '[]');

        // Check if user already exists
        if (users.some(user => user.email === email)) {
            showError(this.email, 'Email already registered');
            return;
        }

        // Create new user
        const newUser = {
            id: generateUserId(),
            name,
            email,
            password,
            createdAt: new Date().toISOString()
        };

        // Save user
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));

        // Generate token
        const token = generateToken(newUser);
        localStorage.setItem('authToken', token);
        localStorage.setItem('currentUser', JSON.stringify(newUser));

        showSuccess('Registration successful!');
        showSection('login-section');
    });

    // Helper functions
    function generateToken(user) {
        const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
        const payload = btoa(JSON.stringify({
            id: user.id,
            email: user.email,
            name: user.name,
            iat: new Date().getTime()
        }));
        const signature = btoa(`${header}.${payload}`);
        return `${header}.${payload}.${signature}`;
    }

    function generateUserId() {
        return Math.random().toString(36).substr(2, 9);
    }

    function showSuccess(message) {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.textContent = message;
        document.querySelector('.auth-container').appendChild(successDiv);

        setTimeout(() => {
            successDiv.remove();
        }, 3000);
    }

    // Check if user is already logged in
    function checkAuthStatus() {
        const token = localStorage.getItem('authToken');
        const currentUser = localStorage.getItem('currentUser');

        if (token && currentUser) {
            // User is logged in
            // Redirect to dashboard or show logged-in state
            console.log('User is logged in:', JSON.parse(currentUser));
        }
    }

    // Add this to CSS
    function addSuccessStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .success-message {
                color: #28a745;
                background-color: #d4edda;
                border: 1px solid #c3e6cb;
                border-radius: 4px;
                padding: 10px;
                margin: 10px 0;
                text-align: center;
            }
        `;
        document.head.appendChild(style);
    }

    // Initialize
    addSuccessStyles();
    checkAuthStatus();
});