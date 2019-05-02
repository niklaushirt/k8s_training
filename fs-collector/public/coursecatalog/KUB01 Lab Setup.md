
:course_title: KUB01 Lab Setup

:course_desc: This course walks you through the Lab preparations.  

:course_max: 4


:course_auto: no

:button1_label: Task

:button2_label: Hint

:button2_delay: 999999

:button3_label: Complete

:button3_delay: 300



:infotab: <hr>

:infotab: <h1 id="toc_0">References</h1>
:infotab: <p><a href="https://kubernetes.io/docs/tasks/">Kubernetes.io</a></p>
:infotab: <hr>
:infotab: <h1 id="toc_0">References</h1>
:infotab: <p><a href="https://kubernetes.io/docs/tasks/">Kubernetes.io</a></p>
:infotab: <hr>
:infotab: <h1 id="toc_0">References</h1>
:infotab: <p><a href="https://kubernetes.io/docs/tasks/">Kubernetes.io</a></p>
:infotab: <hr>




#### Task SetUpMinikube

----
# Setting up Minikube

### Getting set up

Before we dive into Kubernetes, you need to provision a local Minikube cluster for your containerized app. Then you won't have to wait for it to be ready for the subsequent labs. 

----

## Install a Hypervisor

If you do not already have a hypervisor installed, install one for your OS now:

Operating system	Supported hypervisors:

* macOS	[VirtualBox](https://www.virtualbox.org/wiki/Downloads), VMware Fusion, HyperKit
* Linux	[VirtualBox](https://www.virtualbox.org/wiki/Downloads), KVM
* Windows	[VirtualBox](https://www.virtualbox.org/wiki/Downloads), Hyper-V

    Note: Minikube also supports a --vm-driver=none option that runs the Kubernetes components on the host and not in a VM. Using this driver requires Docker and a Linux environment but not a hypervisor.
    
---

## Install Minikube on your OS

For Linux or Windows see  [here](https://kubernetes.io/docs/tasks/tools/install-minikube/).


### macOS

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

Then we start minikube (parameters are important for the Istio Lab):

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



If you need some more details: [Install MiniKube](https://kubernetes.io/docs/tasks/tools/install-minikube/)



---

**Hint:**
IF you get the following error:
💣 Error starting cluster: wait: waiting for component=kube-apiserver: timed out waiting for the condition

Try deactivating your VPN (Cisco AnyConnect, ...) and/or reboot.

---

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




#### Hint SetUpMinikube

No hint available


#### Complete SetUpMinikube

> Confirm SetUpMinikube complete





#### Task SetUpKubectl

----


### Download the Kubernetes CLI

To view a local version of the Kubernetes dashboard and to deploy apps into your clusters, you will need to install the Kubernetes CLI that corresponds with your operating system:




**For Windows users:** 

* [Windows](https://storage.googleapis.com/kubernetes-release/release/v1.10.8/bin/windows/amd64/kubectl.exe)

Install the Kubernetes CLI in the same directory as the IBM Cloud CLI. This setup saves you some filepath changes when you run commands later.

**For OS X and Linux users:**

#### Install via command line (preferred)

```
$ curl -LO https://storage.googleapis.com/kubernetes-release/release/v1.14.0/bin/darwin/amd64/kubectl

$ mv ./kubectl /usr/local/bin/kubectl

$ chmod +x /usr/local/bin/kubectl


```



#### Direct download

Download from:

* [OS X](https://storage.googleapis.com/kubernetes-release/release/v1.10.8/bin/darwin/amd64/kubectl)
* [Linux](https://storage.googleapis.com/kubernetes-release/release/v1.10.8/bin/linux/amd64/kubectl)

1. Move the executable file to the `/usr/local/bin` directory using the command `mv /<path_to_file>/kubectl /usr/local/bin/kubectl` .

2. Make sure that `/usr/local/bin` is listed in your PATH system variable.

	```
	$ echo $PATH
	/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin
	```

3. Convert the binary file to an executable: `chmod +x /usr/local/bin/kubectl`



#### Hint SetUpKubectl

No hint available


#### Complete SetUpKubectl

> Confirm SetUpKubectl complete





#### Task SetUpGIT

----

# Install Git on your laptop

To do so : 

For MacOS :
http://mac.github.com

For Windows: 
http://git-scm.com/download/win

At some point during the installation, change to the **"Use Windows default console"** and continue the installation.
![Git for Windows](https://raw.githubusercontent.com/niklaushirt/ContainerOrchestration/master/images/git2.png)

#### Hint SetUpGIT

No hint available


#### Complete SetUpGIT

> Confirm SetUpGIT complete



#### Task FinalCheck

----


### 1. Check kubectl 

type the following command :

`kubectl version --short`

And you should get version for your client :

```
$ kubectl version --short
Client Version: v1.xx.yy
error: You must be logged in to the server (the server has asked for the client to provide credentials)
```

The error at the end is **normal** because we need to specify how to connect to the master (we will see this in the labs section).

### 1. Check git 

type the following command :

`git version `

And you should get something similar :

```
$ git version                                                                                                                         
git version 2.18.0
```



#### Hint FinalCheck

No hint available


#### Complete FinalCheck

> Confirm FinalCheck complete

