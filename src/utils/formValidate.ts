import { z } from "zod";

export const transactionSchema = z.object({
  type: z.string().min(1, "Tipo de transação é obrigatório"),
  description: z.string().min(1, "Descrição é obrigatória"),
  amount: z.number().positive("Valor deve ser positivo").int("Valor deve ser um número inteiro"),
  category: z.string().min(1, "Categoria é obrigatória"),
});

