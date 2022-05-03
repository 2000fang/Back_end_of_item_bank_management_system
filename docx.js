const docx = require("docx")
const express = require("express");
const app = express(exports);

const { Document, Packer, Paragraph, TextRun } = docx;

app.get("/", async (req, res) => {
    const doc = new Document({
        sections: [{
            properties: {},
            children: [
                new Paragraph({
                    children: [
                        new TextRun("Hello World"),
                        new TextRun({
                            text: "Foo Bar",
                            bold: true,
                        }),
                        new TextRun({
                            text: "\tGithub is the best",
                            bold: true,
                        }),
                    ],
                }),
            ],
        }],
    });

    const b64string = await Packer.toBase64String(doc);
    
    res.setHeader('Content-Disposition', 'attachment; filename=My Document.docx');
    res.send(Buffer.from(b64string, 'base64'));
})
app.listen(80,()=>{
    console.log('sever is running at http://127.0.0.1')
})