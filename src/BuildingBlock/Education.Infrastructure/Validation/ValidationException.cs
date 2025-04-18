using FluentValidation.Results;
namespace Education.Infrastructure.Validation;

public class ValidationException(ICollection<ValidationFailure> validationFailures) : System.Exception
{
    public readonly ValidationModel ValidationModel = new(validationFailures);
}