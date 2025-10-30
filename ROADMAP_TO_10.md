# 🎯 Roadmap: De 8.5/10 para 10/10

## 📊 Análise Atual

### ✅ O Que Temos (8.5/10)
- ✅ Clean Architecture implementada
- ✅ DDD com Value Objects
- ✅ SOLID respeitado
- ✅ HTTP Client centralizado
- ✅ React Query configurado
- ✅ Schemas Zod criados e usados
- ✅ Componentes reutilizáveis
- ✅ Documentação completa

### ❌ O Que Falta para 10/10

#### 🔴 **CRÍTICO** (Bloqueiam qualidade)
1. **Testes** (0% coverage)
2. **Error Handling** (inconsistente)
3. **Loading States** (não padronizados)
4. **Formulários** (não implementados)
5. **Validação Real-time** (falta feedback)

#### 🟡 **IMPORTANTE** (Melhoram experiência)
6. **Toast Notifications** (feedback visual)
7. **Error Boundaries** (recuperação de erros)
8. **Optimistic Updates** (UX responsiva)
9. **Debounce em Buscas** (performance)
10. **Skeleton Loaders** (UX polida)

#### 🟢 **DESEJÁVEL** (Excelência)
11. **CI/CD Pipeline** (automação)
12. **Storybook** (documentação visual)
13. **Acessibilidade** (WCAG 2.1)
14. **Internacionalização** (i18n)
15. **Monitoring** (Sentry/LogRocket)

---

## 🎯 PLANO ESTRATÉGICO

### Estratégia Recomendada: **"Foundation First"**

**Por quê?**
- Antes de replicar Credores para outras entidades, precisamos de uma **base sólida**
- Implementar testes, error handling e formulários **agora** = evitar retrabalho em 5 entidades
- Criar **templates reutilizáveis** que todas as entidades vão usar

**Analogia:** Construir a fundação da casa antes de adicionar mais andares.

---

## 📅 ROADMAP DETALHADO (3 Semanas)

### **SEMANA 1: FUNDAÇÃO CRÍTICA** (40h)
**Meta:** Resolver todos os problemas críticos que afetam qualidade

#### Dia 1-2: Infraestrutura de Testes (12h)
- [ ] Configurar Vitest + React Testing Library
- [ ] Configurar coverage reporting
- [ ] Criar primeiro teste de Value Object
- [ ] Criar primeiro teste de Use Case
- [ ] Criar primeiro teste de Componente
- [ ] Documentar padrões de teste

#### Dia 3-4: Error Handling Global (12h)
- [ ] Criar Error Boundary React
- [ ] Criar sistema de errors tipados
- [ ] Implementar toast notifications (react-hot-toast)
- [ ] Padronizar mensagens de erro
- [ ] Criar componente ErrorFallback
- [ ] Documentar estratégia de erros

#### Dia 5: Loading States & Skeletons (8h)
- [ ] Criar Skeleton components
- [ ] Padronizar LoadingSpinner usage
- [ ] Criar hook useLoadingState
- [ ] Implementar suspense boundaries
- [ ] Documentar padrões de loading

#### Review Final Semana 1 (4h)
- [ ] Code review completo
- [ ] Atualizar documentação
- [ ] Testar todos os fluxos
- [ ] Ajustar o que for necessário

**Entrega Semana 1:** Base sólida com testes, error handling e loading states

---

### **SEMANA 2: FORMULÁRIOS & UX** (40h)
**Meta:** Implementar formulários completos e UX excepcional

#### Dia 1-2: Sistema de Formulários (12h)
- [ ] Criar CredorForm component
- [ ] Implementar validação real-time
- [ ] Criar modal de criação
- [ ] Criar modal de edição
- [ ] Implementar feedback visual (errors inline)
- [ ] Criar hook useCredorForm

#### Dia 3: Optimistic Updates (8h)
- [ ] Implementar optimistic create
- [ ] Implementar optimistic update
- [ ] Implementar optimistic delete
- [ ] Rollback em caso de erro
- [ ] Loading states otimizados

#### Dia 4: Performance (8h)
- [ ] Debounce em search (500ms)
- [ ] Virtualização de lista (react-window) - se >1000 itens
- [ ] Lazy loading de imagens
- [ ] Code splitting de modais
- [ ] Memoização de componentes pesados

