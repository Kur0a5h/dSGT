/* information about jsdocs: 
* param: http://usejsdoc.org/tags-param.html#examples
* returns: http://usejsdoc.org/tags-returns.html
* 
/**
 * Listen for the document to load and initialize the application
 */
$(document).ready(initializeApp);

/**
 * Define all global variables here.  
 */
/***********************
 * student_array - global array to hold student objects
 * @type {Array}
 * example of student_array after input: 
 * student_array = [
 *  { name: 'Jake', course: 'Math', grade: 85 },
 *  { name: 'Jill', course: 'Comp Sci', grade: 85 }
 * ];
 */
var student_array;
var new_id;


//   $.ajax(ajaxOptions).then(function(response){ //a promise
//       for (var albumIndex=0;albumIndex<response.feed.entry.length;albumIndex++){
//           console.log(response.feed.entry[albumIndex]['im:image'][2].label);

//       }
//   });
/***************************************************************************************************
* initializeApp 
* @params {undefined} none
* @returns: {undefined} none
* initializes the application, including adding click handlers and pulling in any data from the server, in later versions
*/
function initializeApp() {
      addClickHandlersToElements();
      pullAPIStudentArray()
}
function pullAPIStudentArray() {
      var ajaxToGetStudents = {
            url: 'http://localhost:8080/SGT/server/getstudents.php', //where we going
            method: 'post',                  //how are we getting there
            dataType: 'json',
            // data: {
            //       api_key: '8kXdAtTJtV'
            // }
      };
      $.ajax(ajaxToGetStudents).then(function (response) { //a promise
            if(response.success==false&&response.errors!==undefined){
                  open_modal(response.errors[0]);
            }
            student_array = response.data;
            updateStudentList();
      }).fail(function(errorResponse){
            
            open_modal(errorResponse.statusText);
      });;
}
function createNewStudentInAPI(name,course,grade) {
      var ajaxToLearningFuze = {
            url: 'http://s-apis.learningfuze.com/sgt/create', //where we going
            method: 'post',                  //how are we getting there
            dataType: 'json',
            data: {
                  api_key: '8kXdAtTJtV',
                  name:name,
                  grade:grade,
                  course:course
                  
            }
      };
      $.ajax(ajaxToLearningFuze).then(function (response) { //a promise
            console.log(response);
            if(response.success==false&&response.errors!==undefined){
                  open_modal(response.errors[0]);
            }
            var studentObj = {
                  name: name,
                  course: course,
                  grade: grade,
                  id: response.new_id
            };
            clearAddStudentFormInputs();
            student_array.push(studentObj)
            updateStudentList();
            
      }).fail(function(errorResponse){
            
            open_modal(errorResponse.statusText);
      });;
}
function deleteStudentInAPI(student_id) {
      var ajaxToLearningFuze = {
            url: 'http://s-apis.learningfuze.com/sgt/delete', //where we going
            method: 'post',                  //how are we getting there
            dataType: 'json',
            data: {
                  api_key: '8kXdAtTJtV',
                  'student_id':parseInt(student_id),
                  // 'force-failure':'server'
            }
      };
      $.ajax(ajaxToLearningFuze).then(function (response) { //a promise
            
            console.log(response);
            if(response.success==false&&response.errors!==undefined){
                  open_modal(response.errors[0]);
            }
      }).fail(function(errorResponse){
            
            open_modal(errorResponse.statusText);
      });
}
/***************************************************************************************************
* addClickHandlerstoElements
* @params {undefined} 
* @returns  {undefined}
*     
*/
function addClickHandlersToElements() {
      // $('tbody ').on('click', '.btn-danger', handleDeleteClicked);
      $('.btn-success').click(handleAddClicked);
      $('.btn-default').click(handleCancelClicked);
      $('.btn-info').click(handlePullServerDataClicked);
      
}

/***************************************************************************************************
 * handleAddClicked - Event Handler when user clicks the add button
 * @param {object} event  The event object from the click
 * @return: 
       none
 */
function handleAddClicked() {
      console.log('hello');
      addStudent();
}
/***************************************************************************************************
 * handleCancelClicked - Event Handler when user clicks the cancel button, should clear out student form
 * @param: {undefined} none
 * @returns: {undefined} none
 * @calls: clearAddStudentFormInputs
 */
