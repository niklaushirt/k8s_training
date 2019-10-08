
:course_title: JTC90 Kubernetes Lab Setup

:course_desc: This course walks you through the Lab preparations for the Journey to Cloud.

:course_max: 5


:course_auto: no

:button1_label: Task

:button2_label: Hint

:button2_delay: 9999999

:button3_label: Complete

:button3_delay: 10



#### Task SetUpHypervisor

----
# Setting up Minikube

### Getting set up

Before we dive into Kubernetes, you need to provision a local Minikube cluster for your containerized app. Then you won't have to wait for it to be ready for the subsequent labs. 

----

## Part 1 - Install a Hypervisor

----


If you do not already have a hypervisor installed, install one for your OS now:

Operating system	Supported hypervisors:

* macOS	[VirtualBox](https://www.virtualbox.org/wiki/Downloads), VMware Fusion, HyperKit
* Linux	[VirtualBox](https://www.virtualbox.org/wiki/Downloads), KVM
* Windows	[VirtualBox](https://www.virtualbox.org/wiki/Downloads), Hyper-V

    Note: Minikube also supports a --vm-driver=none option that runs the Kubernetes components on the host and not in a VM. Using this driver requires Docker and a Linux environment but not a hypervisor.
    
---
## For macOS
---
Requires installing a hypervisor, such as [hyperkit](https://github.com/kubernetes/minikube/blob/master/docs/drivers.md#hyperkit-driver) or VirtualBox (recommended). 


#### Option 1: Installing VirtualBox (recommended)

Download Virtual Box from [here](https://download.virtualbox.org/virtualbox/5.2.32/VirtualBox-5.2.32-132073-OSX.dmg) and launch the installer.


#### Option 2: Installing HyperKit

If you want to use `Hyperkit` you have to install it with

```
$ brew install hyperkit
$ brew install docker-machine-driver-hyperkit
$ sudo chown root:wheel /usr/local/bin/docker-machine-driver-hyperkit && sudo chmod u+s /usr/local/bin/docker-machine-driver-hyperkit
```

And start minikube with
`--vm-driver hyperkit` 
option                                                                                                                                             



---
## For Windows
---
Requires a hypervisor, such as VirtualBox (recommended) or HyperV
  * VT-x/AMD-v virtualization must be enabled in BIOS
  
#### Option 1: Installing VirtualBox (recommended)

Download Virtual Box from [here](https://download.virtualbox.org/virtualbox/5.2.32/VirtualBox-5.2.32-132073-Win.exe) and launch the installer.


#### Option 2: Installing/Enable HyperV

1. Open a PowerShell console as Administrator.

2. Run the following command:

	```PowerShell
	    Enable-WindowsOptionalFeature -Online -FeatureName Microsoft-Hyper-V -All 
	```
**Hint**: If the command couldn't be found, make sure you're running PowerShell as Administrator.

4. When the installation has completed, reboot.

Complete Documentation is [here](https://docs.microsoft.com/en-us/virtualization/hyper-v-on-windows/quick-start/enable-hyper-v)

---



---
## For Linux
---
  * Requires either the [kvm2 driver](https://github.com/kubernetes/minikube/blob/master/docs/drivers.md#kvm2-driver), or VirtualBox (recommended)
  * VT-x/AMD-v virtualization must be enabled in BIOS

#### Option 1: Installing VirtualBox (recommended)

Download Virtual Box from [here](https://www.virtualbox.org/wiki/Download_Old_Builds_5_2) and launch the installer.


#### Option 2: Installing kvm

Installing kvm on:
[RHOS](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/7/html/virtualization_deployment_and_administration_guide/chap-installing_the_virtualization_packages#sect-Configuring_a_Virtualization_Host_installation-Installing_KVM_packages_with_Kickstart_files)
[CentOS](https://wiki.centos.org/HowTos/KVM)
[Ubuntu](https://help.ubuntu.com/community/KVM/Installation)
  



#### Hint SetUpHypervisor

No hint available


#### Complete SetUpHypervisor

> Confirm SetUpHypervisor complete





#### Task SetUpMinikube

----

## Part 2 - Install Minikube on your OS

---

## For macOS



#### Option 1: Installing with Homebrew (recommended)
The easiest way to install Minikube on macOS is using Homebrew.

##### 1) Install brew

```
$ /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```

##### 2) Install minikube

```
$ brew cask install minikube

```

#### Option 2: Installing natively
 
Or if you don't want to use `brew`

```
$ curl -Lo minikube https://storage.googleapis.com/minikube/releases/latest/minikube-darwin-amd64 \
   && chmod +x minikube
 
$ sudo mv minikube /usr/local/bin
```

---

## For Windows 10
  
#### Option 1: Installing with Chocolatey (recommended)
 You can install minikube:
 Install [Chocolatey](https://chocolatey.org/)  
 Then run:
 
```
$ choco install minikube
```
#### Option 2: Installing manually
Download and run the [installer](https://storage.googleapis.com/minikube/releases/latest/minikube-installer.exe)




---

## For Linux
---
Simply execute the following command:
 
	   ```
	  $ curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64 && sudo install minikube-linux-amd64 /usr/local/bin/minikube
	   ```



---


#### Hint SetUpMinikube

No hint available


#### Complete SetUpMinikube

> Confirm SetUpHypervisor complete








#### Task StartUpMinikube



## Part 3 - Starting minikube

Then we can start minikube (parameters are important for the more advanced Labs):

```
$ minikube start --vm-driver=virtualbox --memory=8192 --cpus=4 --network-plugin=cni --extra-config=apiserver.Authorization.Mode=RBAC --kubernetes-version v1.14.0
                                                                                                                                             

😄  minikube v1.0.1 on darwin (amd64)
💿  Downloading Minikube ISO ...
 113.03 MB / 142.88 MB [=================================>--------]  79.11% 1m6s
 
 ...
 
😄  minikube v1.0.1 on darwin (amd64)
🤹  Downloading Kubernetes v1.14.0 images in the background ...
🔥  Creating virtualbox VM (CPUs=4, Memory=8192MB, Disk=20000MB) ...
📶  "minikube" IP address is 192.168.99.101
🐳  Configuring Docker as the container runtime ...
🐳  Version of container runtime is 18.06.3-ce
⌛  Waiting for image downloads to complete ...
✨  Preparing Kubernetes environment ...
💾  Downloading kubelet v1.14.0
💾  Downloading kubeadm v1.14.0
🚜  Pulling images required by Kubernetes v1.14.0 ...
🚀  Launching Kubernetes v1.14.0 using kubeadm ...
⌛  Waiting for pods: apiserver etcd scheduler controller
🔑  Configuring cluster permissions ...
🤔  Verifying component health .....
💗  kubectl is now configured to use "minikube"
🏄  Done! Thank you for using minikube!

```

Wait for minikube to start this may take some time to download and start the cluster.



If you need some more details: [Install MiniKube](https://kubernetes.io/docs/tasks/tools/install-minikube/)




#### Task Installing Network Plugin



## Part 3 - Installing Network Plugin

If we use the -- option, minishift cannot start completely.

1. If you type:

	```
	$ kubectl get pods --all-namespaces
	```
	
	you will see, that the two `coredns` pods are in `Pending` state because of the missing CNI plugin:
	
	```
	kube-system   coredns-fb8b8dccf-mtdkn            0/1       Pending    0          57m
	kube-system   coredns-fb8b8dccf-n4bcc            0/1       Pending    0          57m
	```

2. In order for the minishift installtion to work we have to install the network plugin.
	
3. Create permissions

	```
	$ kubectl create clusterrolebinding kube-system-cluster-admin --clusterrole=cluster-admin --serviceaccount=kube-system:default
	
	clusterrolebinding.rbac.authorization.k8s.io/kube-system-cluster-admin created
	```
	
4. Install the Cilium Network Plugin
	For the Labs we will be using the lightweight Cilium Network Plugin to handle `NetworkPolicies`. There are many other options such as Calico.
	
	```
	$ kubectl create -f https://raw.githubusercontent.com/cilium/cilium/v1.6/install/kubernetes/quick-install.yaml
	
	configmap/cilium-config created
	serviceaccount/cilium created
	serviceaccount/cilium-operator created
	clusterrole.rbac.authorization.k8s.io/cilium created
	clusterrole.rbac.authorization.k8s.io/cilium-operator created
	clusterrolebinding.rbac.authorization.k8s.io/cilium created
	clusterrolebinding.rbac.authorization.k8s.io/cilium-operator created
	daemonset.apps/cilium created
	deployment.apps/cilium-operator created
	
	```

5. After a moment, all pods should be in `Running` state:

	```
	$ kubectl get pods --all-namespaces
	
	NAMESPACE     NAME                               READY     STATUS    RESTARTS   AGE
	kube-system   cilium-jscm9                       1/1       Running   0          3m4s
	kube-system   cilium-operator-76df8bd9d-gnr9c    1/1       Running   0          3m4s
	kube-system   coredns-fb8b8dccf-mtdkn            1/1       Running   0          60m
	kube-system   coredns-fb8b8dccf-n4bcc            1/1       Running   0          60m
	kube-system   etcd-minikube                      1/1       Running   0          14m
	kube-system   kube-addon-manager-minikube        1/1       Running   1          59m
	kube-system   kube-apiserver-minikube            1/1       Running   0          14m
	kube-system   kube-controller-manager-minikube   1/1       Running   1          59m
	kube-system   kube-proxy-sh7vn                   1/1       Running   0          14m
	kube-system   kube-scheduler-minikube            1/1       Running   1          59m
	kube-system   storage-provisioner                1/1       Running   0          60m
	```


---

### Troubleshooting

If the pods do not start, please try the following:

```
$ kubectl delete -f https://raw.githubusercontent.com/cilium/cilium/v1.6/install/kubernetes/quick-install.yaml
$ kubectl taint nodes --all node.kubernetes.io/not-ready:NoSchedule-
$ kubectl create -f https://raw.githubusercontent.com/cilium/cilium/v1.6/install/kubernetes/quick-install.yaml
```

#### Hint Installing Network Plugin

No hint available


#### Complete Installing Network Plugin

> Confirm Installing Network Plugin complete




#### Task SetUpKubectl

----


# Install the Kubernetes CLI

To view a local version of the Kubernetes dashboard and to deploy apps into your clusters, you will need to install the Kubernetes CLI that corresponds with your operating system:




---

### For macOS
  
```
$ curl -LO https://storage.googleapis.com/kubernetes-release/release/v1.14.0/bin/darwin/amd64/kubectl

$ mv ./kubectl /usr/local/bin/kubectl

$ chmod +x /usr/local/bin/kubectl

```

---
### For Windows 10
  
#### Option 1: Installing with Chocolatey (recommended)

You can install kubectl: 

By running:

```
$ choco install kubernetes-cli
```


#### Option 2: Installing manually	
Or manually: 
	* [Download for Windows](https://storage.googleapis.com/kubernetes-release/release/v1.14.0/bin/windows/amd64/kubectl.exe) and 
	* add the binary in to your PATH.



---
### For Linux
  
```
$ curl -LO https://storage.googleapis.com/kubernetes-release/release/v1.14.0/bin/linux/amd64/kubectl

$ mv ./kubectl /usr/local/bin/kubectl

$ chmod +x /usr/local/bin/kubectl

```



#### Hint SetUpKubectl

No hint available


#### Complete SetUpKubectl

> Confirm SetUpKubectl complete





#### Task SetUpGIT

----

# Install Git on your laptop

To do so : 
### For macOS

For MacOS download [here](http://mac.github.com)

### For Windows

For Windows download [here](http://git-scm.com/download/win)

At some point during the installation, change to the **"Use Windows default console"** and continue the installation.
![Git for Windows](./images/git2.png)


### For Linux

Debian / Ubuntu (apt-get)

```
$ sudo apt-get update
$ sudo apt-get install git
```
Fedora / RHEL / CentOS (dnf/yum)

```
$ sudo yum install git
or 
$ sudo dnf install git
```


#### Hint SetUpGIT

No hint available


#### Complete SetUpGIT

> Confirm SetUpGIT complete




#### Task Troubleshooting


---

### Troubleshooting
---

> **Hint**
> 
> If you get trhe error `no external vswitch found`
> 
> Start minikube with this additional switch `--hyperv-virtual-switch "Minikube"`


---


> 
> **Hint:**
> 
> IF you get the following error:
> 💣 Error starting cluster: wait: waiting for component=kube-apiserver: timed out waiting for the condition
> 
> Try deactivating your VPN (Cisco AnyConnect, ...) and/or reboot.

---

> **Hint:**
> 
> If needed you can specify the VM provider:
> 
> `minikube start --memory=8192 --cpus=4 --vm-driver=virtualbox`
> 
> 
> `minikube start --memory=8192 --cpus=4 --vm-driver=vmwarefusion`
> 

---

> **Hint:**
> 
> If you have previously installed minikube, and run:
> 
> `minikube start`
> 
> And the command returns an error:
> 
> `machine does not exist`
> 
> You need to wipe the configuration files:
> 
> `rm -rf ~/.minikube`




#### Hint Troubleshooting

No hint available


#### Complete Troubleshooting

> Confirm Troubleshooting complete



