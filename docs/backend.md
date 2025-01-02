# Updated `backend.md` (Technical Specification)

## 1. Overview

This project manages **clubs** and their **memberships** within an application. Users can belong to multiple clubs, and each membership has specific roles (e.g., admin, member) that determine the user's permissions within the club. Ensuring **data security** and **access control** is paramount, achieved through **Row-Level Security (RLS)** policies in Supabase.

### Current Implementation Status

✅ **Completed**:
- Database schema with tables and relationships
- Row Level Security (RLS) policies
- Authentication system using Supabase Auth
- Multi-tenant club structure
- Role-based access control
- Frontend hooks for data access
- RLS policies for all tables
- Secure role management
- Club membership management

🚧 **In Progress**:
- Statistics and analytics functions
- Competition management features
- Advanced field management


We will integrate **Supabase** as the backend for a **multi-tenant** Gun Club Scoring Web Application. Users can belong to **one or more clubs**, each with a **role**: **Club Admin**, **Coach**, or **Member**. Each user typically corresponds to exactly one “shooter” record in that club (i.e., a 1-to-1 relationship for their own personal scores), but special roles (Club Admin, Coach) can view or edit other members’ data as needed.

**Key points**:

- **Supabase Auth** will replace Clerk.  
- **Role-based Row-Level Security (RLS)** will control read/write access.  
- **Shared schema with row-level isolation** ensures each club’s data is private to its members (but members can see each other’s stats).

## 2. Database Schema

### 2.1. Tables and Relationships

1. **Users Table (`users`)**
   - Managed by Supabase Auth in `auth.users` automatically
   - Additional fields stored in public.users if needed
   - One-to-Many with `memberships`

2. **Clubs Table (`clubs`)**
   - Represents different clubs within the application
   - One-to-Many with `memberships`
   - Contains club details and settings

3. **Memberships Table (`memberships`)**
   - Associates users with clubs and defines roles
   - Many-to-One with both `users` and `clubs`
   - Stores role information and join date

4. **Related Tables**
   - Fields Table (`fields`)
   - Maintenance Schedule Table (`maintenance_schedule`) 
   - Club Games Table (`club_games`)
   - Membership Requests Table (`membership_requests`)

### 2.1. Implemented Tables

All core tables have been created and are functioning:

1. **clubs** - Club information and settings
   ```sql
   CREATE TABLE clubs (
     id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
     name text NOT NULL,
     address text,
     phone text,
     email text,
     website text,
     description text,
     founded text,
     member_count integer DEFAULT 0,
     created_at timestamptz DEFAULT now()
   );
   ```

2. **memberships** - Multi-tenant access control
   ```sql
   CREATE TABLE memberships (
     id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
     user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
     club_id uuid REFERENCES clubs(id) ON DELETE CASCADE,
     role user_role NOT NULL DEFAULT 'member',
     created_at timestamptz DEFAULT now(),
     UNIQUE(user_id, club_id)
   );
   ```

3. **shooters** - Individual shooter profiles
   ```sql
   CREATE TABLE shooters (
     id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
     membership_id uuid REFERENCES memberships(id) ON DELETE CASCADE,
     name text NOT NULL,
     joined_date date DEFAULT CURRENT_DATE,
     status text DEFAULT 'active',
     average numeric(5,2) DEFAULT 0,
     straights integer DEFAULT 0,
     longest_streak integer DEFAULT 0,
     created_at timestamptz DEFAULT now()
   );
   ```

4. **scores** - Score tracking with bird details
   ```sql
   CREATE TABLE scores (
     id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
     shooter_id uuid REFERENCES shooters(id) ON DELETE CASCADE,
     gun_id uuid REFERENCES guns(id) ON DELETE SET NULL,
     game text NOT NULL,
     gauge text NOT NULL,
     date timestamptz DEFAULT now(),
     starting_stand integer,
     total_score integer NOT NULL,
     birds jsonb NOT NULL,
     created_at timestamptz DEFAULT now()
   );
   ```

5. **guns** - Gun configurations
   ```sql
   CREATE TABLE guns (
     id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
     shooter_id uuid REFERENCES shooters(id) ON DELETE CASCADE,
     name text NOT NULL,
     brand text NOT NULL,
     gauge text NOT NULL,
     barrel_config jsonb NOT NULL,
     model text,
     barrel_length integer,
     action text,
     notes text,
     is_primary boolean DEFAULT false,
     created_at timestamptz DEFAULT now()
   );
   ```

6. **fields** and **maintenance_schedule** - Field management
   ```sql
   CREATE TABLE fields (
     id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
     club_id uuid REFERENCES clubs(id) ON DELETE CASCADE,
     name text NOT NULL,
     availability text NOT NULL DEFAULT 'available',
     configurations jsonb,
     created_at timestamptz DEFAULT now()
   );
   ```

