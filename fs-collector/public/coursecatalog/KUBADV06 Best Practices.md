
:course_title: KUBADV06 Knative

:course_desc: This course provides the student with the in-depth insights and best practices of Kubernetes.  

:course_max: 7

:course_auto: no

:button1_label: Task

:button2_label: Hint

:button2_delay: 999999

:button3_label: Complete

:button3_delay: 10000







----
#### Task Memory Limit of POD and OOM Killer

----


In the past few days, some of my Pods kept on crashing and OS Syslog shows the OOM killer kills the container process. I did some research to find out how these thing works.

#### Pod memory limit and cgroup memory settings

Let's test on K3s. Create a pod setting the memory limit to 123Mi, a number that can be recognized easily.
    
    kubectl run --restart=Never --rm -it --image=ubuntu --limits='memory=123Mi' -- sh  
    If you don't see a command prompt, try pressing enter.  
    root@sh:/# 

In another shell, find out the uid of the pods,
    
    kubectl get pods sh -o yaml | grep uid  
     uid: bc001ffa-68fc-11e9-92d7-5ef9efd9374c

At the server where the pod is running, check the cgroup settings based on the uid of the pods,
    
    cd /sys/fs/cgroup/memory/kubepods/burstable/podbc001ffa-68fc-11e9-92d7-5ef9efd9374c
    
    cat memory.limit_in_bytes  
    128974848

The number 128974848 is exact 123Mi (123*1024*1024). So its more clear now, Kubernetes set the memory limit through cgroup. Once the pod consume more memory than the limit, cgroup will start to kill the container process.

#### Stress test

Let's install the stress tools on the Pod through the opened shell session.
    
    root@sh:/# apt update; apt install -y stress

In the meantime, monitoring the Syslog by running `dmesg -Tw`

Run the stress tool with the memory within the limit 100M first. It’s launched successfully.
    
    root@sh:/# stress --vm 1 --vm-bytes 100M &  
    [1] 271  
    root@sh:/# stress: info: [271] dispatching hogs: 0 cpu, 0 io, 1 vm, 0 hdd

Now trigger the second stress test,
    
    root@sh:/# stress --vm 1 --vm-bytes 50M  
    stress: info: [273] dispatching hogs: 0 cpu, 0 io, 1 vm, 0 hdd  
    stress: FAIL: [271] (415) <-- worker 272 got signal 9  
    stress: WARN: [271] (417) now reaping child worker processes  
    stress: FAIL: [271] (451) failed run completed in 7s

The first stress process (process id 271) was killed immediately with the signal 9.

