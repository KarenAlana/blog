🗂️ Acesso ao projeto: https://blog-kappa-five-32.vercel.app/

![111](https://github.com/user-attachments/assets/71824a16-52d8-49b9-819b-b1641a140ee3)

# Blog Dev

Blog com artigos de desenvolvimento e **Chat com IA** integrado. O projeto inclui um **frontend Next.js** e **dois backends alternativos** (Java/Spring Boot e Node.js/Express) para o conteúdo do blog, além das API Routes do Next.js para o assistente de IA.

---

## Tecnologias

| Parte      | Stack                                                    |
|-----------|-----------------------------------------------------------|
| **Frontend** | Next.js 16, React 19, TypeScript, Tailwind CSS            |
| **Backend blog** | Java 17 + Spring Boot 3 **ou** Node.js + Express (escolha um) |
| **Chat IA**   | Next.js API Routes, Groq SDK                             |
| **Banco**     | Supabase                                                 |

---

## Sobre o blog

O blog exibe posts de programação e desenvolvimento. O frontend em **Next.js** (React) consome uma API REST para listar e exibir os artigos. Os dados ficam no **Supabase** e são servidos por um dos backends disponíveis.

- Listagem de posts
- Página de post individual com tempo de leitura
- Upload de imagens e conteúdo gerenciado via API

---

## Chat com IA

O site inclui um **Chat AI** que funciona como assistente de programação. Ele responde apenas sobre temas de desenvolvimento: código, frameworks, linguagens, APIs, banco de dados, DevOps etc.

- **Frontend:** componente de chat (flutuante), responsivo (no mobile inicia minimizado; no desktop inicia aberto).
- **Backend da IA:** API Route do Next.js (`/api/chat`) que usa a **Groq** para gerar as respostas.
- Limite de tokens por usuário (por semana) para uso controlado do chat.

---

## Backends disponíveis

### Frontend + API do Chat — `front`

- **Função:** Páginas do blog, componente Chat AI e rota da IA.
- **Tecnologias:** Next.js 16, React 19, TypeScript, Tailwind CSS, Groq SDK.
- **Rota da IA:** `POST /api/chat`
- **Porta padrão:** `3000`

### Backend do blog — escolha um dos dois:

#### 1. Backend Java (Spring Boot) — `back-java`

- **Função:** API do blog (posts e upload).
- **Tecnologias:** Java 17, Spring Boot 3.2, Supabase, WebFlux, Validation, Lombok.
- **Rotas principais:** `GET/POST /api/posts`, `POST /api/upload`, `GET /health`.
- **Porta padrão:** `8080`.
- **Uso:** Configure `NEXT_PUBLIC_API_URL` com `http://localhost:8080` (ou a URL do backend Java).

#### 2. Backend Node.js (Express) — `back-node`

- **Função:** API do blog (posts e upload).
- **Tecnologias:** Node.js, Express, TypeScript, Supabase, Multer.
- **Rotas principais:** `GET/POST /api/posts`, `POST /api/upload`.
- **Porta padrão:** `3001`.
- **Uso:** Configure `NEXT_PUBLIC_API_URL` com `http://localhost:3001` (ou a URL do backend Node).

---

## Como rodar

1. **Backend do blog** — escolha **Java** ou **Node.js**:

   **Opção A — Java (back-java)**
   - Entre em `back-java`, configure `application.properties` ou variáveis de ambiente com as credenciais do Supabase.
   - `./mvnw spring-boot:run` (ou use sua IDE).
   - Sobe na porta `8080`.

   **Opção B — Node.js (back-node)**
   - Entre em `back-node`, configure `.env` com as variáveis do Supabase.
   - `npm install` e `npm run dev`.
   - Sobe na porta `3001`.

2. **Frontend + API do Chat (front)**
   - Entre em `front`, configure `.env.local` com:
     - `NEXT_PUBLIC_API_URL` = `http://localhost:8080` (Java) ou `http://localhost:3001` (Node)
     - `GROQ_API_KEY` = sua chave Groq
   - `npm install` e `npm run dev`.
   - Sobe na porta `3000`.

3. Acesse `http://localhost:3000`: você verá o blog e o Chat AI.

---

## Estrutura do repositório

- **`front/`** — Next.js (páginas do blog + Chat AI + rota `/api/chat`).
- **`back-java/`** — Java + Spring Boot (API de posts e upload, integração com Supabase).
- **`back-node/`** — Node.js + Express (API de posts e upload, integração com Supabase).



