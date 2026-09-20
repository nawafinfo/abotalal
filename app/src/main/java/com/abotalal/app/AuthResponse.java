package com.abotalal.app;

import com.google.gson.annotations.SerializedName;

public class AuthResponse {
    @SerializedName("access_token") public String accessToken;
    @SerializedName("refresh_token") public String refreshToken;
    @SerializedName("token_type") public String tokenType;
    public User user;
    public String msg;
    public String error;
    @SerializedName("error_description") public String errorDescription;

    public static class User {
        public String id;
        public String email;
    }

    public String readableError() {
        if (errorDescription != null && !errorDescription.trim().isEmpty()) return errorDescription;
        if (msg != null && !msg.trim().isEmpty()) return msg;
        if (error != null && !error.trim().isEmpty()) return error;
        return "تعذر تنفيذ الطلب، تحقق من البيانات والاتصال بالإنترنت";
    }
}
