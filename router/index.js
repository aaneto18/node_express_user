var knex = require("knex")({
  client: "mysql",
  version: "5.7",
  connection: {
    host: "localhost",
    user: "root",
    password: "123",
    database: "live_person",
    port: 33068
  }
});

function makeRouter(express) {
  const router = express.Router();

  // test route to make sure everything is working (accessed at GET http://localhost:2222/)
  router.get("/", function(req, res) {
    res.json({
      message: "Welcome to api!"
    });
  });

  // ----------------------------------------------------
  router
    .route("/generate")

    // generate (accessed at GET http://localhost:2222/process)
    .get(function(req, res) {
      var users = [
        {
          id: 1,
          firstname: "Antonio",
          lastname: "Neto"
        },
        {
          id: 2,
          firstname: "User 2",
          lastname: "Surname"
        },
        {
          id: 3,
          firstname: "User 3",
          lastname: "Surname 3"
        }
      ];

      var msg = "";
      knex
        .transaction(async function(tr) {
          //batching inserting new objects
          await knex.batchInsert("users", users, 30).transacting(tr);
        })
        .then(function() {
          msg = "added users";
        })
        .catch(function(error) {
          msg = error.message;
        });
      res.json({ msg: msg });
    });

  router
    .route("/newUser")

    // generate (accessed at POST http://localhost:3333/newUser)
    .post(function(req, res) {
      var newUser = {
        firstname: req.body.firstname,
        lastname: req.body.lastname
      };

      knex
        .transaction(async function(tr) {
          //batching inserting new objects
          await knex.batchInsert("users", [newUser], 30).transacting(tr);
        })
        .then(function() {
          res.json({ msg: `Added the user ${newUser.firstname}` });
        })
        .catch(function(error) {
          res.json({ msg: error.message });
        });
      //res.json({ msg: msg });
    });

  router
    .route("/:userId")

    // generate (accessed at POST http://localhost:3333/newUser)
    .delete(function(req, res) {
      knex
        .transaction(async function(tr) {
          //batching inserting new objects
          await knex("users")
            .where("id", req.params.userId)
            .del();
        })
        .then(function() {
          res.json({ msg: `Removed the user ${req.params.userId}` });
        })
        .catch(function(error) {
          res.json({ msg: error.message });
        });
      //res.json({ msg: msg });
    });

  router
    .route("/:userId")

    // generate (accessed at POST http://localhost:3333/newUser)
    .put(function(req, res) {
      var userUpdate = {
        firstname: req.body.firstname,
        lastname: req.body.lastname
      };

      knex
        .transaction(async function(tr) {
          //batching inserting new objects
          await knex("users")
            .where("id", req.params.userId)
            .update(userUpdate);
        })
        .then(function() {
          res.json({ msg: `User ${req.params.userId} updated` });
        })
        .catch(function(error) {
          res.json({ msg: error.message });
        });
      //res.json({ msg: msg });
    });

  return router;
}

module.exports = makeRouter;
