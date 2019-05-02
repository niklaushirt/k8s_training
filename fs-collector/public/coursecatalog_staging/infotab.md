# Tips and Tricks for getting around in the labs

Advanced debugging techniques to reach your pods.

## Pod Logs

You can look at the logs of any of the pods running under your deployments as follows

```console
$ kubectl logs <podname>
```

Remember that if you have multiple containers running in your pod, you
have to specify the specific container you want to see logs from.

```console
$ kubectl logs <pod-name> <container-name>
```

This subcommand operates like `tail`. Including the `-f` flag will
continue to stream the logs live once the current time is reached.


## kubectl edit and vi

By default, on many Linux and macOS systems, you will be dropped into the editor `vi`.
If you end up in vi you can quit by typing `ESC :q!`

IF you prefer using nano as an editor, execute 

```
export EDITOR=nano
```

On Windows, a copy of `notepad.exe` will be opened with the contents of the file.

## nano basic commands


```
Ctrl-O		To save your work (WriteOut)
Ctrl-X		To exit nano
Ctrl-W		To search for text in a document
Ctrl-K		To cut a line of text
```



## busybox pod

For debugging live, this command frequently helps me:

```console
kubectl run bb --image busybox --restart=Never -it --rm
```

In the busybox image is a basic shell that contains useful utilities.

Utils I often use are `nslookup` and `wget`. 

`nslookup` is useful for testing DNS resolution in a pod.

`wget` is useful for trying to do network requests.

## Service Endpoints

Endpoint resource can be used to see all the service endpoints.

```console
$ kubectl get endpoints <service>
```

## ImagePullPolicy

By default Kubernetes will only pull the image on first use. This can
be confusing during development when you expect changes to show up.

You should be aware of the three `ImagePullPolicy`:

 - IfNotPresent - the default, only request the image if not present.
 - Always - always request the image.
 - Never

More details on image management may be [found here](https://kubernetes.io/docs/concepts/containers/images/).
