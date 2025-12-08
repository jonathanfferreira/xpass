# 🏗️ Arquitetura Técnica: Fase 8 e Além

Este documento detalha a lógica e os desafios técnicos das próximas funcionalidades do XPASS. Use-o para estudar o fluxo de dados antes da implementação.

---

## 1. Assinaturas & Recorrência (The Money Maker) 💸

Diferente da compra de créditos avulsos (que fizemos hoje), a assinatura exige um "contrato" de cobrança automática.

### O Fluxo no Asaas:
1.  **Tokenização do Cartão:** O App nunca toca no número do cartão. Enviamos os dados para o Asaas, que nos devolve um `creditCardToken`.
2.  **Criação da Assinatura:** No backend, criamos uma `Subscription` vinculada ao cliente, definindo valor e ciclo (mensal).
3.  **Ciclo de Vida (Webhooks):**
    *   `PAYMENT_CONFIRMED`: Todo mês, quando o pagamento passa, o webhook avisa.
    *   **Ação:** Nossa Cloud Function renova os créditos do usuário (ex: +100 créditos) e zera os não utilizados (se o modelo não for cumulativo).
    *   `PAYMENT_OVERDUE`: Se o cartão falhar.
    *   **Ação:** O app bloqueia o check-in e mostra um aviso "Atualize seu pagamento".

### Desafio Técnico:
*   **Sincronia:** Garantir que o usuário receba os créditos *exatamente* no dia da renovação.
*   **Falhas:** Lidar com cartões expirados sem perder o aluno (Régua de Cobrança).

---

## 2. Sistema de Agendamento (Booking) 📅

Aqui o XPASS deixa de ser apenas uma "carteira" e vira uma "agenda".

### Modelagem de Dados (Firestore):
Precisamos de 3 novas coleções:
1.  `classes` (Aulas):
    *   `partnerId`: Quem oferece.
    *   `name`: "Yoga Matinal".
    *   `capacity`: 15 vagas.
    *   `startTime`: Timestamp.
2.  `bookings` (Reservas):
    *   `userId`: Quem reservou.
    *   `classId`: Qual aula.
    *   `status`: `CONFIRMED` | `CANCELED`.

### O Problema da Concorrência (Race Condition):
Imagine que falta 1 vaga e 2 usuários clicam em "Reservar" no mesmo milissegundo.
*   **Solução:** Usar **Firestore Transactions**.
*   A transação lê o número de vagas disponíveis, subtrai 1 e grava a reserva. Se o número mudou durante a leitura, a transação falha e tenta de novo. Isso garante que nunca venderemos mais vagas do que existem.

---

## 3. Estratégia Mobile: Indo para as Lojas (App Store & Play Store) 📲

Para publicar nas lojas, transformaremos nosso PWA em um App Nativo usando **Capacitor**.

### Por que Capacitor?
Ele permite manter nosso código React (Vite) e "embrulhá-lo" em um container nativo.
*   **Android:** Gera um projeto Android Studio.
*   **iOS:** Gera um projeto Xcode.

### O que muda no código?
1.  **Plugins Nativos:**
    *   Substituiremos `navigator.geolocation` pelo plugin `@capacitor/geolocation` (mais preciso e funciona em background).
    *   Substituiremos a câmera web pelo `@capacitor/camera` (mais rápido).
    *   Adicionaremos `@capacitor/push-notifications` para notificações reais (que aparecem na tela bloqueada).
2.  **Build Process:**
    *   Rodamos `npm run build`.
    *   Rodamos `npx cap sync` (copia o build para as pastas nativas).
    *   Compilamos o binário (.apk / .ipa) nas ferramentas nativas.

### Requisitos Extras (Apple):
*   A Apple exige que o app pareça nativo. Nosso design já é bom, mas precisaremos cuidar de detalhes como:
    *   Gestos de "voltar" (swipe back).
    *   Áreas seguras (notch do iPhone).
    *   Login com Apple (Obrigatório se tiver Login com Google).

---

## 4. Perfil Social & Gamificação 2.0 🏆

*   **Histórico:** Uma coleção `checkins` que alimenta um calendário visual (tipo GitHub contributions).
*   **Ranking:** Uma Cloud Function agendada (Cron Job) que roda todo domingo à noite, calcula quem treinou mais e atualiza o "Ranking da Semana".

---

## 5. Segurança & Regras (The Shield) 🛡️

Para produção, não podemos confiar apenas no Frontend. Precisamos configurar o `firestore.rules`.

### Regras Críticas:
1.  **Saldo Intocável:**
    *   `allow update: if false;` para o campo `credits`.
    *   Apenas o Backend (Cloud Functions) pode alterar o saldo. O usuário só pode *ler* seu saldo.
