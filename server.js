const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const { employees, users } = require('./data');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Multer configuration for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

// Authentication middleware
const auth = (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, 'your-super-secret-jwt-key');
        const user = users.find(u => u.id === decoded.id);
        if (!user) throw new Error();
        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Please authenticate' });
    }
};

// Auth routes
app.post('/api/auth/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        
        if (users.find(u => u.email === email)) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = {
            id: Date.now().toString(),
            username,
            email,
            password: hashedPassword,
            role: 'user'
        };

        users.push(user);
        const token = jwt.sign({ id: user.id }, 'your-super-secret-jwt-key');
        
        res.status(201).json({
            token,
            user: { id: user.id, username, email, role: user.role }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = users.find(u => u.email === email);

        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user.id }, 'your-super-secret-jwt-key');
        res.json({
            token,
            user: { id: user.id, username: user.username, email: user.email, role: user.role }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Employee routes
app.get('/api/employees', auth, (req, res) => {
    res.json(employees);
});

app.post('/api/employees', auth, upload.single('profilePic'), (req, res) => {
    try {
        const employee = {
            id: Date.now().toString(),
            ...req.body,
            profilePic: req.file ? `/uploads/${req.file.filename}` : '',
            address: JSON.parse(req.body.address)
        };
        employees.push(employee);
        res.status(201).json(employee);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

app.put('/api/employees/:id', auth, upload.single('profilePic'), (req, res) => {
    try {
        const id = req.params.id;
        const index = employees.findIndex(e => e.id === id);
        
        if (index === -1) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        const updatedEmployee = {
            ...employees[index],
            ...req.body,
            address: JSON.parse(req.body.address)
        };

        if (req.file) {
            updatedEmployee.profilePic = `/uploads/${req.file.filename}`;
        }

        employees[index] = updatedEmployee;
        res.json(updatedEmployee);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

app.delete('/api/employees/:id', auth, (req, res) => {
    try {
        const id = req.params.id;
        const index = employees.findIndex(e => e.id === id);
        
        if (index === -1) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        employees.splice(index, 1);
        res.json({ message: 'Employee deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

app.get('/api/employees/search', auth, (req, res) => {
    try {
        const query = req.query.query.toLowerCase();
        const results = employees.filter(employee => 
            employee.firstName.toLowerCase().includes(query) ||
            employee.lastName.toLowerCase().includes(query) ||
            employee.email.toLowerCase().includes(query) ||
            employee.department.toLowerCase().includes(query)
        );
        res.json(results);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Create uploads directory if it doesn't exist
const fs = require('fs');
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 