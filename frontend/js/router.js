const navigateTo = (path, data = {}) => {
  history.pushState(data, null, path);
  router();
};

const router = async () => {
  if (window.location.pathname === "/") {
    const response = await fetch("views/home.html");
    const content = document.querySelector("#root");
    const html = await response.text();
    content.innerHTML = html;
    scriptHandler("/home");
    return;
  }
  // if (localStorage.getItem("token")) {
  //   if (
  //     window.location.pathname === "/register" ||
  //     window.location.pathname === "/login"
  //   ) {
  //     navigateTo("/");
  //     return;
  //   }
  // }
  const routes = {
    404: fetch("views/404.html"),
    500: fetch("views/500.html"),
    home: fetch("views/home.html"),
    profile: fetch("views/profile.html"),
    authors: fetch("views/authors.html"),
    author: fetch("views/author.html"),
    login: fetch("views/signin.html"),
    register: fetch("views/signup.html"),
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
  content.innerHTML = html;
  scriptHandler(window.location.pathname);
};

function scriptHandler(path) {
  const scripts = document.querySelectorAll("script");

  scripts.forEach((script) => {
    const id = script.id;
    if (id === "extra-script") {
      script.remove();
    }
  });
  const newScript = document.createElement("script");
  newScript.src = `/js/${path.split("/")[1]}.js`;
  newScript.id = "extra-script";
  document.body.appendChild(newScript);
}

function ancorsHandler() {
  document.addEventListener("click", (event) => {
    const ancor = event.target;
    if (ancor.tagName !== "A") {
      return;
    }
    if (!ancor.href && !ancor.getAttribute("href") === "/") {
      return;
    }
    if (ancor.href.split("/")[1] === "") {
      event.preventDefault();
      const url = event.target.getAttribute("href");
      navigateTo(url);
    }
  });
}

window.addEventListener("DOMContentLoaded", (event) => {
  router();
  ancorsHandler();
});
