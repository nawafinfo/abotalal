package com.abotalal.app;

import android.content.SharedPreferences;
import android.graphics.Color;
import android.graphics.Typeface;
import android.graphics.drawable.GradientDrawable;
import android.os.Bundle;
import android.text.InputType;
import android.view.Gravity;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.ScrollView;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import org.json.JSONArray;
import org.json.JSONObject;

public class MainActivity extends AppCompatActivity {
    private static final int NAVY = Color.rgb(8, 35, 112);
    private static final int BLUE = Color.rgb(18, 71, 210);
    private static final int RED = Color.rgb(226, 22, 44);
    private static final int PAGE = Color.rgb(250, 252, 255);
    private static final int TEXT = Color.rgb(12, 36, 111);
    private static final String PREFS = "talal_cards";
    private static final String ROUTERS = "routers";
    private SharedPreferences preferences;
    private LinearLayout content;

    @Override protected void onCreate(Bundle state) {
        super.onCreate(state);
        getWindow().setStatusBarColor(NAVY);
        getWindow().setNavigationBarColor(NAVY);
        preferences = getSharedPreferences(PREFS, MODE_PRIVATE);
        showInputScreen();
    }

    private void showInputScreen() {
        LinearLayout root = page();
        root.addView(header("TALAL CARDS", "الإصدار 1.0.0"));
        ScrollView scroll = new ScrollView(this);
        content = body();
        scroll.addView(content);
        root.addView(scroll, new LinearLayout.LayoutParams(-1, 0, 1));

        content.addView(sectionTitle("بيانات الدخول"), gap(0, 8, 0, 5));
        content.addView(text("أدخل بيانات الراوتر ثم اضغط على تسجيل الدخول أو احفظه للوصول السريع لاحقاً", 14, Color.DKGRAY, false), gap(0, 0, 0, 18));
        EditText address = field("عنوان (IP)", "172.16.0.1");
        EditText port = field("البورت", "8728");
        EditText username = field("اسم المستخدم", "شبكة الأمير");
        EditText password = field("كلمة المرور", "••••••••");
        password.setInputType(InputType.TYPE_CLASS_TEXT | InputType.TYPE_TEXT_VARIATION_PASSWORD);
        content.addView(address, gap(0, 0, 0, 12));
        LinearLayout row = new LinearLayout(this); row.setOrientation(LinearLayout.HORIZONTAL); row.setLayoutDirection(View.LAYOUT_DIRECTION_RTL);
        row.addView(port, new LinearLayout.LayoutParams(0, dp(58), 1));
        row.addView(username, new LinearLayout.LayoutParams(0, dp(58), 2));
        content.addView(row, gap(0, 0, 0, 12));
        content.addView(password, gap(0, 0, 0, 18));

        LinearLayout buttons = new LinearLayout(this); buttons.setOrientation(LinearLayout.HORIZONTAL); buttons.setLayoutDirection(View.LAYOUT_DIRECTION_RTL);
        Button login = actionButton("تسجيل الدخول", BLUE, Color.WHITE);
        Button test = actionButton("اختبار الاتصال", Color.WHITE, BLUE);
        buttons.addView(login, new LinearLayout.LayoutParams(0, dp(58), 1));
        buttons.addView(test, gap(10, 0, 0, 0));
        content.addView(buttons, gap(0, 0, 0, 14));
        test.setOnClickListener(v -> Toast.makeText(this, "تم اختبار الاتصال", Toast.LENGTH_SHORT).show());
        login.setOnClickListener(v -> Toast.makeText(this, "جارٍ تسجيل الدخول...", Toast.LENGTH_SHORT).show());

        Button save = actionButton("حفظ بيانات الراوتر", RED, Color.WHITE);
        save.setOnClickListener(v -> saveRouter(address, port, username, password));
        content.addView(save, gap(0, 0, 0, 12));
        Button registered = actionButton("الراوترات المسجلة", Color.WHITE, BLUE);
        registered.setOnClickListener(v -> showRegisteredScreen());
        content.addView(registered, gap(0, 0, 0, 18));
        content.addView(infoCard("TALAL CARDS", "إدارة الراوترات والبيانات من مكان واحد"));
        setContentView(root);
    }

