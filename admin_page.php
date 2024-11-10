<?php
@include 'config.php';
session_start();

if(!isset($_SESSION['admin_name'])){
   header('location:login_form.php');
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
   <meta charset="UTF-8">
   <meta http-equiv="X-UA-Compatible" content="IE=edge">
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   <title>Админ страница </title>

   <!--css file-->
   <link rel="stylesheet" href="style.css">

</head>
<body>
   
<div class="container">

   <div class="content">
      <h1>Здравейте<span><?php echo $_SESSION['admin_name'] ?></span></h1>
      <p>това е страница за admin</p>
      <a href="login_form.php" class="btn">Съкращаване на линк</a>
      <a href="logout.php" class="btn">Излизане</a>
   </div>
</div>
</body>
</html>