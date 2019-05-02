
:course_title: KUBADV02 Knative

:course_desc: This course provides the student with the necessary steps to get a basic understanding of Knative.  

:course_max: 7

:course_auto: no

:button1_label: Task

:button2_label: Hint

:button2_delay: 999999

:button3_label: Complete

:button3_delay: 10000




:infotab: <h1 id="toc_0">Tips and Tricks for getting around in the labs</h1>
:infotab: <p>Advanced debugging techniques to reach your pods.</p>
:infotab: <h2 id="toc_1">Pod Logs</h2>
:infotab: <p>You can look at the logs of any of the pods running under your deployments as follows</p>
:infotab: <div><pre><code class="language-console">$ kubectl logs &lt;podname&gt;</code></pre></div>
:infotab: <p>Remember that if you have multiple containers running in your pod, you have to specify the specific container you want to see logs from.</p>
:infotab: <div><pre><code class="language-console">$ kubectl logs &lt;pod-name&gt; &lt;container-name&gt;</code></pre></div>
:infotab: <p>This subcommand operates like <code>tail</code>. Including the <code>-f</code> flag will
:infotab: continue to stream the logs live once the current time is reached.</p>
:infotab: <h2 id="toc_2">kubectl edit and vi</h2>
:infotab: <p>By default, on many Linux and macOS systems, you will be dropped into the editor <code>vi</code>.
:infotab: If you end up in vi you can quit by typing <code>ESC :q!</code></p>
:infotab: <p>IF you prefer using nano as an editor, execute </p>
:infotab: <div><pre><code class="language-none">export EDITOR=nano</code></pre></div>
:infotab: <p>On Windows, a copy of <code>notepad.exe</code> will be opened with the contents of the file.</p>
:infotab: <h2 id="toc_3">nano basic commands</h2>
:infotab: <div><pre><code class="language-none">Ctrl-O      To save your work (WriteOut)
:infotab: <BR>Ctrl-X      To exit nano
:infotab: <BR>Ctrl-W      To search for text in a document
:infotab: <BR>Ctrl-K      To cut a line of text</code></pre></div>
:infotab: <h2 id="toc_4">busybox pod</h2>
:infotab: <p>For debugging live, this command frequently helps me:</p>
:infotab: <div><pre><code class="language-console">kubectl run bb --image busybox --restart=Never -it --rm</code></pre></div>
:infotab: <p>In the busybox image is a basic shell that contains useful utilities.</p>
:infotab: <p>Utils I often use are <code>nslookup</code> and <code>wget</code>. </p>
:infotab: <p><code>nslookup</code> is useful for testing DNS resolution in a pod.</p>
:infotab: <p><code>wget</code> is useful for trying to do network requests.</p>
:infotab: <h2 id="toc_5">Service Endpoints</h2>
:infotab: <p>Endpoint resource can be used to see all the service endpoints.</p>
:infotab: <div><pre><code class="language-console">$ kubectl get endpoints &lt;service&gt;</code></pre></div>
:infotab: <h2 id="toc_6">ImagePullPolicy</h2>
:infotab: <p>By default Kubernetes will only pull the image on first use. This can be confusing during development when you expect changes to show up.</p>
:infotab: <p>You should be aware of the three <code>ImagePullPolicy</code>:</p>
:infotab: <ul>
:infotab: <li>IfNotPresent - the default, only request the image if not present.</li>
:infotab: <li>Always - always request the image.</li>
:infotab: <li>Never</li>
:infotab: </ul>
:infotab: <p>More details on image management may be <a href="https://kubernetes.io/docs/concepts/containers/images/">found here</a>.</p>






----
#### Task Introduction

----

## KNATIVE Introduction

Knative (pronounced kay-nay-tiv) extends Kubernetes to provide a set of middleware components that are essential to build modern, source-centric, and container-based applications that can run anywhere: on premises, in the cloud, or even in a third-party data center.

Each of the components under the Knative project attempt to identify common patterns and codify the best practices that are shared by successful, real-world, Kubernetes-based frameworks and applications. Knative components focus on solving mundane but difficult tasks such as:

