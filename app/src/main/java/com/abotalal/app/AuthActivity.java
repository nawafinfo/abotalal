package com.abotalal.app;

import android.content.Intent;
import android.os.Bundle;
import android.text.InputType;
import android.view.Gravity;
import android.view.View;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;
import com.google.android.material.button.MaterialButton;
import com.google.android.material.tabs.TabLayout;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class AuthActivity extends AppCompatActivity {
    private LinearLayout form;
    private EditText name, email, password;
    private MaterialButton submit;
    private boolean registerMode = false;
    private ProgressBar progress;

    @Override protected void onCreate(Bundle state) {
        super.onCreate(state);
        if (LocalSession.isLoggedIn(this)) { openMain(); return; }
        setContentView(R.layout.activity_auth);
        form = findViewById(R.id.authForm); name = findViewById(R.id.nameInput); email = findViewById(R.id.emailInput); password = findViewById(R.id.passwordInput);
        submit = findViewById(R.id.submitAuth); progress = findViewById(R.id.authProgress);
        TabLayout tabs = findViewById(R.id.authTabs);
        tabs.addTab(tabs.newTab().setText("تسجيل الدخول")); tabs.addTab(tabs.newTab().setText("حساب جديد"));
        tabs.addOnTabSelectedListener(new TabLayout.OnTabSelectedListener() {
            public void onTabSelected(TabLayout.Tab tab) { registerMode = tab.getPosition() == 1; updateMode(); }
            public void onTabUnselected(TabLayout.Tab tab) { }
            public void onTabReselected(TabLayout.Tab tab) { }
        });
        submit.setOnClickListener(v -> submit());
        updateMode();
    }

    private void updateMode() {
        name.setVisibility(registerMode ? View.VISIBLE : View.GONE);
        submit.setText(registerMode ? "إنشاء حساب" : "تسجيل الدخول");
    }

    private void submit() {
        String n = name.getText().toString().trim(), e = email.getText().toString().trim(), p = password.getText().toString();
        if (registerMode && n.length() < 2) { error("أدخل الاسم الكامل"); return; }
        if (!android.util.Patterns.EMAIL_ADDRESS.matcher(e).matches()) { error("أدخل بريداً إلكترونياً صحيحاً"); return; }
        if (p.length() < 6) { error("كلمة المرور يجب أن تكون 6 أحرف على الأقل"); return; }
        setLoading(true);
        Call<AuthResponse> call = registerMode ? SupabaseClient.auth().register(new SupabaseAuthApi.RegisterRequest(e, p, n)) : SupabaseClient.auth().login("password", new SupabaseAuthApi.LoginRequest(e, p));
        call.enqueue(new Callback<AuthResponse>() {
            @Override public void onResponse(Call<AuthResponse> call, Response<AuthResponse> response) {
                setLoading(false);
                AuthResponse body = response.body();
                if (!response.isSuccessful() || body == null || (!registerMode && !LocalSessionToken(body))) { error(body == null ? "استجابة غير صحيحة من الخادم" : body.readableError()); return; }
                if (registerMode && (body.accessToken == null || body.accessToken.isEmpty())) { Toast.makeText(AuthActivity.this, "تم إنشاء الحساب. تحقق من بريدك الإلكتروني ثم سجّل الدخول.", Toast.LENGTH_LONG).show(); return; }
                LocalSession.save(AuthActivity.this, body, e); LocalSession.saveName(AuthActivity.this, registerMode ? n : e); openMain();
            }
            @Override public void onFailure(Call<AuthResponse> call, Throwable t) { setLoading(false); error("تعذر الاتصال بالخادم. تحقق من الإنترنت ثم أعد المحاولة"); }
        });
    }

    private boolean LocalSessionToken(AuthResponse body) { return body.accessToken != null && !body.accessToken.isEmpty(); }
    private void setLoading(boolean loading) { progress.setVisibility(loading ? View.VISIBLE : View.GONE); submit.setEnabled(!loading); }
    private void error(String message) { Toast.makeText(this, message, Toast.LENGTH_LONG).show(); }
    private void openMain() { startActivity(new Intent(this, MainActivity.class)); finish(); }
}
