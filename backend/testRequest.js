const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const testRequest = async () => {
    try {
        console.log('Preparing test request...');

        // Create form data
        const formData = new FormData();

        // Add student details
        const studentDetails = {
            name: 'Test Student',
            rollNumber: 'TEST123',
            department: 'Computer Science',
            year: '3rd Year',
            contact: '1234567890',
            email: 'test@example.com',
            officialEmail: 'shivanshtiwari98958@gmail.com' // Changed to a different email for testing
        };
        formData.append('studentDetails', JSON.stringify(studentDetails));

        // Add team details
        const teamDetails = {
            teamName: 'Test Team',
            leaderName: 'Test Leader',
            section: 'A',
            program: 'B.Tech',
            contactNo: '1234567890',
            semester: '6th',
            teamSize: '4'
        };
        formData.append('teamDetails', JSON.stringify(teamDetails));

        // Add competition details
        const competitionDetails = {
            competitionName: 'Test Competition',
            location: 'Test Location',
            startDate: new Date().toISOString(),
            endDate: new Date().toISOString(),
            position: '1st',
            prizeAmount: '10000'
        };
        formData.append('competitionDetails', JSON.stringify(competitionDetails));

        // Add declaration
        const declaration = {
            compliance: true,
            rulesAwareness: true,
            attendance: true,
            feePayment: true
        };
        formData.append('declaration', JSON.stringify(declaration));

        // Create a dummy PDF file for testing
        const dummyPdfPath = path.join(__dirname, 'test.pdf');
        fs.writeFileSync(dummyPdfPath, 'This is a test PDF file');
        
        // Add the dummy PDF as a required file
        formData.append('tickets', fs.createReadStream(dummyPdfPath));

        console.log('Submitting request...');
        const response = await axios.post('http://localhost:5000/api/student-requests', formData, {
            headers: {
                ...formData.getHeaders()
            }
        });

        console.log('Request submitted successfully!');
        console.log('Response:', response.data);
        console.log('Confirmation email should be sent to:', studentDetails.officialEmail);

        // Clean up the dummy file
        fs.unlinkSync(dummyPdfPath);

    } catch (error) {
        console.error('Error submitting request:');
        if (error.response) {
            console.error('Response data:', error.response.data);
            console.error('Response status:', error.response.status);
        } else {
            console.error('Error:', error.message);
        }
    }
};

testRequest(); 