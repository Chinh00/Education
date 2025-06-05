using Education.Core.Domain;
using Education.Core.Repository;
using Education.Infrastructure.Authentication;
using MediatR;
using NotificationService.Domain;

namespace NotificationService.AppCore.Usecases.Queries;

public class GetNotificationsQuery : IListQuery<ListResultModel<Notification>>
{
    public List<FilterModel> Filters { get; set; } = [];
    public List<string> Sorts { get; set; } = [];
    public List<string> Includes { get; set; } = [];
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    
    internal class Handler(IMongoRepository<Notification> repository, IClaimContextAccessor claimContextAccessor)
        : IRequestHandler<GetNotificationsQuery, ResultModel<ListResultModel<Notification>>>
    {
        public async Task<ResultModel<ListResultModel<Notification>>> Handle(GetNotificationsQuery request,
            CancellationToken cancellationToken)
        {
            var role = claimContextAccessor.GetRole();
            var userName = claimContextAccessor.GetUsername();
            var spec = new GetNotificationsByRoleSpec(request, role, userName);
            var items = await repository.FindAsync(spec, cancellationToken);
            var totalItems = await repository.CountAsync(spec, cancellationToken);
            return ResultModel<ListResultModel<Notification>>.Create(
                ListResultModel<Notification>.Create(items, totalItems, request.Page, request.PageSize));
        }
    }
}