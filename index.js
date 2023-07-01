const express = require("express");
require("dotenv").config();
const db = require("./db/connection");
const response = require("./db/response");
const bodyParser = require("body-parser");
// app
const app = express();
const port = process.env.PORT;
// listen
app.listen(port, () => {
  console.log(`app run at port ${port}`);
});
// middleware
// app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
// routing

app.get("/", (req, res) => {
  res.send("ok");
});
// get all
app.get("/list", (req, res) => {
  const sql = "SELECT * FROM buku";
  db.query(sql, (err, fields) => {
    if (err) throw err;
    response(200, fields, "select all datas", res);
  });
});
// find
app.get("/list/:id", (req, res) => {
  const id = req.params.id;
  const sql = `SELECT * FROM buku WHERE id =${id}`;
  db.query(sql, (err, fields) => {
    if (err) throw err;
    response(200, fields, "select data by id", res);
  });
});
// post
app.post("/list", (req, res) => {
  const { judul, genre, penulis } = req.body;
  const sql = `INSERT INTO buku (judul,genre,penulis) VALUES ('${judul}','${genre}','${penulis}')`;

  db.query(sql, (err, fields) => {
    if (err) response(500, "invalid", "error", res);
    const data = {
      isSuccess: fields.affectedRows,
      id: fields.insertId,
    };
    // tanda tanya pada fiels untuk validasi ketika vield ada isinya atau kosong . jika kosong maka tidak di jalankan
    if (fields?.affectedRows) response(200, data, "add data successfuly", res);
  });
});
// put
app.put("/list", (req, res) => {
  const { id, judul, genre, penulis } = req.body;
  const sql = `UPDATE buku SET judul = '${judul}', genre = '${genre}' , penulis = '${penulis}'  WHERE id = ${id}`;
  db.query(sql, (err, fields) => {
    if (err) response(500, "invalid", "error", res);
    const data = {
      isSuccess: fields.affectedRows,
      message: fields.message,
    };
    if (fields?.affectedRows) {
      // tanda tanya pada fiels untuk validasi ketika vield ada isinya atau kosong . jika kosong maka tidak di jalankan
      response(200, data, "update data successfuly", res);
    } else {
      response(404, "id not found", "error", res);
    }
  });
});
// delete
app.delete("/list", (req, res) => {
  const { id } = req.body;
  const sql = `DELETE FROM buku WHERE id = ${id}`;
  db.query(sql, (err, fields) => {
    if (err) response(500, "invalid", "error", res);
    const data = {
      isSuccess: fields.affectedRows,
      message: `id ${fields.insertId} dihapus`,
    };
    if (fields?.affectedRows) {
      // tanda tanya pada fiels untuk validasi ketika vield ada isinya atau kosong . jika kosong maka tidak di jalankan
      response(200, data, "Id berhasil di hapus", res);
    } else {
      response(404, "id not found", "error", res);
    }
  });
});
