const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
const { Pool } = require('pg');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Multer setup for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Setup PostgreSQL connection pool
let pool;
if (process.env.DATABASE_URL) {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });
}

// Create uploads directory if it doesn't exist
const UPLOAD_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Root endpoint
app.get('/.netlify/functions/api', (req, res) => {
  res.json({
    message: 'Research Satellite API is running!',
    timestamp: new Date().toISOString(),
  });
});

// Get all departments
app.get('/.netlify/functions/api/departments', async (req, res) => {
  try {
    if (!pool) {
      return res.status(500).json({ error: 'Database connection not available' });
    }
    
    const result = await pool.query('SELECT * FROM departments');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching departments:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get a specific department
app.get('/.netlify/functions/api/departments/:id', async (req, res) => {
  try {
    if (!pool) {
      return res.status(500).json({ error: 'Database connection not available' });
    }
    
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM departments WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Department not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching department:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create a new applicant
app.post('/.netlify/functions/api/applicants', upload.single('resume'), async (req, res) => {
  try {
    if (!pool) {
      return res.status(500).json({ error: 'Database connection not available' });
    }
    
    const { firstName, lastName, email, phone, departmentId, experience, skills, coverLetter } = req.body;
    
    let resumePath = null;
    if (req.file) {
      // Create unique filename
      const timestamp = Date.now();
      const filename = `${timestamp}-${req.file.originalname}`;
      resumePath = path.join('uploads', filename);
      
      // Save file
      const filePath = path.join(UPLOAD_DIR, filename);
      fs.writeFileSync(filePath, req.file.buffer);
    }
    
    const result = await pool.query(
      'INSERT INTO applicants (first_name, last_name, email, phone, department_id, experience, skills, cover_letter, resume_path, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW()) RETURNING *',
      [firstName, lastName, email, phone, departmentId, experience, skills, coverLetter, resumePath]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating applicant:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get all applicants (admin)
app.get('/.netlify/functions/api/admin/applicants', async (req, res) => {
  try {
    if (!pool) {
      return res.status(500).json({ error: 'Database connection not available' });
    }
    
    // In production, this endpoint should be protected with authentication
    const result = await pool.query('SELECT * FROM applicants ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching applicants:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete an applicant (admin)
app.delete('/.netlify/functions/api/admin/applicants/:id', async (req, res) => {
  try {
    if (!pool) {
      return res.status(500).json({ error: 'Database connection not available' });
    }
    
    const { id } = req.params;
    
    // First get the applicant to check for resume file
    const applicantResult = await pool.query('SELECT * FROM applicants WHERE id = $1', [id]);
    if (applicantResult.rows.length === 0) {
      return res.status(404).json({ error: 'Applicant not found' });
    }
    
    const applicant = applicantResult.rows[0];
    
    // Delete resume file if exists
    if (applicant.resume_path) {
      const filePath = path.join(__dirname, applicant.resume_path);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    
    // Delete from database
    await pool.query('DELETE FROM applicants WHERE id = $1', [id]);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting applicant:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get about us content
app.get('/.netlify/functions/api/about', async (req, res) => {
  try {
    if (!pool) {
      return res.status(500).json({ error: 'Database connection not available' });
    }
    
    const result = await pool.query('SELECT * FROM about_us LIMIT 1');
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'About us content not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching about us content:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update about us content (admin)
app.put('/.netlify/functions/api/admin/about', async (req, res) => {
  try {
    if (!pool) {
      return res.status(500).json({ error: 'Database connection not available' });
    }
    
    const { content } = req.body;
    
    // Check if an about us entry exists
    const existsResult = await pool.query('SELECT * FROM about_us LIMIT 1');
    
    let result;
    if (existsResult.rows.length > 0) {
      // Update existing entry
      result = await pool.query(
        'UPDATE about_us SET content = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
        [content, existsResult.rows[0].id]
      );
    } else {
      // Create new entry
      result = await pool.query(
        'INSERT INTO about_us (content, updated_at) VALUES ($1, NOW()) RETURNING *',
        [content]
      );
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating about us content:', error);
    res.status(500).json({ error: error.message });
  }
});

// Handle 404 for any other API routes
app.use('/.netlify/functions/api/*', (req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.path
  });
});

// Export the serverless function
module.exports.handler = serverless(app);