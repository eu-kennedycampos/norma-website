# norma-website

O site institucional da **Norma Tecnologia**: sistemas sob medida para empresas e indústrias, e as páginas dos
produtos prontos (Norma Ponto e Norma Assinatura).

Estático, rápido e sem framework no navegador: [Astro](https://astro.build) gera HTML puro, com um punhado de
TypeScript só para animação ao rolar, menu do celular, formulário e medição de anúncios. Sem JavaScript, o site
continua inteiro.

## Rodar

```sh
pnpm install
cp .env.example .env    # preencha o que já tiver
pnpm dev                # http://localhost:4321
pnpm build              # checa tipos e gera dist/
pnpm preview            # serve o dist/ como em produção
```

Node 24+ e pnpm (a versão está fixada em `packageManager`).

## Páginas

| Rota                     | Para quê                                                                 |
| ------------------------ | ------------------------------------------------------------------------ |
| `/`                      | Sistemas sob medida. Destino dos anúncios de "sistema sob medida".       |
| `/ponto-eletronico`      | Norma Ponto. Destino dos anúncios de ponto eletrônico (lista de espera). |
| `/assinatura-eletronica` | Norma Assinatura. Destino dos anúncios de assinatura (lista de espera).  |
| `/obrigado`              | Depois de um lead. Fora do índice; serve de conversão no Google Ads.     |
| `/privacidade`           | Política de privacidade (LGPD).                                          |

## Onde mexer

```
src/
  config/site.ts      dados da empresa (CNPJ, cidade, menu) — o que estiver null não aparece
  data/               todo o texto do site, tipado: home, ponto, assinatura
  components/
    brand/            o esquadro (Mark) e o logo
    home/             as seções da home
    illustrations/    as ilustrações animadas (SVG e CSS)
    forms/            formulário de lead e a seção amarela
    layout/           cabeçalho, rodapé, barra do celular, GTM e aviso de cookies
    seo/              meta tags e dados estruturados
    ui/               botão, cabeçalho de seção, régua, perguntas
  layouts/            BaseLayout (toda página) e ProductLayout (páginas de produto)
  consent/            consentimento de cookies: categorias, registro, Consent Mode, API
  lib/                medição, origem da visita, schema.org
  scripts/            o JavaScript do navegador
  styles/             tokens da marca e base
scripts/render-images.mjs   gera as imagens de compartilhamento e os ícones
```

Texto novo vai em `src/data`. Cor, tipo e espaçamento estão em `src/styles/tokens.css`; os componentes usam as
variáveis de tema (`--bg`, `--fg`, `--line`…), então funcionam sobre grafite, papel ou amarelo.

## Variáveis de ambiente

| Variável               | Para quê                                                                        |
| ---------------------- | ------------------------------------------------------------------------------- |
| `SITE_URL`             | Domínio público. Obrigatório para publicar: canonical, sitemap e Open Graph.    |
| `PUBLIC_GTM_ID`        | Google Tag Manager. Vazio: nenhum script de terceiro e nenhum aviso de cookies. |
| `PUBLIC_LEAD_ENDPOINT` | URL que recebe o lead (POST JSON). Vazio: o envio abre o WhatsApp.              |
| `PUBLIC_WHATSAPP`      | WhatsApp comercial, só dígitos com DDI. Liga a barra do celular e os links.     |
| `PUBLIC_CONTACT_EMAIL` | E-mail de contato e do encarregado de dados.                                    |

As `PUBLIC_*` vão para o navegador: nunca coloque segredo nelas.

## Cookies e consentimento

Gerenciador próprio, em `src/consent/`, sem biblioteca de terceiros e sem dependência do site — pensado para ser
levado depois aos produtos da Norma.

- **Categorias** (`src/consent/config.ts`): Necessários (sempre ativos), Medição de uso e Anúncios. Cada cookie
  está cadastrado com a categoria, o fornecedor, a finalidade e a duração; o aviso, a tela de preferências, a página
  `/cookies` e a limpeza na revogação leem da mesma lista.
- **Regras da ANPD**: aceitar e recusar com o mesmo peso, nada vem marcado, a escolha muda a qualquer momento por
  "Preferências de cookies" no rodapé. Vale 12 meses; subir `CONSENT_VERSION` faz todo mundo responder de novo.
- **Revogação**: apaga na hora os cookies da categoria retirada; se um script dela já rodou, a página recarrega.
- **Prova do consentimento** (LGPD art. 8º, § 2º): cada escolha gera um registro (`id`, versão, escolhas, método,
  data, validade). Com `PUBLIC_CONSENT_ENDPOINT`, o registro vai por POST para o servidor guardar o histórico.
- **Global Privacy Control**: se o navegador pedir, a tela de preferências avisa e Anúncios fica desligado.
- **Google Consent Mode v2**: o padrão (negado, ou a escolha guardada) entra no `<head>` antes de qualquer
  ferramenta. `PUBLIC_CONSENT_MODE=basic` (padrão) só carrega o GTM depois de alguma permissão; `advanced`
  carrega sempre e, sem permissão, o Google recebe só sinais sem cookies (melhora a modelagem de conversões).
- **Script de terceiro fora do GTM**: use `<ConsentScript category="analytics" src="…" />` — ele só roda com a
  categoria permitida.
- **Ver o aviso sem GTM**: `PUBLIC_CONSENT_PREVIEW=true` no `.env`.

API no navegador (`src/consent/manager.ts`): `consent.get()`, `consent.decided()`, `consent.set(escolhas, método)`,
`consent.onChange(fn)`, `consent.open()`.

Formato do registro enviado ao `PUBLIC_CONSENT_ENDPOINT`:

```json
{
  "id": "uuid aleatório, o mesmo para a mesma pessoa",
  "version": 2,
  "choices": { "analytics": true, "marketing": false },
  "method": "aceitar-todos | recusar-todos | personalizado",
  "at": "2026-11-12T12:00:00.000Z",
  "expires": "2027-11-12T12:00:00.000Z",
  "page": "/"
}
```

## Anúncios e medição

- **No GTM**: em Administrador › Configurações do contêiner, ative a visão geral de consentimento. As tags do
  Google (GA4, Google Ads) já respeitam o Consent Mode sozinhas; para outras, exija `analytics_storage` ou
  `ad_storage` em "Configurações de consentimento" da tag. O evento `consent_update` (com `consent_analytics`,
  `consent_marketing` e `consent_method`) serve de acionador para o que precisar reagir à escolha.
- **Eventos no `dataLayer`**: `generate_lead` (lead enviado, com `lead_interest` e `method`), `form_start`,
  `form_error`, `cta_click`, `click_whatsapp`, `click_email`, `consent_update`. Configure no GTM a tag de conversão
  do Google Ads em `generate_lead` — ou, como alternativa, na visualização de `/obrigado`.
- **Origem do lead**: UTMs, `gclid`, `gbraid`, `wbraid` e `fbclid` são guardados por 90 dias no navegador e vão
  junto com o formulário, em `attribution` (legítimo interesse, descrito na política de privacidade).

Formato do lead enviado ao `PUBLIC_LEAD_ENDPOINT`:

```json
{
  "interest": "sob-medida | ponto | assinatura",
  "name": "…",
  "company": "…",
  "contact": "e-mail ou telefone",
  "message": "…",
  "team_size": "…",
  "page": "/ponto-eletronico",
  "attribution": { "utm_source": "google", "gclid": "…", "landing_page": "/", "referrer": "…" },
  "submitted_at": "2026-11-12T12:00:00.000Z"
}
```

## Imagens

As imagens de compartilhamento (`public/og/`) e os ícones são gerados de HTML pelo Chromium e ficam versionados.
Rode `pnpm images` quando a marca ou os títulos mudarem (precisa de `chromium` e, para o `.ico`, do ImageMagick).

## Publicar

`pnpm build` com `SITE_URL` definido gera `dist/`, que é só arquivo estático. As URLs não têm barra nem extensão
(`/ponto-eletronico` é servido por `ponto-eletronico.html`). No nginx:

```nginx
location / {
  try_files $uri $uri.html $uri/ =404;
}
error_page 404 /404.html;

location /_astro/ {
  add_header Cache-Control "public, max-age=31536000, immutable";
}
```

## Antes de ir ao ar

- [ ] Domínio definido em `SITE_URL`.
- [ ] CNPJ e cidade em `src/config/site.ts`.
- [ ] WhatsApp, e-mail e o destino do formulário nas variáveis de ambiente.
- [ ] GTM com a conversão do Google Ads em `generate_lead` e a visão geral de consentimento ativa.
- [ ] Endpoint para guardar os registros de consentimento (`PUBLIC_CONSENT_ENDPOINT`).
- [ ] Lista de cookies em `src/consent/config.ts` conferida com as ferramentas realmente ligadas no GTM.
- [ ] Política de privacidade revisada pelo jurídico.
- [ ] Busca da marca "Norma" no INPI (classes 9 e 42) concluída.
