docker build -t ibmicpcoc/collector:latest .
docker tag ibmicpcoc/collector:latest niklaushirt/collector:0.1
docker push niklaushirt/collector:0.1
