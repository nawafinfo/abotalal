package com.abotalal.app;

import android.app.Application;

public class AbotalalApplication extends Application {
    @Override public void onCreate() {
        super.onCreate();
        Thread.setDefaultUncaughtExceptionHandler((thread, throwable) -> {
            // Keep the app from exposing a sensitive stack trace to the user.
            Thread.getDefaultUncaughtExceptionHandler();
        });
    }
}
