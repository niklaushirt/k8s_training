
:course_title: JTC02 Kubernetes Labs Light

:course_desc: This course contains the Kubernetes Labs.  

:course_max: 17

:course_auto: no

:button1_label: Task

:button2_label: Hint

:button2_delay: 9999999

:button3_label: Complete

:button3_delay: 1000





#### Task LabInformation

----



# Lab information

This Lab has been designed for IBM internal training purposes. 


##  Lab overview

* Lab 0: Provides a walkthrough for getting to know command-line tools and check if minikube is running.

* Lab 1: This lab walks through creating and deploying a simple "guestbook" app written in Go as a net/http Server and accessing it.

* Lab 2: Builds on lab 1 to expand to a more resilient setup which can survive having containers fail and recover. Lab 2 will also walk through basic services you need to get started with Kubernetes

* Lab 3: Builds on lab 2 by increasing the capabilities of the deployed Guestbook application. This lab covers basic distributed application design and how kubernetes helps you use standard design practices.

---
---


# Nomenclatures

### Shell Commands

The commands that you are going to execute to progress the Labs will look like this:

![shell](./images/shell.png)

> **IMPORTANT NOTE:** You do not have to enter the `$` character, it's only there for better legibility.
> 
> So in the above example you would only enter/copy-paste `kubectl create -f redis-slave-service.yaml`
> 


### Code Examples
Code examples are presented like this:

![code](./images/code.png)

This is only for illustration and is not being actively used in the Labs.




#### Hint LabInformation

No hint available


#### Complete LabInformation

> Confirm Lab Information complete
> 


----




#### Task CheckLabPrerequisitesMinikube

In this initial part we will verify that the Lab prerequisites have been installed.


# Check Minikube
## Make sure minikube is running 


1. Verify that minikube is running
	If not please complete JTC99 K8s Lab Setup

	```
	$ minikube status
	
	host: Running
	kubelet: Running
	apiserver: Running
	kubectl: Correctly Configured: pointing to minikube-vm at 192.168.99.100
	```
	
2. Verify kubectl can communicate with your cluster.

	```
	$ kubectl get nodes
	
	NAME       STATUS    ROLES     AGE       VERSION
	minikube   Ready     master    32m       v1.14.1
	```
	
3. Check that the networking is up and running

	```
	$ kubectl get deployment -n kube-system
	
	NAME              READY     UP-TO-DATE   AVAILABLE   AGE
	cilium-operator   1/1       1            1           5m37s
	coredns           2/2       2            2           62m
	```

#### Hint CheckLabPrerequisitesMinikube

No hint available


#### Complete CheckLabPrerequisitesMinikube

> Confirm CheckLabPrerequisitesMinikube complete





#### Task Get Source Code

----

# Download the Workshop Source Code
Repo `[k8sdemo]()` has the application that we'll be deploying.
While we're not going to build it we will use the deployment configuration files from that repo.
Guestbook application has two versions v1 and v2 which we will use to demonstrate some rollout
functionality later. All the configuration files we use are under the directory guestbook/v1.




```
$ git clone https://github.com/niklaushirt/guestbook.git
```



#### Hint Get Source Code

No hint available


#### Complete Get Source Code

> Confirm Get Source Code complete





#### Task Lab0_minikube

---

# Lab 0. Get to know minikube


## Enable Kubernetes Dashboard

In a **separate(!)** terminal run the following:

```
$ minikube dashboard &                                                                                            

🔌  Enabling dashboard ...
🤔  Verifying dashboard health ...
🚀  Launching proxy ...
🤔  Verifying proxy health ...
🎉  Opening http://127.0.0.1:58935/api/v1/namespaces/kube-system/services/http:kubernetes-dashboard:/proxy/ 
in your default browser...
```

This starts the Kubernetes Dashboard in the background (hence the `&` at the end).
If the Terminal seems stuck just press `Enter` once and you'll get the prompt back.


After a while the Kubernetes Dashboard will open.
If it doesn't please try the solution below.
**The dashboard is there for convenience and is not needed for the Lab**

---
---

