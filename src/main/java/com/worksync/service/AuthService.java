package com.worksync.service;

import com.worksync.dto.AuthResponse;
import com.worksync.model.User;
import com.worksync.repository.UserRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.Optional;
import java.util.UUID;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private EmailService emailService;

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expiration}")
    private Long jwtExpiration;

    private final Key key = Keys.secretKeyFor(SignatureAlgorithm.HS256);

    public User registerUser(String name, String email, String password) throws Exception {
        // Check if user already exists
        if (userRepository.findByEmail(email).isPresent()) {
            throw new Exception("User with this email already exists");
        }

        // Create new user
        User user = new User();
        user.setName(name);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setEmailVerificationToken(generateToken());
        user.setEmailVerificationExpires(LocalDateTime.now().plusHours(24));
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());

        return userRepository.save(user);
    }

    public AuthResponse login(String email, String password) throws Exception {
        Optional<User> userOpt = userRepository.findByEmail(email);
        
        if (userOpt.isEmpty()) {
            throw new Exception("Invalid email or password");
        }

        User user = userOpt.get();

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new Exception("Invalid email or password");
        }

        if (!user.isEmailVerified()) {
            throw new Exception("Please verify your email before logging in");
        }

        // Generate JWT token
        String token = generateJwtToken(user);

        // Create user DTO
        AuthResponse.UserDto userDto = new AuthResponse.UserDto(
            user.getId(),
            user.getName(),
            user.getEmail(),
            user.isEmailVerified(),
            user.getRole().toString()
        );

        return new AuthResponse(token, userDto);
    }

    public User getCurrentUser(String token) throws Exception {
        try {
            Claims claims = Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();

            Long userId = Long.parseLong(claims.getSubject());
            Optional<User> userOpt = userRepository.findById(userId);

            if (userOpt.isEmpty()) {
                throw new Exception("User not found");
            }

            return userOpt.get();
        } catch (Exception e) {
            throw new Exception("Invalid token");
        }
    }

    public void forgotPassword(String email) throws Exception {
        Optional<User> userOpt = userRepository.findByEmail(email);
        
        if (userOpt.isEmpty()) {
            // Don't reveal if user exists or not for security
            return;
        }

        User user = userOpt.get();
        user.setResetPasswordToken(generateToken());
        user.setResetPasswordExpires(LocalDateTime.now().plusHours(1));
        user.setUpdatedAt(LocalDateTime.now());

        userRepository.save(user);
        
        // Send password reset email
        emailService.sendPasswordResetEmail(user);
    }

    public void resetPassword(String token, String newPassword) throws Exception {
        Optional<User> userOpt = userRepository.findByResetPasswordToken(token);
        
        if (userOpt.isEmpty()) {
            throw new Exception("Invalid reset token");
        }

        User user = userOpt.get();

        if (user.getResetPasswordExpires().isBefore(LocalDateTime.now())) {
            throw new Exception("Reset token has expired");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        user.setResetPasswordToken(null);
        user.setResetPasswordExpires(null);
        user.setUpdatedAt(LocalDateTime.now());

        userRepository.save(user);
    }

    public void verifyEmail(String token) throws Exception {
        Optional<User> userOpt = userRepository.findByEmailVerificationToken(token);
        
        if (userOpt.isEmpty()) {
            throw new Exception("Invalid verification token");
        }

        User user = userOpt.get();

        if (user.getEmailVerificationExpires().isBefore(LocalDateTime.now())) {
            throw new Exception("Verification token has expired");
        }

        user.setEmailVerified(true);
        user.setEmailVerificationToken(null);
        user.setEmailVerificationExpires(null);
        user.setUpdatedAt(LocalDateTime.now());

        userRepository.save(user);
        
        // Send welcome email
        emailService.sendWelcomeEmail(user);
    }

    public void logout(String token) {
        // In a more sophisticated implementation, you might want to blacklist the token
        // For now, we'll just validate it was a valid token
        try {
            Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token);
        } catch (Exception e) {
            // Token was invalid anyway
        }
    }

    private String generateJwtToken(User user) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpiration);

        return Jwts.builder()
            .setSubject(user.getId().toString())
            .setIssuedAt(now)
            .setExpiration(expiryDate)
            .claim("email", user.getEmail())
            .claim("name", user.getName())
            .claim("role", user.getRole().toString())
            .signWith(key)
            .compact();
    }

    private String generateToken() {
        return UUID.randomUUID().toString();
    }
} 