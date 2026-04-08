# الأوامر والخطوات المطلوبة - دليل العمل

## الأوامر الفورية (Copy & Paste Ready)

### المرحلة 1: الإعداد الأساسي

```bash
# 1.1 تثبيت المكتبات الإضافية المطلوبة
npm install bcryptjs jsonwebtoken dotenv
npm install -D @types/bcryptjs @types/jsonwebtoken

# 1.2 بناء المشروع والتحقق من عدم وجود أخطاء
npm run build

# 1.3 تشغيل في بيئة التطوير
npm run dev
```

---

## خطوات العمل الملموسة

### 1️⃣ المرحلة الأولى: API Routes الأساسية (يوم 1-2)

#### الملفات المطلوب إنشاؤها:

**`/app/api/auth/register/route.ts`**
```typescript
export async function POST(req: Request) {
  // 1. استقبال البيانات (email, password, phone)
  // 2. التحقق من صحة البيانات
  // 3. تجزئة كلمة المرور
  // 4. حفظ المستخدم في قاعدة البيانات
  // 5. إرسال رسالة تأكيد البريد الإلكتروني
  // 6. إرجاع token
}
```

**`/app/api/auth/login/route.ts`**
```typescript
export async function POST(req: Request) {
  // 1. استقبال email + password
  // 2. البحث عن المستخدم
  // 3. التحقق من كلمة المرور
  // 4. إنشاء JWT token
  // 5. تخزين في الجلسة
  // 6. إرجاع token + user data
}
```

**`/app/api/auth/verify-otp/route.ts`**
```typescript
export async function POST(req: Request) {
  // 1. استقبال phone + otp
  // 2. التحقق من الـ OTP من قاعدة البيانات
  // 3. وضع علامة على الحساب كمُتحقق
  // 4. إرجاع confirmation
}
```

#### أوامر العمل:
```bash
# أنشئ المجلد
mkdir -p app/api/auth/{register,login,verify-otp}

# أنشئ الملفات بالمحتوى أعلاه
touch app/api/auth/{register,login,verify-otp}/route.ts
```

---

### 2️⃣ المرحلة الثانية: قاعدة البيانات (يوم 2-3)

#### اختر أحد الخيارات:

**الخيار أ: Supabase (الأسهل)**
```bash
# 1. قم بالتسجيل على supabase.com
# 2. أنشئ مشروع جديد
# 3. احصل على SUPABASE_URL و SUPABASE_ANON_KEY
# 4. أضفهما إلى .env.local
```

**الخيار ب: Neon PostgreSQL**
```bash
# 1. قم بالتسجيل على neon.tech
# 2. أنشئ database جديد
# 3. احصل على DATABASE_URL
# 4. أضفه إلى .env.local
```

**الخيار ج: Firebase**
```bash
# 1. قم بالتسجيل على firebase.google.com
# 2. أنشئ مشروع جديد
# 3. احصل على API keys
# 4. أضفها إلى .env.local
```

#### SQL Scripts لإنشاء الجداول:

**للخيار A و B (PostgreSQL):**
```sql
-- جدول المستخدمين
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'buyer',
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- جدول العقارات
CREATE TABLE properties (
  id SERIAL PRIMARY KEY,
  title_en VARCHAR(255) NOT NULL,
  title_ar VARCHAR(255) NOT NULL,
  price DECIMAL(15,2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'PI',
  city VARCHAR(100) NOT NULL,
  country VARCHAR(100) NOT NULL,
  bedrooms INTEGER,
  area DECIMAL(10,2),
  images TEXT[],
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- جدول المفضلات
CREATE TABLE favorites (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  property_id INTEGER REFERENCES properties(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- جدول المعاملات
CREATE TABLE transactions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  property_id INTEGER REFERENCES properties(id),
  amount DECIMAL(15,2) NOT NULL,
  currency VARCHAR(10),
  status VARCHAR(50),
  tx_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

### 3️⃣ المرحلة الثالثة: توصيل المكونات (يوم 3-4)

#### تحديث `/components/pages/home-page.tsx`:

```typescript
// أضف هذا الـ Hook الجديد
import { useSWR } from '@/hooks/use-swr';

// داخل المكون:
const { data: properties, isLoading } = useSWR(
  '/api/properties',
  fetcher
);