> **Hint**
> 
> If you get a 503 error try to open it directly: 
> 
> `http://127.0.0.1:52077/api/v1/namespaces/kube-system/services/http:kubernetes-dashboard:/proxy/`
> 	
	
## Getting to know minikube

### What is Minikube?

Minikube is an open source tool that enables you to run Kubernetes on your laptop or other local machine. It can work with Linux, Mac, and Windows operating systems. It runs a single-node cluster inside a virtual machine on your local machine.


minikube runs the official stable release of Kubernetes, with support for standard Kubernetes features like:

* LoadBalancer - using `minikube tunnel`
* Multi-cluster - using `minikube start -p <name>`
* NodePorts - using `minikube service`
* Persistent Volumes
* Ingress
* RBAC
* Dashboard - `minikube dashboard`
* Container runtimes
* Configure apiserver and kubelet options via command-line flags
* Addons - a marketplace for developers to share configurations for running services on minikube

### Useful commands

Start a cluster by running:

`minikube start`

Access Kubernetes Dashboard within Minikube:

`minikube dashboard`

Open this exposed endpoint in your browser:

`minikube service hello-minikube`

Start a second local cluster:

`minikube start -p cluster2`

Stop your local cluster:

`minikube stop`

Delete your local cluster:

`minikube delete`



#### Hint Lab0_minikube

No hint available


#### Complete Lab0_minikube

> Confirm Lab0_minikube complete





#### Task Lab1_DeployWeb

----

# Lab 1. Set up and deploy your first application

Learn how to deploy an application to a Kubernetes cluster.

Once your client is configured, you are ready to deploy your first application, `k8sdemo`.

## Lab 1 - Deploy the frontend application

In this part of the lab we will deploy an application called `k8sdemo` that has already been built and uploaded to DockerHub under the name `niklaushirt/k8sdemo`.



1. Start by running `k8sdemo`

	```
	$ kubectl create -f https://raw.githubusercontent.com/niklaushirt/training/master/deployment/demoapp.yaml
	```

   This action will take a bit of time. To check the status of the running application, you can use ` kubectl get pods`.

   You should see output similar to the following:

  ```
   $ kubectl get pods -n default 
   
   NAME                       READY     STATUS    RESTARTS   AGE
   k8sdemo-7d46f69d68-bd2cw   0/1       Running   0          17s  
  ```
  
   Eventually, the status should show up as `1/1 Running`.
   
  ```
   $ kubectl get pods -n default 
   
   NAME                          READY     STATUS              RESTARTS   AGE
   k8sdemo-7d46f69d68-bd2cw      1/1       Running             0          5m
  ```
   
   The end result of the run command is to create a Deployment resource that manages the lifecycle of those pods.
 
   
3. Once the status reads `Running`, we need to expose that deployment as a service so we can access it through the IP of the worker nodes.
   The `k8sdemo` application listens on port 3000.  Run:

  ```
   $ kubectl expose deployment k8sdemo --name k8sdemo-service -n default --type="NodePort" --port=3000
   
   service "k8sdemo-service" exposed
  ```

4. To find the port used on that worker node, examine your new service:

  ```
   $ kubectl get service -n default k8sdemo-service
   
   NAME              TYPE       CLUSTER-IP      EXTERNAL-IP   PORT(S)          AGE
k8sdemo-service   NodePort   10.109.30.227   <none>        3000:30931/TCP   11m
  ```
   
   We can see that our in this example`<nodeport>` is `31208`. We can see in the output the port mapping from 3000 inside  the pod exposed to the cluster on port 30931. This port in the 31000 range is automatically chosen, and **will probably be different for you**.

5. `k8sdemo` is now running on your cluster, and exposed to the internet. 
 	You can open the webpage directly by typing:

	```  
	minikube service k8sdemo-service
	```   

	where k8sdemo-service is the name of the exposed kubernetes service.
   
5. Your `k8sdemo` should now be open in the your default browser.
   However it will show an error, because we have not yet deployed the backend.

	**Testing DEMO_API
	STATUS: ERROR	
	Trying to reach backend ....**


#### Hint Lab1_DeployWeb

No hint available


#### Complete Lab1_DeployWeb

> Confirm Lab1_DeployWeb complete




