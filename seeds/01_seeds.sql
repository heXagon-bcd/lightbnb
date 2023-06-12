INSERT INTO users (name, email, password)
VALUES ('shawn he', 'shawnhe05@gmail.com','$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('jessica huang', 'jess@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('sharon he', 'sharon@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');

INSERT INTO properties (owner_id, title, description, cost_per_night, number_of_bathrooms, thumbnail_photo_url, cover_photo_url, country, street, city, province, post_code)
VALUES (1, 'mint', 'description', 100, 4, 'boiler', 'boiler', 'Canada', 'test', 'test', 'ON', 'K2G8C1'),
(2, 'ottawa', 'description', 105, 3, 'boiler', 'boiler', 'Canada', 'test', 'test', 'ON', 'L3R9V1'),
(3, 'toronto', 'description', 185, 3, 'boiler', 'boiler', 'Canada', 'test', 'test', 'ON', 'K2G8C1');

INSERT INTO reservations (start_date, end_date, property_id, guest_id)
VALUES ('2018-09-11', '2018-09-26', 1, 2),
('2019-01-04', '2019-02-01', 2, 3),
('2021-10-01', '2021-10-14', 3, 3);

INSERT INTO property_reviews (rating, message, guest_id, reservation_id, property_id)
VALUES (5, 'thanks', 2, 1, 1),
(5, 'thanks', 3, 2, 2),
(5, 'thanks', 3, 3, 3);