// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDfO1ODSCZdlnrAiMMDniyGktlzwzDauVg",
  authDomain: "beacon-51711.firebaseapp.com",
  projectId: "beacon-51711",
  storageBucket: "beacon-51711.firebasestorage.app",
  messagingSenderId: "1060082393824",
  appId: "1:1060082393824:web:7a6b260100c157456ba685"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Optional: populate test data once
export async function setupTestData() {
  // Student
  await setDoc(doc(db, "students", "student1"), {
    name: "Test User",
    roll: "T001",
    branch: "ECE",
    cpi: 8.0,
    email: "test@example.com",
    skills: ["Python", "JS"],
    resumeLink: "https://example.com/resume.pdf"
  });

  // Company
  await setDoc(doc(db, "companies", "comp1"), {
    name: "TestCorp",
    role: "SDE Intern",
    salary: "8 LPA",
    rounds: "Written -> Technical -> HR",
    eligiblebranches: ["ECE","CSE"],
    mincpi: 7.0,
    active: true
  });

  // Application
  await setDoc(doc(db, "applications", "student1_comp1"), {
    studentId: "student1",
    companyId: "comp1",
    status: "applied",
    appliedAt: new Date()
  });

  // Queue
  await setDoc(doc(collection(db, "queues", "comp1", "students"), "student1"), {
    studentId: "student1",
    position: 2,
    status: "waiting",
    joinedAt: new Date()
  });

  console.log("Test data ready!");
}
