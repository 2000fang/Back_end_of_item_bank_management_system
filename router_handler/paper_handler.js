//导入数据库操作函数
const db = require('../db/index')
const docx = require("docx");
const { assert } = require('joi');
const { Document, Packer, Paragraph, TextRun, PageBreak } = docx;


//根据前端传来的试题id数组，从数据库中读取对应的试题，并且用word打印出来

module.exports.GeneratePaperById = async (req,res)=>{

    var strId = JSON.stringify(req.body);
    strId = strId.replace("[","")
    strId = strId.replace("]","")
    strId=strId.split(",")
    const len = strId.length

    let subjects = []
    // //for(let i=0;i<len;i++){
    //     let sql=`select * from subjects where subject_id in (10,11)`
    //     //console.log("strid"+strId[i])
    //     db.query(sql, function(err, results) {
    //         subjects.push(results)
    //         console.log(subjects)
    //     })
    //}
    
    let find_id_func = (sql, id) => {
        return new Promise((res, rej) => {
            db.query(sql, id, (err, result) => {
                res(result)
            })
        })
    }

    for(let i=0;i<len;i++) {
        let sql = `select * from subjects where subject_id=?`
        //let list = await find_id_func(sql, strId[i])
        let list = await find_id_func(sql, strId[i])
        //console.log(list[0])
        subjects.push(list[0])
    }
    console.log(subjects)
    // let subjects = [
    //     {
    //         subject_id: 10,
    //         course_name: '计算机网络',
    //         subject_type: '判断题',
    //         subject_topic: '测试是否成功？',
    //         subject_score: 2,
    //         subject_answer: '否',
    //         subject_optiona: '',
    //         subject_optionb: '',
    //         subject_optionc: '',
    //         subject_optiond: '',
    //         subject_chaper: '概念' 
    //     },
    //     {
    //         subject_id: 11,
    //         course_name: '计算机网络',
    //         subject_type: '选择题',
    //         subject_topic: '交换种类',
    //         subject_score: 2,
    //         subject_answer: 'ABCD',
    //         subject_optiona: '电路交换',
    //         subject_optionb: '报文交换',
    //         subject_optionc: '虚电路交换',
    //         subject_optiond: '分组交换',
    //         subject_chaper: '概念' 
    //     }
    // ]

    let all_para = []
    for (let i=0; i<subjects.length; i++) {
        let Title = []
        let title_name = new Paragraph({
            children: [
                new TextRun(`${i+1}. ${subjects[i].subject_topic}`),
            ],
        })
        let optionA = new Paragraph({
            children: [
                new TextRun(`(A)  ${subjects[i].subject_optiona}`),
            ],
        })
        let optionB = new Paragraph({
            children: [
                new TextRun(`(B)  ${subjects[i].subject_optionb}`),
            ],
        })
        let optionC = new Paragraph({
            children: [
                new TextRun(`(C)  ${subjects[i].subject_optionc}`),
            ],
        })
        let optionD = new Paragraph({
            children: [
                new TextRun(`(D)  ${subjects[i].subject_optiond}`),
            ],
        })
        let space = new Paragraph({
            children: [
                new TextRun(" "),
            ],
        })
        all_para.push(title_name)
        all_para.push(optionA)
        all_para.push(optionB)
        all_para.push(optionC)
        all_para.push(optionD)
        all_para.push(space)

        // *add to all para
        //all_para.push(Title)
    }
    let page_break = new docx.Paragraph({
        children: [
            new PageBreak(),
        ],
    })
    // const paragraph = new docx.Paragraph({
    //     children: [new TextRun("Amazing Heading"), new PageBreak()],
    // });
    
    all_para.push(page_break)

    // let test_after = new Paragraph({
    //     children: [
    //         new TextRun(`(D)sadjhasdhaisd`),
    //     ],
    // })
    // all_para.push(test_after)

    for (let i=0; i<subjects.length; i++) {
        let title_name = new Paragraph({
            children: [
                new TextRun(`${i+1}. ${subjects[i].subject_answer}`),
            ],
        })
       
        let space = new Paragraph({
            children: [
                new TextRun(" "),
            ],
        })
        all_para.push(title_name)
        all_para.push(space)
    }
    

    const doc = new Document({
        sections: [{
            properties: {},
            children: all_para,
        }],
    });


    const b64string = await Packer.toBase64String(doc);
    
    res.setHeader('Content-Disposition', 'attachment; filename=My Document.docx');
    res.send(Buffer.from(b64string, 'base64'));


}