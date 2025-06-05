using Education.Core.Domain;
using MongoDB.Bson;

namespace RegisterStudy.Domain;

public class StudentWishRegister : BaseEntity
{
    public string StudentCode { get; set; }
    public string EducationCode { get; set; }
    public DateTime RegisterDate { get; set; }
    public ICollection<string> SubjectCodes { get; set; } = [];
    

}