function handleCancelClicked() {
      clearAddStudentFormInputs();
}
/***************************************************************************************************
 * addStudent - creates a student object based on input fields in the form and adds the object to global student array
 * @param {undefined} none
 * @return undefined
 * @calls clearAddStudentFormInputs, updateStudentList
 */
function addStudent() {//makes student object step 1
      var studentNameInput = $('#studentName').val();
      var courseInput = $('#course').val();
      var studentGradeInput = $('#studentGrade').val();
      // if (studentNameInput === '' || courseInput === '' || studentGradeInput === '' || parseFloat(studentGradeInput) < 0 || parseFloat(studentGradeInput) > 100 || isNaN(studentGradeInput)) {
      //       // return alert('Ensure all fields are complete and the Grade is a number between 0 and 100')

      // } else {
            createNewStudentInAPI(studentNameInput,courseInput,studentGradeInput);

      // }
}
/***************************************************************************************************
 * clearAddStudentForm - clears out the form values based on inputIds variable
 */
function clearAddStudentFormInputs() {
      $('.form-control').val("")
}
/***************************************************************************************************
 * renderStudentOnDom - take in a student object, create html elements from the values and then append the elements
 * into the .student_list tbody
 * @param {object} studentObj a single student object with course, name, and grade inside
 */
function renderStudentOnDom(student_object,index) {//makes html element step 2
      var nameTd = $('<td>', {
            class: 'col-xs-3 col-sm-3',
            text: student_object.name,
            'text-align': 'center'
      });
      var courseTd = $('<td>', {
            class: 'col-xs-3 col-sm-3',
            text: student_object.course,
            'text-align': 'center'
      });
      var gradeTd = $('<td>', {
            class: 'col-xs-3 col-sm-3',
            text: student_object.grade,
            'text-align': 'center'
      });

      var deleteButton = $('<button>', {
            attr:{
                  'data-studentIndex':index,
            },
            class: 'btn btn-danger',
            text: 'Delete',
            'text-align': 'center',
            on: {
                  click: handleDeleteClicked
            }

      })
      var buttonTd = $('<td>', { class: 'col-xs-3 col-sm-3' }).append(deleteButton);
      var newTableRow = $('<tr>').append(nameTd, courseTd, gradeTd, buttonTd);
      $('tbody').append(newTableRow);

      function handleDeleteClicked() {
            var studentIndex = student_array.indexOf(student_object)
            deleteStudentInAPI(student_object.id);
            student_array.splice(studentIndex, 1);
            newTableRow.remove();
            calculateGradeAverage(student_array);

      }

}

/***************************************************************************************************
 * updateStudentList - centralized function to update the average and call student list update
 * @param students {array} the array of student objects
 * @returns {undefined} none
 * @calls renderStudentOnDom, calculateGradeAverage, renderGradeAverage
 */
function updateStudentList() {
      $('tbody>tr').remove();
      for (var studentIndex = 0; studentIndex < student_array.length; studentIndex++) {
            renderStudentOnDom(student_array[studentIndex]);
      }

      calculateGradeAverage();

}
/***************************************************************************************************
 * calculateGradeAverage - loop through the global student array and calculate average grade and return that value
 * @param: {array} students  the array of student objects
 * @returns {number}
 */
function calculateGradeAverage(array) {
      var sumOfGrades = 0;
      var gradeAverage = null;
      for (var studentIndex = 0; studentIndex < student_array.length; studentIndex++) {
            sumOfGrades += parseFloat(student_array[studentIndex].grade);
      }
      gradeAverage = sumOfGrades / student_array.length;
      renderGradeAverage(gradeAverage)
}
/***************************************************************************************************
 * renderGradeAverage - updates the on-page grade average
 * @param: {number} average    the grade average
 * @returns {undefined} none
 */
function renderGradeAverage(average) {
      if (student_array.length > 0) {
            $('.avgGrade').text(average.toFixed(2));
      } else {
            $('.avgGrade').text(0)
      }
}
function handlePullServerDataClicked(){
      pullAPIStudentArray(); 
}
function close_modal(){
      $('#myModal').css('display', 'none');
}
function open_modal(message){
      
      $('#myModal').css('display', 'block');
      $('.modal-body>p').text(message)
      
}

// function handleDeleteClicked(){
//       var deletedStudentIndex=$(this).attr('data-studentIndex');
//       student_array.splice(deletedStudentIndex)
//       $(this).closest('tr').remove()


// }




