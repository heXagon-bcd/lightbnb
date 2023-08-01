select r.id, p.title, p.cost_per_night, r.start_date , avg(pr.rating) as avg_rating
from properties p 
join reservations r on p.id = r.property_id 
join property_reviews pr on r.property_id  = pr.property_id
join users u ON p.owner_id = u.id 
group by p.id, r.id
having avg(pr.rating) >= 3
order by r.start_date 
limit 10

select *
from properties p 

select * from users u 

select * from  users u 	
where email = 'tes32@gmail.com'

 INSERT INTO users (name, email, password)
  VALUES( 'hi', 'hi@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');
  
 
  SELECT properties.*, avg(property_reviews.rating) as average_rating
  FROM properties
  JOIN property_reviews ON properties.id = property_id
  GROUP BY properties.id
  HAVING avg(property_reviews.rating) >= 4
  ORDER BY cost_per_night
