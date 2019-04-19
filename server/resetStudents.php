<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
require_once('mysqlcredentials.php');
$output = [
    'success' => false
];
$deleteStmt = $db->prepare("TRUNCATE TABLE students");
$deleteResult = $deleteStmt->execute();
if ($deleteResult) {
    $insertStmt = $db->prepare("
    INSERT INTO students 
        (name, course, grade)
    VALUES
        ('Kuroash Esmaili','PHP Backend', 99),
        ('John Roe','Math', 88),
        ('Chris Warren','Planning', 100),
        ('Justen Quirante','Design', 95),
        ('Remmy LeBeua','Agilities', 92),
        ('Mike Capo','MySQL', 94),
        ('Quy QUy','Baking', 86),
        ('Jordan Salisbury','Project Management', 92),
        ('Dan Paschal','Public Speaking', 54),
        ('Andy Ong','Mentoring', 100)
    ");
    $insertResult = $insertStmt->execute();
    if ($insertResult) {
        $output = [
            'success' => true,
        ];
    } else {
        $output['error'] = 'Error with Insert';
    }
    
} else {
    $output['error'] = 'Error with Truncate';
}
$json_output = json_encode($output);
print($json_output);
?>