### 2.2. Implemented RLS Policies

Key policies are in place:

1. **Clubs**
   ```sql
   -- Users can view clubs they belong to
   CREATE POLICY "Users can view clubs they belong to"
     ON clubs FOR SELECT
     USING (
       EXISTS (
         SELECT 1 FROM memberships
         WHERE memberships.club_id = clubs.id
         AND memberships.user_id = auth.uid()
       )
     );

   -- Club admins can update club details
   CREATE POLICY "admin_update_club"
     ON clubs FOR UPDATE
     USING (
       EXISTS (
         SELECT 1 FROM memberships m
         WHERE m.club_id = clubs.id
         AND m.user_id = auth.uid()
         AND m.role = 'admin'
       )
     )
     WITH CHECK (
       EXISTS (
         SELECT 1 FROM memberships m
         WHERE m.club_id = clubs.id
         AND m.user_id = auth.uid()
         AND m.role = 'admin'
       )
     );
   ```

2. **Memberships**
   ```sql
   -- Users can view their own memberships
   CREATE POLICY "view_own_memberships"
     ON memberships FOR SELECT
     USING (user_id = auth.uid());

   -- Users can update their own membership
   CREATE POLICY "update_own_memberships"
     ON memberships FOR UPDATE
     USING (user_id = auth.uid())
     WITH CHECK (user_id = auth.uid());

   -- Admins can view all memberships in their clubs
   CREATE POLICY "admin_view_memberships"
     ON memberships FOR SELECT
     USING (
       EXISTS (
         SELECT 1 FROM memberships m2
         WHERE m2.club_id = memberships.club_id
           AND m2.user_id = auth.uid()
           AND m2.role = 'admin'
       )
     );

   -- Admins can manage memberships in their clubs
   CREATE POLICY "admin_manage_memberships"
     ON memberships FOR ALL
     USING (
       EXISTS (
         SELECT 1 FROM memberships m2
         WHERE m2.club_id = memberships.club_id
           AND m2.user_id = auth.uid()
           AND m2.role = 'admin'
       )
     )
     WITH CHECK (
       EXISTS (
         SELECT 1 FROM memberships m2
         WHERE m2.club_id = memberships.club_id
           AND m2.user_id = auth.uid()
           AND m2.role = 'admin'
       )
     );
   ```

3. **Score Management**
   ```sql
   CREATE POLICY "Users can view scores in their clubs"
     ON scores FOR SELECT
     USING (EXISTS (
       SELECT 1 FROM shooters s
       JOIN memberships m1 ON s.membership_id = m1.id
       JOIN memberships m2 ON m1.club_id = m2.club_id
       WHERE s.id = scores.shooter_id
       AND m2.user_id = auth.uid()
     ));
   ```

4. **Gun Management**
   ```sql
   CREATE POLICY "Users can manage their own guns"
     ON guns FOR ALL
     USING (EXISTS (
       SELECT 1 FROM shooters s
       JOIN memberships m ON s.membership_id = m.id
       WHERE s.id = guns.shooter_id
       AND m.user_id = auth.uid()
     ));
   ```


Below is a refined schema to support:

1. **Users**  
2. **Clubs**  
3. **Membership** (user-to-club with role)  
4. **Shooters** (1-to-1 with user for each club, but coaches/admins can see all)  
5. **Scores**  
6. **Guns**  
7. **Fields** (with maintenance schedule)  
8. **Other supporting tables** (club games, etc.)

### 2.1. Proposed Tables

1. **users**  
   - Managed by Supabase Auth in `auth.users` automatically.  
   - We can create a **public.users** table to store additional fields (if needed).  
   - **id**: `uuid` (PK) referencing `auth.users.id`.  
   - **full_name**: text.  
   - **created_at**: timestamp (default now).  
   - Additional columns as needed (email, avatar, etc.) or rely on `auth.users` for that.

2. **clubs**  
   - **id**: `uuid` PK.  
   - **name**: text.  
   - **address**: text (nullable).  
   - **phone**, **email**, **website**, **description**, **founded**, **member_count**.  
   - **created_at**: timestamp (default now).

3. **memberships**  
   - **id**: `uuid` PK.  
   - **user_id**: `uuid` FK → `users.id`.  
   - **club_id**: `uuid` FK → `clubs.id`.  
   - **role**: text enum: `'admin' | 'coach' | 'member'`.  
   - **created_at**: timestamp (default now).

   > A single **user** can have multiple **memberships** in different clubs. This is the core pivot table to handle multi-tenant and roles.

