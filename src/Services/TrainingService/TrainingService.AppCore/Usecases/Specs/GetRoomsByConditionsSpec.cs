using System.Linq.Expressions;
using Education.Core.Specification;
using TrainingService.Domain;

namespace TrainingService.AppCore.Usecases.Specs;

public class GetRoomsByConditionsSpec(string keySearch, List<string> conditions) : SpecificationBase<Room>
{
    public override Expression<Func<Room, bool>> Predicate => room => 
        conditions.All(condition => 
            room.SupportedConditions.Any(rCondition => rCondition.Equals(condition, StringComparison.OrdinalIgnoreCase))) && room.Code.Contains(keySearch ?? "");
}