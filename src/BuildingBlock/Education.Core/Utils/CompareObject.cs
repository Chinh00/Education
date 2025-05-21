using KellermanSoftware.CompareNetObjects;

namespace Education.Core.Utils;
public class ChangeDetail
{
    public string PropertyName { get; set; } = default!;
    public object OldValue { get; set; }
    public object NewValue { get; set; }
}
public class CompareObject
{
    public static List<ChangeDetail> GetDifferencesWithCompareNetObjects<T>(T oldObj, T newObj)
    {
        var compareLogic = new CompareLogic();
        var comparisonResult = compareLogic.Compare(oldObj, newObj);

        var changes = new List<ChangeDetail>();

        if (!comparisonResult.AreEqual)
        {
            foreach (var diff in comparisonResult.Differences)
            {
                changes.Add(new ChangeDetail
                {
                    PropertyName = diff.PropertyName,
                    OldValue = diff.Object1Value,
                    NewValue = diff.Object2Value
                });
            }
        }

        return changes;
    }
}