const serverless = require('serverless-http');
const express = require('express');
const multer = require('multer');
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Create Express app
const app = express();
app.use(express.json());

// Configure PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Setup upload directory
const UPLOAD_DIR = '/tmp/uploads';
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_DIR);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// API Routes
app.get('/departments', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM departments ORDER BY id');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching departments:', error);
    res.status(500).json({ error: 'Failed to fetch departments' });
  }
});

app.get('/departments/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query('SELECT * FROM departments WHERE id = $1', [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Department not found' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching department:', error);
    res.status(500).json({ error: 'Failed to fetch department' });
  }
});

app.post('/applicants', upload.single('resume'), async (req, res) => {
  try {
    const { firstName, lastName, email, phone, departmentId, experience, skills, coverLetter } = req.body;
    let resumePath = null;
    
    if (req.file) {
      resumePath = req.file.path;
    }
    
    const { rows } = await pool.query(
      'INSERT INTO applicants (first_name, last_name, email, phone, department_id, experience, skills, cover_letter, resume_path, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW()) RETURNING *',
      [firstName, lastName, email, phone || null, departmentId, experience, skills, coverLetter || null, resumePath]
    );
    
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error('Error creating applicant:', error);
    res.status(500).json({ error: 'Failed to create applicant' });
  }
});

app.get('/admin/applicants', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM applicants ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching applicants:', error);
    res.status(500).json({ error: 'Failed to fetch applicants' });
  }
});

app.delete('/admin/applicants/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get applicant to check if there's a resume to delete
    const { rows } = await pool.query('SELECT resume_path FROM applicants WHERE id = $1', [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Applicant not found' });
    }
    
    // Delete the resume file if it exists
    const resumePath = rows[0].resume_path;
    if (resumePath && fs.existsSync(resumePath)) {
      try {
        fs.unlinkSync(resumePath);
      } catch (err) {
        console.error('Error deleting resume file:', err);
      }
    }
    
    // Delete the applicant from database
    await pool.query('DELETE FROM applicants WHERE id = $1', [id]);
    
    res.status(200).json({ message: 'Applicant deleted successfully' });
  } catch (error) {
    console.error('Error deleting applicant:', error);
    res.status(500).json({ error: 'Failed to delete applicant' });
  }
});

app.get('/about', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM about_us ORDER BY updated_at DESC LIMIT 1');
    res.json(rows[0] || { content: '' });
  } catch (error) {
    console.error('Error fetching about us content:', error);
    res.status(500).json({ error: 'Failed to fetch about us content' });
  }
});

app.put('/admin/about', async (req, res) => {
  try {
    const { content } = req.body;
    
    // Check if there's existing content
    const { rows: existingRows } = await pool.query('SELECT id FROM about_us ORDER BY updated_at DESC LIMIT 1');
    
    let result;
    if (existingRows.length > 0) {
      // Update existing content
      const { rows } = await pool.query(
        'UPDATE about_us SET content = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
        [content, existingRows[0].id]
      );
      result = rows[0];
    } else {
      // Insert new content
      const { rows } = await pool.query(
        'INSERT INTO about_us (content, updated_at) VALUES ($1, NOW()) RETURNING *',
        [content]
      );
      result = rows[0];
    }
    
    res.json(result);
  } catch (error) {
    console.error('Error updating about us content:', error);
    res.status(500).json({ error: 'Failed to update about us content' });
  }
});

// Export handler for serverless deployment
exports.handler = serverless(app, {
  binary: ['application/octet-stream', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
});