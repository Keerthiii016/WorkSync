// Authentication Module for WorkSync

class AuthManager {
    constructor() {
        this.apiBaseUrl = 'http://localhost:8080/api';
        this.isAuthenticated = false;
        this.currentUser = null;
        this.token = localStorage.getItem('authToken');
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.checkResetPasswordPage();
        this.checkAuthStatus();
    }

    setupEventListeners() {
        // Login form
        document.getElementById('loginForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.login();
        });

        // Signup form
        document.getElementById('signupForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.signup();
        });

        // Forgot password form
        document.getElementById('forgotPasswordForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.forgotPassword();
        });

        // Reset password form
        document.getElementById('resetPasswordForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.resetPassword();
        });

        // Navigation between auth forms
        document.getElementById('showSignupLink')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.showSignupForm();
        });

        document.getElementById('showLoginLink')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.showLoginForm();
        });

        document.getElementById('showForgotPasswordLink')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.showForgotPasswordForm();
        });

        document.getElementById('showLoginLink2')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.showLoginForm();
        });

        // Logout
        document.getElementById('logoutBtn')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.logout();
        });
    }

    checkAuthStatus() {
        if (this.token) {
            this.validateToken();
        } else {
            this.showAuthForms();
        }
    }

    async validateToken() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/auth/me`, {
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const userData = await response.json();
                this.currentUser = userData;
                this.isAuthenticated = true;
                this.showMainApp();
                this.updateUserInterface();
            } else {
                this.clearAuth();
                this.showAuthForms();
            }
        } catch (error) {
            console.error('Token validation error:', error);
            this.clearAuth();
            this.showAuthForms();
        }
    }

    async login() {
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        if (!this.validateLoginForm(email, password)) {
            return;
        }

        this.showLoading('loginBtn', 'Signing in...');

        try {
            const response = await fetch(`${this.apiBaseUrl}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                this.handleSuccessfulAuth(data);
            } else {
                this.showError('loginError', data.message || 'Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            this.showError('loginError', 'Network error. Please try again.');
        } finally {
            this.hideLoading('loginBtn', 'Sign In');
        }
    }

    async signup() {
        const name = document.getElementById('signupName').value;
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;
        const confirmPassword = document.getElementById('signupConfirmPassword').value;

        if (!this.validateSignupForm(name, email, password, confirmPassword)) {
            return;
        }

        this.showLoading('signupBtn', 'Creating account...');

        try {
            const response = await fetch(`${this.apiBaseUrl}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, password })
            });

            const data = await response.json();

            if (response.ok) {
                this.showSuccess('signupSuccess', 'Account created successfully! Please check your email to verify your account.');
                setTimeout(() => {
                    this.showLoginForm();
                }, 2000);
            } else {
                this.showError('signupError', data.message || 'Registration failed');
            }
        } catch (error) {
            console.error('Signup error:', error);
            this.showError('signupError', 'Network error. Please try again.');
        } finally {
            this.hideLoading('signupBtn', 'Create Account');
        }
    }

    async forgotPassword() {
        const email = document.getElementById('forgotPasswordEmail').value;

        if (!this.validateEmail(email)) {
            this.showError('forgotPasswordError', 'Please enter a valid email address');
            return;
        }

        this.showLoading('forgotPasswordBtn', 'Sending...');

        try {
            const response = await fetch(`${this.apiBaseUrl}/auth/forgot-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            });

            const data = await response.json();

            if (response.ok) {
                this.showSuccess('forgotPasswordSuccess', 'Password reset instructions have been sent to your email.');
                document.getElementById('forgotPasswordForm').reset();
            } else {
                this.showError('forgotPasswordError', data.message || 'Failed to send reset email');
            }
        } catch (error) {
            console.error('Forgot password error:', error);
            this.showError('forgotPasswordError', 'Network error. Please try again.');
        } finally {
            this.hideLoading('forgotPasswordBtn', 'Send Reset Link');
        }
    }

    async resetPassword() {
        const token = new URLSearchParams(window.location.search).get('token');
        const password = document.getElementById('resetPassword').value;
        const confirmPassword = document.getElementById('resetConfirmPassword').value;

        if (!token) {
            this.showError('resetPasswordError', 'Invalid reset token');
            return;
        }

        if (!this.validatePassword(password, confirmPassword)) {
            return;
        }

        this.showLoading('resetPasswordBtn', 'Resetting...');

        try {
            const response = await fetch(`${this.apiBaseUrl}/auth/reset-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ token, password })
            });

            const data = await response.json();

            if (response.ok) {
                this.showSuccess('resetPasswordSuccess', 'Password reset successfully! You can now login with your new password.');
                setTimeout(() => {
                    this.showLoginForm();
                }, 2000);
            } else {
                this.showError('resetPasswordError', data.message || 'Password reset failed');
            }
        } catch (error) {
            console.error('Reset password error:', error);
            this.showError('resetPasswordError', 'Network error. Please try again.');
        } finally {
            this.hideLoading('resetPasswordBtn', 'Reset Password');
        }
    }

    handleSuccessfulAuth(data) {
        this.token = data.token;
        this.currentUser = data.user;
        this.isAuthenticated = true;
        
        localStorage.setItem('authToken', this.token);
        localStorage.setItem('userData', JSON.stringify(data.user));
        
        this.showMainApp();
        this.updateUserInterface();
    }

    logout() {
        this.clearAuth();
        this.showAuthForms();
        window.location.reload();
    }

    clearAuth() {
        this.token = null;
        this.currentUser = null;
        this.isAuthenticated = false;
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
    }

    // Form Validation Methods
    validateLoginForm(email, password) {
        if (!email || !password) {
            this.showError('loginError', 'Please fill in all fields');
            return false;
        }
        if (!this.validateEmail(email)) {
            this.showError('loginError', 'Please enter a valid email address');
            return false;
        }
        return true;
    }

    validateSignupForm(name, email, password, confirmPassword) {
        if (!name || !email || !password || !confirmPassword) {
            this.showError('signupError', 'Please fill in all fields');
            return false;
        }
        if (name.length < 2) {
            this.showError('signupError', 'Name must be at least 2 characters long');
            return false;
        }
        if (!this.validateEmail(email)) {
            this.showError('signupError', 'Please enter a valid email address');
            return false;
        }
        if (!this.validatePassword(password, confirmPassword)) {
            return false;
        }
        return true;
    }

    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    validatePassword(password, confirmPassword) {
        if (password.length < 6) {
            this.showError('signupError', 'Password must be at least 6 characters long');
            return false;
        }
        if (password !== confirmPassword) {
            this.showError('signupError', 'Passwords do not match');
            return false;
        }
        return true;
    }

    // UI Methods
    showAuthForms() {
        document.getElementById('authContainer').classList.remove('d-none');
        document.getElementById('mainApp').classList.add('d-none');
        this.showLoginForm();
    }

    showMainApp() {
        document.getElementById('authContainer').classList.add('d-none');
        document.getElementById('mainApp').classList.remove('d-none');
    }

    showLoginForm() {
        document.getElementById('loginForm').classList.remove('d-none');
        document.getElementById('signupForm').classList.add('d-none');
        document.getElementById('forgotPasswordForm').classList.add('d-none');
        document.getElementById('resetPasswordForm').classList.add('d-none');
    }

    showSignupForm() {
        document.getElementById('loginForm').classList.add('d-none');
        document.getElementById('signupForm').classList.remove('d-none');
        document.getElementById('forgotPasswordForm').classList.add('d-none');
        document.getElementById('resetPasswordForm').classList.add('d-none');
    }

    showForgotPasswordForm() {
        document.getElementById('loginForm').classList.add('d-none');
        document.getElementById('signupForm').classList.add('d-none');
        document.getElementById('forgotPasswordForm').classList.remove('d-none');
        document.getElementById('resetPasswordForm').classList.add('d-none');
    }

    showResetPasswordForm() {
        document.getElementById('loginForm').classList.add('d-none');
        document.getElementById('signupForm').classList.add('d-none');
        document.getElementById('forgotPasswordForm').classList.add('d-none');
        document.getElementById('resetPasswordForm').classList.remove('d-none');
    }

    updateUserInterface() {
        if (this.currentUser) {
            document.getElementById('userName').textContent = this.currentUser.name;
        }
    }

    showLoading(buttonId, text) {
        const button = document.getElementById(buttonId);
        if (button) {
            button.disabled = true;
            button.innerHTML = `<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>${text}`;
        }
    }

    hideLoading(buttonId, text) {
        const button = document.getElementById(buttonId);
        if (button) {
            button.disabled = false;
            button.textContent = text;
        }
    }

    showError(elementId, message) {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = message;
            element.classList.remove('d-none');
            setTimeout(() => {
                element.classList.add('d-none');
            }, 5000);
        }
    }

    showSuccess(elementId, message) {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = message;
            element.classList.remove('d-none');
            setTimeout(() => {
                element.classList.add('d-none');
            }, 5000);
        }
    }

    // Check if we're on reset password page
    checkResetPasswordPage() {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        if (token) {
            this.showResetPasswordForm();
        }
    }
}

// Initialize authentication when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.authManager = new AuthManager();
}); 