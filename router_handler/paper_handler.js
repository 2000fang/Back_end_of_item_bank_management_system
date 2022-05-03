//导入数据库操作函数
const db = require('../db/index')
const docx = require("docx")
const { Document, Packer, Paragraph, TextRun } = docx;


//根据前端传来的试题id数组，从数据库中读取对应的试题，并且用word打印出来

module.exports.GeneratePaperById = async (req,res)=>{

    var strId = JSON.stringify(req.body);
    strId = strId.replace("[","")
    strId = strId.replace("]","")
    strId=strId.split(",")
    const len = strId.length

    function getAlldomain(callback){
        let subjects = []
        for(let i=0;i<len;i++){
            let sql=`select * from subjects where subject_id=?`
            db.query(sql, strId[i],function(err, results){
                subjects.push(results[0])
                callback(subjects)
                     
        })
    }
    }
    getAlldomain((results)=>{
        console.log(results)
    }) 
      
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


}