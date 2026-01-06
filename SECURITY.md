# Educational Security Documentation

**Application:** SecureBox Learning Platform
**Level:** Ethical Hacking for Education (Grade 7-8)

This document explains the security architecture implemented in the application. It is designed to be read by students understanding *why* specific choices were made.

---

## 1. Threat Model (The Attackers)

We are defending against common automated and manual attacks found on the public internet.

### 🛡️ Threat 1: Brute Force Attacks
**The Attack:** A hacker writes a script to try every possible password (admin/admin, 123456, etc.) on the login page until one works.
**Our Defense:** `Rate Limiting` (middleware/rateLimit.js).
- **Global Limit:** We only allow 300 requests/15min from any IP. This stops DoS (Denial of Service).
- **Auth Limit:** We only allow **10 login attempts per hour**.
- **Result:** It would take a hacker years to guess a password that normally takes minutes.

### 🛡️ Threat 2: XSS (Cross Site Scripting)
**The Attack:** A hacker posts a comment like `<script>stealCookies()</script>`. When you view the comment, the script runs in YOUR browser and sends your session key to the hacker.
**Our Defense:**
1. **React Escaping:** The frontend framework (React) automatically converts special characters like `<` into `&lt;`. The browser displays the text but does not execute it.
2. **HttpOnly Cookies:** Even if a script DOES run, we mark our session cookies as `HttpOnly`. This means JavaScript `document.cookie` cannot see the session ID.

### 🛡️ Threat 3: Session Hijacking
**The Attack:** A hacker steals your Session ID (cookie) and adds it to their browser to "become" you without knowing your password.
**Our Defense:**
- **Secure Cookies:** We use parameters `SameSite=Lax` and `HttpOnly`.
- **Session Regeneration:** When you log in, we destroy your old anonymous session ID and issue a brand new one (`req.session.regenerate`). This prevents "Session Fixation" attacks.

### 🛡️ Threat 4: Database Leaks
**The Attack:** A hacker finds a vulnerability (SQL Injection) and downloads the `users` table.
**Our Defense:**
- **No Plaintext Passwords:** We NEVER store passwords. We store a `bcrypt` hash (e.g., `$2b$12$Kix...`).
- **Hashing Speed:** We use a "work factor" (salt rounds) of 12. This makes checking a password slow (approx 0.2s). This is fast for a user, but too slow for a hacker trying to crack millions of stolen hashes.
- **Parametrized Queries:** We do not concatenate SQL strings (`SELECT * FROM users WHERE name = '` + name + `'`). We use placeholders (`?`) so the database treats input strictly as data, not commands.

---

## 2. How to Verify (Lab Exercises)

### Exercise A: The Unbreakable Lock (Rate Limit)
1. Go to the Login page.
2. Enter a wrong password 10 times quickly.
3. On the 11th try, you will see `Too many login attempts`.
4. **Lesson:** Security isn't just about strong passwords, it's about controlling access speed.

### Exercise B: The Invisible Script (XSS)
1. Log in to the Dashboard.
2. In the note field, type: `<img src=x onerror="alert('Hacked!')">`
3. Click "Encrypt & Store".
4. Look at the result. You see the text, but no alert popup appears.
5. **Lesson:** Proper output encoding neutralizes code injection.

---
*Generated for Educational Purposes*
