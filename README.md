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

## API Reference

#### POST create user

```http
  POST /users
```

| Parameter  | Type     | Description                |
| :--------  | :------- | :------------------------- |
| `username` | `string` |
| `password` | `string` |

#### POST SESSIONS

```http
  POST /sessions
```

| Parameter  | Type     | Description                       |
| :--------  | :------- | :-------------------------------- |
| `username` | `string` |
| `password` | `string` |


#### SHOW ACCOUNTS

```http
  GET /accounts
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |



### Routes GAMES
#### Get all games

```http
  GET /games
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
|  |  | Return all ads |


#### SHOW TRANSACTIONS

```http
  GET /transactions/?transaction={transaction}date={date}
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `transaction`| `string` | 
| `date`    | `date` | 

#### POST TRANSACTIONS

```http
  POST /transactions/
```
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `username`| `string` | 
| `value`    | `float` | 
