
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



A Kubernetes-based container platform, IBM Cloud Private, can help you quickly move, modernize and automate workloads or build new cloud-native applications. Development and deployment takes place on your infrastructure, in your data center, or across multiple clouds, both public and private. If you're familiar with Kubernetes, you can explore the IBM Cloud Private environment on your own. It starts with a quick registration step and then you'll have access to 6 server instances hosting Kubernetes nodes, preconfigured with sample applications and services. The sections below are areas that you can explore and include sample applications.

In this tutorial, you will explore the following key capabilities:

    Hands-on experience with IBM Cloud Private in a representative production environment






#### Hint Introduction

No hint available


#### Complete Introduction

> Confirm Introduction complete


----
#### Task Getting an IBMid

----

![](https://raw.githubusercontent.com/niklaushirt/k8s_training/master/fs-collector/public/images/signup.png)

[Sign up for an IBM Account](ibm.biz/COURSE_SIGNUP) (free)

**Please use your “real” work eMail address.
Public eMail addresses (Gmail, Yahoo, …) do NOT work.**




#### Hint Getting an IBMid

No hint available


#### Complete Getting an IBMid

> Confirm Getting an IBMid complete




----
#### Task Getting an ICP Instance

----

# Getting your ICP Instance



[Create a Kubernetes Instance (free)](https://www.ibm.com/cloud/garage/dte/tutorial/ibm-cloud-private-hosted-trial) (free)

## Login to your IBM Account


![](https://raw.githubusercontent.com/niklaushirt/k8s_training/master/fs-collector/public/images/ICP1.png)


## Reserve an Instance

![](https://raw.githubusercontent.com/niklaushirt/k8s_training/master/fs-collector/public/images/ICP2.png)


## Confirmation mail

A few minutes after completing the reservation form, check your inbox for an email that contains instructions about the environment you reserved. Follow the instructions to log in to the instance.

![](https://raw.githubusercontent.com/niklaushirt/k8s_training/master/fs-collector/public/images/mail1.png)

![](https://raw.githubusercontent.com/niklaushirt/k8s_training/master/fs-collector/public/images/mail2.png)


#### Hint Getting an ICP Instance

No hint available


#### Complete Getting an ICP Instance

> Confirm Getting an ICP Instance complete





----
#### Task Skytap

----

# Getting to know your Skytap environment

## Starting your environment

When you log in to your environment for the first time, your VMs may be suspended. To start it, click the play icon in the upper-right corner. It takes 10 - 15 minutes for IBM Cloud Private to fully start when you first start the environment.

![](https://raw.githubusercontent.com/niklaushirt/k8s_training/master/fs-collector/public/images/skytap1.png)


Check if all VMs are «Running»
Click on the ICP Master icon to launch the web access
It thakes some minutes for the Kubernetes Cluster to start inside the VM


## Interface

![](https://raw.githubusercontent.com/niklaushirt/k8s_training/master/fs-collector/public/images/skytap2.png)




> After 2 hours of inactivity, the environment is suspended. If you want to resume your work, click the play icon in the upper-right corner. The restart process takes 3 - 5 minutes. When all the VMs are restarted, you can complete the tutorials by clicking the compute image on the Desktop image.



	FIREFOX
	
	CATALOG
	
## Login to ICP

Console: Open firefox browser and click on IBMCloudPrivateConsole bookmark.

	The userid is      admin
	the password is    icp1nCl0ud


## Prepare command line
 
CommandLine: Open a terminal window, run 

```
sudo su - 
```
(password A1rb0rn3) 
and then run 

```
scripts/kubcli.sh <userid> <password>. 
```
Then, you can start running kubectl commands.



![](https://raw.githubusercontent.com/niklaushirt/k8s_training/master/fs-collector/public/images/skytap3.png)

Change registry permissions
Click on Manage / Resource Security
Image Policies
Create Image Policy
Name it «all» and select Add Registry	
Create with URL *
Add





#### Hint Skytap

No hint available


#### Complete Skytap

> Confirm Skytap complete




----
#### Task Introduction

----



#### Hint Introduction

No hint available


#### Complete Introduction

> Confirm Introduction complete




----
#### Task Introduction

----



#### Hint Introduction

No hint available


#### Complete Introduction

> Confirm Introduction complete





```




