
:course_title: JTC90 Kubernetes Lab Setup

:course_desc: This course walks you through the Lab preparations for the Journey to Cloud.

:course_max: 3


:course_auto: no

:button1_label: Task

:button2_label: Hint

:button2_delay: 9999999

:button3_label: Complete

:button3_delay: 300




#### Task Lab1_NetworkPoliciesIntro

----


# Lab 1 - Network Policies

Kubernetes network policies specify how pods can communicate with other pods and with external endpoints.
By default, no network policies are set up.
If you have unique security requirements, you can create your own network policies.

The following network traffic is allowed by default:

* A pod accepts external traffic from any IP address to its NodePort or LoadBalancer service or its Ingress resource.
* A pod accepts internal traffic from any other pod in the same cluster.
* A pod is allowed outbound traffic to any IP address.

Network policies let you create additional restrictions on what traffic is allowed.
For example you may want to restrict external inbound or outbound traffic to certain IP addresses.

For this lab we'll use a network policy to restrict traffic between pods.
Let's say that we want to limit access to the `k8sdemo-backend` server to just expose the `k8sdemo` application.
First we can observe that the `k8sdemo-backend` server is open to any pod by spinning up a Linux shell.

![K8s CNI](./images/np1.png)

#### Hint Lab1_NetworkPoliciesIntro

No hint available


#### Complete Lab1_NetworkPoliciesIntro

> Confirm Lab1_NetworkPoliciesIntro complete




#### Task Lab1_NetworkPoliciesPlugin

----

## Lab 1 - Installing Network Plugin

Before using Network Policies we have to install a Kubernetes Network Plugin that can handle the restrictions.
By default no Plugin is installed and the Network Policies will remain without effect.


**TODO**

```
$ kubectl run -it --rm --restart=Never alpine -n default --image=alpine sh
```



#### Hint Lab1_NetworkPoliciesPlugin

No hint available


#### Complete Lab1_NetworkPoliciesPlugin

> Confirm Lab1_NetworkPoliciesPlugin complete




#### Task Lab1_NetworkPoliciesFirst Steps

----
First let's create a helper pod that will assist you in testing the reachability of the different elements.

1. Run:
	```
	$ kubectl run -it --rm --restart=Never alpine -n default --image=alpine sh
	```


2. Now from inside the Pod run:

	```
	# wget -O-  k8sdemo-backend-service.default.svc:3000
	
	Connecting to k8sdemo-backend-service.default.svc:3000 (10.103.242.14:3000)
	<!DOCTYPE html><html><head><title>K8s Demo Backend</title><link rel="stylesheet" href="/stylesheets/style.css"-                    100% |**************************************************************|   197  0:00:00 ETA
	```
	You should get the HTML response from the backend server.
	

3. And you should be able to ping external adresses 

	```
	# ping goggle.com
	
	PING goggle.com (45.55.44.56): 56 data bytes
64 bytes from 45.55.44.56: seq=0 ttl=59 time=133.476 ms
64 bytes from 45.55.44.56: seq=1 ttl=59 time=136.036 ms
64 bytes from 45.55.44.56: seq=2 ttl=59 time=125.471 ms
	
	```

![K8s CNI](./images/np2.png)


#### Hint Lab1_NetworkPoliciesFirst Steps

No hint available


#### Complete Lab1_NetworkPoliciesFirst Steps

> Confirm Lab1_NetworkPoliciesFirst Steps complete







#### Task Lab1_NetworkPoliciesIngress

----


## Lab 1 - Control Ingress



Now let's create the first `NetworkPolicy` that simply blocks all traffic coming into all pods.

1. Run the following command

	```
	$ kubectl create -f https://raw.githubusercontent.com/niklaushirt/training/master/networkpolicies/deny-all-ingress.yaml
	```
	
	This creates the following `NetworkPolicy`
	
	```yaml
	apiVersion: networking.k8s.io/v1
	kind: NetworkPolicy
	metadata:
	  name: default-deny-ingress
	  namespace: default
	spec:
	  podSelector: {}
	  policyTypes:
	  - Ingress
	```

2. Now from inside the Pod run:

	```
	# wget -O-  k8sdemo-backend-service.default.svc:3000
	
	Connecting to k8sdemo-backend-service.default.svc:3000 (10.103.242.14:3000)
	.....
	```
	You should get no response from `k8sdemo-backend`.


3. But you should still be able to ping external adresses 

	```
	# ping goggle.com
	
	ping: bad address 'goggle.com'
	```

4. Try to reload the web application. It should **NOT** load.


