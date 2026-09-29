<script>
    /* ============================================================
       Data
       ============================================================ */
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

    /* ============================================================
       App
       ============================================================ */
    document.addEventListener("DOMContentLoaded", function () {
      "use strict";

      /* ---------- Helpers ---------- */
      const $ = (id) => document.getElementById(id);
      const escapeHTML = (str) => String(str).replace(/[&<>"']/g, (m) => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
      }[m]));

      /* ---------- Theme ---------- */
      const themeToggle = $("theme-toggle");
      const themeIcon = themeToggle.querySelector("i");
      const root = document.documentElement;

      function applyTheme(theme) {
        root.setAttribute("data-theme", theme);
        themeIcon.className = theme === "dark" ? "fas fa-sun" : "fas fa-moon";
        themeToggle.setAttribute("aria-label", theme === "dark" ? "Switch to light mode" : "Switch to dark mode");
      }

      const storedTheme = localStorage.getItem("theme");
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      applyTheme(storedTheme || (prefersDark ? "dark" : "light"));

      themeToggle.addEventListener("click", function () {
        const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
        applyTheme(next);
        localStorage.setItem("theme", next);
      });

      /* ---------- Element refs ---------- */
      const authContainer = $("auth-container");
      const authTabs = document.querySelector(".auth-tabs");

      const loginTab = $("login-tab");
      const signupTab = $("signup-tab");
      const loginForm = $("login-form");
      const signupForm = $("signup-form");
      const successMessage = $("success-message");
      const successTitle = $("success-title");
      const successText = $("success-text");
      const dashboard = $("dashboard");
      const backToAuth = $("back-to-auth");
      const logoutBtn = $("logout-btn");

      const userAvatar = $("user-avatar");
      const userName = $("user-name");
      const userEmail = $("user-email");

      const projectsGrid = $("projects-grid");
      const projectModal = $("project-modal");
      const modalTitle = $("modal-project-title");
      const modalBody = $("modal-body");
      const modalContent = projectModal.querySelector(".modal-content");
      const editProjectBtn = $("edit-project-btn");

      let activeProjectId = null;
      let lastFocusedElement = null;

      /* ---------- Mode switching ---------- */
      function setAuthMode(isDashboard) {
        authContainer.classList.toggle("dashboard-mode", isDashboard);
        document.body.classList.toggle("dashboard-active", isDashboard);
      }

      function clearErrors() {
        document.querySelectorAll(".error-message").forEach((el) => el.classList.remove("show"));
        document.querySelectorAll(".form-input, .checkbox").forEach((el) => el.classList.remove("error"));
      }

      function showLogin() {
        loginTab.classList.add("active");
        loginTab.setAttribute("aria-selected", "true");
        signupTab.classList.remove("active");
        signupTab.setAttribute("aria-selected", "false");

        loginForm.classList.add("active");
        signupForm.classList.remove("active");
        successMessage.classList.remove("active");
        dashboard.classList.remove("active");

        authTabs.style.display = "flex";
        setAuthMode(false);
        clearErrors();
      }

      function showSignup() {
        signupTab.classList.add("active");
        signupTab.setAttribute("aria-selected", "true");
        loginTab.classList.remove("active");
        loginTab.setAttribute("aria-selected", "false");

        signupForm.classList.add("active");
        loginForm.classList.remove("active");
        successMessage.classList.remove("active");
        dashboard.classList.remove("active");

        authTabs.style.display = "flex";
        setAuthMode(false);
        clearErrors();
      }

      function showDashboard(userData) {
        if (userData) {
          const firstName = userData.firstName || "John";
          const lastName = userData.lastName || "Doe";
          const email = userData.email || "john.doe@example.com";

          userAvatar.textContent = ((firstName[0] || "J") + (lastName[0] || "D")).toUpperCase();
          userName.textContent = `${firstName} ${lastName}`.trim();
          userEmail.innerHTML = `<i class="fas fa-envelope"></i> <span>${escapeHTML(email)}</span>`;
        }

        loginForm.classList.remove("active");
        signupForm.classList.remove("active");
        successMessage.classList.remove("active");
        dashboard.classList.add("active");

        authTabs.style.display = "none";
        setAuthMode(true);
        clearErrors();

        renderProjects();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }

      loginTab.addEventListener("click", showLogin);
      signupTab.addEventListener("click", showSignup);

      backToAuth.addEventListener("click", showLogin);

      logoutBtn.addEventListener("click", function () {
        showLogin();
        successTitle.textContent = "Logged Out!";
        successText.textContent = "You have been successfully logged out.";
        successMessage.classList.add("active");
        dashboard.classList.remove("active");
        authTabs.style.display = "flex";

        clearTimeout(logoutBtn._timer);
        logoutBtn._timer = setTimeout(() => {
          successMessage.classList.remove("active");
        }, 3000);
      });

      /* ---------- Password visibility ---------- */
      function setupPasswordToggle(passwordId, toggleId) {
        const passwordInput = $(passwordId);
        const toggleButton = $(toggleId);

        toggleButton.addEventListener("click", function () {
          const isPassword = passwordInput.type === "password";
          passwordInput.type = isPassword ? "text" : "password";
          this.querySelector("i").className = isPassword ? "fas fa-eye-slash" : "fas fa-eye";
          this.setAttribute("aria-label", isPassword ? "Hide password" : "Show password");
          passwordInput.focus({ preventScroll: true });
        });
      }

      setupPasswordToggle("login-password", "toggle-login-password");
      setupPasswordToggle("signup-password", "toggle-signup-password");

      /* ---------- Validation helpers ---------- */
      function showError(elementId, message) {
        const el = $(elementId);
        if (!el) return;
        el.innerHTML = '<i class="fas fa-exclamation-circle"></i> ' + escapeHTML(message);
        el.classList.add("show");
      }

      function markInvalid(input) {
        if (input) input.classList.add("error");
      }

      const emailRe = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;

      function validateEmail(email) {
        return emailRe.test(email);
      }

      // Must be 8+ chars and contain at least one letter and one number
      function validatePassword(password) {
        return password.length >= 8 && /[a-zA-Z]/.test(password) && /\d/.test(password);
      }

      function validateName(name) {
        return name.trim().length >= 2;
      }

      function validatePhone(phone) {
        const digits = phone.replace(/\D/g, "");
        return digits.length >= 10 && digits.length <= 15;
      }

      function validateAge(dobValue) {
        if (!dobValue) return false;
        const dob = new Date(dobValue);
        if (isNaN(dob.getTime())) return false;
        const today = new Date();
        let age = today.getFullYear() - dob.getFullYear();
        const m = today.getMonth() - dob.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
        return age >= 18 && age < 120;
      }

      /* ---------- Login validation ---------- */
      function validateLogin() {
        clearErrors();
        let isValid = true;

        const emailInput = $("login-email");
        const passwordInput = $("login-password");
        const email = emailInput.value.trim();
        const password = passwordInput.value;

        if (!email || !validateEmail(email)) {
          showError("login-email-error", "Please enter a valid email address");
          markInvalid(emailInput);
          isValid = false;
        }

        if (!password) {
          showError("login-password-error", "Password is required");
          markInvalid(passwordInput);
          isValid = false;
        }

        return isValid;
      }

      /* ---------- Signup validation ---------- */
      function validateSignup() {
        clearErrors();
        let isValid = true;

        const firstNameInput = $("signup-first-name");
        const lastNameInput = $("signup-last-name");
        const emailInput = $("signup-email");
        const phoneInput = $("signup-phone");
        const dobInput = $("signup-dob");
        const passwordInput = $("signup-password");
        const confirmInput = $("signup-confirm-password");
        const termsInput = $("terms");

        const firstName = firstNameInput.value.trim();
        const lastName = lastNameInput.value.trim();
        const email = emailInput.value.trim();
        const phone = phoneInput.value.trim();
        const dob = dobInput.value;
        const password = passwordInput.value;
        const confirmPassword = confirmInput.value;

        if (!firstName || !validateName(firstName)) {
          showError("signup-first-name-error", "First name is required (min 2 characters)");
          markInvalid(firstNameInput);
          isValid = false;
        }

        if (!lastName || !validateName(lastName)) {
          showError("signup-last-name-error", "Last name is required (min 2 characters)");
          markInvalid(lastNameInput);
          isValid = false;
        }

        if (!email || !validateEmail(email)) {
          showError("signup-email-error", "Please enter a valid email address");
          markInvalid(emailInput);
          isValid = false;
        }

        if (phone && !validatePhone(phone)) {
          showError("signup-phone-error", "Please enter a valid phone number");
          markInvalid(phoneInput);
          isValid = false;
        }

        if (!dob || !validateAge(dob)) {
          showError("signup-dob-error", "You must be at least 18 years old");
          markInvalid(dobInput);
          isValid = false;
        }

        if (!password || !validatePassword(password)) {
          showError("signup-password-error", "Password needs 8+ characters with a letter and a number");
          markInvalid(passwordInput);
          isValid = false;
        }

        if (password !== confirmPassword) {
          showError("signup-confirm-password-error", "Passwords do not match");
          markInvalid(confirmInput);
          isValid = false;
        }

        if (!termsInput.checked) {
          showError("terms-error", "You must agree to the terms and conditions");
          isValid = false;
        }

        return isValid;
      }

      /* ---------- Form submit wiring ---------- */
      function setupFormSubmit(formId, validationFn, successCallback, buttonId, textId, defaultLabel) {
        const form = $(formId);
        const submitBtn = $(buttonId);
        const submitText = $(textId);

        form.addEventListener("submit", async function (e) {
          e.preventDefault();

          if (!validationFn()) {
            const firstError = form.querySelector(".form-input.error");
            if (firstError) firstError.focus({ preventScroll: false });
            return;
          }

          submitBtn.disabled = true;
          submitText.innerHTML = '<span class="spinner"></span> Processing...';

          await new Promise((resolve) => setTimeout(resolve, 900));

          const formData = {};
          if (formId === "login-form") {
            const email = $("login-email").value.trim();
            const local = email.split("@")[0] || "user";
            const parts = local.split(/[._-]+/).filter(Boolean);
            const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();

            formData.email = email;
            formData.firstName = parts[0] ? cap(parts[0]) : "John";
            formData.lastName = parts[1] ? cap(parts[1]) : "Doe";
          } else {
            formData.firstName = $("signup-first-name").value.trim();
            formData.lastName = $("signup-last-name").value.trim();
            formData.email = $("signup-email").value.trim();
          }

          submitBtn.disabled = false;
          submitText.textContent = defaultLabel;

          successCallback(formData);
        });
      }

      setupFormSubmit("login-form", validateLogin, showDashboard, "login-submit", "login-text", "Sign In");
      setupFormSubmit("signup-form", validateSignup, showDashboard, "signup-submit", "signup-text", "Create Account");

      /* ---------- Social buttons ---------- */
      document.querySelectorAll(".social-btn").forEach((button) => {
        button.addEventListener("click", function () {
          const provider = this.dataset.provider || "Social";
          showDashboard({
            firstName: "Demo",
            lastName: "User",
            email: `demo@${provider.toLowerCase()}.com`
          });
        });
      });

      /* ---------- Forgot password ---------- */
      const forgotPassword = $("forgot-password");
      if (forgotPassword) {
        forgotPassword.addEventListener("click", function (e) {
          e.preventDefault();
          const emailInput = $("login-email");
          const email = emailInput.value.trim();
          if (email && validateEmail(email)) {
            showToast(`Password reset instructions sent to ${email}`, "success");
          } else {
            showToast("Please enter a valid email address first", "info");
            emailInput.focus();
          }
        });
      }

      /* ---------- Toast ---------- */
      function showToast(message, type = "info") {
        document.querySelectorAll(".af-toast").forEach((n) => n.remove());

        const toast = document.createElement("div");
        toast.className = "af-toast";
        toast.style.cssText = [
          "position:fixed",
          "top:calc(20px + env(safe-area-inset-top,0px))",
          "right:calc(20px + env(safe-area-inset-right,0px))",
          "left:auto",
          "max-width:calc(100vw - 40px)",
          "padding:12px 20px",
          "background:" + (type === "success" ? "var(--success)" : "var(--info)"),
          "color:#fff",
          "border-radius:var(--radius-md)",
          "box-shadow:var(--shadow-lg)",
          "z-index:10000",
          "font-size:0.9375rem",
          "display:flex",
          "align-items:center",
          "gap:8px",
          "animation:toastIn .3s ease-out"
        ].join(";");
        toast.innerHTML = `<i class="fas ${type === "success" ? "fa-check-circle" : "fa-info-circle"}"></i><span>${escapeHTML(message)}</span>`;
        document.body.appendChild(toast);

        setTimeout(() => {
          toast.style.animation = "toastOut .3s ease-out forwards";
          setTimeout(() => toast.remove(), 300);
        }, 3000);
      }

      /* ---------- Projects ---------- */
      function statusLabel(status) {
        return status === "active" ? "Active" : status === "pending" ? "Pending" : "Completed";
      }

      function renderProjects() {
        if (!projectsGrid) return;

        projectsGrid.innerHTML = projectsData.map((p) => `
          <article class="project-card" data-id="${p.id}" tabindex="0" role="button"
                   aria-label="View details for ${escapeHTML(p.title)}">
            <div class="project-icon"><i class="fas ${p.icon}"></i></div>
            <h3 class="project-title">${escapeHTML(p.title)}</h3>
            <p class="project-description">
              ${escapeHTML(p.description.length > 100 ? p.description.slice(0, 100) + "…" : p.description)}
            </p>
            <div class="progress-bar" role="progressbar" aria-valuenow="${p.progress}" aria-valuemin="0" aria-valuemax="100">
              <div class="progress-fill" style="width:${p.progress}%"></div>
            </div>
            <div class="project-meta">
              <span class="project-status status-${p.status}">${statusLabel(p.status)}</span>
              <span>${p.progress}% Complete</span>
            </div>
          </article>
        `).join("");

        const totalTasks = projectsData.reduce((sum, p) => sum + p.tasks.length, 0);
        const uniqueTeam = new Set(projectsData.flatMap((p) => p.team)).size;

        const statProjects = $("stat-projects");
        const statTasks = $("stat-tasks");
        const statTeam = $("stat-team");
        if (statProjects) statProjects.textContent = projectsData.length;
        if (statTasks) statTasks.textContent = totalTasks;
        if (statTeam) statTeam.textContent = uniqueTeam;
      }

      function buildProjectModalHTML(project) {
        const completedTasks = project.tasks.filter((t) => t.completed).length;
        const pct = Math.round((completedTasks / project.tasks.length) * 100);

        const fmt = (d) => {
          const date = new Date(d);
          return isNaN(date.getTime()) ? d : date.toLocaleDateString();
        };

        return `
          <div class="project-detail">
            <h3><i class="fas fa-info-circle"></i> Description</h3>
            <p>${escapeHTML(project.description)}</p>
          </div>

          <div class="project-detail">
            <h3><i class="fas fa-calendar-alt"></i> Timeline</h3>
            <p><strong>Start Date:</strong> ${escapeHTML(fmt(project.startDate))}</p>
            <p><strong>End Date:</strong> ${escapeHTML(fmt(project.endDate))}</p>
            <div class="progress-bar" style="margin-top:10px;">
              <div class="progress-fill" style="width:${pct}%"></div>
            </div>
            <p style="margin-top:8px;"><strong>Overall Progress:</strong> ${pct}%</p>
          </div>

          <div class="project-detail">
            <h3><i class="fas fa-users"></i> Team Members</h3>
            <div class="team-list">
              ${project.team.map((m) => `<span class="team-chip">${escapeHTML(m)}</span>`).join("")}
            </div>
          </div>

          <div class="project-detail">
            <h3><i class="fas fa-tasks"></i> Tasks (${completedTasks}/${project.tasks.length} completed)</h3>
            <ul class="task-list">
              ${project.tasks.map((task) => `
                <li class="task-item">
                  <input type="checkbox" class="task-checkbox" data-task="${task.id}"
                         ${task.completed ? "checked" : ""}
                         aria-label="${escapeHTML(task.text)}">
                  <span class="task-text ${task.completed ? "completed" : ""}">${escapeHTML(task.text)}</span>
                  <span class="task-priority priority-${task.priority}">${task.priority.toUpperCase()}</span>
                </li>
              `).join("")}
            </ul>
          </div>
        `;
      }

      function openProjectModal(projectId) {
        const project = projectsData.find((p) => p.id === projectId);
        if (!project) return;

        lastFocusedElement = document.activeElement;
        activeProjectId = projectId;

        modalTitle.textContent = project.title;
        modalBody.innerHTML = buildProjectModalHTML(project);
        modalContent.scrollTop = 0;

        projectModal.classList.add("active");
        document.body.classList.add("modal-open");

        const closeBtn = $("close-modal-btn");
        if (closeBtn) closeBtn.focus({ preventScroll: true });
      }

      function closeProjectModal() {
        projectModal.classList.remove("active");
        document.body.classList.remove("modal-open");
        activeProjectId = null;

        if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
          lastFocusedElement.focus({ preventScroll: true });
        }
      }

      function toggleTask(projectId, taskId) {
        const project = projectsData.find((p) => p.id === projectId);
        if (!project) return;

        const task = project.tasks.find((t) => t.id === taskId);
        if (!task) return;

        task.completed = !task.completed;
        project.progress = Math.round(
          (project.tasks.filter((t) => t.completed).length / project.tasks.length) * 100
        );

        renderProjects();

        // Refresh the open modal without losing scroll position
        if (activeProjectId === projectId) {
          const scrollPos = modalContent.scrollTop;
          modalBody.innerHTML = buildProjectModalHTML(project);
          modalContent.scrollTop = scrollPos;
        }
      }

      function editProject(projectId) {
        const project = projectsData.find((p) => p.id === projectId);
        if (!project) return;

        const newTitle = window.prompt("Edit Project Title:", project.title);
        if (newTitle && newTitle.trim()) {
          project.title = newTitle.trim();
          modalTitle.textContent = project.title;
          renderProjects();
          showToast("Project updated successfully!", "success");
        }
      }

      /* Delegated events for project cards */
      projectsGrid.addEventListener("click", (e) => {
        const card = e.target.closest(".project-card");
        if (card) openProjectModal(Number(card.dataset.id));
      });

      projectsGrid.addEventListener("keydown", (e) => {
        if (e.key !== "Enter" && e.key !== " ") return;
        const card = e.target.closest(".project-card");
        if (card) {
          e.preventDefault();
          openProjectModal(Number(card.dataset.id));
        }
      });

      /* Delegated events for task checkboxes */
      modalBody.addEventListener("change", (e) => {
        const checkbox = e.target.closest(".task-checkbox");
        if (!checkbox || activeProjectId === null) return;
        toggleTask(activeProjectId, Number(checkbox.dataset.task));
      });

      editProjectBtn.addEventListener("click", () => {
        if (activeProjectId !== null) editProject(activeProjectId);
      });

      $("close-modal-btn").addEventListener("click", closeProjectModal);
      $("modal-close-btn").addEventListener("click", closeProjectModal);

      projectModal.addEventListener("click", (e) => {
        if (e.target === projectModal) closeProjectModal();
      });

      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && projectModal.classList.contains("active")) {
          closeProjectModal();
        }
      });

      /* ---------- Demo values ---------- */
      function initDemoValues() {
        const set = (id, value) => {
          const el = $(id);
          if (el) el.value = value;
        };

        set("login-email", "demo@example.com");
        set("login-password", "password123");

        set("signup-first-name", "John");
        set("signup-last-name", "Doe");
        set("signup-email", "john.doe@example.com");
        set("signup-phone", "(555) 123-4567");

        const dob = $("signup-dob");
        if (dob) {
          const d = new Date();
          d.setFullYear(d.getFullYear() - 25);
          dob.valueAsDate = d;
        }

        set("signup-password", "SecurePass123");
        set("signup-confirm-password", "SecurePass123");

        const terms = $("terms");
        if (terms) terms.checked = true;
      }

      initDemoValues();

      /* ---------- Re-render on resize (keeps layout crisp) ---------- */
      let resizeTimer;
      window.addEventListener("resize", () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
          if (dashboard.classList.contains("active")) renderProjects();
        }, 200);
      });
    });
  </script>