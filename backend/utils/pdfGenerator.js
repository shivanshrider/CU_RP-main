const PDFDocument = require('pdfkit');

const generateRequestPDF = (request) => {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({
                size: 'A4',
                margin: 50,
                bufferPages: true
            });

            const chunks = [];
            doc.on('data', chunk => chunks.push(chunk));
            doc.on('end', () => resolve(Buffer.concat(chunks)));

            // Helper function for consistent styling
            const styles = {
                header: { fontSize: 18, color: '#000000' },
                subHeader: { fontSize: 14, color: '#000000' },
                sectionTitle: { fontSize: 12, color: '#000000', bold: true },
                normal: { fontSize: 11, color: '#000000' },
                small: { fontSize: 10, color: '#000000' }
            };

            // Helper function to add styled text
            const addStyledText = (text, style, options = {}) => {
                doc.fontSize(style.fontSize)
                   .fillColor(style.color)
                   .text(text, options);
            };

            // Helper function to create bordered box
            const createBox = (y, height) => {
                doc.lineWidth(0.5)
                   .rect(50, y, 495, height)
                   .stroke();
            };

            // Header with border
            createBox(50, 100);
            
            // University Logo (simulated with text)
            addStyledText('CU', { fontSize: 24, color: '#000000' }, {
                align: 'center',
                y: 65
            });

            addStyledText('CHANDIGARH UNIVERSITY', styles.header, {
                align: 'center',
                y: 95
            });

            addStyledText('Reimbursement Application Form', styles.subHeader, {
                align: 'center',
                y: 120
            });

            addStyledText('(Applicable only for students winning on any platform)', styles.normal, {
                align: 'center',
                y: 140
            });

            // Reference Number Box
            createBox(170, 40);
            
            const refY = 180;
            addStyledText('Reference No.: _________________', styles.normal, {
                continued: true,
                indent: 10,
                y: refY
            });
            addStyledText(`Date: ${new Date().toLocaleDateString('en-GB')}`, styles.normal, {
                align: 'right',
                y: refY,
                indent: -70
            });

            // Student Details Section
            doc.y = 230;
            addStyledText('1. STUDENT DETAILS', styles.sectionTitle);
            doc.moveDown(0.5);

            const studentInfo = [
                ['Full Name', request.studentDetails.name],
                ['UID/Roll Number', request.studentDetails.rollNumber],
                ['Department', request.studentDetails.department],
                ['Program/Branch', request.teamDetails.program],
                ['Section', request.teamDetails.section],
                ['Current Semester', request.teamDetails.semester],
                ['Contact Number', request.studentDetails.contact],
                ['Email ID', request.studentDetails.email]
            ];

            // Create table with alternating background
            studentInfo.forEach(([label, value], index) => {
                const yPos = doc.y;
                createBox(yPos, 25);
                
                // Add label and value with better spacing
                addStyledText(label + ':', styles.normal, {
                    continued: true,
                    y: yPos + 7,
                    indent: 10
                });
                addStyledText(value || '_________________', styles.normal, {
                    y: yPos + 7,
                    indent: 250
                });
            });
            doc.moveDown(1);

            // Competition Details Section
            addStyledText('2. COMPETITION DETAILS', styles.sectionTitle);
            doc.moveDown(0.5);

            // Create bordered box for competition details
            const compStartY = doc.y;
            createBox(compStartY, 160);

            const competitionInfo = [
                ['Competition Name', request.competitionDetails.competitionName],
                ['Venue/Location', request.competitionDetails.location],
                ['Start Date', request.competitionDetails.startDate ? new Date(request.competitionDetails.startDate).toLocaleDateString('en-GB') : '_________________'],
                ['End Date', request.competitionDetails.endDate ? new Date(request.competitionDetails.endDate).toLocaleDateString('en-GB') : '_________________'],
                ['Position Secured', request.competitionDetails.position],
                ['Prize Amount', `₹ ${request.competitionDetails.prizeAmount || '_________________'}`]
            ];

            competitionInfo.forEach(([label, value], index) => {
                addStyledText(label + ':', styles.normal, {
                    continued: true,
                    y: compStartY + (index * 25) + 10,
                    indent: 10
                });
                addStyledText(value || '_________________', styles.normal, {
                    y: compStartY + (index * 25) + 10,
                    indent: 250
                });
            });

            // Required Documents Section
            doc.y = compStartY + 180;
            addStyledText('3. REQUIRED DOCUMENTS', styles.sectionTitle);
            doc.moveDown(0.5);

            // Create bordered box for documents
            const docStartY = doc.y;
            createBox(docStartY, 140);

            const documents = [
                'Travel Tickets (Original)',
                'Competition Invitation/Selection Letter',
                'Achievement Certificates/Photos',
                'Self-Undertaking Form',
                'Mandate Form & TA/DA Form',
                'University ID Card Copy',
                'Last Semester DMC',
                'Current Semester Attendance Record',
                'Identity Proof (Aadhar/PAN)'
            ];

            documents.forEach((doc_item, index) => {
                addStyledText(`□  ${index + 1}. ${doc_item}`, styles.normal, {
                    indent: 20,
                    y: docStartY + (index * 15) + 10
                });
            });

            // New page for declarations
            doc.addPage();

            // Student Declaration with border
            const declY = 50;
            createBox(declY, 250);

            addStyledText('STUDENT DECLARATION', styles.sectionTitle, {
                align: 'center',
                y: declY + 10
            });

            const declarations = [
                'I hereby declare that all the information provided in this application is true and correct to the best of my knowledge.',
                'I will maintain minimum 75% attendance throughout the academic term.',
                'I will appear for all examinations (mid-term and end-term) without any exception.',
                'I understand that any false declaration may lead to disciplinary action.',
                'I have paid all university fees and have no pending dues.',
                'I will abide by all university rules and regulations.'
            ];

            declarations.forEach((declaration, index) => {
                addStyledText(`${index + 1}. ${declaration}`, styles.normal, {
                    indent: 20,
                    y: declY + 40 + (index * 30)
                });
            });

            // Signature section
            const signY = declY + 270;
            createBox(signY, 80);

            // Left side signature
            addStyledText('_____________________', styles.normal, {
                align: 'left',
                width: 200,
                y: signY + 30
            });
            addStyledText('Student Signature', styles.small, {
                align: 'left',
                width: 200,
                y: signY + 50
            });

            // Right side signature
            addStyledText('_____________________', styles.normal, {
                align: 'right',
                width: 200,
                y: signY + 30
            });
            addStyledText('Parent/Guardian Signature', styles.small, {
                align: 'right',
                width: 200,
                y: signY + 50
            });

            // Office Use Section
            const officeY = signY + 100;
            createBox(officeY, 120);

            addStyledText('FOR OFFICE USE ONLY', styles.sectionTitle, {
                align: 'center',
                y: officeY + 10
            });

            addStyledText('Approved By: _________________', styles.normal, {
                indent: 20,
                y: officeY + 40
            });
            addStyledText('Date: _________________', styles.normal, {
                indent: 20,
                y: officeY + 70
            });
            addStyledText('Remarks: _________________', styles.normal, {
                indent: 20,
                y: officeY + 100
            });

            // Footer with page numbers and border
            for (let i = 0; i < doc.bufferedPageRange().count; i++) {
                doc.switchToPage(i);
                createBox(doc.page.height - 70, 30);
                addStyledText(`Page ${i + 1} of ${doc.bufferedPageRange().count}`, styles.small, {
                    align: 'center',
                    y: doc.page.height - 55
                });
            }

            doc.end();
        } catch (error) {
            reject(error);
        }
    });
};

module.exports = { generateRequestPDF }; 