2.  **Dados Privados:**
    *   Usuário A não pode ler o perfil completo do Usuário B (apenas nome e foto pública).
    *   `allow read: if request.auth.uid == userId;`
3.  **Parceiros:**
    *   Apenas usuários com `role: 'partner'` podem escrever na coleção `classes` (criar aulas).

---

## 6. Landing Page: Vitrine Aberta (Public Data) 🌍

Para mostrar as academias na Landing Page sem login, precisamos expor dados do Firestore publicamente, mas com segurança.

### Estratégia:
1.  **Cloud Function (API):** Criar um endpoint `getPublicPartners` que retorna apenas dados não-sensíveis (Nome, Foto, Bairro, Modalidades).
    *   *Nunca* retornar dados financeiros ou contatos privados do parceiro.
2.  **Frontend (Landing):** Consumir essa API e renderizar um carrossel ou mapa simples.
3.  **Performance:** Usar cache na Cloud Function para não ler o banco a cada acesso (economizar dinheiro).

---

## 7. Operação do Parceiro (Supply Side) 🏢

O App do Parceiro precisa evoluir de um simples "Scanner" para um "Gestor".

### Novas Funcionalidades:
1.  **Gestão de Grade:** Interface para criar aulas recorrentes (ex: "Toda Seg e Qua às 19h").
2.  **Lista de Presença:** Ver quem reservou a aula antes dela começar.
3.  **Extrato Financeiro:**
    *   "Quanto ganhei hoje?"
    *   "Previsão de repasse do XPASS".
    *   Isso exige uma coleção `payouts` no banco de dados.
4.  **Versão Web (Desktop):** O `xpass-app-parceiro` já é React. Basta criar um layout responsivo que aproveite telas grandes (Sidebar lateral, tabelas densas) para uso na recepção.

---

## 8. Admin & Financeiro (The Control Tower) 📊

O "God Mode" atual é para ver usuários. O Admin real precisa gerir o negócio.

### Dashboards Necessários:
1.  **MRR (Monthly Recurring Revenue):** Quanto estamos faturando com assinaturas.
2.  **Churn Rate:** Quantos alunos cancelaram esse mês.
3.  **Repasses:** Um botão "Gerar Folha de Pagamento" que calcula quanto devemos para cada academia baseada nos check-ins validados.
    *   Integração com Asaas Split ou geração de arquivo CNAB para pagamentos em massa.
4.  **Ferramentas de Suporte:**
    *   Busca rápida de transações por CPF/Email.
    *   Botão de "Estorno" (Refund) integrado à API do Asaas.

---

## 9. VISION 2026: Fronteiras da Inovação (Tech Stack do Futuro) 🔮

Para ser líder de mercado em 2026, o XPASS precisa ir além do transacional.

### 9.1. AI Concierge (Vertex AI / OpenAI) 🧠
Transformar o app de passivo para ativo.
*   **Smart Recommendations:** Usar Machine Learning (Vector Search no Firestore) para recomendar academias baseadas no perfil de gosto do usuário, não apenas localização.
*   **O "Copiloto Fitness":** Um chat integrado onde o usuário diz "Estou com dor nas costas" e o app sugere "Agendei uma aula de Yoga Restaurativa para você amanhã".

### 9.2. Wearables & HealthKit ⌚
Fechar o ciclo de dados de saúde.
*   **Plugin:** `@capacitor-community/apple-healthkit` e `google-fit`.
*   **Fluxo:** O usuário termina o treino -> App lê as calorias/batimentos do relógio -> Salva no histórico do XPASS.
*   **Benefício:** O usuário centraliza a saúde dele no XPASS.

### 9.3. Social Graph (O Efeito Strava) 🕸️
*   **Seguir Amigos:** Ver onde eles treinam estimula a ida.
*   **Feed de Atividades:** "Pedro completou 50 aulas este ano!".
*   **Arquitetura:** Modelagem de dados complexa (Grafos) ou uso de feeds desnormalizados no Firestore para escala.

### 9.4. Corporate (B2B2C) 💼
A chave para a escala massiva.
*   **Portal do RH:** Um novo app (`xpass-corporate`) para gestores de RH.
*   **Faturamento Consolidado:** A empresa paga uma fatura única por 1000 funcionários.
*   **SSO (Single Sign-On):** Login com Microsoft/Google Workspace da empresa.

---

## 10. MOONSHOTS: Inovações Radicais (R&D) 🚀

Ideias para diferenciar o XPASS de qualquer concorrente global.

### 10.1. AI Vision (Pose Correction) 👁️
O App usa a câmera do celular para corrigir a postura do aluno em tempo real.
*   **Tech:** MediaPipe / TensorFlow.js (Edge AI).
*   **Uso:** Aluno apoia o celular, faz um agachamento, e o app desenha o esqueleto sobre o vídeo alertando "Coluna curvada!".

