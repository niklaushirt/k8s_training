
:course_title: KUB01 Lab Setup

:course_desc: This course walks you through the Lab preparations.  

:course_max: 8

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




#### Task SetUpIKS

----


### Getting set up

Before we dive into Kubernetes, you need to provision a cluster for your containerized app. Then you won't have to wait for it to be ready for the subsequent labs. 

----

# Introduction to IBM Cloud Kubernetes Service (IKS)

IBM Cloud Kubernetes Service combines Docker and Kubernetes to deliver powerful tools, an intuitive user experience, and built-in security and isolation to automate the deployment, operation, scaling, and monitoring of containerized apps over a cluster of independent compute hosts by using the Kubernetes APIs.

With IBM Cloud Kubernetes Service (IKS), you can define complex architectures that implement resiliency, high availability and replication between data centers and regions (also called AZ – availability zones).  



# IBM Cloud registration

Labs are running on the **IBM Cloud** (ex Bluemix).

So before you can start any labs, you should have satisfied the following prerequisites :

- [ ] You should have **1 valid email** 

- [ ] Sign up to the **IBM Cloud** 


##IMPORTANT:
**If you already have a IBM id, you can complete this step and continue setting up the Command Line.**

> If you don't have a valid email address or you don't want to use your personal or professional email address, then you can use https://temp-mail.org/en/

This web site will give you a temporary email address for 10 minutes :

