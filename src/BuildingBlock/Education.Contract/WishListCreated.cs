using Education.Core.Domain;

namespace Education.Contract;

public class WishListCreated : IMessage
{
    public Guid CorrelationId { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public string WishRegisterName { get; set; }
    public string WishRegisterCode { get; set; }
    public string SemesterCode { get; set; }
}