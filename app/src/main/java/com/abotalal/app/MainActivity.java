package com.abotalal.app;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.view.Gravity;
import android.view.View;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;
import androidx.appcompat.app.ActionBarDrawerToggle;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;
import androidx.drawerlayout.widget.DrawerLayout;
import androidx.recyclerview.widget.GridLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import com.google.android.material.bottomnavigation.BottomNavigationView;
import com.google.android.material.button.MaterialButton;
import com.google.android.material.dialog.MaterialAlertDialogBuilder;
import com.google.android.material.navigation.NavigationView;
import java.util.List;

public class MainActivity extends AppCompatActivity {
    private LinearLayout content;
    private DrawerLayout drawer;
    private final List<ServiceItem> services = ServiceData.all();

    @Override protected void onCreate(Bundle state) {
        super.onCreate(state);
        if (!LocalSession.isLoggedIn(this)) { openAuth(); return; }
        setContentView(R.layout.activity_main);
        Toolbar toolbar = findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);
        drawer = findViewById(R.id.drawerLayout);
        ActionBarDrawerToggle toggle = new ActionBarDrawerToggle(this, drawer, toolbar, R.string.drawer_open, R.string.drawer_close);
        drawer.addDrawerListener(toggle);
        toggle.syncState();
        content = findViewById(R.id.content);

        NavigationView navigation = findViewById(R.id.drawerNavigation);
        navigation.setNavigationItemSelectedListener(item -> {
            switch (item.getItemId()) {
                case R.id.nav_home: showHome(); break;
                case R.id.nav_services: showServices(); break;
                case R.id.nav_booking: showBooking(); break;
                case R.id.nav_contact: showContact(); break;
                case R.id.nav_logout: logout(); break;
            }
            drawer.closeDrawers();
            return true;
        });

        BottomNavigationView bottom = findViewById(R.id.bottomNavigation);
        bottom.setOnItemSelectedListener(item -> {
            switch (item.getItemId()) {
                case R.id.bottom_home: showHome(); break;
                case R.id.bottom_services: showServices(); break;
                case R.id.bottom_booking: showBooking(); break;
                case R.id.bottom_account: showAccount(); break;
            }
            return true;
        });
        showHome();
    }

    private void showHome() {
        clear();
        content.addView(heading("حلول رقمية تنمّي أعمالك"));
        content.addView(paragraph("أهلاً بك في ابوطلال للدعاية والإعلان والتسويق الإلكتروني والبرمجة والتطوير."));
        MaterialButton servicesButton = button("استكشف خدماتنا");
        servicesButton.setOnClickListener(v -> showServices());
        content.addView(servicesButton);
        content.addView(heading("أبرز الخدمات"));
        for (int i = 0; i < Math.min(4, services.size()); i++) content.addView(servicePreview(services.get(i)));
    }

    private void showServices() {
        clear();
        content.addView(heading("خدماتنا"));
        content.addView(paragraph("اختر الخدمة المناسبة لمشروعك."));
        RecyclerView list = new RecyclerView(this);
        list.setLayoutManager(new GridLayoutManager(this, 2));
        list.setNestedScrollingEnabled(false);
        list.setAdapter(new ServiceAdapter(services, this::showServiceDialog));
        content.addView(list, new LinearLayout.LayoutParams(-1, -2));
    }

    private void showBooking() {
        clear();
        content.addView(heading("حجز خدمة"));
        EditText name = field("الاسم الكامل");
        EditText phone = field("رقم الجوال");
        EditText details = field("تفاصيل الطلب");
        details.setMinLines(4);
        content.addView(name); content.addView(phone); content.addView(details);
        MaterialButton send = button("إرسال الطلب");
        send.setOnClickListener(v -> {
            if (name.getText().toString().trim().isEmpty() || phone.getText().toString().trim().isEmpty()) {
                Toast.makeText(this, "أدخل الاسم ورقم الجوال", Toast.LENGTH_SHORT).show();
            } else Toast.makeText(this, "تم استلام طلبك بنجاح", Toast.LENGTH_LONG).show();
        });
        content.addView(send);
    }

    private void showContact() {
        clear();
        content.addView(heading("تواصل معنا"));
        content.addView(paragraph("فريقنا جاهز للإجابة عن استفساراتك."));
        MaterialButton whatsapp = button("التواصل عبر واتساب");
        whatsapp.setOnClickListener(v -> openUrl("https://wa.me/966500000000"));
        content.addView(whatsapp);
    }

    private void showAccount() {
        clear();
        content.addView(heading("حسابي"));
        content.addView(paragraph("مرحباً، " + LocalSession.getName(this) + "\n" + LocalSession.getEmail(this)));
        MaterialButton logout = button("تسجيل الخروج");
        logout.setOnClickListener(v -> logout());
        content.addView(logout);
    }

    private void showServiceDialog(ServiceItem item) {
        new MaterialAlertDialogBuilder(this).setTitle(item.title).setMessage(item.description)
                .setNegativeButton("إغلاق", null).setPositiveButton("حجز", (dialog, which) -> showBooking()).show();
    }

    private void logout() { LocalSession.clear(this); openAuth(); }
    private void openAuth() { startActivity(new Intent(this, AuthActivity.class)); finish(); }
    private void clear() { content.removeAllViews(); }
    private TextView heading(String text) { TextView view = paragraph(text); view.setTextSize(24); view.setTextColor(0xFF172554); view.setTypeface(null, 1); return view; }
    private TextView paragraph(String text) { TextView view = new TextView(this); view.setText(text); view.setTextSize(16); view.setTextColor(0xFF475569); view.setGravity(Gravity.RIGHT); view.setPadding(0, 10, 0, 16); return view; }
    private MaterialButton button(String text) { MaterialButton button = new MaterialButton(this); button.setText(text); button.setAllCaps(false); button.setTextSize(16); button.setLayoutDirection(View.LAYOUT_DIRECTION_RTL); return button; }
    private EditText field(String hint) { EditText field = new EditText(this); field.setHint(hint); field.setGravity(Gravity.RIGHT); field.setTextSize(16); field.setPadding(12, 10, 12, 10); return field; }
    private TextView servicePreview(ServiceItem item) { TextView view = paragraph("• " + item.title + "\n" + item.description); view.setOnClickListener(v -> showServiceDialog(item)); return view; }
    private void openUrl(String url) { try { startActivity(new Intent(Intent.ACTION_VIEW, Uri.parse(url))); } catch (Exception e) { Toast.makeText(this, "تعذر فتح الرابط", Toast.LENGTH_SHORT).show(); } }
}
