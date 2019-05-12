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