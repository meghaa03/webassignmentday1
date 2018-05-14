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

    Subject.findAll()
        .then((subjects:any)=>{
            res.json(subjects)
        })
})

route.get('/:id',(req:Request,res:Response)=>{

    var id = req.params.id;
    console.log(id)
    Subject.findOne({
            where:{
                subjectId:id
            }
        })
        .then((subject:any)=>{
            res.json(subject)
        })
    
    
})

route.post('/', (req:Request, res:Response) => {
    Course.findOne({
        where: {
            courseId: req.body.courseId
        }
    })
    .then((course:any) => {
         Subject.create({
             subjectName: req.body.subjectName,
             courseId: req.body.courseId
         })
         .then((subject:any) => {
             console.log("subject: ", subject)
             res.json(subject)
         })
         .catch((err:Error) => {
             console.log("Error adding new subject")
             res.send({success: false})
         })
    })
    .catch(() => {
        console.log("Error getting course")
        res.send({success: false})
     })
 })
 
route.put('/:id', (req:Request, res:Response) => {
     Course.findOne({
         where: {
             courseId: req.body.courseId
         }
     })
     .then((course:any) => {
         Subject.update({
             subjectName: req.body.subjectName,
             courseId: req.body.courseId
         },{
             where:{
                 subjectId: req.params.id
             }
         })
         .then((response:any) => {
             console.log("Update subject successful")
             res.json(response)
         })
         .catch((err:Error) => {
             console.log("Error updating subject")
             res.send({success: false})
         })
     })
     .catch((err:Error) => {
         console.log("Error getting course")
         res.send({success: false})
     })
 })
 
route.get('/:id/teachers',(req:Request,res:Response)=>{

    var id = req.params.id;
    console.log(id)
    Teacher.findAll({
        where:{
            subjectId:id
        }
    })
        .then((teachers:any)=>{
            res.json(teachers)
    })
    
    
})


route.post('/:id/teachers', (req:Request, res:Response) => {
    Subject.findOne({
        subjectId: req.params.id
    })
    .then((subject:any) => {
        Teacher.create({
            teacherName: req.body.teacherName,
            subjectId: req.params.id
        })
        .then((teacher:any) => {
            res.json(teacher)
        })
        .catch((err:Error) => {
            console.log("Error adding teacher")
            res.send({success: false})
        })
    })
    .catch(() => {
        console.log("Error getting subject")
        res.send({success: false})
    })
})

export default route