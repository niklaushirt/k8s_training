minikube start
minikube start --vm-driver=virtualbox --kubernetes-version v1.14.1 --cpus=4 --memory=8192

git clone https://github.com/coreos/kube-prometheus.git

cd kube-prometheus

kubectl create -f manifests/
kubectl apply -f manifests/

kubectl get pods --all-namespaces


kubectl --namespace monitoring port-forward svc/grafana 3000




