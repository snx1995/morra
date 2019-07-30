(function (){
    const left = document.querySelector(".left");
    const right = document.querySelector(".right");
    const account = document.querySelector("#account");
    const password = document.querySelector("#password");
    const login = document.querySelector("#login");
    const ready = document.querySelector("#ready");
    const st = document.querySelector("#st");
    const jd = document.querySelector("#jd");
    const bu = document.querySelector("#bu");
    const result = document.querySelector(".result");

    const client = io("ws://dev.bantasy.top:12345");
    client.on("echo", data => {
        const li = document.createElement("li");
        li.innerText = data;
        right.append(li);
    });

    login.addEventListener("click", () => {
        client.emit("login", {
            account: account.value,
            password: password.value
        })
    })

    ready.addEventListener("click", () => {
        client.emit("ready");
    })

    st.addEventListener("click", () => {
        client.emit("guess", "st");
    })

    jd.addEventListener("click", () => {
        client.emit("guess", "jd");
    })

    bu.addEventListener("click", () => {
        client.emit("guess", "bu");
    })

    client.on("loginsuccess", () => {
        left.className = "left ready";
    });

    client.on("gamestart", () => {
        left.className = "left round";
    });

    client.on("gamefinish", data => {
        result.innerText = data;
        left.className = "left result";
    })
})()