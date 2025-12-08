# 🏗️ XPASS - Arquitetura do Sistema

## 📊 Diagrama de Arquitetura

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              🌐 FRONTEND (React + Vite)                         │
├─────────────────┬─────────────────┬─────────────────┬───────────────────────────┤
│   📱 App Aluno  │  🏢 App Parceiro │   👑 App Admin  │      🏠 Landing Page      │
│   (Student)     │    (Partner)    │    (Admin)      │                           │
│                 │                 │                 │                           │
│ • Ver academias │ • Gerenciar aulas│ • Dashboard    │ • Marketing               │
│ • Reservar aulas│ • Ver checkins  │ • Gestão users │ • Captura leads           │
│ • Comprar créd. │ • Financeiro    │ • Relatórios   │ • Pricing                 │
│ • QR Code Pass  │ • Escanear QR   │                │                           │
└────────┬────────┴────────┬────────┴────────┬───────┴───────────┬───────────────┘
         │                 │                 │                   │
         ▼                 ▼                 ▼                   ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                         🔥 FIREBASE SERVICES                                    │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │   🔐 Auth    │  │  📦 Firestore │  │   ☁️ Cloud   │  │  🏠 Hosting  │        │
│  │              │  │              │  │   Functions  │  │              │        │
│  │ • Google     │  │ • users      │  │              │  │ • student    │        │
│  │ • Microsoft  │  │ • partners   │  │ • bookClass  │  │ • partner    │        │
│  │ • Email      │  │ • classes    │  │ • syncStripe │  │ • admin      │        │
│  │              │  │ • bookings   │  │ • checkout   │  │ • landing    │        │
│  │              │  │ • customers  │  │ • aiCoach    │  │              │        │
│  └──────────────┘  │ • products   │  │ • QR codes   │  └──────────────┘        │
│                    │ • transactions│  └──────┬───────┘                          │
│                    └──────────────┘         │                                   │
│                                             │                                   │
└─────────────────────────────────────────────┼───────────────────────────────────┘
                                              │
         ┌────────────────────────────────────┼────────────────────────────────────┐
         │                                    │                                    │
         ▼                                    ▼                                    ▼
┌─────────────────┐               ┌─────────────────────┐              ┌──────────────────┐
│   💳 STRIPE     │               │   🤖 GOOGLE AI      │              │   🐘 POSTGRESQL  │
│                 │               │    (Gemini)         │              │   (Data Connect) │
│ • Pagamentos    │               │                     │              │                  │
│ • Webhooks      │               │ • AI Coach          │              │ • Transactions   │
│ • Checkout      │               │ • Recomendações     │              │ • Analytics      │
│                 │               │                     │              │ • Relatórios     │
└─────────────────┘               └─────────────────────┘              └──────────────────┘
```

---

## 🛠️ Stack Tecnológico

### Frontend
| Tecnologia | Versão | Uso |
|------------|--------|-----|
| React | 18.x | Framework UI |
| Vite | 7.x | Build tool |
| TailwindCSS | 3.x | Estilização |
| Lucide React | - | Ícones |
| React Router | 6.x | Navegação |

### Backend / Cloud
| Tecnologia | Uso |
|------------|-----|
| Firebase Auth | Autenticação (Google, Microsoft, Email) |
| Cloud Firestore | Banco NoSQL (tempo real) |
| Cloud Functions | Backend serverless (Node.js 20) |
| Firebase Hosting | Deploy dos apps |
| Firebase Extensions | Stripe Payments |

### Integrações
| Serviço | Uso |
|---------|-----|
| Stripe | Processamento de pagamentos |
| Google Generative AI (Gemini) | AI Coach |
| PostgreSQL (Data Connect) | Analytics e relatórios |

---

## 📁 Estrutura de Diretórios

```
xpass/
├── 📱 xpass-app-aluno/        # App do estudante
│   ├── src/
│   │   ├── components/        # Componentes reutilizáveis
│   │   ├── pages/             # Páginas principais
│   │   ├── contexts/          # Context API (Auth)
│   │   ├── lib/               # Firebase config
│   │   └── constants/         # Dados mock/constantes
│   └── dist/                  # Build de produção
│
├── 🏢 xpass-app-parceiro/     # App da academia
│   └── (mesma estrutura)
│
├── 👑 xpass-admin/            # Painel administrativo
│   └── (mesma estrutura)
│
├── 🏠 xpass-landing/          # Site institucional
│   └── (mesma estrutura)
│
├── ⚡ functions/              # Cloud Functions
│   ├── index.js               # Funções (NÃO COMMITADO)
│   └── index.template.js      # Template sem secrets
│
├── 🔗 dataconnect/            # Firebase Data Connect
│   ├── schema/                # Schema GraphQL
│   └── connectors/            # Queries e mutations
│
├── 🔒 firestore.rules         # Regras de segurança
├── 🔧 firebase.json           # Config Firebase
└── 📖 README.md               # Documentação
```

---

## 🔄 Fluxo de Compra de Créditos

```
┌─────────┐    ┌──────────────┐    ┌─────────────────┐    ┌────────────┐
│ Usuário │───▶│ BuyCredits   │───▶│ createStripe    │───▶│   Stripe   │
│ clica   │    │  Component   │    │ Checkout (func) │    │  Checkout  │
└─────────┘    └──────────────┘    └─────────────────┘    └─────┬──────┘
                                                                │
                                                                ▼
┌─────────┐    ┌──────────────┐    ┌─────────────────┐    ┌────────────┐
│ Créditos│◀───│ refreshUser  │◀───│ syncStripe      │◀───│  Webhook   │
│ na tela │    │    Data()    │    │ Payment (func)  │    │  Stripe    │
└─────────┘    └──────────────┘    └─────────────────┘    └────────────┘
```

---

## 🔐 Modelo de Segurança

### Firestore Rules
- Usuários só leem seus próprios dados
- Créditos só são modificados via Cloud Functions
- Bookings só são criados via Cloud Functions
- Partners leem dados de suas aulas

### Secrets
- Chaves Stripe: `functions/index.js` (local only)
- Chaves Firebase: Públicas (apenas leitura)
- JWT Secret: Hardcoded na function

---

## 📊 Coleções Firestore

| Coleção | Descrição | Campos principais |
|---------|-----------|-------------------|
| `users` | Perfis de usuários | uid, name, email, credits, favorites |
| `partners` | Academias cadastradas | name, address, category, rating |
| `classes` | Aulas disponíveis | datetime, instructor, capacity |
| `bookings` | Reservas realizadas | userId, classId, status |
| `customers` | Dados Stripe | stripeId, email |
| `transactions` | Histórico financeiro | type, amount, timestamp |
| `products` | Produtos da loja | name, price, category |

