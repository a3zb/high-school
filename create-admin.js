// Script لإنشاء حساب إداري
// قم بتشغيله مرة واحدة فقط: node create-admin.js

import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

// ضع إعدادات Firebase هنا (من ملف .env.local)
const firebaseConfig = {
    apiKey: process.env.VITE_FIREBASE_API_KEY || "YOUR_API_KEY",
    authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || "YOUR_AUTH_DOMAIN",
    projectId: process.env.VITE_FIREBASE_PROJECT_ID || "YOUR_PROJECT_ID",
    storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || "YOUR_STORAGE_BUCKET",
    messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "YOUR_SENDER_ID",
    appId: process.env.VITE_FIREBASE_APP_ID || "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

async function createAdmin() {
    const adminEmail = "admin@bacsuccess.dz";
    const adminPassword = "Admin@2026";
    const adminName = "Administrator";

    try {
        // إنشاء المستخدم
        const userCredential = await createUserWithEmailAndPassword(auth, adminEmail, adminPassword);
        const user = userCredential.user;

        // حفظ البيانات في Firestore
        await setDoc(doc(db, 'users', user.uid), {
            name: adminName,
            email: adminEmail,
            role: 'moderator', // أعلى صلاحية
            createdAt: new Date()
        });

        console.log('✅ تم إنشاء حساب الإدارة بنجاح!');
        console.log('📧 البريد الإلكتروني:', adminEmail);
        console.log('🔑 كلمة المرور:', adminPassword);
        console.log('⚠️  احفظ هذه المعلومات في مكان آمن!');

        process.exit(0);
    } catch (error) {
        console.error('❌ خطأ في إنشاء الحساب:', error.message);
        process.exit(1);
    }
}

createAdmin();
