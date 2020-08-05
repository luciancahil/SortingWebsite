var sortSelector = document.getElementById("sortSelector");     //The dropdown menu where you can select what type of sort
var nodes = document.getElementsByClassName("Node");            //An array of Nodes to be sorted
const numNodes = nodes.length;
var wait;                                                       //the variable that will store all setInterval() objects
var delay = 100;                                                //stores how many milliseconds each animation is delayed by

//The following are meant to help the nextStep button
var started = false;        //for help with the "Next Step" button. Determines whether the function needs to setup the arrays or can proceed to the next step
var nextStepOrder;          //the array that wil be used to store the next current order
var done = false;           //Checks if the array is done or not

var stepNum = 1;        //Which step we are currently on
var orderArray;         //Array of the Nodes in their order by size


//order of node classes (generic, size, color)
//Changing the size class changes how high a node is.
//Changing the color class changes the color

//Function for the randomizer button
function randomize(){
    let intList = [];           //stores intergers from - to numNodes -1
    let classes = [];           //stores the classes in order for the first node to the last
    resetArena();
    
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
    

    //classes array now contains size classes in random order.

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
    if(!selected){              //no node is selected, so select the one just clicked
        resetArena();
        selectedNode = this;
        setClass(this, 2, "Selected");
        selected = true;
    }else{
        selected = false;
        if(this == selectedNode){               //reset it to default if this was the node just clicked
            setClass(this, 2, "Default");
        }else{
            switchNodes(this, selectedNode);
            setClass(selectedNode, 2, "Default");               //set the old node to default color
        }
        selctedNode = null;
    }
}


//The folowing Function will Direct the algorithim to which sort is being used


//sets up the sorting variables
function startSort(){
    sortSelector.disabled  = true;              //freezes the sortSelector
    orderArray = getOrder();                //sets selectionOrder to be the current order of the nodes
    started = true;
    stepNum = 1;           //reset the number of steps
}

//use of the sort button
function findSort(){
    if(!started){
        startSort();
    }


    let decision = sortSelector.value;
    switch(decision){
        case "Selection":
            selectionSort();
            break;
        case "Quick":
            selectionSort();
            break;
        case "Bubble":
            bubblesort();
            break;
        case "Insertion":
            insertionSort();
            break;
        case "Merge":
            selectionSort();
            break;
        case "Heap":
            selectionSort();
            break;
        case "Bogo":
            selectionSort();
            break;
    }

    
}


//for the "next step" button
function findStep(){
    if(!started){
        startSort();
    }

    let decision = sortSelector.value;
    if(!done){    
        switch(decision){
            case "Selection":
                runSelectionSteps();
                break;
            case "Quick":
                runSelectionSteps();
                break;
            case "Bubble":
                runBubbleStep();
                break;
            case "Insertion":
                runSelectionSteps();
                break;
            case "Merge":
                runSelectionSteps();
                break;
            case "Heap":
                runSelectionSteps();
                break;
            case "Bogo":
                runSelectionSteps();
                break;
        }
    }
}


//Selection Sort Function

var selectionCurrent = 0;    //how many nodes in the array are already sorted
var selectionSmallest;         //index of the smalles unsorted node so far
var selectionIndex;       //index of the Node being compared to the smallest Index
var sortedSwitchStep = 1;      //Switching 2 nodes takes 3 steps. This stores which one we are on.
var foundNewSorted = false;     //stores whether we are supposed to change the smallest index on this step
var selectionStarted = false;   //have we set up the variables needed for selection sort?


//function to get the arena set up for selection sorting
function startSelection(){      
    sortedSwitchStep = 1;         
    selectionStarted = true;
    selectionCurrent = 0;            //reset the number of sorted so that we can use it again without refreshing
    selectionIndex = 1;
    selectionSmallest = 0;
    addStep("Node 1 is the first unsorted Array. Set Node 1 to \"smallest\"");
    setClass(nodes[0], 2, "Combined");
    foundNewSorted = false;
}

function selectionSort(){           //this is run when the "sort" button is pressed for selection sort
    if(!selectionStarted){           //if the next step button has already been pressed, we don't need to run the startSelection function
        startSelection();
    }

    wait = setInterval(selectionStep, delay);     //calls each selection with a .5 second delay
}

