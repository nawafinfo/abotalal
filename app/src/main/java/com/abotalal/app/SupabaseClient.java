package com.abotalal.app;

import okhttp3.Interceptor;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public final class SupabaseClient {
    private SupabaseClient() { }

    public static SupabaseAuthApi auth() {
        String url = BuildConfig.SUPABASE_URL.trim();
        if (!url.endsWith("/")) url += "/";
        String anonKey = BuildConfig.SUPABASE_ANON_KEY.trim();

        Interceptor headers = chain -> {
            Request request = chain.request().newBuilder()
                    .header("apikey", anonKey)
                    .header("Authorization", "Bearer " + anonKey)
                    .header("Content-Type", "application/json")
                    .header("Accept", "application/json")
                    .build();
            return chain.proceed(request);
        };

        OkHttpClient client = new OkHttpClient.Builder()
                .addInterceptor(headers)
                .build();

        return new Retrofit.Builder()
                .baseUrl(url)
                .client(client)
                .addConverterFactory(GsonConverterFactory.create())
                .build()
                .create(SupabaseAuthApi.class);
    }

    public static boolean isConfigured() {
        return !BuildConfig.SUPABASE_URL.trim().isEmpty()
                && !BuildConfig.SUPABASE_ANON_KEY.trim().isEmpty();
    }
}
