//TODO Finish the Switch Event
var sortSelector = document.getElementById("sortSelector");     //The dropdown menu where you can select what type of sort
var nodes = document.getElementsByClassName("Node");

//order of node classes (generic, size, color)

//Allows two Nodes to Be Swapped
var selected = false;       //stores whether or not a node is currently selected
var selectedNode;           //stores the node currently selected

for(i = 0; i < 10; i++){
    nodes[i].addEventListener('mousedown', manualswitchNodes);
}

function manualswitchNodes(e){
    if(!selected){
        selectedNode = this;
        setClass(this, 2, "Selected");
        selected = true;
    }else{
        selected = false
        if(this == selectedNode){               //reset it to default
            setClass(this, 2, "Default");
        }else{
            switchNodes(this, selectedNode);
            setClass(selectedNode, 2, "Default");               //set the old node to default color
        }
        selctedNode = null;
    }
}

//Changes the explanation text to match the sorting type
var explaination = document.getElementById("writeup");

var SelectionExplanation = "<p>Selection sort works by iterating through each element, and swaping the smallest element with the first element that isn't yet sorted.</p>"
var QuickExplanation = "<p>Quick sort works by choosing the middle element, and then dividing each element into 2 groups: one larger than the chosen element, and one smaller. Repeat for each subgroup until each subgroup is only one elment large, and we have a sorted list</p>"
var BubbleExplanation = "<p>Bubble sort works by setting the first element as the main element and comparing it to the next. If the element is larger than the next, switch. Otherwise, set the next element as the main elment. Repeat until the main elment is at the end of the list (the largest is now the larges). Repeat for each element</p>";
var InsertionExplation = "<p>Insertion sort works by taking an already sorted array at the start (An array of One is sorted), and swapping the next element with the next largest sorted element until the next element is in the proper order. Repeat for each element</p>"
var MergeExplanation = "<p>Merge sort works by breaking each half of the list into a sorted array. We then add the smallest element from each subarray into a new array, repeating until both subarrays are exhausted. We then copy each element in order from the new array to the old array.</p>";
var HeapExplanation = "<p>Heap sort works by converting the list into a maximum heap. We then swap the first (largest) element with the last, remove the last element from the heap into the next spot of the sorted array, and then sink the new first element of the heap until we have a valid heap again. Repeat until the heap is empty.</p>";
var BogoExplanation = "<p>You're crazy</p>";

sortSelector.addEventListener('change', updateExplain);

function updateExplain(e){
    var sortType = sortSelector.value;      //checks to see what we have set the selector to
    
    switch(sortType){
        case "Selection":
            explaination.innerHTML = SelectionExplanation;
            break;
        case "Quick":
            explaination.innerHTML = QuickExplanation;
            break;
        case "Bubble":
            explaination.innerHTML = BubbleExplanation;
            break;
        case "Insertion":
            explaination.innerHTML = InsertionExplation;
            break;
        case "Merge":
            explaination.innerHTML = MergeExplanation;
            break;
        case "Heap":
            explaination.innerHTML = HeapExplanation;
            break;
        case "Bogo":
            explaination.innerHTML = BogoExplanation;
            break;
    }
}

//Helper Methods


/*
This function switches the class of a node to a new slected one


@param node: the node whoes class I want to change
@param index: the index of the class I want to change
@param  newClass: The new class I want in the given index
*/
function setClass(node, index, newClass){
    var newClasses = [];
    var classList = node.classList;
    
    for(i = 2; i >= 0; i--){
        newClasses.unshift(node.classList[i]);
        classList.remove(classList[i]);
    }

    newClasses[index] = newClass;

    
    for(i = 0; i < 3; i++){
        classList.add(newClasses[i]);
    }
}

/*
This Function switches the heights of two Nodes, taking the node themselves as Parameters

@param nodeOne, nodeTwo: Nodes to be switched
*/


function switchNodes(nodeOne, nodeTwo){
    console.log(nodeOne.classList);
    var tempSize = nodeOne.classList[1];
    setClass(nodeOne, 1, nodeTwo.classList[1]);       //set this's size to the already selected one
    setClass(nodeTwo, 1, tempSize);                //set the Selected Node to this's size
}