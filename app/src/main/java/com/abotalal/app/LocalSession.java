package com.abotalal.app;

import android.content.Context;
import android.content.SharedPreferences;

public final class LocalSession {
    private static final String PREFS = "abotalal_session";
    private static final String NAME = "name";
    private LocalSession() { }

    public static void save(Context context, String name) {
        preferences(context).edit().putString(NAME, name).apply();
    }

    public static void clear(Context context) {
        preferences(context).edit().clear().apply();
    }

    public static boolean isLoggedIn(Context context) {
        return !preferences(context).getString(NAME, "").trim().isEmpty();
    }

    public static String getName(Context context) {
        return preferences(context).getString(NAME, "");
    }

    private static SharedPreferences preferences(Context context) {
        return context.getSharedPreferences(PREFS, Context.MODE_PRIVATE);
    }
}
