
:course_title: JTC15 Kubernetes Advanced Operators with GO

:course_desc: This course contains the Kubernetes GO Operators Labs.  

:course_max: 15

:course_auto: no

:button1_label: Task

:button2_label: Hint

:button2_delay: 9999999

:button3_label: Complete

:button3_delay: 1000




#### Task GeneralLabInformation

----



# General Lab information


## Nomenclatures

---

### Shell Commands

The commands that you are going to execute to progress the Labs will look like this:

```
   kubectl create -f redis-slave-service.yaml
	
	> Output Line 1     
	> Output Line 2
	> Output Line 3
	...
	
```


> **IMPORTANT NOTE:** The example output of a command is prefixed by ">" in order to make it more distinguishable. 
> 
> So in the above example you would only enter/copy-paste `kubectl create -f redis-slave-service.yaml` and the output from the command is "Output Line 1" to "Output Line 3" 
> 

---

### Code Examples
Code examples are presented like this:

```yaml
apiVersion: lab.ibm.com/v1beta1
kind: MyResource
metadata:
  name: example
spec:
  size: 3
  image: busybox
```

This is only for illustration and is not being actively used in the Labs.




#### Hint GeneralLabInformation

No hint available


#### Complete GeneralLabInformation

> Confirm GeneralLabInformation complete
> 

----

----

#### Task LabsIntroduction

# Kubernetes Operators

In this Lab you will learn about Kubernetes GO Operators which are more powerful but also more complicated to implement than Ansible based Operators.

The Operator Framework is an open source toolkit to manage Kubernetes native applications, called Operators, in an effective, automated, and scalable way.

* Operators are a **design pattern** made public in a 2016 CoreOS blog post.

*  The goal of an Operator is to **put operational knowledge into software**. 
	Previously this knowledge only resided in the minds of administrators, various combinations of shell scripts or automation software like Ansible. It was outside of your Kubernetes cluster and hard to integrate. 

* Operators implement and **automate common Day-1** (installation, configuration, etc) **and Day-2** (re-configuration, update, backup, failover, restore, etc.) **activities** in a piece of software running inside your Kubernetes cluster, by integrating natively with Kubernetes concepts and APIs. 

![](./images/op1.png)

Operators extend Kubernetes by allowing you to define a **Custom Controller** to watch your application and perform custom tasks based on its state (a perfect fit to automate maintenance of the stateful application we described above).

The application you want to watch is defined in Kubernetes as a new object: a **Custom Resource** (CR) that has its own yaml spec and object type (in K8s, a kind) that is understood by the API server. 

That way, you can define any specific criteria in the custom spec to watch out for, and reconcile the instance when it doesn’t match the spec. The way an operator’s controller reconciles against a spec is very similar to native Kubernetes’ controllers, though it is using mostly custom components. 


### Elements of an Operator implementation

* A **Custom Resource Definition** (CRD) spec that defines the format of the Custom Resource
* A **Custom Controller** to watch our application
	* 	Custom code within the new controller that dictates how to reconcile 	our CR against the spec
* An **Operator** to manage the Custom Controller
* A **Custom Resource** (CR) spec that defines the application we want to watch
* A **deployment** for the Operator and Custom Resource



#### Hint LabsIntroduction

No hint available


#### Complete LabsIntroduction

> Confirm LabsIntroduction complete
> 

----



#### Task Get Source Code

----

# Download the Workshop Source Code

