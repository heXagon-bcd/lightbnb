select p.id, p.title, p.cost_per_night, AVG(pr.rating) as avg_rating
from properties p 
join property_reviews pr on p.id = pr.property_id
where p.city like '%ancouv%'
group by p.id
having AVG(pr.rating) >= 4
order by cost_per_night asc
limit 10
