// Tasks Management Module

class TasksManager {
    constructor() {
        this.tasks = [];
        this.filteredTasks = [];
        this.init();
    }

    init() {
        this.loadTasks();
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Create task form
        document.getElementById('saveTaskBtn')?.addEventListener('click', () => {
            this.createTask();
        });

        // Task form submission
        document.getElementById('createTaskForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.createTask();
        });

        // Reset modal when closed
        const createTaskModal = document.getElementById('createTaskModal');
        if (createTaskModal) {
            createTaskModal.addEventListener('hidden.bs.modal', () => {
                this.resetModal();
            });
        }

        // Setup filter event listeners
        this.setupFilterListeners();
    }

    resetModal() {
        this.editingTaskId = null;
        document.querySelector('#createTaskModal .modal-title').textContent = 'Create New Task';
        document.getElementById('saveTaskBtn').textContent = 'Create Task';
        document.getElementById('createTaskForm').reset();
    }

    setupFilterListeners() {
        // Task search
        const taskSearch = document.getElementById('taskSearch');
        if (taskSearch) {
            taskSearch.addEventListener('input', () => {
                this.filterTasks();
            });
        }

        // Task filters
        ['taskStatusFilter', 'taskPriorityFilter', 'taskProjectFilter', 'taskSortBy'].forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('change', () => {
                    this.filterTasks();
                });
            }
        });
    }

    async loadTasks() {
        try {
            // For demo purposes, use sample data
            this.tasks = [
                {
                    id: 1,
                    title: 'Design Homepage Layout',
                    description: 'Create wireframes and mockups for the new homepage design',
                    project: { id: 1, name: 'Website Redesign' },
                    status: 'COMPLETED',
                    priority: 'HIGH',
                    assignedTo: { id: 1, name: 'Demo User' },
                    dueDate: '2024-01-25',
                    completedAt: '2024-01-24',
                    createdAt: '2024-01-15'
                },
                {
                    id: 2,
                    title: 'Implement User Authentication',
                    description: 'Set up user registration, login, and password reset functionality',
                    project: { id: 2, name: 'Mobile App Development' },
                    status: 'IN_PROGRESS',
                    priority: 'URGENT',
                    assignedTo: { id: 1, name: 'Demo User' },
                    dueDate: '2024-02-01',
                    createdAt: '2024-01-20'
                },
                {
                    id: 3,
                    title: 'Create Social Media Content',
                    description: 'Design and create content for Facebook, Instagram, and LinkedIn',
                    project: { id: 3, name: 'Marketing Campaign' },
                    status: 'COMPLETED',
                    priority: 'MEDIUM',
                    assignedTo: { id: 1, name: 'Demo User' },
                    dueDate: '2024-01-15',
                    completedAt: '2024-01-14',
                    createdAt: '2024-01-01'
                },
                {
                    id: 4,
                    title: 'Database Schema Design',
                    description: 'Design the database structure for the new mobile application',
                    project: { id: 2, name: 'Mobile App Development' },
                    status: 'NOT_STARTED',
                    priority: 'HIGH',
                    assignedTo: { id: 1, name: 'Demo User' },
                    dueDate: '2024-02-05',
                    createdAt: '2024-01-25'
                },
                {
                    id: 5,
                    title: 'SEO Optimization',
                    description: 'Optimize website content and meta tags for search engines',
                    project: { id: 1, name: 'Website Redesign' },
                    status: 'ON_HOLD',
                    priority: 'LOW',
                    assignedTo: { id: 1, name: 'Demo User' },
                    dueDate: '2024-02-10',
                    createdAt: '2024-01-28'
                },
                {
                    id: 6,
                    title: 'API Integration',
                    description: 'Integrate third-party APIs for payment processing',
                    project: { id: 2, name: 'Mobile App Development' },
                    status: 'IN_PROGRESS',
                    priority: 'HIGH',
                    assignedTo: { id: 1, name: 'Demo User' },
                    dueDate: '2024-02-15',
                    createdAt: '2024-01-30'
                }
            ];

            this.filteredTasks = [...this.tasks];
            this.renderTasks();
            this.updateTaskFilters();
        } catch (error) {
            console.error('Failed to load tasks:', error);
            window.worksyncApp.showError('Failed to load tasks');
        }
    }

    renderTasks() {
        const tbody = document.getElementById('tasksTableBody');
        if (!tbody) return;

        if (this.filteredTasks.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" class="text-center py-4">
                        <i class="bi bi-list-task fs-1 text-muted mb-3 d-block"></i>
                        <h6 class="text-muted">No tasks found</h6>
                        <p class="text-muted">Create your first task to get started</p>
                        <button class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#createTaskModal">
                            <i class="bi bi-plus me-2"></i>Create Task
                        </button>
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = this.filteredTasks.map(task => `
            <tr class="${task.status === 'COMPLETED' ? 'table-success' : ''} ${this.isTaskOverdue(task) ? 'table-danger' : ''}">
                <td>
                    <div class="d-flex align-items-center">
                        <div class="me-3">
                            <i class="bi bi-${this.getTaskIcon(task.status)} text-${this.getStatusColor(task.status)}"></i>
                        </div>
                        <div>
                            <strong>${task.title}</strong>
                            ${task.description ? `<br><small class="text-muted">${task.description}</small>` : ''}
                        </div>
                    </div>
                </td>
                <td>
                    <span class="badge bg-light text-dark">${task.project?.name || 'No Project'}</span>
                </td>
                <td>
                    <span class="badge bg-${this.getStatusColor(task.status)}">${task.status.replace('_', ' ')}</span>
                </td>
                <td>
                    <span class="priority-${task.priority.toLowerCase()}">
                        <i class="bi bi-flag-fill me-1"></i>${task.priority}
                    </span>
                </td>
                <td>
                    <div class="d-flex align-items-center">
                        <div class="avatar-sm me-2">
                            <i class="bi bi-person-circle"></i>
                        </div>
                        <span>${task.assignedTo?.name || 'Unassigned'}</span>
                    </div>
                </td>
                <td>
                    ${task.dueDate ? `
                        <span class="${this.isTaskOverdue(task) ? 'text-danger' : ''}">
                            ${this.formatDate(task.dueDate)}
                            ${this.isTaskOverdue(task) ? '<i class="bi bi-exclamation-triangle ms-1"></i>' : ''}
                        </span>
                    ` : '<span class="text-muted">No due date</span>'}
                </td>
                <td>
                    <div class="btn-group btn-group-sm">
                        <button class="btn btn-outline-primary" onclick="tasksManager.editTask(${task.id})" title="Edit">
                            <i class="bi bi-pencil"></i>
                        </button>
                        <button class="btn btn-outline-success" onclick="tasksManager.toggleTaskStatus(${task.id})" title="Toggle Status">
                            <i class="bi bi-${task.status === 'COMPLETED' ? 'arrow-counterclockwise' : 'check-lg'}"></i>
                        </button>
                        <button class="btn btn-outline-danger" onclick="tasksManager.deleteTask(${task.id})" title="Delete">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    async createTask() {
        const form = document.getElementById('createTaskForm');
        const formData = new FormData(form);
        
        const taskData = {
            title: formData.get('taskTitle') || document.getElementById('taskTitle').value,
            description: formData.get('taskDescription') || document.getElementById('taskDescription').value,
            projectId: formData.get('taskProject') || document.getElementById('taskProject').value,
            priority: formData.get('taskPriority') || document.getElementById('taskPriority').value,
            status: formData.get('taskStatus') || document.getElementById('taskStatus').value,
            dueDate: formData.get('taskDueDate') || document.getElementById('taskDueDate').value
        };

        if (!taskData.title) {
            window.worksyncApp.showError('Task title is required');
            return;
        }

        if (!taskData.projectId) {
            window.worksyncApp.showError('Please select a project');
            return;
        }

        try {
            // Get project details (fall back to selected option text if lookup fails)
            const numericProjectId = parseInt(taskData.projectId);
            let project = window.projectsManager?.getProjectById(numericProjectId);
            if (!project) {
                const projectSelect = document.getElementById('taskProject');
                const selectedText = projectSelect?.options[projectSelect.selectedIndex]?.textContent || 'Unknown Project';
                project = { id: numericProjectId || taskData.projectId, name: selectedText };
            }
            
            if (this.editingTaskId) {
                // Update existing task
                const taskIndex = this.tasks.findIndex(t => t.id === this.editingTaskId);
                if (taskIndex !== -1) {
                    this.tasks[taskIndex] = {
                        ...this.tasks[taskIndex],
                        title: taskData.title,
                        description: taskData.description,
                        project: project,
                        status: taskData.status,
                        priority: taskData.priority,
                        dueDate: taskData.dueDate || null
                    };
                    
                    this.filteredTasks = [...this.tasks];
                    this.renderTasks();
                    
                    // Update kanban board if available
                    if (window.kanbanManager) {
                        window.kanbanManager.updateFromTasksManager();
                    }
                    
                    // Reset editing state
                    this.editingTaskId = null;
                    
                    // Close modal and reset form
                    const modal = bootstrap.Modal.getInstance(document.getElementById('createTaskModal'));
                    modal.hide();
                    form.reset();
                    
                    // Reset modal title and button
                    document.querySelector('#createTaskModal .modal-title').textContent = 'Create New Task';
                    document.getElementById('saveTaskBtn').textContent = 'Create Task';
                    
                    window.worksyncApp.showSuccess('Task updated successfully');
                }
            } else {
                // Create new task
                const newTask = {
                    id: Date.now(),
                    title: taskData.title,
                    description: taskData.description,
                    project: project,
                    status: taskData.status,
                    priority: taskData.priority,
                    assignedTo: { id: 1, name: 'Demo User' },
                    dueDate: taskData.dueDate || null,
                    createdAt: new Date().toISOString().split('T')[0]
                };

                            this.tasks.unshift(newTask);
            this.filteredTasks = [...this.tasks];
            this.renderTasks();

            // Update kanban board if available
            if (window.kanbanManager) {
                window.kanbanManager.updateFromTasksManager();
            }

            // Close modal and reset form
            const modal = bootstrap.Modal.getInstance(document.getElementById('createTaskModal'));
            modal.hide();
            form.reset();

            window.worksyncApp.showSuccess('Task created successfully');
            }
        } catch (error) {
            console.error('Failed to save task:', error);
            window.worksyncApp.showError('Failed to save task');
        }
        if (window.kanbanManager) {
            window.kanbanManager.refreshBoard();
        }
    }

    editTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (!task) return;

        // Store the task ID being edited
        this.editingTaskId = taskId;

        // Populate form with task data
        document.getElementById('taskTitle').value = task.title;
        document.getElementById('taskDescription').value = task.description || '';
        document.getElementById('taskProject').value = task.project?.id || '';
        document.getElementById('taskPriority').value = task.priority;
        document.getElementById('taskStatus').value = task.status;
        document.getElementById('taskDueDate').value = task.dueDate || '';

        // Change modal title and button
        document.querySelector('#createTaskModal .modal-title').textContent = 'Edit Task';
        document.getElementById('saveTaskBtn').textContent = 'Update Task';

        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('createTaskModal'));
        modal.show();
    }

    toggleTaskStatus(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (!task) return;

        if (task.status === 'COMPLETED') {
            task.status = 'NOT_STARTED';
            task.completedAt = null;
        } else {
            task.status = 'COMPLETED';
            task.completedAt = new Date().toISOString().split('T')[0];
        }

        this.renderTasks();
        window.worksyncApp.showSuccess(`Task marked as ${task.status.toLowerCase()}`);
    }

    deleteTask(taskId) {
        if (!confirm('Are you sure you want to delete this task? This action cannot be undone.')) {
            return;
        }

        try {
            this.tasks = this.tasks.filter(t => t.id !== taskId);
            this.filteredTasks = this.filteredTasks.filter(t => t.id !== taskId);
            this.renderTasks();
            window.worksyncApp.showSuccess('Task deleted successfully');
        } catch (error) {
            console.error('Failed to delete task:', error);
            window.worksyncApp.showError('Failed to delete task');
        }
    }

    filterTasks() {
        const searchTerm = document.getElementById('taskSearch')?.value.toLowerCase() || '';
        const statusFilter = document.getElementById('taskStatusFilter')?.value || '';
        const priorityFilter = document.getElementById('taskPriorityFilter')?.value || '';
        const projectFilter = document.getElementById('taskProjectFilter')?.value || '';
        const sortBy = document.getElementById('taskSortBy')?.value || 'dueDate';

        this.filteredTasks = this.tasks.filter(task => {
            const matchesSearch = task.title.toLowerCase().includes(searchTerm) ||
                                task.description?.toLowerCase().includes(searchTerm);
            
            const matchesStatus = !statusFilter || task.status === statusFilter;
            const matchesPriority = !priorityFilter || task.priority === priorityFilter;
            const matchesProject = !projectFilter || projectFilter === '' || task.project?.id === parseInt(projectFilter);
            
            return matchesSearch && matchesStatus && matchesPriority && matchesProject;
        });

        // Sort tasks
        this.filteredTasks.sort((a, b) => {
            switch (sortBy) {
                case 'title':
                    return a.title.localeCompare(b.title);
                case 'priority':
                    const priorityOrder = { 'URGENT': 4, 'HIGH': 3, 'MEDIUM': 2, 'LOW': 1 };
                    return priorityOrder[b.priority] - priorityOrder[a.priority];
                case 'createdAt':
                    return new Date(b.createdAt) - new Date(a.createdAt);
                case 'dueDate':
                default:
                    if (!a.dueDate && !b.dueDate) return 0;
                    if (!a.dueDate) return 1;
                    if (!b.dueDate) return -1;
                    return new Date(a.dueDate) - new Date(b.dueDate);
            }
        });

        this.renderTasks();
    }

    updateTaskFilters() {
        // Update project filter dropdown
        const projectFilter = document.getElementById('taskProjectFilter');
        if (projectFilter && window.projectsManager) {
            const currentValue = projectFilter.value;
            projectFilter.innerHTML = '<option value="">All Projects</option>';
            
            window.projectsManager.projects.forEach(project => {
                const option = document.createElement('option');
                option.value = project.id;
                option.textContent = project.name;
                projectFilter.appendChild(option);
            });
            
            projectFilter.value = currentValue;
        }
    }

    getStatusColor(status) {
        const colors = {
            'NOT_STARTED': 'secondary',
            'IN_PROGRESS': 'primary',
            'COMPLETED': 'success',
            'ON_HOLD': 'warning'
        };
        return colors[status] || 'secondary';
    }

    getTaskIcon(status) {
        const icons = {
            'NOT_STARTED': 'circle',
            'IN_PROGRESS': 'arrow-clockwise',
            'COMPLETED': 'check-circle',
            'ON_HOLD': 'pause-circle'
        };
        return icons[status] || 'circle';
    }

    isTaskOverdue(task) {
        if (!task.dueDate || task.status === 'COMPLETED') return false;
        return new Date(task.dueDate) < new Date();
    }

    formatDate(dateString) {
        if (!dateString) return 'Not set';
        return new Date(dateString).toLocaleDateString();
    }

    getTasksByProject(projectId) {
        return this.tasks.filter(task => task.project?.id === projectId);
    }

    getTasksByStatus(status) {
        return this.tasks.filter(task => task.status === status);
    }
}

// Initialize tasks manager
let tasksManager;
document.addEventListener('DOMContentLoaded', () => {
    tasksManager = new TasksManager();
    // Expose globally after initialization so other modules (e.g., kanban) can access it
    window.tasksManager = tasksManager;
});

// Export for global access