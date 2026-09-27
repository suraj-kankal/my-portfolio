const express = require('express');
const cors = require('cors');
require('dotenv').config({ path: './environment.env' });
const nodemailer = require('nodemailer');
const dns = require('dns').promises;
const database = require('./database');
const rateLimit = require('express-rate-limit');
const escapeHtml = require('escape-html');

const app = express();

// ===== EMAIL TRANSPORTER SETUP (Brevo - Send Only) =====
const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.BREVO_SMTP_LOGIN,
    pass: process.env.BREVO_SMTP_KEY
  },
  connectionTimeout: 5000,
  greetingTimeout: 5000,
  socketTimeout: 5000
});

// Middleware
app.set('trust proxy', 1); // Trust first proxy for accurate IP resolution
app.use(cors());
app.use(express.json());

// ===== SENSITIVE DATA (Hidden from Browser) =====
const privateData = {
  email: process.env.EMAIL,
  phone: process.env.PHONE,
  address: process.env.ADDRESS,
  ssn: process.env.SSN,
  bankAccount: process.env.BANK_ACCOUNT,
  apiKeys: process.env.API_KEYS,
  secretKey: process.env.SECRET_KEY
};

// ===== PUBLIC DATA (Safe to send) - From your actual portfolio =====
const publicPortfolioData = {
  name: "Suraj Kankal",
  title: "Full Stack Java Developer",
  badge: "Available for Roles & Internships",
  summary: "Building scalable backend logic, object-oriented solutions, and database-driven web applications with clean, maintainable architecture.",
  github: "https://github.com/suraj-kankal",
  linkedin: "https://www.linkedin.com/in/surajkankal",
  typingRoles: [
    "Full Stack Java Developer",
    "Backend Software Developer",
    "Spring Boot & SQL Developer"
  ],
  skills: [
    "☕ Java",
    "🌱 Spring Boot",
    "⚡ JavaScript",
    "🌐 HTML5 / CSS3",
    "🗄️ Oracle",
    "🐬 MySQL",
    "🛠️ Git / GitHub",
    "⚙️ C Programming",
    "🐍 Python",
    "💻 VS Code / Eclipse"
  ],
  experience: [
    {
      position: "Full Stack Java Trainee",
      company: "Naresh IT",
      location: "Hyderabad",
      duration: "Nov 2025 - Present",
      description: "Gaining hands-on expertise in Core Java, Advanced Java, Spring Boot, and relational database management with SQL and Oracle.",
      tags: ["Java", "Spring Boot", "Oracle", "SQL"]
    },
    {
      position: "Web Development Intern",
      company: "Microdynamic Software Pvt. Ltd.",
      location: "Pune",
      duration: "Jul 2023 - Aug 2023",
      description: "Built responsive and dynamic web interfaces using modern JavaScript, HTML5, and CSS3 workflows.",
      tags: ["JavaScript", "HTML5", "CSS3"]
    },
    {
      position: "Embedded Systems Intern",
      company: "Logical Solution",
      location: "Karad",
      duration: "Aug 2022 - Sep 2022",
      description: "Practiced embedded design, microcontroller programming, and circuit simulation.",
      tags: []
    }
  ],
  education: [
    {
      degree: "B.Tech in Electronics & Telecommunication Engineering",
      institution: "Department Of Technology, Shivaji University, Kolhapur",
      duration: "2021 - 2025"
    },
    {
      degree: "Diploma in Computer Science & Engineering",
      institution: "Vishveshwarayya Abhiyantriki Padvika Mahavidyalay, Almala",
      duration: "2019 - 2021"
    }
  ],
  projects: [
    {
      title: "Personal Portfolio Website",
      description: "A secure, dynamic, and responsive personal portfolio built with Node.js, SQLite, and Vibe Coding (AI Pair Programming). Features a custom API, rate-limiting, XSS prevention, and contact form handling with automated email notifications.",
      tags: ["Node.js", "Express", "SQLite", "HTML/CSS/JS", "Vibe Coding"],
      githubLink: "https://github.com/suraj-kankal/Portfolio",
      liveLink: "#"
    }
  ]
};

