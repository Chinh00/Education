using System.ComponentModel;
using Education.Core.Domain;
using MongoDB.Bson;

namespace TrainingService.Domain;
[Description("Lớp quản lý")]
public class ClassManager : BaseEntity
{
    public string ClassCode { get; set; }
    public string ClassName { get; set; }
    [Description("Chương trình đào tạo")]
    public string EducationCode { get; set; }

    public ICollection<SemesterClass> SemesterClasses { get; set; } = [];
}