Repo [training](https://github.com/niklaushirt/training) has the source code for this Lab.

```
git clone https://github.com/niklaushirt/training.git
```



#### Hint Get Source Code

No hint available


#### Complete Get Source Code

> Confirm Get Source Code complete







#### Task Lab1_CreateLabOperatorProject

----

# Lab 1. Create and deploy your first Kubernetes Operator

The Operator SDK makes it easier to build Kubernetes native applications.



## Lab 1 - Create the Lab Operator Project

In this part of the lab we will create a demo operator and deploy it to our minikube instance.



1. Create  the `lab-operator` Project

	```shell
  cd ~/go/src
   	
  export GOPATH=$HOME/go
	export GO111MODULE=on

	
	operator-sdk new lab-operator 
	
	> INFO[0000] Creating new Go operator 'lab-operator'.     
	> INFO[0000] Created go.mod                               
	> INFO[0000] Created tools.go                             
	> INFO[0000] Created cmd/manager/main.go                  
	> INFO[0000] Created build/Dockerfile                     
	> INFO[0000] Created build/bin/entrypoint                 
	> INFO[0000] Created build/bin/user_setup                 
	> INFO[0000] Created deploy/service_account.yaml          
	> INFO[0000] Created deploy/role.yaml                     
	> INFO[0000] Created deploy/role_binding.yaml             
	> INFO[0000] Created deploy/operator.yaml                 
	> INFO[0000] Created pkg/apis/apis.go    
	...
	
	```


2. Change to the `lab-operator` directory
		
	```
	cd ~/go/src/lab-operator 
		
	```


#### Hint Lab1_CreateLabOperatorProject

No hint available


#### Complete Lab1_CreateLabOperatorProject

> Confirm Lab1_CreateLabOperatorProject complete













#### Task Lab1_CreateLabOperatorAPI

----



## Lab 1 - Create the Lab Operator API

Add a new Custom Resource Definition (CRD) API called Memcached, with APIVersion `lab.ibm.com/v1beta1` and Kind `MyLabDemo`.

1. Create the CRD API

	```
   	cd $GOPATH/src/lab-operator
  	
	operator-sdk add api --api-version=lab.ibm.com/v1beta1 --kind=MyLabDemo

	> INFO[0000] Generating api version lab.ibm.com/v1beta1 for kind MyLabDemo. 
	> INFO[0000] Created pkg/apis/lab/group.go                
	> INFO[0007] Created pkg/apis/lab/v1beta1/mylabdemo_types.go 
	> INFO[0007] Created pkg/apis/addtoscheme_lab_v1beta1.go  
	> INFO[0007] Created pkg/apis/lab/v1beta1/register.go     
	> INFO[0007] Created pkg/apis/lab/v1beta1/doc.go          
	> INFO[0007] Created deploy/crds/lab_v1beta1_mylabdemo_cr.yaml 
	> INFO[0013] Created deploy/crds/lab_v1beta1_mylabdemo_crd.yaml 
	> INFO[0013] Running deepcopy code-generation for Custom Resource group versions: [lab:[v1beta1], ] 
	> INFO[0019] Code-generation complete.                    
	> INFO[0019] Running OpenAPI code-generation for Custom Resource group versions: [lab:[v1beta1], ] 
	> INFO[0031] Created deploy/crds/lab_v1beta1_mylabdemo_crd.yaml 
	> INFO[0031] Code-generation complete.                    
	> INFO[0031] API generation complete.          
	```



2. Define an additional parameter `image` to the Custom Resource Definition
		
	```
	gedit ~/go/src/lab-operator/pkg/apis/lab/v1beta1/mylabdemo_types.go

	```

	Add `Image`  as a parameter to the `MyLabDemoSpec struct` and save
	
	```json
	type MyLabDemoSpec struct {
	
	...
	
	// Image is the Docker image to run for the daemon
   Image string `json:"image"`
}
	```


3. Add a `image` field to the Custom Resource
		
	```
	gedit ~/go/src/lab-operator/deploy/crds/lab_v1beta1_mylabdemo_cr.yaml

	```

	Add `image: busybox` at the end of the file and save
	
	```yaml
	apiVersion: lab.ibm.com/v1beta1
	kind: MyLabDemo
	metadata:
	  name: example-mylabdemo
	spec:
	  # Add fields here
	  size: 3
	  image: busybox
	```






4. Generate the API		

	```
	operator-sdk generate k8s
	
	> INFO[0000] Running deepcopy code-generation for Custom Resource group versions: [lab:[v1beta1], ] 
	> INFO[0005] Code-generation complete.   
	```
	
	```
   	operator-sdk generate openapi
   	
   	> INFO[0000] Running OpenAPI code-generation for Custom Resource group versions: [lab:[v1beta1], ] 
	> INFO[0011] Created deploy/crds/lab_v1beta1_mylabdemo_crd.yaml 
	> INFO[0011] Code-generation complete.  
	```


## We have now finished to set up the API nad CRDs

#### Hint Lab1_CreateLabOperatorAPI

No hint available


#### Complete Lab1_CreateLabOperatorAPI

> Confirm Lab1_CreateLabOperatorAPI complete






#### Task Lab1_CreateLabOperatorController

----





## Lab 1 - Create the Lab Operator Controller



1. Create  the `lab-operator` Controller
	
	```
	operator-sdk add controller --api-version=lab.ibm.com/v1beta1 --kind=MyLabDemo
	
	> INFO[0000] Generating controller version lab.ibm.com/v1beta1 for kind MyLabDemo. 
	> INFO[0000] Created pkg/controller/mylabdemo/mylabdemo_controller.go 
	> INFO[0000] Created pkg/controller/add_mylabdemo.go      
	> INFO[0000] Controller generation complete. 

	```
	
2. Edit the `lab-operator` Controller		


	```
	gedit ~/go/src/lab-operator/pkg/controller/mylabdemo/mylabdemo_controller.go


	```


2. Scroll to line 148 and replace `Image:   "busybox"`, with `Image:   cr.Spec.Image`,
   		
	```
	cd lab-operator 

	```
	
	> 	This will ensure that the Pod will be created with the Image information defined in the Custom Resource (CR) definition.
	
	---

	> 	**IMPORTANT**: Make sure that you don't delete the comma (,) at the end of the line.
	
2. Now let's build the Operator container 
  
  
	```	
	operator-sdk build localhost:5000/lab-operator:v0.0.1
	
	> INFO[0033] Building OCI image lab-operator:v0.0.1       
	> Sending build context to Docker daemon  42.22MB
	> Step 1/7 : FROM registry.access.redhat.com/ubi7/ubi-minimal:latest
	> latest: Pulling from ubi7/ubi-minimal
	...
	> Successfully built 84824c0c5876
	> Successfully tagged lab-operator:v0.0.1
	> INFO[0048] Operator build complete.  
	```
	
2. And push the Operator container to the local registry 
  
   First execute this in order to be able to access the private registry:
   
   	```
   kubectl port-forward --namespace kube-system registry-5ng6b 5000:5000 &
	```
   	
   	And then push the image:
   		
	```
	docker push localhost:5000/lab-operator:v0.0.1
	
```
  
```

3. Modify the image that we have pushed to the registry in the Operator deployment 
  
  
	```		
	sed -i 's|REPLACE_IMAGE|localhost:5000/lab-operator:v0.0.1|g' deploy/operator.yaml
	```
	
> 	
> 	If you get an error:
> 		`The push refers to repository [localhost:5000/demo-operator-frontend]
> 		Get http://localhost:5000/v2/: dial tcp 127.0.0.1:5000: connect: connection refused`
> Re-run this in order to be able to access the private registry:
>    
>   ```
>   kubectl port-forward --namespace kube-system registry-5ng6b 5000:5000 &
> ```
>  


#### Hint Lab1_CreateLabOperatorController

No hint available


#### Complete Lab1_CreateLabOperatorController

> Confirm Lab1_CreateLabOperatorController complete








#### Task Lab1_DeployLabOperator

----





## Lab 1 - Deploy the Lab Operator



1. Deploy  the `lab-operator` Custom Resource Definition
	
	```
	kubectl create -f ~/go/src/lab-operator/deploy/crds/lab_v1beta1_mylabdemo_crd.yaml 
	
	> customresourcedefinition.apiextensions.k8s.io/mylabdemos.lab.ibm.com created

	
	```

2. Create  the `lab-operator` Service Account
	
	```
	kubectl create -f ~/go/src/lab-operator/deploy/service_account.yaml
	kubectl create -f ~/go/src/lab-operator/deploy/role.yaml
	kubectl create -f ~/go/src/lab-operator/deploy/role_binding.yaml
	
	> serviceaccount/lab-operator created
	> role.rbac.authorization.k8s.io/lab-operator created
	> rolebinding.rbac.authorization.k8s.io/lab-operator created

	```

3. Create  the `lab-operator` Operator
	
	```
	kubectl create -f ~/go/src/lab-operator/deploy/operator.yaml
	
	> deployment.apps/lab-operator created

	```
	
	Check and wait for the Operator running
	
	```
	kubectl get pods
	
	> NAME                            READY   STATUS    RESTARTS   AGE
	> lab-operator-6cf66c6d4f-24pqm   1/1     Running   0          43m
	> training@training:~/go/src/lab-operator

	```
	


1. Deploy  the `lab-operator` Custom Resource
	
	
	
	
	
	```
	kubectl create -f ~/go/src/lab-operator/deploy/crds/lab_v1beta1_mylabdemo_cr.yaml
	
	> MyLabDemo.lab.ibm.com/example-MyLabDemo created
	```
	
	
	```yaml
	apiVersion: lab.ibm.com/v1beta1
	kind: MyLabDemo
	metadata:
	  name: example-mylabdemo
	spec:
	  # Add fields here
	  size: 3
	  image: busybox
	```


	```
	kubectl get pods
	
	> NAME                            READY   STATUS    RESTARTS   AGE
	> example-mylabdemo-pod           1/1     Running   0          43m
	> lab-operator-6cf66c6d4f-24pqm   1/1     Running   0          43m
	> training@training:~/go/src/lab-operator


​	

	```


​	
# Congratulations!!! This concludes Lab 1 on Kubernetes Operators


#### Hint Lab1_DeployLabOperator

No hint available


#### Complete Lab1_DeployLabOperator

> Confirm Lab1_DeployLabOperator complete







#### Task Lab2_CreateFrontendOperator

----

# Lab 2. Create and deploy an advanced Kubernetes Operator


## Lab 2. Build the frontend Operator

The Operator SDK makes it easier to build Kubernetes native applications.

1. Prepare the code and the environment

	```
	export GOPATH=$HOME/go
	export GO111MODULE=on
	export PATH=$GOPATH/bin:$GOROOT/bin:$PATH
	export GOROOT=/usr/local/go
	
	cp -r ~/training/operators/demo-operator-frontend/ ~/go/src/
	cd ~/go/src/demo-operator-frontend
	```
	
1. Build the operator image

	```
	operator-sdk build localhost:5000/demo-operator-frontend:v0.0.1
	
	> INFO[0005] Building OCI image localhost:5000/demo-operator-frontend:v0.0.1 
	> Sending build context to Docker daemon  42.23MB
	> Step 1/7 : FROM registry.access.redhat.com/ubi7/ubi-minimal:latest
	>  ---> 23629269a21d
	...
	> Successfully tagged localhost:5000/demo-operator:v0.0.1
	> INFO[0009] Operator build complete. 
	```
	
1. Push the operator image to the local Docker registry

	```
	docker push localhost:5000/demo-operator-frontend:v0.0.1
	
	> The push refers to repository [localhost:5000/demo-operator-fontend]
	> v0.0.1: digest: sha256:78d2112a40dd083afd148902caf2e63e0507a179d8b645d14b7ae16c8896aef6 size: 1363
	...

	```
> 	
> 	If you get an error:
> 		`The push refers to repository [localhost:5000/demo-operator-frontend]
> 		Get http://localhost:5000/v2/: dial tcp 127.0.0.1:5000: connect: connection refused`
> execute this in order to be able to access the private registry:
>    
>   ```
>   kubectl port-forward --namespace kube-system registry-5ng6b 5000:5000 &
> ```
>  


#### Hint Lab2_CreateFrontendOperator

No hint available


#### Complete Lab2_CreateFrontendOperator

> Confirm Lab2_CreateFrontendOperator complete



#### Task Lab2_DeployFrontendOperator

----

## Lab 2. Deploy the frontend Operator

Now let's deploy the Frontend Operator.



1. Deploy  the `demo-operator-frontend` Custom Resource Definition
	
	```
	kubectl create -f ~/go/src/lab-operator/deploy/crds/demo_v1beta1_mydemofrontend_crd.yaml 
	```

2. Create  the `demo-operator-frontend` Service Account
	
	```
	kubectl create -f ~/go/src/lab-operator/deploy/service_account.yaml
	kubectl create -f ~/go/src/lab-operator/deploy/role.yaml
	kubectl create -f ~/go/src/lab-operator/deploy/role_binding.yaml

	```

3. Create  the `demo-operator-frontend` Operator
	
	```
	kubectl create -f ~/go/src/lab-operator/deploy/operator.yaml
	```
	
	Check and wait for the Operator running
	
	```
	kubectl get pods
	
	> NAME                                                 READY   STATUS    RESTARTS   AGE
	> demo-operator-frontend-8c79d574d-jp64d               1/1     Running   0          70s
	
	```
	
1. Deploy  the `demo-operator-frontend` Custom Resource
	
	```
	kubectl create -f ~/go/src/lab-operator/deploy/crds/demo_v1beta1_mydemofrontend_cr.yaml
	```
	
	
	```yaml
	apiVersion: demo.ibm.com/v1beta1
	kind: MyDemoFrontend
	metadata:
	  name: example-mydemofrontend
	spec:
	  # Add fields here
	  size: 3
	  label: test
	  image: niklaushirt/k8sdemo:1.0.0
	  backend: "http://example-mydemobackend-service.default.svc:3000/api"
	```


	```
	kubectl get pods
	
	> NAME                                                 READY   STATUS    RESTARTS   AGE
	> demo-operator-frontend-8c79d574d-jp64d               1/1     Running   0          70s
	> example-mydemofrontend-deployment-7d9bc9b48d-sbzjm   1/1     Running   0          24s


​	

	```

1. Get the Port for the Deployment.
   Identify the port number (in the 31000-32999 range) in the `example-mydemofrontend-service`. In this example it is 32007.
	
	```
	kubectl get services
	
	> NAME                             TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)             AGE
	> example-mydemofrontend-service   NodePort    10.102.10.57     <none>        3000:32007/TCP      101s
	```
	
1. Open the Web Application by typing localhost:32007 in the browser address bar (replacing 32007 with the value determined in the previous step.



#### Hint Lab2_DeployFrontendOperator

No hint available


#### Complete Lab2_DeployFrontendOperator

> Confirm Lab2_DeployFrontendOperator complete





#### Task Lab2_CreateFrontendOperator

----


## Lab 2. Build the backend Operator



1. Prepare the code and the environment

	```
	cd
	
	export GOPATH=$HOME/go
	export GO111MODULE=on
	export PATH=$GOPATH/bin:$GOROOT/bin:$PATH
	export GOROOT=/usr/local/go
	
	cp -r ~/training/operators/demo-operator-backend/ ~/go/src/
	cd ~/go/src/demo-operator-backend
	```
	
1. Build the operator image

	```
	operator-sdk build localhost:5000/demo-operator-backend:v0.0.1
	
	> INFO[0005] Building OCI image localhost:5000/demo-operator-backend:v0.0.1 
	> Sending build context to Docker daemon  42.23MB
	> Step 1/7 : FROM registry.access.redhat.com/ubi7/ubi-minimal:latest
	>  ---> 23629269a21d
	...
	> Successfully tagged localhost:5000/demo-backend:v0.0.1
	> INFO[0009] Operator build complete. 
	```
	
1. Push the operator image to the local Docker registry

	```
	docker push localhost:5000/demo-operator-backend:v0.0.1
	
	> The push refers to repository [localhost:5000/demo-operator-backend]
	> v0.0.1: digest: sha256:78d2112a40dd083afd148902caf2e63e0507a179d8b645d14b7ae16c8896aef6 size: 1363
	...

	```

> 	
> 	If you get an error, execute this in order to be able to access the private registry:
>    
>   ```
>   kubectl port-forward --namespace kube-system registry-5ng6b 5000:5000 &
> ```
>  

#### Hint Lab2_CreateFrontendOperator

No hint available


#### Complete Lab2_CreateFrontendOperator

> Confirm Lab2_CreateFrontendOperator complete



#### Task Lab2_DeployFrontendOperator

----

## Lab 2. Deploy the backend Operator

Now let's deploy the backend Operator.



1. Deploy  the `demo-operator-backend ` Custom Resource Definition
	
	```
	kubectl create -f ~/go/src/lab-operator/deploy/crds/demo_v1beta1_mydemobackend_crd.yaml 
	```

2. Create  the `demo-operator-backend ` Service Account
	
	```
	kubectl create -f ~/go/src/lab-operator/deploy/service_account.yaml
	kubectl create -f ~/go/src/lab-operator/deploy/role.yaml
	kubectl create -f ~/go/src/lab-operator/deploy/role_binding.yaml

	```

3. Create  the `demo-operator-backend ` Operator
	
	```
	kubectl create -f ~/go/src/lab-operator/deploy/operator.yaml
	```
	
	Check and wait for the Operator running
	
	```
	kubectl get pods
	
	> NAME                                                 READY   STATUS    RESTARTS   AGE
	> demo-operator-backend-8c79d574d-jp64d                1/1     Running   0          70s
	
	```
	
1. Deploy  the `demo-operator-backend ` Custom Resource
	
	```
	kubectl create -f ~/go/src/lab-operator/deploy/crds/demo_v1beta1_mydemobackend_cr.yaml
	```
	
	
	```yaml
	apiVersion: demo.ibm.com/v1beta1
	kind: MyDemoBackend
	metadata:
	  name: example-mydemobackend
	spec:
	  # Add fields here
	  size: 3
	  label: backend
	  image: niklaushirt/k8sdemo-backend:1.0.0
	  message: "Hello from the Operator Lab..."
	```


	```
	kubectl get pods
	
	> NAME                                                 READY   STATUS    RESTARTS   AGE
	> demo-operator-backend-8c79d574d-jp64d                1/1     Running   0          70s
	> example-mydemobackend-deployment-7d9bc9b48d-sbzjm    1/1     Running   0          24s


​	

	```

1. Refresh the Web Application to check that API Status is OK.



#### Hint Lab2_DeployFrontendOperator

No hint available


#### Complete Lab2_DeployFrontendOperator

> Confirm Lab2_DeployFrontendOperator complete







#### Task Lab2_UpdateFrontendOperator

----

## Lab 2. Update the frontend Operator

Now let's update the Frontend Operator.



1. Modify the Custom Resource
	
	```
	cd ~/go/src/demo-operator-frontend
	gedit ~/go/src/lab-operator/deploy/crds/demo_v1beta1_mydemofrontend_cr.yaml 
	```

2. Change the image version to 1.0.1
	
	```yaml
	apiVersion: demo.ibm.com/v1beta1
	kind: MyDemoFrontend
	metadata:
	  name: example-mydemofrontend
	spec:
	  # Add fields here
	  size: 3
	  label: test
	  image: niklaushirt/k8sdemo:1.0.1
	  backend: "http://example-mydemobackend-service.default.svc:3000/api"
	```

3. Update the Custom Resource
	
	```
	kubectl apply -f ~/go/src/lab-operator/deploy/crds/demo_v1beta1_mydemofrontend_cr.yaml 
	```
	
	Check and wait for the Operator running as the Operator picks up on the change and deploys the new version of the Web Application.
	

	
1. Refresh the Web Application to check that it shows the new version and that the backgroung has changed.




#### Hint Lab2_UpdateFrontendOperator

No hint available


#### Complete Lab2_UpdateFrontendOperator

> Confirm Lab2_UpdateFrontendOperator complete




#### Task Lab2_CleanUpAdvancedOperator

----

## Lab 2. Clean-up the resources

To finish up, let's delete all resources.


​	
```
cd ~/go/src
	

kubectl delete -f demo-operator-backend/deploy/crds/demo_v1beta1_mydemobackend_crd.yaml
kubectl delete -f demo-operator-backend/deploy/service_account.yaml
kubectl delete -f demo-operator-backend/deploy/role.yaml
kubectl delete -f demo-operator-backend/deploy/role_binding.yaml
kubectl delete -f demo-operator-backend/deploy/operator.yaml
	
	
kubectl delete -f demo-operator-frontend/deploy/crds/demo_v1beta1_mydemofrontend_crd.yaml 
kubectl delete -f demo-operator-frontend/deploy/service_account.yaml
kubectl delete -f demo-operator-frontend/deploy/role.yaml
kubectl delete -f demo-operator-frontend/deploy/role_binding.yaml
kubectl delete -f demo-operator-frontend/deploy/operator.yaml


```

​	



# Congratulations!!! This concludes Lab 2 on advanced Kubernetes Operators

#### Hint Lab2_CleanUpAdvancedOperator

No hint available


#### Complete Lab2_CleanUpAdvancedOperator

> Confirm Lab2_CleanUpAdvancedOperator complete









#### Task Lab3_ModifyController

----

# Lab 3. Modify Operator to watch for Updates


## Lab 3. Modify the controler

Let's modify the Custom Controller so that it picks up also modifications/updates of the deployed Custom Resource (CR).



1. Edit the `lab-operator` Controller		


	```
	gedit ~/go/src/lab-operator/pkg/controller/mylabdemo/mylabdemo_controller.go


	```


2. Scroll to line 127 and add the following content:
   		
	```json
	// Check if the Image in CR has changed and update accordingly
	image:=instance.Spec.Image
	if  found.Spec.Containers[0].Image != image {
		found.Spec.Containers[0].Image = image
		err = r.client.Update(context.TODO(), found)
		if err != nil {
			reqLogger.Error(err, "Failed to update Pod for Image.", "Pod.Namespace", found.Namespace, "Pod.Name", found.Name)
			return reconcile.Result{}, err
		}
		reqLogger.Info("Updating Pod for Image.", "Pod.Namespace", found.Namespace, "Pod.Name", found.Name)

	}
	```





2. Now let's rebuild the Operator container 
  
  
	```	
	operator-sdk build localhost:5000/lab-operator:v0.0.1
	```
	
2. And push the new version of the Operator container to the local registry 
     		
	```		
	docker push localhost:5000/lab-operator:v0.0.1
	```

3. Modify the image that we have pushed to the registry in the Operator deployment 
  
  
	```		
	kubectl delete -f demo-operator-backend/deploy/operator.yaml
	kubectl create -f demo-operator-backend/deploy/operator.yaml
	```
	
3. Modify the image that we have pushed to the registry in the Operator deployment 
  
  
	```		
	gedit ~/go/src/lab-operator/deploy/crds/lab_v1beta1_mylabdemo_cr.yaml
	```

2. Scroll to line 8 and change the image from `busybox` to `nginx`
  
6. Save and apply
	
	```
	kubectl apply -f ~/go/src/lab-operator/deploy/crds/lab_v1beta1_mylabdemo_cr.yaml

	```
	
	​		
	
6. Check that the image running in the container has changed to nginx that we have defined in the CR.
	
	```
	kubectl describe pods example-mylabdemo-pod | head -n 20
	```
	
	```json
	Name:               example-mylabdemo-pod
	Namespace:          default
	Priority:           0
	PriorityClassName:  <none>
	Node:               minikube/10.0.2.15
	Start Time:         Wed, 09 Oct 2019 17:22:10 +0200
	Labels:             app=example-mylabdemo
	Annotations:        <none>
	Status:             Running
	IP:                 10.15.81.86
	Controlled By:      MyLabDemo/example-mylabdemo
	Containers:
	  busybox:
	    Container ID:  docker://764359c02b9fa23f5ff8eb4016fc133f1795ae3e073ceec7df4d6b1dc8ccf066
	    Image:         nginx
	    Image ID:      docker-pullable://nginx@sha256:aeded0f2a861747f43a01cf1018cf9efe2bdd02afd57d2b11fcc7fcadc16ccd1
	    Port:          <none>
	    Host Port:     <none>
	    Command:
	      sleep
	...
	```
	
6. Check the Operator log for the Update
	
	Get the operator pod name
	
	```
	kubectl get pods
	
	> NAME                            READY   STATUS    RESTARTS   AGE
	> example-mylabdemo-pod           1/1     Running   1          22m
	> lab-operator-6cf66c6d4f-wd2gh   1/1     Running   0          11m

	```

	Use the operator pod name to get the logs
	
	```
	kubectl logs lab-operator-6cf66c6d4f-wd2gh | grep Updating
	
	> {"level":"info","ts":1570635383.6417327,"logger":"controller_mylabdemo","msg":"Updating Pod for Image.","Request.Namespace":"default","Request.Name":"example-mylabdemo","Pod.Namespace":"default","Pod.Name":"example-mylabdemo-pod"}
	
	```


#### Hint Lab3_ModifyController

No hint available


#### Complete Lab3_ModifyController

> Confirm Lab3_ModifyController complete





#### Task Lab3_CleanUpLabOperator

----





## Lab 3 - Clean-up the Lab



1. Delete the `lab-operator` Resources
	
	```
	
	kubectl delete -f ~/go/src/lab-operator/deploy/crds/lab_v1beta1_mylabdemo_crd.yaml
	kubectl delete -f ~/go/src/lab-operator/deploy/service_account.yaml
	kubectl delete -f ~/go/src/lab-operator/deploy/role.yaml
	kubectl delete -f ~/go/src/lab-operator/deploy/role_binding.yaml
	kubectl delete -f ~/go/src/lab-operator/deploy/operator.yaml
	kubectl delete -f ~/go/src/lab-operator/deploy/crds/lab_v1beta1_mylabdemo_cr.yaml
	
	
	```


# Congratulations!!! This concludes Lab 3 on modifying Kubernetes Operators and Controllers

#### Hint Lab3_CleanUpLabOperator

No hint available

#### Complete Lab3_CleanUpLabOperator

> Confirm Lab3_CleanUpLabOperator complete



