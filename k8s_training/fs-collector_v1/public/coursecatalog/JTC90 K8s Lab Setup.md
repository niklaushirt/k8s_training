
:course_title: JTC90 Kubernetes Lab Setup

:course_desc: This course walks you through the Lab preparations for the Journey to Cloud.

:course_max: 3


:course_auto: no

:button1_label: Task

:button2_label: Hint

:button2_delay: 9999999

:button3_label: Complete

:button3_delay: 300


:infotab: <h1 id="toc_0">Tips and Tricks for getting around in the labs</h1>
:infotab: 
:infotab: <h2 id="toc_1">Mac Tips</h2>
:infotab: 
:infotab: <h3 id="toc_2">Opening Terminal</h3>
:infotab: 
:infotab: <p>In order to rapidly open the terminal application, hit CMD - SPACE and type terminal.</p>
:infotab: 
:infotab: <p><img src="./images/openterminal.png" alt="terminal"></p>
:infotab: <HR>
:infotab: <h2 id="toc_3">Kubernetes Tips</h2>
:infotab: 
:infotab: <h3 id="toc_4">Pod Logs</h3>
:infotab: 
:infotab: <p>You can look at the logs of any of the pods running under your deployments as follows</p>
:infotab: 
:infotab: <div><pre><code class="language-console">$ kubectl logs &lt;podname&gt;</code></pre></div>
:infotab: 
:infotab: <p>Remember that if you have multiple containers running in your pod, you
:infotab: have to specify the specific container you want to see logs from.</p>
:infotab: 
:infotab: <div><pre><code class="language-console">$ kubectl logs &lt;pod-name&gt; &lt;container-name&gt;</code></pre></div>
:infotab: 
:infotab: <p>This subcommand operates like <code>tail</code>. Including the <code>-f</code> flag will
:infotab: continue to stream the logs live once the current time is reached.</p>
:infotab: 
:infotab: <h3 id="toc_5">kubectl edit and vi</h3>
:infotab: 
:infotab: <p>By default, on many Linux and macOS systems, you will be dropped into the editor <code>vi</code>.
:infotab: If you end up in vi you can quit by typing <code>ESC :q!</code></p>
:infotab: 
:infotab: <p>IF you prefer using nano as an editor, execute </p>
:infotab: 
:infotab: <div><pre><code class="language-none">export EDITOR=nano</code></pre></div>
:infotab: 
:infotab: <p>On Windows, a copy of <code>notepad.exe</code> will be opened with the contents of the file.</p>
:infotab: 
:infotab: <h3 id="toc_6">nano basic commands</h3>
:infotab: 
:infotab: <div><pre><code class="language-none">Ctrl-O      To save your work (WriteOut)
:infotab: <BR>Ctrl-X      To exit nano
:infotab: <BR>Ctrl-W      To search for text in a document
:infotab: <BR>Ctrl-K      To cut a line of text</code></pre></div>
:infotab: 
:infotab: <h3 id="toc_7">busybox pod</h3>
:infotab: 
:infotab: <p>For debugging live, this command frequently helps me:</p>
:infotab: 
:infotab: <div><pre><code class="language-console">kubectl run bb --image busybox --restart=Never -it --rm</code></pre></div>
:infotab: 
:infotab: <p>In the busybox image is a basic shell that contains useful utilities.</p>
:infotab: 
:infotab: <p>Utils I often use are <code>nslookup</code> and <code>wget</code>. </p>
:infotab: 
:infotab: <p><code>nslookup</code> is useful for testing DNS resolution in a pod.</p>
:infotab: 
:infotab: <p><code>wget</code> is useful for trying to do network requests.</p>
:infotab: 
:infotab: <h3 id="toc_8">Service Endpoints</h3>
:infotab: 
:infotab: <p>Endpoint resource can be used to see all the service endpoints.</p>
:infotab: 
:infotab: <div><pre><code class="language-console">$ kubectl get endpoints &lt;service&gt;</code></pre></div>
:infotab: 
:infotab: <h3 id="toc_9">ImagePullPolicy</h3>
:infotab: 
:infotab: <p>By default Kubernetes will only pull the image on first use. This can
:infotab: be confusing during development when you expect changes to show up.</p>
:infotab: 
:infotab: <p>You should be aware of the three <code>ImagePullPolicy</code>:</p>
:infotab: 
:infotab: <ul>
:infotab: <li>IfNotPresent - the default, only request the image if not present.</li>
:infotab: <li>Always - always request the image.</li>
:infotab: <li>Never</li>
:infotab: </ul>
:infotab: 
:infotab: <p>More details on image management may be <a href="https://kubernetes.io/docs/concepts/containers/images/">found here</a>.</p>


