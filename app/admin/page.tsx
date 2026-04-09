'use client';
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';

const ADMIN_PIN = '3027913091994';

export default function AdminDashboard() {
  const [pin, setPin] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [properties, setProperties] = useState<any[]>([]);
  const [form, setForm] = useState({
    title: '', price: '', location: '', type: 'buy', bedrooms: '', area: '', image: '', vrUrl: '', tokenized: false
  });

  const handleLogin = () => {
    if (pin === ADMIN_PIN) setAuthenticated(true);
    else alert('PIN غلط!');
  };

  const loadProperties = async () => {
    const snap = await getDocs(collection(db, 'properties'));
    setProperties(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  };

  useEffect(() => { if (authenticated) loadProperties(); }, [authenticated]);

  const handleAdd = async () => {
    await addDoc(collection(db, 'properties'), form);
    alert('تم إضافة العقار!');
    setForm({ title: '', price: '', location: '', type: 'buy', bedrooms: '', area: '', image: '', vrUrl: '', tokenized: false });
    loadProperties();
  };

  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, 'properties', id));
    loadProperties();
  };

  if (!authenticated) return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#1a1a1a', padding: '40px', borderRadius: '16px', border: '1px solid #d4af37', textAlign: 'center' }}>
        <h1 style={{ color: '#d4af37', marginBottom: '20px' }}>🔐 Admin Panel</h1>
        <input type="password" placeholder="PIN" value={pin} onChange={e => setPin(e.target.value)}
          style={{ padding: '12px', borderRadius: '8px', border: '1px solid #d4af37', background: '#0a0a0a', color: 'white', marginBottom: '16px', width: '200px', display: 'block' }} />
        <button onClick={handleLogin}
          style={{ background: '#d4af37', color: 'black', padding: '12px 32px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
          دخول
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', padding: '20px', color: 'white' }}>
      <h1 style={{ color: '#d4af37', marginBottom: '30px' }}>🏠 Admin Dashboard - RE Global</h1>
      
      <div style={{ background: '#1a1a1a', padding: '24px', borderRadius: '16px', border: '1px solid #d4af37', marginBottom: '30px' }}>
        <h2 style={{ color: '#d4af37', marginBottom: '16px' }}>إضافة عقار جديد</h2>
        {['title', 'price', 'location', 'bedrooms', 'area', 'image'].map(field => (
          <input key={field} placeholder={field} value={(form as any)[field]}
            onChange={e => setForm({ ...form, [field]: e.target.value })}
            style={{ padding: '10px', borderRadius: '8px', border: '1px solid #333', background: '#0a0a0a', color: 'white', marginBottom: '10px', width: '100%', display: 'block' }} />
        ))}
        <input placeholder="VR Tour URL (اختياري)" value={form.vrUrl}
          onChange={e => setForm({ ...form, vrUrl: e.target.value })}
          style={{ padding: '10px', borderRadius: '8px', border: '1px solid #d4af37', background: '#0a0a0a', color: 'white', marginBottom: '10px', width: '100%', display: 'block' }} />
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px', gap: '10px' }}>
          <input type="checkbox" checked={form.tokenized} onChange={e => setForm({ ...form, tokenized: e.target.checked })} />
          <label style={{ color: '#d4af37' }}>Tokenized عقار مرمز</label>
        </div>
        <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}
          style={{ padding: '10px', borderRadius: '8px', border: '1px solid #333', background: '#0a0a0a', color: 'white', marginBottom: '16px', width: '100%' }}>
          <option value="buy">شراء</option>
          <option value="rent">إيجار</option>
          <option value="hotel">فندق</option>
          <option value="tokenized">Tokenized</option>
          <option value="abroad">خارج البلاد</option>
          <option value="offplan">أوف بلان</option>
        </select>
        <button onClick={handleAdd}
          style={{ background: '#d4af37', color: 'black', padding: '12px 32px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
          إضافة العقار
        </button>
      </div>

      <h2 style={{ color: '#d4af37', marginBottom: '16px' }}>العقارات ({properties.length})</h2>
      {properties.map(p => (
        <div key={p.id} style={{ background: '#1a1a1a', padding: '16px', borderRadius: '12px', border: '1px solid #333', marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ color: '#d4af37', fontWeight: 'bold' }}>{p.title}</p>
            <p style={{ color: '#999', fontSize: '14px' }}>{p.location} - {p.price} Pi - {p.type}</p>
            {p.tokenized && <span style={{ color: '#00ff88', fontSize: '12px' }}>✅ Tokenized</span>}
            {p.vrUrl && <span style={{ color: '#4488ff', fontSize: '12px', marginLeft: '8px' }}>🥽 VR</span>}
          </div>
          <button onClick={() => handleDelete(p.id)}
            style={{ background: '#ff4444', color: 'white', padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>
            حذف
          </button>
        </div>
      ))}
    </div>
  );
}