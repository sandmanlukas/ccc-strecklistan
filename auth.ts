import { prisma } from "@/app/lib/db";
import { User } from '@prisma/client';
import NextAuth, { Session } from "next-auth";
const bcrypt = require('bcryptjs');

import CredentialsProvider from "next-auth/providers/credentials";

// declare module "next-auth" {
    interface CredentialsUser extends Omit<User, 'id' | 'password' | 'createdAt' | 'updatedAt' > {
        id: string,
    }

//     interface Credentials {
//         username: string,
//         password: string,
//     }
// }

export const authOptions = {
    // adapter: PrismaAdapter(prisma),

    // cookies: cookies,
    session: {
        strategy: "jwt" as const,
    },
    secret: process.env.NEXT_AUTH_SECRET,
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Användarnamn", type: "text" },
                password: { label: "Lösenord", type: "password" },
            },
            async authorize(credentials, req) {
                if (!credentials?.username || !credentials?.password) {
                    throw new Error('Du måste ange både användarnamn och lösenord');
                }

                const user = await prisma.user.findUnique({
                    where: {
                        username: credentials.username.toString(),
                    },
                });


                if (!user) {
                    throw new Error('Användarnamnet eller lösenordet var fel!');

                }

                if (!(await bcrypt.compare(credentials.password.toString(), user.password))) {
                    throw new Error('Användarnamnet eller lösenordet var fel!');

                }

                return {
                    id: user.id.toString(),
                    username: user.username,
                    role: user.role,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    isKadaver: user.isKadaver,
                    email: user.email,
                } as CredentialsUser;
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }: { token: any, user: any }){
            if (user) {
                token.id = user.id;
                token.username = user.username;
                token.role = user.role;
                token.firstName = user.firstName;
                token.lastName = user.lastName;
                token.isKadaver = user.isKadaver;
                token.email = user.email;
            }
            return token;
        },
        async session({ session, token }: { session: Session, token: any }){
            session.user = token;
            return session;
        },
    }
};

export const {
    handlers: { GET, POST },
    auth,
} = NextAuth(authOptions);

