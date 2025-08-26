// Projects Management Module

class ProjectsManager {
    constructor() {
        this.projects = [];
        this.filteredProjects = [];
        this.init();
    }

    init() {
        this.loadProjects();
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Create project form
        document.getElementById('saveProjectBtn')?.addEventListener('click', () => {
            this.createProject();
        });

        // Project form submission
        document.getElementById('createProjectForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.createProject();
        });

        // Setup filter event listeners
        this.setupFilterListeners();
    }

    setupFilterListeners() {
        // Project search
        const projectSearch = document.getElementById('projectSearch');
        if (projectSearch) {
            projectSearch.addEventListener('input', () => {
                this.filterProjects();
            });
        }

        // Project filters
        ['projectStatusFilter', 'projectSortBy'].forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('change', () => {
                    this.filterProjects();
                });
            }
        });
    }

    async loadProjects() {
        try {
            // For demo purposes, use sample data
            this.projects = [
                {
                    id: 1,
                    name: 'Website Redesign',
                    description: 'Redesign the company website with modern UI/UX principles and responsive design',
                    status: 'ACTIVE',
                    progress: 65,
                    tags: ['design', 'frontend', 'responsive'],
                    startDate: '2024-01-15',
                    endDate: '2024-03-15',
                    createdAt: '2024-01-15',
                    updatedAt: '2024-01-25'
                },
                {
                    id: 2,
                    name: 'Mobile App Development',
                    description: 'Develop a new mobile application for iOS and Android platforms',
                    status: 'ACTIVE',
                    progress: 30,
                    tags: ['mobile', 'ios', 'android'],
                    startDate: '2024-01-20',
                    endDate: '2024-06-20',
                    createdAt: '2024-01-20',
                    updatedAt: '2024-01-28'
                },
                {
                    id: 3,
                    name: 'Marketing Campaign',
                    description: 'Launch Q1 marketing campaign across all digital channels',
                    status: 'COMPLETED',
                    progress: 100,
                    tags: ['marketing', 'digital', 'campaign'],
                    startDate: '2024-01-01',
                    endDate: '2024-01-31',
                    createdAt: '2024-01-01',
                    updatedAt: '2024-01-31'
                },
                {
                    id: 4,
                    name: 'Database Migration',
                    description: 'Migrate legacy database to new cloud-based solution',
                    status: 'ON_HOLD',
                    progress: 15,
                    tags: ['database', 'migration', 'cloud'],
                    startDate: '2024-02-01',
                    endDate: '2024-04-01',
                    createdAt: '2024-02-01',
                    updatedAt: '2024-02-05'
                }
            ];

            this.filteredProjects = [...this.projects];
            this.renderProjects();
            this.updateProjectFilters();
        } catch (error) {
            console.error('Failed to load projects:', error);
            window.worksyncApp.showError('Failed to load projects');
        }
    }

    renderProjects() {
        const container = document.getElementById('projectsGrid');
        if (!container) return;

        if (this.filteredProjects.length === 0) {
            container.innerHTML = `
                <div class="col-12 text-center">
                    <div class="card">
                        <div class="card-body py-5">
                            <i class="bi bi-folder-x fs-1 text-muted mb-3"></i>
                            <h5 class="text-muted">No projects found</h5>
                            <p class="text-muted">Create your first project to get started</p>
                            <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#createProjectModal">
                                <i class="bi bi-plus me-2"></i>Create Project
                            </button>
                        </div>
                    </div>
                </div>
            `;
            return;
        }

        container.innerHTML = this.filteredProjects.map(project => `
            <div class="col-md-6 col-lg-4 mb-4">
                <div class="card project-card h-100">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-start mb-3">
                            <h5 class="card-title mb-0">${project.name}</h5>
                            <div class="dropdown">
                                <button class="btn btn-sm btn-outline-secondary" type="button" data-bs-toggle="dropdown">
                                    <i class="bi bi-three-dots"></i>
                                </button>
                                <ul class="dropdown-menu">
                                    <li><a class="dropdown-item" href="#" onclick="projectsManager.editProject(${project.id})">
                                        <i class="bi bi-pencil me-2"></i>Edit
                                    </a></li>
                                    <li><a class="dropdown-item" href="#" onclick="projectsManager.viewProject(${project.id})">
                                        <i class="bi bi-eye me-2"></i>View Details
                                    </a></li>
                                    <li><hr class="dropdown-divider"></li>
                                    <li><a class="dropdown-item text-danger" href="#" onclick="projectsManager.deleteProject(${project.id})">
                                        <i class="bi bi-trash me-2"></i>Delete
                                    </a></li>
                                </ul>
                            </div>
                        </div>
                        
                        <p class="card-text text-muted mb-3">${project.description}</p>
                        
                        <div class="mb-3">
                            <div class="d-flex justify-content-between align-items-center mb-1">
                                <small class="text-muted">Progress</small>
                                <small class="text-muted">${project.progress}%</small>
                            </div>
                            <div class="progress" style="height: 6px;">
                                <div class="progress-bar bg-${this.getProgressColor(project.progress)}" 
                                     style="width: ${project.progress}%"></div>
                            </div>
                        </div>
                        
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <span class="badge bg-${this.getStatusColor(project.status)}">${project.status}</span>
                            <small class="text-muted">${this.formatDate(project.updatedAt)}</small>
                        </div>
                        
                        ${project.tags && project.tags.length > 0 ? `
                            <div class="project-tags">
                                ${project.tags.map(tag => `<span class="project-tag">${tag}</span>`).join('')}
                            </div>
                        ` : ''}
                    </div>
                </div>
            </div>
        `).join('');
    }

    async createProject() {
        const form = document.getElementById('createProjectForm');
        const formData = new FormData(form);
        
        const projectData = {
            name: formData.get('projectName') || document.getElementById('projectName').value,
            description: formData.get('projectDescription') || document.getElementById('projectDescription').value,
            tags: (formData.get('projectTags') || document.getElementById('projectTags').value)
                .split(',').map(tag => tag.trim()).filter(tag => tag),
            startDate: formData.get('projectStartDate') || document.getElementById('projectStartDate').value,
            endDate: formData.get('projectEndDate') || document.getElementById('projectEndDate').value
        };

        if (!projectData.name) {
            window.worksyncApp.showError('Project name is required');
            return;
        }

        try {
            // For demo purposes, create project locally
            const newProject = {
                id: Date.now(),
                ...projectData,
                status: 'ACTIVE',
                progress: 0,
                createdAt: new Date().toISOString().split('T')[0],
                updatedAt: new Date().toISOString().split('T')[0]
            };

            this.projects.unshift(newProject);
            this.filteredProjects = [...this.projects];
            this.renderProjects();
            this.updateProjectFilters();

            // Close modal and reset form
            const modal = bootstrap.Modal.getInstance(document.getElementById('createProjectModal'));
            modal.hide();
            form.reset();

            window.worksyncApp.showSuccess('Project created successfully');
        } catch (error) {
            console.error('Failed to create project:', error);
            window.worksyncApp.showError('Failed to create project');
        }
    }

    editProject(projectId) {
        const project = this.projects.find(p => p.id === projectId);
        if (!project) return;

        // Populate form with project data
        document.getElementById('projectName').value = project.name;
        document.getElementById('projectDescription').value = project.description;
        document.getElementById('projectTags').value = project.tags?.join(', ') || '';
        document.getElementById('projectStartDate').value = project.startDate || '';
        document.getElementById('projectEndDate').value = project.endDate || '';

        // Change modal title and button
        document.querySelector('#createProjectModal .modal-title').textContent = 'Edit Project';
        document.getElementById('saveProjectBtn').textContent = 'Update Project';

        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('createProjectModal'));
        modal.show();
    }

    viewProject(projectId) {
        const project = this.projects.find(p => p.id === projectId);
        if (!project) return;

        // Create and show project details modal
        const modalHtml = `
            <div class="modal fade" id="projectDetailsModal" tabindex="-1">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">${project.name}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <div class="row">
                                <div class="col-md-8">
                                    <h6>Description</h6>
                                    <p class="text-muted">${project.description}</p>
                                    
                                    <h6>Progress</h6>
                                    <div class="progress mb-3" style="height: 10px;">
                                        <div class="progress-bar bg-${this.getProgressColor(project.progress)}" 
                                             style="width: ${project.progress}%"></div>
                                    </div>
                                    <p class="text-muted">${project.progress}% complete</p>
                                </div>
                                <div class="col-md-4">
                                    <h6>Details</h6>
                                    <ul class="list-unstyled">
                                        <li><strong>Status:</strong> <span class="badge bg-${this.getStatusColor(project.status)}">${project.status}</span></li>
                                        <li><strong>Start Date:</strong> ${project.startDate || 'Not set'}</li>
                                        <li><strong>End Date:</strong> ${project.endDate || 'Not set'}</li>
                                        <li><strong>Created:</strong> ${this.formatDate(project.createdAt)}</li>
                                        <li><strong>Updated:</strong> ${this.formatDate(project.updatedAt)}</li>
                                    </ul>
                                    
                                    ${project.tags && project.tags.length > 0 ? `
                                        <h6>Tags</h6>
                                        <div class="mb-3">
                                            ${project.tags.map(tag => `<span class="project-tag">${tag}</span>`).join('')}
                                        </div>
                                    ` : ''}
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-primary" onclick="projectsManager.editProject(${project.id})">
                                <i class="bi bi-pencil me-2"></i>Edit Project
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Remove existing modal if any
        const existingModal = document.getElementById('projectDetailsModal');
        if (existingModal) {
            existingModal.remove();
        }

        // Add new modal to body
        document.body.insertAdjacentHTML('beforeend', modalHtml);

        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('projectDetailsModal'));
        modal.show();

        // Clean up modal after it's hidden
        document.getElementById('projectDetailsModal').addEventListener('hidden.bs.modal', function() {
            this.remove();
        });
    }

    deleteProject(projectId) {
        if (!confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
            return;
        }

        try {
            this.projects = this.projects.filter(p => p.id !== projectId);
            this.filteredProjects = this.filteredProjects.filter(p => p.id !== projectId);
            this.renderProjects();
            this.updateProjectFilters();
            window.worksyncApp.showSuccess('Project deleted successfully');
        } catch (error) {
            console.error('Failed to delete project:', error);
            window.worksyncApp.showError('Failed to delete project');
        }
    }

    filterProjects() {
        const searchTerm = document.getElementById('projectSearch')?.value.toLowerCase() || '';
        const statusFilter = document.getElementById('projectStatusFilter')?.value || '';
        const sortBy = document.getElementById('projectSortBy')?.value || 'createdAt';

        this.filteredProjects = this.projects.filter(project => {
            const matchesSearch = project.name.toLowerCase().includes(searchTerm) ||
                                project.description.toLowerCase().includes(searchTerm) ||
                                project.tags?.some(tag => tag.toLowerCase().includes(searchTerm));
            
            const matchesStatus = !statusFilter || project.status === statusFilter;
            
            return matchesSearch && matchesStatus;
        });

        // Sort projects
        this.filteredProjects.sort((a, b) => {
            switch (sortBy) {
                case 'name':
                    return a.name.localeCompare(b.name);
                case 'progress':
                    return b.progress - a.progress;
                case 'updatedAt':
                    return new Date(b.updatedAt) - new Date(a.updatedAt);
                case 'createdAt':
                default:
                    return new Date(b.createdAt) - new Date(a.createdAt);
            }
        });

        this.renderProjects();
    }

    updateProjectFilters() {
        // Update project filter dropdowns in other modules
        const projectFilters = ['taskProjectFilter', 'kanbanProjectFilter'];

        projectFilters.forEach(filterId => {
            const filter = document.getElementById(filterId);
            if (filter) {
                const currentValue = filter.value;
                filter.innerHTML = '<option value="">All Projects</option>';

                this.projects.forEach(project => {
                    const option = document.createElement('option');
                    option.value = project.id;
                    option.textContent = project.name;
                    filter.appendChild(option);
                });

                filter.value = currentValue;
            }
        });

        // Update the create task modal project selector
        const taskProjectSelect = document.getElementById('taskProject');
        if (taskProjectSelect) {
            const currentValue = taskProjectSelect.value;
            taskProjectSelect.innerHTML = '<option value="">Select Project</option>';

            this.projects.forEach(project => {
                const option = document.createElement('option');
                option.value = project.id;
                option.textContent = project.name;
                taskProjectSelect.appendChild(option);
            });

            // restore previously selected value if still present
            taskProjectSelect.value = currentValue;
        }
    }

    getStatusColor(status) {
        const colors = {
            'ACTIVE': 'primary',
            'COMPLETED': 'success',
            'ON_HOLD': 'warning',
            'CANCELLED': 'danger'
        };
        return colors[status] || 'secondary';
    }

    getProgressColor(progress) {
        if (progress >= 80) return 'success';
        if (progress >= 50) return 'warning';
        return 'danger';
    }

    formatDate(dateString) {
        if (!dateString) return 'Not set';
        return new Date(dateString).toLocaleDateString();
    }

    getProjectById(id) {
        return this.projects.find(p => p.id === id);
    }
}

// Initialize projects manager
let projectsManager;
document.addEventListener('DOMContentLoaded', () => {
    projectsManager = new ProjectsManager();
});

// Export for global access
window.projectsManager = projectsManager; 