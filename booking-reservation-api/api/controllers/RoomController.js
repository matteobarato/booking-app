/**
 * RoomController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const LIMIT_BOOKINGS = 500;

module.exports = {
  async find(req, res) {
    let room = await Room.find().populate("bookings", {
      limit: LIMIT_BOOKINGS,
      sort: "start_at DESC",
    });
    return res.ok(room);
  },

  async findOne(req, res) {
    let id = req.param("id");
    let room = await Room.findOne(id).populate("bookings", {
      limit: LIMIT_BOOKINGS,
      sort: "start_at DESC",
    });
    return res.ok(room);
  },
};
