
:course_title: KUB01 Check Installation

:course_desc: This course walks you through the checks for the Labs.  

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


#### Task CheckLabPrerequisitesMinikube

In this initial part we will verify that the Lab prerequisites have been installed.


# 1. Check Minikube
## Make sure minikube is running 


* Verify that minikube is running
	If not please complete KUB99 Lab Setup


	```
	$ minikube status
	
	host: Running
	kubelet: Running
	apiserver: Running
	kubectl: Correctly Configured: pointing to minikube-vm at 192.168.99.100
	```
	
* Verify kubectl can communicate with your cluster.

	```
	$ kubectl get nodes
	
	NAME       STATUS    ROLES     AGE       VERSION
	minikube   Ready     master    32m       v1.14.1
	```




#### Hint CheckLabPrerequisitesMinikube

No hint available


#### Complete CheckLabPrerequisitesMinikube

> Confirm CheckLabPrerequisitesMinikube complete


#### Task CheckLabPrerequisitesKubectl

# 2. Check kubectl 

type the following command :

`kubectl version --short`

And you should get version for your client :

```
$ kubectl version --short
Client Version: v1.14.1
Server Version: v1.14.1
```

If minikube is not running yet you will get the following, which is **perfectly normal** in this case.

```
$ kubectl version --short
Client Version: v1.14.1
error: You must be logged in to the server (the server has asked for the client to provide credentials)
```



#### Hint CheckLabPrerequisitesKubectl

No hint available


#### Complete CheckLabPrerequisitesKubectl

> Confirm CheckLabPrerequisitesKubectl complete


#### Task CheckLabPrerequisitesGit


# 3. Check git 

type the following command :

`git version `

And you should get something similar :

```
$ git version                                                                                                                         
git version 2.18.0
```




#### Hint CheckLabPrerequisitesGit

No hint available


#### Complete CheckLabPrerequisitesGit

> Confirm CheckLabPrerequisites complete


