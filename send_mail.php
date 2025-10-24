<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
  $name = $_POST["name"];
  $phone = $_POST["phone"];
  $email = $_POST["email"];
  $city = $_POST["city"];
  $message = $_POST["message"];

  $to = "info@al-fursansecurity.com"; // إيميل الشركة
  $subject = "طلب عرض سعر من $name";
  $body = "
  الاسم: $name\n
  رقم الهاتف: $phone\n
  البريد الإلكتروني: $email\n
  المدينة: $city\n
  الرسالة:\n$message
  ";

  $headers = "From: $email\r\nReply-To: $email\r\nContent-Type: text/plain; charset=UTF-8";

  if (mail($to, $subject, $body, $headers)) {
    echo "تم إرسال الرسالة بنجاح!";
  } else {
    echo "حدث خطأ أثناء إرسال الرسالة.";
  }
}
?>
