import mongoose from 'mongoose';

const maintenanceRequestSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rentalOrder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'RentalOrder',
    required: true
  },
  issueDescription: {
    type: String,
    required: [true, 'Please add an issue description']
  },
  status: {
    type: String,
    enum: ['Open', 'In Progress', 'Resolved'],
    default: 'Open'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const MaintenanceRequest = mongoose.model('MaintenanceRequest', maintenanceRequestSchema);

export default MaintenanceRequest;
