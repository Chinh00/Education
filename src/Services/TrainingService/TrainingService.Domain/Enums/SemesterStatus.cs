using System.ComponentModel.DataAnnotations;

namespace TrainingService.Domain.Enums;

public enum SemesterStatus
{
    New = 0,
    Register = 1,
    Active = 2,
    Finished = 3,
}