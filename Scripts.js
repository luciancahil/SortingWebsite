var sortSelector = document.getElementById("sortSelector");     //The dropdown menu where you can select what type of sort
var nodes = document.getElementsByClassName("Node");            //An array of Nodes to be sorted
const numNodes = nodes.length;
var wait;                                                       //the variable that will store all setInterval() objects
var delay = 100;                                                //stores how many milliseconds each animation is delayed by
var randomizeButton = document.getElementById("radomize");


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
    
    for(let i = 0; i < numNodes; i++){        //we have now created a list of numbers from 0 to numNodes -1 inclusive
        intList.push(i);
    }

    for(let i = numNodes - 1; i >= 0; i--){
        let index = Math.floor(Math.random() * i); //chooses a random number between 0 and i
        let randomNumber = intList[index];                  //selects the number
        let size = nodes[randomNumber].classList[1];    //selects the size from the chosen element
        classes.push(size);     
        intList[index] = intList[i];                //moves the last elment into the spot of the element just chosen
        
    } 
    

    //classes array now contains size classes in random order.

    for(let j = numNodes - 1; j >= 0; j--){
        let node = nodes[j];
        let size = classes[j];
        setClass(node, 1, size);
    }
}

//Allows two Nodes to Be Swapped when clicked
var selected = false;       //stores whether or not a node is currently selected
var selectedNode;           //stores the node currently selected

for(let i = 0; i < numNodes; i++){
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

    if(selected){setClass(selectedNode, 2, "Default");}         //if a node is selected for manual switching, set it to default

    selected = false;      //remove the selected Section for the Node
    
}

