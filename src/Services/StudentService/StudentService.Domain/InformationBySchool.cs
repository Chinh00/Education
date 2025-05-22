using System.ComponentModel;
using MongoDB.Bson;

namespace StudentService.Domain;

public class InformationBySchool
{
    public string StudentCode { get; set; }
    public string BankCode { get; set; }
    public string BankName { get; set; }
    public int YearOfHighSchoolGraduation { get; set; }
}