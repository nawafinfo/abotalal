package com.abotalal.app;

import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.POST;
import retrofit2.http.Query;

public interface SupabaseAuthApi {
    @POST("auth/v1/token")
    Call<AuthResponse> login(@Query("grant_type") String grantType, @Body LoginRequest request);

    @POST("auth/v1/signup")
    Call<AuthResponse> register(@Body RegisterRequest request);

    class LoginRequest {
        public final String email;
        public final String password;
        public LoginRequest(String email, String password) { this.email = email; this.password = password; }
    }

    class RegisterRequest {
        public final String email;
        public final String password;
        public final UserMetadata data;
        public RegisterRequest(String email, String password, String name) {
            this.email = email; this.password = password; this.data = new UserMetadata(name);
        }
    }

    class UserMetadata {
        public final String name;
        public UserMetadata(String name) { this.name = name; }
    }
}
