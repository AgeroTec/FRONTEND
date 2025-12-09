# Arquitetura do Projeto - ERP Frontend

## Visão Geral

Este projeto segue os princípios de **Clean Architecture** e **Domain-Driven Design (DDD)**, organizando o código em camadas bem definidas e independentes.

## Estrutura de Camadas

```
src/
├── domain/              # Camada de Domínio (Regras de Negócio)
│   ├── entities/        # Entidades do domínio
│   ├── valueObjects/    # Objetos de Valor
│   ├── repositories/    # Interfaces de Repositórios
│   ├── exceptions/      # Exceções de domínio
│   └── schemas/         # Schemas de validação
│
├── application/         # Camada de Aplicação (Casos de Uso)
│   ├── useCases/        # Casos de uso da aplicação
│   └── services/        # Serviços de aplicação
│
├── infrastructure/      # Camada de Infraestrutura
│   ├── repositories/    # Implementações de repositórios
│   └── http/            # Cliente HTTP e configurações
│
├── presentation/        # Camada de Apresentação
│   ├── components/      # Componentes React reutilizáveis
│   ├── hooks/           # React Hooks customizados
│   └── stores/          # Gerenciamento de estado (Zustand)
│
└── app/                 # Páginas Next.js (App Router)
```

## Camadas em Detalhe

### 1. Domain (Domínio)

**Responsabilidade**: Contém as regras de negócio puras, independentes de frameworks e tecnologias.

#### Entities (Entidades)
Objetos com identidade própria que representam conceitos do domínio.

```typescript
// domain/entities/AuthUser.ts
export interface AuthUser {
  id: string;
  login: string;
  nome: string;
  email?: string;
  perfil?: string;
}
```

#### Value Objects (Objetos de Valor)
Objetos imutáveis que representam conceitos sem identidade própria.

```typescript
// domain/valueObjects/AuthTokens.ts
export class AuthTokensVO {
  private constructor(private readonly value: AuthTokens) {
    this.validate();
  }

  static create(tokens: AuthTokens): AuthTokensVO {
    return new AuthTokensVO(tokens);
  }

  private validate(): void {
    // Validações
  }

  isExpired(): boolean {
    // Lógica de verificação
  }
}
```

#### Repositories (Interfaces)
Contratos que definem como os dados devem ser acessados.

```typescript
// domain/repositories/IAuthRepository.ts
export interface IAuthRepository {
  login(credentials: LoginCredentials): Promise<AuthResponse>;
  logout(): Promise<void>;
  refreshToken(refreshToken: string): Promise<AuthTokens>;
  validateToken(token: string): Promise<boolean>;
}
```

#### Exceptions (Exceções)
Erros específicos do domínio para melhor tratamento de erros.

```typescript
// domain/exceptions/AuthenticationError.ts
export class AuthenticationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthenticationError";
  }
}
```

### 2. Application (Aplicação)

**Responsabilidade**: Orquestra o fluxo de dados entre as camadas, implementando casos de uso.

#### Use Cases (Casos de Uso)
Cada caso de uso representa uma ação específica do sistema.

```typescript
// application/useCases/auth/LoginUseCase.ts
export class LoginUseCase {
  constructor(private readonly authRepository: IAuthRepository) {}

  async execute(credentials: LoginCredentialsData): Promise<AuthResponse> {
    const loginCredentials = LoginCredentials.create(credentials);
    return await this.authRepository.login(loginCredentials);
  }
}
```

#### Services (Serviços)
Agregam e expõem casos de uso relacionados.

```typescript
// application/services/AuthService.ts
const authRepository = new AuthRepositoryImpl();

export const authService = {
  login: new LoginUseCase(authRepository),
  logout: new LogoutUseCase(authRepository),
  refreshToken: new RefreshTokenUseCase(authRepository),
  validateToken: new ValidateTokenUseCase(authRepository),
};
```

### 3. Infrastructure (Infraestrutura)

**Responsabilidade**: Implementa os detalhes técnicos de comunicação com APIs, banco de dados, etc.

#### Repositories (Implementações)
Implementam as interfaces definidas no domínio.

```typescript
// infrastructure/repositories/AuthRepositoryImpl.ts
export class AuthRepositoryImpl implements IAuthRepository {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiFetch<LoginApiResponse>(
      "/auth/login",
      {
        method: "POST",
        body: JSON.stringify(credentials.toJSON()),
      },
      true
    );

    return this.mapToAuthResponse(response);
  }
}
```

