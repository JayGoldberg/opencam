CREATE TABLE IF NOT EXISTS cameras(
  id TEXT NOT NULL PRIMARY KEY,
  protocol TEXT,
  host TEXT,
  port TEXT,
  pathname TEXT,
  search TEXT,
  fragment TEXT,
  ip TEXT,
  reversedns TEXT,
  dateAdded TEXT
);

CREATE INDEX cameras_idx ON cameras(id);

CREATE TABLE IF NOT EXISTS locations(
  countryCode TEXT,
  url TEXT,
  cityName TEXT,
  zipCode TEXT,
  longitude TEXT,
  countryName TEXT,
  latitude TEXT,
  timeZone TEXT,
  regionName TEXT,
  ipAddress TEXT NOT NULL PRIMARY KEY,
  statusMessage TEXT,
  statusCode TEXT,
  datetime INTEGER
);

CREATE INDEX locations_idx ON locations(ipAddress);

CREATE TABLE IF NOT EXISTS camera_checks(
  camera_id TEXT NOT NULL,
  datetime INTEGER,
  isAlive INTEGER,
  FOREIGN KEY (camera_id) REFERENCES cameras(id)
);

CREATE INDEX camera_checks_idx ON camera_checks(camera_id);
CREATE INDEX camera_checks_alive_idx ON camera_checks(isAlive);
