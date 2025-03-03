docker network create mongo-network

docker run -d --name mongo1 --network mongo-network -p 27018:27017 mongo:7.0 --replSet rs0 --bind_ip_all 
docker run -d --name mongo2 --network mongo-network -p 27019:27017 mongo:7.0 --replSet rs0 --bind_ip_all 
docker run -d --name mongo3 --network mongo-network -p 27020:27017 mongo:7.0 --replSet rs0 --bind_ip_all

docker exec -it mongo1 mongosh --eval 'rs.initiate({
  _id: "rs0",
  members: [
    { _id: 0, host: "mongo1:27017" },
    { _id: 1, host: "mongo2:27017" },
    { _id: 2, host: "mongo3:27017" }
  ]
})'