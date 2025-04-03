const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const testEmailConnection = async () => {
    try {
        console.log('Testing email configuration...');
        console.log('Email User:', process.env.EMAIL_USER);
        
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            },
            debug: true
        });

        // Verify transporter configuration
        console.log('Verifying email transporter...');
        await transporter.verify();
        console.log('Email transporter verified successfully!');

        // Try sending a test email
        console.log('Sending test email...');
        const info = await transporter.sendMail({
            from: `"CU Reimbursement Portal" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_USER, // Send to yourself
            subject: 'Email Configuration Test',
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px;">
                    <h2>Email Configuration Test</h2>
                    <p>This is a test email to verify that your email configuration is working correctly.</p>
                    <p>If you receive this email, it means your email configuration is working properly.</p>
                </div>
            `
        });

        console.log('Test email sent successfully!');
        console.log('Message ID:', info.messageId);
        console.log('Response:', info.response);
        
    } catch (error) {
        console.error('Email configuration test failed:');
        console.error('Error:', error.message);
        if (error.code) console.error('Error code:', error.code);
        if (error.command) console.error('Failed command:', error.command);
        if (error.response) console.error('Server response:', error.response);
    }
};

testEmailConnection(); 