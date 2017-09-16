const readline = require('readline');
const fs = require('fs');
const sqlite3 = require('better-sqlite3');
const url = require('url');
const crypto = require('crypto');

const db = new sqlite3('bk');

const stmt = db.prepare('INSERT INTO cameras VALUES (?,?,?, ?,?,?, ?,?,?, ?)');

const rl = readline.createInterface({
  input: fs.createReadStream(process.argv[2]),
  output: process.stdout,
  terminal: false
});

// check ipv4

/*
rl.on('end', (line) => {
  stmt.finalize(() => { locdb.run('END TRANSACTION'); locdb.close(); });
});

rl.on('close', (line) => {
  stmt.finalize(() => { locdb.run('END TRANSACTION'); locdb.close(); });
});
*/

rl.on('line', (line) => {
  if (line == null) {return;};
  const hash = crypto.createHash('RSA-SHA1');
  theData = url.parse(line);
  // protocol, host, port, pathname, search, fragment
  // host part, remove port
  
  if (theData.port == undefined) { theData.port = '80' };
  
  hash.update(theData.host.split(':',1)[0] + theData.port);
  
  let digest = hash.digest('hex');
  try {
	  stmt.run(
		digest,
		theData.protocol,
		theData.host.split(':',1)[0],
		theData.port,
		theData.pathname,
		theData.search,
		theData.fragment,
		null,
		null,
		Date.now()
	  );
  } catch (err) {
    console.log(theData.host.split(':',1)[0], theData.port, digest + err);
  }
});
