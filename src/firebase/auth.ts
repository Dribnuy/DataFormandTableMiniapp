import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
  type User as FirebaseUser,
  updateEmail,
  updatePassword,
  deleteUser
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, Timestamp } from 'firebase/firestore';
import { auth, db } from './config';

export interface User {
  id: string;
  username: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  emailVerified: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface RegisterData {
  email: string;
  password: string;
  username: string;
  displayName?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export class AuthService {
  // Реєстрація користувача
  static async register(data: RegisterData): Promise<User> {
    try {
      const { email, password, username, displayName } = data;
      
      // Створення користувача в Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Оновлення профілю
      await updateProfile(firebaseUser, {
        displayName: displayName || username
      });

      // Створення документу в Firestore
      const userData: User = {
        id: firebaseUser.uid,
        username,
        email: firebaseUser.email!,
        displayName: displayName || username,
        photoURL: firebaseUser.photoURL ?? undefined,
        emailVerified: firebaseUser.emailVerified,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };

      await setDoc(doc(db, 'users', firebaseUser.uid), userData);
      return userData;
    } catch (error: any) {
      throw new Error(`Registration failed: ${error.message}`);
    }
  }

  // Вхід користувача
  static async login(data: LoginData): Promise<User> {
    try {
      const { email, password } = data;
      
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Отримання даних з Firestore
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      
      if (!userDoc.exists()) {
        throw new Error('User data not found in database');
      }

      return userDoc.data() as User;
    } catch (error: any) {
      throw new Error(`Login failed: ${error.message}`);
    }
  }

  // Вихід користувача
  static async logout(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error: any) {
      throw new Error(`Logout failed: ${error.message}`);
    }
  }

  // Скидання паролю
  static async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
      throw new Error(`Password reset failed: ${error.message}`);
    }
  }

  // Отримання поточного користувача
  static async getCurrentUser(): Promise<User | null> {
    const firebaseUser = auth.currentUser;
    if (!firebaseUser) return null;

    try {
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      
      if (!userDoc.exists()) {
        return null;
      }

      return userDoc.data() as User;
    } catch (error) {
      console.error('Failed to get current user:', error);
      return null;
    }
  }

  // Оновлення профілю
  static async updateProfile(userId: string, data: Partial<User>): Promise<void> {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        ...data,
        updatedAt: Timestamp.now()
      });

      // Оновлення у Firebase Auth якщо потрібно
      if (auth.currentUser && (data.displayName || data.photoURL)) {
        await updateProfile(auth.currentUser, {
          displayName: data.displayName,
          photoURL: data.photoURL
        });
      }
    } catch (error: any) {
      throw new Error(`Profile update failed: ${error.message}`);
    }
  }

  // Підписка на зміни авторизації
  static onAuthStateChange(callback: (user: FirebaseUser | null) => void) {
    return onAuthStateChanged(auth, callback);
  }
}