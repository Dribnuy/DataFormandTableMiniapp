import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  QueryDocumentSnapshot,
  Timestamp,
  writeBatch
} from 'firebase/firestore';
import { db } from './config';

export interface FormData {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  description: string;
  userId: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface PaginationOptions {
  pageSize?: number;
  lastDoc?: QueryDocumentSnapshot;
  userId?: string;
  orderBy?: {
    field: keyof FormData;
    direction: 'asc' | 'desc';
  };
}

export interface PaginatedResult<T> {
  data: T[];
  lastDoc?: QueryDocumentSnapshot;
  hasMore: boolean;
}

export class FirestoreService {
  private static FORM_COLLECTION = 'formData';

  // Створення документу
  static async createFormData(data: Omit<FormData, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const now = Timestamp.now();
      const docData = {
        ...data,
        createdAt: now,
        updatedAt: now
      };

      const docRef = await addDoc(collection(db, this.FORM_COLLECTION), docData);
      return docRef.id;
    } catch (error: any) {
      throw new Error(`Failed to create form data: ${error.message}`);
    }
  }

  // Отримання документу за ID
  static async getFormData(id: string): Promise<FormData | null> {
    try {
      const docRef = doc(db, this.FORM_COLLECTION, id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return null;
      }

      return {
        id: docSnap.id,
        ...docSnap.data()
      } as FormData;
    } catch (error: any) {
      throw new Error(`Failed to get form data: ${error.message}`);
    }
  }

  // Оновлення документу
  static async updateFormData(
    id: string, 
    data: Partial<Omit<FormData, 'id' | 'createdAt' | 'userId'>>
  ): Promise<void> {
    try {
      const docRef = doc(db, this.FORM_COLLECTION, id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: Timestamp.now()
      });
    } catch (error: any) {
      throw new Error(`Failed to update form data: ${error.message}`);
    }
  }

  // Видалення документу
  static async deleteFormData(id: string): Promise<void> {
    try {
      const docRef = doc(db, this.FORM_COLLECTION, id);
      await deleteDoc(docRef);
    } catch (error: any) {
      throw new Error(`Failed to delete form data: ${error.message}`);
    }
  }

  // Отримання списку з пагінацією
  static async getFormDataList(options: PaginationOptions = {}): Promise<PaginatedResult<FormData>> {
    try {
      const {
        pageSize = 10,
        lastDoc,
        userId,
        orderBy: orderByOptions = { field: 'createdAt', direction: 'desc' }
      } = options;

      let q = query(collection(db, this.FORM_COLLECTION));

      // Фільтр по користувачу
      if (userId) {
        q = query(q, where('userId', '==', userId));
      }

      // Сортування
      q = query(q, orderBy(orderByOptions.field, orderByOptions.direction));

      // Пагінація
      if (lastDoc) {
        q = query(q, startAfter(lastDoc));
      }

      q = query(q, limit(pageSize + 1)); // +1 для перевірки hasMore

      const querySnapshot = await getDocs(q);
      const docs = querySnapshot.docs;
      
      const hasMore = docs.length > pageSize;
      const dataSlice = hasMore ? docs.slice(0, -1) : docs;

      const data: FormData[] = dataSlice.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as FormData));

      return {
        data,
        lastDoc: dataSlice[dataSlice.length - 1],
        hasMore
      };
    } catch (error: any) {
      throw new Error(`Failed to get form data list: ${error.message}`);
    }
  }

  // Пошук
  static async searchFormData(searchTerm: string, userId?: string): Promise<FormData[]> {
    try {
      let q = query(collection(db, this.FORM_COLLECTION));

      if (userId) {
        q = query(q, where('userId', '==', userId));
      }

      q = query(q, orderBy('createdAt', 'desc'));

      const querySnapshot = await getDocs(q);
      const data: FormData[] = [];

      querySnapshot.forEach((doc) => {
        const docData = { id: doc.id, ...doc.data() } as FormData;
        
        // Простий пошук (для повнотекстового пошуку використовуйте Algolia)
        const searchFields = [
          docData.firstName,
          docData.lastName,
          docData.description
        ].join(' ').toLowerCase();
        
        if (searchFields.includes(searchTerm.toLowerCase())) {
          data.push(docData);
        }
      });

      return data;
    } catch (error: any) {
      throw new Error(`Search failed: ${error.message}`);
    }
  }

  // Масове видалення
  static async batchDeleteFormData(ids: string[]): Promise<void> {
    try {
      const batch = writeBatch(db);

      ids.forEach(id => {
        const docRef = doc(db, this.FORM_COLLECTION, id);
        batch.delete(docRef);
      });

      await batch.commit();
    } catch (error: any) {
      throw new Error(`Batch delete failed: ${error.message}`);
    }
  }
}
