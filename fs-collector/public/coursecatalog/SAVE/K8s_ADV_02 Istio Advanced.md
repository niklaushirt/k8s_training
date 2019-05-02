
:course_title: K8s_ADV_02 Istio - Advanced

:course_desc: This course introduces the student to more advanced topics of Istio.  

:course_max: 4

:course_auto: no

:button1_label: Task

:button2_label: Hint

:button2_delay: 999999

:button3_label: Complete

:button3_delay: 300



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

## Telemetry data aggregation using Istio Mixer - Collect metrics, logs and trace spans
asdgagsdgasd

----

#### Hint Introduction

No hint available


#### Complete Introduction

> Confirm Introduction complete


----

#### Task Policy Enforcment

----

## Access policy enforcement using Istio Mixer - Configure access control

This step shows you how to control access to your services. It helps to reset the routing rules to ensure that we are starting with a known configuration. The following commands will first set all review requests to v1, and then apply a rule to route requests from user _jason_ to v2, while all others go to v3:

```
   kubectl apply -f ~/istio/samples/bookinfo/networking/virtual-service-all-v1.yaml -n default
   kubectl apply -f ~/istio/samples/bookinfo/networking/virtual-service-reviews-jason-v2-v3.yaml -n default
```

You'll now see that your `productpage` always red stars on the reviews section if not logged in, and always shows black stars when logged in as _jason_.

* To deny access to the ratings service for all traffic coming from `reviews-v3`, you will use apply these rules:
  ```
   kubectl apply -f ~/istio/samples/bookinfo/policy/mixer-rule-deny-label.yaml -n default
   kubectl apply -f ~/istio/samples/bookinfo/policy/mixer-rule-ratings-denial.yaml
  ```

* To verify if your rule has been enforced, point your browser to your BookInfo Application. You'll notice you see no stars from the reviews section unless you are logged in as _jason_, in which case you'll see black stars.

![access-control](https://raw.githubusercontent.com/niklaushirt/istio-introduction/master/images/access.png)

And in Kiali you should see the following:

![access-control](https://raw.githubusercontent.com/niklaushirt/istio-introduction/master/images/kiali_2.png)



#### Hint Policy Enforcment

No hint available


#### Complete Policy Enforcment

> Confirm Policy Enforcment complete




----

#### Task Istio Monitoring

----

## Collect metrics and logs using Prometheus and Grafana

This step shows you how to configure [Istio Mixer](https://istio.io/docs/concepts/policy-and-control/mixer.html) to gather telemetry for services in your cluster.


* Verify that the required Istio addons (Prometheus and Grafana) are available in your cluster:

  ```
  kubectl get pods -n istio-system | grep -E 'prometheus|grafana'
  
  grafana-6cbdcfb45-bwmtm                     1/1       Running     0          4d
  istio-grafana-post-install-h2dgz            0/1       Completed   1          4d
  prometheus-84bd4b9796-vnb58                 1/1       Running     0          4d
  ```

* Make sure you still send traffic to that service. You can renew the `watch` command from earlier.


* Point your browser to [`http://10.0.0.1:31118/`](http://10.0.0.1:31118) (replace 10.0.0.1 with the address of your cluster)


  Your dashboard should look like this:  
  ![Grafana-Dashboard](https://raw.githubusercontent.com/niklaushirt/istio-introduction/master/images/grafana_1.png)
 
Play around and observer the different metrics being collected.

[Collecting Metrics and Logs on Istio](https://istio.io/docs/tasks/telemetry/metrics-logs.html)


----

#### Hint Istio Monitoring

No hint available


#### Complete Istio Monitoring

> Confirm Istio Monitoring complete





----

#### Task Istio Tracing

----

## Collect request traces using Jaeger

Jaeger is a distributed tracing tool that is available with Istio.

  Access the Jaeger dashboard at [`http://10.0.0.1:31117/`](http://10.0.0.1:31117) (replace 10.0.0.1 with the address of your cluster)

  Your dashboard should look something like this:
  
  ![jaeger](https://raw.githubusercontent.com/niklaushirt/istio-introduction/master/images/jaeger1.png)

* Make sure you still send traffic to that service. You can renew the `watch` command from earlier.

* Go to your Jeger Dashboard again and you will see a number of traces done. Click on Find Traces button to see the recent traces (previous hour by default.)

![jaeger](https://raw.githubusercontent.com/niklaushirt/istio-introduction/master/images/jaeger2.png)

* Click on one of those traces and you will see the details of the traffic you sent to your BookInfo App. It shows how much time it took for the request on `productpage` to finish. It also shows how much time it took for the requests on the `details`,`reviews`, and `ratings` services.

![jaeger](https://raw.githubusercontent.com/niklaushirt/istio-introduction/master/images/jaeger3.png)

[Jaeger Tracing on Istio](https://istio.io/docs/tasks/telemetry/distributed-tracing/)



#### Hint Istio Tracing

No hint available


#### Complete Istio Tracing

> Confirm Istio Tracing complete




----

#### Task Lab Cleanup

----

# Clean-up


* To delete the BookInfo app and its route-rules: ` ~/istio/samples/bookinfo/platform/kube/cleanup.sh`

* To delete Istio from your cluster

```
kubectl delete -f ~/istio/samples/bookinfo/policy/mixer-rule-deny-label.yaml -n default
kubectl delete -f ~/istio/samples/bookinfo/policy/mixer-rule-ratings-denial.yaml
kubectl delete -f https://raw.githubusercontent.com/niklaushirt/microservices-traffic-management-using-istio/master/istio.yaml
kubectl delete -f ~/istio/install/kubernetes/helm/istio/templates/crds.yaml
kubectl delete ns istio-system

```


#### Hint Lab Cleanup

No hint available


#### Complete Lab Cleanup

> Confirm Lab Cleanup complete








