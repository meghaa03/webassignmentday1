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

    Teacher.findAll()
        .then((teachers:any)=>{
            res.json(teachers)
        })
})

route.get('/:id',(req:Request,res:Response)=>{

    var id = req.params.id;
    console.log(id)
    Teacher.findOne({
            where:{
                teacherId:id
            }
        })
        .then((teacher:any)=>{
            res.json(teacher)
        })
    
    
})

route.post('/', (req:Request, res:Response) => {
    Subject.findOne({
        where: {
            subjectId: req.body.subjectId
        }
    })
    .then((subject:any) => {
        Teacher.create({
            teacherName: req.body.teacherName,
            subjectId: req.body.subjectId
        })
        .then((teacher:any) => {
            console.log("teacher: ")
            console.log(teacher)
            res.json(teacher)
        })
        .catch((err:Error) => {
            console.log("Error adding new teacher")
            res.send({success: false})
        })
    })
    .catch((err:Error) => {
        console.log("Error getting subject")
        res.send({success: false})
    })
})

route.put('/:id', (req:Request, res:Response) => {
    Subject.findOne({
        where: {
            subjectId: req.params.id
        }
    })
    .then((subject:any) => {
        Teacher.update({
            teacherName: req.body.teacherName,
            subjectId: req.body.subjectId
        },{
            where:{
                teacherId: req.params.id
            }
        })
        .then((response:any) => {
            console.log("Update teacher successful")
            res.json(response)
        })
        .catch((err:Error) => {
            console.log("Error updating teacher")
            res.send({success: false})
        })
    })
    .catch(() => {
        console.log("Error getting subject")
        res.send({success: false})
    })
})

route.get('/:id/batches',(req:Request,res:Response)=>{

    Teacher.findOne({
        where: {
            subjectId: req.params.id
        },
        attributes: ['subjectId']
    })
    .then((subId:number) => {
        Subject.findOne({
            where: {
                subjectId: subId
            },
            attributes: ['courseId']
        })
        .then((courseId:number) => {
            Batch.findAll({
                where: {
                    courseId: courseId
                }
            })
            .then((batches:any) => {
                res.json(batches)
            })
            .catch((err:Error) => console.log("Error in getting batches"))
        })
        .catch((err:Error) => console.log("Error in getting course"))
    })
    .catch((err:Error) => console.log("Error in getting subject"))
    
})

export default route