In the meantime, the syslogs shows
    
    [Sat Apr 27 22:56:09 2019] stress invoked oom-killer: gfp_mask=0x14000c0(GFP_KERNEL), nodemask=(null), order=0, oom_score_adj=939  
    [Sat Apr 27 22:56:09 2019] stress cpuset=a2ed67c63e828da3849bf9f506ae2b36b4dac5b402a57f2981c9bdc07b23e672 mems_allowed=0  
    [Sat Apr 27 22:56:09 2019] CPU: 0 PID: 32332 Comm: stress Not tainted 4.15.0-46-generic #49-Ubuntu  
    [Sat Apr 27 22:56:09 2019] Hardware name: BHYVE, BIOS 1.00 03/14/2014  
    [Sat Apr 27 22:56:09 2019] Call Trace:  
    [Sat Apr 27 22:56:09 2019] dump_stack+0x63/0x8b  
    [Sat Apr 27 22:56:09 2019] dump_header+0x71/0x285  
    [Sat Apr 27 22:56:09 2019] oom_kill_process+0x220/0x440  
    [Sat Apr 27 22:56:09 2019] out_of_memory+0x2d1/0x4f0  
    [Sat Apr 27 22:56:09 2019] mem_cgroup_out_of_memory+0x4b/0x80  
    [Sat Apr 27 22:56:09 2019] mem_cgroup_oom_synchronize+0x2e8/0x320  
    [Sat Apr 27 22:56:09 2019] ? mem_cgroup_css_online+0x40/0x40  
    [Sat Apr 27 22:56:09 2019] pagefault_out_of_memory+0x36/0x7b  
    [Sat Apr 27 22:56:09 2019] mm_fault_error+0x90/0x180  
    [Sat Apr 27 22:56:09 2019] __do_page_fault+0x4a5/0x4d0  
    [Sat Apr 27 22:56:09 2019] do_page_fault+0x2e/0xe0  
    [Sat Apr 27 22:56:09 2019] ? page_fault+0x2f/0x50  
    [Sat Apr 27 22:56:09 2019] page_fault+0x45/0x50  
    [Sat Apr 27 22:56:09 2019] RIP: 0033:0x558182259cf0  
    [Sat Apr 27 22:56:09 2019] RSP: 002b:00007fff01a47940 EFLAGS: 00010206  
    [Sat Apr 27 22:56:09 2019] RAX: 00007fdc18cdf010 RBX: 00007fdc1763a010 RCX: 00007fdc1763a010  
    [Sat Apr 27 22:56:09 2019] RDX: 00000000016a5000 RSI: 0000000003201000 RDI: 0000000000000000  
    [Sat Apr 27 22:56:09 2019] RBP: 0000000003200000 R08: 00000000ffffffff R09: 0000000000000000  
    [Sat Apr 27 22:56:09 2019] R10: 0000000000000022 R11: 0000000000000246 R12: ffffffffffffffff  
    [Sat Apr 27 22:56:09 2019] R13: 0000000000000002 R14: fffffffffffff000 R15: 0000000000001000  
    [Sat Apr 27 22:56:09 2019] Task in /kubepods/burstable/podbc001ffa-68fc-11e9-92d7-5ef9efd9374c/a2ed67c63e828da3849bf9f506ae2b36b4dac5b402a57f2981c9bdc07b23e672 killed as a result of limit of /kubepods/burstable/podbc001ffa-68fc-11e9-92d7-5ef9efd9374c  
    [Sat Apr 27 22:56:09 2019] memory: usage 125952kB, limit 125952kB, failcnt 3632  
    [Sat Apr 27 22:56:09 2019] memory+swap: usage 0kB, limit 9007199254740988kB, failcnt 0  
    [Sat Apr 27 22:56:09 2019] kmem: usage 2352kB, limit 9007199254740988kB, failcnt 0  
    [Sat Apr 27 22:56:09 2019] Memory cgroup stats for /kubepods/burstable/podbc001ffa-68fc-11e9-92d7-5ef9efd9374c: cache:0KB rss:0KB rss_huge:0KB shmem:0KB mapped_file:0KB dirty:0KB writeback:0KB inactive_anon:0KB active_anon:0KB inactive_file:0KB active_file:0KB unevictable:0KB  
    [Sat Apr 27 22:56:09 2019] Memory cgroup stats for /kubepods/burstable/podbc001ffa-68fc-11e9-92d7-5ef9efd9374c/79fae7c2724ea1b19caa343fed8da3ea84bbe5eb370e5af8a6a94a090d9e4ac2: cache:0KB rss:48KB rss_huge:0KB shmem:0KB mapped_file:0KB dirty:0KB writeback:0KB inactive_anon:0KB active_anon:48KB inactive_file:0KB active_file:0KB unevictable:0KB  
    [Sat Apr 27 22:56:09 2019] Memory cgroup stats for /kubepods/burstable/podbc001ffa-68fc-11e9-92d7-5ef9efd9374c/a2ed67c63e828da3849bf9f506ae2b36b4dac5b402a57f2981c9bdc07b23e672: cache:0KB rss:123552KB rss_huge:0KB shmem:0KB mapped_file:0KB dirty:0KB writeback:0KB inactive_anon:0KB active_anon:123548KB inactive_file:0KB active_file:0KB unevictable:0KB  
    [Sat Apr 27 22:56:09 2019] [ pid ] uid tgid total_vm rss pgtables_bytes swapents oom_score_adj name  
    [Sat Apr 27 22:56:09 2019] [25160] 0 25160 256 1 28672 0 -998 pause  
    [Sat Apr 27 22:56:09 2019] [25218] 0 25218 4627 872 77824 0 939 bash  
    [Sat Apr 27 22:56:09 2019] [32307] 0 32307 2060 275 57344 0 939 stress  
    [Sat Apr 27 22:56:09 2019] [32308] 0 32308 27661 24953 253952 0 939 stress  
    [Sat Apr 27 22:56:09 2019] [32331] 0 32331 2060 304 53248 0 939 stress  
    [Sat Apr 27 22:56:09 2019] [32332] 0 32332 14861 5829 102400 0 939 stress  
    [Sat Apr 27 22:56:09 2019] Memory cgroup out of memory: Kill process 32308 (stress) score 1718 or sacrifice child  
    [Sat Apr 27 22:56:09 2019] Killed process 32308 (stress) total-vm:110644kB, anon-rss:99620kB, file-rss:192kB, shmem-rss:0kB  
    [Sat Apr 27 22:56:09 2019] oom_reaper: reaped process 32308 (stress), now anon-rss:0kB, file-rss:0kB, shmem-rss:0kB

