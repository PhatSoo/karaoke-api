const { Room } = require('../models');

const list = async (req, res) => {
  try {
    const listRoom = await Room.findAll();

    if (listRoom) {
      return res.status(200).json({ success: true, data: listRoom, total: listRoom.length });
    }

    return res.status(404).json({ success: false, message: 'Something went wrong' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error });
  }
};

module.exports = {
  list,
};
