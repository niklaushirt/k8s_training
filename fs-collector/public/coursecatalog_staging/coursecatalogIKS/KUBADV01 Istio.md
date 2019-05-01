
:course_title: KUBADV01 Istio

:course_desc: This course provides the student with the necessary steps to get a basic understanding of Istio.  

:course_max: 10

:course_auto: no

:button1_label: Task

:button2_label: Hint

:button2_delay: 999999

:button3_label: Complete

:button3_delay: 30




:infotab: <hr>

:infotab: <h1 id="toc_0">References</h1>
:infotab: <p><a href="https://istio.io/docs/tasks/">Istio.io</a></p>
:infotab: <h1 id="toc_1">License</h1>
:infotab: <p>This code pattern is licensed under the Apache Software License, Version 2.  Separate third party code objects invoked within this code pattern are licensed by their respective providers pursuant to their own separate licenses. Contributions are subject to the <a href="https://developercertificate.org/">Developer Certificate of Origin, Version 1.1 (DCO)</a> and the <a href="http://www.apache.org/licenses/LICENSE-2.0.txt">Apache Software License, Version 2</a>.</p>
:infotab: <p><a href="http://www.apache.org/foundation/license-faq.html#WhatDoesItMEAN">Apache Software License (ASL) FAQ</a></p>

:infotab: <hr>






----
#### Task Introduction

----

## ISTIO Introduction

Microservices and containers changed application design and deployment patterns, but along with them brought challenges like service discovery, routing, failure handling, and visibility to microservices. "Service mesh" architecture was born to handle these features. Applications are getting decoupled internally as microservices, and the responsibility of maintaining coupling between these microservices is passed to the service mesh.

