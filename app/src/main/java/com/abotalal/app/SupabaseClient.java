package com.abotalal.app;

import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public final class SupabaseClient {
    public static final String BASE_URL = "https://mhbtrhfofollhpwhhubi.supabase.co/";
    public static final String API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1oYnRyaGZvZm9sbGhwd2hodWJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyOTQ3MjAsImV4cCI6MjA4NTg3MDcyMH0.j";
    private SupabaseClient() { }

    public static SupabaseAuthApi auth() {
        Retrofit retrofit = new Retrofit.Builder()
                .baseUrl(BASE_URL)
                .addConverterFactory(GsonConverterFactory.create())
                .build();
        return retrofit.create(SupabaseAuthApi.class);
    }
}
