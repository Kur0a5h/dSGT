<?php
//$_GET, $_POST  superglobals
header("Access-Control-Allow-Origin: *");
header("Access-Control-ALlow-Headers: *");


require_once('mysqlcredentials.php');
$query = "SELECT * FROM `students`";
if( !empty( $_GET['course'] ) ){
    $course = addslashes($_GET['course']);
    $query .= "WHERE `course`='{$course}'";
}else{

}



$result = mysqli_query( $db, $query );

$output = [
    'success'=>false
];

$data = [];

if($result){
    if(mysqli_num_rows($result)>0){
        while( $row = mysqli_fetch_assoc($result)){
            array_push($data, $row);
        }
        $output['data'] = $data;
        $output['success'] = true;
    } else {
        $output['error'] = 'no data available';
    }
} else {
    $output['error'] = 'the database threw up';
}

$json_output = json_encode( $output );

print($json_output);

?>