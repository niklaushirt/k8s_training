

cd /Users/nhirt/PROJECTS/TRAINING/k8s_training/fs-collector_v1
docker build -t ibmicpcoc/collector:latest .

docker run --rm -p 3000:3000 --name collector -e APP_NAMESPACE=test ibmicpcoc/collector:latest

docker kill collector
docker rm collector

