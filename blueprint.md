# XPASS - Blueprint do Projeto

## Visão Geral
O XPASS é uma plataforma de fitness multilateral que conecta alunos a estúdios por meio de um sistema de créditos flexível. O sistema é composto por:
1.  **App Aluno (`xpass-app-aluno`)**: Para agendar aulas, gerenciar créditos, engajamento social (Squads/Desafios) e coaching de Bem-Estar com IA.
2.  **App Parceiro (`xpass-app-parceiro`)**: Para estúdios gerenciarem aulas, validarem check-ins, visualizarem o financeiro (`FinancialDashboard`) e gerenciarem configurações de perfil.
3.  **Landing Page (`xpass-landing`)**: Site público de marketing.
4.  **Backend (Firebase)**: Firestore, Cloud Functions (Agendamento, Pagamentos, Notificações), Hosting.

## Stack Tecnológico
-   **Frontend**: React (Vite), Tailwind CSS (Cores da Marca: Laranja Neon `brand-500`, Escuro `onyx-950`), Lucide Icons, Framer Motion (animações básicas), Recharts.
-   **Backend**: Firebase (Auth, Firestore, Functions, Hosting).
-   **Integrações**: Stripe (Pagamentos), Google Gemini (AI Coach).

## Funcionalidades Implementadas

### App Aluno
-   **Sistema de Agendamento V2**: Seleção de horário, suporte a "Só Vai" (Check-in sem agendamento prévio).
-   **Social (Estilo Gymrats)**:
    -   **Squads (`GroupsView`)**: Criar/Entrar em grupos, ver detalhes.
    -   **Desafios (`ChallengesView`)**: Prazos, lista de participantes, criação exclusiva PRO.
-   **XPASS PRO**: Modal de assinatura, integração Stripe, recursos exclusivos (AI Coach, Criar Desafio).
-   **Carteira**: Compra de créditos, Histórico de Transações.
-   **AI Coach**: Planos de treino/dieta personalizados (Gemini).

### App Parceiro
-   **Dashboard**: Métricas financeiras (Receita, Check-ins) com gráficos.
-   **Gestão de Aulas**: Criar/Editar aulas, Ver agendamentos.
-   **Scanner QR**: Validar códigos de acesso dos alunos.
-   **Configurações (`PartnerSettings`)**: Gerenciar Perfil, Horário de Funcionamento e modo de "Check-in Direto".

## Mudanças da Sessão Atual (Dez 2025)
-   Implementado **Seleção de Horário** no fluxo de agendamento do App Aluno.
-   Implementado fluxo **"Só Vai / Check-in"** para estúdios com `requiresBooking: false`.
-   Lançado **Social V2**: `GroupsView` (Squads) e aprimoramento do `ChallengesView` com prazos e participantes.
-   Habilitado **Edição de Perfil do Parceiro**: Parceiros agora podem atualizar suas próprias informações e alternar o modo de agendamento.
-   Polimento da **UI do App Parceiro**: Modo escuro premium, glassmorphism, branding consistente.

## Próximos Passos
-   **Persistência de Dados**: Verificar persistência de favoritos/edições de perfil.
-   **Rankings**: Implementar lógica completa de ranking para Desafios.
-   **Chat**: Implementar chat dentro dos Squads.
-   **Sistema de Notificações**: Aprimorar notificações in-app.
