package com.worksync.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "comments")
public class Comment {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Comment content is required")
    @Size(max = 1000, message = "Comment cannot exceed 1000 characters")
    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "task_id", nullable = false)
    private Task task;
    
    @OneToMany(mappedBy = "comment", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<CommentAttachment> attachments = new ArrayList<>();
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Constructors
    public Comment() {}
    
    public Comment(String content, User user, Task task) {
        this.content = content;
        this.user = user;
        this.task = task;
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
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getContent() {
        return content;
    }
    
    public void setContent(String content) {
        this.content = content;
    }
    
    public User getUser() {
        return user;
    }
    
    public void setUser(User user) {
        this.user = user;
    }
    
    public Task getTask() {
        return task;
    }
    
    public void setTask(Task task) {
        this.task = task;
    }
    
    public List<CommentAttachment> getAttachments() {
        return attachments;
    }
    
    public void setAttachments(List<CommentAttachment> attachments) {
        this.attachments = attachments;
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
    
    // Inner class for attachments
    @Entity
    @Table(name = "comment_attachments")
    public static class CommentAttachment {
        
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
        @JoinColumn(name = "comment_id")
        private Comment comment;
        
        // Constructors
        public CommentAttachment() {}
        
        public CommentAttachment(String filename, String originalName, String mimeType, Long fileSize, String fileUrl) {
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
        
        public Comment getComment() {
            return comment;
        }
        
        public void setComment(Comment comment) {
            this.comment = comment;
        }
    }
} 