[Istio](https://istio.io/), a joint collaboration between IBM, Google and Lyft provides an easy way to create a service mesh that will manage many of these complex tasks automatically, without the need to modify the microservices themselves. Istio does this by:

1. Deploying a **control plane** that manages the overall network infrastructure and enforces the policy and traffic rules defined by the devops team

2. Deploying a **data plane** which includes “sidecars”, secondary containers that sit along side of each instance of a microservice and act as a proxy to intercept all incoming and outgoing network traffic. Sidecars are implemented using Envoy, an open source edge proxy

Once Istio is installed some of the key feature which it makes available include

- Traffic management using **Istio Pilot**: In addition to providing content and policy based load balancing and routing, Pilot also maintains a canonical representation of services in the mesh.

- Access control using **Istio Auth**: Istio Auth secures the service-to-service communication and also provides a key management system to manage keys and certificates.

- Monitoring, reporting and quota management using **Istio Mixer**: Istio Mixer provides in depth monitoring and logs data collection for microservices, as well as collection of request traces. Precondition checking like whether the service consumer is on whitelist, quota management like rate limits etc. are also configured using Mixer.

In the [first part](#part-a-deploy-sample-bookinfo-application-and-inject-istio-sidecars-to-enable-traffic-flow-management-access-policy-and-monitoring-data-aggregation-for-application) of this journey we show how we can deploy the sample [BookInfo](https://istio.io/docs/samples/bookinfo.html) application and inject sidecars to get the Istio features mentioned above, and walk through the key ones. The BookInfo is a simple application that is composed of four microservices, written in different languages for each of its microservices namely Python, Java, Ruby, and Node.js. The application does not use a database, and stores everything in local filesystem.

Also since Istio tightly controls traffic routing to provide above mentioned benefits, it introduces some drawbacks. Outgoing traffic to external services outside the Istio data plane can only be enabled by specialized configuration, based on the protocol used to connect to the external service.

In the [second part](#part-b-modify-sample-application-to-use-an-external-datasource-deploy-the-application-and-istio-envoys-with-egress-traffic-enabled) of the journey we focus on how Istio can be configured to allow applications to connect to external services. For that we modify the sample BookInfo application to use an external database and then use it as a base to show Istio configuration for enabling egress traffic.

![istio-architecture](https://raw.githubusercontent.com/niklaushirt/istio-introduction/master/images/istio-architecture.png)

## Included Components
- [Istio](https://istio.io/)
- [Kiali](https://www.kiali.io/)
- [Grafana](http://docs.grafana.org/guides/getting_started)
- [Jaeger](https://www.jaegertracing.io/)
- [Prometheus](https://prometheus.io/)
- [IBM Cloud Kubernetes Service](https://console.ng.bluemix.net/docs/containers/cs_ov.html#cs_ov)

---

# Course 

### Beyond the Basics: Istio and IBM Cloud Kubernetes Service

Istio is an open platform to connect, secure, control and observe microservices, also known as a service mesh, on cloud platforms such as Kubernetes in IBM Cloud Kubernetes Service and VMs. With Istio, You can manage network traffic, load balance across microservices, enforce access policies, verify service identity, secure service communication and observe what exactly is going on with your services.

In this course, you can see how to install Istio alongside microservices for a simple mock app called Guestbook. When you deploy Guestbook's microservices into an IBM Cloud Kubernetes Service cluster where Istio is installed, you can choose to inject the Istio Envoy sidecar proxies in the pods of certain microservices.

### Objectives

After you complete this course, you'll be able to: - Download and install Istio in your cluster - Deploy the Guestbook sample app - Use metrics, logging and tracing to observe services - Set up the Istio Ingress Gateway - Perform simple traffic management, such as A/B tests and canary deployments - Secure your service mesh - Enforce policies for your microservices

### Workshop

* Exercise 1 - Accessing a Kubernetes cluster with IBM Cloud Kubernetes Service
* Exercise 2 - Installing Istio
* Exercise 3 - Deploying Guestbook with Istio Proxy
* Exercise 4 - Observe service telemetry: metrics and tracing
* Exercise 5 - Expose the service mesh with the Istio Ingress Gateway
* Exercise 6 - Perform traffic management
* Exercise 7 - Secure your service mesh
* Exercise 8 - Enforce policies for microservices

----

#### Hint Introduction

No hint available


#### Complete Introduction

> Confirm Introduction complete


----

#### Task Accessing a Kubernetes cluster

----

# Lab 1 - Accessing a Kubernetes cluster with IBM Cloud Kubernetes Service

You must already have a [cluster created](https://console.bluemix.net/docs/containers/container_index.html#container_index). Here are the steps to access your cluster.

## Install IBM Cloud Kubernetes Service command line utilities

1. Install the IBM Cloud [command line interface](https://console.bluemix.net/docs/cli/reference/bluemix_cli/get_started.html#getting-started).

2.  Log in to the IBM Cloud CLI.

    ```
    ibmcloud login
    ```

    If you have a federated account, include the `--sso` flag.

    ```
    ibmcloud login --sso
    ```

    If you have an api key, use:

    ```
    ibmcloud login --apikey <apikey>
    ```

3.  Install the IBM Cloud Kubernetes Service plug-in.

    ```
    ibmcloud plugin install container-service
    ```

4. To verify that the plug-in is installed properly, run `ibmcloud plugin list`. The Container Service plug-in is displayed in the results as `container-service/kubernetes-service`.

5.  Initialize the Container Service plug-in and point the endpoint to your region. For example when prompted, enter `5` for `us-east`.

    Example:

    ```
    ibmcloud ks region-set
    Choose a region:
    1. ap-north
    2. ap-south
    3. eu-central
    4. uk-south
    5. us-east
    6. us-south
    Enter a number> 5
    ```

6. Install the `kubectl` Kubernetes CLI. Go to the [Kubernetes page](https://kubernetes.io/docs/tasks/tools/install-kubectl/#install-kubectl-binary-via-curl), and follow the steps to install the CLI.

## Access your cluster
Learn how to set the context to work with your cluster by using the `kubectl` CLI, access the Kubernetes dashboard, and gather basic information about your cluster.

1.  Set the context for your cluster in your CLI. Every time you log in to the IBM Cloud Kubernetes Service CLI to work with the cluster, you must run these commands to set the path to the cluster's configuration file as a session variable. The Kubernetes CLI uses this variable to find a local configuration file and certificates that are necessary to connect with the cluster in IBM Cloud.

    a. List the available clusters.

    ```
    ibmcloud ks clusters
    ```

    b. Download the configuration file and certificates for your cluster using the `cluster-config` command.

    ```
    ibmcloud ks cluster-config <your_cluster_name>
    ```

    c. Copy and paste the output command from the previous step to set the `KUBECONFIG` environment variable and configure your CLI to run `kubectl` commands against your cluster.

    Example:
    ```
    export KUBECONFIG=/Users/user-name/.bluemix/plugins/container-service/clusters/mycluster/kube-config-hou02-mycluster.yml
    ```

2.  Get basic information about your cluster and its worker nodes. This information can help you manage your cluster and troubleshoot issues.

    a.  View details of your cluster.

    ```
    ibmcloud ks cluster-get <your_cluster_name>
    ```

    b.  Verify the worker nodes in the cluster.

    ```
    ibmcloud ks workers <your_cluster_name>
    ibmcloud ks worker-get <worker_ID>
    ```

3.  Validate access to your cluster.

    a.  View nodes in the cluster.

    ```
    kubectl get node
    ```

    b.  View services, deployments, and pods.

    ```
    kubectl get svc,deploy,po --all-namespaces
    ```

## Clone the lab repo

1. From your command line, run:

    ```
    git clone https://github.com/IBM/istio101

    cd istio101/workshop
    ```

    This is the working directory for the workshop. You will use the example `.yaml` files that are located in the `workshop/plans` directory in the following exercises.


#### Hint Accessing a Kubernetes cluster

No hint available


#### Complete Accessing a Kubernetes cluster

> Confirm Accessing a Kubernetes cluster complete




#### Task Installing Istio

----

# Lab 2 - Installing Istio on IBM Cloud Kubernetes Service
In this module, you download and install Istio.

1.  Either download Istio directly from [https://github.com/istio/istio/releases](https://github.com/istio/istio/releases) or get the latest version by using curl:

    ```
    curl -L https://git.io/getLatestIstio | sh -
    ```

2. Change the directory to the Istio file location.

    ```
    cd istio-<version-number>
    ```

3. Add the `istioctl` client to your PATH. 

    ```
    export PATH=$PWD/bin:$PATH
    ```

4. Install Istio’s Custom Resource Definitions via kubectl apply, and wait a few seconds for the CRDs to be committed in the kube-apiserver:

    ```
    for i in install/kubernetes/helm/istio-init/files/crd*yaml; do kubectl apply -f $i; done
    ```

5. Now let's install Istio demo profile into the `istio-system` namespace in your Kubernetes cluster:

    ```
    kubectl apply -f install/kubernetes/istio-demo.yaml
    ```

6. Ensure that the `istio-*` Kubernetes services are deployed before you continue.

    ```
    kubectl get svc -n istio-system
    ```
    Sample output:
    ```
    NAME                     TYPE           CLUSTER-IP       EXTERNAL-IP      PORT(S)                                                                                                                                      AGE
    grafana                  ClusterIP      172.21.135.33    <none>           3000/TCP                                                                                                                                     35s
    istio-citadel            ClusterIP      172.21.242.77    <none>           8060/TCP,15014/TCP                                                                                                                           34s
    istio-egressgateway      ClusterIP      172.21.20.200    <none>           80/TCP,443/TCP,15443/TCP                                                                                                                     35s
    istio-galley             ClusterIP      172.21.246.214   <none>           443/TCP,15014/TCP,9901/TCP                                                                                                                   36s
    istio-ingressgateway     LoadBalancer   172.21.151.128   169.60.168.234   80:31380/TCP,443:31390/TCP,31400:31400/TCP,15029:32268/TCP,15030:30743/TCP,15031:32200/TCP,15032:31341/TCP,15443:31059/TCP,15020:31039/TCP   35s
    istio-pilot              ClusterIP      172.21.243.70    <none>           15010/TCP,15011/TCP,8080/TCP,15014/TCP                                                                                                       34s
    istio-policy             ClusterIP      172.21.144.137   <none>           9091/TCP,15004/TCP,15014/TCP                                                                                                                 34s
    istio-sidecar-injector   ClusterIP      172.21.230.192   <none>           443/TCP                                                                                                                                      33s
    istio-telemetry          ClusterIP      172.21.213.11    <none>           9091/TCP,15004/TCP,15014/TCP,42422/TCP                                                                                                       34s
    jaeger-agent             ClusterIP      None             <none>           5775/UDP,6831/UDP,6832/UDP                                                                                                                   29s
    jaeger-collector         ClusterIP      172.21.187.128   <none>           14267/TCP,14268/TCP                                                                                                                          29s
    jaeger-query             ClusterIP      172.21.89.210    <none>           16686/TCP                                                                                                                                    30s
    kiali                    ClusterIP      172.21.219.101   <none>           20001/TCP                                                                                                                                    35s
    prometheus               ClusterIP      172.21.53.185    <none>           9090/TCP                                                                                                                                     34s
    tracing                  ClusterIP      172.21.6.64      <none>           80/TCP                                                                                                                                       29s
    zipkin                   ClusterIP      172.21.229.37    <none>           9411/TCP                                                                                                                                     29s
    ```

**Note: If your istio-ingressgateway service IP is <pending>, confirm that you are using a standard/paid cluster. Free cluster is not supported for this lab.**

1. Ensure the corresponding pods `istio-citadel-*`, `istio-ingressgateway-*`, `istio-pilot-*`, and `istio-policy-*` are all in **`Running`** state before you continue.

    ```
    kubectl get pods -n istio-system
    ```
    Sample output:
    ```
    NAME                                      READY   STATUS      RESTARTS   AGE
    grafana-5c45779547-v77cl                  1/1     Running     0          103s
    istio-citadel-79cb95445b-29wvj            1/1     Running     0          102s
    istio-cleanup-secrets-1.1.0-mp6qq         0/1     Completed   0          112s
    istio-egressgateway-6dfb8dd765-jzzxf      1/1     Running     0          104s
    istio-galley-7bccb97448-tk8bz             1/1     Running     0          104s
    istio-grafana-post-install-1.1.0-bvng6    0/1     Completed   0          113s
    istio-ingressgateway-679bd59c6-5bsbr      1/1     Running     0          104s
    istio-pilot-674d4b8469-ttxs8              2/2     Running     0          103s
    istio-policy-6b8795b6b5-g5m2k             2/2     Running     2          103s
    istio-security-post-install-1.1.0-cfqpx   0/1     Completed   0          111s
    istio-sidecar-injector-646d77f96c-55twm   1/1     Running     0          102s
    istio-telemetry-76c8fbc99f-hxskk          2/2     Running     2          103s
    istio-tracing-5fbc94c494-5nkjd            1/1     Running     0          102s
    kiali-56d95cf466-bpgfq                    1/1     Running     0          103s
    prometheus-8647cf4bc7-qnp6x               1/1     Running     0          102s
    ```

    Before you continue, make sure all the pods are deployed and are either in the **`Running`** or **`Completed`** state. If they're in `pending` state, wait a few minutes to let the deployment finish.

    Congratulations! You successfully installed Istio into your cluster.



#### Hint Installing Istio

No hint available


#### Complete Installing Istio

> Confirm Installing Istio complete



#### Task Deploy the Guestbook app

----
# Lab 3 - Deploy the Guestbook app with Istio Proxy

The Guestbook app is a sample app for users to leave comments. It consists of a web front end, Redis master for storage, and a replicated set of Redis slaves. We will also integrate the app with Watson Tone Analyzer which detects the sentiment in users' comments and replies with emoticons.

### Download the Guestbook app
1. Clone the Guestbook app into the `workshop` directory.

    ```
    git clone https://github.com/IBM/guestbook.git ../guestbook
    ```

2. Navigate into the app directory.

    ```
    cd ../guestbook/v2
    ```

### Create a Redis database
The Redis database is a service that you can use to persist the data of your app. The Redis database comes with a master and slave modules.

1. Create the Redis controllers and services for both the master and the slave.

    ```
    kubectl create -f redis-master-deployment.yaml
    kubectl create -f redis-master-service.yaml
    kubectl create -f redis-slave-deployment.yaml
    kubectl create -f redis-slave-service.yaml
    ```

2. Verify that the Redis controllers for the master and the slave are created.

    ```
    kubectl get deployment
    ```
    Output:
    ```
    NAME           DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
    redis-master   1         1         1            1           5d
    redis-slave    2         2         2            2           5d
    ```

3. Verify that the Redis services for the master and the slave are created.

    ```
    kubectl get svc
    ```
    Output:
    ```
    NAME           TYPE           CLUSTER-IP      EXTERNAL-IP     PORT(S)        AGE
    redis-master   ClusterIP      172.21.85.39    <none>          6379/TCP       5d
    redis-slave    ClusterIP      172.21.205.35   <none>          6379/TCP       5d
    ```

4. Verify that the Redis pods for the master and the slave are up and running.

    ```
    kubectl get pods
    ```
    Output:
    ```
    NAME                            READY     STATUS    RESTARTS   AGE
    redis-master-4sswq              1/1       Running   0          5d
    redis-slave-kj8jp               1/1       Running   0          5d
    redis-slave-nslps               1/1       Running   0          5d
    ```

## Sidecar injection

In Kubernetes, a sidecar is a utility container in the pod, and its purpose is to support the main container. For Istio to work, Envoy proxies must be deployed as sidecars to each pod of the deployment. There are two ways of injecting the Istio sidecar into a pod: manually using the istioctl CLI tool or automatically using the Istio Initializer. In this exercise, we will use the manual injection. Manual injection modifies the controller configuration, e.g. deployment. It does this by modifying the pod template spec such that all pods for that deployment are created with the injected sidecar.

## Install the Guestbook app with manual sidecar injection

1. Inject the Istio Envoy sidecar into the guestbook pods, and deploy the Guestbook app on to the Kubernetes cluster. Deploy both the v1 and v2 versions of the app:

    ```
    kubectl apply -f <(istioctl kube-inject -f ../v1/guestbook-deployment.yaml)
    kubectl apply -f <(istioctl kube-inject -f guestbook-deployment.yaml)
    ```

These commands will inject the Istio Envoy sidecar into the guestbook pods, as well as deploy the Guestbook app on to the Kubernetes cluster. Here we have two versions of deployments, a new version (`v2`) in the current directory, and a previous version (`v1`) in a sibling directory. They will be used in future sections to showcase the Istio traffic routing capabilities.

2. Create the guestbook service.

    ```
    kubectl create -f guestbook-service.yaml
    ```

3. Verify that the service was created.

    ```
    kubectl get svc
    ```
    Output:
    ```
    NAME           TYPE           CLUSTER-IP      EXTERNAL-IP     PORT(S)        AGE
    guestbook      LoadBalancer   172.21.36.181   169.61.37.140   80:32149/TCP   5d
    ```

4. Verify that the pods are up and running.

    ```
    kubectl get pods
    ```
    Output:
    ```
    NAME                            READY     STATUS    RESTARTS   AGE
    guestbook-v1-89cd4b7c7-frscs    2/2       Running   0          5d
    guestbook-v1-89cd4b7c7-jn224    2/2       Running   0          5d
    guestbook-v1-89cd4b7c7-m7hmd    2/2       Running   0          5d
    guestbook-v2-56d98b558c-7fvd5   2/2       Running   0          5d
    guestbook-v2-56d98b558c-dshkh   2/2       Running   0          5d
    guestbook-v2-56d98b558c-mzbxk   2/2       Running   0          5d
    ```

    Note that each guestbook pod has 2 containers in it. One is the guestbook container, and the other is the Envoy proxy sidecar.

### Use Watson Tone Analyzer
Watson Tone Analyzer detects the tone from the words that users enter into the Guestbook app. The tone is converted to the corresponding emoticons.

1. Create Watson Tone Analyzer in your account.

    ```
    ibmcloud resource service-instance-create my-tone-analyzer-service tone-analyzer lite us-south
    ```

2. Create the service key for the Tone Analyzer service. This command should output the credentials you just created. You will need the value for **apikey** & **url** later.

    ```
    ibmcloud resource service-key-create tone-analyzer-key Manager --instance-name my-tone-analyzer-service
    ```

3. If you need to get the service-keys later, you can use the following command:

    ```
    ibmcloud resource service-key tone-analyzer-key
    ```

4. Open the `analyzer-deployment.yaml` and find the env section near the end of the file. Replace `YOUR_API_KEY` with your own API key, and replace `YOUR_URL` with the url value you saved before. YOUR_URL should look something like `https://gateway.watsonplatform.net/tone-analyzer/api`. Save the file.

5. Deploy the analyzer pods and service, using the `analyzer-deployment.yaml` and `analyzer-service.yaml` files found in the `guestbook/v2` directory. The analyzer service talks to Watson Tone Analyzer to help analyze the tone of a message.

    ```
    kubectl apply -f <(istioctl kube-inject -f analyzer-deployment.yaml)
    kubectl apply -f analyzer-service.yaml
    ```

Great! Your guestbook app is up and running. In Exercise 4, you'll be able to see the app in action by directly accessing the service endpoint. You'll also be able to view Telemetry data for the app.




#### Hint Deploy the Guestbook app

No hint available


#### Complete Deploy the Guestbook app

> Confirm aa complete




#### Task Observe service telemetry

----
# Lab 4 - Observe service telemetry: metrics and tracing

### Challenges with microservices

We all know that microservice architecture is the perfect fit for cloud native applications and it increases the delivery velocities greatly. Envision you have many microservices that are delivered by multiple teams, how do you observe the the overall platform and each of the service to find out exactly what is going on with each of the services?  When something goes wrong, how do you know which service or which communication among the few services are causing the problem?

### Istio telemetry

Istio's tracing and metrics features are designed to provide broad and granular insight into the health of all services. Istio's role as a service mesh makes it the ideal data source for observability information, particularly in a microservices environment. As requests pass through multiple services, identifying performance bottlenecks becomes increasingly difficult using traditional debugging techniques. Distributed tracing provides a holistic view of requests transiting through multiple services, allowing for immediate identification of latency issues. With Istio, distributed tracing comes by default. This will expose latency, retry, and failure information for each hop in a request.

You can read more about how [Istio mixer enables telemetry reporting](https://istio.io/docs/concepts/policy-and-control/mixer.html).

### Configure Istio to receive telemetry data

1. Verify that the Grafana, Prometheus, ServiceGraph and Jaeger add-ons were installed successfully. All add-ons are installed into the `istio-system` namespace.

    ```
    kubectl get pods -n istio-system
    kubectl get services -n istio-system
    ```

2. Configure Istio to automatically gather telemetry data for services that run in the service mesh. Create a rule to collect telemetry data.
    ```
    cd ../../plans/
    kubectl create -f guestbook-telemetry.yaml
    ```

1. Obtain the guestbook endpoint to access the guestbook. You can access the guestbook via the external IP for your service as guestbook is deployed as a load balancer service. Get the EXTERNAL-IP of the guestbook service via output below:

    ```
    kubectl get service guestbook -n default
    ```

Go to this external ip address in the browser to try out your guestbook.

4. Generate a small load to the app.

    ```
    for i in {1..20}; do sleep 0.5; curl http://<guestbook_IP>/; done
    ```

## View guestbook telemetry data

#### Jaeger

1. Establish port forwarding from local port 16686 to the Tracing instance:

    ```
    kubectl port-forward -n istio-system \
      $(kubectl get pod -n istio-system -l app=jaeger -o jsonpath='{.items[0].metadata.name}') \
      16686:16686 &
    ```
2. In your browser, go to `http://127.0.0.1:16686`
3. From the **Services** menu, select either the **guestbook** or **analyzer** service.
4. Scroll to the bottom and click on **Find Traces** button to see traces.

Read more about [Jaeger](https://www.jaegertracing.io/docs/)

#### Grafana

1. Establish port forwarding from local port 3000 to the Grafana instance:

    ```
    kubectl -n istio-system port-forward \
      $(kubectl -n istio-system get pod -l app=grafana -o jsonpath='{.items[0].metadata.name}') \
      3000:3000 &
    ```

2. Browse to http://localhost:3000 and navigate to the `Istio Service Dashboard` by clicking on the Home menu on the top left, then Istio, then Istio Service Dashboard.

3. Select guestbook in the Service drop down.

4. In a different tab, visit the guestbook application and refresh the page multiple times to generate some load, or run the load script you used previously. Switch back to the Grafana tab.

This Grafana dashboard provides metrics for each workload. Explore the other dashboard provided as well. 

Read more about [Grafana](http://docs.grafana.org/).

#### Prometheus

1. Establish port forwarding from local port 9090 to the Prometheus instance.

    ```
    kubectl -n istio-system port-forward \
      $(kubectl -n istio-system get pod -l app=prometheus -o jsonpath='{.items[0].metadata.name}') \
      9090:9090 &
    ```
2. Browse to http://localhost:9090/graph, and in the “Expression” input box, enter: `istio_request_bytes_count`. Click Execute and then select Graph.

3. Then try another query: `istio_requests_total{destination_service="guestbook.default.svc.cluster.local", destination_version="2.0"}`

#### Kiali

Kiali is an open-source project that installs on top of Istio to visualize your service mesh. It provides deeper insight into how your microservices interact with one another, and provides features such as circuit breakers and request rates for your services

1. Establish port forwarding from local port 20001 to the Kiali instance.

    ```
    kubectl -n istio-system port-forward \
    $(kubectl -n istio-system get pod -l app=kiali -o jsonpath='{.items[0].metadata.name}') \
    20001:20001 &
    ```

2. Browse to [http://localhost:20001/kiali/](http://localhost:20001/kiali/), and login with `admin` for both username and password.
3. Select Graph and then choose `default` namespace. You should see a visual service graph of the various services in your Istio mesh.
4. Use the `Edge Labels` dropdown and select `Traffic rate per second` to see the request rates as well.
5. Kiali has a number of views to help you visualize your services. Click through the vairous tabs to explore the service graph, and the various views for workloads, applications, and services.

## Understand what happened

Although Istio proxies are able to automatically send spans, they need some hints to tie together the entire trace. Apps need to propagate the appropriate HTTP headers so that when the proxies send span information to Zipkin or Jaeger, the spans can be correlated correctly into a single trace.

In the example, when a user visits the Guestbook app, the HTTP request is sent from the guestbook service to Watson Tone Analyzer. In order for the individual spans of guestbook service and Watson Tone Analyzer to be tied together, we have modified the guestbook service to extract the required headers (x-request-id, x-b3-traceid, x-b3-spanid, x-b3-parentspanid, x-b3-sampled, x-b3-flags, x-ot-span-context) and forward them onto the analyzer service when calling the analyzer service from the guestbook service. The change is in the `v2/guestbook/main.go`. By using the `getForwardHeaders()` method, we are able to extract the required headers, and then we use the required headers further when calling the analyzer service via the `getPrimaryTone()` method.






#### Hint Observe service telemetry

No hint available


#### Complete Observe service telemetry

> Confirm Observe service telemetry complete



#### Task Expose the service mesh

----

# Lab 5 - Expose the service mesh with the Istio Ingress Gateway

The components deployed on the service mesh by default are not exposed outside the cluster. External access to individual services so far has been provided by creating an external load balancer or node port on each service.

An Ingress Gateway resource can be created to allow external requests through the Istio Ingress Gateway to the backing services.

### Expose the Guestbook app with Ingress Gateway

1. Configure the guestbook default route with the Istio Ingress Gateway. The `guestbook-gateway.yaml` file is in this repository (istio101) in the `workshop/plans` directory.

```
kubectl create -f guestbook-gateway.yaml
```

2. Get the **EXTERNAL-IP** of the Istio Ingress Gateway.

```
kubectl get service istio-ingressgateway -n istio-system
```
Output:
```
NAME                   TYPE           CLUSTER-IP      EXTERNAL-IP     PORT(S)                                       AGE
istio-ingressgateway   LoadBalancer   172.21.254.53    169.6.1.1       80:31380/TCP,443:31390/TCP,31400:31400/TCP    1m
2d
```

3. Make note of the external IP address that you retrieved in the previous step, as it will be used to access the Guestbook app in later parts of the course. You can create an environment variable called $INGRESS_IP with your IP address.

Example:
```
export INGRESS_IP=169.6.1.1
```

## Connect Istio Ingress Gateway to the IBM Cloud Kubernetes Service Provided Domain Name

Standard IBM Cloud Kubernetes Clusters can expose applications deployed within your cluster using a Kubernetes Ingress application load balancer (ALB). IBM Cloud Kubernetes Service automatically creates a highly available ALB for your cluster and assigns a unique public route to it in the format: <cluster_name>.<region_or_zone>.containers.appdomain.cloud.

The Ingress resource provides IBM Cloud users with a secure, reliable, and scalable network stack to distribute incoming network traffic to apps in IBM Cloud. You can enhance the IBM-provided Ingress application load balancer by adding annotations. Learn more about [Ingress for IBM Cloud Kubernetes Service](https://console.bluemix.net/docs/containers/cs_ingress.html#ingress).

To use this IBM provided DNS for the Guestbook app, you must set the Kubernetes Ingress application load balancer (ALB) to route traffic to the Istio Ingress Gateway.

1. Let's first check the IBM Ingress subdomain information.

    ```
    ibmcloud ks cluster-get <cluster_name>
    ```
    Output:
    ```
    Ingress subdomain:	mycluster.us-east.containers.appdomain.cloud
    ```

2. Prepend `guestbook.` to the subdomain that you retrieved in the previous step. This new url will serve as `host` in the `guestbook-frontdoor.yaml` file, which you can find and edit in the `istio101/workshop/plans` directory.

    The file should now look something like this:

    ```
    apiVersion: extensions/v1beta1
    kind: Ingress
    metadata:
      name: guestbook-ingress
      namespace: istio-system
    spec:
      rules:
        - host: guestbook.mycluster.us-east.containers.appdomain.cloud
          http:
            paths:
              - path: /
                backend:
                  serviceName: istio-ingressgateway
                  servicePort: 80
    ```

3. Create the Ingress with the IBM-provided subdomain.

    ```
    kubectl apply -f guestbook-frontdoor.yaml
    ```

4. List the details for your Ingress.

    ```
    kubectl get ingress guestbook-ingress -n istio-system
    ```

    Example output:
    ```
    NAME                HOSTS                                                          ADDRESS          PORTS   AGE
    guestbook-ingress   guestbook.mycluster.us-south.containers.appdomain.cloud   169.60.168.238   80      6s
    ```

5. Make note of the IBM-provided subdomain as it will be used to access your Guestbook app in later parts of the course.

    Example:
    ```
    http://guestbook.mycluster.us-south.containers.appdomain.cloud
    ```

Congratulations! You extended the base Ingress features by providing a DNS entry to the Istio service.

## References:
[Kubernetes Ingress](https://kubernetes.io/docs/concepts/services-networking/ingress/)
[Istio Ingress](https://istio.io/docs/tasks/traffic-management/ingress.html)




#### Hint Expose the service mesh

No hint available


#### Complete Expose the service mesh

> Confirm Expose the service mesh complete




#### Task Perform traffic management

----

# Lab 6 - Perform traffic management

## Using rules to manage traffic
The core component used for traffic management in Istio is Pilot, which manages and configures all the Envoy proxy instances deployed in a particular Istio service mesh. It lets you specify what rules you want to use to route traffic between Envoy proxies, which run as sidecars to each service in the mesh. Each service consists of any number of instances running on pods, containers, VMs etc. Each service can have any number of versions (a.k.a. subsets). There can be distinct subsets of service instances running different variants of the app binary. These variants are not necessarily different API versions. They could be iterative changes to the same service, deployed in different environments (prod, staging, dev, etc.). Pilot translates high-level rules into low-level configurations and distributes this config to Envoy instances. Pilot uses three types of configuration resources to manage traffic within its service mesh: Virtual Services, Destination Rules, and Service Entries.

### Virtual Services
A [VirtualService](https://istio.io/docs/reference/config/istio.networking.v1alpha3/#VirtualService) defines a set of traffic routing rules to apply when a host is addressed. Each routing rule defines matching criteria for traffic of a specific protocol. If the traffic is matched, then it is sent to a named [destination](https://istio.io/docs/reference/config/istio.networking.v1alpha3.html#Destination) service (or [subset](https://istio.io/docs/reference/config/istio.networking.v1alpha3/#Subset) or version of it) defined in the service registry.

### Destination Rules
A [DestinationRule](https://istio.io/docs/reference/config/istio.networking.v1alpha3/#Destination) defines policies that apply to traffic intended for a service after routing has occurred. These rules specify configuration for load balancing, connection pool size from the sidecar, and outlier detection settings to detect and evict unhealthy hosts from the load balancing pool. Any destination `host` and `subset` referenced in a `VirtualService` rule must be defined in a corresponding `DestinationRule`.

### Service Entries
A [ServiceEntry](https://istio.io/docs/reference/config/istio.networking.v1alpha3.html#ServiceEntry) configuration enables services within the mesh to access a service not necessarily managed by Istio. The rule describes the endpoints, ports and protocols of a white-listed set of mesh-external domains and IP blocks that services in the mesh are allowed to access.

## The Guestbook app
In the Guestbook app, there is one service: guestbook. The guestbook service has two distinct versions: the base version (version 1) and the modernized version (version 2). Each version of the service has three instances based on the number of replicas in [guestbook-deployment.yaml](https://github.com/linsun/examples/blob/master/guestbook-go/guestbook-deployment.yaml) and [guestbook-v2-deployment.yaml](https://github.com/linsun/examples/blob/master/guestbook-go/guestbook-v2-deployment.yaml). By default, prior to creating any rules, Istio will route requests equally across version 1 and version 2 of the guestbook service and their respective instances in a round robin manner. However, new versions of a service can easily introduce bugs to the service mesh, so following A/B Testing and Canary Deployments is good practice.

### A/B testing with Istio
A/B testing is a method of performing identical tests against two separate service versions in order to determine which performs better. To prevent Istio from performing the default routing behavior between the original and modernized guestbook service, define the following rules (found in [istio101/workshop/plans](https://github.com/IBM/istio101/tree/master/workshop/plans)):

```
kubectl create -f guestbook-destination.yaml
```
Let's examine the rule:

```
apiVersion: networking.istio.io/v1alpha3
kind: DestinationRule
metadata:
  name: destination-guestbook
spec:
  host: guestbook
  subsets:
    - name: v1
      labels:
        version: '1.0'
    - name: v2
      labels:
        version: '2.0'
```

```
kubectl replace -f virtualservice-all-v1.yaml
```
Let's examine the rule:

```
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: virtual-service-guestbook
spec:
  hosts:
    - '*'
  gateways:
    - guestbook-gateway
  http:
    - route:
        - destination:
            host: guestbook
            subset: v1
```

The `VirtualService` defines a rule that captures all HTTP traffic coming in through the Istio ingress gateway, `guestbook-gateway`, and routes 100% of the traffic to pods of the guestbook service with label "version: v1". A subset or version of a route destination is identified with a reference to a named service subset which must be declared in a corresponding `DestinationRule`. Since there are three instances matching the criteria of hostname `guestbook` and subset `version: v1`, by default Envoy will send traffic to all three instances in a round robin manner. You can view the guestbook service UI using the IP address and port obtained in [Exercise 5](../exercise-5/README.md) and enter it as a URL in Firefox or Chrome web browsers.

To enable the Istio service mesh for A/B testing against the new service version, modify the original `VirtualService` rule:

```
kubectl replace -f virtualservice-test.yaml
```
Let's examine the rule:

```
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: virtual-service-guestbook
spec:
  hosts:
    - '*'
  gateways:
    - guestbook-gateway
  http:
    - match:
        - headers:
            user-agent:
              regex: '.*Firefox.*'
      route:
        - destination:
            host: guestbook
            subset: v2
    - route:
        - destination:
            host: guestbook
            subset: v1
```

In Istio `VirtualService` rules, there can be only one rule for each service and therefore when defining multiple [HTTPRoute](https://istio.io/docs/reference/config/istio.networking.v1alpha3/#HTTPRoute) blocks, the order in which they are defined in the yaml matters. Hence, the original `VirtualService` rule is modified rather than creating a new rule. With the modified rule, incoming requests originating from `Firefox` browsers will go to the newer version of guestbook. All other requests fall-through to the next block, which routes all traffic to the original version of guestbook.


### Canary deployment
In `Canary Deployments`, newer versions of services are incrementally rolled out to users to minimize the risk and impact of any bugs introduced by the newer version. To begin incrementally routing traffic to the newer version of the guestbook service, modify the original `VirtualService` rule:

```
kubectl replace -f virtualservice-80-20.yaml
```
Let's examine the rule:

```
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: virtual-service-guestbook
spec:
  hosts:
    - '*'
  gateways:
    - guestbook-gateway
  http:
    - route:
        - destination:
            host: guestbook
            subset: v1
          weight: 80
        - destination:
            host: guestbook
            subset: v2
          weight: 20
```

In the modified rule, the routed traffic is split between two different subsets of the guestbook service. In this manner, traffic to the modernized version 2 of guestbook is controlled on a percentage basis to limit the impact of any unforeseen bugs. This rule can be modified over time until eventually all traffic is directed to the newer version of the service.

You can see this in action by going to the ingress ip address (that you saved in exercise 5) in your browser. Ensure that you are using a hard refresh (command + Shift + R on Mac or Ctrl + F5 on windows) to remove any browser caching. You should notice that the guestbook should swap between V1 or V2 at about the weight you specified.

If you have a paid cluster, you can also access the guestbook app via the subdomain you saved in exercise 5.

### Implementing circuit breakers with destination rules
Istio `DestinationRules` allow users to configure Envoy's implementation of [circuit breakers](https://www.envoyproxy.io/docs/envoy/latest/intro/arch_overview/circuit_breaking). Circuit breakers are critical for defining the behavior for service-to-service communication in the service mesh. In the event of a failure for a particular service, circuit breakers allow users to set global defaults for failure recovery on a per service and/or per service version basis. Users can apply a [traffic policy](https://istio.io/docs/reference/config/istio.networking.v1alpha3.html#TrafficPolicy) at the top level of the `DestinationRule` to create circuit breaker settings for an entire service, or it can be defined at the subset level to create settings for a particular version of a service.

Depending on whether a service handles [HTTP](https://istio.io/docs/reference/config/istio.networking.v1alpha3/#ConnectionPoolSettings.HTTPSettings) requests or [TCP](https://istio.io/docs/reference/config/istio.networking.v1alpha3/#ConnectionPoolSettings.TCPSettings) connections, `DestinationRules` expose a number of ways for Envoy to limit traffic to a particular service as well as define failure recovery behavior for services initiating the connection to an unhealthy service.

## Further reading
* [Istio Concept](https://istio.io/docs/concepts/traffic-management/)
* [Istio Rules API](https://istio.io/docs/reference/config/istio.networking.v1alpha3)
* [Istio V1alpha1 to V1alpha3 Converter Tool](https://istio.io/docs/reference/commands/istioctl.html#istioctl%20experimental%20convert-networking-config)
* [Istio Proxy Debug Tool](https://istio.io/docs/reference/commands/istioctl/#istioctl%20proxy-config)
* [Traffic Management](https://blog.openshift.com/istio-traffic-management-diving-deeper/)
* [Circuit Breaking](https://blog.openshift.com/microservices-patterns-envoy-part-i/)
* [Timeouts and Retries](https://blog.openshift.com/microservices-patterns-envoy-proxy-part-ii-timeouts-retries/)




#### Hint Perform traffic management

No hint available


#### Complete Perform traffic management

> Confirm Perform traffic management complete





#### Task Secure your services

----

# Lab 7 - Secure your services

## Mutual authentication with Transport Layer Security (mTLS)

Istio can secure the communication between microservices without requiring application code changes. Security is provided by authenticating and encrypting communication paths within the cluster. This is becoming a common security and compliance requirement. Delegating communication security to Istio (as opposed to implementing TLS in each microservice), ensures that your application will be deployed with consistent and manageable security policies.

Istio Citadel is an optional part of Istio's control plane components. When enabled, it provides each Envoy sidecar proxy with a strong (cryptographic) identity, in the form of a certificate.
Identity is based on the microservice's service account and is independent of its specific network location, such as cluster or current IP address.
Envoys then use the certificates to identify each other and establish an authenticated and encrypted communication channel between them.

Citadel is responsible for:

* Providing each service with an identity representing its role.

* Providing a common trust root to allow Envoys to validate and authenticate each other.

* Providing a key management system, automating generation, distribution, and rotation of certificates and keys.

When an application microservice connects to another microservice, the communication is redirected through the client side and server side Envoys. The end-to-end communication path is:

* Local TCP connection (i.e., `localhost`, not reaching the "wire") between the application and Envoy (client- and server-side);

* Mutually authenticated and encrypted connection between Envoy proxies.

When Envoy proxies establish a connection, they exchange and validate certificates to confirm that each is indeed connected to a valid and expected peer. The established identities can later be used as basis for policy checks (e.g., access authorization).

## Steps

> Version 2 of the guestbook application uses an external service (tone analyzer) which is not Istio-enabled.
> Thus, we will disable mTLS globally and enable it only for communication between internal cluster services in this lab.

1. Ensure Citadel is running

    Citadel is Istio's in-cluster Certificate Authority (CA) and is required for generating and managing cryptographic identities in the cluster.
    Verify Citadel is running:

    ```
    kubectl get deployment -l istio=citadel -n istio-system
    ```

    Expected output:

    ```
    NAME            DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
    istio-citadel   1         1         1            1           15h
    ```

2. Define mTLS Authentication Policy

    Define mTLS authentication policy for the analyzer service:

```
cat <<EOF | kubectl create -f -
apiVersion: authentication.istio.io/v1alpha1
kind: Policy
metadata:
  name: mtls-to-analyzer
  namespace: default
spec:
  targets:
  - name: analyzer
  peers:
  - mtls:
EOF
```

    You should see:
    ```
    policy.authentication.istio.io/mtls-to-analyzer created
    ```

    Confirm the policy has been created:
    ```
    kubectl get policies.authentication.istio.io
    ```
    Output:
    ```
    NAME              AGE
    mtls-to-analyzer  1m
    ```

3. Enable mTLS from guestbook using a Destination rule

```
cat <<EOF | kubectl create -f -
apiVersion: networking.istio.io/v1alpha3
kind: DestinationRule
metadata:
  name: route-with-mtls-for-analyzer
  namespace: default
spec:
  host: "analyzer.default.svc.cluster.local"
  trafficPolicy:
    tls:
      mode: ISTIO_MUTUAL
EOF
```
    Output:
    ```
    destinationrule.networking.istio.io/route-with-mtls-for-analyzer created
    ```

## Verifying the Authenticated Connection

If mTLS is working correctly, the Guestbook app should continue to operate as expected, without any user visible impact. Istio will automatically add (and manage) the required certificates and private keys. 




## Further Reading

* [Basic TLS/SSL Terminology](https://dzone.com/articles/tlsssl-terminology-and-basics)

* [TLS Handshake Explained](https://www.ibm.com/support/knowledgecenter/en/SSFKSJ_7.1.0/com.ibm.mq.doc/sy10660_.htm)

* [Istio Task](https://istio.io/docs/tasks/security/mutual-tls.html)

* [Istio Concept](https://istio.io/docs/concepts/security/mutual-tls.html)




#### Hint Secure your services

No hint available


#### Complete Secure your services

> Confirm Secure your services complete




#### Task Enforce policies 

----


# Lab 8 - Enforce policies for microservices

Backend systems such as access control systems, telemetry capturing systems, quota enforcement systems, billing systems, and so forth, traditionally directly integrate with services, creating a hard coupling and baking-in specific semantics and usage options.

Istio Mixer provides a generic intermediation layer between app code and infrastructure backends. Its design moves policy decisions out of the app layer and into configuration instead, under operator control. Instead of having app code integrate with specific backends, the app code instead does a fairly simple integration with Mixer, and Mixer takes responsibility for interfacing with the backend systems.

Given that individual infrastructure backends each have different interfaces and operational models, Mixer needs custom code to deal with each and we call these custom bundles of code **adapters**. Some built-in adapters include denier, prometheus,  memquota, and stackdriver.

In this exercise we'll use the denier adapter.

## Service isolation with the denier adapter

1. Block access to Guestbook service:

    ```
    kubectl create -f mixer-rule-denial.yaml
    ```

    Let's examine the rule:
    
    ```
        apiVersion: "config.istio.io/v1alpha2"
        kind: denier
        metadata:
          name: denyall
          namespace: istio-system
        spec:
          status:
            code: 7
            message: Not allowed
        ---
        # The (empty) data handed to denyall at run time
        apiVersion: "config.istio.io/v1alpha2"
        kind: checknothing
        metadata:
          name: denyrequest
          namespace: istio-system
        spec:
        ---
        # The rule that uses denier to deny requests to the guestbook service
        apiVersion: "config.istio.io/v1alpha2"
        kind: rule
        metadata:
          name: deny-hello-world
          namespace: istio-system
        spec:
          match: destination.service=="guestbook.default.svc.cluster.local"
          actions:
          - handler: denyall.denier
            instances:
            - denyrequest.checknothing
    ```

2. Verify that the service is denied:

   In [Exercise 5](../exercise-5/README.md), we created the Ingress resource. Make sure the $INGRESS_IP environment variable is still present. Then in the terminal, try:

    ```
    curl http://$INGRESS_IP/
    ```

    You should see the error message `PERMISSION_DENIED:denyall.denier.istio-system:Not allowed`.

    You can also try visiting the guestbook app in the browser, and you should see the same error message.

3. Clean up the rule.

    ```
    kubectl delete -f mixer-rule-denial.yaml
    ```


## Further reading
* [Istio Mixer](https://istio.io/docs/concepts/policy-and-control/mixer.html)
* [How to write istio mixer policies](https://medium.com/@szihai_37982/how-to-write-istio-mixer-policies-50dc639acf75)



#### Hint Enforce policies 

No hint available


#### Complete Enforce policies 

> Confirm Enforce policies complete



#### Task Quiz 

----

## Quiz
1. Does creating mixer rules require app code changes? 

	```
	A. Yes 
	B. No 
	```

2. The custom code that interacts with the backend system, i.e. Prometheus, is called

	```
	A. Rule 
	B. Instance 
	C. Adapter
	```

3. Istio Citadel provides each microservice with a strong, cryptographic, identity in the form of a certificate. The certificates' life cycle is fully managed by Istio. 

	```
	A. True 
	B. False  
	```

4. Istio provides microservices with mutually authenticated connections, without requiring app code changes.


	```
	A. True 
	B. False  
	```


5. Mutual authentication must be on or off for the entire cluster, gradual adoption is not possible. 


	```
	A. True 
	B. False  
	```

6. Which of the following are the features provided by Istio?
	
	```
	A. Traffic Management   
	B. Telemtry   
	C. Policy Enforcement
	D. Machine Learning
	E. Mutual TLS
	F. API Connect	
	```



7. Can microservices deployed in Istio communicate to services outside of Istio?

	```
	A. Yes 
	B. No
	```
	
8. Which Istio function normally requires user to modify their application?

	```
	A. Traffic Management   
	B. Metrics   
	C Distributed Tracing   
	D. Policy Enforcement 
	```


9. Which Istio component is always required when user chooses to only install certain Istio features?
	
	```
	A. Mixer  
	B. Pilot
	C. Citadel
	D. Istioctl
	```


10. Which Istio components below are part of the Istio service mesh data plane?
	
	```
	A. Mixer  
	B. Pilot  
	C. Citadel  
	D. Envoy side car
	```

11. Which Istio features allow user to configure per namespace?

	```
	A. Policy enforcement
	B. Traffic Management
	C. Authentication Policy
	D. Telemtry
	```


12. To leverage Istio, does my service have to run in Kubernetes?

	```
	A. Yes 
	B. No
	```


13. What’s the purpose of sidecar container in Kubernetes?
 
	```   
    A. It’s a container with Istio installed
    B. It’s utility container in the pod
    C. It helps to speed up the cluster run time
    D. None of the above
	```    
 

14. What Istio component primarily manages telemetry ? 
    
	```
    A. Pilot
    B. Istio-auth
    C. Mixer
    D. Istio data plane
	```



15. What’s an Envoy?

	```    
    A. It’s web server
    B. It’s sidecar proxy
    C. Both
    D. None
	```    
 
16. What component is primarily responsible for traffic management?

	```    
    A. Pilot
    B. Mixer
    C. Istio-auth
    D. Security
	```
    
17. A VirtualService defines policies that apply to traffic intended for a service after routing has occurred.
    
	```	
    A. Yes
    B. No
	```
    
18. ServiceEntry configuration enables services within the mesh to access a service not necessarily managed by Istio.
    
	```
    A. Yes
    B. No
	```    


19. A/B is a method of performing identical tests against two separate service versions in order to determine which performs better.

	```    
    A. Yes
    B. No
	```
	     
  

20. What is the default side car proxy in Istio?

	```    
    A. Nginx
    B. Linkerd
    C. Envoy
    D. None of the above
	```

21. With what Istio components one can enable users to write custom adapters for tracing and metrics?
    
	```    
    A. Istio-auth
    B. Mixer
    C. Pilot
    D. Envoy
	```





#### Hint Quiz

No hint available


#### Complete Quiz

> Confirm Quiz complete


