import { PrismaClient } from "@prisma/client";

// Declaração da variável `prisma` do tipo `PrismaClient`
let prisma: PrismaClient;

// Verifica se o ambiente é de produção
if (process.env.NODE_ENV === "production") {
  // Se for produção, cria uma nova instância de `PrismaClient`
  prisma = new PrismaClient();
} else {
  // Se não for produção, adiciona o `PrismaClient` ao objeto global
  // Isso é necessário para evitar múltiplas instâncias de `PrismaClient` em desenvolvimento

  // Define um tipo para o objeto global com a propriedade `prisma` do tipo `PrismaClient`
  let globalWithPrisma = global as typeof globalThis & {
    prisma: PrismaClient;
  };

  // Verifica se `prisma` já está definido no objeto global
  if (!globalWithPrisma.prisma) {
    // Se não estiver definido, cria uma nova instância de `PrismaClient` e atribui ao objeto global
    globalWithPrisma.prisma = new PrismaClient();
  }

  // Atribui a instância global de `prisma` à variável `prisma`
  prisma = globalWithPrisma.prisma;
}

// Exporta a instância de `PrismaClient` para ser utilizada em outras partes do aplicativo
export default prisma;
