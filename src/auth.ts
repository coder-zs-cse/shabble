import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { upsertGoogleUser } from "@/services";

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],
    secret: process.env.AUTH_SECRET,
    callbacks: {
        async signIn({ user, account }) {
            if (account?.provider === "google" && account.providerAccountId) {
                const dbUserId = await upsertGoogleUser({
                    providerId: account.providerAccountId,
                    name: user.name,
                    email: user.email,
                });
                // Store our DB userId on the token
                (user as typeof user & { dbUserId: string }).dbUserId = dbUserId;
            }
            return true;
        },
        async jwt({ token, user }) {
            if (user && (user as typeof user & { dbUserId?: string }).dbUserId) {
                token.dbUserId = (user as typeof user & { dbUserId: string }).dbUserId;
            }
            return token;
        },
        async session({ session, token }) {
            if (token.dbUserId) {
                session.user.id = token.dbUserId as string;
            }
            return session;
        },
    },
    pages: {
        signIn: "/login",
    },
});