4. **shooters**  
   - **id**: `uuid` PK.  
   - **membership_id**: `uuid` FK → `memberships.id`.  
   - **name**: text  
   - **joined_date**: date  
   - **status**: text (e.g. `'active' | 'inactive'`), default `'active'`.  
   - **average**, **straights**, **longest_streak**: numeric fields.  
   - **created_at**: timestamp (default now).

   > Typically, a user who is a “Member” in a club has **one** shooter record there. A **Coach** or **Admin** will also have a shooter record for themselves but can see others. (If you want the Coach to represent multiple shooters themselves, that’s more advanced, but we can keep it 1-to-1 for the user’s own personal shooting identity.)

5. **scores**  
   - **id**: `uuid` PK.  
   - **shooter_id**: `uuid` FK → `shooters.id`.  
   - **gun_id**: `uuid` FK → `guns.id`, nullable if no gun used.  
   - **game**: text enum (`Skeet`, `Trap`, etc.).  
   - **gauge**: text (`'12' | '20' | '28' | '.410'`).  
   - **date**: timestamp (default now).  
   - **starting_stand**: integer (nullable).  
   - **total_score**: integer (0–25).  
   - **birds**: `jsonb` (array of shot results).  
   - **created_at**: timestamp (default now).

   > **Reading**: All members of the same club as the shooter can see these scores.  
   > **Writing**: Only the shooter themself or an admin can update.

6. **guns**  
   - **id**: `uuid` PK.  
   - **shooter_id**: `uuid` FK → `shooters.id`.  
   - **name**: text  
   - **brand**: text  
   - **gauge**: text  
   - **barrel_config**: `jsonb` (choke info, etc.)  
   - **model**: text (nullable)  
   - **barrel_length**: integer (nullable)  
   - **action**: text (nullable)  
   - **notes**: text (nullable)  
   - **is_primary**: boolean (default false)  
   - **created_at**: timestamp (default now).

   > Alternatively, if each user can share guns across all clubs, you might link `guns` to `user_id`. But if the guns are typically club-specific or you want the entire club to see them, you might keep it under `shooter_id`.

7. **fields**  
   - **id**: `uuid` PK.  
   - **club_id**: `uuid` FK → `clubs.id`.  
   - **name**: text  
   - **availability**: text enum (`'available' | 'under_maintenance'`).  
   - **configurations**: `jsonb` (trap angles, 5-Stand, etc.)  
   - **created_at**: timestamp (default now).

8. **maintenance_schedule**  
   - **id**: `uuid` PK.  
   - **field_id**: `uuid` FK → `fields.id`.  
   - **maintenance_date**: date  
   - **note**: text  

9. **club_games** (if needed)  
   - **id**: `uuid` PK.  
   - **club_id**: `uuid`  
   - **game_type**: text  
   - **created_at**: timestamp (default now).

### 2.2. RLS (Row-Level Security)

1. **memberships**  
   - A user can see rows where `user_id = auth.uid()`.  
   - Admin can see membership rows for their own club.  
   - For multi-club scenario, we create policies that let you see membership rows for your own user or for clubs where you’re an admin.

2. **shooters**  
   - A user can see all shooters belonging to any club where they also have membership.  
   - For example, `shooters -> memberships -> club_id` must match a `club_id` that the user is a member of.  
   - An admin or coach in that club can see all shooters.  
   - A normal member can also see all shooters in their club (the user requested that all members see each other’s stats).

3. **scores**  
   - A user can see `scores` if `scores.shooter_id` → `shooters.membership_id` is in the same club as the user.  
   - Insert/update for your own scores if you’re the shooter. Insert/update for other shooters if you’re an admin. (Coach editing might be restricted or allowed per your preferences.)

4. **guns**  
   - Similar to `scores`. Everyone in the club can read them. Only the shooter or an admin can edit them.

5. **fields**  
   - Tied to a `club_id`. Anyone in that club can read them; only the admin can edit.

**Implementation**:  
- Enable RLS on each table.  
- Create policies for select, insert, update, delete.  
- Use the user’s JWT with `auth.uid()` to link to `memberships`.

## 3. Role Definitions

### Access Control Requirements

1. **Regular Users:**
   - View clubs they belong to
   - Manage own membership
   - Submit membership requests

2. **Club Admins:**
   - Manage memberships within their club
   - Manage club data (fields, schedules, games)
   - Handle membership requests

### Implemented Roles

The system uses a custom enum type:
```sql
CREATE TYPE user_role AS ENUM ('admin', 'coach', 'member');
```

Current permissions matrix:

| Permission          | Admin | Coach | Member |
|-------------------|-------|--------|---------|
| View Club Data    | ✅    | ✅     | ✅      |
| Manage Club       | ✅    | ❌     | ❌      |
| View Shooters     | ✅    | ✅     | ✅      |
| Manage Shooters   | ✅    | ✅     | ❌      |
| View Scores       | ✅    | ✅     | ✅      |
| Manage Own Scores | ✅    | ✅     | ✅      |
| Manage All Scores | ✅    | ✅     | ❌      |
| Manage Fields     | ✅    | ❌     | ❌      |


