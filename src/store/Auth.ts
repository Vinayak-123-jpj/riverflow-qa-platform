import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist } from "zustand/middleware";

import {AppwriteException, ID, Models} from "appwrite"
import { account } from "@/models/client/config";


export interface UserPrefs {
  reputation: number
}

interface IAuthStore {
  session: Models.Session | null;
  jwt: string | null
  user: Models.User<UserPrefs> | null
  hydrated: boolean

  setHydrated(): void;
  verfiySession(): Promise<void>;
  login(
    email: string,
    password: string
  ): Promise<
  {
    success: boolean;
    error?: AppwriteException| null
  }>
  createAccount(
    name: string,
    email: string,
    password: string
  ): Promise<
  {
    success: boolean;
    error?: AppwriteException| null
  }>
  logout(): Promise<void>
}


export const useAuthStore = create<IAuthStore>()(
  persist(
    immer((set) => ({
      session: null,
      jwt: null,
      user: null,
      hydrated: false,

      setHydrated() {
        set({hydrated: true})
      },

      async verfiySession() {
        try {
          const user = await account.get<UserPrefs>()
          const sessions = await account.listSessions()
          const currentSession = sessions.sessions[0] || null
          set({session: currentSession, user})
        } catch (error) {
          console.log(error)
        }
      },

      async login(email: string, password: string) {
        try {
          console.log('Attempting login with:', email);
          const session = await account.createEmailPasswordSession(email, password)
          console.log('Session created:', session);
          
          // In Appwrite v15, the session is automatically set on the client
          // We need to get the user using the authenticated session
          const user = await account.get<UserPrefs>()
          console.log('User retrieved:', user);
          
          const {jwt} = await account.createJWT()
          console.log('JWT created:', jwt);
          
          if (!user.prefs?.reputation) {
            await account.updatePrefs<UserPrefs>({ reputation: 0 })
            console.log('User preferences initialized');
          }

          set({session, user, jwt})
          console.log('Login successful, state updated');
          
          return { success: true }

        } catch (error) {
          console.error('Login failed:', error);
          if (error instanceof AppwriteException) {
            console.error('Appwrite error details:', {
              message: error.message,
              type: error.type,
              code: error.code,
              response: error.response
            });
          }
          return {
            success: false,
            error: error instanceof AppwriteException ? error: null,
          }
        }
      },

      async createAccount(name:string, email: string, password: string) {
        try {
          console.log('Creating account with:', { name, email });
          const result = await account.create(ID.unique(), email, password, name)
          console.log('Account created successfully:', result);
          return {success: true}
        } catch (error) {
          console.error('Account creation failed:', error);
          if (error instanceof AppwriteException) {
            console.error('Appwrite error details:', {
              message: error.message,
              type: error.type,
              code: error.code,
              response: error.response
            });
          }
          return {
            success: false,
            error: error instanceof AppwriteException ? error: null,
          }
        }
      },

      async logout() {
        try {
          await account.deleteSession('current')
          set({session: null, jwt: null, user: null})
        } catch (error) {
          console.log(error)
        }
      },
    })),
    {
      name: "auth",
      onRehydrateStorage(){
        return (state, error) => {
          if (!error) state?.setHydrated()
        }
      }
    }
  )
)