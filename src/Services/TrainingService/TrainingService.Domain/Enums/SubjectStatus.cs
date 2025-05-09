using System.ComponentModel;

namespace TrainingService.Domain.Enums;

public enum SubjectStatus
{
    [Description("Đang sử dụng")]
    Current,
    [Description("Không sử dụng")]
    NotInUse,
    [Description("Môn tương đương")]
    Equivalent,
}