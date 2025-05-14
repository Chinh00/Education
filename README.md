from pathlib import Path

readme_content = """# 🎓 Education Management System

A web-based platform to manage educational operations such as student registrations, class schedules, and more. Built using ASP.NET Core, Google OR-Tools, and modern frontend technologies.

## 🧩 Features

- 📋 Student Registration & Management  
- 🕒 Automated Timetable Scheduling with Google OR-Tools  
- 🏫 Classroom Allocation based on capacity & availability  
- 📚 Support for both theoretical and practical sessions  
- 🧠 Preference-based scheduling for students  
- 👨‍🏫 Admin dashboard to manage subjects, rooms, and timetables

## 🛠️ Tech Stack

- **Backend**: ASP.NET Core (.NET 8)  
- **Scheduling Engine**: Google OR-Tools  
- **Frontend**: React (or Razor Pages – tùy theo bạn dùng gì)  
- **Database**: SQL Server  
- **Containerization**: Docker  

## 🖼️ System Architecture

```mermaid
graph TD;
    UI[Frontend: React/.NET Razor]
    API[Backend API: ASP.NET Core]
    ORTools[Google OR-Tools]
    DB[(SQL Server)]

    UI --> API
    API --> ORTools
    API --> DB
    ORTools --> DB
