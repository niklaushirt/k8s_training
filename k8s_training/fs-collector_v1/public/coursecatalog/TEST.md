
:course_title: TEST

:course_desc: This course provides the student with the necessary steps to get the Lab setup for IBM Multicloud Manager.  

:course_max: 4

:course_auto: no

:button1_label: Task

:button2_label: Hint

:button2_delay: 999999

:button3_label: Complete

:button3_delay: 30




:infotab: <hr>

:infotab: <h2 id="toc_0">3. Login to ICP</h2>
:infotab: <p>Console: Open firefox browser in the Skytap window and click on IBMCloudPrivateConsole bookmark.</p>
:infotab: <div><pre><code class="language-none">The userid is        admin     
:infotab: <BR>
:infotab: the password is    icp1nCl0ud</code></pre></div>
:infotab: <h2 id="toc_1">4. Prepare command line</h2>
:infotab: <p>CommandLine: Open a terminal window by clicking on the Terminal icon and run: </p>
:infotab: <div><pre><code class="language-none">sudo su - </code></pre></div>
:infotab: <p>password is <code>A1rb0rn3</code>.</p>
:infotab: <p>and then run </p>
:infotab: <div><pre><code class="language-none">scripts/bin/kubcli.sh admin admin </code></pre></div>
:infotab: <p>Then, you can start running kubectl commands.</p>

:infotab: <hr>








----
#### Task Introduction

----


**If you already have an IBMid you can directly skip to the next step.**

![](./images/signup.png)

[Sign up for an IBM Account](http://ibm.biz/COURSE_SIGNUP) (free)

> test
> safd
> 
> 
> asdf
> asdf



```
bmcloud login -a https://cloud.ibm.com --sso
ibmcloud ks region-set eu-central
ibmcloud ks cluster-config mycluster
export KUBECONFIG=/Users/$USER/.bluemix/plugins/container-service/clusters/mycluster/kube-config-fra02-mycluster.yml

kubectl delete -f k8s_deployment_course/instructor

kubectl delete -f k8s_deployment_course/student
```


#### Hint Introduction

No hint available


#### Complete Introduction

> Confirm Introduction complete


----
#### Task Getting an IBMid

----

**If you already have an IBMid you can directly skip to the next step.**

![](./images/signup.png)

[Sign up for an IBM Account](http://ibm.biz/COURSE_SIGNUP) (free)

**Please use your “real” work eMail address.**

**Public eMail addresses (Gmail, Yahoo, …) do NOT work.**




#### Hint Getting an IBMid

No hint available


#### Complete Getting an IBMid

> Confirm Getting an IBMid complete




----
#### Task Creating an ICP Instance

----

# Getting your ICP Instance

## 1. Open the reservation page

[Create a Kubernetes Instance (free)](https://www.ibm.com/cloud/garage/dte/tutorial/ibm-cloud-private-hosted-trial) (free)

## 2. Login to your IBM Account


![](./images/ICP1.png)


## 3. Reserve an Instance

![](./images/ICP2.png)


## 4. Confirmation mail

A few minutes after completing the reservation form, check your inbox for an email that contains instructions about the environment you reserved. Follow the instructions to log in to the instance.

![](./images/mail1.png)

![](./images/mail2.png)


#### Hint Creating an ICP Instance

No hint available


#### Complete Creating an ICP Instance

> Confirm Creating an ICP Instance complete





----
#### Task SkytapStart

----

# Starting your Skytap environment

## 1. Starting your environment

When you log in to your environment for the first time, your VMs may be suspended. 

To start it, click the play icon in the upper-right corner. 

It takes 10 - 15 minutes for IBM Cloud Private to fully start when you first start the environment.

![](./images/skytap1.png)


Check if all VMs are «Running».

It takes some minutes for the Kubernetes Cluster to start inside the VM.





#### Hint SkytapStart

No hint available


#### Complete SkytapStart

> Confirm SkytapStart complete





