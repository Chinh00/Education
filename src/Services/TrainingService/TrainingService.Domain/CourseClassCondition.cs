using Education.Core.Domain;

namespace TrainingService.Domain;

public class CourseClassCondition : BaseEntity
{
    public string ConditionCode { get; set; }
    public string ConditionName { get; set; }
}