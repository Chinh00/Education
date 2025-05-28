using Education.Contract.DomainEvents;
using Education.Core.Repository;
using MediatR;
using MongoDB.Bson;
using StudentService.Domain;

namespace StudentService.AppCore.Usecases.DomainEvents;

public class StudentSemesterPulledDomainEventHandler(IMongoRepository<StudentSemester> repository)
    : INotificationHandler<StudentSemesterPulledDomainEvent>
{
    public async Task Handle(StudentSemesterPulledDomainEvent notification, CancellationToken cancellationToken)
    {
        await repository.AddAsync(new StudentSemester()
        {
            StudentCode = notification.StudentCode,
            SemesterCode = notification.SemesterCode,
            SemesterName = notification.SemesterName,
            EducationStartDate = notification.EducationStartDate,
            EducationEndDate = notification.EducationEndDate,
            SubjectResults = notification.SubjectResult.Select(c => new SubjectResult()
            {
                SubjectName = c.SubjectName,
                Coeffiecient = c.Coeffiecient,
                SubjectNameEng = c.SubjectNameEng,
                SubjectCode = c.SubjectCode,
                NumberOfCredits = c.NumberOfCredits,
                Mark = c.Mark,
                OriginalMark = c.OriginalMark,
                ExamRound = c.ExamRound,
                Description = c.Description,
                SubjectMarkType = (SubjectMarkType)c.SubjectMarkType,
                MarkTypeChar = c.MarkTypeChar,
                Result = c.Result,
            }).ToList(),
            CourseSubjects = notification.CourseSubject.Select(c => new CourseSubject()
            {
                SubjectCode = c.SubjectCode,
                SubjectName = c.SubjectName,
                CourseClassName = c.CourseClassName,
                CourseClassCode = c.CourseClassCode,
                TeacherCode = c.TeacherCode,
                TeacherName = c.TeacherName,
            }).ToList(),
            Version = notification.Version,
            Id = ObjectId.Parse(notification.AggregateId)
        }, cancellationToken);
    }
}