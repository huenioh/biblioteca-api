import { z } from "zod";

const livroSchema = z.object({
  titulo: z.string().min(1, { message: "O título é obrigatório" }),
  autor: z.string().min(1, { message: "O autor é obrigatório" }),
  genero: z.string().min(1, { message: "O gênero é obrigatório" }),
  ano_publicacao: z
    .string()
    .regex(/^\d{4}$/, { message: "O ano de publicação deve ter 4 dígitos" })
    .transform((val) => parseInt(val)),
});

export default livroSchema;
