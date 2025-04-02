document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("login-form");

    loginForm.addEventListener("submit", (event) => {
        event.preventDefault();
        
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        // Kullanıcı adı ve şifre doğrulaması
        if (username === "osmanergun42" && password === "sifre123") {
            alert("Giriş başarılı!");
            // Başarılı giriş sonrası yönlendirme yapılabilir
            window.location.href = "anasayfa.html";
        } else {
            alert("Kullanıcı adı veya şifre hatalı.");
        }
    });
});