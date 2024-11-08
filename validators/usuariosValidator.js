import { z } from "zod";

const usuarioSchema = z.object({
  nome: z.string().min(1, { message: "O nome é obrigatório" }),
  endereco: z.string().min(1, { message: "O endereço é obrigatório" }),
  email: z.string().email({ message: "O e-mail deve ser válido" }),
  telefone: z.string().regex(/^\d{10,15}$/, {
    message: "O telefone deve ter entre 10 e 15 dígitos numéricos",
  }),
});

export default usuarioSchema;
