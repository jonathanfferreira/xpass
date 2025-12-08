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
| Comprar créditos (Stripe) | 🟡 Parcial | Checkout funciona, créditos não atualizam |
| Exibir saldo real | 🟡 Parcial | Às vezes mostra valor errado |
| Histórico de transações | 🔴 Pendente | - |

### 📅 Sistema de Reservas
| Item | Status | Descrição |
|------|--------|-----------|
| Listar academias | ✅ OK | Dados mock |
| Ver detalhes do estúdio | ✅ OK | Modal funcional |
| Reservar aula | 🟡 Parcial | Cloud Function existe, falta testar |
| Ver minhas reservas | ✅ OK | Componente criado |
| Cancelar reserva | 🔴 Pendente | - |

### 🔔 Notificações
| Item | Status | Descrição |
|------|--------|-----------|
| Painel de notificações | ✅ OK | Componente criado (dados mock) |
| Notificações reais | 🔴 Pendente | Integrar com Firestore |
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

## 📋 FASE 3: Funcionalidades Avançadas (FUTURO)

### App Aluno
- [ ] QR Code dinâmico para check-in
- [ ] Histórico de visitas
- [ ] Sistema de XP/Gamificação
- [ ] AI Coach integrado
- [ ] Scanner de alimentos
- [ ] Planos de assinatura

### App Parceiro
- [ ] Dashboard de aulas
- [ ] Gerenciar horários
- [ ] Escanear QR dos alunos
- [ ] Relatório financeiro
- [ ] Cadastro de instrutores

### App Admin
- [ ] Dashboard completo
- [ ] Gestão de usuários
- [ ] Gestão de parceiros
- [ ] Relatórios financeiros
- [ ] Configurações do sistema

---

## 🎯 SPRINT ATUAL: Corrigir Core

### Prioridade 1 (Esta Semana)
1. **🔥 Corrigir fluxo de créditos**
   - [ ] Debugar webhook Stripe
   - [ ] Verificar `syncStripePayment` function
   - [ ] Garantir atualização em tempo real
   
2. **📊 Sincronização de dados**
   - [ ] Garantir `userData.credits` atualiza corretamente
   - [ ] Testar `refreshUserData()`

### Prioridade 2 (Próxima Semana)
3. **📅 Testar fluxo de reserva completo**
   - [ ] Reservar uma aula
   - [ ] Ver na lista de reservas
   - [ ] Verificar desconto de créditos

4. **🔔 Notificações reais**
   - [ ] Criar coleção `notifications` no Firestore
   - [ ] Conectar painel com dados reais

### Prioridade 3 (Futuro Próximo)
5. **👤 Completar perfil**
   - [ ] Edição de nome/foto
   - [ ] Aba de amigos
   - [ ] Achievements básicos

---

## 📈 Métricas de Progresso

```
Fase 1 (Fundação):      ████████████████████ 100%
Fase 2 (Core):          ████████░░░░░░░░░░░░  40%
Fase 3 (Avançado):      ░░░░░░░░░░░░░░░░░░░░   0%

Total do MVP:           ████████░░░░░░░░░░░░  45%
```

---

## 🐛 Bugs Conhecidos

| Bug | Severidade | Status |
|-----|------------|--------|
| Créditos não atualizam após compra | 🔴 Alta | Investigando |
| Saldo diferente ao recarregar página | 🔴 Alta | Investigando |
| Functions usam chaves hardcoded | 🟡 Média | Workaround aplicado |

---

## 💡 Ideias para o Futuro

- [ ] App nativo (React Native)
- [ ] Integração com wearables
- [ ] Social features (seguir amigos)
- [ ] Marketplace de produtos fitness
- [ ] Sistema de avaliações
- [ ] Chat com academias
- [ ] Integração com Strava/Apple Health

---

## 📞 Links Úteis

| Recurso | URL |
|---------|-----|
| App Aluno | https://xpass-student.web.app |
| App Parceiro | https://xpass-partner.web.app |
| App Admin | https://xpass-admin.web.app |
| Landing | https://xpass-landing.web.app |
| GitHub | https://github.com/jonathanfferreira/xpass |
| Firebase Console | https://console.firebase.google.com/project/tranquil-door-479317-a2 |
| Stripe Dashboard | https://dashboard.stripe.com/test |