const path = require('path');

// Place this after middleware setup
app.use(express.static(path.join(__dirname)));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'Portfolio.html'));
});

// ===== AUTHENTICATION MIDDLEWARE =====
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer TOKEN"

  if (!token) {
    return res.status(401).json({
      success: false,
      message: '❌ Unauthorized - No token provided',
      instruction: 'Add header: Authorization: Bearer admin_token_12345'
    });
  }

  const validToken = process.env.AUTH_TOKEN;
  
  if (token !== validToken) {
    return res.status(403).json({
      success: false,
      message: '❌ Forbidden - Invalid token',
      instruction: `Your token: "${token}" does not match valid token`
    });
  }

  next();
};

// ===== PUBLIC ENDPOINTS (No Authentication) =====

// 2. Get all public portfolio data
app.get('/api/portfolio', (req, res) => {
  console.log('✓ [PUBLIC] GET /api/portfolio');
  res.json({
    success: true,
    message: "Portfolio data",
    data: publicPortfolioData
  });
});

// 3. Get skills only
app.get('/api/skills', (req, res) => {
  console.log('✓ [PUBLIC] GET /api/skills');
  res.json({
    success: true,
    skills: publicPortfolioData.skills
  });
});

// 4. Get experience only
app.get('/api/experience', (req, res) => {
  console.log('✓ [PUBLIC] GET /api/experience');
  res.json({
    success: true,
    experience: publicPortfolioData.experience
  });
});

// 5. Get education only
app.get('/api/education', (req, res) => {
  console.log('✓ [PUBLIC] GET /api/education');
  res.json({
    success: true,
    education: publicPortfolioData.education
  });
});

// 5.5 Get projects only
app.get('/api/projects', (req, res) => {
  console.log('✓ [PUBLIC] GET /api/projects');
  res.json({
    success: true,
    projects: publicPortfolioData.projects
  });
});

// Rate limiting for contact form (max 5 requests per 15 minutes per IP)
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { success: false, message: 'Too many requests from this IP, please try again later.' }
});

