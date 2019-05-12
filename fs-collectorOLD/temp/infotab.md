:infotab: <hr>

:infotab: <h1 id="toc_0">Kubernetes Basics </h1> 

:infotab: <h1 id="toc_0">Pod</h1>
:infotab: 
:infotab: <p>In Kubernetes, a group of one or more containers is called a pod. Containers in a pod are deployed together, and are started, stopped, and replicated as a group. The simplest pod definition describes the deployment of a single container. For example, an nginx web server pod might be defined as such:
:infotab: <code>
:infotab: apiVersion: v1
:infotab: kind: Pod
:infotab: metadata:
:infotab:   name: mynginx
:infotab:   namespace: default
:infotab:   labels:
:infotab:     run: nginx
:infotab: spec:
:infotab:   containers:
:infotab:   - name: mynginx
:infotab:     image: nginx:latest
:infotab:     ports:
:infotab:     - containerPort: 80
:infotab: </code></p>
:infotab: 
:infotab: <h1 id="toc_1">Labels</h1>
:infotab: 
:infotab: <p>In Kubernetes, labels are a system to organize objects into groups. Labels are key-value pairs that are attached to each object. Label selectors can be passed along with a request to the apiserver to retrieve a list of objects which match that label selector.</p>
:infotab: 
:infotab: <p>To add a label to a pod, add a labels section under metadata in the pod definition:
:infotab: <code>
:infotab: apiVersion: v1
:infotab: kind: Pod
:infotab: metadata:
:infotab:   labels:
:infotab:     run: nginx
:infotab: ...
:infotab: </code>
:infotab: To label a running pod
:infotab: <code>
:infotab:   kubectl label pod mynginx type=webserver
:infotab:   pod &quot;mynginx&quot; labeled
:infotab: </code>
:infotab: To list pods based on labels
:infotab: ```
:infotab:   kubectl get pods -l type=webserver
:infotab:   NAME      READY     STATUS    RESTARTS   AGE
:infotab:   mynginx   1/1       Running   0          21m</p>
:infotab: 
:infotab: <div><pre><code class="language-none">
:infotab: 
:infotab: # Deployments
:infotab: 
:infotab: A Deployment provides declarative updates for pods and replicas. You only need to describe the desired state in a Deployment object, and it will change the actual state to the desired state. The Deployment object defines the following details:
:infotab: 
:infotab: The elements of a Replication Controller definition
:infotab: The strategy for transitioning between deployments
:infotab: To create a deployment for a nginx webserver, edit the nginx-deploy.yaml file as</code></pre></div>
:infotab: 
:infotab: <p>apiVersion: apps/v1beta1
:infotab: kind: Deployment
:infotab: metadata:
:infotab:   generation: 1
:infotab:   labels:
:infotab:     run: nginx
:infotab:   name: nginx
:infotab:   namespace: default
:infotab: spec:
:infotab:   replicas: 3
:infotab:   selector:
:infotab:     matchLabels:
:infotab:       run: nginx
:infotab:   strategy:
:infotab:     rollingUpdate:
:infotab:       maxSurge: 1
:infotab:       maxUnavailable: 1
:infotab:     type: RollingUpdate
:infotab:   template:
:infotab:     metadata:
:infotab:       labels:
:infotab:         run: nginx
:infotab:     spec:
:infotab:       containers:
:infotab:       - image: nginx:latest
:infotab:         imagePullPolicy: Always
:infotab:         name: nginx
:infotab:         ports:
:infotab:         - containerPort: 80
:infotab:           protocol: TCP
:infotab:       dnsPolicy: ClusterFirst
:infotab:       restartPolicy: Always
:infotab:       securityContext: {}
:infotab:       terminationGracePeriodSeconds: 30</p>
:infotab: 
:infotab: <div><pre><code class="language-none">and create the deployment</code></pre></div>
:infotab: 
:infotab: <p>kubectl create -f nginx-deploy.yaml
:infotab: deployment &quot;nginx&quot; created
:infotab: <code>
:infotab: The deployment creates the following objects
:infotab: </code>
:infotab: kubectl get all -l run=nginx</p>
:infotab: 
:infotab: <p>NAME           DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
:infotab: deploy/nginx   3         3         3            3           4m</p>
:infotab: 
:infotab: <p>NAME                 DESIRED   CURRENT   READY     AGE
:infotab: rs/nginx-664452237   3         3         3         4m</p>
:infotab: 
:infotab: <p>NAME                       READY     STATUS    RESTARTS   AGE
:infotab: po/nginx-664452237-h8dh0   1/1       Running   0          4m
:infotab: po/nginx-664452237-ncsh1   1/1       Running   0          4m
:infotab: po/nginx-664452237-vts63   1/1       Running   0          4m
:infotab: ```</p>
:infotab: 
:infotab: <h1 id="toc_2">services</h1>
:infotab: 
:infotab: <p>Services</p>
:infotab: 
:infotab: <p>Kubernetes pods, as containers, are ephemeral. Replication Controllers create and destroy pods dynamically, e.g. when scaling up or down or when doing rolling updates. While each pod gets its own IP address, even those IP addresses cannot be relied upon to be stable over time. This leads to a problem: if some set of pods provides functionality to other pods inside the Kubernetes cluster, how do those pods find out and keep track of which other?</p>
:infotab: 
:infotab: <p>A Kubernetes Service is an abstraction which defines a logical set of pods and a policy by which to access them. The set of pods targeted by a Service is usually determined by a label selector. Kubernetes offers a simple Endpoints API that is updated whenever the set of pods in a service changes.</p>
:infotab: 
:infotab: <p>To create a service for our nginx webserver, edit the nginx-service.yaml file
:infotab: <code>
:infotab: apiVersion: v1
:infotab: kind: Service
:infotab: metadata:
:infotab:   name: nginx
:infotab:   labels:
:infotab:     run: nginx
:infotab: spec:
:infotab:   selector:
:infotab:     run: nginx
:infotab:   ports:
:infotab:   - protocol: TCP
:infotab:     port: 8000
:infotab:     targetPort: 80
:infotab:   type: ClusterIP
:infotab: </code>
:infotab: Create the service</p>
:infotab: 
:infotab: <p><code>kubectl create -f nginx-service.yaml</code>
:infotab: service &quot;nginx&quot; created
:infotab: ```
:infotab: kubectl get service -l run=nginx
:infotab: NAME      CLUSTER-IP     EXTERNAL-IP   PORT(S)   AGE
:infotab: nginx     10.254.60.24   <none>        8000/TCP    38s</p>
:infotab: 
:infotab: <div><pre><code class="language-none">Describe the service:</code></pre></div>
:infotab: 
:infotab: <p>kubectl describe service nginx
:infotab: Name:                   nginx
:infotab: Namespace:              default
:infotab: Labels:                 run=nginx
:infotab: Selector:               run=nginx
:infotab: Type:                   ClusterIP
:infotab: IP:                     10.254.60.24
:infotab: Port:                   <unset> 8000/TCP
:infotab: Endpoints:              172.30.21.3:80,172.30.4.4:80,172.30.53.4:80
:infotab: Session Affinity:       None
:infotab: No events.
:infotab: ```
:infotab: The above service is associated to our previous nginx pods. Pay attention to the service selector run=nginx field. It tells Kubernetes that all pods with the label run=nginx are associated to this service, and should have traffic distributed amongst them. In other words, the service provides an abstraction layer, and it is the input point to reach all of the associated pods.</p>




