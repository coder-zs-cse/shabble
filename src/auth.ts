import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { getOrCreateUserByGoogleId } from "@/services";

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],
    callbacks: {
        async jwt({ token, account }) {
            if (account?.provider === "google" && account.providerAccountId) {
                const dbUserId = await getOrCreateUserByGoogleId(
                    account.providerAccountId,
                    token.name ?? null,
                    token.email ?? null
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
