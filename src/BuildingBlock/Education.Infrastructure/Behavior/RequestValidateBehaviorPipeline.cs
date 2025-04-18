using Education.Infrastructure.Validation;
using FluentValidation;
using MediatR;
using ValidationException = FluentValidation.ValidationException;

namespace Education.Infrastructure.Behavior;

public class RequestValidateBehaviorPipeline<TRequest, TResponse>(
    ILogger<RequestValidateBehaviorPipeline<TRequest, TResponse>> logger,
    IServiceProvider serviceProvider)
    : IPipelineBehavior<TRequest, TResponse>
{

    public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next, CancellationToken cancellationToken)
    {
        if (request is not IValidation) return await next();

        var modelValidator = serviceProvider.GetRequiredService<IValidator<TRequest>>() ?? throw new NotImplementedException();
        
        var result = await modelValidator.ValidateAsync(request, cancellationToken);

        if (!result.IsValid) throw new ValidationException(result.Errors);
        return await next();

    }
}