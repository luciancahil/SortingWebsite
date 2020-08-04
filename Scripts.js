var sortSelector = document.getElementById("sortSelector");     //The dropdown menu where you can select what type of sort
var nodes = document.getElementsByClassName("Node");
const numNodes = nodes.length;
var wait;       //the variable that will store all setInterval() objects

//The following are meant to help the nextStep button
var started = false;        //for help with the "Next Step" button. Determines whether the function needs to setup the arrays or can proceed to the next step
var nextStepOrder;          //the array that wil be used to store the next current order
var done = false;           //Checks if the array is done or not


//order of node classes (generic, size, color)


//Function for the randomizer button

function randomize(){
    let intList = [];           //stores intergers from - to numNodes -1
    let classes = [];           //stores the classes in order for the first node to the last
    resetSteps();               //resets the steps display to be blank
    resetSelection();
    done = false;               
    started = false;
    
    for(i = 0; i < numNodes; i++){        //we have now created a list of numbers from 0 to numNodes -1 inclusive
        intList.push(i);
    }

    for(i = numNodes - 1; i >= 0; i--){
        let index = Math.floor(Math.random() * i); //chooses a random number between 0 and i
        let randomNumber = intList[index];                  //selects the number
        let size = nodes[randomNumber].classList[1];    //selects the size from the chosen element
        classes.push(size);     
        intList[index] = intList[i];                //moves the last elment into the spot of the element just chosen
        
    } 
    

    //classes now contains size classes in random order.

    for(j = numNodes - 1; j >= 0; j--){
        let node = nodes[j];
        let size = classes[j];
        setClass(node, 1, size);
    }


}

//Allows two Nodes to Be Swapped when clicked
var selected = false;       //stores whether or not a node is currently selected
var selectedNode;           //stores the node currently selected

