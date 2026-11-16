# Dr. Bike — Oficina & Loja

Landing page + loja online + marcação de assistência para oficina de bicicletas, motos elétricas, baterias e cadeiras de rodas.

Stack: Vite · React 19 · React Router · Tailwind CSS 4 · Firebase (Auth, Firestore, Storage) · Lucide icons.

## Correr localmente

```bash
npm install
npm run dev
```

Sem `.env` o site corre em **modo demo**: produtos de exemplo em memória, login simulado (qualquer email entra; um email que comece por `admin` abre o painel). Nada é persistido.

## Ligar ao Firebase

1. Cria um projecto em https://console.firebase.google.com
2. Activa **Authentication** → métodos *Email/Password* e *Google*.
3. Activa **Firestore** (modo produção). Não é preciso Storage: as fotos ficam no Firestore, comprimidas (plano gratuito).
4. Em *Definições do projecto → As tuas apps → Web*, copia a config.
5. `copy .env.example .env` e preenche as variáveis `VITE_FIREBASE_*`.
6. Em `VITE_ADMIN_EMAILS` põe o email do dono (separa vários por vírgula). Esse email entra como admin.
   Para tornar o acesso permanente nas regras, no Firestore edita `users/{uid}` e põe `role: "admin"`.
7. Publica as regras e índices:

```bash
npm i -g firebase-tools
firebase login
firebase use --add            # escolhe o projecto
firebase deploy --only firestore
```

8. No painel de admin → Produtos → **Carregar exemplos** para semear a loja (opcional).

## Publicar o site

```bash
npm run build
firebase deploy --only hosting
```

(ou arrasta a pasta `dist/` para Netlify / Vercel — é um site estático.)

## Onde mudar as coisas

| O quê | Onde |
|---|---|
| Nome, WhatsApp, telefone, morada, horário, moeda, redes | `src/config/site.js` |
| Categorias da loja e lista de serviços/preços | `src/config/site.js` |
| Cores, fontes, botões, inputs | `src/index.css` (tokens em `@theme`) |
| Produtos de exemplo | `src/data/seed.js` |
| Regras de segurança | `firestore.rules` |

## Estrutura

```
src/
  config/site.js        dados do negócio, categorias, serviços
  lib/firebase.js       init Firebase (ou modo demo)
  lib/db.js             acesso a dados (produtos, comentários, encomendas, marcações)
  context/              Auth, Carrinho, Toasts
  components/           Navbar, Footer, ProductCard, ImageSlot, ...
  pages/                Home, Loja, Produto, Marcacao, Checkout, Login, Conta, ...
  pages/admin/          Painel: resumo, produtos, encomendas, marcações
```

## Fluxos

- **Encomenda**: carrinho → checkout (com ou sem conta) → guarda em `orders` → botão para confirmar por WhatsApp com o resumo.
- **Marcação**: formulário → guarda em `appointments` → botão para enviar por WhatsApp. Também há atalho "só WhatsApp".
- **Comentários**: só utilizadores autenticados; o autor ou o admin podem apagar.
- **Admin**: `/admin` — CRUD de produtos com fotos, gestão de estados de encomendas e marcações.
- **Fotos**: sem Firebase Storage. Cada foto é comprimida no browser em duas versões: miniatura (480 px) guardada no documento do produto, e versão grande (1100 px) guardada em `images/{id}` e carregada só na página do produto. Máximo 5 fotos por produto.
