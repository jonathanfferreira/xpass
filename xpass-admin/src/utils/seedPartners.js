import { db } from '../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

const MOCK_PARTNERS = [
    {
        name: "Iron Box Crossfit",
        category: "Crossfit",
        image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop",
        address: "Rua da Força, 123 - Centro",
        rating: 4.9,
        description: "O maior box de Crossfit da região. Equipamentos Rogue e coaches certificados.",
        amenities: ["Chuveiro", "Estacionamento", "Wi-Fi"],
        status: "ACTIVE",
        revenue: 1250,
        checkins: 50
    },
    {
        name: "Zen Yoga Studio",
        category: "Yoga",
        image: "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?q=80&w=1469&auto=format&fit=crop",
        address: "Av. da Paz, 45 - Jardins",
        rating: 4.8,
        description: "Um refúgio de tranquilidade no meio da cidade. Hatha, Vinyasa e Ashtanga.",
        amenities: ["Tapetes Premium", "Chá Cortesia", "Vestiário"],
        status: "ACTIVE",
        revenue: 800,
        checkins: 32
    },
    {
        name: "Fight Club MMA",
        category: "Luta",
        image: "https://images.unsplash.com/photo-1555597673-b21d5c935865?q=80&w=1472&auto=format&fit=crop",
        address: "Rua dos Campeões, 88 - Barra",
        rating: 4.7,
        description: "Treine com campeões mundiais. Muay Thai, Jiu-Jitsu e Boxe.",
        amenities: ["Ringue Oficial", "Sacos de Pancada", "Loja"],
        status: "ACTIVE",
        revenue: 2100,
        checkins: 84
    },
    {
        name: "Dance Soul",
        category: "Dança",
        image: "https://images.unsplash.com/photo-1524594152303-9fd13543fe6e?q=80&w=1470&auto=format&fit=crop",
        address: "Galeria das Artes, Loja 4",
        rating: 4.9,
        description: "Expresse-se através do movimento. Ballet, Jazz, Hip-hop e Contemporâneo.",
        amenities: ["Piso Flutuante", "Ar Condicionado", "Espelhos"],
        status: "ACTIVE",
        revenue: 600,
        checkins: 24
    },
    {
        name: "Aqua Life Natação",
        category: "Natação",
        image: "https://images.unsplash.com/photo-1530549387789-4c1017266635?q=80&w=1470&auto=format&fit=crop",
        address: "Clube Central - Piscina 2",
        rating: 4.6,
        description: "Piscina olímpica aquecida e tratada com ozônio. Aulas para todas as idades.",
        amenities: ["Piscina Aquecida", "Vestiário Família", "Lanchonete"],
        status: "ACTIVE",
        revenue: 1500,
        checkins: 60
    }
];

/**
 * Seeds the Firestore 'partners' collection with mock data.
 *
 * Iterates through a predefined list of mock partners and adds them to Firestore.
 * Useful for initializing the database with test data for development.
 *
 * @returns {Promise<Object>} Returns an object indicating success status and the count of partners created.
 *                            If failed, returns success: false and the error.
 */
export const seedPartners = async () => {
    try {
        const partnersRef = collection(db, "partners");

        for (const partner of MOCK_PARTNERS) {
            await addDoc(partnersRef, partner);
            console.log(`Parceiro criado: ${partner.name}`);
        }

        return { success: true, count: MOCK_PARTNERS.length };
    } catch (error) {
        console.error("Erro ao criar parceiros:", error);
        return { success: false, error };
    }
};
