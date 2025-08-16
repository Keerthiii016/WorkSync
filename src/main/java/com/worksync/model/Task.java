package com.worksync.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "tasks")
public class Task {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Task title is required")
    @Size(max = 200, message = "Task title cannot exceed 200 characters")
    @Column(nullable = false)
    private String title;
    
    @Size(max = 2000, message = "Description cannot exceed 2000 characters")
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TaskStatus status = TaskStatus.NOT_STARTED;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TaskPriority priority = TaskPriority.MEDIUM;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_to")
    private User assignedTo;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by", nullable = false)
    private User createdBy;
    
    @Column(name = "due_date")
    private LocalDate dueDate;
    
    @Column(name = "completed_at")
    private LocalDateTime completedAt;
    
    @Column(name = "estimated_hours")
    private Integer estimatedHours;
    
    @Column(name = "actual_hours")
    private Integer actualHours;
    
    @ElementCollection
    @CollectionTable(name = "task_tags", joinColumns = @JoinColumn(name = "task_id"))
    @Column(name = "tag")
    private List<String> tags = new ArrayList<>();
    
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "task_dependencies",
        joinColumns = @JoinColumn(name = "task_id"),
        inverseJoinColumns = @JoinColumn(name = "dependency_id")
    )
    private List<Task> dependencies = new ArrayList<>();
    
    @OneToMany(mappedBy = "task", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Comment> comments = new ArrayList<>();
    
    @OneToMany(mappedBy = "task", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<TaskAttachment> attachments = new ArrayList<>();
    
    @OneToMany(mappedBy = "task", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<TaskChecklistItem> checklist = new ArrayList<>();
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Constructors
    public Task() {}
    
    public Task(String title, String description, Project project, User createdBy) {
        this.title = title;
        this.description = description;
        this.project = project;
        this.createdBy = createdBy;
    }
    
    // Lifecycle methods
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    // Business methods
    public void markAsCompleted() {
        this.status = TaskStatus.COMPLETED;
        this.completedAt = LocalDateTime.now();
    }
    
    public void markAsInProgress() {
        this.status = TaskStatus.IN_PROGRESS;
        this.completedAt = null;
    }
    
    public boolean isOverdue() {
        return dueDate != null && dueDate.isBefore(LocalDate.now()) && status != TaskStatus.COMPLETED;
    }
    
    public boolean isDueSoon() {
        if (dueDate == null || status == TaskStatus.COMPLETED) {
            return false;
        }
        LocalDate today = LocalDate.now();
        LocalDate threeDaysFromNow = today.plusDays(3);
        return dueDate.isAfter(today) && dueDate.isBefore(threeDaysFromNow);
    }
    
    // Enums
    public enum TaskStatus {
        NOT_STARTED, IN_PROGRESS, ON_HOLD, COMPLETED
    }
    
    public enum TaskPriority {
        LOW, MEDIUM, HIGH, URGENT
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getTitle() {
        return title;
    }
    
    public void setTitle(String title) {
        this.title = title;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public Project getProject() {
        return project;
    }
    
    public void setProject(Project project) {
        this.project = project;
    }
    
    public TaskStatus getStatus() {
        return status;
    }
    
    public void setStatus(TaskStatus status) {
        this.status = status;
    }
    
    public TaskPriority getPriority() {
        return priority;
    }
    
    public void setPriority(TaskPriority priority) {
        this.priority = priority;
    }
    
    public User getAssignedTo() {
        return assignedTo;
    }
    
    public void setAssignedTo(User assignedTo) {
        this.assignedTo = assignedTo;
    }
    
    public User getCreatedBy() {
        return createdBy;
    }
    
    public void setCreatedBy(User createdBy) {
        this.createdBy = createdBy;
    }
    
    public LocalDate getDueDate() {
        return dueDate;
    }
    
    public void setDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
    }
    
    public LocalDateTime getCompletedAt() {
        return completedAt;
    }
    
    public void setCompletedAt(LocalDateTime completedAt) {
        this.completedAt = completedAt;
    }
    
    public Integer getEstimatedHours() {
        return estimatedHours;
    }
    
    public void setEstimatedHours(Integer estimatedHours) {
        this.estimatedHours = estimatedHours;
    }
    
    public Integer getActualHours() {
        return actualHours;
    }
    
    public void setActualHours(Integer actualHours) {
        this.actualHours = actualHours;
    }
    
    public List<String> getTags() {
        return tags;
    }
    
    public void setTags(List<String> tags) {
        this.tags = tags;
    }
    
    public List<Task> getDependencies() {
        return dependencies;
    }
    
    public void setDependencies(List<Task> dependencies) {
        this.dependencies = dependencies;
    }
    
    public List<Comment> getComments() {
        return comments;
    }
    
    public void setComments(List<Comment> comments) {
        this.comments = comments;
    }
    
    public List<TaskAttachment> getAttachments() {
        return attachments;
    }
    
    public void setAttachments(List<TaskAttachment> attachments) {
        this.attachments = attachments;
    }
    
    public List<TaskChecklistItem> getChecklist() {
        return checklist;
    }
    
    public void setChecklist(List<TaskChecklistItem> checklist) {
        this.checklist = checklist;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
    
    // Inner classes for attachments and checklist items
    @Entity
    @Table(name = "task_attachments")
    public static class TaskAttachment {
        
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;
        
        @Column(name = "filename")
        private String filename;
        
        @Column(name = "original_name")
        private String originalName;
        
        @Column(name = "mime_type")
        private String mimeType;
        
        @Column(name = "file_size")
        private Long fileSize;
        
        @Column(name = "file_url")
        private String fileUrl;
        
        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "task_id")
        private Task task;
        
        // Constructors
        public TaskAttachment() {}
        
        public TaskAttachment(String filename, String originalName, String mimeType, Long fileSize, String fileUrl) {
            this.filename = filename;
            this.originalName = originalName;
            this.mimeType = mimeType;
            this.fileSize = fileSize;
            this.fileUrl = fileUrl;
        }
        
        // Getters and Setters
        public Long getId() {
            return id;
        }
        
        public void setId(Long id) {
            this.id = id;
        }
        
        public String getFilename() {
            return filename;
        }
        
        public void setFilename(String filename) {
            this.filename = filename;
        }
        
        public String getOriginalName() {
            return originalName;
        }
        
        public void setOriginalName(String originalName) {
            this.originalName = originalName;
        }
        
        public String getMimeType() {
            return mimeType;
        }
        
        public void setMimeType(String mimeType) {
            this.mimeType = mimeType;
        }
        
        public Long getFileSize() {
            return fileSize;
        }
        
        public void setFileSize(Long fileSize) {
            this.fileSize = fileSize;
        }
        
        public String getFileUrl() {
            return fileUrl;
        }
        
        public void setFileUrl(String fileUrl) {
            this.fileUrl = fileUrl;
        }
        
        public Task getTask() {
            return task;
        }
        
        public void setTask(Task task) {
            this.task = task;
        }
    }
    
    @Entity
    @Table(name = "task_checklist_items")
    public static class TaskChecklistItem {
        
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;
        
        @Column(nullable = false)
        private String item;
        
        @Column(name = "is_completed")
        private boolean completed = false;
        
        @Column(name = "completed_at")
        private LocalDateTime completedAt;
        
        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "task_id")
        private Task task;
        
        // Constructors
        public TaskChecklistItem() {}
        
        public TaskChecklistItem(String item) {
            this.item = item;
        }
        
        // Business methods
        public void toggle() {
            this.completed = !this.completed;
            this.completedAt = this.completed ? LocalDateTime.now() : null;
        }
        
        // Getters and Setters
        public Long getId() {
            return id;
        }
        
        public void setId(Long id) {
            this.id = id;
        }
        
        public String getItem() {
            return item;
        }
        
        public void setItem(String item) {
            this.item = item;
        }
        
        public boolean isCompleted() {
            return completed;
        }
        
        public void setCompleted(boolean completed) {
            this.completed = completed;
        }
        
        public LocalDateTime getCompletedAt() {
            return completedAt;
        }
        
        public void setCompletedAt(LocalDateTime completedAt) {
            this.completedAt = completedAt;
        }
        
        public Task getTask() {
            return task;
        }
        
        public void setTask(Task task) {
            this.task = task;
        }
    }
} 