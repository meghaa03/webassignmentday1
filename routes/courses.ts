import express, {Router,Request,Response} from 'express';

import {Course as Course} from '../db';
import {Subject as Subject} from '../db';
import {Lecture as Lecture} from '../db';
import {Batch as Batch} from '../db';
import {Student as Student} from '../db';
import {Teacher as Teacher} from '../db';
import {StudentBatchMapper as StudentBatchMapper} from '../db';

const route: Router = Router()

route.get('/',(req:Request,res:Response)=>{
    Course.findAll()
    .then((allCourses:any)=>{
        res.json(allCourses)
    })
})

route.get('/:id',(req:Request,res:Response)=>{

    console.log("in courses/id")
    var id = req.params.id;
    Course.findOne({
            where:{
                courseId:id
            }
        })
        .then((course:any)=>{
            res.json(course)
    })
    
    
})

route.post('/',(req:Request,res:Response)=>{

    console.log("in courses/id post")
    let courseName=req.body.courseName
    Course.create({courseName:courseName})
    .then((addedCourse:any)=>{
        console.log("Course added")
        res.json({success:true})
    })
    .catch((err:Error)=>res.send({success:false}))
})

route.put('/:id',(req:Request,res:Response)=>{
    
        Course.findOne({
            where:
            {
                courseId:req.params.id
            }
        })
        .then((courseExisting:any)=>{
            if(courseExisting)
            {
                courseExisting.updateAttributes({
                    courseName:req.body.courseName
                })
                .then((updatedCourse:any)=>{
                    res.send({success:true})
                })
            }
            
        })    
        .catch((err:Error)=>res.send({success:false}))
    
})

route.get('/:id1/batches',(req:Request,res:Response)=>{

    console.log("in courses/id/batches")
    var id1=req.params.id1
    
    console.log("id 1 "+id1)
    Batch.findAll({
            where:{
                courseId:id1
            }
        })
    .then((batches:any)=>{
        res.json(batches)
    })
})

route.get('/:id1/batches/:id2',(req:Request,res:Response)=>{

    console.log("in courses/id/batches")
    var id1=req.params.id1
    var id2 = req.params.id2;
    
    console.log("id 1 "+id1+" id2 "+id2)
    Batch.findOne({
            where:{
                courseId:id1,
                batchId:id2
            }
        })
        .then((batch:any)=>{
            res.json(batch)
        })
    
    
})

route.post('/:id1/batches',(req:Request,res:Response)=>{

    let batchName=req.body.batchName
    Batch.create({batchName:batchName,courseId:parseInt(req.params.id1)})
    .then((addedBatch:any)=>{
        res.json({success:true})
    })
    .catch((err:Error)=>res.send({success:false}))
})

route.put('/:id1/batches/:id2',(req:Request,res:Response)=>{

    var id1=req.params.id1
    var id2 = req.params.id2;
    
    Batch.findOne({
        where:
        {
            courseId:id1,
            batchId:id2
        }
    })
    .then((batchExisting:any)=>{
        if(batchExisting)
        {
            batchExisting.updateAttributes({
                batchName:req.body.batchName
            })
            .then((updatedBatch:any)=>{
                res.send({success:true})
            })
        }
        res.send({success:false})
    })     
})

route.get('/:id1/batches/:id2/lectures',(req:Request,res:Response)=>{

    var id2=req.params.id2;
    
    Lecture.findAll({
        where:{
            batchId:id2
        }
    })
    .then((lectures:any)=>{
        res.json(lectures)
    })
})

route.get('/:id1/batches/:id2/lectures/:id3',(req:Request,res:Response)=>{

    var id2=req.params.id2;
    var id3 = req.params.id3;
    Lecture.findOne({
            where:{
                lectureId:id3,
                batchId:id2
            }
        })
        .then((lecture:any)=>{
            res.json(lecture)
        })
})

route.post('/:id1/batches/:id2/lectures',(req:Request,res:Response)=>{

    let batchId=parseInt(req.params.id2);
    let lectureName=req.body.lectureName;
    let teacherId=parseInt(req.body.teacherId);

    Teacher.findOne({
        where:{
            teacherId:teacherId
        },
        attributes: ['subjectId']
    })
    .then((subjectId:number)=>{
        Lecture.create({lectureName:lectureName,subjectId:subjectId,teacherId:teacherId,batchId:batchId})
        .then((createdlecture:any)=>{
            res.send({success:true})
        })
        .catch((err:Error)=>{res.send({success:false})})
    })
    
})

route.put('/:id1/batches/:id2/lectures/:id3',(req:Request,res:Response)=>{
    let lectureName=req.body.lectureName

    Lecture.updateAttributes({
        lectureName:lectureName
    })
    .then((updatedLecture:any)=>{
        res.send({
            success:true
        })
    })
    .catch((err:Error) => res.send({success:false}))
})

route.get('/:id1/batches/:id2/students',(req:Request,res:Response)=>{
    
    var studentBatchList:any[];

    StudentBatchMapper.findAll({
        include: [Student],
        where: {
            batchId: req.params.id2
        },
        
    })
    .then((studentList:any) => {
        res.json(studentList)
    })
    .catch((err:Error) => console.log("Error in getting batches"))
})

route.get('/:id1/batches/:id2/teachers',(req:Request,res:Response)=>{
    
    var teachersList:any[];
    Subject.findAll({
        where:{
            courseId:req.params.id1
        }
    })
    .then((subjects:any)=>{
        Teacher.findAll()
        .then((teachers:any)=>{
            for(let teacher of teachers)
            {
                for(let subject of subjects)
                {
                    if(teacher.subjectId===subject.subjectId)
                    {
                        teachersList.push(teacher)
                    }
                }
            }

            res.json(teachersList)
        })
    })
    
})

route.post('/:id1/batches/:id2/students',(req:Request,res:Response)=>{
    let batchId=req.params.id2
    let studentId=req.body.studentId

    StudentBatchMapper.create({studentId:studentId,batchId:batchId})
    .then((addedItem:any)=>{
        res.send({success:true})
    })
    .catch((err:Error) => res.send({success:false}))
})
export default route