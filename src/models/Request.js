import mongoose from 'mongoose';

const requestSchema = new mongoose.Schema({
  requestId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  uid: { type: String, required: true },
  contact: { type: String, required: true },
  email: { type: String, required: true },
  competitionName: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  prizeMoney: { type: Number },
  status: { 
    type: String, 
    enum: ['Pending', 'Verified', 'In Process', 'Completed'],
    default: 'Pending'
  },
  documents: {
    tickets: String,
    invitationLetter: String,
    certificates: String,
    otherDocuments: String
  },
  createdAt: { type: Date, default: Date.now }
});

const Request = mongoose.model('Request', requestSchema);

export default Request; 