We have just blocked all traffic coming into the pods, but not the outgoing.

![K8s CNI](./images/np3.png)


#### Clean-up
Delete the `NetworkPolicy` in order to go back to normal.

```
$ kubectl delete NetworkPolicy -n default default-deny-ingress
```


#### Hint Lab1_NetworkPoliciesIngress

No hint available


#### Complete Lab1_NetworkPoliciesIngress

> Confirm Lab1_NetworkPoliciesIngress complete





#### Task Lab1_NetworkPoliciesEgress

----


## Lab 1 - Control Egress


Now let's create a `NetworkPolicy` that simply blocks all outgoing traffic from all pods.

1. Run the following command
	
	```
	$ kubectl create -f https://raw.githubusercontent.com/niklaushirt/training/master/networkpolicies/deny-all-egress.yaml
	```
	
	This creates the following `NetworkPolicy`
	
	```yaml
	apiVersion: networking.k8s.io/v1
	kind: NetworkPolicy
	metadata:
	  name: default-deny-egress
	  namespace: default
	spec:
	  podSelector: {}
	  policyTypes:
	  - Egress
	```

2. Now from inside the Pod run:
	
	```
	# wget -O-  k8sdemo-backend-service.default.svc:3000
	
	Connecting to k8sdemo-backend-service.default.svc:3000 (10.103.242.14:3000)
	.....
	```
	You should get no response from the `k8sdemo-backend` as the web frontend `k8sdemo` outgoing traffic is blocked.


3. And you should not be able to ping external adresses as the `alpine` pod outgoing traffic is blocked.
	
	```
	# ping goggle.com
	
	ping: bad address 'goggle.com'
	```
4. Reload the web application. It should now load again, but with the error from the backend:

	**Testing DEMO_API
	STATUS: ERROR	
	Trying to reach backend ....**


We have just blocked all traffic going out of the pods, but not the incoming.

![K8s CNI](./images/np4.png)


#### Clean-up
Delete the `NetworkPolicy` in order to go back to normal.

```
$ kubectl delete NetworkPolicy -n default default-deny-egress
```

#### Hint Lab1_NetworkPoliciesEgress

No hint available


#### Complete Lab1_NetworkPoliciesEgress

> Confirm Lab1_NetworkPoliciesEgress complete








#### Task Lab1_NetworkPoliciesPodToPod

----


## Lab 1 - Control Pod to Pod communication

Now let's create a `NetworkPolicy` that simply blocks all incoming traffic for the backend (`k8sdemo-backend`) except the one coming from the web frontend (`k8sdemo`).

1. Run the following command
	
	```
	$ kubectl create -f https://raw.githubusercontent.com/niklaushirt/training/master/networkpolicies/deny-except-web.yaml
	```
	
	This creates the following `NetworkPolicy`
	
	```yaml
	apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: k8sdemo-web-backend
  namespace: default
spec:
  podSelector:
    matchLabels:
      app: k8sdemo-backend
  policyTypes:
  - Ingress
  ingress:
  - from:
    - podSelector:
        matchLabels:
          app: k8sdemo
	```

2. Now from inside the Pod run:
	
	```
	# wget -O-  k8sdemo-backend-service.default.svc:3000
		
	Connecting to k8sdemo-backend-service.default.svc:3000 (10.103.242.14:3000)
	.....
	```
	
	You should get no response from `k8sdemo-backend` as only `k8sdemo` is allowed to access it.


3. You should be able to ping external adresses as outgoing traffic is not blocked.
	
	```
	# ping goggle.com
	
	PING goggle.com (45.55.44.56): 56 data bytes
64 bytes from 45.55.44.56: seq=0 ttl=59 time=143.152 ms
64 bytes from 45.55.44.56: seq=1 ttl=59 time=120.875 ms
64 bytes from 45.55.44.56: seq=2 ttl=59 time=130.981 ms
	```
	
4. Reload the web application. It should now load again, without error from the backend:

	**Testing DEMO_API
	STATUS: OK	
	Message from the Backend
<Some Message>
The IP Address is
<IP_ADDRESS>**


We have just blocked all traffic going to `k8sdemo-backend`, except the one coming from `k8sdemo` thus isolating and securing the communication.

![K8s CNI](./images/np5.png)

#### Clean-up
Delete the `NetworkPolicy` in order to go back to normal.

```
$ kubectl delete NetworkPolicy -n default k8sdemo-web-backend
```


# Congratulations!!! This concludes Lab 1 on Network Policies

#### Hint Lab1_NetworkPoliciesPodToPod

No hint available


