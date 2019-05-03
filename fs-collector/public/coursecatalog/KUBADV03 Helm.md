
:course_title: KUBADV03 Helm

:course_desc: This course provides the student with the necessary steps to get a basic understanding of Helm.  

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
# Why Helm?

[Helm](https://docs.helm.sh/) is often described as the Kubernetes application package manager. So, what does Helm give you over using kubectl directly?

# Objectives

These labs provide an insight on the advantages of using Helm over using Kubernetes directly through `kubectl`. When you complete all the labs, you'll:
* Understand the core concepts of Helm
* Understand the advantages of deployment using Helm over Kubernetes directly, looking at:
  * Application management
  * Updates
  * Configuration
  * Revision management
  * Repositories and chart sharing

# Prerequisites

* Have a running Kubernetes cluster.	

# Helm Overview

Helm is a tool that streamlines installation and management of Kubernetes applications. It uses a packaging format called "charts", which are a collection of files that describe Kubernetes resources. It can run anywhere (laptop, CI/CD, etc.) and is available for various operating systems, like OSX, Linux and Windows.

![helm-architecture](images/helm-architecture.png)

It has a client-server architecture with the client called `helm` and the server called `Tiller`. The client is a CLI which users interact with to perform different operations like install/upgrade/delete etc. The client interacts with Tiller and the chart repository. Tiller interacts with the Kubernetes API server. It renders Helm template files into Kubernetes manifest files which it uses to perform operations on the Kubernetes cluster via the Kubernetes API. See the [Helm Architecture](https://docs.helm.sh/architecture/) for more details. 

A [chart](https://docs.helm.sh/developing_charts) is organized as a collection of files inside of a directory where the directory name is the name of the chart. It contains template YAML files which facilitates providing configuration values at runtime and eliminates the need of modifying YAML files. These templates provide programming logic as they are based on the [Go template language](https://golang.org/pkg/text/template/), functions from the [Sprig lib](https://github.com/Masterminds/sprig) and other [specialized functions](https://docs.helm.sh/developing_charts/#chart-development-tips-and-tricks).

The chart repository is a location where packaged charts can be stored and shared. This is akin to the image repository in Docker. Refer to [The Chart Repository Guide](https://github.com/helm/helm/blob/master/docs/chart_repository.md) for more details.

# Helm Abstractions

Helm terms :
* Chart - It contains all of the resource definitions necessary to run an application, tool, or service inside of a Kubernetes cluster. A chart is basically a package of pre-configured Kubernetes resources.
* Config - Contains configuration information that can be merged into a packaged chart to create a releasable object.
* helm - Helm client. Communicates to Tiller through the Helm API - [HAPI](https://docs.helm.sh/developers/#the-helm-api-hapi) which uses [gRPC](https://grpc.io/).
* Release - An instance of a chart running in a Kubernetes cluster.
* Repository - Place where charts reside and can be shared with others.
* Tiller - Helm server. It interacts directly with the [Kubernetes API](https://kubernetes.io/docs/concepts/overview/kubernetes-api/) server to install, upgrade, query, and remove Kubernetes resources.

To get started, head on over to [Lab 1](Lab1/README.md). 


### Workshop

* Lab 1 - Download the Sample Application
* Lab 2 - Make sure minikube is running
* Lab 3 - Installing Helm
* Lab 4 - I just want to deploy
* Lab 5 - I need to change but want none of the hassle
* Lab 6 - Keeping track of the deployed application
* Lab 7 - I like sharing
* Lab 8 - Create Charts


----


#### Hint Introduction

No hint available


#### Complete Introduction

> Confirm Introduction complete







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

> Confirm Check Minikube complete


#### Task Get Source Code 

----


# Download the Workshop Source Code
Repo `guestbook` has the application that we'll be deploying.
While we're not going to build it we will use the deployment configuration files from that repo.
Guestbook application has two versions v1 and v2 which we will use to demonstrate some rollout
functionality later. All the configuration files we use are under the directory guestbook/v1.


```
$ git clone https://github.com/niklaushirt/helm101.git
```

#### Hint Get Source Code 

No hint available


#### Complete Get Source Code 

> Confirm Check Minikube complete





#### Task Installing Helm

----

# Lab 0. Installing Helm

There are two parts to installing Helm: the client (helm) and the server (Tiller). Helm can be installed from source or pre-built binary releases. In this lab, we are going to use the pre-built binary release (Linux amd64) from the Helm community. Refer to the [Helm install docs](https://docs.helm.sh/using_helm/#install-helm) for more details. 


### Installing the Helm Client (helm)

1. Install the [latest release Helm](https://github.com/helm/helm/releases) for your environment, either manually or by typing:

	```
	$ curl -L https://git.io/get_helm.sh | bash
	```

4. The Helm client is now installed and can be tested with the command, `helm help`. Refer to the doc [installing Client](https://docs.helm.sh/using_helm/#installing-the-helm-client) for more details.

### Installing the Helm Server (Tiller)

1. Run the command: 

	```
	$ helm init
	```
	
	This will initialize the Helm CLI and also install Tiller into the Kubernetes cluster under the `tiller-namespace`.

2. You can verify that the client and server are installed correctly by running the command, `helm version`. This should return both the client and server versions. Refer to the doc [installing Tiller](https://docs.helm.sh/using_helm/#installing-tiller) for more details.

### Conclusion

You are now ready to start using Helm.


#### Hint Installing Helm

No hint available


#### Complete Installing Helm

> Confirm Installing Helm complete



#### Task JustDeploy

----


# Lab 1. I just want to deploy!

Let's investigate how Helm can help us focus on other things by letting a chart do the work for us. We'll first deploy an application to a Kubernetes cluster by using `kubectl` and then show how we can offload the work to a chart by deploying the same app with Helm.

The application is the [Guestbook App](https://github.com/niklaushirt/guestbook), which is a sample multi-tier web application.

# Deploy the application using `kubectl`

In this part of the lab, we will deploy the application using the Kubernetes client `kubectl`. We will use [Version 1](https://github.com/IBM/guestbook/tree/master/v1) of the app for deploying here. Clone the [Guestbook App](https://github.com/IBM/guestbook) repo to get the files: 
```$ git clone https://github.com/IBM/guestbook.git``` .

1. Use the configuration files in the cloned Git repository to deploy the containers and create services for them by using the following commands:

   ```
   $ cd guestbook/v1

   $ kubectl create -f redis-master-deployment.yaml
   deployment.apps/redis-master created

   $ kubectl create -f redis-master-service.yaml
   service/redis-master created

   $ kubectl create -f redis-slave-deployment.yaml
   deployment.apps/redis-slave created

   $ kubectl create -f redis-slave-service.yaml
   service/redis-slave created

   $ kubectl create -f guestbook-deployment.yaml
   deployment.apps/guestbook-v1 created

   $ kubectl create -f guestbook-service.yaml
   service/guestbook created
   ```
   Refer to the [guestbook README](https://github.com/IBM/guestbook) for more details.
 
2. View the guestbook:

   You can now play with the guestbook that you just created by opening it in a browser (it might take a few moments for the guestbook to come up).

 * **Local Host:**
  If you are running Kubernetes locally, view the guestbook by navigating to `http://localhost:3000` in your browser.

 * **Remote Host:**
    1. To view the guestbook on a remote host, locate the external IP and port of the load balancer in the **EXTERNAL-IP** and **PORTS** columns of the `$ kubectl get services` output. 

       ```
       $ kubectl get services
       NAME           TYPE           CLUSTER-IP       EXTERNAL-IP   PORT(S)          AGE
       guestbook      LoadBalancer   172.21.252.107   50.23.5.136   3000:31838/TCP   14m
       redis-master   ClusterIP      172.21.97.222    <none>        6379/TCP         14m
       redis-slave    ClusterIP      172.21.43.70     <none>        6379/TCP         14m
       .........
       ```

       In this scenario the URL is `http://50.23.5.136:31838`.
       
       Note: If no external IP is assigned, then you can get the external IP with the following command:

       ```
       $ kubectl get nodes -o wide
       NAME           STATUS    ROLES     AGE       VERSION        EXTERNAL-IP      OS-IMAGE             KERNEL-VERSION      CONTAINER-RUNTIME  
       10.47.122.98   Ready     <none>    1h        v1.10.11+IKS   173.193.92.112   Ubuntu 16.04.5 LTS   4.4.0-141-generic   docker://18.6.1
       ```

       In this scenario the URL is `http://173.193.92.112:31838`.

    2. Navigate to the output given (for example `http://50.23.5.136:31838`) in your browser. You should see the guestbook now displaying in your browser:

       ![Guestbook](../images/guestbook-page.png)

# Deploy the application using Helm

In this part of the lab, we will deploy the application by using Helm. We will set a release name of `guestbook-demo` to distinguish it from the previous deployment. The Helm chart is available [here](../../charts/guestbook). Clone the [Helm 101](https://github.com/IBM/helm101) repo to get the files:
```$ git clone https://github.com/IBM/helm101``` .

A chart is defined as a collection of files that describe a related set of Kubernetes resources. We probably then should take a look at the the files before we go and install the chart. The files for the `guestbook` chart are as follows:
* Chart.yaml: A YAML file containing information about the chart.
* LICENSE: A plain text file containing the license for the chart.
* README.md: A README providing information about the chart usage, configuration, installation etc.
* templates: A directory of templates that will generate valid Kubernetes manifest files when combined with values.yaml. Files contained are as follows:
   * \_helper.tpl: Template helpers/definitions that are re-used throughout the chart.
   * NOTES.txt: A plain text file containing short usage notes about how to access the app post install.
   * guestbook-deployment.yaml: Guestbook app container resource.
   * guestbook-service.yaml: Guestbook app service resource.
   * redis-master-deployment.yaml: Redis master container resource.
   * redis-master-service.yaml: Redis master service resource.
   * redis-slave-deployment.yaml: Redis slave container resource.
   * redis-slave-service.yaml: Redis slave service resource.
* values.yaml: The default configuration values for the chart.

Note: The template files shown above will be rendered into Kubernetes manifest files by Tiller before being passed to the Kubernetes API server. Therefore, they map to the manifest files that we deployed when we used `kubectl` (minus the helper and notes files). 

Let's go ahead and install the chart now.

1. Install the app as a Helm chart:

    ```$ helm install ./guestbook/ --name guestbook-demo --namespace helm-demo```
    
    Note: `$ helm install` command will create the `helm-demo` namespace if it does not exist.
    
    You should see output similar to the following:
    
    ```
    NAME:   guestbook-demo
    LAST DEPLOYED: Fri Sep 21 14:26:01 2018
    NAMESPACE: helm-demo
    STATUS: DEPLOYED
    
    RESOURCES:
    ==> v1/Service
    NAME            AGE
    guestbook-demo  0s
    redis-master    0s
    redis-slave     0s
    
    ==> v1/Deployment
    guestbook-demo  0s
    redis-master    0s
    redis-slave     0s

    ==> v1/Pod(related)
    NAME                             READY  STATUS             RESTARTS  AGE
    guestbook-demo-5dccd68c88-hqlws  0/1    ContainerCreating  0         0s
    guestbook-demo-5dccd68c88-sdhcv  0/1    ContainerCreating  0         0s
    redis-master-5d8b66464f-g9q7m    0/1    ContainerCreating  0         0s
    redis-slave-586b4c847c-ct77m     0/1    ContainerCreating  0         0s
    redis-slave-586b4c847c-nrzwj     0/1    ContainerCreating  0         0s

    NOTES:
    1. Get the application URL by running these commands:
      NOTE: It may take a few minutes for the LoadBalancer IP to be available.
            You can watch the status of by running 'kubectl get svc -w guestbook-demo --namespace helm-demo'
      export SERVICE_IP=$(kubectl get svc --namespace helm-demo guestbook-demo -o jsonpath='{.status.loadBalancer.ingress[0].ip}')
      echo http://$SERVICE_IP:3000
    ```
    
    The chart install performs the Kubernetes deployments and service creations of the redis master and slaves, and the guestbook app, as one. This is because the chart is a collection of files that describe a related set of Kubernetes resources and Helm manages the creation of these resources via the Kubernetes API.    
    
    To check the deployment, you can use `$ kubectl get deployment guestbook-demo --namespace helm-demo`.
    
    You should see output similar to the following:
    
    ```
    NAME             DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
    guestbook-demo   2         2         2            2           51m
    ```
    
    To check the status of the running application, you can use `$ kubectl get pods --namespace helm-demo`.
    
    ```
    NAME                            READY     STATUS    RESTARTS   AGE
    guestbook-demo-6c9cf8b9-jwbs9   1/1       Running   0          52m
    guestbook-demo-6c9cf8b9-qk4fb   1/1       Running   0          52m
    redis-master-5d8b66464f-j72jf   1/1       Running   0          52m
    redis-slave-586b4c847c-2xt99    1/1       Running   0          52m
    redis-slave-586b4c847c-q7rq5    1/1       Running   0          52m
    ```
   
    To check the services, you can run `$ kubectl get services --namespace helm-demo`.
    
    ```
    NAME             TYPE           CLUSTER-IP       EXTERNAL-IP   PORT(S)          AGE
    guestbook-demo   LoadBalancer   172.21.43.244    <pending>     3000:31367/TCP   50m
    redis-master     ClusterIP      172.21.12.43     <none>        6379/TCP         50m
    redis-slave      ClusterIP      172.21.176.148   <none>        6379/TCP         50m
    ```
    
3. View the guestbook:

   You can now play with the guestbook that you just created by opening it in a browser (it might take a few moments for the guestbook to come up).

 * **Local Host:**
    If you are running Kubernetes locally, view the guestbook by navigating to `http://localhost:3000` in your browser.

 * **Remote Host:**
    1. To view the guestbook on a remote host, locate the external IP and the port of the load balancer by following the "NOTES" section in the install output. The commands will be similar to the following:
    
       ```
       $ export SERVICE_IP=$(kubectl get svc --namespace helm-demo guestbook-demo -o jsonpath='{.status.loadBalancer.ingress[0].ip}')
       $ echo http://$SERVICE_IP:331367
       http://50.23.5.136:31367
       ```

       In this scenario the URL is `http://50.23.5.136:31367`.
       
       Note: If no external IP is assigned, then you can get the external IP with the following command:

       ```
       $ kubectl get nodes -o wide
       NAME           STATUS    ROLES     AGE       VERSION        EXTERNAL-IP      OS-IMAGE             KERNEL-VERSION      CONTAINER-RUNTIME  
       10.47.122.98   Ready     <none>    1h        v1.10.11+IKS   173.193.92.112   Ubuntu 16.04.5 LTS   4.4.0-141-generic   docker://18.6.1
       ```

       In this scenario the URL is `http://173.193.92.112:31838`.
 
    2. Navigate to the output given (for example `http://50.23.5.136:31367`) in your browser. You should see the guestbook now displaying in your browser:

       ![Guestbook](../images/guestbook-page.png)

# Conclusion

Congratulations, you have now deployed an application by using two different methods to Kubernetes! From this lab, you can see that using Helm required less commands and less to think about (by giving it the chart path and not the individual files) versus using `kubectl`. Helm's application management provides the user with this simplicity.

Move on to the next lab, [Lab2](../Lab2/README.md), to learn how to update our running app when the chart has been changed.


#### Hint JustDeploy

No hint available


#### Complete JustDeploy

> Confirm Just Deploy complete

#### Task JustChange

----


# Lab 2. I need to change but want none of the hassle

In [Lab 1](../Lab1/README.md), we installed the guestbook sample app by using Helm and saw the benefits over using `kubectl`. You probably think that you're done and know enough to use Helm. But what about updates or improvements to the chart? How do you update your running app to pick up these changes? 

In this lab, we're going to look at how to update our running app when the chart has been changed. To demonstrate this, we're going to make changes to the original `guestbook` chart by:
* Removing the Redis slaves and using just the in-membory DB
* Changing the type from `LoadBalancer` to `NodePort`.

It seems contrived but the goal of this lab is to show you how to update your apps with Kubernetes and Helm. So, how easy is it to do this? Let's take a look below.

# Update the application using `kubectl`

In this part of the lab we will update the previously deployed application [Guestbook](https://github.com/IBM/guestbook), using Kubernetes directly.

1. This is an optional step, that it is not necessary to update your running app. The reason for doing this step is "house keeping" - you want to have the correct files for the current configuration that you have deployed. This avoids making mistakes if you have future updates or even rollbacks. In this updated configuration, we remove the Redis slaves. That is why you should move/archive or remove the Redis slave files to keep abreast of the update:

   ```
   redis-slave-service.yaml
   redis-slave-deployment.yaml
   ```

2. Delete the Redis slave service and pods:

   ```
   $ kubectl delete svc redis-slave --namespace default
   service "redis-slave" deleted
   $ kubectl delete deployment redis-slave --namespace default
   deployment.extensions "redis-slave" deleted
   ```

3. Update the guestbook service from `LoadBalancer` to `NodePort` type:

   ```
   $ sed -i.bak 's/LoadBalancer/NodePort/g' guestbook-service.yaml
   ```

   Note: Like in Step 1, you may want to archive before making the changes.
   
4. Delete the guestbook service:
    
    ```
    $ kubectl delete svc guestbook --namespace default
    ```
    
5. Re-create the service with `NodePort` type:

    ```
    $ kubectl create -f guestbook-service.yaml
    ```
    
6. To check the updates, you can run ```$ kubectl get all --namespace default```:
    
    ```
    NAME                                READY     STATUS    RESTARTS   AGE
    pod/guestbook-v1-7fc76dc46-9r4s7    1/1       Running   0          1h
    pod/guestbook-v1-7fc76dc46-hspnk    1/1       Running   0          1h
    pod/guestbook-v1-7fc76dc46-sxzkt    1/1       Running   0          1h
    pod/redis-master-5d8b66464f-pvbl9   1/1       Running   0          1h
    
    NAME                   TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)          AGE
    service/guestbook      NodePort    172.21.45.29    <none>        3000:31989/TCP   31s
    service/kubernetes     ClusterIP   172.21.0.1      <none>        443/TCP          9d
    service/redis-master   ClusterIP   172.21.232.61   <none>        6379/TCP         1h
    
    NAME                           DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
    deployment.apps/guestbook-v1   3         3         3            3           1h
    deployment.apps/redis-master   1         1         1            1           1h
    
    NAME                                      DESIRED   CURRENT   READY     AGE
    replicaset.apps/guestbook-v1-7fc76dc46    3         3         3         1h
    replicaset.apps/redis-master-5d8b66464f   1         1         1         1h
    ```
    Note: The service type has changed (to `NodePort`) and a new port has been allocated (`31989` in this output case) to the guestbook 
    service. All `redis-slave` resources have been removed.

5. View the guestbook as per [Lab1](../Lab1/README.md), using the updated port for the guestbook service.
   
# Update the application using Helm

In this section, we'll update the previously deployed `guestbook-demo` application by using Helm.

Before we start, let's take a few minutes to see how Helm simplifies the process compared to using Kubernetes directly. Helm's use of a [template language](https://docs.helm.sh/chart_template_guide/) provides great flexibility and power to chart authors, which removes the complexity to the chart user. In the guestbook example, we'll use the following capabilities of templating:
* Values: An object that provides access to the values passed into the chart. An example of this is in `guestbook-service`, which contains the line `type: {{ .Values.service.type }}`. This line provides the capability to set the service type during an upgrade or install.
* Control structures: Also called “actions” in template parlance, control structures provide the template author with the ability to control the flow of a template’s generation. An example of this is in `redis-slave-service`, which contains the line `{{- if .Values.redis.slaveEnabled -}}`. This line allows us to enable/disable the REDIS master/slave during an upgrade or install.

The complete `redis-slave-service.yaml` file shown below, demonstrates how the file becomes redundant when the `slaveEnabled` flag is disabled and also how the port value is set. There are more examples of templating functionality in the other chart files. 

```
{{- if .Values.redis.slaveEnabled -}}
apiVersion: v1
kind: Service
metadata:
  name: redis-slave
  labels:
    app: redis
    role: slave
spec:
  ports:
  - port: {{ .Values.redis.port }}
    targetPort: redis-server
  selector:
    app: redis
    role: slave
{{- end }}
```

Enough talking about the theory. Now let's give it a go!

1. Update the application:

    ```$ helm upgrade guestbook-demo ./guestbook --set redis.slaveEnabled=false,service.type=NodePort --namespace helm-demo```
    
    A Helm upgrade takes an existing release and upgrades it according to the information you provide. You should see output similar to the following:
    
    ```
    Release "guestbook-demo" has been upgraded. Happy Helming!
    LAST DEPLOYED: Mon Sep 24 10:36:18 2018
    NAMESPACE: helm-demo
    STATUS: DEPLOYED
    
    RESOURCES:
    ==> v1/Service
    NAME            AGE
    guestbook-demo  1h
    redis-master    1h
    
    ==> v1/Deployment
    guestbook-demo  1h
    redis-master    1h
    
    ==> v1/Pod(related)
    
    NAME                           READY  STATUS   RESTARTS  AGE
    guestbook-demo-6c9cf8b9-dhqk9  1/1    Running  0         1h
    guestbook-demo-6c9cf8b9-zddn2  1/1    Running  0         1h
    redis-master-5d8b66464f-g7sh6  1/1    Running  0         1h
    
    
    NOTES:
    1. Get the application URL by running these commands:
      export NODE_PORT=$(kubectl get --namespace helm-demo -o jsonpath="{.spec.ports[0].nodePort}" services guestbook-demo)
      export NODE_IP=$(kubectl get nodes --namespace helm-demo -o jsonpath="{.items[0].status.addresses[0].address}")
      echo http://$NODE_IP:$NODE_PORT
    ```
    
    The `upgrade` command upgrades the app to a specified version of a chart, removes the `redis-slave` resources, and updates the app `service.type` to `NodePort`.
        
    To check the updates, you can run ```$ kubectl get all --namespace helm-demo```
    
    ```
    NAME                                READY     STATUS    RESTARTS   AGE
    pod/guestbook-demo-6c9cf8b9-dhqk9   1/1       Running   0          1h
    pod/guestbook-demo-6c9cf8b9-zddn2   1/1       Running   0          1h
    pod/redis-master-5d8b66464f-g7sh6   1/1       Running   0          1h
    
    NAME                     TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)          AGE
    service/guestbook-demo   NodePort    172.21.43.244   <none>        3000:31202/TCP   1h
    service/redis-master     ClusterIP   172.21.12.43    <none>        6379/TCP         1h
    
    NAME                             DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
    deployment.apps/guestbook-demo   2         2         2            2           1h
    deployment.apps/redis-master     1         1         1            1           1h
    
    NAME                                      DESIRED   CURRENT   READY     AGE
    replicaset.apps/guestbook-demo-6c9cf8b9   2         2         2         1h
    replicaset.apps/redis-master-5d8b66464f   1         1         1         1h
    ```
    Note: The service type has changed (to `NodePort`) and a new port has been allocated (`31202` in this output case) to the guestbook service. All `redis-slave` resources have been removed.
    
2. View the guestbook as per [Lab1](../Lab1/README.md), using the updated port for the guestbook service.

# Conclusion

Congratulations, you have now updated the applications! Helm does not require any manual changing of resources and is therefore so much easier to upgrade! All configurations can be set on the fly on the command line or by using override files. This is made possible from when the logic was added to the template files, which enables or disables the capability, depending on the flag set.

Check out [Lab 3](../Lab3/README.md) to get an insight into revision management.


#### Hint JustChange

No hint available


#### Complete JustChange

> Confirm JustChange complete


#### Task KeepTrack

----


# Lab 3. Keeping track of the deployed application

Let's say you deployed different release versions of your application (i.e., you upgraded the running application). How do you keep track of the versions and how can you do a rollback?

# Revision management using Kubernetes

In this part of the lab, we should illustrate revision management of `guestbook` by using Kubernetes directly, but we can't. This is because Kubernetes does not provide any support for revision management. The onus is on you to manage your systems and any updates or changes you make. However, we can use Helm to conduct revision management.

# Revision management using Helm

In this part of the lab, we illustrate revision management on the deployed application `guestbook-demo` by using Helm.

With Helm, every time an install, upgrade, or rollback happens, the revision number is incremented by 1. The first revision number is always 1. Helm persists release metadata in configmaps, stored in the Kubernetes cluster. Every time your release changes, it appends that to the existing data. This provides Helm with the capability to rollback to a previous release.

Let's see how this works in practice.

1. Check the number of deployments:

    ```
    $ helm history guestbook-demo
    ```
    
    You should see output similar to the following because we did an upgrade in [Lab 2](../Lab2/README.md) after the initial install in [Lab 1](../Lab1/README.md):
    
    ```
    REVISION	UPDATED                 	STATUS    	CHART          	DESCRIPTION
    1       	Mon Sep 24 08:54:04 2018	SUPERSEDED	guestbook-0.1.0	Install complete
    2       	Mon Sep 24 10:36:18 2018	DEPLOYED  	guestbook-0.1.0	Upgrade complete
    ```
        
2. Roll back to the previous revision:

    In this rollback, Helm checks the changes that occured when upgrading from the revision 1 to revision 2. This information enables it to makes the calls to the Kubernetes API server, to update the deployed application as per the initial deployment - in other words with Redis slaves and using a load balancer.

    Rollback with this command, ```$ helm rollback guestbook-demo 1```
    
    ```
    Rollback was a success! Happy Helming!
    ```
    Check the history again, `$ helm history guestbook-demo`
    
    You should see output similar to the following:
    
    ```
    REVISION	UPDATED                 	STATUS    	CHART          	DESCRIPTION     
    1       	Mon Sep 24 08:54:04 2018	SUPERSEDED	guestbook-0.1.0	Install complete
    2       	Mon Sep 24 10:36:18 2018	SUPERSEDED	guestbook-0.1.0	Upgrade complete
    3       	Mon Sep 24 11:59:18 2018	DEPLOYED  	guestbook-0.1.0	Rollback to 1
    ```
    
    To check the rollback, you can run `$ kubectl get all --namespace helm-demo`:
    
    ```
    NAME                                READY     STATUS    RESTARTS   AGE
    pod/guestbook-demo-6c9cf8b9-dhqk9   1/1       Running   0          3h
    pod/guestbook-demo-6c9cf8b9-zddn2   1/1       Running   0          3h
    pod/redis-master-5d8b66464f-g7sh6   1/1       Running   0          3h
    pod/redis-slave-586b4c847c-tkfj5    1/1       Running   0          2m
    pod/redis-slave-586b4c847c-xxrdn    1/1       Running   0          2m
    
    NAME                     TYPE           CLUSTER-IP      EXTERNAL-IP   PORT(S)          AGE
    service/guestbook-demo   LoadBalancer   172.21.43.244   <pending>     3000:31202/TCP   3h
    service/redis-master     ClusterIP      172.21.12.43    <none>        6379/TCP         3h
    service/redis-slave      ClusterIP      172.21.232.16   <none>        6379/TCP         2m
    
    NAME                             DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
    deployment.apps/guestbook-demo   2         2         2            2           3h
    deployment.apps/redis-master     1         1         1            1           3h
    deployment.apps/redis-slave      2         2         2            2           2m
    
    NAME                                      DESIRED   CURRENT   READY     AGE
    replicaset.apps/guestbook-demo-6c9cf8b9   2         2         2         3h
    replicaset.apps/redis-master-5d8b66464f   1         1         1         3h
    replicaset.apps/redis-slave-586b4c847c    2         2         2         2m
    ```
   
    You can see from the output that the app service is the service type of `LoadBalancer` again and the Redis master/slave deployment has returned. 
    This shows a complete rollback from the upgrade in [Lab 2](../Lab2/README.md) 

# Conclusion

From this lab, we can say that Helm does revision management well and Kubernetes does not have the capability built in! You might be wondering why we need `helm rollback` when you could just re-run the `helm upgrade` from a previous version. And that's a good question. Technically, you should end up with the same resources (with same parameters) deployed. However, the advantage of using `helm rollback` is that helm manages (ie. remembers) all of the variations/parameters of the previous `helm install\upgrade` for you. Doing the rollback via a `helm upgrade` requires you (and your entire team) to manually track how the command was previously executed. That's not only tedious but very error prone. It is much easier, safer and reliable to let Helm manage all of that for you and all you need to do it tell it which previous version to go back to, and it does the rest.

[Lab 4](../Lab4/README.md) awaits.



#### Hint KeepTrack

No hint available


#### Complete KeepTrack

> Confirm KeepTrack complete



#### Task Share

----


# Lab 4. I like sharing

A key aspect of providing an application means sharing with others. Sharing can be direct counsumption (by users or in CI/CD pipelines) or as a dependency for other charts. If people can't find your app then they can't use it.

A means of sharing is a chart repository, which is a location where packaged charts can be stored and shared. As the chart repository only applies to Helm, we will just look at the usage and storage of Helm charts.

# Using charts from a public repository

Helm charts can be available on a remote repository or in a local environment/repository. The remote repositories can be public like [Helm Charts](https://github.com/helm/charts) or [IBM Helm Charts](https://github.com/IBM/charts), or hosted repositories like on Google Cloud Storage or GitHub. Refer to [Helm Chart Repository Guide](https://github.com/helm/helm/blob/master/docs/chart_repository.md) for more details. 

In this part of the lab, we show you how to install the `guestbook` chart from the [Helm101 repo](https://ibm.github.io/helm101/).

1. Check the repositories configured on your system:

   ```$ helm repo list```
   
   The output should be similar to the following:
   
   ```
   NAME  	URL                                             
   stable	https://kubernetes-charts.storage.googleapis.com
   local 	http://127.0.0.1:8879/charts                   
   ```
   
   Note: The Helm charts repository is installed by default with Helm. It is installed with the repositories `local` and `stable`. You can run the `local` repo using the [helm serve](https://github.com/helm/helm/blob/master/docs/helm/helm_serve.md) command. The `stable` repo is located at `https://kubernetes-charts.storage.googleapis.com/`.

2. Add `helm101` repo:

   ```$ helm repo add helm101 https://ibm.github.io/helm101/```
   
   Should generate an output as follows:
   
   ```"helmm101" has been added to your repositories```
   
   You can also search your repositories for charts by running the following command, ```$ helm search helm101```:
   
   ```
   NAME             	CHART VERSION	APP VERSION	DESCRIPTION                                                 
   helm101/guestbook	0.1.0        	           	A Helm chart to deploy Guestbook three tier web application.
   ```
      
3. Install the chart

   As mentioned we are going to install the `guestbook` chart from the [Helm101 repo](https://ibm.github.io/helm101/). As the repo is installed in our local respoitory we can reference the chart using the `repo name/chart name`, in other words `helm101/guestbook`. This means we can install the chart like we did previously with the command:

   ```$ helm install helm101/guestbook --name guestbook-demo --namespace repo-demo```
   
   The output should be similar to the following:
   
   ```
   NAME:   guestbook-demo
   LAST DEPLOYED: Thu Dec 13 07:36:18 2018
   NAMESPACE: repo-demo
   STATUS: DEPLOYED
   
   RESOURCES:
   ==> v1/Service
   NAME                      TYPE          CLUSTER-IP     EXTERNAL-IP  PORT(S)         AGE
   guestbook-demo-guestbook  LoadBalancer  10.98.43.107   <pending>    3000:31241/TCP  2s
   redis-master              ClusterIP     10.103.16.208  <none>       6379/TCP        2s
   redis-slave               ClusterIP     10.99.249.122  <none>       6379/TCP        2s
   
   ==> v1/Deployment
   NAME                      READY  UP-TO-DATE  AVAILABLE  AGE
   guestbook-demo-guestbook  0/2    2           0          2s
   redis-master              0/1    1           0          2s
   redis-slave               0/2    2           0          2s
   
   ==> v1/Pod(related)
   NAME                                       READY  STATUS             RESTARTS  AGE
   guestbook-demo-guestbook-75f5f9cf84-jcbtb  0/1    Pending            0         2s
   guestbook-demo-guestbook-75f5f9cf84-lzsw4  0/1    ContainerCreating  0         2s
   redis-master-7b5cc58fc8-2bzw6              0/1    ContainerCreating  0         2s
   redis-slave-5db5dcfdfd-24249               0/1    ContainerCreating  0         2s
   redis-slave-5db5dcfdfd-nkcpt               0/1    ContainerCreating  0         1s
   
   
   NOTES:
   Get the application URL by running these commands:
   export NODE_PORT=$(kubectl get --namespace repo-demo -o jsonpath="{.spec.ports[0].nodePort}" services guestbook-demo-guestbook)
   export NODE_IP=$(kubectl get nodes -o jsonpath={.items[*].status.addresses[?\(@.type==\"ExternalIP\"\)].address})
   echo http://$NODE_IP:$NODE_PORT```
   
# Conclusion

This lab provided you with a brief introduction to the Helm repositories to show how charts can be installed. The ability to share your chart means ease of use to both you and your consumers.



#### Hint Share

No hint available


#### Complete Share

> Confirm Share complete














#### Task Create Charts

----

In this tutorial, you learn how to transform your web app to a Helm chart, which can be deployed on IBM Cloud Private or on a [private cluster](https://cloud.ibm.com/docs/containers/cs_dedicated.html#dedicated).

**Note:** This tutorial does not bind any Watson services, because it is a private cloud, which is hosted on premises and not on a public IBM cluster. Therefore, if you want to integrate any IBM Cloud service, you need to do that by using the conventional API call mechanism. For reference, you can look at [my GitHub repo](https://github.com/arprasto/IBMPublicClusterHelmChart). Alternatively, you can bind the services to your cluster by [using these steps](https://cloud.ibm.com/docs/containers/cs_integrations.html#integrations) and updating the [deployment.yaml](https://github.com/arprasto/icp_helmchart/blob/master/icphelmchart/templates/deployment.yaml) accordingly.

## Prerequisites

  1. Install [Docker](https://developer.ibm.com/tutorials/convert-sample-web-app-to-helmchart/docker.com) in your development environment and create an account in Docker.
  2. You must have a [private cluster](https://cloud.ibm.com/docs/containers/cs_clusters.html#clusters), either through IBM Cloud Private or on a Public IBM Cluster. If you are new to IBM Cloud Private, then you need to first complete [this short exercise to get familiar with IBM Cloud Private](https://www.ibm.com/cloud/garage/dte/tutorial/deploy-cloud-native-microservices-application-ibm-cloud-private). Or you can navigate to your **[IBM Cloud dashboard > Containers > Create cluster](https://cloud.ibm.com/containers-kubernetes/catalog/cluster/create)**.
  3. Go through [this tutorial to set up your CLI and to create a private cluster](https://cloud.ibm.com/docs/containers/cs_tutorials.html#cs_cluster_tutorial). After this step, you will have `kubectl` and `bx` commands configured.
  4. (Note: This step is only for IBM Cloud Private users) Log in to your IBM Cloud Private dashboard and navigate to **Command Line Tools > Cloud Private CLI**. Download and install `bx pr command`.

## Estimated time

Completing this tutorial should take about 20-30 minutes.

## Steps

### Build the Docker image

  1. First create your web-app and create the Docker file in the same directory. _For example, check the [icp_helmchart directory in my GitHub repo](https://github.com/arprasto/icp_helmchart), which contains the Dockerfile and application-dependent contents._  
![Check for Dockerfile and app in the same directory](https://developer.ibm.com/developer/tutorials/convert-sample-web-app-to-helmchart/images/web-app_and_docker_same_dir.png)  
Here, `app.py` runs a simple Flask-based web-app with the port as `6111`.
  2. Build the Docker image and push it to your public or private Docker repository; it should be pulled without any issues. To build the Docker image, check out my [GitHub repo](https://github.com/arprasto/icp_helmchart). Then execute the command: `docker image build -t <docker_username>/<docker-image-name>:<docker-image-tag>`. In this case, I named my app `arprasto/userinfoicphelmchart:v1`.
  3. Next, push your locally built Docker image to the cloud by using `docker push <docker_username>/<docker-image-name>:<tag>`.

### Prepare the Helm chart

  1. Update the below properties in the [values.yaml](https://github.com/arprasto/icp_helmchart/blob/master/icphelmchart/values.yaml) file:

    * `image.repository: <docker_username>/<docker-image-name>`
    * `image.tag: <docker-image-tag>`
    * `service.internalPort: 6111`
    * `service.externalPort: 6111`
    * `service.nodeport: 31000` This port will be exposed to `svc` to navigate your app home page through a web browser.

**Note:** `service.internalPort` and `service.externalPort` should be similar to the port specified in `app.py`. See how they are [related and co-dependent here](https://kubernetes.io/docs/concepts/services-networking/connect-applications-service/)!

  2. Next, open the [icp_helmchart directory](https://github.com/arprasto/icp_helmchart) and run: `helm --debug install icphelmchart --dry-run`. You can check that all values appeared properly by referencing the Kubernetes document, [“Connecting Applications with Services”](https://developer.ibm.com/tutorials/convert-sample-web-app-to-helmchart/Connecting Applications with Services). After running the above command, you should see output similar to the one below:
    
    [debug] Created tunnel using local port: '52521' [debug] SERVER: "127.ø.e.1:52521" [debug] Original chart version: "" [debug] CHART PATH: Users/arpitrastogi/scrap/icp/icp_helmchart/icphelmchart NAME: full—quoll REVISION: 1 RELEASED: Mon Dec 17 19:53:41 2018 CHART: icphelmchart—0.1.0 USER-SUPPLIED VALUES: {} COMPUTED VALUES: image: pullPo1icy: Always repository: arprasto/userinfoicphelmchart tag: v2 replicaCount: 1 resources: limits: memory : 512Mi requests : memory: 128Mi service : externalPort: 6111 internalPort: 6111 name: icphelmchart nodeport: 31000 tier: frontend type: NodePort HOOKS: MANIFEST: 
    
    # Source: icphelmchart/templates/service.yaml apiVersion: v1 kind: Service metadata: name: icphelmchartsvc labels: run: icphelmchart spec: type: NodePort ports: — port: 6111 nodePort: 31000 protocol: TCP targetPort: 6111 selector: run: icphelmchart 
    
    # Source: icphelmchart/templates/deployment.yaml apiVersion: extensions/vlbetal kind: Deployment metadata : name: icphelmchart spec : replicas: 1 template: metadata: name: icphelmchart labels: run: icphelmchart spec : containers : — name: icphelmchart image: "arprasto/userinfoicphelmchart: v2" imagePuIIPolicy: Always 

### Deploy helmchart into an IBM private cluster

  1. Navigate to **Resource List > Kubernetes Clusters** and click on your newly created cluster**.
  2. You will see a tab, called **Access**:  
![Access your new cluster](https://developer.ibm.com/developer/tutorials/convert-sample-web-app-to-helmchart/images/created-cluster.png) There will be instructions on this Access page, such as downloading CLI tools and other items that you need to follow and execute.
  3. Run `ibmcloud regions` to check its API endpoints:
    
    Listing regions... Name Display name au—syd Sydney jp-tok Tokyo eu—de Frankfurt eu—gb London us-south Dallas us—east Washington DC 

* * Run `ibmcloud login -a https://api.<your_cluster_region_name>.bluemix.net`

* Run `ibmcloud cs clusters` to make sure that you have successfully connected to your private cluster. Make sure to keep note of your `<cluster-name>`.
* Open the [icp_helmchart directory](https://github.com/arprasto/icp_helmchart) and run `helm install icphelmchart`. This will install your helmchart into your cluster.
* To check the running status of your helmchart, run `kubectl get all|grep icphelmchart`.
    
    NAME READY STATUS RESTARTS AGE pod/icphelmchart-7b8dcd9685-p628p 1/1 Running 0 2m NAME TYPE CLUSTER-IP EXTERNAL-IP PORT(S) AGE service/icphelmchartsvc NodePort 172.21.222.134 <none> 6111:31000/TCP 2m service/kubernetes ClusterIP 172.21.0.1 <none> 443/TCP 2h NAME DESIRED CURRENT UP-TO-DATE AVAILABLE AGE deployment.apps/icphelmchart 1 1 1 1 2m NAME DESIRED CURRENT READY AGE replicaset.apps/icphelmchart-7b8dcd9685 1 1 1 2m 

* If your pod is not in a running state, check the root cause of it by running `kubectl --tail=1000 logs <pod-id>`. For example, in the above screenshot we can see the logs by running `kubectl --tail=1000 logs icphelmchart-7b8dcd9685-p628p`.

* Run `ibmcloud cs workers <cluster-name>` to check the public and private IP addresses of your cluster.
    
    ibmcloud cs workers <cluster-name> ID Public IP Private IP Machine Type State Status Zone Version Your-cluster-id x.x.x.x x.x.x.x free normal Ready me101 1.10.11_1536 

  1.   2. Now go to your web browser and navigate to your web-app home page: http://: **Note: If you have not changed the nodeport, than you can use `31000` as the nodeport.**

### Deploy helmchart into IBM Cloud Private through the dashboard

  1. Go to your parent directory above the helming directory. For example, in my case here’s my parent directory:  
![Parent directory helm](https://developer.ibm.com/developer/tutorials/convert-sample-web-app-to-helmchart/images/parent-dir-before-helming.png)  

  2. `cd icp_helmchart` and then `helm package icphelmchart`. This builds a `<helm-name>.tgz` file.
  3. `mv .tgz` to `helmrepo/`
  4. Before the next step, publish your GitHub repo where you want to push your helm chart. [Publish your git repository by using this guide](https://helm.sh/docs/developing_charts/#github-pages-example). In my case, the published directory is `https://arprasto.github.io/icp_helmchart/helmrepo/`. This will generate an index.yaml file inside your helmrepo/ directory.
  5. Push your above changes to GitHub.
  6. Now to add your own helm dir to IBM Cloud Private, log in to the IBM Cloud Private dashboard. Navigate to _Manage > Helm Repositories > Add Repository_. Then give a name to your directory and the published repo URL and add it.
  7. Sync your repositories.
  8. Navigate to _Catalog > helm chart_. This is where you’ll see your helm chart published.

### Deploy helm chart into IBM Cloud Private through a shell prompt

Complete the following steps to deploy your new helm chart into IBM Cloud Private through shell prompts.

  1. `bx pr init`  
![Deploy new helm chart 1](https://developer.ibm.com/developer/tutorials/convert-sample-web-app-to-helmchart/images/shell-prompt-1.png)
  2. `bx pr login`  
![Deploy new helm chart 2](https://developer.ibm.com/developer/tutorials/convert-sample-web-app-to-helmchart/images/shell-prompt-2.png)
  3. `bx pr clusters`, which shows the .  
![Deploy new helm chart 3](https://developer.ibm.com/developer/tutorials/convert-sample-web-app-to-helmchart/images/shell-prompt-3.png)
  4. `bx pr cluster-config <cluster-name>`  
![Deploy new helm chart 4](https://developer.ibm.com/developer/tutorials/convert-sample-web-app-to-helmchart/images/shell-prompt-4.png)
  5. Add your helm repository by using `helm repo add <alias-name> <published-repo-url>`  
![Deploy new helm chart 5](https://developer.ibm.com/developer/tutorials/convert-sample-web-app-to-helmchart/images/shell-prompt-5.png)
  6. Update your helm repo to sync it with your IBM Cloud Private account by using `helm repo update`.  
![Deploy new helm chart 6](https://developer.ibm.com/developer/tutorials/convert-sample-web-app-to-helmchart/images/shell-prompt-6.png)
  7. Now search to check if you can see your helm chart in the local helm repo by using `helm search <helm-chart-name>`.  
![Deploy new helm chart 7](https://developer.ibm.com/developer/tutorials/convert-sample-web-app-to-helmchart/images/shell-prompt-7.png)  
At this point you should be able to see your helmchart listed. If not, please resync or check if your changes checked into Git.
  8. You can now install your helm chart into your IBM Cloud Private cluster by using `helm install <helm-chart-name>`.

## Summary

In this tutorial, you saw how to convert your web-app to helm chart and how to deploy it in a public or private cloud. This approach is also another way to convert your conventional web app to a microservice. I encourage you to continue experimenting with Helm charts and building on [IBM Cloud for free](https://www.ibm.com/cloud/free/).

## Suggested further reading

  * [Helm 101: Labs designed to help you achieve an understanding of the application package manager](https://developer.ibm.com/tutorials/helm-101-labs/)
  * [Kubernetes at the Helm, containers in the engine room](https://developer.ibm.com/articles/cl-kubernetes-at-helm-containers-in-engine-room/)
  * [Learning Path: Kubernetes](https://developer.ibm.com/series/kubernetes-learning-path/)

Compo




#### Hint Create Charts

No hint available


#### Complete v

> Confirm Create Charts complete












#### Task aaa

----

#### Hint aaa

No hint available


#### Complete aaa

> Confirm aaa complete

#### Task aaa

----

#### Hint aaa

No hint available


#### Complete aaa

> Confirm aaa complete



#### Task aaa

----

#### Hint aaa

No hint available


#### Complete aaa

> Confirm aaa complete

