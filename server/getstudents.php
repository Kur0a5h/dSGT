<?php

require_once('mysqlcredentials.php');

$query = "SELECT * FROM `students`";

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
    $output['error'] = 'the database threw up(check query)'
}
$json_output = json_encode( $output );

print($json_output);

?>