#### Complete Lab1_NetworkPoliciesPodToPod

> Confirm Lab1_NetworkPoliciesPodToPod complete













#### Task Lab2_RBACIntro

----


# Lab 2 - RBAC

RBAC policies are vital for the correct management of your cluster, as they allow you to specify which types of actions are permitted depending on the user and their role in your organization. Examples include:

Secure your cluster by granting privileged operations (accessing secrets, for example) only to admin users.
Force user authentication in your cluster.
Limit resource creation (such as pods, persistent volumes, deployments) to specific namespaces. You can also use quotas to ensure that resource usage is limited and under control.
Have a user only see resources in their authorized namespace. This allows you to isolate resources within your organization (for example, between departments).


## RBAC Roles

Rbac Roles are composed of 

* **RBAC API objects**
	* Pods
	* PersistentVolumes
	* ConfigMaps
	* Deployments
	* Nodes
	* Secrets
	* Namespaces

* **Possible operations** over these resources are:
	* create
	* get
	* delete
	* list
	* update
	* edit
	* watch
	* exec


## RBAC Elements

* **Rules**: A rule is a set of operations (verbs) that can be carried out on a group of resources which belong to different API Groups.

* **Roles and ClusterRoles**: Both consist of rules. The difference between a Role and a ClusterRole is the scope: in a Role, the rules are applicable to a single namespace, whereas a ClusterRole is cluster-wide, so the rules are applicable to more than one namespace. ClusterRoles can define rules for cluster-scoped resources (such as nodes) as well. Both Roles and ClusterRoles are mapped as API Resources inside our cluster.

* **RoleBindings and ClusterRoleBindings**: Just as the names imply, these bind subjects to roles (i.e. the operations a given user can perform). As for Roles and ClusterRoles, the difference lies in the scope: a RoleBinding will make the rules effective inside a namespace, whereas a ClusterRoleBinding will make the rules effective in all namespaces.


* **Subjects**: These correspond to the entity that attempts an operation in the cluster. There are three types of subjects:
	* **User Accounts**: These are global, and meant for humans or processes living outside the cluster. There is no associated resource API Object in the Kubernetes cluster.
	* **Service Accounts**: This kind of account is namespaced and meant for intra-cluster processes running inside pods, which want to authenticate against the API.
	* **Groups**: This is used for referring to multiple accounts. There are some groups created by default such as cluster-admin (explained in later sections).


