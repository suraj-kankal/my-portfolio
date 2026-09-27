## 🚀 COMPLETE DEPLOYMENT GUIDE

---

## **STEP 1: Push to GitHub**

### **1.1 Initialize Git Repository**

```powershell
# Navigate to project
cd "D:\Suraj\Naresh IT\Projects\Portfolio"

# Initialize git
git init

# Check git status
git status
```

**Expected Output:**
```
On branch master

No commits yet

Untracked files:
  (use "git add <file>..." to include in what will be committed)
  Portfolio.html
  server.js
  database.js
  package.json
  README.md
  .gitignore
```

---

### **1.2 Add Remote Repository**

```powershell
# Add GitHub as origin
git remote add origin https://github.com/suraj-kankal/Portfolio.git

# Verify remote
git remote -v
```

**Expected Output:**
```
origin  https://github.com/suraj-kankal/Portfolio.git (fetch)
origin  https://github.com/suraj-kankal/Portfolio.git (push)
```

---

### **1.3 Stage All Files**

```powershell
# Stage all files
git add .

# Verify staged files
git status
```

**Expected Output:**
```
On branch master

Initial commit

Changes to be committed:
  new file:   .gitignore
  new file:   Portfolio.html
  new file:   README.md
  new file:   database.js
  new file:   package.json
  new file:   server.js
  new file:   view-database.js
  ...
```

---

### **1.4 Create Initial Commit**

```powershell
# Create commit
git commit -m "Initial commit: Full Stack Portfolio with Express Backend"

# View commit log
git log
```

**Expected Output:**
```
commit abc123def456 (HEAD -> master)
Author: Suraj Kankal <surajkankal0606@gmail.com>
Date:   Sun Aug 17 2026 10:30:00 +0000

    Initial commit: Full Stack Portfolio with Express Backend
```

---

### **1.5 Push to GitHub**

```powershell
# Push to GitHub (will ask for credentials first time)
git push -u origin master

# After that, simple push works:
# git push
```

**Expected Output:**
```
Enumerating objects: 25, done.
Counting objects: 100% (25/25), done.
Delta compression using up to 8 threads
Compressing objects: 100% (20/20), done.
Writing objects: 100% (25/25), 156.78 KiB | 5.00 MiB/s
remote: Resolving deltas: 100% (5/5), done.
To https://github.com/suraj-kankal/Portfolio.git
 * [new branch]      master -> master
branch 'master' set to track 'remote/master'.
```

---

## **STEP 2: Future Changes (After Initial Commit)**

### **Make Changes**
```powershell
# Edit a file (e.g., add new skill)
# Then check status
git status
```

### **Stage Changes**
```powershell
# Stage specific file
git add Portfolio.html

# Or stage all changes
git add .
```

### **Commit Changes**
```powershell
# Commit with message
git commit -m "Add new skills to portfolio"
```

### **Push to GitHub**
```powershell
# Push changes
git push
```

---

## **STEP 3: GitHub Pages Deployment (Frontend)**

### **3.1 Enable GitHub Pages**

1. Go to **https://github.com/suraj-kankal/Portfolio**
2. Click **Settings** → **Pages**
3. Under "Source", select **Deploy from a branch**
4. Select **Branch: master** → **/root** → **Save**

### **3.2 Your Site URL**
```
https://suraj-kankal.github.io/Portfolio
```

**Note:** Takes 1-2 minutes to deploy

### **3.3 Update Portfolio.html to Use GitHub API**

Since GitHub Pages can't run Node.js backend, update the API URL:

```javascript
// If backend is on Heroku:
const API_URL = 'https://suraj-portfolio-api.herokuapp.com/api';

// If local (development):
const API_URL = 'http://localhost:3000/api';
```

---

## **STEP 4: Deploy Backend to Heroku**

### **4.1 Install Heroku CLI**

```powershell
# Install
choco install heroku-cli

# Verify
heroku --version
```

### **4.2 Login to Heroku**

```powershell
# Login (opens browser)
heroku login

# Verify
heroku auth:whoami
```

### **4.3 Create Heroku App**

```powershell
# Create app
heroku create suraj-portfolio-api

# Verify
heroku apps
```

### **4.4 Add Procfile**

Create `Procfile` in project root:

```
web: node server.js
```

### **4.5 Update package.json**

Add start script (if missing):

```json
{
  "name": "portfolio-api",
  "version": "1.0.0",
  "scripts": {
    "start": "node server.js",
    "dev": "node server.js"
  },
  "dependencies": {
    "express": "^4.18.0",
    "cors": "^2.8.5",
    "dotenv": "^16.0.0",
    "better-sqlite3": "^8.0.0"
  }
}
```

