import admin from 'firebase-admin';
import { readFileSync } from 'node:fs';

admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(readFileSync('./service-account.json','utf8')))
});

//ID do utilizador que vai ser o admin
const uid = 'PedroCLeoni';

await admin.auth().setCustomUserClaims(uid, { admin: true });
console.log('Claim admin atribuída a', uid);
process.exit(0);

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, collection, getDocs, writeBatch } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDdS_UreonF1FxjkwLabA4VZKu_wCDBJKM",
  authDomain: "quiz-da-leoni.firebaseapp.com",
  projectId: "quiz-da-leoni",
  storageBucket: "quiz-da-leoni.firebasestorage.app",
  messagingSenderId: "473522586002",
  appId: "1:473522586002:web:a90c1353ba39a2fdcf814b",
  measurementId: "G-LJQNFB9NS3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

const btnAdmin = document.getElementById('btn-admin');
const pnlAdmin = document.getElementById('admin-panel');
const btnReset = document.getElementById('btn-reset-ranking');
const adminMsg = document.getElementById('admin-msg');

// Mostrar botões de admin para quem tem a claim
  
onAuthStateChanged(auth, async (user) => {
    
    if (!user) {
      btnAdmin.hidden = true;
      pnlAdmin.hidden = true;
      return;
    }
    // Recarrega o token para garantir claims atualizadas
    const tokenResult = await user.getIdTokenResult(true);
    const isAdmin = !!tokenResult.claims.admin;
    btnAdmin.hidden = !isAdmin;
    if (!isAdmin) pnlAdmin.hidden = true;
  });

   btnAdmin?.addEventListener('click', () => {
    pnlAdmin.hidden = !pnlAdmin.hidden;
  });

    // Operação protegida por regras: só admins conseguem escrever/apagar
    btnReset?.addEventListener('click', async () => {
    adminMsg.textContent = 'A apagar documentos de ranking...';
    try {
      const snap = await getDocs(collection(db, 'ranking'));
      const batch = writeBatch(db);
      snap.forEach(doc => batch.delete(doc.ref));
      await batch.commit();
      adminMsg.textContent = 'Reset do ranking com sucesso.';
    } catch (e) {
      adminMsg.textContent = 'Erro ao fazer reset no ranking: ' + e.message;
    }
  });




