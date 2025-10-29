// src/domain/schemas/credorSchemas.ts
import { z } from 'zod';

// Validação de CNPJ
const cnpjRegex = /^\d{14}$/;
const cpfRegex = /^\d{11}$/;

export const credorSearchSchema = z.object({
  search: z.string().optional(),
  doc: z.string().regex(/^\d+$/, 'Documento deve conter apenas números').optional(),
  ativo: z.enum(['S', 'N', '']).optional(),
  page: z.number().int().positive('Página deve ser maior que zero'),
  pageSize: z.number().int().min(1).max(100, 'Tamanho da página deve estar entre 1 e 100'),
});

export const createCredorSchema = z.object({
  nome: z.string()
    .min(3, 'Nome deve ter no mínimo 3 caracteres')
    .max(200, 'Nome deve ter no máximo 200 caracteres'),
  fantasia: z.string()
    .max(200, 'Nome fantasia deve ter no máximo 200 caracteres')
    .optional()
    .nullable(),
  cnpj: z.string()
    .regex(cnpjRegex, 'CNPJ inválido')
    .optional()
    .nullable(),
  cpf: z.string()
    .regex(cpfRegex, 'CPF inválido')
    .optional()
    .nullable(),
  ativo: z.enum(['S', 'N']),
}).refine(
  (data) => data.cnpj || data.cpf,
  {
    message: 'Informe CNPJ ou CPF',
    path: ['cnpj'],
  }
).refine(
  (data) => !(data.cnpj && data.cpf),
  {
    message: 'Informe apenas CNPJ ou CPF, não ambos',
    path: ['cnpj'],
  }
);

export const updateCredorSchema = createCredorSchema.extend({
  id: z.number().int().positive('ID deve ser maior que zero'),
});

export const loginSchema = z.object({
  email: z.string()
    .email('E-mail inválido')
    .min(1, 'E-mail é obrigatório'),
  password: z.string()
    .min(6, 'Senha deve ter no mínimo 6 caracteres')
    .min(1, 'Senha é obrigatória'),
});

// Types inferidos dos schemas
export type CredorSearchInput = z.infer<typeof credorSearchSchema>;
export type CreateCredorInput = z.infer<typeof createCredorSchema>;
export type UpdateCredorInput = z.infer<typeof updateCredorSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

// Helper para validação
export const validateSchema = <T>(schema: z.ZodSchema<T>, data: unknown): { success: boolean; data?: T; errors?: string[] } => {
  try {
    const validated = schema.parse(data);
    return { success: true, data: validated };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map(err => `${err.path.join('.')}: ${err.message}`);
      return { success: false, errors };
    }
    return { success: false, errors: ['Erro de validação desconhecido'] };
  }
};