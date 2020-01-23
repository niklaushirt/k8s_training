
:course_title: JTC14 Kubernetes Ansible Operators Labs

:course_desc: This course contains the Kubernetes Ansible Operators Labs.  

:course_max: 9

:course_auto: no

:button1_label: Task

:button2_label: Hint

:button2_delay: 9999999

:button3_label: Complete

:button3_delay: 1000



:infotab: <h1>Prerequisites for the Lab</h1>
:infotab: <ul>
:infotab: <li><p>Internet Access</p>
:infotab: </li>
:infotab: <li><p>PC with at least:</p>
:infotab: <ul>
:infotab: <li>4 Core CPU</li>
:infotab: <li>16GB of RAM</li>
:infotab: <li>30GB of free Disk Space</li>
:infotab: 
:infotab: </ul>
:infotab: </li>
:infotab: 
:infotab: </ul>
:infotab: <h1>Tips and Tricks for getting around in the labs</h1>
:infotab: <h2>Login to the VM</h2>
:infotab: <pre><code>The userid is      training
:infotab: <BR>the password is    passw0rd
:infotab: </code></pre>
:infotab: <p>&nbsp;</p>
:infotab: <hr />
:infotab: <p>&nbsp;</p>
:infotab: <h2>Mac Tips</h2>
:infotab: <h3>Opening Terminal</h3>
:infotab: <p>In order to rapidly open the terminal application, hit CMD - SPACE and type terminal.</p>
:infotab: <p><img src="./images/openterminal.png" referrerpolicy="no-referrer" alt="terminal"></p>
:infotab: <hr />
:infotab: <p>&nbsp;</p>
:infotab: <h2>Minikube Tips</h2>
:infotab: <p>You can open a deployed Kubernetes application by typing:</p>
:infotab: <pre><code>minikube service &lt;my-service-name&gt;
:infotab: </code></pre>
:infotab: <p>&nbsp;</p>
:infotab: <hr />
:infotab: <p>&nbsp;</p>
:infotab: <h2>Kubernetes Tips</h2>
:infotab: <h3>Pod Logs</h3>
:infotab: <p>You can look at the logs of any of the pods running under your deployments as follows</p>
:infotab: <pre><code class='language-console' lang='console'>$<$ kubectl logs &lt;pod-name&gt; &lt;container-name&gt;
:infotab: </code></pre>
:infotab: <p>This subcommand operates like <code>tail</code>. Including the <code>-f</code> flag will
:infotab: continue to stream the logs live once the current time is reached.</p>
:infotab: <h3>kubectl edit and vi</h3>
:infotab: <p>By default, on many Linux and macOS systems, you will be dropped into the editor <code>vi</code>.
:infotab: If you end up in vi you can quit by typing <code>ESC :q!</code></p>
:infotab: <p>IF you prefer using nano as an editor, execute </p>
:infotab: <pre><code>export EDITOR=nano
:infotab: </code></pre>
:infotab: <p>On Windows, a copy of <code>notepad.exe</code> will be opened with the contents of the file.</p>
:infotab: <h3>nano basic commands</h3>
:infotab: <pre><code>Ctrl-O		To save your work (WriteOut)
:infotab: <BR>Ctrl-X		To exit nano
:infotab: <BR>Ctrl-W		To search for text in a document
:infotab: <BR>Ctrl-K		To cut a line of text
:infotab: </code></pre>
:infotab: <p>&nbsp;</p>
:infotab: <h3>busybox pod</h3>
:infotab: <p>For debugging live, this command frequently helps me:</p>
:infotab: <pre><code class='language-console' lang='console'>kubectl run bb --image busybox --restart=Never -it --rm
:infotab: </code></pre>
:infotab: <p>In the busybox image is a basic shell that contains useful utilities.</p>
:infotab: <p>Utils I often use are <code>nslookup</code> and <code>wget</code>. </p>
:infotab: <p><code>nslookup</code> is useful for testing DNS resolution in a pod.</p>
:infotab: <p><code>wget</code> is useful for trying to do network requests.</p>
:infotab: <h3>Service Endpoints</h3>
:infotab: <p>Endpoint resource can be used to see all the service endpoints.</p>
:infotab: <pre><code class='language-console' lang='console'>$ kubectl get endpoints &lt;service&gt;
:infotab: </code></pre>
:infotab: <h3>ImagePullPolicy</h3>
:infotab: <p>By default Kubernetes will only pull the image on first use. This can
:infotab: be confusing during development when you expect changes to show up.</p>
:infotab: <p>You should be aware of the three <code>ImagePullPolicy</code>:</p>
:infotab: <ul>
:infotab: <li>IfNotPresent - the default, only request the image if not present.</li>
:infotab: <li>Always - always request the image.</li>
:infotab: <li>Never</li>
:infotab: 
:infotab: </ul>
:infotab: <p>More details on image management may be <a href='https://kubernetes.io/docs/concepts/containers/images/'>found here</a>.</p>
:infotab: 