function runSelectionSteps(){           //meant for use with the Next Step Button
    if(!selectionStarted){
        startSelection();
    }else{
        if(!done){
            selectionStep();
        }
    }
}

function selectionStep(){
    if(foundNewSorted){     //this step, all we are doing is changing the index of the sorted Node 
        selectionChangeSmallest();
        return;
    }
        
    //change the color of the previous if need be
    if(selectionIndex - 1 != selectionCurrent){            //if the one before is the first unsorted node, do nothing
        selectionIncrementColors();
    }
    

    if(selectionIndex < numNodes){    //checks every node after this index. If a smaller node is found, change smallest
        selectionCompareNodes();
        return;     //do not run the switch if just finished iterating to find the smallest
    }
    //smallest is now guarenteed to be the smallest unsorted node

    if(sortedSwitchStep == 1){     //switch the sizes and colors of the smallest and the first unsored node 
        selectionSwap();
    }else if(sortedSwitchStep == 2){                    //sets the current node to "sorted" color
        selectionSetSorted();
    }else if(sortedSwitchStep == 3){
        if(selectionCurrent >= (numNodes - 2)){           //the nodes are now sorted
            selectionFinish();
            return;
        }

        selectionChangeCurrent();
    }else if(sortedSwitchStep == 4){
        selectionSetNextSmallest();
    }
    
}


//The following are all methods called by the selection step method

//Changes the index to match the smallest function
function selectionChangeSmallest(){
    addStep("Index Node " + (selectionIndex + 1) + " is smaller than smallest node " + (selectionSmallest + 1) + ". Set Node " + (selectionIndex + 1) + " to \"smallest\"");
    setClass(nodes[selectionIndex], 2, "Selected");     //changing the current node to a blend of index and smallest (selected).
    
    if(selectionSmallest == selectionCurrent){      //the previous smallest node is the first unsorted node
        setClass(nodes[selectionSmallest], 2, "Current");
    }else{
        setClass(nodes[selectionSmallest], 2, "Default");
    }

    selectionSmallest = selectionIndex;
    foundNewSorted = false;
    selectionIndex++;
}


//moves each color up
function selectionIncrementColors(){
    if(selectionIndex - 1 == selectionSmallest){
        setClass(nodes[selectionIndex - 1], 2, "Special");      //if the previous class is the current smallest, set it to the smallest color
    }else{
        setClass(nodes[selectionIndex - 1], 2, "Default");      //otherwise, set to default color
    }
}

//Compare the index and smallest nodes
function selectionCompareNodes(){
    //adding the step to the step display
    addStep("Compare index Node " + (selectionIndex + 1) + " to smallest Node " + (selectionSmallest + 1) +".");
        
    setClass(nodes[selectionIndex], 2, "Index");        //set the index node to the index color

    //if index is smaller than smallest
    if(orderArray[selectionIndex] < orderArray[selectionSmallest]){   
        foundNewSorted = true;
        return;
    }
    selectionIndex++;

}

//switches the current node and the smallest node after iterating thorugh each node after the current
function selectionSwap(){
    swapArray(orderArray, selectionSmallest, selectionCurrent);
    numSwap(selectionSmallest, selectionCurrent);    //switch the sizes and colors of the smallest and the first unsored node
    sortedSwitchStep++;
    addStep("Switch current Node " + (selectionCurrent + 1) + " and smallest Node " + (selectionSmallest + 1) + ".");
}


//sets the current node to be a sorted color
function selectionSetSorted(){
    setClass(nodes[selectionSmallest], 2, "Default");
    setClass(nodes[selectionCurrent], 2, "Sorted");  //sets the current node to "sorted" color
    addStep("Current Node " + (selectionCurrent + 1) + " is now sorted.");
    sortedSwitchStep++;
}


//set the node after the current node as current
function selectionChangeCurrent(){
    selectionCurrent++;      //increments the number of sorted nodes
    selectionSmallest = selectionCurrent;                         //Set smallest to be the index of the smalles non sorted node
    
    setClass(nodes[selectionSmallest], 2, "Current");     //changes the color of the next to the "current" color
    addStep("Set Node " + (selectionSmallest + 1) + " as the current node");

    sortedSwitchStep++;
}