    private void showRegisteredScreen() {
        LinearLayout root = page();
        root.addView(header("الراوترات المسجلة", "TALAL CARDS"));
        ScrollView scroll = new ScrollView(this);
        content = body(); scroll.addView(content);
        root.addView(scroll, new LinearLayout.LayoutParams(-1, 0, 1));
        content.addView(sectionTitle("الراوترات المسجلة"), gap(0, 8, 0, 5));
        content.addView(text("اختر الراوتر المطلوب أو أضف راوتراً جديداً", 14, Color.DKGRAY, false), gap(0, 0, 0, 18));
        try {
            JSONArray routers = new JSONArray(preferences.getString(ROUTERS, "[]"));
            if (routers.length() == 0) {
                TextView empty = text("لا توجد راوترات مسجلة حتى الآن", 16, Color.GRAY, false); empty.setGravity(Gravity.CENTER);
                content.addView(empty, gap(0, 70, 0, 30));
            }
            for (int i = 0; i < routers.length(); i++) addRouterCard(routers.getJSONObject(i), i);
        } catch (Exception e) { content.addView(text("تعذر قراءة البيانات المحفوظة", 16, RED, false)); }
        Button add = actionButton("إضافة راوتر جديد", BLUE, Color.WHITE); add.setOnClickListener(v -> showInputScreen());
        content.addView(add, gap(0, 20, 0, 0));
        setContentView(root);
    }

    private void addRouterCard(JSONObject router, int index) throws Exception {
        LinearLayout card = new LinearLayout(this); card.setOrientation(LinearLayout.VERTICAL); card.setGravity(Gravity.RIGHT); card.setPadding(dp(16), dp(14), dp(16), dp(14));
        card.setBackground(round(Color.WHITE, Color.rgb(216, 225, 245), 2, 16));
        card.addView(text(router.optString("name", "راوتر"), 19, TEXT, true));
        card.addView(text(router.optString("address", "") + " : " + router.optString("port", "8728"), 15, Color.DKGRAY, false), gap(0, 7, 0, 10));
        LinearLayout actions = new LinearLayout(this); actions.setGravity(Gravity.RIGHT); actions.setLayoutDirection(View.LAYOUT_DIRECTION_RTL);
        Button connect = actionButton("اتصال", BLUE, Color.WHITE); connect.setTextSize(13); connect.setOnClickListener(v -> Toast.makeText(this, "جارٍ الاتصال...", Toast.LENGTH_SHORT).show());
        Button delete = actionButton("حذف", Color.WHITE, RED); delete.setTextSize(13); delete.setOnClickListener(v -> deleteRouter(index));
        actions.addView(connect, new LinearLayout.LayoutParams(dp(110), dp(46))); actions.addView(delete, gap(8, 0, 0, 0)); card.addView(actions);
        content.addView(card, gap(0, 0, 0, 12));
    }

    private void saveRouter(EditText address, EditText port, EditText username, EditText password) {
        if (address.getText().toString().trim().isEmpty() || username.getText().toString().trim().isEmpty()) { Toast.makeText(this, "يرجى إدخال العنوان واسم المستخدم", Toast.LENGTH_SHORT).show(); return; }
        try {
            JSONArray routers = new JSONArray(preferences.getString(ROUTERS, "[]")); JSONObject r = new JSONObject();
            r.put("name", username.getText().toString().trim()); r.put("address", address.getText().toString().trim()); r.put("port", port.getText().toString().trim()); r.put("password", password.getText().toString());
            routers.put(r); preferences.edit().putString(ROUTERS, routers.toString()).apply(); Toast.makeText(this, "تم حفظ بيانات الراوتر", Toast.LENGTH_SHORT).show();
        } catch (Exception e) { Toast.makeText(this, "تعذر حفظ البيانات", Toast.LENGTH_SHORT).show(); }
    }