### Best Practices for RLS Configuration

1. **Minimal and Clear Policies:**
   - Define only necessary policies
   - Use clear and descriptive names

2. **Avoid Cross-Table References:**
   - Limit RLS policies to single-table checks
   - Prevent circular dependencies

3. **Use Inline Subqueries:**
   - Prefer inline EXISTS subqueries
   - Avoid external functions

4. **Regular Audits:**
   - Review policies periodically
   - Remove outdated policies

- **admin**: Full read/write on everything within the club.  
- **coach**: Full read of all shooters in the club, but partial write constraints (cannot change club details or fields?).  
- **member**: Full read of the club data, can only write their own scores/guns, can’t edit other members or club settings.

## 4. Authentication & Removal of Clerk

### Implemented Auth Features

✅ **Completed**:
- Supabase Auth integration
- Email/password authentication
- Protected routes with `RequireAuth` component
- Auth context with user state management
- Sign in/sign up forms

Example auth flow:
```typescript
const { data, error } = await supabase.auth.signInWithPassword({
  email,
  password
});
```


- Use **Supabase Auth** (email/password, magic link, or OAuth) exclusively.  
- Migrate or remove any references to Clerk from the front-end.  
- Let Supabase handle sign-in, sign-up, and store the user’s ID in `auth.users`.

## 5. Multi-Club Switching

### Security Considerations

1. **Least Privilege Principle:**
   - Grant minimum necessary access
   - Review permissions regularly

2. **Secure Role Definitions:**
   - Manage role assignments securely
   - Prevent unauthorized escalation

3. **Audit Trails:**
   - Log critical operations
   - Monitor for suspicious activity

### Implemented Features

✅ **Completed**:
- Club context provider
- Club switcher component
- Per-club data filtering in hooks
- Role-based UI adaptations

Club switching flow:
```typescript
const { clubs, selectedClub, selectClub } = useClub();

// In ClubSwitcher component
<Menu.Item>
  <button onClick={() => selectClub(club.id)}>
    {club.name}
  </button>
</Menu.Item>
```

### Data Hooks

All data hooks respect the selected club:

```typescript
function useScores() {
  const { selectedClub } = useClub();
  
  useEffect(() => {
    if (!selectedClub) return;
    // Fetch scores for selected club
  }, [selectedClub]);
}
```


- On the frontend, after a user logs in, query `memberships` to fetch all clubs the user belongs to.  
- Provide a **club switcher** (dropdown).  
- Use a “selected club” context so that your hooks filter data for that club (e.g., `scores`, `shooters`, `fields`).  
- This eliminates the need to log out/in.

## 6. Future Competition Management

### Testing RLS Policies

1. **Unit Testing:**
   - Test each policy individually
   - Verify correct permissions

2. **Integration Testing:**
   - Test policy interactions
   - Check for unintended access

3. **Monitor Logs:**
   - Watch for RLS errors
   - Address issues promptly

🚧 **Planned Features**:
- Competition scheduling
- Bracket management
- Squad assignments
- Score tracking
- Results and rankings


- We will **not** implement it now, but we anticipate a new set of tables (competitions, squads, brackets, etc.).  
- The existing **club** and **membership** structure remains valid.

## 7. Statistics & Leaderboards

### Migration Procedures

1. **Create Migration Scripts:**
   - Organize sequentially
   - Use descriptive names

2. **Review Before Execution:**
   - Check for syntax errors
   - Verify policy changes

3. **Execute Within Transactions:**
   - Ensure atomicity
   - Verify success

### Implemented Features

✅ **Basic Statistics**:
- Average scores
- Streak tracking
- Perfect rounds

🚧 **In Progress**:
- Advanced analytics
- Trend analysis
- Historical comparisons


- Basic queries/aggregations are sufficient.  
- Example: sum/avg of `scores` per shooter.  
- All users in a club can see each other’s stats, so no special RLS restrictions on read.

## 8. Webhooks & Triggers

### Additional Resources

- [Supabase RLS Documentation](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgreSQL RLS Guide](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)
- [Supabase Support](https://supabase.com/support)

🚧 **Planned Features**:
- Score posted notifications
- Shooter joined alerts
- Field maintenance reminders
- Competition updates


- You can add **database triggers** or **Edge Functions** to handle events like “score posted” or “shooter joined.”  
- For now, we can keep it simple. But we’ll keep the schema open to add triggers in the future.

## 9. Deployment & Environment

### Current Configuration

Environment variables:
```env
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

Netlify configuration:
```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "20"
```

- Use Netlify with environment variables:  
  - `VITE_SUPABASE_URL`  
  - `VITE_SUPABASE_ANON_KEY`  
- Additional variables (if needed) for `service_role` keys or webhooks.  
- For Netlify environment setup, see more details below.