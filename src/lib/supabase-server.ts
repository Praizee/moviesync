import { createServerClient as createClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createServerClient() {
  const cookieStore = await cookies();

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        // eslint-disable-next-line  @typescript-eslint/no-explicit-any
        set(name: string, value: string, options: any) {
          cookieStore.set({ name, value, ...options });
        },
        // eslint-disable-next-line  @typescript-eslint/no-explicit-any
        remove(name: string, options: any) {
          cookieStore.set({ name, value: "", ...options });
        },
      },
    }
  );
}

// import { createServerClient as createClient } from "@supabase/ssr"
// import { cookies } from "next/headers"

// export function createServerClient() {
//   const cookieStore = cookies()

//   return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
//     cookies: {
//       get(name: string) {
//         return cookieStore.get(name)?.value
//       },
//       set(name: string, value: string, options: any) {
//         cookieStore.set({ name, value, ...options })
//       },
//       remove(name: string, options: any) {
//         cookieStore.set({ name, value: "", ...options })
//       },
//     },
//   })
// }

