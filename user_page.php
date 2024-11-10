<?php

@include 'config.php';

session_start();

if(!isset($_SESSION['user_name'])){
   header('location:login_form.php');
}

?>

<!DOCTYPE html>
<html lang="en">
<head>
   <meta charset="UTF-8">
   <meta http-equiv="X-UA-Compatible" content="IE=edge">
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   <title>Потребителска страница</title>

   <!-- css file link  -->
   <link rel="stylesheet" href="css/style.css">

</head>
<body>
   
<div class="container">
   <div class="content">
      <!--<h3>hi, <span>user</span></h3>-->
      <h1>Здвайте, <span><?php echo $_SESSION['user_name'] ?></span></h1>
      <p>добре дошли в главната страница</p>
      <a href="main.php" class="btn">Съкрати линк</a>
      <a href="logout.php" class="btn">Излез</a>
   </div>

</div>

</body>
</html>