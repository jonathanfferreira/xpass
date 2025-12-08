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

## 🎯 SPRINT ATUAL: Corrigir Core (Concluído!)

### Feito nesta sprint:
1. **🔥 Corrigir fluxo de créditos**
   - [x] Debugar webhook Stripe
   - [x] Verificar `syncStripePayment` function
   - [x] Garantir atualização em tempo real
   
2. **📊 Sincronização de dados**
   - [x] Garantir `userData.credits` atualiza corretamente
   - [x] Testar `refreshUserData()`

3. **📅 Testar fluxo de reserva completo**
   - [x] Reservar uma aula via Cloud Function
   - [x] Ver na lista de reservas
   - [x] Verificar desconto de créditos

4. **🔔 Notificações reais**
   - [x] Criar coleção `notifications` no Firestore
   - [x] Conectar painel com dados reais
   - [x] Notificação de créditos comprados
   - [x] Notificação de reserva confirmada

5. **🧪 Testes Automatizados**
   - [x] Configuração do Jest
   - [x] Testes para `bookStudio` (15 testes)
   - [x] Testes para `confirmPayment` (18 testes)
   - [x] Testes para `geofencing` (12+ testes)

6. **🛡️ Geofencing (Anti-Fraude)**
   - [x] Fórmula Haversine para cálculo de distância
   - [x] Validação de localização no check-in (150m)
   - [x] Mensagem de erro com distância

### Próxima Sprint (Planejamento):
1. **� Edição de Perfil**
2. **🏆 Gamificação e Tiers**
3. **📜 Cancelamento de Reservas**

---

## 📈 Métricas de Progresso

```
Fase 1 (Fundação):      ████████████████████ 100%
Fase 2 (Core):          ███████████████░░░░░  75%
Fase 3 (Avançado):      ░░░░░░░░░░░░░░░░░░░░   0%

Total do MVP:           ███████████░░░░░░░░░  55%
```

---

## �🐛 Bugs Conhecidos

| Bug | Severidade | Status |
|-----|------------|--------|
| Saldo diferente ao recarregar página | 🟢 Baixa | Corrigido com sync forçado |
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
