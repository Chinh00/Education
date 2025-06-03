using Education.Core.Domain;
using MediatR;
using RegisterStudy.AppCore.Usecases.Common;
using RegisterStudy.Domain;
using RegisterStudy.Domain.Repository;

namespace RegisterStudy.AppCore.Usecases.Queries;

public record GetCourseClassBySubjectCodeQuery(string SubjectCode) : IQuery<ListResultModel<CourseClass>>
{
    internal class Handler(
        IRegisterRepository<RegisterCourseClass> registerRepository,
        IRegisterRepository<CourseClass> courseClassRepository)
        : IRequestHandler<GetCourseClassBySubjectCodeQuery, ResultModel<ListResultModel<CourseClass>>>
    {
        public async Task<ResultModel<ListResultModel<CourseClass>>> Handle(GetCourseClassBySubjectCodeQuery request, CancellationToken cancellationToken)
        {
            var register = await registerRepository.GetAsync(nameof(RegisterCourseClass));
            var keys = await courseClassRepository.GetKeysAsync(RedisKey.SubjectCourseClass(register.SemesterCode,
                request.SubjectCode, "*"));
            var list = new List<CourseClass>();
            foreach (var key in keys)
            {
                list.Add(await courseClassRepository.GetAsync(key));
            }
            return ResultModel<ListResultModel<CourseClass>>.Create(
                ListResultModel<CourseClass>.Create(list, list.Count, 1, list.Count));

        }
    }
    
}