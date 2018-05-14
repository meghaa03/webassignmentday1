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

    Student.findAll()
        .then((students:any)=>{
            res.json(students)
        })
})

route.get('/:id',(req:Request,res:Response)=>{

    var id = req.params.id;
    console.log(id)
    Student.findOne({
            where:{
                studentId:id
            }
        })
        .then((student:any)=>{
            res.json(student)
        })
    
})

route.post('/', (req:Request, res:Response) => {
    Student.create({
        studentName: req.body.studentName
    })
    .then((student:any) => {
        res.json(student)
    })
    .catch((err:Error) => {
        console.log("Error adding new product")
        res.send({success: false})
    })
})

route.put('/:id', (req:Request, res:Response) => {
    Student.findOne({
        studentId: req.params.id
    })
    .then((student:any) => {
        Student.update({
            studentName: req.body.studentName
        },{
            where:{
                studentId: req.params.id
            }
        })
        .then((response:any) => {
            console.log("Update student successful")
            res.json(response)
        })
        .catch((err:Error) => {
            console.log("Error updating student")
            res.send({success: false})
        })
    })
    .catch((err:Error) => {
        res.send({success: false})
    })
})

route.get('/:id/batches',(req:Request,res:Response)=>{

    StudentBatchMapper.findAll({
        include: [Batch],
        where: {
            studentId: req.params.id
        }
    })
    .then((studentBatchMappersResult:any) => {

        let batches = studentBatchMappersResult.map((studentBatchMapperItem:any) => {
            return studentBatchMapperItem.batch
       })

       console.log("batches:", batches)
       res.json(batches)
    })
    .catch((err:Error) => console.log("Error in getting batches"))
        
})

route.post('/:id/batches', (req:Request, res:Response) => {
    Student.findOne({
        where: {
            studentId: req.params.id
        }
    })
    .then((student:any) => {
        Batch.findOne({
            where: {
                batchId: req.body.batchId
            }
        })
        .then((batch:any) => {
            StudentBatchMapper.create({
                studentId: req.params.id,
                batchId: req.body.batchId
            })
            .then((response:any) => {
                res.json(response)
            })
            .catch((err:Error) => {
                console.log("Error adding batch")
                res.send({success: false})
            })
        })
        .catch((err:Error) => {
            console.log("Error getting batch")
            res.send({success: false})
        })
    })
    .catch((err:Error) => {
        console.log("Unable to add new batch. Student id doesn't exist")
        res.send({success: false})
    })
})

export default route