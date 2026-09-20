package com.abotalal.app;

import android.graphics.Color;
import java.util.Arrays;
import java.util.List;

public final class ServiceData {
    private ServiceData() { }

    public static List<ServiceItem> all() {
        return Arrays.asList(
            new ServiceItem("advertising", "الدعاية والإعلان", "حملات إعلانية مبتكرة وفعالة لتعزيز علامتك التجارية", Color.rgb(30, 91, 255)),
            new ServiceItem("marketing", "التسويق الإلكتروني", "استراتيجيات تسويقية رقمية متكاملة لنمو أعمالك", Color.rgb(0, 145, 210)),
            new ServiceItem("pages", "إدارة الصفحات", "إدارة احترافية لصفحات التواصل الاجتماعي", Color.rgb(123, 97, 255)),
            new ServiceItem("websites", "إدارة المواقع الإلكترونية", "تصميم وتطوير وإدارة المواقع بأحدث التقنيات", Color.rgb(0, 168, 150)),
            new ServiceItem("apps", "إدارة التطبيقات", "تطوير وإدارة تطبيقات الهواتف الذكية", Color.rgb(233, 30, 99)),
            new ServiceItem("montage", "خدمات المونتاج", "إنتاج فيديوهات احترافية عالية الجودة", Color.rgb(229, 57, 53)),
            new ServiceItem("security", "الأمن والحماية", "حماية حساباتك ومواقعك من الاختراق", Color.rgb(69, 90, 100)),
            new ServiceItem("printing", "خدمات الطباعة", "طباعة عالية الجودة لجميع احتياجاتك", Color.rgb(249, 168, 37))
        );
    }
}
