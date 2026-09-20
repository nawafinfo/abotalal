package com.abotalal.app;

import android.content.Context;
import android.content.SharedPreferences;

public final class LocalSession {
    private static final String PREFS = "abotalal_session";
    private static final String ACCESS = "access_token";
    private static final String REFRESH = "refresh_token";
    private static final String EMAIL = "email";
    private static final String NAME = "name";
    private LocalSession() { }

    public static void save(Context context, AuthResponse response, String email) {
        preferences(context).edit()
                .putString(ACCESS, response.accessToken == null ? "" : response.accessToken)
                .putString(REFRESH, response.refreshToken == null ? "" : response.refreshToken)
                .putString(EMAIL, email == null ? "" : email)
                .apply();
    }

    public static void saveName(Context context, String name) {
        preferences(context).edit().putString(NAME, name == null ? "" : name).apply();
    }

    public static void clear(Context context) { preferences(context).edit().clear().apply(); }
    public static boolean isLoggedIn(Context context) { return !getAccessToken(context).isEmpty(); }
    public static String getAccessToken(Context context) { return preferences(context).getString(ACCESS, ""); }
    public static String getEmail(Context context) { return preferences(context).getString(EMAIL, ""); }
    public static String getName(Context context) { return preferences(context).getString(NAME, ""); }

    private static SharedPreferences preferences(Context context) {
        return context.getSharedPreferences(PREFS, Context.MODE_PRIVATE);
    }
}
