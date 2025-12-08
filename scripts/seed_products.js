const admin = require('firebase-admin');
const serviceAccount = require('../service-account-key.json'); // User needs to provide this or we use default creds if running locally with auth

// Initialize Firebase Admin
if (!admin.apps.length) {
    try {
        admin.initializeApp({
            credential: admin.credential.applicationDefault() // Tries to use Google Application Default Credentials
        });
    } catch (e) {
        console.error("Error initializing admin:", e);
        process.exit(1);
    }
}

const db = admin.firestore();

const PRODUCTS = [
    {
        id: 'whey-iso',
        name: "Whey Protein Isolate",
        category: "Supplements",
        price: 45,
        image: "https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?auto=format&fit=crop&q=80&w=500",
        stock: 100,
        description: "High quality isolate protein for maximum recovery."
    },
    {
        id: 'smart-bottle',
        name: "XPASS Smart Bottle",
        category: "Gear",
        price: 25,
        image: "https://images.unsplash.com/photo-1602143407151-11115cd4e69b?auto=format&fit=crop&q=80&w=500",
        stock: 50,
        description: "Keeps your water cold for 24h. Temperature display included."
    },
    {
        id: 'pre-workout',
        name: "Pre-Workout Energy",
        category: "Supplements",
        price: 35,
        image: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?auto=format&fit=crop&q=80&w=500",
        stock: 200,
        description: "Explosive energy for your hardest workouts."
    },
    {
        id: 'lifting-straps',
        name: "Lifting Straps",
        category: "Gear",
        price: 15,
        image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=500",
        stock: 75,
        description: "Improve your grip and lift heavier."
    }
];

async function seedProducts() {
    console.log('🌱 Seeding products...');
    const batch = db.batch();

    for (const product of PRODUCTS) {
        const ref = db.collection('products').doc(product.id);
        batch.set(ref, product);
    }

    await batch.commit();
    console.log('✅ Products seeded successfully!');
}

seedProducts();
