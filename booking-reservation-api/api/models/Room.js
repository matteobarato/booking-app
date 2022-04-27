/**
 * Room.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    name: {
      type: "string",
      required: true,
      maxLength: 200,
    },

    capacity_adult: {
      type: "number",
      defaultsTo: 0,
    },

    capacity_child: {
      type: "number",
      defaultsTo: 0,
    },

    note: {
      type: "string",
    },

    color: {
      type: "string",
    },

    is_online: {
      type: "boolean",
      defaultsTo: false,
    },

    rent_tax: {
      type: "number",
      defaultsTo: 0,
    },

    current_price: {
      type: "number",
      defaultsTo: 0,
    },

    bookings: {
      collection: "book",
      via: "room",
    },

   
  },

  //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
  //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
  //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝

  _overlapping_dates_query: (from, to) => {
    return [
      {
        start_at: { "<": to },
        end_at: { ">": from },
      },
      {
        start_at: { "<=": to },
        end_at: { ">": from },
      },
      {
        start_at: { "<": to },
        end_at: { ">=": from },
      },
    ];
  },

  countOverlappingBookings: async function (
    roomId,
    from,
    to,
    bookingId = undefined
  ) {
    let room = await Room.findOne({ id: roomId }).populate("bookings", {
      where: {
        id: { "!=": [bookingId] },
        or: Room._overlapping_dates_query(from, to),
      },
      limit: 10,
    });
    console.log("countOverlappingBookings bookings, ", room.bookings, {
      roomId,
      from,
      to,
      bookingId,
    });
    return room.bookings.length;
  },

  isBusyNow: async function (roomId, bookingId = undefined) {
    let from = new Date();
    let to = new Date(from).setMinutes(from.getMinutes() + 1);
    const overlap_booking = await Room.countOverlappingBookings(
      roomId,
      from,
      to,
      bookingId
    );
    return overlap_booking > 0;
  },

  isBusy: async function (roomId, from, to, bookingId = undefined) {
    const overlap_booking = await Room.countOverlappingBookings(
      roomId,
      from,
      to,
      bookingId
    );
    return overlap_booking > 0;
  },

  isAvailable: async function (roomId, from, to, bookingId = undefined) {
    console.log("isAvailable ", { roomId, from, to, bookingId });
    let busy = await Room.isBusy(roomId, from, to, bookingId);
    return !busy;
  },

  //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
  //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
  //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝

  //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
  //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝
};
