export KUBECONFIG=/Users/$USER/.bluemix/plugins/container-service/clusters/mycluster/kube-config-fra02-mycluster.yml
kubectl delete -f k8s_deployment_course/

docker build -t ibmicpcoc/collector:latest .
docker tag ibmicpcoc/collector:latest niklaushirt/collector:courselatest
docker push niklaushirt/collector:courselatest

kubectl apply -f k8s_deployment_course/
kubectl get pods,services



kubectl apply -f k8s_deployment_course/fscollector_black.yaml
kubectl apply -f k8s_deployment_course/fscollector_red.yaml
kubectl apply -f k8s_deployment_course/fscollector_instructor.yaml


kubectl apply -f k8s_deployment_course/