create materialized view "UserInfo" as SELECT
  u.username,
  us.name AS status_name,
  u.password
FROM
  (
    users u
    JOIN "user_status" us ON ((us.id = u.status_id))
  );
