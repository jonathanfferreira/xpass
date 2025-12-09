# 🗺️ XPASS - Roadmap de Desenvolvimento

**Última Atualização:** 08/12/2024

---

## 📍 Status Atual: MVP em Desenvolvimento

O XPASS é uma plataforma que conecta alunos a academias parceiras usando um sistema de créditos. Estamos na fase de construção do MVP.

---

## ✅ FASE 1: Fundação (CONCLUÍDA)

### Infraestrutura
- [x] Projeto Firebase configurado
- [x] Monorepo estruturado (4 apps)
- [x] GitHub repositório criado
- [x] Firebase Hosting configurado
- [x] Cloud Functions deployadas

### Apps Criados
- [x] Landing Page básica
- [x] App Aluno (estrutura principal)
- [x] App Parceiro (estrutura básica)
- [x] App Admin (estrutura básica)

### Autenticação
- [x] Login com Google
- [x] Login com Microsoft
- [x] Contexto de autenticação

---

## 🔨 FASE 2: Core Features (EM ANDAMENTO)

### 💳 Sistema de Créditos
| Item | Status | Descrição |
|------|--------|-----------|
| Comprar créditos (Stripe) | ✅ OK | Checkout e Webhook funcionais |
| Exibir saldo real | ✅ OK | Sincronização via Firestore forçada |
| Histórico de transações | ✅ OK | Componente e índices criados |

### 📅 Sistema de Reservas
| Item | Status | Descrição |
|------|--------|-----------|
| Listar academias | ✅ OK | Dados mock |
| Ver detalhes do estúdio | ✅ OK | Modal funcional |
| Reservar aula | ✅ OK | Cloud Function testada |
| Ver minhas reservas | ✅ OK | Componente criado |
| Cancelar reserva | 🔴 Pendente | - |

### 🔔 Notificações
| Item | Status | Descrição |
|------|--------|-----------|
| Painel de notificações | ✅ OK | Integrado com Firestore |
| Notificações reais | ✅ OK | Gatilhos em pagam. e reserva |
| Push notifications | 🔴 Pendente | - |

### 👤 Perfil do Usuário
| Item | Status | Descrição |
|------|--------|-----------|
| Ver perfil | ✅ OK | Básico |
| Editar perfil | 🔴 Pendente | - |
| Academias favoritas | ✅ OK | Funcional |
| Meus amigos | 🔴 Pendente | - |
| Achievements | 🔴 Pendente | - |

---

## � FASE 3: App Parceiro (EM ANDAMENTO)

### Feito Recentemente:
1. **📸 Scanner QR Real** - ✅ Concluído
   - [x] Integração com `react-qr-reader`
   - [x] Validação com Geolocalização (Anti-Fraude)
   - [x] Conexão com Cloud Function `validateAccessCode`

2. **📊 Dashboard Conectado** - ✅ Concluído
   - [x] Leitura real de reservas (`studioId`)
   - [x] Cálculo de receita diária
   - [x] Contador de check-ins

3. **👥 Gestão de Time** - ✅ Concluído
   - [x] Cadastro de Instrutores (`InstructorsManager`)
# 🗺️ XPASS - Roadmap de Desenvolvimento

**Última Atualização:** 08/12/2024

---

## 📍 Status Atual: MVP em Desenvolvimento

O XPASS é uma plataforma que conecta alunos a academias parceiras usando um sistema de créditos. Estamos na fase de construção do MVP.

---

## ✅ FASE 1: Fundação (CONCLUÍDA)

### Infraestrutura
- [x] Projeto Firebase configurado
- [x] Monorepo estruturado (4 apps)
- [x] GitHub repositório criado
- [x] Firebase Hosting configurado
- [x] Cloud Functions deployadas

### Apps Criados
- [x] Landing Page básica
- [x] App Aluno (estrutura principal)
- [x] App Parceiro (estrutura básica)
- [x] App Admin (estrutura básica)

### Autenticação
- [x] Login com Google
- [x] Login com Microsoft
- [x] Contexto de autenticação

---

## 🔨 FASE 2: Core Features (EM ANDAMENTO)

### 💳 Sistema de Créditos
| Item | Status | Descrição |
|------|--------|-----------|
| Comprar créditos (Stripe) | ✅ OK | Checkout e Webhook funcionais |
| Exibir saldo real | ✅ OK | Sincronização via Firestore forçada |
| Histórico de transações | ✅ OK | Componente e índices criados |

### 📅 Sistema de Reservas
| Item | Status | Descrição |
|------|--------|-----------|
| Listar academias | ✅ OK | Dados mock |
| Ver detalhes do estúdio | ✅ OK | Modal funcional |
| Reservar aula | ✅ OK | Cloud Function testada |
| Ver minhas reservas | ✅ OK | Componente criado |
| Cancelar reserva | 🔴 Pendente | - |

### 🔔 Notificações
| Item | Status | Descrição |
|------|--------|-----------|
| Painel de notificações | ✅ OK | Integrado com Firestore |
| Notificações reais | ✅ OK | Gatilhos em pagam. e reserva |
| Push notifications | 🔴 Pendente | - |

### 👤 Perfil do Usuário
| Item | Status | Descrição |
|------|--------|-----------|
| Ver perfil | ✅ OK | Básico |
| Editar perfil | 🔴 Pendente | - |
| Academias favoritas | ✅ OK | Funcional |
| Meus amigos | 🔴 Pendente | - |
| Achievements | 🔴 Pendente | - |

