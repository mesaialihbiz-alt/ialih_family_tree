const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc } = require('firebase/firestore');
const fs = require('fs');

// ===== YOUR REAL FIREBASE CONFIG =====
const firebaseConfig = {
  apiKey: "AIzaSyAPDQCDsHYQbr00kwqE-xTVvxCNIdFYfxc",
  authDomain: "ialih-family-tree.firebaseapp.com",
  projectId: "ialih-family-tree",
  storageBucket: "ialih-family-tree.firebasestorage.app",
  messagingSenderId: "78958530371",
  appId: "1:78958530371:web:9840f54c3c5baef12429f6",
  measurementId: "G-W9DJ9PXEZW"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Load family data
const familyData = JSON.parse(fs.readFileSync('familyData.json', 'utf8'));

async function seed() {
  console.log(`🌱 Seeding ${familyData.length} family members into Firestore...\n`);

  let successCount = 0;
  let errorCount = 0;

  for (const member of familyData) {
    try {
      // Ensure all required fields exist
      const docData = {
        id: member.id,
        name: member.name || '',
        gender: member.gender || 'F',
        spouse: member.spouse || '',
        parent: member.parent || '',
        bio: member.bio || '',
        hobbies: member.hobbies || '',
        designation: member.designation || '',
        funFact: member.funFact || '',
        status: member.status || 'approved',
        submittedBy: member.submittedBy || 'admin',
        submittedAt: member.submittedAt || new Date().toISOString()
      };

      await setDoc(doc(db, 'familyMembers', member.id), docData);
      console.log(`✅ Added: ${member.name} (${member.id})`);
      successCount++;
    } catch (err) {
      console.error(`❌ Failed: ${member.name} (${member.id}) — ${err.message}`);
      errorCount++;
    }
  }

  console.log(`\n🎉 Done! ${successCount} added, ${errorCount} failed.`);
  console.log('Your Firestore database is now ready!');
  process.exit(0);
}

seed().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
