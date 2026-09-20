package com.abotalal.app;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.text.InputType;
import android.view.Gravity;
import android.view.View;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;
import androidx.recyclerview.widget.GridLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import com.google.android.material.button.MaterialButton;
import com.google.android.material.dialog.MaterialAlertDialogBuilder;
import com.google.android.material.textfield.TextInputEditText;
import com.google.android.material.textfield.TextInputLayout;
import java.util.List;

public class MainActivity extends AppCompatActivity {
    private LinearLayout content;
    private TextView welcome;
    private final List<ServiceItem> services = ServiceData.all();

    @Override protected void onCreate(Bundle state) {
        super.onCreate(state);
        setContentView(R.layout.activity_main);
        Toolbar toolbar = findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);
        content = findViewById(R.id.content);
        welcome = findViewById(R.id.welcomeText);
        findViewById(R.id.homeButton).setOnClickListener(v -> showHome());
        findViewById(R.id.servicesButton).setOnClickListener(v -> showServices());
        findViewById(R.id.bookingButton).setOnClickListener(v -> showBooking());
        findViewById(R.id.contactButton).setOnClickListener(v -> showContact());
        findViewById(R.id.accountButton).setOnClickListener(v -> showAccount());
        showHome();
    }

    private void showHome() {
        content.removeAllViews();
        TextView title = heading("حلول رقمية تنمّي أعمالك");
        content.addView(title);
        content.addView(paragraph("ابوطلال للدعاية والإعلان والتسويق الإلكتروني والبرمجة والتطوير. فريق متخصص جاهز لتحويل فكرتك إلى نتيجة ملموسة."));
        MaterialButton servicesButton = button("استكشف خدماتنا");
        servicesButton.setOnClickListener(v -> showServices());
        content.addView(servicesButton);
        content.addView(heading("أبرز الخدمات"));
        for (int i = 0; i < Math.min(4, services.size()); i++) content.addView(servicePreview(services.get(i)));
    }

    private void showServices() {
        content.removeAllViews();
        content.addView(heading("خدماتنا"));
        content.addView(paragraph("اختر الخدمة المناسبة وسنتواصل معك لمناقشة التفاصيل."));
        RecyclerView list = new RecyclerView(this);
        list.setLayoutManager(new GridLayoutManager(this, 2));
        list.setAdapter(new ServiceAdapter(services, item -> showServiceDialog(item)));
        content.addView(list, new LinearLayout.LayoutParams(-1, 0, 1));
    }

    private void showBooking() {
        content.removeAllViews();
        content.addView(heading("حجز خدمة"));
        content.addView(paragraph("أرسل بياناتك وسيتواصل معك فريقنا."));
        EditText name = field("الاسم الكامل");
        EditText phone = field("رقم الجوال");
        EditText details = field("تفاصيل الطلب");
        details.setMinLines(4);
        content.addView(name); content.addView(phone); content.addView(details);
        MaterialButton send = button("إرسال طلب الحجز");
        send.setOnClickListener(v -> {
            if (name.getText().toString().trim().isEmpty() || phone.getText().toString().trim().isEmpty()) {
                Toast.makeText(this, "يرجى إدخال الاسم ورقم الجوال", Toast.LENGTH_SHORT).show(); return;
            }
            Toast.makeText(this, "تم استلام طلبك، سنتواصل معك قريباً", Toast.LENGTH_LONG).show();
        });
        content.addView(send);
    }

    private void showContact() {
        content.removeAllViews();
        content.addView(heading("تواصل معنا"));
        content.addView(paragraph("نحن هنا لمساعدتك في الدعاية والإعلان والتسويق والبرمجة."));
        MaterialButton whatsapp = button("التواصل عبر واتساب");
        whatsapp.setOnClickListener(v -> openUrl("https://wa.me/966500000000"));
        MaterialButton email = button("إرسال بريد إلكتروني");
        email.setOnClickListener(v -> {
            Intent intent = new Intent(Intent.ACTION_SENDTO, Uri.parse("mailto:info@example.com"));
            startActivity(Intent.createChooser(intent, "اختر تطبيق البريد"));
        });
        content.addView(whatsapp); content.addView(email);
    }

    private void showAccount() {
        content.removeAllViews();
        content.addView(heading(LocalSession.isLoggedIn(this) ? "مرحباً، " + LocalSession.getName(this) : "حسابك"));
        if (LocalSession.isLoggedIn(this)) {
            MaterialButton logout = button("تسجيل الخروج");
            logout.setOnClickListener(v -> { LocalSession.clear(this); showAccount(); });
            content.addView(logout);
        } else {
            EditText name = field("الاسم"); content.addView(name);
            MaterialButton login = button("دخول تجريبي");
            login.setOnClickListener(v -> {
                String value = name.getText().toString().trim();
                if (value.isEmpty()) { Toast.makeText(this, "أدخل الاسم أولاً", Toast.LENGTH_SHORT).show(); return; }
                LocalSession.save(this, value); showAccount();
            });
            content.addView(login);
        }
    }

    private void showServiceDialog(ServiceItem item) {
        new MaterialAlertDialogBuilder(this).setTitle(item.title).setMessage(item.description + "\n\nهل تريد حجز هذه الخدمة؟")
                .setNegativeButton("إغلاق", null).setPositiveButton("حجز", (d, w) -> showBooking()).show();
    }

    private TextView heading(String text) { TextView v = new TextView(this); v.setText(text); v.setTextSize(24); v.setTextColor(0xFF172554); v.setGravity(Gravity.RIGHT); v.setTypeface(null, 1); v.setPadding(0, 12, 0, 12); return v; }
    private TextView paragraph(String text) { TextView v = new TextView(this); v.setText(text); v.setTextSize(16); v.setTextColor(0xFF475569); v.setGravity(Gravity.RIGHT); v.setPadding(0, 0, 0, 16); return v; }
    private MaterialButton button(String text) { MaterialButton b = new MaterialButton(this); b.setText(text); b.setTextSize(16); b.setAllCaps(false); b.setOnClickListener(v -> {}); content.addView(b); return b; }
    private EditText field(String hint) { EditText e = new EditText(this); e.setHint(hint); e.setTextSize(16); e.setGravity(Gravity.RIGHT); e.setPadding(20, 14, 20, 14); e.setInputType(InputType.TYPE_CLASS_TEXT); return e; }
    private TextView servicePreview(ServiceItem item) { TextView v = paragraph("• " + item.title + "\n" + item.description); v.setOnClickListener(x -> showServiceDialog(item)); return v; }
    private void openUrl(String url) { try { startActivity(new Intent(Intent.ACTION_VIEW, Uri.parse(url))); } catch (Exception e) { Toast.makeText(this, "تعذر فتح الرابط", Toast.LENGTH_SHORT).show(); } }
}
