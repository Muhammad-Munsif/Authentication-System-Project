
    // Projects Data
    const projectsData = [
      {
        id: 1,
        title: "AuthFlow Authentication System",
        description: "A secure authentication system with JWT tokens, OAuth2 integration, and multi-factor authentication support.",
        icon: "fa-lock",
        status: "active",
        progress: 75,
        startDate: "2024-01-15",
        endDate: "2024-03-30",
        team: ["John Doe", "Jane Smith", "Mike Johnson"],
        tasks: [
          { id: 1, text: "Design database schema", completed: true, priority: "high" },
          { id: 2, text: "Implement JWT authentication", completed: true, priority: "high" },
          { id: 3, text: "Create login/signup UI", completed: true, priority: "medium" },
          { id: 4, text: "Add OAuth2 providers", completed: false, priority: "high" },
          { id: 5, text: "Implement MFA", completed: false, priority: "medium" },
          { id: 6, text: "Write documentation", completed: false, priority: "low" }
        ]
      },
      {
        id: 2,
        title: "E-commerce Platform",
        description: "Full-featured e-commerce platform with product management, shopping cart, payment integration, and order tracking.",
        icon: "fa-shopping-cart",
        status: "active",
        progress: 45,
        startDate: "2024-02-01",
        endDate: "2024-05-15",
        team: ["Sarah Wilson", "Tom Brown", "Emily Davis"],
        tasks: [
          { id: 1, text: "Setup product catalog", completed: true, priority: "high" },
          { id: 2, text: "Implement shopping cart", completed: true, priority: "high" },
          { id: 3, text: "Integrate payment gateway", completed: false, priority: "high" },
          { id: 4, text: "Create user dashboard", completed: false, priority: "medium" },
          { id: 5, text: "Add order tracking", completed: false, priority: "medium" },
          { id: 6, text: "Implement reviews system", completed: false, priority: "low" }
        ]
      },
      {
        id: 3,
        title: "Mobile App Development",
        description: "Cross-platform mobile application for task management with real-time sync and push notifications.",
        icon: "fa-mobile-alt",
        status: "pending",
        progress: 20,
        startDate: "2024-03-01",
        endDate: "2024-06-30",
        team: ["Alex Chen", "Maria Garcia", "David Kim"],
        tasks: [
          { id: 1, text: "Design UI/UX mockups", completed: true, priority: "high" },
          { id: 2, text: "Setup React Native project", completed: true, priority: "high" },
          { id: 3, text: "Implement navigation", completed: false, priority: "medium" },
          { id: 4, text: "Add task management features", completed: false, priority: "high" },
          { id: 5, text: "Implement push notifications", completed: false, priority: "medium" },
          { id: 6, text: "Test on multiple devices", completed: false, priority: "low" }
        ]
      },
      {
        id: 4,
        title: "AI Chatbot Integration",
        description: "Intelligent chatbot using OpenAI GPT-4 for customer support automation and lead generation.",
        icon: "fa-robot",
        status: "completed",
        progress: 100,
        startDate: "2023-12-01",
        endDate: "2024-02-28",
        team: ["Lisa Wang", "Robert Taylor", "Anna Martinez"],
        tasks: [
          { id: 1, text: "Research AI models", completed: true, priority: "high" },
          { id: 2, text: "Setup OpenAI API", completed: true, priority: "high" },
          { id: 3, text: "Train custom model", completed: true, priority: "high" },
          { id: 4, text: "Integrate with website", completed: true, priority: "medium" },
          { id: 5, text: "Add analytics dashboard", completed: true, priority: "low" },
          { id: 6, text: "Deploy to production", completed: true, priority: "high" }
        ]
      }
    ];

    // Function to render projects
    function renderProjects() {
      const projectsGrid = document.getElementById('projects-grid');
      if (!projectsGrid) return;

      projectsGrid.innerHTML = projectsData.map(project => `
        <div class="project-card" onclick="openProjectModal(${project.id})">
          <div class="project-icon">
            <i class="fas ${project.icon}"></i>
          </div>
          <h3 class="project-title">${project.title}</h3>
          <p class="project-description">${project.description.substring(0, 100)}${project.description.length > 100 ? '...' : ''}</p>
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${project.progress}%"></div>
          </div>
          <div class="project-meta">
            <span class="project-status status-${project.status}">
              ${project.status === 'active' ? 'Active' : project.status === 'pending' ? 'Pending' : 'Completed'}
            </span>
            <span>${project.progress}% Complete</span>
          </div>
        </div>
      `).join('');

      // Update stats
      document.getElementById('stat-projects').textContent = projectsData.length;
      const totalTasks = projectsData.reduce((sum, project) => sum + project.tasks.length, 0);
      document.getElementById('stat-tasks').textContent = totalTasks;
    }

    // Function to open project modal
    window.openProjectModal = function(projectId) {
      const project = projectsData.find(p => p.id === projectId);
      if (!project) return;

      const modal = document.getElementById('project-modal');
      const modalTitle = document.getElementById('modal-project-title');
      const modalBody = document.getElementById('modal-body');

      modalTitle.textContent = project.title;

      // Calculate task completion
      const completedTasks = project.tasks.filter(task => task.completed).length;
      const completionPercentage = Math.round((completedTasks / project.tasks.length) * 100);

      modalBody.innerHTML = `
        <div class="project-detail">
          <h3><i class="fas fa-info-circle"></i> Description</h3>
          <p>${project.description}</p>
        </div>

        <div class="project-detail">
          <h3><i class="fas fa-calendar-alt"></i> Timeline</h3>
          <p><strong>Start Date:</strong> ${new Date(project.startDate).toLocaleDateString()}</p>
          <p><strong>End Date:</strong> ${new Date(project.endDate).toLocaleDateString()}</p>
          <div class="progress-bar" style="margin-top: 10px;">
            <div class="progress-fill" style="width: ${completionPercentage}%"></div>
          </div>
          <p style="margin-top: 8px;"><strong>Overall Progress:</strong> ${completionPercentage}%</p>
        </div>

        <div class="project-detail">
          <h3><i class="fas fa-users"></i> Team Members</h3>
          <p>${project.team.map(member => `<span class="badge" style="background: var(--bg-secondary); padding: 4px 12px; border-radius: var(--radius-full); margin-right: 8px;">${member}</span>`).join('')}</p>
        </div>

        <div class="project-detail">
          <h3><i class="fas fa-tasks"></i> Tasks (${completedTasks}/${project.tasks.length} completed)</h3>
          <ul class="task-list">
            ${project.tasks.map(task => `
              <li class="task-item">
                <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} onchange="toggleTask(${project.id}, ${task.id})">
                <span class="task-text ${task.completed ? 'completed' : ''}">${task.text}</span>
                <span class="task-priority priority-${task.priority}">${task.priority.toUpperCase()}</span>
              </li>
            `).join('')}
          </ul>
        </div>
      `;

      // Add edit button functionality
      const editBtn = document.getElementById('edit-project-btn');
      editBtn.onclick = () => editProject(project.id);

      modal.classList.add('active');
    }

    // Function to close modal
    window.closeProjectModal = function() {
      const modal = document.getElementById('project-modal');
      modal.classList.remove('active');
    }

    // Function to toggle task completion
    window.toggleTask = function(projectId, taskId) {
      const project = projectsData.find(p => p.id === projectId);
      if (project) {
        const task = project.tasks.find(t => t.id === taskId);
        if (task) {
          task.completed = !task.completed;
          
          // Update project progress
          const completedTasks = project.tasks.filter(t => t.completed).length;
          project.progress = Math.round((completedTasks / project.tasks.length) * 100);
          
          // Re-render projects and refresh modal
          renderProjects();
          openProjectModal(projectId);
        }
      }
    }

    // Function to edit project
    window.editProject = function(projectId) {
      const project = projectsData.find(p => p.id === projectId);
      if (project) {
        const newTitle = prompt('Edit Project Title:', project.title);
        if (newTitle && newTitle.trim()) {
          project.title = newTitle.trim();
          renderProjects();
          openProjectModal(projectId);
          showNotification('Project updated successfully!', 'success');
        }
      }
    }

    // Function to show notification
    function showNotification(message, type = 'info') {
      const notification = document.createElement('div');
      notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        background: ${type === 'success' ? 'var(--success)' : 'var(--info)'};
        color: white;
        border-radius: var(--radius-md);
        box-shadow: var(--shadow-lg);
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
      `;
      notification.innerHTML = `<i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-info-circle'}"></i> ${message}`;
      document.body.appendChild(notification);
      
      setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
      }, 3000);
    }

    // Close modal when clicking outside
    window.onclick = function(event) {
      const modal = document.getElementById('project-modal');
      if (event.target === modal) {
        closeProjectModal();
      }
    }

    // Theme toggle and other existing functionality
    document.addEventListener("DOMContentLoaded", function () {
      // Theme Toggle Functionality
      const themeToggle = document.getElementById("theme-toggle");
      const themeIcon = themeToggle.querySelector("i");

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
      const logoutBtn = document.getElementById("logout-btn");

      // Dashboard elements
      const userAvatar = document.getElementById("user-avatar");
      const userName = document.getElementById("user-name");
      const userEmail = document.getElementById("user-email");

      // Function to toggle between auth and dashboard mode
      function setAuthMode(isDashboard) {
        const authContainer = document.getElementById("auth-container");
        const body = document.body;
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
        if (userData) {
          const firstName = userData.firstName || "John";
          const lastName = userData.lastName || "Doe";
          const email = userData.email || "john.doe@example.com";

          userAvatar.textContent = (firstName[0] + lastName[0]).toUpperCase();
          userName.textContent = `${firstName} ${lastName}`;
          userEmail.innerHTML = `<i class="fas fa-envelope"></i> ${email}`;
        }

        loginForm.classList.remove("active");
        signupForm.classList.remove("active");
        successMessage.classList.remove("active");
        dashboard.classList.add("active");
        document.querySelector(".auth-tabs").style.display = "none";
        setAuthMode(true);
        
        // Render projects
        renderProjects();
      }

      loginTab.addEventListener("click", showLogin);
      signupTab.addEventListener("click", showSignup);

      backToAuth.addEventListener("click", function () {
        showLogin();
      });

      logoutBtn.addEventListener("click", function () {
        this.style.transform = "scale(0.95)";
        setTimeout(() => {
          this.style.transform = "scale(1)";
          showLogin();
          successTitle.textContent = "Logged Out!";
          successText.textContent = "You have been successfully logged out.";
          successMessage.classList.add("active");
          dashboard.classList.remove("active");

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

          this.style.transform = "translateY(-50%) scale(0.9)";
          setTimeout(() => {
            this.style.transform = "translateY(-50%) scale(1)";
          }, 150);
        });
      }

      setupPasswordToggle("login-password", "toggle-login-password");
      setupPasswordToggle("signup-password", "toggle-signup-password");

      // Error handling functions
      function showError(elementId, message) {
        const element = document.getElementById(elementId);
        if (element) {
          element.textContent = message;
          element.classList.add("show");
        }
      }

      function clearError(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
          element.classList.remove("show");
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

      // Form submission handlers
      function setupFormSubmit(formId, validationFn, successCallback) {
        const form = document.getElementById(formId);
        const submitBtn = document.getElementById(formId.replace("-form", "-submit"));
        const submitText = document.getElementById(formId.replace("-form", "-text"));

        form.addEventListener("submit", async function (e) {
          e.preventDefault();

          if (!validationFn()) return;

          submitBtn.disabled = true;
          submitText.innerHTML = '<span class="spinner"></span> Processing...';

          await new Promise((resolve) => setTimeout(resolve, 1000));

          const formData = {};
          if (formId === "login-form") {
            formData.email = document.getElementById("login-email").value;
            formData.firstName = "John";
            formData.lastName = "Doe";
          } else {
            formData.firstName = document.getElementById("signup-first-name").value;
            formData.lastName = document.getElementById("signup-last-name").value;
            formData.email = document.getElementById("signup-email").value;
          }

          successCallback(formData);

          submitBtn.disabled = false;
          submitText.textContent = submitText.id === "login-text" ? "Sign In" : "Create Account";
        });
      }

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
          email: formData.email
        });
      }

      function validateSignup() {
        clearErrors();
        let isValid = true;

        const firstName = document.getElementById("signup-first-name").value.trim();
        const lastName = document.getElementById("signup-last-name").value.trim();
        const email = document.getElementById("signup-email").value.trim();
        const password = document.getElementById("signup-password").value;
        const confirmPassword = document.getElementById("signup-confirm-password").value;
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

        if (!password || !validatePassword(password)) {
          showError("signup-password-error", "Password must be at least 6 characters");
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
          email: formData.email
        });
      }

      setupFormSubmit("login-form", validateLogin, showLoginSuccess);
      setupFormSubmit("signup-form", validateSignup, showSignupSuccess);

      // Social buttons
      document.querySelectorAll(".social-btn").forEach((button) => {
        button.addEventListener("click", function () {
          const provider = this.querySelector("i").className.includes("google")
            ? "Google"
            : this.querySelector("i").className.includes("facebook")
              ? "Facebook"
              : "Apple";

          showDashboard({
            firstName: "Demo",
            lastName: "User",
            email: `demo@${provider.toLowerCase()}.com`
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
            alert(`Password reset instructions sent to ${email}. Check your email!`);
          } else {
            alert("Please enter a valid email address first");
            document.getElementById("login-email").focus();
          }
        });
      }

      // Initialize demo values
      function initDemoValues() {
        const loginEmail = document.getElementById("login-email");
        const loginPassword = document.getElementById("login-password");
        if (loginEmail) loginEmail.value = "demo@example.com";
        if (loginPassword) loginPassword.value = "password123";

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

        if (signupDob) {
          const dob = new Date();
          dob.setFullYear(dob.getFullYear() - 25);
          signupDob.valueAsDate = dob;
        }

        if (signupPassword) signupPassword.value = "SecurePass123";
        if (signupConfirmPassword) signupConfirmPassword.value = "SecurePass123";
        if (terms) terms.checked = true;
      }

      initDemoValues();
    });