// URLs for the api: http://jservice.io/api/
// url to get category with id N: http://jservice.io/api/category?id=N

/* Global object that will contain the game categories */
let categories = [];
/* ANALYSIS OF THE GAME'S DATA STRUCTURE:

The categories object is an indexed collection of JavaScript 
objects. Each array index looks equivalent
to a category object returned from a GET request we send
to the jService API. HOWEVER we have to add a .showing property 
to each clue in order to track its display status.

categories.length --> 6
categories[0].title --> title of first category
categories[0].clues --> array of objects, each object is a question
categories[0].clues[0].question --> the text of the first question in this category
categories[0].clues[0].answer --> the text of the answer "
categories[0].clues[0].showing --> property for tracking the display status of the current clue


                                 
*/
  //prepend a table to the body
  $('<table>').prependTo('body');
  $('table').attr("id", "jeopardy");

  //append a button to the body
  $('<button>').appendTo('body');
  $('button').attr("id", "Start/Restart");
  $('button').text("Start/Restart Game");

  

// number of categories on the game board
const NUM_CATEGORIES = 6;

// number of questions for each category
const NUM_QUESTIONS_PER_CAT = 5;

// Returns an array of 6 unique IDs
function getCategoryIds() {
    /* Because category ID's are integers between 1 and 18,000 
    I'm just grabbing a number N between those two and getting 
    the category with that ID the next 5 categories with N++ 
    */
    let startingID = Math.floor(Math.random() * 18000);
    let randomIDs = [startingID, startingID + 1, startingID + 2, startingID + 3, startingID + 4, startingID + 5];
    return randomIDs; // [12969, 12970, 12971, 12972, 12973, 12974]
}

/** Return object with data about a category:
 *
 *  Returns { title: "math", clues: clue-array }
 *
 * Where clue-array is:
 *   [
 *      {question: "Hamlet Author", answer: "Shakespeare", showing: null},
 *      {question: "Bell Jar Author", answer: "Plath", showing: null},
 *      ...
 *   ]
 */

async function getCategory(catId) {
    // SEND A REQUEST for the given id
    const response = await axios.get("http://jservice.io/api/category?id=" + catId);
    // destructure the json object into just the thing we need
    let rawCluesArray = response.data.clues.slice(0, 5);
    let cluesArray = [];
    // construct cluesArray of clue objects
    for (let index = 0; index < 5; index++) {
        cluesArray.push({
            question: rawCluesArray[index].question,
            answer: rawCluesArray[index].answer,
            showing: null            
        })        
    }
    // construct a new category to specification
    let newCategoryObject = {
        title: response.data.title,
        clues: cluesArray
    };
    return newCategoryObject;
}

/** Fill the HTML table#jeopardy with the categories & cells for questions.
 *
 * - The <thead> should be filled w/a <tr>, and a <td> for each category*/

/** - The <tbody> should be filled w/NUM_QUESTIONS_PER_CAT <tr>s,
*   each with a question for each category in a <td>
*   (initally, just show a "?" where the question/answer would go.)
*/

async function fillTable() {
    //create a thead inside the #jeopardy table
    $('<thead>').appendTo("#jeopardy");
    //create the first row for the categories; add a class for styling
    $("<tr>").appendTo("thead").addClass("titles");
    // fill the first row with the titles, notice the use of .text to evaluate the escape characters in some of the raw clue texts.
    for (let index = 0; index < 6; index++) {
        $("<th>").text(categories[index].title).appendTo(".titles");        
    }
    // Give the table a body
    $("<tbody>").appendTo("#jeopardy");
    // calculate a unique identifier for each td element, similar to what
    // we did for the connect four project
    for (let clue = 0; clue < NUM_QUESTIONS_PER_CAT; clue++) {
        // newRow jQuery object for clarity: this will accumulate the clues in this row
        let newRow = $("<tr>");
        for (let category = 0; category < NUM_CATEGORIES; category++) {
            // combine category and clue number to create the unique clue i-d
            let cluePosition = "" + category + "-" + clue;
            // Give each clue the starter text: "?"
            newRow.append($("<td>").attr("id", cluePosition).text("?"));
        }
        $("#jeopardy tbody").append(newRow);
      }
}

/** Handle clicking on a clue: show the question or answer.
 *
 * Uses .showing property on clue to determine what to show:
 * - if currently null, show question & set .showing to "question"
 * - if currently "question", show answer & set .showing to "answer"
 * - if currently "answer", ignore click
 * */

function handleClick(evt) {
    let [column, row] = evt.target.id.split("-");
    let clue = categories[column].clues[row];
    
    //update cell content if clue.showing = null or if clue.showing == "question"
    let newCellContent;
  
    if (!clue.showing) {
        newCellContent = clue.question;
        clue.showing = "question";
      } else if (clue.showing === "question") {
        newCellContent = clue.answer;
        clue.showing = "answer";
      } else {
        return;
      }
    
      let clueID = "#" + column + "-" + row;
  
      $(clueID).html(newCellContent);
}

/** Wipe the current Jeopardy board, show the loading spinner,
 * and update the button used to fetch data.
 */

function showLoadingView() {

}

/** Remove the loading spinner and update the button used to fetch data. */

function hideLoadingView() {
}

/** Start game:
 *
 * - get random category Ids
 * - get data for each category
 * - create HTML table
 * */

async function setupAndStart() {
    /* Re-initialize categories to an empty array */
    categories = [];
    /* CLEARS the contents of the table with id #jeopardy */
    $('#jeopardy').empty();

    /* Select 6 unique and valid ids and store them for use */
    let newCategoryIds = getCategoryIds(); // now holds 6 ids
    /* Call getCategory for each ID*/
    for (const categoryId of newCategoryIds) {
        const newCategoryObject = await getCategory(categoryId);
        // Push the newCategoryObject onto our data structure
        categories.push(newCategoryObject);
    }

    //console.log(categories[0]);
    // make the table
    fillTable();

}

/** On click of start / restart button, set up game. */
$('button').on("click", setupAndStart);

/* TODO

*/
/** On page load, add event handler for clicking clues */

// TODO

/* WAITING FOR DOM TO LOAD WITH JQUERY*/
$(async function () {
    //allMyCode();
    setupAndStart();
    $("#jeopardy").on("click", "td", handleClick);
    }
);

/*
AND WITH VANILLA JS 
window.onload = function() {
  allMyJavaScriptCode();
};
*/