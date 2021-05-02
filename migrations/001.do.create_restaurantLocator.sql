CREATE TABLE restaurants (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    the_restaurant TEXT NOT NULL,
    type TEXT
);

INSERT INTO restaurants (the_restaurant, type)
VALUES
  ('McDonald', 'Keto'),
  ('Wendy', 'Mediterranean'),
  ('Five Guys', 'Plant-based');