#### Task SetUpMinikube

----
# Setting up Minikube

### Getting set up

Before we dive into Kubernetes, you need to provision a local Minikube cluster for your containerized app. Then you won't have to wait for it to be ready for the subsequent labs. 

----

## Part 1 - Install a Hypervisor

If you do not already have a hypervisor installed, install one for your OS now:

Operating system	Supported hypervisors:

* macOS	[VirtualBox](https://www.virtualbox.org/wiki/Downloads), VMware Fusion, HyperKit
* Linux	[VirtualBox](https://www.virtualbox.org/wiki/Downloads), KVM
* Windows	[VirtualBox](https://www.virtualbox.org/wiki/Downloads), Hyper-V

    Note: Minikube also supports a --vm-driver=none option that runs the Kubernetes components on the host and not in a VM. Using this driver requires Docker and a Linux environment but not a hypervisor.
    
---

## Part 2 - Install Minikube on your OS

---

### macOS

Requires installing a hypervisor, such as [hyperkit](https://github.com/kubernetes/minikube/blob/master/docs/drivers.md#hyperkit-driver) (recommended) or VirtualBox.

The easiest way to install Minikube on macOS is using Homebrew:

```
# Install brew
$ /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"

#Install minikube
$ brew cask install minikube

```


Or if you don't want to use **brew**

```
$ curl -Lo minikube https://storage.googleapis.com/minikube/releases/latest/minikube-darwin-amd64 \
  && chmod +x minikube

$ sudo mv minikube /usr/local/bin
```


---

### Linux
  * Requires either the [kvm2 driver](https://github.com/kubernetes/minikube/blob/master/docs/drivers.md#kvm2-driver) (recommended), or VirtualBox
  * VT-x/AMD-v virtualization must be enabled in BIOS
  * and by using
  
	   ```
	  $ curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64 && sudo install minikube-linux-amd64 /usr/local/bin/minikube
	   ```

---

### Windows 10
  * Requires a hypervisor, such as VirtualBox (recommended) or HyperV
  * VT-x/AMD-v virtualization must be enabled in BIOS
  * You can install minikube:
	  * either using [chocolatey](https://chocolatey.org/) 
	  
	  ```
	  $ choco install minikube
	  ```
	  
	  * or manually: Download and run the [installer](https://storage.googleapis.com/minikube/releases/latest/minikube-installer.exe)



---


## Part 3 - Starting minikube (all macOS, Windows and Linux)

Then we start minikube (parameters are important for the Istio Lab):

```
$ minikube start --vm-driver virtualbox --memory=8192 --cpus=4                                                                                                                                              

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
---
---


## Some Tips and Tricks if you run into problems

**Hint**

Ir you want to use hyperkit you have to install it with

```
$ brew install hyperkit
$ brew install docker-machine-driver-hyperkit
$ sudo chown root:wheel /usr/local/bin/docker-machine-driver-hyperkit && sudo chmod u+s /usr/local/bin/docker-machine-driver-hyperkit
```

And start minikube with

```
$ minikube start --vm-driver hyperkit --memory=8192 --cpus=4                                                                                                                                              
```





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

And the command returns an error:

`machine does not exist`

You need to wipe the configuration files:

`rm -rf ~/.minikube`




#### Hint SetUpMinikube

No hint available


#### Complete SetUpMinikube

> Confirm SetUpMinikube complete





#### Task SetUpKubectl

----


# Install the Kubernetes CLI

To view a local version of the Kubernetes dashboard and to deploy apps into your clusters, you will need to install the Kubernetes CLI that corresponds with your operating system:




**For Windows users:** 

You can install kubectl: 

* either manually: 
	* [Download for Windows](https://storage.googleapis.com/kubernetes-release/release/v1.14.0/bin/windows/amd64/kubectl.exe) and 
	* add the binary in to your PATH.
	
* or using [chocolatey](https://chocolatey.org/) 
	
	```
	$ choco install kubernetes-cli
	```

---

**For OS X and Linux users:**

#### Install via command line (preferred)

```
$ curl -LO https://storage.googleapis.com/kubernetes-release/release/v1.14.0/bin/darwin/amd64/kubectl

$ mv ./kubectl /usr/local/bin/kubectl

$ chmod +x /usr/local/bin/kubectl


```



#### Direct download

Download from:

* [OS X](https://storage.googleapis.com/kubernetes-release/release/v1.14.0/bin/darwin/amd64/kubectl)
* [Linux](https://storage.googleapis.com/kubernetes-release/release/v1.14.0/bin/linux/amd64/kubectl)

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
![Git for Windows](./images/git2.png)

#### Hint SetUpGIT

No hint available


#### Complete SetUpGIT

> Confirm SetUpGIT complete

