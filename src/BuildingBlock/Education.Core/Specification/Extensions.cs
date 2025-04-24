using System.Linq.Expressions;
using System.Reflection;
using Education.Core.Domain;
using MongoDB.Bson;

namespace Education.Core.Specification;

public static class Extensions
{


    // e: TEntity => new { A = e.A, C = e.C}
    public static Expression<Func<TEntity, TEntity>> MakeSelectExpression<TEntity>(List<string> includes,
        List<Expression<Func<TEntity, object>>> selectors)
    {
        var type = typeof(TEntity);
        var parameter = Expression.Parameter(type, "x");
        if (selectors is not null)
        {
            foreach (var body in selectors.Select(expression => expression.Body))
            {
                switch (body)
                {
                    case MemberExpression expressionMember:
                        includes.Add(expressionMember.Member.Name);
                        break;
                    case UnaryExpression { Operand: MemberExpression memberExpression }:
                        includes.Add(memberExpression.Member.Name);
                        break;
                }
            }
        }
        var memberExpressions = includes.Distinct().Select(c =>
        {
            var propertyInfo = type.GetRuntimeProperty(c);
            if (propertyInfo is null) throw new SpecificationException($"Missing {c} property of {type}.");
            var memberExpression = Expression.Property(parameter, propertyInfo);
            return Expression.Bind(propertyInfo, memberExpression);
        }).ToList();
        var memberInitExpression = Expression.MemberInit(Expression.New(typeof(TEntity)), memberExpressions);
        return Expression.Lambda<Func<TEntity, TEntity>>(memberInitExpression, parameter);
    }
    
    
    
    
    public static void ApplySorting<TEntity>(this IRootSpecification<TEntity> specification, string sortBy, string methodAsc, string methodDesc)
    {
        var specType = specification.GetType().BaseType;     

        var endsWith = sortBy.EndsWith("Desc");

        const string descendingSuffix = "Desc";
        var propertyName = endsWith ? sortBy[..^4] : sortBy; 
        propertyName = char.ToUpperInvariant(propertyName[0]) + propertyName[1..];
        
        var property = specType?.GetGenericArguments()[0].GetRuntimeProperty(propertyName) ?? throw new NullReferenceException();
        
        var param = Expression.Parameter(typeof(TEntity), "x");
        
        
        var body = Expression.Convert(Expression.Property(param, property), typeof(object));
        
        var expression = Expression.Lambda<Func<TEntity, object>>(body, param);

        var sortAscMethod = specType?.GetMethod(methodAsc, BindingFlags.Instance | BindingFlags.Public | BindingFlags.NonPublic);
        var sortDescMethod = specType?.GetMethod(methodDesc, BindingFlags.Instance | BindingFlags.Public | BindingFlags.NonPublic);

        if (endsWith)
        {
            sortDescMethod?.Invoke(specification, [expression]);
        }
        else
        {
            sortAscMethod?.Invoke(specification, [expression]);
        }
    }
    
    public static Expression<Func<TEntity, bool>> MakeFilterExpression<TEntity>(FilterModel filterModel)
    {
        const string parameterName = "x";
        var parameter = Expression.Parameter(typeof(TEntity), parameterName);
        var left = filterModel.Field.Split('.').Aggregate((Expression)parameter, Expression.Property);
        var body = MakeComparison(left, filterModel.Operator, filterModel.Value);
        return Expression.Lambda<Func<TEntity, bool>>(body, parameter);
    }

    private static Expression MakeComparison(Expression left, string comparison, string value)
    {
        return comparison switch
        {
            "==" => MakeBinary(ExpressionType.Equal, left, value),
            "!=" => MakeBinary(ExpressionType.NotEqual, left, value),
            ">" => MakeBinary(ExpressionType.GreaterThan, left, value),
            ">=" => MakeBinary(ExpressionType.GreaterThanOrEqual, left, value),
            "<" => MakeBinary(ExpressionType.LessThan, left, value),
            "<=" => MakeBinary(ExpressionType.LessThanOrEqual, left, value),
            "Contains" or "StartsWith" or "EndsWith" => Expression.Call(MakeString(left), comparison,
                Type.EmptyTypes, Expression.Constant(value, typeof(string))),
            "In" => MakeList(left, value.Split(',')),
            "ArrayContains" => MakeArrayContains(left, value.Split(',')),
            _ => throw new NotSupportedException($"Invalid comparison operator '{comparison}'."),
        };
    }
    private static Expression MakeArrayContains(Expression left, IEnumerable<string> filter)
    {
        // filter is a constant list of strings
        var constantList = Expression.Constant(filter.ToList(), typeof(List<string>));
    
        // parameter inside .Any(tag => filter.Contains(tag))
        var param = Expression.Parameter(typeof(string), "tag");

        // filter.Contains(tag)
        var containsCall = Expression.Call(constantList, typeof(List<string>).GetMethod("Contains", new[] { typeof(string) }), param);

        // tag => filter.Contains(tag)
        var lambda = Expression.Lambda(containsCall, param);

        // x.Tags.Any(tag => filter.Contains(tag))
        return Expression.Call(typeof(Enumerable), "Any", new[] { typeof(string) }, left, lambda);
    }

    private static Expression MakeList(Expression left, IEnumerable<string> codes)
    {
        var stringValues = codes.ToList();
        var type = typeof(List<string>);
        var methodInfo = type.GetMethod("Contains", new[] { typeof(string) });
        var list = Expression.Constant(stringValues, typeof(List<string>));
        var body = Expression.Call(list, methodInfo, left);
        return body;
    }

    private static Expression MakeString(Expression source)
    {
        return source.Type == typeof(string) ? source : Expression.Call(source, "ToString", Type.EmptyTypes);
    }
    private static Expression MakeBinary(ExpressionType type, Expression left, string value)
    {
        object typedValue = value;
        if (left.Type != typeof(string))
        {
            if (string.IsNullOrEmpty(value))
            {
                typedValue = null;
                if (Nullable.GetUnderlyingType(left.Type) == null)
                    left = Expression.Convert(left, typeof(Nullable<>).MakeGenericType(left.Type));
            }
            else
            {
                var valueType = Nullable.GetUnderlyingType(left.Type) ?? left.Type;
                typedValue = valueType.IsEnum ? Enum.Parse(valueType, value) :
                    valueType == typeof(Guid) ? Guid.Parse(value) :
                    valueType == typeof(ObjectId) ? ObjectId.Parse(value) :
                    Convert.ChangeType(value, valueType);
            }
        }

        var right = Expression.Constant(typedValue, left.Type);
        return Expression.MakeBinary(type, left, right);
    }

}