<script src="js/sctipt.js">

    document.addEventListener("DOMContentLoaded", function () {
      // Theme Toggle Functionality
      const themeToggle = document.getElementById("theme-toggle");
      const themeIcon = themeToggle.querySelector("i");
      const authContainer = document.getElementById("auth-container");
      const body = document.body;

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
      const dashboard = document.getElementById("dashboard");
      const backToAuth = document.getElementById("back-to-auth");
      const successTitle = document.getElementById("success-title");
      const successText = document.getElementById("success-text");
      const logoutBtn = document.getElementById("logout-btn");

      // Dashboard elements
      const userAvatar = document.getElementById("user-avatar");
      const userName = document.getElementById("user-name");
      const userEmail = document.getElementById("user-email");

      // Function to toggle between auth and dashboard mode
      function setAuthMode(isDashboard) {
        if (isDashboard) {
          authContainer.classList.add("dashboard-mode");
          body.classList.add("dashboard-active");
        } else {
          authContainer.classList.remove("dashboard-mode");
          body.classList.remove("dashboard-active");
        }
      }

      // Toggle between forms
      function showLogin() {
        loginTab.classList.add("active");
        signupTab.classList.remove("active");
        loginForm.classList.add("active");
        signupForm.classList.remove("active");
        successMessage.classList.remove("active");
        dashboard.classList.remove("active");
        document.querySelector(".auth-tabs").style.display = "flex";
        setAuthMode(false);
        clearErrors();
      }

      function showSignup() {
        signupTab.classList.add("active");
        loginTab.classList.remove("active");
        signupForm.classList.add("active");
        loginForm.classList.remove("active");
        successMessage.classList.remove("active");
        dashboard.classList.remove("active");
        document.querySelector(".auth-tabs").style.display = "flex";
        setAuthMode(false);
        clearErrors();
      }

      function showDashboard(userData) {
        // Update dashboard with user data
        if (userData) {
          const firstName = userData.firstName || "John";
          const lastName = userData.lastName || "Doe";
          const email = userData.email || "john.doe@example.com";

          // Set avatar initials
          userAvatar.textContent = (firstName[0] + lastName[0]).toUpperCase();
          userName.textContent = `${firstName} ${lastName}`;
          userEmail.innerHTML = `<i class="fas fa-envelope"></i> ${email}`;

          // Update stats based on user data or use defaults with animation
          const projectsEl = document.getElementById("stat-projects");
          const tasksEl = document.getElementById("stat-tasks");
          const teamEl = document.getElementById("stat-team");

          // Animate number change
          animateNumber(projectsEl, projectsEl.textContent, userData.projects || "12");
          animateNumber(tasksEl, tasksEl.textContent, userData.tasks || "48");
          animateNumber(teamEl, teamEl.textContent, userData.team || "5");
        }

        // Hide all other sections and show dashboard
        loginForm.classList.remove("active");
        signupForm.classList.remove("active");
        successMessage.classList.remove("active");
        dashboard.classList.add("active");

        // Hide tabs when dashboard is shown
        document.querySelector(".auth-tabs").style.display = "none";

        // Switch to dashboard mode
        setAuthMode(true);

        // Create particle effect
        createParticles();
      }

      // Animate number change
      function animateNumber(element, start, end) {
        start = parseInt(start) || 0;
        end = parseInt(end) || 0;
        const duration = 1000;
        const steps = 60;
        const increment = (end - start) / steps;
        let current = start;

        const timer = setInterval(() => {
          current += increment;
          if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
            element.textContent = end;
            clearInterval(timer);
          } else {
            element.textContent = Math.round(current);
          }
        }, duration / steps);
      }

      // Create particle effect for dashboard
      function createParticles() {
        const dashboardHeader = document.querySelector('.dashboard-header');
        if (!dashboardHeader) return;

        for (let i = 0; i < 20; i++) {
          const particle = document.createElement('div');
          particle.className = 'particle';
          particle.style.left = Math.random() * 100 + '%';
          particle.style.top = Math.random() * 100 + '%';
          particle.style.width = Math.random() * 10 + 5 + 'px';
          particle.style.height = particle.style.width;
          particle.style.animationDelay = Math.random() * 2 + 's';
          particle.style.animationDuration = Math.random() * 3 + 2 + 's';
          dashboardHeader.appendChild(particle);

          // Remove particle after animation
          setTimeout(() => {
            particle.remove();
          }, 5000);
        }
      }

      loginTab.addEventListener("click", showLogin);
      signupTab.addEventListener("click", showSignup);

      backToAuth.addEventListener("click", function () {
        showLogin();
      });

      // Logout functionality with animation
      logoutBtn.addEventListener("click", function () {
        // Show logout animation
        this.style.transform = "scale(0.95)";
        setTimeout(() => {
          this.style.transform = "scale(1)";
          showLogin();

          // Show logout message
          successTitle.textContent = "Logged Out!";
          successText.textContent = "You have been successfully logged out.";
          successMessage.classList.add("active");
          dashboard.classList.remove("active");

          // Hide success message after 3 seconds
          setTimeout(() => {
            successMessage.classList.remove("active");
          }, 3000);
        }, 200);
      });

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
        if (element) {
          element.textContent = message;
          element.classList.add("show");
          const inputId = elementId.replace("-error", "");
          const input = document.getElementById(inputId);
          if (input) {
            input.classList.add("error");
          }
        }
      }

      function clearError(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
          element.classList.remove("show");
          const inputId = elementId.replace("-error", "");
          const input = document.getElementById(inputId);
          if (input) {
            input.classList.remove("error");
          }
        }
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
        return password.length >= 6;
      }

      function validateName(name) {
        return name.trim().length >= 2;
      }

      function validatePhone(phone) {
        const re = /^[\d\s\-\(\)]+$/;
        return re.test(phone) || phone === "";
      }

      function validateDOB(dob) {
        if (!dob) return true;
        const birthDate = new Date(dob);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        return age >= 18;
      }

      // Form submission handlers
      function setupFormSubmit(formId, validationFn, successCallback) {
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
          submitText.innerHTML = '<span class="spinner"></span> Processing...';

          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 1000));

          // Call success callback with form data
          const formData = {};
          if (formId === "login-form") {
            formData.email = document.getElementById("login-email").value;
            formData.firstName = "John"; // Default for demo
            formData.lastName = "Doe";
          } else {
            formData.firstName = document.getElementById("signup-first-name").value;
            formData.lastName = document.getElementById("signup-last-name").value;
            formData.email = document.getElementById("signup-email").value;
          }

          successCallback(formData);

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

      function showLoginSuccess(formData) {
        showDashboard({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          projects: "15",
          tasks: "52",
          team: "6"
        });
      }

      // Signup validation
      function validateSignup() {
        clearErrors();
        let isValid = true;

        const firstName = document.getElementById("signup-first-name").value.trim();
        const lastName = document.getElementById("signup-last-name").value.trim();
        const email = document.getElementById("signup-email").value.trim();
        const phone = document.getElementById("signup-phone").value.trim();
        const dob = document.getElementById("signup-dob").value;
        const password = document.getElementById("signup-password").value;
        const confirmPassword = document.getElementById(
          "signup-confirm-password",
        ).value;
        const terms = document.getElementById("terms").checked;

        if (!firstName || !validateName(firstName)) {
          showError("signup-first-name-error", "First name is required (min 2 characters)");
          isValid = false;
        }

        if (!lastName || !validateName(lastName)) {
          showError("signup-last-name-error", "Last name is required (min 2 characters)");
          isValid = false;
        }

        if (!email || !validateEmail(email)) {
          showError("signup-email-error", "Please enter a valid email address");
          isValid = false;
        }

        if (phone && !validatePhone(phone)) {
          showError("signup-phone-error", "Please enter a valid phone number");
          isValid = false;
        }

        if (dob && !validateDOB(dob)) {
          showError("signup-dob-error", "Must be 18+ years old");
          isValid = false;
        }

        if (!password || !validatePassword(password)) {
          showError(
            "signup-password-error",
            "Password must be at least 6 characters",
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

      function showSignupSuccess(formData) {
        showDashboard({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          projects: "0",
          tasks: "0",
          team: "1"
        });
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
        if (input) {
          input.addEventListener("blur", function () {
            if (this.value && !validationFn(this.value)) {
              showError(errorId, errorMessage);
            } else {
              clearError(errorId);
            }
          });
        }
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
        "signup-first-name",
        validateName,
        "signup-first-name-error",
        "First name must be at least 2 characters",
      );
      setupRealTimeValidation(
        "signup-last-name",
        validateName,
        "signup-last-name-error",
        "Last name must be at least 2 characters",
      );
      setupRealTimeValidation(
        "signup-password",
        validatePassword,
        "signup-password-error",
        "Password must be at least 6 characters",
      );
      setupRealTimeValidation(
        "signup-phone",
        validatePhone,
        "signup-phone-error",
        "Valid phone number required",
      );

      // DOB validation
      const dobInput = document.getElementById("signup-dob");
      if (dobInput) {
        dobInput.addEventListener("change", function () {
          if (this.value && !validateDOB(this.value)) {
            showError("signup-dob-error", "Must be 18+ years old");
          } else {
            clearError("signup-dob-error");
          }
        });
      }

      // Confirm password validation
      const confirmPassword = document.getElementById("signup-confirm-password");
      if (confirmPassword) {
        confirmPassword.addEventListener("blur", function () {
          const password = document.getElementById("signup-password").value;
          if (password && this.value && password !== this.value) {
            showError("signup-confirm-password-error", "Passwords do not match");
          } else {
            clearError("signup-confirm-password-error");
          }
        });
      }

      // Terms checkbox validation
      const termsCheckbox = document.getElementById("terms");
      if (termsCheckbox) {
        termsCheckbox.addEventListener("change", function () {
          if (!this.checked) {
            showError("terms-error", "You must agree to the terms");
          } else {
            clearError("terms-error");
          }
        });
      }

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

          // Show demo message and simulate login
          showDashboard({
            firstName: "Demo",
            lastName: "User",
            email: `demo@${provider.toLowerCase()}.com`,
            projects: "8",
            tasks: "23",
            team: "3"
          });
        });
      });

      // Forgot password
      const forgotPassword = document.getElementById("forgot-password");
      if (forgotPassword) {
        forgotPassword.addEventListener("click", function (e) {
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
      }

      // Dashboard buttons
      document.getElementById("profile-btn").addEventListener("click", function () {
        alert("Profile page would open here. This is a demo.");
      });

      document.getElementById("settings-btn").addEventListener("click", function () {
        alert("Settings page would open here. This is a demo.");
      });

      document.getElementById("new-project-btn").addEventListener("click", function () {
        alert("New project creation form would open here. This is a demo.");
      });

      // Enhanced form interactions
      document.querySelectorAll('.form-input').forEach(input => {
        input.addEventListener('focus', function () {
          this.parentElement.classList.add('focus');
        });

        input.addEventListener('blur', function () {
          this.parentElement.classList.remove('focus');
        });
      });

      // Initialize with demo values for better UX
      function initDemoValues() {
        // Login form demo values
        const loginEmail = document.getElementById("login-email");
        const loginPassword = document.getElementById("login-password");
        if (loginEmail) loginEmail.value = "demo@example.com";
        if (loginPassword) loginPassword.value = "password123";

        // Signup form demo values
        const signupFirstName = document.getElementById("signup-first-name");
        const signupLastName = document.getElementById("signup-last-name");
        const signupEmail = document.getElementById("signup-email");
        const signupPhone = document.getElementById("signup-phone");
        const signupDob = document.getElementById("signup-dob");
        const signupPassword = document.getElementById("signup-password");
        const signupConfirmPassword = document.getElementById("signup-confirm-password");
        const terms = document.getElementById("terms");

        if (signupFirstName) signupFirstName.value = "John";
        if (signupLastName) signupLastName.value = "Doe";
        if (signupEmail) signupEmail.value = "john.doe@example.com";
        if (signupPhone) signupPhone.value = "(555) 123-4567";

        // Set date of birth to 25 years ago
        if (signupDob) {
          const dob = new Date();
          dob.setFullYear(dob.getFullYear() - 25);
          signupDob.valueAsDate = dob;
        }

        if (signupPassword) signupPassword.value = "SecurePass123";
        if (signupConfirmPassword) signupConfirmPassword.value = "SecurePass123";
        if (terms) terms.checked = true;
      }

      // Initialize demo values
      initDemoValues();
    });

  </script>