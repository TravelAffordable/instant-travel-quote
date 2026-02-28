
-- Clean all existing hotel data
DELETE FROM rate_history;
DELETE FROM rate_overrides;
DELETE FROM room_rates;
DELETE FROM room_types;
DELETE FROM hotels;

-- Create temp helper function for bulk insert
CREATE OR REPLACE FUNCTION _temp_add(d text, a text, n text, t text, s int, b bool, r text, c text, ma int, mc int, rate numeric) RETURNS void LANGUAGE plpgsql AS $$
DECLARE aid uuid; hid uuid; rid uuid;
BEGIN
  SELECT id INTO aid FROM areas WHERE destination=d::destination_code AND name=a;
  IF aid IS NULL THEN RAISE NOTICE 'Area not found: % / %', d, a; RETURN; END IF;
  INSERT INTO hotels(area_id,name,tier,star_rating,includes_breakfast) VALUES(aid,n,t::price_tier,s,b) RETURNING id INTO hid;
  INSERT INTO room_types(hotel_id,name,capacity,max_adults,max_children) VALUES(hid,r,c::room_capacity,ma,mc) RETURNING id INTO rid;
  INSERT INTO room_rates(room_type_id,base_rate_weekday,base_rate_weekend,effective_from,is_active) VALUES(rid,rate,ROUND(rate*1.1,2),'2025-01-01',true);
END;$$;

