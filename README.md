🗂️ Acesso ao projeto: https://blog-kappa-five-32.vercel.app/

![111](https://github.com/user-attachments/assets/71824a16-52d8-49b9-819b-b1641a140ee3)

# Blog Dev

Blog com artigos de desenvolvimento e **Chat com IA** integrado. O projeto usa **dois backends**: um para o conteúdo do blog e outro para o assistente de programação.

---

## Sobre o blog

O blog exibe posts de programação e desenvolvimento. O frontend é feito em **Next.js** (React) e consome uma API REST para listar e exibir os artigos. Os dados dos posts ficam no **Supabase** e são servidos pelo backend Node.js (Express).

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

## Dois backends

O projeto utiliza **dois backends** com funções diferentes:

### 1. Backend Node.js (Express) — `back-node`

- **Função:** API do blog (posts e upload).
- **Tecnologias:** Express, Supabase, Multer.
- **Rotas principais:** `/api/posts`, `/api/upload`.
- **Porta padrão:** `3001`.
- **Uso:** O front chama esse backend via `NEXT_PUBLIC_API_URL` (ex.: `http://localhost:3001`) para listar posts, buscar um post por id e enviar uploads.

### 2. Backend Next.js (API Routes) — `front`

- **Função:** Servir o front e a **API do Chat com IA**.
- **Tecnologias:** Next.js (API Routes), Groq SDK.
- **Rota da IA:** `POST /api/chat` (recebe mensagens e devolve resposta da Groq).
- **Porta padrão:** `3000`.
- **Uso:** O componente de Chat AI no front chama `/api/chat` no mesmo domínio do Next.js; a API usa a chave `GROQ_API_KEY` para falar com a Groq.

Em resumo: **back-node** = blog e conteúdo; **Next.js API** = chat com IA.

---

## Como rodar

1. **Backend do blog (back-node)**
   - Entre em `back-node`, configure `.env` com as variáveis do Supabase (e outras que o projeto usar).
   - `npm install` e `npm run dev` (sobe na porta 3001).

2. **Frontend + API do Chat (front)**
   - Entre em `front`, configure `.env.local` com `NEXT_PUBLIC_API_URL=http://localhost:3001` e `GROQ_API_KEY=sua_chave_groq`.
   - `npm install` e `npm run dev` (sobe na porta 3000).

3. Acesse `http://localhost:3000`: você verá o blog e o Chat AI (no desktop o chat abre ao carregar; no mobile ele inicia minimizado).

---

## Estrutura do repositório

- **`front/`** — Next.js (páginas do blog + componente Chat AI + rota `/api/chat`).
- **`back-node/`** — Express (API de posts e upload, integração com Supabase).



