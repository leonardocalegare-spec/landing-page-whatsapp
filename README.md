# Landing Page - Setup de Atendimento no WhatsApp

Landing page single-page em React + Vite, preparada para enviar leads para Google Sheets via Google Apps Script Web App usando uma rota server-side no Vercel.

## Requisitos

- Node.js 20+ recomendado
- npm 10+ recomendado
- uma conta Google com acesso ao Google Sheets e Google Apps Script

## Rodar localmente

```powershell
cd "C:\Users\Leonardo\Documents\landing-page-whatsapp"
npm install
npm run dev
```

Depois abra a URL local mostrada pelo Vite.

## Configuração de ambiente

A captação usa uma função serverless do Vercel em `/api/lead`. O frontend envia o lead para essa rota, e a função encaminha os dados para o Google Apps Script via server-to-server.

1. Copie o arquivo de exemplo:

```powershell
Copy-Item .env.example .env.local
```

2. Preencha a URL do Web App em `.env.local`:

```env
GOOGLE_APPS_SCRIPT_WEBHOOK_URL=https://script.google.com/macros/s/SEU_WEB_APP_ID/exec
```

## Arquitetura da captação

Fluxo em produção:

```text
Frontend -> /api/lead -> Google Apps Script /exec -> Google Sheets
```

Isso evita CORS no navegador porque o browser não fala mais diretamente com o Apps Script.

## Payload enviado pelo formulário

O formulário envia este objeto para `/api/lead`, e a função repassa o mesmo payload para o Apps Script:

- `name`
- `company`
- `whatsapp`
- `segment`
- `difficulty`
- `createdAt`
- `source`

## Integração com Google Sheets via Apps Script

O código completo do Apps Script está em `google-apps-script/Code.gs`.

Esse script:

- recebe `POST`
- lê o JSON enviado pela landing
- grava os dados na aba `Leads`
- cria a aba se ela não existir
- cria os cabeçalhos automaticamente se necessário
- retorna JSON de sucesso ou erro

### Como publicar o Apps Script como Web App

1. Crie uma nova planilha no Google Sheets
2. Copie o ID da planilha pela URL
3. Acesse https://script.google.com
4. Crie um novo projeto Apps Script
5. Cole o conteúdo de `google-apps-script/Code.gs` no arquivo principal
6. No script, substitua:

```javascript
const SPREADSHEET_ID = 'COLE_AQUI_O_ID_DA_PLANILHA'
```

pelo ID real da sua planilha

7. Salve o projeto
8. Clique em `Deploy` > `New deployment`
9. Em `Select type`, escolha `Web app`
10. Em `Execute as`, use `Me`
11. Em `Who has access`, use `Anyone`
12. Clique em `Deploy`
13. Autorize o script quando o Google pedir
14. Copie a URL final do Web App terminada em `/exec`

## Como colocar a URL no Vercel

No Vercel:

1. Abra o projeto
2. Vá em `Settings` > `Environment Variables`
3. Crie a variável:

```text
GOOGLE_APPS_SCRIPT_WEBHOOK_URL
```

4. Cole a URL `/exec` do Web App publicado
5. Salve
6. Faça um novo deploy

## Teste local com a API

Para testar a landing junto com a função `/api/lead`, use o ambiente local do Vercel:

```powershell
npx vercel dev
```

Depois abra a URL mostrada pelo Vercel Dev, preencha o formulário e confirme se uma nova linha foi criada na aba `Leads`.

Se você rodar apenas `npm run dev`, a interface abre normalmente, mas a rota serverless `/api/lead` não será servida por esse comando.

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

Este projeto continua sem precisar de `vercel.json` para o cenário atual.
A configuração padrão do Vercel atende bem um projeto Vite com função em `api/`.

Configuração esperada no Vercel:

- Framework Preset: `Vite`
- Build Command: `npm run build`
- Output Directory: `dist`

## Checklist antes de publicar

- `SPREADSHEET_ID` configurado no Apps Script
- Web App publicado com acesso `Anyone`
- `GOOGLE_APPS_SCRIPT_WEBHOOK_URL` configurada no Vercel
- `npm run build` executando sem erro
- formulário testado via `/api/lead`

## Arquivos importantes

- `src/config/leadCapture.js`: configuração central da captação
- `src/services/submitLead.js`: envio do lead para a rota `/api/lead`
- `src/components/LeadForm.jsx`: integração do formulário com a camada de envio
- `api/lead.js`: função serverless que encaminha o lead para o Apps Script
- `google-apps-script/Code.gs`: código do Web App que grava os leads no Google Sheets
