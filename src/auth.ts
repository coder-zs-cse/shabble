import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { linkProviderToUser } from "@/services";

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],
    callbacks: {
        async jwt({ token, account }) {
            if (account?.provider && account.providerAccountId) {
                const dbUserId = await linkProviderToUser(
                    account.provider,
                    account.providerAccountId,
                    token.name ?? null,
                    token.email ?? null,
                );
                token.dbUserId = dbUserId;
            }
            return token;
        },
        async session({ session, token }) {
            if (token.dbUserId) {
                (session.user as { dbUserId?: string }).dbUserId = token.dbUserId as string;
            }
            return session;
        },
    },
});