// 6. Submit contact form
app.post('/api/contact', contactLimiter, async (req, res) => {
  console.log('✓ [PUBLIC] POST /api/contact');
  const { name, email, subject, message } = req.body;

  // Validation
  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      message: 'Please provide name, email, and message'
    });
  }

  // Email format validation
  const emailRegex = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: 'Please enter a valid email address'
    });
  }

  // Verify email domain has MX records (with safe 2s timeout)
  try {
    const domain = email.split('@')[1];
    const mxPromise = dns.resolveMx(domain);
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('DNS Timeout')), 2000)
    );
    await Promise.race([mxPromise, timeoutPromise]);
  } catch (dnsError) {
    if (dnsError.message !== 'DNS Timeout') {
      console.log(`✗ Invalid email domain: ${email}`);
      return res.status(400).json({
        success: false,
        message: 'This email domain does not exist. Please check your email address.'
      });
    }
  }

  // Get visitor IP address
  const ip_address = req.ip || req.connection.remoteAddress;

  // Save to database
  const result = database.saveContact(name, email, subject || '', message, ip_address);

  if (result.success) {
    console.log(`📧 Contact from ${name} (${email}) saved to database`);

    // Helper function to send email via Brevo HTTPS API or SMTP
    const apiKey = process.env.BREVO_API_KEY || process.env.BREVO_SMTP_KEY;
    const senderEmail = process.env.BREVO_SENDER_EMAIL || 'surajkankal0606@gmail.com';
    const notifyEmail = process.env.NOTIFY_EMAIL || 'surajkankal0606@gmail.com';

    if (apiKey && !apiKey.includes('your_')) {
      const emailHtml = `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0b0f19; border-radius: 12px; overflow: hidden; border: 1px solid #1f293d;">
          <div style="background: linear-gradient(135deg, #38bdf8, #0ea5e9); padding: 24px 32px;">
            <h1 style="margin: 0; color: #0b0f19; font-size: 22px;">📬 New Portfolio Message</h1>
          </div>
          <div style="padding: 28px 32px; color: #f3f4f6;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 0; color: #9ca3af; width: 100px; vertical-align: top;">From</td>
                <td style="padding: 10px 0; color: #f3f4f6; font-weight: 600;">${escapeHtml(name)}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #9ca3af; vertical-align: top;">Email</td>
                <td style="padding: 10px 0;"><a href="mailto:${escapeHtml(email)}" style="color: #38bdf8; text-decoration: none;">${escapeHtml(email)}</a></td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #9ca3af; vertical-align: top;">Subject</td>
                <td style="padding: 10px 0; color: #f3f4f6;">${escapeHtml(subject || 'No Subject')}</td>
              </tr>
            </table>
            <hr style="border: none; border-top: 1px solid #1f293d; margin: 16px 0;">
            <p style="color: #9ca3af; margin: 0 0 8px; font-size: 13px;">Message</p>
            <div style="background: #111827; border: 1px solid #1f293d; border-radius: 8px; padding: 16px; color: #f3f4f6; line-height: 1.6; white-space: pre-wrap;">${escapeHtml(message)}</div>
            <p style="color: #6b7280; font-size: 12px; margin-top: 20px;">Received at ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST</p>
          </div>
        </div>
      `;

      // Try sending via HTTPS REST API (Port 443 - Never blocked by hosting)
      fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'api-key': apiKey,
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          sender: { name: 'Portfolio Contact', email: senderEmail },
          to: [{ email: notifyEmail, name: 'Suraj Kankal' }],
          subject: `📬 New Contact: ${subject || 'No Subject'} — from ${name}`,
          htmlContent: emailHtml
        })
      })
      .then(async (apiRes) => {
        if (apiRes.ok) {
          console.log(`✓ Email notification sent via Brevo HTTPS API to ${notifyEmail}`);
        } else {
          const errData = await apiRes.json();
          console.warn('⚠️ Brevo API response:', errData);
          // Fallback to SMTP if available
          if (process.env.BREVO_SMTP_LOGIN) {
            transporter.sendMail({
              from: `"Portfolio Contact" <${senderEmail}>`,
              to: notifyEmail,
              subject: `📬 New Contact: ${subject || 'No Subject'} — from ${name}`,
              html: emailHtml
            })
            .then(() => console.log(`✓ Email sent via SMTP fallback`))
            .catch(smtpErr => console.error('✗ SMTP fallback failed:', smtpErr.message));
          }
        }
      })
      .catch((err) => {
        console.error('✗ Email send error:', err.message);
      });
    } else {
      console.log('ℹ Email credentials not configured. Contact saved to database only.');
    }

    return res.status(201).json({
      success: true,
      message: '✓ Thank you! Your message has been received.',
      id: result.id,
      receivedAt: new Date().toISOString()
    });
  } else {
    return res.status(500).json({
      success: false,
      message: 'Error saving message. Please try again.'
    });
  }
});

