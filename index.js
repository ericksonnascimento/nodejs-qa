const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./database/database");
const Question = require("./database/Question");
const Answer = require("./database/Answer");

connection
    .authenticate()
    .then(() => {
        console.log("db ok...");
    })
    .catch((error) => {
        console.log(error);
    });

app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//routes
app.get("/", (req, res) => {

    Question.findAll({
        raw: true,
        order: [
            ['id', 'DESC']
        ],
    }).then(questions => {
        res.render("index", {
            questions: questions
        });
    });
});

app.get("/ask", (req, res) => {
    res.render("ask");
});

app.post("/ask", (req, res) => {
    const title = req.body.title;
    const description = req.body.description;

    Question.create({
        title: title,
        description: description
    }).then(() => {
        res.redirect("/");
    });
});

app.get("/ask/:id", (req, res) => {
    const id = req.params.id;

    Question.findOne({
        where: {
            id: id
        }
    }).then(question => {
        if (question != undefined) {

            Answer.findAll({
                where: {
                    questionId: question.id
                },
                order: [
                    ['id', 'DESC']
                ]
            }).then(answers => {
                res.render("question", {
                    question: question,
                    answers: answers
                });
            });
        } else {
            res.redirect("/");
        }
    });

});

app.post("/answer", (req, res) => {
    const body = req.body.body;
    const questionId = req.body.questionId;

    Answer.create({
        body: body,
        questionId: questionId
    }).then(() => {
        res.redirect(`/ask/${questionId}`);
    })
})

app.listen(8080, () => {
    console.log("server is running...");
})