    private void deleteRouter(int index) { try { JSONArray a = new JSONArray(preferences.getString(ROUTERS, "[]")); a.remove(index); preferences.edit().putString(ROUTERS, a.toString()).apply(); showRegisteredScreen(); } catch (Exception ignored) {} }
    private LinearLayout page() { LinearLayout l = new LinearLayout(this); l.setOrientation(LinearLayout.VERTICAL); l.setBackgroundColor(PAGE); l.setLayoutDirection(View.LAYOUT_DIRECTION_RTL); return l; }
    private LinearLayout body() { LinearLayout l = new LinearLayout(this); l.setOrientation(LinearLayout.VERTICAL); l.setGravity(Gravity.RIGHT); l.setPadding(dp(22), dp(22), dp(22), dp(28)); l.setLayoutDirection(View.LAYOUT_DIRECTION_RTL); return l; }
    private View header(String title, String subtitle) { LinearLayout h = new LinearLayout(this); h.setOrientation(LinearLayout.VERTICAL); h.setGravity(Gravity.CENTER); h.setPadding(dp(12), dp(13), dp(12), dp(13)); h.setBackground(round(NAVY, NAVY, 0, 0)); h.addView(text(title, 21, Color.WHITE, true)); TextView s = text(subtitle, 12, Color.rgb(205, 220, 255), false); s.setGravity(Gravity.CENTER); h.addView(s); return h; }
    private TextView sectionTitle(String s) { return text(s, 23, TEXT, true); }
    private EditText field(String hint, String value) { EditText e = new EditText(this); e.setHint(hint); e.setText(value); e.setTextSize(16); e.setTextColor(TEXT); e.setHintTextColor(Color.rgb(125, 135, 160)); e.setSingleLine(true); e.setGravity(Gravity.RIGHT | Gravity.CENTER_VERTICAL); e.setPadding(dp(15), 0, dp(15), 0); e.setBackground(round(Color.WHITE, Color.rgb(215, 225, 245), 2, 12)); return e; }
    private Button actionButton(String label, int bg, int fg) { Button b = new Button(this); b.setText(label); b.setTextSize(15); b.setTextColor(fg); b.setAllCaps(false); b.setGravity(Gravity.CENTER); b.setBackground(round(bg, bg == Color.WHITE ? Color.rgb(205, 218, 242) : bg, bg == Color.WHITE ? 2 : 0, 12)); return b; }
    private View infoCard(String title, String sub) { LinearLayout c = new LinearLayout(this); c.setOrientation(LinearLayout.VERTICAL); c.setGravity(Gravity.CENTER); c.setPadding(dp(12), dp(18), dp(12), dp(18)); c.setBackground(round(Color.rgb(238, 245, 255), Color.rgb(180, 205, 245), 1, 14)); c.addView(text(title, 18, BLUE, true)); TextView s = text(sub, 14, Color.DKGRAY, false); s.setGravity(Gravity.CENTER); c.addView(s); return c; }
    private TextView text(String s, int size, int color, boolean bold) { TextView t = new TextView(this); t.setText(s); t.setTextSize(size); t.setTextColor(color); t.setGravity(Gravity.RIGHT); t.setTypeface(Typeface.DEFAULT, bold ? Typeface.BOLD : Typeface.NORMAL); t.setLayoutDirection(View.LAYOUT_DIRECTION_RTL); return t; }
    private LinearLayout.LayoutParams gap(int l, int t, int r, int b) { LinearLayout.LayoutParams p = new LinearLayout.LayoutParams(-1, -2); p.setMargins(dp(l), dp(t), dp(r), dp(b)); return p; }
    private GradientDrawable round(int fill, int stroke, int width, int radius) { GradientDrawable d = new GradientDrawable(); d.setColor(fill); d.setCornerRadius(dp(radius)); if (width > 0) d.setStroke(dp(width), stroke); return d; }
    private int dp(int n) { return Math.round(n * getResources().getDisplayMetrics().density); }
    @Override public void onBackPressed() { showInputScreen(); }
}
