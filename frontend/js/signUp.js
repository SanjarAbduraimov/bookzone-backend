async function signUp(data) {
  try {
    const response = await fetch("/signUp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Athoriztion: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify(data),
    });
    const json = await response.json();
    return json;
  } catch (error) {
    console.log(error);
  }
}