### 10.2. Check-in Invisível (Zero-Click) 👻
Eliminar o QR Code. O aluno entra e a catraca libera.
*   **Tech:** Bluetooth Low Energy (Beacons) ou NFC.
*   **Fluxo:** O App detecta o Beacon da academia ao se aproximar e faz o check-in em background via Cloud Function.

### 10.3. AI Nutritionist (Snap & Track) 🥗
*   **Computer Vision:** Usuário tira foto do prato.
*   **LLM Analysis:** A IA identifica os alimentos, estima porções e calcula calorias/macros.
*   **Marketplace:** Sugere suplementos baseados na dieta e vende direto pelo app (Revenue Share com marcas).

---

## 11. BUSINESS LOGIC: O Modelo "Shark Tank" 🦈

Para o negócio parar de pé financeiramente, precisamos refinar a lógica de Auth e Precificação.

### 11.1. Autenticação Universal & Corporativa 🔐
Não podemos depender só do Google.
*   **Microsoft Entra ID (Azure AD):** Crucial para vender planos corporativos (B2B). O funcionário loga com o email da empresa.
*   **Email & Senha:** O fallback universal para quem não usa redes sociais.
*   **Implementação:** Habilitar novos Providers no Firebase Auth e criar telas de "Esqueci minha senha".

### 11.2. Precificação Dinâmica (Credit Tiers) 💰
R$ 20 é caro para musculação de bairro e barato para CrossFit. A solução é cobrar em **Créditos**, não em Reais.
*   **A Moeda XPASS:** 1 Crédito = R$ 10 (exemplo).
*   **Tabela de Preços (Dynamic Pricing):**
    *   Academia de Bairro: Custa **1 Crédito** (R$ 10).
    *   Academia Premium: Custa **2 Créditos** (R$ 20).
    *   Studio de Pilates/CrossFit: Custa **4 Créditos** (R$ 40).
*   **Margem (Spread):**
    *   Aluno paga R$ 40 (4 créditos).
    *   Nós pagamos R$ 25 ao parceiro.
    *   **Lucro:** R$ 15 por aula.

---

## 12. ANTI-FRAUDE & RISCO (Blindando o Caixa) 🚨

Onde tem dinheiro, tem gente tentando burlar. Precisamos nos proteger.

### 12.1. O "Check-in Fantasma" 👻
Risco: Dono de academia cria contas falsas para gerar receita indevida.
*   **Solução:** Anomaly Detection.
*   **Regra:** Se uma academia tiver um pico de check-ins de usuários novos sem histórico, ou check-ins muito rápidos (10 em 1 minuto), o sistema bloqueia o repasse e alerta o Admin.

### 12.2. Compartilhamento de Conta (Account Sharing) 🤝
Risco: Um aluno paga, cinco treinam usando print do QR Code.
*   **Solução:** QR Code Dinâmico (TOTP).
*   **Tech:** O QR Code na tela do aluno muda a cada 15 segundos (igual token de banco). Se ele mandar print, o código expira antes do amigo chegar na catraca.

### 12.3. GPS Spoofing 📍
Risco: Simular localização para fazer check-in à distância.
*   **Solução:** Validação Cruzada.
*   **Tech:** Cruzar dados de GPS com Wi-Fi e Rede Celular. Se o GPS diz "Academia" mas o IP diz "Residencial", bloqueia.

---

## 13. LEGAL & COMPLIANCE (O Alicerce Jurídico) ⚖️

Para evitar processos e garantir o Valuation, o app precisa de blindagem jurídica.

### 13.1. Gestão de Consentimento (LGPD) 📜
*   **Versionamento de Termos:** Não basta um checkbox. Precisamos salvar *qual versão* o usuário aceitou.
*   **Fluxo:** Se atualizarmos os Termos de Uso (v1.0 -> v1.1), o app deve bloquear o acesso até o usuário aceitar a nova versão (Force Acceptance).

### 13.2. Responsabilidade Civil (Liability Waiver) 🚑
*   **Parceiros:** O contrato digital deve isentar o XPASS de acidentes dentro da academia.
*   **Alunos:** Para atividades de alto risco (Lutas, CrossFit), exigir um "Termo de Aptidão Física" (PAR-Q) digital antes da primeira aula.

### 13.3. Contratos de Exclusividade (Lock-in) 🔒
*   **Lógica de Negócio:** Criar níveis de parceiros no banco de dados (`partnerTier`).
    *   `EXCLUSIVE`: Taxa de 10%. Ganha destaque na Home.
    *   `STANDARD`: Taxa de 20%. Sem destaque.
