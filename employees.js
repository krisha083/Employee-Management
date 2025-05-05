const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Employee = require('../models/Employee');
const { auth, adminAuth } = require('../middleware/auth');

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Get all employees
router.get('/', auth, async (req, res) => {
    try {
        const employees = await Employee.find();
        res.json(employees);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Search employees
router.get('/search', auth, async (req, res) => {
    try {
        const { query } = req.query;
        const employees = await Employee.find({
            $or: [
                { firstName: { $regex: query, $options: 'i' } },
                { lastName: { $regex: query, $options: 'i' } },
                { email: { $regex: query, $options: 'i' } },
                { department: { $regex: query, $options: 'i' } }
            ]
        });
        res.json(employees);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get single employee
router.get('/:id', auth, async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.json(employee);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Create employee
router.post('/', [auth, adminAuth, upload.single('profilePic')], async (req, res) => {
    try {
        const employeeData = {
            ...req.body,
            profilePic: req.file ? req.file.path : ''
        };
        const employee = new Employee(employeeData);
        await employee.save();
        res.status(201).json(employee);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Update employee
router.put('/:id', [auth, adminAuth, upload.single('profilePic')], async (req, res) => {
    try {
        const employeeData = {
            ...req.body,
            profilePic: req.file ? req.file.path : req.body.profilePic
        };
        const employee = await Employee.findByIdAndUpdate(
            req.params.id,
            employeeData,
            { new: true }
        );
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.json(employee);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete employee
router.delete('/:id', [auth, adminAuth], async (req, res) => {
    try {
        const employee = await Employee.findByIdAndDelete(req.params.id);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.json({ message: 'Employee deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router; 