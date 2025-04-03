const mongoose = require('mongoose');

const studentRequestSchema = new mongoose.Schema({
    caseNumber: {
        type: String,
        unique: true
    },
    studentDetails: {
        name: { type: String, required: true },
        rollNumber: { type: String, required: true },
        department: { type: String, required: true },
        year: { type: String, required: true },
        contact: { type: String, required: true },
        email: { type: String, required: true },
        officialEmail: { type: String, required: true }
    },
    teamDetails: {
        teamName: String,
        leaderName: String,
        section: String,
        program: String,
        contactNo: String,
        semester: String,
        teamSize: String
    },
    competitionDetails: {
        competitionName: String,
        location: String,
        startDate: Date,
        endDate: Date,
        position: String,
        prizeAmount: String
    },
    attachments: {
        type: Map,
        of: String
    },
    status: {
        type: String,
        enum: ['Pending', 'Under Review', 'Approved', 'Rejected'],
        default: 'Pending'
    },
    adminComments: String,
    processedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    processedAt: Date,
    submittedAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Generate case number before saving
studentRequestSchema.pre('save', async function(next) {
    if (!this.caseNumber) {
        const year = new Date().getFullYear().toString().slice(-2);
        const month = (new Date().getMonth() + 1).toString().padStart(2, '0');
        const count = await this.constructor.countDocuments();
        this.caseNumber = `REQ${year}${month}${(count + 1).toString().padStart(4, '0')}`;
    }
    next();
});

module.exports = mongoose.model('StudentRequest', studentRequestSchema); 