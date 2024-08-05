import Number from '../models/Number.js';

export const getNumbers = async (req, res) => {
  try {
    const numbers = await Number.find({ userId: req.user.id });
    res.json(numbers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