#### Task Lab0_LabInformation

----



# Lab0 - Lab information


The Operator Framework is an open source toolkit to manage Kubernetes native applications, called Operators, in an effective, automated, and scalable way.

In this Lab you will learn about Kubernetes Operator basics and create your first Ansible based Operator.


## Lab sources

All the source code for the lab is available here:

https://github.com/niklaushirt/training




##  Lab overview

Lab 1: Provides a hands-on for creating a Ansible based Operator.

* Creating the Operator Project
* Creating the Operator API
* Creating the Operator Controller
* Build and deploy the Operator
* Create and deploy the Custom Resource
* Update the Custom Resource

---




#### Hint Lab0_LabInformation

No hint available


#### Complete Lab0_LabInformation

Confirm Lab0_LabInformation complete

----







#### Task Lab0_LabSemantics

----



# Lab0 - Lab semantics


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

# THIS IS AN EXAMPLE - DO NOT EXECUTE THIS!

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




#### Hint Lab0_LabSemantics

No hint available


#### Complete Lab0_LabSemantics

Confirm Lab0_LabSemantics complete









#### Task Lab0_Prepare

---

# Lab 0 - Prepare the Lab environment

Before starting the Labs, let's make sure that we have the latest source code from the GitHub repository:

https://github.com/niklaushirt/training



1. Open a Terminal window by clicking on the Termnial icon in the left sidebar - we will use this extensively later as well





2. Execute the following commands to pull the latest example code from my GitHub repository

   

```
cd training/
gitrefresh 

```





#### Hint Lab0_Prepare

No hint available


#### Complete Lab0_Prepare

Confirm Lab0_Prepare complete

----



----

----

#### Task Lab1_OperatorsIntroduction

# Kubernetes Operators

In this Lab you will learn about Kubernetes Operator basics and create your first Ansible based Operator.

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



#### Hint Lab1_OperatorsIntroduction

No hint available


#### Complete Lab1_OperatorsIntroduction

Confirm Lab1_OperatorsIntroduction complete


----






#### Task Lab2_CreateLabOperatorProject

----

# Lab 2. Create and deploy your first Kubernetes Ansible Operator

The Operator SDK makes it easier to build Kubernetes native applications.



## Lab 2 - Create the Lab Operator Project

In this part of the lab we will create a demo Ansible operator and deploy it to our minikube instance.

1. Create the `ansible-operator-frontend` directory
		
	```
	cd
	mkdir ansible-operator
	cd ~/ansible-operator 
		
	```


2. Create  the `ansible-operator-frontend` Project

	```shell
	operator-sdk new ansible-operator-frontend --type=ansible --api-version=ansiblenlab.ibm.com/v1beta1 --kind=MyAnsibleLabDemo 
	
	> INFO[0000] Creating new Ansible operator 'ansible-operator-frontend'. 
	> INFO[0000] Created deploy/service_account.yaml          
	> INFO[0000] Created deploy/role.yaml                     
	> INFO[0000] Created deploy/role_binding.yaml             
	> INFO[0000] Created deploy/crds/lab_v1beta1_MyAnsibleLabDemo_crd.yaml       
	...
	
	```


3. Change to the `ansible-operator-frontend` directory
		
	```
	cd ~/ansible-operator/ansible-operator-frontend
		
	```


#### Hint Lab2_CreateLabOperatorProject

No hint available


#### Complete Lab2_CreateLabOperatorProject

