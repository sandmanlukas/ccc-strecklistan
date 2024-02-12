import { prisma } from "@/app/lib/db";
import { UserRole } from '@prisma/client';
// import { CookiesOptions, } from "next-auth";
import NextAuth, { Session, User } from "next-auth";
const bcrypt = require('bcryptjs');

import CredentialsProvider from "next-auth/providers/credentials";

declare module "next-auth" {
    interface User {
        userId: number,
        username: string,
        role: UserRole,

    }

    interface Credentials {
        username: string,
        password: string,
    }
}

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

                return { userId: user.id, username: user.username, role: user.role } as User;
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }: { token: any, user: User }) {
            if (user) {
                token.id = user.userId;
                token.username = user.username;
                token.role = user.role;
            }
            return token;
        },
        async session({ session, token }: { session: Session, token: any }) {
            session.user = token;
            return session;
        },
    }
};

export const {
    handlers: { GET, POST },
    auth,
} = NextAuth(authOptions);