//set the new current node as smallest
function selectionSetNextSmallest(){
    addStep("Set Node " + (selectionSmallest + 1) + " as the smallest node");
    setClass(nodes[selectionSmallest], 2, "Combined");     //changes the color of the next to the "current" and "smallest" color
    selectionIndex = selectionCurrent + 1;
    sortedSwitchStep = 1;
}

function selectionFinish(){
    setClass(nodes[(numNodes - 1)], 2, "Sorted");       //sets final array to sorted color
    clearInterval(wait);                        //prevent the loop from continuing on sort button
    done = true;                                //causes next step button to do nothing
    sortSelector.disabled = false;              //allows for the selection of new sorting types
    addStep("Node " + (numNodes) + " is now sorted");
    addStep("All Nodes are now sorted");
}


/*
BubbleSort
The largest remaining Node "bubble" to the top, until each node is done



*/
var bubbleLimit = numNodes;         //stores the limit of how many nodes we need to check on each run
var bubbleIndex = 0;                //stores the index Node's index
var bubbleSwap = false;             //does the next step involve switching?
var bubbleStarted = false;          //Have the bubble sort variables been set to their needs?
var bubbleIsSorted = true;          //Start by assuming each iteration that the list is sorted. If a switch is made, set this to false
var bubbleSwapStep = 1;                   //Swaping takes several steps. This stores which one we are on.
var bubbleEndStep = 1;                  //Once a node reaches the end, several steps must be taken

function bubbleStart(){
    swapStep = 1
    bubbleLimit = numNodes;
    bubbleIndex = 0;
    bubbleStarted = true;
    bubbleIsSorted = true;
    addStep("Set node 1 as current and node 2 as \"next\"");
}


//this function fires when the "Next Step" button is pressed
function runBubbleStep(){
    if(!bubbleStarted){
        bubbleStart();
    }

    bubbleStep();
}

//to be run when the button "sort" is pressed
function bubblesort(){
    if(!bubbleStarted){
        bubbleStart();
    }
    
    wait =  setInterval(bubbleStep, delay);
}


function bubbleStep(){
    //Bubble sort is done
    if(bubbleLimit == 1){
        bubbleLateEnd();
        return;
    }

    //switch two Nodes
    if(bubbleSwap){
        if(bubbleSwapStep == 1){
            bubbleSwapNodes();
            return;
        }else if(bubbleSwapStep == 2){  // Set the new next node if we are not on the last node
            bubbleSetNext();
            return;
        }
    }
    
    if(bubbleIndex < bubbleLimit - 1){          //Compare Nodes to the next one
        bubbleCompareNodes();
    }else{      //The largest remaining node is at the end
        if(bubbleEndStep == 1){     //Set The colors of the end of the line
            bubbleSetSorted();
        }else if(bubbleEndStep == 2){       //set the colors at the start of the line
            bubbleNextRun();
        }
    }
}


//swaps two nodes
function bubbleSwapNodes(){
    addStep("Current Node " + (bubbleIndex + 1) + " is larger than next Node " + (bubbleIndex + 2) + ". Switch the two nodes.");
    swapArray(orderArray, bubbleIndex, bubbleIndex + 1);
    numSwap(bubbleIndex, bubbleIndex + 1);
    bubbleIndex++;
    bubbleIsSorted = false;     //If a single switch occurs, that means the list is not sorted
    bubbleSwapStep++;

    if(bubbleIndex >= bubbleLimit - 1){        // do not set the next node if we are on the last node
        bubbleSwap = false;
        bubbleSwapStep = 1;
    }
}


//changes color of the next node if it exists
function bubbleSetNext(){
    addStep("Set Node " + (bubbleIndex + 2) + " as \"next\".");
    setClass(nodes[bubbleIndex + 1], 2, "Index");       //sets the following index as the "next" color
    setClass(nodes[bubbleIndex - 1], 2, "Default");     //sets the previous node as previous
    bubbleSwapStep = 1;
    bubbleSwap = false;
}

