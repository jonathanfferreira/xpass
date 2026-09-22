# 🏋️‍♂️ XPASS - Fitness Ecosystem (Vercel Ready)

Uma plataforma completa, futurista e de alta performance ("Future Prime" / tema Onyx & Neon Orange `#FF5200`) que conecta academias, estúdios e alunos por meio de créditos flexíveis, reservas inteligentes, command center para parceiros, painel administrativo e **AI Coach** integrado com o Google Gemini.

---

## 📱 Ecossistema Unificado

O projeto conta com um **Portal Hub** inteligente que centraliza todas as interfaces do ecossistema:

| Interface | Descrição | Principais Recursos |
|-----------|-----------|---------------------|
| 🏋️ **App do Aluno** | Experiência completa para alunos | Exploração de estúdios, saldo de créditos no **Energy Core**, agendamento de aulas, Supply Drop (loja de suplementos), painel de bem-estar (macros & diário), scanner nutricional e **AI Coach** inteligente |
| 🏢 **Portal do Parceiro** | Command center para academias e estúdios | Scanner de QR Code para validação rápida de check-ins na recepção, cadastro de novas aulas com geração de descrição por IA, extrato financeiro e controle de acesso (Dono vs Staff) |
| 🛡️ **Console Administrativo** | Dashboard executivo da plataforma | Métricas de GMV, evolução de reservas, fluxo de caixa, split de pagamentos, moderação de tickets e **Command Palette (`Ctrl+K`)** |
| 🤖 **Gemini AI Coach** | Assistente de treino e anamnese | Orientação de treino, cálculo calórico, recomendação de academias próximas e análise visual de equipamentos por imagem |

---

## 🚀 Como Rodar Localmente

### Pré-requisitos
- Node.js 18+ instalado
- npm ou yarn

### Instalação & Execução

```bash
# 1. Clone o repositório
git clone https://github.com/jonathanfferreira/xpass.git
cd xpass

# 2. Instale as dependências
npm install

# 3. Inicie o servidor de desenvolvimento
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000) no seu navegador para abrir o **Portal Hub**.

---

## ☁️ Como Hospedar na Vercel (1 Clique)

O projeto já está 100% configurado para a **Vercel** através do arquivo `vercel.json` e do bundler nativo Vite.

### Opção 1: Via Dashboard da Vercel (Recomendado)
1. Acesse [vercel.com](https://vercel.com) e clique em **"Add New Project"**.
2. Importe o repositório `jonathanfferreira/xpass`.
3. A Vercel detectará automaticamente as configurações:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. (Opcional) Em **Environment Variables**, adicione a sua chave do Google Gemini para o AI Coach:
   - `GEMINI_API_KEY`: sua chave de API do [Google AI Studio](https://aistudio.google.com/)
5. Clique em **Deploy**! Em segundos seu projeto estará no ar com HTTPS e CDN global.

### Opção 2: Via Vercel CLI

```bash
npm install -g vercel
vercel
```

---

## 🛠️ Tecnologias Utilizadas

- **Frontend**: React 19, TypeScript, Vite 6, Tailwind CSS v4
- **Ícones**: Lucide React
- **Design System**: Future Prime (Onyx 950 `#000000`, Neon Orange `#FF5200`, Glassmorphism, Micro-animações)
- **Persistência**: LocalStorage State Engine (créditos, agendamentos, aulas e check-ins persistentes)
- **Backend Serverless**: Vercel Serverless Functions (`/api/coach.ts`)
- **Inteligência Artificial**: Google Gemini API (Visão computacional e orientação personalizada)

---

## 📁 Estrutura do Projeto

```
xpass/
├── api/                   # Serverless Functions da Vercel
│   └── coach.ts           # Endpoint inteligente para o Gemini AI Coach
├── src/
│   ├── components/        # Componentes reutilizáveis
│   │   ├── AICoach.tsx    # Assistente de IA flutuante
│   │   ├── BottomNav.tsx  # Barra de navegação móvel de vidro
│   │   ├── CategoryGrid.tsx # Grid de modalidades esportivas
│   │   ├── CommandPalette.tsx # Menu rápido executivo (Ctrl+K)
│   │   ├── CreditCard.tsx # Visualizador holográfico "Energy Core"
│   │   ├── FeatureCard.tsx # Destaques de estúdios e categorias
│   │   ├── FoodScanner.tsx # Scanner de refeições e calorias com IA
│   │   ├── LoadingState.tsx # Skeletons de carregamento suave
│   │   ├── ProductCard.tsx # Cards da loja Supply Drop
│   │   ├── StudioCard.tsx  # Cards de academias parceiras com notas e distância
│   │   └── Toast.tsx       # Sistema de notificações visuais
│   ├── services/
│   │   └── storage.ts     # Gerenciador de persistência local
│   ├── App.tsx            # Portal Hub com seletor de interfaces
│   ├── StudentApp.tsx     # App completo do Aluno
│   ├── PartnerApp.tsx     # Portal da Academia com scanner QR
│   ├── AdminApp.tsx       # Painel administrativo com KPIs e gráficos
│   ├── constants.ts       # Base de dados de academias e produtos
│   ├── types.ts           # Definições TypeScript
│   ├── index.css          # Estilos e tokens Tailwind CSS v4
│   └── main.tsx           # Ponto de entrada React
├── index.html             # HTML otimizado com fontes Inter, Oswald e Space Mono
├── vercel.json            # Configuração de rotas e build da Vercel
├── vite.config.ts         # Configuração do Vite
├── tsconfig.json          # Configurações TypeScript
├── package.json           # Dependências e scripts
└── README.md
```

---

## 📄 Licença

Proprietário - XPASS © 2025. Todos os direitos reservados.
