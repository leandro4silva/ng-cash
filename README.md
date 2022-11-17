## Usage
instruções para rodar o projeto:

```bash

npm i

docker network create backend

docker-compose up

docker ps

docker exec -it <id_container> sh

//run migration
npx prisma migrate dev --name init


```