## Collector deployment

<br>
Collector has three components / objects that must be created to successfully be used by the [fsapp](https://github.com/ibmicpcoc/fsapp).  

<b>fsapp</b> is used in multiple sessions and will report/send data to the collector. 
<br>

| Object | Description |
| :---: | :--- |
| Deployment | container deployment |
| Service | network interface using node-port definition |
| ConfigMap | configuration file that provides the service endpoint.  This config map will need to be modified and created in each namespace that will access the collector.  See below for additional information for modifying this file. |
 

All objects can be created at once using the collector_all.yaml file.  Otherwise use the individual files to create each object.

<br><br>

### Modifying the collector ConfigMap. 

Each namespace that will send data to the collector via the fsapp must create the collector-config ConfigMap in that namespace.

Modify the value <b> < USING NAMESPACE > </b> of the metadata.namespace with the appropriate value.  


>If the namespace where the collector is running is not <b>default</b> the parameter COLLECTOR_CONFIG in the data section must be changed. 

```
---
apiVersion: v1
kind: ConfigMap
metadata:
  name: collector-config
  namespace: <USING NAMESPACE>
data:
  COLLECTOR_CONFIG: ‘http://collector.default’.     
```

>Modify the .default portion of the http://collector.default to have the name of the namespace where the collector is running.  Example if the collector is running in namespace <b>dave</b> then the vaule would be <br><br>COLLECTOR_CONFIG: <b>'http://collector.dave'</b>  



