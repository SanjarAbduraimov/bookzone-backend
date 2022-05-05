async function signIn(data) {
  try {
    const response = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const json = await response.json();
    return json;
  } catch (error) {
    return { success: false, msg: error.message };
  }
}
const form = document.getElementById("signin-form");
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = {
    email: form.email.value,
    password: form.password.value,
  };
  try {
    const response = await signIn(data);
    if (response.success) {
      localStorage.setItem("token", response.token);
      // navigateTo("/", response.user);
      return;
    }
    throw new Error(response.msg);
  } catch (error) {
    Toastify({
      text: `${error.message}`,
      duration: 3000,
      destination: `${window.location.origin}/register`,
      newWindow: true,
      // className: "info",
      close: true,
      gravity: "top", // `top` or `bottom`
      position: "right", // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      style: {
        // background: "linear-gradient(to right, #00b09b, #96c93d)",
      },
      onClick: function () {}, // Callback after click
    }).showToast();
  }
});