select r.id, p.title, p.cost_per_night, r.start_date , avg(pr.rating) as avg_rating
from properties p 
join reservations r on p.id = r.property_id 
join property_reviews pr on r.property_id  = pr.property_id
join users u ON p.owner_id = u.id 
where r.guest_id  = 1
group by p.id, r.id
order by r.start_date 
limit 10

select *
from properties p 

select * from

select * from  users u 	
where email = 'test@gmail.com'

 INSERT INTO users (name, email, password)
  VALUES( 'hi', 'hi@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');