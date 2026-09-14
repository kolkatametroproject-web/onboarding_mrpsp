# Firebase setup and Permission Denied fix

## Why the admin dashboard showed "Permission denied"

The dashboard reads the small `/stats` node. If your Firebase Realtime Database rules deny reads there, Firebase returns:

`Error: Permission denied`

The updated ZIP includes rules that allow authenticated users to read `/stats`.

## Publish the database rules

1. Open Firebase Console.
2. Select `onboarding-mrpsp`.
3. Open **Realtime Database**.
4. Open the **Rules** tab.
5. Replace the existing rules with the contents of `firebase.rules.json`.
6. Click **Publish**.
7. Sign in to the admin portal again.
8. Hard-refresh the GitHub Pages site with `Ctrl + F5`.

## Admin authentication

The admin login uses Firebase Authentication. Create the admin account under:

Authentication → Users → Add user

Enable Email/Password under Authentication → Sign-in method.

## Performance changes

The admin dashboard no longer downloads `/candidates` and `/results` just to calculate four numbers. It reads only:

`/stats`

This is much faster as the candidate database grows.

## Important production note

The included rules are a development-stage starting point. For a real high-stakes examination:

- Use Firebase Authentication for candidates as well as admins.
- Give each account a role such as `super_admin`, `admin`, `invigilator`, or `candidate`.
- Restrict each database path by role and UID.
- Never send the answer key to the candidate browser.
- Enforce exam timing and scoring in trusted server-side code / Cloud Functions.
- Use restrictive Firebase Storage rules for candidate photographs.
- Do not let candidates update dashboard statistics.

If you see Permission denied after publishing the supplied rules, make sure you are logged into the Firebase Authentication account used by the admin portal and that you refreshed the deployed GitHub Pages version.
