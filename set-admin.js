// set-admin.js
import admin from 'firebase-admin';
import { readFileSync } from 'node:fs';

admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(readFileSync('./service-account.json','utf8')))
});

// Troque pelo UID do utilizador que será admin
const uid = 'PedroCLeoni';

await admin.auth().setCustomUserClaims(uid, { admin: true });
console.log('Claim admin atribuída a', uid);
process.exit(0);

<script type="module">
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
  import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
  import { getFirestore, collection, getDocs, writeBatch } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

  const firebaseConfig = { /* ...config do seu projeto... */ };
  const app = initializeApp(firebaseConfig);
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
      adminMsg.textContent = 'Ranking resetado com sucesso.';
    } catch (e) {
      adminMsg.textContent = 'Erro ao resetar ranking: ' + e.message;
    }
  });
</script>