// Diagnostic endpoint: Test Email Delivery
app.get('/api/test-email', async (req, res) => {
  try {
    const apiKey = process.env.BREVO_API_KEY || process.env.BREVO_SMTP_KEY;
    const senderEmail = process.env.BREVO_SENDER_EMAIL || 'surajkankal0606@gmail.com';
    const notifyEmail = process.env.NOTIFY_EMAIL || 'surajkankal0606@gmail.com';

    if (!apiKey) {
      return res.status(400).json({
        success: false,
        message: 'No Brevo API key or SMTP key found in environment variables.'
      });
    }

    const apiRes = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': apiKey,
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        sender: { name: 'Portfolio Test', email: senderEmail },
        to: [{ email: notifyEmail, name: 'Suraj Kankal' }],
        subject: '🧪 Live Portfolio Test Email (HTTPS)',
        htmlContent: '<p>This is a test email sent from your live deployed portfolio on Render via HTTPS API!</p>'
      })
    });

    const data = await apiRes.json();

    if (apiRes.ok) {
      return res.json({
        success: true,
        method: 'Brevo HTTPS REST API (Port 443)',
        message: `✓ Test email sent successfully to ${notifyEmail}!`,
        data: data
      });
    } else {
      return res.status(apiRes.status).json({
        success: false,
        method: 'Brevo HTTPS REST API (Port 443)',
        brevo_response: data
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ===== PROTECTED ENDPOINTS (Requires Authentication) =====

// 7. Admin endpoint - Get private data (admin only)
app.get('/api/private-data', authenticateToken, (req, res) => {
  console.log('✓ [PROTECTED] GET /api/private-data');
  res.json({
    success: true,
    message: "Private data (authenticated access only)",
    warning: "🔒 This data is hidden from browser inspect mode",
    data: privateData,
    timestamp: new Date().toISOString()
  });
});

// 8. Admin - Get all contact submissions (admin only)
app.get('/api/admin/contacts', authenticateToken, (req, res) => {
  console.log('✓ [PROTECTED] GET /api/admin/contacts');
  const contacts = database.getAllContacts();
  const stats = database.getContactStats();
  
  res.json({
    success: true,
    message: "All contact submissions",
    stats: stats,
    total: contacts.length,
    contacts: contacts,
    timestamp: new Date().toISOString()
  });
});

// 9. Admin - Get new contacts only (admin only)
app.get('/api/admin/contacts/new', authenticateToken, (req, res) => {
  console.log('✓ [PROTECTED] GET /api/admin/contacts/new');
  const contacts = database.getNewContacts();
  
  res.json({
    success: true,
    message: "New contact submissions",
    count: contacts.length,
    contacts: contacts
  });
});

// 10. Admin - Get specific contact (admin only)
app.get('/api/admin/contacts/:id', authenticateToken, (req, res) => {
  console.log(`✓ [PROTECTED] GET /api/admin/contacts/${req.params.id}`);
  const contact = database.getContactById(req.params.id);
  
  if (!contact) {
    return res.status(404).json({
      success: false,
      message: 'Contact not found'
    });
  }
  
  res.json({
    success: true,
    contact: contact
  });
});

// 11. Admin - Update contact status (admin only)
app.put('/api/admin/contacts/:id/status', authenticateToken, (req, res) => {
  console.log(`✓ [PROTECTED] PUT /api/admin/contacts/${req.params.id}/status`);
  const { status } = req.body;
  
  if (!['new', 'replied', 'archived'].includes(status)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid status. Use: new, replied, or archived'
    });
  }
  
  const success = database.updateContactStatus(req.params.id, status);
  
  res.json({
    success: success,
    message: success ? `✓ Contact status updated to: ${status}` : 'Error updating status'
  });
});

// 12. Admin - Delete contact (admin only)
app.delete('/api/admin/contacts/:id', authenticateToken, (req, res) => {
  console.log(`✓ [PROTECTED] DELETE /api/admin/contacts/${req.params.id}`);
  const success = database.deleteContact(req.params.id);
  
  res.json({
    success: success,
    message: success ? '✓ Contact deleted' : 'Error deleting contact'
  });
});

// 13. Admin - Get contact statistics (admin only)
app.get('/api/admin/stats', authenticateToken, (req, res) => {
  console.log('✓ [PROTECTED] GET /api/admin/stats');
  const stats = database.getContactStats();
  
  res.json({
    success: true,
    message: "Portfolio statistics",
    stats: stats,
    timestamp: new Date().toISOString()
  });
});

// 14. Admin endpoint - update portfolio
app.post('/api/admin', authenticateToken, (req, res) => {
  console.log('✓ [PROTECTED] POST /api/admin');
  const { action, payload } = req.body;

  res.json({
    success: true,
    message: `✓ Admin action "${action}" processed`,
    action: action,
    data: payload,
    note: 'In production, this would update the database'
  });
});

// ===== ERROR HANDLING =====
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: '❌ Endpoint not found',
    path: req.path
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n╔════════════════════════════════════════╗`);
  console.log(`║  ✓ Portfolio API Server Running       ║`);
  console.log(`║  📍 http://localhost:${PORT}            ║`);
  console.log(`║  🔒 CORS Enabled                       ║`);
  console.log(`║  📦 Ready for Postman requests        ║`);
  console.log(`╚════════════════════════════════════════╝\n`);
});