### **4.6 Set Environment Variables on Heroku**

```powershell
# Set variables
heroku config:set AUTH_TOKEN=admin_token_12345
heroku config:set NODE_ENV=production

# Verify
heroku config
```

### **4.7 Deploy to Heroku**

```powershell
# Initialize heroku git remote
heroku git:remote -a suraj-portfolio-api

# Deploy
git push heroku master

# View logs
heroku logs --tail
```

### **4.8 Test Your Deployed API**

```powershell
# Get app URL
heroku apps:info suraj-portfolio-api

# Test in browser
https://suraj-portfolio-api.herokuapp.com/
https://suraj-portfolio-api.herokuapp.com/api/portfolio
https://suraj-portfolio-api.herokuapp.com/api/skills
```

---

## **STEP 5: Deploy Backend to Render.com (Alternative)**

### **5.1 Sign Up**

1. Go to **https://render.com**
2. Click **Sign up**
3. Connect GitHub

### **5.2 Create Web Service**

1. Click **New +** → **Web Service**
2. Select your **Portfolio** repository
3. Fill in:
   - **Name:** `suraj-portfolio-api`
   - **Environment:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`

### **5.3 Set Environment Variables**

In Render dashboard:
- **AUTH_TOKEN:** admin_token_12345
- **NODE_ENV:** production

### **5.4 Deploy**

Click **Create Web Service** → Automatic deployment!

### **5.5 Your API URL**

```
https://suraj-portfolio-api.onrender.com
```

---

## **STEP 6: Update API URL in Portfolio**

Once backend is deployed, update `Portfolio.html`:

```javascript
// Change this:
const API_URL = 'http://localhost:3000/api';

// To this (if using Heroku):
const API_URL = 'https://suraj-portfolio-api.herokuapp.com/api';

// Or this (if using Render):
const API_URL = 'https://suraj-portfolio-api.onrender.com/api';
```

Then commit and push:

```powershell
git add Portfolio.html
git commit -m "Update API URL for production deployment"
git push
```

---

## **STEP 7: Test Everything**

### **Test Frontend**
```
https://suraj-kankal.github.io/Portfolio
```

### **Test Backend API**
```
https://suraj-portfolio-api.herokuapp.com/api/portfolio
```

### **Test Contact Form**
1. Fill out contact form
2. Should save to Heroku database
3. View submissions:
```
GET https://suraj-portfolio-api.herokuapp.com/api/admin/contacts
Header: Authorization: Bearer admin_token_12345
```

---

## **STEP 8: Git Workflow for Future Updates**

### **Make Changes Locally**
```powershell
# Edit files
# Then check status
git status
```

### **Commit Changes**
```powershell
# Stage changes
git add .

# Commit with message
git commit -m "Add new projects section"

# Push to GitHub
git push
```

### **Deployment Workflow**

**For Frontend (GitHub Pages):**
- Just `git push` → Automatically deploys to GitHub Pages

**For Backend (Heroku):**
- `git push` → Deploys to GitHub
- `git push heroku master` → Deploys to Heroku

**For Backend (Render):**
- Just `git push` → Automatically deploys to Render (if connected)

---

## **Useful Git Commands**

```powershell
# View all commits
git log

# View changes in a file
git diff Portfolio.html

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes)
git reset --hard HEAD~1

# View remote
git remote -v

# Create new branch
git checkout -b feature/new-feature

# Switch branches
git checkout master

# Merge branch
git merge feature/new-feature
```

---

## **Troubleshooting**

### **Issue: Authentication fails**

```powershell
# Clear git credentials
git credential reject https://github.com

# Try again (will ask for credentials)
git push
```

### **Issue: Large files**

```powershell
# Check file size
ls -lah portfolio.db

# If > 100MB, use Git LFS:
git lfs install
git lfs track "*.db"
git add .gitattributes
git push
```

### **Issue: .gitignore not working**

```powershell
# Remove cached files
git rm --cached .env portfolio.db

# Commit
git commit -m "Stop tracking sensitive files"
git push
```

---

## **Final Checklist**

- ✅ Git installed and configured
- ✅ GitHub repository created
- ✅ Initial commit pushed
- ✅ README.md in repository
- ✅ .gitignore configured
- ✅ GitHub Pages enabled
- ✅ Backend deployed (Heroku/Render)
- ✅ Environment variables set
- ✅ API URL updated in frontend
- ✅ Tested all endpoints

---

**Your portfolio is now live and deployment-ready! 🚀**
