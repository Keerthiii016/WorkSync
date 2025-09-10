// WorkSync Main Application JavaScript

class WorkSyncApp {
    constructor() {
        this.apiBaseUrl = 'http://localhost:8080/api';
        this.currentUser = { name: 'Demo User', id: 1 }; // Demo user for now
        this.theme = localStorage.getItem('theme') || 'light';
        
        this.init();
    }

    init() {
        this.setupTheme();
        this.setupEventListeners();
        this.loadDashboard();
        this.setupWebSocket();
    }

    setupTheme() {
        document.documentElement.setAttribute('data-theme', this.theme);
        this.updateThemeIcon();
    }

    updateThemeIcon() {
        const themeIcon = document.querySelector('#toggleTheme i');
        if (themeIcon) {
            themeIcon.className = this.theme === 'dark' ? 'bi bi-sun me-2' : 'bi bi-moon me-2';
        }
    }

    toggleTheme() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        localStorage.setItem('theme', this.theme);
        this.setupTheme();
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('[data-page]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.navigateToPage(e.target.closest('[data-page]').dataset.page);
            });
        });

        // Theme toggle
        document.getElementById('toggleTheme')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.toggleTheme();
        });

        // Global search and filter events
        this.setupGlobalFilters();
    }

    setupGlobalFilters() {
        // Project search
        const projectSearch = document.getElementById('projectSearch');
        if (projectSearch) {
            projectSearch.addEventListener('input', this.debounce(() => {
                if (window.projectsManager) {
                    window.projectsManager.filterProjects();
                }
            }, 300));
        }

        // Task search
        const taskSearch = document.getElementById('taskSearch');
        if (taskSearch) {
            taskSearch.addEventListener('input', this.debounce(() => {
                if (window.tasksManager) {
                    window.tasksManager.filterTasks();
                }
            }, 300));
        }

        // Filter changes
        ['projectStatusFilter', 'projectSortBy', 'taskStatusFilter', 
         'taskPriorityFilter', 'taskProjectFilter', 'taskSortBy'].forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('change', () => {
                    if (id.includes('project')) {
                        if (window.projectsManager) {
                            window.projectsManager.filterProjects();
                        }
                    } else {
                        if (window.tasksManager) {
                            window.tasksManager.filterTasks();
                        }
                    }
                });
            }
        });
    }

    // Setup filters after managers are initialized
    setupFiltersAfterManagers() {
        setTimeout(() => {
            // Task search
            const taskSearch = document.getElementById('taskSearch');
            if (taskSearch && !taskSearch.hasAttribute('data-filter-setup')) {
                taskSearch.setAttribute('data-filter-setup', 'true');
                taskSearch.addEventListener('input', this.debounce(() => {
                    if (window.tasksManager) {
                        window.tasksManager.filterTasks();
                    }
                }, 300));
            }

            // Task filters
            ['taskStatusFilter', 'taskPriorityFilter', 'taskProjectFilter', 'taskSortBy'].forEach(id => {
                const element = document.getElementById(id);
                if (element && !element.hasAttribute('data-filter-setup')) {
                    element.setAttribute('data-filter-setup', 'true');
                    element.addEventListener('change', () => {
                        if (window.tasksManager) {
                            window.tasksManager.filterTasks();
                        }
                    });
                }
            });
        }, 100);
    }

    navigateToPage(page) {
        // Update navigation active state
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        document.querySelector(`[data-page="${page}"]`).classList.add('active');

        // Hide all pages
        document.querySelectorAll('.page-content').forEach(pageEl => {
            pageEl.classList.add('d-none');
        });

        // Show selected page
        const targetPage = document.getElementById(`${page}Page`);
        if (targetPage) {
            targetPage.classList.remove('d-none');
            targetPage.classList.add('fade-in');
        }

        // Load page-specific content
        this.loadPageContent(page);
    }

    loadPageContent(page) {
        switch (page) {
            case 'dashboard':
                this.loadDashboard();
                break;
            case 'projects':
                this.loadProjects();
                break;
            case 'tasks':
                this.loadTasks();
                this.setupFiltersAfterManagers();
                break;
            case 'workflow':
                this.loadKanban();
                break;
        }
    }

    async loadDashboard() {
        try {
            this.showLoading(true);

            // Prefer live data from managers; fall back to demo data if unavailable
            const liveProjects = (window.projectsManager && window.projectsManager.projects?.length)
                ? [...window.projectsManager.projects]
                : null;
            const liveTasks = (window.tasksManager && window.tasksManager.tasks?.length)
                ? [...window.tasksManager.tasks]
                : null;

            // Demo data fallback
            const sampleProjects = [
                {
                    id: 1,
                    name: 'Website Redesign',
                    description: 'Redesign the company website with modern UI/UX',
                    status: 'ACTIVE',
                    progress: 65,
                    createdAt: '2024-01-15'
                },
                {
                    id: 2,
                    name: 'Mobile App Development',
                    description: 'Develop a new mobile application for iOS and Android',
                    status: 'ACTIVE',
                    progress: 30,
                    createdAt: '2024-01-20'
                },
                {
                    id: 3,
                    name: 'Marketing Campaign',
                    description: 'Launch Q1 marketing campaign across all channels',
                    status: 'COMPLETED',
                    progress: 100,
                    createdAt: '2024-01-01'
                }
            ];

            const sampleTasks = [
                {
                    id: 1,
                    title: 'Design Homepage Layout',
                    project: { name: 'Website Redesign' },
                    status: 'COMPLETED',
                    priority: 'HIGH',
                    dueDate: '2024-01-25',
                    completedAt: '2024-01-24'
                },
                {
                    id: 2,
                    title: 'Implement User Authentication',
                    project: { name: 'Mobile App Development' },
                    status: 'IN_PROGRESS',
                    priority: 'URGENT',
                    dueDate: '2024-02-01'
                },
                {
                    id: 3,
                    title: 'Create Social Media Content',
                    project: { name: 'Marketing Campaign' },
                    status: 'COMPLETED',
                    priority: 'MEDIUM',
                    dueDate: '2024-01-15',
                    completedAt: '2024-01-14'
                },
                {
                    id: 4,
                    title: 'Database Schema Design',
                    project: { name: 'Mobile App Development' },
                    status: 'NOT_STARTED',
                    priority: 'HIGH',
                    dueDate: '2024-02-05'
                },
                {
                    id: 5,
                    title: 'SEO Optimization',
                    project: { name: 'Website Redesign' },
                    status: 'ON_HOLD',
                    priority: 'LOW',
                    dueDate: '2024-02-10'
                }
            ];

            const projects = liveProjects || sampleProjects;
            const tasks = liveTasks || sampleTasks;

            this.updateDashboardStats(projects, tasks);
            this.updateDashboardCharts(tasks);
            this.updateRecentItems(projects, tasks);
            
        } catch (error) {
            console.error('Failed to load dashboard:', error);
            this.showError('Failed to load dashboard data');
        } finally {
            this.showLoading(false);
        }
    }

    // Public helper to refresh stats using current managers without reinitializing charts unnecessarily
    refreshDashboardFromManagers() {
        const projects = (window.projectsManager && window.projectsManager.projects)
            ? [...window.projectsManager.projects]
            : [];
        const tasks = (window.tasksManager && window.tasksManager.tasks)
            ? [...window.tasksManager.tasks]
            : [];

        if (projects.length === 0 && tasks.length === 0) {
            // If nothing loaded yet, fall back to full load which provides demo data
            this.loadDashboard();
            return;
        }

        this.updateDashboardStats(projects, tasks);
        // For simplicity, recreate charts with the latest tasks
        this.updateDashboardCharts(tasks);
        this.updateRecentItems(projects, tasks);
    }

    updateDashboardStats(projects, tasks) {
        document.getElementById('totalProjects').textContent = projects.length;
        document.getElementById('completedTasks').textContent = 
            tasks.filter(task => task.status === 'COMPLETED').length;
        document.getElementById('pendingTasks').textContent = 
            tasks.filter(task => task.status !== 'COMPLETED').length;
        document.getElementById('overdueTasks').textContent = 
            tasks.filter(task => this.isTaskOverdue(task)).length;
    }

    updateDashboardCharts(tasks) {
        this.createTaskStatusChart(tasks);
        this.createWeeklyProgressChart(tasks);
    }

    createTaskStatusChart(tasks) {
        const ctx = document.getElementById('taskStatusChart');
        if (!ctx) return;

        // Destroy previous instance if exists to allow clean redraws
        if (this._taskStatusChart) {
            try { this._taskStatusChart.destroy(); } catch (e) {}
            this._taskStatusChart = null;
        }

        const statusCounts = {
            'NOT_STARTED': 0,
            'IN_PROGRESS': 0,
            'COMPLETED': 0,
            'ON_HOLD': 0
        };

        tasks.forEach(task => {
            statusCounts[task.status] = (statusCounts[task.status] || 0) + 1;
        });

        this._taskStatusChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Not Started', 'In Progress', 'Completed', 'On Hold'],
                datasets: [{
                    data: Object.values(statusCounts),
                    backgroundColor: [
                        '#6c757d',
                        '#0d6efd',
                        '#198754',
                        '#ffc107'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    createWeeklyProgressChart(tasks) {
        const ctx = document.getElementById('weeklyProgressChart');
        if (!ctx) return;

        // Destroy previous instance if exists
        if (this._weeklyProgressChart) {
            try { this._weeklyProgressChart.destroy(); } catch (e) {}
            this._weeklyProgressChart = null;
        }

        const last7Days = Array.from({length: 7}, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - i);
            return date.toISOString().split('T')[0];
        }).reverse();

        const completedTasksByDay = last7Days.map(date => {
            return tasks.filter(task => 
                task.status === 'COMPLETED' && 
                task.completedAt?.startsWith(date)
            ).length;
        });

        this._weeklyProgressChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: last7Days.map(date => new Date(date).toLocaleDateString()),
                datasets: [{
                    label: 'Completed Tasks',
                    data: completedTasksByDay,
                    borderColor: '#198754',
                    backgroundColor: 'rgba(25, 135, 84, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1
                        }
                    }
                }
            }
        });
    }

    updateRecentItems(projects, tasks) {
        this.updateRecentProjects(projects.slice(0, 5));
        this.updateRecentTasks(tasks.slice(0, 5));
    }

    updateRecentProjects(projects) {
        const container = document.getElementById('recentProjectsList');
        if (!container) return;

        if (projects.length === 0) {
            container.innerHTML = '<p class="text-muted text-center">No projects yet</p>';
            return;
        }

        container.innerHTML = projects.map(project => `
            <div class="d-flex justify-content-between align-items-center mb-2">
                <div>
                    <h6 class="mb-0">${project.name}</h6>
                    <small class="text-muted">${project.description || 'No description'}</small>
                </div>
                <span class="badge bg-${this.getStatusColor(project.status)}">${project.status}</span>
            </div>
        `).join('');
    }

    updateRecentTasks(tasks) {
        const container = document.getElementById('recentTasksList');
        if (!container) return;

        if (tasks.length === 0) {
            container.innerHTML = '<p class="text-muted text-center">No tasks yet</p>';
            return;
        }

        container.innerHTML = tasks.map(task => `
            <div class="d-flex justify-content-between align-items-center mb-2">
                <div>
                    <h6 class="mb-0">${task.title}</h6>
                    <small class="text-muted">${task.project?.name || 'No project'}</small>
                </div>
                <span class="badge bg-${this.getStatusColor(task.status)}">${task.status}</span>
            </div>
        `).join('');
    }

    getStatusColor(status) {
        const colors = {
            'ACTIVE': 'primary',
            'COMPLETED': 'success',
            'ON_HOLD': 'warning',
            'CANCELLED': 'danger',
            'NOT_STARTED': 'secondary',
            'IN_PROGRESS': 'info'
        };
        return colors[status] || 'secondary';
    }

    isTaskOverdue(task) {
        if (!task.dueDate || task.status === 'COMPLETED') return false;
        return new Date(task.dueDate) < new Date();
    }

    async apiCall(endpoint, method = 'GET', data = null) {
        const url = `${this.apiBaseUrl}${endpoint}`;
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        if (data && method !== 'GET') {
            options.body = JSON.stringify(data);
        }

        try {
            const response = await fetch(url, options);
            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'API request failed');
            }

            return { success: true, data: result };
        } catch (error) {
            console.error('API call failed:', error);
            return { success: false, error: error.message };
        }
    }

    showLoading(show = true) {
        const spinner = document.getElementById('loadingSpinner');
        if (spinner) {
            spinner.classList.toggle('d-none', !show);
        }
    }

    showError(message) {
        // Create a toast notification
        const toast = document.createElement('div');
        toast.className = 'alert alert-danger alert-dismissible fade show position-fixed';
        toast.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
        toast.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        document.body.appendChild(toast);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (toast.parentNode) {
                toast.remove();
            }
        }, 5000);
    }

    showSuccess(message) {
        const toast = document.createElement('div');
        toast.className = 'alert alert-success alert-dismissible fade show position-fixed';
        toast.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
        toast.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            if (toast.parentNode) {
                toast.remove();
            }
        }, 5000);
    }

    setupWebSocket() {
        // WebSocket setup for real-time updates
        // This will be implemented when the backend WebSocket is ready
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Placeholder methods for other modules
    loadProjects() {
        // Will be implemented in projects.js
        console.log('Loading projects...');
    }

    loadTasks() {
        // Will be implemented in tasks.js
        console.log('Loading tasks...');
    }

    loadKanban() {
        // Initialize kanban manager if not already done
        if (!window.kanbanManager) {
            window.kanbanManager = new KanbanManager();
        }
        
        // Always refresh the board to get latest tasks
        if (window.kanbanManager) {
            window.kanbanManager.refreshBoard();
        }
        
        // Setup kanban filter event listeners
        const kanbanProjectFilter = document.getElementById('kanbanProjectFilter');
        if (kanbanProjectFilter && !kanbanProjectFilter.hasAttribute('data-filter-setup')) {
            kanbanProjectFilter.setAttribute('data-filter-setup', 'true');
            kanbanProjectFilter.addEventListener('change', () => {
                if (window.kanbanManager) {
                    window.kanbanManager.filterTasks();
                }
            });
        }
    }

    filterProjects() {
        // Will be implemented in projects.js
        console.log('Filtering projects...');
    }

    filterTasks() {
        // Will be implemented in tasks.js
        console.log('Filtering tasks...');
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.worksyncApp = new WorkSyncApp();
});

// Export for use in other modules
window.WorkSyncApp = WorkSyncApp; 