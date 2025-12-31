
import Student from '../models/Student.js'
import Subject from '../models/Subject.js';
import Teacher from '../models/Teacher.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function createStudent(req,res) {
   try{
    const {name,email,password,role} = req.body
    const hashedPassword = await bcrypt.hash(password, 10)

    const newStudent = new Student({name,email,password:hashedPassword, role});
    const savedStudent = await newStudent.save();
    res.status(200).json(savedStudent)

   } catch (error) {
    console.log("Error in making Student")
    res.status(400).json({message: "Internal Server Error"})
   }
}


// stundent login
export async function loginStudent(req,res){
    try{
        const {email, password} = req.body
        const student = await Student.findOne({email})

        if(!student){
            res.status(404).json({message: `Student not found` })
        }

        const isMatch = await bcrypt.compare(password, student.password);
        
        if(!isMatch){
            res.status(404).json({message: "Wrong Credentials"})
        }
        
        const token = jwt.sign(
            {id: student._id, role: student.role}, 
            process.env.JWT_SECRET,
            {expiresIn: "1d"}
        )
        
        res.status(200).json({token})

    } catch (error){
        return res.status(500).json({message: error.message})
        
    }
}

export async function getStudentById(req,res){
    try{
        const student = await Student.findById(req.user.id)
            .populate({
                path: "subject",
                select: "subject code teacher"   // <-- ADD code here
            });


        if(!student) {
            return res.status(404).json({message: "Student not Found"})
        }

        res.status(200).json({message:"Student Found",
            student
        })
    } catch (error){
        res.status(500).json({message: error.message})
    }
}

export async function getAllStudents(req,res){
    try{
        const student = await Student.find().sort({createAt: -1})
        res.json(student)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}


export async function enrollStudent(req, res) {
    const studentId = req.user.id;
    const { code } = req.body;
  
    try {
      const student = await Student.findById(studentId).populate('subject');
      const subject = await Subject.findOne({ code });

      if(!subject.isActive){
        return res.status(403).json({
            message: "Enrollment is closed for this subject"
        })
      }
  
      if (!student || !subject) 
        return res.status(404).json({ message: "Student or Subject not found" });

      const teacher = await Teacher.findById(subject.teacher)

      if(!teacher) return res.status(404).json({ message: "Teacher not Found" })
  
      // Prevent double enrollment
      if (subject.student.some(id => id.toString() === studentId))
        return res.status(400).json({ message: "Already enrolled" });
  
      // Update both
      subject.student.push(studentId);
      student.subject.push(subject._id);

      if(!teacher.student.includes(studentId)){
        teacher.student.push(studentId)
      }
  
      await subject.save();
      await student.save();
      await teacher.save();
  
      res.json({ message: "Enrolled successfully", student, subject });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }



