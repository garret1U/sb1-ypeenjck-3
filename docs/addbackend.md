# Updated `addbackend.md` (Step-by-Step Implementation Guide)

Below is a revised plan for implementing the multi-tenant, role-based Supabase backend.

## 1. Remove Clerk & Set Up Supabase Auth

1. **Uninstall Clerk**  
   - Remove any references to `@clerk/clerk-react`, `SignUp`, `SignIn` pages, or Clerk providers.  
   - Remove Clerk environment variables.

2. **Add Supabase Auth**  
   - In `package.json`, ensure you have:  
     ```bash
     npm install @supabase/supabase-js
     ```
   - Create `supabaseClient.ts` in `src/`.  
   - In your React code, build sign-in & sign-up forms with Supabase’s auth endpoints (`supabase.auth.signUp`, `supabase.auth.signInWithPassword`, etc.).  
   - Alternatively, use a minimal passwordless (magic link) approach if desired.

3. **User ID**  
   - After login, the user’s ID is available via `supabase.auth.getSession()` or `onAuthStateChange()`.  
   - Store it in global state (e.g., a React context).  
   - This `auth.uid()` is the reference used in RLS policies.

## 2. Configure Database and Roles

1. **Create Tables**  
   - In **Supabase Studio** → **Table editor** or via the **SQL Editor**, create:  
     - `clubs`, `memberships`, `shooters`, `scores`, `guns`, `fields`, etc.  
   - Make sure each table has the columns and constraints shown in `backend.md`.

2. **Insert Role Enum**  
   - You might create a Postgres enum `'admin'`, `'coach'`, `'member'` or just store it as `text`.

3. **Enable RLS**  
   - For each table, run SQL:
     ```sql
     alter table memberships enable row level security;
     create policy "Allow user to see own membership"
       on memberships
       for select
       using ( user_id = auth.uid() )
       with check ( user_id = auth.uid() );
     ```
   - Similarly for `shooters`, `scores`, `guns`, etc. with more advanced logic to allow same-club reads.  
   - Example RLS for `scores` (read):
     ```sql
     alter table scores enable row level security;
     create policy "Allow same-club read"
       on scores
       for select
       using (
         exists (
           select 1
           from shooters s
           join memberships m on s.membership_id = m.id
           where s.id = scores.shooter_id
             and m.club_id in (
               select club_id
               from memberships
               where user_id = auth.uid()
             )
         )
       );
     ```
   - You’ll define similar insert/update policies so that only the shooter or an admin can modify.

## 3. Multi-Club Flow & Role Assignment

1. **When a new user signs up**:  
   - They have no memberships by default.  
   - An admin or a dedicated flow can **create** a membership row for them:  
     ```ts
     await supabase
       .from('memberships')
       .insert({
         user_id: userId, // from supabase.auth.getSession()
         club_id: selectedClubId,
         role: 'member',
       });
     ```
   - Then create a corresponding `shooters` record with that `membership_id`.

2. **Switching Clubs**  
   - Query `memberships` for `user_id = auth.uid()` to get a list of clubs.  
   - Let the user pick from a dropdown.  
   - Keep `selectedClubId` in React context, filter queries accordingly.

3. **Club Admin**  
   - If `role = 'admin'`, that user can create more memberships or update fields, etc.  
   - The Admin can see a list of all memberships for the club and can upgrade a user to “coach,” etc.

4. **Coach**  
   - A “coach” can see all shooters in the club (like an admin) but might be restricted from editing certain club details. You can refine the RLS policies or app logic (e.g., no edit for fields or club name) to enforce that.

## 4. Frontend Hooks Conversion

1. **General Approach**  
   - Remove any local `mockShooters` or `.json` usage.  
   - In each custom hook (`useShooters`, `useScores`, etc.), replace local state with Supabase queries.  
   - Example (`useShooters`):
     ```ts
     import { useEffect, useState } from 'react';
     import { supabase } from '../supabaseClient';

     export function useShooters(selectedClubId: string) {
       const [shooters, setShooters] = useState([]);
       const [loading, setLoading] = useState(true);

       useEffect(() => {
         if (!selectedClubId) return;

         const fetchData = async () => {
           setLoading(true);
           const { data, error } = await supabase
             .from('shooters')
             .select('*, memberships!inner(*)')
             .eq('memberships.club_id', selectedClubId);

           if (error) console.error(error);
           else setShooters(data || []);
           setLoading(false);
         };

         fetchData();
       }, [selectedClubId]);

       return { shooters, loading };
     }
     ```
   - Similarly for **`useScores`, `useGuns`, `useFields`**, etc.

2. **OrganizationLeaderboard**  
   - Instead of a static `mockLeaderboardData`, run queries to get aggregated stats (`COUNT(*), AVG(total_score)`, etc.), or do it in the front-end from the raw scores.

3. **Remove** `scores.json` & `shooters.json` from the codebase.

## 5. Netlify Deployment & Env Variables

1. **Set Env Variables in Netlify**  
   - In your Netlify project, go to **Site Settings** → **Build & Deploy** → **Environment**.  
   - Add:
     ```
     VITE_SUPABASE_URL=<your-supabase-url>
     VITE_SUPABASE_ANON_KEY=<your-anon-key>
     ```
   - (Optional) If you plan on using any serverless Edge Functions, you might store the `SERVICE_ROLE_KEY` in Netlify but **never** expose it to the browser.

2. **Build Command**  
   - Already set to `npm run build` or similar. Ensure your `netlify.toml` is correct:
     ```toml
     [build]
       command = "npm run build"
       publish = "dist"

     [build.environment]
       NODE_VERSION = "20"
     ```

3. **Redeploy**  
   - Once you deploy, Netlify uses those environment variables at build time.  
   - Verify your frontend can connect to Supabase in production.

## 6. Testing & Webhooks

1. **Local**  
   - Test the entire flow: sign up → create membership → create shooter → add scores, etc.  
   - Check the **Supabase Table editor** to confirm data is inserted.

2. **RLS**  
   - Attempt to query shooters from a different user to confirm they can’t see data from clubs they don’t belong to.

3. **Webhooks** (Future)  
   - To handle “score posted” or “shooter joined” events, create a **Postgres function** or **Edge Function** that triggers on `INSERT` to the `scores` or `shooters` table.  
   - For now, keep it minimal.

## 7. Future Steps

- Implement the **Competition** suite (tables, scheduling, bracket logic) when ready.  
- Add **payment** or subscription logic for Club Admin.  
- Possibly add **materialized views** if large data sets cause performance issues.

---

## Summary

By following these updated **`backend.md`** and **`addbackend.md`** guidelines, you’ll achieve a **multi-tenant** Supabase-based backend with **Club Admin / Coach / Member** roles, a **1-to-1** user-shooter concept, and the ability for users to **switch between clubs** they belong to. 

All **Clerk** code is removed, replaced fully by **Supabase Auth** and **RLS**. The **frontend** transitions to calling Supabase for all data (scores, shooters, guns, fields), while respecting each club’s isolation and role-based privileges. Finally, you’ll deploy seamlessly to **Netlify**, ensuring environment variables and build steps are configured to load the Supabase keys.