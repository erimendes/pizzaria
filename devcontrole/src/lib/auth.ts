import { PrismaAdapter } from "@auth/prisma-adapter";
// Importa o adaptador Prisma para integração com a autenticação

import GoogleProvider from "next-auth/providers/google";
// Importa o provedor Google para autenticação

import { AuthOptions } from "next-auth";
// Importa o tipo `AuthOptions` do NextAuth para tipagem das opções de autenticação

import prismaClient from "./prisma";
// Importa o cliente Prisma configurado

export const authOptions: AuthOptions = {
  // Define as opções de autenticação para o NextAuth
  adapter: PrismaAdapter(prismaClient),
  // Configura o adaptador Prisma com o cliente Prisma

  providers: [
    // Define os provedores de autenticação
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      // Usa a variável de ambiente `GOOGLE_CLIENT_ID` como o ID do cliente Google

      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      // Usa a variável de ambiente `GOOGLE_CLIENT_SECRET` como o segredo do cliente Google
    }),
  ],

  callbacks: {
    // Define callbacks para eventos específicos durante o fluxo de autenticação

    async session({ session, token, user }) {
      // Callback chamado durante a criação da sessão

      session.user = { ...session.user, id: user.id } as {
        // Adiciona o ID do usuário à sessão
        id: string;
        name: string;
        email: string;
      };

      return session;
      // Retorna a sessão atualizada
    },
  },
};
