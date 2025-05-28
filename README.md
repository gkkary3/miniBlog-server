# MiniBlog

A simple blog application built with NestJS and TypeORM.

## Description

MiniBlog is a RESTful API for a simple blog platform where users can create, read, update, and delete posts. Built with NestJS framework and PostgreSQL database.

## Features

- User management
- Post CRUD operations
- Database seeding
- API documentation with Swagger
- TypeORM integration

## Project setup

```bash
$ npm install
```

## Database setup

1. Create a PostgreSQL database
2. Copy `.env.example` to `.env.local` and configure your database settings
3. Run migrations:

```bash
$ npm run migration:run
```

4. Seed initial data:

```bash
$ npm run seed
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## API Endpoints

- `GET /posts` - Get all posts
- `GET /posts/:id` - Get a specific post
- `POST /posts` - Create a new post
- `PUT /posts/:id` - Update a post
- `DELETE /posts/:id` - Delete a post

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Technologies Used

- NestJS
- TypeORM
- PostgreSQL
- TypeScript
- Swagger/OpenAPI

## License

This project is [MIT licensed](LICENSE).
