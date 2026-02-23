import { jwtDecode } from "jwt-decode";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          // Call your NestJS login API
          const res = await fetch("http://localhost:3000/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          const data = await res.json();

          if (!res.ok) {
            // Pass backend message here
            throw new Error(data.message || "Login failed");
          }
          if (res.ok && data.success) {
          // 2. Decode the token to get user details (id, email, username)
          const decoded = jwtDecode(data.accessToken);
          
          // 3. Return an object that includes the token and the user data
          return {
            id: decoded.id,
            email: decoded.email,
            username: decoded.username,
            accessToken: data.accessToken,
          };
          }

        } catch (error) {
          console.error("Error in authorize:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt", // stores session in a secure JWT cookie
     maxAge: 60 * 60 * 2, //  2 hours
  },
    jwt: {
    maxAge: 60 * 60 * 2, // 2 hours
  },
  pages: {
    signIn: "/login", // custom login page
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.accessToken = user.accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.accessToken = token.accessToken;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
