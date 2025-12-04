import Teacher from '../models/Teacher.js'
import Subject from '../models/Subject.js'
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Student from '../models/Student.js';

export async function createTeacherWithSubject(req,res){
    try{
      const body = req.body;
        const {name,email,password,subject,role, code} = body;

        if (!name || !email || !password) {
          return res.status(400).json({ message: "name, email and password are required" });
        }

        if (!subject || !code) {
          return res.status(400).json({ message: "subject and code are required" });
        }

        const hashedPassword = await bcrypt.hash(password, 10)


        // Step 1: Create teacher
        const newTeacher = new Teacher({name,email,code,password:hashedPassword,role})
        const saveTeacher = await newTeacher.save()


        // Step 2: Create subject and link it to teacher
        const newSubject = new Subject({subject, code, 
            teacher: saveTeacher._id,
            subject
        })
        const saveSubject = await newSubject.save() 

        // Step 3: Push subject reference into teacher’s subject array
        saveTeacher.subject.push(saveSubject._id);
        await saveTeacher.save();
        

        // Step 4: Respond with both
        res.status(200).json({
            message: "Teacher and Subject Sucessfully Created",
            teacher: saveTeacher,
            subject: saveSubject
        })
    } catch (error){
        console.error("Error in creating Student and Subject:", error);
        res.status(500).json({message: "Internal Server Error"})
    }
}

export async function createSubjectByTeacherId(req, res) {
    try {
    // Save Teacher 
      const teacherId = req.params.teacherId;
      const teacher = await Teacher.findById(teacherId);
      if(!teacher){
        return res.status(404).json({message:'Teacher not Found'})
      }

    //   Save subject
      const { subject,code } = req.body;
      const newSubject = new Subject({
        subject,
        code,
        teacher: teacherId
      });
  
      const savedSubject = await newSubject.save();
  
      // Optional: push subject to teacher’s subject array
      await Teacher.findByIdAndUpdate(teacherId, {
        $push: { subject: savedSubject._id }
      });
  
      res.status(201).json({
        message: "Subject successfully created and linked to teacher",
        subject: savedSubject
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  export async function loginTeacher(req, res) {
    try {
        const { email, password } = req.body;

        const teacher = await Teacher.findOne({ email });
        if (!teacher) return res.status(404).json({ message: "Teacher not found" });

        const isMatch = await bcrypt.compare(password, teacher.password);
        if (!isMatch) return res.status(400).json({ message: "Wrong credentials" });

        const token = jwt.sign(
            { id: teacher._id, role: "teacher" },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.status(200).json({
            token,
            user: {
                id: teacher._id,
                name: teacher.name,
                role: "teacher"
            }
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function getAllSubjectTeacher(req,res){
    try{
        const teacher = await Teacher.find()
        .populate('student')
        .sort({createdAt: -1});

        res.status(200).json({teacher})
    } catch (error){
        res.status(500).json({message: error.message})
    }
}


export async function getSubjectTeacherById(req,res){
  try{
    const teacher = await Teacher.findById(req.user.id).populate("student subject");

    if(!teacher){
      return res.status(400).json({message: "Teacher not Found"})
    }

    res.status(200).json({message:"Teacher Found",
      teacher
    })
    
  } catch (error) {
    res.status(500).json({message: error.message})
  }
}


export async function removeStudent(req, res) {
  try {
    const teacherId = req.user.id.toString();
    const studentId = req.body.id;

    const teacher = await Teacher.findById(teacherId);
    const student = await Student.findById(studentId);

    if (!teacher || !student) {
      return res.status(400).json({
        message: "Teacher or Student not found",
        teacher,
        student
      });
    }

    // Fix: handle populated OR unpopulated student list
    teacher.student = teacher.student.filter((stud) => {
      const id = stud?._id?.toString() || stud.toString();
      return id !== studentId;
    });

    // Remove teacher reference from student
    if (Array.isArray(student.teacher)) {
      student.teacher = student.teacher.filter(
        (t) => t.toString() !== teacherId
      );
    } else if (student.teacher?.toString() === teacherId) {
      student.teacher = null;
    }

    await teacher.save();
    await student.save();

    return res.json({ message: "Student Removed", teacher, student });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
