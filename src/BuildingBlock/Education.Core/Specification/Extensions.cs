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
            _ => throw new NotSupportedException($"Invalid comparison operator '{comparison}'."),
        };
    }
    private static Expression MakeList(Expression left, IEnumerable<string> codes)
    {
        var objValues = codes.Cast<object>().ToList();
        var type = typeof(List<object>);
        var methodInfo = type.GetMethod("Contains", new[] { typeof(object) });
        var list = Expression.Constant(objValues);
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