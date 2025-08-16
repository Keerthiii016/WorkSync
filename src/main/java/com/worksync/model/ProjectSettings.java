package com.worksync.model;

import jakarta.persistence.Embeddable;

@Embeddable
public class ProjectSettings {
    
    private boolean allowComments = true;
    private boolean allowFileUploads = true;
    private boolean autoAssignTasks = false;
    private boolean requireApproval = false;
    private boolean enableTimeTracking = true;
    private boolean enableNotifications = true;
    private boolean enableProgressTracking = true;
    
    // Constructors
    public ProjectSettings() {}
    
    public ProjectSettings(boolean allowComments, boolean allowFileUploads, boolean autoAssignTasks) {
        this.allowComments = allowComments;
        this.allowFileUploads = allowFileUploads;
        this.autoAssignTasks = autoAssignTasks;
    }
    
    // Getters and Setters
    public boolean isAllowComments() {
        return allowComments;
    }
    
    public void setAllowComments(boolean allowComments) {
        this.allowComments = allowComments;
    }
    
    public boolean isAllowFileUploads() {
        return allowFileUploads;
    }
    
    public void setAllowFileUploads(boolean allowFileUploads) {
        this.allowFileUploads = allowFileUploads;
    }
    
    public boolean isAutoAssignTasks() {
        return autoAssignTasks;
    }
    
    public void setAutoAssignTasks(boolean autoAssignTasks) {
        this.autoAssignTasks = autoAssignTasks;
    }
    
    public boolean isRequireApproval() {
        return requireApproval;
    }
    
    public void setRequireApproval(boolean requireApproval) {
        this.requireApproval = requireApproval;
    }
    
    public boolean isEnableTimeTracking() {
        return enableTimeTracking;
    }
    
    public void setEnableTimeTracking(boolean enableTimeTracking) {
        this.enableTimeTracking = enableTimeTracking;
    }
    
    public boolean isEnableNotifications() {
        return enableNotifications;
    }
    
    public void setEnableNotifications(boolean enableNotifications) {
        this.enableNotifications = enableNotifications;
    }
    
    public boolean isEnableProgressTracking() {
        return enableProgressTracking;
    }
    
    public void setEnableProgressTracking(boolean enableProgressTracking) {
        this.enableProgressTracking = enableProgressTracking;
    }
} 