#### Task Lab1_DeployBackend

----

## Lab 1 - Deploy the application backend

In this part of the lab we will deploy the application backend called `k8sdemo-backend` that has already been built and uploaded to DockerHub under the name `niklaushirt/k8sdemo-backend`.

  

1. Start by running `k8sdemo-backend`

	```
	$ kubectl create -f https://raw.githubusercontent.com/niklaushirt/training/master/deployment/demoapp-backend.yaml
	```

   This action will take a bit of time. To check the status of the running application, you can use ` kubectl get pods`.

   You should see output similar to the following:

  ```
   $ kubectl get pods -n default
   
   NAME                              READY     STATUS    RESTARTS   AGE
k8sdemo-7d46f69d68-xcgcw          0/1       Running   0          13m
k8sdemo-backend-9c777544b-cp59q   0/1       Running   0          1m
k8sdemo-backend-9c777544b-jqjz9   0/1       Running   0          1m  
  ```
  
   Eventually, the status should show up as `1/1 Running`.
   
  ```
   $ kubectl get pods -n default
   
   NAME                              READY     STATUS    RESTARTS   AGE
k8sdemo-7d46f69d68-xcgcw          1/1       Running   0          13m
k8sdemo-backend-9c777544b-cp59q   1/1       Running   0          6m35s
k8sdemo-backend-9c777544b-jqjz9   1/1       Running   0          6m35s
  ```
   
   The end result of the run command is to create a Deployment resource that manages the lifecycle of those pods.
 
   
3. Once the status reads `Running`, we need to expose that deployment as a service so we can access it through the IP of the worker nodes.
   The `k8sdemo` application listens on port 3000.  Run:

  ```
   $ kubectl expose deployment k8sdemo-backend --name k8sdemo-backend-service -n default --type="NodePort" --port=3000
   service "k8sdemo-service" exposed
  ```

4. Now reload the webpage and verify, that it shows 


	**Testing DEMO_API
	STATUS: OK	
	....**

4. If you reload the webpage several times, you should see, tht the IP Address of the backend API Pod is changing between the two Pods that have been spun up. 

---   



# Congratulations!!! This concludes Lab 1 on deploying a web application to Kubernetes

We will be using this deployment in the following Labs.


#### Hint Lab1_DeployBackend 

No hint available


#### Complete Lab1_DeployBackend

> Confirm Lab1_DeployBackend complete





#### Task Lab2_Scale

----

# Lab 2: Scale and Update Deployments

In this lab, you'll learn how to update the number of instances a deployment has and how to modify the API backend. 

> For this lab, you need a running deployment of the `k8sdemo` application from the previous lab. If you deleted it, recreate it.
>     
### Scale apps with replicas

A *replica* is a copy of a pod that contains a running service. By having multiple replicas of a pod, you can ensure your deployment has the available resources to handle increasing load on your application.

1. `kubectl` provides a `scale` subcommand to change the size of an existing deployment. Let's increase our capacity from a single running instance of
   `k8sdemo` up to 10 instances:

  ```
   $ kubectl scale --replicas=4 deployment k8sdemo-backend -n default
   
   deployment "k8sdemo" scaled
  ```

   Kubernetes will now try to make reality match the desired state of 4 replicas by starting 2 new pods with the same configuration as the first.

4. To verify that your changes have been rolled out, you can run:

  ```
   $ kubectl get pods -n default
   
   NAME                              READY     STATUS    RESTARTS   AGE
k8sdemo-7d46f69d68-xcgcw          1/1       Running   0          19m
k8sdemo-backend-9c777544b-cp59q   1/1       Running   0          12m
k8sdemo-backend-9c777544b-jqjz9   1/1       Running   0          12m
k8sdemo-backend-9c777544b-lwssx   1/1       Running   0          12m
k8sdemo-backend-9c777544b-t5mlq   1/1       Running   0          12m
  ```
  
  You should see output listing 4 replicas of your deployment.

# Congratulations!!! This concludes Lab 2 on scaling and updating Deployments

#### Hint Lab2_Scale

No hint available


#### Complete Lab2_Scale

> Confirm Lab2_Scale complete