#### HTTP Client
Cliente HTTP configurado com interceptors e headers padrão.

```typescript
// infrastructure/http/apiClient.ts
export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
  skipAuth = false
): Promise<T> {
  // Lógica de request com autenticação
}
```

### 4. Presentation (Apresentação)

**Responsabilidade**: Componentes de UI, hooks e gerenciamento de estado.

#### Components (Componentes)
Componentes React reutilizáveis e isolados.

```typescript
// presentation/components/LoginForm/index.tsx
export function LoginForm({ onSubmit, loading, error }: LoginFormProps) {
  // Lógica do componente
}
```

#### Stores (Gerenciamento de Estado)
Utiliza Zustand para gerenciamento de estado global.

```typescript
// presentation/stores/authStore.ts
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      login: async (login: string, senha: string): Promise<void> => {
        const response = await authService.login.execute({ login, senha });
        set({ user: response.user, isAuthenticated: true });
      },
    }),
    { name: "auth-storage" }
  )
);
```

#### Hooks (Custom Hooks)
Hooks reutilizáveis para lógica comum.

```typescript
// presentation/hooks/useAuth.ts
export const useAuth = () => {
  const isAuthenticated = () => {
    return localStorage.getItem("accessToken") !== null;
  };

  return { isAuthenticated, getToken, logout };
};
```

## Princípios Aplicados

### 1. Single Responsibility Principle (SRP)
Cada classe/módulo tem uma única responsabilidade bem definida.

### 2. Dependency Inversion Principle (DIP)
As camadas dependem de abstrações (interfaces), não de implementações concretas.

### 3. Separation of Concerns
Cada camada tem suas preocupações isoladas:
- **Domain**: Regras de negócio
- **Application**: Orquestração
- **Infrastructure**: Detalhes técnicos
- **Presentation**: Interface com usuário

### 4. Clean Code
- Nomes descritivos e significativos
- Funções pequenas e focadas
- Comentários apenas quando necessário
- Formatação consistente

## Fluxo de Dados

```
User Action (Presentation)
       ↓
    Store/Hook
       ↓
   Use Case (Application)
       ↓
  Repository Interface (Domain)
       ↓
Repository Implementation (Infrastructure)
       ↓
   External API
```

## Vantagens da Arquitetura

1. **Testabilidade**: Cada camada pode ser testada independentemente
2. **Manutenibilidade**: Código organizado e fácil de entender
3. **Escalabilidade**: Fácil adicionar novas funcionalidades
4. **Flexibilidade**: Troca de implementações sem afetar outras camadas
5. **Reutilização**: Componentes e casos de uso reutilizáveis
6. **Independência de Frameworks**: Regras de negócio não dependem de frameworks

## Exemplos de Uso

### Adicionando um Novo Módulo

1. **Criar Entidades** em `domain/entities/`
2. **Criar Value Objects** em `domain/valueObjects/`
3. **Definir Interface do Repositório** em `domain/repositories/`
4. **Criar Casos de Uso** em `application/useCases/`
5. **Implementar Repositório** em `infrastructure/repositories/`
6. **Criar Componentes** em `presentation/components/`
7. **Criar Store** (se necessário) em `presentation/stores/`
8. **Criar Páginas** em `app/`

### Tratamento de Erros

```typescript
// Domain - Definir exceções específicas
export class InvalidCredentialsError extends AuthenticationError {}

// Infrastructure - Capturar e converter erros
if (errorMessage.includes("401")) {
  throw new InvalidCredentialsError();
}

// Presentation - Exibir para o usuário
catch (error) {
  if (error instanceof InvalidCredentialsError) {
    setErro("Usuário ou senha incorretos");
  }
}
```

## Convenções de Código

1. Use TypeScript para tipagem estática
2. Prefira composição sobre herança
3. Mantenha funções puras sempre que possível
4. Use async/await em vez de callbacks
5. Evite mutações diretas de estado
6. Utilize interfaces para contratos
7. Crie testes para casos de uso críticos

## Referências

- [Clean Architecture - Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Domain-Driven Design - Eric Evans](https://www.domainlanguage.com/ddd/)
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)
