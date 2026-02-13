import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.GROQ_API_KEY?.trim();

    if (!apiKey) {
      console.error("GROQ_API_KEY não encontrada nas variáveis de ambiente");
      return NextResponse.json(
        { error: "API key não configurada. Verifique o arquivo .env.local e reinicie o servidor" },
        { status: 500 }
      );
    }

    // Log apenas em desenvolvimento
    if (process.env.NODE_ENV === "development") {
      console.log("API Key carregada:", apiKey.substring(0, 10) + "...");
    }

    // Validar formato da chave
    if (!apiKey.startsWith("gsk_") && !apiKey.startsWith("sgsk_")) {
      return NextResponse.json(
        { error: "Formato de chave da API inválido. A chave deve começar com 'gsk_' ou 'sgsk_'" },
        { status: 400 }
      );
    }

    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Mensagens inválidas" },
        { status: 400 }
      );
    }

    const groq = new Groq({
      apiKey: apiKey,
    });

    // Prompt do sistema que força apenas programação
    const systemPrompt = `Você é um assistente especializado exclusivamente em programação e desenvolvimento de software. 

IMPORTANTE: Você DEVE responder APENAS sobre programação, código, desenvolvimento, frameworks, linguagens de programação, algoritmos, estruturas de dados, APIs, tecnologias web, banco de dados, DevOps, e tópicos relacionados.

Quando o usuário enviar mensagens que NÃO são sobre programação:
- Responda educadamente informando que você é especializado apenas em programação
- Sugira que o usuário faça perguntas sobre código, desenvolvimento ou tecnologia
- Mantenha um tom amigável e profissional
- NÃO responda o conteúdo da pergunta não relacionada a programação

Quando o usuário enviar mensagens sobre programação:
- Responda de forma completa e útil
- Forneça exemplos de código quando apropriado
- Explicar conceitos técnicos de forma clara
- Sugira boas práticas e padrões de código
- Seja detalhado e preciso

Lembre-se: Você é um assistente de programação. Sempre redirecione conversas não relacionadas a programação de forma educada, mas firme.`;

    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        ...messages,
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 2000,
    });

    const assistantMessage = completion.choices[0]?.message?.content || "Erro ao obter resposta";
    const usage = completion.usage;

    return NextResponse.json({
      message: assistantMessage,
      usage: {
        prompt_tokens: usage?.prompt_tokens || 0,
        completion_tokens: usage?.completion_tokens || 0,
        total_tokens: usage?.total_tokens || 0,
      },
    });
  } catch (error: any) {
    console.error("Erro na API do chat:", error);
    console.error("Tipo do erro:", typeof error);
    console.error("Propriedades do erro:", Object.keys(error || {}));
    
    // Tratamento para erro de API key inválida
    // O Groq SDK pode retornar erros em diferentes formatos
    let errorMessage = "";
    let errorCode = "";
    let errorStatus = 500;
    
    // Verificar status diretamente primeiro
    if (error?.status === 401) {
      errorStatus = 401;
    }
    
    // Tentar extrair informações do erro em diferentes formatos
    if (error?.error) {
      // Formato: error.error (objeto aninhado)
      if (error.error.error) {
        // Formato: error.error.error
        errorMessage = error.error.error.message || "";
        errorCode = error.error.error.code || "";
      } else {
        // Formato: error.error
        errorMessage = error.error.message || "";
        errorCode = error.error.code || "";
      }
      if (!errorStatus || errorStatus === 500) {
        errorStatus = error.status || error.error.status || 401;
      }
    } else if (error?.message) {
      // Formato: error.message (pode conter JSON como string)
      const msg = error.message;
      
      // Tentar fazer parse se contém JSON
      if (msg.includes("{") && msg.includes("error")) {
        try {
          const jsonMatch = msg.match(/\{.*\}/);
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            if (parsed.error) {
              errorMessage = parsed.error.message || "";
              errorCode = parsed.error.code || "";
            }
          }
        } catch (e) {
          // Se falhar o parse, usar a mensagem original
          errorMessage = msg;
        }
      } else {
        errorMessage = msg;
      }
      
      errorCode = error.code || "";
      if (!errorStatus || errorStatus === 500) {
        errorStatus = error.status || error.statusCode || 500;
      }
    }
    
    // Verificar se é erro de API key inválida
    const isInvalidKey = 
      errorStatus === 401 || 
      errorCode === "invalid_api_key" || 
      errorMessage.toLowerCase().includes("invalid api key") ||
      errorMessage.toLowerCase().includes("api key") ||
      (error?.status === 401);
    
    if (isInvalidKey) {
      console.error("ERRO DE API KEY DETECTADO:", {
        status: errorStatus,
        code: errorCode,
        message: errorMessage,
        errorObject: error
      });
      
      return NextResponse.json(
        { 
          error: "❌ Chave da API inválida ou expirada!\n\nSoluções:\n1. Verifique se a chave está correta no arquivo .env.local\n2. Certifique-se de que não há espaços extras\n3. REINICIE o servidor completamente\n4. Se o problema persistir, gere uma nova chave em https://console.groq.com/"
        },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { 
        error: errorMessage || "Erro ao processar a mensagem"
      },
      { status: errorStatus || 500 }
    );
  }
}
