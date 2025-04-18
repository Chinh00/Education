using MediatR;

namespace Education.Core.Domain;

public interface IHandler<TRequest, TResponse> : IRequestHandler<TRequest, ResultModel<TResponse>>
    where TRequest : IRequest<ResultModel<TResponse>>
{
    
}
public interface IQuery<TResponse> : IRequest<ResultModel<TResponse>> {}
public interface ICommand<TResponse> : IRequest<TResponse> {}



public interface IListQuery<TResponse> : IQuery<TResponse>
{
    List<FilterModel> Filters { get; set; }
    List<string> Sorts { get; set; }
    List<string> Includes { get; set; }

    int Page { get; set; }
    int PageSize { get; set; }
}

public record FilterModel(string Field, string Operator, string Value);

public interface IQueryRequest<TResponse> : IRequest<ResultModel<TResponse>> {}

public interface ICommandRequest<TResponse> : IRequest<ResultModel<TResponse>> {}

public record ResultModel<TData>(TData Data, bool IsError, string Message)
{
    public static ResultModel<TData> Create(TData data, bool isError = false, string message = default) => new(data, isError, message);
}

public record ListResultModel<TData>(List<TData> Items, long TotalItems, int Page, int PageSize)
{
    public static ListResultModel<TData> Create(List<TData> items, long totalItems, int page, int pageSize) => new(items, totalItems, page, pageSize);
}