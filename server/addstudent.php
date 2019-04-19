<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");

require_once('mysqlcredentials.php');

$name = $_POST["name"];
$course = $_POST["course"];
$grade = $_POST["grade"];

$nameError = '';
$courseError = '';
$gradeError = '';
$output = [
    'success' => false
];

if ( empty($_POST["name"]) ) {
    $nameError = "Student Name -- Please enter a valid name";
    $output [ "nameError" ] =  $nameError;
    
} else {
    if (!preg_match("/^[a-zA-Z ]*$/", $_POST["name"])) {
        $nameError = "Student Name -- Only letters and white spaces allowed";
        $output [ "nameError" ] = $nameError;
    }
}
if ( empty($_POST["course"]) ) {
    $courseError = "Student Course -- Please enter a valid course";
    $output["courseError"] = $courseError;
    
} else {
    if (!preg_match("/^[a-zA-Z ]*$/", $_POST["course"])) {
        $courseError  = "Student Course -- Only letters and white spaces allowed";
        $output [ "courseError" ] = $courseError;
    }
}
if ( empty($_POST["grade"]) ) {
    $gradeError = "Student Grade -- Please enter a valid grade";
    $output ["gradeError"] = $gradeError;
    
} else {
    if(!preg_match("/^[0-9 ]*$/", $_POST["grade"])) {
        $gradeError = "Student Grade -- Only numbers allowed";
        $output["gradeError"] = $gradeError;
    }
}
if ($nameError === '' and $courseError === '' and $gradeError === '') {
    $stmt = $db->prepare("INSERT INTO `students` (`name`,`course`,`grade`) VALUES (?,?,?)");
    $stmt->bind_param("ssi", $name, $course, $grade);
    $result = $stmt->execute();
    print_r('result', $result);
    if ($result) {
        
        $output['success'] = true;
        $output['new_id']=mysqli_insert_id($db);
        
    } else {
        
        $output['error'] = 'query failed';
        
    }
}
$json_output = json_encode($output);
print($json_output);
?>