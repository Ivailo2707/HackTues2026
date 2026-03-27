package com.cm.ecohub.constants;

import lombok.NoArgsConstructor;

@NoArgsConstructor
public final class ApiPaths {
    public static final String API_BASE = "/api";

    public static final String AUTH = API_BASE + "/auth";
    public static final String AUTH_LOGIN = AUTH + "/login";
    public static final String AUTH_REFRESH = AUTH + "/refresh";
    public static final String AUTH_LOGOUT = AUTH + "/logout";
}
