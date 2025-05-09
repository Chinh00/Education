using System.Linq.Expressions;
using Education.Core.Specification;
using TrainingService.Domain;

namespace TrainingService.AppCore.Usecases.Specs;

public class GetRoomByCodeSpec(string code) : SpecificationBase<Room>
{

    public override Expression<Func<Room, bool>> Predicate => room => room.Code == code;
}