The process id 32308 on the host is OOM killed. The more interesting stuff is at the last part of the log,

![](https://cdn-images-1.medium.com/max/1600/1*DZuLO49QdrjmELVpXT1N0w.png)

For this pod, there are processes that are the candidates that the OOM killer would select to kill. The basic process `pause` , which holds the network namespaces is having a oom_score_adj value of -998, is guaranteed not be killed. The rest of the processes in the container are all having the oom_score_adj value of 939. We can validate this value based on the formula from the [Kubernetes document](https://kubernetes.io/docs/tasks/administer-cluster/out-of-resource/#node-oom-behavior) as below,
    
    min(max(2, 1000 - (1000 >md.png COPYING Config.plist CopyAsMarkdown-demo.mp4 README.md _Signature.plist html2md.sh html2text.py memoryRequestBytes) / machineMemoryCapacityBytes), 999)

Find out the node allocatable memory by
    
    kubectl describe nodes k3s | grep Allocatable -A 5  
    Allocatable:  
     cpu: 1  
     ephemeral-storage: 49255941901  
     hugepages-1Gi: 0  
     hugepages-2Mi: 0  
     memory: 2041888Ki

The request memory is by default the same as limit value if its not set. So we have the oom_score_adj value as `1000–123*1024/2041888=938.32`, which is close to the value 939 in the syslog. _(I am not sure how exact the 939 is obtained in the OOM killer)_

It’s noticed that all the process in the container has the same oom_score_adj value. The OOM killer will calculate the OOM value based on the memory usage and fine tuned with the oom_score_adj value. Finally it kill the first stress process which use the most of the memory, 100M whose oom_score value is 1718.



#### Hint Memory Limit of POD and OOM Killer

No hint available


#### Complete Memory Limit of POD and OOM Killer

> Confirm Memory Limit of POD and OOM Killer complete



----
#### Task Resource Limits

----

# Resource Limits and Quotas

**Resource Limits:  
**Kubernetes engine schedules the pod, if and only if the container have enough resources to run in the environment. If you schedule a large memory or CPU consuming app on a node with limited resources, it is possible that the node runs out of memory or CPU and application will stop working. Kubernetes uses, requests and limits to control resources such as memory and CPU.

Request are the resources that container will always get while running in the environment. On the other hand limits make sure container never goes above the mentioned value. Hence, scheduling is based on the request instead of the limit. That is, if the pod is successfully scheduled, the pod can be allocated to the resource of the specified request. Whether the resource used by the pod exceeds the specified limit value depends on whether the resource can be compressed.

_Let’s go through example:_

![](https://cdn-images-1.medium.com/max/1600/1*e4xd6wYYmGcC1To2LOSKAA.png)

CPU resources defined in the milicores. If you need one core, you can use CPU resource value as 1000m, where as if you need 1⁄2 of CPU, you can specify this as 500m. If you put a CPU value which is larger than the core count of your biggest node in your cluster, then your pod will never be scheduled.

Pods can guarantee the number of CPUs they request, and they may or may not get extra CPU time (depending on other jobs that are running). Because currently CPU isolation is at the container level and not at the pod level.

Memory resources are defined in bytes. Just like CPU, if you put a memory request value which is larger than the amount of memory on your nodes, the pod will never be scheduled. Unlike CPU resources, if a container goes past its memory limit, it will be terminated.

_Key areas for setting resource requests and limits:_

  1. ResourceQuota
  2. LimitRange

**2.1 ResourceQuota:  
**ResourceQuota object is used to define the usage limit of all resources in a namespace. If a new pod (or other object) exceeds the resource quota, it will not be created.

![](https://cdn-images-1.medium.com/max/1600/1*wNstGpKU_cjKuEgRZ8tSsA.png)

**2.2 LimitRange:**  
LimitRange object is a resource limit that limits a Pod of a namespace. Limit range works on container level, so this helps to create any size constraint container.

![](https://cdn-images-1.medium.com/max/1600/1*0AJCs-vPWeNueQktQfhvWA.png)

Above is an expanded understanding of some of the best practices of Kubernetes. As a management tool, it makes your containers so lightweight that you can literally ship them around as a deployable unit from development to staging and eventually production environments. But various challenges can be all sorts of fun and interesting things.
	

#### Hint Resource Limits

No hint available


#### Complete Resource Limits

> Confirm Resource Limits complete




----
#### Task Health Checks

----

# Health Checks


**Health Checks:**

Health checks are the best way to check if the whole system is up and running. If any of the container is down, other microservices/containers should not send any request to the one that is not functional, nor should they route the request to other containers which does the same job as the defected container. At the same time, the container which is not working should reboot automatically to have the same replica count. Kubernetes does not send any requests directly to containers, this communication happens through a Pod.

There are two types of health checks as follows:

1. Readiness

2. Liveness

Both of these checks take place throughout the lifecycle of the pod, not only at the time of start up.

![](https://cdn-images-1.medium.com/max/1600/1*Xfdw0lkT4CdPtnza4-0Z7Q.png)

HEATLH CHECK EXAMPLE

**Readiness:**

If the readiness probe fails, k8s will leave the pod in a running state, but will not send any traffic to that pod. Once the readiness probe get ready, that pod will join the pool of the traffic receivers.

Let us say that your pod depends on a database. It will be useless if that database pod/service is down. There are two types of probes you can write for such a scenario: either a smart or a dumb probe. The smart probe is one which checks database and other related dependencies. On the other hand, a dumb probe doesn’t have any logic to it. This that means that as soon as a pod is up, the probe would return an ‘ok’ or 200 status code.

Check the following snippet for the readiness probe of HTTP.

![](https://cdn-images-1.medium.com/max/1600/1*ET00tminTe002lE_qTDJUw.png)

Readiness Probe of HTTP

_initialDelaySeconds:_ Number of seconds after the container has started before liveness or readiness probes are initiated.

_timeoutSeconds: _Number of seconds after which the probe times out. Defaults to 1 second. Minimum value is 1.

_failureThreshold: _When a Pod starts and the probe fails, k8s will try failure Threshold times before giving up.

**Liveness:**

This communicates with k8s to determine whether your pod is still alive. If this fails, k8s will kill the pod and bring up a new pod in its place to make the same replica count. This will also ensure the system is working properly. If you are 100% sure that a restart will solve the problem, then you should use this probe. Otherwise, a situation might arise where your pod did not restart properly and hung up the whole cluster.

One example where the liveness probe can be used is in case of a memory leak. Let’s say you have an application which hits it’s memory threshold after continued usage. You can use the liveness probe for such a scenario where it will restart the pod, and the memory will get cleared.

![](https://cdn-images-1.medium.com/max/1600/1*LMDZkPU1utkumkyvbv4PMA.png)

Liveness Probe Example

There are three types of probes as follows:

  1. **HTTP : **This is one of the simplest ways to check a system’s health. You can create http endpoint to check this, and if the status ranges between 200–300, k8s will mark the pod as healthy
  2. **TCP:** In this type of probe, k8s creates the TCP connection on the specified port during deployment. If the connection happens, it will be marked as healthy
  3. **Command:** This is a very important probe, where k8s runs the command provided in the deployment. If it returns exit code 0, it will be marked as a healthy pod

**General rules of thumb:**

  1. Make both, readiness and liveness probes, as dumb as possible. This means that they should only check the endpoint with 200 success. If you need to handle some internal dependencies, you should handle them in the failure block of your code with help of circuit breakers.
  2. The _‘initialDelaySeconds’_ should be marked properly. You need to make sure that the liveness probe does not start until the app is ready. Otherwise, the app will constantly restart and never be ready.


#### Hint Health Checks

No hint available


#### Complete Health Checks

> Confirm Health Checks complete



#### Task Vault 

----


###  **[Getting started with HashiCorp Vault on Kubernetes](https://techsquad.rocks/blog/getting_started_with_hashicorp_vault_on_kubernetes/)**

####  April 28, 2019    [ kubernetes ](https://techsquad.rocks/tags/kubernetes/)  [ vault ](https://techsquad.rocks/tags/vault/)  [ linux ](https://techsquad.rocks/tags/linux/)  [ security ](https://techsquad.rocks/tags/security/)

##### **Introduction**

Vault secures, stores, and tightly controls access to tokens, passwords, certificates, API keys, and other secrets in modern computing. What this means is that you can safely store all your App secrets in Vault without having to worry anymore how to store, provide, and use those secrets, we will see how to install it on a running kubernetes cluster and save and read a secret by our application, in this page we will be using Vault version 1.1.1, we will be using dynamic secrets, that means that each pod will have a different secret and that secret will expire once the pod is killed.

Before you start you will need [Consul](https://www.consul.io/docs/install/index.html), [Vault](https://www.vaultproject.io/docs/install/) client binaries and [Minikube](https://kubernetes.io/docs/tasks/tools/install-minikube/) or any running cluster, you can find the files used here in [this repo](https://github.com/kainlite/vault-consul-tls).

This is the part one of [two](https://techsquad.rocks/blog/actually_using_vault_on_kubernetes/)

##### **Preparing the cluster**

Let’s start minikube and validate that we can reach our cluster with `minikube start` and then with `kubectl get nodes`, also the dashboard can become handy you can invoke it like this `minikube dashboard`

```
$ minikube start

😄 minikube v1.0.0 on linux (amd64)
🤹 Downloading Kubernetes v1.14.0 images in the background ...
💡 Tip: Use 'minikube start -p <name>' to create a new cluster, or 'minikube delete' to delete this one.
🔄 Restarting existing virtualbox VM for "minikube" ...
⌛ Waiting for SSH access ...
📶 "minikube" IP address is 192.168.99.102
🐳 Configuring Docker as the container runtime ...

🐳 Version of container runtime is 18.06.2-ce

⌛ Waiting for image downloads to complete ...

✨ Preparing Kubernetes environment ...

🚜 Pulling images required by Kubernetes v1.14.0 ...

🔄 Relaunching Kubernetes v1.14.0 using kubeadm ... 

⌛ Waiting for pods: apiserver proxy etcd scheduler controller dns

📯 Updating kube-proxy configuration ...

🤔 Verifying component health ......

💗 kubectl is now configured to use "minikube"

🏄 Done! Thank you for using minikube!

$ kubectl get nodes

NAME STATUS ROLES AGE VERSION

minikube Ready master 4d20h v1.14.0
```

[view raw](https://gist.github.com/kainlite/750ee3b20d03fe3e999844c1c80fcf3f/raw/1b664eb66b2bc1a9a29308b2ca0e1cfe2bcdcc46/snippet.sh) [snippet.sh](https://gist.github.com/kainlite/750ee3b20d03fe3e999844c1c80fcf3f#file-snippet-sh) hosted with ❤ by [GitHub](https://github.com)

##### **Creating certificates for Consul and Vault**

Vault needs a backend to store data, this backend can be consul, etcd, postgres, and [many more](https://www.vaultproject.io/docs/configuration/storage/index.html), so the first thing that we are going to do is create a certificate so consul and vault can speak to each other securely. 

```
$ consul tls ca create

==> Saved consul-agent-ca.pem

==> Saved consul-agent-ca-key.pem

$ consul tls cert create -server -additional-dnsname server.dc1.cluster.local

==> WARNING: Server Certificates grants authority to become a

server and access all state in the cluster including root keys

and all ACL tokens. Do not distribute them to production hosts

that are not server nodes. Store them as securely as CA keys.

==> Using consul-agent-ca.pem and consul-agent-ca-key.pem

==> Saved dc1-server-consul-0.pem

==> Saved dc1-server-consul-0-key.pem

$ consul tls cert create -client

==> Using consul-agent-ca.pem and consul-agent-ca-key.pem

==> Saved dc1-client-consul-0.pem

==> Saved dc1-client-consul-0-key.pem
```

[view raw](https://gist.github.com/kainlite/f46c829de562750d0fb21ec25f8fa91b/raw/93bbdb0f24e56c264c9454b9fcc944c773d58082/snippet.sh) [snippet.sh](https://gist.github.com/kainlite/f46c829de562750d0fb21ec25f8fa91b#file-snippet-sh) hosted with ❤ by [GitHub](https://github.com)

##### **Consul**

The next steps would be to create an encryption key for the consul cluster and to create all the kubernetes resources associated with it 

```
# Create secret for the gossip protocol

$ export GOSSIP_ENCRYPTION_KEY=$(consul keygen)

# Create kubernetes secret with the certificates and the gossip encryption key

# This will be used by all consul servers to make them able to communicate

# And also join the cluster.

$ kubectl create secret generic consul \

--from-literal="gossip-encryption-key=${GOSSIP_ENCRYPTION_KEY}" \

--from-file=certs/consul-agent-ca.pem \

--from-file=certs/dc1-server-consul-0.pem \

--from-file=certs/dc1-server-consul-0-key.pem

secret/consul created

# Store the configuration as a configmap

$ kubectl create configmap consul --from-file=consul/config.json

configmap/consul created

# Create a service so the pods can see each other

$ kubectl create -f consul/01-service.yaml

service/consul created

# Create the consul pods

$ kubectl create -f consul/02-statefulset.yaml

statefulset.apps/consul created

# To be test consul we need to port-forward the port 8500 to our computer

$ kubectl port-forward consul-1 8500:8500

# Then we can validate that all the consul members are alive and well

$ consul members

Node Address Status Type Build Protocol DC Segment

consul-0 172.17.0.5:8301 alive server 1.4.4 2 dc1 <all>

consul-1 172.17.0.6:8301 alive server 1.4.4 2 dc1 <all>

consul-2 172.17.0.7:8301 alive server 1.4.4 2 dc1 <all>
```

[view raw](https://gist.github.com/kainlite/4f787ef0e5152eb14928a73b3e2b9d91/raw/2a7fbb2457027800e5db2a47769eeeb4252e6773/snippet.sh) [snippet.sh](https://gist.github.com/kainlite/4f787ef0e5152eb14928a73b3e2b9d91#file-snippet-sh) hosted with ❤ by [GitHub](https://github.com)

##### **Vault**

Once we have Consul running starting vault should be straight forward, we need to create all kubernetes resources associated with it and then initialize and unseal the vault. 


```
# Store the certs for vault

$ kubectl create secret generic vault \

--from-file=certs/consul-agent-ca.pem \

--from-file=certs/dc1-client-consul-0.pem \

--from-file=certs/dc1-client-consul-0-key.pem

secret/vault created

# Store the config as a configmap

$ kubectl create configmap vault --from-file=vault/config.json

configmap/vault created

# Create the service

$ kubectl create -f vault/01-service.yaml

service/vault created

# And the deployment

$ kubectl create -f vault/02-deployment.yaml

deployment.extensions/vault created

# To be able to initialize and use the vault we need to use that port-forward.

$ kubectl port-forward vault-6d78b6df7c-z7chq 8200:8200

$ export VAULT_ADDR=https://127.0.0.1:8200

$ export VAULT_CACERT="certs/consul-agent-ca.pem"

# Initialize the vault, here we define that we need 3 shares and 3 keys to unseal

# In a production environment those keys should be separated and only known by the

# responsibles of vault.

$ vault operator init -key-shares=3 -key-threshold=3

vault operator init -key-shares=3 -key-threshold=3

Unseal Key 1: 8I3HkpLoujn+fAdXHCRJYGJEw0WpvamnzTNu5IGyTcWB

Unseal Key 2: I65GU6xRt+ZX+QigBjCHRyht8pvIOShpU5TL8iLGhr6g

Unseal Key 3: n+Kv2qrDNiIELEy3dEMfUpD/c8EtnwpJCYIn88TrS3Pg

Initial Root Token: s.3pEYBZqlzvDpImB988GyAsuf

Vault initialized with 3 key shares and a key threshold of 3. Please securely

distribute the key shares printed above. When the Vault is re-sealed,

restarted, or stopped, you must supply at least 3 of these keys to unseal it

before it can start servicing requests.

Vault does not store the generated master key. Without at least 3 key to

reconstruct the master key, Vault will remain permanently sealed!

It is possible to generate new unseal keys, provided you have a quorum of

existing unseal keys shares. See "vault operator rekey" for more information.

# To unseal the vault we need to repeat this process with the 3 keys that we got in the previous step

$ vault operator unseal

Unseal Key (will be hidden):

Key Value

--- -----

Seal Type shamir

Initialized true

Sealed true

Total Shares 3

Threshold 3

Unseal Progress 1/3

Unseal Nonce e9bb1681-ba71-b90d-95f6-8e68389e934b

Version 1.1.1

HA Enabled true

# Then we login with the initial root token 

$ vault login

Token (will be hidden):

Success! You are now authenticated. The token information displayed below

is already stored in the token helper. You do NOT need to run "vault login"

again. Future Vault requests will automatically use this token.

Key Value

--- -----

token s.3pEYBZqlzvDpImB988GyAsuf

token_accessor w3W3Kw2GWflF9L59C4Itn6cZ

token_duration ∞

token_renewable false

token_policies ["root"]

identity_policies []

policies ["root"]

# We enable the /secrets path with the plugin kv

$ vault secrets enable -path=secrets kv

Success! Enabled the kv secrets engine at: secrets/

# And finally test storing a secret there

$ vault kv put secrets/hello foo=world

Success! Data written to: secrets/hello

# Then we validate that we can read it as well

$ vault kv get secrets/hello

=== Data ===

Key Value

--- -----

foo world
```

[view raw](https://gist.github.com/kainlite/dbe6cb3055b5c202bb3f65b7178e2f7c/raw/4806b144259067b62c0afebc16375d125113c4e8/snippet.sh) [snippet.sh](https://gist.github.com/kainlite/dbe6cb3055b5c202bb3f65b7178e2f7c#file-snippet-sh) hosted with ❤ by [GitHub](https://github.com)

##### **Closing notes**

As you can see it takes a while to configure a Vault server but I really like the pattern that renders for the apps using it, in the next post we will see how to unlock it automatically with kubernetes and also how to mount the secrets automatically to our pods so our applications can use it :), this post was heavily inspired by [this one](https://testdriven.io/blog/running-vault-and-consul-on-kubernetes/) and [this one](https://learn.hashicorp.com/consul/advanced/day-1-operations/certificates#configuring-agents).



#### Hint Vault

No hint available


#### Complete Vault

> Confirm Vault complete





----
#### Task aaa

----



#### Hint aaa

No hint available


#### Complete aaa

> Confirm Introduction complete





#### Task aaa

----


#### Hint aaa

No hint available


#### Complete aaa

> Confirm Introduction complete