*   Isso incentiva a academia a ser fiel ao XPASS sem forçar a barra.

---

## 14. DATA INTELLIGENCE & VISUALIZAÇÃO 📊

Transformar dados em decisões. Não queremos apenas tabelas, queremos *Insights*.

### 14.1. Tech Stack (Frontend) 🎨
*   **Biblioteca:** `Recharts` ou `Nivo` (React). São leves, bonitas e responsivas.
*   **Performance:** Não ler o banco todo a cada render. Usar dados agregados.

### 14.2. Dashboards por Persona 👥

#### A. Parceiro (Gestão Inteligente)
*   **Gráfico de Ocupação:** "Sua aula de Terça 19h está sempre 100% cheia. Abra uma às 20h!"
*   **Receita por Modalidade:** "O Jiu-Jitsu rende 3x mais que o Muay Thai."
*   **Retenção:** "Alunos novos vs. Recorrentes".

#### B. Admin (Raio-X do Negócio)
*   **Heatmap Geográfico:** Mapa de calor de onde os alunos estão abrindo o app vs. onde temos academias. (Ajuda a saber onde caçar novos parceiros).
*   **Funil de Conversão:** Visitantes -> Cadastro -> Compra -> Check-in.

#### C. Aluno (Quantified Self)
*   **Radar Chart:** "Equilíbrio do Atleta" (Força, Cardio, Flexibilidade).
*   **Streak:** Gráfico de barras de frequência semanal.

### 14.3. Arquitetura de Dados (Aggregation) 🏗️
*   **Problema:** Ler 10.000 check-ins para gerar um gráfico custa caro no Firestore.
*   **Solução:** Cloud Functions (Triggers).
    *   Toda vez que um check-in acontece, a função atualiza um documento `stats_daily_2025_12_03`: `{ totalCheckins: +1, revenue: +20 }`.
    *   O gráfico lê apenas esse documento de estatística (1 leitura vs 10.000).

---

## 15. ESTRATÉGIA DE ESCALA (Firestore vs. SQL) ⚖️

O Firestore é excelente para o App (Operacional), mas pode ficar caro para Analytics complexo.

### 15.1. O Modelo Híbrido (Best of Both Worlds)
*   **Firestore (OLTP):** Usado pelo App. Rápido, Offline-first, Realtime.
*   **BigQuery (OLAP):** Usado pelo Painel Admin e BI.
    *   **Sync:** Usamos a extensão oficial "Stream Firestore to BigQuery".
    *   **Vantagem:** No BigQuery, podemos rodar SQL complexo (`SELECT * FROM users WHERE ...`) para gerar relatórios pesados sem travar o app e pagando centavos.

### 15.2. Busca Textual (Search Engine) 🔍
O Firestore não faz busca por "parte do nome" (fuzzy search) nativamente.
*   **Solução:** Integrar **Algolia** ou **Typesense**.
*   **Fluxo:** Cloud Function replica dados de parceiros (`partners`) para o Algolia -> O App busca no Algolia -> O App lê os detalhes no Firestore.

---

## 16. QUALITY & GLOBAL READINESS (O Padrão Mundial) 🌍

Para escalar sem quebrar e sem fronteiras.

### 16.1. Testes Automatizados (QA) 🤖
Não podemos depender de testes manuais.
*   **E2E (End-to-End):** Usar **Cypress** ou **Playwright**. O robô abre o app, faz login, compra crédito e agenda aula. Se falhar, o deploy é cancelado.
*   **Unit Tests:** Usar **Vitest** para testar as regras de negócio (cálculo de preço, validação de CPF) isoladamente.

### 16.2. Internacionalização (i18n) 🇺🇸🇪🇸
O XPASS nasce no Brasil, mas mira o mundo.
*   **Tech:** `i18next`.
*   **Estrutura:** Nunca escrever texto "hardcoded" (`<p>Olá</p>`). Usar chaves (`<p>{t('hello')}</p>`).
*   **Moedas:** O app deve suportar R$ (BRL), U$ (USD) e € (EUR) dependendo do país da academia.

### 16.3. Suporte & FAQ Inteligente 🆘
*   **Self-Service:** Uma coleção `faq` no Firestore alimentada pelo Admin.
*   **Chat:** Integração com ferramentas de mercado (Intercom/Zendesk) ou chat próprio no Admin para falar com alunos em tempo real.

---

# 🏁 CONCLUSÃO

Este documento representa a arquitetura de um **Unicórnio**.
Temos a base (MVP), a estratégia de crescimento (Booking/Revenue), a inteligência (Data/AI) e a segurança (Legal/Anti-Fraude).

**Próximo Passo:** Executar a FASE 8 (Booking Engine). 🚀
