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
            url: 'server/getstudents.php', //where we going
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
            $('.modal-title').text('Request Error');
            $('.modal-body').text('There was an error with your request. Please try again in a few minutes.');
            
            $('#myModal').modal('show');
            // open_modal(errorResponse.statusText);
      });;
}
function createNewStudentInAPI(name,course,grade) {
      var ajaxToAddStudent = {
            url: 'server/addstudent.php', //where we going
            method: 'post',                  //how are we getting there
            dataType: 'json',
            data: {
                  name:name,
                  grade:grade,
                  course:course
                  
            }
      };
      $.ajax(ajaxToAddStudent).then(function (response) { //a promise
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
            url: 'server/deletestudent.php', //where we going
            method: 'post',                  //how are we getting there
            dataType: 'json',
            data: {
                  'id':parseInt(student_id),
                  // 'force-failure':'server'
            }
      };
      $.ajax(ajaxToLearningFuze).then(function (response) { //a promise
            clearModalContents();
            $('#myModal').modal('hide');
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
      
      $('#myModal').on('hidden.bs.modal', function () { 
            
            clearModalContents();
        });  
}

/***************************************************************************************************
 * handleAddClicked - Event Handler when user clicks the add button
 * @param {object} event  The event object from the click
 * @return: 
       none
 */
function handleAddClicked() {

      addStudentclearErrorMessaging();
      let inputValidationStatus = validateInputs();

      if (inputValidationStatus === true) {
         clearErrorFields();
         addStudent();
      }
}
/***************************************************************************************************
 * handleCancelClicked - Event Handler when user clicks the cancel button, should clear out student form
 * @param: {undefined} none
 * @returns: {undefined} none
 * @calls: clearAddStudentFormInputs
 */
function handleCancelClicked() {
      clearAddStudentFormInputs();
      addStudentclearErrorMessaging();
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
      $('input').val("")
}
/***************************************************************************************************
 * renderStudentOnDom - take in a student object, create html elements from the values and then append the elements
 * into the .student_list tbody
 * @param {object} studentObj a single student object with course, name, and grade inside
 */
function renderStudentOnDom(studentObject,index) {//makes html element step 2
      var tableRow = $('<tr>');

      var tableName = $('<td>', {
            class: 'col-xs-3',
            text: studentObject.name,
      });

      var tableCourse = $('<td>', {
            class: 'col-xs-3',
            text: studentObject.course,
      });

      var gradeContainer = $('<div>', {
            text: studentObject.grade,
      });

      var tableGrade = $('<td>', {
            
            
            
      });

      tableGrade.append(gradeContainer);
     
      tableRow.append(tableName, tableCourse, tableGrade);
      
      var deleteContainer = $('<td>', {
            class: 'col-xs-3',
            id: 'deleteContainer',
      });
      
      var deleteButton = $('<button>', {
            class: 'btn btn-danger pull-right',
            text: 'Delete',
            'data-student': studentObject.id,
            on: {
                  click: showDeleteModal,
            }
      });

      var editButton = $('<button>', {
            class: 'btn btn-info',
            text: 'Edit',
            'data-student': studentObject.id,
            on: {
                  click: handleStudentUpdate,
            }
      });
     
      deleteContainer.append( editButton, deleteButton);
      tableRow.append(deleteContainer);
      $('.student-list tbody').append(tableRow);

      function showDeleteModal() {
            
            // var studentIndex = student_array.indexOf(studentObject);
            // student_array.splice(studentIndex,1);
            // $(this).closest('tr').remove();
            // deleteStudentFromServer(studentObject.ID);
            // calculateGradeAverage(student_array);
            var parentRow = $(this).parent().parent(); //tr
            var name = parentRow.children("td:nth-child(1)");
            var course = parentRow.children("td:nth-child(2)");
            var grade = parentRow.children("td:nth-child(3)").first();

            $('.modal-title').text('Delete Student Details');
            $('.modal-body').html(`
            <form class="form-group student-update-form col-sm-8 col-sm-offset-2">
                  <h5>Student Name</h5>
                  <div class="form-group input-group">
                  <span class="input-group-addon">
                        <span class="glyphicon glyphicon-user"></span>
                  </span>
                  <input pattern="^[a-zA-Z ]{3,}$" type="text" class="updateInput form-control form-rounded" name="updateName" id="updateName" disabled="true" value="${name.html()}">
                  </div>
                  <div id="updateNameErrorContainer" class="text-danger"></div>
                  <h5>Student Course</h5>
                  <div class="form-group input-group">
                  <span class="input-group-addon">
                        <span class="glyphicon glyphicon-list-alt"></span>
                  </span>
                  <input pattern="^[a-zA-Z ]{3,}$" type="text" class="updateInput form-control form-rounded" name="updateCourse" id="updateCourse"
                  disabled="true" value="${course.html()}">
                  </div>
                  <div id="updateCourseErrorContainer" class="text-danger"></div>
                  <h5>Student Grade</h5>
                  <div class="form-group input-group">
                  <span class="input-group-addon">
                        <span class="glyphicon glyphicon-education"></span>
                  </span>
                  <input pattern="^[1-9][0-9]?$|^100$" type="text" class="updateInput form-control form-rounded" name="updateGrade" id="updateGrade"
                  disabled="true" value="${grade.text()}">
                  </div>
                  <div id="updateGradeErrorContainer" class="text-danger"></div>
            </form>`

            );
            $('#myModal').modal('show');
            
            var footerContainer = $('<div>',{
                  class: 'text-center'
            });

            var deleteMessage = $('<div>', {
                  css: {
                        left: '-5px',
                        position: 'relative',
                        'margin-bottom': '15px'
                        
                  },
                  text: 'Are you sure you want to delete this entry?',
                  class: 'text-center'
            })

            var confirmButton = $('<button>', {
                  class: 'btn btn-success text-center',
                  text: 'Confirm',
                  'data-student': studentObject.id,
                  on: {
                        click: () => handleDeleteConfirmation(studentObject.id, parentRow),
                  }
            });

            var cancelButton = $('<button>', {
                  class: 'btn btn-default text-center',
                  text: 'Cancel',
                  on: {
                        click: cancelModalAction,
                  }
            });
            
            footerContainer.append(deleteMessage,confirmButton, cancelButton);
            $('.modal-footer').append(footerContainer);
            
      }

      function handleDeleteConfirmation(studentID, row) {

            var studentIndex = student_array.indexOf(studentObject);
            student_array.splice(studentIndex,1);
            row.remove();
            
            deleteStudentInAPI(studentID);
            calculateGradeAverage(student_array);

            
      }
      function handleStudentUpdate() {

            var parentRow = $(this).parent().parent(); //tr
            var name = parentRow.children("td:nth-child(1)");
            var course = parentRow.children("td:nth-child(2)");
            var grade = parentRow.children("td:nth-child(3)").first();

            $('.modal-title').text('Update Student Details');
            $('.modal-body').html(`
            <form class="form-group student-update-form col-sm-8 col-sm-offset-2">
                  <h5>Student Name</h3>
                  <div class="form-group input-group">
                  <span class="input-group-addon">
                        <span class="glyphicon glyphicon-user"></span>
                  </span>
                  <input pattern="^[a-zA-Z ]{3,}$" type="text" class="updateInput form-control form-rounded" name="updateName" id="updateName" value="${name.html()}">
                  </div>
                  <div id="updateNameErrorContainer" class="text-danger"></div>
                  <h5>Student Course</h3>
                  <div class="form-group input-group">
                  <span class="input-group-addon">
                        <span class="glyphicon glyphicon-list-alt"></span>
                  </span>
                  <input pattern="^[a-zA-Z ]{3,}$" type="text" class="updateInput form-control form-rounded" name="updateCourse" id="updateCourse"
                        value="${course.html()}">
                  </div>
                  <div id="updateCourseErrorContainer" class="text-danger"></div>
                  <h5>Student Grade</h3>
                  <div class="form-group input-group">
                  <span class="input-group-addon">
                        <span class="glyphicon glyphicon-education"></span>
                  </span>
                  <input pattern="^[1-9][0-9]?$|^100$" type="text" class="updateInput form-control form-rounded" name="updateGrade" id="updateGrade"
                        value="${grade.text()}">
                  </div>
                  <div id="updateGradeErrorContainer" class="text-danger"></div>
            </form>`
            );
            $('#myModal').modal('show');

            var footerContainer = $('<div>',{
                  class: 'text-center'
            });

            var updateMessage = $('<div>', {
                  css: {
                        'margin-bottom': '15px',
                        position: 'relative',
                  },
                  text: 'Confirm these changes?'
            });

            var submitButton = $('<button>', {
                  class: 'btn btn-success',
                  text: 'Submit',
                  'data-student': studentObject.id,
                  on: {
                        click: handleSaveUpdate,
                  }
            });

            var cancelButton = $('<button>', {
                  class: 'btn btn-default',
                  'data-dismiss': "modal",
                  text: 'Cancel',
                  on: {
                        click: cancelModalAction,
                  }
            });

            footerContainer.append(updateMessage,submitButton,cancelButton);
            $('.modal-footer').append(footerContainer);

            // var parentRow = $(this).parent().parent(); //tr
            // var name = parentRow.children("td:nth-child(2)");
            // var course = parentRow.children("td:nth-child(3)");
            // var grade = parentRow.children("td:nth-child(4)").first();
            // var tdButtons = parentRow.children("td:nth-child(4)");
 
            // name.html("<input pattern='^[a-zA-Z ]{3,}$' class='updateInput form-control form-rounded' type='text' name='updateName' id='updateName' value=' "+name.html()+" '/><div id='updateNameErrorContainer' class='text-danger'></div>");
            // course.html("<input pattern='^[a-zA-Z ]{3,}$' class='updateInput form-control form-rounded' type='text' name='updateCourse' id='updateCourse' value='"+course.html()+"'/><div id='updateCourseErrorContainer' class='text-danger'></div>");
            // grade.html("<input pattern='^[1-9][0-9]?$|^100$' class='updateInput form-control form-rounded' type='text' name='updateGrade' id='updateGrade' value='"+grade.text()+"'/><div id='updateGradeErrorContainer' class='text-danger'></div>");
 
            // $(".btnSave").bind("click", Save);
            // $(".btnEdit").bind("click", Edit);
            // $(".btnDelete").bind("click", Delete);
      }
      function handleSaveUpdate(event) {
            
            event.preventDefault();
            var updatedStudentInfo = {
                  id: studentObject.id,
                  name: $('#updateName').val(),
                  course: $('#updateCourse').val(),
                  grade: $('#updateGrade').val()
            }

            clearModalErrorMessaging();
            let updateInputValidation = validateUpdateInputs();

            if(updateInputValidation === true) {
                  clearModalContents();
                  saveUpdateToDb(updatedStudentInfo);
            } else {
                  return;
            }
           
      }
      
      // var nameTd = $('<td>', {
      //       class: 'col-xs-3 col-sm-3',
      //       text: student_object.name,
      //       'text-align': 'center'
      // });
      // var courseTd = $('<td>', {
      //       class: 'col-xs-3 col-sm-3',
      //       text: student_object.course,
      //       'text-align': 'center'
      // });
      // var gradeTd = $('<td>', {
      //       class: 'col-xs-3 col-sm-3',
      //       text: student_object.grade,
      //       'text-align': 'center'
      // });

      // var deleteButton = $('<button>', {
      //       attr:{
      //             'data-studentIndex':index,
      //       },
      //       class: 'btn btn-danger',
      //       text: 'Delete',
      //       'text-align': 'center',
      //       on: {
      //             click: handleDeleteClicked
      //       }

      // })
      // var buttonTd = $('<td>', { class: 'col-xs-3 col-sm-3' }).append(deleteButton);
      // var newTableRow = $('<tr>').append(nameTd, courseTd, gradeTd, buttonTd);
      // $('tbody').append(newTableRow);

      // function handleDeleteClicked() {
      //       var studentIndex = student_array.indexOf(student_object)
      //       deleteStudentInAPI(student_object.id);
      //       student_array.splice(studentIndex, 1);
      //       newTableRow.remove();
      //       calculateGradeAverage(student_array);

      // }

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

function saveUpdateToDb(studentInfo) {
      var ajaxOptions = {
            url: 'server/updatestudent.php',
            method: 'post',
            dataType: 'json',
            data: studentInfo,
            success: function(response) {
                  
                  clearErrorFields();
                  if (response.success === true & response.error !== undefined){
                        
                        $('.modal-title').text('Request Error');
                        $('.modal-body').text('There was an error with your request. Please try again in a few minutes.');
                        $('#errorText').text('Unable to perform action. Please check your permissions and try again.');
                        $('#myModal').modal('show');
                  } else if (response.success === true) {
                  
                        $('#myModal').modal('hide');
                  } 
                  
                  pullAPIStudentArray();
            },
            error: function(error) {
            
                  $('.modal-title').text('Request Error');
                  $('.modal-body').text('There was an error with your request. Please try again in a few minutes.');
                  
                  $('#myModal').modal('show');
            },
      }

      $.ajax(ajaxOptions);
}

function validateInputs(){
     
      
      let validatedStatus = true;
      
      const inputs = document.getElementsByClassName('addInput');
     

      for ( var inputField = 0; inputField < inputs.length; inputField++ ) {
            const pattern = new RegExp(inputs[inputField].pattern);
            
            const value = inputs[inputField].value;

            if (pattern.test(value) === false) {
                  validatedStatus = false;
                  if(inputs[inputField].pattern === '^[a-zA-Z ]{3,}$') {
                        let nameCourseErrorMessage = '';
                        nameCourseErrorMessage = "Please enter at least three letters";
                        $(`#${inputs[inputField].name}ErrorContainer`).text(nameCourseErrorMessage);
                  } else {
                        let gradeMessage = '';
                        gradeMessage = "Please enter a number between 0 and 100";
                        $(`#${inputs[inputField].name}ErrorContainer`).text(gradeMessage);
                  }
            }
      }

      return validatedStatus;
}

function validateUpdateInputs(){
      
      let validatedStatus = true;
      
      const inputs = document.getElementsByClassName('updateInput');

      for ( var inputField = 0; inputField < inputs.length; inputField++ ) {
            const pattern = new RegExp(inputs[inputField].pattern);
           
            const value = inputs[inputField].value;

            if (pattern.test(value) === false) {
                  validatedStatus = false;
                  if(inputs[inputField].pattern === '^[a-zA-Z ]{3,}$') {
                        let nameCourseErrorMessage = '';
                        nameCourseErrorMessage = "Please enter at least three letters";
                        $(`#${inputs[inputField].name}ErrorContainer`).text(nameCourseErrorMessage);
                  } else {
                        let gradeMessage = '';
                        gradeMessage = "Please enter a number between 0 and 100";
                        $(`#${inputs[inputField].name}ErrorContainer`).text(gradeMessage);
                  }
            }
      }

      return validatedStatus;
}

function clearErrorFields() {
      const inputs = document.getElementsByTagName('input');

      for ( var inputField = 0; inputField < inputs.length; inputField++ ) {
      
         $(`#${inputs[inputField].name}ErrorContainer`).text('');
                    
      }
}

function refreshData() {

      var ajaxOptions = {
            dataType: 'json',
            url: 'server/refreshStudentGrades.php',
            method: 'post',
            

      };

      $.ajax(ajaxOptions).then(function(response){
            
            
      }).fail(function(errorResponse) {
      
            if (errorResponse.status === 500) {
                  $('#errorText').text('There was an error connecting to the server. Please try again in a few minutes');
            }
            
            $('#myModal').modal('show');
      });
      
}

function clearModalContents() {

      $('.modal-title').empty();
      $('.modal-body').empty();
      $('.modal-footer').empty();
      // $('#myModal').modal('hide');
}

function addStudentclearErrorMessaging() {
      $('#studentNameErrorContainer').empty();
      $('#courseErrorContainer').empty();
      $('#studentGradeErrorContainer').empty();
}

function clearModalErrorMessaging() {
      $('#updateNameErrorContainer').empty();
      $('#updateCourseErrorContainer').empty();
      $('#updateGradeErrorContainer').empty();
}

function cancelModalAction(){
      $('.modal-title').empty();
      $('.modal-body').empty();
      $('.modal-footer').empty();
      $('#myModal').modal('hide');

}


