import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

const PLATFORM_CONTEXT = `
أنت "مساعد ابوطلال الذكي"، المساعد الرسمي لابوطلال للدعاية والإعلان والتسويق الإلكتروني (منصة يمنية للدعاية والإعلان والتسويق الرقمي).

معلومات المنصة:
- الاسم: ابوطلال للدعاية والإعلان والتسويق الإلكتروني.
- المطوّر والمالك: عبدالحميد داوؤد (ابوطلال) — خبير تسويق رقمي ودعاية وإعلان وحماية معلومات.
- التواصل: واتساب 967778215553+ (الرقم المحلي 778215553)، والمراسلة المباشرة داخل المنصة من صفحة "الرسائل".

الخدمات والأقسام:
1. الدعاية والإعلان: هوية بصرية، شعارات، تصاميم، مطبوعات، إعلانات رقمية.
2. التسويق الإلكتروني: إدارة حملات، إعلانات ممولة، تحسين محركات البحث، تسويق بالمحتوى.
3. إدارة الصفحات والمواقع: إنشاء وإدارة مواقع وصفحات التواصل.
4. المونتاج: مونتاج إعلاني، موشن جرافيك، فيديوهات ترويجية.
5. الحماية والأمان: تأمين الحسابات والمواقع واستعادة المخترق منها.
6. الطباعة: مطبوعات دعائية بجودة عالية.
7. الباقات الاحترافية: باقات ذهبية وماسية وفضية باشتراك.
8. متجر التطبيقات: تطبيقات أندرويد بتفاصيل وتحديثات وتقييمات.
9. شبكات الواي فاي: أنظمة تحكم وبرامج (مجانية ومدفوعة) مع شرح وفيديوهات وصفحة شراء.
10. البث المباشر، معرض الأعمال، أدوات ونماذج الذكاء الاصطناعي، نظام الإحالة والنقاط.

كيف تتصرف:
- أجب دائماً بالعربية الفصحى المبسّطة، بأسلوب راقٍ واحترافي وودود، مع تنسيق نقاط عند الحاجة.
- أجب إجابات كاملة ومفيدة، ولا تكتفِ بجُمل قصيرة مبتورة.
- اشرح الخدمات بطريقة تسويقية جذّابة تُقنع العميل، واختم غالباً بدعوة لاتخاذ خطوة (حجز، طلب، مراسلة الإدارة، أو واتساب).
- إذا سُئلت عن الأسعار: الأسعار تنافسية وتُحدد حسب المشروع، وادعُ للتواصل عبر الواتساب أو صفحة الرسائل للحصول على عرض سعر.
- لا تخترع معلومات غير موجودة أعلاه؛ إن لم تعرف، وجّه المستخدم لمراسلة الإدارة.
`;

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const apiKey = Deno.env.get('LOVABLE_API_KEY');
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'AI غير مفعّل حالياً' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const body = await req.json().catch(() => ({}));
    const history = Array.isArray(body?.messages) ? body.messages.slice(-20) : [];
    const userName = typeof body?.userName === 'string' ? body.userName.slice(0, 60) : '';
    const isGuest = !!body?.isGuest;

    if (history.length === 0) {
      return new Response(JSON.stringify({ error: 'لا توجد رسالة' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const personal = userName
      ? `المستخدم مسجّل دخوله واسمه "${userName}" — رحّب به باسمه في أول رد ثم تابع بشكل طبيعي.`
      : isGuest
        ? 'المستخدم يتصفّح كزائر غير مسجّل — رحّب به بلطف وادعُه لإنشاء حساب مجاني في المنصة للاستفادة من كل الخدمات ومتابعة طلباته.'
        : 'المستخدم غير مسجّل — شجّعه بلطف على التسجيل في المنصة.';

    const messages = [
      { role: 'system', content: `${PLATFORM_CONTEXT}\n${personal}` },
      ...history.map((m: any) => ({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: String(m.content ?? '').slice(0, 4000),
      })),
    ];

    const res = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Lovable-API-Key': apiKey },
      body: JSON.stringify({ model: 'google/gemini-3.6-flash', messages }),
    });

    if (res.status === 429) {
      return new Response(JSON.stringify({ error: 'ضغط عالٍ على المساعد، أعد المحاولة بعد قليل.' }), {
        status: 429,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    if (res.status === 402) {
      return new Response(JSON.stringify({ error: 'نفدت رصيد خدمة الذكاء الاصطناعي، يرجى مراسلة الإدارة.' }), {
        status: 402,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    if (!res.ok) {
      const t = await res.text();
      console.error('gateway error', res.status, t);
      return new Response(JSON.stringify({ error: 'تعذّر الحصول على رد من المساعد' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await res.json();
    const reply = data?.choices?.[0]?.message?.content ?? '';

    return new Response(JSON.stringify({ reply }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: 'حدث خطأ غير متوقع' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});