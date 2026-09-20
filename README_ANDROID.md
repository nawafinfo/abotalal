# Android Java / Code Assist

## Build

Open the repository at the folder containing `settings.gradle`, then run:

```text
:app:assembleDebug
```

The app uses Java 17, AndroidX, compileSdk 34 and Android Gradle Plugin 8.6.1.

## Supabase setup

The URL is already configured in `gradle.properties`. Add the **public anon key** from Supabase to the same file:

```properties
SUPABASE_ANON_KEY=eyJ...
```

Do not use a Supabase service-role key in an Android application. The anon key is intended for client applications; protect all data with Supabase Row Level Security policies.

Authentication uses Supabase Auth REST endpoints with Retrofit and sends the required `apikey` and `Authorization` headers. Registration follows the Supabase email-confirmation setting: if email confirmation is enabled, the user must confirm their email before logging in.

## Features

- Java Login/Register with validation and loading state
- Supabase session persistence using SharedPreferences
- Navigation Drawer
- Bottom Navigation
- Home, Services, Booking, Contact and Account screens
- Arabic RTL layout

## Code Assist notes

If Code Assist does not have SDK 34 installed, install Android SDK Platform 34 and Build Tools 34.0.0, or change `compileSdk` and `targetSdk` to an installed SDK version. No Kotlin, Compose, Firebase, or generated code is required.