* Deploying a container
* Orchestrating source-to-URL workflows on Kubernetes
* Routing and managing traffic with blue/green deployment
* Scaling automatically and sizing workloads based on demand
* Binding running services to eventing ecosystems

Developers on Knative can use familiar idioms, languages, and frameworks to deploy functions, applications, or containers workloads.

## Components

The following Knative components are available:

* Build - Source-to-container build orchestration
* Eventing - Management and delivery of events
* Serving - Request-driven compute that can scale to zero

## Audience

Knative is designed for different personas:

![](https://knative.dev/docs/images/knative-audience.svg)

### Developers 
Knative components offer developers Kubernetes-native APIs for deploying serverless-style functions, applications, and containers to an auto-scaling runtime.

To join the conversation, head over to the Knative users Google group.


### Operators

Knative components are intended to be integrated into more polished products that cloud service providers or in-house teams in large enterprises can then operate.

Any enterprise or cloud provider can adopt Knative components into their own systems and pass the benefits along to their customers.


### Contributors

With a clear project scope, lightweight governance model, and clean lines of separation between pluggable components, the Knative project establishes an efficient contributor workflow.

Knative is a diverse, open, and inclusive community. To get involved, see CONTRIBUTING and join the Knative community.

Your own path to becoming a Knative contributor can begin anywhere. Bug reports and friction logs from new developers are especially welcome.

## Documentation

Follow the links below to learn more about Knative.

[Installing Knative](https://knative.dev/docs/install/index.html)

[Getting started with app deployment](https://knative.dev/docs/install/getting-started-knative-app)

[Getting started with serving](https://knative.dev/docs/serving)

[Getting started with builds](https://knative.dev/docs/build)

[Getting started with eventing](https://knative.dev/docs/eventing)




### Workshop

* Exercise 1 - Introduction
* Exercise 2 - Clone the Application Repo and Provide Container Registry Credentials
* Exercise 3 - Install Istio and Knative
* Exercise 4 - Deploy Our First Knative Application
* Exercise 5 - Build and Deploy our Knative Application
* Exercise 6 - Deploy vnext Version Using knctl
* Exercise 7 - A/B Testing with knctl

----


#### Hint Introduction

No hint available


#### Complete Introduction

> Confirm Introduction complete






#### Task Clone the Application 

----

## Setup: Clone the Application Repo and Provide Container Registry Credentials

### Clone the application repo
The application for this lab is a simple node.js with express app which returns the first n numbers of the Fibonacci sequence. To use the app, deploy it, and simply make a GET request to the `/` endpoint with a number as the parameter. We'll deploy this application using Knative later, but for now just clone it from github.

1. Clone the git repository:

    ```
    git clone https://github.com/IBM/fib-knative.git
    ```
2. Change directories to the fib-knative folder.

    ```
    cd fib-knative
    ```

### Set up a Private Container Registry and Obtain Credentials
In this lab, we'll use the [IBM Container Registry](https://console.bluemix.net/docs/services/Registry/registry_overview.html#registry_overview) to host our container images since you already have access to this through your IBM Cloud Account. IBM Container Registry enables you to store and distribute container images in a fully managed private registry.

1. Add a namespace to your account. You must set at least one namespace to store images in IBM Cloud Container Registry. Choose a unique name for your first namespace. A namespace is a collection of related repositories (which in turn are made up of individual images). You can set up multiple namespaces as well as control access to your namespaces by using IAM policies.

    ```
    ibmcloud cr namespace-add <my_namespace>
    ```
2. Create a token. This token is a non-expiring token with read and write access to all namespaces in the region. The automated build processes you'll be setting up will use this token to access your images.

    ```
    ibmcloud cr token-add --description "knative read write token for all namespaces" --non-expiring --readwrite
    ```

3. The CLI output should include a Token Identifier and the Token. Make note of the Token for later in this lab. You will not need the Token Identifier. You can verify that the token was created by listing all tokens.

    ```
    ibmcloud cr token-list
    ```

### Provide Container Registry Credentials to Cluster
This lab will need credentials for authenticating to your private container registry. First, we'll need to create a `Secret` to store the credentials for this registry. This secret will be used for the knative-serving component to pull down an image from the container registry.

A `Secret` is a Kubernetes object containing sensitive data such as a password, a token, or a key. You can also read more about [Secrets](https://kubernetes.io/docs/concepts/configuration/secret/).

1. Let's create a secret, which will be a `docker-registry` type secret. This type of secret is used to authenticate with a container registry to pull down a private image. We can create this via the commandline. For username, simply use the string `token`. For `<token_value>`, use the token you made note of earlier.

    ```
    kubectl create secret docker-registry ibm-cr-secret --docker-server=https://registry.ng.bluemix.net --docker-username=token --docker-password=<token_value>
    ```

2. We will also need a secret for the build process to have credentials to push the built image to the container registry. To create this object, we'll first need to base64 encode our username and password for IBM Container Registry. For username, you will again use the string `token`. The base64 encoding of `token` should be: `dG9rZW4=` - which is already in the yaml file.  For token_value, again use the token you made note of earlier.

    ```
    echo -n "<token_value>" | base64 -w0  # Linux
    echo -n "<token_value>" | base64 -b0  # MacOS
    ```

2. This time we'll create the secret via a .yaml file. Update the `docker-secret.yaml` file with your base64 encoded password. You can find the password field near the end of the file. Username (`dG9rZW4=`) is already provided for you.

3. Apply the secret to your cluster:

    ```
    kubectl apply --filename docker-secret.yaml
    ```

    View the yaml used to create the Secret:
    
    ```
    kubectl get secret basic-user-pass -o yaml
    ```

    Example output:

    ```yaml
    apiVersion: v1
    kind: Secret
    metadata:
      name: basic-user-pass
      annotations:
        build.knative.dev/docker-0: registry.ng.bluemix.net
    type: kubernetes.io/basic-auth
    data:
      # Use 'echo -n "username" | base64' to generate this string
      username: your_base_64_username
      # Use 'echo -n "password" | base64' to generate this string
      password: your_base_64_password
    ```

A `Service Account` provides an identity for processes that run in a Pod. This Service Account will be used to link the build process for Knative to the Secrets you just created.

4. Apply the service account to your cluster:

    ```
    kubectl apply --filename service-account.yaml
    ```

    View the yaml file used to create the Service Account:
    
    ```
    kubectl get serviceaccount build-bot -o yaml
    ```

    Example output:
    
    ```
     apiVersion: v1
     kind: ServiceAccount
     metadata:
       name: build-bot
     secrets:
     - name: basic-user-pass
     imagePullSecrets:
     - name: ibm-cr-secret
    ```


Congratulations! You've set up some required credentials that the Knative build process will use to have access to push to your container registry. In the next exercise, you will install Knative onto the cluster so that you can build and deploy this app. The goal of this exercise was to set up some required credentials.





#### Hint Clone the Application

No hint available


#### Complete Clone the Application

> Confirm Clone the Application complete




#### Task Install Istio and Knative

----
## Setup: Install Istio and Knative on Your Cluster

Knative is currently built on top of both Kubernetes and Istio.
If you want to learn more about Kubernetes or Istio, you can check out the
labs [Kube101](https://github.com/IBM/kube101/tree/master/workshop) and
[Istio101](https://github.com/IBM/istio101/tree/master/workshop).
When you install Knative on IKS, it will install Istio for you
automatically.

### Install Knative

1. To install Knative, first make sure you have the latest Kubernetes
   plugin:

    ```
    ibmcloud plugin update
    ```

2. Next ask for Knative to be installed:

    ```
	ibmcloud ks cluster-addon-enable knative --cluster $MYCLUSTER
	```

3. The install process may take a minute or two. To know when it's done you
   can run two commands - first see if the Istio and Knative namespaces
   are there:

   ```
   kubectl get namespace
   ```

   and you should see something like:

   ```
   NAME                 STATUS   AGE
   default              Active   7d18h
   ibm-cert-store       Active   7d18h
   ibm-system           Active   7d18h
   istio-system         Active   7d17h
   knative-build        Active   7d17h
   knative-eventing     Active   7d17h
   knative-monitoring   Active   7d17h
   knative-serving      Active   7d17h
   knative-sources      Active   7d17h
   kube-public          Active   7d18h
   kube-system          Active   7d18h
   ```

   Notice the `istio-system` namespace, and the `knative-...` namespaces.

   Once the namespaces are there, check to see if all of the Istio and
   Knative pods are running correctly:

   ```
   kubectl get pods --namespace istio-system
   kubectl get pods --namespace knative-serving
   kubectl get pods --namespace knative-build
   ```

   You could check the pods in all of the Knative namespaces, but for this
   workshop only "serving" and "build" are required.
   

   Example Ouput:

   ```
   NAME                          READY   STATUS    RESTARTS   AGE
   activator-df78cb6f9-jpvs7     2/2     Running   0          38s
   activator-df78cb6f9-nhzhf     2/2     Running   0          37s
   activator-df78cb6f9-qjg8w     2/2     Running   0          37s
   autoscaler-6fccb66768-m4f2q   2/2     Running   0          37s
   controller-56cf5965f5-8pwcg   1/1     Running   0          35s
   webhook-5dcbf967cd-lxzmk      1/1     Running   0          35s
   ```

   If all of the pods shown are in a `Running` or `Completed` state then you should be all set.



#### Hint Install Istio and Knative

No hint available


#### Complete Install Istio and Knative

> Confirm Install Istio and Knative complete





#### Task Deploy Our First Knative Application

----

## Deploy Our First Knative Application
Knative Serving supports deploying and serving of serverless applications and functions. Those applications and functions will automatically scale up, and then back down to zero. In this exercise, we'll use the Knative Serving component to deploy our first application from a container image hosted on dockerhub.

### Create a Service Definition
Knative defines some objects for each component as Kubernetes [Custom Resource Definitions](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources)(CRDs). A CRD is used to define a new resource type in Kubernetes. Knative [Serving](https://github.com/knative/docs/tree/master/docs/serving#serving-resources) includes a number of Custom Resource Definitions, including Service, Route, Configuration, and Revision.

Because Knative is built on top of Kubernetes, you can use kubectl along with a service definition file to create a new Service definition for your application.

1. In the `fib-knative` project you cloned earlier, you should see a file called `fib-service.yaml`. Look at the contents of the file:

    ```
    cat fib-service.yaml
    ```

    File Contents:
    
    ```
    apiVersion: serving.knative.dev/v1alpha1
    kind: Service
    metadata:
      name: fib-knative
      namespace: default
    spec:
      runLatest:
        configuration:
          revisionTemplate:
            spec:
              container:
                image: docker.io/ibmcom/fib-knative
    ```

    The `fib-service.yaml` file describes a Service. Notice that it includes the name (fib-knative), the namespace (default), and a reference to the container image on dockerhub (docker.io/ibmcom/fib-knative).

2. Let's deploy this app into our cluster. Apply the `fib-service.yaml` file.

    ```
    kubectl apply --filename fib-service.yaml
    ```

3. Watch the pods initializing as our application gets deployed and starts up:

    ```
    kubectl get pods --watch
    ```

    Note: To exit the watch, use `ctrl + c`.

4. Let's try out our new application! First, let's get the domain name that Knative assigned to the Service we just deployed. Run the following command, and note the value for `domain`. IBM Cloud Kubernetes Service sets the default domain name for Knative to match the domain name of your IBM Cloud Kubernetes Service cluster. It will also set up the Istio ingress to route all incoming requests targeted to that domain to Knative.

    ```
    kubectl get ksvc fib-knative
    ```

5. The domain name should look something like `fib-knative.default.bmv-kubeflow.us-south.containers.appdomain.cloud`. We can set an environment variable so that we can use this throughout the lab:

    ```
    export MY_DOMAIN=<your_app_domain_here>
    ```

6. We can now curl this domain to try out our application. Notice that we're calling the `/` endpoint, and passing in a `number` parameter of 5. This should return the first 5 numbers of the fibonacci sequence.

    ```
     curl $MY_DOMAIN/5
    ```

    Expected Output:
    ```
    [1,1,2,3,5]
    ```

7. Congratulations! You've got your first Knative application deployed and responding to requests. Try sending some different number requests. If you stop making requests to the application, you should eventually see that your application scales itself back down to zero. Watch the pod until you see that it is `Terminating`. This should take approximately 90 seconds.

    ```
    kubectl get pods --watch
    ```

    Note: To exit the watch, use `ctrl + c`.



#### Hint Deploy Our First Knative Application

No hint available


#### Complete Deploy Our First Knative Application

> Confirm Deploy Our First Knative Application complete





#### Task Build and Deploy our Knative Application

----

## Build and Deploy our Knative Application

We've seen how to deploy an application from a container that already exists, so let's build the container image ourselves from source code. Using the Build & Serving components of Knative, we can build the image and push it to a private container registry on IBM Cloud, and then ultimately get a URL to access our application.

### Install Kaniko Build Template

As a part of this lab, we will use the kaniko build template for building source into a container image from a Dockerfile. Kaniko doesn't depend on a Docker engine and instead executes each command within the Dockerfile completely in userspace. This enables building container images in environments that can't easily or securely run a Docker engine, such as Kubernetes.

A Knative BuildTemplate encapsulates a shareable build process with some limited parameterization capabilities.

1. Install the kaniko build template to your cluster.

    ```
    kubectl apply --filename https://raw.githubusercontent.com/knative/build-templates/master/kaniko/kaniko.yaml
    ```

2. Use kubectl to confirm you installed the kaniko build template, as well as to see some more details about it.  You'll see that this build template accepts parameters of `IMAGE` and `DOCKERFILE`.  `IMAGE` is the name of the image you will push to the container registry, and `DOCKERFILE` is the path to the Dockerfile that will be built.

	Command:
	
	```
	kubectl get BuildTemplate kaniko -o yaml
	```

	Example Output:
	
	```
      spec:
        generation: 1
        parameters:
        - description: The name of the image to push
          name: IMAGE
        - default: /workspace/Dockerfile
          description: Path to the Dockerfile to build.
          name: DOCKERFILE
        steps:
        - args:
          - --dockerfile=${DOCKERFILE}
          - --destination=${IMAGE}
          image: gcr.io/kaniko-project/executor
          name: build-and-push
	```


### Deploy the Fibonacci App Using kubectl and service.yaml

1. Edit the `service.yaml` file to point to your own container registry namespace by replacing instances of `<NAMESPACE>` with the container registry namespace you created earlier.

2. Apply the `service.yaml` file to your cluster.

	```
	kubectl apply -f service.yaml
	```
3. Run `kubectl get pods --watch` to see the pods initializing. Note: To exit the watch, use `ctrl + c`.

	```
	kubectl get pods --watch
	```

4. Take a look at the `service.yaml` file again. The service.yaml file defines the required Knative components to build the application from source code in the git repository and push the built container image to the private container registry. Then it'll replace the currently running version of the application with this new one.

5. Now that the app is up, we should be able to call it using a number input. We can do that using a curl command against the domain that was provided to us.

	```
	curl $MY_DOMAIN/20
	```
6. You should see the first 20 Fibonacci numbers!

7. If we left this application alone for some time, it would scale itself back down to 0, and terminate the pods that were created. Run `kubectl get pods --watch` and wait until you see the application scale itself back down to 0. When the application is no longer in use, you should eventually see the pods move from the `Running` to the `Terminating` state. Note: To exit the watch, use `ctrl + c`.

	Expected Output:
	
	```
	NAME                                            READY   STATUS      RESTARTS   AGE
	fib-knative-00002-deployment-58dcbdb97c-rrnzc   3/3     Running     0          56s
	fib-knative-00002-deployment-58dcbdb97c-rrnzc   3/3   Terminating   0          89s
	fib-knative-00002-deployment-58dcbdb97c-rrnzc   0/3   Terminating   0          91s
	```




#### Hint Build and Deploy our Knative Application

No hint available


#### Complete Build and Deploy our Knative Application

> Confirm Build and Deploy our Knative Application complete





#### Task Deploy vnext Version Using knctl

----

## Deploy vnext Version Using knctl

Did you notice that the Fibonacci sequence started with 1? Most would argue that the sequence should actually start with 0. There's a vnext version of the application at the vnext branch in the github project. We'll deploy that as v2 of our app, but instead of using kubectl, let's try the knctl tool for interacting with Knative.

### Deploy vnext
1. Let's deploy vnext, but instead of kubectl with the service.yaml file, let's use knctl. By providing Knative with the source of our app and the image to push to the container registry, we'll get an application with a URL we can access.

    ```
    knctl deploy \
        --service fib-knative \
        --git-url https://github.com/IBM/fib-knative \
        --git-revision vnext \
        --service-account build-bot \
        --image registry.ng.bluemix.net/<NAMESPACE>/fib-knative:vnext \
        --managed-route=false
    ```

	This command will tell Knative to go out to github, find the code, build it into a container, and push that container to the IBM Container Registry. One thing you'll notice if you follow the output logs is that this deploy command also tags my app versions with a `latest` and a `previous` tag.

2. See the revisions using knctl.

	```
	knctl revisions list
	```
	Expected output:
	
	```
    Revisions

    Service      Name               Tags      Annotations  Conditions  Age  Traffic  
    fib-knative  fib-knative-00003  latest    -            5 OK / 5    45s  100% -> fib-knative.default.mycluster6.us-south.containers.appdomain.cloud  
    ~            fib-knative-00002  previous  -            5 OK / 5    3m   -  
    ~            fib-knative-00001  -         -            5 OK / 5    3m   - 

    3 revisions

    Succeeded
    ```

3. Curl the application to see that 100% of the traffic is hitting your new fib-knative revision, starting the sequence with 0. 

    ```
    curl $MY_DOMAIN/20
    ```




#### Hint Deploy vnext Version Using knctl

No hint available


#### Complete Deploy vnext Version Using knctl

> Confirm Deploy vnext Version Using knctl complete





#### Task A/B Testing with knctl

----

## A/B Testing with knctl

Maybe we want to slowly roll users over from our old version to the new version, or do some A/B testing of the new version. We can use the knctl rollout command to route traffic percentages to our revisions.

1. Check the current route percentages:

	```
	knctl route list
	```

	Output:
	
	```
	Routes in namespace 'default'

	Name         Domain                                                              Traffic                   Annotations  Conditions  Age  
	fib-knative  fib-knative.default.mycluster6.us-south.containers.appdomain.cloud  100% -> fib-knative  -            3 OK / 3    20h  

	1 routes

	Succeeded
	```

2. Send 50% of the traffic to the latest revision, and 50% to the previous revision. Notice that we're using the previous and latest tags that were created for us as a part of the knctl deploy command.

	```
	knctl rollout --route fib-knative -p fib-knative:latest=50% -p fib-knative:previous=50%
	```

3. Check the route percentages to confirm they've updated:

	```
	knctl route list
	```

	Output:
	
	```
	Routes in namespace 'default'

	Name         Domain                                                              Traffic                   Annotations  Conditions  Age  
	fib-knative  fib-knative.default.mycluster6.us-south.containers.appdomain.cloud  50% -> fib-knative-00003  -            3 OK / 3    15h  
                                                                                 	 50% -> fib-knative-00002                             

	1 routes

	Succeeded
	```

3. Let's run some load against the app, just asking for the first number in the Fibonacci sequence so that we can clearly see which revision is being called.

	```
	while sleep 0.5; do curl "$MY_DOMAIN/1" ; done
	```

4. We should see that the curl requests are routed approximately 50/50 between the two applications. Let's kill this process using `ctrl + c`.


At this point, you should feel that you've had a whirlwind tour of Knative. We installed Istio & Knative onto a Kubernetes cluster. We deployed a serverless application and saw it scale up and then back down when it was no longer in use. We also explored the knctl tool to easily create routing rules and deploy serverless applications. Please reach out should you have any questions or issues going through this lab!


#### Hint A/B Testing with knctl

No hint available


#### Complete A/B Testing with knctl

> Confirm A/B Testing with knctl complete