---

##  FASE 3: App Parceiro (EM ANDAMENTO)

### Feito Recentemente:
1. **📸 Scanner QR Real** - ✅ Concluído
   - [x] Integração com `react-qr-reader`
   - [x] Validação com Geolocalização (Anti-Fraude)
   - [x] Conexão com Cloud Function `validateAccessCode`

2. **📊 Dashboard Conectado** - ✅ Concluído
   - [x] Leitura real de reservas (`studioId`)
   - [x] Cálculo de receita diária
   - [x] Contador de check-ins

3. **👥 Gestão de Time** - ✅ Concluído
   - [x] Cadastro de Instrutores (`InstructorsManager`)
   - [x] Visualização de Equipe

4. **📈 Financeiro Real** - ✅ Concluído
   - [x] Integração `recharts`
   - [x] Gráfico de Receita (7 dias) baseado em dados reais

## 🚀 FASE 4: Admin & Deploy (CONCLUÍDO)

### Feito Recentemente:
1. **🛡️ App Admin** - ✅ Concluído
   - [x] Dashboard Geral (Visão de Receita e Churn)
   - [x] Gestão de Academias (Aprovação de Parceiros)
   - [x] Suporte Financeiro (Estornos)

2. **☁️ Deploy Geral** - ✅ Concluído
   - [x] Compilação de todos os apps (Aluno, Parceiro, Admin, Landing)
   - [x] Cloud Functions em Produção
   - [x] Hosting Configurado

## 🚀 FASE 5: Social & Engajamento (V2.0 - EM ANDAMENTO)

### 🌟 Sistema de Avaliações
- [x] Backend: Collection `reviews` e trigger para média
- [x] Frontend: Modal de Avaliação (Estrelas + Comentário)
- [x] Integração: Botão 'Avaliar' no painel de reservas
- [x] Visualização: Exibir nota nas academias

---

## 🎯 SPRINT ATUAL: Monetização & Social Hardcore (V2.0) 🚀

### 1. 💎 Assinaturas e Planos (XPASS PRO)
> *Goal: Receita recorrente e gatekeeping de features premium (IA).*
- [x] **Stripe Subscriptions:** Integração (front) com SubscriptionModal.
- [x] **Checkout de Assinatura:** Fluxo iniciado via `firestore-stripe-payments`.
- [x] **Pro Features:** Bloqueio de AI Coach implementado (Lock Screen).
- [ ] **Configuração Real:** Criar produtos no Stripe e conectar Price ID.
- [ ] **Customer Portal:** Gerenciar assinatura (cancelar/upgrade).

### 2. 🐀 Estrutura "Gymrats" (Social Accountability)
> *Goal: Engajamento viciante através de competição.*
- [ ] **Squads/Grupos:** Criar grupos de amigos (privados/públicos).
- [ ] **Desafios:** Criar competições (ex: "30 treinos em 30 dias").
- [ ] **Leaderboards:** Ranking dinâmico entre amigos.
- [ ] **Workout Log 2.0:** Postar fotos de treinos livres (fora de estúdios) para pontuar.

---

## 🎯 SPRINT ANTERIOR: Social Básico (Concluído)

### Feito nesta sprint:

1. **️ Edição de Perfil** - ✅ Concluído
   - [x] Criar componente EditProfile
   - [x] Integração com Firestore (updateDoc)
   - [x] UI/UX Premium

2. **🏆 Gamificação e Tiers** - ✅ Concluído
   - [x] Definir CONSTANTS (Levels, Achievements)
   - [x] Componente AchievementsView
   - [x] Visualização de Nível no Perfil

3. ** Cancelamento de Reservas** - ✅ Concluído
   - [x] Cloud Function `cancelBooking` (com reembolso)
   - [x] Botão de cancelamento no `ReservationsPanel`
   - [x] Notificação de cancelamento

### Sprints Anteriores:
- **Corrigir Core:** Créditos, Webhook Stripe, Reservas, Notificações, Testes.

---

## 📈 Métricas de Progresso

```
Fase 1 (Fundação):      ████████████████████ 100%
Fase 2 (Core):          ████████████████████ 100%
Fase 3 (Parceiro):      ████████████████████ 100%
Fase 4 (Admin/Deploy):  ████████████████████ 100%

Total do MVP:           ████████████████████ 100% 👍
```

---

## 🐛 Bugs Conhecidos

| Bug | Severidade | Status |
|-----|------------|--------|
| - | - | Nenhum crítico no momento |

---

## 💡 Ideias para o Futuro (V2.0)

- [ ] App nativo (React Native)
- [ ] Integração com wearables
- [ ] Social features (seguir amigos)
- [ ] Marketplace de produtos fitness
- [ ] Sistema de avaliações
- [ ] Chat com academias
- [ ] Integração com Strava/Apple Health

---

## 📞 Links de Produção

| Recurso | URL |
|---------|-----|
| 🎓 App Aluno | https://xpass-student.web.app |
| 💼 App Parceiro | https://xpass-partner.web.app |
| 🛡️ App Admin | https://xpass-admin.web.app |
| 🌐 Landing Page | https://xpass-landing.web.app |
| GitHub | https://github.com/jonathanfferreira/xpass |
| Firebase Console | https://console.firebase.google.com/project/tranquil-door-479317-a2 |
| Stripe Dashboard | https://dashboard.stripe.com/test |
