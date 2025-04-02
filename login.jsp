<%@ page import="java.io.*,java.util.*,javax.servlet.*,javax.servlet.http.*" %>
<%
    // Kullanıcı adı ve şifreyi al
    String username = request.getParameter("username");
    String password = request.getParameter("password");

    // Basit kullanıcı doğrulama (gerçek bir uygulamada veritabanı kullanmalısınız)
    if(username.equals("osmanergun42") && password.equals("sifre123")) {
        // Kullanıcı adı ve şifre doğruysa oturumu başlat
        session.setAttribute("username", username);
        // Ana sayfaya yönlendir
        response.sendRedirect("index.html");
    } else {
        // Kullanıcı adı veya şifre hatalıysa tekrar giriş sayfasına yönlendir
        response.sendRedirect("kullanici.html");
    }
%>