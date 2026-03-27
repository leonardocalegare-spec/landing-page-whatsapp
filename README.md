# Landing Page - Setup de Atendimento no WhatsApp

Landing page single-page em React + Vite, pronta para deploy estático no Vercel.

## Requisitos

- Node.js 20+ recomendado
- npm 10+ recomendado

## Rodar localmente

```powershell
cd "C:\Users\Leonardo\Documents\landing-page-whatsapp"
npm install
npm run dev
```

Depois abra a URL local mostrada pelo Vite.

## Configuração de ambiente

A captação usa variável de ambiente no frontend via `import.meta.env`.

1. Copie o arquivo de exemplo:

```powershell
Copy-Item .env.example .env.local
```

2. Preencha o endpoint do webhook em `.env.local`:

```env
VITE_LEAD_WEBHOOK_URL=https://seu-endpoint-aqui.com/webhook
```

## Como a captação funciona

- O formulário monta um payload com `name`, `company`, `whatsapp`, `segment`, `difficulty`, `createdAt` e `source`
- O envio é feito por `fetch` `POST` para o endpoint configurado em `VITE_LEAD_WEBHOOK_URL`
- Se o endpoint não estiver configurado, o formulário mostra uma mensagem amigável informando que a captação ainda não está conectada
- O fallback local existe de forma controlada em `src/config/leadCapture.js`, mas vem desativado por padrão para produção

## Build de produção

```powershell
npm run build
```

O build final será gerado na pasta `dist`.

## Preview local do build

```powershell
npm run preview
```

## Publicar no Vercel

Este projeto não precisa de `vercel.json` para o cenário atual.
A configuração padrão do Vercel já atende bem um projeto Vite estático como este.

Passos:

1. Suba o projeto para um repositório Git
2. Importe o repositório no Vercel
3. No projeto do Vercel, configure a variável de ambiente:

```text
VITE_LEAD_WEBHOOK_URL
```

4. Use o valor real do seu webhook
5. Faça o deploy

Configuração esperada no Vercel:

- Framework Preset: `Vite`
- Build Command: `npm run build`
- Output Directory: `dist`

## Checklist antes de publicar

- `VITE_LEAD_WEBHOOK_URL` configurada no Vercel
- webhook aceitando `POST` com JSON
- `npm run build` executando sem erro
- formulário testado com endpoint real ou ambiente de teste

## Arquivos importantes

- `src/config/leadCapture.js`: configuração central da captação
- `src/services/submitLead.js`: envio do lead e montagem do payload
- `src/components/LeadForm.jsx`: integração do formulário com a camada de envio
# landing-page-whatsapp
