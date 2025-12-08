# 🗄️ XPASS - Firestore Schema (V2.0)

Este documento define a estrutura de dados para suportar todas as funcionalidades planejadas até 2026.

---

## 1. Usuários (`users`)
Coleção raiz. Cada documento é um `uid` do Firebase Auth.

```json
{
  "uid": "user_123",
  "name": "João Silva",
  "email": "joao@email.com",
  "photoURL": "https://...",
  "role": "student", // 'student' | 'partner' | 'admin'
  "credits": 150, // Saldo atual (Moeda XPASS)
  "tier": "GOLD", // Nível de Gamificação
  "xp": 4500, // Pontos de experiência
  
  // Dados Privados (Subcoleção ou Campos Protegidos)
  "cpf": "123.456.789-00",
  "phone": "+5511999999999",
  "stripeCustomerId": "cus_123", // ID no Gateway de Pagamento
  "asaasCustomerId": "cus_asaas_123",
  
  // Gamificação & Saúde
  "stats": {
    "totalCheckins": 45,
    "streakDays": 3,
    "lastCheckin": "2025-12-03T18:00:00Z",
    "caloriesBurned": 12500
  },
  
  "createdAt": Timestamp,
  "updatedAt": Timestamp
}
```

---

## 2. Parceiros (`partners`)
Coleção raiz.

```json
{
  "id": "gym_123",
  "name": "CrossFit Iron",
  "description": "O melhor box da região.",
  "category": "CrossFit", // 'Musculação', 'Yoga', 'Luta'
  "tier": "PREMIUM", // Define o custo em créditos (1, 2, 4)
  "priceInCredits": 4, 
  
  // Localização (GeoPoint para queries espaciais)
  "location": {
    "lat": -23.5505,
    "lng": -46.6333,
    "address": "Rua Augusta, 100",
    "city": "São Paulo",
    "state": "SP"
  },
  
  // Mídia
  "logo": "url",
  "coverImage": "url",
  "gallery": ["url1", "url2"],
  "amenities": ["wifi", "shower", "parking"],
  
  // Operação
  "rating": 4.8,
  "reviewCount": 120,
  "active": true
}
```

---

## 3. Aulas (`classes`)
Coleção raiz (para facilitar buscas globais).

```json
{
  "id": "class_999",
  "partnerId": "gym_123", // Referência ao Parceiro
  "name": "WOD - Treino do Dia",
  "instructor": "Coach Mike",
  "startTime": Timestamp, // "2025-12-04T19:00:00Z"
  "endTime": Timestamp,
  "durationMinutes": 60,
  
  // Controle de Vagas
  "capacity": 20,
  "bookedCount": 15, // Atualizado via Transaction
  "isFull": false,
  
  "recurrenceId": "rec_123" // Se for uma aula recorrente
}
```

---

## 4. Reservas (`bookings`)
Coleção raiz. O coração do agendamento.

```json
{
  "id": "book_555",
  "userId": "user_123",
  "partnerId": "gym_123",
  "classId": "class_999",
  
  "status": "CONFIRMED", // 'CONFIRMED' | 'CANCELED' | 'COMPLETED' | 'NOSHOW'
  "costInCredits": 4,
  
  "checkinTime": null, // Preenchido quando o aluno chega na academia
  "createdAt": Timestamp
}
```

---

## 5. Transações Financeiras (`transactions`)
Histórico imutável de movimentação de créditos.

```json
{
  "id": "tx_777",
  "userId": "user_123",
  "type": "PURCHASE", // 'PURCHASE' (Compra) | 'USAGE' (Reserva) | 'REFUND' (Estorno) | 'EXPIRE'
  "amount": 100, // Quantidade de créditos
  "valueBRL": 50.00, // Valor em Reais (se aplicável)
  
  "relatedId": "book_555", // ID da reserva ou do pagamento
  "description": "Reserva CrossFit Iron",
  
  "balanceAfter": 146, // Snapshot do saldo após a transação (Audit Trail)
  "timestamp": Timestamp
}
```

---

## 6. Assinaturas (`subscriptions`)
Controle de recorrência.

```json
{
  "id": "sub_888",
  "userId": "user_123",
  "planId": "plan_gold",
  "status": "ACTIVE", // 'ACTIVE' | 'PAST_DUE' | 'CANCELED'
  "provider": "ASAAS",
  "externalId": "sub_asaas_123",
  
  "currentPeriodStart": Timestamp,
  "currentPeriodEnd": Timestamp,
  "nextBillingDate": Timestamp
}
```

---

## 7. Analytics Agregado (`stats`)
Para dashboards rápidos (Data Intelligence).

```json
// Documento ID: "daily_2025-12-03"
{
  "date": "2025-12-03",
  "totalCheckins": 1540,
  "totalRevenue": 25000.00,
  "newUsers": 45,
  "activePartners": 120,
  
  "byCategory": {
    "crossfit": 500,
    "yoga": 300,
    "musculacao": 740
  }
}
```