Confirm Lab2_CreateLabOperatorProject complete













#### Task Lab2_CreateLabOperatorAPI

----



## Lab 2 - Create the Lab Operator API

With the above, the API has already been created (unlike for GO operators) and added to the new Custom Resource Definition (CRD), with APIVersion `ansiblenlab.ibm.com/v1beta1` and Kind `MyAnsibleLabDemo`.


1. Add the `deployment.image` field to the Custom Resource
		
	```
	gedit ~/ansible-operator/ansible-operator-frontend/deploy/crds/ansiblenlab_v1beta1_myansiblelabdemo_cr.yaml 

	```

	Add the last two lines from the following at the end of the file and save to make it look the same 
	
	```yaml
	apiVersion: ansiblenlab.ibm.com/v1beta1
	kind: MyAnsibleLabDemo
	metadata:
	  name: example-MyAnsibleLabDemo
	spec:
	  # Add fields here
	  size: 3
	  demo:
	    image: niklaushirt/k8sdemo:1.0.0
	```



2. Save and quit

## We have now finished setting up the API and CRDs




#### Hint Lab2_CreateLabOperatorAPI

No hint available


#### Complete Lab2_CreateLabOperatorAPI

Confirm Lab2_CreateLabOperatorAPI complete






#### Task Lab2_CreateLabOperatorController

----





## Lab 2 - Create the Lab Operator Controller

By default, an Ansible role executes the tasks defined at `roles/tasks/main.yml`. 
For defining our deployment we will use the k8s module of Ansible.

### 1) Define the Lab Operator Controller


1. Edit the `ansible-operator-frontend` Controller		

	```
	gedit ~/ansible-operator/ansible-operator-frontend/roles/myansiblelabdemo/tasks/main.yml
	```


2. Replace the content with the following:
   		
	```yaml
	- name: Create the k8sdemo deployment
	  k8s:
	    definition:
	      apiVersion: apps/v1beta1
	      kind: Deployment
	      metadata:
	        name: k8sdemo
	        namespace: default
	      spec:
	        replicas: 1
	        template:
	          metadata:
	            labels:
	              app: k8sdemo
	          spec:
	            containers:
	            - name: k8sdemo
	              image: "{{demo.image}}"
	              imagePullPolicy: IfNotPresent 
	              ports:
	              - containerPort: 3000
	              env:
	                - name: PORT
	                  value : "3000"
	                - name: APPLICATION_NAME
	                  value: k8sdemo
	                - name: BACKEND_URL
	                  value: http://k8sdemo-backend-service.default.svc:3000/api
	
	- name: Create the k8sdemo service
	  k8s:
	    definition:
	      apiVersion: v1
	      kind: Service
	      metadata:
	        name: k8sdemo-service
	        namespace: default
	      spec:
	        selector:
	          app: k8sdemo
	        ports:
	          - protocol: TCP
	            port: 3000
	            targetPort: 3000
	            nodePort: 32123
	        type: NodePort  
	
	```
	
> This will ensure that the Pod will be created with the Image information defined in 	the Custom Resource (CR) definition ("{{deployment.image}}"). This picks up the value 	defined in the CR.
	

	
	
	
4. Save and Quit


---	
	
### 2) Build the Lab Operator Controller

	
1. Now let's build the Operator container 
	
	```	
	operator-sdk build localhost:5000/ansible-operator-frontend:ansible
	  
	> INFO[0000] Building OCI image localhost:5000/ansible-operator-frontend:ansible
	> Sending build context to Docker daemon  49.15kB
	> Step 1/3 : FROM quay.io/operator-framework/ansible-operator:v0.10.0
	>  ---> 168416e214f1
	> Step 2/3 : COPY watches.yaml ${HOME}/watches.yaml
	>  ---> Using cache
	>  ---> 43f81409e05d
	> Step 3/3 : COPY roles/ ${HOME}/roles/
	>  ---> 0ad354c77a7a
	> Successfully built 0ad354c77a7a
	> Successfully tagged localhost:5000/ansible-operator-frontend:ansible
	> INFO[0001] Operator build complete.  
	```
  
	Where `localhost:5000/ansible-operator-frontend:ansible` is the name of the Docker image to be created.


