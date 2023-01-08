# Fampay Youtube API project

I have used node.js, mongodb and typescript for completing this project.

## To run directly on OS

Run these two commands from separate terminals

```
First run - `yarn compile:watch`
then from second terminal - `yarn dev`
```

## To deploy using Docker

```
docker-compose up
```

## To access the API

url - `http://localhost:3000/v1/videos?searchQuery=fifa&limit=10&offset=0`

where,

- searchQuery - used to search in title and description. optional feild
- limit - how many items in single request. optional field
- offset - skip these elements. optional field.
