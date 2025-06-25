```mermaid
erDiagram
  CourseClass {
    ObjectId _id
    String CourseClassCode
    String CourseClassName
    ISODate CreatedAt
    Int32 Index
    Int32 NumberStudents
    String ParentCourseClassCode
    String SemesterCode
    Array SessionLengths
    Int32 Stage
    Int32 Status
    list StudentIds
    String SubjectCode
    String TeacherCode
    Int32 TotalSession
    String UpdatedAt
    Int32 WeekEnd
    Int32 WeekStart
    Int32 CourseClassType
    Int32 NumberStudentsExpected
    String TeacherName
  }

  CourseClassCondition {
    ObjectId _id
    String ConditionCode
    ISODate CreatedAt
    ISODate UpdatedAt
    String ConditionName
  }

  Department {
    ObjectId _id
    ISODate CreatedAt
    String DepartmentCode
    String DepartmentName
    String Path
    ISODate UpdatedAt
  }

  EducationProgram {
    ObjectId _id
    String Code
    String CourseCode
    ISODate CreatedAt
    Array EducationSubjects
    String Name
    String SpecialityCode
    Double TrainingTime
    ISODate UpdatedAt
    Int32 Type
  }

  Notification {
    ObjectId _id
    String Content
    ISODate CreatedAt
    String Recipients
    String Title
    ISODate UpdatedAt
    Array Roles
  }

  Register {
    UUID _id
    String CurrentState
    Int32 MaxCredit
    Int32 NumberStudent
    Int32 NumberSubject
    String SemesterCode
    ISODate StudentRegisterEnd
    Int32 Version
    ISODate WishEndDate
    Int32 MinCredit
    Int32 NumberWish
    ISODate StudentRegisterStart
    ISODate WishStartDate
  }

  Room {
    ObjectId _id
    String BuildingCode
    ISODate CreatedAt
    String Name
    Array SupportedConditions
    ISODate UpdatedAt
    Int32 Capacity
    String Code
  }

  Semester {
    ObjectId _id
    ISODate CreatedAt
    String EndDate
    String SemesterCode
    String StartDate
    ISODate UpdatedAt
    String ParentSemesterCode
    String SemesterName
    Int32 SemesterStatus
  }

  SlotTimeline {
    ObjectId _id
    String BuildingCode
    String CourseClassCode
    ISODate CreatedAt
    Int32 DayOfWeek
    Int32 EndWeek
    String RoomCode
    Array Slots
    Int32 StartWeek
    ISODate UpdatedAt
  }

  Staff {
    ObjectId _id
    String Code
    ISODate CreatedAt
    String DepartmentCode
    String FullName
    ISODate UpdatedAt
  }

  Student {
    ObjectId _id
    ISODate CreatedAt
    Array EducationPrograms
    Object InformationBySchool
    Object PersonalInformation
    Int32 Status
    String UpdatedAt
  }

  StudentSemester {
    ObjectId _id
    Array CourseSubjects
    ISODate CreatedAt
    String SemesterCode
    String StudentCode
    list SubjectResults
    String UpdatedAt
  }

  Subject {
    ObjectId _id
    ISODate CreatedAt
    String DepartmentCode
    Boolean IsCalculateMark
    Int32 NumberOfCredits
    Int32 Status
    String SubjectCode
    String UpdatedAt
    String SubjectDescription
    String SubjectName
    String SubjectNameEng
  }

  SubjectScheduleConfig {
    ObjectId _id
    ISODate CreatedAt
    list LabRequiredConditions
    String SemesterCode
    Int32 SessionPriority
    Int32 Stage
    String SubjectCode
    Array TheorySessions
    Int32 TotalTheoryCourseClass
    ISODate UpdatedAt
    Int32 WeekLabEnd
    Array LectureRequiredConditions
    Array PracticeSessions
    Int32 TheoryTotalPeriod
    Int32 WeekLabStart
    Int32 PracticeTotalPeriod
    Int32 WeekLectureEnd
    Int32 WeekLectureStart
  }

  SubjectRegister {
    ObjectId _id
    ISODate CreatedAt
    String SemesterCode
    Array StudentCodes
    String SubjectCode
    ISODate UpdatedAt
  }

  %% Relationships

  CourseClass ||--o{ Semester : "SemesterCode"
  CourseClass ||--o{ Subject : "SubjectCode"
  CourseClass ||--o{ Staff : "TeacherCode"
  CourseClass }o--|| CourseClass : "ParentCourseClassCode"
  Register ||--o{ Semester : "SemesterCode"
  Semester }o--|| Semester : "ParentSemesterCode"
  SlotTimeline ||--o{ CourseClass : "CourseClassCode"
  SlotTimeline ||--o{ Room : "RoomCode"
  Staff ||--o{ Department : "DepartmentCode"
  Student }o--o{ EducationProgram : "EducationPrograms.Code"
  Student }o--o{ Department : "EducationPrograms.DepartmentCode"
  StudentSemester ||--o{ Semester : "SemesterCode"
  StudentSemester ||--o{ Student : "StudentCode=InformationBySchool.StudentCode"
  StudentSemester }o--o{ Subject : "SubjectResults.SubjectCode"
  Subject ||--o{ Department : "DepartmentCode"
  SubjectScheduleConfig ||--o{ Semester : "SemesterCode"
  SubjectScheduleConfig ||--o{ Subject : "SubjectCode"
  SubjectRegister ||--o{ Subject : "SubjectCode"
  ```

**Ghi chú:**
- Các quan hệ 1-n (||--o{) và n-1 (}o--||) thể hiện theo chuẩn của Mermaid ER Diagram.
- Một số trường lồng nhau (ví dụ Student.EducationPrograms) biểu diễn bằng các nối phụ (Mermaid không hỗ trợ trực tiếp lồng mảng phức tạp).
- Các mối quan hệ được đặt tên theo trường khóa ngoại, dựa trên các ràng buộc tham chiếu bạn đã liệt kê.
- Bạn có thể copy đoạn mã Mermaid này vào Mermaid Live Editor (https://mermaid.live) hoặc các công cụ hỗ trợ Mermaid để xem sơ đồ trực quan.

Nếu cần bổ sung, làm rõ, hoặc xuất ra sơ đồ dạng hình ảnh, hãy phản hồi!