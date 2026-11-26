package com.ecommerce.backend.service;

import com.ecommerce.backend.model.dto.request.AdminUpdateUserRequest;
import com.ecommerce.backend.model.entity.User;
import com.ecommerce.backend.model.enums.Role;
import com.ecommerce.backend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    private User user;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(1L);
        user.setEmail("john.doe@example.com");
        user.setPassword("encodedPassword123");
        user.setFirstName("John");
        user.setLastName("Doe");
        user.setRole(Role.CLIENT);
        user.setEnabled(true);
        user.setAccountNonLocked(true);
        user.setEmailVerifiedAt(LocalDateTime.now());
    }

    @Test
    void findAll_ShouldReturnAllUsers() {
        // Arrange
        User user2 = new User();
        user2.setId(2L);
        user2.setEmail("jane.doe@example.com");

        List<User> expectedUsers = Arrays.asList(user, user2);
        when(userRepository.findAll()).thenReturn(expectedUsers);

        // Act
        List<User> actualUsers = userService.findAll();

        // Assert
        assertEquals(2, actualUsers.size());
        assertEquals("john.doe@example.com", actualUsers.get(0).getEmail());
        assertEquals("jane.doe@example.com", actualUsers.get(1).getEmail());
        verify(userRepository, times(1)).findAll();
    }

    @Test
    void findById_WithExistingId_ShouldReturnUser() {
        // Arrange
        Long userId = 1L;
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));

        // Act
        User foundUser = userService.findById(userId);

        // Assert
        assertNotNull(foundUser);
        assertEquals(userId, foundUser.getId());
        assertEquals("john.doe@example.com", foundUser.getEmail());
        verify(userRepository, times(1)).findById(userId);
    }

    @Test
    void findById_WithNonExistingId_ShouldThrowException() {
        // Arrange
        Long nonExistingId = 999L;
        when(userRepository.findById(nonExistingId)).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> userService.findById(nonExistingId));

        assertEquals("User not found with id: 999", exception.getMessage());
        verify(userRepository, times(1)).findById(nonExistingId);
    }

    @Test
    void findByEmail_WithExistingEmail_ShouldReturnUser() {
        // Arrange
        String email = "john.doe@example.com";
        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));

        // Act
        User foundUser = userService.findByEmail(email);

        // Assert
        assertNotNull(foundUser);
        assertEquals(email, foundUser.getEmail());
        verify(userRepository, times(1)).findByEmail(email);
    }

    @Test
    void findByEmail_WithNonExistingEmail_ShouldThrowException() {
        // Arrange
        String email = "nonexisting@example.com";
        when(userRepository.findByEmail(email)).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> userService.findByEmail(email));

        assertEquals("User not found with email: nonexisting@example.com", exception.getMessage());
        verify(userRepository, times(1)).findByEmail(email);
    }

    @Test
    void updateUser_ShouldUpdateAllFields() {
        // Arrange
        Long userId = 1L;
        AdminUpdateUserRequest request = new AdminUpdateUserRequest();
        request.setEmail("updated@example.com");
        request.setFirstName("Jane");
        request.setLastName("Smith");
        request.setPassword("newPassword123");
        request.setRole("ADMIN");
        request.setEnabled(false);
        request.setLocked(true);

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(passwordEncoder.encode("newPassword123")).thenReturn("encodedNewPassword");
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        User updatedUser = userService.updateUser(userId, request);

        // Assert
        assertNotNull(updatedUser);
        assertEquals("updated@example.com", updatedUser.getEmail());
        assertEquals("Jane", updatedUser.getFirstName());
        assertEquals("Smith", updatedUser.getLastName());
        assertEquals("encodedNewPassword", updatedUser.getPassword());
        assertEquals(Role.ADMIN, updatedUser.getRole());
        assertFalse(updatedUser.isEnabled());
        assertFalse(updatedUser.isAccountNonLocked());

        verify(userRepository, times(1)).findById(userId);
        verify(passwordEncoder, times(1)).encode("newPassword123");
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void updateUser_WithNullValues_ShouldNotUpdateFields() {
        // Arrange
        Long userId = 1L;
        AdminUpdateUserRequest request = new AdminUpdateUserRequest();
        // Tous les champs sont null ou vides

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        User updatedUser = userService.updateUser(userId, request);

        // Assert
        assertNotNull(updatedUser);
        // Les valeurs originales doivent être préservées
        assertEquals("john.doe@example.com", updatedUser.getEmail());
        assertEquals("John", updatedUser.getFirstName());
        assertEquals("Doe", updatedUser.getLastName());
        assertEquals(Role.CLIENT, updatedUser.getRole());
        assertTrue(updatedUser.isEnabled());
        assertTrue(updatedUser.isAccountNonLocked());

        verify(userRepository, times(1)).findById(userId);
        verify(passwordEncoder, never()).encode(anyString());
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void updateUser_WithInvalidRole_ShouldNotChangeRole() {
        // Arrange
        Long userId = 1L;
        AdminUpdateUserRequest request = new AdminUpdateUserRequest();
        request.setRole("INVALID_ROLE"); // Rôle invalide

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        User updatedUser = userService.updateUser(userId, request);

        // Assert
        assertNotNull(updatedUser);
        // Le rôle doit rester inchangé
        assertEquals(Role.CLIENT, updatedUser.getRole());

        verify(userRepository, times(1)).findById(userId);
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void deleteUser_WithExistingId_ShouldDelete() {
        // Arrange
        Long userId = 1L;
        when(userRepository.existsById(userId)).thenReturn(true);
        doNothing().when(userRepository).deleteById(userId);

        // Act
        userService.deleteUser(userId);

        // Assert
        verify(userRepository, times(1)).existsById(userId);
        verify(userRepository, times(1)).deleteById(userId);
    }

    @Test
    void deleteUser_WithNonExistingId_ShouldThrowException() {
        // Arrange
        Long nonExistingId = 999L;
        when(userRepository.existsById(nonExistingId)).thenReturn(false);

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> userService.deleteUser(nonExistingId));

        assertEquals("User not found with id: 999", exception.getMessage());
        verify(userRepository, times(1)).existsById(nonExistingId);
        verify(userRepository, never()).deleteById(anyLong());
    }
}