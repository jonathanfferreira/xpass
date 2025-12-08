# 🐘 PostgreSQL Migration Plan (Firebase Data Connect)

This document details the technical steps to migrate the Xpass backend from Cloud Firestore to Cloud SQL (PostgreSQL) using Firebase Data Connect.

## 1. Schema Translation (NoSQL -> SQL)

We need to define the schema in `schema.gql` (GraphQL syntax used by Data Connect).

### Users & Profiles
```graphql
type User @table {
  uid: String! @col(name: "uid")
  name: String!
  email: String!
  photoUrl: String
  role: String! # 'student', 'partner', 'admin'
  credits: Int! @default(value: 0)
  # Relations
  bookings: [Booking]!
  subscriptions: [Subscription]!
}
```

### Partners & Locations
```graphql
type Partner @table {
  id: UUID! @default(expr: "uuid_generate_v4()")
  name: String!
  category: String! # 'CrossFit', 'Pilates', 'Wellness'
  description: String
  imageUrl: String
  basePrice: Int! # Standard credit cost
  # Location
  latitude: Float!
  longitude: Float!
  address: String!
  # Relations
  classes: [Class]!
}
```

### Classes & Yield Management
```graphql
type Class @table {
  id: UUID! @default(expr: "uuid_generate_v4()")
  partner: Partner!
  name: String!
  startTime: Timestamp!
  endTime: Timestamp!
  capacity: Int!
  bookedCount: Int! @default(value: 0)
  # Yield Management
  offPeakPrice: Int # If null, use Partner.basePrice
}
```

### Bookings (The Core)
```graphql
type Booking @table {
  id: UUID! @default(expr: "uuid_generate_v4()")
  user: User!
  class: Class!
  status: String! # 'CONFIRMED', 'CANCELED'
  cost: Int!
  createdAt: Timestamp! @default(expr: "now()")
}
```

## 2. Implementation Steps

### Phase 1: Environment Setup
1.  **Enable API:** Enable Firebase Data Connect API in Google Cloud Console.
2.  **Provision Database:** Create a Cloud SQL instance (PostgreSQL) via Firebase Console.
3.  **Local Setup:** Configure VS Code extension for Firebase Data Connect.

### Phase 2: Schema Definition
1.  Create `dataconnect/schema/schema.gql`.
2.  Define all types and relationships.
3.  Deploy schema to create tables in PostgreSQL.

### Phase 3: Connector Definition
Create `dataconnect/connector/queries.gql` and `mutations.gql`.

*   `createBooking(classId, userId)`: Transactional booking.
*   `getPartners(lat, lng)`: Geospatial query (PostGIS if supported, or bounding box).
*   `getUserBalance(uid)`: Simple fetch.

### Phase 4: App Integration
1.  Run `firebase dataconnect:sdk:generate` to create typed React hooks.
2.  Replace `useCollection` (Firestore) with `useQuery` (Data Connect) in `xpass-app-aluno`.

## 3. Migration Strategy
Since we are in pre-launch/MVP, we will **not** migrate existing data (it's mostly dummy data). We will start with a fresh PostgreSQL database.

## 4. Verification
*   **Transactions:** Verify that booking a class atomically decreases capacity and user credits.
*   **Performance:** Verify that complex queries (e.g., "Find Yoga classes under 10 credits nearby") run efficiently.