![image-20190118103132743](https://raw.githubusercontent.com/niklaushirt/ContainerOrchestration/master/images/image-20190118103132743-7803892.png)

From that screen,  you can use this temporaty email address (<your-email> for example) for the time to register to the IBM Cloud. 

### Sign in to IBM Cloud
If you don't have already registered to **IBM Cloud**,  
Open this link  [IBM Cloud](https://cloud.ibm.com/) or type https://cloud.ibm.com/ in your favorite internet browser.


![image-20190118101459166](https://raw.githubusercontent.com/niklaushirt/ContainerOrchestration/master/images/image-20190118101459166-7802899.png)

### Fill in the form
Specify last name, first name, country, phone number and password.
> By **default**, all new people that register to IBM Cloud will have an **Lite Account** with **no time restriction**. This is not a 30 day trial account. 

Click on **Create Account** button.

![image-20190118103712268](https://raw.githubusercontent.com/niklaushirt/ContainerOrchestration/master/images/image-20190118103712268-7804232.png) 


Then if everything is fine, you will receive the following page:

![Thanks](https://raw.githubusercontent.com/niklaushirt/ContainerOrchestration/master/images/a003.png)


### Confirm your registration to IBM Cloud from your inbox
From your email application , you should have received an email from the IBM Cloud:

![image-20190118103917487](https://raw.githubusercontent.com/niklaushirt/ContainerOrchestration/master/images/image-20190118103917487-7804357.png)

Click on the link to confirm the account:

![image-20190118104115473](https://raw.githubusercontent.com/niklaushirt/ContainerOrchestration/master/images/image-20190118104115473-7804475.png)

Log in to IBM Cloud with your credentials :

![Success Sign up](https://raw.githubusercontent.com/niklaushirt/ContainerOrchestration/master/images/a005.png)

Then type your password and click **Continue**

![image-20190118104305743](https://raw.githubusercontent.com/niklaushirt/ContainerOrchestration/master/images/image-20190118104305743-7804585.png)

Type your password and click Login button:

![image-20190118104419179](https://raw.githubusercontent.com/niklaushirt/ContainerOrchestration/master/images/image-20190118104419179-7804659.png)

You should see the following **Dashboard**:

![image-20190118104520085](https://raw.githubusercontent.com/niklaushirt/ContainerOrchestration/master/images/image-20190118104520085-7804720.png)

You are now connected (and registred) to the IBM Cloud.

> IMPORTANT : Take a note of your email address and your password.

---



#### Hint SetUpIKS

No hint available


#### Complete SetUpIKS

> Confirm SetUpIKS complete





#### Task Apply Promo Code

----


# Apply a promo code (if necessary)

Check if you can access to **Kubernetes Service**.
To do so, click on **Catalog** and click on **Containers** on the left pane of the page :


![Showing Containers](https://raw.githubusercontent.com/niklaushirt/ContainerOrchestration/master/images/showcontainers.png)

> **IMPORTANT** : If you just see **Container Registry** and not the Containers in Kubernetes Clusters, then **you will need a promo code !!!**

> **IMPORTANT** : If you don't have a **promo code**, then ask IBM during the workshop. You can continue the other steps of this preparation and come back later to this step. However, to create a cluster, you will need a promo code.

To install a promo code, follow the procedure : 

Go to **Manage >Account > Account Settings** and press enter.


![image-20190118112618467](https://raw.githubusercontent.com/niklaushirt/ContainerOrchestration/master/images/image-20190118112618467-7807178.png)

You should get the following section in the **account setting page**  :

![image-20190118112743476](https://raw.githubusercontent.com/niklaushirt/ContainerOrchestration/master/images/image-20190118112743476-7807263.png)

Click **Apply Code** button.


![image-20190118112849245](https://raw.githubusercontent.com/niklaushirt/ContainerOrchestration/master/images/image-20190118112849245-7807329.png)

Enter your **promo code** and click **Apply** 

![Apply Promo Code](https://raw.githubusercontent.com/niklaushirt/ContainerOrchestration/master/images/applypromo2.png)

> Close this window and **logout / login** to your account.

Go back to the **Catalog** and check that now you have access to **Kubernetes Service** and the Container Registry.

![image-20190406152818356](https://raw.githubusercontent.com/niklaushirt/ContainerOrchestration/master/images/image-20190406152818356-4557298.png)


#### Hint Apply Promo Code

No hint available


#### Complete Apply Promo Code

> Confirm Apply Promo Code complete




#### Task SetUpCLI

----

## Install the Command Line Tools


Before you begin learning, you need to install the required CLIs to create and manage your Kubernetes clusters in IBM Cloud Container Service and to deploy containerized apps to your cluster.

This lab includes the information for installing the following CLIs and plug-ins:

* IBM Cloud CLI, Version 0.5.0 or later
* IBM Cloud Container Service plug-in
* Kubernetes CLI, Version 1.10.8 or later
* Git client

The next steps you will guide you through the installation of the CLIs.



### Install the IBM Cloud command-line interface

* As a prerequisite for the IBM Cloud Container Service plug-in, install the [IBM Cloud command-line interface](https://clis.ng.bluemix.net/ui/home.html). Once installed, you can access IBM Cloud from your command-line with the prefix `ibmcloud`.

	For Mac and Linux, run the following command:
		
	```
	$ curl -sL https://ibm.biz/idt-installer | bash
	```
	
	For Windows 10 Pro, run the following command as an administrator:
	
	```
	Set-ExecutionPolicy Unrestricted; iex(New-Object Net.WebClient).DownloadString('http://ibm.biz/idt-win-installer')
	```
		
	_Right-click the Windows PowerShell icon, and select Run as administrator._
		
	You can also download the installer script from this [GitHub repo](https://github.com/IBM-Cloud/ibm-cloud-developer-tools) External link icon. For the steps to install these tools manually, see [Installing the IBM Cloud developer tools CLI plug-in components manually](https://cloud.ibm.com/docs/cli?topic=cloud-cli-install-devtools-manually#install-devtools-manually).


* Log in to the IBM Cloud CLI: `ibmcloud login`.
* Enter your IBM Cloud credentials when prompted.

   **Note:** If you have a federated ID, use `ibmcloud login --sso` to log in to the IBM Cloud CLI. Enter your user name, and use the provided URL in your CLI output to retrieve your one-time passcode. You know you have a federated ID when the login fails without the `--sso` and succeeds with the `--sso` option.

	```
	$ ibmcloud login --sso                                                                  master
	API endpoint: https://api.eu-de.bluemix.net
	
	Get One Time Code from https://identity-2.uk-south.iam.cloud.ibm.com/identity/passcode to proceed.
	Open the URL in the default browser? [Y/n]>
	One Time Code >
	Authenticating...
	OK
	
	Targeted account Niklaus Hirt's Account (a19f6b9014ca92dd18b4db8cb6910d49) <-> 1808847
	
	Targeted resource group default
	
	
	API endpoint:      https://api.eu-de.bluemix.net
	Region:            eu-de
	User:              NIKH@ch.ibm.com
	Account:           Niklaus Hirt's Account (a19f6b9014ca92dd18b4db8cb6910d49) <-> 1808847
	Resource group:    default
	CF API endpoint:
	Org:
	Space:
	```

---


### Install the IBM Cloud Container Service plug-in
1. To create Kubernetes clusters and manage worker nodes, install the IBM Cloud Container Service plug-in:
  
  ```
  $ ibmcloud plugin install container-service -r Bluemix
  ```

   **Note:** The prefix for running commands by using the IBM Cloud Container Service plug-in is `ibmcloud cs`.

2. To verify that the plug-in is installed properly, run the following command:

	``` 
	$ ibmcloud plugin list
	```

   The IBM Cloud Container Service plug-in is displayed in the results as `container-service`.


#### Hint SetUpCLI

No hint available


#### Complete SetUpCLI

> Confirm SetUpCLI complete




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



#### Task LoginIKS

----


# Login to IBM Cloud

For these labs, we have decided to login to the **London Data Center** (api.eu-gb.bluemix.net). 

Login to IBM Cloud with the ibmcloud command :

 `ibmcloud login -a api.eu-gb.bluemix.net`

 And answer a few questions: email, password :

```console
$ ibmcloud login -a api.eu-de.bluemix.net

API endpoint: api.eu-de.bluemix.net

Email> <your-email>

Password> 
Authenticating...
Credentials were rejected.
Code: BXNIM0602E, message: The credentials you entered for the user '<your-email>' are incorrect

Password> 
Authenticating...
OK

Targeted account Philippe Smith's Account (828b1270b40247a897d94167c14051bc)

Targeted resource group Default

                      
API endpoint:      https://api.eu-gb.bluemix.net   
Region:            eu-gb   
User:              <your-email>   
Account:           Philippe Smith's Account (828b1270b40247a897d94167c14051bc)   
Resource group:    Default   
CF API endpoint:      
Org:                  
Space:                

Tip: If you are managing Cloud Foundry applications and services
- Use 'ibmcloud target --cf' to target Cloud Foundry org/space interactively, or use 'ibmcloud target --cf-api ENDPOINT -o ORG -s SPACE' to target the org/space.
- Use 'ibmcloud cf' if you want to run the Cloud Foundry CLI with current IBM Cloud CLI context.

```



And optionally, you can also specify the following ORG and SPACE with that command :

`ibmcloud target -o <your-email> -s dev`

or 

`ibmcloud target --cf`

Results:

 ```console 
$ ibmcloud target -o <your-email> -s dev

Targeted Cloud Foundry (https://api.eu-gb.bluemix.net)

Targeted org <your-email>

Targeted space dev
                      
API endpoint:      https://api.eu-gb.bluemix.net   
Region:            eu-gb   
User:              <your-email>   
Account:           Philippe Smith's Account (828b1270b40247a897d94167c14051bc)   
Resource group:    Default   
CF API endpoint:   https://api.eu-gb.bluemix.net (API version: 2.106.0)   
Org:               <your-email>   
Space:             dev   

 ```




#### Hint LoginIKS

No hint available


#### Complete LoginIKS

> Confirm LoginIKS complete






#### Task CreateCluster

----


# Create your first cluster

Kubernetes is an orchestration tool for scheduling app containers onto a cluster of compute machines. With Kubernetes, developers can rapidly develop highly available applications by using the power and flexibility of containers.

Before you can deploy an app by using Kubernetes, start by **creating a cluster**. A cluster is a set of worker nodes that are organized into a network. The purpose of the cluster is to define a set of resources, nodes, networks, and storage devices that keep applications highly available.

To create a lite cluster:




# Provision a Kubernetes Cluster through the command line

If you haven't already:

* Install the IBM Cloud CLIs and login, as described in the setup steps.
* Provision a cluster:

  ```ibmcloud cs cluster-create --name <name-of-cluster>```

Once the cluster is provisioned, the kubernetes client CLI `kubectl` needs to be
configured to talk to the provisioned cluster.
As this will take some time we will do this in the Labs part of this course.



# Provision a Kubernetes Cluster through the web interface

## 1.  Select the IBM Kubernetes Service	

From the Catalog, in the Containers category, click on **Kubernetes Service**.

![image-20190406152818356](https://raw.githubusercontent.com/niklaushirt/ContainerOrchestration/master/images/image-20190406152818356-4557298.png)

## 2. Create the service

To use that service, click the blue button (**create**) at the bottom:

![](https://raw.githubusercontent.com/niklaushirt/ContainerOrchestration/master/images/createcluster.png)


## 3.	Define a free Cluster

Select **Free** for the cluster type :

![image-20190406162955570](https://raw.githubusercontent.com/niklaushirt/ContainerOrchestration/master/images/image-20190406162955570-4560995.png)

Keep **mycluster** as the name of your cluster

The default cluster type is **free**. Next time, you can create a standard cluster and define additional customizations, like how many worker nodes are in the cluster.


![image-20190118145903795](https://raw.githubusercontent.com/niklaushirt/ContainerOrchestration/master/images/image-20190118145903795-7819943.png)


## 4.	Create the cluster 

Click on the 

![image-20190406211905698](https://raw.githubusercontent.com/niklaushirt/ContainerOrchestration/master/images/image-20190406211905698-4578345.png)

The details for the cluster open, but the worker node in the cluster takes a few minutes (**around 10-15 minutes**) to provision. You can see the status of the worker node in the Worker nodes tab. When the status reaches Ready, your worker node is ready to be used. A green light will appear.

![image-20190118150023069](https://raw.githubusercontent.com/niklaushirt/ContainerOrchestration/master/images/image-20190118150023069-7820023.png)

Click on **Access** to find some more information:

![image-20190406192605615](https://raw.githubusercontent.com/niklaushirt/ContainerOrchestration/master/images/image-20190406192605615-4571565.png)

**Take a note of** :

> - API login endpoint (https://api.ng.bluemix.net for example)
>
> - The region-set (us-south for example)

# What is a lite cluster ?  

The lite cluster has one worker node with 2 CPU and 4 GB memory available for your apps to use for one month.

The worker node is centrally monitored and managed by a dedicated and highly available **IBM-owned Kubernetes master** that controls and monitors all of the Kubernetes resources in the cluster. You can focus on your worker node and the apps that are deployed in the worker node without worrying about managing this master too.

The resources that are required to run the cluster, such as **VLANS and IP addresses**, are managed in an **IBM-owned IBM Cloud** Infrastructure (SoftLayer) account. When you create a standard cluster, you manage these resources in your own IBM Cloud Infrastructure (SoftLayer) account. You can learn more about these resources when you create a standard cluster.

**Tip**: Lite clusters that are created with a IBM Cloud free trial account are **automatically removed** after the free trial period ends, unless you upgrade to a IBM Cloud Pay-As-You-Go account.

#### Hint CreateCluster

No hint available


#### Complete CreateCluster

> Confirm CreateCluster complete




#### Task FinalCheck

----

### 1. Check that ibmcloud cs and ibmcloud cr have been installed

`ibmcloud plugin list`

Results: 

```
$ ibmcloud plugin list
Listing installed plug-ins...

Plugin Name          Version   
container-registry                     0.1.339   
container-service/kubernetes-service   0.1.581    
```


### 2. Check kubectl 

type the following command :

`kubectl version --short`

And you should get version for your client :

```
$ kubectl version --short
Client Version: v1.xx.yy
error: You must be logged in to the server (the server has asked for the client to provide credentials)
```

The error at the end is **normal** because we need to specify how to connect to the master (we will see this in the labs section).


#### Hint FinalCheck

No hint available


#### Complete FinalCheck

> Confirm FinalCheck complete