// عرض البيانات:
{isLoading ? (
  <LoadingSpinner />
) : (
  <PropertyGrid properties={properties} />
)}
```

---

### 4️⃣ المرحلة الرابعة: نظام الدفع Pi (يوم 4-5)

#### إنشاء `/app/api/payments/route.ts`:

```typescript
export async function POST(req: Request) {
  const { amount, propertyId, userId } = await req.json();
  
  // 1. التحقق من المستخدم
  // 2. تهيئة معاملة Pi Network
  // 3. إعادة توجيه للتوقيع
  // 4. حفظ المعاملة في قاعدة البيانات
  // 5. إرجاع رابط الدفع
}
```

---

### 5️⃣ المرحلة الخامسة: الاختبار (يوم 5-6)

#### إنشاء `/tests/api.test.ts`:

```typescript
// اختبر كل endpoint
describe('API Tests', () => {
  test('POST /api/auth/register', async () => {
    // اختبر التسجيل الصحيح
    // اختبر المدخلات الخاطئة
    // اختبر التكرار
  });

  test('POST /api/auth/login', async () => {
    // اختبر تسجيل الدخول الصحيح
    // اختبر البيانات الخاطئة
  });
});
```

---

## قائمة المهام بالتفصيل

### الأسبوع 1: الأساسيات

- [ ] إنشاء API Route للتسجيل
- [ ] إنشاء API Route لتسجيل الدخول
- [ ] إنشاء جدول المستخدمين في قاعدة البيانات
- [ ] تطبيق تجزئة كلمات المرور
- [ ] اختبار API من Postman
- [ ] توصيل واجهة المستخدم بـ API
- [ ] اختبار تدفق المصادقة كاملاً

### الأسبوع 2: العقارات والبحث

- [ ] إنشاء جدول العقارات
- [ ] API للحصول على قائمة العقارات
- [ ] API للبحث والتصفية
- [ ] تطبيق Cache للعقارات
- [ ] توصيل الشبكة بـ API
- [ ] اختبار البحث والتصفية
- [ ] تحسين الأداء

### الأسبوع 3: المعاملات والدفع

- [ ] إنشاء جدول المعاملات
- [ ] API لإنشاء معاملة
- [ ] تكامل Pi Network SDK
- [ ] API للتحقق من الدفع
- [ ] تطبيق Webhooks للإشعارات
- [ ] اختبار الدفع الكامل
- [ ] معالجة الأخطاء

### الأسبوع 4: التحسينات والنشر

- [ ] تطبيق Advanced Security
- [ ] تحسينات الأداء النهائية
- [ ] اختبارات شاملة
- [ ] التوثيق النهائي
- [ ] إعداد CI/CD
- [ ] النشر على Vercel
- [ ] اختبار في الإنتاج

---

## الملفات الحاسمة التي يجب إنشاؤها

### الحد الأدنى للعمل (MVP):

```
✅ إذا أردت تشغيل المنصة فوراً:

1. /app/api/auth/register/route.ts
2. /app/api/auth/login/route.ts
3. /app/api/properties/route.ts
4. /lib/db.ts (اتصال قاعدة البيانات)
5. /lib/auth-middleware.ts (حماية المسارات)
```

### المميزات الإضافية (بعد MVP):

```
6. /app/api/payments/route.ts
7. /app/api/favorites/route.ts
8. /app/api/search/route.ts
9. /app/api/reviews/route.ts
10. /app/api/analytics/route.ts
```

---

## تشخيص سريع

### اختبر هل المنصة تعمل:

```bash
# 1. تحقق من بدء التطبيق
npm run dev
# يجب أن ترى: ✓ Ready in 1.2s

# 2. افتح المتصفح
# http://localhost:3000
# يجب أن تظهر الصفحة الرئيسية

# 3. اختبر التنقل
# انقر على "Buy" أو "Rent"
# يجب أن تظهر العقارات

# 4. افتح Console (F12)
# لا يجب أن تظهر أخطاء حمراء
```

### اختبر API بـ curl:

```bash
# اختبر endpoint بسيط
curl http://localhost:3000/api/properties

# يجب أن ترى JSON response
# إذا أعطى 404، API لم ينشأ بعد
# إذا أعطى 500، خطأ في الخادم
```

---

## الموارد والمراجع

### المكتبات المطلوبة:
- bcryptjs: تشفير كلمات المرور
- jsonwebtoken: JWT tokens
- zod: التحقق من البيانات
- swr: تحديث البيانات

### التوثيق:
- Next.js: https://nextjs.org/docs
- Supabase: https://supabase.com/docs
- Pi Network: https://docs.pi-sdk.org
- shadcn/ui: https://ui.shadcn.com

---

## الخطوة التالية

**اختر واحداً من الخيارات التالية:**

### ✅ إذا أردت **نموذج سريع جداً** (24 ساعة):
1. استخدم Firebase للبيانات
2. استخدم Supabase Auth
3. انسخ البيانات النموذجية
4. طبّق الدفع مع Pi SDK

### ✅ إذا أردت **حل محترف** (أسبوع واحد):
1. استخدم PostgreSQL مع Supabase
2. أنشئ API Routes كاملة
3. طبّق نظام أمان متقدم
4. أضف اختبارات شاملة

### ✅ إذا أردت **حل إنتاجي كامل** (أسبوعين):
1. كل ما سبق +
2. CI/CD Pipeline
3. Monitoring والـ Logging
4. Backup واستعادة البيانات
5. Scalability وـ Load Balancing

---

**اختر المسار المطلوب وأعطني الأمر!** 🚀

الآن أنت جاهز لبدء التطوير بخطوات واضحة ومحددة.
