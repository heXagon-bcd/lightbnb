select p.city , count(r.id) as total_reservations
from properties p 
join reservations r on p.id = r.property_id 
group by p.city
order by count(r.id) DESC