package com.worksync.service;

import com.worksync.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Value("${app.frontend-url:http://localhost:3000}")
    private String frontendUrl;

    public void sendVerificationEmail(User user) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(user.getEmail());
            message.setSubject("Verify Your WorkSync Account");
            
            String verificationUrl = frontendUrl + "/verify-email?token=" + user.getEmailVerificationToken();
            
            message.setText(
                "Hello " + user.getName() + ",\n\n" +
                "Thank you for registering with WorkSync! Please click the link below to verify your email address:\n\n" +
                verificationUrl + "\n\n" +
                "This link will expire in 24 hours.\n\n" +
                "If you didn't create this account, please ignore this email.\n\n" +
                "Best regards,\n" +
                "The WorkSync Team"
            );

            mailSender.send(message);
        } catch (Exception e) {
            // Log the error but don't throw it to avoid breaking the registration process
            System.err.println("Failed to send verification email: " + e.getMessage());
        }
    }

    public void sendPasswordResetEmail(User user) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(user.getEmail());
            message.setSubject("Reset Your WorkSync Password");
            
            String resetUrl = frontendUrl + "/reset-password?token=" + user.getResetPasswordToken();
            
            message.setText(
                "Hello " + user.getName() + ",\n\n" +
                "You requested to reset your password. Please click the link below to set a new password:\n\n" +
                resetUrl + "\n\n" +
                "This link will expire in 1 hour.\n\n" +
                "If you didn't request this password reset, please ignore this email.\n\n" +
                "Best regards,\n" +
                "The WorkSync Team"
            );

            mailSender.send(message);
        } catch (Exception e) {
            // Log the error but don't throw it to avoid breaking the password reset process
            System.err.println("Failed to send password reset email: " + e.getMessage());
        }
    }

    public void sendWelcomeEmail(User user) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(user.getEmail());
            message.setSubject("Welcome to WorkSync!");
            
            message.setText(
                "Hello " + user.getName() + ",\n\n" +
                "Welcome to WorkSync! Your account has been successfully verified.\n\n" +
                "You can now log in and start managing your projects and tasks.\n\n" +
                "If you have any questions, feel free to contact our support team.\n\n" +
                "Best regards,\n" +
                "The WorkSync Team"
            );

            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("Failed to send welcome email: " + e.getMessage());
        }
    }
} 