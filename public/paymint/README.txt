PayMint distribution assets
===========================

Current release:
  paymint-latest.apk   →  v1.0  ·  6.5 MB  ·  com.nibir.vault
  paymint-v1.0.apk     →  versioned archive (kept for history)

The product page at /products/paymint links to /paymint/paymint-latest.apk.

Releasing a new APK shell version (rare — only for native changes):
  1. Build a signed release APK in Android Studio
     Source: <PayMint repo>/android/app/release/app-release.apk
  2. Replace this folder's `paymint-latest.apk` with the new build.
  3. Save a versioned copy as `paymint-vX.Y.apk` next to it.
  4. Update the "v1.0 · 6.5 MB · APK" label in:
       src/components/sections/paymint/PayMintHero.tsx
       src/components/sections/paymint/PayMintCTA.tsx
  5. git add . && git commit && git push
     Vercel auto-deploys on push to main.

Note: most PayMint updates flow OTA via Firebase Hosting and do NOT require
a new APK. Only rebuild when the native shell itself changes (icon, splash,
permissions, plugins, target SDK).
