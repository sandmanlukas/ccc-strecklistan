import { prisma } from "@/app/lib/db";
import { AccountRole } from '@prisma/client';
import NextAuth, { NextAuthConfig, Session, User } from "next-auth";
const bcrypt = require('bcryptjs');

import CredentialsProvider from "next-auth/providers/credentials";
import { NextRequest } from "next/server";


declare module "next-auth" {
    interface User {
        username?: string;
        firstName?: string;
        lastName?: string;
        role?: AccountRole;
        error?: string;
    }
}

export const authOptions = {
    // adapter: PrismaAdapter(prisma),

    // cookies: cookies,
    session: {
        strategy: "jwt" as const,
    },
    secret: process.env.NEXT_AUTH_SECRET,
    pages: {
        signIn: '/auth/signin',
        error: '/auth/signin',
    },
    providers: [
        CredentialsProvider({
            name: "Credentials",
            async authorize(credentials, req): Promise<User> {
                if (!credentials?.username || !credentials?.password) {
                    return { error: 'Användarnamn eller lösenord saknas!' }
                }

                const user = await prisma.account.findUnique({
                    where: {
                        username: credentials.username.toString(),
                    },
                });


                if (!user) {
                    return { error: 'Användarnamnet eller lösenordet var fel!' };
                }

                if (!(await bcrypt.compare(credentials.password.toString(), user.password))) {
                    return { error: 'Användarnamnet eller lösenordet var fel!' };
                }

                return {
                    id: user.id.toString(),
                    username: user.username,
                    role: user.role,
                };
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }: { token: any, user: any }) {
            if (user) {
                token.id = user.id;
                token.username = user.username;
                token.role = user.role;
            }
            return token;
        },
        async session({ session, token }: { session: Session, token: any }) {
            session.user = token;
            return session;
        },
        authorized(params: { request: NextRequest, auth: Session | null }) {
            return !!params.auth?.user;
        },
        signIn(params: { user: User }) {
            if (params.user?.error) {
                throw new Error(params.user.error);
            }
            return true;
        }
    }
} satisfies NextAuthConfig;

export const {
    handlers: { GET, POST },
    auth,
} = NextAuth(authOptions);

