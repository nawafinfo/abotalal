package com.abotalal.app;

import android.content.Intent;
import android.os.Bundle;
import android.text.TextUtils;
import android.view.View;
import android.widget.EditText;
import android.widget.ProgressBar;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;
import com.google.android.material.button.MaterialButton;
import com.google.android.material.tabs.TabLayout;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class AuthActivity extends AppCompatActivity {
    private EditText nameInput, emailInput, passwordInput;
    private MaterialButton submit;
    private ProgressBar progress;
    private boolean registerMode;

    @Override protected void onCreate(Bundle state) {
        super.onCreate(state);
        if (LocalSession.isLoggedIn(this)) { openMain(); return; }
        setContentView(R.layout.activity_auth);

        nameInput = findViewById(R.id.nameInput);
        emailInput = findViewById(R.id.emailInput);
        passwordInput = findViewById(R.id.passwordInput);
        submit = findViewById(R.id.submitAuth);
        progress = findViewById(R.id.authProgress);

        TabLayout tabs = findViewById(R.id.authTabs);
        tabs.addTab(tabs.newTab().setText(R.string.login));
        tabs.addTab(tabs.newTab().setText(R.string.register));
        tabs.addOnTabSelectedListener(new TabLayout.OnTabSelectedListener() {
            @Override public void onTabSelected(TabLayout.Tab tab) { registerMode = tab.getPosition() == 1; updateMode(); }
            @Override public void onTabUnselected(TabLayout.Tab tab) { }
            @Override public void onTabReselected(TabLayout.Tab tab) { }
        });
        submit.setOnClickListener(v -> submitForm());
        updateMode();
    }

    private void updateMode() {
        nameInput.setVisibility(registerMode ? View.VISIBLE : View.GONE);
        submit.setText(registerMode ? R.string.create_account : R.string.login);
    }

    private void submitForm() {
        String name = nameInput.getText().toString().trim();
        String email = emailInput.getText().toString().trim();
        String password = passwordInput.getText().toString();

        if (!SupabaseClient.isConfigured()) { showError(getString(R.string.supabase_not_configured)); return; }
        if (registerMode && name.length() < 2) { showError("أدخل الاسم الكامل"); return; }
        if (!android.util.Patterns.EMAIL_ADDRESS.matcher(email).matches()) { showError("أدخل بريداً إلكترونياً صحيحاً"); return; }
        if (password.length() < 6) { showError("كلمة المرور يجب أن تكون 6 أحرف على الأقل"); return; }

        setLoading(true);
        Call<AuthResponse> request = registerMode
                ? SupabaseClient.auth().register(new SupabaseAuthApi.RegisterRequest(email, password, name))
                : SupabaseClient.auth().login("password", new SupabaseAuthApi.LoginRequest(email, password));
        request.enqueue(new Callback<AuthResponse>() {
            @Override public void onResponse(Call<AuthResponse> call, Response<AuthResponse> response) {
                setLoading(false);
                AuthResponse body = response.body();
                if (!response.isSuccessful() || body == null) {
                    showError(body == null ? "تعذر قراءة استجابة الخادم" : body.readableError());
                    return;
                }
                if (body.accessToken == null || body.accessToken.trim().isEmpty()) {
                    if (registerMode) {
                        showMessage("تم إنشاء الحساب. تحقق من بريدك الإلكتروني ثم سجّل الدخول.");
                    } else {
                        showError(body.readableError());
                    }
                    return;
                }
                LocalSession.save(AuthActivity.this, body, email);
                LocalSession.saveName(AuthActivity.this, registerMode ? name : email);
                openMain();
            }
            @Override public void onFailure(Call<AuthResponse> call, Throwable t) {
                setLoading(false);
                showError("تعذر الاتصال بالخادم. تحقق من الإنترنت ثم أعد المحاولة");
            }
        });
    }

    private void setLoading(boolean value) { progress.setVisibility(value ? View.VISIBLE : View.GONE); submit.setEnabled(!value); }
    private void showError(String message) { Toast.makeText(this, message, Toast.LENGTH_LONG).show(); }
    private void showMessage(String message) { Toast.makeText(this, message, Toast.LENGTH_LONG).show(); }
    private void openMain() { startActivity(new Intent(this, MainActivity.class)); finish(); }
}
