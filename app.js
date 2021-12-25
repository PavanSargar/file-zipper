const express = require("express");
const multer = require("multer");
const admzip = require("adm-zip");

const fs = require("fs");
const path = require("path");

const app = express();

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.filename + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const maxSize = 10 * 1024 * 1024;
const compressFileUpload = multer({
  storage,
  limits: {
    filesize: maxSize,
  },
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.post("/compress", compressFileUpload.array("file", 100), (req, res) => {
    const zip = new admzip();
    if (req.files) {
        req.files.map(file => {
            console.log(file.path);
            zip.addLocalFile(file.path);
        });

        const output = Date.now() + "output.zip";
        fs.writeFileSync(output, zip.toBuffer());
        
        res.download(output);
    }

});

app.listen(process.env.PORT || 5000, () => {
  console.log("server running on PORT 5000...");
});
