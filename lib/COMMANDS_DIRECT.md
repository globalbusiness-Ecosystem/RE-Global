# 📋 قائمة الأوامر المباشرة - نسخ والصق مباشرة

## اختر أحد المسارات الثلاثة:

---

## 🚀 المسار 1: البدء السريع (24 ساعة)

### الخطوة 1: تثبيت المكتبات
```bash
npm install firebase @react-firebase/auth @react-firebase/database
npm install bcryptjs jsonwebtoken dotenv
```

### الخطوة 2: إنشاء `.env.local`
```
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_id
NEXT_PUBLIC_PI_NETWORK_API=https://api.pi-sdk.org
```

### الخطوة 3: تشغيل المشروع
```bash
npm run dev
# افتح http://localhost:3000
```

### الخطوة 4: اختبار
```bash
# تأكد من ظهور الصفحة الرئيسية
# انقر على "Buy" و "Rent"
# تنقل بدون أخطاء = نجاح ✅
```

---

## 🎯 المسار 2: الحل الاحترافي (أسبوع)

### الخطوة 1: إنشاء حساب Supabase
1. اذهب إلى https://supabase.com
2. قم بالتسجيل (استخدم GitHub)
3. أنشئ مشروع جديد
4. انسخ `Project URL` و `Anon Key`

### الخطوة 2: تثبيت المكتبات
```bash
npm install @supabase/supabase-js bcryptjs jsonwebtoken
npm install -D @types/node
```

### الخطوة 3: إنشاء `.env.local`
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_KEY=your_service_key
JWT_SECRET=your_secret_key_32_chars_min
PI_NETWORK_API_KEY=your_pi_api_key
```

### الخطوة 4: إنشاء جداول SQL في Supabase
انسخ والصق هذا في `SQL Editor`:

```sql
-- جدول المستخدمين
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20) UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'buyer',
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- جدول العقارات
CREATE TABLE properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- جدول المعاملات
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  amount DECIMAL(15,2) NOT NULL,
  currency VARCHAR(10),
  status VARCHAR(50),
  tx_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### الخطوة 5: إنشاء API Routes
أنشئ الملفات التالية:

**`/app/api/auth/register/route.ts`**
```typescript
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export async function POST(req: Request) {
  try {
    const { email, password, phone, name } = await req.json();

    // التحقق من البيانات
    if (!email || !password || !phone) {
      return Response.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // تجزئة كلمة المرور
    const hashedPassword = await bcrypt.hash(password, 10);

    // إدراج المستخدم
    const { data, error } = await supabase
      .from('users')
      .insert({
        email,
        password_hash: hashedPassword,
        phone,
        name,
        role: 'buyer'
      })
      .select();

    if (error) {
      return Response.json({ error: error.message }, { status: 400 });
    }

    return Response.json({
      message: 'User created successfully',
      user: data[0]
    });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
```

**`/app/api/properties/route.ts`**
```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('verified', true)
      .range(offset, offset + limit - 1);

    if (error) {
      return Response.json({ error: error.message }, { status: 400 });
    }

    return Response.json({ properties: data });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
```

### الخطوة 6: تشغيل المشروع
```bash
npm run dev
```

### الخطوة 7: اختبار API
```bash
# اختبر التسجيل
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email":"user@example.com",
    "password":"12345678",
    "phone":"201010810558",
    "name":"User Name"
  }'

# اختبر استرجاع العقارات
curl http://localhost:3000/api/properties
```

---

## 💎 المسار 3: الحل الكامل (أسبوعين)

### يشمل كل ما بالمسار 2 +

### الخطوة 8: إضافة الأمان المتقدم

**`/lib/auth-middleware.ts`**
```typescript
import jwt from 'jsonwebtoken';

export function verifyAuth(req: Request) {
  const token = req.headers.get('Authorization')?.split(' ')[1];
  
  if (!token) {
    throw new Error('No token provided');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    return decoded;
  } catch (error) {
    throw new Error('Invalid token');
  }
}
```

### الخطوة 9: إضافة Webhook للدفع

**`/app/api/payments/webhook/route.ts`**
```typescript
export async function POST(req: Request) {
  const { paymentId, status, userId } = await req.json();

  if (status === 'COMPLETED') {
    // تحديث المعاملة
    // إرسال إشعار
    // تسجيل الملكية
  }

  return Response.json({ success: true });
}
```

### الخطوة 10: الاختبارات

**`/tests/api.test.ts`**
```typescript
describe('API Tests', () => {
  test('should register user', async () => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
        password: '12345678',
        phone: '201010810558',
        name: 'Test User'
      })
    });
    expect(res.status).toBe(200);
  });

  test('should get properties', async () => {
    const res = await fetch('/api/properties');
    expect(res.status).toBe(200);
  });
});
```

### الخطوة 11: إعداد CI/CD

**`.github/workflows/deploy.yml`**
```yaml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npm run build
      - run: npm run test
      - run: npm run lint
```

### الخطوة 12: النشر على Vercel

```bash
npm install -g vercel
vercel
# اتبع التعليمات على الشاشة
```

---

## ⚡ أوامر مفيدة

```bash
# بناء المشروع
npm run build

# التحقق من الأخطاء
npm run lint

# الاختبارات
npm run test

# النشر
npm run deploy

# فحص الأداء
npm run analyze

# تنظيف
npm run clean
```

---

## 📌 اختبارات سريعة

```bash
# 1. تحقق من أن المشروع يشتغل
npm run dev
# يجب أن ترى: ✓ Ready in 1.2s

# 2. افتح http://localhost:3000
# يجب أن تظهر الصفحة الرئيسية

# 3. اختبر API
curl http://localhost:3000/api/properties
# يجب أن ترد JSON

# 4. انقر على Buy/Rent
# يجب أن تنقلت بدون أخطاء

# 5. انقر على الإعدادات
# يجب أن تفتح الصفحة بدون تأخير
```

---

## 🎯 الخطوة التالية

### اختر الآن:
- [ ] تريد المسار 1 (البدء السريع - 24 ساعة)
- [ ] تريد المسار 2 (الاحترافي - أسبوع)
- [ ] تريد المسار 3 (الكامل - أسبوعين)

**أخبرني بالخيار وسأبدأ الآن! 🚀**

---

## 📞 للمساعدة

- البريد: globalbusiness435@gmail.com
- WhatsApp: +201010810558
- الموقع: alshaibgroup.pi

---

**آخر تحديث**: 7 أبريل 2026
**الإصدار**: 1.0 - دليل البدء الكامل
