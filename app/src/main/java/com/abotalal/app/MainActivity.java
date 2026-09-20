package com.abotalal.app;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.view.Gravity;
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
import com.google.android.material.navigation.NavigationView;
import java.util.List;

public class MainActivity extends AppCompatActivity {
    private LinearLayout content;
    private DrawerLayout drawer;
    private final List<ServiceItem> services = ServiceData.all();

    @Override protected void onCreate(Bundle state) {
        super.onCreate(state);
        if (!LocalSession.isLoggedIn(this)) { startActivity(new Intent(this, AuthActivity.class)); finish(); return; }
        setContentView(R.layout.activity_main);
        Toolbar toolbar = findViewById(R.id.toolbar); setSupportActionBar(toolbar);
        drawer = findViewById(R.id.drawerLayout);
        ActionBarDrawerToggle toggle = new ActionBarDrawerToggle(this, drawer, toolbar, R.string.drawer_open, R.string.drawer_close);
        drawer.addDrawerListener(toggle); toggle.syncState();
        content = findViewById(R.id.content);
        NavigationView nav = findViewById(R.id.drawerNavigation);
        nav.setNavigationItemSelectedListener(item -> { int id = item.getItemId(); if (id == R.id.nav_home) showHome(); else if (id == R.id.nav_services) showServices(); else if (id == R.id.nav_booking) showBooking(); else if (id == R.id.nav_contact) showContact(); else if (id == R.id.nav_logout) logout(); drawer.closeDrawers(); return true; });
        BottomNavigationView bottom = findViewById(R.id.bottomNavigation);
        bottom.setOnItemSelectedListener(item -> { int id = item.getItemId(); if (id == R.id.bottom_home) showHome(); else if (id == R.id.bottom_services) showServices(); else if (id == R.id.bottom_booking) showBooking(); else if (id == R.id.bottom_account) showAccount(); return true; });
        showHome();
    }

    private void showHome() { clear(); content.addView(heading("حلول رقمية تنمّي أعمالك")); content.addView(paragraph("أهلاً بك في ابوطلال للدعاية والإعلان والتسويق الإلكتروني والبرمجة والتطوير.")); MaterialButton b = button("استكشف خدماتنا"); b.setOnClickListener(v -> showServices()); content.addView(b); content.addView(heading("أبرز الخدمات")); for (int i = 0; i < Math.min(4, services.size()); i++) content.addView(servicePreview(services.get(i))); }
    private void showServices() { clear(); content.addView(heading("خدماتنا")); RecyclerView list = new RecyclerView(this); list.setLayoutManager(new GridLayoutManager(this, 2)); list.setAdapter(new ServiceAdapter(services, this::showServiceDialog)); content.addView(list, new LinearLayout.LayoutParams(-1, 0, 1)); }
    private void showBooking() { clear(); content.addView(heading("حجز خدمة")); content.addView(paragraph("أرسل بياناتك وسيتواصل معك فريقنا.")); android.widget.EditText name = field("الاسم الكامل"), phone = field("رقم الجوال"), details = field("تفاصيل الطلب"); details.setMinLines(4); content.addView(name); content.addView(phone); content.addView(details); MaterialButton b = button("إرسال الطلب"); b.setOnClickListener(v -> { if (name.getText().toString().trim().isEmpty() || phone.getText().toString().trim().isEmpty()) Toast.makeText(this, "أدخل الاسم ورقم الجوال", Toast.LENGTH_SHORT).show(); else Toast.makeText(this, "تم استلام طلبك بنجاح", Toast.LENGTH_LONG).show(); }); content.addView(b); }
    private void showContact() { clear(); content.addView(heading("تواصل معنا")); content.addView(paragraph("نحن جاهزون لخدمتك.")); MaterialButton w = button("واتساب"); w.setOnClickListener(v -> openUrl("https://wa.me/966500000000")); content.addView(w); }
    private void showAccount() { clear(); content.addView(heading("حسابي")); content.addView(paragraph(LocalSession.getEmail(this))); MaterialButton b = button("تسجيل الخروج"); b.setOnClickListener(v -> logout()); content.addView(b); }
    private void showServiceDialog(ServiceItem item) { new com.google.android.material.dialog.MaterialAlertDialogBuilder(this).setTitle(item.title).setMessage(item.description).setNegativeButton("إغلاق", null).setPositiveButton("حجز", (d, w) -> showBooking()).show(); }
    private void logout() { LocalSession.clear(this); startActivity(new Intent(this, AuthActivity.class)); finish(); }
    private void clear() { content.removeAllViews(); }
    private TextView heading(String t) { TextView v = paragraph(t); v.setTextSize(24); v.setTextColor(0xFF172554); v.setTypeface(null, 1); return v; }
    private TextView paragraph(String t) { TextView v = new TextView(this); v.setText(t); v.setTextSize(16); v.setTextColor(0xFF475569); v.setGravity(Gravity.RIGHT); v.setPadding(0, 10, 0, 16); return v; }
    private MaterialButton button(String t) { MaterialButton b = new MaterialButton(this); b.setText(t); b.setAllCaps(false); b.setTextSize(16); b.setLayoutDirection(View.LAYOUT_DIRECTION_RTL); return b; }
    private android.widget.EditText field(String hint) { android.widget.EditText e = new android.widget.EditText(this); e.setHint(hint); e.setGravity(Gravity.RIGHT); e.setTextSize(16); e.setPadding(12, 10, 12, 10); return e; }
    private TextView servicePreview(ServiceItem item) { TextView v = paragraph("• " + item.title + "\n" + item.description); v.setOnClickListener(x -> showServiceDialog(item)); return v; }
    private void openUrl(String url) { try { startActivity(new Intent(Intent.ACTION_VIEW, Uri.parse(url))); } catch (Exception e) { Toast.makeText(this, "تعذر فتح الرابط", Toast.LENGTH_SHORT).show(); } }
}
