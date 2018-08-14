INSERT INTO images(image_url)
VALUES ($1)
RETURNING *;