#### Dia 5: Acessibilidade (8h)
- [ ] Adicionar aria-labels
- [ ] Navegação por teclado
- [ ] Focus management
- [ ] Screen reader support
- [ ] Contraste de cores (WCAG AA)

#### Review Final Semana 2 (4h)
- [ ] Testes E2E (Playwright)
- [ ] Lighthouse audit (>90 score)
- [ ] Accessibility audit
- [ ] Performance profiling

**Entrega Semana 2:** Formulários completos + UX excepcional

---

### **SEMANA 3: TEMPLATE REUTILIZÁVEL** (40h)
**Meta:** Criar template genérico para replicar em outras entidades

#### Dia 1-2: Abstração Genérica (12h)
- [ ] Criar CrudService<T> genérico
- [ ] Criar useCrud<T> hook genérico
- [ ] Criar SearchBar<T> genérico
- [ ] Criar Table<T> genérico
- [ ] Criar Form<T> genérico
- [ ] Documentar padrão

#### Dia 3: CLI Generator (8h)
- [ ] Criar script `generate-entity.js`
- [ ] Template de entity
- [ ] Template de repository
- [ ] Template de use cases
- [ ] Template de components
- [ ] Documentar uso

#### Dia 4: Replicar Cliente (8h)
- [ ] Executar CLI para Cliente
- [ ] Ajustar tipos específicos
- [ ] Testar CRUD completo
- [ ] Documentar processo
- [ ] Medir tempo (meta: <30min)

#### Dia 5: CI/CD & Monitoring (8h)
- [ ] GitHub Actions (lint, test, build)
- [ ] Pre-commit hooks (Husky)
- [ ] Sentry (error tracking)
- [ ] Vercel Analytics (performance)
- [ ] Status dashboard

#### Review Final Semana 3 (4h)
- [ ] Testar template em 2 entidades
- [ ] Ajustar baseado em feedback
- [ ] Atualizar toda documentação
- [ ] Preparar apresentação para equipe

**Entrega Semana 3:** Template pronto + automação completa

---

## 📋 PRIORIDADE IMEDIATA

### **O QUE IMPLEMENTAR AGORA (Antes de Continuar)**

Recomendo implementar **NESTA ORDEM:**

#### 1. **Error Handling + Toast** (4h) - CRÍTICO
**Por quê:** Sem isso, usuário não sabe se algo deu errado

**Implementação:**
```bash
# Instalar
npm install react-hot-toast

# Criar
src/presentation/components/common/Toaster.tsx
src/infrastructure/http/httpClient.ts (atualizar)
src/app/layout.tsx (adicionar Toaster)
```

#### 2. **Loading States Padronizados** (2h) - CRÍTICO
**Por quê:** Usuário precisa de feedback visual

**Implementação:**
```bash
# Criar
src/presentation/components/common/SkeletonTable.tsx
src/presentation/components/common/SkeletonCard.tsx
```

#### 3. **Formulário de Credor** (4h) - CRÍTICO
**Por quê:** Sem isso, não pode criar/editar Credores

**Implementação:**
```bash
# Criar
src/presentation/features/credores/components/CredorFormModal.tsx
src/presentation/features/credores/components/CredorForm.tsx
src/app/(auth)/credor/page.tsx (adicionar modal)
```

#### 4. **Testes Básicos** (4h) - CRÍTICO
**Por quê:** Garantir que refatoração não quebrou nada

**Implementação:**
```bash
# Configurar
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom

# Criar
src/domain/valueObjects/__tests__/Document.test.ts
src/presentation/features/credores/components/__tests__/CredoresTable.test.tsx
```

**Total: 14h (2 dias de trabalho)**

Após implementar esses 4 itens, o projeto estará **9.2/10** e pronto para replicação.

---

## 🎯 IMPLEMENTAÇÃO RECOMENDADA AGORA

Vou detalhar especificamente o que fazer **HOJE** para maximizar impacto:

### **FASE IMEDIATA: Toast + Error Handling (4h)**

#### Passo 1: Instalar dependência
```bash
npm install react-hot-toast
```

#### Passo 2: Criar Toaster component
```typescript
// src/presentation/components/common/Toaster.tsx
import { Toaster as HotToaster } from 'react-hot-toast';

export function Toaster() {
  return (
    <HotToaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: '#363636',
          color: '#fff',
        },
        success: {
          duration: 3000,
          iconTheme: {
            primary: '#10b981',
            secondary: '#fff',
          },
        },
        error: {
          duration: 5000,
          iconTheme: {
            primary: '#ef4444',
            secondary: '#fff',
          },
        },
      }}
    />
  );
}
```

