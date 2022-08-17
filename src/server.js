import express from "express";
import res from "express/lib/response";

const app = express();

app.set("view engine", "pug");
app.set("views", `${__dirname}/views`);
app.use("/static", express.static(`${__dirname}/static`));
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

const handleListen = () => console.log(`Listening on http://localhost:3000`);
app.listen(3000, handleListen);
