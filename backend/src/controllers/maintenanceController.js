import MaintenanceRequest from '../models/MaintenanceRequest.js';
import RentalOrder from '../models/RentalOrder.js';

// @desc    Submit a maintenance request
// @route   POST /api/maintenance
// @access  Private
export const createMaintenanceRequest = async (req, res) => {
  const { rentalOrderId, issueDescription } = req.body;

  if (!rentalOrderId || !issueDescription) {
    return res.status(400).json({ message: 'Rental Order ID and issue description are required' });
  }

  try {
    // Check if order exists and belongs to user
    const order = await RentalOrder.findOne({ _id: rentalOrderId, user: req.user._id });

    if (!order) {
      return res.status(404).json({ message: 'Active rental order not found for this user' });
    }

    const request = new MaintenanceRequest({
      user: req.user._id,
      rentalOrder: rentalOrderId,
      issueDescription,
      status: 'Open'
    });

    await request.save();
    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user or admin maintenance requests
// @route   GET /api/maintenance
// @access  Private
export const getMaintenanceRequests = async (req, res) => {
  try {
    let requests;

    if (req.user.role === 'admin') {
      // Admin gets all requests
      requests = await MaintenanceRequest.find()
        .populate('user', 'name email phone')
        .populate({
          path: 'rentalOrder',
          populate: { path: 'product', select: 'name category image' }
        })
        .sort({ createdAt: -1 });
    } else {
      // Regular user gets only their requests
      requests = await MaintenanceRequest.find({ user: req.user._id })
        .populate({
          path: 'rentalOrder',
          populate: { path: 'product', select: 'name category image' }
        })
        .sort({ createdAt: -1 });
    }

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update maintenance request status
// @route   PUT /api/maintenance/:id
// @access  Private
export const updateMaintenanceRequest = async (req, res) => {
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ message: 'Status is required' });
  }

  try {
    const request = await MaintenanceRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: 'Maintenance request not found' });
    }

    // Role check: Only admin can change status. Let's make sure
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized, only admin can update request status' });
    }

    request.status = status;
    await request.save();

    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
