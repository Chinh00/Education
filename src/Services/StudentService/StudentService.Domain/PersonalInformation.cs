using System.ComponentModel;

namespace StudentService.Domain;

public class PersonalInformation
{
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string FullName { get; set; }    
    public DateTime BirthDate { get; set; }    
    public PersonGender Gender { get; set; }
    public string PlaceOfBirth { get; set; }
    [Description("Địa chỉ liên hệ")]
    public string ContactAddress { get; set; }
    public string IdNumber { get; set; }
    public string Note { get; set; }
    public string PhoneNumber { get; set; }
    public string Email { get; set; }
    public string OfficeEmail { get; set; }
    public string CurrentLive { get; set; }
    
    [Description("Dân tộc")]
    public string Ethnic { get; set; }

}