//use of the sort button
function findSort(){
    if(!started){
        startSort();
    }

    if(done)
        return;

    randomizeButton.disabled = true;

    let decision = sortSelector.value;
    switch(decision){
        case "Selection":
            selectionSort();
            break;
        case "Quick":
            quicksort();
            break;
        case "Bubble":
            bubblesort();
            break;
        case "Insertion":
            insertionSort();
            break;
        case "Merge":
            mergeSort();
            break;
        case "Heap":
            heapSort();
            break;
        case "Bogo":
            bogoSort();
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
                runQuickSteps();
                break;
            case "Bubble":
                runBubbleStep();
                break;
            case "Insertion":
                runInsertionStep();
                break;
            case "Merge":
                runMergeStep();
                break;
            case "Heap":
                runHeapStep();
                break;
            case "Bogo":
                runBogoStep();
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
    addStep("Node 1 is the first unsorted Array. Set Node 1 to \"smallest\".");
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


/*
Selection sort works by iterating through each element, and swaping the smallest element with the first element that isn't yet sorted.

Classifications:
Current: "Current"      The first unsorted Node
Smallest" "Special"     The smallest unsorted node found so far
Index: "Index"          The Node we are comparing with the Node set to smallest
Sorted: "Sorted"        Nodes at the begining of the list we know are sorted

First, we set the first node as both current and smallest. We then iterate through each node in the list. If we find a smaller Node, 
than the "smallest" node, we set that to "smallest".

At the end, switch the current Node and the smallet Node

Repeat for each Node

*/

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
    randomizeButton.disabled = false;       //enables the randomize button
    done = true;                                //causes next step button to do nothing
    sortSelector.disabled = false;              //allows for the selection of new sorting types
    addStep("Node " + (numNodes) + " is now sorted");
    addStep("All Nodes are now sorted");
}


/*
BubbleSort
The largest remaining Node "bubble" to the top, until each node is done

Classifications and their classes:
Current = "Current".            The Current NOde
Next = "Special"                The Node we are comparing current to, and the node immidealty after current
Sorted = "Sorted"               Sorted Nodes at the end of the lsit

We will Start by setting Node "1" as Current and Node 2. as Next.

We will increment both current and next until we hit the end of the unsorted Nodes, switching the nodes if Current is larger than Next.

Reset Node 1 as Current and Node 2 as Next

Once Each Node has been moved to the end, or we go through a run without swapping any noes, the list is sorted.
*/


var bubbleLimit = numNodes;         //stores the limit of how many nodes we need to check on each run (how many unsorted Nodes)
var bubbleIndex = 0;                //stores the index Node's index
var bubbleSwap = false;             //does the next step involve switching?
var bubbleStarted = false;          //Have the bubble sort variables been set to their needs?
var bubbleIsSorted = true;          //Start by assuming each iteration that the list is sorted. If a switch is made, set this to false
var bubbleEndStep = 1;                  //Once a node reaches the end, several steps must be taken


function bubbleStart(){
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
        bubbleSwapNodes();
        return;
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
    bubbleSwap = false;
    numSwap(bubbleIndex, bubbleIndex + 1);
    bubbleIndex++;
    bubbleIsSorted = false;     //If a single switch occurs, that means the list is not sorted
    bubbleSwapStep++;
    if(bubbleIndex >= bubbleLimit - 1){        // do not set the next node if we are on the last node
        bubbleSwap = false;
        bubbleSwapStep = 1;
    }
}

//moves the index and current nodes up, then compares them
function bubbleCompareNodes(){
    addStep("Compare current Node " + (bubbleIndex + 1) + " next Node " + (bubbleIndex + 2) + ".");
    if(bubbleIndex > 0){
        setClass(nodes[bubbleIndex - 1], 2, "Default"); 
    }
    setClass(nodes[bubbleIndex], 2, "Current");             
    setClass(nodes[bubbleIndex + 1], 2, "Special");
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
    setClass(nodes[1], 2, "Special");
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
    randomizeButton.disabled = false;
    return;
}
function bubbleEnd(){
    randomizeButton.disabled = false;
    clearInterval(wait);
    sortSelector.disabled = false;
    done = true;
}



/*
Insertion sort works by taking an already sorted array at the start (An array of One is sorted),
and swapping the next element with the next largest sorted element until the next element is in the proper order. 
Repeat for each element.

Classifications: Class

Semi-Sorted: "Sorted". Nodes at the begining of the list are sorted compared to each other. 
Current: "Current" The Node currently we are trying to insert into the semi-sorted list

We start by setting the first node as semi-sorted, as a list with just one node is sorted.

Then we set the second node as Current, and the first node as prev. We try to insert it into the semi-sorted list, then we repeat until
We've done it for every lsit

Each time we iterate through the lists and take the first unsorted Node, swapping it with the previous 
semi-sorted Node until we hit the begining of the list or a node smaller than it. The current Node is now semi-sorted.

Repeat for each Node.
*/


var insertionBeyond = 0;          //Index of the first untouched Node
var insertionRunner;                //Index of the node as it's being inserted to the right place
var insertionSwap = false;          //Whether we are swapping this step or not
var insertionStarted = false;       //Have we started insertion sort yet?
var insertionSwapStep = 1;


function insertionStart(){
    insertionStarted = true;
    insertionSwap = false;
    insertionBeyond = 1;
    addStep("Node 1 is now semi-sorted.");
    setClass(nodes[0], 2, "Sorted");    // Set Node 1 to sorted
}


//runs when the sort button is pressed
function insertionSort(){
    if(!insertionStarted){
        insertionStart();
    }

    orderArray = getOrder();
    wait = setInterval(insertionStep, delay);
}


//runs when the next step button is pressed
function runInsertionStep(){
    if(!insertionStarted){
        insertionStart();
    }else{
        insertionStep();
    }
}

function insertionStep(){
    if(insertionSwap){
        //we have hit the end or a smaller node
        if((insertionRunner <= 0 || orderArray[insertionRunner] >= orderArray[insertionRunner - 1]) && (insertionSwapStep == 1)){  //run the final step to set the new one
            insertionSetSorted();
            return;
        }

        if(insertionSwapStep == 1){
            insertionSwapNodes();
        }else if(insertionSwapStep == 2){
            insertionNewPrev();
        }
        return;
    }


    insertionNewRunner();
}

function insertionSetSorted(){
    insertionSwap = false;  
    insertionSwapStep = 1;
    insertionBeyond++;
    setClass(nodes[insertionRunner], 2, "Sorted");       //set this node as the sorted color now (refered to as semisorted);
    if(insertionRunner < insertionBeyond - 1){
        setClass(nodes[insertionRunner + 1], 2, "Sorted");   //set the old previous node as sorted
    }
    
    if(insertionRunner > 0){                                 //set the previous node as sorted
        setClass(nodes[insertionRunner - 1], 2, "Sorted");
    }

    addStep("Current Node " + (insertionRunner + 1) + " is now semi-sorted.");
    
    //have we have sorted the entire array
    if(insertionBeyond == numNodes){
        addStep("The array is now sorted.");
        done = true;
        clearInterval(wait);
        sortSelector.disabled = false;
        randomizeButton.disabled = false;
        return;
    }
}

function insertionSwapNodes(){
    addStep("Current Node " + (insertionRunner + 1) + " is less than previous node " + insertionRunner +  ". Swap the two nodes.");
    swapArray(orderArray, insertionRunner, insertionRunner - 1);
    numSwap(insertionRunner, insertionRunner - 1);            //swap the array with the previous
    insertionSwapStep++;
    insertionRunner--;

    if(insertionRunner == 0){
        insertionSwapStep = 1;
    }
}


function insertionNewPrev(){
    setClass(nodes[insertionRunner + 1], 2, "Sorted");           //set the old prev as sorted
    setClass(nodes[insertionRunner], 2, "Current");              //set the new current the correct color
    setClass(nodes[insertionRunner-1], 2, "Special");            //set the new previous as previous color
    insertionSwapStep = 1;
    addStep("Set Node " + insertionRunner + " as \"prev\".");
}

function insertionNewRunner(){
    insertionRunner = insertionBeyond;       //the next node to enter the sorted array is the first unsorted node
    insertionSwap = true;                   //next step is to start swapping
    setClass(nodes[insertionBeyond], 2, "Current");             //give the current node the current color

    
    setClass(nodes[insertionBeyond - 1], 2, "Special");
    

    addStep("Set Node " + (insertionRunner + 1) + " as \"current\" and Node " + (insertionRunner + 2) + " as \"prev\".");
}

//BogoSort
//BogoSort
//BogoSort
//BogoSort
//BogoSort
//BogoSort
//BogoSort
//BogoSort

var bogoIsSorted;       //Boolean if this is sorted or not. Always Assumed to be true
var bogoIndex;          //which node are we comparing to the next?
var bogoStarted = false;

function startBogo(){
    bogoIsSorted = true;            //start by assuming the array is sorted
    bogoIndex = 0;                  //begin the array at one   
    orderArray = getOrder();        //get the array to match the nodes
    addStep("Set Node 1 as \"current\" and Node 2 as \"next\"");
    bogoStarted = true;
}

function runBogoStep(){
    if(!bogoStarted){
        startBogo();
    }

    bogoSteps();
}

function bogoSort(){
    if(!bogoStarted){
        startBogo();
    }

    wait = setInterval(bogoSteps, delay);
}

function bogoSteps(){
    //Compare Nodes
    if(bogoIsSorted && bogoIndex < numNodes - 1){
        bogoCompare();
        return;
    }

    //we finished the iteration and found no problems. The list is sorted
    if(bogoIsSorted){
        bogoFinish();
        return;
    }
    
    //We found irregularities
    addStep("The List is not sorted. Shuffle the list");
    bogoRandomize();
    bogoIsSorted = true;
    bogoIndex = 0;
    orderArray = getOrder();  
}

function bogoCompare(){
    setClass(nodes[bogoIndex], 2, "Current");           //set the current node to current color
    setClass(nodes[bogoIndex + 1], 2, "Special");       //set the next node as the next color

    if(bogoIndex > 0){
        setClass(nodes[bogoIndex - 1], 2, "Sorted");   //set the previous node to the default color
    }

    addStep("Compare current Node " + (bogoIndex + 1) + " to next Node " + (bogoIndex + 2) + ".");
    if(orderArray[bogoIndex] > orderArray[bogoIndex + 1]){
        //The array is not in order
        bogoIsSorted = false;
    }
    bogoIndex++;
}

function bogoFinish(){
    setClass(nodes[numNodes - 1], 2, "Sorted");     //Set the last two nodes to be the sorted color
    setClass(nodes[numNodes - 2], 2, "Sorted");     //
    addStep("Nothing is out of order. The list is now sorted");
    done = true;
    clearInterval(wait);
    sortSelector.disabled = false;
    randomizeButton.disabled = false;
}


function bogoRandomize(){
    let intList = [];           //stores intergers from - to numNodes -1
    let classes = [];           //stores the classes in order for the first node to the last
    
    for(let q = 0; q <= bogoIndex + 1; q++){
        setClass(nodes[q], 2, "Default");       //Set all nodes to the default color
    }
    
    for(let i = 0; i < numNodes; i++){        //we have now created a list of numbers from 0 to numNodes -1 inclusive
        intList.push(i);
    }

    for(let i = numNodes - 1; i >= 0; i--){
        let index = Math.floor(Math.random() * i); //chooses a random number between 0 and i
        let randomNumber = intList[index];                  //selects the number
        let size = nodes[randomNumber].classList[1];    //selects the size from the chosen element
        classes.push(size);     
        intList[index] = intList[i];                //moves the last elment into the spot of the element just chosen
        
    } 
    

    //classes array now contains size classes in random order.

    for(let j = numNodes - 1; j >= 0; j--){
        let node = nodes[j];
        let size = classes[j];
        setClass(node, 1, size);
    }
}



/*
Quick sort works by setting the end element as a "pivot" and all Nodes as "Relevant" and then seperating the list into two sublists,
one larger than the pivot, and one smaller. 

Then switch the pivot with the first larger array, then that Node is now sorted.

We then do a mini sort with each sublist, setting the last element of each sublist as "pivot" and each other element as "relevant", 
then seperating them like before, creating up to 2 more sublists.

Repeat for each subgroup until each subgroup is only one or zero element large, and we have a sorted list.



Pivot = "Current"           Nodes are divided based on whether they are larger or smaller than this Node
Relevant ="Relevant"        Nodes we are comparing with node in this particular minisubsort.
Index = "Index"             The node we are currently comparing to the pivot
Smaller = "Combined"        Nodes smaller than the pivot
Larger = "Special"          Nodes larger than the pivot
*/


var quickSmallerIndex;         //The index the smaller Node will be placed in
var quickLargerIndex;          //the number of Nodes larger than the pivot
var quickStart;              //Stores the begining of this particular quick sort (quicksort is recursive)
var quickEnd;                //One above the end of the particular quicksort
var quickStarted = false;    //Has quicksort started?
var quickPivot;                 //stores the pivot height
var quickDonePartition;      //If false, continue partitioning. If true, set a new mini quicksort
var partitionStep;          //partitioning takes 2 steps each
var quickLeftIndex;         //stores the start of the mini-quicksort
var quickRightIndex;       //stores the end of the mini-quicksort
var quickEndsArray = [];            //Since I can't use recursion, I'll have a stack that stores each end of each sub-quicksort


function quickSetup(){
    quickStart = 0;
    partitionStep = 1;
    quickEnd = numNodes;
    let endStart = [0, numNodes];
    quickEndsArray.push(endStart);
    orderArray = getOrder();
    quickDonePartition = true;
    quickStarted = true;
}

function runQuickSteps(){
    if(!quickStarted){
        quickSetup();
    }

    quickStep();
}

function quicksort(){
    quickSetup();
    
    wait = setInterval(quickStep, delay);
}

function quickStep(){
    //We must Set Nodes to relevant and get the pivot
    if(quickDonePartition){
        setMiniQuicksort();
        return;
    }


    //move a node either in the larger or smaller pile
    if(quickSmallerIndex < quickLargerIndex){
        quickPartition();
        return;
    }

    movePivot();

    //The stack is empty. No more semisorts are needed
    if(quickEndsArray.length == 0){
        quickSortEnd();
    }
}


//Sets up the function for a recurivsie quicksort
function setMiniQuicksort(){
    let endStart = quickEndsArray.pop();        //get the new start and end from the stack
    quickLeftIndex = endStart[0];
    quickSmallerIndex = endStart[0];        //set the start of the semisort

    quickRightIndex = endStart[1];
    quickLargerIndex = endStart[1] - 1;         //set the end of the semisort
    quickPivot = orderArray[quickLargerIndex];      //Set the pivot as the last index


    //there is only one element in this subarray. Just set it to sorted
    if(quickSmallerIndex == quickLargerIndex){
        addStep("Node " + (quickLargerIndex + 1) + " is now sorted");
        setClass(nodes[quickLargerIndex], 2, "Sorted");

        //The stack is empty. No more semisorts are needed. Check if the list is sorted
        if(quickEndsArray.length == 0){
            quickSortEnd();
    }

        return; 
    }
    
    addStep("Set Node " + (quickLargerIndex + 1) + " as \"pivot\" and Nodes " + (quickSmallerIndex + 1) + " to " + (quickLargerIndex)  + " as \"relevant\".");
    setClass(nodes[quickLargerIndex], 2, "Current");        //Set the last node of the sublist as the pivot

    for(let q = quickSmallerIndex; q < quickLargerIndex; q++){      //set every other Node of the sublist as relevant
        setClass(nodes[q], 2, "Relevant");
    }


    quickDonePartition = false;
}


function movePivot(){
    numSwap(quickRightIndex - 1, quickLargerIndex);                         //swap the pivot (last item in the sublist) with the first larger element
    swapArray(orderArray, quickRightIndex - 1, quickLargerIndex);
    addStep("The Partitioning is done. Swap pivot node " + quickRightIndex + " with first larger node " + (quickLargerIndex + 1) + ". The new Node " + (quickLargerIndex + 1) + " is now sorted.");
    setClass(nodes[quickLargerIndex], 2, "Sorted");     //Set the pivot as sorted in it's new position

    //add the coordinates for a new semisort on the right, from the one after the pivot to the end if any nodes ended up on the right
    if(quickSmallerIndex + 1 != quickRightIndex){
        let rightEndStart = [quickSmallerIndex + 1, quickRightIndex];      
        quickEndsArray.push(rightEndStart);
    }

    //add the coordinates for a new semisort of the left nodes, from this sort's begining to the pivot if any nodes ended up on the left
    if(quickSmallerIndex != quickLeftIndex){
        let leftEndStart = [quickLeftIndex, quickSmallerIndex];     
        quickEndsArray.push(leftEndStart);
    }
    quickDonePartition = true;
}

function quickSteps(qStart, qEnd){
    quickSetPivot(qStart, qEnd);                //do the first pivot, so that left = smaller and right = larger
    

    let pivotLocation = quickSmallerIndex;      //store pivot location in case changes are made

    if(pivotLocation > qStart + 1){             //sort everything on the left
        quickSteps(0, pivotLocation);    
    }

    if(pivotLocation < qEnd -2){                //sort everything on the right
        quickSteps(pivotLocation, qEnd);
    }

    quickSortEnd();
}

function quickPartition(){
    //Set the new index
    if(partitionStep == 1){
        partitionStep++;
        setClass(nodes[quickLargerIndex - 1], 2, "Index");
        addStep("Compare Index Node " + quickLargerIndex + " to pivot node " + (quickRightIndex) + ".");
        return;
    }

    //put the index in the correct pile
    if(orderArray[quickLargerIndex - 1] < quickPivot){      //The Node is smaller than the pivot
        numSwap(quickLargerIndex - 1, quickSmallerIndex);               //swap the smaller array with the first unpartitioned node
        addStep("Index Node " + quickLargerIndex + " is smaller than pivot node " + (numNodes)+ ". Put the index node at the start and set it to \"smaller\".");
        setClass(nodes[quickSmallerIndex], 2, "Combined");          //set Smaller Node to the smaller color
        swapArray(orderArray, quickSmallerIndex, quickLargerIndex - 1);   //Sets the node the the begining of the list
        quickSmallerIndex++;
    }else{ //This node is larger than or equal to the pivot
        addStep("Index Node " + quickLargerIndex + " is larger than pivot node " + (numNodes)+ ". Set the index node to \"larger\".");
        setClass(nodes[quickLargerIndex - 1], 2, "Special");        //set larger node to the larger color
        quickLargerIndex--;
    }
    partitionStep = 1
}

function quickSortEnd(){
    addStep("The list is now sorted");
    randomizeButton.disabled = false;
    done = true;
    clearInterval(wait);
    sortSelector.disabled = false;
    randomizeButton.disabled = false;
}



/*
Heapsort first makes the array into a max-heap.

Then, it switches the head with the first unsorted node. The head is now sorted.

Then, sink the new head to it's proper location

Heap = "Relevant"
Current = "Current"
Parent = "Special"
Larger Branch = "Parent";
*/
var heapStarted = false;
var makeHeapStep;               //making a heap has two distinct steps, adding a Node to the heap and swiming it up
var numHeapNodes;               //the number of nodes in the heap properly
var heapSize;                  //The Node we are about/just added to the heap
var currentHeapPosition;        //The position of the current Node
var heapSwimStep;                   //Swimming takes two steps. Setting the parent and swapping if needed
var heapParentIndex;            //Index of the parent of the current Node
var heapOldPosition;                //The immediate previos position of the current Node. Helps for coloring
var doneMakingHeap;             //are we done organizing the nodes into a heap?
var sortHeapStep;               //Sorting a heap has 2 distinct steps, swapping the head node, and sinking the new head
var heapLargerBranch;            //stores the index of the larger child
var heapSinkStep;               //sinking has 2 distinct steps. Setting the larger branch, and switching


function startHeap(){
    makeHeapStep = 1;
    numHeapNodes = 1;
    orderArray = getOrder();
    console.log(orderArray);
    heapSize = 0;    
    heapStarted = true;
    heapSwimStep = 1;
    heapOldPosition = -1;
    doneMakingHeap = false;
    sortHeapStep = 1;
    heapSinkStep = 1
}

function runHeapStep(){
    if(!heapStarted){
        startHeap();
    }

    heapStep();
}

function heapSort(){
    if(!heapStarted){
        startHeap();
    }

    wait = setInterval(heapStep, delay);
}

function heapStep(){
    if(!doneMakingHeap){
        makeHeap();
        return;
    }

    if(heapSize > 0){
        sortHeap();
        return;
    }

    //heapEnd();
}

function sortHeap(){
    if(sortHeapStep == 1){
        //Swap the head with the last node in the heap. The head is now sorted
        swapHeapHead();

    //sink Node 0 into it's proper place
    }else if(sortHeapStep == 2){    
        if(heapSize == 2){
            heapEnd();
            return;
        }
        
        //Find the larger child branch
        if(heapSinkStep == 1){          
            heapSetLargerBranch();

        //compare current to the larger child branch. Swap if need be
        }else if(heapSinkStep == 2){        
            if(orderArray[currentHeapPosition] < orderArray[heapLargerBranch]){      //we must swap in this case.
                heapSwapWithChild();
            }else{      //we don't have to swap
                heapIsLargerThanChild();
            }

            heapSinkStep = 1;
        }
    }

    
}

function swapHeapHead(){
    addStep("Swap Node 1 and the last heap Node " + heapSize + " and set the new Node 1 to \"current\". Node " + heapSize + " is now sorted.");
    numSwap(0, heapSize - 1);      //swap the head with the last unsorted Node
    swapArray(orderArray, 0, heapSize - 1);
    setClass(nodes[heapSize -1], 2, "Sorted");
    setClass(nodes[0], 2, "Current");
    currentHeapPosition = 0;
    sortHeapStep = 2;
}

function heapSetLargerBranch(){
    if(heapOldPosition >= 0){
        setClass(nodes[heapOldPosition], 2, "Relevant");//Sets the old place to the heap color
    }

    let childOne = currentHeapPosition * 2 + 1;
    let childTwo = currentHeapPosition * 2 + 2;

    //no branches
    if(childOne >= heapSize - 1){
        addStep("Current Node " + (currentHeapPosition + 1) + " has no branches. It is now in the heap proper");
        setClass(nodes[currentHeapPosition], 2, "Relevant");
        sinkNodeDone();
        heapOldPosition = -1;
        return;
    }


    //Only one branch
    if(childTwo >= heapSize - 1){
        addStep("Compare Current Node " + (currentHeapPosition + 1) + " to its branch Node " + (childOne + 1) + ".")
        setClass(nodes[childOne], 2, "Special");
        heapLargerBranch = childOne;
        heapOldPosition = -1;
        heapSinkStep = 2;
        return;
    }

    if(orderArray[childOne] > orderArray[childTwo]){    // The left child is larger. Set it to the right
        heapLargerBranch = childOne;
    }else{                                      //the right child is larger or even. Set it to the right (right if even because right height is either greater than or equal to left height)
        heapLargerBranch = childTwo;
    }

    addStep("Compare Current Node " + (currentHeapPosition + 1) + " to its larger branch Node " + (heapLargerBranch + 1) + ".")
    setClass(nodes[heapLargerBranch], 2, "Special");
    heapSinkStep = 2;
}

function heapSwapWithChild(){
    addStep("Current Node " + (currentHeapPosition + 1) + " is smaller than it's larger branch node " + (heapLargerBranch + 1) + ". Swap the two nodes.");
    numSwap(currentHeapPosition, heapLargerBranch);
    swapArray(orderArray, currentHeapPosition, heapLargerBranch);
    heapOldPosition = currentHeapPosition;
    currentHeapPosition = heapLargerBranch;
}

function heapIsLargerThanChild(){
    addStep("Current Node " + (currentHeapPosition + 1) +  " is greater than or equal to it's larger branch node " + (heapLargerBranch + 1) + ". Current Node is now in the heap proper.")
    setClass(nodes[currentHeapPosition], 2, "Relevant");
    setClass(nodes[heapLargerBranch], 2, "Relevant");
    sinkNodeDone();
}

//The node has sunk to it's correct position
function sinkNodeDone(){
    heapSize--;
    sortHeapStep = 1;
}

//converts the array into a maximum heap
function makeHeap(){

    //add a node to a heap and set it to current
    if(makeHeapStep == 1){
        heapAddNode();
        return;
    }else if(makeHeapStep == 2){        //Swim the node up if needed

        //We are at the start of the heap. No more swimming possible
        if(currentHeapPosition == 0){
            setNodeOneHeap();
            heapSwimStep = 1;
            
            
            return;
        }

        if(heapSwimStep == 1){      //set the parent Node
            heapSetParent();
        }else if(heapSwimStep == 2){        //compare to the parent Node
            if(orderArray[currentHeapPosition] > orderArray[heapParentIndex]){      //we must swap
                heapSwapWithParent();
            }else{              //do not swap. Node is now in the heap proper
                setToHeap();
            }
            
            heapSwimStep = 1;
        }
    }

    //sorting is now done
    if(heapSize == numNodes){
        doneMakingHeap = true;
        heapOldPosition = -1;
        addStep("The heap is now complete.");
    }
}


//Adds the next node to heap and set it to current
function heapAddNode(){
    setClass(nodes[heapSize], 2, "Current");      //set the first Node to the heap
    currentHeapPosition = heapSize;
    addStep("Add Node " + (heapSize + 1) + " to the heap and set it to \"current\".");
    makeHeapStep = 2;
}

//set the first node to be properly heaped
function setNodeOneHeap(){
    addStep("Node 1 has no parent branches. Node 1 is now in the heap proper.");
    setClass(nodes[0], 2, "Relevant");       //set the Node to the heap color
    
    if(heapOldPosition > 0){
        setClass(nodes[heapOldPosition], 2, "Relevant");       //set the old Node to the heap color
    }

    heapOldPosition = -1;
    heapSize++;
    makeHeapStep = 1;

    //checck if sorting is now done
    if(heapSize == numNodes){
        doneMakingHeap = true;
        heapOldPosition = -1;
        addStep("The heap is now complete.");
    }
}


//Set the parent
function heapSetParent(){
    if(heapOldPosition > 0){
        setClass(nodes[heapOldPosition], 2, "Relevant");       //set the old Node to the heap color
    }

    heapParentIndex = Math.floor((currentHeapPosition - 1)/2);
    setClass(nodes[heapParentIndex], 2, "Special");
    addStep("Compare current node " + (currentHeapPosition + 1) + " to it's parent Node " + (heapParentIndex + 1) + ".");
    heapSwimStep = 2;
}

function heapSwapWithParent(){
    if(heapOldPosition > 0){
        setClass(nodes[heapOldPosition], 2, "Relevant"); // set the old node to heap color
    }

    numSwap(currentHeapPosition, heapParentIndex);          //swaps the current node with it's parent
    swapArray(orderArray, currentHeapPosition, heapParentIndex);
    addStep("Current Node " + (currentHeapPosition + 1) + " is larger than it's parent node " + (heapParentIndex + 1) + ". Swap the nodes.");
    heapOldPosition = currentHeapPosition;
    currentHeapPosition = heapParentIndex;
}


//The Node is now in the proper place. Set it to be a part of the heap proper
function setToHeap(){
    addStep("Current Node " + (currentHeapPosition + 1) + " is less than or equal to it's parent node " + (heapParentIndex + 1) + " the node is now in the heap proper.");
    setClass(nodes[heapParentIndex], 2, "Relevant");
    setClass(nodes[currentHeapPosition], 2, "Relevant");
    heapSize++;
    makeHeapStep = 1;
}

//Done creating a heap
function heapEnd(){
    addStep("Node 1 is now sorted");
    setClass(nodes[0], 2, "Sorted");
    addStep("The List is now sorted");
    clearInterval(wait);
    randomizeButton.disabled = false;
    sortSelector.disabled = false;
    heapOldPosition = -1;
}



/*

MergeSort
MergeSort
MergeSort
MergeSort
MergeSort
v
MergeSort
MergeSort
vMergeSort
MergeSort
MergeSort
MergeSort
MergeSort

Left = "Special"
Right = "Current"
Relevant = "Relevant"
Leftindex: "Index"
RightIndex: "Combined"
*/

var mergeDivisionStep;           // dividing takes two steps. Setting the stage, and dividing if needed
var mergeStarted = false;
var mergeStart;                 //Start of th elist. The first left node
var mergeEnd;                   //End of the sublist. One more than the last right NOde
var mergeMiddle;                //Middle of the list. One more than the last left Node
var mergeStartsEnds;            //a stack that contains all the ends and starts of teh submlists we must consider, in format (include, exclude). 
                                // The third element is whether this was a left or right subbaray, as we must merge after sorting a right array

var mergeJustSorted;            //Whether what we just sorted was left or right
var mergingStep;                //Merging takes 3 steps: preparation, setting indexes, and actually merging

var mergeLeftIndex;             //Indexes of we compare to each other to see what ends up on the invisible array
var mergeRightIndex;

var mergeInvisibleArray;        //Array that stores recently merged items

function mergeBegin(){
    mergeDivisionStep = 1;
    mergeStarted = true;
    mergeStartsEnds = [];
    mergeStartsEnds.push([0, numNodes, "left"])         //left because no further sorts are needed
    mergeJustSorted = "left";
    orderArray = getOrder();
    mergingStep = 1;
}


function runMergeStep(){
    if(!mergeStarted){
        mergeBegin();
    }

    mergeSteps();
}

function mergeSteps(){
    if(mergeDivisionStep == 1){
        //look at the next list
        if(mergeJustSorted == "left"){
            mergeSetRelevant();

        //prepare the next list for merging
        }else{
            if(mergingStep == 1){
                mergePrepareMerging();
            }else if(mergingStep == 2){
                mergeSetIndexes();
            }else if(mergingStep == 3){
                mergeSublists();
            }
        }
        
    }else if(mergeDivisionStep == 2){
        mergeDivide();
    }
}

function mergeSetRelevant(){
    let endStart = mergeStartsEnds[mergeStartsEnds.length - 1];
    mergeStart = endStart[0];
    mergeEnd = endStart[1];
    mergeDefaultAll();
    addStep("Consider nodes "  + (mergeStart + 1)  + " to " + (mergeEnd) + ". Set them all to \"relevant\"");

    for(let q = mergeStart; q < mergeEnd; q++){
        setClass(nodes[q], 2, "Relevant");      //set all nodes in the sublist to "relevant"
    }

    mergeDivisionStep++;
}

function mergePrepareMerging(){
    let endStart = mergeStartsEnds[mergeStartsEnds.length - 1];
    mergeStart = endStart[0];
    mergeEnd = endStart[1];
    mergeMiddle = Math.floor((mergeStart + mergeEnd) / 2);

    addStep("Left nodes " + (mergeStart + 1) + " to " + mergeMiddle + " and right nodes " + (mergeMiddle + 1 ) + " to " + mergeEnd + " are sorted. Prepare to merge left and right.");
    
    for(let q = mergeStart; q < mergeMiddle; q++){
        setClass(nodes[q], 2, "Special");       //set all left nodes to proper color. Don't worry about right, as those are already colored
    }

    mergingStep = 2;
}

function mergeSetIndexes(){
    addStep("Set Step " + (mergeStart + 1) + " as \"Left Index\" and " + (mergeMiddle + 1) + " as \"Right Index\".");
    setClass(nodes[mergeStart], 2, "Index");        // set the first left node as left index color
    setClass(nodes[mergeMiddle], 2, "Combined");        // set the first right node as left index color
    mergingStep = 3;
    mergeLeftIndex = mergeStart;
    mergeRightIndex = mergeMiddle;
}

function mergeSublists(){

    //Both sublists have been fully entered
    if(mergeLeftIndex == mergeMiddle && mergeRightIndex == mergeEnd){
        addStep("Both the left and right nodes have all been added onto the invisible array");
        mergingStep = 4;
        return;
    }

    //left sublist is exhausted, but not the right
    if(mergeLeftIndex == mergeMiddle){
        setClass(nodes[mergeRightIndex++], 2, "Current");
        addStep("The Left nodes have all been added to the invisible subarray. Add Right Index Node " +  mergeRightIndex + " to the invisible array.")
        if(mergeRightIndex != mergeEnd){                //set a new right index if neede
            setClass(nodes[mergeRightIndex], 2, "Combined");
        }

        return;
    }

    //right sublist is exhausted, but not the left
    if(mergeRightIndex == mergeEnd){
        setClass(nodes[mergeLeftIndex++], 2, "Special");
        addStep("The Right nodes have all been added to the invisible subarray. Add Left Index Node " +  mergeLeftIndex + " to the invisible array.")
        if(mergeLeftIndex != mergeMiddle){              //set a new left index if needed
            setClass(nodes[mergeLeftIndex], 2, "Index");
        }

        return;
    }

    //neither sublist is empty

    if(orderArray[mergeLeftIndex] > orderArray[mergeRightIndex]){
        setClass(nodes[mergeRightIndex++], 2, "Current");
        addStep("The Left index node is greater than the right index node. Add Right Index Node " +  mergeRightIndex + " to the invisible array.")
        if(mergeRightIndex != mergeEnd){                //set a new right index if neede
            setClass(nodes[mergeRightIndex], 2, "Combined");
        }
    }else{
        setClass(nodes[mergeLeftIndex++], 2, "Current");
        addStep("The Right Index node is greater than or equal to the Left Index Node. Add Left Index Node " +  mergeLeftIndex + " to the invisible array.")
        if(mergeLeftIndex != mergeMiddle){              //set a new left index if needed
            setClass(nodes[mergeLeftIndex], 2, "Index");
        }

        return;
    }

}

function mergeDivide(){
    //There is only one node here
    if(mergeStart == mergeEnd -1){
        mergeJustSorted = mergeStartsEnds.pop()[2];

        addStep("The relvant nodes are sorted. Set node " + (mergeStart + 1) + " as \"" + mergeJustSorted + "\".");

        if(mergeJustSorted == "left"){
            setClass(nodes[mergeStart], 2, "Special");
        }else if(mergeJustSorted == "right"){
            setClass(nodes[mergeStart], 2, "Current");
        }

        

    }else{
        mergeMiddle = Math.floor((mergeStart + mergeEnd)/2);

        addStep("The relevant nodes have not been merge sorted. Set nodes " + (mergeStart + 1) + " to " + mergeMiddle + " as \"left\", and nodes " + (mergeMiddle + 1) + " to " + mergeEnd + " as \"right\".");

        for(let q = mergeStart; q < mergeMiddle; q++){
            setClass(nodes[q], 2, "Special");
        }

        for(let q = mergeMiddle; q < mergeEnd; q++){
            setClass(nodes[q], 2, "Current");
        }

        mergeStartsEnds.push([mergeMiddle, mergeEnd, "right"]);
        mergeStartsEnds.push([mergeStart, mergeMiddle, "left"]);
        
    }

    mergeDivisionStep = 1;
}


//Sets all nodes to the default color
function mergeDefaultAll(){
    for(let q = 0; q < numNodes; q++){
        setClass(nodes[q], 2, "Default");
    }
}


//Helper Methods
//Helper Methods
//Helper Methods
//Helper Methods
//Helper Methods

//Helper Methods
//Helper Methods

//Helper Methods
//Helper Methods
//Helper Methods
//Helper Methods
//Helper Methods
//Helper Methods


/*
This function switches the class of a node to a new slected one. If index is one, it will change the size of the node. 
If the index is two, it will change the color

@param node: the node whoes class I want to change
@param index: the index of the class I want to change
@param  newClass: The new class I want in the given index
*/
function setClass(node, index, newClass){
    let newClasses = [];
    let classList = node.classList;
    for(let i = 2; i >= 0; i--){
        newClasses.unshift(node.classList[i]);
        classList.remove(classList[i]);
    }

    newClasses[index] = newClass;

    for(let i = 0; i < 3; i++){
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

    for(let i = 0; i < numNodes; i++){
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
    insertionStarted = false;
    bogoStarted = false;
    quickStarted = false;
    heapStarted = false;
    mergeStarted = false;
}

function resetColor(){
    for(let z = 0; z < numNodes; z++){
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
    steps.scrollTop = steps.scrollHeight;
}


function resetSteps(){
    steps.innerHTML = initialStep;
}

//Changes the explanation text to match the sorting type
const explaination = document.getElementById("writeup");        //The Text at the bottom of the page explaing the sorting method

const SelectionExplanation = "<p>Selection sort works by iterating through each element, and swaping the smallest element with the first element that isn't yet sorted.</p> <p>We start by Setting the first node as both the \"current\" and \"smallest\" Node. We then iterate through each node after it. Every time we find a node smaller than the \"smallest\" Node, we set that Node as the new \"Smallest\" Node. After iterating through each Element,we switch the \"current\" and \"smallest\" node. Repeat for each Node after the first.</p> <p><Strong>Color Key:</Strong></p> <p class = \"Special\">Smallest</p> <p class = \"Current\">Current</p> <p class = \"Index\">Index</p> <p class = \"Sorted\">Sorted</p>";
const QuickExplanation = "<p>Quick sort works by setting the end element as a \"pivot\" and all Nodes as \"Relevant\" and then seperating the list into two sublists, one larger than the pivot, and one smaller. Then switch the pivot with the first larger array, then that Node is now sorted.</p> <p> We then do a mini sort with each sublist, setting the last element of each sublist as \"pivot\" and each other element as \"relevant\", then seperating them like before, creating up to 2 more sublists. Repeat for each subgroup until each subgroup is only one or zero element large, and we have a sorted list. <p><strong>Color Key:</strong></p> <p class = \"Current\">Pivot</p> <p class = \"Relevant\">Relevant</p> <p class = \"Index\">Index</p> <p class = \"Combined\">Smaller</p> <p class = \"Special\">Larger</p> <p class = \"Sorted\">Sorted</p>"
const BubbleExplanation = "<p>Bubble sort works by setting the first element as the main element and comparing it to the next. If the element is larger than the next, switch. Otherwise, set the next element as the main elment. Repeat until the main elment is at the end of the list (the largest is now the larges). Repeat for each element</p>  <p>We start by setting the first node as \"Current\" and the second Node as \"Next\". If \"Next\" is smaller than \"Current\", we swap the two. Then set 2 as \"Current\" and 3 as \"Next\". Repeat Until \"Next\" has reached the end of the unsorted nodes. That Node is now sorted. Repeat the process until each node has been moved to it's proper place, or we iterate through the list without any swaps.<p/>  <p><strong>Color Key:</strong></p> <p class = \"Current\">Current</p> <p class = \"Special\">Next</p> <p class = \"Sorted\">Sorted</p>";
const InsertionExplation = "<p>Insertion sort works by taking an already sorted array at the start (An array of One is sorted), and swapping the next element with the next largest sorted element until the next element is in the proper order. Repeat for each element.</p> <p>We start by setting the first Node as \"semi-sorted\". We then set the second Node as \"Current\" and the first node as \"prev\". If \"current\" is smaller than \"prev\", then switch. Then, set the third node as \"current\" and the second node as prev, and so on. Each time, swap \"current\" and \"prev\" until we either reach the start of the list or a smaller node in the semi sorted lsit. Then, that node is also sem-sorted. </p> <p><Strong>Color Key:</Strong></p> <p class = \"Special\">Prev</p> <p class = \"Current\">Current</p> <p class = \"Sorted\">Semi-Sorted</p>"
const MergeExplanation = "<p>Merge sort works by breaking each half of the list into a sorted array. We then add the smallest element from each subarray into a new array, repeating until both subarrays are exhausted. We then copy each element in order from the new array to the old array.</p>";
const HeapExplanation = "<p> Heap sort works by converting the list into a maximum heap. </p> <p> A maximum heap is a type of tree data structure. Each \"Node\" has a value, and up to 2 branches. A maximum heap is a special type of tree, where the first node is the largest Node, and both of it's branches are also maximum heaps. In other words, each node is larger than the ones below it </p> <p> The heap in this case is represented by an array. Node 1 is the \"root\", and you can find the branches of each node with the equation 2n + 1 and 2n, where n is it's own node number. If a result is larger than 10, it doesn't have a branch on that side. conversly, a Node's parents, except for Node 1, can be found by dividing by 2 and rounding down. </p> <p> We start by declaring Node one to be a heap. We then add Node 2 to the heap and setting it to current. Since this is node 2, it is Node one's branch. At this point, the heap may not be a valid maximum heap anymore. Fix it by switching the newly added node with its parents until its parent is larger or it has become Node 1. Repeat for every node, and we now have a maximum heap. </p> <p> We then swap the first (largest) Node with the last element in the Node, and remove the last node from the heap. The new last node is now sorted. At this point, the heap may no longer be valid. So, we must swap Node 0, which we set as current, with it's largest branch until it's larger than both its branches or it has no branches. Repeat until the heap is empty, and we will have a sorted array </p> <p><strong>Color Key:</strong></p> <p class=\"Current\">Current</p> <p class=\"Relevant\">Heap</p> <p class=\"Special\">Parent or Branch</p> <p class=\"Sorted\">Sorted</p>";
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

//8, 3, 1, 4, 7, 0, 6, 9, 2, 5