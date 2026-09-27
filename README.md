# 🌐 Personal Portfolio Website

A simple, modern portfolio website to showcase my skills, projects, experience, and education. Built with **HTML**, **CSS**, **JavaScript**, **Node.js**, **Express**, and **SQLite**.

🔗 **Live Website:** [https://suraj-portfolio-ow1m.onrender.com](https://suraj-portfolio-ow1m.onrender.com)

---

## 🌟 What This Website Has

- **Modern Design:** Clean dark look with smooth scrolling and animations.
- **Fast Loading:** Built with pure HTML, CSS, and JavaScript (no heavy frameworks).
- **Dynamic Content:** Skills, work experience, and education load directly from the backend server.
- **Working Contact Form:**
  - Checks if the email address is valid as you type (green for valid, red for invalid).
  - Saves every message into a database (`portfolio.db`).
  - Sends an email to my Gmail inbox instantly whenever someone submits the form.
- **Mobile Friendly:** Looks great on phones, tablets, and computers.

---

## 🛠️ Technologies Used

- **Frontend:** HTML5, CSS3, JavaScript
- **Backend:** Node.js, Express.js
- **Database:** SQLite (Stores contact form messages)
- **Email Service:** Brevo API (Sends messages to Gmail)
- **Hosting:** Render.com (Free hosting with automatic GitHub updates)

---

## 📁 Files in This Project

```text
├── Portfolio.html          # Main website page
├── server.js               # Backend server
├── database.js             # Database setup and queries
├── view-database.js        # Script to see saved messages
├── environment.env         # Secret keys (not uploaded to GitHub)
├── package.json            # Project setup & packages list
└── README.md               # Project guide
```

---

## 💻 How to Run on Your Computer

### 1. Install Node.js
Make sure you have [Node.js](https://nodejs.org/) installed on your computer.

### 2. Download the Project
```bash
git clone https://github.com/suraj-kankal/Portfolio.git
cd Portfolio
```

### 3. Install Packages
```bash
npm install
```

### 4. Setup Secrets (Environment File)
Create a file named `environment.env` in the folder and add:

```env
PORT=3000
NODE_ENV=development

# Admin Secret
AUTH_TOKEN=admin_token_12345

# Email Keys (Brevo)
BREVO_API_KEY=your_brevo_api_key_here
BREVO_SENDER_EMAIL=surajkankal0606@gmail.com
NOTIFY_EMAIL=surajkankal0606@gmail.com
```

### 5. Start the Website
```bash
npm start
```

Now open your browser and go to:
```text
http://localhost:3000
```

---

## 📡 Backend APIs

| Type | URL | What It Does |
| :--- | :--- | :--- |
| `GET` | `/` | Opens the portfolio website |
| `GET` | `/api/portfolio` | Gets all portfolio information (skills, experience, education) |
| `GET` | `/api/skills` | Gets skills list |
| `GET` | `/api/experience` | Gets work experience |
| `GET` | `/api/education` | Gets education details |
| `POST` | `/api/contact` | Submits contact form and sends email |
| `GET` | `/api/admin/contacts` | Admin only: View all saved messages |

---

## 🚀 How It Is Hosted

This website is hosted on **Render.com**.
Whenever new changes are pushed to GitHub, Render updates the live website automatically within 1 minute.

---

## 👨‍💻 About Me

**Suraj Kankal**
- **GitHub:** [@suraj-kankal](https://github.com/suraj-kankal)
- **LinkedIn:** [Suraj Kankal](https://www.linkedin.com/in/surajkankal)
- **Email:** [surajkankal0606@gmail.com](mailto:surajkankal0606@gmail.com)

---

## 📝 License
This project is free to use under the ISC License.
