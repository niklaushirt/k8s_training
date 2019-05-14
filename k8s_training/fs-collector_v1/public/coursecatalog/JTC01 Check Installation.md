
:course_title: JTC01 Check Installation

:course_desc: This course walks you through the checks for the Labs for the Journey to Cloud.  

:course_max: 3


:course_auto: no

:button1_label: Task

:button2_label: Hint

:button2_delay: 9999999

:button3_label: Complete

:button3_delay: 300





#### Task CheckLabPrerequisitesMinikube

In this initial part we will verify that the Lab prerequisites have been installed.


# 1. Check Minikube
## Make sure minikube is running 


* Verify that minikube is running
	If not please complete KUB99 Lab Setup

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




#### Hint CheckLabPrerequisitesMinikube

No hint available


#### Complete CheckLabPrerequisitesMinikube

> Confirm CheckLabPrerequisitesMinikube complete


#### Task CheckLabPrerequisitesKubectl

# 2. Check kubectl 

type the following command :

`kubectl version --short`

And you should get version for your client :

```
$ kubectl version --short
Client Version: v1.14.1
Server Version: v1.14.1
```

If minikube is not running yet you will get the following, which is **perfectly normal** in this case.

```
$ kubectl version --short
Client Version: v1.14.1
error: You must be logged in to the server (the server has asked for the client to provide credentials)
```







#### Hint CheckLabPrerequisitesKubectl

No hint available


#### Complete CheckLabPrerequisitesKubectl

> Confirm CheckLabPrerequisitesKubectl complete


#### Task CheckLabPrerequisitesGit


# 3. Check git 

type the following command :

`git version `

And you should get something similar :

```
$ git version                                                                                                                         
git version 2.18.0
```




#### Hint CheckLabPrerequisitesGit

No hint available


#### Complete CheckLabPrerequisitesGit

> Confirm CheckLabPrerequisites complete


