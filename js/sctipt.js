document.addEventListener("DOMContentLoaded", function () {
  // Theme Toggle Functionality
  const themeToggle = document.getElementById("theme-toggle");
  const themeIcon = themeToggle.querySelector("i");

  // Check for saved theme or prefer-color-scheme
  const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
  const currentTheme = localStorage.getItem("theme");

  if (currentTheme === "dark" || (!currentTheme && prefersDarkScheme.matches)) {
    document.documentElement.setAttribute("data-theme", "dark");
    themeIcon.className = "fas fa-sun";
  } else {
    document.documentElement.setAttribute("data-theme", "light");
    themeIcon.className = "fas fa-moon";
  }

  themeToggle.addEventListener("click", function () {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    let newTheme = "light";

    if (currentTheme === "light") {
      newTheme = "dark";
      themeIcon.className = "fas fa-sun";
    } else {
      newTheme = "light";
      themeIcon.className = "fas fa-moon";
    }

    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);

    // Add animation to toggle button
    themeToggle.style.transform = "scale(0.9)";
    setTimeout(() => {
      themeToggle.style.transform = "scale(1)";
    }, 150);
  });

  // DOM Elements
  const loginTab = document.getElementById("login-tab");
  const signupTab = document.getElementById("signup-tab");
  const loginForm = document.getElementById("login-form");
  const signupForm = document.getElementById("signup-form");
  const successMessage = document.getElementById("success-message");
  const backToAuth = document.getElementById("back-to-auth");
  const successTitle = document.getElementById("success-title");
  const successText = document.getElementById("success-text");

  // Toggle between forms
  function showLogin() {
    loginTab.classList.add("active");
    signupTab.classList.remove("active");
    loginForm.classList.add("active");
    signupForm.classList.remove("active");
    successMessage.classList.remove("active");
    clearErrors();
  }

  function showSignup() {
    signupTab.classList.add("active");
    loginTab.classList.remove("active");
    signupForm.classList.add("active");
    loginForm.classList.remove("active");
    successMessage.classList.remove("active");
    clearErrors();
  }

  loginTab.addEventListener("click", showLogin);
  signupTab.addEventListener("click", showSignup);
  backToAuth.addEventListener("click", showLogin);

  // Password toggle functionality
  function setupPasswordToggle(passwordId, toggleId) {
    const passwordInput = document.getElementById(passwordId);
    const toggleButton = document.getElementById(toggleId);

    toggleButton.addEventListener("click", function () {
      const type = passwordInput.type === "password" ? "text" : "password";
      passwordInput.type = type;
      const icon = this.querySelector("i");
      icon.className = type === "password" ? "fas fa-eye" : "fas fa-eye-slash";

      // Add animation
      this.style.transform = "translateY(-50%) scale(0.9)";
      setTimeout(() => {
        this.style.transform = "translateY(-50%) scale(1)";
      }, 150);
    });
  }

  setupPasswordToggle("login-password", "toggle-login-password");
  setupPasswordToggle("signup-password", "toggle-signup-password");

  // Error handling
  function showError(elementId, message) {
    const element = document.getElementById(elementId);
    element.textContent = message;
    element.classList.add("show");
    document
      .getElementById(elementId.replace("-error", ""))
      .classList.add("error");
  }

  function clearError(elementId) {
    const element = document.getElementById(elementId);
    element.classList.remove("show");
    document
      .getElementById(elementId.replace("-error", ""))
      .classList.remove("error");
  }

  function clearErrors() {
    const errors = document.querySelectorAll(".error-message");
    errors.forEach((error) => error.classList.remove("show"));
    const inputs = document.querySelectorAll(".form-input, .checkbox");
    inputs.forEach((input) => input.classList.remove("error"));
  }

  // Validation functions
  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  function validatePassword(password) {
    return /^(?=.*\d).{8,}$/.test(password);
  }

  function validateName(name) {
    return name.trim().length >= 2;
  }

  // Form submission handlers
  function setupFormSubmit(formId, validationFn, successMessageFn) {
    const form = document.getElementById(formId);
    const submitBtn = document.getElementById(
      formId.replace("-form", "-submit"),
    );
    const submitText = document.getElementById(
      formId.replace("-form", "-text"),
    );

    form.addEventListener("submit", async function (e) {
      e.preventDefault();

      if (!validationFn()) return;

      // Show loading state
      submitBtn.disabled = true;
      submitText.innerHTML = '<div class="spinner"></div> Processing...';

      // Simulate API call with a more realistic delay
      await new Promise((resolve) => setTimeout(resolve, 1800));

      // Show success
      successMessageFn();

      // Reset button
      submitBtn.disabled = false;
      submitText.textContent =
        submitText.id === "login-text" ? "Sign In" : "Create Account";
    });
  }

  // Login validation
  function validateLogin() {
    clearErrors();
    let isValid = true;

    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value;

    if (!email || !validateEmail(email)) {
      showError("login-email-error", "Please enter a valid email address");
      isValid = false;
    }

    if (!password) {
      showError("login-password-error", "Password is required");
      isValid = false;
    }

    return isValid;
  }

  function showLoginSuccess() {
    const email = document.getElementById("login-email").value;
    successTitle.textContent = "Welcome Back!";
    successText.textContent = `You have successfully logged in as ${email}. Redirecting to your dashboard...`;
    loginForm.classList.remove("active");
    successMessage.classList.add("active");
  }

  // Signup validation
  function validateSignup() {
    clearErrors();
    let isValid = true;

    const name = document.getElementById("signup-name").value.trim();
    const email = document.getElementById("signup-email").value.trim();
    const password = document.getElementById("signup-password").value;
    const confirmPassword = document.getElementById(
      "signup-confirm-password",
    ).value;
    const terms = document.getElementById("terms").checked;

    if (!name || !validateName(name)) {
      showError("signup-name-error", "Name must be at least 2 characters");
      isValid = false;
    }

    if (!email || !validateEmail(email)) {
      showError("signup-email-error", "Please enter a valid email address");
      isValid = false;
    }

    if (!password || !validatePassword(password)) {
      showError(
        "signup-password-error",
        "Password must be 8+ characters with at least one number",
      );
      isValid = false;
    }

    if (password !== confirmPassword) {
      showError("signup-confirm-password-error", "Passwords do not match");
      isValid = false;
    }

    if (!terms) {
      showError("terms-error", "You must agree to the terms and conditions");
      isValid = false;
    }

    return isValid;
  }

  function showSignupSuccess() {
    const email = document.getElementById("signup-email").value;
    successTitle.textContent = "Account Created!";
    successText.textContent = `Your account ${email} has been created successfully. Please check your email to verify your account.`;
    signupForm.classList.remove("active");
    successMessage.classList.add("active");
  }

  // Setup forms
  setupFormSubmit("login-form", validateLogin, showLoginSuccess);
  setupFormSubmit("signup-form", validateSignup, showSignupSuccess);

  // Real-time validation
  function setupRealTimeValidation(
    inputId,
    validationFn,
    errorId,
    errorMessage,
  ) {
    const input = document.getElementById(inputId);
    input.addEventListener("blur", function () {
      if (this.value && !validationFn(this.value)) {
        showError(errorId, errorMessage);
      } else {
        clearError(errorId);
      }
    });
  }

  setupRealTimeValidation(
    "login-email",
    validateEmail,
    "login-email-error",
    "Please enter a valid email address",
  );
  setupRealTimeValidation(
    "signup-email",
    validateEmail,
    "signup-email-error",
    "Please enter a valid email address",
  );
  setupRealTimeValidation(
    "signup-name",
    validateName,
    "signup-name-error",
    "Name must be at least 2 characters",
  );
  setupRealTimeValidation(
    "signup-password",
    validatePassword,
    "signup-password-error",
    "8+ characters with at least one number",
  );

  // Confirm password validation
  const confirmPassword = document.getElementById("signup-confirm-password");
  confirmPassword.addEventListener("blur", function () {
    const password = document.getElementById("signup-password").value;
    if (password && this.value && password !== this.value) {
      showError("signup-confirm-password-error", "Passwords do not match");
    } else {
      clearError("signup-confirm-password-error");
    }
  });

  // Social buttons
  document.querySelectorAll(".social-btn").forEach((button) => {
    button.addEventListener("click", function () {
      const provider = this.querySelector("i").className.includes("google")
        ? "Google"
        : this.querySelector("i").className.includes("facebook")
          ? "Facebook"
          : "Apple";

      // Add click animation
      this.style.transform = "translateY(0)";
      setTimeout(() => {
        this.style.transform = "translateY(-3px)";
      }, 150);

      // Show demo message
      alert(
        `${provider} authentication would be implemented here. This is a demo interface.`,
      );
    });
  });

  // Forgot password
  document
    .getElementById("forgot-password")
    .addEventListener("click", function (e) {
      e.preventDefault();
      const email = document.getElementById("login-email").value;
      if (email && validateEmail(email)) {
        alert(
          `Password reset instructions sent to ${email}. Check your email!`,
        );
      } else {
        alert("Please enter a valid email address first");
        document.getElementById("login-email").focus();
      }
    });

  // Add hover effects to cards and buttons
  const authCard = document.querySelector(".auth-card");
  authCard.addEventListener("mouseenter", () => {
    authCard.style.transform = "translateY(-5px)";
  });

  authCard.addEventListener("mouseleave", () => {
    authCard.style.transform = "translateY(0)";
  });

  // Initialize form with some demo values for testing
  document.getElementById("login-email").value = "demo@example.com";
  document.getElementById("login-password").value = "password123";

  document.getElementById("signup-name").value = "John Doe";
  document.getElementById("signup-email").value = "john.doe@example.com";
  document.getElementById("signup-password").value = "password123";
  document.getElementById("signup-confirm-password").value = "password123";
  document.getElementById("terms").checked = true;
});
