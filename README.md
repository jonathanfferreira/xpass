# 🏋️ XPASS - Fitness Ecosystem

Uma plataforma completa para conectar academias e alunos, com sistema de créditos, reservas, pagamentos e IA Coach.

## 📱 Aplicativos e Módulos

| Módulo | Descrição | Status / Tecnologia |
|---|---|---|
| **xpass-admin** | Painel Administrativo para gestão de parceiros, finanças e suporte. | React, Vite, TailwindCSS |
| **xpass-app-aluno** | Aplicativo Mobile para alunos (reserva de aulas, compras, check-in). | *Em desenvolvimento* (Empty) |
| **xpass-app-parceiro** | Aplicativo para parceiros gerenciarem aulas e check-ins. | *Em desenvolvimento* (Empty) |
| **xpass-landing** | Landing Page institucional. | *Em desenvolvimento* (Empty) |
| **xpass-google-aistudio-inspiration** | Protótipo de inspiração com componentes avançados e AI Coach. | React, Vite, TailwindCSS, Gemini AI |
| **functions** | Backend Serverless (API, Webhooks, Jobs). | Firebase Cloud Functions (Node.js) |
| **dataconnect** | Camada de dados relacionais e GraphQL. | Firebase Data Connect (PostgreSQL) |

## 🏗️ Estrutura do Projeto (Monorepo)

O repositório é organizado como um monorepo, contendo múltiplos pacotes independentes mas relacionados.

```
xpass/
├── xpass-admin/                     # Painel Administrativo (React + Vite)
│   ├── src/components/              # Componentes UI (CommandPalette, FinancialView, etc.)
│   ├── src/lib/                     # Configurações do Firebase
│   └── ...
├── xpass-google-aistudio-inspiration/ # Protótipo AI & UI
│   ├── components/                  # Componentes (AICoach, FoodScanner, etc.)
│   └── ...
├── functions/                       # Backend (Cloud Functions)
│   ├── index.js                     # Pontos de entrada da API
│   └── ...
├── dataconnect/                     # Definições de Schema e Queries GraphQL
│   ├── schema/                      # Schema GQL principal
│   └── connector/                   # Queries e Mutations
├── scripts/                         # Scripts utilitários (Node.js)
│   ├── list_partners.mjs            # Listar parceiros pendentes
│   └── seed_products.js             # Popular banco de dados
└── ...
```

## 🚀 Guia de Configuração (Setup)

### Pré-requisitos
- **Node.js** (v18 ou superior)
- **Firebase CLI** (`npm install -g firebase-tools`)
- Conta no **Firebase** e projeto criado.

### Instalação

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/SEU_USUARIO/xpass.git
   cd xpass
   ```

2. **Instale dependências dos módulos ativos:**
   ```bash
   # Backend (Functions)
   cd functions
   npm install
   cd ..

   # Admin App
   cd xpass-admin
   npm install
   cd ..

   # AI Inspiration App
   cd xpass-google-aistudio-inspiration
   npm install
   cd ..
   ```

3. **Configure o Firebase:**
   ```bash
   firebase login
   firebase use --add  # Selecione seu projeto
   ```

### Variáveis de Ambiente e Configuração

**Cloud Functions:**
Configure as chaves secretas para o Stripe e JWT:
```bash
firebase functions:config:set stripe.secret_key="sk_test_..."
firebase functions:config:set jwt.secret="sua_chave_secreta_jwt"
# Opcional: Gemini API Key se não hardcoded
firebase functions:config:set gemini.api_key="sua_chave_gemini"
```

**Frontend (.env):**
Crie arquivos `.env` nas pastas dos apps (`xpass-admin`, etc.) com as credenciais do Firebase:
```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
# ...outras credenciais
```

## 🛠️ Como Usar e Rodar

### Rodando Localmente

**Admin Panel:**
```bash
cd xpass-admin
npm run dev
```

**AI Inspiration App:**
```bash
cd xpass-google-aistudio-inspiration
npm run dev
```

**Cloud Functions (Emulador):**
```bash
firebase emulators:start
```

### Scripts Utilitários

Na pasta raiz, você pode rodar scripts para tarefas administrativas:

*   **Listar parceiros pendentes:**
    ```bash
    node scripts/list_partners.mjs
    ```
*   **Popular produtos (Seed):**
    ```bash
    node scripts/seed_products.js
    ```

## 📦 Deploy

Para fazer o deploy de todo o projeto ou partes dele:

```bash
# Deploy de tudo (Cuidado: pode sobrescrever configurações)
firebase deploy

# Deploy apenas das Cloud Functions
firebase deploy --only functions

# Deploy de um site específico (Hosting)
firebase deploy --only hosting:admin
```

## 📚 Documentação da API (Cloud Functions)

As funções principais exportadas em `functions/index.js` incluem:

*   `bookClass`: Agenda uma aula para o usuário.
*   `syncStripePayment`: Sincroniza pagamentos do Stripe com créditos do usuário (Webhook).
*   `createStripeCheckout`: Cria sessão de pagamento no Stripe.
*   `generateAccessCode` / `validateAccessCode`: Gera e valida QR Codes de acesso via JWT.
*   `askAICoach`: Interface com Gemini AI para dicas de treino.
*   `buyProduct`: Processa compra de produtos usando créditos.

## 🔐 Segurança

*   **Firestore Rules:** Assegure-se de que `firestore.rules` esteja configurado para permitir acesso apenas a usuários autenticados onde necessário.
*   **Segredos:** Nunca commite chaves de API reais. Use `firebase functions:config` ou Secret Manager.

## 📄 Licença

Proprietário - XPASS © 2025
