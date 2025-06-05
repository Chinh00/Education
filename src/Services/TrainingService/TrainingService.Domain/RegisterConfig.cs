using System.ComponentModel;
using Education.Core.Domain;
using MongoDB.Bson;

namespace TrainingService.Domain;

public class RegisterConfig : BaseEntity
{
    public string SemesterCode { get; set; }

    public DateTime WishStartDate { get; set; }
    public DateTime WishEndDate { get; set; }
    
    
    [Description("Thời gian sinh viên thay đổi")]
    public DateTime StudentRegisterStart { get; set; } 
    public DateTime StudentRegisterEnd { get; set; } 
    
    
    public int MinCredit { get; set; }
    public int MaxCredit { get; set; }
    
}