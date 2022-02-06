// import { signUp } from "./signUp.js";
const navigateTo = (path) => {
  window.history.pushState(null, null, path);
  router();
};

const router = async () => {
  if (window.location.pathname === "/") {
    const response = await fetch("views/home.html");
    const content = document.querySelector("#root");
    const html = await response.text();
    content.innerHTML = html;
    return;
  }
  const routes = {
    404: fetch("views/404.html"),
    500: fetch("views/500.html"),
    home: fetch("views/home.html"),
    profile: fetch("views/profile.html"),
    author: fetch("views/authorsHome.html"),
    login: fetch("views/login.html"),
    register: fetch("views/register.html"),
    logout: fetch("views/logout.html"),
    books: fetch("views/books.html"),
    book: fetch("views/book.html"),
  };
  const response = await routes[window.location.pathname.split("/")[1]];
  const content = document.querySelector("#root");
  if (!response) {
    const html = await (await routes[404]).text();
    content.innerHTML = html;
    return;
  }
  const html = await response.text();
  console.log(response, html, window.location.pathname.split("/")[1]);
  content.innerHTML = html;
};

window.addEventListener("DOMContentLoaded", (event) => {
  const ancors = document.querySelectorAll("a");
  ancors.forEach((ancor) => {
    ancor.addEventListener("click", (event) => {
      event.preventDefault();
      const url = ancor.getAttribute("href");
      navigateTo(url);
    });
  });
  router();
});
window.addEventListener("popstate", () => {
  router();
});
