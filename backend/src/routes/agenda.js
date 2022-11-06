const Agenda = require("agenda");
const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb+srv://deep:abcd1234@urbanthrift.b5zyb6o.mongodb.net/IWP_PROJECT";
console.log("hi:", MONGO_URI);
const agenda = new Agenda({
  db: { address: MONGO_URI, collection: "agenda" },
});

const fn = () => {
  console.log(new Date(Date.now()));
};

agenda.define("log", fn);
(async () => {
  await agenda.start();
  //   agenda.schedule("in 2 minutes", "log");
})();
// const setAgenda = async (name, setIn) => {
//   await agenda.start();
//   agenda.schedule(setIn, name);
// };

// setAgenda("log", "in 1 minute");
// module.exports = { agenda, setAgenda };
