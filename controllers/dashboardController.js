// controllers/dashboardController.js
import User from '../models/User.js';

export const getDashboardData = async (req, res) => {

   try {
      const user = await User.findById(req.user.userId).select('name email createdAt');
      if (!user) return res.status(404).json({ error: 'User not found' });

      res.status(200).json(user);
   } catch (err) {
      res.status(500).json({ error: 'Failed to fetch user data' });
   }
};

