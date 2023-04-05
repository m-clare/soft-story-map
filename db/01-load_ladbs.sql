DROP TABLE if EXISTS ladbs;
DROP TABLE if EXISTS ladbs_raw;
CREATE TABLE ladbs_raw (
  id SERIAL,
  assessor_book TEXT,
  assessor_page TEXT,
  assessor_parcel TEXT,
  tract TEXT,
  block TEXT,
  lot TEXT,
  reference_number_old_permit_number TEXT,
  pcis_permit_number TEXT,
  status TEXT,
  status_date TEXT,
  permit_type TEXT,
  permit_sub_type TEXT,
  permit_category TEXT,
  project_number TEXT,
  event_code TEXT,
  initiating_office TEXT,
  issue_date TEXT,
  address_start TEXT,
  address_fraction_start TEXT,
  address_end TEXT,
  address_fraction_end TEXT,
  street_direction TEXT,
  street_name TEXT,
  street_suffix TEXT,
  suffix_direction TEXT,
  unit_range_start TEXT,
  unit_range_end TEXT,
  zip_code TEXT,
  work_description TEXT,
  valuation TEXT,
  floor_area_la_zoning_code_definition TEXT,
  number_of_residential_dwelling_units TEXT,
  number_of_accessory_dwelling_units TEXT,
  number_of_stories TEXT,
  contractors_business_name TEXT,
  contractor_address TEXT,
  contractor_city TEXT,
  contractor_state TEXT,
  license_type TEXT,
  license_number TEXT,
  principal_first_name TEXT,
  principal_middle_name TEXT,
  principal_last_name TEXT,
  license_expiration_date TEXT,
  applicant_first_name TEXT,
  applicant_last_name TEXT,
  applicant_business_name TEXT,
  applicant_address_1 TEXT,
  applicant_address_2 TEXT,
  applicant_address_3 TEXT,
  zone TEXT,
  occupancy TEXT,
  floor_area_la_building_code_definition TEXT,
  census_tract TEXT,
  council_district TEXT,
  lat_long TEXT,
  applicant_relationship TEXT,
  existing_code TEXT,
  proposed_code TEXT,
  PRIMARY KEY (id)
  );

\copy ladbs_raw(assessor_book,assessor_page,assessor_parcel,tract,block,lot,reference_number_old_permit_number,pcis_permit_number,status,status_date,permit_type,permit_sub_type,permit_category,project_number,event_code,initiating_office,issue_date,address_start,address_fraction_start,address_end,address_fraction_end,street_direction,street_name,street_suffix,suffix_direction,unit_range_start,unit_range_end,zip_code,work_description,valuation,floor_area_la_zoning_code_definition,number_of_residential_dwelling_units,number_of_accessory_dwelling_units,number_of_stories,contractors_business_name,contractor_address,contractor_city,contractor_state,license_type,license_number,principal_first_name,principal_middle_name,principal_last_name,license_expiration_date,applicant_first_name,applicant_last_name,applicant_business_name,applicant_address_1,applicant_address_2,applicant_address_3,zone,occupancy,floor_area_la_building_code_definition,census_tract,council_district,lat_long,applicant_relationship,existing_code,proposed_code) FROM './Building_and_Safety_Permit_Information_Old.csv' WITH DELIMITER ',' CSV HEADER NULL as 'NULL';

CREATE TABLE ladbs AS (SELECT * FROM ladbs_raw);
-- Split lat long into actual values;
ALTER TABLE ladbs ADD COLUMN latitude TEXT;
ALTER TABLE ladbs ADD COLUMN longitude TEXT;

UPDATE ladbs SET latitude = split_part(lat_long, ',',1) WHERE lat_long != '';
UPDATE ladbs SET longitude = split_part(lat_long, ',',2) WHERE lat_long != '';

UPDATE ladbs SET latitude = trim('()' FROM latitude) WHERE lat_long != '';
UPDATE ladbs SET longitude = trim('()' FROM longitude) WHERE lat_long != '';

-- Fix null value issues
UPDATE ladbs SET latitude = NULL, longitude = NULL WHERE latitude = '' OR longitude = '';

ALTER TABLE ladbs ALTER COLUMN latitude TYPE DOUBLE PRECISION USING latitude::double precision;
ALTER TABLE ladbs ALTER COLUMN longitude TYPE DOUBLE PRECISION USING longitude::double precision;

ALTER TABLE ladbs ADD COLUMN location GEOMETRY(point, 4326);
UPDATE ladbs SET location = ST_SETSRID(ST_MakePoint(cast(longitude as float), cast(latitude as float)),4326);

ALTER TABLE ladbs ADD COLUMN full_address TEXT;
UPDATE ladbs SET full_address = address_start || ' ' || street_direction || ' ' || street_name || ' ' || street_suffix || ' ' || zip_code;

ALTER TABLE ladbs ALTER COLUMN status_date TYPE DATE using to_date(status_date, 'MM/DD/YYYY');

ALTER TABLE ladbs ALTER COLUMN issue_date TYPE DATE using to_date(issue_date, 'MM/DD/YYYY');