4. And push the Operator container to the local registry 

   First execute this in order to be able to access the private registry:

   ```
   kubectl port-forward --namespace kube-system registry-5ng6b 5000:5000 > /tmp/port-forward.log &
   
   more /tmp/port-forward.log 
	
	> Forwarding from 127.0.0.1:5000 -> 5000
	> Forwarding from [::1]:5000 -> 5000

   ```

5. And then push the image:

 	```		
	docker push localhost:5000/ansible-operator-frontend:ansible
	```




#### Hint Lab2_CreateLabOperatorController

No hint available


#### Complete Lab2_CreateLabOperatorController

Confirm Lab2_CreateLabOperatorController complete






#### Task Lab2_DeployLabOperatorController

----



### 1) Prepare the Deployment for the Lab Operator Controller

Modify the image that we have pushed to the registry in the Operator deployment 

```	
cp ~/ansible-operator/ansible-operator-frontend/deploy/operator.yaml ~/ansible-operator/ansible-operator-frontend/deploy/operator.yaml.bak
	
sed -i 's|{{ REPLACE_IMAGE }}|localhost:5000/ansible-operator-frontend:ansible|g' ~/ansible-operator/ansible-operator-frontend/deploy/operator.yaml
sed -i 's|{{ pull_policy.* }}|Always|g' ~/ansible-operator/ansible-operator-frontend/deploy/operator.yaml

more ~/ansible-operator/ansible-operator-frontend/deploy/operator.yaml

```
	
### 2) Deploy the Lab Operator

1. Deploy  the `ansible-operator-frontend` Custom Resource Definition
	
	```
	kubectl create -f  ~/ansible-operator/ansible-operator-frontend/deploy/crds/ansiblenlab_v1beta1_myansiblelabdemo_crd.yaml 
	
	> customresourcedefinition.apiextensions.k8s.io/MyAnsibleLabDemos.ansiblenlab.ibm.com created
	```

2. Create  the `ansible-operator-frontend` Service Account
	
	```
	kubectl create -f  ~/ansible-operator/ansible-operator-frontend/deploy/service_account.yaml
	kubectl create -f  ~/ansible-operator/ansible-operator-frontend/deploy/role.yaml
	kubectl create -f  ~/ansible-operator/ansible-operator-frontend/deploy/role_binding.yaml
	
	> serviceaccount/ansible-operator-frontend created
	> role.rbac.authorization.k8s.io/ansible-operator-frontend created
	> rolebinding.rbac.authorization.k8s.io/ansible-operator-frontend created

	```

3. Create  the `ansible-operator-frontend` Operator
	
	```
	kubectl create -f  ~/ansible-operator/ansible-operator-frontend/deploy/operator.yaml
	
	> deployment.apps/ansible-operator-frontend created

	```
	
	Check and wait for the Operator to be running
	
	```
	kubectl get pods
	
	> NAME                            READY   STATUS    RESTARTS   AGE
	> ansible-operator-frontend-6cf66c6d4f-24pqm   1/1     Running   0          43m
	> training@training:~/go/src/ansible-operator-frontend

	```
	

#### Hint Lab2_DeployLabOperatorController

No hint available


#### Complete Lab2_DeployLabOperatorController

Confirm Lab2_DeployLabOperatorController complete








#### Task Lab2_DeployCustomResource

----





## Lab 2 - Deploy the Custom Resource



1. Deploy  the `ansible-operator-frontend` Custom Resource

	```
	kubectl create -f  ~/ansible-operator/ansible-operator-frontend/deploy/crds/ansiblenlab_v1beta1_myansiblelabdemo_cr.yaml 

	> MyAnsibleLabDemo.ansiblenlab.ibm.com/example-MyAnsibleLabDemo created
	```
	
	From the resource that we defined earlier:
	
	```yaml
	apiVersion: ansiblenlab.ibm.com/v1beta1
	kind: MyAnsibleLabDemo
	metadata:
	  name: example-MyAnsibleLabDemo
	spec:
	  # Add fields here
	  size: 3
	  demo:
	    image: niklaushirt/k8sdemo:1.0.0
	```

