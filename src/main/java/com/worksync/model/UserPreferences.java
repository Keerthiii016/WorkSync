package com.worksync.model;

import jakarta.persistence.Embeddable;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;

@Embeddable
public class UserPreferences {
    
    @Enumerated(EnumType.STRING)
    private Theme theme = Theme.LIGHT;
    
    private boolean emailNotifications = true;
    private boolean pushNotifications = true;
    private boolean taskReminders = true;
    private boolean projectUpdates = true;
    
    public enum Theme {
        LIGHT, DARK
    }
    
    // Constructors
    public UserPreferences() {}
    
    public UserPreferences(Theme theme, boolean emailNotifications, boolean pushNotifications) {
        this.theme = theme;
        this.emailNotifications = emailNotifications;
        this.pushNotifications = pushNotifications;
    }
    
    // Getters and Setters
    public Theme getTheme() {
        return theme;
    }
    
    public void setTheme(Theme theme) {
        this.theme = theme;
    }
    
    public boolean isEmailNotifications() {
        return emailNotifications;
    }
    
    public void setEmailNotifications(boolean emailNotifications) {
        this.emailNotifications = emailNotifications;
    }
    
    public boolean isPushNotifications() {
        return pushNotifications;
    }
    
    public void setPushNotifications(boolean pushNotifications) {
        this.pushNotifications = pushNotifications;
    }
    
    public boolean isTaskReminders() {
        return taskReminders;
    }
    
    public void setTaskReminders(boolean taskReminders) {
        this.taskReminders = taskReminders;
    }
    
    public boolean isProjectUpdates() {
        return projectUpdates;
    }
    
    public void setProjectUpdates(boolean projectUpdates) {
        this.projectUpdates = projectUpdates;
    }
} 