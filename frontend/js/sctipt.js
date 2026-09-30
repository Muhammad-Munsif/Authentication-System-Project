<script>
    /* ============================================================
       API helper
       ============================================================ */
    const API_BASE = window.AUTHFLOW_API || 'http://localhost:5000/api';

    async function apiRequest(path, options = {}) {
      const res = await fetch(`${API_BASE}${path}`, {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
        ...options,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const err = new Error(data.message || 'Request failed');
        err.status = res.status;
        throw err;
      }
      return data;
    }

    const api = {
      register: (b) => apiRequest('/auth/register', { method: 'POST', body: JSON.stringify(b) }),
      login:    (b) => apiRequest('/auth/login',    { method: 'POST', body: JSON.stringify(b) }),
      logout:   ()  => apiRequest('/auth/logout',   { method: 'POST' }),
      me:       ()  => apiRequest('/auth/me'),

      getProjects:   ()         => apiRequest('/projects'),
      getProject:    (id)       => apiRequest(`/projects/${id}`),
      createProject: (b)        => apiRequest('/projects', { method: 'POST', body: JSON.stringify(b) }),
      updateProject: (id, b)    => apiRequest(`/projects/${id}`, { method: 'PUT', body: JSON.stringify(b) }),
      deleteProject: (id)       => apiRequest(`/projects/${id}`, { method: 'DELETE' }),
      toggleTask:    (pid, tid) => apiRequest(`/projects/${pid}/tasks/${tid}`, { method: 'PATCH' }),
    };

    /* ============================================================
       App
       ============================================================ */
    document.addEventListener('DOMContentLoaded', () => {
      "use strict";

      const $ = (id) => document.getElementById(id);
      const escapeHTML = (str) => String(str ?? '').replace(/[&<>"']/g, (m) => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
      }[m]));

      /* ---------- State ---------- */
      let currentUser = null;
      let projectsCache = [];
      let activeProjectId = null;
      let lastFocusedElement = null;

      /* ---------- Theme ---------- */
      const themeToggle = $('theme-toggle');
      const themeIcon = themeToggle.querySelector('i');
      const root = document.documentElement;

      function applyTheme(theme) {
        root.setAttribute('data-theme', theme);
        themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        themeToggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
      }

      const storedTheme = localStorage.getItem('theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      applyTheme(storedTheme || (prefersDark ? 'dark' : 'light'));

      themeToggle.addEventListener('click', () => {
        const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        applyTheme(next);
        localStorage.setItem('theme', next);
      });

      /* ---------- Refs ---------- */
      const authContainer = $('auth-container');
      const authTabs = document.querySelector('.auth-tabs');
      const loginTab = $('login-tab');
      const signupTab = $('signup-tab');
      const loginForm = $('login-form');
      const signupForm = $('signup-form');
      const successMessage = $('success-message');
      const successTitle = $('success-title');
      const successText = $('success-text');
      const dashboard = $('dashboard');
      const backToAuth = $('back-to-auth');
      const logoutBtn = $('logout-btn');

      const userAvatar = $('user-avatar');
      const userName = $('user-name');
      const userEmail = $('user-email');
      const statProjects = $('stat-projects');
      const statTasks = $('stat-tasks');
      const statTeam = $('stat-team');

      const projectsGrid = $('projects-grid');
      const projectModal = $('project-modal');
      const modalTitle = $('modal-project-title');
      const modalBody = $('modal-body');
      const modalContent = projectModal.querySelector('.modal-content');

      /* ---------- Helpers ---------- */
      function setAuthMode(isDashboard) {
        authContainer.classList.toggle('dashboard-mode', isDashboard);
        document.body.classList.toggle('dashboard-active', isDashboard);
      }

      function clearErrors() {
        document.querySelectorAll('.error-message').forEach((el) => el.classList.remove('show'));
        document.querySelectorAll('.form-input, .checkbox').forEach((el) => el.classList.remove('error'));
      }

      function showError(id, message) {
        const el = $(id);
        if (!el) return;
        el.innerHTML = '<i class="fas fa-exclamation-circle"></i> ' + escapeHTML(message);
        el.classList.add('show');
      }

      function markInvalid(input) { if (input) input.classList.add('error'); }

      function showToast(message, type = 'info') {
        document.querySelectorAll('.af-toast').forEach((n) => n.remove());
        const toast = document.createElement('div');
        toast.className = 'af-toast';
        toast.style.cssText = [
          'position:fixed',
          'top:calc(20px + env(safe-area-inset-top,0px))',
          'right:calc(20px + env(safe-area-inset-right,0px))',
          'max-width:calc(100vw - 40px)',
          'padding:12px 20px',
          'background:' + (type === 'success' ? 'var(--success)' : type === 'error' ? 'var(--danger)' : 'var(--info)'),
          'color:#fff',
          'border-radius:var(--radius-md)',
          'box-shadow:var(--shadow-lg)',
          'z-index:10000',
          'font-size:0.9375rem',
          'display:flex',
          'align-items:center',
          'gap:8px',
          'animation:toastIn .3s ease-out'
        ].join(';');
        toast.innerHTML = `<i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i><span>${escapeHTML(message)}</span>`;
        document.body.appendChild(toast);
        setTimeout(() => {
          toast.style.animation = 'toastOut .3s ease-out forwards';
          setTimeout(() => toast.remove(), 300);
        }, 3000);
      }

      /* ---------- View transitions ---------- */
      function showLogin() {
        loginTab.classList.add('active');
        loginTab.setAttribute('aria-selected', 'true');
        signupTab.classList.remove('active');
        signupTab.setAttribute('aria-selected', 'false');

        loginForm.classList.add('active');
        signupForm.classList.remove('active');
        successMessage.classList.remove('active');
        dashboard.classList.remove('active');
        authTabs.style.display = 'flex';
        setAuthMode(false);
        clearErrors();
      }

      function showSignup() {
        signupTab.classList.add('active');
        signupTab.setAttribute('aria-selected', 'true');
        loginTab.classList.remove('active');
        loginTab.setAttribute('aria-selected', 'false');

        signupForm.classList.add('active');
        loginForm.classList.remove('active');
        successMessage.classList.remove('active');
        dashboard.classList.remove('active');
        authTabs.style.display = 'flex';
        setAuthMode(false);
        clearErrors();
      }

      async function showDashboard(user) {
        currentUser = user;

        const firstName = user.firstName || 'John';
        const lastName = user.lastName || 'Doe';
        const email = user.email || 'john.doe@example.com';

        userAvatar.textContent = ((firstName[0] || 'J') + (lastName[0] || 'D')).toUpperCase();
        userName.textContent = `${firstName} ${lastName}`.trim();
        userEmail.innerHTML = `<i class="fas fa-envelope"></i> <span>${escapeHTML(email)}</span>`;

        loginForm.classList.remove('active');
        signupForm.classList.remove('active');
        successMessage.classList.remove('active');
        dashboard.classList.add('active');
        authTabs.style.display = 'none';
        setAuthMode(true);
        clearErrors();

        await loadProjects();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }

      /* ---------- Projects ---------- */
      async function loadProjects() {
        try {
          const { projects } = await api.getProjects();
          projectsCache = projects;
          renderProjects(projects);
        } catch (err) {
          console.error(err);
          projectsCache = [];
          projectsGrid.innerHTML = `
            <div class="empty-state">
              <i class="fas fa-exclamation-triangle"></i>
              <p>Could not load projects. ${escapeHTML(err.message)}</p>
            </div>`;
          showToast(err.message, 'error');
        }
      }

      function statusLabel(status) {
        return status === 'active' ? 'Active' : status === 'pending' ? 'Pending' : 'Completed';
      }

      function renderProjects(projects) {
        if (!projects.length) {
          projectsGrid.innerHTML = `
            <div class="empty-state">
              <i class="fas fa-folder-open"></i>
              <p>No projects yet. Create one to get started!</p>
            </div>`;
        } else {
          projectsGrid.innerHTML = projects.map((p) => `
            <article class="project-card" data-id="${p._id}" tabindex="0" role="button"
                     aria-label="View details for ${escapeHTML(p.title)}">
              <div class="project-icon"><i class="fas ${escapeHTML(p.icon || 'fa-project-diagram')}"></i></div>
              <h3 class="project-title">${escapeHTML(p.title)}</h3>
              <p class="project-description">
                ${escapeHTML((p.description || '').length > 100 ? p.description.slice(0, 100) + '…' : (p.description || ''))}
              </p>
              <div class="progress-bar" role="progressbar" aria-valuenow="${p.progress}" aria-valuemin="0" aria-valuemax="100">
                <div class="progress-fill" style="width:${p.progress}%"></div>
              </div>
              <div class="project-meta">
                <span class="project-status status-${p.status}">${statusLabel(p.status)}</span>
                <span>${p.progress}% Complete</span>
              </div>
            </article>
          `).join('');
        }

        const totalTasks = projects.reduce((s, p) => s + (p.tasks?.length || 0), 0);
        const uniqueTeam = new Set(projects.flatMap((p) => p.team || [])).size;
        statProjects.textContent = projects.length;
        statTasks.textContent = totalTasks;
        statTeam.textContent = uniqueTeam;
      }

      function buildProjectModalHTML(project) {
        const total = project.tasks?.length || 0;
        const completed = project.tasks?.filter((t) => t.completed).length || 0;
        const pct = total ? Math.round((completed / total) * 100) : 0;

        const fmt = (d) => {
          if (!d) return '—';
          const date = new Date(d);
          return isNaN(date.getTime()) ? '—' : date.toLocaleDateString();
        };

        return `
          <div class="project-detail">
            <h3><i class="fas fa-info-circle"></i> Description</h3>
            <p>${escapeHTML(project.description || 'No description provided.')}</p>
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
              ${(project.team || []).map((m) => `<span class="team-chip">${escapeHTML(m)}</span>`).join('') || '<em>No team members</em>'}
            </div>
          </div>

          <div class="project-detail">
            <h3><i class="fas fa-tasks"></i> Tasks (${completed}/${total} completed)</h3>
            <ul class="task-list">
              ${(project.tasks || []).map((task) => `
                <li class="task-item">
                  <input type="checkbox" class="task-checkbox" data-task="${task.id}"
                         ${task.completed ? 'checked' : ''}
                         aria-label="${escapeHTML(task.text)}">
                  <span class="task-text ${task.completed ? 'completed' : ''}">${escapeHTML(task.text)}</span>
                  <span class="task-priority priority-${task.priority}">${task.priority.toUpperCase()}</span>
                </li>
              `).join('') || '<li class="task-item"><span class="task-text">No tasks</span></li>'}
            </ul>
          </div>
        `;
      }

      function openProjectModal(projectId) {
        const project = projectsCache.find((p) => p._id === projectId);
        if (!project) return;

        lastFocusedElement = document.activeElement;
        activeProjectId = projectId;

        modalTitle.textContent = project.title;
        modalBody.innerHTML = buildProjectModalHTML(project);
        modalContent.scrollTop = 0;

        projectModal.classList.add('active');
        document.body.classList.add('modal-open');
        setTimeout(() => $('close-modal-btn').focus({ preventScroll: true }), 50);
      }

      function closeProjectModal() {
        projectModal.classList.remove('active');
        document.body.classList.remove('modal-open');
        activeProjectId = null;
        if (lastFocusedElement?.focus) lastFocusedElement.focus({ preventScroll: true });
      }

      async function toggleTask(projectId, taskId) {
        try {
          const { project } = await api.toggleTask(projectId, taskId);
          const idx = projectsCache.findIndex((p) => p._id === projectId);
          if (idx >= 0) projectsCache[idx] = project;
          renderProjects(projectsCache);

          if (activeProjectId === projectId) {
            const scrollPos = modalContent.scrollTop;
            modalBody.innerHTML = buildProjectModalHTML(project);
            modalContent.scrollTop = scrollPos;
          }
        } catch (err) {
          showToast(err.message, 'error');
          // Revert checkbox
          await loadProjects();
        }
      }

      async function editProject(projectId) {
        const project = projectsCache.find((p) => p._id === projectId);
        if (!project) return;

        const newTitle = window.prompt('Edit Project Title:', project.title);
        if (!newTitle || !newTitle.trim() || newTitle.trim() === project.title) return;

        try {
          const { project: updated } = await api.updateProject(projectId, { title: newTitle.trim() });
          const idx = projectsCache.findIndex((p) => p._id === projectId);
          if (idx >= 0) projectsCache[idx] = updated;
          renderProjects(projectsCache);

          modalTitle.textContent = updated.title;
          modalBody.innerHTML = buildProjectModalHTML(updated);
          showToast('Project updated successfully!', 'success');
        } catch (err) {
          showToast(err.message, 'error');
        }
      }

      /* ---------- Delegated events ---------- */
      projectsGrid.addEventListener('click', (e) => {
        const card = e.target.closest('.project-card');
        if (card) openProjectModal(card.dataset.id);
      });

      projectsGrid.addEventListener('keydown', (e) => {
        if (e.key !== 'Enter' && e.key !== ' ') return;
        const card = e.target.closest('.project-card');
        if (card) {
          e.preventDefault();
          openProjectModal(card.dataset.id);
        }
      });

      modalBody.addEventListener('change', (e) => {
        const checkbox = e.target.closest('.task-checkbox');
        if (!checkbox || !activeProjectId) return;
        toggleTask(activeProjectId, Number(checkbox.dataset.task));
      });

      $('edit-project-btn').addEventListener('click', () => {
        if (activeProjectId) editProject(activeProjectId);
      });

      $('close-modal-btn').addEventListener('click', closeProjectModal);
      $('modal-close-btn').addEventListener('click', closeProjectModal);

      projectModal.addEventListener('click', (e) => {
        if (e.target === projectModal) closeProjectModal();
      });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && projectModal.classList.contains('active')) closeProjectModal();
      });

      /* ---------- Tabs ---------- */
      loginTab.addEventListener('click', showLogin);
      signupTab.addEventListener('click', showSignup);
      backToAuth.addEventListener('click', showLogin);

      /* ---------- Password toggles ---------- */
      function setupPasswordToggle(passwordId, toggleId) {
        const input = $(passwordId);
        const btn = $(toggleId);
        btn.addEventListener('click', () => {
          const isPwd = input.type === 'password';
          input.type = isPwd ? 'text' : 'password';
          btn.querySelector('i').className = isPwd ? 'fas fa-eye-slash' : 'fas fa-eye';
          btn.setAttribute('aria-label', isPwd ? 'Hide password' : 'Show password');
          input.focus({ preventScroll: true });
        });
      }
      setupPasswordToggle('login-password', 'toggle-login-password');
      setupPasswordToggle('signup-password', 'toggle-signup-password');

      /* ---------- Validation ---------- */
      const emailRe = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
      const validateEmail = (v) => emailRe.test(v);
      const validatePassword = (v) => v.length >= 8 && /[a-zA-Z]/.test(v) && /\d/.test(v);
      const validateName = (v) => v.trim().length >= 2;
      const validatePhone = (v) => {
        const d = v.replace(/\D/g, '');
        return d.length >= 10 && d.length <= 15;
      };
      const validateAge = (dobValue) => {
        if (!dobValue) return false;
        const dob = new Date(dobValue);
        if (isNaN(dob.getTime())) return false;
        const today = new Date();
        let age = today.getFullYear() - dob.getFullYear();
        const m = today.getMonth() - dob.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
        return age >= 18 && age < 120;
      };

      function validateLogin() {
        clearErrors();
        let ok = true;

        const emailInput = $('login-email');
        const passwordInput = $('login-password');
        const email = emailInput.value.trim();
        const password = passwordInput.value;

        if (!email || !validateEmail(email)) {
          showError('login-email-error', 'Please enter a valid email address');
          markInvalid(emailInput);
          ok = false;
        }
        if (!password) {
          showError('login-password-error', 'Password is required');
          markInvalid(passwordInput);
          ok = false;
        }
        return ok;
      }

      function validateSignup() {
        clearErrors();
        let ok = true;

        const firstNameInput = $('signup-first-name');
        const lastNameInput = $('signup-last-name');
        const emailInput = $('signup-email');
        const phoneInput = $('signup-phone');
        const dobInput = $('signup-dob');
        const passwordInput = $('signup-password');
        const confirmInput = $('signup-confirm-password');
        const termsInput = $('terms');

        const firstName = firstNameInput.value.trim();
        const lastName = lastNameInput.value.trim();
        const email = emailInput.value.trim();
        const phone = phoneInput.value.trim();
        const dob = dobInput.value;
        const password = passwordInput.value;
        const confirmPassword = confirmInput.value;

        if (!firstName || !validateName(firstName)) {
          showError('signup-first-name-error', 'First name required (min 2 characters)');
          markInvalid(firstNameInput);
          ok = false;
        }
        if (!lastName || !validateName(lastName)) {
          showError('signup-last-name-error', 'Last name required (min 2 characters)');
          markInvalid(lastNameInput);
          ok = false;
        }
        if (!email || !validateEmail(email)) {
          showError('signup-email-error', 'Please enter a valid email address');
          markInvalid(emailInput);
          ok = false;
        }
        if (phone && !validatePhone(phone)) {
          showError('signup-phone-error', 'Please enter a valid phone number');
          markInvalid(phoneInput);
          ok = false;
        }
        if (!dob || !validateAge(dob)) {
          showError('signup-dob-error', 'You must be at least 18 years old');
          markInvalid(dobInput);
          ok = false;
        }
        if (!password || !validatePassword(password)) {
          showError('signup-password-error', 'Password needs 8+ characters with a letter and a number');
          markInvalid(passwordInput);
          ok = false;
        }
        if (password !== confirmPassword) {
          showError('signup-confirm-password-error', 'Passwords do not match');
          markInvalid(confirmInput);
          ok = false;
        }
        if (!termsInput.checked) {
          showError('terms-error', 'You must agree to the terms and conditions');
          ok = false;
        }
        return ok;
      }

      /* ---------- Submit handling ---------- */
      function setBusy(btn, textEl, defaultLabel) {
        btn.disabled = true;
        textEl.innerHTML = '<span class="spinner"></span> Processing...';
        return () => {
          btn.disabled = false;
          textEl.textContent = defaultLabel;
        };
      }

      loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!validateLogin()) {
          const first = loginForm.querySelector('.form-input.error');
          if (first) first.focus();
          return;
        }

        const btn = $('login-submit');
        const text = $('login-text');
        const reset = setBusy(btn, text, 'Sign In');

        try {
          const { user } = await api.login({
            email: $('login-email').value.trim(),
            password: $('login-password').value,
          });
          await showDashboard(user);
        } catch (err) {
          if (err.status === 401) {
            showError('login-password-error', err.message);
            markInvalid($('login-password'));
          } else if (err.status === 400) {
            showError('login-email-error', err.message);
            markInvalid($('login-email'));
          } else {
            showToast(err.message, 'error');
          }
        } finally {
          reset();
        }
      });

      signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!validateSignup()) {
          const first = signupForm.querySelector('.form-input.error');
          if (first) first.focus();
          return;
        }

        const btn = $('signup-submit');
        const text = $('signup-text');
        const reset = setBusy(btn, text, 'Create Account');

        try {
          const { user } = await api.register({
            firstName: $('signup-first-name').value.trim(),
            lastName: $('signup-last-name').value.trim(),
            email: $('signup-email').value.trim(),
            phone: $('signup-phone').value.trim(),
            dob: $('signup-dob').value,
            password: $('signup-password').value,
          });
          await showDashboard(user);
          showToast('Account created successfully!', 'success');
        } catch (err) {
          if (err.status === 400) {
            showError('signup-email-error', err.message);
            markInvalid($('signup-email'));
          } else {
            showToast(err.message, 'error');
          }
        } finally {
          reset();
        }
      });

      /* ---------- Logout ---------- */
      logoutBtn.addEventListener('click', async () => {
        try {
          await api.logout();
        } catch (err) {
          console.warn('Logout error:', err);
        }
        currentUser = null;
        projectsCache = [];
        showLogin();
        successTitle.textContent = 'Logged Out!';
        successText.textContent = 'You have been successfully logged out.';
        successMessage.classList.add('active');
        setTimeout(() => successMessage.classList.remove('active'), 3000);
      });

      /* ---------- Social buttons (demo fallback — no backend OAuth configured) ---------- */
      document.querySelectorAll('.social-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
          showToast(`${btn.dataset.provider} OAuth is not configured on this demo backend.`, 'info');
        });
      });

      /* ---------- Forgot password ---------- */
      $('forgot-password')?.addEventListener('click', (e) => {
        e.preventDefault();
        const emailInput = $('login-email');
        const email = emailInput.value.trim();
        if (email && validateEmail(email)) {
          showToast(`Password reset instructions sent to ${email}`, 'success');
        } else {
          showToast('Please enter a valid email address first', 'info');
          emailInput.focus();
        }
      });

      /* ---------- Session restore ---------- */
      (async () => {
        try {
          const { user } = await api.me();
          await showDashboard(user);
        } catch {
          showLogin();
        }
      })();

      /* ---------- Debounced resize ---------- */
      let resizeTimer;
      window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
          if (dashboard.classList.contains('active')) renderProjects(projectsCache);
        }, 200);
      });
    });
  </script></script>