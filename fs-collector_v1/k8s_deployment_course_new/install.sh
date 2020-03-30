
kubectl apply -f fscollector_instructor.yaml

declare -a arr=("black" "white" "red" "blue" "yellow" "lime" "cyan" "orange" "purple" "maroon" "olive" "brown" "lightblue" "firebrick" "peru" "chocolate" "orchid" "gold" "pink" "violet")
#declare -a arr=("black" "white")


for i in "${arr[@]}"
do
    echo "$i"
    cat fscollector_template.yaml | gsed -r "s/_COLOR_/$i/" | kubectl apply -f -


done

kubectl get routes | awk -F " " '{print $2}'


