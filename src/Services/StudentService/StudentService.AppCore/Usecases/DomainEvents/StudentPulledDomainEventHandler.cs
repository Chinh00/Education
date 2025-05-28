using Education.Contract.DomainEvents;
using Education.Core.Repository;
using MediatR;
using StudentService.AppCore.Usecases.Specs;
using StudentService.Domain;
using StudentService.Domain.Enums;

namespace StudentService.AppCore.Usecases.DomainEvents;

public class StudentPulledDomainEventHandler(IMongoRepository<Student> mongoRepository)
    : INotificationHandler<StudentPulledDomainEvent>
{
    public async Task Handle(StudentPulledDomainEvent notification, CancellationToken cancellationToken)
    {
        var (aggregateId, student) = notification;
        var spec = new GetStudentByCodeSpec(student?.InformationBySchool?.StudentCode);
        var studentEntity = await mongoRepository.FindOneAsync(spec, cancellationToken) ?? new Student();
        studentEntity.InformationBySchool = new InformationBySchool()
        {
            StudentCode = student?.InformationBySchool?.StudentCode,
            BankCode = student?.InformationBySchool?.BankCode,
            BankName = student?.InformationBySchool?.BankName,
            YearOfHighSchoolGraduation = student?.InformationBySchool?.YearOfHighSchoolGraduation ?? -1,
        };
        studentEntity.PersonalInformation = new PersonalInformation()
        {
            FirstName = student?.PersonalInformation?.FirstName,
            LastName = student?.PersonalInformation?.LastName,
            FullName = student?.PersonalInformation?.FullName,
            BirthDate = student.PersonalInformation.BirthDate,
            Gender = (PersonGender)student.PersonalInformation.Gender,
            PlaceOfBirth = student?.PersonalInformation.PlaceOfBirth,
            ContactAddress = student?.PersonalInformation.ContactAddress,
            IdNumber = student?.PersonalInformation.IdNumber,
            Email = student?.PersonalInformation.Email,
            PhoneNumber = student?.PersonalInformation.PhoneNumber,
            OfficeEmail = student?.PersonalInformation.OfficeEmail,
            CurrentLive = student?.PersonalInformation.CurrentLive,
            Ethnic = student?.PersonalInformation.Ethnic,
        };
        studentEntity.EducationPrograms = student?.EducationPrograms.Select(x => new StudentEducationProgram()
        {
            Code = x.Code,
            Name = x.Name,
            Type = x.Type,
            TrainingTime = x.TrainingTime,
            StudentClassName = x.StudentClassName,
            StudentClassCode = x.StudentClassCode,
            CourseYear = x.CourseYear,
            DepartmentName = x.DepartmentName,
            SpecialityName = x.SpecialityName,
            SpecialityCode = x.SpecialityCode,
            Status = (EducationProgramStatus)x.Status,
        }).ToList();
        studentEntity.Status = StudentStatus.Active;
        await mongoRepository.UpsertOneAsync(spec, studentEntity, cancellationToken);

    }
}