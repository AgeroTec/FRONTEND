import { z } from "zod";
import { validateCNPJ, validateCPF } from "@/domain/utils/documentUtils";

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max, `Campo deve ter no maximo ${max} caracteres`)
    .optional()
    .or(z.literal(""));

export const createClienteSchema = z.object({
  razaoSocial: z.string().trim().min(3, "Razao social/nome deve ter no minimo 3 caracteres"),
  nomeFantasia: optionalText(200),
  cnpj: z
    .string()
    .trim()
    .optional()
    .or(z.literal(""))
    .refine((value) => !value || validateCNPJ(value), "CNPJ invalido"),
  cpf: z
    .string()
    .trim()
    .optional()
    .or(z.literal(""))
    .refine((value) => !value || validateCPF(value), "CPF invalido"),
  municipio: optionalText(120),
  uf: z
    .string()
    .trim()
    .max(2, "UF deve ter 2 caracteres")
    .optional()
    .or(z.literal("")),
  tipo: z.string().trim().min(1, "Tipo e obrigatorio"),
  ativo: z.enum(["S", "N"]),
});

export const createEmpresaSchema = z.object({
  nomeempresa: z.string().trim().min(3, "Nome da empresa deve ter no minimo 3 caracteres"),
  nomefantasia: optionalText(200),
  nucnpj: z
    .string()
    .trim()
    .optional()
    .or(z.literal(""))
    .refine((value) => !value || validateCNPJ(value), "CNPJ invalido"),
  codgrupoempresa: optionalText(30),
  uf: z
    .string()
    .trim()
    .max(2, "UF deve ter 2 caracteres")
    .optional()
    .or(z.literal("")),
  ativo: z.enum(["S", "N"]),
});

export const createCentroCustoSchema = z.object({
  nomecentrocusto: z.string().trim().min(3, "Nome do centro de custo deve ter no minimo 3 caracteres"),
  nomeempresa: optionalText(200),
  ativo: z.enum(["S", "N"]),
});

export const createContaCorrenteSchema = z.object({
  nomeconta: z.string().trim().min(3, "Nome da conta deve ter no minimo 3 caracteres"),
  banco: z.string().trim().min(2, "Banco e obrigatorio"),
  agencia: z.string().trim().min(2, "Agencia e obrigatoria"),
  conta: z.string().trim().min(2, "Conta e obrigatoria"),
  digito: optionalText(10),
  ativo: z.enum(["S", "N"]),
});

export const getFirstValidationError = (error: unknown, fallback: string): string => {
  if (error instanceof z.ZodError && error.issues.length > 0) {
    return error.issues[0]?.message ?? fallback;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
};
