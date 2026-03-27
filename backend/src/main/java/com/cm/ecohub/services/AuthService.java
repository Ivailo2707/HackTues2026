package com.cm.ecohub.services;

import com.cm.ecohub.dtos.auth.AuthResponseDto;
import com.cm.ecohub.dtos.auth.LoginDto;
import com.cm.ecohub.dtos.auth.LoginResult;
import com.cm.ecohub.entities.User;
import com.cm.ecohub.exceptions.InvalidTokenException;
import com.cm.ecohub.exceptions.UserNotFoundException;
import com.cm.ecohub.repositories.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

@AllArgsConstructor
@Service
public class AuthService {
    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public LoginResult login(LoginDto request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail());
        Jwt accessToken = jwtService.generateAccessToken(user);
        Jwt refreshToken = jwtService.generateRefreshToken(user);

        return new LoginResult(accessToken.toString(), refreshToken.toString());
    }

    public AuthResponseDto refresh(String refreshToken) {
        Jwt jwt = jwtService.parseToken(refreshToken);
        if (jwt == null || jwt.isExpired()) {
            throw new InvalidTokenException();
        }

        User user = userRepository.findById(jwt.getId()).orElseThrow(UserNotFoundException::new);

        Jwt accessToken = jwtService.generateAccessToken(user);
        return new AuthResponseDto(accessToken.toString());
    }
}
