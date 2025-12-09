# Arquivos e Código Removido - Limpeza de Código Morto

Este documento registra os arquivos e código que foram identificados como não utilizados durante a refatoração do projeto.

## Componentes Não Utilizados

### 1. LoadingSpinner
- **Arquivo:** `src/presentation/components/LoadingSpinner.tsx`
- **Status:** Não utilizado
- **Motivo:** Nenhuma página ou componente importa este componente
- **Recomendação:** Manter para uso futuro (pode ser útil)
- **Ação:** Mantido no projeto

### 2. Pagination
- **Arquivo:** `src/presentation/components/Pagination.tsx`
- **Status:** Não utilizado
- **Motivo:** Nenhuma página implementa paginação visual ainda
- **Recomendação:** Implementar paginação nas páginas de listagem
- **Ação:** Mantido no projeto para implementação futura

### 3. AuthGuard
- **Arquivo:** `src/presentation/components/AuthGuard.tsx`
- **Status:** Não utilizado
- **Motivo:** Autenticação é tratada via middleware (src/middleware.ts)
- **Recomendação:** Pode ser removido ou mantido como fallback
- **Ação:** Mantido no projeto

### 4. ErrorBoundary
- **Arquivo:** `src/presentation/components/ErrorBoundary/index.tsx`
- **Status:** Não utilizado
- **Motivo:** Não está sendo usado em nenhum layout ou página
- **Recomendação:** Implementar no root layout para tratamento de erros
- **Ação:** Mantido no projeto para implementação futura

## Hooks Não Utilizados

### 5. useAuth
- **Arquivo:** `src/presentation/hooks/useAuth.ts`
- **Status:** Parcialmente não utilizado
- **Motivo:** Páginas usam `useAuthStore` diretamente
- **Recomendação:** Incentivar uso do hook ao invés do store direto
- **Ação:** Mantido no projeto

## Use Cases Não Utilizados

### 6. RefreshTokenUseCase
- **Arquivo:** `src/application/useCases/auth/RefreshTokenUseCase.ts`
- **Status:** Implementado mas não chamado
- **Recomendação:** Implementar lógica de refresh automático no apiClient
- **Ação:** Mantido para implementação futura

### 7. ValidateTokenUseCase
- **Arquivo:** `src/application/useCases/auth/ValidateTokenUseCase.ts`
- **Status:** Implementado mas não chamado
- **Recomendação:** Usar no middleware ou em verificações de autenticação
- **Ação:** Mantido para implementação futura

### 8. GetEmpresaByIdUseCase
- **Arquivo:** Existe nos use cases de empresa
- **Status:** Implementado mas não usado
- **Recomendação:** Será usado quando implementar edição de empresas
- **Ação:** Mantido para implementação futura

### 9. UpdateEmpresaUseCase
- **Arquivo:** Existe nos use cases de empresa
- **Status:** Implementado mas página de edição não existe
- **Recomendação:** Criar página de edição de empresa
- **Ação:** Mantido para implementação futura

### 10. DeleteEmpresaUseCase
- **Arquivo:** Existe nos use cases de empresa
- **Status:** Implementado mas funcionalidade delete não existe
- **Recomendação:** Adicionar botão de exclusão nas listagens
- **Ação:** Mantido para implementação futura

## Estados Não Utilizados

### 11. Estado "lembrar" no LoginForm
- **Arquivo:** `src/presentation/components/LoginForm/index.tsx`
- **Linha:** Estado `lembrar` é declarado mas não faz nada
- **Recomendação:** Implementar funcionalidade "Lembrar-me" ou remover
- **Ação:** A ser verificado

## Resumo de Ações

- **Total de itens identificados:** 11
- **Itens mantidos no projeto:** 11
- **Itens removidos:** 0

### Justificativa para Manter

Todos os componentes, hooks e use cases identificados como "não utilizados" foram mantidos no projeto porque:

1. **Componentes UI:** LoadingSpinner, Pagination, ErrorBoundary são componentes úteis que podem ser implementados no futuro
2. **AuthGuard:** Pode servir como fallback de segurança
3. **Use Cases:** Fazem parte da arquitetura completa CRUD e serão necessários quando implementar edição e exclusão
4. **Hooks:** Facilitam abstração e devem ser incentivados ao invés do uso direto do store

### Próximos Passos Recomendados

1. Implementar paginação nas páginas de listagem usando o componente Pagination
2. Adicionar ErrorBoundary no root layout
3. Criar páginas de edição para usar os UpdateUseCases
4. Adicionar funcionalidade de exclusão usando os DeleteUseCases
5. Implementar refresh token automático usando RefreshTokenUseCase
6. Adicionar LoadingSpinner global ou por página

---

**Data:** 2025-12-02
**Responsável:** Claude Code (Sonnet 4.5)
