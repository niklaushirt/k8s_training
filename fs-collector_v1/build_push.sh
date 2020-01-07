curl -sL https://ibm.biz/idt-installer | bash





ibmcloud login -a cloud.ibm.com -r eu-de -g default

ibmcloud login -a cloud.ibm.com -r eu-de -g default --sso

ibmcloud ks cluster config --cluster f3fe68669d124b73b54d762d5f719459

export KUBECONFIG=/Users/$USER/.bluemix/plugins/container-service/clusters/f3fe68669d124b73b54d762d5f719459/kube-config-fra02-mycluster.yml


cd /Users/nhirt/PROJECTS/TRAINING/k8s_training/fs-collector_v1

kubectl delete -f k8s_deployment_course/student/
kubectl delete -f k8s_deployment_course/instructor/


docker build -t ibmicpcoc/collector:latest .
docker tag ibmicpcoc/collector:latest niklaushirt/collector:courselatest
docker push niklaushirt/collector:courselatest

kubectl apply -f k8s_deployment_course/instructor/fscollector_instructor.yaml

kubectl apply -f k8s_deployment_course/student/






kubectl apply -f k8s_deployment_course/fix/fscollector_fix.yaml






export KUBECONFIG=/Users/$USER/.bluemix/plugins/container-service/clusters/mycluster/kube-config-fra02-mycluster.yml
kubectl delete -f k8s_deployment_course/prereq.yaml

kubectl delete -f k8s_deployment_course/student/
kubectl delete -f k8s_deployment_course/instructor/


docker build -t ibmicpcoc/collector:latest .
docker tag ibmicpcoc/collector:latest niklaushirt/collector:courselatest
docker push niklaushirt/collector:courselatest



kubectl get pods,services

kubectl apply -f k8s_deployment_course/instructor/fscollector_instructor.yaml

kubectl apply -f k8s_deployment_course/student/




kubectl apply -f k8s_deployment_course/instructor/fscollector_instructor.yaml
kubectl apply -f k8s_deployment_course/student/fscollector_black.yaml
kubectl apply -f k8s_deployment_course/student/fscollector_red.yaml


cd PROJECTS/TRAINING/k8s_training/fs-collector_v1
docker build -t ibmicpcoc/collector:latest .

docker run --rm -p 3000:3000 --name collector -e APP_NAMESPACE=test ibmicpcoc/collector:latest

docker kill collector
docker rm collector