2. Check that the Custom resource is running

	```
	kubectl get pods
	
	> NAME                                         READY   STATUS    RESTARTS   AGE
	> ansible-operator-frontend-7fd5754bcd-xddsj   2/2     Running   0          3m11s
	> k8sdemo-7fc8554dff-2krkz                     1/1     Running   0          45s
	
	```

3. Check the version of the deployed Image

  ```
  kubectl describe deployment k8sdemo | grep Image
  
  > Image:      niklaushirt/k8sdemo:1.0.0
  ```
	
	
4. Once the status reads `Running`, we need to expose that deployment as a service so we can access it through the IP of the worker nodes.
   The `k8sdemo` application listens on port 3000.  
   
   Run:

  ```
   kubectl expose deployment k8sdemo --name k8sdemoansible-service -n default --type="NodePort" --port=3000
   
   > service "k8sdemoansible-service" exposed
  ```  
  
  
5. Open the application in your Browser

  ``` 
   minikube service k8sdemoansible-service
   
  ```


#### Hint Lab2_DeployCustomResource

No hint available


#### Complete Lab2_DeployCustomResource

Confirm Lab2_DeployCustomResource complete








#### Task Lab2_UpdateCustomResource

----

## Lab 2 - Update the Custom Resource

We now proceed to modifying the Custom Resource that we have created in order to demonstrate how the Operator is able to update an existing deployment based on modifications done to the Custom Resource.

1. Modify the Custom Resource

  ```
   sed -i 's|image: niklaushirt/k8sdemo:1.0.0|image: niklaushirt/k8sdemo:1.0.1|g' ~/ansible-operator/ansible-operator-frontend/deploy/crds/ansiblenlab_v1beta1_myansiblelabdemo_cr.yaml 
  ```
  
  
2. Check that the Image tag (version) has been changed to 1.0.1 

	``` 
	more ~/ansible-operator/ansible-operator-frontend/deploy/crds/ansiblenlab_v1beta1_myansiblelabdemo_cr.yaml 
	``` 
	
	The yaml manifest should look like this
	
	```yaml
	apiVersion: ansiblenlab.ibm.com/v1beta1
	kind: MyAnsibleLabDemo
	metadata:
	  name: example-myansiblelabdemo
	spec:
	  # Add fields here
	  size: 3
	  demo:
	    image: niklaushirt/k8sdemo:1.0.1
 	```
 	
3. Update the Custom Resource 

	```
	kubectl apply -f ~/ansible-operator/ansible-operator-frontend/deploy/crds/ansiblenlab_v1beta1_myansiblelabdemo_cr.yaml 
	``` 
    
    
4. Check that the version of the deployed Image has been changed by the Operator to 1.0.1

  ```
  kubectl describe deployment k8sdemo | grep Image
  
  > Image:      niklaushirt/k8sdemo:1.0.1
  ```
	 
5. And if you reload the browser you should see some nice orange peppers....

​	


#### Hint Lab2_UpdateCustomResource

No hint available


#### Complete Lab2_UpdateCustomResource

Confirm Lab2_UpdateCustomResource complete






#### Task Lab2_CleanUpLabOperator

----


## Lab 2 - Clean-up the Lab

Delete the `ansible-operator-frontend` Resources

```
kubectl delete -f  ~/ansible-operator/ansible-operator-frontend/deploy/crds/ansiblenlab_v1beta1_myansiblelabdemo_crd.yaml 
kubectl delete -f  ~/ansible-operator/ansible-operator-frontend/deploy/service_account.yaml
kubectl delete -f  ~/ansible-operator/ansible-operator-frontend/deploy/role.yaml
kubectl delete -f  ~/ansible-operator/ansible-operator-frontend/deploy/role_binding.yaml
kubectl delete -f  ~/ansible-operator/ansible-operator-frontend/deploy/operator.yaml
kubectl delete -f ~/ansible-operator/ansible-operator-frontend/deploy/crds/ansiblenlab_v1beta1_myansiblelabdemo_cr.yaml 
kubectl delete service -n default k8sdemoansible-service
   
```


# Congratulations!!! This concludes Lab 2 on Kubernetes Ansible Operators



#### Hint Lab2_CleanUpLabOperator

No hint available


#### Complete Lab2_CleanUpLabOperator

Confirm Lab2_CleanUpLabOperator complete