#### Passo 3: Adicionar no layout
```typescript
// src/app/layout.tsx
import { Toaster } from '@/presentation/components/common/Toaster';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <QueryProvider>
          {children}
          <Toaster /> {/* ← ADICIONAR */}
        </QueryProvider>
      </body>
    </html>
  );
}
```

#### Passo 4: Usar nos hooks
```typescript
// src/presentation/hooks/useCredores.ts
import toast from 'react-hot-toast';

export function useCreateCredor() {
  return useMutation({
    mutationFn: (data) => credorService.create(data),
    onSuccess: () => {
      toast.success('Credor criado com sucesso!'); // ← ADICIONAR
      queryClient.invalidateQueries({ queryKey: ['credores'] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao criar credor'); // ← ADICIONAR
    },
  });
}
```

**Impacto:** Feedback visual imediato para usuário

---

### **FASE IMEDIATA 2: Skeleton Loaders (2h)**

#### Passo 1: Criar SkeletonTable
```typescript
// src/presentation/components/common/SkeletonTable.tsx
export function SkeletonTable({ rows = 5 }) {
  return (
    <div className="animate-pulse">
      <div className="overflow-x-auto">
        <table className="w-full bg-white shadow rounded">
          <thead className="bg-gray-50">
            <tr>
              {[1, 2, 3, 4].map((i) => (
                <th key={i} className="px-6 py-3">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {Array.from({ length: rows }).map((_, i) => (
              <tr key={i}>
                {[1, 2, 3, 4].map((j) => (
                  <td key={j} className="px-6 py-4">
                    <div className="h-4 bg-gray-200 rounded"></div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

#### Passo 2: Usar em CredoresTable
```typescript
// src/presentation/features/credores/components/CredoresTable.tsx
import { SkeletonTable } from '@/presentation/components/common/SkeletonTable';

export function CredoresTable({ credores, isLoading }) {
  if (isLoading) {
    return <SkeletonTable rows={5} />; // ← USAR SKELETON
  }

  // ... resto do código
}
```

**Impacto:** UX profissional durante loading

---

### **FASE IMEDIATA 3: Modal de Criação (4h)**

#### Passo 1: Criar Modal base
```typescript
// src/presentation/components/common/Modal.tsx
import { ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black opacity-50"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full z-50">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-semibold">{title}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          {/* Content */}
          <div className="p-6">{children}</div>
        </div>
      </div>
    </div>
  );
}
```

#### Passo 2: Criar CredorForm
```typescript
// src/presentation/features/credores/components/CredorForm.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createCredorSchema } from '@/domain/schemas/credorSchemas';
import { CreateCredorDTO } from '@/application/useCases/credor/CreateCredorUseCase';
import { useCreateCredor } from '@/presentation/hooks/useCredores';

interface CredorFormProps {
  onSuccess: () => void;
}

