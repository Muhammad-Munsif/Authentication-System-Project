document.addEventListener("DOMContentLoaded", function () {
  // DOM Elements
  const loginTab = document.getElementById("login-tab");
  const signupTab = document.getElementById("signup-tab");
  const loginForm = document.getElementById("login-form");
  const signupForm = document.getElementById("signup-form");
  const successMessage = document.getElementById("success-message");
  const backToAuth = document.getElementById("back-to-auth");
  const successText = document.getElementById("success-text");

  // Submit buttons
  const loginSubmit = document.getElementById("login-submit");
  const signupSubmit = document.getElementById("signup-submit");
  const loginText = document.getElementById("login-text");
  const signupText = document.getElementById("signup-text");

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

    // Clear any previous errors
    clearErrors();
  }

  function showSignup() {
    signupTab.classList.add("bg-blue-600", "text-white");
    signupTab.classList.remove("text-gray-700");
    loginTab.classList.remove("bg-blue-600", "text-white");
    loginTab.classList.add("text-gray-700");
    signupForm.classList.remove("hidden");
    loginForm.classList.add("hidden");
    successMessage.classList.add("hidden");

    // Clear any previous errors
    clearErrors();
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

  // Error handling functions
  function showError(inputId, message) {
    const errorElement = document.getElementById(`${inputId}-error`);
    const inputElement = document.getElementById(inputId);

    errorElement.textContent = message;
    errorElement.style.display = "block";
    inputElement.classList.add("input-error");
  }

  function clearError(inputId) {
    const errorElement = document.getElementById(`${inputId}-error`);
    const inputElement = document.getElementById(inputId);

    errorElement.textContent = "";
    errorElement.style.display = "none";
    inputElement.classList.remove("input-error");
  }

  function clearErrors() {
    // Clear all error messages
    const errorElements = document.querySelectorAll(".error-message");
    errorElements.forEach((element) => {
      element.textContent = "";
      element.style.display = "none";
    });

    // Remove error styling from inputs
    const inputElements = document.querySelectorAll("input");
    inputElements.forEach((input) => {
      input.classList.remove("input-error");
    });
  }

  // Validation functions
  function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  function validatePassword(password) {
    // At least 8 characters with at least one number
    const passwordRegex = /^(?=.*\d).{8,}$/;
    return passwordRegex.test(password);
  }

  function validateName(name) {
    return name.trim().length >= 2;
  }

  // Form submission handling
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // Clear previous errors
    clearErrors();

    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value;

    // Validation
    let isValid = true;

    if (!email) {
      showError("login-email", "Email is required");
      isValid = false;
    } else if (!validateEmail(email)) {
      showError("login-email", "Please enter a valid email address");
      isValid = false;
    }

    if (!password) {
      showError("login-password", "Password is required");
      isValid = false;
    }

    if (!isValid) return;

    // Show loading state
    loginSubmit.classList.add("loading");
    loginText.innerHTML = '<div class="spinner"></div> Logging in...';

    // Here you would typically make an API call to your backend
    // For demo purposes, we'll simulate a successful login after a delay
    setTimeout(() => {
      simulateAuth("login", email);

      // Reset loading state
      loginSubmit.classList.remove("loading");
      loginText.textContent = "Login";
    }, 1500);
  });

  signupForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // Clear previous errors
    clearErrors();

    const name = document.getElementById("signup-name").value.trim();
    const email = document.getElementById("signup-email").value.trim();
    const password = document.getElementById("signup-password").value;
    const confirmPassword = document.getElementById(
      "signup-confirm-password"
    ).value;
    const terms = document.getElementById("terms").checked;

    // Validation
    let isValid = true;

    if (!name) {
      showError("signup-name", "Full name is required");
      isValid = false;
    } else if (!validateName(name)) {
      showError("signup-name", "Name must be at least 2 characters long");
      isValid = false;
    }

    if (!email) {
      showError("signup-email", "Email is required");
      isValid = false;
    } else if (!validateEmail(email)) {
      showError("signup-email", "Please enter a valid email address");
      isValid = false;
    }

    if (!password) {
      showError("signup-password", "Password is required");
      isValid = false;
    } else if (!validatePassword(password)) {
      showError(
        "signup-password",
        "Password must be at least 8 characters with at least one number"
      );
      isValid = false;
    }

    if (!confirmPassword) {
      showError("signup-confirm-password", "Please confirm your password");
      isValid = false;
    } else if (password !== confirmPassword) {
      showError("signup-confirm-password", "Passwords do not match");
      isValid = false;
    }

    if (!terms) {
      showError("terms", "You must agree to the terms and conditions");
      isValid = false;
    }

    if (!isValid) return;

    // Show loading state
    signupSubmit.classList.add("loading");
    signupText.innerHTML = '<div class="spinner"></div> Creating account...';

    // Here you would typically make an API call to your backend
    // For demo purposes, we'll simulate a successful signup after a delay
    setTimeout(() => {
      simulateAuth("signup", email);

      // Reset loading state
      signupSubmit.classList.remove("loading");
      signupText.textContent = "Sign Up";
    }, 1500);
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

  // Real-time validation for better UX
  document.getElementById("login-email").addEventListener("blur", function () {
    const email = this.value.trim();
    if (email && !validateEmail(email)) {
      showError("login-email", "Please enter a valid email address");
    } else {
      clearError("login-email");
    }
  });

  document.getElementById("signup-email").addEventListener("blur", function () {
    const email = this.value.trim();
    if (email && !validateEmail(email)) {
      showError("signup-email", "Please enter a valid email address");
    } else {
      clearError("signup-email");
    }
  });

  document
    .getElementById("signup-password")
    .addEventListener("blur", function () {
      const password = this.value;
      if (password && !validatePassword(password)) {
        showError(
          "signup-password",
          "Password must be at least 8 characters with at least one number"
        );
      } else {
        clearError("signup-password");
      }
    });

  document
    .getElementById("signup-confirm-password")
    .addEventListener("blur", function () {
      const password = document.getElementById("signup-password").value;
      const confirmPassword = this.value;
      if (password && confirmPassword && password !== confirmPassword) {
        showError("signup-confirm-password", "Passwords do not match");
      } else {
        clearError("signup-confirm-password");
      }
    });

  // Initialize with login form shown
  showLogin();
});
