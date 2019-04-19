<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-ALlow-Headers: *");
require_once('mysqlcredentials.php');
$nameError = '';
$courseError = '';
$gradeError = '';
$student_id = $_POST["id"];
$name = $_POST["name"];
$course = $_POST["course"];
$grade = $_POST["grade"];
$output = [
    'success' => false
];
if (empty($_POST["name"])) {
    $nameError = "Student Name -- Please enter a valid name";
    $output["nameError"] = $nameError;
} else {
    if (!preg_match("/^[a-zA-Z ]*$/", $_POST["course"])) {
        $nameError  = "Student Name -- Only letters and white spaces allowed";
        $output [ "nameError" ] = $nameError;
    }
}
if (empty($_POST["course"])) {
    $courseError = "Please enter a valid course";
    $output["courseError"] = $courseError;
} else {
    if (!preg_match("/^[a-zA-Z ]*$/", $_POST["course"])) {
        $courseError  = "Student Course -- Only letters and white spaces allowed";
        $output [ "courseError" ] = $courseError;
    }
}
if (empty($_POST["grade"])) {
    $gradeError = "Student Grade -- Please enter a valid grade";
    $output["gradeError"] = $gradeError;
    
} else {
    if(!preg_match("/^[0-9]*$/", $_POST["grade"])) {
        $gradeError = "Student Grade -- Only numbers allowed";
        $output["gradeError"] = $gradeError;
    }
}
if ($nameError === '' and $courseError === '' and $gradeError === '') {
    $stmt = $db->prepare("UPDATE `students` AS s SET s.name=?, s.course=?, s.grade=? WHERE s.ID=?");
    $stmt->bind_param("ssii", $name, $course, $grade, $student_id);
    $result = $stmt->execute();
    if ($result) {
        $output["success"] = true;
    } else {
        $output["success"] = true;
        $output["error"] = 'Query Failed';
    }
} 
$json_output = json_encode($output);
print_r($json_output);
?>