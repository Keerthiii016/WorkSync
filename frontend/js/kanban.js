// Kanban Board Module

class KanbanManager {
    constructor() {
        this.tasks = [];
        this.allTasks = []; // <--- Added master task list
        this.init();
    }

    init() {
        this.loadTasks();
        this.setupEventListeners();
        this.initializeSortable();
    }

    setupEventListeners() {
        // Project filter for kanban - this will be set up by app.js when navigating to workflow page
        // No need to set up here to avoid duplicate listeners
    }

    async loadTasks() {
        try {
            // Use sample data for now to ensure it loads quickly
            this.allTasks = [ // <--- Set master task list
                    {
                        id: 1,
                        title: 'Design Homepage Layout',
                        description: 'Create wireframes and mockups for the new homepage design',
                        project: { id: 1, name: 'Website Redesign' },
                        status: 'COMPLETED',
                        priority: 'HIGH',
                        assignedTo: { id: 1, name: 'Demo User' },
                        dueDate: '2024-01-25',
                        completedAt: '2024-01-24'
                    },
                    {
                        id: 2,
                        title: 'Implement User Authentication',
                        description: 'Set up user registration, login, and password reset functionality',
                        project: { id: 2, name: 'Mobile App Development' },
                        status: 'IN_PROGRESS',
                        priority: 'URGENT',
                        assignedTo: { id: 1, name: 'Demo User' },
                        dueDate: '2024-02-01'
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
                        completedAt: '2024-01-14'
                    },
                    {
                        id: 4,
                        title: 'Database Schema Design',
                        description: 'Design the database structure for the new mobile application',
                        project: { id: 2, name: 'Mobile App Development' },
                        status: 'NOT_STARTED',
                        priority: 'HIGH',
                        assignedTo: { id: 1, name: 'Demo User' },
                        dueDate: '2024-02-05'
                    },
                    {
                        id: 5,
                        title: 'SEO Optimization',
                        description: 'Optimize website content and meta tags for search engines',
                        project: { id: 1, name: 'Website Redesign' },
                        status: 'ON_HOLD',
                        priority: 'LOW',
                        assignedTo: { id: 1, name: 'Demo User' },
                        dueDate: '2024-02-10'
                    },
                    {
                        id: 6,
                        title: 'API Integration',
                        description: 'Integrate third-party APIs for payment processing',
                        project: { id: 2, name: 'Mobile App Development' },
                        status: 'IN_PROGRESS',
                        priority: 'HIGH',
                        assignedTo: { id: 1, name: 'Demo User' },
                        dueDate: '2024-02-15'
                    }
                ];

            this.tasks = [...this.allTasks]; // <--- Set display list from master
            this.renderKanbanBoard();
        } catch (error) {
            console.error('Failed to load kanban tasks:', error);
            window.worksyncApp.showError('Failed to load kanban board');
        }
    }

    renderKanbanBoard() {
        this.renderColumn('todoTasks', 'NOT_STARTED');
        this.renderColumn('inProgressTasks', 'IN_PROGRESS');
        this.renderColumn('onHoldTasks', 'ON_HOLD');
        this.renderColumn('doneTasks', 'COMPLETED');
    }

    renderColumn(containerId, status) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const tasksInStatus = this.tasks.filter(task => task.status === status);
        
        if (tasksInStatus.length === 0) {
            container.innerHTML = `
                <div class="text-center text-muted py-4">
                    <i class="bi bi-inbox fs-4 d-block mb-2"></i>
                    <small>No tasks</small>
                </div>
            `;
            return;
        }

