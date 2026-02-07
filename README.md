# Prisma Course — Projeto de Aprendizado

Projeto educacional para aprender e demonstrar operações básicas com Prisma ORM, TypeScript e SQLite.

## 📋 Descrição

Este repositório contém exemplos simples de operações CRUD usando o Prisma Client conectado a um banco SQLite via adapter `better-sqlite3`. O foco é didático: mostrar criação, leitura e atualização de usuários e a configuração do adapter.

## 🛠️ Tecnologias

- **TypeScript** — Linguagem principal
- **Prisma ORM** — Object-Relational Mapping
- **SQLite** — Banco de dados embarcado
- **better-sqlite3** — Driver SQLite para Node.js (usado pelo adapter)
- **tsx** — Executor para rodar TypeScript diretamente

## 📦 Instalação

```bash
# Instalar dependências
npm install

# Executar migrações do banco de dados (modo dev)
npx prisma migrate dev

# Gerar o Prisma Client
npx prisma generate
```

## 🚀 Execução

```bash
# Rodar em modo desenvolvimento
npm run dev
```

## 📂 Estrutura do projeto

```
prisma-course/
├── prisma/
│   ├── schema.prisma        # Schema do banco de dados
│   └── migrations/          # Histórico de migrações
├── src/
│   ├── basic/
│   │   ├── add-user.ts      # Criar usuário
│   │   ├── find-user.ts     # Buscar usuário
│   │   ├── update-user.ts   # Atualizar/criar usuário (upsert)
│   │   └── db-config.ts     # Configuração do adapter SQLite
│   └── index.ts             # Runner / ponto de entrada
└── package.json
```

## ✨ Funcionalidades documentadas

Abaixo está a documentação das funcionalidades implementadas nos arquivos dentro de `src/basic/`.

### `add-user.ts`

Cria um novo registro na tabela `users` com `name`, `email` (único) e `password` (hash).

Exemplo de uso:

```typescript
await prisma.users.create({
    data: {
        name: "João Silva",
        email: "joao@example.com",
        password: "$2a$12$hash...",
    },
});
```

Boas práticas:

- Validar formato do e-mail antes de criar.
- Hash da senha antes de persistir.

---

### `find-user.ts`

Busca um usuário por critérios (ex.: `id`) e pode omitir campos sensíveis.

Exemplo:

```typescript
const user = await prisma.users.findUnique({
    where: { id: 1 },
    // Para omitir senha do retorno, use `select` compatível com sua versão do Prisma:
    // select: { id: true, name: true, email: true, active: true }
});
```

Boas práticas:

- Use `select` para controlar os campos retornados.
- Filtre por `active: true` quando necessário.

---

### `update-user.ts`

Realiza um `upsert` (cria se não existir, atualiza se existir). Recomenda-se usar um campo único em `where` (por exemplo `email`) ou garantir que `id` exista.

Exemplo:

```typescript
await prisma.users.upsert({
    where: { email: "user@example.com" }, // recomendável usar campo único
    create: {
        name: "Nome",
        email: "user@example.com",
        password: "hash...",
    },
    update: {
        name: "Nome Atualizado",
        active: true,
    },
});
```

Observações técnicas:

- Use os tipos gerados pelo Prisma para `create` e `update` (`Prisma.UsersCreateInput`, `Prisma.UsersUpdateInput`).
- Não inclua `id` em `create` quando este for auto-gerado.

---

## 🔧 `db-config.ts` (adapter SQLite)

O arquivo `src/basic/db-config.ts` contém a configuração do adapter `@prisma/adapter-better-sqlite3` usada para inicializar o `PrismaClient` com `better-sqlite3`. Verifique esse arquivo para alterar o caminho do arquivo `.sqlite` ou opções do adapter.

Exemplo (resumo):

```typescript
import { BetterSqlite3Adapter } from "@prisma/adapter-better-sqlite3";

export const adapter = new BetterSqlite3Adapter({
    // path para o arquivo sqlite
    database: "./dev.db",
});
```

(Consulte `src/basic/db-config.ts` para a implementação exata no projeto.)

## 🗄️ Modelagem — `Users` (arquivo `prisma/schema.prisma`)

```prisma
model Users {
  id       Int     @id @default(autoincrement())
  name     String
  email    String  @unique
  password String
  active   Boolean @default(true)

  @@map("users")
}
```

Campos importantes:

- `id` — identificador auto-incremental
- `email` — campo único (usado para buscas/upserts quando aplicável)
- `password` — armazene hashes, nunca senhas em texto puro
- `active` — flag para soft-delete/controle de ativação

## 📝 Scripts disponíveis

- `npm run dev` — executa `tsx ./src/index` em modo desenvolvimento
- `npx prisma migrate dev` — cria/aplica migrações em ambiente de desenvolvimento
- `npx prisma generate` — gera/atualiza o Prisma Client

## 📚 Boas práticas & observações

- Use os tipos do Prisma (`Prisma.UsersCreateInput`, `Prisma.UsersUpdateInput`) ao construir payloads para `create`/`update`.
- Evite usar `Partial<Users>` diretamente para payloads; isso pode causar conflitos de tipos (especialmente com `exactOptionalPropertyTypes`).
- Em retornos para APIs, remova ou omita o campo `password` usando `select`.
- Para `upsert`, prefira `where` com campo único (ex.: `email`) quando não tiver certeza do `id`.
