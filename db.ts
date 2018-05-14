const Sequelize=require('sequelize')

export const db= new Sequelize('nodeday1db','megha1','password',
{
    host:'MEGHA3147194',
    dialect:'sqlite',
    // pool: {
    //     max: 5,
    //     min: 0,
    // },
    storage: './nodeday1db.db'
})

export const Course=db.define('course',{
    courseId: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    courseName:{
        type:Sequelize.STRING,
        allowNull:false
    },
})

export const Batch=db.define('batch',{
    batchId: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    batchName: {
        type: Sequelize.STRING(30),
        allowNull: false,
    },
    courseId:{
        type:Sequelize.INTEGER,
        allowNull:false
    },
})

export const Student = db.define('student', {
    studentId: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    studentName: {
        type: Sequelize.STRING(30),
        allowNull: false,
    },
})

export const Subject=db.define('subject',{
    subjectId: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    subjectName:{
        type:Sequelize.STRING,
        allowNull:false
    },
    courseId:{
        type:Sequelize.INTEGER,
        allowNull:false
    }
})

export const Teacher = db.define('teacher',{
    teacherId: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    teacherName:{
        type:Sequelize.STRING,
        allowNull:false
    },
    subjectId:{
        type:Sequelize.INTEGER,
        allowNull:false
    },
})

export const Lecture=db.define('lecture',{
    lectureId: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    lectureName:{
        type:Sequelize.STRING,
        allowNull:false
    },
    subjectId:{
        type:Sequelize.INTEGER,
        allowNull:false
    },
    teacherId:{
        type:Sequelize.INTEGER,
        allowNull:false
    },
    batchId:{
        type:Sequelize.INTEGER,
        allowNull:false
    },
})

export const StudentBatchMapper = db.define('studentBatchMapper', {
    studentBatchMapperId: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    }
})


Course.hasMany(Batch, {foreignKey: 'courseId', sourceKey: 'courseId'});
Batch.belongsTo(Course, {foreignKey: 'courseId', targetKey: 'courseId'}); 

Course.hasMany(Subject, {foreignKey: 'courseId', sourceKey: 'courseId'});
Subject.belongsTo(Course, {foreignKey: 'courseId', targetKey: 'courseId'}); 

Subject.hasMany(Teacher, {foreignKey: 'subjectId', sourceKey: 'subjectId'});
Teacher.belongsTo(Subject, {foreignKey: 'subjectId', targetKey: 'subjectId'}); 

Subject.hasMany(Lecture, {foreignKey: 'subjectId', sourceKey: 'subjectId'});
Lecture.belongsTo(Subject, {foreignKey: 'subjectId', targetKey: 'subjectId'}); 

Teacher.hasMany(Lecture, {foreignKey: 'teacherId', sourceKey: 'teacherId'});
Lecture.belongsTo(Teacher, {foreignKey: 'teacherId', targetKey: 'teacherId'}); 

Batch.hasMany(Lecture, {foreignKey: 'batchId', sourceKey: 'batchId'});
Lecture.belongsTo(Batch, {foreignKey: 'batchId', targetKey: 'batchId'}); 

Batch.hasMany(StudentBatchMapper, {foreignKey: 'batchId', sourceKey: 'batchId'});
StudentBatchMapper.belongsTo(Batch, {foreignKey: 'batchId', targetKey: 'batchId'});

Student.hasMany(StudentBatchMapper, {foreignKey: 'studentId', sourceKey: 'studentId'});
StudentBatchMapper.belongsTo(Student, {foreignKey: 'studentId', targetKey: 'studentId'});

async function task() {
    try
    {
        await db.authenticate()
        await db.sync()       
        
    }
    catch(err)
    {
        console.log(err)
    }
}

task();