        container.innerHTML = tasksInStatus.map(task => this.createTaskCard(task)).join('');
    }

    createTaskCard(task) {
        const isOverdue = this.isTaskOverdue(task);
        const priorityClass = this.getPriorityClass(task.priority);
        
        return `
            <div class="kanban-task ${priorityClass} ${isOverdue ? 'overdue' : ''}" data-task-id="${task.id}">
                <div class="d-flex justify-content-between align-items-start mb-2">
                    <h6 class="mb-0 task-title">${task.title}</h6>
                    <div class="dropdown">
                        <button class="btn btn-sm btn-link p-0" type="button" data-bs-toggle="dropdown">
                            <i class="bi bi-three-dots-vertical"></i>
                        </button>
                        <ul class="dropdown-menu">
                            <li><a class="dropdown-item" href="#" onclick="kanbanManager.editTask(${task.id})">
                                <i class="bi bi-pencil me-2"></i>Edit
                            </a></li>
                            <li><a class="dropdown-item" href="#" onclick="kanbanManager.viewTaskDetails(${task.id})">
                                <i class="bi bi-eye me-2"></i>View Details
                            </a></li>
                            <li><hr class="dropdown-divider"></li>
                            <li><a class="dropdown-item text-danger" href="#" onclick="kanbanManager.deleteTask(${task.id})">
                                <i class="bi bi-trash me-2"></i>Delete
                            </a></li>
                        </ul>
                    </div>
                </div>
                
                ${task.description ? `<p class="task-description mb-2">${task.description}</p>` : ''}
                
                <div class="task-meta">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <span class="badge bg-light text-dark">${task.project?.name || 'No Project'}</span>
                        <span class="priority-${task.priority.toLowerCase()}">
                            <i class="bi bi-flag-fill me-1"></i>${task.priority}
                        </span>
                    </div>
                    
                    <div class="d-flex justify-content-between align-items-center">
                        <small class="text-muted">
                            <i class="bi bi-person me-1"></i>${task.assignedTo?.name || 'Unassigned'}
                        </small>
                        ${task.dueDate ? `
                            <small class="${isOverdue ? 'text-danger' : 'text-muted'}">
                                <i class="bi bi-calendar me-1"></i>${this.formatDate(task.dueDate)}
                                ${isOverdue ? '<i class="bi bi-exclamation-triangle ms-1"></i>' : ''}
                            </small>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
    }

    initializeSortable() {
        const columns = ['todoTasks', 'inProgressTasks', 'onHoldTasks', 'doneTasks'];
        
        columns.forEach(columnId => {
            const container = document.getElementById(columnId);
            if (container) {
                new Sortable(container, {
                    group: 'tasks',
                    animation: 150,
                    ghostClass: 'kanban-task-ghost',
                    chosenClass: 'kanban-task-chosen',
                    dragClass: 'kanban-task-drag',
                    onEnd: (evt) => {
                        this.handleTaskMove(evt);
                    }
                });
            }
        });
    }

    handleTaskMove(evt) {
        const taskId = parseInt(evt.item.dataset.taskId);
        const newStatus = evt.to.dataset.status;
        
        if (!taskId || !newStatus) return;

        // Update task status
        const task = this.tasks.find(t => t.id === taskId);
        if (task && task.status !== newStatus) {
            const oldStatus = task.status;
            task.status = newStatus;
            
            if (newStatus === 'COMPLETED') {
                task.completedAt = new Date().toISOString().split('T')[0];
            } else {
                task.completedAt = null;
            }

            // Update in tasks manager if available
            if (window.tasksManager) {
                const taskInManager = window.tasksManager.tasks.find(t => t.id === taskId);
                if (taskInManager) {
                    taskInManager.status = newStatus;
                    taskInManager.completedAt = task.completedAt;
                }
            }

            window.worksyncApp.showSuccess(`Task moved from ${oldStatus.replace('_', ' ')} to ${newStatus.replace('_', ' ')}`);
        }
    }

    filterTasks() {
        const projectFilter = document.getElementById('kanbanProjectFilter')?.value;
        console.log('Filtering tasks with project filter:', projectFilter);
        
        // Always filter from master list (allTasks) or window.tasksManager if available
        let currentTasks = window.tasksManager ? [...window.tasksManager.tasks] : this.allTasks;
        
        if (!projectFilter || projectFilter === '' || projectFilter === 'All Projects') {
            // Show all tasks when "All Projects" is selected
            this.tasks = [...currentTasks];
            console.log('Showing all tasks:', this.tasks.length);
        } else {
            // Filter by project
            this.tasks = currentTasks.filter(task => task.project?.id === parseInt(projectFilter));
            console.log('Filtered tasks for project', projectFilter, ':', this.tasks.length);
        }

        this.renderKanbanBoard();
    }

    editTask(taskId) {
        if (window.tasksManager) {
            window.tasksManager.editTask(taskId);
        }
    }

    viewTaskDetails(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (!task) return;

        // Create and show task details modal
        const modalHtml = `
            <div class="modal fade" id="taskDetailsModal" tabindex="-1">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">${task.title}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <div class="row">
                                <div class="col-md-8">
                                    <h6>Description</h6>
                                    <p class="text-muted">${task.description || 'No description provided'}</p>
                                    
                                    <h6>Project</h6>
                                    <p class="text-muted">${task.project?.name || 'No project assigned'}</p>
                                </div>
                                <div class="col-md-4">
                                    <h6>Details</h6>
                                    <ul class="list-unstyled">
                                        <li><strong>Status:</strong> <span class="badge bg-${this.getStatusColor(task.status)}">${task.status.replace('_', ' ')}</span></li>
                                        <li><strong>Priority:</strong> <span class="priority-${task.priority.toLowerCase()}">${task.priority}</span></li>
                                        <li><strong>Assigned To:</strong> ${task.assignedTo?.name || 'Unassigned'}</li>
                                        <li><strong>Due Date:</strong> ${task.dueDate ? this.formatDate(task.dueDate) : 'Not set'}</li>
                                        ${task.completedAt ? `<li><strong>Completed:</strong> ${this.formatDate(task.completedAt)}</li>` : ''}
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-primary" onclick="kanbanManager.editTask(${task.id})">
                                <i class="bi bi-pencil me-2"></i>Edit Task
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Remove existing modal if any
        const existingModal = document.getElementById('taskDetailsModal');
        if (existingModal) {
            existingModal.remove();
        }

        // Add new modal to body
        document.body.insertAdjacentHTML('beforeend', modalHtml);

        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('taskDetailsModal'));
        modal.show();

        // Clean up modal after it's hidden
        document.getElementById('taskDetailsModal').addEventListener('hidden.bs.modal', function() {
            this.remove();
        });
    }

    deleteTask(taskId) {
        if (!confirm('Are you sure you want to delete this task? This action cannot be undone.')) {
            return;
        }

        try {
            this.tasks = this.tasks.filter(t => t.id !== taskId);
            
            // Update in tasks manager if available
            if (window.tasksManager) {
                window.tasksManager.tasks = window.tasksManager.tasks.filter(t => t.id !== taskId);
                window.tasksManager.filteredTasks = window.tasksManager.filteredTasks.filter(t => t.id !== taskId);
                window.tasksManager.renderTasks();
            }

            // Also remove from master task list
            this.allTasks = this.allTasks.filter(t => t.id !== taskId);

            this.renderKanbanBoard();
            window.worksyncApp.showSuccess('Task deleted successfully');
        } catch (error) {
            console.error('Failed to delete task:', error);
            window.worksyncApp.showError('Failed to delete task');
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

    getPriorityClass(priority) {
        const classes = {
            'LOW': 'low-priority',
            'MEDIUM': 'medium-priority',
            'HIGH': 'high-priority',
            'URGENT': 'high-priority'
        };
        return classes[priority] || 'medium-priority';
    }

    isTaskOverdue(task) {
        if (!task.dueDate || task.status === 'COMPLETED') return false;
        return new Date(task.dueDate) < new Date();
    }

    formatDate(dateString) {
        if (!dateString) return 'Not set';
        return new Date(dateString).toLocaleDateString();
    }

    refreshBoard() {
        // Refresh tasks from tasks manager if available
        if (window.tasksManager && window.tasksManager.tasks.length > 0) {
            this.allTasks = [...window.tasksManager.tasks]; // <--- Sync master list
            this.tasks = [...this.allTasks]; // <--- Sync display list
            console.log('Refreshed from tasks manager:', this.tasks.length, 'tasks');
        }
        this.filterTasks(); // Re-apply current filter and render
    }

    // Method to be called when tasks are updated
    updateFromTasksManager() {
        if (window.tasksManager) {
            this.allTasks = [...window.tasksManager.tasks]; // <--- Sync master list
            this.filterTasks(); // Re-apply current filter
        }
    }
}

// Export for global access
window.KanbanManager = KanbanManager;