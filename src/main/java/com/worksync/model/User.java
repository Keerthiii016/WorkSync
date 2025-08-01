package com.worksync.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.*;

@Entity
@Table(name = "users")
public class User implements UserDetails {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Name is required")
    @Size(min = 2, max = 50, message = "Name must be between 2 and 50 characters")
    @Column(nullable = false)
    private String name;
    
    @NotBlank(message = "Email is required")
    @Email(message = "Please provide a valid email")
    @Column(unique = true, nullable = false)
    private String email;
    
    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    @JsonIgnore
    @Column(nullable = false)
    private String password;
    
    @Column(name = "avatar_url")
    private String avatarUrl;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserRole role = UserRole.USER;
    
    @Column(name = "is_email_verified")
    private boolean isEmailVerified = false;
    
    @Column(name = "email_verification_token")
    private String emailVerificationToken;
    
    @Column(name = "email_verification_expires")
    private LocalDateTime emailVerificationExpires;
    
    @Column(name = "reset_password_token")
    private String resetPasswordToken;
    
    @Column(name = "reset_password_expires")
    private LocalDateTime resetPasswordExpires;
    
    @Embedded
    private UserPreferences preferences = new UserPreferences();
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Relationships
    @OneToMany(mappedBy = "owner", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Project> ownedProjects = new ArrayList<>();
    
    @OneToMany(mappedBy = "createdBy", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Task> createdTasks = new ArrayList<>();
    
    @OneToMany(mappedBy = "assignedTo", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Task> assignedTasks = new ArrayList<>();
    
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<ProjectMember> projectMemberships = new ArrayList<>();
    
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Comment> comments = new ArrayList<>();
    
    // Constructors
    public User() {}
    
    public User(String name, String email, String password) {
        this.name = name;
        this.email = email;
        this.password = password;
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
    
    // UserDetails implementation
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + role.name()));
    }
    
    @Override
    public String getUsername() {
        return email;
    }
    
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }
    
    @Override
    public boolean isAccountNonLocked() {
        return true;
    }
    
    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }
    
    @Override
    public boolean isEnabled() {
        return isEmailVerified;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    @Override
    public String getPassword() {
        return password;
    }
    
    public void setPassword(String password) {
        this.password = password;
    }
    
    public String getAvatarUrl() {
        return avatarUrl;
    }
    
    public void setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
    }
    
    public UserRole getRole() {
        return role;
    }
    
    public void setRole(UserRole role) {
        this.role = role;
    }
    
    public boolean isEmailVerified() {
        return isEmailVerified;
    }
    
    public void setEmailVerified(boolean emailVerified) {
        isEmailVerified = emailVerified;
    }
    
    public String getEmailVerificationToken() {
        return emailVerificationToken;
    }
    
    public void setEmailVerificationToken(String emailVerificationToken) {
        this.emailVerificationToken = emailVerificationToken;
    }
    
    public LocalDateTime getEmailVerificationExpires() {
        return emailVerificationExpires;
    }
    
    public void setEmailVerificationExpires(LocalDateTime emailVerificationExpires) {
        this.emailVerificationExpires = emailVerificationExpires;
    }
    
    public String getResetPasswordToken() {
        return resetPasswordToken;
    }
    
    public void setResetPasswordToken(String resetPasswordToken) {
        this.resetPasswordToken = resetPasswordToken;
    }
    
    public LocalDateTime getResetPasswordExpires() {
        return resetPasswordExpires;
    }
    
    public void setResetPasswordExpires(LocalDateTime resetPasswordExpires) {
        this.resetPasswordExpires = resetPasswordExpires;
    }
    
    public UserPreferences getPreferences() {
        return preferences;
    }
    
    public void setPreferences(UserPreferences preferences) {
        this.preferences = preferences;
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
    
    public List<Project> getOwnedProjects() {
        return ownedProjects;
    }
    
    public void setOwnedProjects(List<Project> ownedProjects) {
        this.ownedProjects = ownedProjects;
    }
    
    public List<Task> getCreatedTasks() {
        return createdTasks;
    }
    
    public void setCreatedTasks(List<Task> createdTasks) {
        this.createdTasks = createdTasks;
    }
    
    public List<Task> getAssignedTasks() {
        return assignedTasks;
    }
    
    public void setAssignedTasks(List<Task> assignedTasks) {
        this.assignedTasks = assignedTasks;
    }
    
    public List<ProjectMember> getProjectMemberships() {
        return projectMemberships;
    }
    
    public void setProjectMemberships(List<ProjectMember> projectMemberships) {
        this.projectMemberships = projectMemberships;
    }
    
    public List<Comment> getComments() {
        return comments;
    }
    
    public void setComments(List<Comment> comments) {
        this.comments = comments;
    }
    
    // Enum for user roles
    public enum UserRole {
        USER, ADMIN
    }
} 