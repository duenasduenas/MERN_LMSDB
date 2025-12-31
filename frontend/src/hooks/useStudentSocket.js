// import { useEffect } from "react";
// import socket from "../socket"; // import the frontend socket instance

// export default function useStudentSocket(setStudent) {
//   useEffect(() => {
//     if (!setStudent) return;

//     socket.on("student-unenrolled", ({ subjectId }) => {
//       console.log("Realtime unenroll:", subjectId);

//       setStudent((prev) => ({
//         ...prev,
//         subject: prev.subject.filter((s) => s._id !== subjectId),
//       }));
//     });

//     return () => {
//       socket.off("student-unenrolled");
//     };
//   }, [setStudent]);
// }