//moves the index and current nodes up, then compares them
function bubbleCompareNodes(){
    addStep("Compare current Node " + (bubbleIndex + 1) + " next Node " + (bubbleIndex + 2) + ".");
    if(bubbleIndex > 0){
        setClass(nodes[bubbleIndex - 1], 2, "Default"); 
    }

    setClass(nodes[bubbleIndex], 2, "Current");             
    setClass(nodes[bubbleIndex + 1], 2, "Index");
    if(orderArray[bubbleIndex] > orderArray[bubbleIndex + 1]){
        bubbleSwap = true;
        return;
    }

    bubbleIndex++;
}


//changing the colors of the largest unsorted node once it's at the end
function bubbleSetSorted(){
    addStep("Node " + (bubbleIndex + 1) +  " is now sorted.");

    if(bubbleIsSorted){
        bubbleEarlyEnd();
        return;
    }

    setClass(nodes[bubbleIndex], 2, "Sorted");                      //set node to sorted color
    setClass(nodes[bubbleIndex - 1], 2, "Default");                      //set previous node to default
    bubbleEndStep++;
    bubbleLimit--;
}


//Sets the index and next nodes for the next run
function bubbleNextRun(){
    addStep("Set node 1 as current and node 2 as \"next\"");
    setClass(nodes[0], 2, "Current");             
    setClass(nodes[1], 2, "Index");
    bubbleIndex = 0;
    bubbleIsSorted = true;
    bubbleEndStep = 1;
}

//if we go through the list without swapping, the list is sorted. We can trigger the "early end" event in that case.
function bubbleEarlyEnd(){
    addStep("No Swaps were made. The List is now sorted.");
    for(q = 0; q < bubbleLimit; q++){
        setClass(nodes[q], 2, "Sorted");//set all remaining nodes as sorted
    }
    bubbleEnd();
}


//We have sorted every node from 2- numNodes, so the list now must be sorted
function bubbleLateEnd(){
    bubbleEnd();
    addStep("The list is now sorted.");
    setClass(nodes[0], 2, "Sorted");            //set the first node to be the sorted color
    return;
}

function bubbleEnd(){
    clearInterval(wait);
    sortSelector.disabled = false;
    done = true;
}



/*

InsertionSort
InsertionSort
InsertionSort
InsertionSort
InsertionSort
InsertionSort
InsertionSort
InsertionSort
InsertionSort
InsertionSort
*/



function insertionSort(){
    orderArray = getOrder();
    alert(orderArray);
    for(q = 0; q < numNodes; q++){
        let z = q;
        while(z > 0 && orderArray[z] < orderArray[z - 1]){
            swapArray(orderArray, z, z - 1);
            numSwap(z, z - 1);
            z--;
        }
    }
    alert(orderArray);
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
This Function switches the heights of two nodes

@param nodeOne, nodeTwo: Nodes to be switched
*/

function switchColors(node1, node2){
    let tempColor = node1.classList[2];
    setClass(node1, 2, node2.classList[2]);
    setClass(node2, 2, tempColor);
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
    switchColors(nodes[num1], nodes[num2]);
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
This function is meant to prepare the arena for sorting functions, and is called when a manual swap or randomization happens
*/
function resetArena(){
    resetSteps();               //resets the steps display to be blank
    resetStarted();             //sets all started booleans to be false
    done = false;               
    started = false;
    sortSelector.disabled = false;      //incase nextStep gets interrupred by hitting select
    resetColor();                       //changes all colors back to default
}


//sets all individual "started" booleans as false
function resetStarted(){
    selectionStarted = false;
    bubbleStarted = false;
}

function resetColor(){
    for(z = 0; z < numNodes; z++){
        setClass(nodes[z], 2, "Default");
    }
}

/*
This function adds text into the explnations.

@param step: the text that will be added.
*/
const steps = document.getElementById("Steps");
const initialStep = steps.innerHTML;        //stores the initial HTML of steps

function addStep(step){
    let oldSteps = steps.innerHTML;            //explnation before adding anything
    let append =  "<p>" + stepNum++ + ". " +step + "</p>";            //what will be added in proper html format
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
    resetArena();

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


//The following allows for the user to control the delay 

const delayInput = document.getElementById("delayInput");

delayInput.addEventListener('change', updateValue);

function updateValue(){
    delay = this.value;
}