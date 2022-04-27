/**
 * BookController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  async create(req, res) {
    if (!req.param("start_at") || !req.param("end_at")) {
      return res.badRequest({msg:"Campi dal - al richiesti."});
    }

    let start_at = new Date(req.param("start_at")).getTime();
    let end_at = new Date(req.param("end_at")).getTime();

    console.log("CREATE", req.params.id)

    let is_available = await Room.isAvailable(
      req.param("room"),
      start_at,
      end_at,
    );
    if (is_available) {
      let params = {...req.allParams(), ...{start_at, end_at}}
      let bookRecord = await Book.create(params).fetch();
      return res.ok(bookRecord);
    } else {
      return res.badRequest({msg:"In questa data è già presente una preontazione."});
    }
  },

  async update(req, res) {
    if (!req.param("start_at") || !req.param("end_at")) {
      return res.badRequest({msg:"Campi dal - al richiesti."});
    }
    let bookRecord = await Book.findOne({ id: req.param("id") });

    if (!bookRecord) {
      return res.notFound();
    }

    let start_at = new Date(req.param("start_at")).getTime();
    let end_at = new Date(req.param("end_at")).getTime();

    console.log(req.allParams())
    let is_available = await Room.isAvailable(
      req.param("room"),
      start_at,
      end_at,
      req.param("id")
    );
    if (is_available) {
      let params = {...req.allParams(), ...{start_at, end_at}}
      let bookRecord = await Book.update({ id: req.param("id") })
        .set(params)
        .fetch();
      return res.ok(bookRecord);
    } else {
      return res.badRequest({msg:"In questa data è già presente una preontazione."});
    }
  },
};