:infotab: <hr>

:infotab: <h1 id="toc_0">Optional Debugging Lab </h1> 
:infotab: <h2 id="toc_0">Tips and Tricks for Debugging Applications in Kubernetes</h2>
:infotab: <p>Advanced debugging techniques to reach your pods.</p>
:infotab: <h2 id="toc_1">Pod Logs</h2>
:infotab: <p>You can look at the logs of any of the pods running under your deployments as follows</p>
:infotab: <div><pre><code class="language-console">$ kubectl logs &lt;podname&gt;</code></pre></div>
:infotab: <p>Remember that if you have multiple containers running in your pod, you have to specify the specific container you want to see logs from.</p>
:infotab: <div><pre><code class="language-console">$ kubectl logs &lt;pod-name&gt; &lt;container-name&gt;</code></pre></div>
:infotab: <p>This subcommand operates like <code>tail</code>. Including the <code>-f</code> flag will continue to stream the logs live once the current time is reached.</p>
:infotab: <h2 id="toc_2">kubectl edit and vi</h2>
:infotab: <p>By default, on many Linux and macOS systems, you will be dropped into the editor <code>vi</code>.
:infotab: <code>
:infotab: export EDITOR=nano
:infotab: </code></p>
:infotab: <p>On Windows, a copy of <code>notepad.exe</code> will be opened with the contents of the file.</p>
:infotab: <h2 id="toc_3">busybox pod</h2>
:infotab: <p>For debugging live, this command frequently helps me:
:infotab: <code>console
:infotab: kubectl run bb --image busybox --restart=Never -it --rm
:infotab: </code></p>
:infotab: <p>In the busybox image is a basic shell that contains useful utilities.</p>
:infotab: <p>Utils I often use are <code>nslookup</code> and <code>wget</code>. </p>
:infotab: <p><code>nslookup</code> is useful for testing DNS resolution in a pod.</p>
:infotab: <p><code>wget</code> is useful for trying to do network requests.</p>
:infotab: <h2 id="toc_4">Service Endpoints</h2>
:infotab: <p>Endpoint resource can be used to see all the service endpoints.
:infotab: <code>console
:infotab: $ kubectl get endpoints &lt;service&gt;
:infotab: </code></p>
:infotab: <h2 id="toc_5">ImagePullPolicy</h2>
:infotab: <p>By default Kubernetes will only pull the image on first use. This can be confusing during development when you expect changes to show up.</p>
:infotab: <p>You should be aware of the three <code>ImagePullPolicy</code>s:
:infotab:  - IfNotPresent - the default, only request the image if not present.
:infotab:  - Always - always request the image.
:infotab:  - Never</p>
:infotab: <p>More details on image management may be <a href="https://kubernetes.io/docs/concepts/containers/images/">found here</a>.</p>

:infotab: <hr>

