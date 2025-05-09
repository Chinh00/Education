using System.Linq.Expressions;
using Education.Core.Specification;
using TrainingService.Domain;

namespace TrainingService.AppCore.Usecases.Specs;

public class GetBuildingByCodeSpec(string code) : SpecificationBase<Building>
{
    public override Expression<Func<Building, bool>> Predicate => building => building.BuildingCode == code;
}