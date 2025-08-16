package com.worksync.dto;

public class AuthResponse {
    
    private String token;
    private UserDto user;
    private String message;
    
    // Constructors
    public AuthResponse() {}
    
    public AuthResponse(String token, UserDto user) {
        this.token = token;
        this.user = user;
        this.message = "Login successful";
    }
    
    public AuthResponse(String token, UserDto user, String message) {
        this.token = token;
        this.user = user;
        this.message = message;
    }
    
    // Getters and Setters
    public String getToken() {
        return token;
    }
    
    public void setToken(String token) {
        this.token = token;
    }
    
    public UserDto getUser() {
        return user;
    }
    
    public void setUser(UserDto user) {
        this.user = user;
    }
    
    public String getMessage() {
        return message;
    }
    
    public void setMessage(String message) {
        this.message = message;
    }
    
    // Inner class for user data
    public static class UserDto {
        private Long id;
        private String name;
        private String email;
        private boolean isEmailVerified;
        private String role;
        
        // Constructors
        public UserDto() {}
        
        public UserDto(Long id, String name, String email, boolean isEmailVerified, String role) {
            this.id = id;
            this.name = name;
            this.email = email;
            this.isEmailVerified = isEmailVerified;
            this.role = role;
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
        
        public boolean isEmailVerified() {
            return isEmailVerified;
        }
        
        public void setEmailVerified(boolean emailVerified) {
            isEmailVerified = emailVerified;
        }
        
        public String getRole() {
            return role;
        }
        
        public void setRole(String role) {
            this.role = role;
        }
    }
} 