# Guia de Migração - Clean Architecture

## ⚡ Quick Start (5 minutos)

### 1. Backup e Ativação da Página Refatorada

```bash
# Navegue para a pasta do projeto
cd "C:\ERP - AGAIN\AgeroTec\ERP-Frontend\FRONTEND"

# Backup da página antiga
mv src/app/(auth)/credor/page.tsx src/app/(auth)/credor/page.OLD.tsx

# Ativar página refatorada
mv src/app/(auth)/credor/page.refactored.tsx src/app/(auth)/credor/page.tsx
```

### 2. Iniciar o Servidor

```bash
npm run dev
```

### 3. Testar

Acesse: `http://localhost:3000/credor`

**Funcionalidades para testar:**
- ✅ Busca por nome
- ✅ Filtro por CPF/CNPJ
- ✅ Filtro por status (Ativo/Inativo)
- ✅ Paginação
- ✅ Loading states
- ✅ React Query DevTools (canto inferior direito)

---

## 📊 O Que Mudou

### Arquivos Criados (11 novos)

#### Infrastructure Layer
```
✅ src/infrastructure/http/apiConfig.ts          (configuração API)
✅ src/infrastructure/http/httpClient.ts         (substitui safeFetchJson)
✅ src/infrastructure/repositories/CredorRepositoryImpl.ts
```

#### Domain Layer
```
✅ src/domain/valueObjects/Document.ts           (validação CPF/CNPJ)
✅ src/domain/valueObjects/Status.ts             (lógica status)
✅ src/domain/entities/Credor.ts                 (+ CredorHelper)
```

#### Application Layer
```
✅ src/application/services/CredorService.ts
✅ src/application/useCases/credor/SearchCredoresUseCase.ts
✅ src/application/useCases/credor/CreateCredorUseCase.ts
```

#### Presentation Layer
```
✅ src/presentation/providers/QueryProvider.tsx
✅ src/presentation/hooks/useCredores.ts
✅ src/presentation/features/credores/components/CredorSearchBar.tsx
✅ src/presentation/features/credores/components/CredoresTable.tsx
✅ src/presentation/components/common/StatusBadge.tsx
```

### Arquivos Modificados (3)

```
📝 src/app/layout.tsx                            (+ QueryProvider)
📝 src/domain/repositories/ICredorRepository.ts  (expandido CRUD)
📝 src/presentation/components/Pagination.tsx    (props opcionais)
```

### Arquivos para Deletar (após validação)

```bash
# Após validar que tudo funciona, deletar:
rm src/app/(auth)/credor/page.OLD.tsx
```

---

## 🔧 Troubleshooting

### Erro: "Module not found: Can't resolve '@/domain/...'"

**Solução:** Reinicie o servidor de desenvolvimento
```bash
# Ctrl+C para parar
npm run dev
```

### Erro: "localStorage is not defined"

**Solução:** O httpClient já trata isso com `typeof window !== 'undefined'`.
Se persistir, verifique se está usando `'use client'` no componente.

### Erro: Headers não estão sendo enviados

**Solução:** Verifique o `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5103/api/v1
NEXT_PUBLIC_TENANT_ID=11111111-1111-1111-1111-111111111111
```

### Dados não carregam

**Soluções:**
1. Verifique se o backend está rodando em `http://localhost:5103`
2. Verifique o console do navegador (F12) para erros
3. Verifique o React Query DevTools (canto inferior direito)
4. Teste o endpoint manualmente:
```bash
curl -X GET "http://localhost:5103/api/v1/credores?page=1&pageSize=10" \
  -H "X-Tenant-Id: 11111111-1111-1111-1111-111111111111"
```

---

## 🎯 Próximos Passos

### Opção 1: Validar e Consolidar

1. ✅ Testar todos os cenários na página de Credores
2. ✅ Deletar `page.OLD.tsx` após validação
3. ✅ Commit das mudanças:

```bash
git add .
git commit -m "refactor: implement clean architecture for Credores

- Add infrastructure layer (HTTP client, repositories)
- Add application layer (use cases, services)
- Add domain value objects (Document, Status)
- Refactor Credores page (490 → 65 lines)
- Add React Query for state management
- Add React Hook Form for form validation
- Eliminate code duplication (safeFetchJson)
- Remove hardcoded credentials
- Implement SOLID principles

Closes #[numero-da-issue]"
```

### Opção 2: Replicar para Outras Entidades

Use o template abaixo para criar outras entidades seguindo o mesmo padrão:

#### Template: Cliente

```bash
# 1. Domain
src/domain/entities/Cliente.ts
src/domain/repositories/IClienteRepository.ts

# 2. Infrastructure
src/infrastructure/repositories/ClienteRepositoryImpl.ts

# 3. Application
src/application/useCases/cliente/SearchClientesUseCase.ts
src/application/services/ClienteService.ts

# 4. Presentation
src/presentation/hooks/useClientes.ts
src/presentation/features/clientes/components/ClienteSearchBar.tsx
src/presentation/features/clientes/components/ClientesTable.tsx

# 5. Refatorar página
src/app/(auth)/cliente/page.tsx
```

**Código base para copiar:**
- Use `CredorService.ts` como template
- Use `CredorSearchBar.tsx` como template
- Use `CredoresTable.tsx` como template
- Use `useCredores.ts` como template

**Estimativa:** 30-45 minutos por entidade (após fazer a primeira)

---

## 📚 Recursos

### Documentação

- **Clean Architecture:** https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html
- **DDD:** https://martinfowler.com/bliki/DomainDrivenDesign.html
- **SOLID:** https://www.digitalocean.com/community/conceptual-articles/s-o-l-i-d-the-first-five-principles-of-object-oriented-design
- **React Query:** https://tanstack.com/query/latest/docs/react/overview
- **React Hook Form:** https://react-hook-form.com/
- **Zod:** https://zod.dev/

### Vídeos Recomendados

- Clean Architecture in Frontend (YouTube)
- SOLID Principles in React (YouTube)
- React Query Tutorial (TanStack docs)

---

## 🐛 Reportar Problemas

Se encontrar bugs ou tiver dúvidas:

1. Verifique este guia primeiro
2. Verifique o `REFACTORING.md` para detalhes técnicos
3. Abra uma issue no repositório
4. Entre em contato com o time de desenvolvimento

---

## ✅ Checklist de Validação

Antes de considerar a migração completa:

- [ ] Busca por nome funciona
- [ ] Filtro por CPF/CNPJ funciona
- [ ] Filtro por status funciona
- [ ] Paginação funciona
- [ ] Loading states aparecem
- [ ] Erros são tratados corretamente
- [ ] React Query DevTools aparece
- [ ] Headers são enviados automaticamente (verificar Network tab)
- [ ] Cache funciona (buscar 2x não faz request 2x)
- [ ] Código está limpo (sem console.logs desnecessários)

---

## 🎉 Sucesso!

Se todos os itens da checklist estão ✅, você migrou com sucesso para Clean Architecture!

**Próximo passo:** Replicar para outras entidades usando o mesmo padrão.

**Benefícios imediatos:**
- ⚡ 87% menos código nas páginas
- 🔒 Segurança (credenciais não mais expostas)
- 🚀 Performance (cache automático)
- 🧪 Testabilidade
- 📈 Manutenibilidade
- 🎯 Escalabilidade
