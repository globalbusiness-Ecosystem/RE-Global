import { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from './firebase';

export interface Property {
  id: string;
  title: string;
  titleAr?: string;
  price: number;
  currency?: string;
  location: string;
  locationAr?: string;
  type: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  image?: string;
  images?: string[];
  description?: string;
  descriptionAr?: string;
  featured?: boolean;
  createdAt?: any;
}

export function useProperties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProperties() {
      try {
        const q = query(collection(db, 'properties'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Property[];
        setProperties(data);
      } catch (err: any) {
        // Fallback: try without orderBy if index not ready
        try {
          const snapshot = await getDocs(collection(db, 'properties'));
          const data = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as Property[];
          setProperties(data);
        } catch (e: any) {
          setError(e.message);
        }
      } finally {
        setLoading(false);
      }
    }
    fetchProperties();
  }, []);

  return { properties, loading, error };
}
