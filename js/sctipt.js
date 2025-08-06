document.addEventListener("DOMContentLoaded", function () {
  // DOM Elements
  const loginTab = document.getElementById("login-tab");
  const signupTab = document.getElementById("signup-tab");
  const loginForm = document.getElementById("login-form");
  const signupForm = document.getElementById("signup-form");
  const successMessage = document.getElementById("success-message");
  const backToAuth = document.getElementById("back-to-auth");
  const successText = document.getElementById("success-text");

  // Toggle password visibility
  const toggleLoginPassword = document.getElementById("toggle-login-password");
  const loginPassword = document.getElementById("login-password");
  const toggleSignupPassword = document.getElementById(
    "toggle-signup-password"
  );
  const signupPassword = document.getElementById("signup-password");

  // Form toggle functionality
  function showLogin() {
    loginTab.classList.add("bg-blue-600", "text-white");
    loginTab.classList.remove("text-gray-700");
    signupTab.classList.remove("bg-blue-600", "text-white");
    signupTab.classList.add("text-gray-700");
    loginForm.classList.remove("hidden");
    signupForm.classList.add("hidden");
    successMessage.classList.add("hidden");
  }

  function showSignup() {
    signupTab.classList.add("bg-blue-600", "text-white");
    signupTab.classList.remove("text-gray-700");
    loginTab.classList.remove("bg-blue-600", "text-white");
    loginTab.classList.add("text-gray-700");
    signupForm.classList.remove("hidden");
    loginForm.classList.add("hidden");
    successMessage.classList.add("hidden");
  }

  loginTab.addEventListener("click", showLogin);
  signupTab.addEventListener("click", showSignup);
  backToAuth.addEventListener("click", showLogin);

  // Toggle password visibility
  function togglePasswordVisibility(inputField, toggleButton) {
    const type =
      inputField.getAttribute("type") === "password" ? "text" : "password";
    inputField.setAttribute("type", type);

    // Toggle eye icon
    const icon = toggleButton.querySelector("i");
    if (type === "text") {
      icon.classList.remove("fa-eye");
      icon.classList.add("fa-eye-slash");
    } else {
      icon.classList.remove("fa-eye-slash");
      icon.classList.add("fa-eye");
    }
  }

  toggleLoginPassword.addEventListener("click", () => {
    togglePasswordVisibility(loginPassword, toggleLoginPassword);
  });

  toggleSignupPassword.addEventListener("click", () => {
    togglePasswordVisibility(signupPassword, toggleSignupPassword);
  });

  // Form submission handling
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    // Simple validation
    if (!email || !password) {
      alert("Please fill in all fields");
      return;
    }

    // Here you would typically make an API call to your backend
    // For demo purposes, we'll simulate a successful login
    simulateAuth("login", email);
  });

  signupForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("signup-name").value;
    const email = document.getElementById("signup-email").value;
    const password = document.getElementById("signup-password").value;
    const confirmPassword = document.getElementById("signup-confirm-password").value;
    const terms = document.getElementById("terms").checked;

    // Validation
    if (!name || !email || !password || !confirmPassword) {
      alert("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      alert("Password must be at least 8 characters long");
      return;
    }

    if (!/\d/.test(password)) {
      alert("Password must contain at least one number");
      return;
    }

    if (!terms) {
      alert("You must agree to the terms and conditions");
      return;
    }

    // Here you would typically make an API call to your backend
    // For demo purposes, we'll simulate a successful signup
    simulateAuth("signup", email);
  });

  // Simulate authentication (replace with actual API calls)
  function simulateAuth(type, email) {
    // Hide both forms
    loginForm.classList.add("hidden");
    signupForm.classList.add("hidden");

    // Show success message
    if (type === "login") {
      successText.textContent = `Welcome back! You have successfully logged in as ${email}`;
    } else {
      successText.textContent = `Congratulations! Your account ${email} has been created successfully.`;
    }

    successMessage.classList.remove("hidden");

    // In a real app, you would redirect or set user session here
  }

  // Social login buttons (placeholder functionality)
  document.querySelectorAll(".social-btn").forEach((button) => {
    button.addEventListener("click", function () {
      const provider = this.querySelector("i").classList.contains("fa-google")
        ? "Google"
        : this.querySelector("i").classList.contains("fa-facebook-f")
        ? "Facebook"
        : "Apple";
      alert(`${provider} login would be implemented here`);
    });
  });

  // Initialize with login form shown
  showLogin();
});
