# Changing the admin password

The admin dashboard login is checked against two lines in the **server's** `.env` file:

- `ADMIN_EMAIL`: the email you log in with
- `ADMIN_PASSWORD`: a bcrypt **hash** of your password, never the password itself

To change the password, you make a new hash on your PC and replace the old one on the server. You can pick any password you like.

## Step 1: Make the hash on your PC

1. Press the **Windows key**, type **PowerShell** and open it.
2. One time only, install the hashing tool:
   ```
   pip install bcrypt
   ```
3. Run this:
   ```
   python -c "import bcrypt,getpass;h=bcrypt.hashpw(getpass.getpass('New admin password: ').encode(),bcrypt.gensalt()).decode();print(chr(36)+'2y'+h[3:])"
   ```
4. Type your new password at the prompt and press **Enter**. Nothing shows while you type. That's normal.
5. It prints one long line starting with `$2y$`. Copy the whole line.

Tips: use 12+ characters, don't reuse a password from another site, and save it in a password manager.

## Step 2: Put it on the server

The `.env` file is at:

```
domains/josepaulotimbang.com/portfolio-api/.env
```

Hostinger's File Manager **Edit** often fails to save this file with a red `403 Forbidden ... openresty` popup, because its firewall blocks the hash. Use one of these instead.

### Option A: Download, edit and upload

1. hPanel → **Websites** → josepaulotimbang.com **Dashboard** → **File Manager**.
2. Go to `domains/josepaulotimbang.com/portfolio-api/`.
3. Right-click **`.env`** → **Download**.
4. On your PC, right-click the downloaded `.env` → **Open with** → **Notepad**.
5. Replace the value after `ADMIN_PASSWORD = ` with the `$2y$...` line, all on one line. Quotes aren't needed.
   ```
   ADMIN_PASSWORD = $2y$12$...
   ```
6. **File → Save**. Don't use "Save As", because Notepad may add `.txt` to the name.
7. In File Manager, inside `portfolio-api/`, click **Upload**, choose the `.env` and pick **Replace** or **Overwrite**.
8. **Delete the `.env` from your Downloads folder.** It contains the site's secrets.

### Option B: Hostinger browser terminal

1. hPanel → **Advanced** → **SSH Access** → **Open terminal**.
2. Run:
   ```
   nano domains/josepaulotimbang.com/portfolio-api/.env
   ```
3. Use the arrow keys to get to `ADMIN_PASSWORD`, delete the old value and paste the new one with right-click → Paste.
4. Press **Ctrl+O**, then **Enter** to save, then **Ctrl+X** to exit.

## Step 3: Log in

Go to the admin page and log in with the `ADMIN_EMAIL` address and your new password. The change takes effect right away. No redeploy is needed, because the deploy workflow never overwrites the server's `.env`.

## Troubleshooting

| Problem | Fix |
|---|---|
| "Invalid email or password" | Check the email matches `ADMIN_EMAIL`. Check the hash is complete, on one line and not glued onto another line. Make sure the file actually saved. |
| "Too many attempts" | Only 5 tries are allowed per minute. Wait a minute. |
| `pip` or `python` "not recognized" | Install Python from python.org and tick **Add python.exe to PATH**. |
| Red `403 Forbidden ... openresty` popup | File Manager's Edit was blocked. Use Option A or B. |