-- HARTIES BUDGET 2-SLEEPER
SELECT _temp_add('hartbeespoort','Hartbeespoort','Harties Budget 2 Sleeper Option 1','budget',3,false,'Entire bungalow','2_sleeper',2,0,600);
SELECT _temp_add('hartbeespoort','Hartbeespoort','Harties Budget 2 Sleeper Option 2','budget',3,false,'On-suite room','2_sleeper',2,0,633);
SELECT _temp_add('hartbeespoort','Hartbeespoort','Harties Budget 2 Sleeper Option 3','budget',3,false,'Entire chalet','2_sleeper',2,0,680);
SELECT _temp_add('hartbeespoort','Hartbeespoort','Harties Budget 2 Sleeper Option 4','budget',3,false,'Private room','2_sleeper',2,0,690);
SELECT _temp_add('hartbeespoort','Hartbeespoort','Harties Budget 2 Sleeper Option 5','budget',3,false,'Tent','2_sleeper',2,0,695);
SELECT _temp_add('hartbeespoort','Hartbeespoort','Harties Budget 2 Sleeper Option 6','budget',3,false,'Entire vacation home','2_sleeper',2,0,707);
SELECT _temp_add('hartbeespoort','Hartbeespoort','Harties Budget 2 Sleeper Option 7','budget',3,false,'Entire chalet','2_sleeper',2,0,713);
SELECT _temp_add('hartbeespoort','Hartbeespoort','Harties Budget 2 Sleeper Option 8','budget',3,false,'Private room','2_sleeper',2,0,720);
SELECT _temp_add('hartbeespoort','Hartbeespoort','Harties Budget 2 Sleeper Option 9','budget',3,false,'Private room','2_sleeper',2,0,750);
-- HARTIES BUDGET 4-SLEEPER
SELECT _temp_add('hartbeespoort','Hartbeespoort','Harties Budget 4 Sleeper Option 1','budget',3,false,'Entire apartment','4_sleeper',4,2,1100);
SELECT _temp_add('hartbeespoort','Hartbeespoort','Harties Budget 4 Sleeper Option 2','budget',3,false,'Room with shared bathroom','4_sleeper',4,2,1251);
SELECT _temp_add('hartbeespoort','Hartbeespoort','Harties Budget 4 Sleeper Option 3','budget',3,false,'Hotel room','4_sleeper',4,2,1282);
SELECT _temp_add('hartbeespoort','Hartbeespoort','Harties Budget 4 Sleeper Option 4','budget',3,false,'Entire apartment','4_sleeper',4,2,1354);
SELECT _temp_add('hartbeespoort','Hartbeespoort','Harties Budget 4 Sleeper Option 5','budget',3,false,'Entire chalet','4_sleeper',4,2,1361);
SELECT _temp_add('hartbeespoort','Hartbeespoort','Harties Budget 4 Sleeper Option 6','budget',3,false,'Private room','4_sleeper',4,2,1400);
SELECT _temp_add('hartbeespoort','Hartbeespoort','Harties Budget 4 Sleeper Option 7','budget',3,false,'Entire chalet','4_sleeper',4,2,1440);
SELECT _temp_add('hartbeespoort','Hartbeespoort','Harties Budget 4 Sleeper Option 8','budget',3,false,'One-Bedroom Chalet','4_sleeper',4,2,1500);
SELECT _temp_add('hartbeespoort','Hartbeespoort','Harties Budget 4 Sleeper Option 9','budget',3,false,'2 Double Rooms','4_sleeper',4,2,1670);
-- HARTIES AFFORDABLE 2-SLEEPER
SELECT _temp_add('hartbeespoort','Hartbeespoort','Harties Affordable 2 Sleeper Option 1','affordable',3,false,'Guest House Room','2_sleeper',2,0,1053);
SELECT _temp_add('hartbeespoort','Hartbeespoort','Harties Affordable 2 Sleeper Option 2','affordable',3,false,'Entire apartment','2_sleeper',2,0,1071);
SELECT _temp_add('hartbeespoort','Hartbeespoort','Harties Affordable 2 Sleeper Option 3','affordable',3,false,'Entire apartment','2_sleeper',2,0,1080);
SELECT _temp_add('hartbeespoort','Hartbeespoort','Harties Affordable 2 Sleeper Option 4','affordable',3,false,'Entire apartment','2_sleeper',2,0,1080);
SELECT _temp_add('hartbeespoort','Hartbeespoort','Harties Affordable 2 Sleeper Option 5','affordable',3,false,'Private Room','2_sleeper',2,0,1080);
SELECT _temp_add('hartbeespoort','Hartbeespoort','Harties Affordable 2 Sleeper Option 6','affordable',3,false,'Entire apartment','2_sleeper',2,0,1100);
SELECT _temp_add('hartbeespoort','Hartbeespoort','Harties Affordable 2 Sleeper Option 7','affordable',3,false,'Entire apartment','2_sleeper',2,0,1100);
SELECT _temp_add('hartbeespoort','Hartbeespoort','Harties Affordable 2 Sleeper Option 8','affordable',3,false,'Entire apartment','2_sleeper',2,0,1100);
SELECT _temp_add('hartbeespoort','Hartbeespoort','Harties Affordable 2 Sleeper Option 9','affordable',3,true,'Private Room','2_sleeper',2,0,1500);
-- HARTIES AFFORDABLE 4-SLEEPER
SELECT _temp_add('hartbeespoort','Hartbeespoort','Harties Affordable 4 Sleeper Option 1','affordable',3,false,'2 Private Rooms','4_sleeper',4,2,1607);
SELECT _temp_add('hartbeespoort','Hartbeespoort','Harties Affordable 4 Sleeper Option 2','affordable',3,true,'2 Hotel Rooms','4_sleeper',4,2,1700);
SELECT _temp_add('hartbeespoort','Hartbeespoort','Harties Affordable 4 Sleeper Option 3','affordable',3,false,'Entire Bungalow','4_sleeper',4,2,1710);
SELECT _temp_add('hartbeespoort','Hartbeespoort','Harties Affordable 4 Sleeper Option 4','affordable',3,false,'2 Private Rooms','4_sleeper',4,2,1750);
SELECT _temp_add('hartbeespoort','Hartbeespoort','Harties Affordable 4 Sleeper Option 5','affordable',3,false,'Private Suite','4_sleeper',4,2,1750);
SELECT _temp_add('hartbeespoort','Hartbeespoort','Harties Affordable 4 Sleeper Option 6','affordable',3,false,'2 Hotel Rooms','4_sleeper',4,2,1847);
SELECT _temp_add('hartbeespoort','Hartbeespoort','Harties Affordable 4 Sleeper Option 7','affordable',3,false,'Hotel Room','4_sleeper',4,2,1900);
SELECT _temp_add('hartbeespoort','Hartbeespoort','Harties Affordable 4 Sleeper Option 8','affordable',3,false,'2 Private Rooms','4_sleeper',4,2,1950);
SELECT _temp_add('hartbeespoort','Hartbeespoort','Harties Affordable 4 Sleeper Option 9','affordable',3,true,'2 Double Rooms','4_sleeper',4,2,3000);
-- DURBAN BUDGET 2-SLEEPER
SELECT _temp_add('durban','Golden Mile','Durban Budget 2 Sleeper Option 1','budget',3,false,'Entire Studio','2_sleeper',2,0,574);
SELECT _temp_add('durban','Golden Mile','Durban Budget 2 Sleeper Option 2','budget',3,false,'Entire Apartment','2_sleeper',2,0,632);
SELECT _temp_add('durban','Golden Mile','Durban Budget 2 Sleeper Option 3','budget',3,false,'Entire Apartment','2_sleeper',2,0,855);
SELECT _temp_add('durban','Golden Mile','Durban Budget 2 Sleeper Option 4','budget',3,true,'Entire Studio','2_sleeper',2,0,888);
SELECT _temp_add('durban','Golden Mile','Durban Budget 2 Sleeper Option 5','budget',3,false,'Entire Apartment','2_sleeper',2,0,900);
SELECT _temp_add('durban','Golden Mile','Durban Budget 2 Sleeper Option 6','budget',3,false,'Entire Apartment','2_sleeper',2,0,950);
SELECT _temp_add('durban','Golden Mile','Durban Budget 2 Sleeper Option 7','budget',3,false,'Entire Apartment','2_sleeper',2,0,968);
SELECT _temp_add('durban','Golden Mile','Durban Budget 2 Sleeper Option 8','budget',3,false,'Entire Apartment','2_sleeper',2,0,975);
-- DURBAN BUDGET 4-SLEEPER
SELECT _temp_add('durban','Golden Mile','Durban Budget 4 Sleeper Option 1','budget',3,false,'Two-Bedroom Apartment','4_sleeper',4,2,632);
SELECT _temp_add('durban','Golden Mile','Durban Budget 4 Sleeper Option 2','budget',3,false,'Two-Bedroom Apartment','4_sleeper',4,2,956);
SELECT _temp_add('durban','Golden Mile','Durban Budget 4 Sleeper Option 3','budget',3,false,'Two-Bedroom Apartment','4_sleeper',4,2,968);
SELECT _temp_add('durban','Golden Mile','Durban Budget 4 Sleeper Option 4','budget',3,false,'Two-Bedroom Apartment','4_sleeper',4,2,981);
SELECT _temp_add('durban','Golden Mile','Durban Budget 4 Sleeper Option 5','budget',3,false,'Entire Apartment','4_sleeper',4,2,989);
SELECT _temp_add('durban','Golden Mile','Durban Budget 4 Sleeper Option 6','budget',3,false,'Entire Apartment','4_sleeper',4,2,1042);
SELECT _temp_add('durban','Golden Mile','Durban Budget 4 Sleeper Option 7','budget',3,false,'Entire Apartment','4_sleeper',4,2,1050);
SELECT _temp_add('durban','Golden Mile','Durban Budget 4 Sleeper Option 8','budget',3,false,'Entire Apartment','4_sleeper',4,2,1060);
-- DURBAN AFFORDABLE 2-SLEEPER
SELECT _temp_add('durban','Golden Mile','Durban Affordable 2 Sleeper Option 1','affordable',3,true,'Entire Studio','2_sleeper',2,0,888);
SELECT _temp_add('durban','Golden Mile','Durban Affordable 2 Sleeper Option 2','affordable',3,true,'Private Suite','2_sleeper',2,0,972);
SELECT _temp_add('durban','Golden Mile','Durban Affordable 2 Sleeper Option 3','affordable',3,true,'Hotel Room','2_sleeper',2,0,979);
SELECT _temp_add('durban','Golden Mile','Durban Affordable 2 Sleeper Option 4','affordable',3,true,'Hotel Room','2_sleeper',2,0,1067);
SELECT _temp_add('durban','Golden Mile','Durban Affordable 2 Sleeper Option 5','affordable',3,true,'Hotel Room','2_sleeper',2,0,1078);
SELECT _temp_add('durban','Golden Mile','Durban Affordable 2 Sleeper Option 6','affordable',4,true,'Hotel Room','2_sleeper',2,0,1426);
SELECT _temp_add('durban','Golden Mile','Durban Affordable 2 Sleeper Option 7','affordable',4,true,'Hotel Room','2_sleeper',2,0,1470);
SELECT _temp_add('durban','Golden Mile','Durban Affordable 2 Sleeper Option 8','affordable',4,true,'Hotel Room','2_sleeper',2,0,1500);
-- DURBAN AFFORDABLE 4-SLEEPER
SELECT _temp_add('durban','Golden Mile','Durban Affordable 4 Sleeper Option 1','affordable',3,true,'2 Hotel Rooms','4_sleeper',4,2,1668);
SELECT _temp_add('durban','Golden Mile','Durban Affordable 4 Sleeper Option 2','affordable',3,true,'Hotel Room (Up to 4)','4_sleeper',4,2,1828);
SELECT _temp_add('durban','Golden Mile','Durban Affordable 4 Sleeper Option 3','affordable',3,true,'2 Entire Studios','4_sleeper',4,2,1836);
SELECT _temp_add('durban','Golden Mile','Durban Affordable 4 Sleeper Option 4','affordable',3,true,'Private Suite','4_sleeper',4,2,1838);
SELECT _temp_add('durban','Golden Mile','Durban Affordable 4 Sleeper Option 5','affordable',3,true,'2 Private Suites','4_sleeper',4,2,1944);
SELECT _temp_add('durban','Golden Mile','Durban Affordable 4 Sleeper Option 6','affordable',4,true,'2 Hotel Rooms','4_sleeper',4,2,2851);
SELECT _temp_add('durban','Golden Mile','Durban Affordable 4 Sleeper Option 7','affordable',4,true,'2 Hotel Rooms','4_sleeper',4,2,2900);
SELECT _temp_add('durban','Golden Mile','Durban Affordable 4 Sleeper Option 8','affordable',4,true,'2 Hotel Rooms','4_sleeper',4,2,2950);
-- DURBAN PREMIUM
SELECT _temp_add('durban','Golden Mile','Garden Court South Beach','premium',4,true,'Hotel Room','2_sleeper',2,0,1426);
SELECT _temp_add('durban','Golden Mile','The Edward','premium',4,true,'Hotel Room','2_sleeper',2,0,1470);
SELECT _temp_add('durban','Golden Mile','Blue Waters Hotel','premium',3,true,'Hotel Room','2_sleeper',2,0,1078);
SELECT _temp_add('durban','Golden Mile','Garden Court South Beach 4s','premium',4,true,'2 Hotel Rooms','4_sleeper',4,2,2851);
SELECT _temp_add('durban','Golden Mile','The Edward 4s','premium',4,true,'2 Hotel Rooms','4_sleeper',4,2,2900);
SELECT _temp_add('durban','Golden Mile','Blue Waters Hotel 4s','premium',3,true,'Hotel Room (Up to 4)','4_sleeper',4,2,1828);
-- UMHLANGA BUDGET 2-SLEEPER
SELECT _temp_add('durban','Umhlanga','Umhlanga Budget 2 Sleeper Option 1','budget',3,false,'Entire Studio','2_sleeper',2,0,1367);
SELECT _temp_add('durban','Umhlanga','Umhlanga Budget 2 Sleeper Option 2','budget',3,false,'Entire Apartment','2_sleeper',2,0,1463);
SELECT _temp_add('durban','Umhlanga','Umhlanga Budget 2 Sleeper Option 3','budget',3,false,'Entire Apartment','2_sleeper',2,0,1530);
SELECT _temp_add('durban','Umhlanga','Umhlanga Budget 2 Sleeper Option 4','budget',3,false,'Entire Apartment','2_sleeper',2,0,1538);
SELECT _temp_add('durban','Umhlanga','Umhlanga Budget 2 Sleeper Option 5','budget',3,false,'Private Room','2_sleeper',2,0,1721);
SELECT _temp_add('durban','Umhlanga','Umhlanga Budget 2 Sleeper Option 6','budget',3,true,'Private Room','2_sleeper',2,0,1800);
SELECT _temp_add('durban','Umhlanga','Umhlanga Budget 2 Sleeper Option 7','budget',3,false,'Entire Apartment','2_sleeper',2,0,1800);
SELECT _temp_add('durban','Umhlanga','Umhlanga Budget 2 Sleeper Option 8','budget',3,false,'Entire Studio','2_sleeper',2,0,1828);
-- UMHLANGA BUDGET 4-SLEEPER
SELECT _temp_add('durban','Umhlanga','Umhlanga Budget 4 Sleeper Option 1','budget',3,false,'Entire Studio','4_sleeper',4,2,1367);
SELECT _temp_add('durban','Umhlanga','Umhlanga Budget 4 Sleeper Option 2','budget',3,false,'Two-Bedroom Apartment','4_sleeper',4,2,1538);
SELECT _temp_add('durban','Umhlanga','Umhlanga Budget 4 Sleeper Option 3','budget',3,false,'Two-Bedroom Apartment','4_sleeper',4,2,1721);
SELECT _temp_add('durban','Umhlanga','Umhlanga Budget 4 Sleeper Option 4','budget',3,false,'Entire Vacation Home','4_sleeper',4,2,1850);
SELECT _temp_add('durban','Umhlanga','Umhlanga Budget 4 Sleeper Option 5','budget',3,false,'Two-Bedroom Apartment','4_sleeper',4,2,1900);
SELECT _temp_add('durban','Umhlanga','Umhlanga Budget 4 Sleeper Option 6','budget',3,false,'Three-Bedroom Apartment','4_sleeper',4,2,2700);
SELECT _temp_add('durban','Umhlanga','Umhlanga Budget 4 Sleeper Option 7','budget',3,true,'2 Private Rooms','4_sleeper',4,2,2754);
SELECT _temp_add('durban','Umhlanga','Umhlanga Budget 4 Sleeper Option 8','budget',3,true,'2 Private Rooms','4_sleeper',4,2,2800);
-- UMHLANGA AFFORDABLE 2-SLEEPER
SELECT _temp_add('durban','Umhlanga','Umhlanga Affordable 2 Sleeper Option 1','affordable',3,true,'Entire Studio','2_sleeper',2,0,1688);
SELECT _temp_add('durban','Umhlanga','Umhlanga Affordable 2 Sleeper Option 2','affordable',3,true,'Private Room','2_sleeper',2,0,1800);
SELECT _temp_add('durban','Umhlanga','Umhlanga Affordable 2 Sleeper Option 3','affordable',3,true,'Private Room','2_sleeper',2,0,1817);
SELECT _temp_add('durban','Umhlanga','Umhlanga Affordable 2 Sleeper Option 4','affordable',4,true,'Private Suite','2_sleeper',2,0,2893);
SELECT _temp_add('durban','Umhlanga','Umhlanga Affordable 2 Sleeper Option 5','affordable',4,true,'Hotel Room','2_sleeper',2,0,4422);
SELECT _temp_add('durban','Umhlanga','Umhlanga Affordable 2 Sleeper Option 6','affordable',5,true,'Hotel Room','2_sleeper',2,0,4722);
SELECT _temp_add('durban','Umhlanga','Umhlanga Affordable 2 Sleeper Option 7','affordable',5,true,'Hotel Room','2_sleeper',2,0,7918);
SELECT _temp_add('durban','Umhlanga','Umhlanga Affordable 2 Sleeper Option 8','affordable',5,true,'Hotel Room','2_sleeper',2,0,8000);
-- UMHLANGA AFFORDABLE 4-SLEEPER
SELECT _temp_add('durban','Umhlanga','Umhlanga Affordable 4 Sleeper Option 1','affordable',3,true,'2 Private Rooms','4_sleeper',4,2,2916);
SELECT _temp_add('durban','Umhlanga','Umhlanga Affordable 4 Sleeper Option 2','affordable',3,true,'2 Entire Studios','4_sleeper',4,2,3377);
SELECT _temp_add('durban','Umhlanga','Umhlanga Affordable 4 Sleeper Option 3','affordable',3,true,'2 Private Rooms','4_sleeper',4,2,3600);
SELECT _temp_add('durban','Umhlanga','Umhlanga Affordable 4 Sleeper Option 4','affordable',3,true,'2 Private Rooms','4_sleeper',4,2,3779);
SELECT _temp_add('durban','Umhlanga','Umhlanga Affordable 4 Sleeper Option 5','affordable',4,true,'Two-Bedroom Apartment','4_sleeper',4,2,6817);
SELECT _temp_add('durban','Umhlanga','Umhlanga Affordable 4 Sleeper Option 6','affordable',4,true,'2 Private Rooms','4_sleeper',4,2,8843);
SELECT _temp_add('durban','Umhlanga','Umhlanga Affordable 4 Sleeper Option 7','affordable',5,true,'2 Private Rooms','4_sleeper',4,2,9000);
SELECT _temp_add('durban','Umhlanga','Umhlanga Affordable 4 Sleeper Option 8','affordable',5,true,'2 Hotel Rooms','4_sleeper',4,2,9500);
-- CAPE TOWN BUDGET 2-SLEEPER
SELECT _temp_add('cape_town','Sea Point','Cape Town Budget 2 Sleeper Option 1','budget',3,false,'Standard Double Room','2_sleeper',2,0,700);
SELECT _temp_add('cape_town','Sea Point','Cape Town Budget 2 Sleeper Option 2','budget',3,false,'One-Bedroom Apartment','2_sleeper',2,0,1400);
SELECT _temp_add('cape_town','Sea Point','Cape Town Budget 2 Sleeper Option 3','budget',3,false,'Economy Double Room','2_sleeper',2,0,851);
SELECT _temp_add('cape_town','Sea Point','Cape Town Budget 2 Sleeper Option 4','budget',3,false,'Budget Double Room','2_sleeper',2,0,900);
SELECT _temp_add('cape_town','Sea Point','Cape Town Budget 2 Sleeper Option 5','budget',3,false,'Studio Apartment','2_sleeper',2,0,999);
SELECT _temp_add('cape_town','Sea Point','Cape Town Budget 2 Sleeper Option 6','budget',4,false,'Premier King Room','2_sleeper',2,0,1360);
SELECT _temp_add('cape_town','Sea Point','Cape Town Budget 2 Sleeper Option 7','budget',3,false,'One-Bedroom Apartment','2_sleeper',2,0,1368);
SELECT _temp_add('cape_town','Sea Point','Cape Town Budget 2 Sleeper Option 8','budget',3,false,'Double Room','2_sleeper',2,0,1433);
-- CAPE TOWN BUDGET 4-SLEEPER
SELECT _temp_add('cape_town','Sea Point','Cape Town Budget 4 Sleeper Option 1','budget',3,false,'2x Standard Double Rooms','4_sleeper',4,2,1400);
SELECT _temp_add('cape_town','Sea Point','Cape Town Budget 4 Sleeper Option 2','budget',3,false,'2x Economy Double Rooms','4_sleeper',4,2,1701);
SELECT _temp_add('cape_town','Sea Point','Cape Town Budget 4 Sleeper Option 3','budget',3,false,'Suite + Deluxe Suite','4_sleeper',4,2,1800);
SELECT _temp_add('cape_town','Sea Point','Cape Town Budget 4 Sleeper Option 4','budget',3,false,'Two-Bedroom Apartment','4_sleeper',4,2,2250);
SELECT _temp_add('cape_town','Sea Point','Cape Town Budget 4 Sleeper Option 5','budget',3,false,'Two-Bedroom Apartment','4_sleeper',4,2,2825);
SELECT _temp_add('cape_town','Sea Point','Cape Town Budget 4 Sleeper Option 6','budget',3,false,'Family Room with Balcony','4_sleeper',4,2,2520);
SELECT _temp_add('cape_town','Sea Point','Cape Town Budget 4 Sleeper Option 7','budget',3,false,'Two-Bedroom Apartment','4_sleeper',4,2,3700);
-- CAPE TOWN AFFORDABLE 2-SLEEPER
SELECT _temp_add('cape_town','Sea Point','Cape Town Affordable 2 Sleeper Option 1','affordable',3,true,'One-Bedroom Cottage','2_sleeper',2,0,1780);
SELECT _temp_add('cape_town','Sea Point','Cape Town Affordable 2 Sleeper Option 2','affordable',4,true,'Standard Room','2_sleeper',2,0,2755);
SELECT _temp_add('cape_town','Sea Point','Cape Town Affordable 2 Sleeper Option 3','affordable',3,true,'Standard Studio','2_sleeper',2,0,2910);
SELECT _temp_add('cape_town','Sea Point','Cape Town Affordable 2 Sleeper Option 4','affordable',4,true,'Standard Double Room','2_sleeper',2,0,3075);
SELECT _temp_add('cape_town','Sea Point','Cape Town Affordable 2 Sleeper Option 5','affordable',3,true,'Twin Room','2_sleeper',2,0,3200);
SELECT _temp_add('cape_town','Sea Point','Cape Town Affordable 2 Sleeper Option 6','affordable',3,true,'Double Room','2_sleeper',2,0,3285);
SELECT _temp_add('cape_town','Sea Point','Cape Town Affordable 2 Sleeper Option 7','affordable',4,true,'Deluxe Double Room','2_sleeper',2,0,3800);
-- CAPE TOWN AFFORDABLE 4-SLEEPER
SELECT _temp_add('cape_town','Sea Point','Cape Town Affordable 4 Sleeper Option 1','affordable',4,true,'Standard + Deluxe Double','4_sleeper',4,2,5990);
SELECT _temp_add('cape_town','Sea Point','Cape Town Affordable 4 Sleeper Option 2','affordable',4,true,'2x Standard Double Rooms','4_sleeper',4,2,6151);
SELECT _temp_add('cape_town','Sea Point','Cape Town Affordable 4 Sleeper Option 3','affordable',3,true,'Two-Bedroom Apartment','4_sleeper',4,2,6286);
SELECT _temp_add('cape_town','Sea Point','Cape Town Affordable 4 Sleeper Option 4','affordable',3,true,'2x Double Rooms','4_sleeper',4,2,6670);
-- CAPE TOWN PREMIUM 2-SLEEPER
SELECT _temp_add('cape_town','Sea Point','Home Suite Hotels Sea Point','premium',4,true,'Standard Sea View','2_sleeper',2,0,4710);
SELECT _temp_add('cape_town','Sea Point','Protea Hotel Sea Point','premium',4,true,'Guest Room 1 Queen','2_sleeper',2,0,4394);
SELECT _temp_add('cape_town','Sea Point','The Bantry Aparthotel','premium',3,true,'Standard Double Room','2_sleeper',2,0,4050);
SELECT _temp_add('cape_town','Foreshore/Waterfront','Southern Sun The Cullinan','premium',4,true,'Standard Queen Room','2_sleeper',2,0,4335);
SELECT _temp_add('cape_town','Foreshore/Waterfront','Southern Sun Waterfront','premium',4,true,'Standard Queen Room','2_sleeper',2,0,3613);
SELECT _temp_add('cape_town','Foreshore/Waterfront','Hotel Sky Cape Town','premium',3,true,'Double Room','2_sleeper',2,0,3000);
SELECT _temp_add('cape_town','Camps Bay','Camps Bay Forest Pods','premium',3,true,'Pod Room','2_sleeper',2,0,3500);
SELECT _temp_add('cape_town','Camps Bay','Camps Bay Village','premium',3,false,'Adventure Pads','2_sleeper',2,0,2326);
-- CAPE TOWN PREMIUM 4-SLEEPER
SELECT _temp_add('cape_town','Sea Point','President Hotel','premium',4,true,'Two Bedroom Apartment','4_sleeper',4,2,14942);
SELECT _temp_add('cape_town','Foreshore/Waterfront','Southern Sun Waterfront 4s','premium',4,true,'2x Standard Queen Room','4_sleeper',4,2,7225);
-- MPUMALANGA BUDGET 2-SLEEPER HAZYVIEW
SELECT _temp_add('mpumalanga','Hazyview','Mpumalanga Budget 2 Sleeper Option 1','budget',3,false,'Double Room','2_sleeper',2,0,666);
SELECT _temp_add('mpumalanga','Hazyview','Mpumalanga Budget 2 Sleeper Option 2','budget',3,false,'Double Room','2_sleeper',2,0,675);
SELECT _temp_add('mpumalanga','Hazyview','Mpumalanga Budget 2 Sleeper Option 3','budget',3,false,'One-Bedroom Apartment','2_sleeper',2,0,680);
SELECT _temp_add('mpumalanga','Hazyview','Mpumalanga Budget 2 Sleeper Option 4','budget',3,false,'Deluxe Double Room','2_sleeper',2,0,689);
SELECT _temp_add('mpumalanga','Hazyview','Mpumalanga Budget 2 Sleeper Option 5','budget',3,false,'One-Bedroom Apartment','2_sleeper',2,0,720);
SELECT _temp_add('mpumalanga','Hazyview','Mpumalanga Budget 2 Sleeper Option 6','budget',3,false,'Family Room','2_sleeper',2,0,740);
-- MPUMALANGA BUDGET 2-SLEEPER GRASKOP
SELECT _temp_add('mpumalanga','Graskop','Mpumalanga Budget 2 Sleeper Option 7','budget',3,false,'Double Room','2_sleeper',2,0,442);
SELECT _temp_add('mpumalanga','Graskop','Mpumalanga Budget 2 Sleeper Option 8','budget',3,false,'Deluxe Double Room','2_sleeper',2,0,749);
SELECT _temp_add('mpumalanga','Graskop','Mpumalanga Budget 2 Sleeper Option 9','budget',3,false,'Double Room','2_sleeper',2,0,770);
SELECT _temp_add('mpumalanga','Graskop','Mpumalanga Budget 2 Sleeper Option 10','budget',3,false,'Family Bungalow','2_sleeper',2,0,770);
SELECT _temp_add('mpumalanga','Graskop','Mpumalanga Budget 2 Sleeper Option 11','budget',3,false,'Tent','2_sleeper',2,0,800);
SELECT _temp_add('mpumalanga','Graskop','Mpumalanga Budget 2 Sleeper Option 12','budget',3,false,'One-Bedroom Chalet','2_sleeper',2,0,802);
SELECT _temp_add('mpumalanga','Graskop','Mpumalanga Budget 2 Sleeper Option 13','budget',3,false,'Double or Twin Room','2_sleeper',2,0,810);
SELECT _temp_add('mpumalanga','Graskop','Mpumalanga Budget 2 Sleeper Option 14','budget',3,false,'Two-Bedroom Chalet','2_sleeper',2,0,810);
SELECT _temp_add('mpumalanga','Graskop','Mpumalanga Budget 2 Sleeper Option 15','budget',3,false,'Three-Bedroom Apartment','2_sleeper',2,0,884);
-- MPUMALANGA BUDGET 4-SLEEPER HAZYVIEW
SELECT _temp_add('mpumalanga','Hazyview','Mpumalanga Budget 4 Sleeper Option 1','budget',3,false,'Two Bedroomed Cottage','4_sleeper',4,2,935);
SELECT _temp_add('mpumalanga','Hazyview','Mpumalanga Budget 4 Sleeper Option 2','budget',3,false,'Family Room','4_sleeper',4,2,986);
SELECT _temp_add('mpumalanga','Hazyview','Mpumalanga Budget 4 Sleeper Option 3','budget',3,false,'Quadruple Room','4_sleeper',4,2,1100);
SELECT _temp_add('mpumalanga','Hazyview','Mpumalanga Budget 4 Sleeper Option 4','budget',3,false,'Chalet 2 Bedroom','4_sleeper',4,2,1150);
SELECT _temp_add('mpumalanga','Hazyview','Mpumalanga Budget 4 Sleeper Option 5','budget',3,true,'Quadruple Room','4_sleeper',4,2,1750);
SELECT _temp_add('mpumalanga','Hazyview','Mpumalanga Budget 4 Sleeper Option 6','budget',3,false,'Premium Quadruple Room','4_sleeper',4,2,2031);
-- MPUMALANGA BUDGET 4-SLEEPER GRASKOP
SELECT _temp_add('mpumalanga','Graskop','Mpumalanga Budget 4 Sleeper Option 7','budget',3,false,'Four-Bedroom House','4_sleeper',4,2,907);
SELECT _temp_add('mpumalanga','Graskop','Mpumalanga Budget 4 Sleeper Option 8','budget',3,false,'Dormitory Room','4_sleeper',4,2,930);
SELECT _temp_add('mpumalanga','Graskop','Mpumalanga Budget 4 Sleeper Option 9','budget',3,false,'Bungalow','4_sleeper',4,2,1500);
SELECT _temp_add('mpumalanga','Graskop','Mpumalanga Budget 4 Sleeper Option 10','budget',3,false,'Chalet','4_sleeper',4,2,1600);
SELECT _temp_add('mpumalanga','Graskop','Mpumalanga Budget 4 Sleeper Option 11','budget',3,false,'Family Room','4_sleeper',4,2,1620);
SELECT _temp_add('mpumalanga','Graskop','Mpumalanga Budget 4 Sleeper Option 12','budget',3,false,'Two-Bedroom Chalet','4_sleeper',4,2,1782);
-- MPUMALANGA AFFORDABLE 2-SLEEPER HAZYVIEW
SELECT _temp_add('mpumalanga','Hazyview','Mpumalanga Affordable 2 Sleeper Option 1','affordable',3,true,'Standard Room','2_sleeper',2,0,1125);
SELECT _temp_add('mpumalanga','Hazyview','Mpumalanga Affordable 2 Sleeper Option 2','affordable',3,true,'Hotel Room','2_sleeper',2,0,1242);
SELECT _temp_add('mpumalanga','Hazyview','Mpumalanga Affordable 2 Sleeper Option 3','affordable',3,false,'Entire Chalet','2_sleeper',2,0,1260);
SELECT _temp_add('mpumalanga','Hazyview','Mpumalanga Affordable 2 Sleeper Option 4','affordable',3,true,'Standard Room','2_sleeper',2,0,1377);
SELECT _temp_add('mpumalanga','Hazyview','Mpumalanga Affordable 2 Sleeper Option 5','affordable',3,true,'Standard Room','2_sleeper',2,0,1485);
SELECT _temp_add('mpumalanga','Hazyview','Mpumalanga Affordable 2 Sleeper Option 6','affordable',3,true,'Private Suite','2_sleeper',2,0,1497);
SELECT _temp_add('mpumalanga','Hazyview','Mpumalanga Affordable 2 Sleeper Option 7','affordable',3,true,'Standard Room','2_sleeper',2,0,1530);
-- MPUMALANGA AFFORDABLE 2-SLEEPER GRASKOP
SELECT _temp_add('mpumalanga','Graskop','Mpumalanga Affordable 2 Sleeper Option 8','affordable',3,true,'Standard Room','2_sleeper',2,0,1300);
SELECT _temp_add('mpumalanga','Graskop','Mpumalanga Affordable 2 Sleeper Option 9','affordable',3,true,'Entire Chalet','2_sleeper',2,0,1400);
SELECT _temp_add('mpumalanga','Graskop','Mpumalanga Affordable 2 Sleeper Option 10','affordable',3,true,'Private Suite','2_sleeper',2,0,1696);
SELECT _temp_add('mpumalanga','Graskop','Mpumalanga Affordable 2 Sleeper Option 11','affordable',3,true,'Standard Room','2_sleeper',2,0,1985);
SELECT _temp_add('mpumalanga','Graskop','Mpumalanga Affordable 2 Sleeper Option 12','affordable',3,true,'Standard Room','2_sleeper',2,0,2145);
SELECT _temp_add('mpumalanga','Graskop','Mpumalanga Affordable 2 Sleeper Option 13','affordable',3,true,'Standard Room','2_sleeper',2,0,2180);
SELECT _temp_add('mpumalanga','Graskop','Mpumalanga Affordable 2 Sleeper Option 14','affordable',3,true,'Standard Room','2_sleeper',2,0,2248);
SELECT _temp_add('mpumalanga','Graskop','Mpumalanga Affordable 2 Sleeper Option 15','affordable',3,true,'Standard Room','2_sleeper',2,0,2655);
-- MPUMALANGA AFFORDABLE 4-SLEEPER HAZYVIEW
SELECT _temp_add('mpumalanga','Hazyview','Mpumalanga Affordable 4 Sleeper Option 1','affordable',3,true,'Hotel Room','4_sleeper',4,2,1750);
SELECT _temp_add('mpumalanga','Hazyview','Mpumalanga Affordable 4 Sleeper Option 2','affordable',3,true,'Hotel Room','4_sleeper',4,2,2249);
SELECT _temp_add('mpumalanga','Hazyview','Mpumalanga Affordable 4 Sleeper Option 3','affordable',3,false,'Entire Chalet','4_sleeper',4,2,2520);
SELECT _temp_add('mpumalanga','Hazyview','Mpumalanga Affordable 4 Sleeper Option 4','affordable',3,true,'2 Hotel Rooms','4_sleeper',4,2,2754);
SELECT _temp_add('mpumalanga','Hazyview','Mpumalanga Affordable 4 Sleeper Option 5','affordable',3,true,'2 Private Rooms','4_sleeper',4,2,2849);
SELECT _temp_add('mpumalanga','Hazyview','Mpumalanga Affordable 4 Sleeper Option 6','affordable',3,true,'Private Suite','4_sleeper',4,2,2900);
SELECT _temp_add('mpumalanga','Hazyview','Mpumalanga Affordable 4 Sleeper Option 7','affordable',3,true,'2 Private Suites','4_sleeper',4,2,2994);
-- MPUMALANGA AFFORDABLE 4-SLEEPER GRASKOP
SELECT _temp_add('mpumalanga','Graskop','Mpumalanga Affordable 4 Sleeper Option 8','affordable',3,true,'Hotel Room','4_sleeper',4,2,3539);
SELECT _temp_add('mpumalanga','Graskop','Mpumalanga Affordable 4 Sleeper Option 9','affordable',3,true,'Private Suite + Room','4_sleeper',4,2,3691);
SELECT _temp_add('mpumalanga','Graskop','Mpumalanga Affordable 4 Sleeper Option 10','affordable',3,true,'2 Private Rooms','4_sleeper',4,2,3969);
SELECT _temp_add('mpumalanga','Graskop','Mpumalanga Affordable 4 Sleeper Option 11','affordable',3,true,'Private Room','4_sleeper',4,2,4093);
SELECT _temp_add('mpumalanga','Graskop','Mpumalanga Affordable 4 Sleeper Option 12','affordable',3,true,'Entire Studio','4_sleeper',4,2,4205);
SELECT _temp_add('mpumalanga','Graskop','Mpumalanga Affordable 4 Sleeper Option 13','affordable',3,true,'Private Suite','4_sleeper',4,2,6750);
SELECT _temp_add('mpumalanga','Graskop','Mpumalanga Affordable 4 Sleeper Option 14','affordable',3,true,'2 Hotel Rooms','4_sleeper',4,2,7865);
-- MAGALIES BUDGET 2-SLEEPER
SELECT _temp_add('magaliesburg','Sterkfontein Caves 10km','Magalies Budget 2 Sleeper Option 1','budget',2,false,'Tent','2_sleeper',2,0,351);
SELECT _temp_add('magaliesburg','Sterkfontein Caves 10km','Magalies Budget 2 Sleeper Option 2','budget',2,false,'Guest House Room','2_sleeper',2,0,405);
SELECT _temp_add('magaliesburg','Sterkfontein Caves 10km','Magalies Budget 2 Sleeper Option 3','budget',2,false,'Guest House Room','2_sleeper',2,0,419);
SELECT _temp_add('magaliesburg','Sterkfontein Caves 10km','Magalies Budget 2 Sleeper Option 4','budget',2,false,'Entire Apartment','2_sleeper',2,0,532);
SELECT _temp_add('magaliesburg','Sterkfontein Caves 10km','Magalies Budget 2 Sleeper Option 5','budget',2,false,'Self Catering Room','2_sleeper',2,0,540);
SELECT _temp_add('magaliesburg','Sterkfontein Caves 10km','Magalies Budget 2 Sleeper Option 6','budget',2,false,'Entire Apartment','2_sleeper',2,0,663);
SELECT _temp_add('magaliesburg','Sterkfontein Caves 10km','Magalies Budget 2 Sleeper Option 7','budget',2,false,'Guest House Room','2_sleeper',2,0,693);
SELECT _temp_add('magaliesburg','Sterkfontein Caves 10km','Magalies Budget 2 Sleeper Option 8','budget',2,false,'Guest House Room','2_sleeper',2,0,697);
-- MAGALIES BUDGET 4-SLEEPER
SELECT _temp_add('magaliesburg','Sterkfontein Caves 10km','Magalies Budget 4 Sleeper Option 1','budget',2,false,'Tent','4_sleeper',4,2,367);
SELECT _temp_add('magaliesburg','Sterkfontein Caves 10km','Magalies Budget 4 Sleeper Option 2','budget',2,false,'2 Rooms Shared Bathrooms','4_sleeper',4,2,839);
SELECT _temp_add('magaliesburg','Sterkfontein Caves 10km','Magalies Budget 4 Sleeper Option 3','budget',2,false,'Private Room','4_sleeper',4,2,855);
SELECT _temp_add('magaliesburg','Sterkfontein Caves 10km','Magalies Budget 4 Sleeper Option 4','budget',2,false,'Entire Apartment','4_sleeper',4,2,891);
SELECT _temp_add('magaliesburg','Sterkfontein Caves 10km','Magalies Budget 4 Sleeper Option 5','budget',2,false,'Private Room','4_sleeper',4,2,940);
SELECT _temp_add('magaliesburg','Sterkfontein Caves 10km','Magalies Budget 4 Sleeper Option 6','budget',2,false,'Entire Apartment','4_sleeper',4,2,1058);
SELECT _temp_add('magaliesburg','Sterkfontein Caves 10km','Magalies Budget 4 Sleeper Option 7','budget',2,false,'Entire Apartment','4_sleeper',4,2,1080);
SELECT _temp_add('magaliesburg','Sterkfontein Caves 10km','Magalies Budget 4 Sleeper Option 8','budget',2,false,'Private Room','4_sleeper',4,2,1100);
-- MAGALIES AFFORDABLE 2-SLEEPER
SELECT _temp_add('magaliesburg','Sterkfontein Caves 10km','Magalies Affordable 2 Sleeper Option 1','affordable',3,false,'Entire Apartment','2_sleeper',2,0,713);
SELECT _temp_add('magaliesburg','Sterkfontein Caves 10km','Magalies Affordable 2 Sleeper Option 2','affordable',3,false,'Entire Apartment','2_sleeper',2,0,780);
SELECT _temp_add('magaliesburg','Sterkfontein Caves 10km','Magalies Affordable 2 Sleeper Option 3','affordable',3,false,'Guest Room','2_sleeper',2,0,800);
SELECT _temp_add('magaliesburg','Sterkfontein Caves 10km','Magalies Affordable 2 Sleeper Option 4','affordable',3,false,'Entire Apartment','2_sleeper',2,0,846);
SELECT _temp_add('magaliesburg','Sterkfontein Caves 10km','Magalies Affordable 2 Sleeper Option 5','affordable',3,false,'Guest House Room','2_sleeper',2,0,850);
SELECT _temp_add('magaliesburg','Sterkfontein Caves 10km','Magalies Affordable 2 Sleeper Option 6','affordable',3,false,'Private Room','2_sleeper',2,0,855);
SELECT _temp_add('magaliesburg','Sterkfontein Caves 10km','Magalies Affordable 2 Sleeper Option 7','affordable',3,false,'Private Room','2_sleeper',2,0,885);
SELECT _temp_add('magaliesburg','Sterkfontein Caves 10km','Magalies Affordable 2 Sleeper Option 8','affordable',3,false,'Guest House Room','2_sleeper',2,0,900);
-- MAGALIES AFFORDABLE 4-SLEEPER
SELECT _temp_add('magaliesburg','Sterkfontein Caves 10km','Magalies Affordable 4 Sleeper Option 1','affordable',3,false,'Entire Apartment','4_sleeper',4,2,1080);
SELECT _temp_add('magaliesburg','Sterkfontein Caves 10km','Magalies Affordable 4 Sleeper Option 2','affordable',3,false,'Private Room','4_sleeper',4,2,1256);
SELECT _temp_add('magaliesburg','Sterkfontein Caves 10km','Magalies Affordable 4 Sleeper Option 3','affordable',3,false,'Private Suite','4_sleeper',4,2,1260);
SELECT _temp_add('magaliesburg','Sterkfontein Caves 10km','Magalies Affordable 4 Sleeper Option 4','affordable',3,false,'Private Room','4_sleeper',4,2,1368);
SELECT _temp_add('magaliesburg','Sterkfontein Caves 10km','Magalies Affordable 4 Sleeper Option 5','affordable',3,false,'Hotel Room','4_sleeper',4,2,1485);
SELECT _temp_add('magaliesburg','Sterkfontein Caves 10km','Magalies Affordable 4 Sleeper Option 6','affordable',3,false,'Private Room','4_sleeper',4,2,1499);
SELECT _temp_add('magaliesburg','Sterkfontein Caves 10km','Magalies Affordable 4 Sleeper Option 7','affordable',3,false,'Entire Apartment','4_sleeper',4,2,1600);
SELECT _temp_add('magaliesburg','Sterkfontein Caves 10km','Magalies Affordable 4 Sleeper Option 8','affordable',3,false,'2 Private Rooms','4_sleeper',4,2,1700);
-- MAGALIES PREMIUM 2-SLEEPER
SELECT _temp_add('magaliesburg','Sterkfontein Caves 10km','Forum Homini Boutique Hotel','premium',5,true,'Standard Luxury Suite','2_sleeper',2,0,4770);
SELECT _temp_add('magaliesburg','Sterkfontein Caves 10km','African Hills Safari Lodge','premium',4,true,'Standard Room','2_sleeper',2,0,4540);
SELECT _temp_add('magaliesburg','Sterkfontein Caves 10km','Kloofzicht Lodge and Spa','premium',5,true,'Deluxe Suite','2_sleeper',2,0,4020);
SELECT _temp_add('magaliesburg','Sterkfontein Caves 10km','De Hoek Country Hotel','premium',4,true,'Standard Twin Room','2_sleeper',2,0,4000);
SELECT _temp_add('magaliesburg','Sterkfontein Caves 10km','Vivari Hotel and Spa','premium',4,true,'Classic King Room','2_sleeper',2,0,3800);
SELECT _temp_add('magaliesburg','Sterkfontein Caves 10km','Sibani Lodge','premium',4,true,'Chalet','2_sleeper',2,0,3700);
SELECT _temp_add('magaliesburg','Sterkfontein Caves 10km','Mount Grace Hotel and Spa','premium',4,true,'Standard Premium Room','2_sleeper',2,0,3466);
SELECT _temp_add('magaliesburg','Sterkfontein Caves 10km','Valley Lodge and Spa','premium',4,true,'Standard Double Room','2_sleeper',2,0,3120);
SELECT _temp_add('magaliesburg','Sterkfontein Caves 10km','Avianto','premium',4,true,'Double Room','2_sleeper',2,0,2907);
SELECT _temp_add('magaliesburg','Sterkfontein Caves 10km','Maropeng Boutique Hotel','premium',4,true,'Double Room','2_sleeper',2,0,2243);
SELECT _temp_add('magaliesburg','Sterkfontein Caves 10km','26 South Bush Boho Hotel','premium',3,true,'Double Room','2_sleeper',2,0,1332);
-- MAGALIES PREMIUM 4-SLEEPER
SELECT _temp_add('magaliesburg','Sterkfontein Caves 10km','Forum Homini 4s','premium',5,true,'2x Luxury Suite','4_sleeper',4,2,9540);
SELECT _temp_add('magaliesburg','Sterkfontein Caves 10km','Kloofzicht Lodge 4s','premium',5,true,'Deluxe + Family Suite','4_sleeper',4,2,9240);
SELECT _temp_add('magaliesburg','Sterkfontein Caves 10km','African Hills Safari 4s','premium',4,true,'2x Standard Room','4_sleeper',4,2,9080);
SELECT _temp_add('magaliesburg','Sterkfontein Caves 10km','Mount Grace 4s','premium',4,true,'Premium + Superior Room','4_sleeper',4,2,7241);
SELECT _temp_add('magaliesburg','Sterkfontein Caves 10km','Cradle Moon Lakeside Lodge','premium',4,true,'2x Deluxe Double Room','4_sleeper',4,2,6600);
SELECT _temp_add('magaliesburg','Sterkfontein Caves 10km','Valley Lodge 4s','premium',4,true,'2x Standard Double Room','4_sleeper',4,2,6240);
SELECT _temp_add('magaliesburg','Sterkfontein Caves 10km','Maropeng Boutique 4s','premium',4,true,'2x Double Room','4_sleeper',4,2,4529);
SELECT _temp_add('magaliesburg','Sterkfontein Caves 10km','26 South Bush Boho 4s','premium',3,true,'2x Double Room','4_sleeper',4,2,2664);
-- BELA-BELA BUDGET 2-SLEEPER
SELECT _temp_add('bela_bela','Bela-Bela Central','Bela-Bela Budget 2 Sleeper Option 1','budget',2,false,'Budget Double Room','2_sleeper',2,0,405);
SELECT _temp_add('bela_bela','Bela-Bela Central','Bela-Bela Budget 2 Sleeper Option 2','budget',2,false,'One-Bedroom Chalet','2_sleeper',2,0,583);
SELECT _temp_add('bela_bela','Bela-Bela Central','Bela-Bela Budget 2 Sleeper Option 3','budget',2,false,'One-Bedroom Chalet','2_sleeper',2,0,627);
SELECT _temp_add('bela_bela','Bela-Bela Central','Bela-Bela Budget 2 Sleeper Option 4','budget',2,false,'Double Room','2_sleeper',2,0,630);
SELECT _temp_add('bela_bela','Bela-Bela Central','Bela-Bela Budget 2 Sleeper Option 5','budget',3,false,'Double Room','2_sleeper',2,0,650);
SELECT _temp_add('bela_bela','Bela-Bela Central','Bela-Bela Budget 2 Sleeper Option 6','budget',2,false,'Budget Twin Room','2_sleeper',2,0,700);
SELECT _temp_add('bela_bela','Bela-Bela Central','Bela-Bela Budget 2 Sleeper Option 7','budget',2,false,'Double Room','2_sleeper',2,0,720);
SELECT _temp_add('bela_bela','Bela-Bela Central','Bela-Bela Budget 2 Sleeper Option 8','budget',2,false,'Double Room','2_sleeper',2,0,765);
SELECT _temp_add('bela_bela','Bela-Bela Central','Bela-Bela Budget 2 Sleeper Option 9','budget',3,false,'Deluxe Double Room','2_sleeper',2,0,799);
-- BELA-BELA BUDGET 4-SLEEPER
SELECT _temp_add('bela_bela','Bela-Bela Central','Bela-Bela Budget 4 Sleeper Option 1','budget',2,false,'One-Bedroom Chalet','4_sleeper',4,2,583);
SELECT _temp_add('bela_bela','Bela-Bela Central','Bela-Bela Budget 4 Sleeper Option 2','budget',2,false,'One-Bedroom Chalet','4_sleeper',4,2,627);
SELECT _temp_add('bela_bela','Bela-Bela Central','Bela-Bela Budget 4 Sleeper Option 3','budget',2,false,'One-Bedroom Apartment','4_sleeper',4,2,1152);
SELECT _temp_add('bela_bela','Bela-Bela Central','Bela-Bela Budget 4 Sleeper Option 4','budget',2,false,'Two-Bedroom Apartment','4_sleeper',4,2,1215);
SELECT _temp_add('bela_bela','Bela-Bela Central','Bela-Bela Budget 4 Sleeper Option 5','budget',3,false,'Two-Bedroom Chalet','4_sleeper',4,2,1260);
SELECT _temp_add('bela_bela','Bela-Bela Central','Bela-Bela Budget 4 Sleeper Option 6','budget',2,false,'Double or Twin Room','4_sleeper',4,2,1260);
SELECT _temp_add('bela_bela','Bela-Bela Central','Bela-Bela Budget 4 Sleeper Option 7','budget',3,false,'Double Room','4_sleeper',4,2,1350);
SELECT _temp_add('bela_bela','Bela-Bela Central','Bela-Bela Budget 4 Sleeper Option 8','budget',2,false,'Apartment','4_sleeper',4,2,1350);
SELECT _temp_add('bela_bela','Bela-Bela Central','Bela-Bela Budget 4 Sleeper Option 9','budget',2,false,'Cottage','4_sleeper',4,2,1400);
-- BELA-BELA AFFORDABLE 2-SLEEPER
SELECT _temp_add('bela_bela','Bela-Bela Central','Bela-Bela Affordable 2 Sleeper Option 1','affordable',3,false,'Double Room','2_sleeper',2,0,800);
SELECT _temp_add('bela_bela','Bela-Bela Central','Bela-Bela Affordable 2 Sleeper Option 2','affordable',3,false,'Superior Double Room','2_sleeper',2,0,800);
SELECT _temp_add('bela_bela','Bela-Bela Central','Bela-Bela Affordable 2 Sleeper Option 3','affordable',3,false,'Standard Apartment','2_sleeper',2,0,850);
SELECT _temp_add('bela_bela','Bela-Bela Central','Bela-Bela Affordable 2 Sleeper Option 4','affordable',3,false,'Double or Twin Room','2_sleeper',2,0,880);
SELECT _temp_add('bela_bela','Bela-Bela Central','Bela-Bela Affordable 2 Sleeper Option 5','affordable',3,false,'Double Room','2_sleeper',2,0,891);
SELECT _temp_add('bela_bela','Bela-Bela Central','Bela-Bela Affordable 2 Sleeper Option 6','affordable',3,false,'Deluxe Double Room','2_sleeper',2,0,899);
SELECT _temp_add('bela_bela','Bela-Bela Central','Bela-Bela Affordable 2 Sleeper Option 7','affordable',3,false,'Double Room','2_sleeper',2,0,900);
SELECT _temp_add('bela_bela','Bela-Bela Central','Bela-Bela Affordable 2 Sleeper Option 8','affordable',3,false,'Standard Double Room','2_sleeper',2,0,903);
SELECT _temp_add('bela_bela','Bela-Bela Central','Bela-Bela Affordable 2 Sleeper Option 9','affordable',3,false,'Standard Queen Room','2_sleeper',2,0,945);
-- BELA-BELA AFFORDABLE 4-SLEEPER
SELECT _temp_add('bela_bela','Bela-Bela Central','Bela-Bela Affordable 4 Sleeper Option 1','affordable',3,false,'Three-Bedroom House','4_sleeper',4,2,1513);
SELECT _temp_add('bela_bela','Bela-Bela Central','Bela-Bela Affordable 4 Sleeper Option 2','affordable',3,false,'Apartment Split Level','4_sleeper',4,2,1540);
SELECT _temp_add('bela_bela','Bela-Bela Central','Bela-Bela Affordable 4 Sleeper Option 3','affordable',3,false,'Standard Quadruple Room','4_sleeper',4,2,1540);
SELECT _temp_add('bela_bela','Bela-Bela Central','Bela-Bela Affordable 4 Sleeper Option 4','affordable',3,false,'Double Room x2','4_sleeper',4,2,1600);
SELECT _temp_add('bela_bela','Bela-Bela Central','Bela-Bela Affordable 4 Sleeper Option 5','affordable',3,false,'Double / Deluxe Room','4_sleeper',4,2,1615);
SELECT _temp_add('bela_bela','Bela-Bela Central','Bela-Bela Affordable 4 Sleeper Option 6','affordable',3,false,'Two-Bedroom Apartment','4_sleeper',4,2,1670);

-- Drop temp function
DROP FUNCTION IF EXISTS _temp_add;
