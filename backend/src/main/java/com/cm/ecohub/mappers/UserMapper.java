package com.cm.ecohub.mappers;

import com.cm.ecohub.dtos.user.RegisterUserDto;
import com.cm.ecohub.dtos.user.UpdateUserDto;
import com.cm.ecohub.dtos.user.UserDto;
import com.cm.ecohub.entities.User;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface UserMapper {
    UserDto toDto(User user);
    User toEntity(RegisterUserDto dto);
    void update(UpdateUserDto request, @MappingTarget User user);
}