for(i = 0; i < numNodes; i++){
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


//Selection Sort Function
var selectionOrder;
var selectionSorted = 0;    //how many nodes in the array are already sorted
var selectionStepNum = 1;     //Which step we are currently on

function selectionSort(){           //this is run when the "sort" button is pressed for selection sort
    selectionOrder = getOrder();                //sets selectionOrder to be the current order of the nodes
    wait = setInterval(selectionSwap, 500);     //calls each selection with a .5 second delay
    resetSelection()
}

function runSelectionSteps(){           //meant for use with the Next Step Button
    if(!started){
        selectionOrder = getOrder();                //sets selectionOrder to be the current order of the nodes
        started = true;                             //next time, proceed straight to running Selection swap rather than recreating the list
    }

    if(!done){
        selectionSwap();
    }else{
        resetSelection();
    }
}

function resetSelection(){
    selectionSorted = 0;            //reset the number of sorted so that we can use it again without refreshing
    selectionStepNum = 1;           //reset the number of steps
}


function selectionSwap(){
    if(selectionSorted >= (numNodes - 1)){          //checks if the array is already sorted (-2 because if everything but the last is in proper place, the last must be the largest, and therefor sorted)
        clearInterval(wait);
        done = true;
        return;
    }

    let smallest = selectionSorted;                         //Set smallest to be the index of the smalles non sorted node
    for(let n = selectionSorted + 1; n < numNodes; n++){    //checks every node after this index. If a smallest node is found, check smallest 
        if(selectionOrder[n] < selectionOrder[smallest]){   
            smallest = n;
        }
    }

    if(smallest != selectionSorted){                            //If true, then the node is already in the correct place, no need for any switching
        swapArray(selectionOrder, smallest, selectionSorted);   //Swap the 2 numbers in the array
        numSwap(selectionSorted, smallest);                     //swap the 2 nodes
    }
    let nextStep = selectionStepNum + ". Node " + smallest + " was the smallest remaining node. Switch Node " + smallest + " with current Node " + selectionSorted + ".";

    addStep(nextStep);      //Adds the step onto the step box
    selectionStepNum++;     //increments the step number
    selectionSorted++;      //increments the number of sorted arrays
}





//Helper Methods


/*
This function switches the class of a node to a new slected one


@param node: the node whoes class I want to change
@param index: the index of the class I want to change
@param  newClass: The new class I want in the given index
*/
function setClass(node, index, newClass){
    let newClasses = [];
    let classList = node.classList;
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
    let tempSize = nodeOne.classList[1];
    setClass(nodeOne, 1, nodeTwo.classList[1]);       //set this's size to the already selected one
    setClass(nodeTwo, 1, tempSize);                //set the Selected Node to this's size
}


/*
This function returns the current sizes of the nodes in order
*/

function getOrder(){
    let order = [];         //stores the size of the nodes in order

    for(i = 0; i < numNodes; i++){
        let node = nodes[i];            //gets the first Node
        let size = node.classList[1];   //gets the class that controls the size
        let stringNum = size.substring(1);      //removes the s at the begining of the class name to get a number
        let number = parseInt(stringNum);       //converts that number into an int data type
        order.push(number - 1);
    }

    return order;
}


/*
This function exists to Switch nodes by index number

@param num1: The num that will cause its corresponding node to switch with num2's corresponding node.
@param num2: The num that will cause its corresponding node to switch with num1's corresponding node.
*/

function numSwap(num1, num2){
    switchNodes(nodes[num1], nodes[num2]);
}

/*
This function allows the use of the numSwap array with a setInterval delay

*/

function delayedNumSwap(num1, num2){
    numSwap(num1, num2);
    clearInterval(wait);        //all set intervals that use this function are called wait.
}

/*
This function switches two values in an array

@param array: The array who's values with be swapped
@param num1 + num2: The values who will be switched with each other
*/

function swapArray(array, num1, num2){
    let temp = array[num1];
    array[num1] = array[num2];
    array[num2] = temp;
}

/*
This function adds text into the explnations.

@param step: the text that will be added.
*/
const steps = document.getElementById("Steps");
const initialStep = steps.innerHTML;        //stores the initial HTML of steps

function addStep(step){
    let oldSteps = steps.innerHTML;            //explnation before adding anything
    let append =  "<p>" + step + "</p>";            //what will be added in proper html format
    steps.innerHTML = oldSteps + append;       //adds the text onto the old file.
}


function resetSteps(){
    steps.innerHTML = initialStep;
}

//Changes the explanation text to match the sorting type
const explaination = document.getElementById("writeup");        //The Text at the bottom of the page explaing the sorting method

const SelectionExplanation = "<p>Selection sort works by iterating through each element, and swaping the smallest element with the first element that isn't yet sorted.</p>"
const QuickExplanation = "<p>Quick sort works by choosing the middle element, and then dividing each element into 2 groups: one larger than the chosen element, and one smaller. Repeat for each subgroup until each subgroup is only one elment large, and we have a sorted list</p>"
const BubbleExplanation = "<p>Bubble sort works by setting the first element as the main element and comparing it to the next. If the element is larger than the next, switch. Otherwise, set the next element as the main elment. Repeat until the main elment is at the end of the list (the largest is now the larges). Repeat for each element</p>";
const InsertionExplation = "<p>Insertion sort works by taking an already sorted array at the start (An array of One is sorted), and swapping the next element with the next largest sorted element until the next element is in the proper order. Repeat for each element</p>"
const MergeExplanation = "<p>Merge sort works by breaking each half of the list into a sorted array. We then add the smallest element from each subarray into a new array, repeating until both subarrays are exhausted. We then copy each element in order from the new array to the old array.</p>";
const HeapExplanation = "<p>Heap sort works by converting the list into a maximum heap. We then swap the first (largest) element with the last, remove the last element from the heap into the next spot of the sorted array, and then sink the new first element of the heap until we have a valid heap again. Repeat until the heap is empty.</p>";
const BogoExplanation = "<p>You're crazy</p>";

sortSelector.addEventListener('change', updateExplain);

function updateExplain(e){
    let sortType = sortSelector.value;      //checks to see what we have set the selector to
    
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