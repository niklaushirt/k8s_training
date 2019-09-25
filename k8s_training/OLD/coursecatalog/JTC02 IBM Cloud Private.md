
:course_title: JTC02 IBM Cloud Private

:course_desc: This course provides the student with the necessary steps to get a basic understanding of IBM Cloud Private.  

:course_max: 14

:course_auto: no

:button1_label: Task

:button2_label: Hint

:button2_delay: 999999

:button3_label: Complete

:button3_delay: 30




:infotab: <hr>

:infotab: <h2 id="toc_0">Login to ICP</h2>
:infotab: <p>Console: Open firefox browser in the Skytap window and click on IBMCloudPrivateConsole bookmark.</p>
:infotab: <div><pre><code class="language-none">The userid is        admin     
:infotab: <BR>
:infotab: the password is    admin</code></pre></div>
:infotab: <h2 id="toc_1">Prepare command line</h2>
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

In this tutorial, you install and run a cloud-native microservices application on an IBM® Cloud Private platform on Kubernetes. The application implements a simple guestbook 

The application is called "Guestbook" in the source code. You can see the code for the application on [GitHub](https://github.com/niklaushirt/guestbook.git). 

In this tutorial, you will explore the following key capabilities: 

  
1. Getting to know the Skytap interface
1. Access the IBM Cloud Private management console
1. Modify registry permissions
1. Deploy the Application
1. Launch the Application
1. Expose the Application
1. Upgrade Helm Release
1. Scale the Application
1. Monitoring
1. Logging
1. Kubernetes Storage
1. Authentication



#### Hint Introduction

No hint available


#### Complete Introduction

> Confirm Introduction complete






#### Task CheckLabPrerequisites

In this initial part we will verify that the Lab prerequisites have been installed.


# 1. Check ICP instance

* Click on the link you have received in the eMail
* Enter the password below the link

![](./images/mail2.png)



#### Hint CheckLabPrerequisites

No hint available


#### Complete CheckLabPrerequisites

> Confirm CheckLabPrerequisites complete



----
#### Task Skytap

----

# Lab 1 - Getting to know your Skytap environment

## 1. Starting your environment

Your IBM Cloud Private should now be fully operational. Otherwise please complete ICP00.

![](./images/skytap4.png)


1. Verify that all VMs are «Running».
1. Click on the ICP Master icon to launch the web access.
2. Maximize the window by clicking in the toolbar

 ![](./images/skytap6.png)

## 2. Interface

![](./images/skytap2.png)


**After 2 hours of inactivity, the environment is suspended. If you want to resume your work, click the play icon in the upper-right corner. The restart process takes 3 - 5 minutes. When all the VMs are restarted, you can complete the tutorials by clicking the compute image on the Desktop image.**


	
## 3. Login to ICP

Open firefox browser in the Skytap window and click on `IBMCloudPrivateConsole` bookmark.

	The userid is      admin
	the password is    admin


## 4. Prepare command line
 
CommandLine: Open a terminal window by clicking on the Terminal icon and run: 

```
sudo su - 
```
password is `A1rb0rn3`.


and then run 

```
scripts/bin/kubcli.sh admin admin 
```
Then, you can start running kubectl commands.




#### Hint Skytap

No hint available


#### Complete Skytap

> Confirm Skytap complete




----
#### Task Access the IBM Cloud Private Management Console

----
# Lab 2 - Access the IBM Cloud Private Management Console

If you haven't done so yet.

In this task, you connect to an IBM Cloud Private cluster and log in to the IBM Cloud Private management console. From the management console, you can manage the IBM Cloud Private cluster platform, workloads, security, and catalog.

  1. From a remote machine that is hosting your environment, open a web browser and click on `IBMCloudPrivateConsole` bookmark.

	The userid is      admin
	the password is    admin
.
  
  2. Log in by typing `admin` for the user name and password.

![image-20181016204939-1](./images/image-20181016204939-1.png)



#### Hint Access the IBM Cloud Private Management Console

No hint available


#### Complete Access the IBM Cloud Private Management Console

> Confirm Access the IBM Cloud Private Management Console complete




----
#### Task Modify registry permissions

----

# Lab 3 - Modify Image Security Enforcement

By using the IBM Container Image Security Enforcement feature, you can verify the integrity of your container images before you deploy them to an IBM Cloud Private cluster.

IBM Container Image Security Enforcement controls where images are deployed from, and enforce Vulnerability Advisor (VA) policies. If an image does not meet your defined policy requirements, the pod is not deployed.

When you deploy an application, IBM Container Image Security Enforcement checks whether the Kubernetes namespace that you are deploying to has any policy regulations that must be applied.

You have to modify the registry permissions in order to be able to deploy the demo containers.



![](./images/skytap3.png)

Change registry permissions

1. Click on **Manage > Resource Security**
1. Select **Image Policies**

  ![](./images/icp_19.png)

1. Click on **Create Image Policy**
1. Name it «`all`» and select `Add Registry`

  ![](./images/icp_20.png)
  
1. Create with URL `*`
1. Click `Add`

  ![](./images/icp_21.png)
  
1. Click `Add` again and you should see this:

  ![](./images/icp_22.png)


---
You have modified the security settings of the Cluster in order to deploy any image from any registry.

This settings are only for lab purposes and should **not** be used in a production environment.


#### Hint Modify registry permissions

No hint available


#### Complete Modify registry permissions

> Confirm Tutorial complete





----
#### Task Deploy the Application Workload

# Lab 4 - Deploy the Application Workload
----

Application workloads can be deployed to run on an IBM Cloud Private cluster. The deployment of an application workload must be made available as a Helm package. Such packages must either be made available for deployment on a Helm repository, or loaded into an IBM Cloud Private internal Helm repository.

In this task, you use the IBM Cloud Private management console to deploy the `guestbook` application workload that is hosted on a Helm repository.


## 1. Download the Workshop Source Code

Download the `guestbook` code that we will need in Lab 12.

```
$ git clone https://github.com/niklaushirt/guestbook.git
```



## 2. Create Namespace
  1. Go to the IBM Cloud Private management console that you opened in task 1.

  2. In the upper-left corner, click the menu and click **Manage > Namespaces**.

  ![image-20181024133111-1](./images/icp_53.png)

  3. In the upper-right corner, click **Add Namespace**.

  ![image-20181024133111-1](./images/icp_54.png)

  4. Fill-in the fields with `lab` for the **Name** and `ibm-priviledged-psp` from the **Pod Security Policy** dropdown

  ![image-20181024133111-1](./images/icp_55.png)

  5. Click **Create**.


## 3. Add Helm Repository


  2. In the upper-left corner, click the menu and click **Manage > Helm Repositories**.

	![image-20181024133111-1](./images/icp-guided-demo-step-2.png)

  3. Click **Add repository** to add the Helm repository that hosts the sample `guestbook` application workload.

	a. For the name, type `ibmcase`
	
	b. For the URL, type `https://raw.githubusercontent.com/niklaushirt/guestbook/master/helm/repo/stable`
	
	**Note:** This URL might not be accessible from the browser.
	
	c. Click **Add**.
	
	![image](./images/icp_1.png)
	
	d. Click **Sync Repositories** and then click **OK** and wait for 3~4 minutes for the synchronization to complete.


## 4. Deploy from Catalog

  1. Click the menu and click **Catalog > Helm Charts**. The catalog might take a few seconds to open.


  2. To deploy the application, find the chart **guestbook** and click on it. 

   ![image-20181024133332-4](./images/icp_2.png)

	
  3. The package deployment page opens 

>   If the description is empty wait for a few moments and reload the page - this simply means that the new repository has not been fully synced yet

 ![image-20181024133332-4](./images/icp_4.png)


  4. By default, the latest version of the chart is selected. **Please select version 0.1.0.**

  ![image-20181024133332-4](./images/icp_5.png)
  
  5. Click **Configure** to move to the next step and set any deployment values.

  6. Type **guestbook** for the release name, set the target namespace to **lab**  and make sure the **License** chsckbox is checked. 

  ![image-20181024133332-4](./images/icp_6.png)
    
  7. Expand the All Parameters part and examine the default values for the other configuration settings. You should have the value **1** for the `replica count` and **v1** for the `tag`.
  
  Here you could adapt the deployment parameters but for this exemple we will keep the default ones.

  ![image-20181024133332-4](./images/icp_7.png)


  8. Click **Install**.

     IBM Cloud Private starts processing the Helm charts that are in the package to deploy the microservices for the `guestbook` application.

  9. After the deployment for all the resources is completed, an installation confirmation message is shown. Click **View Helm Release**.

   ![image-20181024133415-7](./images/image-20181024133415-7.png)

  10. Wait a few minutes for the resources that are deployed to the underlying Kubernetes cluster to become operational and available (`AVAILABLE` must change to **1**).

   ![image-20181024133415-7](./images/icp_8.png)
   
  11. Observe the different resources that have been created (Deployments, Pods and Services).
	







#### Hint Deploy the Application Workload

No hint available


#### Complete Deploy the Application Workload

> Confirm Deploy the Application Workload to IBM Cloud Private complete




----
#### Task Launch the Application

# Lab 5 - Launch the Application

----

 1. Make sure all the deployment resources are have been deployed and are available.  

 ![image-20181024133111-1](./images/icp_9.png)

 
 2. In the upper-left corner, click the menu and click **Workloads > Deployments**.

	![image-20181024133111-1](./images/icp_10.png)

 3. You will get a list of all Kubernetes deployments in your cluster. Filter by Namespace `lab` by selecting it in the right upper corner

  ![image-20181024133111-1](./images/icp_40.png)
 
 4. Click on **guestbook**.
 
 5. Examine the details about the `guestbook` application
 
	* `Deplyoment`
	* `Replica Sets`
	* `Services` - how the application is exposed to the ouside world.
	
   ![image-20181024133111-1](./images/icp_12.png)
	
   As well as a list of running Pods for this `Deployment`
	
   ![image-20181024133111-1](./images/icp_13.png)

 6. Next, you verify that the deployed application is functional.

 	In the top right corner, click on `Launch`. 
 	
 	This opens the `guestbook` application through the ICP proxy.

   ![image-20181024133111-1](./images/icp_14.png)	




#### Hint Launch the Application


No hint available


#### Complete Launch the Application


> Confirm Launch the Application complete






----
#### Task Expose the Application Workload

# Lab 6 - Expose the Application Workload

----
In the previous example the `guestbook` application was exposed to the outside world through the ICP proxy.

In this Lab you will expose the application through the clusters IP address using the `NodePort` service type by modifying the `Service` resource.

 
 1. In the upper-left corner, click the menu and click **Nework Access > Services**.

	![image-20181024133111-1](./images/icp_15.png)

 2. You will get a list of all Kubernetes Services in your cluster. Click on **guestbook**.

	![image-20181024133111-1](./images/icp_16.png)

 3. Examine the details about the **guestbook** `Service`. It exposes the `guestbook` application through port 3000 inside the cluster (which can be mapped, as we have seen by the ICP proxy for testing purposes).

	![image-20181024133111-1](./images/icp_17.png)

 4. Go back to the Services list and select `Edit` from the ... menu to the left of the `guestbook` service entry.

  ![image-20181024133111-1](./images/icp_23.png)
 
 5. This will show you the yaml definition of the Service. Note that the Service type is `ClusterIP`.
 
  ![image-20181024133111-1](./images/icp_24.png)
 
 6. Modify `ClusterIP` to `NodePort` and click on `Submit`
 
  ![image-20181024133111-1](./images/icp_25.png)

 7. In the service list, click on **guestbook** again in order to open the Service details.

	 You will see that an arbitrary port in the 31000-32000 range has been assigned.
	 
	 This port number will allow you to reach the `guestbook` application directly from the world outside the cluster.
 
  ![image-20181024133111-1](./images/icp_26.png)

 8. Click on the number and the `guestbook` application will open again only this time through the direct access with the assigned `NodePort`
 
  ![image-20181024133111-1](./images/icp_27.png)
		




#### Hint Expose the Application Workload


No hint available


#### Complete Expose the Application Workload


> Confirm Expose the Application Workload complete





----
#### Task Upgrade Helm Release

# Lab 7 - Upgrade Helm Release
----

In this Lab you will upgrade the Helm Release for your `guestbook` application.

## 1. Upgrade the Release

 1. In the upper-left corner, click the menu and click **Workloads > Helm Releases**.

	![image-20181024133111-1](./images/icp_28.png)

 2. You will get a list of all Helm Releases in your cluster ("Deployed Applications"). Click on the `Updated` header to see the latest deployments

 	![image-20181024133111-1](./images/icp_29.png)
 	
 3. Click on **guestbook**.


 4. In the Helm Release details you can see that version **0.1.0** has been deployed and that a new version **0.2.0** is available.

	![image-20181024133111-1](./images/icp_30.png)
	
 5. Click on `Upgrade` and select version **0.2.0**

 	![image-20181024133111-1](./images/icp_31.png)


 6. If you scroll down and expand the `All Parameters` part you can see that this release contains version **v2** and increases the number of replicas to **2**

 	![image-20181024133111-1](./images/icp_32.png)
 	
 7. Click on `Upgrade`. You will see that the upgrade is in progress and eventually you will see that the current version of the Helm chart has changed to 0.2.0 and that there are 2 `guestbook` pods running.

 	![image-20181024133111-1](./images/icp_33.png)
 	
 8. Refresh the `guestbook` application in your browser to verify that the new version has been deployed.
	To verify that you're running "v2" of `guestbook`, look at the title of the page, it should now be `Guestbook - v2`
   
   ---
   
    **IMPORTANT !!!**
    
   If the page doesn’t show the V2 label reload the webpage without caching - usually done by holding SHIFT and reload.
   Otherwise empty the browser cache.


#### Hint Upgrade Helm Release

No hint available


#### Complete Upgrade Helm Release

> Confirm Upgrade Helm Release complete





----
#### Task Scale the Application Workload

# Lab 8 - Scale the Application Workload

----

## 1. Scale the Release


 1. In the upper-left corner, click the menu and click **Workloads > Deployments**.

	![image-20181024133111-1](./images/icp_10.png)

 2. You will get a list of all Kubernetes deployments in your cluster. Select `Scale` from the ... menu to the left of the `guestbook` service entry.

	![image-20181024133111-1](./images/icp_34.png)

 3. Select **4** for the number of instances and click on `Scale Deployment`.

	![image-20181024133111-1](./images/icp_35.png)
	
## 2. Examine Pods

 1. Back in the Deployment list, click on **guestbook** and scroll to the bottom to veryfy that an additional **2** pods are starting in order to make a total of **4**.

	![image-20181024133111-1](./images/icp_36.png)



 2. Click on one of the pod names to open the Pods detailed information.

    By clicking on the tabs, you can find some general information, like
    
	* the Namespace it's running in
	* when it has been started
	* the IP of the Node the Pod is running on
	* the Cluster internal IP address of the Pod
    
    ![image-20181024133111-1](./images/icp_39.png)
    	
    The containers that are running in the Pod
    
	![image-20181024133111-1](./images/icp_37.png) 
	   
    And the actions that have been performed on the Pod

	![image-20181024133111-1](./images/icp_38.png)


#### Hint Scale the Application Workload


No hint available


#### Complete Scale the Application Workload


> Confirm Scale the Application Workload complete




----
#### Task Monitoring


# Lab 9 - Monitoring

----


You can use the ICP cluster monitoring dashboard to monitor the status of your cluster and applications.The monitoring dashboard uses Prometheus and Grafana to present detailed data about your cluster nodes and containers.

Prometheus is an open-source, systems monitoring and alerting toolkit originally built at SoundCloud. Prometheus joined the CNCF in 2016 as the second hosted project, after Kubernetes. Most Prometheus components are written in Go, making them easy to build and deploy as static binaries. Prometheus components are:

  1. **Prometheus server** monitors Targets, Targets can be any endpoint over HTTP, HTTPS, DNS, TCP and ICMP (*Black-Box Exporter) or it could be a simple HTTP endpoint that an application exposes through which the Prometheus server gets the application health status from. Prometheus serverscrapes targets at an interval that you define to collect metrics from specific targets and store them in a time-series database and you use a query language called PromQL to query metrics about the targets.
  2. **Alert Manager** takes in alerts, aggregates them into groups, de-duplicates, applies silences, throttles, and then sends out notifications to email, Pagerduty, Slack etc.
  3. **Exporter** is a piece of software that gets existing metrics from a third-party system and exports them to the metric format that the Prometheus server can understand.
  4. **Grafana** is the visualization layer to visualize metrics stored in the Prometheus database. Instead of writing PromQL queries directly into the Prometheus server, you use Grafana UI boards to query metrics from Prometheus server and visualize them in the Grafana Dashboard.

The dashboard can be accessed by opening a new tab in a browser and clicking the **Grafana** bookmark.

The following dashboards are predeployed along with the product.

  * Cluster Network Health (Calico).
  * ElasticSearch.
  * Etcd by Prometheus.
  * Helm Release Metrics.
  * ICP Namespaces Performance IBM Provided 2.5.
  * ICP Performance IBM Provided 2.5.
  * Kubernetes: Cluster Monitoring.
  * Kubernetes: POD Overview.
  * NGINX Ingress controller.
  * Node Performance Summary.
  * Prometheus stats.
  * Rook-Ceph.
  * Storage GlusterFS Health.
  * Storage Minio Health.

## 1. Kubernetes Monitoring

  1. Click the menu and click **Platform > Monitoring**. 

  ![image-20181024133332-4](./images/icp_56.png)

  2. Click on the **Home** button on the top-left. 

   ![image-20181024133332-4](./images/icp_57.png)

	
  3. Select the `Kubernetes: Cluster Monitoring` dashboard.

   ![image-20181024133332-4](./images/icp_58.png)
  
  4. Explore the dashboard by clicking on `Total Usage` for example.

   ![image-20181024133332-4](./images/icp_59.png)

  5. You can continue exploring other dashboards as well if time permits

#### Hint Monitoring

No hint available


#### Complete Monitoring

> Confirm Monitoring complete





----
#### Task Logging

# Lab 10 - Logging

----

ICP Logging uses Elastic Search, Logging and Kibana (ELK) stack for logging. More user ELK stacks can be deployed from the catalog and configured.The installed ELK stack collects system logs for the ICP managed services including Kubernetes and Docker. The default ELK stack and Filebeat daemonsets collects the container logs that are deployed. ICP doesn’t limit the number of ELK stacks deployed.

![image-20181024104044-1](./images/image-20181024104044-1.png)

**Elasticcsearch** is the index, store, and query application on the ELK stack. It provides a standard full text search facility of the log file records processed by Logstash. The ELK online help documentation describes Elasticsearch as follows: “It is generally used as the underlying engine/technology that powers applications that have complex search features and requirements.”

**Logstash** is an application that allows the ELK stack to manage the gathering, transformation, and transport of log file records. Logstash is able to pull records from remote sources or listen for records on specified ports.

**Kibana** is the user interface which integrates withElasticsearch to visualise the results of searches and allow the creation of charts and dashboards based on the searches. The searches, charts, and dashboard can visualise real-time or historical log records.

Logging dashboard can be accessed by opening a new tab in a browser and clicking the **Kibana** bookmark.

## 1. Guestbook Application Logging


 1. In the upper-left corner, click the menu and click **Workloads > Deployments**.

	![image-20181024133111-1](./images/icp_10.png)

 2. You will get a list of all Kubernetes deployments in your cluster. Filter by Namespace **lab** by selecting it in the right upper corner

  ![image-20181024133111-1](./images/icp_40.png)
 
 3. Click on **guestbook**

 4. Scroll to the bottom and click on the ... menu for one of the Pods and select `View Logs`.
		
 ![image-20181024133111-1](./images/icp_45.png)


 5. This will open the Kibana Dashboard

  ![image-20181024133111-1](./images/icp_46.png)
  
  
 6. Remove the filter by Pod in order to see all messages for the `lab` Namespace by clicking on the dustbin icon

  ![image-20181024133111-1](./images/icp_47.png)

 7. Add the `log` column to see more the messages more clearly

  ![image-20181024133111-1](./images/icp_48.png)

 8. Open the Guestbook app and enter "Hello World"

  ![image-20181024133111-1](./images/icp_50.png)

 9. Go back to Kibana and reload the browser window.
 
   You should find a line for the "hello world" call that has been logged 

  ![image-20181024133111-1](./images/icp_49.png)


## 2. Explore some more

 1. Add the `kubernetes.container_name` to the view
 2. Type a search string in the Search field (try `error` or `hello`) and observe the result

  ![image-20181024133111-1](./images/icp_51.png)
	



#### Hint Logging

No hint available


#### Complete Logging

> Confirm Logging complete




----
#### Task KubernetesStorage


# Lab 11 - Kubernetes Storage
----

Managing storage is a particular challenge in Kubernetes. 
The `PersistentVolume` subsystem provides an interface for users and administrators that abstracts details of how storage is provided from how it is consumed. 

---



  ![image-20181024133415-7](./images/icp_41.png) 

  * **Cluster**  
By default, every cluster is set up with a plug-in to [provision file storage](https://cloud.ibm.com/docs/containers?topic=containers-file_storage#add_file). You can choose to install other add-ons, such as the one for [block storage](https://cloud.ibm.com/docs/containers?topic=containers-block_storage). To use storage in a cluster, you must create a persistent volume claim, a persistent volume and a physical storage instance. When you delete the cluster, you have the option to delete related storage instances.

  * **App**  
To read from and write to your storage instance, you must mount the persistent volume claim (PVC) to your app. Different storage types have different read-write rules. For example, you can mount multiple pods to the same PVC for file storage. Block storage comes with a RWO (ReadWriteOnce) access mode so that you can mount the storage to one pod only.

  * **Persistent volume claim (PVC)**   
A PVC is the request to provision persistent storage with a specific type and configuration. To specify the persistent storage flavor that you want, you use [Kubernetes storage classes](https://cloud.ibm.com/docs/containers?topic=containers-kube_concepts&cm_mc_uid=90644909229215500748661&cm_mc_sid_50200000=56559311557910002621#storageclasses). The cluster admin can define storage classes, or you can choose from one of the predefined storage classes or add additional ones. When you create a PVC, the request is sent to the storage provider. Depending on the configuration that is defined in the storage class, the Persistent volume is provisioned if it does not exist or bound to ann existing PV that fulfills the requirements (size, type, ...). If the requested configuration does not exist, the storage is not created.

  * **Persistent volume (PV)**   
A PV is a virtual storage instance that is added as a volume to the cluster. The PV points to a physical storage device in your infrastructure (NFS, GlusterFS, vSphereVolume, Rook/Ceph, OpenEBS...) and abstracts the API that is used to communicate with the storage device. To mount a PV to an app, you must have a matching PVC. Mounted PVs appear as a folder inside the container's file system.


  * **Physical storage**   
A physical storage instance that you can use to persist your data. However, data that is stored on a physical storage instance is not backed up automatically. Depending on the type of storage that you use, different methods exist to set up backup and restore solutions.


---


  * **Static provisioning**
  
  A cluster administrator can use static provisioning to make existing storage devices available to a cluster. The cluster administrator creates a number of PVs that are available for consumption. The cluster administrator must know the details of the storage device, its supported configurations, and mount options.

  * **Dynamic provisioning**
  
  You can use dynamic provisioning to order storage on demand. With dynamic provisioning, the cluster administrator does not need to pre-provision storage. Dynamic provisioning uses storage class.

 For more information about dynamic provisioning in IBM Cloud Private, see Dynamic storage provisioning.

  * **Storage Class**

 A storage class is used to dynamically provision volumes when there is a request for a volume. 
 
  It abstracts the underlying storage platform so that you do not have to know the details of the storage platform. 
  
  The cluster administrator provides pre-defined storage classes for each type of storage that is supported in your cluster. Administrators can also specify a default storage class for PVCs that do not request for any particular storage class.


  * **Reclaim policy**

 A reclaim policy releases a volume for reuse. When you no longer need a volume, you can delete the PVC objects, which allows the volume to be reclaimed. A reclaim policy of a PV tells the cluster what to do with the volume after it is released of its claim. Currently, volumes can either be retained, recycled, or deleted.


  * **Access mode**

 Kubernetes supports three kinds of access modes for PVs: ReadWriteOnce, ReadOnlyMany, and ReadWriteMany.

   * ReadWriteOnce (RWO) - the volume can be mounted as read/write by a single node
   * ReadOnlyMany (ROX) - the volume can be mounted as read-only by multiple nodes
   * ReadWriteMany (RWX) - the volume can be mounted as read/write by multiple nodes


---

In this exercise, you create a hostPath PersistentVolume. Kubernetes supports hostPath for development and testing on a single-node cluster. A hostPath PersistentVolume uses a file or directory on the Node to emulate network-attached storage.

**In a production cluster, you should never use hostPath.**

Instead a cluster administrator would provision a network resource like an NFS share or a GlusterFS cluster.





## 1. Create the PersistentVolume

The configuration file specifies that the volume is at /datavol/lab on the cluster’s Node. The configuration also specifies a size of 10 gibibytes and an access mode of ReadWriteOnce, which means the volume can be mounted as read-write by a single Node.

```yaml
kind: PersistentVolume
apiVersion: v1
metadata:
  name: lab-pv-volume
  labels:
    type: local
spec:
  storageClassName: manual
  capacity:
    storage: 10Gi
  accessModes:
    - ReadWriteOnce
  nfs:
      server: 10.0.0.2
      path: "/datavol/lab"

    
```   
    
  1. Open the screen to create resources from code by clicking on  **Create resource** in the top right corner. 

   ![image-20181024133332-4](./images/icp_43.png)

  2. Simply paste the code above in the window (by replacing the code that's already there) and click **Create**. 

   ![image-20181024133332-4](./images/icp_44.png)




    
## 2. Create the PersistentVolumeClaim

Create a PersistentVolumeClaim to request physical storage.    

    
``` yaml
kind: PersistentVolumeClaim
apiVersion: v1
metadata:
  name: lab-pv-claim
  namespace: lab
spec:
  storageClassName: manual
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 3Gi
```

After you create the PersistentVolumeClaim, the Kubernetes control plane looks for a PersistentVolume that satisfies the claim’s requirements. If the control plane finds a suitable PersistentVolume with the same StorageClass, it binds the claim to the volume.

 1. Create the PVC by copying the definition above like in step 1 by using the **Create resource** window

 2. When that's done, click the menu and click **Platform > Storage**. 

 3. Verify that the PV has been created and that the status is `Bound`. 

   ![image-20181024133332-4](./images/icp_42.png)



## 3. Pods using the PersistentVolumeClaim

We could now create a Deployment that uses your PersistentVolumeClaim as a volume (we wont' actually do this, it's just to illustrate the process).

```
apiVersion: extensions/v1beta1
kind: Deployment
metadata:
  name: lab-pv
  namespace: lab
spec:
  replicas: 1
  selector:
    matchLabels:
      app: lab-pv
  template:
    metadata:
      labels:
        app: lab-pv
    spec:
      containers:
        - name: lab-pv-container
          image: nginx
          ports:
            - containerPort: 80
              name: "http-server"
          volumeMounts:
            - mountPath: "/usr/share/nginx/html"
              name: lab-pv-storage
      volumes:
        - name: lab-pv-storage
          persistentVolumeClaim:
            claimName: lab-pv-claim

```

Notice that the Deployment configuration file specifies a PersistentVolumeClaim, but it does not specify a PersistentVolume. From the Pod’s point of view, the claim is a volume.

  


#### Hint KubernetesStorage

No hint available


#### Complete KubernetesStorage

> Confirm KubernetesStorage complete




----
#### Task Authentication

# Lab 12 - Authentication

## 1. Install OpenLDAP

  1. Click the menu and click **Catalog > Helm Charts**. The catalog might take a few seconds to open.


  2. To deploy the application, find the chart **icp-openldap-devel** and click on it. 

   ![image-20181024133332-4](./images/ldap1.png)

	
  3. The package deployment page opens.
  
  4. Click **Configure** to move to the next step and set any deployment values.

  5. Type `ldap` for the release name and make sure the target namespace is set to `services`. 
 
  ![image-20181024133332-4](./images/ldap8.png)

    
    
  6. Click **Install**.


  7. After the deployment for all the resources is completed, an installation confirmation message is shown. Click **View Helm Release**.


  8. Scroll down to the Services section and click on **ldap-admin**.
  
 ![image-20181024133332-4](./images/ldap6.png)

  9. From the Services view, open the LDAP Admin interface by clicking on the port number **31080**.
  
   ![image-20181024133415-7](./images/ldap2.png)


## 2. Creating OpenLDAP Users

 1. you can login by using:
   * Username:  `cn=admin,dc=local,dc=io`
	* Password: `admin`

  ![image-20181024133415-7](./images/ldap3.png)

 2. Create users by selecting the Import button and by pasting the following definitions that you can find here:
  
  <a href="./resources/ldapusers.txt" target="_blank"><B>LDAP Configuration File</B>.</a>
  
  ![image-20181024133415-7](./images/ldap4.png)

3. You should get the following message
  
  ![image-20181024133415-7](./images/icp_52.png)


 4. Verify that three Dev users have been created.

  ![image-20181024133415-7](./images/ldap5.png)

	**IMPORTANT:** If you get some `LDAP said: Already exists` errors, just ignore them


## 3. Configuring ICP to integrate with OpenLDAP


 1. Go to the folder where you have downloaded the `guestbook` Git repository  

 	``` 
	$ cd guestbook
	```
 
 2. Run script  

	``` 
	$ ./sbin/configure-ldap-icp.sh
	```
 
 3. Run script  

	``` 
	$ ./sbin/configure-team-icp.sh
	```
 
## 4. Verifying OpenLDAP integration


 1. Navigate to ***Manage > Identity&Access*** 

 2. Open the **openLdap** connection detail by clicking on `Edit` in the right hand ... menu. Then confirm that you want to edit. 
 3. Observe the connection details
    #### LDAP Connection
    - Name: `openLdap`
    - Type: `Custom`

    #### LDAP authentication
    - Base DN: `dc=local,dc=io` (default value, adjust as needed)
    - Bind DN: `cn=admin,dc=local,dc=io` (default value, adjust as needed)
    - Admin Password: `admin` (default value, adjust as needed)

    #### LDAP Server
    - URL: `ldap://<cluster-ip>:389`

    #### LDAP Filters
    - Group filter: `(&(cn=%v)(objectclass=groupOfUniqueNames))`
    - User filter: `(&(uid=%v)(objectclass=person))`
    - Group ID map: `*:cn`
    - User ID map: `*:uid`
    - Group member ID map: `groupOfUniqueNames:uniquemember`

    Click ***Cancel*** to go back.


## 5. Verifying Teams and add Users

 1. On the left hand menu click on ***Teams***
 2. Click ***Dev Team*** in the list
    
 3. Click ***Users*** tab and observe the three users that are part of the Team. Each user has another role. You can edit the users role with the right hand ... menu.



## 6. Assigning resources to Teams

 1. Click ***Resources*** tab and then ***Manage Resources***
 2. Select the **guestbook** Helm chart in **ibmcase** and the **lab** and **default** Namespace

  ![image-20181024133415-7](./images/ldap7.png) 

 3. Click ***Save*** 


## 7. Check new login
 
 1. Logout of ICP
 2. Login with user **dev1** and password **demo**
 3. Go to the Catalog and observe that the user has access only to the selected **guestbook** Helm chart.

  ![image-20181024133415-7](./images/ldap9.png) 

 4. Logout and login again with **admin** / **admin** .

----



#### Hint Authentication



No hint available


#### Complete Authentication

> Confirm Authentication complete









