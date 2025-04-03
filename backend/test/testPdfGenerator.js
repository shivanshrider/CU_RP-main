const fs = require('fs');
const path = require('path');
const { generateRequestPDF } = require('../utils/pdfGenerator');

// Sample request data
const sampleRequest = {
    caseNumber: "CU/REIMB/2024/001",
    studentDetails: {
        name: "John Doe",
        rollNumber: "21BCS1234",
        department: "Computer Science & Engineering",
        year: "3rd",
        contact: "9876543210",
        email: "john.doe@gmail.com",
        officialEmail: "21bcs1234@cuchd.in"
    },
    teamDetails: {
        teamName: "Tech Innovators",
        leaderName: "John Doe",
        section: "K22GP",
        program: "B.Tech CSE",
        contactNo: "9876543210",
        semester: "6th",
        teamSize: "4"
    },
    competitionDetails: {
        competitionName: "National Hackathon 2024",
        location: "IIT Delhi, New Delhi",
        startDate: "2024-03-15",
        endDate: "2024-03-17",
        position: "1st",
        prizeAmount: "50000"
    }
};

// Generate PDF
generateRequestPDF(sampleRequest)
    .then(pdfBuffer => {
        // Create output directory if it doesn't exist
        const outputDir = path.join(__dirname, 'output');
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        // Write PDF to file
        const outputPath = path.join(outputDir, 'sample_reimbursement_form.pdf');
        fs.writeFileSync(outputPath, pdfBuffer);
        console.log(`PDF generated successfully at: ${outputPath}`);
    })
    .catch(error => {
        console.error('Error generating PDF:', error);
    }); 