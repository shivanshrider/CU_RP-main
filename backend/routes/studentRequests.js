const express = require('express');
const router = express.Router();
const StudentRequest = require('../models/StudentRequest');
const { auth, adminAuth } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { generateRequestPDF } = require('../utils/pdfGenerator');
const { sendRequestConfirmation, sendStatusUpdateEmail } = require('../utils/emailService');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('Created uploads directory');
}

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dir = path.join(uploadsDir, new Date().toISOString().split('T')[0]);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: function (req, file, cb) {
        const sanitizedFilename = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
        cb(null, `${Date.now()}-${sanitizedFilename}`);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only PDF, JPG, PNG, DOC, and DOCX files are allowed.'));
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

// Get all requests (admin only)
router.get('/all', adminAuth, async (req, res) => {
    try {
        console.log('Fetching all requests for admin');
        const requests = await StudentRequest.find({})
            .sort({ submittedAt: -1 })
            .populate('processedBy', 'name')
            .lean();
        
        console.log(`Found ${requests.length} requests`);
        
        // Transform the data to match the frontend expectations
        const transformedRequests = requests.map(request => ({
            ...request,
            uid: request.studentDetails?.rollNumber,
            teamName: request.teamDetails?.teamName,
            leaderName: request.teamDetails?.leaderName,
            section: request.teamDetails?.section,
            program: request.teamDetails?.program,
            contactNo: request.teamDetails?.contactNo,
            semester: request.teamDetails?.semester,
            teamSize: request.teamDetails?.teamSize,
            competitionName: request.competitionDetails?.competitionName,
            location: request.competitionDetails?.location,
            startDate: request.competitionDetails?.startDate,
            endDate: request.competitionDetails?.endDate,
            position: request.competitionDetails?.position,
            prizeAmount: request.competitionDetails?.prizeAmount
        }));

        res.json(transformedRequests);
    } catch (error) {
        console.error('Error fetching all requests:', error);
        res.status(500).json({ message: error.message });
    }
});

// Get requests by status (admin only)
router.get('/status/:status', adminAuth, async (req, res) => {
    try {
        const requests = await StudentRequest.find({ status: req.params.status })
            .sort({ submittedAt: -1 })
            .populate('processedBy', 'name');
        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get request by case number (public route for students to check status)
router.get('/:caseNumber', async (req, res) => {
    try {
        const request = await StudentRequest.findOne({ caseNumber: req.params.caseNumber });
        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }
        res.json(request);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create a new request (public route for students)
router.post('/', upload.fields([
    { name: 'tickets', maxCount: 1 },
    { name: 'invitationLetter', maxCount: 1 },
    { name: 'certificates', maxCount: 1 },
    { name: 'undertaking', maxCount: 1 },
    { name: 'mandateForm', maxCount: 1 },
    { name: 'taForm', maxCount: 1 },
    { name: 'idCards', maxCount: 1 },
    { name: 'lastSemesterDmc', maxCount: 1 },
    { name: 'attendanceProof', maxCount: 1 },
    { name: 'idProof', maxCount: 1 }
]), async (req, res) => {
    try {
        console.log('Received new student request');

        // Parse JSON data
        let studentDetails, teamDetails, competitionDetails, declaration;
        try {
            studentDetails = JSON.parse(req.body.studentDetails);
            teamDetails = JSON.parse(req.body.teamDetails);
            competitionDetails = JSON.parse(req.body.competitionDetails);
            declaration = JSON.parse(req.body.declaration);
        } catch (parseError) {
            console.error('Error parsing JSON data:', parseError);
            return res.status(400).json({
                success: false,
                message: 'Invalid request data format'
            });
        }

        // Validate required fields
        if (!studentDetails.name || !studentDetails.rollNumber || !studentDetails.department || !studentDetails.officialEmail) {
            return res.status(400).json({
                success: false,
                message: 'Name, Roll Number, Department, and Official Email are required'
            });
        }

        // Process file attachments
        const attachments = {};
        if (req.files) {
            Object.keys(req.files).forEach(key => {
                attachments[key] = req.files[key][0].path;
            });
        }

        // Create new request
        const request = new StudentRequest({
            studentDetails,
            teamDetails,
            competitionDetails,
            declaration,
            attachments,
            status: 'Pending',
            submittedAt: new Date()
        });

        // Save request
        await request.save();
        console.log('Request saved successfully with case number:', request.caseNumber);

        try {
            // Generate PDF
            console.log('Generating PDF...');
            const pdfBuffer = await generateRequestPDF(request);
            console.log('PDF generated successfully');

            // Get path to additional PDF
            const additionalPdfPath = path.join(__dirname, '../undertaking_form.pdf');

            // Send email with both PDFs
            console.log('Sending confirmation email...');
            await sendRequestConfirmation({
                ...request.toObject(),
                pdfBuffer,
                additionalPdfPath
            });
            console.log('Email sent successfully');

            res.status(201).json({
                success: true,
                message: 'Request submitted successfully',
                caseNumber: request.caseNumber
            });
        } catch (emailError) {
            console.error('Error in PDF generation or email sending:', emailError);
            // Still return success to the client, but log the error
            res.status(201).json({
                success: true,
                message: 'Request submitted successfully, but there was an issue sending the confirmation email',
                caseNumber: request.caseNumber,
                emailError: emailError.message
            });
        }
    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
});

// Update request status (admin only)
router.patch('/:caseNumber/status', adminAuth, async (req, res) => {
    try {
        const request = await StudentRequest.findOne({ caseNumber: req.params.caseNumber });
        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }

        request.status = req.body.status;
        request.adminComments = req.body.adminComments;
        request.processedBy = req.user.id;
        request.processedAt = new Date();
        request.updatedAt = new Date();

        await request.save();

        // Send status update email to student
        try {
            await sendStatusUpdateEmail(request);
            console.log('Status update email sent successfully');
        } catch (emailError) {
            console.error('Error sending status update email:', emailError);
            // Don't fail the request if email fails
        }

        res.json(request);
    } catch (error) {
        console.error('Error updating request status:', error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 