export function CredorForm({ onSuccess }: CredorFormProps) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<CreateCredorDTO>({
    resolver: zodResolver(createCredorSchema),
    defaultValues: {
      ativo: 'S',
    },
  });

  const createMutation = useCreateCredor();

  const onSubmit = async (data: CreateCredorDTO) => {
    try {
      await createMutation.mutateAsync(data);
      onSuccess();
    } catch (error) {
      // Toast já mostra o erro
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">
          Nome / Razão Social *
        </label>
        <input
          {...register('nome')}
          className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
        />
        {errors.nome && (
          <p className="text-red-500 text-sm mt-1">{errors.nome.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Nome Fantasia
        </label>
        <input
          {...register('fantasia')}
          className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">CNPJ</label>
          <input
            {...register('cnpj')}
            placeholder="00.000.000/0000-00"
            className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
          />
          {errors.cnpj && (
            <p className="text-red-500 text-sm mt-1">{errors.cnpj.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">CPF</label>
          <input
            {...register('cpf')}
            placeholder="000.000.000-00"
            className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
          />
          {errors.cpf && (
            <p className="text-red-500 text-sm mt-1">{errors.cpf.message}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Status</label>
        <select
          {...register('ativo')}
          className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
        >
          <option value="S">Ativo</option>
          <option value="N">Inativo</option>
        </select>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onSuccess}
          className="px-4 py-2 border rounded hover:bg-gray-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? 'Salvando...' : 'Salvar'}
        </button>
      </div>
    </form>
  );
}
```

#### Passo 3: Adicionar modal na página
```typescript
// src/app/(auth)/credor/page.tsx
import { useState } from 'react';
import { Modal } from '@/presentation/components/common/Modal';
import { CredorForm } from '@/presentation/features/credores/components/CredorForm';

export default function CredoresPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  // ... resto do código

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Credores</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Novo Credor
        </button>
      </div>

      {/* ... resto do código */}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Novo Credor"
      >
        <CredorForm onSuccess={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
}
```

**Impacto:** CRUD completo funcional

---

## 📊 COMPARAÇÃO DE ROTAS

### Opção A: Implementar Tudo Agora (14h)
**Vantagens:**
- ✅ Base sólida antes de replicar
- ✅ Evita retrabalho
- ✅ Código de referência perfeito

**Desvantagens:**
- ⏱️ Mais tempo antes de ver resultados em outras entidades

### Opção B: Implementar Mínimo + Replicar Rápido (4h + 2h/entidade)
**Vantagens:**
- ✅ Resultados visíveis mais rápido
- ✅ Validação em múltiplas entidades

**Desvantagens:**
- ⚠️ Possível retrabalho se encontrar problemas
- ⚠️ Código menos polido inicialmente

---

## 🎯 MINHA RECOMENDAÇÃO

### **ROTA HÍBRIDA (Melhor Custo-Benefício)**

**Hoje (4h):**
1. ✅ Toast + Error Handling (2h)
2. ✅ Skeleton Loaders (1h)
3. ✅ Modal + Formulário Básico (1h)

**Amanhã (2h):**
4. ✅ Replicar Cliente usando template (2h)

**Depois de Amanhã (4h):**
5. ✅ Testes automatizados (4h)
6. ✅ Refinar baseado em feedback

**Total:** 10h para ter 3 entidades funcionando + base sólida

---

## 📈 ROADMAP VISUAL

```
HOJE (4h)
├─ Toast ✅
├─ Skeleton ✅
└─ Formulário ✅
         │
         ▼
AMANHÃ (2h)
└─ Cliente (replicar) ✅
         │
         ▼
DEPOIS (4h)
├─ Testes ✅
└─ Refinar ✅
         │
         ▼
SEMANA 2 (40h)
├─ Empresa ✅
├─ ContaCorrente ✅
├─ CentroCusto ✅
└─ Polimento ✅
         │
         ▼
SEMANA 3 (40h)
├─ Template Genérico ✅
├─ CLI Generator ✅
├─ CI/CD ✅
└─ Monitoring ✅
         │
         ▼
    10/10 🎉
```

---

## ✅ CHECKLIST DE DECISÃO

Para escolher qual rota seguir, responda:

- [ ] Preciso de resultados rápidos em múltiplas telas? → **Opção B**
- [ ] Prefiro código perfeito antes de continuar? → **Opção A**
- [ ] Quero balancear velocidade e qualidade? → **Rota Híbrida** ⭐
- [ ] Tenho apenas 1 desenvolvedor? → **Rota Híbrida**
- [ ] Tenho equipe de 3+? → **Opção A** (paralelize tarefas)

---

## 🚀 AÇÃO IMEDIATA

**Quer que eu implemente agora?**

Posso implementar **HOJE** (próximas 2-3 horas):

1. ✅ **Toast + Error Handling** (elimina erros silenciosos)
2. ✅ **Skeleton Loaders** (UX profissional)
3. ✅ **Modal + Formulário** (CRUD completo)

**Comando:**
> "Sim, implemente as 3 melhorias críticas agora"

Ou prefere outro caminho? Qual rota faz mais sentido para seu contexto?

---

## 📊 PONTUAÇÃO PROJETADA

| Fase | Nota | O Que Falta |
|------|------|-------------|
| **Atual** | 8.5/10 | Formulários, testes, error handling |
| **Após Hoje (4h)** | 9.2/10 | Testes, template genérico |
| **Após 3 dias (10h)** | 9.5/10 | Template genérico, CI/CD |
| **Após 3 semanas** | 10/10 | Nada! 🎉 |

**Decisão: Qual rota seguimos?**
