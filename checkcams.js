const http = require('http');
const sqlite3 = require('better-sqlite3');
const dns = require('dns');
const limiter = require('limiter');

const db = new sqlite3('bk');

let throttle = new limiter.RateLimiter(1, 100);

let breakPoint = new Date();

breakPoint.setHours(breakPoint.getHours() - 48); // ignore anything checked older than 48hrs

console.log(breakPoint.getTime());

let rows = db.prepare('SELECT * FROM cameras A LEFT JOIN camera_checks B ON A.id = B.camera_id WHERE datetime < ? OR datetime IS NULL').all(breakPoint.getTime());

let insert = db.prepare('INSERT INTO camera_checks(camera_id, datetime, isAlive) VALUES(?, ?, ?)')
// and last check is more than 1hr ago

for (let cam of rows) {
  throttle.removeTokens(1, () => {
    
    let options = {
      host: cam.host,
      port: cam.port,
      timeout: 2000,
      path: '/'
    };
    // dedup based on IP, or update IP, store IP in table `iprecord`
    console.log("checking cam " + options.host, options.port);
    http.get(options, (res) => {
      res.on('data', (chunk) => {
        console.log('SUCCESS!');
        insert.run(cam.id, Date.now(), 1);
      });
      }).on('error', (err) => {
        console.log("Got error: " + err.message);
        insert.run(cam.id, Date.now(), 0);
    });
  });
};

