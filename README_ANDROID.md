# Code Assist build notes

Open this folder as the project root. The project uses Android Gradle Plugin 8.6.1, compileSdk 35, Java 17 and AndroidX.

The app includes:
- Native Java UI with RTL Arabic support.
- Navigation Drawer and Bottom Navigation.
- Real Supabase Auth REST calls for login and registration.
- Local secure-ish session persistence using SharedPreferences (for production, use encrypted storage).

Before release, replace the public Supabase anon key in `SupabaseClient.java` if the backend project changes. Never place a service-role key in the app.

Build task: `:app:assembleDebug`.
