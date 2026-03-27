package com.cm.ecohub.services;

import com.cm.ecohub.dtos.user.RegisterUserDto;
import com.cm.ecohub.dtos.user.UpdateUserDto;
import com.cm.ecohub.dtos.user.UserDto;
import com.cm.ecohub.entities.User;
import com.cm.ecohub.exceptions.EmailAlreadyExistsException;
import com.cm.ecohub.exceptions.PasswordsDoNotMatchException;
import com.cm.ecohub.exceptions.UserNotFoundException;
import com.cm.ecohub.mappers.UserMapper;
import com.cm.ecohub.repositories.UserRepository;
import com.cm.ecohub.utils.SecurityUtils;
import lombok.AllArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@AllArgsConstructor
@Service
public class UserService implements UserDetailsService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final SecurityUtils securityUtils;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = getUserByEmailOrThrow(email);

        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                Collections.emptyList()
        );
    }

    public UserDto registerUser(RegisterUserDto request) {
        if (isEmailRegistered(request.getEmail())) {
            throw new EmailAlreadyExistsException();
        }

        if (!passwordsMatch(request.getPassword(), request.getConfirmPassword())) {
            throw new PasswordsDoNotMatchException();
        }

        User user = userMapper.toEntity(request);
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);

        return userMapper.toDto(user);
    }

    public List<UserDto> getAllUsers() {
        return userRepository
                .findAll()
                .stream()
                .map(userMapper::toDto)
                .toList();
    }

    public UserDto getUser(Long userId) {
        User user = getUserOrThrow(userId);
        return userMapper.toDto(user);
    }

    public UserDto getMe() {
        Long userId = securityUtils.getCurrentUserId();
        User user = getUserOrThrow(userId);

        return userMapper.toDto(user);
    }

    public UserDto updateUser(Long userId, UpdateUserDto request) {
        User user = getUserOrThrow(userId);

        userMapper.update(request, user);
        userRepository.save(user);

        return userMapper.toDto(user);
    }

    public UserDto updateMe(UpdateUserDto request) {
        Long userId = securityUtils.getCurrentUserId();
        User user = getUserOrThrow(userId);

        userMapper.update(request, user);
        userRepository.save(user);

        return userMapper.toDto(user);
    }

    public void deleteMe() {
        Long userId = securityUtils.getCurrentUserId();
        User user = getUserOrThrow(userId);

        userRepository.delete(user);
    }

    private User getUserByEmailOrThrow(String email) {
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new UsernameNotFoundException("User not found");
        }

        return user;
    }

    private User getUserOrThrow(Long userId) {
        return userRepository
                .findById(userId)
                .orElseThrow(UserNotFoundException::new);
    }

    private boolean isEmailRegistered(String email) {
        return userRepository.existsByEmail(email);
    }

    private boolean passwordsMatch(String password, String confirmPassword) {
        return password.equals(confirmPassword);
    }
}