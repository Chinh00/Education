export const RoutePaths = {
    HOME_PATH: '/',
    REGISTER_CONFIG_PATH: '/register-config/:id',
    REGISTER_TIMELINE_PATH: '/timeline-config',

    STUDENT: "/students",
    STUDENT_LIST: "/students/list",

    EDUCATION_DASHBOARD: '/educations',

    EDUCATION_REGISTER: '/educations/register',
    EDUCATION_REGISTER_DETAIL: '/educations/register/:id',
    EDUCATION_REGISTER_CONFIG: '/educations/register-config',
    EDUCATION_REGISTER_COURSE_DETAIL: '/educations/course-class/:id',



    SEMESTER_LIST: '/semesters',
    SEMESTER_CREATE: '/semesters/create',
    SUBJECT_LIST: '/educations/subjects',
    SUBJECT_DETAIL: '/subjects/:id',
    EDUCATION_SUBJECT_TIMELINE_CREATE: '/educations/subjects/timeline/create',

    



    WISH_CONFIG: '/wish-config',

    CLASS_LIST: '/classes',
    LOGIN_PAGE: '/login',
    HISTORY_RECORD: '/history/:aggregateType/:aggregateId',
    
    
    
    SUBJECT_STUDY_SECTION: '/register/subject-study-section',
    REGISTER_SUBJECT: '/register/:semester/subject',
    SUBJECT_COURSE_CLASS_LIST: '/register/:semester/subject/:subject/course-class',
    
    
    
    CREATE_REGISTER_PERIOD: '/register/create-period',
    REGISTER_PERIOD_RESULT: '/register/period/result',
    COURSE_CLASS_CONFIG: '/register/:semester/subject/:subject/course-class/create',
    COURSE_CLASS_SECTION_CONFIG: '/course-class/:subjectCode/section-config',
    COURSE_CLASS_LIST: '/course-class/:subjectCode',
    


    TEACHER_SUBJECT_LIST: "/teacher/subjects",
    TEACHER_TIMELINE: "/teacher/timeline",
    DEPARTMENT_LIST: "/departments",


}