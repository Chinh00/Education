using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Education.Infrastructure.Controllers;

[ApiController]
[Route("/api/[controller]")]
public class BaseController : ControllerBase
{
    private ISender _mediator;
    protected ISender Mediator => _mediator ??= HttpContext.RequestServices.GetService<ISender>();
}