# Rickelmi Portfolio

Portfólio premium para um Video Editor e Motion Designer, desenvolvido em React + TypeScript + Tailwind CSS.

## Stack


## Estrutura


## Como rodar

```bash
npm install
npm run dev -- --host
```

## Build

```bash
npm run build
```
# Rickelmi Portfolio

Portfólio premium em React + TypeScript com site público alimentado pelo Firebase e painel administrativo em `/admin`.

## Desenvolvimento

1. Copie `.env.example` para `.env.local` e preencha as credenciais do app Web no Firebase.
2. Ative Authentication com e-mail/senha, Firestore e Storage no projeto Firebase.
3. Execute `npm install` e `npm run dev`.

## Administração

O painel usa Firebase Authentication e só libera escrita para usuários cujo token contenha `admin: true`. O claim deve ser atribuído uma vez por um ambiente confiável usando o Firebase Admin SDK:

```ts
await getAuth().setCustomUserClaims('UID_DO_USUARIO', { admin: true });
```

Depois de atribuir o claim, saia e entre novamente no `/admin` para atualizar o token.

## Firebase

As regras estão em `firestore.rules` e `storage.rules`. Elas permitem leitura pública apenas dos projetos publicados/configurações públicas e bloqueiam escritas sem o claim administrativo.

Para publicar, instale o Firebase CLI, autentique-se, selecione o projeto e execute:

```bash
firebase deploy --only firestore:rules,storage,hosting
```

## Rotas

- `/`: site público
- `/admin/login`: login e recuperação de senha
- `/admin`: visão geral
- `/admin/projetos`: gerenciamento
- `/admin/projetos/novo`: novo projeto
- `/admin/configuracoes`: dados públicos e showreel

## Build

```bash
npm run build
```
