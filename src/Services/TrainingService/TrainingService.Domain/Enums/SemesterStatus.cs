using System.ComponentModel.DataAnnotations;

namespace TrainingService.Domain.Enums;

public enum SemesterStatus
{
    DtsData = 0,
    New = 1,
    Register = 2,
    Active = 3,
    Finished = 4,
}