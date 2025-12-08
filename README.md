# 🏋️ XPASS - Fitness Ecosystem

Uma plataforma completa para conectar academias e alunos, com sistema de créditos, reservas e muito mais.

## 📱 Aplicativos

| App | Descrição | URL |
|-----|-----------|-----|
| **Student App** | App para alunos | [xpass-student.web.app](https://xpass-student.web.app) |
| **Partner App** | App para academias parceiras | [xpass-partner.web.app](https://xpass-partner.web.app) |
| **Admin App** | Painel administrativo | [xpass-admin.web.app](https://xpass-admin.web.app) |
| **Landing Page** | Site institucional | [xpass-landing.web.app](https://xpass-landing.web.app) |

## 🏗️ Estrutura do Projeto (Monorepo)

```
xpass/
├── xpass-app-aluno/     # App do Aluno (React + Vite)
├── xpass-app-parceiro/  # App do Parceiro (React + Vite)
├── xpass-app-admin/     # Painel Admin (React + Vite)
├── xpass-landing/       # Landing Page (React + Vite)
├── functions/           # Firebase Cloud Functions
├── dataconnect/         # Firebase Data Connect (PostgreSQL)
├── extensions/          # Firebase Extensions Config
├── firestore.rules      # Regras de segurança Firestore
├── storage.rules        # Regras de segurança Storage
└── firebase.json        # Configuração Firebase
```

## 🚀 Setup Local

### Pré-requisitos
- Node.js 18+
- Firebase CLI (`npm install -g firebase-tools`)
- Conta Firebase

### Instalação

```bash
# Clone o repositório
git clone https://github.com/SEU_USUARIO/xpass.git
cd xpass

# Instale dependências de cada app
cd xpass-app-aluno && npm install && cd ..
cd xpass-app-parceiro && npm install && cd ..
cd xpass-app-admin && npm install && cd ..
cd xpass-landing && npm install && cd ..
cd functions && npm install && cd ..

# Configure Firebase
firebase login
firebase use --add
```

### Variáveis de Ambiente

Copie `.env.example` para `.env` e preencha:

```bash
cp .env.example .env
```

Configure os secrets do Firebase:
```bash
firebase functions:config:set stripe.secret_key="sk_test_..."
firebase functions:config:set jwt.secret="your_jwt_secret"
```

### Rodando Localmente

```bash
# App do Aluno
cd xpass-app-aluno
npm run dev

# Ou use emuladores Firebase
firebase emulators:start
```

## 📦 Deploy

```bash
# Deploy completo
firebase deploy

# Deploy apenas hosting do app aluno
firebase deploy --only hosting:student

# Deploy apenas functions
firebase deploy --only functions
```

## 🔐 Segurança

- **NUNCA** commite arquivos `.env` ou chaves de API
- Use Firebase Secrets para dados sensíveis em produção
- Todas as chaves estão configuradas via `firebase functions:config`

## 🛠️ Tecnologias

- **Frontend:** React 18, Vite, TailwindCSS
- **Backend:** Firebase Cloud Functions (Node.js)
- **Banco de Dados:** Firestore + Firebase Data Connect (PostgreSQL)
- **Autenticação:** Firebase Auth (Google, Microsoft, Email)
- **Pagamentos:** Stripe
- **Hosting:** Firebase Hosting

## 📄 Licença

Proprietário - XPASS © 2025
