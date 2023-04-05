DROP TABLE if EXISTS soft_story_geocode;
DROP TABLE if EXISTS soft_story_geocode_raw;
CREATE TABLE soft_story_geocode_raw(
  id SERIAL,
  geocode_input TEXT,
  match TEXT,
  match_type TEXT,
  match_address TEXT,
  longitude TEXT,
  latitude TEXT,
  parcel_number TEXT,
  join_type TEXT,
  log_id TEXT,
  street_number TEXT,
  street_direction TEXT,
  street_name TEXT,
  street_suffix TEXT,
  street_unit TEXT,
  zip_code TEXT,
  PRIMARY KEY (id)
  );

\copy soft_story_geocode_raw(geocode_input, match, match_type, match_address, longitude, latitude, parcel_number, join_type, log_id, street_number, street_direction, street_name, street_suffix, street_unit, zip_code) FROM 'soft_story_geocode_original.csv' WITH DELIMITER ',' CSV HEADER NULL as 'NULL';

CREATE TABLE soft_story_geocode AS (SELECT * FROM soft_story_geocode_raw);

-- Fix null value issues
UPDATE soft_story_geocode SET latitude = NULL, longitude = NULL WHERE latitude = '' OR longitude = '';

ALTER TABLE soft_story_geocode ALTER COLUMN latitude TYPE DOUBLE PRECISION USING latitude::double precision;
ALTER TABLE soft_story_geocode ALTER COLUMN longitude TYPE DOUBLE PRECISION USING longitude::double precision;

ALTER TABLE soft_story_geocode ADD COLUMN location GEOMETRY(point, 4326);
UPDATE soft_story_geocode SET location = ST_SETSRID(ST_MakePoint(cast(longitude as float), cast(latitude as float)),4326);

ALTER TABLE soft_story_geocode ADD COLUMN full_address TEXT;
UPDATE soft_story_geocode SET full_address = street_number || ' ' || street_direction || ' ' || street_name || ' ' || street_suffix || ' ' || zip_code;

DROP TABLE if EXISTS soft_story;
DROP TABLE if EXISTS soft_story_raw;

CREATE TABLE soft_story_raw(
  id SERIAL,
  log_id TEXT,
  street_number TEXT,
  street_fraction TEXT,
  street_direction TEXT,
  street_name TEXT,
  street_suffix TEXT,
  street_suffix_direction TEXT,
  street_unit TEXT,
  zip_code TEXT,
  type TEXT,
  PRIMARY KEY (id)
  );

\copy soft_story_raw(log_id, street_number, street_fraction, street_direction, street_name, street_suffix, street_suffix_direction, street_unit, zip_code,type) FROM 'soft_story_apartment.csv' WITH DELIMITER ',' CSV HEADER NULL as 'NULL';

\copy soft_story_raw(log_id, street_number, street_fraction, street_direction, street_name, street_suffix, street_suffix_direction, street_unit, zip_code,type) FROM 'soft_story_condo.csv' WITH DELIMITER ',' CSV HEADER NULL as 'NULL';

CREATE TABLE soft_story AS (SELECT * FROM soft_story_raw);

ALTER TABLE soft_story ADD COLUMN full_address TEXT;
UPDATE soft_story SET full_address = street_number || ' ' || street_direction || ' ' || street_name || ' ' || street_suffix || ' ' || zip_code;
