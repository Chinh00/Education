using System.ComponentModel;
using System.Reflection;

namespace Education.Core.Utils;

public class AttributeUtils
{
    public static string GetDescriptionFromType(Type type)
    {
        var descriptionAttribute = type.GetCustomAttribute<DescriptionAttribute>();
        return descriptionAttribute?.Description;
    }
}