// import { useEffect } from "react";
// import socket from '../socket'

// export default function useStudentRealtime(setStudent){
//     useEffect(() => {
//         const handleUnenrolled = ({ subjectId }) => {
//             setStudent((prev) => ({
//                 ...prev,
//                 subject: prev.subject.filter((s) => s._id !== subjectId)
//             }));
//         }

//         socket.on("student-unenrolled", handleUnenrolled)

//         return () => {
//             socket.off("student-unenrolled", handleUnenrolled)
//         };
//     }, {setStudent})
// }

