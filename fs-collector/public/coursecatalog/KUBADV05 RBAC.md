
:course_title: KUBADV05 RBAC

:course_desc: This course provides the student with the necessary steps to get a basic understanding of Networking.  

:course_max: 7

:course_auto: no

:button1_label: Task

:button2_label: Hint

:button2_delay: 999999

:button3_label: Complete

:button3_delay: 10000







----
#### Task Introduction

----
# Using Kubernetes RBAC and service accounts

## Learn how to expose parts of the Kubernetes API with RBAC

* * *

One of the powerful aspects of Kubernetes is the ability for applications to call the Kubernetes API for advanced configuration. Starting in Kubernetes 1.8, access to the API was put under a Role Based Access Control model for increased security. We’ll take some time to look at how this changes by using the API in Kubernetes and how to build configuration that correctly uses RBAC.

## Learning Objectives

Upon completing this tutorial, you will understand how to:

  * Expose parts of the Kubernetes API using Roles and RoleBindings.
  * Create a ServiceAccount to further restrict which pods can make API calls.

## Prerequisites

In order to complete this tutorial, you will need the following prerequisites:

  * An IBM Cloud account on the Pay-as-you-go tier (Kubernetes Clusters are not available on the Free tier) – [sign up](https://cloud.ibm.com/registration/) if you don’t have an account yet.
  * A provisioned [Kubernetes cluster](https://cloud.ibm.com/containers-kubernetes/clusters) in the IBM Cloud Kubernetes Service.
  * Install the [IBM Cloud Developer Tools](https://cloud.ibm.com/docs/cli/idt/setting_up_idt.html#add-cli).
  * Git Clone the [rbac-in-k8s git repository](https://github.com/IBM/rbac-in-k8s) – this provides all the configuration files for creating images and the Kubernetes yaml files that are required for walking through this tutorial.

## Estimated Time

The total time to complete this tutorial is around 90 minutes.



### Workshop

* Lab 1 - Download the Sample Application
* Lab 2 - Make sure minikube is running
* Lab 3 - aaa
* Lab 4 - aaa
* Lab 5 - aaa
* Lab 6 - aaa
* Lab 7 - aaa

----


#### Hint Introduction

No hint available


#### Complete Introduction

$ Confirm Introduction complete







#### Task Get Source Code 

----


## Lab 2 - Download the Sample Application
The application used in this lab is a simple guestbook website where users can post messages.
You should clone it to your workstation since you will be using some of the configuration files.

```
	$ git clone https://github.com/niklaushirt/guestbook.git
```

#### Hint Get Source Code 

No hint available


#### Complete Get Source Code 

$ Confirm Check Minikube complete



#### Task Check Minikube

----

# Lab 1 - Make sure minikube is running


* Verify that minikube is running
	If not please complete KUB01 Lab Setup


	```
	$ minikube status
	
	host: Running
	kubelet: Running
	apiserver: Running
	kubectl: Correctly Configured: pointing to minikube-vm at 192.168.99.100
	```
	
* Verify kubectl can communicate with your cluster.

	```
	$ kubectl get nodes
	
	NAME       STATUS    ROLES     AGE       VERSION
	minikube   Ready     master    32m       v1.14.1
	```

* Enable Kubernetes Dashboard

	```
	$ minikube dashboard                                                                                              
	
	🔌  Enabling dashboard ...
	🤔  Verifying dashboard health ...
	🚀  Launching proxy ...
	🤔  Verifying proxy health ...
	🎉  Opening http://127.0.0.1:58935/api/v1/namespaces/kube-system/services/http:kubernetes-dashboard:/proxy/ in your default browser...
	```





#### Hint Check Minikube

No hint available


#### Complete Check Minikube

$ Confirm Check Minikube complete







#### Task Deploy the guestbook application

----

# Lab 3 - Deploy the guestbook application



## Start our sample application and our tools pod

We’re going to start up two deployments based on the built images from step 1:

```    
$ kubectl apply -f deploy/mqtt.yaml -f deploy/tools.yaml secret "mqtt-secret" created persistentvolumeclaim "mqtt-nfs" created deployment.apps "mqtt" created service "mqtt" created deployment.apps "tools-no-rbac" created 
```

This is going to take a 2 – 3 minutes to provision. `kubectl get all` will display the current status. When both pods are in the `Running` state you can proceed to the next steps.
 
```   
    $ kubectl get all NAME READY STATUS RESTARTS AGE pod/mqtt-5ccf8b68b6-m8hfl 1/1 Running 0 2m pod/tools-no-rbac-7dc96f489b-d9gcl 1/1 Running 0 2m NAME TYPE CLUSTER-IP EXTERNAL-IP PORT(S) AGE service/kubernetes ClusterIP 172.21.0.1 <none$ 443/TCP 16d service/mqtt LoadBalancer 172.21.173.243 169.60.93.179 1883:31532/TCP,80:31517/TCP 2m NAME DESIRED CURRENT UP-TO-DATE AVAILABLE AGE deployment.extensions/mqtt 1 1 1 1 2m deployment.extensions/tools-no-rbac 1 1 1 1 2m NAME DESIRED CURRENT READY AGE replicaset.extensions/mqtt-5ccf8b68b6 1 1 1 2m replicaset.extensions/tools-no-rbac-7dc96f489b 1 1 1 2m NAME DESIRED CURRENT UP-TO-DATE AVAILABLE AGE deployment.apps/mqtt 1 1 1 1 2m deployment.apps/tools-no-rbac 1 1 1 1 2m NAME DESIRED CURRENT READY AGE replicaset.apps/mqtt-5ccf8b68b6 1 1 1 2m replicaset.apps/tools-no-rbac-7dc96f489b 1 1 1 2m 
```

### 3. Attempt to access the Kubernetes API

One of the powerful parts of Kubernetes is the ability to interact with the Kubernetes API inside the cluster. This allows applications to actively manage their own resources and adapt to circumstances.

We’ll demonstrate that by connecting to our tools app and using `kubectl`.

Run the following command to get the name of the tools pod that we launched in the environment.

```    
    $ kubectl get pods -l rbac=none NAME READY STATUS RESTARTS AGE tools-no-rbac-7dc96f489b-ph7h9 1/1 Running 0 1h 
```

Now we can create a bash session on that pod by using the following command:
 
 ```   
    $ kubectl exec -it tools-no-rbac-7dc96f489b-ph7h9 bash root@tools-no-rbac-7dc96f489b-ph7h9:/# 
```

We’re in! The next step is to run `kubectl get all` to see what resources we can see from there.
 
 ```   
    root@tools-no-rbac-7dc96f489b-ph7h9:/# kubectl get all Error from server (Forbidden): pods is forbidden: User "system:serviceaccount:default:default" cannot list pods in the namespace "default" Error from server (Forbidden): replicationcontrollers is forbidden: User "system:serviceaccount:default:default" cannot list replicationcontrollers in the namespace "default" Error from server (Forbidden): services is forbidden: User "system:serviceaccount:default:default" cannot list services in the namespace "default" Error from server (Forbidden): daemonsets.extensions is forbidden: User "system:serviceaccount:default:default" cannot list daemonsets.extensions in the namespace "default" Error from server (Forbidden): deployments.extensions is forbidden: User "system:serviceaccount:default:default" cannot list deployments.extensions in the namespace "default" Error from server (Forbidden): replicasets.extensions is forbidden: User "system:serviceaccount:default:default" cannot list replicasets.extensions in the namespace "default" Error from server (Forbidden): daemonsets.apps is forbidden: User "system:serviceaccount:default:default" cannot list daemonsets.apps in the namespace "default" Error from server (Forbidden): deployments.apps is forbidden: User "system:serviceaccount:default:default" cannot list deployments.apps in the namespace "default" Error from server (Forbidden): replicasets.apps is forbidden: User "system:serviceaccount:default:default" cannot list replicasets.apps in the namespace "default" Error from server (Forbidden): statefulsets.apps is forbidden: User "system:serviceaccount:default:default" cannot list statefulsets.apps in the namespace "default" Error from server (Forbidden): horizontalpodautoscalers.autoscaling is forbidden: User "system:serviceaccount:default:default" cannot list horizontalpodautoscalers.autoscaling in the namespace "default" Error from server (Forbidden): jobs.batch is forbidden: User "system:serviceaccount:default:default" cannot list jobs.batch in the namespace "default" Error from server (Forbidden): cronjobs.batch is forbidden: User "system:serviceaccount:default:default" cannot list cronjobs.batch in the namespace "default" 
```

Okay that didn’t work. So what happened?

Starting in Kubernetes 1.9, the API was put behind a mandatory Role Based Access Control system. By default, access is no longer granted to applications. You must now explicitly allow access to the parts of the API that your applications need. This broke a lot of applications that weren’t prepared for the transition.

Kubernetes has two resources that control the access to the API:

  * **Role**: specifies what access is granted
  * **RoleBinding**: specifies who the Role applies to

We’ll create both in a few ways to see how this all works.

### 4. Create a Role and RoleBinding

Our first step is to create a `Role`. The example `Role` can do two things: list or get all services, and create or delete secrets.
    
    kind: Role apiVersion: rbac.authorization.k8s.io/v1 metadata: name: api-role namespace: default labels: app: tools-rbac rules: - apiGroups: [""] resources: ["services"] verbs: ["get", "list"] - apiGroups: [""] resources: ["configmaps"] verbs: ["create"] - apiGroups: [""] resources: ["configmaps"] resourceNames: ["mqtt-pub-address"] verbs: ["update", "delete"] 

Roles are specified as a set of rules. They are based on the apiGroup (empty for core resources), resource name, verbs to act on the that resource, and optionally a resourceName to restrict it further (often used with secrets and configmaps).

This Role will let us list the services, get information on a particular service, and create or delete a single secret.

A Role in isolation doesn’t do anything until we bind it with a RoleBinding.
    
    kind: RoleBinding apiVersion: rbac.authorization.k8s.io/v1 metadata: name: global-rolebinding namespace: default labels: app: tools-rbac subjects: - kind: Group name: system:serviceaccounts apiGroup: rbac.authorization.k8s.io namespace: default roleRef: kind: Role name: api-role apiGroup: "" 

A RoleBinding links a Role to Subjects. There are many different ways to handle Subjects. In this case, we’ll give this Role to all service accounts in the default namespace. This effectively means that all pods will have access to these APIs.

This can be applied with the yaml file in the repository:
    
    $ kubectl apply -f deploy/role.yaml -f deploy/global-role-assign.yaml role.rbac.authorization.k8s.io "api-role" created rolebinding.rbac.authorization.k8s.io "global-rolebinding" created 

### 5. Test our new Access

Let’s connect to our tools pod and see what happens now:
    
    $ kubectl exec -it tools-no-rbac-7dc96f489b-ph7h9 bash root@tools-no-rbac-7dc96f489b-ph7h9:/# kubectl get all NAME TYPE CLUSTER-IP EXTERNAL-IP PORT(S) AGE kubernetes ClusterIP 172.21.0.1 <none$ 443/TCP 15d mqtt LoadBalancer 172.21.91.88 169.60.93.179 1883:32145/TCP,80:31639/TCP 22h Error from server (Forbidden): pods is forbidden: User "system:serviceaccount:default:default" cannot list pods in the namespace "default" Error from server (Forbidden): replicationcontrollers is forbidden: User "system:serviceaccount:default:default" cannot list replicationcontrollers in the namespace "default" Error from server (Forbidden): daemonsets.extensions is forbidden: User "system:serviceaccount:default:default" cannot list daemonsets.extensions in the namespace "default" Error from server (Forbidden): deployments.extensions is forbidden: User "system:serviceaccount:default:default" cannot list deployments.extensions in the namespace "default" Error from server (Forbidden): replicasets.extensions is forbidden: User "system:serviceaccount:default:default" cannot list replicasets.extensions in the namespace "default" Error from server (Forbidden): daemonsets.apps is forbidden: User "system:serviceaccount:default:default" cannot list daemonsets.apps in the namespace "default" Error from server (Forbidden): deployments.apps is forbidden: User "system:serviceaccount:default:default" cannot list deployments.apps in the namespace "default" Error from server (Forbidden): replicasets.apps is forbidden: User "system:serviceaccount:default:default" cannot list replicasets.apps in the namespace "default" Error from server (Forbidden): statefulsets.apps is forbidden: User "system:serviceaccount:default:default" cannot list statefulsets.apps in the namespace "default" Error from server (Forbidden): horizontalpodautoscalers.autoscaling is forbidden: User "system:serviceaccount:default:default" cannot list horizontalpodautoscalers.autoscaling in the namespace "default" Error from server (Forbidden): jobs.batch is forbidden: User "system:serviceaccount:default:default" cannot list jobs.batch in the namespace "default" Error from server (Forbidden): cronjobs.batch is forbidden: User "system:serviceaccount:default:default" cannot list cronjobs.batch in the namespace "default" root@tools-no-rbac-7dc96f489b-ph7h9:/# kubectl get services NAME TYPE CLUSTER-IP EXTERNAL-IP PORT(S) AGE kubernetes ClusterIP 172.21.0.1 <none$ 443/TCP 15d mqtt LoadBalancer 172.21.91.88 169.60.93.179 1883:32145/TCP,80:31639/TCP 22h 

We can see that we now have access to services in the cluster.

The next thing we want to do is create a `configmap` entry to our mqtt public address. We can do that with:
    
    root@tools-no-rbac-7dc96f489b-ph7h9:/# kubectl create configmap mqtt-pub-address --from-literal=host=169.60.93.179 configmap "mqtt-pub-address" created 

After it’s created from within the pod we can’t get it (because we didn’t provide that level of access).
    
    root@tools-no-rbac-7dc96f489b-ph7h9:/# kubectl get configmap/mqtt-pub-address Error from server (Forbidden): configmaps "mqtt-pub-address" is forbidden: User "system:serviceaccount:default:default" cannot get configmaps in the namespace "default" 

If we look instead at this from our computer where we have all the permissions, we can see the contents of that `configmap`.
    
    $ kubectl get configmap/mqtt-pub-address -o yaml apiVersion: v1 data: host: 169.60.93.179 kind: ConfigMap metadata: creationTimestamp: 2018-07-12T14:45:13Z name: mqtt-pub-address namespace: default resourceVersion: "418889" selfLink: /api/v1/namespaces/default/configmaps/mqtt-pub-address uid: 2eee2331-85e2-11e8-857f-06cd14ab6bce 

We can also see that we gave this access to **every** pod in our environment. If we connect to our mqtt pod we can run the same command:
    
    $ kubectl get pod -l app=mqtt NAME READY STATUS RESTARTS AGE mqtt-5ccf8b68b6-bkdf9 1/1 Running 0 2m $ kubectl exec -it mqtt-5ccf8b68b6-bkdf9 bash root@mqtt-5ccf8b68b6-bkdf9:/# kubectl get services NAME TYPE CLUSTER-IP EXTERNAL-IP PORT(S) AGE kubernetes ClusterIP 172.21.0.1 <none$ 443/TCP 15d mqtt LoadBalancer 172.21.91.88 169.60.93.179 1883:32145/TCP,80:31639/TCP 23h 

That is **way more** access than we wanted to grant. Let’s see what we can do about granting more specific access to just the tools pod.

Before we do that, we’ll need to remove the `global-role-binding` so that it doesn’t get in the way of future examples.
    
    $ kubectl delete -f deploy/global-role-assign.yaml rolebinding.rbac.authorization.k8s.io "global-rolebinding" deleted 

And we can see that our access has been revoked for the tools pod:
    
    root@tools-no-rbac-7dc96f489b-ph7h9:/# kubectl get services Error from server (Forbidden): services is forbidden: User "system:serviceaccount:default:default" cannot list services in the namespace "default" 

### Recap: What we learned so far

From this example we learned the following things:

  * By default, access to the Kubernetes API is restricted in a cluster.
  * We can grant access using Role and RoleBinding resources.
  * Roles have a set of Rules based on resource, verbs, and sometimes resourceNames.
  * Binding to the Subject of `kind: Group` and `name: system:serviceaccounts` will give access to all pods in the system.

### 6. Create a Service Account

The best practice in security is to give out as few permissions as possible. One way to do that in Kubernetes is through `ServiceAccounts`. By default, all applications run under a `default` ServiceAccount, but we can create additional ones that are specific to our application.

The following yaml defines a basic ServiceAccount:
    
    apiVersion: v1 kind: ServiceAccount metadata: name: service-account-1 labels: app: tools-rbac 

We can start a pod with a ServiceAccount by adding that to its spec definition:
    
    apiVersion: apps/v1 kind: Deployment metadata: name: tools-service-account labels: app: tools rbac: service-account-1 spec: replicas: 1 selector: matchLabels: app: tools rbac: service-account-1 template: metadata: labels: app: tools rbac: service-account-1 spec: serviceAccountName: service-account-1 containers: - name: tools image: "registry.ng.bluemix.net/rbac-tutorial/tools-img:1" imagePullPolicy: Always command: ["/bin/sleep", "3601"] 

In the pod spec you can see `serviceAccountName: service-account-1`. The pod will be run as this service account, and all containers started from it will be running under that service account.

### 7. Start the Deployment with this ServiceAccount

Run the following to start this pod with the service account in question:
    
    $ kubectl apply -f deploy/tools-service-account.yaml serviceaccount "service-account-1" configured deployment.apps "tools-service-account" configured 

Great, now lets see how our pod is doing:
    
    $ kubectl get pods NAME READY STATUS RESTARTS AGE mqtt-5ccf8b68b6-bkdf9 1/1 Running 0 51m tools-no-rbac-7dc96f489b-ph7h9 1/1 Running 22 22h tools-service-account-6664bdf7f-jzpcg 0/1 ErrImagePull 0 36s 

Hmmm… that’s no good, why didn’t our pod start?
    
    $ kubectl describe pod/tools-service-account-6664bdf7f-jzpcg ... Events: Type Reason Age From Message ‑‑‑‑ ‑‑‑‑‑‑ ‑‑‑‑ ‑‑‑‑ ‑‑‑‑‑‑‑ Normal Scheduled 2m default-scheduler Successfully assigned tools-service-account-6664bdf7f-jzpcg to 10.188.103.254 Normal SuccessfulMountVolume 2m kubelet, 10.188.103.254 MountVolume.SetUp succeeded for volume "service-account-1-token-kcbfz" Normal Pulling 1m (x4 over 2m) kubelet, 10.188.103.254 pulling image "registry.ng.bluemix.net/rbac-tutorial/tools-img:1" Warning Failed 1m (x4 over 2m) kubelet, 10.188.103.254 Failed to pull image "registry.ng.bluemix.net/rbac-tutorial/tools-img:1": rpc error: code = Unknown desc = Error response from daemon: Get https://registry.ng.bluemix.net/v2/rbac-tutorial/tools-img/manifests/1: unauthorized: authentication required Warning Failed 1m (x4 over 2m) kubelet, 10.188.103.254 Error: ErrImagePull Normal BackOff 48s (x6 over 2m) kubelet, 10.188.103.254 Back-off pulling image "registry.ng.bluemix.net/rbac-tutorial/tools-img:1" Warning Failed 48s (x6 over 2m) kubelet, 10.188.103.254 Error: ImagePullBackOff 

It appears that our new service account doesn’t have access to our image registry. If we do a `get` on both the `default` service account and `service-account-1` we can see a critical difference.
    
    $ kubectl get sa default -o yaml apiVersion: v1 imagePullSecrets: - name: bluemix-default-secret - name: bluemix-default-secret-regional - name: bluemix-default-secret-international kind: ServiceAccount metadata: creationTimestamp: 2018-06-26T20:33:40Z name: default namespace: default resourceVersion: "241" selfLink: /api/v1/namespaces/default/serviceaccounts/default uid: 360775a5-7980-11e8-857f-06cd14ab6bce secrets: - name: default-token-x5gbt $ kubectl get sa service-account-1 -o yaml apiVersion: v1 kind: ServiceAccount metadata: annotations: kubectl.kubernetes.io/last-applied-configuration: | {"apiVersion":"v1","kind":"ServiceAccount","metadata":{"annotations":{},"labels":{"app":"tools-rbac"},"name":"service-account-1","namespace":"default"}} creationTimestamp: 2018-07-11T18:05:35Z labels: app: tools-rbac name: service-account-1 namespace: default resourceVersion: "420289" selfLink: /api/v1/namespaces/default/serviceaccounts/service-account-1 uid: 02a91878-8535-11e8-857f-06cd14ab6bce secrets: - name: service-account-1-token-kcbfz 

The `default` service account has this additional set of attributes under `imagePullSecrets`. These are what enable the service accounts access to the image registry. If we update our service account definition to include these our image should come up.
    
    $ kubectl apply -f deploy/fix-service-account-1.yaml serviceaccount "service-account-1" configured $ kubectl delete pod/tools-service-account-6664bdf7f-jzpcg pod "tools-service-account-6664bdf7f-jzpcg" deleted 

We delete the old pod that was in a failed state because in this error condition, Kubernetes will not automatically retry launching it. After a delete of the pod, the deployment will try to start the pod again and this time it will succeed.
    
    $ kubectl get pods NAME READY STATUS RESTARTS AGE mqtt-5ccf8b68b6-bkdf9 1/1 Running 0 1h tools-no-rbac-7dc96f489b-ph7h9 1/1 Running 22 22h tools-service-account-6664bdf7f-rv5n2 1/1 Running 0 1m 

### 8. Add Role and RoleBinding for Service Account

We now are running the `tools-service-account` pod as `service-account-1`. The following configuration will bind our previous `Role` to just this service account.
    
    kind: RoleBinding apiVersion: rbac.authorization.k8s.io/v1 metadata: name: service-account-rolebinding namespace: default labels: app: tools-rbac subjects: - kind: ServiceAccount name: service-account-1 roleRef: kind: Role name: api-role apiGroup: "" 

The difference from our global assignment is that our subject is now of `kind: ServiceAccount` instead of `kind: Group`, which exposes this to only the single service account.

We can apply these changes with:
    
    $ kubectl apply -f deploy/service-account-role-assign.yaml rolebinding.rbac.authorization.k8s.io "service-account-rolebinding" configured 

### 9. Test access

Let’s see the impact of these changes in our pods. We’ll just `exec` the commands directly in all running pods.
    
    $ kubectl get pods NAME READY STATUS RESTARTS AGE mqtt-5ccf8b68b6-bkdf9 1/1 Running 0 5h tools-no-rbac-7dc96f489b-ph7h9 1/1 Running 26 1d tools-service-account-6664bdf7f-rv5n2 1/1 Running 3 3h $ kubectl exec mqtt-5ccf8b68b6-bkdf9 kubectl get services Error from server (Forbidden): services is forbidden: User "system:serviceaccount:default:default" cannot list services in the namespace "default" command terminated with exit code 1 $ kubectl exec tools-no-rbac-7dc96f489b-ph7h9 kubectl get services Error from server (Forbidden): services is forbidden: User "system:serviceaccount:default:default" cannot list services in the namespace "default" command terminated with exit code 1 $ kubectl exec tools-service-account-6664bdf7f-rv5n2 kubectl get services NAME TYPE CLUSTER-IP EXTERNAL-IP PORT(S) AGE kubernetes ClusterIP 172.21.0.1 <none$ 443/TCP 15d mqtt LoadBalancer 172.21.91.88 169.60.93.179 1883:32145/TCP,80:31639/TCP 1d 

This is much better. As expected, the only pod that has access to make these API calls is the one that is running as `service-account-1`. The others haven’t been granted any access.

### Recap – What we learned so far

From this example we learned the following things:

  * We can create additional ServiceAccounts besides the default to isolate pods.
  * ServiceAccounts may need explicit permissions to access private image registries.
  * We can assign Roles to specific ServiceAccounts with RoleBindings to ensure only specific pods have access to the API

### 10. ClusterRoles and ClusterRoleBinding

`Roles` and `RoleBindings` only apply to a single namespace. That’s all we wanted thus far. But what if we wanted to provide access across all namespaces? Or what if we wanted to provide access to resources that don’t live in a namespace, like `nodes` or even the non-resource `healthz` endpoint? For that we need `ClusterRoles` and `ClusterRoleBindings`.
    
    kind: ClusterRole apiVersion: rbac.authorization.k8s.io/v1 metadata: name: node-cluster-role rules: ‑ apiGroups: [""] resources: ["nodes"] verbs: ["get", "list", "watch"] ‑‑‑ kind: ClusterRoleBinding apiVersion: rbac.authorization.k8s.io/v1 metadata: name: service-account-clusterrolebinding labels: app: tools-rbac subjects: ‑ kind: ServiceAccount name: service-account-1 namespace: default roleRef: kind: ClusterRole name: node-cluster-role apiGroup: "" 

This looks very similar to the namespace specific version, but one major difference is that when referencing `subject` we need to specify which `namespace` the service account is located. ClusterRoleBindings don’t live in a namespace, so we have no default to work with.

We can apply this with:
    
    $ kubectl apply -f deploy/service-account-cluster-role.yaml clusterrole.rbac.authorization.k8s.io "node-cluster-role" configured clusterrolebinding.rbac.authorization.k8s.io "service-account-clusterrolebinding" created 

Now the following commands work:
    
    $ kubectl exec tools-service-account-6664bdf7f-rv5n2 kubectl get nodes NAME STATUS ROLES AGE VERSION 10.188.103.209 Ready <none$ 15d v1.9.8-2+af27ab4b096122 10.188.103.229 Ready <none$ 15d v1.9.8-2+af27ab4b096122 10.188.103.254 Ready <none$ 15d v1.9.8-2+af27ab4b096122 

But as expected, they will fail from every other pod in the cluster, as we assigned it to a single ServiceAccount:
    
    $ kubectl exec tools-no-rbac-7dc96f489b-ph7h9 kubectl get nodes Error from server (Forbidden): nodes is forbidden: User "system:serviceaccount:default:default" cannot list nodes at the cluster scope command terminated with exit code 1 

## A Real World Example – ny-power

Why might we want to access the internals like this? Here is the example that the tutorial was based on.

The [ny-power](http://ny-power.org) application is an MQTT message streaming service that provides real time data from the New York State power grid. There is same web console that attaches directly to this MQTT public port. To do this, we need to pass the public ip address from the Load Balancer to the pod that starts the web site.

It’s also not a great idea to have things like `kubectl` living in all your images, so we created an init container that boots up, examines the services, extracts the public ip, and sets that in a secret. Once complete, the web container boots and pulls that public IP out of its environment, allowing the container to be much thinner with less access to tools.

A service account is used so that only this pod has any access to the API. Below is the example configuration from the application. You can also read more about the whole application [here](https://developer.ibm.com/patterns/use-mqtt-stream-real-time-data/).
    
    apiVersion: apps/v1 kind: Deployment metadata: labels: app: ny-power-web chart: ny-power-0.2.0 heritage: Tiller release: prod name: prod-ny-power-web namespace: default spec: selector: matchLabels: app: ny-power-web release: prod template: spec: serviceAccountName: prod-ny-power-readersa initContainers: ‑ command: ‑ /root/setvalue.sh env: ‑ name: MQTT_CONTAINER_NAME value: prod-ny-power-mqtt ‑ name: MQTT_SECRET_NAME value: prod-ny-power-mqtt image: registry.ng.bluemix.net/ny-power/ny-power-ibm-cloud:9 imagePullPolicy: Always name: prod-ny-power-web-init resources: {} terminationMessagePath: /dev/termination-log terminationMessagePolicy: File containers: ‑ env: ‑ name: INFLUXDB_HOST value: prod-ny-power-influx ‑ name: MQTT_HOST valueFrom: secretKeyRef: key: host name: prod-ny-power-mqtt ‑ name: MQTT_PUMP_PASS valueFrom: secretKeyRef: key: password name: prod-ny-power-mqtt-pump image: registry.ng.bluemix.net/ny-power/ny-power-web:17 imagePullPolicy: Always name: prod-ny-power-web ports: ‑ containerPort: 80 protocol: TCP resources: {} terminationMessagePath: /dev/termination-log terminationMessagePolicy: File restartPolicy: Always 

## Summary

In this tutorial, we learned:

  * The Kubernetes API is accessible inside the cluster.
  * By default, API access in Kuberenetes 1.8 and later is denied by Role Based Access Control.
  * You can enable specific permissions using `Role` and `RoleBinding` resources.
  * `Role` permissions on `Secrets` and `Configmaps` can include the name of the secret or configmap keys in question, providing very fine-grained access.
  * You can narrow the scope of permissions further by using a `ServiceAccount` for your applications, and `RoleBinding` to a `ServiceAccount` instead of to a group or user.
  * Some APIs in Kubernetes don’t have a pod scope (such as node access), and are exposed with the `ClusterRole` and `ClusterRoleBinding`.

## Learn more

RBAC is a complicated subject and keeping the model of it in your head is sometimes challenging. Hopefully this tutorial and the ability to interactively poke at an example application helps clarify things.

If you are interested in learning more, check out the resources below.

  * [Read the Kubernetes RBAC Docs](https://kubernetes.io/docs/reference/access-authn-authz/rbac/) – these are the definitive source for how RBAC works, and has other examples to show common usage.

  * [Examine the code](https://github.com/IBM/ny-power/) of the ny-power pattern to see this action.

Components [IBM Cloud](https://developer.ibm.com/tutorials/category/cloud-ibm/) [Kubernetes](https://developer.ibm.com/tutorials/category/kubernetes/)

##### Social

  * [ _Facebook_ ](http://www.facebook.com/sharer.php?u=https%3A%2F%2Fdeveloper.ibm.com%2Ftutorials%2Fusing-kubernetes-rbac-and-service-accounts%2F&t=Using+Kubernetes+RBAC+and+service+accounts)

* [ ](http://www.facebook.com/sharer.php?u=https%3A%2F%2Fdeveloper.ibm.com%2Ftutorials%2Fusing-kubernetes-rbac-and-service-accounts%2F&t=Using+Kubernetes+RBAC+and+service+accounts)
* [ _Twitter_ ](https://twitter.com/intent/tweet?url=https%3A%2F%2Fdeveloper.ibm.com%2Ftutorials%2Fusing-kubernetes-rbac-and-service-accounts%2F&text=Using+Kubernetes+RBAC+and+service+accounts)
* [ ](https://twitter.com/intent/tweet?url=https%3A%2F%2Fdeveloper.ibm.com%2Ftutorials%2Fusing-kubernetes-rbac-and-service-accounts%2F&text=Using+Kubernetes+RBAC+and+service+accounts)
* [ _Linked In_ ](http://www.linkedin.com/shareArticle?mini=true&url=https%3A%2F%2Fdeveloper.ibm.com%2Ftutorials%2Fusing-kubernetes-rbac-and-service-accounts%2F&title=Using+Kubernetes+RBAC+and+service+accounts)
* [ ](http://www.linkedin.com/shareArticle?mini=true&url=https%3A%2F%2Fdeveloper.ibm.com%2Ftutorials%2Fusing-kubernetes-rbac-and-service-accounts%2F&title=Using+Kubernetes+RBAC+and+service+accounts)
* [ _Google+_ ](https://plus.google.com/share?url=https%3A%2F%2Fdeveloper.ibm.com%2Ftutorials%2Fusing-kubernetes-rbac-and-service-accounts%2F&t=Using+Kubernetes+RBAC+and+service+accounts)

  * [ ](https://plus.google.com/share?url=https%3A%2F%2Fdeveloper.ibm.com%2Ftutorials%2Fusing-kubernetes-rbac-and-service-accounts%2F&t=Using+Kubernetes+RBAC+and+service+accounts)

##### Contents

  * [Learning Objectives](https://developer.ibm.com/tutorials/using-kubernetes-rbac-and-service-accounts/#learning-objectives)
  * [Prerequisites](https://developer.ibm.com/tutorials/using-kubernetes-rbac-and-service-accounts/#prerequisites)
  * [Estimated Time](https://developer.ibm.com/tutorials/using-kubernetes-rbac-and-service-accounts/#estimated-time)
  * [Steps](https://developer.ibm.com/tutorials/using-kubernetes-rbac-and-service-accounts/#steps)
    * [1. Build application images](https://developer.ibm.com/tutorials/using-kubernetes-rbac-and-service-accounts/#1-build-application-images)
    * [2. Start our sample application and our tools pod](https://developer.ibm.com/tutorials/using-kubernetes-rbac-and-service-accounts/#2-start-our-sample-application-and-our-tools-pod)
    * [3. Attempt to access the Kubernetes API](https://developer.ibm.com/tutorials/using-kubernetes-rbac-and-service-accounts/#3-attempt-to-access-the-kubernetes-api)
    * [4. Create a Role and RoleBinding](https://developer.ibm.com/tutorials/using-kubernetes-rbac-and-service-accounts/#4-create-a-role-and-rolebinding)
    * [5. Test our new Access](https://developer.ibm.com/tutorials/using-kubernetes-rbac-and-service-accounts/#5-test-our-new-access)
    * [Recap: What we learned so far](https://developer.ibm.com/tutorials/using-kubernetes-rbac-and-service-accounts/#recap-what-we-learned-so-far)
    * [6. Create a Service Account](https://developer.ibm.com/tutorials/using-kubernetes-rbac-and-service-accounts/#6-create-a-service-account)
    * [7. Start the Deployment with this ServiceAccount](https://developer.ibm.com/tutorials/using-kubernetes-rbac-and-service-accounts/#7-start-the-deployment-with-this-serviceaccount)
    * [8. Add Role and RoleBinding for Service Account](https://developer.ibm.com/tutorials/using-kubernetes-rbac-and-service-accounts/#8-add-role-and-rolebinding-for-service-account)
    * [9. Test access](https://developer.ibm.com/tutorials/using-kubernetes-rbac-and-service-accounts/#9-test-access)
    * [Recap - What we learned so far](https://developer.ibm.com/tutorials/using-kubernetes-rbac-and-service-accounts/#recap-what-we-learned-so-far)
    * [10. ClusterRoles and ClusterRoleBinding](https://developer.ibm.com/tutorials/using-kubernetes-rbac-and-service-accounts/#10-clusterroles-and-clusterrolebinding)
  * [A Real World Example - ny-power](https://developer.ibm.com/tutorials/using-kubernetes-rbac-and-service-accounts/#a-real-world-example-ny-power)
  * [Summary](https://developer.ibm.com/tutorials/using-kubernetes-rbac-and-service-accounts/#summary)
  * [Learn more](https://developer.ibm.com/tutorials/using-kubernetes-rbac-and-service-accounts/#learn-more)

##### Resources

  * [Examine the code of the ny-power pattern to see this action](https://github.com/IBM/ny-power/)

#### Related cont

#### Hint Next Steps

No hint available


#### Complete Next Steps

$ Confirm Next Steps complete

#### Task aaa

----

#### Hint aaa

No hint available


#### Complete aaa

$ Confirm aaa complete



#### Task aaa

----

#### Hint aaa

No hint available


#### Complete aaa

$ Confirm aaa complete

