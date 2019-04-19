<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
require_once('mysqlcredentials.php');
$student_id = $_POST["id"];
$idError = '';
$output = [
    "success" => false
];
if (empty($_POST["id"])) {
    $idError = 'Student ID -- Please enter a valid student Id';
    $output["idError"] = $idError;
} else {
    if (!preg_match("/^[0-9]*$/", $_POST["id"])) {
        $idError = "Student ID -- Only numbers allowed";
        $output["idError"] = $idError;
    }
}
if ($idError === '') {
    $stmt = $db->prepare("DELETE FROM `students` WHERE id=(?)");
    $stmt->bind_param("i", $student_id);
    $result = $stmt->execute();
    if ($result) {
        $output['success'] = true;
    } else {
        $output['success'] = true;
        $output['error'] = 'query failed';
    }
    
} else {
    $output['error'] = 'query failed';
}
$json_output = json_encode($output);
print_r($json_output);
?>