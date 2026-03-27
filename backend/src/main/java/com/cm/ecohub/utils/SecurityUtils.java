package com.cm.ecohub.utils;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class SecurityUtils {

    public Long getCurrentUserId() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (principal instanceof Long) {
            return (Long) principal;
        } else if (principal instanceof Integer) {
            return ((Integer) principal).longValue();
        } else if (principal instanceof String) {
            return Long.parseLong((String) principal);
        }

        throw new RuntimeException("Cannot convert principal to Long: " + principal.getClass().getName());
    }
}