You can get more detailed information in the official Kubernetes documentation [here](https://kubernetes.io/docs/admin/authorization/rbac/).



#### Hint Lab2_RBACIntro

No hint available


#### Complete Lab2_RBACIntro

> Confirm Lab2_RBACIntro complete









#### Task Lab2_RBACCreateUser

----
# Lab 2 - Users, Roles and RoleBindings
---
---
## Lab 2 - Create user with limited namespace access

In this example, we will create a user with limited namespace access.

The following User Account will be created:

  * Username: demo
  * Group: demogroup

We will add the necessary RBAC policies so this user can fully manage deployments (i.e. use `kubectl run` command) only inside the `rbactest` namespace. At the end, we will test the policies to make sure they work as expected.

## Create the rbactest namespace

  * Execute the `kubectl create` command to create the namespace (as the admin user):
    
    ```
    kubectl create namespace rbactest 
    ```



#### Hint Lab2_RBACCreateUser

No hint available


#### Complete Lab2_RBACCreateUser

> Confirm Lab2_RBACCreate User complete




















#### Task Lab2_RBACCreateCredentials

----


## Lab 2 - Create the user credentials

Kubernetes does not have API Objects for User Accounts. Of the available ways to manage authentication (see [Kubernetes official documentation](https://kubernetes.io/docs/admin/authentication) for a complete list), we will use OpenSSL certificates for their simplicity. 

The necessary steps are:

  1. Create a private key for your user. In this example, we will name the file `demo.key`:
  	  Go to a temporary working directory in your terminal.
  
    ```
    mkdir rbacdemo
    cd rbacdemo
    
    openssl genrsa -out demo.key 2048 
    ```
    
  2. Create a certificate sign request `demo.csr` using the private key you just created (`demo.key` in this example). 
  
     Make sure you specify your username and group in the _-subj_ section (CN is for the username and O for the group). As previously mentioned, we will use `demo` as the name and `demogroup` as the group:
    
	```
    openssl req -new -key demo.key -out demo.csr -subj "/CN=demo/O=demogroup" 
	```

  3. We will use the Kubernetes cluster certificate authority (CA) for approving the request and generating the necessary certificate to access the cluster API. 

  Its location is normally `/etc/kubernetes/pki/`. 
  In our case (Minikube), it would be `~/.minikube/`. 

  4. Generate the final certificate `demo.crt` by approving the certificate sign request, `demo.csr`, you made earlier. In this example, the certificate will be valid for 500 days:
    
    ```
    openssl x509 -req -in demo.csr -CA ~/.minikube/ca.crt -CAkey ~/.minikube/ca.key -CAcreateserial -out demo.crt -days 500 
    ```

  5. In a real world example you would now save both `demo.crt` and `demo.key` in a safe location.

  6. Add a new context with the new credentials for your Kubernetes cluster. This example is for a Minikube cluster but it should be similar for [others](https://kubernetes.io/docs/setup/pick-right-solution/):
    
    1. Set credentials
    
	    ```
	    kubectl config set-credentials demo --client-certificate=./demo.crt --client-key=./demo.key 
	    
		User "demo" set.
	    ```
    
    2. Create context
    
	    ``` 
	    kubectl config set-context demo-context --cluster=minikube --namespace=rbactest --user=demo 
	    
	    Context "demo-context" created.
	    ```
7. Now you should get an access denied error when using the _kubectl_ CLI with this configuration file. This is expected as we have not defined any permitted operations for this user.

    ```
    kubectl --context=demo-context get pods 
    
	No resources found.
	Error from server (Forbidden): pods is forbidden: User "demo" cannot list resource "pods" in API group "" in the namespace "rbactest"
    ```
    
    
#### Hint Lab2_RBACCreateCredentials

No hint available


#### Complete Lab2_RBACCreateCredentials

> Confirm RBACCreate Credentials complete




















#### Task Lab2_RBACCreateViewerRole

----

## Lab 2 - Create the role for viewing deployments

We are creating the `Rule` that allows a user to execute several `Read Only` operations on Deployments, Pods and ReplicaSets, which belong to the `core` (expressed by “” in the `yaml` file), `apps`, and `extensions` API Groups:
	    
```yaml
kind: Role
apiVersion: rbac.authorization.k8s.io/v1beta1
metadata:
  name: deployment-viewer
  namespace: rbactest
rules:
- apiGroups: ["", "extensions", "apps"]
  resources: ["deployments", "replicasets", "pods"]
  verbs: ["get", "list"] # You can also use ["*"]
```


Create the `Role` in the cluster using:
    
```
kubectl create -f https://raw.githubusercontent.com/niklaushirt/training/master/rbac/deployment-viewer.yaml 
```


#### Hint Lab2_RBACCreateViewerRole

No hint available


#### Complete Lab2_RBACCreateViewerRole

> Confirm Lab2_RBACCreateViewerRole complete








#### Task Lab2_RBACBindViewerRole

----


## Lab 2 - Bind the viewer role to the demo user

In this step we are creating the `RuleBinding` that binds the `deployment-viewer` `Role` to the User Account `demo` inside the `rbactest` namespace:
    
     
```yaml
kind: RoleBinding
apiVersion: rbac.authorization.k8s.io/v1beta1
metadata:
  name: deployment-viewer-binding
  namespace: rbactest
subjects:
- kind: User
  name: demo
  apiGroup: ""
roleRef:
  kind: Role
  name: deployment-viewer
  apiGroup: ""
```


Create the Role in the cluster using:
    
```
kubectl create -f https://raw.githubusercontent.com/niklaushirt/training/master/rbac/deployment-viewer-binding.yaml 
```



#### Hint Lab2_RBACBindViewerRole

No hint available


#### Complete Lab2_RBACBindViewerRole

> Confirm Lab2_RBACBindViewerRole complete






#### Task Lab2_RBACTestViewerRule

----


## Lab 2 - Test the RBAC viewer rule

Now you should be able to execute the following command without any issues:
   
```
kubectl --context=demo-context get pods 

No resources found.
```


If you run the same command for the default namespace with the `--namespace=default` argument, it will fail, as the `demo` user does not have access to this namespace.
    
```
kubectl --context=demo-context get pods --namespace=default 

No resources found.
Error from server (Forbidden): pods is forbidden: User "demo" cannot list resource "pods" in API group "" in the namespace "default"
```

   
Also you still don't have the rights to create or delete `Deployments`:

```
kubectl --context=demo-context run --image alpine alpine                                                                                                                                                                                                                                                                                              

Error from server (Forbidden): deployments.apps is forbidden: User "demo" cannot create resource "deployments" in API group "apps" in the namespace "rbactest"
```

Now you have created a user with limited Read Only permissions in your cluster.





#### Hint Lab2_RBACTestViewerRule

No hint available


#### Complete Lab2_RBACTestViewerRule

> Confirm Lab2_RBACTestViewerRule complete
















#### Task Lab2_RBACCreateManagerRole

----


## Lab 2 - Create the role for managing deployments

We are creating the `Rule` that allows a user to execute several `Read and Write` operations on Deployments, Pods and ReplicaSets, which belong to the `core` (expressed by “” in the `yaml` file), `apps`, and `extensions` API Groups:
	    
```yaml
kind: Role
apiVersion: rbac.authorization.k8s.io/v1beta1
metadata:
  name: deployment-manager
  namespace: rbactest
rules:
- apiGroups: ["", "extensions", "apps"]
  resources: ["deployments", "replicasets", "pods"]
  verbs: ["get", "list", "watch", "create", "update", "patch", "delete"] # You can also use ["*"]
```


Create the `Role` in the cluster using:
    
```
kubectl create -f https://raw.githubusercontent.com/niklaushirt/training/master/rbac/deployment-manager.yaml 
```


#### Hint Lab2_RBACCreateManagerRole

No hint available


#### Complete Lab2_RBACCreateManagerRole

> Confirm RBACCreateManagerRole complete




















#### Task Lab2_RBACBindManagerRole

----


## Lab 2 - Bind the Manager role to the demo user

In this step we are creating the `RuleBinding` that binds the `deployment-manager` `Role` to the User Account `demo` inside the `rbactest` namespace:
    
     
```yaml
kind: RoleBinding
apiVersion: rbac.authorization.k8s.io/v1beta1
metadata:
  name: deployment-manager-binding
  namespace: rbactest
subjects:
- kind: User
  name: demo
  apiGroup: ""
roleRef:
  kind: Role
  name: deployment-manager
  apiGroup: ""
```


Create the Role in the cluster using:
    
```
kubectl create -f https://raw.githubusercontent.com/niklaushirt/training/master/rbac/deployment-manager-binding.yaml 
```



#### Hint Lab2_RBACBindManagerRole

No hint available


#### Complete Lab2_RBACBindManagerRole

> Confirm RBACBindManagerRole complete




















#### Task Lab2_RBACTestManagerRule

----


## Lab 2 - Test the RBAC manager rule

Now you should be able to execute the following commands without any issues:
   


```
kubectl --context=demo-context run --image alpine alpine                                                                                                                                                                                                                                                                                              

deployment.apps/alpine created
```

```
kubectl --context=demo-context get pods 

NAME                      READY     STATUS      RESTARTS   AGE
alpine-7f866557df-dkmks   0/1       Completed   0          6s
```


However if you run the same command for the default namespace with the `--namespace=default` argument, it will still fail, as the `demo` user still does not have access to this namespace.
    
```
kubectl --context=demo-context get pods --namespace=default 

No resources found.
Error from server (Forbidden): pods is forbidden: User "demo" cannot list resource "pods" in API group "" in the namespace "default"
```

Now you have created a user with limited permissions in your cluster but with full Management rights for Deployments in the `rbactest` namespace.


# Congratulations!!! This concludes Lab 2 on RBAC and Roles/RoleBindings.


#### Hint Lab2_RBACTestManagerRule

No hint available


#### Complete Lab2_RBACTestManagerRule

> Confirm RBACTestManagerRule complete






















#### Task Lab3_StartDeployment

----
# Lab 3 - Service Accounts
---
---
## Lab 3 - Create a ServiceAccount for a Deployment

In this chapter we will start this `Pod` with a limited `ServiceAccount`.
    
### Create the resources

To create the `ServiceAccount`:

```
$ kubectl apply -f https://raw.githubusercontent.com/niklaushirt/training/master/rbac/service-accounts.yaml

serviceaccount "service-account-1" 
```

To create the `Deployment`:

```
$ kubectl apply -f https://raw.githubusercontent.com/niklaushirt/training/master/rbac/service-account-kubectl.yaml

deployment.apps/kubectl configured 
```

Great, now lets see how our pod is doing:
    
```    
$ kubectl get pods 
    
NAME                                     READY     STATUS         RESTARTS   AGE
alpine                                   1/1       Running       0          3h48m
k8sdemo-7d46f69d68-d5dwm                 1/1       Running       0          4h6m
k8sdemo-backend-9c777544b-knnth          1/1       Running       0          4h2m
k8sdemo-backend-9c777544b-tztr8          1/1       Running       0          4h2m
k8sdemo-nok-7b4c444454-h6w6r             1/1       Running       0          3h30m
kubectl-f8977f5d9-4mm69                  1/1       Running       0          25s
tools-service-account-7c4c798b7-x7rkv    1/1       Running       0          28m```
``` 

### Test Access

Now test the access from inside the Pod (you will have to replace the Pod name):

```    
$ kubectl exec kubectl-f8977f5d9-4mm69 kubectl get services

Error from server (Forbidden): services is forbidden: User "system:serviceaccount:default:service-account-1" cannot list resource "services" in API group "" in the namespace "default"
command terminated with exit code 1
```    
So the access is forbidden for the Pod running under the `ServiceAccount` `service-account-1`, which makes sense, because the `ServiceAccount` has no rights assigned as of now.
 

#### Hint Lab2_StartDeployment

No hint available


#### Complete Lab2_StartDeployment

$ Confirm Lab2_StartDeployment complete









#### Task Lab3_AddRoleAndRoleBinding

----


## Lab 3 - Add Role and RoleBinding for Service Account

We now are running the `kubectl` `Pod` under the `ServiceAccount` `service-account-1`. 

The following configuration will create a `Role` and a `RoleBinding` to just this service account.
 
### Create Role and RoleBinding   
    
1. Create Role

	```yaml
	kind: Role
	apiVersion: rbac.authorization.k8s.io/v1
	metadata:
	  name: api-role
	  namespace: default
	  labels:
	    app: tools-rbac
	rules:
	- apiGroups: [""]
	  resources: ["services"]
	  verbs: ["get", "list"]
	- apiGroups: [""]
	  resources: ["configmaps"]
	  verbs: ["create"]
	- apiGroups: [""]
	  resources: ["configmaps"]
	  resourceNames: ["mqtt-pub-address"]
	  verbs: ["update", "delete"]
	```
	
	The `Role` has the rights to list the `Services`.
	
	```
	$ kubectl create -f https://raw.githubusercontent.com/niklaushirt/training/master/rbac/service-accounts-role.yaml
	
	role.rbac.authorization.k8s.io/api-role configured
	```

2. Now lets bind the Role to the `ServiceAccount` `service-account-1` 

	```yaml
	kind: RoleBinding
	apiVersion: rbac.authorization.k8s.io/v1
	metadata:
	  name: service-account-rolebinding
	  namespace: default
	  labels:
	    app: tools-rbac
	subjects:
	- kind: ServiceAccount
	  name: service-account-1
	roleRef:
	  kind: Role
	  name: api-role
	  apiGroup: ""
	```
	
	
	```
	$ kubectl create -f https://raw.githubusercontent.com/niklaushirt/training/master/rbac/service-accounts-role-binding.yaml
	
	rolebinding.rbac.authorization.k8s.io/service-account-rolebinding created
	```    
    
    Now the `ServiceAccount` `service-account-1` should have the rights to list the `Services`.
   
### Test Access
    
Let's try this again:
    
```    
$ kubectl exec kubectl-f8977f5d9-4mm69 kubectl get services
NAME                      TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)          AGE
k8sdemo-backend-service   NodePort    10.109.88.37   <none>        3000:30601/TCP   4h9m
k8sdemo-service           NodePort    10.99.195.7    <none>        3000:30456/TCP   4h11m
kubernetes                ClusterIP   10.96.0.1      <none>        443/TCP          5h20m
```    


We can see, that the Pod running under the `ServiceAccount` `service-account-1` can now access the list of `Services` because it is bound to a `Role` that allows for listing them.


However this is still a **ReadOnly** access.


When trying to **modify** (delete) a `Service` we still get an error:

``` 
kubectl exec kubectl-f8977f5d9-4mm69 kubectl delete services k8sdemo-service

Error from server (Forbidden): services "k8sdemo-service" is forbidden: User "system:serviceaccount:default:service-account-1" cannot delete resource "services" in API group "" in the namespace "default"
command terminated with exit code 1
``` 

---
---

# Congratulations!!! This concludes Lab 3 on RBAC and Service Accounts.

#### Hint Lab3_AddRoleAndRoleBinding

No hint available


#### Complete Lab3_AddRoleAndRoleBinding

$ Confirm Lab3_AddRoleAndRoleBinding complete






#### Task RBACAuditing

----


# Lab 3 - RBACAuditing

xxxxxx



#### Hint RBACAuditing

No hint available


#### Complete RBACAuditing

$ Confirm RBACAuditing complete



#### Task Create a Service Account

----



# Lab 7 - Create a Service Account

The best practice in security is to give out as few permissions as possible. One way to do that in Kubernetes is through `ServiceAccounts`. By default, all applications run under a `default` ServiceAccount, but we can create additional ones that are specific to our application.

The following yaml defines a basic ServiceAccount:

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: service-account-1
  labels:
    app: tools-rbac
```


We can start a pod with a ServiceAccount by adding that to its spec definition:

```    
apiVersion: apps/v1
kind: Deployment
metadata:
  name: kubectl
  labels:
    app: kubectl
    rbac: service-account-1
spec:
  replicas: 1
  selector:
    matchLabels:
      app: kubectl
      rbac: service-account-1
  template:
    metadata:
      labels:
        app: kubectl
        rbac: service-account-1
    spec:
      serviceAccountName: service-account-1
      containers:
        - name: kubectl
          image: "niklaushirt/kubectl:1.14"
          imagePullPolicy: Always
          command: ["/bin/sleep", "3601"]
```

In the pod spec you can see `serviceAccountName: service-account-1`. The pod will be run as this service account, and all containers started from it will be running under that service account.

#### Hint Create a Service Account

No hint available


#### Complete Create a Service Account

$ Confirm Create a Service Account complete








#### Task Test access

----



# Lab 10 - Test access

Let’s see the impact of these changes in our pods. We’ll just `exec` the commands directly in all running pods.
    
    $ kubectl get pods NAME READY STATUS RESTARTS AGE mqtt-5ccf8b68b6-bkdf9 1/1 Running 0 5h tools-no-rbac-7dc96f489b-ph7h9 1/1 Running 26 1d tools-service-account-6664bdf7f-rv5n2 1/1 Running 3 3h $ kubectl exec mqtt-5ccf8b68b6-bkdf9 kubectl get services Error from server (Forbidden): services is forbidden: User "system:serviceaccount:default:default" cannot list services in the namespace "default" command terminated with exit code 1 $ kubectl exec tools-no-rbac-7dc96f489b-ph7h9 kubectl get services Error from server (Forbidden): services is forbidden: User "system:serviceaccount:default:default" cannot list services in the namespace "default" command terminated with exit code 1 $ kubectl exec tools-service-account-6664bdf7f-rv5n2 kubectl get services NAME TYPE CLUSTER-IP EXTERNAL-IP PORT(S) AGE kubernetes ClusterIP 172.21.0.1 <none$ 443/TCP 15d mqtt LoadBalancer 172.21.91.88 169.60.93.179 1883:32145/TCP,80:31639/TCP 1d 

This is much better. As expected, the only pod that has access to make these API calls is the one that is running as `service-account-1`. The others haven’t been granted any access.

### Recap – What we learned so far

From this example we learned the following things:

  * We can create additional ServiceAccounts besides the default to isolate pods.
  * ServiceAccounts may need explicit permissions to access private image registries.
  * We can assign Roles to specific ServiceAccounts with RoleBindings to ensure only specific pods have access to the API

#### Hint Test access

No hint available


#### Complete Test access

$ Confirm Test access complete








#### Task Summary

----



# Lab 13 - Summary

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

#### Hint Summary

No hint available


#### Complete Summary

$ Confirm Summary complete


#### Task aaaa

----

# test

aaa

#### Hint aaaa

No hint available


#### Complete aaaa

> Confirm aaaa complete



#### Task Network Policies

----

#### Task aaaa

----

# test

aaa

#### Hint aaaa

No hint available


#### Complete aaaa

> Confirm aaaa complete



#### Task Network Policies

----


#### Task aaaa

----

# test

aaa

#### Hint aaaa

No hint available


#### Complete aaaa

> Confirm aaaa complete



#### Task Network Policies

----


# OC

##Logging Into the Cluster

By default, cluster up uses AllowAllPasswordIdentityProvider to authenticate against the local cluster. This means any non-empty user name and password can be used to login to the local cluster.

The recommended user name and password is developer and developer, respectively. This is because they are already assigned to the default project myproject and also can impersonate the administrator. This allows you to run administrator commands using the --as system:admin parameter.

To login as administrator, use the system account:

$ oc login -u system:admin




## Accessing the Web Console

To access the [OpenShift Web console](https://docs.okd.io/latest/architecture/infrastructure_components/web_console.html), you can run this command in a shell after starting Minishift to get the URL of the Web console:
    
    $ minishift console --url

Alternatively, after starting Minishift, you can use the following command to directly open the console in a browser:
    
    $ minishift console



## Logging Into the Registry

  1. Start Minishift and add the `oc` binary to the `PATH`. For a detailed example, see the [Minishift Quickstart](https://docs.okd.io/latest/minishift/getting-started/quickstart.html) section.

  2. Make sure your shell is configured to [reuse the Minishift docker daemon](https://docs.okd.io/latest/minishift/using/docker-daemon.html).

  3. Log into the OpenShift Docker registry.
    
     $ docker login -u developer -p $(oc whoami -t) $(minishift openshift registry)

## [](https://docs.okd.io/latest/minishift/openshift/openshift-docker-registry.html#deploy-applications)Deploying Applications

The following example shows how to deploy an OpenShift application directly from a locally-built Docker image. This example uses the OpenShift project **myproject**. This project is automatically created by `minishift start`.

  1. Make sure your shell is configured to [reuse the Minishift docker daemon](https://docs.okd.io/latest/minishift/using/docker-daemon.html).

  2. Build the Docker image as usual.

  3. Tag the image against the OpenShift registry:
    
     $ docker tag my-app $(minishift openshift registry)/myproject/my-app

  4. Push the image to the registry to create an image stream with the same name as the application:
    
     $ docker push $(minishift openshift registry)/myproject/my-app

  5. Create an application from the image stream and expose the service:
    
     $ oc new-app --image-stream=my-app --name=my-app $ oc expose service my-app

__

If you want to deploy an application using `oc run --image […​]` then exposed internal registry route doesn’t work. You should use internal registry IP along with your project and app to deploy, as following:
    
    $ oc run myapp --image 172.30.1.1:5000/myproject/myapp


## Viewing OpenShift Logs

To access OpenShift logs, run the following command after starting Minishift:

$ minishift logs








#### Task SecurityTooling

----


# Lab 2 - Install Tools


## Polaris

1. Install Polaris Dashboard by running:

	```
	kubectl apply -f https://github.com/FairwindsOps/polaris/releases/latest/download/dashboard.yaml
	
	namespace/polaris created
	configmap/polaris created
	serviceaccount/polaris-dashboard created
	clusterrole.rbac.authorization.k8s.io/polaris-dashboard created
	clusterrolebinding.rbac.authorization.k8s.io/polaris-dashboard created
	service/polaris-dashboard created
	deployment.apps/polaris-dashboard created
	```

2. Wait until the pod si running:

	```
	kubectl get pods -n polaris
	NAME                                 READY     STATUS    RESTARTS   AGE
	polaris-dashboard-69f5bc4b5d-8jz24   1/1       Running   0          66s
	```
	
3. Once the status reads `Running`, we need to expose the Dashboard as a service so we can access it:
4. 
    ```
   $ kubectl expose deployment polaris-dashboard -n polaris --name polaris-dashboard-service --type="NodePort" --port=8080
   
   service/polaris-dashboard-service exposed
  ```


4. The Polaris Dashboard is now running in your cluster, and exposed to the internet. 
 	You can open it by typing:

	```   
	minikube service polaris-dashboard-service -n polaris
	```   

5. Look around the Dashboard to get familiar with the checks.

	![](./images/sec1.png)

6. Let's deploy a version of `k8sdemo` that has some more problems by running:

	```
	$ kubectl create -f https://raw.githubusercontent.com/niklaushirt/training/master/deployment/demoapp-errors.yaml
	```

   This action will take a bit of time. To check the status of the running application, you can use ` kubectl get pods`.

7. Check out the dashboard for the `k8sdemo-nok` application and you will find that there are a lot more warnings for this deployment.


	![](./images/sec2.png)


```
kube-bench

wget https://github.com/aquasecurity/kube-bench/releases/download/v0.0.34/kube-bench_0.0.34_linux_amd64.tar.gz
tar -zxvf kube-bench_0.0.34_linux_amd64.tar.gz
chmod +x kube-bench
sudo mv kube-bench /usr/local/bin/


curl -Lo rakkess.gz https://github.com/corneliusweig/rakkess/releases/download/v0.4.1/rakkess-linux-amd64.gz && \
  gunzip rakkess.gz && chmod +x rakkess && mv rakkess $GOPATH/bin/
  

https://github.com/jasonrichardsmith/rbac-view/releases/download/v0.2.1/rbac-view.v0.2.1.linux.tar.gz
tar -zxvf rbac-view.v0.2.1.linux.tar.gz
chmod +x ./bin/linux/rbac-view
sudo mv ./bin/linux/rbac-view /usr/local/bin/

```

#### Hint SecurityTooling

No hint available


#### Complete SecurityTooling

$ Confirm SecurityTooling complete



