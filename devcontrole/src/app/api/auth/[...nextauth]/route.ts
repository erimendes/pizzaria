import NextAuth from "next-auth";
// Importa a função NextAuth do pacote next-auth, que é usada para configurar a autenticação

import { authOptions } from "@/lib/auth";
// Importa as opções de autenticação definidas anteriormente de um módulo local

const handler = NextAuth(authOptions);
// Cria um manipulador (handler) para a autenticação usando as opções fornecidas

export { handler as GET, handler as POST };
// Exporta o manipulador para lidar com requisições HTTP GET e POST
