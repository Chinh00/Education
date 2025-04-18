using System.ComponentModel;
using Education.Core.Domain;
using TrainingService.Domain.Enums;

namespace TrainingService.Domain;

[Description("Khối kiến thức")]
public class BlockOfKnowledge : BaseEntity
{
    [Description("Khối kiến thức tự chọn, bắt buộc, cơ sở, ...")]
    public BlockOfKnowledgeTypes BlockOfKnowledgeType { get; set; }
    public ICollection<Subject> Subjects { get; set; }
}