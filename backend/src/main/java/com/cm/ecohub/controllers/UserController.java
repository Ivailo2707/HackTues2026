package com.cm.ecohub.controllers;

import com.cm.ecohub.constants.ApiPaths;
import com.cm.ecohub.dtos.user.RegisterUserDto;
import com.cm.ecohub.dtos.user.UpdateUserDto;
import com.cm.ecohub.dtos.user.UserDto;
import com.cm.ecohub.services.UserService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.List;

@AllArgsConstructor
@RestController
public class UserController {
    private final UserService userService;

    @PostMapping(ApiPaths.USERS)
    public ResponseEntity<?> registerUser(
            @Valid @RequestBody RegisterUserDto request,
            UriComponentsBuilder uriBuilder
    ) {
        UserDto userDto = userService.registerUser(request);
        URI uri = uriBuilder.path(ApiPaths.USER_BY_ID).buildAndExpand(userDto.getId()).toUri();

        return ResponseEntity.created(uri).body(userDto);
    }

    @GetMapping(ApiPaths.USERS)
    public List<UserDto> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping(ApiPaths.USER_BY_ID)
    public ResponseEntity<UserDto> getUser(@PathVariable Long id) {
        UserDto userDto = userService.getUser(id);
        return ResponseEntity.ok(userDto);
    }

    @GetMapping(ApiPaths.ME)
    public ResponseEntity<UserDto> getMe() {
        UserDto userDto = userService.getMe();
        return ResponseEntity.ok(userDto);
    }

    @PutMapping(ApiPaths.USER_BY_ID)
    public ResponseEntity<UserDto> updateUser(
            @PathVariable Long id,
            @Valid @RequestBody UpdateUserDto request
    ) {
        UserDto userDto = userService.updateUser(id, request);
        return ResponseEntity.ok(userDto);
    }

    @PutMapping(ApiPaths.ME)
    public ResponseEntity<UserDto> updateMe(@Valid @RequestBody UpdateUserDto request) {
        UserDto userDto = userService.updateMe(request);
        return ResponseEntity.ok(userDto);
    }

    @DeleteMapping(ApiPaths.ME)
    public ResponseEntity<Void> deleteMe() {
        userService.deleteMe();
        return ResponseEntity.noContent().build();
    }
}
