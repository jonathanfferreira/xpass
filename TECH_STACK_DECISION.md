# ⚔️ Tech Stack Decision: Firestore vs. PostgreSQL (Data Connect)

Você descobriu uma "arma secreta" do Firebase! O **Data Connect** com PostgreSQL é uma novidade poderosa. Para o Xpass, essa é uma decisão arquitetural crucial.

## 1. O que é o Firebase Data Connect?
É uma ponte que permite usar um banco de dados **SQL (PostgreSQL)** com a facilidade do Firebase (SDKs, Segurança, Real-time).
*   **Antes:** Você tinha que escolher entre "Fácil e Real-time" (Firestore) ou "Poderoso e Relacional" (SQL).
*   **Agora:** Você pode ter os dois.

## 2. Comparativo para o Xpass

| Critério | Firestore (Atual) | PostgreSQL (Data Connect) | Veredito para Xpass |
| :--- | :--- | :--- | :--- |
| **Modelo de Dados** | **NoSQL (Documentos)**. Flexível, mas difícil para relacionamentos complexos (ex: "Quantas vagas restam na aula X?"). | **Relacional (Tabelas)**. Perfeito para Agendamentos. `Reservas` ligam `Alunos` a `Aulas` com integridade total. | **PostgreSQL** vence em estrutura. |
| **Queries Complexas** | Difícil. Fazer filtros como "Aulas de Yoga E com Vagas E Preço < 50" exige índices complexos. | Fácil. SQL padrão: `SELECT * FROM classes WHERE type='Yoga' AND spots > 0`. | **PostgreSQL** vence em lógica (Yield Management). |
| **Custo & Setup** | **Serverless**. Paga por uso. Zero custo fixo. Setup instantâneo. | **Cloud SQL**. Geralmente exige uma instância rodando (custo fixo mensal), embora o Data Connect facilite o setup. | **Firestore** vence em custo inicial/MVP. |
| **Desenvolvimento** | Rápido para telas simples. Trabalhoso para garantir que dados não fiquem órfãos. | Exige definir Schema (GQL/SQL) antes. Mais rigoroso, mas evita bugs de dados no futuro. | Empate (Rapidez vs. Segurança). |

## 3. Análise Estratégica

### Por que mudar para PostgreSQL?
O Xpass é um sistema de **Agendamento e Transações**.
*   **Yield Management:** Calcular preços dinâmicos baseados em ocupação é matemática pura. SQL faz isso brincando.
*   **Rollover:** Somar créditos não usados e expirar antigos é muito mais seguro em um banco transacional.
*   **Relatórios:** O Admin vai querer saber "Qual a taxa de ocupação média das aulas de Pilates?". Em NoSQL isso é um pesadelo de calcular. Em SQL é uma linha de código.

### Por que ficar no Firestore?
*   **Velocidade Agora:** Já temos o app rodando em Firestore. Mudar agora exige reescrever a camada de dados.
*   **Custo Zero:** Para validar o MVP, não gastar nada com servidor é ótimo.

## 4. Recomendação do Gemini

Dado que estamos na fase de **"Visual Overhaul"** e **"Business Logic Refinement"**:

1.  **Se o objetivo é Lançar Rápido (MVP):** Mantenha **Firestore**. É suficiente para começar e validar se as pessoas querem o app.
2.  **Se o objetivo é Construir para Escalar (Unicórnio):** Mude para **PostgreSQL** agora. Vai doer um pouco mais hoje (reescrever schemas), mas evitará uma migração dolorosa daqui a 6 meses quando tivermos 10.000 reservas.

**Minha Sugestão:** Como você quer implementar **Yield Management** e **Rollover** (lógicas complexas), o **PostgreSQL** vai facilitar muito sua vida no backend. Se você topar o desafio de configurar o Data Connect, eu recomendo a mudança.
