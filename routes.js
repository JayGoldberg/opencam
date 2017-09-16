var appRouter = function(app) {

  const sqlite3 = require('better-sqlite3');
  const fields = {};
  fields.countries = 'countryName';
  fields.cities = 'cityName';
  fields.regions = 'regionName';
  fields.tags = 'regionName';

  app.get("/", (req, res) => {
      res.send("Hello World");
  });

  app.get("/cron/:c", (req, res) => {
    switch (req.params.c) {
      case 'iplookup':
        break;
      case 'camquery':
        break;
    }
  });
  
  // what happens when you have the same camera with both a host and ip?

  app.post("/cameras", (req, res) => {
    let foundcams = [];
    /*
    req.params.country;
    req.params.city;
    req.params.manufacturer;
    req.params.daylight;
    req.params.region;
    req.params.tag;
    */
    
    //curl -X POST -d '{"country": "United States"}' http://localhost:3000/cameras

    const db = new sqlite3('bk');

    let stmtSelect = 'SELECT * FROM cameras A LEFT JOIN locations B ON A.host = B.ipAddress LEFT JOIN camera_checks C ON A.id = C.camera_id WHERE';

    if (req.body.country) { stmtSelect += ' B.countryName = ' + '"' + req.body.country + '"' };
    if (req.body.city) { stmtSelect += ' AND B.cityName = ' + '"' + req.body.city + '"' };
    if (req.body.region) { stmtSelect += ' AND B.regionName = '+ '"' + req.body.region + '"' };
    
    stmtSelect += ' AND C.isAlive = 1 GROUP BY A.id ORDER BY A.host, A.port';

    console.log(stmtSelect);
    // subselect on active cameras only
    const rows = db.prepare(stmtSelect).all();
    for (let cam of rows) {
      // host|port|path|params|query|fragment|tags
      foundcams.push(cam); // really build a new datastructure?
    }
    res.send(foundcams);
  });

  app.post("/list/:c", (req, res) => {
    let list = [];

    const db = new sqlite3('bk');
    
    let rows = db.prepare('SELECT DISTINCT ' + fields[req.params.c] + ' FROM locations').all();
    for (let loc of rows) {
      list.push(loc[fields[req.params.c]]); // really build a new datastructure?
      };
    res.send(list);
  });
};

module.exports = appRouter;
