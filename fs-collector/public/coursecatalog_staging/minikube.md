
:course_title: ICP01 IBM Cloud Private

:course_desc: This course provides the student with the necessary steps to get a basic understanding of IBM Cloud Private.  

:course_max: 7

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


[Install MiniKube](https://kubernetes.io/docs/tasks/tools/install-minikube/)


## Install a Hypervisor

If you do not already have a hypervisor installed, install one for your OS now:
Operating system	Supported hypervisors:

* macOS	[VirtualBox](https://www.virtualbox.org/wiki/Downloads), VMware Fusion, HyperKit
* Linux	[VirtualBox](https://www.virtualbox.org/wiki/Downloads), KVM
* Windows	[VirtualBox](https://www.virtualbox.org/wiki/Downloads), Hyper-V

    Note: Minikube also supports a --vm-driver=none option that runs the Kubernetes components on the host and not in a VM. Using this driver requires Docker and a Linux environment but not a hypervisor.
    
## Install a Multikube

**macOS**

The easiest way to install Minikube on macOS is using Homebrew:

```
$ /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"

$ brew cask install minikube

```


Or if you don't want to use **brew**

```
$ curl -Lo minikube https://storage.googleapis.com/minikube/releases/latest/minikube-darwin-amd64 \
  && chmod +x minikube

$ sudo mv minikube /usr/local/bin
```

```
$ minikube start --memory=8192 --cpus=4                                                                                                                                              

😄  minikube v1.0.1 on darwin (amd64)
💿  Downloading Minikube ISO ...
 113.03 MB / 142.88 MB [=================================>--------]  79.11% 1m6s
 
 ...
 
😄  minikube v1.0.1 on darwin (amd64)
🤹  Downloading Kubernetes v1.14.1 images in the background ...
💡  Tip: Use 'minikube start -p <name>' to create a new cluster, or 'minikube delete' to delete this one.
🔄  Restarting existing virtualbox VM for "minikube" ...
⌛  Waiting for SSH access ...
📶  "minikube" IP address is 192.168.99.100
🐳  Configuring Docker as the container runtime ...
🐳  Version of container runtime is 18.06.3-ce
⌛  Waiting for image downloads to complete ...
✨  Preparing Kubernetes environment ...
🚜  Pulling images required by Kubernetes v1.14.1 ...
🔄  Relaunching Kubernetes v1.14.1 using kubeadm ...
⌛  Waiting for pods: apiserver proxy etcd scheduler controller dns
📯  Updating kube-proxy configuration ...
🤔  Verifying component health .....
💗  kubectl is now configured to use "minikube"
🏄  Done! Thank you for using minikube!

```

Wait for minikube to start this may take some time to download and start the cluster.


---

**Hint:**
I also faced the same problem and it caused after using/connecting Cisco AnyConnect VPN. Similar networking issue I have seen earlier as well with Virtualbox VM networks.

So basically when we disconnect the VPN it removes the existing routing for VirtualBox networks. So the solution is ifconfig down & ifconfig for all Virtualbox nets.


**Hint:**

If needed you can specify the VM provider:

`minikube start --memory=8192 --cpus=4 --vm-driver=virtualbox`


`minikube start --memory=8192 --cpus=4 --vm-driver=vmwarefusion`

---

**Hint:**

If you have previously installed minikube, and run:

`minikube start`

And this command returns an error:

`machine does not exist`

You need to wipe the configuration files:

`rm -rf ~/.minikube`

#### Hint Introduction

No hint available


#### Complete Introduction

> Confirm Introduction complete

#### Task CheckInstallation

```
$ minikube status

host: Running
kubelet: Running
apiserver: Running
kubectl: Correctly Configured: pointing to minikube-vm at 192.168.99.100
```

```
$ kubectl get nodes

NAME       STATUS    ROLES     AGE       VERSION
minikube   Ready     master    32m       v1.14.1
```

#### Hint CheckInstallation

No hint available


#### Complete CheckInstallation

> Confirm CheckInstallation complete

