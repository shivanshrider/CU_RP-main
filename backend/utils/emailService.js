const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    },
    debug: true // Enable debug logging
});

const sendRequestConfirmation = async (request) => {
    try {
        console.log('Preparing to send email to:', request.studentDetails.officialEmail);
        console.log('Using email account:', process.env.EMAIL_USER);

        // Verify transporter configuration
        await transporter.verify();
        console.log('Email transporter verified successfully');

        // Prepare attachments array
        const attachments = [
            {
                filename: `reimbursement_request_${request.caseNumber}.pdf`,
                content: request.pdfBuffer
            }
        ];

        // Add additional PDF if provided
        if (request.additionalPdfPath) {
            try {
                const additionalPdfBuffer = fs.readFileSync(request.additionalPdfPath);
                attachments.push({
                    filename: 'undertaking_form.pdf',
                    content: additionalPdfBuffer
                });
                console.log('Successfully attached undertaking form');
            } catch (error) {
                console.warn('Warning: Could not attach additional PDF:', error.message);
            }
        }

        // Add all uploaded documents
        if (request.attachments && Object.keys(request.attachments).length > 0) {
            console.log('Processing uploaded documents:', Object.keys(request.attachments).length);
            
            for (const [key, filePath] of Object.entries(request.attachments)) {
                try {
                    // Check if file exists
                    if (!fs.existsSync(filePath)) {
                        console.warn(`Warning: File not found at path: ${filePath}`);
                        continue;
                    }
                    
                    const fileBuffer = fs.readFileSync(filePath);
                    const fileName = path.basename(filePath);
                    
                    attachments.push({
                        filename: fileName,
                        content: fileBuffer
                    });
                    console.log('Successfully attached:', fileName);
                } catch (error) {
                    console.warn(`Warning: Could not attach file ${key}:`, error.message);
                }
            }
        } else {
            console.log('No uploaded documents found in request');
        }

        const mailOptions = {
            from: `"CU Reimbursement Portal" <${process.env.EMAIL_USER}>`,
            to: request.studentDetails.officialEmail,
            subject: `CU Reimbursement Portal Request Confirmation`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <p>Dear ${request.studentDetails.name},</p>
                    
                    <p>Your reimbursement request has been successfully submitted and is currently under review.</p>
                    
                    <div style="margin: 20px 0; padding: 15px; background-color: #f8f9fa; border-left: 4px solid #dc2626;">
                        <h3 style="margin-top: 0; color: #1f2937;">Request Details:</h3>
                        <p style="margin: 5px 0;"><strong>Case Number:</strong> ${request.caseNumber}</p>
                        <p style="margin: 5px 0;"><strong>Submission Date:</strong> ${new Date(request.submittedAt).toLocaleDateString()}</p>
                        <p style="margin: 5px 0;"><strong>Competition:</strong> ${request.competitionDetails.competitionName}</p>
                        <p style="margin: 5px 0;"><strong>Location:</strong> ${request.competitionDetails.location}</p>
                    </div>
                    
                    <p>Please keep this case number for future reference, as you can use it to track the status of your request.</p>
                    
                    <div style="margin: 20px 0; padding: 15px; background-color: #f8f9fa; border-left: 4px solid #dc2626;">
                        <h3 style="margin-top: 0; color: #1f2937;">Next Steps:</h3>
                        <ol style="margin: 0; padding-left: 20px;">
                            <li style="margin-bottom: 10px;">Print out all the attached documents, fill them out, and get them signed by the authorized authority.</li>
                            <li style="margin-bottom: 10px;">Submit all the completed forms to Tarun Ma'am at B1-317.</li>
                            <li style="margin-bottom: 10px;">Your request will be reviewed by the administration.</li>
                            <li style="margin-bottom: 10px;">You will receive updates regarding your request status.</li>
                            <li style="margin-bottom: 10px;">Keep all original documents safe for verification.</li>
                        </ol>
                    </div>
                    
                    <div style="margin: 20px 0; padding: 15px; background-color: #f8f9fa; border-left: 4px solid #dc2626;">
                        <h3 style="margin-top: 0; color: #1f2937;">Contact Information:</h3>
                        <p style="margin: 5px 0;">If you have any questions or need to provide additional information, please contact the administration:</p>
                        <p style="margin: 10px 0;">
                            <strong>Tarunjot Kaur</strong><br>
                            Phone: <a href="tel:+917710468597">+91 77104 68597</a><br>
                            Email: <a href="mailto:tarunjot.e14337@cumail.in">tarunjot.e14337@cumail.in</a>
                        </p>
                    </div>
                    
                    <p style="margin-top: 30px;">
                        Best regards,<br>
                        CU Reimbursement Team
                    </p>
                </div>
            `,
            attachments: attachments
        };

        console.log('Sending email...');
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', info.messageId);
        return info;
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error(`Failed to send email: ${error.message}`);
    }
};

const sendStatusUpdateEmail = async (request) => {
    try {
        console.log('Preparing to send status update email to:', request.studentDetails.officialEmail);

        // Verify transporter configuration
        await transporter.verify();
        console.log('Email transporter verified successfully');

        const mailOptions = {
            from: `"CU Reimbursement Portal" <${process.env.EMAIL_USER}>`,
            to: request.studentDetails.officialEmail,
            subject: `CU Reimbursement Request Status Update - Case Number: ${request.caseNumber}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <p>Dear ${request.studentDetails.name},</p>
                    
                    <p>Your reimbursement request status has been updated.</p>
                    
                    <div style="margin: 20px 0; padding: 15px; background-color: #f8f9fa; border-left: 4px solid #dc2626;">
                        <h3 style="margin-top: 0; color: #1f2937;">Request Details:</h3>
                        <p style="margin: 5px 0;"><strong>Case Number:</strong> ${request.caseNumber}</p>
                        <p style="margin: 5px 0;"><strong>Current Status:</strong> ${request.status}</p>
                        <p style="margin: 5px 0;"><strong>Last Updated:</strong> ${new Date(request.updatedAt).toLocaleDateString()}</p>
                    </div>
                    
                    ${request.adminComments ? `
                    <div style="margin: 20px 0; padding: 15px; background-color: #f8f9fa; border-left: 4px solid #dc2626;">
                        <h3 style="margin-top: 0; color: #1f2937;">Admin Comment:</h3>
                        <p style="margin: 5px 0;">${request.adminComments}</p>
                    </div>
                    ` : ''}
                    
                    <div style="margin: 20px 0; padding: 15px; background-color: #f8f9fa; border-left: 4px solid #dc2626;">
                        <h3 style="margin-top: 0; color: #1f2937;">Contact Information:</h3>
                        <p style="margin: 5px 0;">If you have any questions or need to provide additional information, please contact the administration:</p>
                        <p style="margin: 10px 0;">
                            <strong>Tarunjot Kaur</strong><br>
                            Phone: <a href="tel:+917710468597">+91 77104 68597</a><br>
                            Email: <a href="mailto:tarunjot.e14337@cumail.in">tarunjot.e14337@cumail.in</a>
                        </p>
                    </div>
                    
                    <p style="margin-top: 30px;">
                        Best regards,<br>
                        CU Reimbursement Team
                    </p>
                </div>
            `
        };

        console.log('Sending status update email...');
        const info = await transporter.sendMail(mailOptions);
        console.log('Status update email sent successfully:', info.messageId);
        return info;
    } catch (error) {
        console.error('Error sending status update email:', error);
        throw new Error(`Failed to send status update email: ${error.message}`);
    }
};

module.exports = { sendRequestConfirmation, sendStatusUpdateEmail }; 